// ******** Static to Dynamic page ******* //

let validateRequest = new XMLHttpRequest();
validateRequest.open('post', '/validate0', true);
let token = localStorage.getItem('x-auth_token');
validateRequest.setRequestHeader('x-auth', token);

validateRequest.onload = function () {
  if (validateRequest.status === 200) {
    let userDets = JSON.parse(this.response);
    if (userDets.currentRole !== 1) {
      alert('Please Change Your Role to Access the Page');
      location.href = 'indexCalculator_admin.html';
    } else {
      document.getElementById('username').innerHTML = `${userDets.fName} ${userDets.lName}`;
    }
  } else if (validateRequest.status === 401) {
    alert('Please Login to Proceed');
    location.href = 'index.html';
  }
}

validateRequest.send();

// ******** Static to Dynamic page ******* //
startTime();

// DISPLAY TIME
function startTime() {
  var today = new Date();
  document.getElementById('time').innerHTML =
    today.toLocaleString();
  var t = setTimeout(startTime, 500);
}


// Logout
function logout() {
  let token = localStorage.getItem('x-auth_token');

  var request = new XMLHttpRequest();

  request.open('delete', `/logout`, true);
  request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  request.setRequestHeader('x-auth', token);

  request.onload = function () {

    if (request.status === 200) {

      localStorage.removeItem('token');
      location.href = "index.html";
    } else {
      location.href = "index.html";
    }


  }
  request.send();
}