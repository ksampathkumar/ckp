// CUSTOM KIT PRICING //

/* --------------------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------ $$              indexCalculator.html            $$ -------------------------------------------------
---------------------------------------------------------------------------------------------------------------------------------------------------*/

// ******** Static to Dynamic page ******* //

let validateRequest = new XMLHttpRequest();
validateRequest.open('post', '/validate2', true);
let token = localStorage.getItem('x-auth_token');
validateRequest.setRequestHeader('x-auth', token);

validateRequest.onload = function () {

  if (validateRequest.status === 200) {
    let userDets = JSON.parse(this.response);
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

// Collapsible Menu Navigator //
var coll = document.getElementsByClassName("collapsible");
var i;

for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function () {
    this.classList.toggle("active");
    var content = this.nextElementSibling;
    if (content.style.display === "block") {
      content.style.display = "none";
    } else {
      content.style.display = "block";
    }
  });
}

var coll = document.getElementsByClassName("collapsible2");
var i;

for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function () {
    this.classList.toggle("active");
    var content = this.nextElementSibling;
    if (content.style.display === "block") {
      content.style.display = "none";
    } else {
      content.style.display = "block";
    }
  });
}
// Collapsible Menu Navigator //

function generateLabString() {

  // Getting Selected Labs
  let txt = "";

  let subs = [];
  subs.push('ap', 'as', 'es', 'fs', 'gb', 'gc', 'gp', 'hb', 'hg', 'ib', 'ic', 'ip', 'mb', 'gs', 'gb', 'rm', 'pt');
  let i;
  subs.forEach((sub) => {
    let id = document.getElementsByName(sub);

    for (i = 0; i < id.length; i++) {
      if (id[i].checked) {
        txt = txt + id[i].value + " ";
      }
    }

  });

  // let txt = gctxt + gptxt + ictxt + ibtxt + aptxt + mbtxt;
  txt = txt.slice(0, -1);
  // Getting Selected Labs

  return txt;

}

// Calculate Button Event //
document.querySelector('.calculateButton').addEventListener('click', () => {

  calcUp();

});

