import unittest
from password_helpers import *

class LoginTests(unittest.TestCase):
    def test_hash_password(self):
        password = 'admin'
        result = hash_password(password)
        self.assertTrue(result, "$2b$12$bAnNrSYnvorH4vaQj4fFiO/4/UF81oMrzUZVU6tfHnCqKRtB5fkBy")

    def test_check_password(self):
        password_hash = 'admin'
        password = "$2b$12$bAnNrSYnvorH4vaQj4fFiO/4/UF81oMrzUZVU6tfHnCqKRtB5fkBy"
        result = check_password(password_hash, password)
        self.assertTrue(result, True)
        

if __name__ == '__main__':
    unittest.main()