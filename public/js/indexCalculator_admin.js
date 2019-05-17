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

var coll2 = document.getElementsByClassName("collapsible2");
var i;

for (i = 0; i < coll2.length; i++) {
  coll2[i].addEventListener("click", function () {
    // console.log("clicked");
    this.classList.toggle("active");
    var content = this.nextElementSibling;
    if (content.style.display === "block") {
      content.style.display = "none";
    } else {
      content.style.display = "block";
    }
  });
}

var coll3 = document.getElementsByClassName("collapsible3");
var i;

for (i = 0; i < coll3.length; i++) {
  coll3[i].addEventListener("click", function () {
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
        dispPrice(data[3], data[4]);
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
document.querySelector('.clearButton').addEventListener('click', () => {

  document.querySelector('.cost_list').textContent = '';
  document.querySelector('.removed_list').textContent = '';

  clearCheckBoxes();

  document.querySelector('.price_cost--value').textContent = "0.0";
  document.querySelector('.price_projected_1--value').textContent = "0.0";
  document.querySelector('.price_projected_2--value').textContent = "0.0";

  document.querySelector('.UIprice_cost--value').textContent = "0.0";
  document.querySelector('.UIprice_projected_1--value').textContent = "0.0";
  document.querySelector('.UIprice_projected_2--value').textContent = "0.0";

  document.getElementById("institution").value = '';
  document.getElementById("instructor").value = '';
  document.getElementById("pNumber").value = '';
  document.getElementById("pDescription").value = '';
  document.getElementById("estimate").value = '';
  document.getElementById("uPrice").value = '';
  document.getElementById("uShip").value = '';
  document.getElementById("searchText").value = '';

  document.getElementById("notes").value = '';
});

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

// Display Price //
function dispPrice(BOM, dependencyTree) {

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

    if (parent.idName.startsWith("Equp") || parent.idName.startsWith("equp") || parent.idName.startsWith("Chem") || parent.idName.startsWith("Ship")) {
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

    htmlParentProto = '<h2 <button class="collapsible2"><div class="item clearfix" id="cost-%itemCount%"><div class="idName">%idName%</div><div class="displayName">%displayName%</div><div class="lab">%lab%</div><div class="qty">%qty%</div><div class="right clearfix"><div class="item_delete"><button onclick="itemDelete(this)" class="item_delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div></h2>';
    htmlChildProto = '<div class="item clearfix" id="cost-%childCount%"><div class="memItem">%memItem%</div><div class="memDisplayName">%memDisplayName%</div><div class="memQuantity">%memQuantity%</div><div class="right clearfix"><div class="item_value">%item_value%</div><div class="item_delete"><button onclick="itemDelete(this)" class="item_delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
    htmlParentProto2 = '<h2 <button class="collapsible3"><div class="item clearfix" id="cost-%bagCount%"><div class="idName">%memBag%</div><div class="displayName">%memBagDisplayName%</div><div class="qty">%qty%</div><div class="right clearfix"><div class="item_delete"><button onclick="itemDelete(this)" class="item_delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div></h2>';


    if (parent.idName.startsWith("Bag") || parent.idName.startsWith("Bttl") || parent.idName.startsWith("Modl")) {

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

          if (details.memItem.startsWith("Bag") || details.memItem.startsWith("Bttl") || details.memItem.startsWith("Modl")) {

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

                if (bagElements.memItem.startsWith("Bag") || bagElements.memItem.startsWith("Bttl") || bagElements.memItem.startsWith("Modl")) {
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
              // htmlTemp += '</div>';

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
        // html += '</div>';

        itemCount++;
      }

      // Insert the HTML into the DOM
      document.querySelector('.cost_list').insertAdjacentHTML('beforeend', html);

    }
  }

  OLDdispPrice();

}

// OLD Display Price // - this calculates the cost
function OLDdispPrice() {
  // this function does the calculation from what's visible on the screen

  let cost_list = document.querySelector('.cost_list');

  let sum = 5;
  sum2 = 0;
  if (cost_list.childElementCount > 0) {

    cost_list.childNodes.forEach((element) => {

      if (element.childElementCount > 1) {
        // console.log(element.childNodes[0].innerHTML.split('-')[1]);
        let quantity = parseFloat(element.childNodes[element.childElementCount - 2].innerHTML);
        let unitCost = parseFloat(element.childNodes[element.childElementCount - 1].childNodes[0].innerHTML);
        // console.log(`${element.childNodes[0].innerHTML.split('-')[1]} = ${quantity} - ${unitCost} = ${quantity * unitCost}`);

        if (unitCost < 0 || isNaN(unitCost)) {
          unitCost = 0;
        }

        sum = sum + quantity * unitCost;
        sum2 = sum2 + quantity;
      }

    });

    // console.log("SUM:", sum);
    // console.log("SUM2:", sum2);

    document.querySelector('.UIprice_cost--value').textContent = Math.round(sum * 100) / 100;
    document.querySelector('.UIprice_projected_1--value').textContent = Math.round(sum * (1 / 0.35) * 100) / 100;
    document.querySelector('.UIprice_projected_2--value').textContent = Math.round(sum * (1 / 0.31) * 100) / 100;

    // update BUDGET here please

  } else {
    alert('No item in Cost List, Please fill the List');
  }
}

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

// itemDelete Function //

function itemDelete(element) {

  console.log(element.parentNode.parentNode.parentNode.id);

  let el = document.getElementById(element.parentNode.parentNode.parentNode.id);

  let item = element.parentNode.parentNode.parentNode.id;

  // console.log('1:', el.innerText);
  // console.log('2:',el.childNodes);

  if (el.childNodes[0].innerHTML.split('-')[1].startsWith("Bag") || el.childNodes[0].innerHTML.split('-')[1].startsWith("Bttl") || el.childNodes[0].innerHTML.split('-')[1].startsWith("Modl")) {

    el.parentNode.removeChild(el);
    document.querySelector('.removed_list').insertAdjacentHTML('beforeend', '<div class="item clearfix" id="%id%">'.replace("%id%", el.id) + el.innerHTML.replace('itemDelete', 'itemAdd') + '</div>');
    for (let i = 1; i < 99; i++) {
      el1 = document.getElementById(item + `.${i}`);

      if (el1 === null) {
        break;
      } else {
        // console.log(item + `.${i}`);

        if (el1.childNodes[0].innerHTML.split('-')[1].startsWith("Bag") || el1.childNodes[0].innerHTML.split('-')[1].startsWith("Bttl") || el1.childNodes[0].innerHTML.split('-')[1].startsWith("Modl")) {
          el1.parentNode.removeChild(el1);
          document.querySelector('.removed_list').insertAdjacentHTML('beforeend', '<div class="item clearfix" id="%id%">'.replace("%id%", el1.id) + el1.innerHTML.replace('itemDelete', 'itemAdd') + '</div>');

          for (let n = 1; n < 99; n++) {
            el2 = document.getElementById(`${item}.${i}.${n}`);
            // console.log("el2:", el2);

            if (el2 === null) {
              break;
            } else {
              el2.parentNode.removeChild(el2);
              document.querySelector('.removed_list').insertAdjacentHTML('beforeend', '<div class="item clearfix" id="%id%">'.replace("%id%", el2.id) + el2.innerHTML.replace('itemDelete', 'itemAdd') + '</div>');
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

  // el.parentNode.removeChild(el);

  // move the costed element from cost list to removed list

  // update UI

  // update the budget

}

// itemAdd Function //
function itemAdd(element) {
  console.log(element.parentNode.parentNode.parentNode.id);

  let el = document.getElementById(element.parentNode.parentNode.parentNode.id);

  let item = element.parentNode.parentNode.parentNode.id;

  // console.log(el.innerText);
  // console.log(el.childNodes);

  if (el.childNodes[0].innerHTML.split('-')[1].startsWith("Bag") || el.childNodes[0].innerHTML.split('-')[1].startsWith("Bttl") || el.childNodes[0].innerHTML.split('-')[1].startsWith("Modl")) {

    el.parentNode.removeChild(el);
    document.querySelector('.cost_list').insertAdjacentHTML('beforeend', '<div class="item clearfix" id="%id%">'.replace("%id%", el.id) + el.innerHTML.replace('itemAdd', 'itemDelete') + '</div>');
    for (let i = 1; i < 99; i++) {
      el1 = document.getElementById(item + `.${i}`);

      if (el1 === null) {
        break;
      } else {
        // console.log(item + `.${i}`);

        if (el1.childNodes[0].innerHTML.split('-')[1].startsWith("Bag") || el1.childNodes[0].innerHTML.split('-')[1].startsWith("Bttl") || el1.childNodes[0].innerHTML.split('-')[1].startsWith("Modl")) {
          el1.parentNode.removeChild(el1);
          document.querySelector('.cost_list').insertAdjacentHTML('beforeend', '<div class="item clearfix" id="%id%">'.replace("%id%", el1.id) + el1.innerHTML.replace('itemAdd', 'itemDelete') + '</div>');

          for (let n = 1; n < 99; n++) {
            el2 = document.getElementById(`${item}.${i}.${n}`);
            // console.log("el2:", el2);

            if (el2 === null) {
              break;
            } else {
              el2.parentNode.removeChild(el2);
              document.querySelector('.cost_list').insertAdjacentHTML('beforeend', '<div class="item clearfix" id="%id%">'.replace("%id%", el2.id) + el2.innerHTML.replace('itemAdd', 'itemDelete') + '</div>');
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

    document.querySelector('.cost_list').innerHTML = data.costContents;
    document.querySelector('.removed_list').innerHTML = data.removedContents;

    // to select the check boxes from txt
    if (data.txt.length !== 0) {
      var txt = data.txt.split(' ');
      var i;
      for (i = 0; i < txt.length; i++) {

        document.querySelectorAll(`input[type='checkbox'][value='${txt[i]}']`)[0].checked = true;

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

    document.querySelector('.cost_list').innerHTML = data.costContents;
    document.querySelector('.removed_list').innerHTML = data.removedContents;

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

  let bActual = document.getElementsByClassName("price_cost--value")[0].innerText;
  let bLower = document.getElementsByClassName("price_projected_1--value")[0].innerText;
  let bUpper = document.getElementsByClassName("price_projected_2--value")[0].innerText;
  let fActual = document.getElementsByClassName("UIprice_cost--value")[0].innerText;
  let fLower = document.getElementsByClassName("UIprice_projected_1--value")[0].innerText;
  let fUpper = document.getElementsByClassName("UIprice_projected_2--value")[0].innerText;
  let searchBox = document.getElementById("searchText").value;
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

  let institution = document.getElementById("institution").value;
  let instructor = document.getElementById("instructor").value;
  let pNumber = document.getElementById("pNumber").value;
  let pDescription = document.getElementById("pDescription").value;
  let estimate = document.getElementById("estimate").value;
  let uPrice = document.getElementById("uPrice").value;
  let uShip = document.getElementById("uShip").value;
  let notes = document.getElementById("notes").value;

  txt = generateLabString();

  if (txt.length === 0 || document.getElementsByClassName('cost_list')[0].childNodes.length === 0) {
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
                        if (costText[r].split('-')[1].startsWith("Bag") || costText[r].split('-')[1].startsWith("bag") || costText[r].split('-')[1].startsWith("Bttl") || costText[r].split('-')[1].startsWith("bttl") || costText[r].split('-')[1].startsWith("Modl") || costText[r].split('-')[1].startsWith("modl") || costText[r].split('-')[1].startsWith("Equp") || costText[r].split('-')[1].startsWith("equp") || costText[r].split('-')[1].startsWith("Chem") || costText[r].split('-')[1].startsWith("chem") || costText[r].split('-')[1].startsWith("Ship") || costText[r].split('-')[1].startsWith("ship")) {

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
                              if (costText[q].split('-')[1].startsWith('Bag') || costText[q].split('-')[1].startsWith('Modl') || costText[q].split('-')[1].startsWith('Bttl')) {
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
                            location.reload(); // to avoid saving the same doc
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
                            var fileURL = URL.createObjectURL(file);
                            window.open(fileURL, pdfName);

                            alert('SOP was saved');

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
                  if (costText[r].split('-')[1].startsWith("Bag") || costText[r].split('-')[1].startsWith("bag") || costText[r].split('-')[1].startsWith("Bttl") || costText[r].split('-')[1].startsWith("bttl") || costText[r].split('-')[1].startsWith("Modl") || costText[r].split('-')[1].startsWith("modl") || costText[r].split('-')[1].startsWith("Equp") || costText[r].split('-')[1].startsWith("equp") || costText[r].split('-')[1].startsWith("Chem") || costText[r].split('-')[1].startsWith("chem") || costText[r].split('-')[1].startsWith("Ship") || costText[r].split('-')[1].startsWith("ship")) {

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
                        if (costText[q].split('-')[1].startsWith('Bag') || costText[q].split('-')[1].startsWith('Modl') || costText[q].split('-')[1].startsWith('Bttl')) {
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
                      location.reload(); // to avoid saving the same doc
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
                      var fileURL = URL.createObjectURL(file);
                      window.open(fileURL, pdfName);

                      alert('SOP was saved');

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
                if (costText[r].split('-')[1].startsWith("Bag") || costText[r].split('-')[1].startsWith("bag") || costText[r].split('-')[1].startsWith("Bttl") || costText[r].split('-')[1].startsWith("bttl") || costText[r].split('-')[1].startsWith("Modl") || costText[r].split('-')[1].startsWith("modl") || costText[r].split('-')[1].startsWith("Equp") || costText[r].split('-')[1].startsWith("equp") || costText[r].split('-')[1].startsWith("Chem") || costText[r].split('-')[1].startsWith("chem") || costText[r].split('-')[1].startsWith("Ship") || costText[r].split('-')[1].startsWith("ship")) {

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
                      if (costText[q].split('-')[1].startsWith('Bag') || costText[q].split('-')[1].startsWith('Modl') || costText[q].split('-')[1].startsWith('Bttl')) {
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
                    location.reload(); // to avoid saving the same doc
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
                    var fileURL = URL.createObjectURL(file);
                    window.open(fileURL, pdfName);

                    alert('SOP was saved');

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

/* --------------------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------ $$              indexCalculator_admin.html            $$ -------------------------------------------
---------------------------------------------------------------------------------------------------------------------------------------------------*/