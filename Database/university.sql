DROP TABLE IF EXISTS Enrollments;
DROP TABLE IF EXISTS Students;
DROP TABLE IF EXISTS Courses;


CREATE TABLE Courses(
	course_id INTEGER PRIMARY KEY, 
	course_code VARCHAR(10) UNIQUE NOT NULL,
	credits INTEGER NOT NULL,
	created_at TIMESTAMP
);

CREATE TABLE Enrollments(
	enrollments_id INTEGER PRIMARY KEY,
	student_id INTEGER NOT NULL,
	course_id INTEGER NOT NULL,
	registration_date TEXT NOT NULL,
	FOREIGN KEY (student_id) REFERENCES Students(student_id),
	FOREIGN KEY (course_id) REFERENCES Courses(student_id)
	);
	
CREATE TABLE Students (
	student_id	INTEGER PRIMARY KEY,
	first_name 	VARCHAR(50) NOT NULL,
	last_name 	VARCHAR(50) NOT NULL,
	email		VARCHAR(100) UNIQUE NOT NULL,
	created_at  TIMESTAMP
);