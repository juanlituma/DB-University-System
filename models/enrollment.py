class Enrollment:
    def __init__(
        self,
        enrollments_id,
        student_id,
        course_id,
        registration_date,
        first_name=None,
        last_name=None,
        course_code=None
    ):
        self.enrollments_id = enrollments_id
        self.student_id = student_id
        self.course_id = course_id
        self.registration_date = registration_date
        self.first_name = first_name
        self.last_name = last_name
        self.course_code = course_code

    def to_dict(self):
        return {
            "enrollments_id": self.enrollments_id,
            "student_id": self.student_id,
            "course_id": self.course_id,
            "registration_date": self.registration_date,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "course_code": self.course_code
        }