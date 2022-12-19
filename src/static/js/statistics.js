// on document ready
$(document).ready(function () {

    const mealTypes = document.getElementById("mealTypes")
    const mealPeriods = document.getElementById("mealPeriods")
    const mealWeekdays = document.getElementById("mealWeekdays")

    // Making a GET request to the server to get the statistics
    $.ajax({
        url: '/statistics/all',
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            var mealTypesData = data.meal_types // Statistics for meal types
            var mealPeriodsData = data.meal_periods // Statistics for meal periods
            var mealWeekdaysData = data.meal_weekdays // Statistics for meal periods

            new Chart(mealTypes, {
                type: 'bar',
                data: {
                    labels: ['Fish', 'Meat', 'Vegetarian'],
                    datasets: [{
                        label: '',
                        data: [mealTypesData.Peixe, mealTypesData.Carne, mealTypesData.Vegetariano],
                        backgroundColor: [ 'rgb(115, 180, 255)', '#ff6c32' , '#32ff6c'],
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
                    labels: ['Lunch', 'Dinner'],
                    datasets: [{
                        label: 'Meal Periods',
                        data: [mealPeriodsData["Almoço"], mealPeriodsData.Jantar],
                        backgroundColor: [ 'rgb(157, 115, 255)', '#ff73b9'],
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

            new Chart(mealWeekdays, {
                type: 'doughnut',
                data: {
                    labels: ['Monday', 'Tuesday', 'Wednesady', 'Thursday', 'Friday'],
                    datasets: [{
                        label: 'Meal Periods',
                        data: [mealWeekdaysData["Segunda-Feira"], mealWeekdaysData["Terça-Feira"], mealWeekdaysData["Quarta-Feira"], mealWeekdaysData["Quinta-Feira"], mealWeekdaysData["Sexta-Feira"]],
                        backgroundColor: ['#F79256', '#FBD1A2', '#7DCFB6', '#00B2CA', '#1D4E89'],
                    }]
                }
            })
        }
    })
})

