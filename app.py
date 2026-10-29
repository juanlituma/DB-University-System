
from flask import Flask, render_template, request, jsonify
import sqlite3
from pathlib import Path

app = Flask(__name__)

# Database file in the same folder as app.py
DATABASE = Path(r"C:\Users\juani\Projects\University-system\Database\DBUniversity.db")


def get_db_connection():
    connection = sqlite3.connect(DATABASE)
    connection.row_factory = sqlite3.Row
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


if __name__ == "__main__":
    app.run(debug=True)
