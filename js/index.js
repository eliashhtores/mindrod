document.querySelector('#login').addEventListener('click', function (e) {
    const username = document.querySelector('#username').value;
    const password = document.querySelector('#password').value;
    const url = '/mindrod/api/user/validate_user.php';
    const data = {
      "username": username,
      "password": password
    };
    const failed = document.querySelector('#login-error');
  
    $.ajax({
        url: url,
        method: "GET",
        data: data,
        dataType: "json",
        success: function (response) {
          if (response.count == 0) {
            failed.classList.remove("d-none");
          } else {
            failed.classList.add("d-none");
            createSession(response);
            redirect(response);
          }
        },
        error: function (err) {
            console.log(err.responseText);
        }
    });

    e.preventDefault();

});

// Create session
function createSession(response) {
  const storage = localStorage;
  let session = []; 
  session.push(response);
  storage.setItem("session", JSON.stringify(session));
}

function redirect(response) {
if (response.role_id == 1)
    window.location.replace("dashboard.php");
else
    window.location.replace("table.php");
}