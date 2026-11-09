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

  document.getElementById("add-section").hidden = true;
  document.getElementById("edit-section").hidden = false;

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
   // editForm.hidden = true;

    document.getElementById("edit-section").hidden = true;
    document.getElementById("add-section").hidden = false;
    await loadStudents();
  } catch (error) {
    message.textContent = error.message;
  }
});

// Cancel editing
document.getElementById("cancel-edit").addEventListener("click", () => {
  editForm.reset();

  document.getElementById("edit-section").hidden = true;
  document.getElementById("add-section").hidden = false;
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



// ==================================
// NAVIGATION BETWEEN SECTIONS
// ==================================

const studentsTab = document.getElementById("students-tab");
const coursesTab = document.getElementById("courses-tab");
const enrollmentsTab = document.getElementById("enrollments-tab");

const studentsSection = document.getElementById("students-section");
const coursesSection = document.getElementById("courses-section");
const enrollmentsSection = document.getElementById("enrollments-section");


studentsTab.addEventListener("click", () => {
    studentsSection.hidden = false;
    coursesSection.hidden = true;
    enrollmentsSection.hidden = true;

    studentsTab.classList.add("active");
    coursesTab.classList.remove("active");
    enrollmentsTab.classList.remove("active");
});


coursesTab.addEventListener("click", () => {
    studentsSection.hidden = true;
    coursesSection.hidden = false;
    enrollmentsSection.hidden = true;

    studentsTab.classList.remove("active");
    coursesTab.classList.add("active");
    enrollmentsTab.classList.remove("active");

    loadCourses();
});


enrollmentsTab.addEventListener("click", () => {
    studentsSection.hidden = true;
    coursesSection.hidden = true;
    enrollmentsSection.hidden = false;

    studentsTab.classList.remove("active");
    coursesTab.classList.remove("active");
    enrollmentsTab.classList.add("active");

    loadEnrollmentOptions();
    loadEnrollments();
});

// ==================================
// COURSES - READ
// ==================================

const coursesTable = document.getElementById("courses-table");
const coursesLoading = document.getElementById("courses-loading");
const courseMessage = document.getElementById("course-message");

async function loadCourses() {
    coursesLoading.textContent = "Loading courses...";
    coursesTable.replaceChildren();

    try {
        const response = await fetch("/api/courses");

        if (!response.ok) {
            throw new Error("Could not retrieve courses.");
        }

        const courses = await response.json();

        for (const course of courses) {
            const row = document.createElement("tr");

            const values = [
                course.course_id,
                course.course_code,
                course.credits,
                course.created_at ?? ""
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
                startEditingCourse(course);
            });

            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";
            deleteButton.type = "button";
            deleteButton.style.marginLeft = "8px";
            deleteButton.style.background = "#c62828";

            deleteButton.addEventListener("click", () => {
                deleteCourse(course.course_id);
            });

            actionsCell.append(editButton, deleteButton);
            row.appendChild(actionsCell);

            coursesTable.appendChild(row);
        }

        coursesLoading.textContent =
            courses.length === 0
                ? "No courses registered yet."
                : `${courses.length} course(s) found.`;

    } catch (error) {
        coursesLoading.textContent = error.message;
    }
}


// ==================================
// COURSES - CREATE
// ==================================

const courseForm = document.getElementById("course-form");

courseForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const course = {
        course_code: document.getElementById("course-code").value,
        credits: document.getElementById("course-credits").value
    };

    try {
        const response = await fetch("/api/courses", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(course)
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || "Could not add course.");
        }

        courseMessage.textContent = result.message;
        courseForm.reset();

        await loadCourses();

    } catch (error) {
        courseMessage.textContent = error.message;
    }
});


// ==================================
// COURSES - UPDATE
// ==================================

const editCourseForm =
    document.getElementById("edit-course-form");

function startEditingCourse(course) {
    document.getElementById("edit-course-id").value =
        course.course_id;

    document.getElementById("edit-course-code").value =
        course.course_code;

    document.getElementById("edit-course-credits").value =
        course.credits;

    document.getElementById("add-course-section").hidden = true;
    document.getElementById("edit-course-section").hidden = false;

    document.getElementById("edit-course-code").focus();
}

editCourseForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const id = document.getElementById("edit-course-id").value;

    const course = {
        course_code: document.getElementById("edit-course-code").value,
        credits: document.getElementById("edit-course-credits").value
    };

    try {
        const response = await fetch(`/api/courses/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(course)
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || "Update failed.");
        }

        courseMessage.textContent = result.message;

        editCourseForm.reset();

        document.getElementById("edit-course-section").hidden = true;
        document.getElementById("add-course-section").hidden = false;

        await loadCourses();

    } catch (error) {
        courseMessage.textContent = error.message;
    }
});


// Cancel course editing
document.getElementById("cancel-course-edit")
    .addEventListener("click", () => {

        editCourseForm.reset();

        document.getElementById("edit-course-section").hidden = true;
        document.getElementById("add-course-section").hidden = false;
    });


// ==================================
// COURSES - DELETE
// ==================================

async function deleteCourse(id) {
    if (!confirm(`Are you sure you want to delete course #${id}?`)) {
        return;
    }

    try {
        const response = await fetch(`/api/courses/${id}`, {
            method: "DELETE"
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || "Delete failed.");
        }

        courseMessage.textContent = result.message;

        await loadCourses();

    } catch (error) {
        courseMessage.textContent = error.message;
    }
}


// Refresh courses
document.getElementById("refresh-courses")
    .addEventListener("click", loadCourses);




         

// ==================================
// ENROLLMENT SEARCH
// ==================================

let enrollmentStudents = [];
let enrollmentCourses = [];


function setupAutocomplete(inputId, resultsId, hiddenId, items, getLabel, getId) {
    const input = document.getElementById(inputId);
    const results = document.getElementById(resultsId);
    const hiddenInput = document.getElementById(hiddenId);

    input.oninput = () => {
        const search = input.value.trim().toLowerCase();

        // Clear the previously selected ID.
        hiddenInput.value = "";
        results.replaceChildren();

        if (!search) {
            return;
        }

        const matches = items.filter(item =>
            getLabel(item).toLowerCase().includes(search)
        );

        matches.forEach(item => {
            const option = document.createElement("button");
            option.type = "button";
            option.textContent = getLabel(item);

            option.addEventListener("click", () => {
                input.value = getLabel(item);
                hiddenInput.value = getId(item);
                results.replaceChildren();
            });

            results.appendChild(option);
        });

        if (matches.length === 0) {
            const message = document.createElement("div");
            message.textContent = "No results found";
            message.style.padding = "10px";
            results.appendChild(message);
        }
    };
}


// ==================================
// LOAD STUDENTS AND COURSES
// ==================================

async function loadEnrollmentOptions() {
    try {
        const [studentsResponse, coursesResponse] = await Promise.all([
            fetch("/api/students"),
            fetch("/api/courses")
        ]);

        if (!studentsResponse.ok || !coursesResponse.ok) {
            throw new Error("Could not load students or courses.");
        }

        enrollmentStudents = await studentsResponse.json();
        enrollmentCourses = await coursesResponse.json();

        // Add Enrollment form
        setupAutocomplete(
            "enrollment-student-search",
            "enrollment-student-results",
            "enrollment-student",
            enrollmentStudents,
            student => `${student.first_name} ${student.last_name}`,
            student => student.student_id
        );

        setupAutocomplete(
            "enrollment-course-search",
            "enrollment-course-results",
            "enrollment-course",
            enrollmentCourses,
            course => course.course_code,
            course => course.course_id
        );

        // Edit Enrollment form
        setupAutocomplete(
            "edit-enrollment-student-search",
            "edit-enrollment-student-results",
            "edit-enrollment-student",
            enrollmentStudents,
            student => `${student.first_name} ${student.last_name}`,
            student => student.student_id
        );

        setupAutocomplete(
            "edit-enrollment-course-search",
            "edit-enrollment-course-results",
            "edit-enrollment-course",
            enrollmentCourses,
            course => course.course_code,
            course => course.course_id
        );

    } catch (error) {
        console.error("Error loading enrollment options:", error);
    }
}

// ==================================
// ENROLLMENTS - READ
// ==================================

const enrollmentsTable = document.getElementById("enrollments-table");
const enrollmentsLoading = document.getElementById("enrollments-loading");
const enrollmentMessage = document.getElementById("enrollment-message");

