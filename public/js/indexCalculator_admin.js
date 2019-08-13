// CUSTOM KIT PRICING //

/* --------------------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------ $$              indexCalculator_admin.html            $$ -------------------------------------------------
---------------------------------------------------------------------------------------------------------------------------------------------------*/
// ******** Static to Dynamic page ******* //

let validateRequest = new XMLHttpRequest();
validateRequest.open('post', '/validate1', true);
let token = localStorage.getItem('x-auth_token');
validateRequest.setRequestHeader('x-auth', token);

validateRequest.onload = function () {

  if (validateRequest.status === 200) {
    // this is done to remove the Admin Button for the Non-SuperAdmin Users
    let userDets = JSON.parse(this.response);
    if (userDets.currentRole === 2) {
      location.href = 'indexCalculator.html';
    } else {
      if (userDets.role === 1) {
        var sAdmin = document.getElementsByClassName("admin");
        while (sAdmin.length > 0) {
          sAdmin[0].parentNode.removeChild(sAdmin[0]);
        }
      }
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

// the below function collap lines enables the modules collapsible feature.
// function collap() {
//   var coll2 = document.getElementsByClassName("collapsible2");
//   var i;

//   for (i = 0; i < coll2.length; i++) {
//     coll2[i].addEventListener("click", function () {
//       // console.log("clicked");
//       this.classList.toggle("active");
//       var content = this.nextElementSibling;
//       if (content.style.display === "block") {
//         content.style.display = "none";
//       } else {
//         content.style.display = "block";
//       }
//     });
//   }

//   var coll3 = document.getElementsByClassName("collapsible3");
//   var i;

//   for (i = 0; i < coll3.length; i++) {
//     coll3[i].addEventListener("click", function () {
//       this.classList.toggle("active");
//       var content = this.nextElementSibling;
//       if (content.style.display === "block") {
//         content.style.display = "none";
//       } else {
//         content.style.display = "block";
//       }
//     });
//   }
// }

// Collapsible Menu Navigator //

function generateLabString() {

  // Getting Selected Labs
  let txt = "";

  let subs = [];
  subs.push('ap', 'as', 'es', 'fs', 'gb', 'gc', 'gp', 'hb', 'hg', 'ib', 'ic', 'ip', 'mb', 'sg', 'bg', 'rm', 'pt');
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

  document.querySelector('.cost_list').textContent = '';
  document.querySelector('.removed_list').textContent = '';

  let txt = generateLabString();

  if (txt.length > 2) {
    // console.log(txt);
    // Do the backend call here
    // window.location.href = `/ckp/${txt}`;    // Do the backend call here

    var request = new XMLHttpRequest();
    request.open('GET', `/ckp1/${txt}`, true);
    let token = localStorage.getItem('x-auth_token');
    request.setRequestHeader('x-auth', token);
    request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    request.onload = function () {

      // Begin accessing JSON data here
      if (request.status >= 200 && request.status < 400) {
        var data = JSON.parse(this.response);
        console.log("Server Data:", data);
        document.querySelector(".price_projected_1--value").textContent = Math.round(data[0] * 100) / 100;
        document.querySelector(".price_projected_2--value").textContent = Math.round(data[1] * 100) / 100;
        document.querySelector(".price_cost--value").textContent = Math.round(data[2] * 100) / 100;
        document.querySelector(".lastPurchasePrice--value").textContent = Math.round(data[5] * 100) / 100;
        dispPrice(data[3], data[4], data[2]);
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
});

// Clear Button Event //
function clearAll() {
  window.globalData = undefined;
  document.querySelector('.cost_list').textContent = '';
  document.querySelector('.removed_list').textContent = '';
  document.querySelector('.cart_list').textContent = '';

  clearCheckBoxes();

  document.querySelector('.price_cost--value').textContent = "0.0";
  document.querySelector('.price_projected_1--value').textContent = "0.0";
  document.querySelector('.price_projected_2--value').textContent = "0.0";
  document.querySelector('.lastPurchasePrice--value').textContent = "0.0";

  document.querySelector('.UIprice_cost--value').textContent = "0.0";
  document.querySelector('.UIprice_projected_1--value').textContent = "0.0";
  document.querySelector('.UIprice_projected_2--value').textContent = "0.0";
  document.querySelector('.packingCost--value').textContent = "0.0";

  document.getElementById("institution").value = '';
  document.getElementById("instructor").value = '';
  document.getElementById("pNumber").value = '';
  document.getElementById("pDescription").value = '';
  document.getElementById("estimate").value = '';
  document.getElementById("uPrice").value = '';
  document.getElementById("uShip").value = '';
  document.getElementById("searchText").value = '';

  document.getElementById("notes").value = '';
  document.querySelector('.labCounts--value').textContent = '';
}

// Clear Check Boxes //
function clearCheckBoxes() {
  document.querySelector('.labCounts--value').textContent = '';
  // clearing the checkboxes //

  let subs = [];
  subs.push('kitVersion', 'ap', 'as', 'es', 'fs', 'gb', 'gc', 'gp', 'hb', 'hg', 'ib', 'ic', 'ip', 'mb', 'sg', 'bg', 'rm', 'pt');
  subs.forEach((sub) => {
    let checkbox = document.getElementsByName(sub);
    checkbox.forEach((element) => element.checked = false);
  });
}

document.querySelector('.updateCost').addEventListener('click', () => {

  if (document.getElementsByClassName('cost_list')[0].childNodes.length === 0) {
    alert('No items to update the cost');
  } else {

    let costContents = document.getElementsByClassName('cost_list');

    let updateCostQuery = "SELECT idName, averageCost FROM netsuite.allItems where (BINARY idName ='";
    let uiItems = costContents[0].childNodes;
    uiItems.forEach((item) => {
      let def = item.childNodes;
      // console.log('def:', def);
      if (def.length > 1) {
        let idName = def[0].innerHTML.split('-')[1];
        if (updateCostQuery.includes(idName)) {
          // do not add it again
        } else {
          updateCostQuery += idName;
          updateCostQuery += "' or BINARY idName ='";
        }
      }
    });

    updateCostQuery = updateCostQuery.slice(0, -20);
    updateCostQuery += ");";

    var costRequest = new XMLHttpRequest();
    costRequest.open('post', `/ckpSQL`, true);
    let token = localStorage.getItem('x-auth_token');
    costRequest.setRequestHeader('x-auth', token);
    costRequest.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    costRequest.send(`query=${encodeURIComponent(updateCostQuery)}`);
    costRequest.onload = function () {

      let sqlres = JSON.parse(this.response);
      // console.log('result:', sqlres);

      // 1. Update the cost all the items present in the display
      uiItems.forEach((item) => {
        let def = item.childNodes;
        if (def.length > 1) {
          let newCost = sqlres.filter(function (resitem) {
            return resitem.idName === def[0].innerHTML.split('-')[1];
          });

          if (newCost.length > 0) {
            def[def.length - 1].innerHTML = def[def.length - 1].innerHTML.replace(def[def.length - 1].innerText, newCost[0].averageCost);
          } else {
            console.log('New Cost not found the item:', def[def.length - 1].innerText);
          }
        }

      });


      // 2. recompute the cost of the kit. Call the 
      OLDdispPrice();

      document.body.scrollTop = 0; // For Safari
      document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
    }

  }

});

// FUNCTIONS //

// Display Price // Inside each for of the Packaged items, have 2 more for's.
function dispPrice(BOM, dependencyTree, serverSum) {

  let itemCount, parent, html, htmlParentProto, htmlParentProto2, htmlPlainParentProto, htmlChildProto, htmlTemp, htmlTemp2, htmlTemp3, htmlTemp4;

  // console.log("BOM Size:", BOM.length);
  // console.log("Dependency Tree Size:", dependencyTree.length);

  // remove all the childs from the previous calculation
  var myNode = document.querySelector('.cost_list');
  while (myNode.firstChild) {
    myNode.removeChild(myNode.firstChild);
  }



  // Top level STOCK material Mapping
  itemCount = 1;
  for (let m = 0; m < BOM.length; m++) {
    parent = BOM[m];

    htmlPlainParentProto = '<div class="item clearfix" id="cost-%itemCount%"><div class="IidName">%idName%</div><div class="IdisplayName">%displayName%</div><div class="Ilab">%lab%</div><div class="Iqty">%qty%</div><div class="right clearfix"><div class="item_value">%averageCost%</div><div class="item_delete"><button onclick="itemDelete(this)" class="item_delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';

    if (parent.idName.toUpperCase().startsWith("EQUP") || parent.idName.toUpperCase().startsWith("CHEM") || parent.idName.toUpperCase().startsWith("SHIP")) {
      // Replace the placeholder text with some actual data
      html = htmlPlainParentProto.replace('%itemCount%', itemCount);
      html = html.replace('%idName%', `${itemCount}-${parent.idName}`);
      html = html.replace('%qty%', parent.qty);


      let moreDeatils = dependencyTree.filter(function (item2Add) {
        return item2Add.idName == parent.idName;
      });

      if (moreDeatils[0] !== undefined) {
        html = html.replace('%displayName%', moreDeatils[0].displayName);
        html = html.replace('%lab%', moreDeatils[0].lab);
        html = html.replace('%averageCost%', moreDeatils[0].averageCost);
      } else {
        console.log('undefined:', parent.idName);
        console.log('filter array:', dependencyTree);
      }




      // Insert the HTML into the DOM
      document.querySelector('.cost_list').insertAdjacentHTML('beforeend', html);

      itemCount++;
    }
  }


  // Top level PHANTOM material Mapping

  for (let m = 0; m < BOM.length; m++) {
    parent = BOM[m];

    // the below 3 commented lines enables the modules collapsible feature.
    // htmlParentProto = '<h2 <button class="collapsible2"><div class="item clearfix" id="cost-%itemCount%"><div class="idName">%idName%</div><div class="displayName">%displayName%</div><div class="lab">%lab%</div><div class="qty">%qty%</div><div class="right clearfix"><div class="item_delete"><button onclick="itemDelete(this)" class="item_delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div></h2><div class="content">';
    // htmlChildProto = '<div class="item clearfix" id="cost-%childCount%"><div class="memItem">%memItem%</div><div class="memDisplayName">%memDisplayName%</div><div class="memQuantity">%memQuantity%</div><div class="right clearfix"><div class="item_value">%item_value%</div><div class="item_delete"><button onclick="itemDelete(this)" class="item_delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
    // htmlParentProto2 = '<h2 <button class="collapsible3"><div class="item clearfix" id="cost-%bagCount%"><div class="idName">%memBag%</div><div class="displayName">%memBagDisplayName%</div><div class="qty">%qty%</div><div class="right clearfix"><div class="item_delete"><button onclick="itemDelete(this)" class="item_delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div></h2><div class="content">';

    htmlParentProto = '<h2 <button class="collapsible2"><div class="item clearfix" id="cost-%itemCount%"><div class="idName">%idName%</div><div class="displayName">%displayName%</div><div class="costLab">%lab%</div><div class="qty">%qty%</div><div class="right clearfix"><div class="item_delete"><button onclick="itemDelete(this)" class="item_delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div></h2>';
    htmlChildProto = '<div class="item clearfix" id="cost-%childCount%"><div class="memItem">%memItem%</div><div class="memDisplayName">%memDisplayName%</div><div class="memQuantity">%memQuantity%</div><div class="right clearfix"><div class="item_value">%item_value%</div><div class="item_delete"><button onclick="itemDelete(this)" class="item_delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
    htmlParentProto2 = '<h2 <button class="collapsible3"><div class="item clearfix" id="cost-%bagCount%"><div class="idName">%memBag%</div><div class="displayName">%memBagDisplayName%</div><div class="qty">%qty%</div><div class="right clearfix"><div class="item_delete"><button onclick="itemDelete(this)" class="item_delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div></h2>';


    if (parent.idName.toUpperCase().startsWith("BAG") || parent.idName.toUpperCase().startsWith("BTTL") || parent.idName.toUpperCase().startsWith("MODL")) {

      // Replace the placeholder text with some actual data
      html = htmlParentProto.replace('%itemCount%', itemCount);
      html = html.replace('%idName%', `${itemCount}-${parent.idName}`);
      html = html.replace('%qty%', parent.qty);

      let moreDeatils = dependencyTree.filter(function (item2Add) {
        return item2Add.idName == parent.idName;
      });

      // console.log(moreDeatils);

      if (moreDeatils.length > 0) {

        html = html.replace('%displayName%', moreDeatils[0].displayName);
        html = html.replace('%lab%', moreDeatils[0].lab);

        // html += '<div class="content">';
        for (let n = 0; n < moreDeatils.length; n++) {
          let details = moreDeatils[n];

          if (details.memItem.toUpperCase().startsWith("BAG") || details.memItem.toUpperCase().startsWith("BTTL") || details.memItem.toUpperCase().startsWith("MODL")) {

            let bagInsideBag = dependencyTree.filter(function (item2Add) {
              return item2Add.idName == details.memItem;
            });

            if (bagInsideBag.length > 0) {

              htmlTemp = htmlParentProto2.replace("%bagCount%", `${itemCount}.${n + 1}`);
              htmlTemp = htmlTemp.replace("%memBag%", `${itemCount}.${n + 1}-${bagInsideBag[0].idName}`);
              htmlTemp = htmlTemp.replace("%memBagDisplayName%", bagInsideBag[0].displayName);
              htmlTemp = htmlTemp.replace("%qty%", details.memQuantity);

              // htmlTemp += '<div class="content">';
              for (let t = 0; t < bagInsideBag.length; t++) {

                let bagElements = bagInsideBag[t];

                if (bagElements.memItem.toUpperCase().startsWith("BAG") || bagElements.memItem.toUpperCase().startsWith("BTTL") || bagElements.memItem.toUpperCase().startsWith("MODL")) {
                  // console.log("CHECKER1:", bagElements);
                  let deeperBag = dependencyTree.filter(function (item2Add) {
                    return item2Add.idName == bagElements.memItem;
                  });

                  if (deeperBag.length > 0) {

                    htmlTemp3 = htmlParentProto2.replace("%bagCount%", `${itemCount}.${n + 1}.${t + 1}`);
                    htmlTemp3 = htmlTemp3.replace("%memBag%", `${itemCount}.${n + 1}.${t + 1}-${deeperBag[0].idName}`);
                    htmlTemp3 = htmlTemp3.replace("%memBagDisplayName%", deeperBag[0].displayName);
                    htmlTemp3 = htmlTemp3.replace("%qty%", bagElements.memQuantity);

                    for (let d = 0; d < deeperBag.length; d++) {
                      htmlTemp4 = htmlChildProto.replace("%childCount%", `${itemCount}.${n + 1}.${t + 1}.${d + 1}`);
                      htmlTemp4 = htmlTemp4.replace("%memItem%", `${itemCount}.${n + 1}.${t + 1}.${d + 1}-${deeperBag[d].memItem}`);
                      htmlTemp4 = htmlTemp4.replace("%memDisplayName%", deeperBag[d].memDisplayName);
                      htmlTemp4 = htmlTemp4.replace("%memQuantity%", deeperBag[d].memQuantity);
                      htmlTemp4 = htmlTemp4.replace("%item_value%", deeperBag[d].averageCost);

                      htmlTemp3 = htmlTemp3 + htmlTemp4;
                    }
                    htmlTemp += '</div>';
                    htmlTemp = htmlTemp + htmlTemp3;
                  }

                } else {

                  htmlTemp2 = htmlChildProto.replace("%childCount%", `${itemCount}.${n + 1}.${t + 1}`);
                  htmlTemp2 = htmlTemp2.replace("%memItem%", `${itemCount}.${n + 1}.${t + 1}-${bagElements.memItem}`);
                  htmlTemp2 = htmlTemp2.replace("%memDisplayName%", bagElements.memDisplayName);
                  htmlTemp2 = htmlTemp2.replace("%memQuantity%", bagElements.memQuantity);
                  htmlTemp2 = htmlTemp2.replace("%item_value%", bagElements.averageCost);

                  htmlTemp = htmlTemp + htmlTemp2;
                }
              }
              htmlTemp += '</div>';

              html = html + htmlTemp;

            } else {
              console.log("ERROR @ Bag Inside Bag");
            }

          } else {

            htmlTemp = htmlChildProto.replace("%childCount%", `${itemCount}.${n + 1}`);
            htmlTemp = htmlTemp.replace("%memItem%", `${itemCount}.${n + 1}-${details.memItem}`);
            // htmlTemp = htmlTemp.replace("%memItem%", details.memItem);
            htmlTemp = htmlTemp.replace("%memDisplayName%", details.memDisplayName);
            htmlTemp = htmlTemp.replace("%memQuantity%", details.memQuantity);
            htmlTemp = htmlTemp.replace("%item_value%", details.averageCost);

            html = html + htmlTemp;

          }
        }
        html += '</div>';

        itemCount++;
      }
      // html += '</div>';

      // Insert the HTML into the DOM
      document.querySelector('.cost_list').insertAdjacentHTML('beforeend', html);

    }
  }

  OLDdispPrice(serverSum);

}

let serverComputedPackingCost = 0;
// OLD Display Price // - this calculates the cost
function OLDdispPrice(serverSum) {
  // this function does the calculation from what's visible on the screen

  // collap();

  let cost_list = document.querySelector('.cost_list');

  let sum = 0;

  if (cost_list.childElementCount > 0) {

    var parentMap = new Map();
    cost_list.childNodes.forEach((element) => {

      // the below 2 commented lines is for debugging the modules collapsibe feature.
      // console.log('element:', element.childNodes);
      if (element.childElementCount > 1) {
        // console.log('inner:', element.childNodes[0].innerHTML.split('-')[0]);
        let quantity = parseFloat(element.childNodes[element.childElementCount - 2].innerHTML);
        let unitCost = parseFloat(element.childNodes[element.childElementCount - 1].childNodes[0].innerHTML);
        // console.log(`${element.childNodes[0].innerHTML.split('-')[1]} = ${quantity} - ${unitCost} = ${quantity * unitCost}`);

        if (unitCost < 0 || isNaN(unitCost)) {
          unitCost = 0;
        }

        let currentNumber = element.childNodes[0].innerHTML.split('-')[0];
        let multiply = [];
        parentMap.forEach(function (value, key) {
          if (currentNumber.includes(key)) {
            multiply.push(value);
          }
        });

        if (multiply.length > 0) {
          let factor = 0;
          multiply.forEach((mul) => {
            factor = mul * quantity;
          });
          sum = sum + factor * unitCost;
        } else {
          sum = sum + quantity * unitCost;
        }

      } else {
        let parentNumber = element.childNodes[0].getElementsByClassName('idName')[0].innerHTML.split('-')[0];
        parentQty = parseInt(element.childNodes[0].getElementsByClassName('qty')[0].innerHTML);

        parentMap.set(parentNumber, parentQty);
      }

    });

    // console.log('parentMap:', parentMap);

    // console.log("SUM:", sum);

    if (serverComputedPackingCost === 0) {
      serverComputedPackingCost = serverSum - sum;
    }

    document.querySelector('.UIprice_cost--value').textContent = Math.round((sum + serverComputedPackingCost) * 100) / 100;
    document.querySelector('.packingCost--value').textContent = Math.round(serverComputedPackingCost * 100) / 100;
    document.querySelector('.UIprice_projected_1--value').textContent = Math.round((sum + serverComputedPackingCost) * (1 / 0.35) * 100) / 100;
    document.querySelector('.UIprice_projected_2--value').textContent = Math.round((sum + serverComputedPackingCost) * (1 / 0.31) * 100) / 100;

    // update BUDGET here please

    // Scroll Window to top smooth
    window.scrollTo({
      top: 125,
      left: 0,
      behavior: 'smooth'
    });

  } else {
    alert('No item in Cost List, Please fill the List');
    document.querySelector('.UIprice_cost--value').textContent = 0;
    document.querySelector('.UIprice_projected_1--value').textContent = 0;
    document.querySelector('.UIprice_projected_2--value').textContent = 0;
  }
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

      default:
    }
  } else {

    clearCheckBoxes();

  }
}

// itemDelete Function //

function itemDelete(element) {

  console.log(element.parentNode.parentNode.parentNode.id);

  let el = document.getElementById(element.parentNode.parentNode.parentNode.id);

  let item = element.parentNode.parentNode.parentNode.id;

  // console.log('1:', el.innerText);
  // console.log('2:',el.childNodes);

  // Below if checks if the user is removing top most parent and if they are removing child for customization, it does not allow that.
  // For customization, the user must remove top most parent and add required childs back to cost list leaving the component that is to be removed.
  let parentCase = el.childNodes[0].innerHTML.split('-')[0].split('.');
  if (parentCase.length > 1) {
    // console.log('do not allow item to remove');
    alert(`To customize, please remove the highest parent of the group and add required childs leaving the component that you want removed from the group. In this case, first remove group corresponding to item number >>> ${parentCase[0]} <<< and add the required childs(like ${parentCase[0]}.1, ${parentCase[0]}.2, and so on).`)
  } else {
    // console.log('allow item to remove');

    if (el.childNodes[0].innerHTML.split('-')[1].toUpperCase().startsWith("BAG") || el.childNodes[0].innerHTML.split('-')[1].toUpperCase().startsWith("BTTL") || el.childNodes[0].innerHTML.split('-')[1].toUpperCase().startsWith("MODL")) {

      // console.log(el);
      // console.log(el.parentNode);
      // console.log(el.parentNode.parentNode);

      let elRef = el;
      elRef.parentNode.parentNode.removeChild(elRef.parentNode);
      elRef.parentNode.removeChild(elRef);
      document.querySelector('.removed_list').insertAdjacentHTML('beforeend', '<h2 <button class="collapsible2"><div class="item clearfix" id="%id%">'.replace("%id%", elRef.id) + elRef.innerHTML.replace('itemDelete', 'itemAdd') + '</div></h2>');

      for (let i = 1; i < 99; i++) {
        el1 = document.getElementById(item + `.${i}`);

        if (el1 === null) {
          break;
        } else {
          // console.log(item + `.${i}`);

          if (el1.childNodes[0].innerHTML.split('-')[1].toUpperCase().startsWith("BAG") || el1.childNodes[0].innerHTML.split('-')[1].toUpperCase().startsWith("BTTL") || el1.childNodes[0].innerHTML.split('-')[1].toUpperCase().startsWith("MODL")) {
            let el1Ref = el1;
            el1Ref.parentNode.parentNode.removeChild(el1Ref.parentNode);
            el1Ref.parentNode.removeChild(el1Ref);
            document.querySelector('.removed_list').insertAdjacentHTML('beforeend', '<h2 <button class="collapsible3"><div class="item clearfix" id="%id%">'.replace("%id%", el1Ref.id) + el1Ref.innerHTML.replace('itemDelete', 'itemAdd') + '</div></h2>');

            for (let n = 1; n < 99; n++) {
              el2 = document.getElementById(`${item}.${i}.${n}`);
              // console.log("el2:", el2);

              if (el2 === null) {
                break;
              } else {

                if (el2.childNodes[0].innerHTML.split('-')[1].toUpperCase().startsWith("BAG") || el2.childNodes[0].innerHTML.split('-')[1].toUpperCase().startsWith("BTTL") || el2.childNodes[0].innerHTML.split('-')[1].toUpperCase().startsWith("MODL")) {
                  let el2Ref = el2;
                  el2Ref.parentNode.parentNode.removeChild(el2Ref.parentNode);
                  el2Ref.parentNode.removeChild(el2Ref);
                  document.querySelector('.removed_list').insertAdjacentHTML('beforeend', '<h2 <button class="collapsible3"><div class="item clearfix" id="%id%">'.replace("%id%", el2Ref.id) + el2Ref.innerHTML.replace('itemDelete', 'itemAdd') + '</div></h2>');

                  for (let t = 1; t < 99; t++) {
                    el3 = document.getElementById(`${item}.${i}.${n}.${t}`);
                    // console.log("el3:", el3);

                    if (el3 === null) {
                      break;
                    } else {
                      el3.parentNode.removeChild(el3);
                      document.querySelector('.removed_list').insertAdjacentHTML('beforeend', '<div class="item clearfix" id="%id%">'.replace("%id%", el3.id) + el3.innerHTML.replace('itemDelete', 'itemAdd') + '</div>');
                    }
                  }
                } else {
                  el2.parentNode.removeChild(el2);
                  document.querySelector('.removed_list').insertAdjacentHTML('beforeend', '<div class="item clearfix" id="%id%">'.replace("%id%", el2.id) + el2.innerHTML.replace('itemDelete', 'itemAdd') + '</div>');
                }

              }
            }
          } else {
            el1.parentNode.removeChild(el1);
            document.querySelector('.removed_list').insertAdjacentHTML('beforeend', '<div class="item clearfix" id="%id%">'.replace("%id%", el1.id) + el1.innerHTML.replace('itemDelete', 'itemAdd') + '</div>');
          }
        }
      }

    } else {
      el.parentNode.removeChild(el);
      document.querySelector('.removed_list').insertAdjacentHTML('beforeend', '<div class="item clearfix" id="%id%">'.replace("%id%", el.id) + el.innerHTML.replace('itemDelete', 'itemAdd') + '</div>');
    }

    OLDdispPrice();

  }

}

// itemAdd Function //
function itemAdd(element) {

  console.log(element.parentNode.parentNode.parentNode.id);

  let el = document.getElementById(element.parentNode.parentNode.parentNode.id);

  let item = element.parentNode.parentNode.parentNode.id;

  // console.log('1:', el.innerText);
  // console.log('2:',el.childNodes);

  if (el.childNodes[0].innerHTML.split('-')[1].toUpperCase().startsWith("BAG") || el.childNodes[0].innerHTML.split('-')[1].toUpperCase().startsWith("BTTL") || el.childNodes[0].innerHTML.split('-')[1].toUpperCase().startsWith("MODL")) {

    // console.log(el);
    // console.log(el.parentNode);
    // console.log(el.parentNode.parentNode);

    let elRef = el;
    elRef.parentNode.parentNode.removeChild(elRef.parentNode);
    elRef.parentNode.removeChild(elRef);
    document.querySelector('.cost_list').insertAdjacentHTML('beforeend', '<h2 <button class="collapsible2"><div class="item clearfix" id="%id%">'.replace("%id%", elRef.id) + elRef.innerHTML.replace('itemAdd', 'itemDelete') + '</div></h2>');

    for (let i = 1; i < 99; i++) {
      el1 = document.getElementById(item + `.${i}`);

      if (el1 === null) {
        break;
      } else {
        // console.log(item + `.${i}`);

        if (el1.childNodes[0].innerHTML.split('-')[1].toUpperCase().startsWith("BAG") || el1.childNodes[0].innerHTML.split('-')[1].toUpperCase().startsWith("BTTL") || el1.childNodes[0].innerHTML.split('-')[1].toUpperCase().startsWith("MODL")) {
          let el1Ref = el1;
          el1Ref.parentNode.parentNode.removeChild(el1Ref.parentNode);
          el1Ref.parentNode.removeChild(el1Ref);
          document.querySelector('.cost_list').insertAdjacentHTML('beforeend', '<h2 <button class="collapsible3"><div class="item clearfix" id="%id%">'.replace("%id%", el1Ref.id) + el1Ref.innerHTML.replace('itemAdd', 'itemDelete') + '</div></h2>');

          for (let n = 1; n < 99; n++) {
            el2 = document.getElementById(`${item}.${i}.${n}`);
            // console.log("el2:", el2);

            if (el2 === null) {
              break;
            } else {

              if (el2.childNodes[0].innerHTML.split('-')[1].toUpperCase().startsWith("BAG") || el2.childNodes[0].innerHTML.split('-')[1].toUpperCase().startsWith("BTTL") || el2.childNodes[0].innerHTML.split('-')[1].toUpperCase().startsWith("MODL")) {
                let el2Ref = el2;
                el2Ref.parentNode.parentNode.removeChild(el2Ref.parentNode);
                el2Ref.parentNode.removeChild(el2Ref);
                document.querySelector('.cost_list').insertAdjacentHTML('beforeend', '<h2 <button class="collapsible3"><div class="item clearfix" id="%id%">'.replace("%id%", el2Ref.id) + el2Ref.innerHTML.replace('itemAdd', 'itemDelete') + '</div></h2>');

                for (let t = 1; t < 99; t++) {
                  el3 = document.getElementById(`${item}.${i}.${n}.${t}`);
                  // console.log("el3:", el3);

                  if (el3 === null) {
                    break;
                  } else {
                    el3.parentNode.removeChild(el3);
                    document.querySelector('.cost_list').insertAdjacentHTML('beforeend', '<div class="item clearfix" id="%id%">'.replace("%id%", el3.id) + el3.innerHTML.replace('itemAdd', 'itemDelete') + '</div>');
                  }
                }
              } else {
                el2.parentNode.removeChild(el2);
                document.querySelector('.cost_list').insertAdjacentHTML('beforeend', '<div class="item clearfix" id="%id%">'.replace("%id%", el2.id) + el2.innerHTML.replace('itemAdd', 'itemDelete') + '</div>');
              }

            }
          }
        } else {
          el1.parentNode.removeChild(el1);
          document.querySelector('.cost_list').insertAdjacentHTML('beforeend', '<div class="item clearfix" id="%id%">'.replace("%id%", el1.id) + el1.innerHTML.replace('itemAdd', 'itemDelete') + '</div>');
        }
      }
    }

  } else {
    el.parentNode.removeChild(el);
    document.querySelector('.cost_list').insertAdjacentHTML('beforeend', '<div class="item clearfix" id="%id%">'.replace("%id%", el.id) + el.innerHTML.replace('itemAdd', 'itemDelete') + '</div>');
  }

  OLDdispPrice();

}

// searchItem Function //
function searchItem() {
  let searchText = document.getElementById("searchText").value;
  if (searchText.length === 0) {
    alert('please enter a search string');
  } else {

    // Get the popsearch
    var popsearch = document.getElementById('popsearch');

    // Get the <span> element that closes the popsearch
    var span = document.getElementsByClassName("close")[0];
    // When the user clicks on <span> (x), close the popsearch
    span.onclick = function () {
      popsearch.style.display = "none";
    }
    // When the user clicks anywhere outside of the popsearch, close it
    window.onclick = function (event) {
      if (event.target == popsearch) {
        popsearch.style.display = "none";
        document.querySelector('.search-body').textContent = '';
      }
    }

    var search = new XMLHttpRequest();
    search.open('post', `/ckpSearch`, true);
    let token = localStorage.getItem('x-auth_token');
    search.setRequestHeader('x-auth', token);
    search.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    search.onload = function () {

      if (search.status === 200) {
        // console.log('searchRes:', JSON.parse(this.response));

        let searchResults, htmlProto;
        let html = '';
        let searchCount = 0;
        searchResults = JSON.parse(this.response);
        if (searchResults.length === 0) {
          alert('No results found for search');
          return;
        }

        htmlProto = '<div class="item clearfix" id="search-%itemCount%"><div class="IidName">%idName%</div><div class="IdisplayName">%displayName%</div><div class="Ilab">SEARCH</div><div class="Iqty">1</div><div class="right clearfix"><div class="item_value">%averageCost%</div><div class="item_add"><button onclick="itemAddSearch(this)" class="item_delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';

        searchResults.forEach((item) => {
          searchCount++;
          let htmlTemp = htmlProto.replace('%itemCount%', searchCount);
          htmlTemp = htmlTemp.replace('%idName%', item.idName);
          htmlTemp = htmlTemp.replace('%displayName%', item.displayName);
          htmlTemp = htmlTemp.replace('%averageCost%', item.averageCost);
          // htmlTemp = htmlTemp.replace('search', 'cost');

          // console.log("htmlTEST:", htmlTemp);
          html = html + htmlTemp;
        });

        document.querySelector('.search-body').textContent = '';
        document.querySelector('.search-body').insertAdjacentHTML('beforeend', html);
        popsearch.style.display = "block";
      } else {
        alert("something's wrong");
      }
    }

    search.send(`search=${encodeURIComponent(searchText)}`);
  }
}

// itemAdd from Search
function itemAddSearch(element) {
  console.log(element.parentNode.parentNode.parentNode.id);

  let el = document.getElementById(element.parentNode.parentNode.parentNode.id);

  // console.log(el);

  let item = element.parentNode.parentNode.parentNode.id;

  // let totalCost = document.querySelector('.cost_list').childElementCount;
  // let totalRemoved = document.querySelector('.removed_list').childElementCount;

  // console.log('C:', totalCost);
  // console.log('R:', totalRemoved);

  // let newItemID;
  // if(totalCost === 0 & totalRemoved === 0){

  //   newItemID = 1;

  // }else if(totalCost === 0 & totalRemoved > 0){

  //   for(let i = 0; i < totalRemoved; i++){

  //     // if()
  //   }
  // }else if(totalCost > 0 & totalRemoved === 0){

  // }else if(totalCost > 0 & totalRemoved > 0){

  // }

  // OLD CODE CONDITION
  // let lastCost = document.querySelector('.cost_list').lastChild;
  // let lastRemoved = document.querySelector('.removed_list').lastChild;
  // newItemID = `${el.id.split('-')[0]}-${parseInt(lastCost.id.split('-')[1].split('.')[0]) + parseInt(lastRemoved.id.split('-')[1].split('.')[0]) + 1}`;
  // OLD CODE CONDITION

  let newItemID = Math.floor((Math.random() * 1000) + 500);

  let html = '<div class="item clearfix" id="cost-%id%">'.replace("%id%", newItemID) + el.innerHTML.replace('itemAddSearch', 'itemDelete') + '</div>';

  // html = html.replace(el.innerText.split('\n')[0], `${parseInt(lastCost.id.split('-')[1].split('.')[0]) + 1}-${el.innerText.split('\n')[0]}`);
  html = html.replace(el.innerText.split('\n')[0], `${newItemID}-${el.innerText.split('\n')[0]}`);

  // console.log("html:", html);
  document.querySelector('.cost_list').insertAdjacentHTML('beforeend', html);

  OLDdispPrice();

  alert(`Item Added: ${el.innerText.split('\n')[1]}`)

}

// onload for calculator from managePD page
function showPD(data) {
  console.log('data:', data);

  window.globalData = {};
  globalData.data = data;

  if (data.type === 'DRAFT') {

    document.getElementsByClassName("price_cost--value")[0].innerText = data.bActual;
    document.getElementsByClassName("price_projected_1--value")[0].innerText = data.bLower;
    document.getElementsByClassName("price_projected_2--value")[0].innerText = data.bUpper;
    document.getElementsByClassName("UIprice_cost--value")[0].innerText = data.fActual;
    document.getElementsByClassName("UIprice_projected_1--value")[0].innerText = data.fLower;
    document.getElementsByClassName("UIprice_projected_2--value")[0].innerText = data.fUpper;
    document.getElementById("searchText").value = data.searchBox;
    document.getElementById("institution").value = data.institution;
    document.getElementById("instructor").value = data.instructor;
    document.getElementById("pNumber").value = data.pNumber;
    document.getElementById("pDescription").value = data.pDescription;
    document.getElementById("estimate").value = data.estimate;
    document.getElementById("uPrice").value = data.uPrice;
    document.getElementById("uShip").value = data.uShip;
    document.getElementById("notes").value = data.notes;
    document.getElementById("state").value = data.state;

    document.querySelector('.cost_list').innerHTML = data.costContents;
    document.querySelector('.removed_list').innerHTML = data.removedContents;

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

    document.getElementsByClassName("price_cost--value")[0].innerText = data.bActual;
    document.getElementsByClassName("price_projected_1--value")[0].innerText = data.bLower;
    document.getElementsByClassName("price_projected_2--value")[0].innerText = data.bUpper;
    document.getElementsByClassName("UIprice_cost--value")[0].innerText = data.fActual;
    document.getElementsByClassName("UIprice_projected_1--value")[0].innerText = data.fLower;
    document.getElementsByClassName("UIprice_projected_2--value")[0].innerText = data.fUpper;
    document.getElementById("searchText").value = data.searchBox;
    document.getElementById("institution").value = data.institution;
    document.getElementById("instructor").value = data.instructor;
    document.getElementById("pNumber").value = data.pNumber;
    document.getElementById("pDescription").value = data.pDescription;
    document.getElementById("estimate").value = data.estimate;
    document.getElementById("uPrice").value = data.uPrice;
    document.getElementById("uShip").value = data.uShip;
    document.getElementById("notes").value = data.notes;
    document.getElementById("state").value = data.state;

    document.querySelector('.cost_list').innerHTML = data.costContents;
    document.querySelector('.removed_list').innerHTML = data.removedContents;

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

// Save Draft Button Event //
document.querySelector('.saveDraft').addEventListener('click', () => {

  let docName = '';

  if (window.globalData === undefined || window.globalData.data.type === 'PROPOSAL' || window.globalData.data.isPending !== undefined) {
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

  let bActual = document.getElementsByClassName("price_cost--value")[0].innerText;
  let bLower = document.getElementsByClassName("price_projected_1--value")[0].innerText;
  let bUpper = document.getElementsByClassName("price_projected_2--value")[0].innerText;
  let fActual = document.getElementsByClassName("UIprice_cost--value")[0].innerText;
  let fLower = document.getElementsByClassName("UIprice_projected_1--value")[0].innerText;
  let fUpper = document.getElementsByClassName("UIprice_projected_2--value")[0].innerText;
  let searchBox = document.getElementById("searchText").value;
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

  let costContents = document.querySelector('.cost_list').innerHTML;
  // let a = JSON.stringify(costContents);
  // let b = a.replace(/&amp;/g, '-');
  // console.log('costContents:', b);
  let removedContents = document.querySelector('.removed_list').innerHTML;

  let draftArray = [];
  draftArray.push(docName);
  draftArray.push(bActual);
  draftArray.push(bLower);
  draftArray.push(bUpper);
  draftArray.push(fActual);
  draftArray.push(fLower);
  draftArray.push(fUpper);
  draftArray.push(searchBox);
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
  // draftArray.push(costContents);
  // draftArray.push(removedContents);

  // console.log("sArray:", draftArray);

  var requestDraft = new XMLHttpRequest();
  requestDraft.open('post', `/ckp1/draft`, true);
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
  requestDraft.send(`dSOP=${encodeURIComponent(JSON.stringify(draftArray))}&dCost=${(encodeURIComponent(JSON.stringify(costContents)).replace(/&amp;/g, '-'))}&drCost=${encodeURIComponent((JSON.stringify(removedContents)).replace(/&amp;/g, '-'))}`);


}

// SOP Function
function sop() {

  let bActual = document.getElementsByClassName("price_cost--value")[0].innerText;
  let bLower = document.getElementsByClassName("price_projected_1--value")[0].innerText;
  let bUpper = document.getElementsByClassName("price_projected_2--value")[0].innerText;
  let fActual = document.getElementsByClassName("UIprice_cost--value")[0].innerText;
  let fLower = document.getElementsByClassName("UIprice_projected_1--value")[0].innerText;
  let fUpper = document.getElementsByClassName("UIprice_projected_2--value")[0].innerText;
  let searchBox = document.getElementById("searchText").value;

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
    // } else if (institution === '' || instructor === '' || pNumber === '' || pDescription === '' || estimate === '' || uPrice === '' || uShip === '') {
    //   alert("Please Enter All The SOP Details !!!");
    // } else if (bLower == '' || bUpper == '') {
    //   alert("Please calculate the Kit price before saving !!!");
  } else {

    let docName = '';

    if (window.globalData === undefined || window.globalData.data.type === 'DRAFT' || window.globalData.data.linked2Draft !== undefined) {
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
            let version = parseInt(data.split('/')[1]);
            if (version === 0) {
              version = 1;
            }
            docName = docNameArray[0] + `#v${version + 1}`;
          }

          if (window.globalData !== undefined) {

            if (data.split('/')[2] !== window.globalData.data.userID) {

              if (window.globalData.data.type === 'PROPOSAL') {

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

                    let costContents = document.getElementsByClassName('cost_list');
                    let removedContents = document.getElementsByClassName('removed_list');
                    // console.log("Checker:", costContents[0].childNodes);

                    // Below are for Partial Route
                    let costContentsPR = document.querySelector('.cost_list').innerHTML;
                    // let a = JSON.stringify(costContents);
                    // let b = a.replace(/&amp;/g, '-');
                    // console.log('costContents:', b);
                    let removedContentsPR = document.querySelector('.removed_list').innerHTML;

                    // Cost Array generation for BOM, pList
                    let costText = [];
                    let abc = costContents[0].childNodes;
                    abc.forEach((item) => {
                      // console.log(`${item.id} - ${item.IidName} - ${item.IdisplayName} - ${item.Ilab} - ${item.Iqty} - ${item.item_value}`);
                      // console.log(item.childNodes);
                      let def = item.childNodes;
                      def.forEach((innerItem) => {
                        let splitArray = innerItem.innerText.trim().split("\n");
                        splitArray.forEach((each) => {
                          costText.push(each);
                        })
                      })
                    });

                    // Removed Array generation for adding loose items to BOM, pList
                    let removedText = [];
                    let xyz = removedContents[0].childNodes;
                    xyz.forEach((item) => {
                      // console.log(`${item.id} - ${item.IidName} - ${item.IdisplayName} - ${item.Ilab} - ${item.Iqty} - ${item.item_value}`);
                      // console.log(item.childNodes);
                      let def = item.childNodes;
                      def.forEach((innerItem) => {
                        let splitArray = innerItem.innerText.trim().split("\n");
                        splitArray.forEach((each) => {
                          removedText.push(each);
                        })
                      })
                    });

                    // let costArray = costContents[0].innerText;
                    // costArray.forEach((item) => {
                    //   console.log("InnerText:", item.innerHTML);
                    // });


                    // console.log("Contents:", costContents[0].innerText);
                    // console.log("Contents:", extractContent(costContents[0].innerHTML));

                    // let costText = costArray.split("\n");
                    // console.log("Checker:", costArray);

                    let line = '';
                    let packingListArray = [];
                    packingListArray.push("Item;Name;Lab;Quantity;Price");
                    let bomLine = '';
                    let bomArray = [];
                    let cnt = 0;
                    let cntRawAssembly = 0;
                    let jumper = 0;

                    // console.log("Checker1:", costText);

                    for (let r = 0; r < costText.length; r++) {
                      cntRawAssembly++;
                      if (costText[r].split('-')[1] !== undefined) {
                        if (costText[r].split('-')[1].toUpperCase().startsWith("BAG") || costText[r].split('-')[1].toUpperCase().startsWith("BTTL") || costText[r].split('-')[1].toUpperCase().startsWith("MODL") || costText[r].split('-')[1].toUpperCase().startsWith("EQUP") || costText[r].split('-')[1].toUpperCase().startsWith("CHEM") || costText[r].split('-')[1].toUpperCase().startsWith("SHIP")) {

                          if (costText[r].split('-')[0].split('.').length > 1) {
                            jumper = 0;
                          }


                          // console.log(costText[r].split('-')[0]);
                          // console.log(costText[r].split('-')[0].split('.').length);

                          // for(let o = 0; o < costText[r].split('-')[0].split('.').length - 1; o++){
                          //   line = '\t' + line;
                          // }

                          // BOM
                          // BOM @Raw&Assembly Items
                          if (costText[r].split('-')[0].split('.').length === 1) {
                            cntRawAssembly = 0;
                            bomLine = costText[r].split('-')[1];
                          }
                          // BOM

                          if (packingListArray.length === 1) {
                            if (cnt === 1) {
                              packingListArray.push(line);
                              line = costText[r];
                            }
                            cnt = 1;
                            line = costText[r];

                          } else {
                            packingListArray.push(line);
                            line = costText[r];
                          }
                        } else {
                          line = line + ";" + costText[r];
                          jumper++;
                          if (jumper === 1 && r !== 1) {
                            line = line + ";NULL";
                          }
                        }
                      } else {
                        line = line + ";" + costText[r];
                        jumper++;

                        if (jumper === 1 && r !== 1) {
                          line = line + ";NULL";
                        }
                      }

                      if (costText.length === r + 1) {
                        packingListArray.push(line);
                      }

                      // BOM
                      if (cntRawAssembly === 3) {
                        bomLine = bomLine + ';' + costText[r];
                        bomArray.push(bomLine);
                      }
                      // BOM

                    }

                    let removedNumbers = [];
                    if (removedText.length > 0) {
                      // alert('removed is present 1');

                      // get all the prefix numbers of the removed components

                      for (let t = 0; t < removedText.length; t++) {
                        // console.log('second:', removedText[t].split('-')[1]);
                        if (removedText[t].split('-')[1] !== undefined && !isNaN(parseInt(removedText[t].split('-')[0].split('.')[0]))) {
                          // console.log('num2:', parseInt(removedText[t].split('-')[0].split('.')[0]));
                          let num = removedText[t].split('-')[0].split('.')[0];
                          if (removedNumbers.includes(num)) {
                            // do not ad the number again
                          } else {
                            removedNumbers.push(num);
                          }
                        }

                      }

                      // console.log('removedNumbers:', removedNumbers);

                      let numIgnore = [];
                      for (let q = 0; q < costText.length; q++) {
                        if (costText[q].split('-')[1] !== undefined) {
                          let costNum = costText[q].split('-')[0].split('.')[0];
                          if (removedNumbers.includes(costNum)) {
                            if (!numIgnore.includes(costText[q].split('-')[0])) {
                              if (costText[q].split('-')[1].toUpperCase().startsWith('BAG') || costText[q].split('-')[1].toUpperCase().startsWith('MODL') || costText[q].split('-')[1].toUpperCase().startsWith('BTTL')) {
                                numIgnore.push(costText[q].split('-')[0]);
                                bomArray.push(`${costText[q].split('-')[1]};1`);
                              } else {
                                let costArraySplit = costText[q].split('-')[0].split('.');
                                let childNumReduced = '';

                                for (let y = 0; y < costArraySplit.length - 1; y++) {
                                  // console.log('costNum[y]:', costArraySplit[y]);
                                  if (childNumReduced.length === 0) {
                                    childNumReduced = costArraySplit[y];
                                  } else {
                                    childNumReduced = `${childNumReduced}.${costArraySplit[y]}`;
                                  }
                                }
                                // console.log('childNumReduced:',childNumReduced);
                                if (numIgnore.includes(childNumReduced)) {
                                  //  this is a child of module, so do not add this.
                                } else {
                                  bomArray.push(`${costText[q].split('-')[1]};1`);
                                }
                              }
                            }
                          }
                        }
                      }

                      // console.log('numIgnore:', numIgnore);

                    }
                    let pageArray = [];
                    let saveArray = [];

                    // push TOP details
                    pageArray.push(docName);
                    pageArray.push(bActual);
                    pageArray.push(bLower);
                    pageArray.push(bUpper);
                    pageArray.push(fActual);
                    pageArray.push(fLower);
                    pageArray.push(fUpper);
                    pageArray.push(searchBox);
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

                    // push pageArray, BOMarray, packingListArray into saveArray
                    saveArray.push(pageArray);
                    saveArray.push(bomArray);
                    saveArray.push(packingListArray);

                    // console.log("1:", pageArray);
                    // console.log("2:", bomArray);
                    // console.log("3:", packingListArray);
                    // let data = JSON.stringify({ pageArray: JSON.stringify(pageArray), bomArray: JSON.stringify(bomArray), packingListArray: JSON.stringify(packingListArray) });

                    // make a backend call to server to persist all the details. Note that the endpoint is different for admin and sales page.

                    var requestSave = new XMLHttpRequest();
                    requestSave.open('post', `/ckp1/save`, true);
                    requestSave.setRequestHeader('x-auth', token);
                    requestSave.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

                    requestSave.send(encodeURIComponent(JSON.stringify(pageArray) + '???' + JSON.stringify(bomArray) + '???' + JSON.stringify(packingListArray)));
                    requestSave.onload = function () {
                      // --- please add one more partial route to save the cost and removed contents, in this res.send = objectID

                      if (requestSave.status === 200) {
                        var partialRequest = new XMLHttpRequest();
                        partialRequest.open('post', `/ckp1/savePartial`, true);
                        let token = localStorage.getItem('x-auth_token');
                        partialRequest.setRequestHeader('x-auth', token);
                        partialRequest.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

                        partialRequest.send(`_id=${this.response}&pCost=${encodeURIComponent((JSON.stringify(costContentsPR)).replace(/&amp;/g, '-'))}&prCost=${encodeURIComponent((JSON.stringify(removedContentsPR)).replace(/&amp;/g, '-'))}`);
                        partialRequest.onload = function () {

                          if (partialRequest.status === 200) {

                            // console.log("data:", this.response);
                            let pdfData = JSON.parse(this.response);
                            // console.log('downloadType:', typeof(pdfData));
                            // console.log('downloadSize:', pdfData.data.length);
                            // console.log('download:', pdfData);

                            // 3
                            // decode base64 string, remove space for IE compatibility
                            // var binary = atob(pdfData.replace(/\s/g, ''));
                            // var len = binary.length;
                            // var buffer = new ArrayBuffer(len);
                            // var view = new Uint8Array(buffer);
                            // for (var i = 0; i < len; i++) {
                            //   view[i] = binary.charCodeAt(i);
                            // }

                            // // create the blob object with content-type "application/pdf"               
                            // var blob = new Blob([view], {
                            //   type: "application/pdf"
                            // });
                            // var url = URL.createObjectURL(blob);

                            let pdfName = partialRequest.getResponseHeader('content-disposition');

                            var file = new Blob([new Uint8Array(pdfData.data)], {
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
                            console.log('Somethings worng 1:', partialRequest.status);
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

              let costContents = document.getElementsByClassName('cost_list');
              let removedContents = document.getElementsByClassName('removed_list');
              // console.log("Checker:", costContents[0].childNodes);

              // Below are for Partial Route
              let costContentsPR = document.querySelector('.cost_list').innerHTML;
              // let a = JSON.stringify(costContents);
              // let b = a.replace(/&amp;/g, '-');
              // console.log('costContents:', b);
              let removedContentsPR = document.querySelector('.removed_list').innerHTML;

              // Cost Array generation for BOM, pList
              let costText = [];
              let abc = costContents[0].childNodes;
              abc.forEach((item) => {
                // console.log(`${item.id} - ${item.IidName} - ${item.IdisplayName} - ${item.Ilab} - ${item.Iqty} - ${item.item_value}`);
                // console.log(item.childNodes);
                let def = item.childNodes;
                def.forEach((innerItem) => {
                  let splitArray = innerItem.innerText.trim().split("\n");
                  splitArray.forEach((each) => {
                    costText.push(each);
                  })
                })
              });

              // Removed Array generation for adding loose items to BOM, pList
              let removedText = [];
              let xyz = removedContents[0].childNodes;
              xyz.forEach((item) => {
                // console.log(`${item.id} - ${item.IidName} - ${item.IdisplayName} - ${item.Ilab} - ${item.Iqty} - ${item.item_value}`);
                // console.log(item.childNodes);
                let def = item.childNodes;
                def.forEach((innerItem) => {
                  let splitArray = innerItem.innerText.trim().split("\n");
                  splitArray.forEach((each) => {
                    removedText.push(each);
                  })
                })
              });

              // let costArray = costContents[0].innerText;
              // costArray.forEach((item) => {
              //   console.log("InnerText:", item.innerHTML);
              // });


              // console.log("Contents:", costContents[0].innerText);
              // console.log("Contents:", extractContent(costContents[0].innerHTML));

              // let costText = costArray.split("\n");
              // console.log("Checker:", costArray);

              let line = '';
              let packingListArray = [];
              packingListArray.push("Item;Name;Lab;Quantity;Price");
              let bomLine = '';
              let bomArray = [];
              let cnt = 0;
              let cntRawAssembly = 0;
              let jumper = 0;

              // console.log("Checker1:", costText);

              for (let r = 0; r < costText.length; r++) {
                cntRawAssembly++;
                if (costText[r].split('-')[1] !== undefined) {
                  if (costText[r].split('-')[1].toUpperCase().startsWith("BAG") || costText[r].split('-')[1].toUpperCase().startsWith("BTTL") || costText[r].split('-')[1].toUpperCase().startsWith("MODL") || costText[r].split('-')[1].toUpperCase().startsWith("EQUP") || costText[r].split('-')[1].toUpperCase().startsWith("CHEM") || costText[r].split('-')[1].toUpperCase().startsWith("SHIP")) {

                    if (costText[r].split('-')[0].split('.').length > 1) {
                      jumper = 0;
                    }


                    // console.log(costText[r].split('-')[0]);
                    // console.log(costText[r].split('-')[0].split('.').length);

                    // for(let o = 0; o < costText[r].split('-')[0].split('.').length - 1; o++){
                    //   line = '\t' + line;
                    // }

                    // BOM
                    // BOM @Raw&Assembly Items
                    if (costText[r].split('-')[0].split('.').length === 1) {
                      cntRawAssembly = 0;
                      bomLine = costText[r].split('-')[1];
                    }
                    // BOM

                    if (packingListArray.length === 1) {
                      if (cnt === 1) {
                        packingListArray.push(line);
                        line = costText[r];
                      }
                      cnt = 1;
                      line = costText[r];

                    } else {
                      packingListArray.push(line);
                      line = costText[r];
                    }
                  } else {
                    line = line + ";" + costText[r];
                    jumper++;
                    if (jumper === 1 && r !== 1) {
                      line = line + ";NULL";
                    }
                  }
                } else {
                  line = line + ";" + costText[r];
                  jumper++;

                  if (jumper === 1 && r !== 1) {
                    line = line + ";NULL";
                  }
                }

                if (costText.length === r + 1) {
                  packingListArray.push(line);
                }

                // BOM
                if (cntRawAssembly === 3) {
                  bomLine = bomLine + ';' + costText[r];
                  bomArray.push(bomLine);
                }
                // BOM

              }

              let removedNumbers = [];
              if (removedText.length > 0) {
                // alert('removed is present 2');

                // get all the prefix numbers of the removed components

                for (let t = 0; t < removedText.length; t++) {
                  // console.log('second:', removedText[t].split('-')[1]);
                  if (removedText[t].split('-')[1] !== undefined && !isNaN(parseInt(removedText[t].split('-')[0].split('.')[0]))) {
                    // console.log('num2:', parseInt(removedText[t].split('-')[0].split('.')[0]));
                    let num = removedText[t].split('-')[0].split('.')[0];
                    if (removedNumbers.includes(num)) {
                      // do not ad the number again
                    } else {
                      removedNumbers.push(num);
                    }
                  }

                }

                // console.log('removedNumbers:', removedNumbers);

                let numIgnore = [];
                for (let q = 0; q < costText.length; q++) {
                  if (costText[q].split('-')[1] !== undefined) {
                    let costNum = costText[q].split('-')[0].split('.')[0];
                    if (removedNumbers.includes(costNum)) {
                      if (!numIgnore.includes(costText[q].split('-')[0])) {
                        if (costText[q].split('-')[1].toUpperCase().startsWith('BAG') || costText[q].split('-')[1].toUpperCase().startsWith('MODL') || costText[q].split('-')[1].toUpperCase().startsWith('BTTL')) {
                          numIgnore.push(costText[q].split('-')[0]);
                          bomArray.push(`${costText[q].split('-')[1]};1`);
                        } else {
                          let costArraySplit = costText[q].split('-')[0].split('.');
                          let childNumReduced = '';

                          for (let y = 0; y < costArraySplit.length - 1; y++) {
                            // console.log('costNum[y]:', costArraySplit[y]);
                            if (childNumReduced.length === 0) {
                              childNumReduced = costArraySplit[y];
                            } else {
                              childNumReduced = `${childNumReduced}.${costArraySplit[y]}`;
                            }
                          }
                          // console.log('childNumReduced:',childNumReduced);
                          if (numIgnore.includes(childNumReduced)) {
                            //  this is a child of module, so do not add this.
                          } else {
                            bomArray.push(`${costText[q].split('-')[1]};1`);
                          }
                        }
                      }
                    }
                  }
                }

                // console.log('numIgnore:', numIgnore);

              }

              let pageArray = [];
              let saveArray = [];

              // push TOP details
              pageArray.push(docName);
              pageArray.push(bActual);
              pageArray.push(bLower);
              pageArray.push(bUpper);
              pageArray.push(fActual);
              pageArray.push(fLower);
              pageArray.push(fUpper);
              pageArray.push(searchBox);
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

              // push pageArray, BOMarray, packingListArray into saveArray
              saveArray.push(pageArray);
              saveArray.push(bomArray);
              saveArray.push(packingListArray);

              // console.log("1:", pageArray);
              // console.log("2:", bomArray);
              // console.log("3:", packingListArray);
              // let data = JSON.stringify({ pageArray: JSON.stringify(pageArray), bomArray: JSON.stringify(bomArray), packingListArray: JSON.stringify(packingListArray) });

              // make a backend call to server to persist all the details. Note that the endpoint is different for admin and sales page.

              var requestSave = new XMLHttpRequest();
              requestSave.open('post', `/ckp1/save`, true);
              requestSave.setRequestHeader('x-auth', token);
              requestSave.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

              requestSave.send(encodeURIComponent(JSON.stringify(pageArray) + '???' + JSON.stringify(bomArray) + '???' + JSON.stringify(packingListArray)));
              requestSave.onload = function () {
                // --- please add one more partial route to save the cost and removed contents, in this res.send = objectID

                if (requestSave.status === 200) {
                  var partialRequest = new XMLHttpRequest();
                  partialRequest.open('post', `/ckp1/savePartial`, true);
                  let token = localStorage.getItem('x-auth_token');
                  partialRequest.setRequestHeader('x-auth', token);
                  partialRequest.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

                  partialRequest.send(`_id=${this.response}&pCost=${encodeURIComponent((JSON.stringify(costContentsPR)).replace(/&amp;/g, '-'))}&prCost=${encodeURIComponent((JSON.stringify(removedContentsPR)).replace(/&amp;/g, '-'))}`);
                  partialRequest.onload = function () {

                    if (partialRequest.status === 200) {

                      // console.log("data:", this.response);
                      let pdfData = JSON.parse(this.response);
                      // console.log('downloadType:', typeof(pdfData));
                      // console.log('downloadSize:', pdfData.data.length);
                      // console.log('download:', pdfData);

                      // 3
                      // decode base64 string, remove space for IE compatibility
                      // var binary = atob(pdfData.replace(/\s/g, ''));
                      // var len = binary.length;
                      // var buffer = new ArrayBuffer(len);
                      // var view = new Uint8Array(buffer);
                      // for (var i = 0; i < len; i++) {
                      //   view[i] = binary.charCodeAt(i);
                      // }

                      // // create the blob object with content-type "application/pdf"               
                      // var blob = new Blob([view], {
                      //   type: "application/pdf"
                      // });
                      // var url = URL.createObjectURL(blob);

                      let pdfName = partialRequest.getResponseHeader('content-disposition');

                      var file = new Blob([new Uint8Array(pdfData.data)], {
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
                      console.log('Somethings worng 1:', partialRequest.status);
                    }

                  }
                } else {
                  console.log('Somethings worng 2:', requestSave.status);
                }


              }

            }
          } else {
            let costContents = document.getElementsByClassName('cost_list');
            let removedContents = document.getElementsByClassName('removed_list');
            // console.log("Checker:", costContents[0].childNodes);

            // Below are for Partial Route
            let costContentsPR = document.querySelector('.cost_list').innerHTML;
            // let a = JSON.stringify(costContents);
            // let b = a.replace(/&amp;/g, '-');
            // console.log('costContents:', b);
            let removedContentsPR = document.querySelector('.removed_list').innerHTML;

            // Cost Array generation for BOM, pList
            let costText = [];
            let abc = costContents[0].childNodes;
            abc.forEach((item) => {
              // console.log(`${item.id} - ${item.IidName} - ${item.IdisplayName} - ${item.Ilab} - ${item.Iqty} - ${item.item_value}`);
              // console.log(item.childNodes);
              let def = item.childNodes;
              def.forEach((innerItem) => {
                let splitArray = innerItem.innerText.trim().split("\n");
                splitArray.forEach((each) => {
                  costText.push(each);
                })
              })
            });

            // Removed Array generation for adding loose items to BOM, pList
            let removedText = [];
            let xyz = removedContents[0].childNodes;
            xyz.forEach((item) => {
              // console.log(`${item.id} - ${item.IidName} - ${item.IdisplayName} - ${item.Ilab} - ${item.Iqty} - ${item.item_value}`);
              // console.log(item.childNodes);
              let def = item.childNodes;
              def.forEach((innerItem) => {
                let splitArray = innerItem.innerText.trim().split("\n");
                splitArray.forEach((each) => {
                  removedText.push(each);
                })
              })
            });

            // let costArray = costContents[0].innerText;
            // costArray.forEach((item) => {
            //   console.log("InnerText:", item.innerHTML);
            // });


            // console.log("Contents:", costContents[0].innerText);
            // console.log("Contents:", extractContent(costContents[0].innerHTML));

            // let costText = costArray.split("\n");
            // console.log("Checker:", costArray);

            let line = '';
            let packingListArray = [];
            packingListArray.push("Item;Name;Lab;Quantity;Price");
            let bomLine = '';
            let bomArray = [];
            let cnt = 0;
            let cntRawAssembly = 0;
            let jumper = 0;

            // console.log("Checker1:", costText);

            for (let r = 0; r < costText.length; r++) {
              cntRawAssembly++;
              if (costText[r].split('-')[1] !== undefined) {
                if (costText[r].split('-')[1].toUpperCase().startsWith("BAG") || costText[r].split('-')[1].toUpperCase().startsWith("BTTL") || costText[r].split('-')[1].toUpperCase().startsWith("MODL") || costText[r].split('-')[1].toUpperCase().startsWith("EQUP") || costText[r].split('-')[1].toUpperCase().startsWith("CHEM") || costText[r].split('-')[1].toUpperCase().startsWith("SHIP")) {

                  if (costText[r].split('-')[0].split('.').length > 1) {
                    jumper = 0;
                  }


                  // console.log(costText[r].split('-')[0]);
                  // console.log(costText[r].split('-')[0].split('.').length);

                  // for(let o = 0; o < costText[r].split('-')[0].split('.').length - 1; o++){
                  //   line = '\t' + line;
                  // }

                  // BOM
                  // BOM @Raw&Assembly Items
                  if (costText[r].split('-')[0].split('.').length === 1) {
                    cntRawAssembly = 0;
                    bomLine = costText[r].split('-')[1];
                  }
                  // BOM

                  if (packingListArray.length === 1) {
                    if (cnt === 1) {
                      packingListArray.push(line);
                      line = costText[r];
                    }
                    cnt = 1;
                    line = costText[r];

                  } else {
                    packingListArray.push(line);
                    line = costText[r];
                  }
                } else {
                  line = line + ";" + costText[r];
                  jumper++;
                  if (jumper === 1 && r !== 1) {
                    line = line + ";NULL";
                  }
                }
              } else {
                line = line + ";" + costText[r];
                jumper++;

                if (jumper === 1 && r !== 1) {
                  line = line + ";NULL";
                }
              }

              if (costText.length === r + 1) {
                packingListArray.push(line);
              }

              // BOM
              if (cntRawAssembly === 3) {
                bomLine = bomLine + ';' + costText[r];
                bomArray.push(bomLine);
              }
              // BOM

            }

            let removedNumbers = [];
            if (removedText.length > 0) {
              // alert('removed is present 3');

              // get all the prefix numbers of the removed components

              for (let t = 0; t < removedText.length; t++) {
                // console.log('second:', removedText[t].split('-')[1]);
                if (removedText[t].split('-')[1] !== undefined && !isNaN(parseInt(removedText[t].split('-')[0].split('.')[0]))) {
                  // console.log('num2:', parseInt(removedText[t].split('-')[0].split('.')[0]));
                  let num = removedText[t].split('-')[0].split('.')[0];
                  if (removedNumbers.includes(num)) {
                    // do not ad the number again
                  } else {
                    removedNumbers.push(num);
                  }
                }

              }

              // console.log('removedNumbers:', removedNumbers);

              let numIgnore = [];
              for (let q = 0; q < costText.length; q++) {
                if (costText[q].split('-')[1] !== undefined) {
                  let costNum = costText[q].split('-')[0].split('.')[0];
                  if (removedNumbers.includes(costNum)) {
                    if (!numIgnore.includes(costText[q].split('-')[0])) {
                      if (costText[q].split('-')[1].toUpperCase().startsWith('BAG') || costText[q].split('-')[1].toUpperCase().startsWith('MODL') || costText[q].split('-')[1].toUpperCase().startsWith('BTTL')) {
                        numIgnore.push(costText[q].split('-')[0]);
                        bomArray.push(`${costText[q].split('-')[1]};1`);
                      } else {
                        let costArraySplit = costText[q].split('-')[0].split('.');
                        let childNumReduced = '';

                        for (let y = 0; y < costArraySplit.length - 1; y++) {
                          // console.log('costNum[y]:', costArraySplit[y]);
                          if (childNumReduced.length === 0) {
                            childNumReduced = costArraySplit[y];
                          } else {
                            childNumReduced = `${childNumReduced}.${costArraySplit[y]}`;
                          }
                        }
                        // console.log('childNumReduced:',childNumReduced);
                        if (numIgnore.includes(childNumReduced)) {
                          //  this is a child of module, so do not add this.
                        } else {
                          bomArray.push(`${costText[q].split('-')[1]};1`);
                        }
                      }
                    }
                  }
                }
              }

              // console.log('numIgnore:', numIgnore);

            }

            let pageArray = [];
            let saveArray = [];

            // push TOP details
            pageArray.push(docName);
            pageArray.push(bActual);
            pageArray.push(bLower);
            pageArray.push(bUpper);
            pageArray.push(fActual);
            pageArray.push(fLower);
            pageArray.push(fUpper);
            pageArray.push(searchBox);
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

            // push pageArray, BOMarray, packingListArray into saveArray
            saveArray.push(pageArray);
            saveArray.push(bomArray);
            saveArray.push(packingListArray);

            // console.log("1:", pageArray);
            // console.log("2:", bomArray);
            // console.log("3:", packingListArray);
            // let data = JSON.stringify({ pageArray: JSON.stringify(pageArray), bomArray: JSON.stringify(bomArray), packingListArray: JSON.stringify(packingListArray) });

            // make a backend call to server to persist all the details. Note that the endpoint is different for admin and sales page.

            var requestSave = new XMLHttpRequest();
            requestSave.open('post', `/ckp1/save`, true);
            requestSave.setRequestHeader('x-auth', token);
            requestSave.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

            requestSave.send(encodeURIComponent(JSON.stringify(pageArray) + '???' + JSON.stringify(bomArray) + '???' + JSON.stringify(packingListArray)));
            requestSave.onload = function () {
              // --- please add one more partial route to save the cost and removed contents, in this res.send = objectID

              if (requestSave.status === 200) {
                var partialRequest = new XMLHttpRequest();
                partialRequest.open('post', `/ckp1/savePartial`, true);
                let token = localStorage.getItem('x-auth_token');
                partialRequest.setRequestHeader('x-auth', token);
                partialRequest.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

                partialRequest.send(`_id=${this.response}&pCost=${encodeURIComponent((JSON.stringify(costContentsPR)).replace(/&amp;/g, '-'))}&prCost=${encodeURIComponent((JSON.stringify(removedContentsPR)).replace(/&amp;/g, '-'))}`);
                partialRequest.onload = function () {

                  if (partialRequest.status === 200) {

                    // console.log("data:", this.response);
                    let pdfData = JSON.parse(this.response);
                    // console.log('downloadType:', typeof(pdfData));
                    // console.log('downloadSize:', pdfData.data.length);
                    // console.log('download:', pdfData);

                    // 3
                    // decode base64 string, remove space for IE compatibility
                    // var binary = atob(pdfData.replace(/\s/g, ''));
                    // var len = binary.length;
                    // var buffer = new ArrayBuffer(len);
                    // var view = new Uint8Array(buffer);
                    // for (var i = 0; i < len; i++) {
                    //   view[i] = binary.charCodeAt(i);
                    // }

                    // // create the blob object with content-type "application/pdf"               
                    // var blob = new Blob([view], {
                    //   type: "application/pdf"
                    // });
                    // var url = URL.createObjectURL(blob);

                    let pdfName = partialRequest.getResponseHeader('content-disposition');

                    var file = new Blob([new Uint8Array(pdfData.data)], {
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
                    console.log('Somethings worng 1:', partialRequest.status);
                  }

                }
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

// sop() dependent function
function extractContent(s) {
  var span = document.createElement('span');
  span.innerHTML = s;
  return span.textContent || span.innerText;
};

function switchUI() {
  if (confirm('Are you sure you want to SWITCH to SALES UI?')) {
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

// below section handles the functionality of the checkbox events. In order to move checked lab into cart

let checkbox = document.querySelectorAll('[type="checkbox"]');

// Event Listener:
let m;
for (m = 0; m < checkbox.length; m++) {
  checkbox[m].addEventListener('change', function (event) {
    // console.log(this.value);
    if (this.value.split('-')[1].startsWith('v')) {
      // console.log('version');
      document.querySelector('.cost_list').textContent = '';
      document.querySelector('.removed_list').textContent = '';
      document.querySelector('.cart_list').textContent = '';

      document.querySelector('.price_cost--value').textContent = "0.0";
      document.querySelector('.price_projected_1--value').textContent = "0.0";
      document.querySelector('.price_projected_2--value').textContent = "0.0";
      document.querySelector('.lastPurchasePrice--value').textContent = "0.0";

      document.querySelector('.UIprice_cost--value').textContent = "0.0";
      document.querySelector('.UIprice_projected_1--value').textContent = "0.0";
      document.querySelector('.UIprice_projected_2--value').textContent = "0.0";
      document.querySelector('.packingCost--value').textContent = "0.0";
      if (this.checked) {

        // function to move the lab to the cart
        moveLabToCart();

      } else {
        document.querySelector('.cart_list').textContent = '';
        clearCheckBoxes();
      }
    } else {
      // console.log('plain');
      document.querySelector('.cost_list').textContent = '';
      document.querySelector('.removed_list').textContent = '';
      document.querySelector('.cart_list').textContent = '';

      document.querySelector('.price_cost--value').textContent = "0.0";
      document.querySelector('.price_projected_1--value').textContent = "0.0";
      document.querySelector('.price_projected_2--value').textContent = "0.0";
      document.querySelector('.lastPurchasePrice--value').textContent = "0.0";

      document.querySelector('.UIprice_cost--value').textContent = "0.0";
      document.querySelector('.UIprice_projected_1--value').textContent = "0.0";
      document.querySelector('.UIprice_projected_2--value').textContent = "0.0";
      document.querySelector('.packingCost--value').textContent = "0.0";
      // function to move the lab to the cart
      moveLabToCart();

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
    ["pt-6", "Pharmacy Technician $$$ Preparing Investigational Drugs"]

  ]);

  let cartArray = [];
  let cartLabs = new Map();
  let v;
  for (v = 0; v < checkbox.length; v++) {
    if (checkbox[v].checked && !checkbox[v].value.split('-')[1].startsWith('v') && !checkbox[v].value.split('-')[1].startsWith('d')) {
      cartArray.push(checkbox[v].value);
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
  subs.push('kitVersion', 'ap', 'as', 'es', 'fs', 'gb', 'gc', 'gp', 'hb', 'hg', 'ib', 'ic', 'ip', 'mb', 'sg', 'bg', 'rm', 'pt');
  subs.forEach((sub) => {
    let checkbox = document.getElementsByName(sub);
    checkbox.forEach((element) => {
      // remove standard version for that particular subject
      if (element.id.split('-')[1].startsWith('v') && element.id.split('-')[0].startsWith(`${labToUncheck.split('-')[0]}`)) {
        element.checked = false;
      }
    });
  });

  document.querySelector('.cost_list').textContent = '';
  document.querySelector('.removed_list').textContent = '';
  document.querySelector('.cart_list').textContent = '';

  document.querySelector('.price_cost--value').textContent = "0.0";
  document.querySelector('.price_projected_1--value').textContent = "0.0";
  document.querySelector('.price_projected_2--value').textContent = "0.0";
  document.querySelector('.lastPurchasePrice--value').textContent = "0.0";

  document.querySelector('.UIprice_cost--value').textContent = "0.0";
  document.querySelector('.UIprice_projected_1--value').textContent = "0.0";
  document.querySelector('.UIprice_projected_2--value').textContent = "0.0";
  document.querySelector('.packingCost--value').textContent = "0.0";
  moveLabToCart();
}

/* --------------------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------ $$              indexCalculator_admin.html            $$ -------------------------------------------
---------------------------------------------------------------------------------------------------------------------------------------------------*/