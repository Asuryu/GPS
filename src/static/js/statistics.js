// on document ready
$(document).ready(function () {

    const mealTypes = document.getElementById("mealTypes")
    const mealPeriods = document.getElementById("mealPeriods")

    $.ajax({
        url: '/statistics/all',
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            var mealTypesData = data.meal_types
            var mealPeriodsData = data.meal_periods

            new Chart(mealTypes, {
                type: 'bar',
                data: {
                    labels: ['Peixe', 'Carne', 'Vegetariano'],
                    datasets: [{
                        label: 'Meal Types',
                        data: [mealTypesData.Peixe, mealTypesData.Carne, mealTypesData.Vegetariano],
                        backgroundColor: [ '#ffcf32', '#ff6c32' , '#32ff6c'],
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            })

            new Chart(mealPeriods, {
                type: 'pie',
                data: {
                    labels: ['Almoço', 'Jantar'],
                    datasets: [{
                        label: 'Meal Periods',
                        data: [mealPeriodsData["Almoço"], mealPeriodsData.Jantar],
                        backgroundColor: [ 'rgb(157, 115, 255)', 'rgb(115, 180, 255)'],
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            })
        }
    })
})

