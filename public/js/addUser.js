/* --------------------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------ $$                    addUser.js                      $$-----------------------------------------
---------------------------------------------------------------------------------------------------------------------------------------------------*/

// ******** Static to Dynamic page ******* //

// let validateRequest = new XMLHttpRequest();
// validateRequest.open('post', '/validate0', true);
// let token = localStorage.getItem('x-auth_token');
// validateRequest.setRequestHeader('x-auth', token);

// validateRequest.onload = function () {
//     if (validateRequest.status === 200) {
//         let userDets = JSON.parse(this.response);
//         document.getElementById('username').innerHTML = `${userDets.fName} ${userDets.lName}`;
//     } else if (validateRequest.status === 401) {
//         alert('Please Login to Proceed');
//         location.href = 'index.html';
//     }
// }

// validateRequest.send();

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

// Add User Button Event //

function addUser() {
    let email = document.getElementById("email").value;
    let fName = document.getElementById("fName").value;
    let lName = document.getElementById("lName").value;
    let desig = document.getElementById("desig").value;
    let passPhrase = document.getElementById("passPhrase").value;

    let role = document.getElementById("role");
    var valRole = parseInt(role.options[role.selectedIndex].value);

    if (email === '' || fName === '' || lName === '' || desig === '' || passPhrase === '' || valRole === 'null') {
        alert("Please Enter All The Required Details !!!");
    } else {

        let reqObj = {
            email: email,
            fName: fName,
            lName: lName,
            desig: desig,
            passPhrase: passPhrase,
            role: valRole
        }
        var reqAddUser = new XMLHttpRequest();
        reqAddUser.open('post', `/users`, true);
        let token = localStorage.getItem('x-auth_token');
        reqAddUser.setRequestHeader('x-auth', token);
        reqAddUser.setRequestHeader('Content-type', 'application/json; charset=UTF-8');
        reqAddUser.onload = function () {

            var data = this.response;
            if (reqAddUser.status === 200) {
                alert("User Created Successfully");
                location.href = 'adminPage.html';
            } else if (reqAddUser.status === 401) {
                alert("Please Login to Create User");
                location.href = 'index.html';
            } else if (reqAddUser.status === 418) {
                alert("You Do Not Have Rights To Create User");
            } else if (reqAddUser.status === 418) {
                alert("The User with the email is already present in the system");
            } else {
                alert("Error:", data);
            }
        }
        reqAddUser.send(JSON.stringify(reqObj));
    }
}


// Add User Button Event //

// Clear Button Event //
document.querySelector('.clear').addEventListener('click', () => {

    document.getElementById("email").value = '';
    document.getElementById("fName").value = '';
    document.getElementById("lName").value = '';
    document.getElementById("desig").value = '';
    document.getElementById("passPhrase").value = '';

    document.getElementById("role").value = "null";

});
// Clear Button Event //

/* --------------------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------ $$                  addUser.js                      $$-------------------------------------------
---------------------------------------------------------------------------------------------------------------------------------------------------*/