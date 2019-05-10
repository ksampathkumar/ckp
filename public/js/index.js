/* --------------------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------ $$                    index.html                      $$--------------------------------------------
---------------------------------------------------------------------------------------------------------------------------------------------------*/
/* use this for producing downloadable pdf's ----
window.open('file:///home/eslhive/nodejs/ckp/frontEnd/indexCalculator.html')
window.open('indexCalculator.html');
--------------------------------------------------*/

let validateRequest = new XMLHttpRequest();
validateRequest.open('post', '/validate2', true);
let token = localStorage.getItem('x-auth_token');
validateRequest.setRequestHeader('x-auth', token);

validateRequest.onload = function () {

    if (validateRequest.status === 200) {
        let userDets = JSON.parse(this.response);
        if (userDets.role === 1 || userDets.role === 0) {
            location.href = 'indexCalculator_admin.html'
        } else {
            location.href = 'indexCalculator.html';
        }
        document.getElementById('username').innerHTML = `${userDets.fName} ${userDets.lName}`;
    }
}

validateRequest.send();

// Login Button Event //

function login(element) {
    let uname = document.getElementById("uname").value;
    let psw = document.getElementById("psw").value;

    // 1.get Role to access indexCalculator.html or indexCalculator_admin.html page , 2.get JWT token to access any stuff
    // new login update the token for the user. One account - only one login

    if (uname === '' || psw === '') {
        alert("Please Enter All The Required Details !!!");
    } else {

        var request = new XMLHttpRequest();
        request.open('post', `/login`, true);
        request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        request.onload = function () {
            // console.log(typeof(request.getResponseHeader('x-auth')));
            // console.log(request.getAllResponseHeaders());
            if (request.status === 200) {
                localStorage.setItem('x-auth_token', request.getResponseHeader('x-auth'));

                console.log('res:', this.response);
                let windowDirection = this.response;
                if (windowDirection.split('$')[0] === '/indexCalculator_admin.html') {
                    if (windowDirection.split('$')[1] === '2') {
                        window.location.href = '/indexCalculator.html';
                    } else {
                        window.location.href = windowDirection[0]
                    }
                } else {
                    window.location.href = windowDirection[0]
                }

            } else {
                alert('Invalid password or username');
                document.getElementById("psw").value = '';
            }

        }
        request.send(`user=${encodeURIComponent(uname)}&password=${encodeURIComponent(psw)}`);

    }
}

document.addEventListener('keypress', (event) => {
    if (event.keycode === 13 || event.which === 13) {
        login(event);
    }

});

// Login Button Event //

// Cancel Button Event //

document.querySelector('.cancelbtn').addEventListener('click', () => {
    document.getElementById("uname").value = '';
    document.getElementById("psw").value = '';
});

// Cancel Button Event //


/* --------------------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------ $$                    index.html                      $$--------------------------------------------
---------------------------------------------------------------------------------------------------------------------------------------------------*/