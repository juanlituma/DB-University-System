--Can be run only once
INSERT INTO Students (student_id, first_name,last_name, email,created_at)
VALUES
	(1,'Juan','Lituma','Juanexample3@gmail.com','2026-10-26 18:40:16'),
	(2,'Alvin','Briany','BrianyBe4@gmail.com','2026-10-26 18:40:16'),
	(3,'Stella','Souly','Souly.Stella@gmail.com','2026-10-26 18:40:16'),
	(4,'Marco','Almara','exAlAl66@outlook.com','2026-10-26 18:40:16'),
	(5,'Tamara','Flores','Florespl7@gmailcom','2026-10-26 18:40:16');
	
	
INSERT INTO Courses (course_id,course_code,credits,created_at)
VALUES
	(1,'AAA111',3,'2026-10-26 18:40:16'),
	(2,'AAA112',4,'2026-10-29 18:40:16'),
	(3,'AAA113',2,'2026-10-30 18:40:16'),
	(4,'AAA114',3,'2026-10-30 18:40:16'),
	(5,'AAA115',0,'2026-10-30 18:40:16');	

INSERT INTO Enrollments (enrollments_id,student_id,course_id, registration_date)
VALUES
	(1,1,2,'2026-08-01'),
	(2,2,1,'2026-08-02'),
	(3,3,1,'2026-08-06'),
	(4,3,5,'2026-08-06'),
	(5,4,5,'2026-08-08'),
	
	(6,5,5,'2026-08-10'),
	(7,1,1,'2026-08-13'),
	(8,2,5,'2026-08-16'),
	(9,5,2,'2026-08-16'),
	(10,4,2,'2026-08-20'),
	
	(11,3,2,'2026-08-20'),
	(12,5,1,'2026-08-22'),
	(13,2,3,'2026-08-25'),
	(14,1,4,'2026-08-26'),
	(15,5,3,'2026-08-27');
	