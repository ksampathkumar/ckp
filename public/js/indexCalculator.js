// CUSTOM KIT PRICING //

/* --------------------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------ $$              indexCalculator.html            $$ -------------------------------------------------
---------------------------------------------------------------------------------------------------------------------------------------------------*/

// ******** Static to Dynamic page ******* //

let validateRequest = new XMLHttpRequest();
validateRequest.open('post', '/validate2', true);
let token = localStorage.getItem('x-auth_token');
validateRequest.setRequestHeader('x-auth', token);

let userDets;
validateRequest.onload = function () {

  if (validateRequest.status === 200) {
    userDets = JSON.parse(this.response);
    // this is done to remove the Admin Button for the Non-SuperAdmin Users
    if (userDets.currentRole === 1) {
      location.href = 'indexCalculator_admin.html';
    } else {
      if (userDets.role === 2) {
        var switchUI = document.getElementsByClassName("switchUI");
        while (switchUI.length > 0) {
          switchUI[0].parentNode.removeChild(switchUI[0]);
        }
      }
    }
    document.getElementById('username').innerHTML = `${userDets.fName} ${userDets.lName}`;
  } else if (validateRequest.status === 401) {
    alert('Please Login to Proceed');
    location.href = 'index.html';
  }
}

validateRequest.send();

// ******** Static to Dynamic page ******* //

// startTime();

// // DISPLAY TIME
// function startTime() {
//   var today = new Date();
//   document.getElementById('time').innerHTML =
//     today.toLocaleString();
//   var t = setTimeout(startTime, 500);
// }


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

// Collapsible Menu Navigator //
function collapseAll() {
  var coll = document.getElementsByClassName("collapsible");
  var i;
  // console.log('coll:', coll);
  for (i = 0; i < coll.length; i++) {
    coll[i].addEventListener("click", function () {
      // this.classList.toggle("active");
      var content = this.nextElementSibling;
      if (content.style.display === "block") {
        content.style.display = "none";
      } else {
        content.style.display = "block";
      }
    });
  }
}
collapseAll();

function collapseCart() {
  var collCart = document.getElementsByClassName("collapsibleCart");
  var i;
  // console.log('coll:', collCart);

  for (i = 0; i < collCart.length; i++) {
    var content = collCart[i].nextElementSibling;
    content.style.display = "block";
  }

  for (i = 0; i < collCart.length; i++) {
    collCart[i].addEventListener("click", function () {
      this.classList.toggle("active");
      var content = this.nextElementSibling;
      if (content.style.display === "block") {
        content.style.display = "none";
      } else {
        content.style.display = "block";
      }
    });
  }
}
// Collapsible Menu Navigator //

function generateLabString() {

  // Getting Selected Labs
  let txt = "";

  let subs = [];
  subs.push('ap', 'as', 'es', 'fs', 'gb', 'gc', 'gp', 'hb', 'hg', 'ib', 'ic', 'ip', 'mb', 'sg', 'bg', 'rm', 'pt', 'ob');
  let i;
  subs.forEach((sub) => {
    let id = document.getElementsByName(sub);

    for (i = 0; i < id.length; i++) {
      if (id[i].checked) {
        txt = txt + id[i].value + " ";
      }
    }

  });

  // Note: All the dissection items needed will have -ve sign for labs.
  // Suppose lab 5 has dissection and you need it, you need to send ap--5

  // A&P Dissection Condition.

  let apd1 = document.getElementById('ap-d1');
  // console.log('txt:', txt);
  // Dissection is not removed
  if (!(apd1.checked)) {

    if (txt.includes('ap-5')) {
      txt = txt + 'ap--5' + " ";
    }
    if (txt.includes('ap-6')) {
      txt = txt + 'ap--6' + " ";
    }
    if (txt.includes('ap-7')) {
      txt = txt + 'ap--7' + " ";
    }
    if (txt.includes('ap-8')) {
      txt = txt + 'ap--8' + " ";
    }
    if (txt.includes('ap-9')) {
      txt = txt + 'ap--9' + " ";
    }
    if (txt.includes('ap-10')) {
      txt = txt + 'ap--10' + " ";
    }
    if (txt.includes('ap-11')) {
      txt = txt + 'ap--11' + " ";
    }
    if (txt.includes('ap-12')) {
      txt = txt + 'ap--12' + " ";
    }
    if (txt.includes('ap-13')) {
      txt = txt + 'ap--13' + " ";
    }
    if (txt.includes('ap-14')) {
      txt = txt + 'ap--14' + " ";
    }
    if (txt.includes('ap16')) {
      txt = txt + 'ap--16' + " ";
    }
    if (txt.includes('ap-18')) {
      txt = txt + 'ap--18' + " ";
    }

  } else if (apd1.checked) {
    // replace the standard modules with customized modules. Coz, the AP has differnent modules fo lab 8, 10 in dissection and non-dissection kits.
    // ap-108 and ap-110 corresponds to modules that no-dissection modules
    // First remove
    let is8 = 0;
    let is10 = 0;
    if (txt.includes('ap-8')) {
      txt = txt.replace('ap-8', '');
      is8 = 1;
    }

    if (txt.includes('ap-10')) {
      txt = txt.replace('ap-10', '');
      is10 = 1
    }

    // Second Add
    if (is8) {
      txt = txt + 'ap-108' + " ";
    }

    if (is10) {
      txt = txt + 'ap-110' + " ";
    }
  }

  // console.log('txt:', txt);

  let apd2 = document.getElementById('ap-d2');
  // Pig not removed
  if (!(apd2.checked) && !(apd1.checked)) {
    if (txt.includes('ap-5')) {
      txt = txt + 'ap--1005' + " ";
    }
    if (txt.includes('ap-6')) {
      txt = txt + 'ap--1006' + " ";
    }
    if (txt.includes('ap-7')) {
      txt = txt + 'ap--1007' + " ";
    }
    if (txt.includes('ap-8')) {
      txt = txt + 'ap--1008' + " ";
    }
    if (txt.includes('ap-9')) {
      txt = txt + 'ap--1009' + " ";
    }
    if (txt.includes('ap-11')) {
      txt = txt + 'ap--1010' + " ";
    }
    if (txt.includes('ap-12')) {
      txt = txt + 'ap--1012' + " ";
    }
    if (txt.includes('ap-13')) {
      txt = txt + 'ap--1013' + " ";
    }
    if (txt.includes('ap-14')) {
      txt = txt + 'ap--1014' + " ";
    }
    if (txt.includes('ap16')) {
      txt = txt + 'ap--1016' + " ";
    }
    if (txt.includes('ap-18')) {
      txt = txt + 'ap--1018' + " ";
    }
  }

  let apd3 = document.getElementById('ap-d3');
  // Add Kidney
  if (apd3.checked) {
    txt = txt + 'ap-1001' + " ";
  }

  let apd4 = document.getElementById('ap-d4');
  // Add Rat
  if (apd4.checked) {
    txt = txt + 'ap-1002' + " ";
  }

  let apd5 = document.getElementById('ap-d5');
  // Add Rabbit
  if (apd5.checked) {
    txt = txt + 'ap-1003' + " ";
  }

  // Human Biology Dissection Condition.

  let hbd1 = document.getElementById('hb-d1');

  if (!(hbd1.checked)) {

    if (txt.includes('hb-10')) {
      txt = txt + 'hb--10' + " ";
    }
    if (txt.includes('hb-12')) {
      txt = txt + 'hb--12' + " ";
    }
    if (txt.includes('hb-13')) {
      txt = txt + 'hb--13' + " ";
    }

  }

  // General Biology Dissection Condition.

  let gbd1 = document.getElementById('gb-d1');
  if (!(gbd1.checked)) {

    if (txt.includes('gb-19')) {
      txt = txt + 'gb--19' + " ";
    }
    if (txt.includes('gb-20')) {
      txt = txt + 'gb--20' + " ";
    }

  }

  // General Biology Dissection Condition.

  let ibd1 = document.getElementById('ib-d1');

  if (!(ibd1.checked)) {

    if (txt.includes('ib-23')) {
      txt = txt + 'ib--23' + " ";
    }

  }

  txt = txt.slice(0, -1);
  // Getting Selected Labs
  // console.log('txt:', txt);
  return txt;

}

// Calculate Button Event //
document.querySelector('.calculateButton').addEventListener('click', () => {

  calcUp();

});

// Calculate or Update Function
function calcUp() {

  // if (window.globalData !== undefined) {
  //   window.globalData = undefined;
  // }

  let txt = generateLabString();

  if (txt.length > 2) {
    // console.log(txt);
    // Do the backend call here
    // window.location.href = `/ckp/${txt}`;    // Do the backend call here

    var request = new XMLHttpRequest();
    request.open('GET', `/ckp2/${txt}`, true);
    let token = localStorage.getItem('x-auth_token');
    request.setRequestHeader('x-auth', token);
    request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    request.onload = function () {

      // Begin accessing JSON data here
      if (request.status >= 200 && request.status < 400) {
        var data = JSON.parse(this.response);
        console.log("Server Data:", data);
        document.querySelector(".price_projected_1--value").textContent = `$${data[0]}`;
        document.querySelector(".price_projected_2--value").textContent = `$${data[1]}`;

        // Scroll Window to top smooth
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: 'smooth'
        });

      } else if (request.status === 406) {
        alert(this.response);
      } else if (request.status === 500) {
        alert(this.response);
      } else {
        console.log('Error:', request.status);
      }
    }

    request.send();

  } else {
    alert('No Selection Made, Please Make Your Selections')
  }

}

// // update cost button same as calculate
// document.querySelector('.updateCost').addEventListener('click', () => {

//   calcUp();

// });

