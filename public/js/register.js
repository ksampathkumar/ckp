/* --------------------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------ $$                    register.html                      $$-----------------------------------------
---------------------------------------------------------------------------------------------------------------------------------------------------*/

// Register Button Event //

function register(element) {
    let uname = document.getElementById("uname").value;
    let psw1 = document.getElementById("psw1").value;
    let psw2 = document.getElementById("psw2").value;
    let pass = document.getElementById("psw3").value;

    if (uname === '' || psw1 === '' || psw2 === '' || psw3 === '') {
        alert("Please Enter All The Required Details !!!");
    } else {

        if (psw1 !== psw2) {
            alert("passwords Do Not Match, Try Again");
            location.reload();
        } else {
            let reqObj = { email: uname, password: psw1, passPhrase: pass };

            var request = new XMLHttpRequest();
            request.open('post', `/users/register`, true);
            request.setRequestHeader('Content-type', 'application/json; charset=UTF-8');
            request.onload = function () {
                if (request.status === 200) {
                    alert("Registration Successfull");
                    location.href = 'index.html';
                } else if (request.status === 406) {
                    alert('Account is Already in Use, please try resetting your password');
                    location.href = 'passwordReset.html';
                } else {
                    location.href = 'accessDenied.html';
                }
            }
            request.send(encodeURIComponent(JSON.stringify(reqObj)));
        }



    }
}

// Register Button Event //



/* --------------------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------ $$                  register.html                      $$-------------------------------------------
---------------------------------------------------------------------------------------------------------------------------------------------------*/