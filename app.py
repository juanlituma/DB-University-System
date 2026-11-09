
from flask import Flask, render_template, request, jsonify
import sqlite3
from pathlib import Path

app = Flask(__name__)

# Database file in the same folder as app.py
DATABASE = Path(r"C:\Users\juani\Projects\University-system\Database\DBUniversity.db")


def get_db_connection():
    connection = sqlite3.connect(DATABASE, timeout=10)
    connection.row_factory = sqlite3.Row
    connection.execute("PRAGMA foreign_keys = ON")
    return connection

@app.route("/")
def home():
    return render_template("index.html")


# Retrieve all existing students
@app.route("/api/students", methods=["GET"])
def get_students():
    with get_db_connection() as connection:
        students = connection.execute(
            """
            SELECT student_id, first_name, last_name, email, created_at
            FROM Students
            ORDER BY student_id DESC
            """
        ).fetchall()

    return jsonify([dict(student) for student in students])


# Add a new student
@app.route("/api/students", methods=["POST"])
def add_student():
    data = request.get_json(silent=True) or {}

    first_name = data.get("first_name", "").strip()
    last_name = data.get("last_name", "").strip()
    email = data.get("email", "").strip()

    if not first_name or not last_name or not email:
        return jsonify({
            "error": "All fields are required."
        }), 400

    try:
        with get_db_connection() as connection:
            cursor = connection.execute(
                """
                INSERT INTO Students
                    (first_name, last_name, email, created_at)
                VALUES (?, ?, ?, CURRENT_TIMESTAMP)
                """,
                (first_name, last_name, email)
            )

            student_id = cursor.lastrowid

        return jsonify({
            "message": "Student added successfully.",
            "student_id": student_id
        }), 201

    except sqlite3.IntegrityError:
        return jsonify({
            "error": "This email may already be registered."
        }), 409



# Update an existing student
@app.route("/api/students/<int:student_id>", methods=["PUT"])
def update_student(student_id):
    data = request.get_json(silent=True) or {}

    first_name = data.get("first_name", "").strip()
    last_name = data.get("last_name", "").strip()
    email = data.get("email", "").strip()

    if not first_name or not last_name or not email:
        return jsonify({"error": "All fields are required."}), 400

    try:
        with get_db_connection() as connection:
            cursor = connection.execute(
                """
                UPDATE Students
                SET first_name = ?, last_name = ?, email = ?
                WHERE student_id = ?
                """,
                (first_name, last_name, email, student_id)
            )

            if cursor.rowcount == 0:
                return jsonify({"error": "Student not found."}), 404

        return jsonify({"message": "Student updated successfully."})

    except sqlite3.IntegrityError:
        return jsonify({
            "error": "That email is already registered to another student."
        }), 409


# Delete an existing student
@app.route("/api/students/<int:student_id>", methods=["DELETE"])
def delete_student(student_id):
    with get_db_connection() as connection:
        cursor = connection.execute(
            "DELETE FROM Students WHERE student_id = ?",
            (student_id,)
        )

        if cursor.rowcount == 0:
            return jsonify({"error": "Student not found."}), 404

    return jsonify({"message": "Student deleted successfully."})





# ==================================
# COURSES - READ
# ==================================

@app.route("/api/courses", methods=["GET"])
def get_courses():
    with get_db_connection() as connection:
        courses = connection.execute(
            """
            SELECT course_id, course_code, credits, created_at
            FROM Courses
            ORDER BY course_id DESC
            """
        ).fetchall()

    return jsonify([dict(course) for course in courses])


# ==================================
# COURSES - CREATE
# ==================================

@app.route("/api/courses", methods=["POST"])
def add_course():
    data = request.get_json(silent=True) or {}

    course_code = data.get("course_code", "").strip()
    credits = data.get("credits")

    if not course_code or credits is None or str(credits).strip() == "":
        return jsonify({"error": "All fields are required."}), 400

    try:
        credits = int(credits)

        if credits < 0:
            return jsonify({"error": "Credits must be greater or equal than zero."}), 400

        with get_db_connection() as connection:
            cursor = connection.execute(
                """
                INSERT INTO Courses (course_code, credits, created_at)
                VALUES (?, ?, CURRENT_TIMESTAMP)
                """,
                (course_code, credits)
            )

            course_id = cursor.lastrowid

        return jsonify({
            "message": "Course added successfully.",
            "course_id": course_id
        }), 201

    except ValueError:
        return jsonify({"error": "Credits must be a valid number."}), 400

    except sqlite3.IntegrityError:
        return jsonify({"error": "This course code already exists."}), 409


# ==================================
# COURSES - UPDATE
# ==================================

