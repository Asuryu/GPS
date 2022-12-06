google.charts.load('current', { 'packages': ['corechart'] });
google.charts.setOnLoadCallback(drawChart);
function drawChart() {
	var dataMealChoice = google.visualization.arrayToDataTable([
		['Tipo', 'Nº de pessoas'],
		['Carne', 150],
		['Peixe', 30],
		['Vegetariano', 5]
	]);
	var options = {
		title: 'Tipos de Refeição escolhidas'
	};
	var chart = new google.visualization.PieChart(document.getElementById('tipos'));
	chart.draw(dataMealChoice, options);
}


google.charts.load('current', { 'packages': ['corechart'] });
google.charts.setOnLoadCallback(drawVisualization);
function drawVisualization() {
    // Some raw data (not necessarily accurate)
    var data = google.visualization.arrayToDataTable([
        ['Hora do Dia', 'Carne', 'Peixe/Vegetariano'],
        ['12h00', 1, 1],
        ['12h30', 3, 1],
        ['13h00', 5, 2],
        ['13h30', 10, 1],
        ['14h00', 2, 1]
    ]);

    var options = {
        title: 'Média de tempo na fila de espera por cada fila',
        vAxis: { title: 'Minutos' },
        hAxis: { title: 'Horas de Funcionamento' },
        seriesType: 'bars',
        series: { 2: { type: 'line' } }
    };

    var chart = new google.visualization.ComboChart(document.getElementById('queue'));
    chart.draw(data, options);
}