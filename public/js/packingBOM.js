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

// PROPOSAL CALL FOR ALL
let html4all = '<a id="%id%" href="#" onclick="downloadRequired(this);">%docName%</a><br/>';

let proposalRequest = new XMLHttpRequest();
proposalRequest.open('get', '/ckp/save', true);
proposalRequest.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

proposalRequest.setRequestHeader('x-auth', token);

proposalRequest.onload = function () {

    if (proposalRequest.status === 200) {

        let proposalData = JSON.parse(this.response);
        // console.log('proposalData1:', proposalData1);

        let typeHtml = '';
        proposalData.forEach(element => {
            let htmlTemp = html4all.replace('%id%', element._id);
            htmlTemp = htmlTemp.replace('%docName%', element.name);
            typeHtml = typeHtml + htmlTemp;
        });
        document.querySelector('.proposals').insertAdjacentHTML('beforeend', typeHtml);

    } else if (proposalRequest.status === 204) {

    } else {
        console.log('somethings wrong 1:', proposalRequest.status);
    }
}

proposalRequest.send();

// PROPOSAL CALL FOR SELF

// download the packing list and BOM of clicked proposal
function downloadRequired(item) {

    // BOM FILE DOWNLOAD
    let BOMrequest = new XMLHttpRequest();
    BOMrequest.open('get', `/ckpBOM/${item.id}`, true);
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

    // PACKING FILE DOWNLOAD
    let packingrequest = new XMLHttpRequest();
    packingrequest.open('get', `/ckpPacking/${item.id}`, true);
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