// Clear Button Event //
function clearAll() {

  window.globalData = undefined;
  document.querySelector('.cart_list').textContent = '';

  // clearing the checkboxes //
  clearCheckBoxes();

  document.querySelector('.price_projected_1--value').textContent = "";
  document.querySelector('.price_projected_2--value').textContent = "";

  document.getElementById("state").value = '';
  document.getElementById("institution").value = '';
  document.getElementById("instructor").value = '';
  document.getElementById("pNumber").value = '';
  document.getElementById("pDescription").value = '';
  document.getElementById("estimate").value = '';
  document.getElementById("uPrice").value = '';
  document.getElementById("uShip").value = '';

  document.getElementById("notes").value = '';
  document.querySelector('.labCounts--value').textContent = '';

}

// Kit Version selection // 
function kitVersion(element) {
  if (element.checked) {

    switch (element.value) {

      case 'gc-v1':
        var checkbox = document.getElementsByName('gc');
        checkbox.forEach((e) => {
          if (!(e.value.split("-")[1].startsWith('v') || e.value.split("-")[1].startsWith('d'))) {
            let lab = parseInt(e.value.split("-")[1], 10);
            if (lab <= 14) {
              e.checked = true;
            }
          }

        });
        break;
      case 'gc-v2':
        var checkbox = document.getElementsByName('gc');
        checkbox.forEach((e) => {
          if (!(e.value.split("-")[1].startsWith('v') || e.value.split("-")[1].startsWith('d'))) {
            let lab = parseInt(e.value.split("-")[1], 10);
            if (lab > 14 || lab < 4) {
              e.checked = true;
            }
          }

        });
        break;
      case 'gc-v3':
        var checkbox = document.getElementsByName('gc');
        checkbox.forEach((e) => {
          if (!(e.value.split("-")[1].startsWith('v') || e.value.split("-")[1].startsWith('d'))) {
            e.checked = true;
          }
        });
        break;

      case 'ib-v1':
        var checkbox = document.getElementsByName('ib');
        checkbox.forEach((e) => {
          if (!(e.value.split("-")[1].startsWith('v') || e.value.split("-")[1].startsWith('d'))) {
            let lab = parseInt(e.value.split("-")[1], 10);
            if (lab <= 15) {
              e.checked = true;
            }
          }

        });
        break;
      case 'ib-v2':
        var checkbox = document.getElementsByName('ib');
        checkbox.forEach((e) => {
          if (!(e.value.split("-")[1].startsWith('v') || e.value.split("-")[1].startsWith('d'))) {
            let lab = parseInt(e.value.split("-")[1], 10);
            if (lab > 15 || lab < 3) {
              e.checked = true;
            }
          }

        });
        break;
      case 'ib-v3':
        var checkbox = document.getElementsByName('ib');
        // special V3 for dissection kits
        checkbox.forEach((e) => {
          if (!(e.value.split("-")[1].startsWith('v') || e.value.split("-")[1].startsWith('d'))) {
            e.checked = true;
          }
        });
        break;
      case 'ib-v4':
        var checkbox = document.getElementsByName('ib');
        checkbox.forEach((e) => {
          if (!(e.value.split("-")[1].startsWith('v') || e.value.split("-")[1].startsWith('d'))) {
            let lab = parseInt(e.value.split("-")[1], 10);
            if (lab < 3 || lab === 10 || lab === 20 || lab === 11 || lab === 14 || lab === 15 || lab === 27 || lab === 12 || lab === 28) {
              e.checked = true;
            }
          }

        });
        break;

      case 'ap-v1':
        var checkbox = document.getElementsByName('ap');
        checkbox.forEach((e) => {
          if (!(e.value.split("-")[1].startsWith('v') || e.value.split("-")[1].startsWith('d'))) {
            let lab = parseInt(e.value.split("-")[1], 10);
            if (lab <= 8) {
              e.checked = true;
            }
          }

        });
        break;
      case 'ap-v2':
        var checkbox = document.getElementsByName('ap');
        checkbox.forEach((e) => {
          if (!(e.value.split("-")[1].startsWith('v') || e.value.split("-")[1].startsWith('d'))) {
            let lab = parseInt(e.value.split("-")[1], 10);
            if (lab > 8 || lab < 2) {
              e.checked = true;
            }
          }

        });
        break;
      case 'ap-v3':
        var checkbox = document.getElementsByName('ap');
        // special V3 for dissection kits
        checkbox.forEach((e) => {
          if (!(e.value.split("-")[1].startsWith('v') || e.value.split("-")[1].startsWith('d'))) {
            e.checked = true;
          }
        });
        break;

      case 'mb-v1':
        var checkbox = document.getElementsByName('mb');
        checkbox.forEach((e) => {
          if (!(e.value.split("-")[1].startsWith('v') || e.value.split("-")[1].startsWith('d'))) {
            e.checked = true;
          }
        });
        break;

      case 'ic-v1':
        var checkbox = document.getElementsByName('ic');
        checkbox.forEach((e) => {
          if (!(e.value.split("-")[1].startsWith('v') || e.value.split("-")[1].startsWith('d'))) {
            let lab = parseInt(e.value.split("-")[1], 10);
            if (lab <= 13) {
              e.checked = true;
            }
          }

        });
        break;
      case 'ic-v2':
        var checkbox = document.getElementsByName('ic');
        checkbox.forEach((e) => {
          if (!(e.value.split("-")[1].startsWith('v') || e.value.split("-")[1].startsWith('d'))) {
            let lab = parseInt(e.value.split("-")[1], 10);
            if (lab > 13 || lab < 3) {
              e.checked = true;
            }
          }

        });
        break;
      case 'ic-v3':
        var checkbox = document.getElementsByName('ic');
        checkbox.forEach((e) => {
          if (!(e.value.split("-")[1].startsWith('v') || e.value.split("-")[1].startsWith('d'))) {
            e.checked = true;
          }
        });
        break;
      case 'ic-v4':
        var checkbox = document.getElementsByName('ic');
        checkbox.forEach((e) => {
          if (!(e.value.split("-")[1].startsWith('v') || e.value.split("-")[1].startsWith('d'))) {
            let lab = parseInt(e.value.split("-")[1], 10);
            if (lab < 3 || lab === 3 || lab === 17 || lab === 18 || lab === 9 || lab === 11 || lab === 15 || lab === 20 || lab === 23) {
              e.checked = true;
            }
          }

        });
        break;

      case 'gb-v1':
        var checkbox = document.getElementsByName('gb');
        checkbox.forEach((e) => {
          if (!(e.value.split("-")[1].startsWith('v') || e.value.split("-")[1].startsWith('d'))) {
            let lab = parseInt(e.value.split("-")[1], 10);
            if (lab <= 14) {
              e.checked = true;
            }
          }

        });
        break;
      case 'gb-v2':
        var checkbox = document.getElementsByName('gb');
        checkbox.forEach((e) => {
          if (!(e.value.split("-")[1].startsWith('v') || e.value.split("-")[1].startsWith('d'))) {
            let lab = parseInt(e.value.split("-")[1], 10);
            if (lab > 15 || lab < 3) {
              e.checked = true;
            }
          }

        });
        break;
      case 'gb-v3':
        var checkbox = document.getElementsByName('gb');
        // special V3 for dissection kits
        checkbox.forEach((e) => {
          if (!(e.value.split("-")[1].startsWith('v') || e.value.split("-")[1].startsWith('d'))) {
            e.checked = true;
          }
        });
        break

      case 'gp-v1':
        var checkbox = document.getElementsByName('gp');
        checkbox.forEach((e) => {
          if (!(e.value.split("-")[1].startsWith('v') || e.value.split("-")[1].startsWith('d'))) {
            let lab = parseInt(e.value.split("-")[1], 10);
            if (lab <= 14) {
              e.checked = true;
            }
          }

        });
        break;
      case 'gp-v2':
        var checkbox = document.getElementsByName('gp');
        checkbox.forEach((e) => {
          if (!(e.value.split("-")[1].startsWith('v') || e.value.split("-")[1].startsWith('d'))) {
            let lab = parseInt(e.value.split("-")[1], 10);
            if (lab > 15 || lab < 3) {
              e.checked = true;
            }
          }

        });
        break;
      case 'gp-v3':
        var checkbox = document.getElementsByName('gp');
        checkbox.forEach((e) => {
          if (!(e.value.split("-")[1].startsWith('v') || e.value.split("-")[1].startsWith('d'))) {
            e.checked = true;
          }
        });
        break;

      case 'ip-v1':
        var checkbox = document.getElementsByName('ip');
        checkbox.forEach((e) => {
          if (!(e.value.split("-")[1].startsWith('v') || e.value.split("-")[1].startsWith('d'))) {
            let lab = parseInt(e.value.split("-")[1], 10);
            if (lab <= 13) {
              e.checked = true;
            }
          }

        });
        break;
      case 'ip-v2':
        var checkbox = document.getElementsByName('ip');
        checkbox.forEach((e) => {
          if (!(e.value.split("-")[1].startsWith('v') || e.value.split("-")[1].startsWith('d'))) {
            let lab = parseInt(e.value.split("-")[1], 10);
            if (lab > 13 || lab < 3) {
              e.checked = true;
            }
          }

        });
        break;
      case 'ip-v3':
        var checkbox = document.getElementsByName('ip');
        checkbox.forEach((e) => {
          if (!(e.value.split("-")[1].startsWith('v') || e.value.split("-")[1].startsWith('d'))) {
            e.checked = true;
          }
        });
        break;
      case 'ip-v4':
        var checkbox = document.getElementsByName('ip');
        checkbox.forEach((e) => {
          if (!(e.value.split("-")[1].startsWith('v') || e.value.split("-")[1].startsWith('d'))) {
            let lab = parseInt(e.value.split("-")[1], 10);
            if (lab === 1 || lab === 3 || lab === 4 || lab === 5 || lab === 6 || lab === 7 || lab === 10 || lab === 11 || lab === 15 || lab === 16 || lab === 26) {
              e.checked = true;
            }
          }

        });
        break;

      case 'as-v1':
        var checkbox = document.getElementsByName('as');
        checkbox.forEach((e) => {
          if (!(e.value.split("-")[1].startsWith('v') || e.value.split("-")[1].startsWith('d'))) {
            e.checked = true;
          }
        });
        break;

      case 'es-v1':
        var checkbox = document.getElementsByName('es');
        checkbox.forEach((e) => {
          if (!(e.value.split("-")[1].startsWith('v') || e.value.split("-")[1].startsWith('d'))) {
            e.checked = true;
          }
        });
        break;

      case 'fs-v1':
        var checkbox = document.getElementsByName('fs');
        checkbox.forEach((e) => {
          if (!(e.value.split("-")[1].startsWith('v') || e.value.split("-")[1].startsWith('d'))) {
            e.checked = true;
          }
        });
        break;

      case 'hb-v1':
        var checkbox = document.getElementsByName('hb');
        // special V3 for dissection kits
        checkbox.forEach((e) => {
          if (!(e.value.split("-")[1].startsWith('v') || e.value.split("-")[1].startsWith('d'))) {
            e.checked = true;
          }
        });
        break;

      case 'hg-v1':
        var checkbox = document.getElementsByName('hg');
        checkbox.forEach((e) => {
          if (!(e.value.split("-")[1].startsWith('v') || e.value.split("-")[1].startsWith('d'))) {
            e.checked = true;
          }
        });
        break;

      case 'sg-v1':
        var checkbox = document.getElementsByName('sg');
        checkbox.forEach((e) => {
          if (!(e.value.split("-")[1].startsWith('v') || e.value.split("-")[1].startsWith('d'))) {
            e.checked = true;
          }
        });
        break;

      case 'bg-v1':
        var checkbox = document.getElementsByName('bg');
        checkbox.forEach((e) => {
          if (!(e.value.split("-")[1].startsWith('v') || e.value.split("-")[1].startsWith('d'))) {
            e.checked = true;
          }
        });
        break;

      case 'rm-v1':
        var checkbox = document.getElementsByName('rm');
        checkbox.forEach((e) => {
          if (!(e.value.split("-")[1].startsWith('v') || e.value.split("-")[1].startsWith('d'))) {
            e.checked = true;
          }
        });
        break;

      case 'pt-v1':
        var checkbox = document.getElementsByName('pt');
        checkbox.forEach((e) => {
          if (!(e.value.split("-")[1].startsWith('v') || e.value.split("-")[1].startsWith('d'))) {
            e.checked = true;
          }
        });
        break;

      case 'ob-v1':
        var checkbox = document.getElementsByName('ob');
        checkbox.forEach((e) => {
          if (!(e.value.split("-")[1].startsWith('v') || e.value.split("-")[1].startsWith('d'))) {
            e.checked = true;
          }
        });
        break;


      default:
    }
  } else {

    clearCheckBoxes();

  }
}

