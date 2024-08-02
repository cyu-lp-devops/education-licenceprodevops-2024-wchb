const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

let tasks = [];

// Route pour récupérer toutes les tâches
app.get("/tasks", (req, res) => {
  res.json(tasks);
});

// Route pour ajouter une nouvelle tâche
app.post("/tasks", (req, res) => {
  const task = {
    id: tasks.length + 1,
    title: req.body.title,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    completed: false,
  };
  tasks.push(task);
  res.status(201).json(task);
});

// Route pour mettre à jour une tâche existante
app.put("/tasks/:id", (req, res) => {
  const taskId = parseInt(req.params.id);
  const task = tasks.find((t) => t.id === taskId);

  if (task) {
    task.title = req.body.title || task.title;
    task.startDate = req.body.startDate || task.startDate;
    task.endDate = req.body.endDate || task.endDate;
    task.completed =
      req.body.completed !== undefined ? req.body.completed : task.completed;
    res.json(task);
  } else {
    res.status(404).json({ error: "Tâche non trouvée" });
  }
});

// Route pour supprimer une tâche
app.delete("/tasks/:id", (req, res) => {
  const taskId = parseInt(req.params.id);
  tasks = tasks.filter((t) => t.id !== taskId);
  res.status(204).send();
});

app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});
