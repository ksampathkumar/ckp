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
        if (userDets.currentRole !== 1) {
            let sAdmin = document.getElementsByClassName("admin");
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

// let token = localStorage.getItem('x-auth_token');
let globalArray = [];
let selfDrafts = [];
let html4all = '<a id="%id%" href="#" onclick="displayRequired(this);">%docName%</a><br/>';
let html4selfDraft = '<div class="draft_delete"><button id="%id%" onclick="draftDelete(this)" class="draft_delete--btn"><i class="ion-ios-close-outline"></i></button></div><a id="%id%" href="#" onclick="displayRequired(this);">%docName%</a><br/>';

async function populate4() {
    // async-await is used as it takes 100ms for the datepicker library to load the date
    await sleep(100);
    // get the time in unix timestamp format and send it to server
    let range = document.getElementById('reportrange').childNodes[3].innerHTML.split('-');
    // console.log('range:', range);
    let from = new Date(range[0].trim()).toLocaleString('en-US', { timeZone: 'America/Denver' });
    let to = new Date(range[1].trim());
    to.setHours(23, 59, 59, 999);
    let toEOD = to.toLocaleString('en-US', { timeZone: 'America/Denver' });

    let fromUnixT = new Date(from).getTime();
    let toUnixT = new Date(toEOD).getTime();

    // console.log(`${range}: ${fromUnixT} - ${toUnixT}`);

    // make 4 calls to server to get the drafts and proposals
    // DRAFT CALL FOR SELF

    // clear all list (4) and arrays(2) before making calls to server
    document.querySelector('.selfDraft_list').textContent = '';

    // document.querySelector('.selfProp_list').textContent = '';
    let selfProposalTable = document.getElementById("selfProp_list");
    // clear the table leaving the 1st row
    var rowCount = selfProposalTable.rows.length;
    for (var i = rowCount - 1; i > 0; i--) {
        selfProposalTable.deleteRow(i);
    }

    // document.querySelector('.othersDraft_list').textContent = '';
    // document.querySelector('.othersProp_list').textContent = '';
    globalArray = [];
    selfDrafts = [];
    selfProposals = [];

    let draftRequest1 = new XMLHttpRequest();
    draftRequest1.open('get', `/ckp/selfDraft/${fromUnixT}-${toUnixT}`, true);
    draftRequest1.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

    draftRequest1.setRequestHeader('x-auth', token);

    draftRequest1.onload = function () {

        if (draftRequest1.status === 200) {

            let draftData1 = JSON.parse(this.response);
            // console.log('draftData1:', draftData1);

            let typeHtml = '';
            draftData1.forEach(element => {
                globalArray.push(element);
                selfDrafts.push(element);
                if (element.isPending === undefined) {
                    let htmlTemp = html4selfDraft.replace('%id%', element._id);
                    htmlTemp = htmlTemp.replace('%id%', element._id);
                    htmlTemp = htmlTemp.replace('%docName%', element.name);
                    typeHtml = typeHtml + htmlTemp;

                    // console.log('htmlTemp:', htmlTemp);
                }
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
    proposalRequest1.open('get', `/ckp/selfSave/${fromUnixT}-${toUnixT}`, true);
    proposalRequest1.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

    proposalRequest1.setRequestHeader('x-auth', token);

    proposalRequest1.onload = function () {

        if (proposalRequest1.status === 200) {

            let proposalData1 = JSON.parse(this.response);
            // console.log('proposalData1:', proposalData1);

            let typeHtml = '';
            proposalData1.forEach(element => {
                globalArray.push(element);
                selfProposals.push(element);
                if (element.isFinal === undefined) {
                    let row = selfProposalTable.insertRow(-1);
                    let cell1 = row.insertCell(0);
                    let cell2 = row.insertCell(1);
                    let cell3 = row.insertCell(2);

                    // cell1
                    let htmlTemp = html4all.replace('%id%', element._id);
                    htmlTemp = htmlTemp.replace('%docName%', element.name);
                    cell1.innerHTML = htmlTemp;

                    // cell2 'status' prefix is added to document_.id as id is used up in the cell1 hyperlink
                    cell2.innerHTML = '<select id="%id%"><option value="false">False</option><option value="true">True</option><option value="delete">Delete</option></select>'.replace('%id%', `status-${element._id}`);
                    // cell3
                    cell3.innerHTML = '<button type="button" onclick="updateProposal(this)" value="%id%" class="update">Update</button>'.replace('%id%', element._id);
                }
            });
        } else if (proposalRequest1.status === 204) {

        } else {
            console.log('somethings wrong:', proposalRequest1.status);
        }
    }

    proposalRequest1.send();

    // PROPOSAL CALL FOR SELF

    // BELOW @ CALLS ARE DONE TO POPULATE THE GLOBAL ARRAY AND NOTHING IS DISPLAYED.
    // DRAFT CALL FOR OTHERS 

    let draftRequest2 = new XMLHttpRequest();
    draftRequest2.open('get', `/ckp/otherDraft/${fromUnixT}-${toUnixT}`, true);
    draftRequest2.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

    draftRequest2.setRequestHeader('x-auth', token);

    draftRequest2.onload = function () {

        if (draftRequest2.status === 200) {

            let draftData2 = JSON.parse(this.response);
            // console.log('draftData2:', draftData2);

            let typeHtml = '';
            draftData2.forEach(element => {
                globalArray.push(element);
                // let htmlTemp = html4all.replace('%id%', element._id);
                // htmlTemp = htmlTemp.replace('%docName%', element.name);
                // typeHtml = typeHtml + htmlTemp;
            });
            // document.querySelector('.othersDraft_list').insertAdjacentHTML('beforeend', typeHtml);

        } else if (draftRequest2.status === 204) {
            console.log('somethings wrong@othersdraftrequest:', proposalRequest2.status);
        } else {
            console.log('somethings wrong:', draftRequest2.status);
        }
    }

    draftRequest2.send();

    // DRAFT CALL FOR OTHERS

    // PROPOSAL CALL FOR OTHERS

    let proposalRequest2 = new XMLHttpRequest();
    proposalRequest2.open('get', `/ckp/otherSave/${fromUnixT}-${toUnixT}`, true);
    proposalRequest2.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

    proposalRequest2.setRequestHeader('x-auth', token);

    proposalRequest2.onload = function () {

        if (proposalRequest2.status === 200) {

            let proposalData2 = JSON.parse(this.response);
            // console.log('proposalData2:', proposalData2);

            let typeHtml = '';
            proposalData2.forEach(element => {
                globalArray.push(element);
                // let htmlTemp = html4all.replace('%id%', element._id);
                // htmlTemp = htmlTemp.replace('%docName%', element.name);
                // typeHtml = typeHtml + htmlTemp;
            });
            // document.querySelector('.othersProp_list').insertAdjacentHTML('beforeend', typeHtml);

        } else if (proposalRequest2.status === 204) {
            console.log('somethings wrong@othersproposalrequest:', proposalRequest2.status);
        } else {
            console.log('somethings wrong:', proposalRequest2.status);
        }
    }

    proposalRequest2.send();

    // PROPOSAL CALL FOR OTHERS
    // make 4 calls to server to get the drafts and proposals

    displayFinal();

    displayPending();

}

populate4();

function draftDelete(element) {
    // console.log(element.id);
    // Make the Server call to delete the draft

    let deleteDraftRequest = new XMLHttpRequest();
    deleteDraftRequest.open('delete', `/ckp/deleteDraft/${element.id}`, true);
    let token = localStorage.getItem('x-auth_token');
    deleteDraftRequest.setRequestHeader('x-auth', token);

    deleteDraftRequest.onload = function () {
        if (deleteDraftRequest.status === 200) {
            location.reload();
        } else {
            alert('Unable to Process the Request');
            location.reload();
        }
    }

    deleteDraftRequest.send();

}

function updateProposal(proposal) {
    let status = document.getElementById(`status-${proposal.value}`);
    // console.log('status:', status.value);

    if (status.value === 'true') {
        // send a request to server to change the status of the Proposal
        // reload the page on success

        let updateProposalFinalRequest = new XMLHttpRequest();
        updateProposalFinalRequest.open('get', `/ckp/updateProposalFinal/${proposal.value}`, true);
        let token = localStorage.getItem('x-auth_token');
        updateProposalFinalRequest.setRequestHeader('x-auth', token);

        updateProposalFinalRequest.onload = function () {
            if (updateProposalFinalRequest.status === 200) {
                location.reload();
            } else {
                alert('Unable to Process the Request');
                location.reload();
            }
        }

        updateProposalFinalRequest.send();

    } else if (status.value === 'delete') {
        // console.log('value:', status.value);

        // Make the Server call to delete the proposal
        let deleteProposalRequest = new XMLHttpRequest();
        deleteProposalRequest.open('delete', `/ckp/deleteProposal/${proposal.value}`, true);
        let token = localStorage.getItem('x-auth_token');
        deleteProposalRequest.setRequestHeader('x-auth', token);

        deleteProposalRequest.onload = function () {
            if (deleteProposalRequest.status === 200) {
                location.reload();
            } else {
                alert('Unable to Process the Request');
                location.reload();
            }
        }

        deleteProposalRequest.send();
    }

}

function sleep(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms)
    })
}

async function displayFinal() {
    await sleep(1000);

    let finalTable = document.getElementById("final");
    // clear the table leaving the 1st row
    var rowCount = finalTable.rows.length;
    for (var i = rowCount - 1; i > 0; i--) {
        finalTable.deleteRow(i);
    }

    selfProposals.forEach(myProposal => {
        // console.log('myProposal:', myProposal);

        if (myProposal.isFinal === true) {

            let row = finalTable.insertRow(-1);
            let cell1 = row.insertCell(0);

            // cell1
            let htmlTemp = html4all.replace('%id%', myProposal._id);
            htmlTemp = htmlTemp.replace('%docName%', myProposal.name);
            cell1.innerHTML = htmlTemp;
            // console.log('htmlTemp:', htmlTemp);

        }
    });
}

async function displayPending() {
    await sleep(2000);

    let pendingTable = document.getElementById("adminPriced");
    // clear the table leaving the 1st row
    var rowCount = pendingTable.rows.length;
    for (var i = rowCount - 1; i > 0; i--) {
        pendingTable.deleteRow(i);
    }

    selfDrafts.forEach(myDraft => {
        // console.log('myDraft:', myDraft);

        if (myDraft.isPending === true || myDraft.isPending === false) {

            let row = pendingTable.insertRow(-1);
            let cell1 = row.insertCell(0);
            let cell2 = row.insertCell(1);

            // cell1
            let htmlTemp = html4all.replace('%id%', myDraft._id);
            htmlTemp = htmlTemp.replace('%docName%', myDraft.name);
            cell1.innerHTML = htmlTemp;
            // console.log('htmlTemp:', htmlTemp);

            if (myDraft.linkageProposal !== undefined) {
                let result = globalArray.find(obj => {
                    return obj._id === myDraft.linkageProposal;
                });
                // console.log('result:', result)
                // cell2
                let htmlTemp2 = html4all.replace('%id%', result._id);
                htmlTemp2 = htmlTemp2.replace('%docName%', result.name);
                cell2.innerHTML = htmlTemp2;
            }
        }
    });
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

$(function () {

    var start = moment().subtract(29, 'days');
    var end = moment();

    function cb(start, end) {
        $('#reportrange span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
    }

    $('#reportrange').daterangepicker({
        startDate: start,
        endDate: end,
        ranges: {
            'All': ['07-01-2019', moment()],
            'Today': [moment(), moment()],
            'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            'Last 7 Days': [moment().subtract(6, 'days'), moment()],
            'Last 30 Days': [moment().subtract(29, 'days'), moment()],
            'This Month': [moment().startOf('month'), moment().endOf('month')],
            'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
        }
    }, cb);

    cb(start, end);

});

$('#reportrange').on('apply.daterangepicker', function (ev, picker) {
    populate4();
});

/* --------------------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------ $$                    manageProposal.js                      $$-------------------------------------
---------------------------------------------------------------------------------------------------------------------------------------------------*/