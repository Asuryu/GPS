import bcrypt

# Hash a password for the first time, with a randomly-generated salt
def hash_password(password):
    bytes = password.encode('utf-8')
    salt = bcrypt.gensalt() # Generate a salt
    return bcrypt.hashpw(bytes, salt).decode('utf-8') # Hash the password and decode it from bytes to string

# Check that an unhashed password matches one that has previously been
def check_password(password, hashed_password):
    bytes = password.encode('utf-8')
    return bcrypt.checkpw(bytes, hashed_password.encode('utf-8')) # Check that the password matches the hash