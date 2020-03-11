const labels = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

$(document).on('click', '#triggerTable', function (e) {
    loadCharts();
  e.preventDefault();
});

function loadCharts() {

const year = document.querySelector('#years').value;
const url = '/mindrod/api/work_order/get_monthly_data.php';
let data = {};
data.year = year;

  $.ajax({
    url: url,
    method: "GET",
    data: data,
    dataType: "json",
    success: function (response) {
      render(response);
    },
    error: function (err) {
        console.log(err.responseText);
    }
  });
}

function render(data) {
  graphReworks(data);
  graphOutOfTime(data);
  graphOnTime(data);
}

// Set new default font family and font color to mimic Bootstrap's default styling
 Chart.defaults.global.defaultFontFamily = '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
 Chart.defaults.global.defaultFontColor = '#292b2c';

function graphReworks(data) {
  const ctx = document.getElementById("reworks");
  let reworks = [];

  for (const month in data) {
    if (data.hasOwnProperty(month)) 
      reworks[data[month].month-1] = (data[month].reworks / data[month].total * 100).toFixed(2);
  }
  
  const myLineChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: "Porcentaje de retrabajos",
        backgroundColor: "rgba(2,117,216,1)",
        borderColor: "rgba(2,117,216,1)",
        data: reworks,
      }],
    },
    options: {
      scales: {
        xAxes: [{
          time: {
            unit: 'month'
          },
          gridLines: {
            display: false
          },
          ticks: {
            maxTicksLimit: 12
          }
        }],
        yAxes: [{
          ticks: {
            min: 0,
            max: 100,
            maxTicksLimit: 5
          },
          gridLines: {
            display: true
          }
        }],
      },
      legend: {
        display: false
      }
    }
  });
}

function graphOutOfTime(data) {
  const ctx = document.getElementById("out_of_time");
  let out_of_time = [];

  for (const month in data) {
    if (data.hasOwnProperty(month)) 
      out_of_time[data[month].month-1] = (data[month].out_of_time / data[month].total * 100).toFixed(2);
  }


  const myLineChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: "Porcentaje de entregas fuera de tiempo",
        backgroundColor: "rgba(2,117,216,1)",
        borderColor: "rgba(2,117,216,1)",
        data: out_of_time,
      }],
    },
    options: {
      scales: {
        xAxes: [{
          time: {
            unit: 'month'
          },
          gridLines: {
            display: false
          },
          ticks: {
            maxTicksLimit: 12
          }
        }],
        yAxes: [{
          ticks: {
            min: 0,
            max: 100,
            maxTicksLimit: 5
          },
          gridLines: {
            display: true
          }
        }],
      },
      legend: {
        display: false
      }
    }
  });
}

function graphOnTime(data) {
  const ctx = document.getElementById("on_time");
  let on_time = [];

  for (const month in data) {
    if (data.hasOwnProperty(month)) 
      on_time[data[month].month-1] = (data[month].on_time / data[month].total * 100).toFixed(2);
  }

  const myLineChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: "Porcentaje de entregas fuera de tiempo",
        backgroundColor: "rgba(2,117,216,1)",
        borderColor: "rgba(2,117,216,1)",
        data: on_time,
      }],
    },
    options: {
      scales: {
        xAxes: [{
          time: {
            unit: 'month'
          },
          gridLines: {
            display: false
          },
          ticks: {
            maxTicksLimit: 12
          }
        }],
        yAxes: [{
          ticks: {
            min: 0,
            max: 100,
            maxTicksLimit: 5
          },
          gridLines: {
            display: true
          }
        }],
      },
      legend: {
        display: false
      }
    }
  });
}