async function loadEnrollments() {
    enrollmentsLoading.textContent = "Loading enrollments...";
    enrollmentsTable.replaceChildren();

    try {
        const response = await fetch("/api/enrollments");

        if (!response.ok) {
            throw new Error("Could not retrieve enrollments.");
        }

        const enrollments = await response.json();

        for (const enrollment of enrollments) {
            const row = document.createElement("tr");

            const values = [
                enrollment.enrollments_id,
                `${enrollment.first_name} ${enrollment.last_name}`,
                enrollment.course_code,
                enrollment.registration_date
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
                startEditingEnrollment(enrollment);
            });

            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";
            deleteButton.type = "button";
            deleteButton.style.marginLeft = "8px";
            deleteButton.style.background = "#c62828";

            deleteButton.addEventListener("click", () => {
                deleteEnrollment(enrollment.enrollments_id);
            });

            actionsCell.append(editButton, deleteButton);
            row.appendChild(actionsCell);

            enrollmentsTable.appendChild(row);
        }

        enrollmentsLoading.textContent =
            enrollments.length === 0
                ? "No enrollments registered yet."
                : `${enrollments.length} enrollment(s) found.`;

    } catch (error) {
        enrollmentsLoading.textContent = error.message;
    }
}


// ==================================
// ENROLLMENTS - CREATE
// ==================================

const enrollmentForm = document.getElementById("enrollment-form");

enrollmentForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const enrollment = {
        student_id: document.getElementById("enrollment-student").value,
        course_id: document.getElementById("enrollment-course").value,
        registration_date: document.getElementById("registration-date").value
    };

    try {
        const response = await fetch("/api/enrollments", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(enrollment)
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || "Could not create enrollment.");
        }

        enrollmentMessage.textContent = result.message;
        enrollmentForm.reset();

        await loadEnrollments();

    } catch (error) {
        enrollmentMessage.textContent = error.message;
    }
});


// ==================================
// ENROLLMENTS - UPDATE
// ==================================

const editEnrollmentForm =
    document.getElementById("edit-enrollment-form");

function startEditingEnrollment(enrollment) {
    document.getElementById("edit-enrollment-id").value =
        enrollment.enrollments_id;

    document.getElementById("edit-enrollment-student-search").value =
        `${enrollment.first_name} ${enrollment.last_name}`;

    document.getElementById("edit-enrollment-student").value =
        enrollment.student_id;

    document.getElementById("edit-enrollment-course-search").value =
        enrollment.course_code;

    document.getElementById("edit-enrollment-course").value =
        enrollment.course_id;

    document.getElementById("edit-registration-date").value =
        enrollment.registration_date;

    document.getElementById("add-enrollment-section").hidden = true;
    document.getElementById("edit-enrollment-section").hidden = false;
}

editEnrollmentForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const id = document.getElementById("edit-enrollment-id").value;

    const enrollment = {
        student_id: document.getElementById("edit-enrollment-student").value,
        course_id: document.getElementById("edit-enrollment-course").value,
        registration_date: document.getElementById("edit-registration-date").value
    };

    try {
        const response = await fetch(`/api/enrollments/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(enrollment)
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || "Update failed.");
        }

        enrollmentMessage.textContent = result.message;

        editEnrollmentForm.reset();

        document.getElementById("edit-enrollment-section").hidden = true;
        document.getElementById("add-enrollment-section").hidden = false;

        await loadEnrollments();

    } catch (error) {
        enrollmentMessage.textContent = error.message;
    }
});


// Cancel editing
document.getElementById("cancel-enrollment-edit")
    .addEventListener("click", () => {

        editEnrollmentForm.reset();

        document.getElementById("edit-enrollment-section").hidden = true;
        document.getElementById("add-enrollment-section").hidden = false;
    });


// ==================================
// ENROLLMENTS - DELETE
// ==================================

async function deleteEnrollment(id) {
    if (!confirm(`Are you sure you want to delete enrollment #${id}?`)) {
        return;
    }

    try {
        const response = await fetch(`/api/enrollments/${id}`, {
            method: "DELETE"
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || "Delete failed.");
        }

        enrollmentMessage.textContent = result.message;

        await loadEnrollments();

    } catch (error) {
        enrollmentMessage.textContent = error.message;
    }
}


// Refresh enrollments
document.getElementById("refresh-enrollments")
    .addEventListener("click", loadEnrollments);

