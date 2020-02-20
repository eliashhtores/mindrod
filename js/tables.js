// loadEventListeners();

// function loadEventListeners() {
//   document.getElementById('triggerTable').addEventListener('click', displayTable);
// }

// function displayTable(e) {
//   const select = document.getElementById('month');
//   const month = select.options[select.selectedIndex].value;
//   document.querySelector('#work-orders').style.display = 'block';
//   e.preventDefault();
// }

const http = new EasyHTTP;
const host = getHost();

// Get work orders
let select = document.getElementById('month');
const month = select.options[select.selectedIndex].value;
select = document.getElementById('years');
const year = select.options[select.selectedIndex].value;
const url = new URL(`http://${host}/mindrod/include/get_work_orders.php`);

const params = {
  "month": month,
  "year": year
};

url.search = new URLSearchParams(params);

http.get(url)
  .then(function (data) {
    let table = '';
    exclude = ['id', 'created_at', 'created_by', 'updated_at', 'updated_by'];
    data.forEach(function (row) {
      table += `
      <tr class='item'>
      <td><div align='center'><input type='button' class='btn btn-link edit_data' value='${row.id}' id='${row.id}' data-target='#updateModal' data-toggle='modal'/>
      `;
      for (var key in row) {
        if (exclude.includes(key)) {
          continue;
        } else {
          if (row[key] === null)
            row[key] = '';
          table += `
          <td><div align='center'>${row[key]}</div></td>
        `;
        }
      }
      table += '</tr>';
    });
    document.getElementById('table').innerHTML = table;
  })
  .catch(err => console.log(err));


// foreach ($results as $result) {
//   echo "";
//   echo "<td><div align='center'><input type='button' class='btn btn-link edit_data' value='{$result['id']}' id='{$result['id']}' data-target='#updateModal' data-toggle='modal' />";
//   foreach ($attributes as $key => $value) {
//     echo "<td><div align='center'>{$result[$attributes[$key]]}</div></td>";
//   }
//   echo "</tr>";
// }


// User Data
// const data = {
//     name: 'Jonh Doe',
//     username: 'jdoe',
//     email: 'jdoe@test.com'
// }

// Create User
// http.post('http://jsonplaceholder.typicode.com/users', data)
// .then(data => console.log(data))
// .catch(err => console.log(err));

// Update User
// http.put('http://jsonplaceholder.typicode.com/users/2', data)
// .then(data => console.log(data))
// .catch(err => console.log(err));

// Delete User
// http.delete('http://jsonplaceholder.typicode.com/users/4')
// .then(data => (console.log(data)))
// .catch(err => console.log(err));
