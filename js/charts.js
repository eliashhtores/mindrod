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
        loadTables();
        loadCharts();
        e.preventDefault();
    });

    function loadCharts() {
        console.log('Test');
    }

    function loadTables() {
        const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
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
        const onTime = document.querySelector('#onTime');
        onTime.innerHTML = '';
        let reworksPercent;
        let out_of_timePercent;
        let on_timePercent;

        $.ajax({
            url: url,
            method: "GET",
            data: data,
            dataType: "json",
            success: function (response) {
                let htmlExceptions = '';
                let htmlOnTime = '';
                for (let i = 0; i < months.length; i++) {
                    if (response.data[i] !== undefined) {
                        reworksPercent = response.data[i].reworks/response.data[i].total * 100;
                        reworksPercent = reworksPercent.toFixed(2) + '%';
                        out_of_timePercent = response.data[i].out_of_time/response.data[i].total * 100;
                        out_of_timePercent = out_of_timePercent.toFixed(2) + '%';
                        on_timePercent = response.data[i].on_time/response.data[i].total * 100;
                        on_timePercent = on_timePercent.toFixed(2) + '%';
                    } else {
                        reworksPercent = '';
                        out_of_timePercent = '';
                        on_timePercent = '';
                    }
                    htmlExceptions += `
                            <tr>
                                <th scope="row">${months[i]}</th>
                                <td>${reworksPercent}</td>
                                <td>10%</td>
                                <td>${out_of_timePercent}</td>
                                <td>5%</td>
                            </tr>
                    `;
                    htmlOnTime += `
                            <tr>
                                <th scope='row'>${months[i]}</th>
                                <td>${on_timePercent}</td>
                            </tr>
                    `;
                }
                exceptions.innerHTML = htmlExceptions;
                onTime.innerHTML = htmlOnTime;
            },
            error: function (err) {
                console.log(err.responseText);
            }
        });
    }
});
