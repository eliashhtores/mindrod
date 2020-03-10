// const http = new EasyHTTP;
// const host = getHost();
// const url = new URL(`http://${host}/mindrod/include/get_monthly_data.php`);
const url = '/mindrod/api/work_order/get_monthly_data.php';
const labels = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

// http.get(url)
// .then(function (data) {
//   render(data);
// })
// .catch(err => console.log(err));

// function render(data) {
//   graphReworks(data);
//   graphOutOfTime(data);
//   graphInTime(data);
// }

// Set new default font family and font color to mimic Bootstrap's default styling
 Chart.defaults.global.defaultFontFamily = '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
 Chart.defaults.global.defaultFontColor = '#292b2c';

function graphReworks(data) {
  var ctx = document.getElementById("reworks");

  let reworks = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  for (let index = 0; index < 12; index++) {
    if (data[index] === undefined ) {
      continue;
    } else {
      reworks[data[index].month - 1] = (data[index].reworks / data[index].total) * 100;
    }
  }
  
  var myLineChart = new Chart(ctx, {
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
  var ctx = document.getElementById("out_of_time");

  let out_of_time = [];
  for (let index = 0; index < 12; index++) {
    if (data[index] === undefined ) {
      continue;
    } else {
      out_of_time[data[index].month - 1] = (data[index].out_of_time / data[index].total) * 100;
    }
  }

  var myLineChart = new Chart(ctx, {
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

function graphInTime(data) {
  var ctx = document.getElementById("on_time");

  let on_time = [];
  for (let index = 0; index < 12; index++) {
    if (data[index] === undefined ) {
      continue;
    } else {
      on_time[data[index].month - 1] = (data[index].on_time / data[index].total) * 100;
    }
  }

  var myLineChart = new Chart(ctx, {
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