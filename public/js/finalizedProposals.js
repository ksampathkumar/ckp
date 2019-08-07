/* --------------------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------ $$                    finalizedProposals.js                      $$-------------------------------------
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

// FINALIZED PROPOSAL CALL

let globalArray = [];
let html4Link = '<a id="%id%" href="#" onclick="displayRequired(this);">%docName%</a><br/>';

let finalizedProposalRequest = new XMLHttpRequest();
finalizedProposalRequest.open('get', '/ckp/finalizedProposal', true);
finalizedProposalRequest.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

finalizedProposalRequest.setRequestHeader('x-auth', token);

finalizedProposalRequest.onload = function () {

    if (finalizedProposalRequest.status === 200) {

        let finalizedProposals = JSON.parse(this.response);
        // console.log('finalizedProposals:', finalizedProposals);

        finalizedProposals.forEach(element => {
            globalArray.push(element);

            let finalizedTable = document.getElementById("finalized");
            let row = finalizedTable.insertRow(-1);
            let cell1 = row.insertCell(0);
            let cell2 = row.insertCell(1);
            let cell3 = row.insertCell(2);

            // cell1
            let htmlTemp = html4Link.replace('%id%', element._id);
            htmlTemp = htmlTemp.replace('%docName%', element.name);
            cell1.innerHTML = htmlTemp;

            // cell2
            cell2.innerHTML = '<button type="button" onclick="downloadBOM(this)" value="%id%" class="update">Download BOM</button>'.replace('%id%', element._id);

            // cell3
            cell3.innerHTML = '<button type="button" onclick="downloadPackingList(this)" value="%id%" class="update">Download Packing List</button>'.replace('%id%', element._id);

        });

    } else if (finalizedProposalRequest.status === 204) {

    } else {
        console.log('somethings wrong:', finalizedProposalRequest.status);
    }
}

finalizedProposalRequest.send();

// download the BOM of corresponfing proposal
function downloadBOM(item) {
    // console.log(item.value);
    // BOM FILE DOWNLOAD
    let BOMrequest = new XMLHttpRequest();
    BOMrequest.open('get', `/ckpBOM/${item.value}`, true);
    BOMrequest.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    BOMrequest.setRequestHeader('x-auth', token);

    BOMrequest.onload = function () {

        if (BOMrequest.status === 200) {

            let bArray = [];
            let bom = BOMrequest.getResponseHeader('content-disposition');

            let pb = this.response.split('\n');

            pb.forEach((line) => {
                bArray.push(line);
            });

            // BOM
            let csvContentBOM = "data:text/csv;charset=utf-8,";
            bArray.forEach(function (row) {
                csvContentBOM += row + "\r\n";
            });
            var encodedUri = encodeURI(csvContentBOM);
            var link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", bom);
            document.body.appendChild(link); // Required for FF

            link.click(); // This will download the data file named "my_data.csv".
            // BOM

        } else {
            console.log('somethings wrong:', BOMrequest.status);
        }
    }

    BOMrequest.send();
    // BOM FILE DOWNLOAD

}

// download the packing list of corresponfing proposal
function downloadPackingList(item) {

    // PACKING FILE DOWNLOAD
    let packingrequest = new XMLHttpRequest();
    packingrequest.open('get', `/ckpPacking/${item.value}`, true);
    packingrequest.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    packingrequest.setRequestHeader('x-auth', token);

    packingrequest.onload = function () {

        if (packingrequest.status === 200) {

            let pArray = [];
            let packing = packingrequest.getResponseHeader('content-disposition');

            let pb = this.response.split('\n');

            pb.forEach((line) => {
                pArray.push(line);
            });

            // Packing List
            let csvContentPackingList = "data:text/csv;charset=utf-8,";
            pArray.forEach(function (row) {
                csvContentPackingList += row.replace('#', 'no.') + "\r\n";
            });

            var encodedUri = encodeURI(csvContentPackingList);
            var link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", packing);
            document.body.appendChild(link); // Required for FF

            link.click(); // This will download the data file named "my_data.csv".
            // Packing List

        } else {
            console.log('somethings wrong:', packingrequest.status);
        }
    }

    packingrequest.send();
    // PACKING FILE DOWNLOAD

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
------------------------------------------------ $$                    finalizedProposals.js                      $$-------------------------------------
---------------------------------------------------------------------------------------------------------------------------------------------------*/