// Clear Check Boxes //
function clearCheckBoxes() {
  document.querySelector('.labCounts--value').textContent = '';
  // clearing the checkboxes //

  let subs = [];
  subs.push('kitVersion', 'ap', 'as', 'es', 'fs', 'gb', 'gc', 'gp', 'hb', 'hg', 'ib', 'ic', 'ip', 'mb', 'sg', 'bg', 'rm', 'pt', 'ob');
  subs.forEach((sub) => {
    let checkbox = document.getElementsByName(sub);
    checkbox.forEach((element) => element.checked = false);
  });
}

function switchUI() {
  if (confirm('Are you sure you want to SWITCH to ADMIN UI?')) {
    let token = localStorage.getItem('x-auth_token');

    var request = new XMLHttpRequest();

    request.open('get', `/switch`, true);
    request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    request.setRequestHeader('x-auth', token);

    request.onload = function () {

      if (request.status === 200) {
        let user = JSON.parse(this.response);
        // console.log(user);
        if (user.currentRole === 1) {
          location.href = "indexCalculator_admin.html";
        } else {
          location.href = "indexCalculator.html";
        }
      } else {
        location.href = "index.html";
      }

    }
    request.send();
  } else {
    // Do nothing!
  }
}

// Save Draft Button Event //
document.querySelector('.saveDraft').addEventListener('click', () => {

  let docName = '';

  if (window.globalData === undefined || window.globalData.data.type === 'PROPOSAL' || window.globalData.data.isPending !== undefined) {
    docName = prompt("Enter Draft Name!");
    if (docName === null) {
      alert('Draft Name Cannot be Empty, please enter a Valid Name');
      return;
    } else if (docName.includes('@') || docName.includes('#') || docName.includes('/')) {
      alert('Draft Name cannot include character "@"');
      return;
    }
  } else {
    let oldDocName = window.globalData.data.name;
    // console.log('window.globalData.data:', window.globalData.data);
    if (oldDocName.endsWith('M')) {
      docName = oldDocName + '#v2';
    } else {
      dNameSplit = oldDocName.split('#');
      let oldDocNameVersion = parseInt(dNameSplit[dNameSplit.length - 1].substr(1));
      for (let i = 0; i < dNameSplit.length - 1; i++) {
        docName += dNameSplit[i];
      }
      docName += `#v${oldDocNameVersion + 1}`;

    }
  }

  // console.log('docName:', docName);
  let check = new XMLHttpRequest();
  check.open('get', `/ckp/verifyDraft/${docName}`, true);
  let token = localStorage.getItem('x-auth_token');
  check.setRequestHeader('x-auth', token);
  check.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  check.send();
  check.onload = function () {

    if (check.status === 200) {
      let data = JSON.parse(this.response);
      // console.log('check1:', data);

      if (data.split('/')[0] === '-1' && data.split('/')[1] === '-1') {
        alert('Draft Name Already Used, please use another name');
        return;
      } else {

        docNameArray = docName.split('#');
        if (docNameArray.length > 1) {
          docName = docNameArray[0] + `#v${parseInt(data.split('/')[1]) + 1}`;
        }

        if (window.globalData !== undefined) {
          if (data.split('/')[2] !== window.globalData.data.userID) {
            if (window.globalData.data.type === 'DRAFT') {

              docName = prompt("Enter Draft Name!");
              if (docName === null) {
                alert('Draft Name Cannot be Empty, please enter a Valid Name');
                return;
              } else if (docName.includes('@') || docName.includes('#') || docName.includes('/')) {
                alert('Draft Name cannot include character "@"');
                return;
              }
            }

            let check2 = new XMLHttpRequest();
            check2.open('get', `/ckp/verifyDraft/${docName}`, true);
            let token = localStorage.getItem('x-auth_token');
            check2.setRequestHeader('x-auth', token);
            check2.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            check2.send();
            check2.onload = function () {

              if (check2.status === 200) {
                let data2 = JSON.parse(this.response);
                // console.log('check1:', data2);
                if (data2.split('/')[0] === '-1' && data2.split('/')[1] === '-1') {
                  alert('Draft Name Already Used, please use another name');
                  return;
                } else {

                  saveDraft(docName);

                }
              }
            }


          } else {

            saveDraft(docName);

          }
        } else {

          saveDraft(docName);

        }
      }
    }
  }
});

// save Draft Function
function saveDraft(docName) {

  // check if the draft is sent for pricing and if yes, make sure there is some notes.
  if (document.getElementById('isPending').checked && (document.getElementById("notes").value.length === 0 ||
    document.getElementById("state").value.length === 0 || document.getElementById("institution").value.length === 0 ||
    document.getElementById("instructor").value.length === 0 || document.getElementById("pNumber").value.length === 0 ||
    document.getElementById("pDescription").value.length === 0 || document.getElementById("estimate").value.length === 0 ||
    document.getElementById("uPrice").value.length === 0 || document.getElementById("uShip").value.length === 0)) {
    alert("Please fill in all proposal details as the Draft is being sent for Pricing. Explain what pricing is to be Done in Notes.");
    return;
  }

  // let isFresh = '1!1';
  // if (window.globalData !== undefined) {
  //   isFresh = `0!${window.globalData.data.name}`;
  // }
  let projected1 = document.getElementsByClassName("price_projected_1--value")[0].innerText;
  let projected2 = document.getElementsByClassName("price_projected_2--value")[0].innerText;
  let state = document.getElementById("state").value;
  let institution = document.getElementById("institution").value;
  let instructor = document.getElementById("instructor").value;
  let pNumber = document.getElementById("pNumber").value;
  let pDescription = document.getElementById("pDescription").value;
  let estimate = document.getElementById("estimate").value;
  let uPrice = document.getElementById("uPrice").value;
  let uShip = document.getElementById("uShip").value;
  let notes = document.getElementById("notes").value;

  txt = generateLabString();

  let draftArray = [];
  // draftArray.push(isFresh);
  draftArray.push(docName);
  draftArray.push(projected1);
  draftArray.push(projected2);
  draftArray.push(institution);
  draftArray.push(instructor);
  draftArray.push(pNumber);
  draftArray.push(pDescription);
  draftArray.push(estimate);
  draftArray.push(uPrice);
  draftArray.push(uShip);
  draftArray.push(txt);
  draftArray.push(notes);
  draftArray.push(state);

  // Send Draft for Pricing
  let isPending = document.getElementById('isPending').checked;
  if (isPending === true) {
    draftArray.push(isPending);
  }

  // console.log("sArray:", draftArray);

  var requestDraft = new XMLHttpRequest();
  requestDraft.open('post', `/ckp2/draft`, true);
  let token = localStorage.getItem('x-auth_token');
  requestDraft.setRequestHeader('x-auth', token);
  requestDraft.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  requestDraft.onload = function () {

    if (requestDraft.status === 200) {
      location.reload(); // to avoid saving the same doc
      alert("Draft was saved");
    } else {
      console.log('error:', this.response);
      alert('ERROR:', requestDraft.status);
    }

  }

  // requestDraft.send(`${JSON.stringify(draftArray)} + '???' + ${JSON.stringify(costContents)} + '???' + ${JSON.stringify(removedContents)}`);
  requestDraft.send(`dSOP=${encodeURIComponent(JSON.stringify(draftArray))}`);


}

