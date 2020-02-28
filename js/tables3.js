let workOrderTable = $("#workOrderTable").DataTable({
    serverSide: false,
    responsive: true,
    columns: [
        { data: 'edit' },
        { data: 'pdf' },
        { data: 'remove' },
        { data: 'invoice' },
        { data: 'work_order_number' },
        { data: 'folio' },
        { data: 'dwg_number' },
        { data: 'description' },
        { data: 'client' },
        { data: 'machine' },
        { data: 'quantity' },
        { data: 'serial' },
        { data: 'receipt_date' },
        { data: 'commitment_date' },
        { data: 'due_date'},
        { data: 'rework' },
        { data: 'indicator' },
        { data: 'machinist' },
        { data: 'status' },
        { data: 'observations' }
    ]
});

let workOrderdetails = [];

$(document).ready(function () {

    let rowClass = '';
    let row = '';
    let idToDelete = '';
    $(document).on('click', '#triggerTable', function (e) {
        loadTotals();
        loadDataTable();
        e.preventDefault();
    });

    function loadDataTable() {
        $("#work-orders").css({ display: "block" });  
        const year = $('#years').val();
        const month = $('#month').val();
        const row_color = $('#row_color').val();
        const url = '/mindrod/api/work_order/read.php';
        let data = {};
        let rows = '';
        data.year = year;
    
        if (month.length !== 0) 
            data.month = month;
        if (row_color.length !== 0) 
            data.row_color = row_color;

        workOrderTable.clear();

        $.ajax({
            url: url,
            method: 'GET',
            dataType: "json",
            data: data,
            success: function(response) {
                workOrderdetails = response; 
                let res = response.data;
                if (res) {
                    let edit, pdf, remove, invoice, work_order_number, folio, dwg_number, description, client, machine, quantity, serial, receipt_date, 
                        commitment_date, rework, indicator, machinist, status, observations;
                    for (let i in res) {
                        edit = `<button id="${res[i].id}" class="btn btn-link edit_data"><i class="fa fa-pencil-square-o"></i></button>`;
                        pdf = `<a href="/mindrod/uploads/${res[i].id}.pdf" target="_blank" class="btn btn-link"><i class="fas fa-file-pdf"></i></a></td>`;
                        remove = `<button id="${res[i].id}" class="btn btn-link remove-data"><i class="fa fa-remove"></i></button>`;
                        invoice = `<div id="invoice-${res[i].id}">${res[i].invoice}</div>`;
                        work_order_number = `<div id="work_order_number-${res[i].id}">${res[i].work_order_number}</div>`;
                        folio = `<div id="folio-${res[i].id}">${res[i].folio}</div>`; 
                        dwg_number = `<div id="dwg_number-${res[i].id}">${res[i].dwg_number}</div>`; 
                        description = `<div><button class="btn btn-xs btn-primary collapsed details" data-toggle="collapse" data-target="#collapse-btn-description-${res[i].id}" aria-expanded="false">Ver</button></div>
                                       <div class="mt-2 collapse" id="collapse-btn-description-${res[i].id}" style="">${res[i].description}</div>`; 
                        client = `<div id="client-${res[i].id}">${res[i].client}</div>`; 
                        machine = `<div id="machine-${res[i].id}">${res[i].machine}</div>`; 
                        quantity = `<div id="quantity-${res[i].id}">${res[i].quantity}</div>`; 
                        serial = `<div id="serial-${res[i].id}">${res[i].serial}</div>`;
                        receipt_date = `<div id="receipt_date-${res[i].id}">${res[i].receipt_date}</div>`; 
                        commitment_date = `<div id="commitment_date-${res[i].id}">${res[i].commitment_date}</div>`;
                        res[i].due_date = res[i].due_date !== null ? res[i].due_date : ''; 
                        due_date = `<div id="due_date-${res[i].id}">${res[i].due_date}</div>`; 
                        rework = `<div id="rework-${res[i].id}">${res[i].rework}</div>`; 
                        indicator = `<div id="indicator-${res[i].id}">${res[i].indicator}</div>`; 
                        machinist = `<div id="machinist-${res[i].id}">${res[i].machinist}</div>`; 
                        status = `<div id="status-${res[i].id}">${res[i].status}</div>`;
                        observations = `<div><button class="btn btn-xs btn-primary observations" data-toggle="collapse" data-target="#collapse-btn-observations-${res[i].id}">Ver</button></div>
                                        <div class="collapse mt-2" id="collapse-btn-observations-${res[i].id}">${res[i].observations}</div>`;

                        trDOM = workOrderTable.row.add({
                            'edit': edit,
                            'pdf': pdf,
                            'remove': remove,
                            'invoice': invoice,
                            'work_order_number': work_order_number,
                            'folio': folio,
                            'dwg_number': dwg_number,
                            'description': description,
                            'client': client,
                            'machine': machine,
                            'quantity': quantity,
                            'serial': serial,
                            'receipt_date': receipt_date,
                            'commitment_date': commitment_date,
                            'due_date': due_date,
                            'rework': rework,
                            'indicator': indicator,
                            'machinist': machinist,
                            'status': status,
                            'observations': observations
                        }).node();

                        $( trDOM ).addClass(res[i].row_color);
                    }
                }

                workOrderTable.draw();

                $(document).on('click', '.details', function (e) {
                    e.preventDefault();
                    if (e.target.innerText == 'Ocultar') {
                        e.target.innerText = 'Ver';
                    } else {
                        e.target.innerText = 'Ocultar';
                    }
                });

                $(document).on('click', '.observations', function (e) {
                    e.preventDefault();
                    if (e.target.innerText == 'Ocultar') {
                        e.target.innerText = 'Ver';
                    } else {
                        e.target.innerText = 'Ocultar';
                    }
                });
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
        row = $(this).parent().parent();

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
                rowClass = response.row_color;
            },
            error: function (err) {
                console.log(err.responseText);
            }
        });
    });

    $(document).on('click', '.remove-data', function (e) {
        e.preventDefault();
        idToDelete = $(this).attr("id");
        row = $(this).parent().parent();
        $('#confirmModal').modal('show');
    });

    $("#yes").on("click", function () {
        const data = JSON.stringify({'id': idToDelete});
        $.ajax({
            url: '/mindrod/api/work_order/deactivate_work_order.php',
            method: "POST",
            data: data,
            dataType: "json",
            success: function (response) {
                row.remove();
                loadTotals();
                toastr.success(response.spanish);
                console.log(response.result);
            },
            error: function (err) {
                console.log(err.responseText);
            }
        });
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
                loadTotals();
                row.removeClass(rowClass);
                row.addClass(response.result.row_color);
                updateDOM(response);
                console.log(response);
                toastr.success(response.spanish);
            },
            error: function (err) {
                console.log(err.responseText);
            }
        });
    });

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
            console.log('Error!');
            toastr.error(err.responseText);
        }
    }).done(function (response) {
        console.log('Done');
        toastr.success(response);
    });
}

