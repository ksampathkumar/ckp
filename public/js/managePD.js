/* --------------------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------ $$                    manageProposal.js                      $$-------------------------------------
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
        // console.log(userDets);
        if (userDets.role !== 0) {
            var sAdmin = document.getElementsByClassName("admin");
            while (sAdmin.length > 0) {
                sAdmin[0].parentNode.removeChild(sAdmin[0]);
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

// make 4 calls to server to get the drafts and proposals
// let token = localStorage.getItem('x-auth_token');
let globalArray = [];
let html4all = '<a id="%id%" href="#" onclick="displayRequired(this);">%docName%</a><br/>';
// DRAFT CALL FOR SELF

let draftRequest1 = new XMLHttpRequest();
draftRequest1.open('get', '/ckp/selfDraft', true);
draftRequest1.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

draftRequest1.setRequestHeader('x-auth', token);

draftRequest1.onload = function () {

    if (draftRequest1.status === 200) {

        let draftData1 = JSON.parse(this.response);
        // console.log('draftData1:', draftData1);

        let typeHtml = '';
        draftData1.forEach(element => {
            globalArray.push(element);
            let htmlTemp = html4all.replace('%id%', element._id);
            htmlTemp = htmlTemp.replace('%docName%', element.name);
            typeHtml = typeHtml + htmlTemp;
        });
        document.querySelector('.selfDraft_list').insertAdjacentHTML('beforeend', typeHtml);

    } else if (draftRequest1.status === 204) {

    } else {
        console.log('somethings wrong:', draftRequest1.status);
    }
}

draftRequest1.send();

// DRAFT CALL FOR SELF

// PROPOSAL CALL FOR SELF

let proposalRequest1 = new XMLHttpRequest();
proposalRequest1.open('get', '/ckp/selfSave', true);
proposalRequest1.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

proposalRequest1.setRequestHeader('x-auth', token);

proposalRequest1.onload = function () {

    if (proposalRequest1.status === 200) {

        let proposalData1 = JSON.parse(this.response);
        // console.log('proposalData1:', proposalData1);

        let typeHtml = '';
        proposalData1.forEach(element => {
            globalArray.push(element);
            let htmlTemp = html4all.replace('%id%', element._id);
            htmlTemp = htmlTemp.replace('%docName%', element.name);
            typeHtml = typeHtml + htmlTemp;
        });
        document.querySelector('.selfProp_list').insertAdjacentHTML('beforeend', typeHtml);

    } else if (proposalRequest1.status === 204) {

    } else {
        console.log('somethings wrong:', proposalRequest1.status);
    }
}

proposalRequest1.send();

// PROPOSAL CALL FOR SELF

// DRAFT CALL FOR OTHERS

let draftRequest2 = new XMLHttpRequest();
draftRequest2.open('get', '/ckp/otherDraft', true);
draftRequest2.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

draftRequest2.setRequestHeader('x-auth', token);

draftRequest2.onload = function () {

    if (draftRequest2.status === 200) {

        let draftData2 = JSON.parse(this.response);
        // console.log('draftData2:', draftData2);

        let typeHtml = '';
        draftData2.forEach(element => {
            globalArray.push(element);
            let htmlTemp = html4all.replace('%id%', element._id);
            htmlTemp = htmlTemp.replace('%docName%', element.name);
            typeHtml = typeHtml + htmlTemp;
        });
        document.querySelector('.othersDraft_list').insertAdjacentHTML('beforeend', typeHtml);

    } else if (draftRequest2.status === 204) {

    } else {
        console.log('somethings wrong:', draftRequest2.status);
    }
}

draftRequest2.send();

// DRAFT CALL FOR OTHERS

// PROPOSAL CALL FOR OTHERS

let proposalRequest2 = new XMLHttpRequest();
proposalRequest2.open('get', '/ckp/otherSave', true);
proposalRequest2.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

proposalRequest2.setRequestHeader('x-auth', token);

proposalRequest2.onload = function () {

    if (proposalRequest2.status === 200) {

        let proposalData2 = JSON.parse(this.response);
        // console.log('proposalData2:', proposalData2);

        let typeHtml = '';
        proposalData2.forEach(element => {
            globalArray.push(element);
            let htmlTemp = html4all.replace('%id%', element._id);
            htmlTemp = htmlTemp.replace('%docName%', element.name);
            typeHtml = typeHtml + htmlTemp;
        });
        document.querySelector('.othersProp_list').insertAdjacentHTML('beforeend', typeHtml);

    } else if (proposalRequest2.status === 204) {

    } else {
        console.log('somethings wrong:', proposalRequest2.status);
    }
}

proposalRequest2.send();

// PROPOSAL CALL FOR OTHERS

// make 4 calls to server to get the drafts and proposals

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

        var getProposalPDF = new XMLHttpRequest();
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

                var file = new Blob([new Uint8Array(pdfData.data)], {
                    type: 'application/pdf'
                });
                var fileURL = URL.createObjectURL(file);
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