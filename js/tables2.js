const tableHeaders = ['', '', '', 'No.Fact.', 'No.Oc', 'Folio', 'Dwg', 'Descripción', 'Cliente', 'Maquina', 'Cantd', 'Serie', 'Recibido', 'Compromiso', 'Entrega', 'Retrabajos', 'Indic.', 'Realizó Mecánico', 'Status', 'Observaciones', 'Status OC'];

loadTable();

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
    let id = '';
    let rowClass = '';
    let row = '';
    $(document).on('click', '.edit_data', function () {
        $('#insert_form')[0].reset();
        id = $(this).attr("id");
        row = $(this).parent().parent();
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
                rowClass = response.row_color;
                $('#insert').val("Modificar");
                $('#updateModal').modal('show');
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
                row.removeClass(rowClass);
                $('#insert').prop("disabled", true);
                $('#insert').val("Modificando");
            },
            success: function (response) {
                if ($('#insert_form').find('input[name="pdf"]').val()) {
                    upload_profile_picture(response.result.id, 'edit');
                }
                $('#insert_form')[0].reset();
                $('#updateModal').modal('hide');
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
                row.addClass(response.result.row_color);

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


function upload_profile_picture(id, add_or_edit) {
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
        error: function () {
            console.log('Failed');
        }
    }).done(function (response) {
        console.log('Done');
        if (response.status == 0) {
            toastr.error(response.message);
        }
        // dataGrid.ajax.reload();
        // $(`#${add_or_edit}-table-modal`).modal('hide');

        //show success message
        // toastr_success_wrapper('Data successfully saved.', 'Saved Successfully!');
    });
}