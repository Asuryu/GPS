// on document ready
$(document).ready(function () {

    const mealTypes = document.getElementById("mealTypes")
    const mealPeriods = document.getElementById("mealPeriods")

    // Making a GET request to the server to get the statistics
    $.ajax({
        url: '/statistics/all',
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            var mealTypesData = data.meal_types // Statistics for meal types
            var mealPeriodsData = data.meal_periods // Statistics for meal periods

            new Chart(mealTypes, {
                type: 'bar',
                data: {
                    labels: ['Peixe', 'Carne', 'Vegetariano'],
                    datasets: [{
                        label: '',
                        data: [mealTypesData.Peixe, mealTypesData.Carne, mealTypesData.Vegetariano],
                        backgroundColor: [ '#ffcf32', '#ff6c32' , '#32ff6c'],
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    },
                    plugins: {
                        legend: {
                           display: false
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

