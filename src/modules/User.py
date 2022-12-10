# Class User is used to store user information in the session
# It is used by flask-login to store user information in the session
class User:
    def __init__(self, email, urole):
        self.id = email # email is used as the id
        self.urole = urole # user role

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