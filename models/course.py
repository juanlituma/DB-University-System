class Course:
    def __init__(self, course_id, course_code, credits, created_at=None):
        self.course_id = course_id
        self.course_code = course_code
        self.credits = credits
        self.created_at = created_at

    def to_dict(self):
        return {
            "course_id": self.course_id,
            "course_code": self.course_code,
            "credits": self.credits,
            "created_at": self.created_at
        }