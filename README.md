# DB-University-System
# University Management System

A simple University Management System built with Python, Flask, SQLite, HTML, CSS, and JavaScript. The application allows users to manage students, courses, and student enrollments through a web interface.

## Features

- **Students:** Create, view, update, and delete student records.
- **Courses:** Create, view, update, and delete courses.
- **Enrollments:** Register students in courses, view enrollment records, update registrations, and delete enrollments.
- **Search:** Search for students and courses when creating or editing enrollments.
- **Database Relationships:** Uses a many-to-many relationship between Students and Courses through the Enrollments table.

## Technologies Used

- Python
- Flask
- SQLite
- HTML
- CSS
- JavaScript

## Project Structure

```text
Repository/
│
├── app.py
├── Database/
|   |   students.db
|
├── models/
│   ├── __init__.py
│   ├── student.py
│   ├── course.py
│   └── enrollment.py
|
├── templates/
│   └── index.html
│
└── static/
    ├── style.css
    └── app.js
```

## Requirements

Before running the project, make sure you have installed:

- Python 3.10 or later
- Git
- pip (Python package installer)

## Installation and Setup

### 1. Open the directory

Navigate into the project directory:

```bash
cd University-system
```

### 2. Create a Virtual Environment

Create a Python virtual environment:

**Windows:**

```bash
python -m venv .venv
```

Activate it:

```bash
.venv\Scripts\activate
```

**macOS / Linux:**

```bash
python3 -m venv .venv
```

Activate it:

```bash
source .venv/bin/activate
```

### 3. Install Dependencies

Install Flask:

```bash
pip install Flask
```


### 4. Run the Application

Start the Flask development server:

```bash
python app.py
```

Open your browser and navigate to:

```text
http://127.0.0.1:5000
```

The University Management System should now be running.


## 5. Stop the Application

To stop the Flask development server, press:

```text
CTRL + C
```

You can deactivate the virtual variable with:

```bash
deactivate
```
