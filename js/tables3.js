const tableHeaders = ['', '', '', 'No.Fact.', 'No.Oc', 'Folio', 'Dwg', 'Descripción', 'Cliente', 'Maquina', 'Cantd', 'Serie', 'Recibido', 'Compromiso', 'Entrega', 'Retrabajos', 'Indic.', 'Realizó Mecánico', 'Status', 'Observaciones', 'Status OC'];

loadTable();

// document.querySelector('#triggerTable').addEventListener('click',function (e) {
//     const year = document.querySelector('#years').value;
//     const month = Array.from(document.querySelectorAll('#month option:checked')).map(el => el.value);
//     const row_color = Array.from(document.querySelectorAll('#row_color option:checked')).map(el => el.value);

//     e.preventDefault();
// })


// @@TODO Merge with loadDataTable()
function loadTable() {
    document.addEventListener('DOMContentLoaded', function () {
        let html = '';
        tableHeaders.forEach(function (header) {
            if (header != 'Status OC') {
                html += `<th>${header}</th>`;
            }
        });
        document.querySelector('#headers').innerHTML = html;
    });
};

$(document).ready(function () {
    loadTotals();
    loadDataTable();
     
    $(document).on('click', '#triggerTable', function (e) {
        loadTotals();
        loadDataTable();
        e.preventDefault();
    });

    function loadDataTable() {
        const year = $('#years').val();
        const month = $('#month').val();
        const row_color = $('#row_color').val();
        const url = '/mindrod/api/work_order/read.php';
        let data = {};
        data.year = year;
    
        if (month.length !== 0) 
            data.month = month;
        if (row_color.length !== 0) 
            data.row_color = row_color;

        $.ajax({
            url: url,
            method: "GET",
            data: data,
            dataType: "json",
            success: function (response) {
                console.log(response);
                // $("#early").html(response.early);
                // $("#onTime").html(response.onTime);
                // $("#outOfTime").html(response.outOfTime);
                // $("#reworks").html(response.reworks);
                // $("#average").html(response.average);
                // $("#total").html(response.total);
                // $("#earlyPercent").html(earlyPercent.toFixed(2));
                // $("#onTimePercent").html(onTimePercent.toFixed(2));
                // $("#outOfTimePercent").html(outOfTimePercent.toFixed(2));
                // $("#reworksPercent").html(reworksPercent.toFixed(2));
            },
            error: function (err) {
                console.log(err.responseText);
            }
        });
    };

    function loadTotals() {
        const year = $('#years').val();
        const month = $('#month').val();
        const row_color = $('#row_color').val();
        const url = '/mindrod/api/work_order/load_totals.php';
        let data = {};
        data.year = year;
    
        if (month.length !== 0) 
            data.month = month;
        if (row_color.length !== 0) 
            data.row_color = row_color;

        $.ajax({
            url: url,
            method: "GET",
            data: data,
            dataType: "json",
            success: function (response) {
                response.early == null ? earlyPercent = 0 : earlyPercent = (response.early/response.total) * 100;
                response.onTime == null ? onTimePercent = 0 : onTimePercent = response.onTime/response.total * 100;
                response.outOfTime == null ? outOfTimePercent = 0 : outOfTimePercent = response.outOfTime/response.total * 100;
                response.reworks == null ? reworksPercent = 0 : reworksPercent = response.reworks/response.total * 100;
                $("#early").html(response.early);
                $("#onTime").html(response.onTime);
                $("#outOfTime").html(response.outOfTime);
                $("#reworks").html(response.reworks);
                $("#average").html(response.average);
                $("#total").html(response.total);
                $("#earlyPercent").html(earlyPercent.toFixed(2));
                $("#onTimePercent").html(onTimePercent.toFixed(2));
                $("#outOfTimePercent").html(outOfTimePercent.toFixed(2));
                $("#reworksPercent").html(reworksPercent.toFixed(2));
            },
            error: function (err) {
                console.log(err.responseText);
            }
        });
    };

    $(document).on('click', '.edit_data', function () {
        $('#insert_form')[0].reset();
        const id = $(this).attr("id");
        const url = '/mindrod/api/work_order/read_single.php';

        $.ajax({
            url: url,
            method: "GET",
            data: { id: id },
            dataType: "json",
            success: function (response) {
                $('#insert').prop("disabled", false);
                $('#id').val(response.id);
                $('#invoice').val(response.invoice);
                $('#work_order_number').val(response.work_order_number);
                $('#dwg_number').val(response.dwg_number);
                $('#description').val(response.description);
                $('#client').val(response.client);
                $('#machine').val(response.machine);
                $('#quantity').val(response.quantity);
                $('#serial').val(response.serial);
                $('#receipt_date').val(response.receipt_date);
                $('#commitment_date').val(response.commitment_date);
                $('#due_date').val(response.due_date);
                $('#rework').val(response.rework);
                $('#indicator').val(response.indicator);
                $('#machinist').val(response.machinist);
                $('#status').val(response.status);
                $('#observations').val(response.observations);
                $('#row_color_single').val(response.row_color);
                $('#insert').val("Modificar");
                $('#updateModal').modal('show');
            },
            error: function (err) {
                console.log(err.responseText);
            }
        });
    });

    $('.remove-data').on("click", function (event) {
        event.preventDefault();
        id = $(this).attr("id");
        row = $(this).parent().parent();
        const data = JSON.stringify({'id': id});
        const answer = confirm('¿Desea borrar esta orden de trabajo?');
        if (answer) {
            $.ajax({
                url: '/mindrod/api/work_order/deactivate_work_order.php',
                method: "POST",
                data: data,
                dataType: "json",
                success: function (data) {
                    row.remove();
                    console.log(data);
                },
                error: function (err) {
                    console.log(err.responseText);
                }
            });   
        }
    });

    $(document).on('submit', '#insert_form', function (e) {
        e.preventDefault();
        const url = '/mindrod/api/work_order/update.php';
        const form = $('#insert_form');
        const inputs = form.find(':input');
        let data = {};
        inputs.each(function () {
            if (this.type != 'file') {
                if ($(this).val() !== '' && $(this).val() !== null) {
                    data[this.name] = $(this).val();
                }
            }
        });
        data = JSON.stringify(data);

        $.ajax({
            url: url,
            method: "POST",
            dataType: "json",
            data: data,
            beforeSend: function () {
                $('#insert').prop("disabled", true);
                $('#insert').val("Modificando");
            },
            success: function (response) {
                if ($('#insert_form').find('input[name="pdf"]').val()) {
                    upload_pdf(response.result.id, 'edit');
                }
                $('#insert_form')[0].reset();
                $('#updateModal').modal('hide');
                console.log(response);
            }
        });
    });

});

document.addEventListener('click', function (e) {
    if (e.target && (e.target.id == 'details' || e.target.id == 'observations')) {
        if (e.target.innerHTML == 'Ocultar') {
            e.target.innerHTML = 'Ver';
        } else {
            e.target.innerHTML = 'Ocultar';
        }
    }
});

function upload_pdf(id, add_or_edit) {
    const url = `/mindrod/api/work_order/add_pdf.php?id=${id}`;

    $.ajax({
        url: url,
        method: 'POST',
        contentType: false,
        cache: false,
        processData: false,
        dataType: 'json',
        autoUpload: 'false',
        data: new FormData(document.getElementById('insert_form')),
        beforeSend: function () {
            console.log('Sending pdf...');
        },
        success: function () {
            console.log('Success!');
        },
        error: function (err) {
            console.log(err.responseText);
        }
    }).done(function (response) {
        console.log('Done');
        if (response.status == 0) {
            toastr.error(response.message);
        }
        //show success message
        // toastr_success_wrapper('Data successfully saved.', 'Saved Successfully!');
    });
}