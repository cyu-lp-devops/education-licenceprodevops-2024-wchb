const express = require("express");
const cors = require("cors");
const fs = require("fs");
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const DATA_FILE = "tasks.json";

// Fonction pour lire les tâches depuis le fichier JSON
function readTasks() {
  try {
    const data = fs.readFileSync(DATA_FILE, "utf8");
    return JSON.parse(data);
  } catch (err) {
    // Retourner un tableau vide si le fichier n'existe pas ou est corrompu
    return [];
  }
}

// Fonction pour écrire les tâches dans le fichier JSON
function writeTasks(tasks) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(tasks, null, 2));
}

// GET - Récupérer toutes les tâches
app.get("/tasks", (req, res) => {
  const tasks = readTasks();
  res.json(tasks);
});

// POST - Ajouter une nouvelle tâche
app.post("/tasks", (req, res) => {
  const tasks = readTasks();
  const newTask = {
    id: tasks.length + 1,
    title: req.body.title,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    completed: false,
  };
  tasks.push(newTask);
  writeTasks(tasks);
  res.status(201).json(newTask);
});

// PUT - Modifier une tâche existante
app.put("/tasks/:id", (req, res) => {
  const tasks = readTasks();
  const taskId = parseInt(req.params.id);
  const taskIndex = tasks.findIndex((task) => task.id === taskId);

  if (taskIndex !== -1) {
    tasks[taskIndex] = {
      ...tasks[taskIndex],
      ...req.body,
    };
    writeTasks(tasks);
    res.json(tasks[taskIndex]);
  } else {
    res.status(404).json({ message: "Tâche non trouvée" });
  }
});

// DELETE - Supprimer une tâche
app.delete("/tasks/:id", (req, res) => {
  const tasks = readTasks();
  const taskId = parseInt(req.params.id);
  const filteredTasks = tasks.filter((task) => task.id !== taskId);

  if (filteredTasks.length !== tasks.length) {
    writeTasks(filteredTasks);
    res.status(204).end();
  } else {
    res.status(404).json({ message: "Tâche non trouvée" });
  }
});

app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
