$(document).ready(function() {
    $('#gradeForm').on('submit', function(event) {
        event.preventDefault();

        const activity = $('#activity').val();
        const grade = parseFloat($('#grade').val());

        if (activity && !isNaN(grade)) {
            addGrade(activity, grade);
            $('#activity').val('');
            $('#grade').val('');
        }
    });

    function addGrade(activity, grade) {
        const table = $('#gradesTable tbody');
        const newRow = $('<tr>');

        newRow.append($('<td>').text(activity));
        newRow.append($('<td>').text(grade.toFixed(2)));

        const actionCell = $('<td>');
        const editButton = $('<i>').addClass('fas fa-edit').on('click', function() {
            editGrade(newRow, activity, grade);
        });
        const deleteButton = $('<i>').addClass('fas fa-trash').on('click', function() {
            newRow.remove();
            updateAverage();
            saveData();
            updateChart();
        });

        actionCell.append(editButton).append(deleteButton);
        newRow.append(actionCell);
        table.append(newRow);

        updateAverage();
        saveData();
        updateChart();
    }

    function editGrade(row, activity, grade) {
        const newActivity = prompt("Editar Atividade:", activity);
        const newGrade = parseFloat(prompt("Editar Nota:", grade));

        if (newActivity && !isNaN(newGrade)) {
            row.find('td').eq(0).text(newActivity);
            row.find('td').eq(1).text(newGrade.toFixed(2));
            updateAverage();
            saveData();
            updateChart();
        }
    }

    function updateAverage() {
        const rows = $('#gradesTable tbody tr');
        let total = 0;

        rows.each(function() {
            total += parseFloat($(this).find('td').eq(1).text());
        });

        const average = rows.length ? (total / rows.length).toFixed(2) : '0.00';
        $('#average').text(average);
    }

    function saveData() {
        const data = [];
        $('#gradesTable tbody tr').each(function() {
            const activity = $(this).find('td').eq(0).text();
            const grade = parseFloat($(this).find('td').eq(1).text());
            data.push({ activity, grade });
        });

        localStorage.setItem('gradesData', JSON.stringify(data));
    }

    function loadData() {
        const data = JSON.parse(localStorage.getItem('gradesData')) || [];
        data.forEach(item => addGrade(item.activity, item.grade));
    }

    function updateChart() {
        const data = JSON.parse(localStorage.getItem('gradesData')) || [];
        const labels = data.map(item => item.activity);
        const grades = data.map(item => item.grade);

        const ctx = $('#gradesChart')[0].getContext('2d');
        if (window.gradesChart) {
            window.gradesChart.destroy();
        }
        window.gradesChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Notas',
                    data: grades,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 2,
                    fill: false
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 10
                    }
                }
            }
        });
    }

    loadData();
    updateChart();
});