// Calculate or Update Function
function calcUp() {

  if (window.globalData !== undefined) {
    window.globalData = undefined;
  }

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
        document.querySelector(".price_projected_1--value").textContent = data[0];
        document.querySelector(".price_projected_2--value").textContent = data[1];
      } else if (request.status === 406) {
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

// update cost button same as calculate
document.querySelector('.updateCost').addEventListener('click', () => {

  calcUp();

});

// Clear Button Event //
document.querySelector('.clearButton').addEventListener('click', () => {

  // clearing the checkboxes //
  var checkboxesgp = document.getElementsByName('gp');
  checkboxesgp.forEach((element) => element.checked = false);

  var checkboxesgc = document.getElementsByName('gc');
  checkboxesgc.forEach((element) => element.checked = false);


  var checkboxesKitVersion = document.getElementsByName('kitVersion');
  checkboxesKitVersion.forEach((element) => element.checked = false);

  document.querySelector('.price_projected--value').textContent = "0";

  document.getElementById("notes").value = '';

});

// Kit Version selection // 
function kitVersion(element) {
  if (element.checked) {
    switch (element.value) {
      case 'gp-v1':
        var checkbox = document.getElementsByName('gp');
        checkbox.forEach((e) => {
          let lab = parseInt(e.value.split("-")[1], 10);
          if (lab <= 14) {
            e.checked = true;
          }
        });
        break;
      case 'gp-v2':
        var checkbox = document.getElementsByName('gp');
        checkbox.forEach((e) => {
          let lab = parseInt(e.value.split("-")[1], 10);
          if (lab > 14 || lab < 3) {
            e.checked = true;
          }
        });
        break;
      case 'gp-v3':
        var checkbox = document.getElementsByName('gp');
        checkbox.forEach((e) => e.checked = true);
        break;
      case 'gc-v1':
        var checkbox = document.getElementsByName('gc');
        checkbox.forEach((e) => {
          let lab = parseInt(e.value.split("-")[1], 10);
          if (lab <= 14) {
            e.checked = true;
          }
        });
        break;
      case 'gc-v2':
        var checkbox = document.getElementsByName('gc');
        checkbox.forEach((e) => {
          let lab = parseInt(e.value.split("-")[1], 10);
          if (lab > 14 || lab < 4) {
            e.checked = true;
          }
        });
        break;
      case 'gc-v3':
        var checkbox = document.getElementsByName('gc');
        checkbox.forEach((e) => e.checked = true);
        break;

      case 'ib-v1':
        var checkbox = document.getElementsByName('ib');
        checkbox.forEach((e) => {
          let lab = parseInt(e.value.split("-")[1], 10);
          if (lab <= 15) {
            e.checked = true;
          }
        });
        break;
      case 'ib-v2':
        var checkbox = document.getElementsByName('ib');
        checkbox.forEach((e) => {
          let lab = parseInt(e.value.split("-")[1], 10);
          if (lab > 15 || lab < 3) {
            e.checked = true;
          }
        });
        break;
      case 'ib-v3':
        var checkbox = document.getElementsByName('ib');
        checkbox.forEach((e) => e.checked = true);
        break;
      case 'ib-v4':
        var checkbox = document.getElementsByName('ib');
        checkbox.forEach((e) => {
          let lab = parseInt(e.value.split("-")[1], 10);
          if (lab < 3 || lab === 10 || lab === 20 || lab === 11 || lab === 14 || lab === 15 || lab === 27 || lab === 12 || lab === 28) {
            e.checked = true;
          }
        });
        break;

      case 'ap-v1':
        var checkbox = document.getElementsByName('ap');
        checkbox.forEach((e) => {
          let lab = parseInt(e.value.split("-")[1], 10);
          if (lab <= 8) {
            e.checked = true;
          }
        });
        break;
      case 'ap-v2':
        var checkbox = document.getElementsByName('ap');
        checkbox.forEach((e) => {
          let lab = parseInt(e.value.split("-")[1], 10);
          if (lab > 8 || lab < 2) {
            e.checked = true;
          }
        });
        break;
      case 'ap-v3':
        var checkbox = document.getElementsByName('ap');
        checkbox.forEach((e) => e.checked = true);
        break;

      case 'mb-v1':
        var checkbox = document.getElementsByName('mb');
        checkbox.forEach((e) => e.checked = true);
        break;

      case 'ic-v1':
        var checkbox = document.getElementsByName('ic');
        checkbox.forEach((e) => {
          let lab = parseInt(e.value.split("-")[1], 10);
          if (lab <= 13) {
            e.checked = true;
          }
        });
        break;
      case 'ic-v2':
        var checkbox = document.getElementsByName('ic');
        checkbox.forEach((e) => {
          let lab = parseInt(e.value.split("-")[1], 10);
          if (lab > 13 || lab < 3) {
            e.checked = true;
          }
        });
        break;
      case 'ic-v3':
        var checkbox = document.getElementsByName('ic');
        checkbox.forEach((e) => e.checked = true);
        break;
      case 'ic-v4':
        var checkbox = document.getElementsByName('ic');
        checkbox.forEach((e) => {
          let lab = parseInt(e.value.split("-")[1], 10);
          if (lab < 3 || lab === 3 || lab === 17 || lab === 18 || lab === 9 || lab === 11 || lab === 15 || lab === 20 || lab === 23) {
            e.checked = true;
          }
        });
        break;

      case 'gb-v1':
        var checkbox = document.getElementsByName('gb');
        checkbox.forEach((e) => {
          let lab = parseInt(e.value.split("-")[1], 10);
          if (lab <= 14) {
            e.checked = true;
          }
        });
        break;
      case 'gb-v2':
        var checkbox = document.getElementsByName('gb');
        checkbox.forEach((e) => {
          let lab = parseInt(e.value.split("-")[1], 10);
          if (lab > 15 || lab < 3) {
            e.checked = true;
          }
        });
        break;
      case 'gb-v3':
        var checkbox = document.getElementsByName('gb');
        checkbox.forEach((e) => e.checked = true);
        break;

      case 'gp-v1':
        var checkbox = document.getElementsByName('gp');
        checkbox.forEach((e) => {
          let lab = parseInt(e.value.split("-")[1], 10);
          if (lab <= 14) {
            e.checked = true;
          }
        });
        break;
      case 'gp-v2':
        var checkbox = document.getElementsByName('gp');
        checkbox.forEach((e) => {
          let lab = parseInt(e.value.split("-")[1], 10);
          if (lab > 15 || lab < 3) {
            e.checked = true;
          }
        });
        break;
      case 'gp-v3':
        var checkbox = document.getElementsByName('gp');
        checkbox.forEach((e) => e.checked = true);
        break;

      case 'ip-v1':
        var checkbox = document.getElementsByName('ip');
        checkbox.forEach((e) => {
          let lab = parseInt(e.value.split("-")[1], 10);
          if (lab <= 13) {
            e.checked = true;
          }
        });
        break;
      case 'ip-v2':
        var checkbox = document.getElementsByName('ip');
        checkbox.forEach((e) => {
          let lab = parseInt(e.value.split("-")[1], 10);
          if (lab > 13 || lab < 3) {
            e.checked = true;
          }
        });
        break;
      case 'ip-v3':
        var checkbox = document.getElementsByName('ip');
        checkbox.forEach((e) => e.checked = true);
        break;
      case 'ip-v4':
        var checkbox = document.getElementsByName('ip');
        checkbox.forEach((e) => {
          let lab = parseInt(e.value.split("-")[1], 10);
          if (lab === 1 || lab === 3 || lab === 4 || lab === 5 || lab === 6 || lab === 7 || lab === 10 || lab === 11 || lab === 15 || lab === 16 || lab === 26) {
            e.checked = true;
          }
        });
        break;

      case 'as-v1':
        var checkbox = document.getElementsByName('as');
        checkbox.forEach((e) => e.checked = true);
        break;

      case 'es-v1':
        var checkbox = document.getElementsByName('es');
        checkbox.forEach((e) => e.checked = true);
        break;

      case 'fs-v1':
        var checkbox = document.getElementsByName('fs');
        checkbox.forEach((e) => e.checked = true);
        break;

      case 'hb-v1':
        var checkbox = document.getElementsByName('hb');
        checkbox.forEach((e) => e.checked = true);
        break;

      case 'hg-v1':
        var checkbox = document.getElementsByName('hg');
        checkbox.forEach((e) => e.checked = true);
        break;

      case 'sg-v1':
        var checkbox = document.getElementsByName('sg');
        checkbox.forEach((e) => e.checked = true);
        break;

      case 'bg-v1':
        var checkbox = document.getElementsByName('bg');
        checkbox.forEach((e) => e.checked = true);
        break;

      case 'rm-v1':
        var checkbox = document.getElementsByName('rm');
        checkbox.forEach((e) => e.checked = true);
        break;

      case 'pt-v1':
        var checkbox = document.getElementsByName('pt');
        checkbox.forEach((e) => e.checked = true);
        break;

      default:
    }
  } else {

    clearCheckBoxes();

  }
}

// Clear Check Boxes //
function clearCheckBoxes() {

  // clearing the checkboxes //

  let subs = [];
  subs.push('kitVersion', 'ap', 'as', 'es', 'fs', 'gb', 'gc', 'gp', 'hb', 'hg', 'ib', 'ic', 'ip', 'mb', 'gs', 'gb', 'rm', 'pt');
  subs.forEach((sub) => {
    let checkbox = document.getElementsByName(sub);
    checkbox.forEach((element) => element.checked = false);
  });
}

function checkAllBoxes() {

  // clearing the checkboxes //

  let subs = [];
  subs.push('kitVersion', 'ap', 'as', 'es', 'fs', 'gb', 'gc', 'gp', 'hb', 'hg', 'ib', 'ic', 'ip', 'mb', 'gs', 'gb', 'rm', 'pt');
  subs.forEach((sub) => {
    let checkbox = document.getElementsByName(sub);
    checkbox.forEach((element) => element.checked = true);
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

  if (window.globalData === undefined || window.globalData.data.type === 'PROPOSAL') {
    docName = prompt("Enter Draft Name!");
    if (docName === null) {
      alert('Draft Name Cannot be Empty, please enter a Valid Name');
      return;
    } else if (docName.includes('@') || docName.includes('#')) {
      alert('Draft Name cannot include character "@"');
      return;
    }
  } else {
    let oldDocName = window.globalData.data.name;
    // console.log('window.globalData.data:', window.globalData.data);
    if (oldDocName.endsWith('M')) {
      docName = oldDocName + '#v1';
    } else {
      dNameSplit = oldDocName.split('#');
      let oldDocNameVersion = parseInt(dNameSplit[dNameSplit.length - 1].substr(1));
      for (let i = 0; i < dNameSplit.length - 1; i++) {
        docName += dNameSplit[i];
      }
      docName += `#v${oldDocNameVersion + 1}`;

    }
  }

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
            if (window, globalData.data.type === 'DRAFT') {

              docName = prompt("Enter Draft Name!");
              if (docName === null) {
                alert('Draft Name Cannot be Empty, please enter a Valid Name');
                return;
              } else if (docName.includes('@') || docName.includes('#')) {
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

  let isFresh = '1!1';
  if (window.globalData !== undefined) {
    isFresh = `0!${window.globalData.data.name}`;
  }
  let projected = document.getElementsByClassName("price_projected--value")[0].innerText;
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
  draftArray.push(isFresh);
  draftArray.push(docName);
  draftArray.push(projected);
  draftArray.push(institution);
  draftArray.push(instructor);
  draftArray.push(pNumber);
  draftArray.push(pDescription);
  draftArray.push(estimate);
  draftArray.push(uPrice);
  draftArray.push(uShip);
  draftArray.push(txt);
  draftArray.push(notes);

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

    document.getElementsByClassName("price_projected--value")[0].innerText = data.fLower === undefined ? data.bActual : Math.round((parseFloat(data.fLower) + parseFloat(data.fUpper)) / 2);
    document.getElementById("institution").value = data.institution;
    document.getElementById("instructor").value = data.instructor;
    document.getElementById("pNumber").value = data.pNumber;
    document.getElementById("pDescription").value = data.pDescription;
    document.getElementById("estimate").value = data.estimate;
    document.getElementById("uPrice").value = data.uPrice;
    document.getElementById("uShip").value = data.uShip;
    document.getElementById("notes").value = data.notes;

    // to select the check boxes from txt
    if (data.txt.length !== 0) {
      var txt = data.txt.split(' ');
      var i;
      for (i = 0; i < txt.length; i++) {

        document.querySelectorAll(`input[type='checkbox'][value='${txt[i]}']`)[0].checked = true;
        document.getElementsByClassName(txt[i].split('-')[0]).style.display = "none";

      }
    }

  } else if (data.type === 'PROPOSAL') {

    document.getElementsByClassName("price_projected--value")[0].innerText = data.fLower === undefined ? data.bActual : Math.round((parseFloat(data.fLower) + parseFloat(data.fUpper)) / 2);
    document.getElementById("institution").value = data.institution;
    document.getElementById("instructor").value = data.instructor;
    document.getElementById("pNumber").value = data.pNumber;
    document.getElementById("pDescription").value = data.pDescription;
    document.getElementById("estimate").value = data.estimate;
    document.getElementById("uPrice").value = data.uPrice;
    document.getElementById("uShip").value = data.uShip;
    document.getElementById("notes").value = data.notes;

    // to select the check boxes from txt
    if (data.txt.length !== 0) {
      var txt = data.txt.split(' ');
      var i;
      for (i = 0; i < txt.length; i++) {

        document.querySelectorAll(`input[type='checkbox'][value='${txt[i]}']`)[0].checked = true;
        let content = document.getElementsByName(txt[i].split('-')[0])[0].parentElement;
        content.previousElementSibling.classList.toggle("active");
        content.style.display = "block";

      }
    }
  }
}

// SOP Function
function sop() {

  let isFresh = '1!1';
  if (window.globalData !== undefined) {
    isFresh = `0!${window.globalData.data.name}`;
  }
  // console.log('isFresh:', isFresh);

  let bActual = document.getElementsByClassName("price_projected--value")[0].innerText;

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
    // } else if (institution === '' || instructor === '' || pNumber === '' || pDescription === '' || estimate === '' || uPrice === '' || uShip === '') {
    // alert("Please Enter All The SOP Details !!!");
  } else {

    let docName = '';

    if (window.globalData === undefined || window.globalData.data.type === 'DRAFT') {
      docName = prompt("Enter Proposal Name!");
      if (docName === null) {
        alert('Proposal Name Cannot be Empty, please enter a Valid Name');
        return;
      } else if (docName.includes('@') || docName.includes('#')) {
        alert('Proposal Name cannot include character "@"');
        return;
      }
    } else {
      let oldDocName = window.globalData.data.name;
      if (oldDocName.endsWith('M')) {
        docName = oldDocName + '#v1';
      } else {
        dNameSplit = oldDocName.split('#');
        let oldDocNameVersion = parseInt(dNameSplit[dNameSplit.length - 1].substr(1));
        for (let i = 0; i < dNameSplit.length - 1; i++) {
          docName += dNameSplit[i];
        }
        docName += `#v${oldDocNameVersion + 1}`;

      }
    }

    let check = new XMLHttpRequest();
    check.open('get', `/ckp/verifyProposal/${docName}`, true);
    let token = localStorage.getItem('x-auth_token');
    check.setRequestHeader('x-auth', token);
    check.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
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
            docName = docNameArray[0] + `#v${parseInt(data.split('/')[1]) + 1}`;
          }

          if (window.globalData !== undefined) {

            if (data.split('/')[2] !== window.globalData.data.userID) {

              if (window, globalData.data.type === 'PROPOSAL') {

                docName = prompt("Enter Proposal Name!");
                if (docName === null) {
                  alert('Proposal Name Cannot be Empty, please enter a Valid Name');
                  return;
                } else if (docName.includes('@') || docName.includes('#')) {
                  alert('Proposal Name cannot include character "@"');
                  return;
                }
              }

              let check2 = new XMLHttpRequest();
              check2.open('get', `/ckp/verifyProposal/${docName}`, true);
              let token = localStorage.getItem('x-auth_token');
              check2.setRequestHeader('x-auth', token);
              check2.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
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
                    pageArray.push(bActual);
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
                        location.reload(); // to avoid saving the same doc

                        let pdfData = JSON.parse(this.response);

                        let pdfName = requestSave.getResponseHeader('content-disposition');

                        var file = new Blob([new Uint8Array(pdfData.data)], {
                          type: 'application/pdf'
                        });
                        var fileURL = URL.createObjectURL(file);
                        window.open(fileURL, pdfName);

                        alert('SOP was saved');
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
              pageArray.push(bActual);
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

              // make a backend call to server to persist all the details. Note that the endpoint is different for admin and sales page.

              var requestSave = new XMLHttpRequest();
              requestSave.open('post', `/ckp2/save`, true);
              requestSave.setRequestHeader('x-auth', token);
              requestSave.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

              requestSave.send(`sSOP=${encodeURIComponent(JSON.stringify(pageArray))}`);

              requestSave.onload = function () {

                if (requestSave.status === 200) {
                  // console.log("data:", this.response);
                  location.reload(); // to avoid saving the same doc

                  let pdfData = JSON.parse(this.response);

                  let pdfName = requestSave.getResponseHeader('content-disposition');

                  var file = new Blob([new Uint8Array(pdfData.data)], {
                    type: 'application/pdf'
                  });
                  var fileURL = URL.createObjectURL(file);
                  window.open(fileURL, pdfName);

                  alert('SOP was saved');
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
            pageArray.push(bActual);
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
                location.reload(); // to avoid saving the same doc

                let pdfData = JSON.parse(this.response);

                let pdfName = requestSave.getResponseHeader('content-disposition');

                var file = new Blob([new Uint8Array(pdfData.data)], {
                  type: 'application/pdf'
                });
                var fileURL = URL.createObjectURL(file);
                window.open(fileURL, pdfName);

                alert('SOP was saved');
              } else {
                console.log('Somethings worng 2:', requestSave.status);
              }


            }
          }
        }

      }

    }

  }

}

/* --------------------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------ $$              indexCalculator.html            $$ -------------------------------------------------
---------------------------------------------------------------------------------------------------------------------------------------------------*/