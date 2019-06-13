/* --------------------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------ $$                    reset.html                      $$--------------------------------------------
---------------------------------------------------------------------------------------------------------------------------------------------------*/

// Register Button Event //

function reset(element) {
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
            request.open('post', `/users/reset`, true);
            request.setRequestHeader('Content-type', 'application/json; charset=UTF-8');
            request.onload = function () {
                if (request.status === 200) {
                    alert("Password Reset Successfull");
                    location.href = 'index.html';
                } else if (request.status === 406) {
                    alert('New User, please try registering your account');
                    location.href = 'register.html';
                } else {
                    location.href = 'accessDenied.html';
                }
            }
            request.send(JSON.stringify(reqObj));
        }



    }
}

// Register Button Event //



/* --------------------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------ $$                  reset.html                      $$----------------------------------------------
---------------------------------------------------------------------------------------------------------------------------------------------------*/