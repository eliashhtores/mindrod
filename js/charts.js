session = JSON.parse(localStorage.getItem("session"));

$(document).ready(function() {
    loadYears();

    function loadYears() {
        
        const url = '/mindrod/api/work_order/load_years.php';
        $.ajax({
            url: url,
            method: "GET",
            dataType: "json",
            success: function (response) {
                const years = $("#years");
                $.each(response, function(year) {
                    years.append($("<option />").val(response[year].year).text(response[year].year));
                });
            },
            error: function (err) {
                console.log(err.responseText);
            }
        });
    };

    $(document).on('click', '#triggerTable', function (e) {
        document.querySelector('#content').classList.remove('d-none');
        loadContent();
        e.preventDefault();
    });

    function loadContent() {
        const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        months.reverse();
        const year = document.querySelector('#years').value;
        const url = '/mindrod/api/work_order/load_exceptions.php';
        let data = {};
        data.year = year;

        const years = document.querySelectorAll('.year');
        for (const node of years) {
            node.innerHTML = year;
        }
        const exceptions = document.querySelector('#exceptions');
        exceptions.innerHTML = '';        

        $.ajax({
            url: url,
            method: "GET",
            data: data,
            dataType: "json",
            success: function (response) {
                for (let i = 0; i < months.length; i++) {

                    const row = exceptions.insertRow(0);
                    const outOfTimePercentaje = row.insertCell(0);
                    const outOfTime = row.insertCell(0);
                    const reworksPercentaje = row.insertCell(0);
                    const reworks = row.insertCell(0);
                    const monthRow = row.insertCell(0);
                    monthRow.innerHTML = months[i];
                    if (response.data[i] !== undefined) {
                        const reworksPercent = response.data[i].reworks/response.data[i].total * 100;
                        const out_of_timePercent = response.data[i].out_of_time/response.data[i].total * 100;
                        outOfTime.innerHTML = out_of_timePercent;
                        // console.log(reworksPercent.toFixed(2), out_of_timePercent.toFixed(2));
                    }
                }
            },
            error: function (err) {
                console.log(err.responseText);
            }
        });
    }
});
