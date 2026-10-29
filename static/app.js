const form = document.getElementById("student-form");
const table = document.getElementById("students-table");
const message = document.getElementById("message");
const loadingMessage = document.getElementById("loading-message");

async function loadStudents() {
  loadingMessage.textContent = "Loading students...";
  table.replaceChildren();

  try {
    const response = await fetch("/api/students");

    if (!response.ok) {
      throw new Error("Could not retrieve students.");
    }

    const students = await response.json();

    for (const student of students) {
      const row = document.createElement("tr");

      const values = [
        student.student_id,
        student.first_name,
        student.last_name,
        student.email,
        student.created_at ?? "",
      ];

      for (const value of values) {
        const cell = document.createElement("td");
        cell.textContent = value;
        row.appendChild(cell);
      }

      // Actions column
      const actionsCell = document.createElement("td");

      const editButton = document.createElement("button");
      editButton.textContent = "Edit";
      editButton.type = "button";
      editButton.addEventListener("click", () => {
        startEditing(student);
      });

      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      deleteButton.type = "button";
      deleteButton.style.marginLeft = "8px";
      deleteButton.style.background = "#c62828";

      deleteButton.addEventListener("click", () => {
        deleteStudent(student.student_id);
      });

      actionsCell.append(editButton, deleteButton);
      row.appendChild(actionsCell);
      table.appendChild(row);
    }

    loadingMessage.textContent =
      students.length === 0
        ? "No students registered yet."
        : `${students.length} student(s) found.`;
  } catch (error) {
    loadingMessage.textContent = error.message;
  }
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  message.textContent = "Saving student...";

  const student = {
    first_name: form.elements.first_name.value,
    last_name: form.elements.last_name.value,
    email: form.elements.email.value,
  };

  try {
    const response = await fetch("/api/students", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(student),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Could not save student.");
    }

    message.textContent = result.message;
    form.reset();

    await loadStudents();
  } catch (error) {
    message.textContent = error.message;
  }
});

document
  .getElementById("refresh-button")
  .addEventListener("click", loadStudents);

// Load existing records when the page opens
loadStudents();

const editForm = document.getElementById("edit-form");

// Fill the edit form with the selected student's data
function startEditing(student) {
  document.getElementById("edit-student-id").value = student.student_id;

  document.getElementById("edit-first-name").value = student.first_name;

  document.getElementById("edit-last-name").value = student.last_name;

  document.getElementById("edit-email").value = student.email;

  editForm.hidden = false;
  document.getElementById("edit-first-name").focus();
}

// Save the changes
editForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const id = document.getElementById("edit-student-id").value;

  const student = {
    first_name: document.getElementById("edit-first-name").value,
    last_name: document.getElementById("edit-last-name").value,
    email: document.getElementById("edit-email").value,
  };

  try {
    const response = await fetch(`/api/students/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(student),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Update failed.");
    }

    message.textContent = result.message;
    editForm.hidden = true;

    await loadStudents();
  } catch (error) {
    message.textContent = error.message;
  }
});

// Cancel editing
document.getElementById("cancel-edit").addEventListener("click", () => {
  editForm.hidden = true;
});

// Delete a student
async function deleteStudent(id) {
  if (!confirm(`Are you sure you want to delete student #${id}?`)) {
    return;
  }

  try {
    const response = await fetch(`/api/students/${id}`, {
      method: "DELETE",
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Delete failed.");
    }

    message.textContent = result.message;
    await loadStudents();
  } catch (error) {
    message.textContent = error.message;
  }
}
