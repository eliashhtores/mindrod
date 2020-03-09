session = JSON.parse(localStorage.getItem("session"));

class UI {
  displayForm () {
    document.querySelector('#task-form').style.display = 'block';
  }

  showAlert (message, className) {
    // Create div
    const div = document.createElement('div');
    // Add class
    div.className = `alert ${className}`;
    // Add text
    div.appendChild(document.createTextNode(message));
    // Get parent
    const container = document.querySelector('#container');
    // Get form
    const form = document.querySelector('#task-form');
    // Insert alert
    container.insertBefore(div, form);
    // Timeout after 3 sec
    setTimeout(function () {
        document.querySelector('.alert').remove();
    }, 3000);
  }

  clearFields () {
    document.getElementById('invoice').value = '';
    document.getElementById('work_order_number').value = '';
    document.getElementById('dwg_number').value = '';
    document.getElementById('description').value = '';
    document.getElementById('client').value = '';
    document.getElementById('machine').value = '';
    document.getElementById('quantity').value = '';
    document.getElementById('serial').value = '';
    document.getElementById('receipt_date').value = '';
    document.getElementById('commitment_date').value = '';
    document.getElementById('observations').value = '';
  }
}

const ui = new UI();

$(document).ready(function() {
  getCurrentWorkOrders();

  function getCurrentWorkOrders() {
    url = '/mindrod/include/get_current_work_orders.php';
    $.ajax({
      url: url,
      method: "GET",
      dataType: "json",
      success: function (response) {
        $('#current').text(response.current);
      }
    });
  }

  $(document).on('click', '#new-task', function () {
    ui.displayForm();
  });

  $(document).on('submit', '#task-form', function (e) {
    e.preventDefault();
    
    const url = '/mindrod/api/work_order/create.php';
    const data = JSON.stringify({
      'invoice': $('#invoice').val(), 
      'work_order_number': $('#work_order_number').val(),
      'dwg_number': $('#dwg_number').val(),
      'description': $('#description').val(),
      'client': $('#client').val(),
      'machine': $('#machine').val(),
      'quantity': $('#quantity').val(),
      'serial': $('#serial').val(),
      'receipt_date': $('#receipt_date').val(),
      'commitment_date': $('#commitment_date').val(),
      'observations': $('#observations').val(),
      'created_by': session[0].id 
    });

    $.ajax({
      url: url,
      method: "POST",
      data: data,
      dataType: "json",
      success: function (response) {
        getCurrentWorkOrders();
        ui.showAlert('Orden de trabajo agregada exitosamente.', 'alert alert-success alert-dismissible');
        ui.clearFields();
        console.log(response);
      },
      error: function (err) {
        ui.showAlert('Ocurrio un error al agregar la orden de trabajo, favor de revisar los datos.', 'alert alert-danger alert-dismissible');
        console.log(err.responseText);
      }
    });
  });

  $("#quantity").change(function () {
    const url = '/mindrod/api/serial/read.php';
    const quantity = parseInt(this.value); 
    let serial = "";
    $.ajax({
      url: url,
      method: "GET",
      dataType: "json",
      success: function (response) {
        if (quantity === 1) {
          const number = parseInt(response) + quantity;
          serial = `MIN-${number}`; 
        } else {
          response = parseInt(response);
          serial = `MIN-${response + 1}-${response + quantity}`; 
        }
        $('#serial').val(serial);
      }
    });
  });

  $("#button").click(function () {
    $('html, body').animate( {
      scrollTop: $("#content-wrapper").offset().top
    }, 'slow');
  });

});
