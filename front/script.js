document.addEventListener("DOMContentLoaded", function () {
  const taskList = document.getElementById("task-list");
  const taskForm = document.getElementById("task-form");
  const taskInput = document.getElementById("task-input");
  const startDateInput = document.getElementById("start-date");
  const endDateInput = document.getElementById("end-date");

  // Références pour la fenêtre pop-up
  const editPopup = document.getElementById("edit-popup");
  const editForm = document.getElementById("edit-form");
  const editTaskTitle = document.getElementById("edit-task-title");
  const editStartDate = document.getElementById("edit-start-date");
  const editEndDate = document.getElementById("edit-end-date");
  let currentTaskId = null;

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
          button.addEventListener("click", openEditPopup);
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

  // Fonction pour ouvrir la fenêtre pop-up de modification
  function openEditPopup(event) {
    const taskId = event.target.getAttribute("data-id");
    const taskItem = event.target.closest("li");
    const title = taskItem.querySelector("strong").textContent;
    const startDate = taskItem
      .querySelector("br:nth-child(2)")
      .nextSibling.textContent.split(": ")[1];
    const endDate = taskItem
      .querySelector("br:nth-child(3)")
      .nextSibling.textContent.split(": ")[1];

    // Remplir les champs du formulaire avec les valeurs actuelles
    editTaskTitle.value = title;

    // Convertir la date de format jj/mm/aaaa à aaaa-mm-jj (format ISO pour les champs de type date)
    const [startDay, startMonth, startYear] = startDate.split("/");
    const [endDay, endMonth, endYear] = endDate.split("/");

    const isoStartDate = `${startYear}-${startMonth}-${startDay}`;
    const isoEndDate = `${endYear}-${endMonth}-${endDay}`;

    editStartDate.value = isoStartDate;
    editEndDate.value = isoEndDate;

    // Stocker l'ID de la tâche en cours de modification
    currentTaskId = taskId;

    // Afficher la pop-up
    editPopup.style.display = "flex";
  }

  // Fonction pour fermer la fenêtre pop-up
  function closeEditPopup() {
    editPopup.style.display = "none";
    currentTaskId = null;
  }

  // Fonction pour soumettre les modifications de la tâche
  editForm.addEventListener("submit", function (event) {
    event.preventDefault();

    if (currentTaskId) {
      fetch(`http://localhost:3000/tasks/${currentTaskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: editTaskTitle.value,
          startDate: editStartDate.value,
          endDate: editEndDate.value,
        }),
      })
        .then(() => {
          fetchTasks(); // Recharger la liste après modification
          closeEditPopup(); // Fermer la pop-up
        })
        .catch((error) => {
          console.error("Erreur:", error);
        });
    }
  });

  // Gestionnaire d'événement pour fermer la pop-up lorsque l'utilisateur clique sur la croix
  document
    .querySelector(".close-btn")
    .addEventListener("click", closeEditPopup);

  // Gestionnaire d'événement pour le formulaire d'ajout de tâche
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
