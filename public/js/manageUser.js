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

// DELETE
function userDelete(element) {
    let id = element.parentNode.parentNode.parentNode.id;
    console.log("ID:", id);
    var request = new XMLHttpRequest();
    request.open('delete', `users/${id}`, true);
    let token = localStorage.getItem('x-auth_token');
    request.setRequestHeader('x-auth', token);
    request.onload = function () {
        if (request.status === 200) {
            // id.parentNode.removeChild(id);
            document.getElementById(id).remove();
            location.reload();
        } else if (requestStats.status === 401) {
            location.href = "index.html";
        } else if (requestStats.status === 404) {
            alert("The User Does Not Exist");
        } else {
            alert("something's wrong");
        }
    }
    request.send();
}

function startUP() {

    var requestStats = new XMLHttpRequest();
    requestStats.open('get', `/users`, true);
    requestStats.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    let token = localStorage.getItem('x-auth_token');
    requestStats.setRequestHeader('x-auth', token);
    requestStats.onload = function () {

        if (requestStats.status === 418) {
            location.href = "accessDenied.html";
        } else if (requestStats.status === 404 || requestStats.status === 401) {
            location.href = "index.html";
        }
        let data = JSON.parse(this.response);

        let userCount = 0;
        let superCount = 0;
        let adminCount = 0
        let salesCount = 0;

        let htmlUser = '<div class="item clearfix" id="%id%"><div class="role">%role%</div><div class="name">%fullName%</div><div class="email">%email%</div><div class="right clearfix"><div class="item_delete"><button onclick="userDelete(this)" class="item_delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
        let htmlDisplay = '';
        let htmlTemp = '';
        data.forEach(element => {
            // if (element.role === 0) {
            //     superCount++;
            //     htmlTemp = htmlUser.replace('%id%', element._id);
            //     htmlTemp = htmlTemp.replace('%role%', 'SuperAdmin');
            //     htmlTemp = htmlTemp.replace('%fullName%', `${element.fName} ${element.lName}`);
            //     htmlTemp = htmlTemp.replace('%email%', element.email);
            // } else 
            if (element.role === 1) {
                adminCount++;
                htmlTemp = htmlUser.replace('%id%', element._id);
                htmlTemp = htmlTemp.replace('%role%', 'Admin');
                htmlTemp = htmlTemp.replace('%fullName%', `${element.fName} ${element.lName}`);
                htmlTemp = htmlTemp.replace('%email%', element.email);
            } else if (element.role === 2) {
                salesCount++;
                htmlTemp = htmlUser.replace('%id%', element._id);
                htmlTemp = htmlTemp.replace('%role%', 'Sales');
                htmlTemp = htmlTemp.replace('%fullName%', `${element.fName} ${element.lName}`);
                htmlTemp = htmlTemp.replace('%email%', element.email);
            }

            if (element.role === 1 || element.role === 2) {
                htmlDisplay = htmlDisplay + htmlTemp + '<p>&nbsp;</p>';
                userCount++;
            }

        });

        // Insert the HTML into the DOM
        document.querySelector('.user_list').insertAdjacentHTML('beforeend', htmlDisplay);

        document.querySelector(".total").textContent = adminCount + salesCount;
        document.querySelector(".admin_Count").textContent = adminCount;
        document.querySelector(".sales_Count").textContent = salesCount;
    }
    requestStats.send();
}

startUP();
