// class AddFooter {
//   static addDate() {
//     const today = new Date();
//     document.getElementById('currentYear').innerText = today.getFullYear();
//   }
// }
let session = {};

loadEventListeners();
getSessionData();
document.querySelector('#user').innerHTML = session[0].name;
setAdminLink(session);

function loadEventListeners() {
  document.querySelector('#exit').addEventListener('click', () => {
    console.log('Deleting session...');
    localStorage.clear();
  });

  // document.addEventListener('DOMContentLoaded', AddFooter.addDate);
}

function getHost() {
  return 'localhost'; 
}

function getSessionData() {
  const storage = localStorage;
  if (storage.getItem("session")) 
    session = JSON.parse(storage.getItem("session"));
  else
    console.log('Session not found!!');
}

function setAdminLink(session) {
  if (session[0].role_id == 1) {
    document.querySelector('#dashboard').setAttribute("href", "dashboard.php");
  }  
}
