document.addEventListener("DOMContentLoaded", function () {
  const taskList = document.getElementById("task-list");
  const taskForm = document.getElementById("task-form");
  const taskInput = document.getElementById("task-input");
  const startDateInput = document.getElementById("start-date");
  const endDateInput = document.getElementById("end-date");

  // Fonction pour formater les dates en jj/mm/aaaa
  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Les mois sont indexés à partir de 0
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  // Fonction pour récupérer les tâches depuis l'API
  function fetchTasks() {
    fetch("http://localhost:3000/tasks")
      .then((response) => response.json())
      .then((tasks) => {
        // Trier les tâches par date de début (startDate)
        tasks.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

        taskList.innerHTML = ""; // Nettoyer la liste avant d'ajouter les éléments
        tasks.forEach((task) => {
          const li = document.createElement("li");
          li.innerHTML = `
                        <strong>${task.title}</strong><br>
                        Début: ${formatDate(task.startDate)}<br>
                        Fin: ${formatDate(task.endDate)}
                        <button class="edit-btn" data-id="${
                          task.id
                        }">✏️</button>
                        <button class="delete-btn" data-id="${
                          task.id
                        }">❌</button>
                    `;
          if (task.completed) {
            li.classList.add("completed");
          }
          taskList.appendChild(li);
        });

        // Ajouter les gestionnaires d'événements pour les boutons
        const deleteButtons = document.querySelectorAll(".delete-btn");
        deleteButtons.forEach((button) => {
          button.addEventListener("click", deleteTask);
        });

        const editButtons = document.querySelectorAll(".edit-btn");
        editButtons.forEach((button) => {
          button.addEventListener("click", editTask);
        });
      })
      .catch((error) => {
        console.error("Erreur:", error);
      });
  }

  // Fonction pour ajouter une nouvelle tâche
  function addTask(title, startDate, endDate) {
    fetch("http://localhost:3000/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, startDate, endDate }),
    })
      .then((response) => response.json())
      .then(() => {
        fetchTasks(); // Recharger la liste des tâches pour inclure la nouvelle et la trier
        taskInput.value = ""; // Réinitialiser les champs de saisie
        startDateInput.value = "";
        endDateInput.value = "";
      })
      .catch((error) => {
        console.error("Erreur:", error);
      });
  }

  // Fonction pour supprimer une tâche
  function deleteTask(event) {
    const taskId = event.target.getAttribute("data-id");
    fetch(`http://localhost:3000/tasks/${taskId}`, {
      method: "DELETE",
    })
      .then(() => {
        fetchTasks(); // Recharger la liste après suppression
      })
      .catch((error) => {
        console.error("Erreur:", error);
      });
  }

  // Fonction pour modifier une tâche
  function editTask(event) {
    const taskId = event.target.getAttribute("data-id");
    const taskTitle = prompt("Modifier le titre de la tâche :");
    const taskStartDate = prompt("Modifier la date de début (YYYY-MM-DD) :");
    const taskEndDate = prompt("Modifier la date de fin (YYYY-MM-DD) :");

    if (taskTitle && taskStartDate && taskEndDate) {
      fetch(`http://localhost:3000/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: taskTitle,
          startDate: taskStartDate,
          endDate: taskEndDate,
        }),
      })
        .then(() => {
          fetchTasks(); // Recharger la liste après modification
        })
        .catch((error) => {
          console.error("Erreur:", error);
        });
    }
  }

  // Gestionnaire d'événement pour le formulaire
  taskForm.addEventListener("submit", function (event) {
    event.preventDefault(); // Empêcher le rechargement de la page
    const taskTitle = taskInput.value.trim();
    const startDate = startDateInput.value;
    const endDate = endDateInput.value;
    if (taskTitle && startDate && endDate) {
      addTask(taskTitle, startDate, endDate);
    }
  });

  // Charger les tâches quand la page est prête
  fetchTasks();
});