// onload for calculator from managePD page
function showPD(data) {
  console.log('data:', data);

  window.globalData = {};
  globalData.data = data;

  if (data.type === 'DRAFT') {

    document.getElementsByClassName("price_projected_1--value")[0].innerText = data.fLower === undefined ? data.bLower : `$ ${Math.round(data.fLower)}`;
    document.getElementsByClassName("price_projected_2--value")[0].innerText = data.fUpper === undefined ? data.bUpper : `$ ${Math.round(data.fUpper)}`;
    document.getElementById("institution").value = data.institution;
    document.getElementById("instructor").value = data.instructor;
    document.getElementById("pNumber").value = data.pNumber;
    document.getElementById("pDescription").value = data.pDescription;
    document.getElementById("estimate").value = data.estimate;
    document.getElementById("uPrice").value = data.uPrice;
    document.getElementById("uShip").value = data.uShip;
    document.getElementById("notes").value = data.notes;
    document.getElementById("state").value = data.state;

    // isPending
    document.getElementById('isPending').checked = data.isPending;

    // to select the check boxes from txt
    if (data.txt.length !== 0) {
      var txt = data.txt.split(' ');
      var i;
      for (i = 0; i < txt.length; i++) {
        if (txt[i].length > 0) {

          let labCheck = '';
          if (txt[i].split('-').length == 2 && parseInt(txt[i].split('-')[1]) < 1000) {
            if (parseInt(txt[i].split('-')[1]) > 100) {
              labCheck = `${txt[i].split('-')[0]}-${parseInt(txt[i].split('-')[1]) % 100}`;
            } else {
              labCheck = txt[i];
            }
            document.querySelectorAll(`input[type='checkbox'][value='${labCheck}']`)[0].checked = true;
            // let content = document.getElementsByName(txt[i].split('-')[0])[0].parentElement;
            // // inner collapsible
            // content.previousElementSibling.classList.toggle("active");
            // content.style.display = "block";
            // // outer collapsible
            // content.parentElement.previousElementSibling.classList.toggle("active");
            // content.parentElement.style.display = "block";

            let content = document.getElementsByName(txt[i].split('-')[0])[0].parentElement;
            content.previousElementSibling.classList.toggle("active");
            content.style.display = "block";

          } else if (txt[i].split('-')[1].startsWith('v') || txt[i].split('-')[1].startsWith('d')) {
            document.getElementById(txt[i]).checked = true;
          } else {
            console.log('somethings wrong @showpd:', txt[i])
          }

        }
      }
    }

  } else if (data.type === 'PROPOSAL') {

    document.getElementsByClassName("price_projected_1--value")[0].innerText = data.fLower === undefined ? data.bLower : `$ ${Math.round(data.fLower)}`;
    document.getElementsByClassName("price_projected_2--value")[0].innerText = data.fUpper === undefined ? data.bUpper : `$ ${Math.round(data.fUpper)}`;
    document.getElementById("institution").value = data.institution;
    document.getElementById("instructor").value = data.instructor;
    document.getElementById("pNumber").value = data.pNumber;
    document.getElementById("pDescription").value = data.pDescription;
    document.getElementById("estimate").value = data.estimate;
    document.getElementById("uPrice").value = data.uPrice;
    document.getElementById("uShip").value = data.uShip;
    document.getElementById("notes").value = data.notes;
    document.getElementById("state").value = data.state;

    // to select the check boxes from txt
    if (data.txt.length !== 0) {
      var txt = data.txt.split(' ');
      var i;

      for (i = 0; i < txt.length; i++) {
        if (txt[i].length > 0) {

          let labCheck = '';
          if (txt[i].split('-').length == 2 && parseInt(txt[i].split('-')[1]) < 1000) {
            if (parseInt(txt[i].split('-')[1]) > 100) {
              labCheck = `${txt[i].split('-')[0]}-${parseInt(txt[i].split('-')[1]) % 100}`;
            } else {
              labCheck = txt[i];
            }
            // console.log('labCheck:', labCheck);
            document.querySelectorAll(`input[type='checkbox'][value='${labCheck}']`)[0].checked = true;
            // let content = document.getElementsByName(txt[i].split('-')[0])[0].parentElement;
            // content.previousElementSibling.classList.toggle("active");
            // content.style.display = "block";

            let content = document.getElementsByName(txt[i].split('-')[0])[0].parentElement;
            content.previousElementSibling.classList.toggle("active");
            content.style.display = "block";

          } else if (txt[i].split('-')[1].startsWith('v') || txt[i].split('-')[1].startsWith('d')) {
            document.getElementById(txt[i]).checked = true;
          } else {
            console.log('somethings wrong @showpd:', txt[i])
          }

        }
      }
    }
  }

  moveLabToCart();

}

