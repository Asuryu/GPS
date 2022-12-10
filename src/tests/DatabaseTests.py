import unittest
from modules.database_helpers import *

class DatabaseTests(unittest.TestCase):
    def test_get_menu(self):
        period = "Almoço"
        type = "Peixe"
        result = get_menu(period, type)
        expectedResult = [
            (2, 'Marisco', 'Marisco com arroz de feijão vermelho', 'Almoço', 'Peixe'),
            (12, 'Atum com Natas', 'O bacalhau estava caro portanto: atum', 'Almoço', 'Peixe'),
            (14, 'Dourada Fumada', 'Assim como o presunto, esta dourada foi fumada', 'Almoço', 'Peixe'),
            (15, 'Hamburguer', 'Hamburguer feito à base de peixe', 'Almoço', 'Peixe'),
            (19, 'Espetada de Peixe Espada', 'Espetada de carne só que com peixe', 'Almoço', 'Peixe')
        ]
        self.assertEqual(result, expectedResult)
        

    def test_get_user_intents(self):
        email = "admin@isec.pt"
        result = get_user_intents(email)
        expectedResult = [
            (25, 'admin@isec.pt', 12),
            (26, 'admin@isec.pt', 9),
            (27, 'admin@isec.pt', 11),
            (28, 'admin@isec.pt', 17),
            (29, 'admin@isec.pt', 25),
            (30, 'admin@isec.pt', 16),
            (34, 'admin@isec.pt', 8)
        ]
        self.assertEqual(result, expectedResult)

    def test_register_meal_intention(self):
        email = "admin@isec.pt"
        meal_id = 10
        result = register_meal_intention(email, meal_id)
        self.assertTrue(result)

    def test_delete_meal_intention(self):
        email = "admin@isec.pt"
        meal_id = 10
        result = delete_meal_intention(email, meal_id)
        self.assertTrue(result, True)

    def test_update_user_role(self):
        email = "admin@isec.pt"
        role = "user"
        result = update_user_role(email, role)
        self.assertTrue(result, True)

    def test_get_user_by_email(self):
        email = "admin@isec.pt"
        result = get_user_by_email(email)
        expectedResult = ('admin@isec.pt', 'user', '$2b$12$bAnNrSYnvorH4vaQj4fFiO/4/UF81oMrzUZVU6tfHnCqKRtB5fkBy')
        self.assertEqual(result, expectedResult)

    def test_update_menu_item(self):
        meal_id = 2
        name = "Marisco"
        description = "Marisco com arroz de feijão vermelho"
        result = update_menu_item(meal_id, name, description)
        self.assertTrue(result, True)

if __name__ == '__main__':
    unittest.main()