@app.route("/api/courses/<int:course_id>", methods=["PUT"])
def update_course(course_id):
    data = request.get_json(silent=True) or {}

    course_code = data.get("course_code", "").strip()
    credits = data.get("credits")

    if not course_code or credits is None or str(credits).strip() == "":
        return jsonify({"error": "All fields are required."}), 400

    try:
        credits = int(credits)

        if credits < 0:
            return jsonify({"error": "Credits must be greater or equal than zero."}), 400

        with get_db_connection() as connection:
            cursor = connection.execute(
                """
                UPDATE Courses
                SET course_code = ?, credits = ?
                WHERE course_id = ?
                """,
                (course_code, credits, course_id)
            )

            if cursor.rowcount == 0:
                return jsonify({"error": "Course not found."}), 404

        return jsonify({"message": "Course updated successfully."})

    except ValueError:
        return jsonify({"error": "Credits must be a valid number."}), 400

    except sqlite3.IntegrityError:
        return jsonify({"error": "This course code already exists."}), 409


# ==================================
# COURSES - DELETE
# ==================================

@app.route("/api/courses/<int:course_id>", methods=["DELETE"])
def delete_course(course_id):
    with get_db_connection() as connection:
        cursor = connection.execute(
            "DELETE FROM Courses WHERE course_id = ?",
            (course_id,)
        )

        if cursor.rowcount == 0:
            return jsonify({"error": "Course not found."}), 404

    return jsonify({"message": "Course deleted successfully."})



# ==================================
# ENROLLMENTS - READ
# ==================================

@app.route("/api/enrollments", methods=["GET"])
def get_enrollments():
    with get_db_connection() as connection:
        enrollments = connection.execute(
            """
            SELECT
                E.enrollments_id,
                E.student_id,
                E.course_id,
                E.registration_date,
                S.first_name,
                S.last_name,
                C.course_code
            FROM Enrollments E
            JOIN Students S ON E.student_id = S.student_id
            JOIN Courses C ON E.course_id = C.course_id
            ORDER BY E.enrollments_id DESC
            """
        ).fetchall()

    return jsonify([dict(enrollment) for enrollment in enrollments])



@app.route("/api/enrollments", methods=["POST"])
def add_enrollment():
    data = request.get_json(silent=True) or {}

    student_id = data.get("student_id")
    course_id = data.get("course_id")
    registration_date = data.get("registration_date", "").strip()

    if not student_id or not course_id or not registration_date:
        return jsonify({"error": "All fields are required."}), 400

    try:
        student_id = int(student_id)
        course_id = int(course_id)

        with get_db_connection() as connection:

            # Prevent duplicate enrollments
            existing = connection.execute(
                """
                SELECT enrollments_id
                FROM Enrollments
                WHERE student_id = ? AND course_id = ?
                """,
                (student_id, course_id)
            ).fetchone()

            if existing:
                return jsonify({
                    "error": "This student is already enrolled in this course."
                }), 409

            cursor = connection.execute(
                """
                INSERT INTO Enrollments
                    (student_id, course_id, registration_date)
                VALUES (?, ?, ?)
                """,
                (student_id, course_id, registration_date)
            )

            enrollment_id = cursor.lastrowid

        return jsonify({
            "message": "Enrollment created successfully.",
            "enrollments_id": enrollment_id
        }), 201

    except ValueError:
        return jsonify({"error": "Invalid student or course ID."}), 400

    except sqlite3.IntegrityError:
        return jsonify({
            "error": "The selected student or course does not exist."
        }), 400



@app.route("/api/enrollments/<int:enrollment_id>", methods=["PUT"])
def update_enrollment(enrollment_id):
    data = request.get_json(silent=True) or {}

    student_id = data.get("student_id")
    course_id = data.get("course_id")
    registration_date = data.get("registration_date", "").strip()

    if not student_id or not course_id or not registration_date:
        return jsonify({"error": "All fields are required."}), 400

    try:
        student_id = int(student_id)
        course_id = int(course_id)

        with get_db_connection() as connection:

            existing = connection.execute(
                """
                SELECT enrollments_id
                FROM Enrollments
                WHERE student_id = ?
                AND course_id = ?
                AND enrollments_id != ?
                """,
                (student_id, course_id, enrollment_id)
            ).fetchone()

            if existing:
                return jsonify({
                    "error": "This student is already enrolled in this course."
                }), 409

            cursor = connection.execute(
                """
                UPDATE Enrollments
                SET student_id = ?,
                    course_id = ?,
                    registration_date = ?
                WHERE enrollments_id = ?
                """,
                (student_id, course_id, registration_date, enrollment_id)
            )

            if cursor.rowcount == 0:
                return jsonify({"error": "Enrollment not found."}), 404

        return jsonify({"message": "Enrollment updated successfully."})

    except ValueError:
        return jsonify({"error": "Invalid student or course ID."}), 400

    except sqlite3.IntegrityError:
        return jsonify({
            "error": "The selected student or course does not exist."
        }), 400



@app.route("/api/enrollments/<int:enrollment_id>", methods=["DELETE"])
def delete_enrollment(enrollment_id):
    with get_db_connection() as connection:
        cursor = connection.execute(
            """
            DELETE FROM Enrollments
            WHERE enrollments_id = ?
            """,
            (enrollment_id,)
        )

        if cursor.rowcount == 0:
            return jsonify({"error": "Enrollment not found."}), 404

    return jsonify({"message": "Enrollment deleted successfully."})


if __name__ == "__main__":
    app.run(debug=True)
