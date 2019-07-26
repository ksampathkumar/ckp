/* --------------------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------ $$                    pendingDrafts.js                      $$-------------------------------------
---------------------------------------------------------------------------------------------------------------------------------------------------*/
// this is for the managing between sales & admin page
let userDets;

// ******** Static to Dynamic page ******* //

let validateRequest = new XMLHttpRequest();
validateRequest.open('post', '/validate2', true);
let token = localStorage.getItem('x-auth_token');
validateRequest.setRequestHeader('x-auth', token);

validateRequest.onload = function () {
    if (validateRequest.status === 200) {
        userDets = JSON.parse(this.response);
        if (userDets.role !== 0) {
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

// Logout
function logout() {
    let token = localStorage.getItem('x-auth_token');

    let request = new XMLHttpRequest();

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

// PENDING DRAFT CALL

let globalArray = [];
let html4Link = '<a id="%id%" href="#" onclick="displayRequired(this);">%docName%</a><br/>';

let pendingDraftRequest = new XMLHttpRequest();
pendingDraftRequest.open('get', '/ckp/pendingDraft', true);
pendingDraftRequest.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

pendingDraftRequest.setRequestHeader('x-auth', token);

pendingDraftRequest.onload = function () {

    if (pendingDraftRequest.status === 200) {

        let pendingDrafts = JSON.parse(this.response);
        // console.log('pendingDrafts:', pendingDrafts);

        pendingDrafts.forEach(element => {
            globalArray.push(element);

            let pendingTable = document.getElementById("pending");
            let row = pendingTable.insertRow(-1);
            let cell1 = row.insertCell(0);
            let cell2 = row.insertCell(1);
            let cell3 = row.insertCell(2);
            let cell4 = row.insertCell(3);
            let cell5 = row.insertCell(4);
            let cell6 = row.insertCell(5);

            // cell1
            let htmlTemp = html4Link.replace('%id%', element._id);
            htmlTemp = htmlTemp.replace('%docName%', element.name);
            cell1.innerHTML = htmlTemp;
            // cell2
            cell2.innerHTML = `${element.bLower} - ${element.bUpper}`;

            // cell3
            // SUBJECT
            let sub = [];
            let labSplit = element.txt.split(' ');
            labSplit.forEach(lab => {
                sub.push(lab.split('-')[0]);
            });
            let distinctSub = [...new Set(sub)];
            let labTxt = '';
            distinctSub.forEach(dis => {
                labTxt = labTxt + dis + ', ';
            });

            labTxt = labTxt.slice(0, -2);
            cell3.innerHTML = labTxt.toLocaleUpperCase();

            // cell4
            cell4.innerHTML = element.notes;
            // cell5
            cell5.innerHTML = '<select class="%id%"><option value="true">True</option><option value="false">False</option></select>'.replace('%id%', element._id+element._id);

            cell6.innerHTML = '<button type="button" onclick="update(this)" value="%id%" class="update">Update</button>'.replace('%id%', element._id);

        });

    } else if (pendingDraftRequest.status === 204) {

    } else {
        console.log('somethings wrong:', pendingDraftRequest.status);
    }
}

pendingDraftRequest.send();

function update(draft) {
    console.log('value:', draft.value);
    let status = document.getElementsByClassName(draft.value);
    console.log('status:', status);
}

// display the details of clicked proposal or draft
function displayRequired(item) {
    let result = globalArray.find(obj => {
        return obj._id === item.id;
    });

    let calcWindow;
    if (userDets.currentRole === 2) {
        calcWindow = window.open('indexCalculator.html');
    } else {
        calcWindow = window.open('indexCalculator_admin.html');
    }

    calcWindow.addEventListener('load', function () {
        calcWindow.showPD(result);
    }, true);

    if (result.type === 'PROPOSAL') {

        let getProposalPDF = new XMLHttpRequest();
        getProposalPDF.open('get', `/ckpPDF/${item.id}`, true);
        let token = localStorage.getItem('x-auth_token');
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
                let fileURL = URL.createObjectURL(file);
                window.open(fileURL, pdfName);

            } else {
                console.log('Somethings worng @getProposalPDF:', getProposalPDF.status);
            }

        }
    }

}

function ckpTab() {
    // console.log(userDets);
    if (userDets.currentRole === 2) {
        window.location = 'indexCalculator.html';
    } else {
        window.location = 'indexCalculator_admin.html';
    }

}

/* --------------------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------ $$                    manageProposal.js                      $$-------------------------------------
---------------------------------------------------------------------------------------------------------------------------------------------------*/