// SOP Function
function sop() {

  if (window.globalData !== undefined && window.globalData.data.editable === false) {
    alert('cannot save this Proposal as the pricing has been done by Admin');
    return;
  }

  let isFresh = '1!1';
  if (window.globalData !== undefined && window.globalData.data.type == 'PROPOSAL' && window.globalData.data.linked2Draft !== undefined) {
    isFresh = `0!${window.globalData.data.name}!${window.globalData.data.linked2Draft}`;
  } else if (window.globalData !== undefined && window.globalData.data.type == 'DRAFT' && (userDets.role == 0 || userDets.role == 1)) {
    alert('This is a Corner Case which exploits and alters the structure of using the Tool. PROBLEM: Saving Proposal from Draft created in differnet UI(Sales/Admin) might result in wrong BOM and Packing List.');
  }
  // console.log('isFresh:', isFresh);

  let bLower = document.getElementsByClassName("price_projected_1--value")[0].innerText;
  let bUpper = document.getElementsByClassName("price_projected_2--value")[0].innerText;

  let state = document.getElementById("state").value;
  let institution = document.getElementById("institution").value;
  let instructor = document.getElementById("instructor").value;
  let pNumber = document.getElementById("pNumber").value;
  let pDescription = document.getElementById("pDescription").value;
  let estimate = document.getElementById("estimate").value;
  let uPrice = document.getElementById("uPrice").value;
  let uShip = document.getElementById("uShip").value;
  let notes = document.getElementById("notes").value;

  txt = generateLabString();

  if (txt.length === 0) {
    alert('No Lab Selection Made, Please Select Labs, Calculate Cost and then Save Proposal');
  } else if (institution === '' || instructor === '' || pNumber === '' || pDescription === '' || estimate === '' || uPrice === '' || uShip === '' || state === '') {
    alert("Please Enter All The SOP Details !!!");
  } else if (bLower == '' || bUpper == '') {
    alert("Please calculate the Kit price before saving !!!");
  } else {

    let docName = '';

    if (window.globalData === undefined || window.globalData.data.type === 'DRAFT' || window.globalData.data.linked2Draft !== undefined) {
      docName = prompt("Enter Proposal Name!");
      if (docName === null || docName.trim().length === 0) {
        alert('Proposal Name Cannot be Empty, please enter a Valid Name');
        return;
      } else if (docName.includes('@') || docName.includes('#') || docName.includes('/')) {
        alert('Proposal Name cannot include character "@" or "#"');
        return;
      }
    } else {
      let oldDocName = window.globalData.data.name;
      if (oldDocName.endsWith('M')) {
        docName = oldDocName + '#v2';
      } else {
        dNameSplit = oldDocName.split('#');
        let oldDocNameVersion = parseInt(dNameSplit[dNameSplit.length - 1].substr(1));
        for (let i = 0; i < dNameSplit.length - 1; i++) {
          docName += dNameSplit[i];
        }
        docName += `#v${oldDocNameVersion + 1}`;
      }
      // console.log('oldDocName:', oldDocName);
      // console.log('docName:', docName);
    }

    let check = new XMLHttpRequest();
    check.open('get', `/ckp/verifyProposal/${docName}`, true);
    let token = localStorage.getItem('x-auth_token');
    check.setRequestHeader('x-auth', token);
    check.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    // console.log('docName:', docName);
    // console.log(check);
    check.send();
    check.onload = function () {

      if (check.status === 200) {
        let data = JSON.parse(this.response);
        // console.log('check:', data);

        if (data.split('/')[0] === '-1' && data.split('/')[1] === '-1') {
          alert('Proposal Name Already Used, please use another name');
          return;
        } else {

          docNameArray = docName.split('#');
          if (docNameArray.length > 1) {
            let version = parseInt(data.split('/')[1]);
            if (version === 0) {
              version = 1;
            }
            docName = docNameArray[0] + `#v${version + 1}`;
          }
          // console.log('docName:', docName);
          if (window.globalData !== undefined) {

            if (data.split('/')[2] !== window.globalData.data.userID) {

              if (window.globalData.data.type === 'PROPOSAL') {

                docName = prompt("Enter Proposal Name!");
                if (docName === null || docName.trim().length === 0) {
                  alert('Proposal Name Cannot be Empty, please enter a Valid Name');
                  return;
                } else if (docName.includes('@') || docName.includes('#') || docName.includes('/')) {
                  alert('Proposal Name cannot include character "@" or "#"');
                  return;
                }
              }

              let check2 = new XMLHttpRequest();
              check2.open('get', `/ckp/verifyProposal/${docName}`, true);
              let token = localStorage.getItem('x-auth_token');
              check2.setRequestHeader('x-auth', token);
              check2.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
              // console.log('docName:', docName);
              // console.log(check);
              check2.send();
              check2.onload = function () {

                if (check2.status === 200) {
                  let data2 = JSON.parse(this.response);
                  // console.log('check1:', data2);
                  if (data2.split('/')[0] === '-1' && data2.split('/')[1] === '-1') {
                    alert('Proposal Name Already Used, please use another name');
                    return;
                  } else {

                    let pageArray = [];

                    // push TOP details
                    pageArray.push(isFresh);
                    pageArray.push(docName);
                    pageArray.push(bLower);
                    pageArray.push(bUpper);
                    // push All SOP details
                    pageArray.push(institution);
                    pageArray.push(instructor);
                    pageArray.push(pNumber);
                    pageArray.push(pDescription);
                    pageArray.push(estimate);
                    pageArray.push(uPrice);
                    pageArray.push(uShip);
                    // push labs
                    pageArray.push(txt);
                    pageArray.push(notes);
                    pageArray.push(state);

                    // make a backend call to server to persist all the details. Note that the endpoint is different for admin and sales page.

                    var requestSave = new XMLHttpRequest();
                    requestSave.open('post', `/ckp2/save`, true);
                    requestSave.setRequestHeader('x-auth', token);
                    requestSave.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

                    requestSave.send(`sSOP=${encodeURIComponent(JSON.stringify(pageArray))}`);
                    requestSave.onload = function () {
                      // --- please add one more partial route to save the cost and removed contents, in this res.send = objectID

                      if (requestSave.status === 200) {
                        // console.log("data:", this.response);

                        let proposalID = JSON.parse(this.response);

                        // console.log(proposalID);

                        let getProposalPDF = new XMLHttpRequest();
                        getProposalPDF.open('get', `/ckpPDF/${proposalID}`, true);
                        getProposalPDF.setRequestHeader('x-auth', token);
                        getProposalPDF.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

                        getProposalPDF.send();
                        getProposalPDF.onload = function () {

                          if (getProposalPDF.status === 200) {

                            // console.log('data:', JSON.parse(this.response));
                            let pdfData = JSON.parse(this.response);

                            let pdfName = getProposalPDF.getResponseHeader('content-disposition');

                            let file = new Blob([new Uint8Array(pdfData.data)], {
                              type: 'application/pdf'
                            });
                            // let fileURL = URL.createObjectURL(file);
                            // let proposalWindow = window.open(fileURL, pdfName);
                            // proposalWindow.document.title = pdfName;

                            // var newWindow = window.open(newdata, "_blank");
                            // newWindow.document.title = "Some title";

                            const data = window.URL.createObjectURL(file);
                            var link = document.createElement('a');
                            link.href = data;
                            link.download = pdfName;
                            link.click();

                            // alert('SOP was saved');
                            clearAll(); // to avoid saving the same doc

                          } else {
                            console.log('Somethings worng @getProposalPDF:', getProposalPDF.status);
                          }

                        }

                      } else {
                        console.log('Somethings worng 2:', requestSave.status);
                      }


                    }
                  }
                } else {
                  console.log('somethings wrong @ proposal 1');
                }
              }
            } else {


              let pageArray = [];

              // push TOP details
              pageArray.push(isFresh);
              pageArray.push(docName);
              pageArray.push(bLower);
              pageArray.push(bUpper);
              // push All SOP details
              pageArray.push(institution);
              pageArray.push(instructor);
              pageArray.push(pNumber);
              pageArray.push(pDescription);
              pageArray.push(estimate);
              pageArray.push(uPrice);
              pageArray.push(uShip);
              // push labs
              pageArray.push(txt);
              pageArray.push(notes);
              pageArray.push(state);

              // make a backend call to server to persist all the details. Note that the endpoint is different for admin and sales page.

              var requestSave = new XMLHttpRequest();
              requestSave.open('post', `/ckp2/save`, true);
              requestSave.setRequestHeader('x-auth', token);
              requestSave.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

              requestSave.send(`sSOP=${encodeURIComponent(JSON.stringify(pageArray))}`);
              // console.log(pageArray);
              requestSave.onload = function () {

                if (requestSave.status === 200) {
                  // console.log("data:", this.response);

                  let proposalID = JSON.parse(this.response);

                  // console.log(proposalID);

                  let getProposalPDF = new XMLHttpRequest();
                  getProposalPDF.open('get', `/ckpPDF/${proposalID}`, true);
                  getProposalPDF.setRequestHeader('x-auth', token);
                  getProposalPDF.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

                  getProposalPDF.send();
                  getProposalPDF.onload = function () {

                    if (getProposalPDF.status === 200) {

                      // console.log('data:', JSON.parse(this.response));
                      let pdfData = JSON.parse(this.response);

                      let pdfName = getProposalPDF.getResponseHeader('content-disposition');

                      let file = new Blob([new Uint8Array(pdfData.data)], {
                        type: 'application/pdf'
                      });
                      // let fileURL = URL.createObjectURL(file);
                      // let proposalWindow = window.open(fileURL, pdfName);
                      // proposalWindow.document.title = pdfName;

                      // var newWindow = window.open(newdata, "_blank");
                      // newWindow.document.title = "Some title";

                      const data = window.URL.createObjectURL(file);
                      var link = document.createElement('a');
                      link.href = data;
                      link.download = pdfName;
                      link.click();

                      // alert('SOP was saved');
                      clearAll(); // to avoid saving the same doc

                    } else {
                      console.log('Somethings worng @getProposalPDF:', getProposalPDF.status);
                    }

                  }
                } else {
                  console.log('Somethings worng 2:', requestSave.status);
                }


              }
            }
          } else {

            let pageArray = [];

            // push TOP details
            pageArray.push(isFresh);
            pageArray.push(docName);
            pageArray.push(bLower);
            pageArray.push(bUpper);
            // push All SOP details
            pageArray.push(institution);
            pageArray.push(instructor);
            pageArray.push(pNumber);
            pageArray.push(pDescription);
            pageArray.push(estimate);
            pageArray.push(uPrice);
            pageArray.push(uShip);
            // push labs
            pageArray.push(txt);
            pageArray.push(notes);
            pageArray.push(state);

            // make a backend call to server to persist all the details. Note that the endpoint is different for admin and sales page.

            var requestSave = new XMLHttpRequest();
            requestSave.open('post', `/ckp2/save`, true);
            requestSave.setRequestHeader('x-auth', token);
            requestSave.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

            requestSave.send(`sSOP=${encodeURIComponent(JSON.stringify(pageArray))}`);
            requestSave.onload = function () {
              // --- please add one more partial route to save the cost and removed contents, in this res.send = objectID

              if (requestSave.status === 200) {
                // console.log("data:", this.response);

                let proposalID = JSON.parse(this.response);

                // console.log(proposalID);

                let getProposalPDF = new XMLHttpRequest();
                getProposalPDF.open('get', `/ckpPDF/${proposalID}`, true);
                getProposalPDF.setRequestHeader('x-auth', token);
                getProposalPDF.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

                getProposalPDF.send();
                getProposalPDF.onload = function () {

                  if (getProposalPDF.status === 200) {

                    // console.log('data:', JSON.parse(this.response));
                    let pdfData = JSON.parse(this.response);

                    let pdfName = getProposalPDF.getResponseHeader('Content-Disposition');

                    // console.log(pdfName);

                    let file = new Blob([new Uint8Array(pdfData.data)], {
                      type: 'application/pdf'
                    });
                    // let fileURL = URL.createObjectURL(file);
                    // let proposalWindow = window.open(fileURL, pdfName);
                    // proposalWindow.document.title = pdfName;

                    // var newWindow = window.open(newdata, "_blank");
                    // newWindow.document.title = "Some title";

                    const data = window.URL.createObjectURL(file);
                    var link = document.createElement('a');
                    link.href = data;
                    link.download = pdfName;
                    link.click();

                    // alert('SOP was saved');
                    clearAll(); // to avoid saving the same doc

                  } else {
                    console.log('Somethings worng @getProposalPDF:', getProposalPDF.status);
                  }

                }
              } else {
                console.log('Somethings worng 2:', requestSave.status);
              }
            }
          }
        }
      } else {
        alert('something is broken, please contact IT');
      }
    }
  }
}

// below section handles the functionality of the checkbox events. In order to move checked lab into cart

let checkbox = document.querySelectorAll('[type="checkbox"]');

// Event Listener:
let m;
for (m = 0; m < checkbox.length; m++) {
  checkbox[m].addEventListener('change', function (event) {
    // console.log(this.value);
    if (this.value.split('-').length > 1) {
      if (this.value.split('-')[1].startsWith('v')) {
        // console.log('version');
        document.querySelector('.price_projected_1--value').textContent = "";
        document.querySelector('.price_projected_2--value').textContent = "";
        if (this.checked) {

          // function to move the lab to the cart
          moveLabToCart();

        } else {
          document.querySelector('.cart_list').textContent = '';
          clearCheckBoxes();
        }
      } else {
        // console.log('plain');
        document.querySelector('.price_projected_1--value').textContent = "";
        document.querySelector('.price_projected_2--value').textContent = "";
        // function to move the lab to the cart
        moveLabToCart();

      }
    }
  });
}

