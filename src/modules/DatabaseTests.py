import unittest
from database_helpers import *

class DatabaseTests(unittest.TestCase):
    def test_get_menu(self):
        period = "Almoço"
        type = "Peixe"
        result = get_menu(period, type)
        expectedResult = [
            ()
        ]
        self.assertTrue(result, expectedResult)
        

if __name__ == '__main__':
    unittest.main()