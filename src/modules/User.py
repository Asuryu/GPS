class User:
    def __init__(self, email, urole):
        self.id = email
        self.urole = urole

    def __repr__(self):
        return "%s (%s)" % (self.id, self.urole)

    def get_id(self):
        return self.id

    def is_authenticated(self):
        return True

    def is_active(self):
        return True

    def is_anonymous(self):
        return False