class AddFooter {
  static addDate() {
    const today = new Date();
    document.getElementById('currentYear').innerText = today.getFullYear();
  }
}

// loadEventListeners();

function loadEventListeners() {
  document.addEventListener('DOMContentLoaded', AddFooter.addDate);
}

function getHost() {
  return 'localhost'; 
}