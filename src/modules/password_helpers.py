import bcrypt

def hash_password(password):
    bytes = password.encode('utf-8')
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(bytes, salt).decode('utf-8')

def check_password(password, hashed_password):
    bytes = password.encode('utf-8')
    return bcrypt.checkpw(bytes, hashed_password.encode('utf-8'))