function updateDOM(response) {
    const invoice = '#invoice' + `-${response.result.id}`;
    const work_order_number = '#work_order_number' + `-${response.result.id}`;
    const dwg_number = '#dwg_number' + `-${response.result.id}`;
    const description = '#collapse-btn-description' + `-${response.result.id}`;
    const client = '#client' + `-${response.result.id}`;
    const machine = '#machine' + `-${response.result.id}`;
    const quantity = '#quantity' + `-${response.result.id}`;
    const serial = '#serial' + `-${response.result.id}`;
    const receipt_date = '#receipt_date' + `-${response.result.id}`;
    const commitment_date = '#commitment_date' + `-${response.result.id}`;
    const due_date = '#due_date' + `-${response.result.id}`;
    const rework = '#rework' + `-${response.result.id}`;
    const indicator = '#indicator' + `-${response.result.id}`;
    const machinist = '#machinist' + `-${response.result.id}`;
    const status = '#status' + `-${response.result.id}`;
    const observations = '#collapse-btn-observations' + `-${response.result.id}`;

    $(invoice).html(response.result.invoice);
    $(work_order_number).html(response.result.work_order_number);
    $(dwg_number).html(response.result.dwg_number);
    $(description).html(response.result.description);
    $(client).html(response.result.client);
    $(machine).html(response.result.machine);
    $(quantity).html(response.result.quantity);
    $(serial).html(response.result.serial);
    $(receipt_date).html(response.result.receipt_date);
    $(commitment_date).html(response.result.commitment_date);
    $(due_date).html(response.result.due_date);
    $(rework).html(response.result.rework);
    $(indicator).html(response.result.indicator);
    $(machinist).html(response.result.machinist);
    $(status).html(response.result.status);
    $(observations).html(response.result.observations);
}