function moveLabToCart() {

  let labsMap = new Map([

    ["gp-1", "General Physics $$$ Introduction to Science"],
    ["gp-2", "General Physics $$$ General Lab Safety"],
    ["gp-3", "General Physics $$$ Measurements and Uncertainty"],
    ["gp-4", "General Physics $$$ 1-D Kinematics"],
    ["gp-5", "General Physics $$$ 2-D Kinematics and Projectile Motion"],
    ["gp-6", "General Physics $$$ Newton’s Laws"],
    ["gp-7", "General Physics $$$ Circular Motion"],
    ["gp-8", "General Physics $$$ Gravity"],
    ["gp-9", "General Physics $$$ Conservation of Energy"],
    ["gp-10", "General Physics $$$ Conservation of Momentum"],
    ["gp-11", "General Physics $$$ Torque and Static Equilibrium"],
    ["gp-12", "General Physics $$$ Buoyant Force and Archimedes Principle"],
    ["gp-13", "General Physics $$$ Simple Harmonic Motion"],
    ["gp-14", "General Physics $$$ Properties of Waves"],
    ["gp-15", "General Physics $$$ Ideal Gas Law"],
    ["gp-16", "General Physics $$$ First Law of Thermodynamics"],
    ["gp-17", "General Physics $$$ Second Law of Thermodynamics and Entropy"],
    ["gp-18", "General Physics $$$ Electric Charge and Coulomb’s Law"],
    ["gp-19", "General Physics $$$ Electric Field and Potential"],
    ["gp-20", "General Physics $$$ Gauss’s Law"],
    ["gp-21", "General Physics $$$ Capacitance"],
    ["gp-22", "General Physics $$$ Resistivity and Ohm’s Law"],
    ["gp-23", "General Physics $$$ Kirchhoff’s Laws"],
    ["gp-24", "General Physics $$$ Magnetic Forces and Fields"],
    ["gp-25", "General Physics $$$ Faraday’s Law"],
    ["gp-26", "General Physics $$$ Snell’s Law and Total Internal Reflection"],
    ["gp-27", "General Physics $$$ Interference"],
    ["gp-28", "General Physics $$$ Geometric Optics, Ray Tracing, and Image Formation"],

    ["gc-1", "2E General Chemistry $$$ Introduction to Science"],
    ["gc-2", "2E General Chemistry $$$ General Chemistry Lab Safety"],
    ["gc-3", "2E General Chemistry $$$ Chemical Nomenclature"],
    ["gc-4", "2E General Chemistry $$$ Compound Formulas"],
    ["gc-5", "2E General Chemistry $$$ Qualitative Analysis of Reactions"],
    ["gc-6", "2E General Chemistry $$$ Electron Configuration"],
    ["gc-7", "2E General Chemistry $$$ Chemical Bonding"],
    ["gc-8", "2E General Chemistry $$$ Gas Laws"],
    ["gc-9", "2E General Chemistry $$$ Enthalpy and Specific Heat"],
    ["gc-10", "2E General Chemistry $$$ Acid-Base Titrations"],
    ["gc-11", "2E General Chemistry $$$ Gravimetric Analysis"],
    ["gc-12", "2E General Chemistry $$$ Molar Mass and Freezing Point Depression"],
    ["gc-13", "2E General Chemistry $$$ Molar Volume of Gases"],
    ["gc-14", "2E General Chemistry $$$ Molar Mass and Vapor Density"],
    ["gc-15", "2E General Chemistry $$$ Nuclear Chemistry"],
    ["gc-16", "2E General Chemistry $$$ Reaction Rates"],
    ["gc-17", "2E General Chemistry $$$ Equilibrium Constants"],
    ["gc-18", "2E General Chemistry $$$ Preparation of Buffer Solutions"],
    ["gc-19", "2E General Chemistry $$$ Standardization of a Solution"],
    ["gc-20", "2E General Chemistry $$$ Titration Indicators"],
    ["gc-21", "2E General Chemistry $$$ Oxidation-Reduction Reactions"],
    ["gc-22", "2E General Chemistry $$$ Separation by Chromatography"],
    ["gc-23", "2E General Chemistry $$$ Electrochemical Series"],
    ["gc-24", "2E General Chemistry $$$ Electrochemical Cells"],
    ["gc-25", "2E General Chemistry $$$ Organic Compounds"],
    ["gc-26", "2E General Chemistry $$$ Coordination Compounds and Isomers"],

    ["ib-1", "2E Intro. Biology $$$ Introduction to Science"],
    ["ib-2", "2E Intro. Biology $$$ General Lab Safety"],
    ["ib-3", "2E Intro. Biology $$$ Chemical Bonding Fundamentals"],
    ["ib-4", "2E Intro. Biology $$$ Introduction to the Microscope"],
    ["ib-5", "2E Intro. Biology $$$ The Chemistry of Life"],
    ["ib-6", "2E Intro. Biology $$$ Diffusion"],
    ["ib-7", "2E Intro. Biology $$$ Osmosis"],
    ["ib-8", "2E Intro. Biology $$$ Enzymes"],
    ["ib-9", "2E Intro. Biology $$$ Cellular Respiration"],
    ["ib-10", "2E Intro. Biology $$$ Cell Structure and Function"],
    ["ib-11", "2E Intro. Biology $$$ Mitosis"],
    ["ib-12", "2E Intro. Biology $$$ Meiosis"],
    ["ib-13", "2E Intro. Biology $$$ DNA and RNA"],
    ["ib-14", "2E Intro. Biology $$$ Mendelian Genetics"],
    ["ib-15", "2E Intro. Biology $$$ Population Genetics"],
    ["ib-16", "2E Intro. Biology $$$ Taxonomy"],
    ["ib-17", "2E Intro. Biology $$$ Bacteria and Archaea"],
    ["ib-18", "2E Intro. Biology $$$ Protista"],
    ["ib-19", "2E Intro. Biology $$$ Fungi"],
    ["ib-20", "2E Intro. Biology $$$ Energy and Photosynthesis"],
    ["ib-21", "2E Intro. Biology $$$ Plant Circulation"],
    ["ib-22", "2E Intro. Biology $$$ Plant Reproduction"],
    ["ib-23", "2E Intro. Biology $$$ Invertebrates and Vertebrates"],
    ["ib-24", "2E Intro. Biology $$$ Animal Structure"],
    ["ib-25", "2E Intro. Biology $$$ The Circulatory and Respiratory Systems"],
    ["ib-26", "2E Intro. Biology $$$ The Sensory and Nervous Systems"],
    ["ib-27", "2E Intro. Biology $$$ Ecology of Organisms"],
    ["ib-28", "2E Intro. Biology $$$ Ecological Interactions"],

    ["ap-1", "2E Anatomy & Physiology $$$ Introduction to Science"],
    ["ap-2", "2E Anatomy & Physiology $$$ Cell Structure and Function"],
    ["ap-3", "2E Anatomy & Physiology $$$ Mitosis and Meiosis"],
    ["ap-4", "2E Anatomy & Physiology $$$ Diffusion and Osmosis"],
    ["ap-5", "2E Anatomy & Physiology $$$ Tissues and Skin"],
    ["ap-6", "2E Anatomy & Physiology $$$ The Skeletal System"],
    ["ap-7", "2E Anatomy & Physiology $$$ The Muscular System"],
    ["ap-8", "2E Anatomy & Physiology $$$ The Nervous System"],
    ["ap-9", "2E Anatomy & Physiology $$$ The Endocrine System"],
    ["ap-10", "2E Anatomy & Physiology $$$ Blood and the Heart"],
    ["ap-11", "2E Anatomy & Physiology $$$ The Circulatory System"],
    ["ap-12", "2E Anatomy & Physiology $$$ The Lymphatic System and Immunity"],
    ["ap-13", "2E Anatomy & Physiology $$$ The Respiratory System"],
    ["ap-14", "2E Anatomy & Physiology $$$ The Urinary System"],
    ["ap-15", "2E Anatomy & Physiology $$$ Electrolytes, Water, Acids & Bases"],
    ["ap-16", "2E Anatomy & Physiology $$$ The Digestive System"],
    ["ap-17", "2E Anatomy & Physiology $$$ Nutrition"],
    ["ap-18", "2E Anatomy & Physiology $$$ The Reproductive System"],

    ["mb-1", "2E Microbiology $$$ Introduction to Science"],
    ["mb-2", "2E Microbiology $$$ Microbiology Lab Safety"],
    ["mb-3", "2E Microbiology $$$ Introduction to the Microscope"],
    ["mb-4", "2E Microbiology $$$ Introduction to Culturing and Aseptic Technique"],
    ["mb-5", "2E Microbiology $$$ Structure and Microscopy"],
    ["mb-6", "2E Microbiology $$$ Growth of Microorganisms"],
    ["mb-7", "2E Microbiology $$$ Quantitation of Cultured Microorganisms"],
    ["mb-8", "2E Microbiology $$$ Selective Media and Agar"],
    ["mb-9", "2E Microbiology $$$ Differential and Biochemical Tests"],
    ["mb-10", "2E Microbiology $$$ Eukaryotic Microbes,Parasitology, and Viruses"],
    ["mb-11", "2E Microbiology $$$ Food Microbiology"],
    ["mb-12", "2E Microbiology $$$ Environmental Microbiology and Water Quality"],
    ["mb-13", "2E Microbiology $$$ Microbial Genetics and Genetic Engineering"],

    ["ic-1", "2E Intro. Chemistry $$$ Laboratory Safety and Procedures"],
    ["ic-2", "2E Intro. Chemistry $$$ Thinking Like a Chemist: The Scientific Method"],
    ["ic-3", "2E Intro. Chemistry $$$ Data Analysis and Graphing"],
    ["ic-4", "2E Intro. Chemistry $$$ Types of Matter"],
    ["ic-5", "2E Intro. Chemistry $$$ Exploring Solubility"],
    ["ic-6", "2E Intro. Chemistry $$$ Examination of Physical and Chemical Properties"],
    ["ic-7", "2E Intro. Chemistry $$$ Measuring Heats of Reactions"],
    ["ic-8", "2E Intro. Chemistry $$$ Distinguishing Between Endothermic and Exothermic Reactions"],
    ["ic-9", "2E Intro. Chemistry $$$ Electron Configuration"],
    ["ic-10", "2E Intro. Chemistry $$$ Electromagnetic Radiation"],
    ["ic-11", "2E Intro. Chemistry $$$ Molecular Geometry: The VSEPR Mode"],
    ["ic-12", "2E Intro. Chemistry $$$ Types of Chemical Bonds"],
    ["ic-13", "2E Intro. Chemistry $$$ Bond Polarity and Dipole Moments"],
    ["ic-14", "2E Intro. Chemistry $$$ Evaluating Precipitation Reactions"],
    ["ic-15", "2E Intro. Chemistry $$$ Types of Chemical Reactions"],
    ["ic-16", "2E Intro. Chemistry $$$ Oxidation-Reduction Reactions"],
    ["ic-17", "2E Intro. Chemistry $$$ Molar Mass"],
    ["ic-18", "2E Intro. Chemistry $$$ Periodic Trends in Atomic Properties"],
    ["ic-19", "2E Intro. Chemistry $$$ Stoichiometric Calculations:Reactants and Products"],
    ["ic-20", "2E Intro. Chemistry $$$ Using the Ideal Gas Law"],
    ["ic-21", "2E Intro. Chemistry $$$ Exploring Reaction Rates"],
    ["ic-22", "2E Intro. Chemistry $$$ Chemical Kinetics and Catalysis"],
    ["ic-23", "2E Intro. Chemistry $$$ The Nature of Acids and Bases:Exploring the pH Scale"],
    ["ic-24", "2E Intro. Chemistry $$$ Titrations and Equivalence Points"],

    ["as-1", "Astronomy $$$ The Scientific Method"],
    ["as-2", "Astronomy $$$ Units and Signifcant Figures"],
    ["as-3", "Astronomy $$$ Observing the Night Sky"],
    ["as-4", "Astronomy $$$ The Scale of the Solar System"],
    ["as-5", "Astronomy $$$ Our Place in the Universe"],
    ["as-6", "Astronomy $$$ The Sun and The Moon"],
    ["as-7", "Astronomy $$$ Parallax"],
    ["as-8", "Astronomy $$$ Orbital Motion"],
    ["as-9", "Astronomy $$$ Planetary Rotation"],
    ["as-10", "Astronomy $$$ Gravity"],
    ["as-11", "Astronomy $$$ The Electromagnetic Spectrum"],
    ["as-12", "Astronomy $$$ The Doppler Effect"],

    ["gb-1", "2E General Biology $$$ Introduction to Science"],
    ["gb-2", "2E General Biology $$$ General Lab Safety"],
    ["gb-3", "2E General Biology $$$ Chemical Bonding Fundamentals"],
    ["gb-4", "2E General Biology $$$ Introduction to the Microscope"],
    ["gb-5", "2E General Biology $$$ The Chemistry of Life"],
    ["gb-6", "2E General Biology $$$ Diffusion and Osmosis"],
    ["gb-7", "2E General Biology $$$ Enzyme Catalysis"],
    ["gb-8", "2E General Biology $$$ Metabolism"],
    ["gb-9", "2E General Biology $$$ Hierarchies of Life"],
    ["gb-10", "2E General Biology $$$ Unicellular Organisms"],
    ["gb-11", "2E General Biology $$$ Mitosis and Meiosis"],
    ["gb-12", "2E General Biology $$$ Transcription and Translation"],
    ["gb-13", "2E General Biology $$$ Genetics of Organisms"],
    ["gb-14", "2E General Biology $$$ Biomolecular Techniques"],
    ["gb-15", "2E General Biology $$$ Plant Pigments and Photosynthesis"],
    ["gb-16", "2E General Biology $$$ Plant Transpiration"],
    ["gb-17", "2E General Biology $$$ Plant Reproduction"],
    ["gb-18", "2E General Biology $$$ Mammalian Homeostasis"],
    ["gb-19", "2E General Biology $$$ Invertebrates"],
    ["gb-20", "2E General Biology $$$ Vertebrates"],
    ["gb-21", "2E General Biology $$$ Animal Behavior and Zoology"],
    ["gb-22", "2E General Biology $$$ Ecology of Organisms"],
    ["gb-23", "2E General Biology $$$ Ecological Interactions"],
    ["gb-24", "2E General Biology $$$ Environmental Succession"],

    ["es-1", "3E Environmental Science $$$ Introduction to Science"],
    ["es-2", "3E Environmental Science $$$ Scientific Measurements"],
    ["es-3", "3E Environmental Science $$$ Ecosystems"],
    ["es-4", "3E Environmental Science $$$ Ecology of Organisms"],
    ["es-5", "3E Environmental Science $$$ Biodiversity"],
    ["es-6", "3E Environmental Science $$$ Population Biology"],
    ["es-7", "3E Environmental Science $$$ Rock and Mineral Resources"],
    ["es-8", "3E Environmental Science $$$ Soil Quality and Contamination"],
    ["es-9", "3E Environmental Science $$$ Oceans and Coasts"],
    ["es-10", "3E Environmental Science $$$ Water Quality and Contamination"],
    ["es-11", "3E Environmental Science $$$ Weather and The Atmosphere"],
    ["es-12", "3E Environmental Science $$$ Air Quality and Contamination"],
    ["es-13", "3E Environmental Science $$$ Climate Change"],
    ["es-14", "3E Environmental Science $$$ Energy Resources"],

    ["fs-1", "Forensics $$$ Evidence and Crime Scenes"],
    ["fs-2", "Forensics $$$ Fingerprinting"],
    ["fs-3", "Forensics $$$ DNA"],
    ["fs-4", "Forensics $$$ Blood"],
    ["fs-5", "Forensics $$$ Fiber and Hair"],
    ["fs-6", "Forensics $$$ Impression Evidence: Shoes, Tires, Tools"],
    ["fs-7", "Forensics $$$ Fractography and Glass"],
    ["fs-8", "Forensics $$$ Autopsy and Time of Death"],
    ["fs-9", "Forensics $$$ Body Identification"],
    ["fs-10", "Forensics $$$ Questioned Documents"],
    ["fs-11", "Forensics $$$ Arson"],
    ["fs-12", "Forensics $$$ Toxicology"],
    ["fs-13", "Forensics $$$ Firearms"],

    ["ip-1", "2E Intro. Physics $$$ Introduction to Science"],
    ["ip-2", "2E Intro. Physics $$$ General Lab Safety"],
    ["ip-3", "2E Intro. Physics $$$ Measurements and Uncertainty"],
    ["ip-4", "2E Intro. Physics $$$ 1-D Kinematics"],
    ["ip-5", "2E Intro. Physics $$$ 2-D Kinematics and Projectile Motion"],
    ["ip-6", "2E Intro. Physics $$$ Newton’s Laws"],
    ["ip-7", "2E Intro. Physics $$$ Friction"],
    ["ip-8", "2E Intro. Physics $$$ Circular Motion"],
    ["ip-9", "2E Intro. Physics $$$ Gravity"],
    ["ip-10", "2E Intro. Physics $$$ Conservation of Energy"],
    ["ip-11", "2E Intro. Physics $$$ Conservation of Momentum"],
    ["ip-12", "2E Intro. Physics $$$ Center of Mass"],
    ["ip-13", "2E Intro. Physics $$$ Buoyant Force and Archimedes Principle"],
    ["ip-14", "2E Intro. Physics $$$ Properties of Waves"],
    ["ip-15", "2E Intro. Physics $$$ Ideal Gas Law"],
    ["ip-16", "2E Intro. Physics $$$ Latent Heat and Specific Heat"],
    ["ip-17", "2E Intro. Physics $$$ First Law of Thermodynamics"],
    ["ip-18", "2E Intro. Physics $$$ Second Law of Thermodynamics and Entropy"],
    ["ip-19", "2E Intro. Physics $$$ Electric Charge and Coulomb’s Law"],
    ["ip-20", "2E Intro. Physics $$$ Electric Field and Potential"],
    ["ip-21", "2E Intro. Physics $$$ Capacitance"],
    ["ip-22", "2E Intro. Physics $$$ Resistivity and Ohm’s Law"],
    ["ip-23", "2E Intro. Physics $$$ Magnetic Forces and Fields"],
    ["ip-24", "2E Intro. Physics $$$ Snell’s Law and Total Internal Reflection"],
    ["ip-25", "2E Intro. Physics $$$ Interference"],
    ["ip-26", "2E Intro. Physics $$$ Geometric Optics, Ray Tracing, and Image Formation"],
    ["ip-27", "2E Intro. Physics $$$ Ecology of Organisms"],
    ["ip-28", "2E Intro. Physics $$$ Ecological Interactions"],

    ["hb-1", "2E Human Biology $$$ Introduction to Science"],
    ["hb-2", "2E Human Biology $$$ Basic Biochemistry"],
    ["hb-3", "2E Human Biology $$$ Cellular Anatomy and Physiology"],
    ["hb-4", "2E Human Biology $$$ Metabolism"],
    ["hb-5", "2E Human Biology $$$ Cellular Reproduction"],
    ["hb-6", "2E Human Biology $$$ Human Molecular Genetics"],
    ["hb-7", "2E Human Biology $$$ Population Genetics and Evolution"],
    ["hb-8", "2E Human Biology $$$ Anatomical Orientation"],
    ["hb-9", "2E Human Biology $$$ Developmental Biology"],
    ["hb-10", "2E Human Biology $$$ Sensory and The Nervous System"],
    ["hb-11", "2E Human Biology $$$ The Musculoskeletal System"],
    ["hb-12", "2E Human Biology $$$ The Cardiovascular System"],
    ["hb-13", "2E Human Biology $$$ The Excretory System"],
    ["hb-14", "2E Human Biology $$$ Nutrition"],
    ["hb-15", "2E Human Biology $$$ Immunology"],
    ["hb-16", "2E Human Biology $$$ Aging and Disease"],

    ["hg-1", "Historical Geology $$$ Introduction to Science"],
    ["hg-2", "Historical Geology $$$ Geologic Time and the Solar System"],
    ["hg-3", "Historical Geology $$$ Geologic Dating: Absolute and Relative"],
    ["hg-4", "Historical Geology $$$ Earth Materials and Sedimentary Rocks"],
    ["hg-5", "Historical Geology $$$ Weathering and Sediment Formation"],
    ["hg-6", "Historical Geology $$$ Environments of Deposition"],
    ["hg-7", "Historical Geology $$$ Stratigraphic Correlations"],
    ["hg-8", "Historical Geology $$$ Fossilization"],
    ["hg-9", "Historical Geology $$$ Fossil Identification"],
    ["hg-10", "Historical Geology $$$ Map Reading"],
    ["hg-11", "Historical Geology $$$ Geologic Maps"],
    ["hg-12", "Historical Geology $$$ Plate Tectonics"],
    ["hg-13", "Historical Geology $$$ Evolution"],
    ["hg-14", "Historical Geology $$$ Fossil Fuels"],
    ["hg-15", "Historical Geology $$$ Transgressions and Regressions"],

    ["sg-1", "2E Physical Geology Standard $$$ Building a Planet"],
    ["sg-2", "2E Physical Geology Standard $$$ Plate Tectonics and Earthquakes"],
    ["sg-3", "2E Physical Geology Standard $$$ Minerals"],
    ["sg-4", "2E Physical Geology Standard $$$ Igneous Rocks"],
    ["sg-5", "2E Physical Geology Standard $$$ Sedimentary Rocks"],
    ["sg-6", "2E Physical Geology Standard $$$ Metamorphic Rocks"],
    ["sg-7", "2E Physical Geology Standard $$$ Geologic Dating and Fossilization"],
    ["sg-8", "2E Physical Geology Standard $$$ Weathering and Erosion"],
    ["sg-9", "2E Physical Geology Standard $$$ Groundwater"],
    ["sg-10", "2E Physical Geology Standard $$$ Fluvial Processes and Landforms"],
    ["sg-11", "2E Physical Geology Standard $$$ Wind Processes and Landforms"],
    ["sg-12", "2E Physical Geology Standard $$$ Glacial Processes and Landforms"],
    ["sg-13", "2E Physical Geology Standard $$$ Topographic Maps"],
    ["sg-14", "2E Physical Geology Standard $$$ Geologic Maps"],
    ["sg-15", "2E Physical Geology Standard $$$ Earth’s Mineral and Energy Resources"],

    ["bg-1", "2E Physical Geology Basic $$$ Plate Tectonics and Earthquakes"],
    ["bg-2", "2E Physical Geology Basic $$$ Minerals"],
    ["bg-3", "2E Physical Geology Basic $$$ Igneous Rocks"],
    ["bg-4", "2E Physical Geology Basic $$$ Sedimentary Rocks"],
    ["bg-5", "2E Physical Geology Basic $$$ Metamorphic Rocks"],
    ["bg-6", "2E Physical Geology Basic $$$ Weathering and Erosion"],
    ["bg-7", "2E Physical Geology Basic $$$ Geologic Dating"],
    ["bg-8", "2E Physical Geology Basic $$$ Mapping"],

    ["rm-1", "2E Physical Geology Rocks & Mineral $$$ Plate Tectonics and Earthquakes"],
    ["rm-2", "2E Physical Geology Rocks & Mineral $$$ Minerals"],
    ["rm-3", "2E Physical Geology Rocks & Mineral $$$ Igneous Rocks"],
    ["rm-4", "2E Physical Geology Rocks & Mineral $$$ Sedimentary Rocks"],
    ["rm-5", "2E Physical Geology Rocks & Mineral $$$ Metamorphic Rocks"],

    ["pt-1", "Pharmacy Technician $$$ Measurement"],
    ["pt-2", "Pharmacy Technician $$$ Equipment Practice"],
    ["pt-3", "Pharmacy Technician $$$ Compounding"],
    ["pt-4", "Pharmacy Technician $$$ Emulsions and Elixirs"],
    ["pt-5", "Pharmacy Technician $$$ Labeling and Packing"],
    ["pt-6", "Pharmacy Technician $$$ Preparing Investigational Drugs"],

    ["ob-1", "General, Organic, and Biochemistry $$$ Chemistry Lab Safety"],
    ["ob-2", "General, Organic, and Biochemistry $$$ Introduction to Sciencee"],
    ["ob-3", "General, Organic, and Biochemistry $$$ Types of Matter"],
    ["ob-4", "General, Organic, and Biochemistry $$$ Physical and chemical properties"],
    ["ob-5", "General, Organic, and Biochemistry $$$ Enthalpy and Specific Heat"],
    ["ob-6", "General, Organic, and Biochemistry $$$ Molecular Geometry"],
    ["ob-7", "General, Organic, and Biochemistry $$$ Chemical Bonds"],
    ["ob-8", "General, Organic, and Biochemistry $$$ Types of Chemical Reactions"],
    ["ob-9", "General, Organic, and Biochemistry $$$ Molar Mass"],
    ["ob-10", "General, Organic, and Biochemistry $$$ Stoichiometry"],
    ["ob-11", "General, Organic, and Biochemistry $$$ The Ideal Gas Law"],
    ["ob-12", "General, Organic, and Biochemistry $$$ Acids and Bases"],
    ["ob-13", "General, Organic, and Biochemistry $$$ Reaction Rates"],
    ["ob-14", "General, Organic, and Biochemistry $$$ Chromatography"],
    ["ob-15", "General, Organic, and Biochemistry $$$ Diffusion and Osmosis"],
    ["ob-16", "General, Organic, and Biochemistry $$$ Organic Chemical Nomenclature"],
    ["ob-17", "General, Organic, and Biochemistry $$$ Hydrocarbons"],
    ["ob-18", "General, Organic, and Biochemistry $$$ Stereochemistry"],
    ["ob-19", "General, Organic, and Biochemistry $$$ Esters and Alcohols"],
    ["ob-20", "General, Organic, and Biochemistry $$$ Aspirin Analysis"],
    ["ob-21", "General, Organic, and Biochemistry $$$ Saponification"],
    ["ob-22", "General, Organic, and Biochemistry $$$ Antioxidant Analysis"],
    ["ob-23", "General, Organic, and Biochemistry $$$ The Chemistry of Life"],
    ["ob-24", "General, Organic, and Biochemistry $$$ Isoelectric Point Titration"],
    ["ob-25", "General, Organic, and Biochemistry $$$ Protein Isolation"],
    ["ob-26", "General, Organic, and Biochemistry $$$ Enzyme Catalysis"],

  ]);

  let cartArray = [];
  let cartLabs = new Map();
  let v;
  for (v = 0; v < checkbox.length; v++) {
    if (checkbox[v].value.split('-').length > 1) {
      if (checkbox[v].checked && !checkbox[v].value.split('-')[1].startsWith('v') && !checkbox[v].value.split('-')[1].startsWith('d')) {
        cartArray.push(checkbox[v].value);
      }
    }
  }

  document.querySelector('.labCounts--value').textContent = `${cartArray.length} Labs`;

  // console.log('cartArray:', cartArray);

  cartArray.forEach(lab => {
    cartLabs.set(lab, labsMap.get(lab));
  });

  // console.log('cartLabs:', cartLabs);

  let distinctSubjects = [...new Set(cartArray.map(x => x.split('-')[0]))];

  // console.log('distinctSubjects:', distinctSubjects);

  let allKeys = Array.from(cartLabs.keys());

  // console.log('allKeys:', allKeys);
  document.querySelector('.cart_list').textContent = '';
  distinctSubjects.forEach(sub => {

    let thisSubject = [];

    thisSubject = allKeys.filter(function (key) {
      return key.split('-')[0] == sub;
    });

    // console.log(`${sub} : ${thisSubject}`);

    // HTML 
    // let parentHTML = '<h2 <button class="collapsible"><span class="icon-up"></span> %SUBJECT%</button></h2>';
    // below html has collapsible but it fails 
    let parentHTML = '<h2 <button class="collapsibleCart"><span class="icon-up"></span> %SUBJECT%</button></h2><div class="content">';
    // HTML
    let HTML = parentHTML.replace('%SUBJECT%', cartLabs.get(thisSubject[0]).split('$$$')[0].trim());
    thisSubject.forEach(key => {
      let childHTML = '<div class="lab clearfix" id="%KEY%"><div class="labName">%VALUE%</div><div class="right clearfix"><div class="lab_delete"><button onclick="labDelete(this)" class="lab_delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      let tempHTML = childHTML.replace('%KEY%', key);
      tempHTML = tempHTML.replace('%VALUE%', `Lab ${key.split('-')[1]}: ${cartLabs.get(key).split('$$$')[1].trim()}`);

      HTML = HTML + tempHTML;
      // console.log(`${key}: ${cartLabs.get(key)}`);
    });

    // below html has collapsible but it fails 
    HTML = HTML + '</div>';
    // console.log('END OF ONE SUBJECT');

    // Insert the HTML into the DOM
    document.querySelector('.cart_list').insertAdjacentHTML('beforeend', HTML);

  });
  collapseCart();

}

function labDelete(lab) {
  labToUncheck = lab.parentElement.parentElement.parentElement.id;
  // console.log(labToUncheck);
  // console.log(document.getElementById(labToUncheck));

  document.getElementById(labToUncheck).checked = false;

  let subs = [];
  subs.push('kitVersion', 'ap', 'as', 'es', 'fs', 'gb', 'gc', 'gp', 'hb', 'hg', 'ib', 'ic', 'ip', 'mb', 'sg', 'bg', 'rm', 'pt', 'ob');
  subs.forEach((sub) => {
    let checkbox = document.getElementsByName(sub);
    checkbox.forEach((element) => {
      // remove standard version for that particular subject
      if (element.id.split('-')[1].startsWith('v') && element.id.split('-')[0].startsWith(`${labToUncheck.split('-')[0]}`)) {
        element.checked = false;
      }
    });
  });

  document.querySelector('.price_projected_1--value').textContent = "";
  document.querySelector('.price_projected_2--value').textContent = "";
  moveLabToCart();
}

/* --------------------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------ $$              indexCalculator.html            $$ -------------------------------------------------
---------------------------------------------------------------------------------------------------------------------------------------------------*/