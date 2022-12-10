import unittest
from modules.statistics_helpers import *

class StatisticTests(unittest.TestCase):
    def test_generate_statistics_for_meal_types(self):
        result = generate_statistics_for_meal_types()
        self.assertEqual(result, {'Peixe': 3, 'Carne': 2, 'Vegetariano': 3})

    def test_generate_statistics_for_meal_periods(self):
        result = generate_statistics_for_meal_periods()
        self.assertEqual(result, {'Almoço': 5, 'Jantar': 3})

    def test_generate_statistics_for_meal_weekdays(self):
        result = generate_statistics_for_meal_weekdays()
        self.assertEqual(result, {'Segunda-Feira': 2, 'Terça-Feira': 2, 'Quarta-Feira': 1, 'Quinta-Feira': 2, 'Sexta-Feira': 1})

if __name__ == '__main__':
    unittest.main()