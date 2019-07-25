// NPM CONSTANTS //

const _ = require('lodash');
const express = require('express');
var app = express();
// const bodyParser = require('body-parser');
const mysql = require('mysql');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');

// const jp = require('json-safe-parse');
// app.use(jp);

// body parser
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));

var bodyParser = require('body-parser');
app.use(bodyParser.json({
  limit: '50mb'
}));
app.use(bodyParser.urlencoded({
  limit: '50mb',
  extended: false
}));


// app.use(cors());

// NPM CONSTANTS //

// FILE CONSTANTS //

const publicPath = path.join(__dirname, '../public');

const bomFileServer = path.join(__dirname, '/fileServer/bomFiles/');
const packingFileServer = path.join(__dirname, '/fileServer/packingFiles/');
const proposalFileServer = path.join(__dirname, '/fileServer/proposalFiles/');

const mysqlCredentials = require(__dirname + '/mysqlDB/mysqlCredentials');
var {
  authenticate
} = require('./middleware/authenticate');

// FILE CONSTANTS //

// EXPRESS and APP. PORT //
app.use(express.static(publicPath));

// const min = 20000;
// const max = 30000;
// const port = Math.floor(Math.random() * (max - min)) + min;
const port = 25000;

const jwtLogin = require('jwt-login');

// EXPRESS and APP. PORT //

// MONGO DB //

var {
  mongoose
} = require('./mongoDB/mongoose');
var {
  User
} = require('./models/user');
var {
  Draft
} = require('./models/draft');
var {
  Proposal
} = require('./models/proposal');
const {
  ObjectID
} = require('mongodb');

// MONGO DB //

// pdfmake - installation is a bit different. Follow @https://www.npmjs.com/package/pdfmake//

const pdfmakePath = path.join(__dirname, '/pdfmake');
// pdfmake For Server Save//
var fonts = {
  Roboto: {
    normal: `${pdfmakePath}/tests/fonts/Roboto-Regular.ttf`,
    bold: `${pdfmakePath}/tests/fonts/Roboto-Medium.ttf`,
    italics: `${pdfmakePath}/tests/fonts/Roboto-Italic.ttf`,
    bolditalics: `${pdfmakePath}/tests/fonts/Roboto-MediumItalic.ttf`
  },
  Fontello: {
    normal: `${pdfmakePath}/tests/fonts/Fontello.ttf`,
    bold: `${pdfmakePath}/tests/fonts/Fontello.ttf`,
    italics: `${pdfmakePath}/tests/fonts/Fontello.ttf`,
    bolditalics: `${pdfmakePath}/tests/fonts/Fontello.ttf`
  }
};

const PdfPrinter = require(`${pdfmakePath}/src/printer`);
const printer = new PdfPrinter(fonts);
// pdfmake For Server Save//

// pdfmake For Client Download//
const pdfMake = require(`${pdfmakePath}/build/pdfmake`);
const vfsFonts = require(`${pdfmakePath}/build/vfs_fonts`);
pdfMake.vfs = vfsFonts.pdfMake.vfs;
// pdfmake For Client Download//

// local docDefination
let docDefinition = require('./models/proposalPDFdefination');

// pdfmake //

var pdfFillForm = require('pdf-fill-form');
const HummusRecipe = require('hummus-recipe');

// CREATE COMMUNICATION WITH MYSQL DATABASE //

// this eliminates the mysql connection error

var connection;

function handleDisconnect() {
  connection = mysql.createConnection(mysqlCredentials.getConfig()); // Recreate the connection, since
  // the old one cannot be reused.

  connection.connect(function (err) { // The server is either down
    if (err) { // or restarting (takes a while sometimes).
      console.log('error@DB1 when connecting to db:', err);
      setTimeout(handleDisconnect, 5000); // We introduce a delay before attempting to reconnect,
    } else { // to avoid a hot loop, and to allow our node script to
      console.log('Connected to mysql Server');
    }

  }); // process asynchronous requests in the meantime.
  // If you're also serving http, display a 503 error.
  connection.on('error', function (err) {
    console.log('db error@DB2:', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
      handleDisconnect(); // lost due to either server restart, or a
    } else { // connnection idle timeout (the wait_timeout
      throw err; // server variable configures this)
    }
  });
}

handleDisconnect();

// this eliminates the mysql connection error

// CREATE COMMUNICATION WITH MYSQL DATABASE //

// HTTPS //

// var https = require('https');
// var fs = require('fs');

// // This line is from the Node.js HTTPS documentation.
// var options = {
//   cert: fs.readFileSync('/home/eslhive/Desktop/https/server.crt'),
//   key: fs.readFileSync('/home/eslhive/Desktop/https/server.key'),
//   ca: fs.readFileSync('/home/eslhive/Desktop/https/ca.crt'), 
//   requestCert: true, rejectUnauthorized: false
// };

// // Create an HTTPS service identical to the HTTP service.
// https.createServer(options, app).listen(port, function(){
//   console.log("PORT:", port);
// });

// HTTPS // have http redirect to https route


// ROUTES //

// ************************************************ !!!! VALIDATOR !!!! ******************************************************* //
// this route is created just to make static pages as dynamic
app.post('/validate0', authenticate, (req, res) => {
  if (req.user.role === 0) {
    res.status(200).send(req.user);
  } else {
    res.status(401).send("Access Denied");
  }
});

app.post('/validate1', authenticate, (req, res) => {
  if (req.user.role === 0 || req.user.role === 1) {
    res.status(200).send(req.user);
  } else {
    res.status(401).send("Access Denied");
  }
});

app.post('/validate2', authenticate, (req, res) => {
  res.status(200).send(req.user);
});

// ************************************************ !!!! VALIDATOR !!!! ******************************************************* //

// ************************************************ User Access Routes ******************************************************* //

//* // main page 
app.get('/', (req, res) => {
  res.status(200).sendFile(publicPath + '/index.html');
});

//* //login make this route similar to above route, send the page based on role rather than sending user object
app.post("/login", function (req, res) {

  var body = _.pick(req.body, ['user', 'password']);

  User.findByCredentials(body.user, body.password).then((user) => {
    return user.generateAuthToken().then((token) => {
      if (user.role === 0 || user.role === 1) {
        if (user.currentRole === 1) {
          res.header('x-auth', token).status(200).send('/indexCalculator_admin.html$1');
        } else {
          res.header('x-auth', token).status(200).send('/indexCalculator_admin.html$2');
        }
      } else if (user.role === 2) {
        res.header('x-auth', token).status(200).send('/indexCalculator.html');
      } else {
        console.log('error@login user:', user);
      }

    });
  }).catch((e) => {
    // console.log(e);
    res.status(400).send(e);
  });

});

//* // logout
app.delete('/logout', authenticate, (req, res) => {
  req.user.removeToken(req.token).then(() => {
    res.status(200).send();
  }, () => {
    res.status(400).send();
  });
});

// ************************************************ User Access Routes ******************************************************* //

// ************************************************ User Management Routes - User end ******************************************************* //

//* // REGISTER USER
app.post('/users/register', (req, res) => {

  User.find({
    email: req.body.email
  }).then((valid) => {
    if (valid.length > 0) {
      if (valid[0].password === null) {

        bcrypt.compare(req.body.passPhrase, valid[0].passPhrase).then((resCrypt) => {
          if (resCrypt) {
            bcrypt.genSalt(10, (err, salt) => {
              bcrypt.hash(req.body.password, salt, (err, hash) => {
                req.body.password = hash;
                const update = {
                  password: hash
                };

                User.findByIdAndUpdate(valid[0]._id, {
                  $set: update
                }, {
                    new: true
                  }).then((user) => {
                    if (!user) {
                      return res.status(404).send();
                    }
                    res.send({
                      user
                    });
                  }).catch((e) => {
                    console.log(e);
                    res.status(500).send(e);
                  });
              });
            });
          } else {
            res.status(401).send("UNAUTHORIZED USER");
          }
        });

      } else {
        res.status(406).send("DUPLICATE");
      }
    } else {
      res.status(401).send("UNAUTHORIZED");
    }
  }).catch((e) => {
    console.log(e);
  });
});
// REGISTER USER

//* // RESET Password
app.post('/users/reset', (req, res) => {

  User.find({
    email: req.body.email
  }).then((valid) => {
    if (valid.length > 0) {
      if (valid[0].password !== null) {

        bcrypt.compare(req.body.passPhrase, valid[0].passPhrase).then((resCrypt) => {
          if (resCrypt) {
            bcrypt.genSalt(10, (err, salt) => {
              bcrypt.hash(req.body.password, salt, (err, hash) => {
                req.body.password = hash;
                const update = {
                  password: hash
                };

                User.findByIdAndUpdate(valid[0]._id, {
                  $set: update
                }, {
                    new: true
                  }).then((user) => {
                    if (!user) {
                      return res.status(404).send();
                    }
                    res.status(200).send({
                      user
                    });
                  }).catch((e) => {
                    console.log(e);
                    res.status(500).send(e);
                  });
              });
            });
          } else {
            res.status(401).send("UNAUTHORIZED USER");
          }
        });
      } else {
        res.status(406).send("NEW USER");
      }
    } else {
      res.status(401).send("UNAUTHORIZED");
    }
  }).catch((e) => {
    console.log(e);
  });
});
// RESET Password

// ************************************************ User Management Routes - User end ******************************************************* //

// ************************************************ User Management Routes - SupdeAdmin end ******************************************************* //

// 0 // CREATE - Create user, only allowed to super admin to do so
app.post('/users', (req, res) => {
  // RBAC
  // if (req.user.role !== 0) {
  //   res.status(418).send();
  //   return;
  // }

  var user = new User({
    email: req.body.email,
    fName: req.body.fName,
    lName: req.body.lName,
    desig: req.body.desig,
    passPhrase: req.body.passPhrase,
    role: req.body.role,
    currentRole: req.body.role,
  });

  User.find({
    email: user.email
  }).then((dup) => {
    if (dup.length > 0) {
      res.status(409).send("Duplicate User");
    } else {
      user.save().then((doc) => {
        res.send(doc);
      }, (e) => {
        res.status(400).send(e);
      });
    }
  }).catch((e) => {
    res.status(500).send(e);
  });
});
// CREATE - Create user, only allowed to super admin to do so

// 0 // READ - get stats, only allowed to super admin to do so
app.get('/users', authenticate, (req, res) => {
  // console.log("USER INFO:", req.user);
  // RBAC
  if (req.user.role !== 0) {
    res.status(418).send();
    return;
  }

  User.find().then((dup) => {
    if (!dup) {
      res.status(404).send("No User");
    } else {
      res.status(200).send(dup);
    }
  }).catch((e) => {
    res.status(400).send();
  });
});
// READ - get stats,  only allowed to super admin to do so

// 0 // DELETE - Delete user by email, only allowed to super admin to do so
app.delete('/users/:id', authenticate, (req, res) => {
  // RBAC
  if (req.user.role !== 0) {
    res.status(418).send();
    return;
  }

  let id = req.params.id;
  // console.log("ID:", id);

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  User.findByIdAndDelete(id).then((user) => {
    if (!user) {
      return res.status(404).send();
    }

    res.status(200).send();
  }).catch((e) => {
    res.status(400).send();
  });
});
// DELETE - Delete user by email, only allowed to super admin to do so

// 0 // GET PROPOSAL - SuperAdmin - for getting all the proposals for generating packing list and BOM
app.get('/ckp/save', authenticate, async (req, res) => {
  // RBAC
  if (req.user.role !== 0) {
    res.status(418).send();
    return;
  }

  Proposal.find().then((dup) => {
    if (dup.length > 0) {
      // let dupArray = [];
      // dupArray.push(dup);
      res.status(200).send(dup);
    } else {
      res.status(204).send();
    }
  }, (e) => {
    res.status(500).send(e);
  });

});

// 0 // GET BOM - SuperAdmin - for downloading BOM
app.get('/ckpBOM/:id', authenticate, async (req, res) => {
  // RBAC
  if (req.user.role !== 0) {
    res.status(418).send();
    return;
  }

  let id = req.params.id;
  // console.log("ID:", id);

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  let bomCSV;
  Proposal.find({
    _id: id
  }).then((dup) => {
    if (dup.length > 0) {

      bomCSV = dup[0].bomCSV;
      // console.log('packingCSV:', dup);

      let bomfilePath = path.join(bomFileServer, `${bomCSV}`);
      let bomstat = fs.statSync(bomfilePath);

      res.writeHead(200, {
        // "Content-Disposition": "attachment;filename=" + packingCSV + '_' + bomCSV,
        "Content-Disposition": bomCSV,
        'Content-Type': 'text/csv',
        'Content-Length': bomstat.size
      });

      let bomreadStream = fs.createReadStream(bomfilePath);
      // We replaced all the event handlers with a simple call to readStream.pipe()
      bomreadStream.pipe(res);

    } else {
      res.status(204).send();
    }
  }, (e) => {
    res.status(500).send(e);
  });

});

// 0 // GET Packing List - SuperAdmin - for downloading Packing List
app.get('/ckpPacking/:id', authenticate, async (req, res) => {
  // RBAC
  if (req.user.role !== 0) {
    res.status(418).send();
    return;
  }

  let id = req.params.id;
  // console.log("ID:", id);

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  let packingCSV;
  Proposal.find({
    _id: id
  }).then((dup) => {
    if (dup.length > 0) {

      packingCSV = dup[0].packingCSV;
      // console.log('packingCSV:', dup);

      let packingfilePath = path.join(packingFileServer, `${packingCSV}`);
      let packingstat = fs.statSync(packingfilePath);

      res.writeHead(200, {
        // "Content-Disposition": "attachment;filename=" + packingCSV + '_' + bomCSV,
        "Content-Disposition": packingCSV,
        'Content-Type': 'text/csv',
        'Content-Length': packingstat
      });

      let packingreadStream = fs.createReadStream(packingfilePath);
      // We replaced all the event handlers with a simple call to readStream.pipe()
      packingreadStream.pipe(res);

    } else {
      res.status(204).send();
    }
  }, (e) => {
    res.status(500).send(e);
  });

});

// ************************************************ User Management Routes - SupdeAdmin end ******************************************************* //

// ************************************************ Custom Kit Pricing Usage ******************************************************* //

async function ckpFunc(req) {

  let rawItem = [];
  let bomItem = [];
  let rawItemFromBOM = [];
  let bomItemFromBOM = []; // package inside package

  let BOM = [];
  let dependencyTree = [];
  // let godArray = [];

  function rawBomSeparator4rules(sqlResult) {
    sqlResult.forEach(function (row) {
      // console.log("BOM1:", row);
      if (row.idName.toUpperCase().startsWith("EQUP") || row.idName.toUpperCase().startsWith("CHEM") || row.idName.toUpperCase().startsWith("SHIP")) {
        rawItem.push(row);
      } else {
        bomItem.push(row);
        // assembleyItemName.push(row);
      }
    });
  }

  function rawBomSeparator4BOM(bomResult) {
    Object.keys(bomResult).forEach(function (key) {
      let row = bomResult[key];
      // console.log("BOM2:", row);
      if (row.memItem.toUpperCase().startsWith("EQUP") || row.memItem.toUpperCase().startsWith("CHEM") || row.memItem.toUpperCase().startsWith("SHIP")) {
        rawItemFromBOM.push(row);
      } else {
        bomItemFromBOM.push(row);
        // assembleyItemName.push(row);
      }
    });
  }

  const sqlQueryResultFetcher = (query) => {
    // console.log('sqlQueryResultFetcher-QUERY:', query);
    return new Promise((resolve, reject) => {
      connection.query(query, function (err, result, fields) {
        // if (err) throw err;

        if (result) {
          resolve(result);
          // godArray.push(result);
          // console.log('resolved:', result);
        } else {
          reject(`Unable to contact MYSQL DB ${err}`);
          // console.log('rejected');
        }
      });

    });
  }

  const queryGenerator4labsInitial = async (sub, id) => {

    let queries = queryGenerate4subject(sub, id);

    return await queries;

  }

  async function queryGenerate4subject(subject, labs) {

    let queryAdd, queryDivide, queryMax;
    let queries = [];
    queryAdd = `SELECT idName, lab, qty, unit FROM subjects.${subject} where BINARY operator = '+' and (lab = -1 or `; //${subject}

    labs.forEach(lab => {
      queryAdd += "lab = ";
      queryAdd += lab;
      queryAdd += " or ";
    });

    queryAdd = queryAdd.slice(0, -4);
    queryAdd += await ");";
    queries.push(queryAdd);

    queryDivide = queryAdd.replace('+', '/');
    queryDivide = queryDivide.replace('qty', 'avg(qty)');
    queryDivide = await queryDivide.replace(';', ' group by idName;');
    queries.push(queryDivide);

    queryMax = queryAdd.replace('+', '*');
    queryMax = queryMax.replace('qty', 'max(qty)');
    queryMax = await queryMax.replace(';', ' group by idName;');
    queries.push(queryMax);
    // console.log('queryGenerate4subject:', queries);
    return await queries;
  }

  const labsQueryGenerator4displayLabs = async (rules, sub) => {
    let returnQuery = `SELECT idName, lab, operator FROM subjects.${sub} where (BINARY idName ='`;
    while (rules.length > 0) {
      let temp = rules.pop();
      returnQuery += temp;
      returnQuery += "' or BINARY idName ='";
    }

    returnQuery = returnQuery.slice(0, -20);
    returnQuery += await ");";
    // console.log("Query:", returnQuery);
    return returnQuery;
  }

  const queryGenerator4BOM1 = async (bom) => {
    let returnQuery = "SELECT idName, memItem, memSource, memQuantity FROM netsuite.bom where (BINARY idName ='";
    while (bom.length > 0) {
      let temp = bom.pop();
      returnQuery += temp.idName;
      returnQuery += "' or BINARY idName ='";
      // console.log("POP", temp.idName);
    }

    returnQuery = returnQuery.slice(0, -20);
    returnQuery += await ");";

    return returnQuery;
  }

  const queryGenerator4BOM2 = async (bom) => {
    let returnQuery = "SELECT idName, memItem, memSource, memQuantity FROM netsuite.bom where (BINARY idName ='";
    while (bom.length > 0) {
      let temp = bom.pop();
      returnQuery += temp.memItem;
      returnQuery += "' or BINARY idName ='";
      // console.log("POP", temp.idName);
    }

    returnQuery = returnQuery.slice(0, -20);
    returnQuery += await ");";

    return returnQuery;
  }

  const priceQueryGenerator = async (rawItems) => {
    let returnQuery = "SELECT idName, displayName, averageCost, unitsType, stockUnit, purchaseUnit, purchasePrice, lastPurchasePrice FROM netsuite.allItems where (BINARY idName ='";
    while (rawItems.length > 0) {
      let temp = rawItems.pop();
      returnQuery += temp.idName;
      returnQuery += "' or BINARY idName ='";
    }

    returnQuery = returnQuery.slice(0, -20);
    returnQuery += await ");";
    // console.log("Query1:", returnQuery);
    return returnQuery;
  }

  const assembleyItemNameQueryGenerator = async (assembleyItems) => {
    let returnQuery = "SELECT idName, displayName FROM netsuite.allItems where (BINARY idName ='";
    while (assembleyItems.length > 0) {
      let temp = assembleyItems.pop();
      returnQuery += temp;
      returnQuery += "' or BINARY idName ='";
    }

    returnQuery = returnQuery.slice(0, -20);
    returnQuery += await ");";
    // console.log("Query2:", returnQuery);
    return returnQuery;
  }

  function groupBy(collection, property) {
    var i = 0,
      val, index,
      values = [],
      result = [];
    for (; i < collection.length; i++) {
      val = collection[i][property];
      index = values.indexOf(val);
      if (index > -1)
        result[index].push(collection[i]);
      else {
        values.push(val);
        result.push([collection[i]]);
      }
    }
    return result;
  }

  async function assemblyTOstock(bomItemPOP) {

    while (bomItemPOP.length > 0 || bomItemFromBOM.length > 0) {

      let queriesBOM;
      if (bomItemPOP.length > 0) {
        queriesBOM = await queryGenerator4BOM1(bomItemPOP);
        // console.log(queriesBOM);
      } else if (bomItemFromBOM.length > 0) {
        queriesBOM = await queryGenerator4BOM2(bomItemFromBOM);
        // console.log("\nbomItemFromBOM:", queriesBOM);
      } else {
        console.log("Something's Broken, please check!");
      }

      // sqlQueryResultFetcher();
      let queryBOMresult = await sqlQueryResultFetcher(queriesBOM);
      // console.log("queryBOMresult:", queryBOMresult);
      queryBOMresult.forEach((item) => {
        dependencyTree.push(item);
      })

      // rawBomSeparator();
      rawBomSeparator4BOM(queryBOMresult);

    }
  }

  function groupNaddRawItems() {

    let totalRawItems = [];
    let raw1 = groupBy(rawItem, "idName");

    console.log("\nUnique-raw-from-rules:", raw1.length);

    raw1.forEach(async function (item) {
      // let temp = JSON.stringify(item);
      let finalObj;

      // console.log(`ITEM:${temp} has ${item.length}`);
      for (let j = 0; j < item.length; j++) {
        let tempItem = item[j];

        if (j === 0) {
          var firstKey = Object.keys(tempItem)[0];
          var secondKey = Object.keys(tempItem)[2];
          finalObj = {
            idName: tempItem[firstKey],
            qty: JSON.stringify(tempItem[secondKey])
          };
        } else {
          var secondKey = Object.keys(tempItem)[2];
          finalObj.qty = JSON.stringify(parseFloat(finalObj.qty) + parseFloat(tempItem[secondKey]));
        }
      }

      totalRawItems.push(finalObj);
    });

    let raw2 = groupBy(rawItemFromBOM, "memItem");

    console.log("Unique-raw-from-bom:", raw2.length);

    raw2.forEach(async function (item) {
      // let temp = JSON.stringify(item);
      let finalObj;

      // console.log(`ITEM:${temp} has ${item.length}`);
      for (let j = 0; j < item.length; j++) {
        let tempItem = item[j];

        if (j === 0) {
          // console.log(temp3.memItem);
          finalObj = {
            idName: tempItem.memItem,
            qty: tempItem.memQuantity
          };
        } else {
          finalObj.qty = JSON.stringify(parseFloat(finalObj.qty) + parseFloat(tempItem.memQuantity));
        }
      }
      totalRawItems.push(finalObj);
    });

    console.log("Unique-total-before-grouping:", totalRawItems.length);

    let totalRawItemsUnique = [];

    let raw3 = groupBy(totalRawItems, "idName");

    raw3.forEach(async function (item) {
      // let temp = JSON.stringify(item);
      let finalObj;

      // console.log(`ITEM:${temp} has ${item.length}`);
      for (let j = 0; j < item.length; j++) {
        let tempItem = item[j];

        if (j === 0) {
          // console.log(temp3.memItem);
          finalObj = {
            idName: tempItem.idName,
            qty: tempItem.qty
          };
        } else {
          finalObj.qty = JSON.stringify(parseFloat(finalObj.qty) + parseFloat(tempItem.qty));
        }
      }
      totalRawItemsUnique.push(finalObj);
    });

    totalRawItemsUnique.forEach(async function (item) {
      if (item.idName.toUpperCase().startsWith("BAG") || item.idName.toUpperCase().startsWith("MODL") || item.idName.toUpperCase().startsWith("BTTL")) {
        console.log("ERROR@groupNaddItems:", item);
      }
    });

    console.log("Unique-total-after-grouping:", totalRawItemsUnique.length);
    // console.log(totalRawItemsUnique);

    return totalRawItemsUnique;
  }

  async function priceCalculator(BOM, dependencyTree, sub) {

    // console.log("Checker1:", BOM);
    // console.log("Checker2:", dependencyTree);

    // // working code
    // var kitCost = await _.map(totalRAW, function (item) {
    //   return _.extend(item, _.find(priceQueryResults, { idName: item.idName }));
    // });

    // let sum = 0;

    // kitCost.forEach(function (item) {
    //   // console.log(`${item.idName} = ${item.qty} - ${item.averageCost} = ${item.qty * item.averageCost}`)
    //   sum = sum + (parseFloat(item.qty) * parseFloat(item.averageCost));

    // });
    // // working code

    let sum = 0;
    let sumLastPurchase = 0;

    // price calculation based on average cost of individual items
    for (let m = 0; m < BOM.length; m++) {
      let parent = BOM[m];

      if (parent.idName.toUpperCase().startsWith("EQUP") || parent.idName.toUpperCase().startsWith("CHEM") || parent.idName.toUpperCase().startsWith("SHIP")) {

        let moreDeatils = dependencyTree.filter(function (item2Add) {
          return item2Add.idName == parent.idName;
        });
        // console.log(parent, moreDeatils);
        sum = sum + parent.qty * moreDeatils[0].averageCost;
      } else if (parent.idName.toUpperCase().startsWith("BAG") || parent.idName.toUpperCase().startsWith("BTTL") || parent.idName.toUpperCase().startsWith("MODL")) {

        if (parent.qty > 1) {
          // console.log(`\nparent.idName:${parent.idName}-${parent.qty}\n`);
        }

        let details1 = dependencyTree.filter(function (item2Add) {
          return item2Add.idName == parent.idName;
        });

        if (details1.length > 0) {

          for (let a = 0; a < details1.length; a++) {

            let details2 = details1[a];

            if (details2.memItem.toUpperCase().startsWith("BAG") || details2.memItem.toUpperCase().startsWith("BTTL") || details2.memItem.toUpperCase().startsWith("MODL")) {

              if (details2.memQuantity > 1) {
                // console.log(`\ndetails2.memItem:${details2.memItem}-${details2.memQuantity}\n`);
              }

              let details3 = dependencyTree.filter(function (item2Add) {
                return item2Add.idName == details2.memItem;
              });

              if (details3.length > 0) {

                for (let b = 0; b < details3.length; b++) {

                  let details4 = details3[b];

                  if (details4.memItem.toUpperCase().startsWith("BAG") || details4.memItem.toUpperCase().startsWith("BTTL") || details4.memItem.toUpperCase().startsWith("MODL")) {

                    if (details4.memQuantity > 1) {
                      // console.log(`\ndetails4.memItem:${details4.memItem}-${details4.memQuantity}\n`);
                    }

                    let details5 = dependencyTree.filter(function (item2Add) {
                      return item2Add.idName == details4.memItem;
                    });

                    if (details5.length > 0) {

                      for (let a = 0; a < details5.length; a++) {

                        let details6 = details5[a];

                        if (details6.memItem.toUpperCase().startsWith("BAG") || details6.memItem.toUpperCase().startsWith("BTTL") || details6.memItem.toUpperCase().startsWith("MODL")) {
                          // this is just added to check if one more level down bag has been detected. Actuall this level down is working
                          console.log("One More Level of Hirearchy found:", details6);
                          let details7 = dependencyTree.filter(function (item2Add) {
                            return item2Add.idName == details2.memItem;
                          });

                        } else if (details6.memItem.toUpperCase().startsWith("EQUP") || details6.memItem.toUpperCase().startsWith("CHEM") || details6.memItem.toUpperCase().startsWith("SHIP")) {
                          sum = sum + parent.qty * details2.memQuantity * details4.memQuantity * details6.memQuantity * details6.averageCost;
                        } else {
                          console.log("Error@priceCalculator1:", details6);
                        }
                      }
                    }

                  } else if (details4.memItem.toUpperCase().startsWith("EQUP") || details4.memItem.toUpperCase().startsWith("CHEM") || details4.memItem.toUpperCase().startsWith("SHIP")) {
                    sum = sum + parent.qty * details2.memQuantity * details4.memQuantity * details4.averageCost;
                  } else {
                    console.log("Error@priceCalculator2:", details4);
                  }
                }
              }

            } else if (details2.memItem.toUpperCase().startsWith("EQUP") || details2.memItem.toUpperCase().startsWith("CHEM") || details2.memItem.toUpperCase().startsWith("SHIP")) {
              sum = sum + parent.qty * details2.memQuantity * details2.averageCost;
            } else {
              console.log("Error@priceCalculator3:", details2);
            }
          }
        }

      } else {
        console.log("Error@priceCalculator4:", parent);
      }

    }

    // price calculation based on last purchase price of individual items
    for (let m = 0; m < BOM.length; m++) {
      let parent = BOM[m];

      if (parent.idName.toUpperCase().startsWith("EQUP") || parent.idName.toUpperCase().startsWith("CHEM") || parent.idName.toUpperCase().startsWith("SHIP")) {

        let moreDeatils = dependencyTree.filter(function (item2Add) {
          return item2Add.idName == parent.idName;
        });
        // console.log('lastPurchasePrice:', moreDeatils);
        sumLastPurchase = sumLastPurchase + parent.qty * moreDeatils[0].lastPurchasePrice;
      } else if (parent.idName.toUpperCase().startsWith("BAG") || parent.idName.toUpperCase().startsWith("BTTL") || parent.idName.toUpperCase().startsWith("MODL")) {

        if (parent.qty > 1) {
          // console.log(`\nparent.idName:${parent.idName}-${parent.qty}\n`);
        }

        let details1 = dependencyTree.filter(function (item2Add) {
          return item2Add.idName == parent.idName;
        });

        if (details1.length > 0) {

          for (let a = 0; a < details1.length; a++) {

            let details2 = details1[a];

            if (details2.memItem.toUpperCase().startsWith("BAG") || details2.memItem.toUpperCase().startsWith("BTTL") || details2.memItem.toUpperCase().startsWith("MODL")) {

              if (details2.memQuantity > 1) {
                // console.log(`\ndetails2.memItem:${details2.memItem}-${details2.memQuantity}\n`);
              }

              let details3 = dependencyTree.filter(function (item2Add) {
                return item2Add.idName == details2.memItem;
              });

              if (details3.length > 0) {

                for (let b = 0; b < details3.length; b++) {

                  let details4 = details3[b];

                  if (details4.memItem.toUpperCase().startsWith("BAG") || details4.memItem.toUpperCase().startsWith("BTTL") || details4.memItem.toUpperCase().startsWith("MODL")) {

                    if (details4.memQuantity > 1) {
                      // console.log(`\ndetails4.memItem:${details4.memItem}-${details4.memQuantity}\n`);
                    }

                    let details5 = dependencyTree.filter(function (item2Add) {
                      return item2Add.idName == details4.memItem;
                    });

                    if (details5.length > 0) {

                      for (let a = 0; a < details5.length; a++) {

                        let details6 = details5[a];

                        if (details6.memItem.toUpperCase().startsWith("BAG") || details6.memItem.toUpperCase().startsWith("BTTL") || details6.memItem.toUpperCase().startsWith("MODL")) {
                          // this is just added to check if one more level down bag has been detected. Actuall this level down is working
                          console.log("One More Level of Hirearchy found:", details6);
                          let details7 = dependencyTree.filter(function (item2Add) {
                            return item2Add.idName == details2.memItem;
                          });

                        } else if (details6.memItem.toUpperCase().startsWith("EQUP") || details6.memItem.toUpperCase().startsWith("CHEM") || details6.memItem.toUpperCase().startsWith("SHIP")) {
                          sumLastPurchase = sumLastPurchase + parent.qty * details2.memQuantity * details4.memQuantity * details6.memQuantity * details6.lastPurchasePrice;
                        } else {
                          console.log("Error@priceCalculator5:", details6);
                        }
                      }
                    }

                  } else if (details4.memItem.toUpperCase().startsWith("EQUP") || details4.memItem.toUpperCase().startsWith("CHEM") || details4.memItem.toUpperCase().startsWith("SHIP")) {
                    sumLastPurchase = sumLastPurchase + parent.qty * details2.memQuantity * details4.memQuantity * details4.lastPurchasePrice;
                  } else {
                    console.log("Error@priceCalculator6:", details4);
                  }
                }
              }

            } else if (details2.memItem.toUpperCase().startsWith("EQUP") || details2.memItem.toUpperCase().startsWith("CHEM") || details2.memItem.toUpperCase().startsWith("SHIP")) {
              sumLastPurchase = sumLastPurchase + parent.qty * details2.memQuantity * details2.lastPurchasePrice;
            } else {
              console.log("Error@priceCalculator7:", details2);
            }
          }
        }

      } else {
        console.log("Error@priceCalculato8:", parent);
      }

    }

    let packingAndOtherCost = await baseKitCost(sub);

    let costArray = [];
    costArray.push(sum + packingAndOtherCost * 1.25);
    costArray.push(sumLastPurchase + packingAndOtherCost * 1.25);
    // console.log('costarray:', sumLastPurchase);
    return costArray;
  }

  async function baseKitCost(requestSub) {

    let baseKit = [];

    baseKit.push({ sub: 'gp', cost: 5 });
    baseKit.push({ sub: 'ip', cost: 4 });
    baseKit.push({ sub: 'gb', cost: 5 });
    baseKit.push({ sub: 'ib', cost: 5 });
    baseKit.push({ sub: 'hb', cost: 4 });
    baseKit.push({ sub: 'ap', cost: 7 });
    baseKit.push({ sub: 'gc', cost: 7 });
    baseKit.push({ sub: 'ic', cost: 7 });
    baseKit.push({ sub: 'as', cost: 4 });
    baseKit.push({ sub: 'es', cost: 8 });
    baseKit.push({ sub: 'hg', cost: 3 });
    baseKit.push({ sub: 'sg', cost: 3 });
    baseKit.push({ sub: 'bg', cost: 2 });
    baseKit.push({ sub: 'rm', cost: 2 });
    baseKit.push({ sub: 'mb', cost: 8 });
    baseKit.push({ sub: 'fs', cost: 4 });
    baseKit.push({ sub: 'pt', cost: 3 });

    let result = await baseKit.filter(function (e) {
      return e.sub == requestSub;
    });

    return result[0].cost;

  }

  function gpAdditions(id, itemsToAdd) {

    // Aluminum Tube Condition - this is wrong. Cait(email)
    // if (id.includes("gp-7") && !(id.includes("gp-18")) || id.includes("gp-7") && !(id.includes("gp-20"))) {
    //   itemsToAdd.push({
    //     idName: 'Equp2132',
    //     lab: '7',
    //     qty: 1,
    //     unit: 'each'
    //   });
    // }

    // Carbon Resistor Condition
    if (id.includes("gp-22") && !(id.includes("gp-21")) || id.includes("gp-22") && !(id.includes("gp-23"))) {
      itemsToAdd.push({
        idName: 'Equp2433',
        lab: '22',
        qty: 1,
        unit: 'each'
      });
    }

    return itemsToAdd;
  }

  function gcAdditions(id, itemsToAdd) {

    // TEST TUBES CONDITION // - 101
    if (id.includes("gc-25")) {
      itemsToAdd.push({
        idName: 'Bag1019',
        lab: '5,12,23,25',
        qty: 1,
        unit: 'each'
      });
    } else if (id.includes("gc-5") || id.includes("gc-12") || id.includes("gc-23")) {
      itemsToAdd.push({
        idName: 'Bag1018',
        lab: '5,12,23',
        qty: 1,
        unit: 'each'
      });
    }

    // Pipette Condition
    let pipetteCount = 0;

    if (id.includes("gc-2")) {
      pipetteCount += 2;
    }
    if (id.includes("gc-4")) {
      pipetteCount += 10;
    }
    if (id.includes("gc-8")) {
      pipetteCount += 2;
    }
    if (id.includes("gc-10")) {
      pipetteCount += 1;
    }
    if (id.includes("gc-11")) {
      pipetteCount += 1;
    }
    if (id.includes("gc-14")) {
      pipetteCount += 1;
    }
    if (id.includes("gc-16")) {
      pipetteCount += 7;
    }
    if (id.includes("gc-17")) {
      pipetteCount += 9;
    }
    if (id.includes("gc-18")) {
      pipetteCount += 4;
    }
    if (id.includes("gc-19")) {
      pipetteCount += 2;
    }

    pipetteCount = Math.ceil(pipetteCount / 10) * 10;

    let pipette2 = Math.floor(pipetteCount / 20);
    let pipette1 = pipetteCount % 20;

    if (pipette1 > 0) {
      itemsToAdd.push({
        idName: 'Bag1030',
        lab: 100,
        qty: pipette1 / 10,
        unit: 'each'
      });
    }
    if (pipette2 > 0) {
      itemsToAdd.push({
        idName: 'Bag1028',
        lab: 100,
        qty: pipette2,
        unit: 'each'
      });
    }

    // THERMOMETER CONDITION // - 102

    if (id.includes("gc-13")) {
      itemsToAdd.push({
        idName: 'Equp4029',
        lab: 100,
        qty: 1,
        unit: 'each'
      });
    } else if (id.includes("gc-8") || id.includes("gc-9") || id.includes("gc-12") || id.includes("gs-14")) {
      itemsToAdd.push({
        idName: 'Equp8029',
        lab: 100,
        qty: 1,
        unit: 'each'
      });
    } else if (id.includes("gc-21")) {
      itemsToAdd.push({
        idName: 'Equp8251',
        lab: 100,
        qty: 1,
        unit: 'each'
      });
    }

    // Ship9121 Glass Beaker Cover - Chamber Pack CONDITION // - 4,19,8,9,12,14,19,21,22

    if (id.includes("gc-4") || id.includes("gc-19")) {
      itemsToAdd.push({
        idName: 'Ship9121',
        lab: '4,19',
        qty: 1,
        unit: 'each'
      });
    }
    if (id.includes("gc-8") || id.includes("gc-9") || id.includes("gc-12") || id.includes("gc-14") || id.includes("gc-19") || id.includes("gc-21") || id.includes("gc-22")) {
      itemsToAdd.push({
        idName: 'Ship9121',
        lab: '8,9,12,14,19,21,22',
        qty: 1,
        unit: 'each'
      });
    }

    // CHEMICALS ///////////////////////////////////////////////////////////////////

    // 3% Hydrogen Peroxide Solution Condition
    if (id.includes("gc-8") && id.includes("gc-16")) {
      itemsToAdd.push({
        idName: 'Bttl1046',
        lab: '8,16',
        qty: 1,
        unit: 'each'
      });
    } else if (id.includes("gc-8") || id.includes("gc-16")) {
      itemsToAdd.push({
        idName: 'Bttl1752',
        lab: '8,16',
        qty: 1,
        unit: 'each'
      });
    }

    // // Lab 21, 18, (2, 5, 17) // 4.5 % Actic Acid (vinegar) //
    if (id.includes("gc-21") && (id.includes("gc-2") && id.includes("gc-5") || id.includes("gc-17") || id.includes("gc-18"))) {
      itemsToAdd.push({
        idName: 'Bttl1216',
        lab: '21,18,2,5,17',
        qty: 1,
        unit: 'each'
      });
    } else if (id.includes("gc-21")) {
      itemsToAdd.push({
        idName: 'Bttl4012',
        lab: '21',
        qty: 1,
        unit: 'each'
      });
    } else if (id.includes("gc-18")) {
      itemsToAdd.push({
        idName: 'Bttl3022',
        lab: '18',
        qty: 1,
        unit: 'each'
      });
    } else if (id.includes("gc-2") || id.includes("gc-5") || id.includes("gc-17")) {
      itemsToAdd.push({
        idName: 'Bttl7105',
        lab: '2,5,17',
        qty: 1,
        unit: 'each'
      });
    }

    // Iodine-Potassium Iodide Solution condition - 106
    if (id.includes("gc-16")) {
      itemsToAdd.push({
        idName: 'Bttl1464',
        lab: '16,25',
        qty: 1,
        unit: 'each'
      });
    } else if (id.includes("gc-25")) {
      itemsToAdd.push({
        idName: 'Bttl1173',
        lab: '25',
        qty: 1,
        unit: 'each'
      });
    }

    // Turmeric indicator (Add 1/4 teaspoon (1.23ml) of turmeric to four tablespoons (60 ml) of rubbing alcohol condition - 107
    if (id.includes("gc-17") && id.includes("gc-20")) {
      itemsToAdd.push({
        idName: 'Bttl4098',
        lab: 100,
        qty: 1,
        unit: 'each'
      });
    } else if (id.includes("gc-17") ? !(id.includes("gc-20")) : id.includes("gc-20")) {
      itemsToAdd.push({
        idName: 'Bttl4198',
        lab: 100,
        qty: 1,
        unit: 'each'
      });
    }

    return itemsToAdd;
  }

  function ibAdditions(id, itemsToAdd) {

    // Glass Test Tubes
    if (id.includes('ib-5') || id.includes('ib-9')) {
      itemsToAdd.push({
        idName: 'Bag1019',
        lab: 200,
        qty: 1,
        unit: 'each'
      });
    } else if (id.includes('ib-7')) {
      itemsToAdd.push({
        idName: 'Bag1018',
        lab: 200,
        qty: 1,
        unit: 'each'
      });
    } else if (id.includes('ib-8') || id.includes('ib-20')) {
      itemsToAdd.push({
        idName: 'Bag1017',
        lab: 200,
        qty: 1,
        unit: 'each'
      });
    }

    // Pipette Condition
    let pipetteCount = 0;

    if (id.includes("ib-2")) {
      pipetteCount += 2;
    }
    if (id.includes("ib-5")) {
      pipetteCount += 10;
    }
    if (id.includes("ib-6")) {
      pipetteCount += 2;
    }
    if (id.includes("ib-7")) {
      pipetteCount += 1;
    }
    if (id.includes("ib-9")) {
      pipetteCount += 1;
    }
    if (id.includes("ib-20")) {
      pipetteCount += 1;
    }

    pipetteCount = Math.ceil(pipetteCount / 10) * 10;

    let pipette2 = Math.floor(pipetteCount / 20);
    let pipette1 = pipetteCount % 20;

    if (pipette1 > 0) {
      itemsToAdd.push({
        idName: 'Bag1030',
        lab: 200,
        qty: pipette1 / 10,
        unit: 'each'
      });
    }
    if (pipette2 > 0) {
      itemsToAdd.push({
        idName: 'Bag1028',
        lab: 200,
        qty: pipette2,
        unit: 'each'
      });
    }

    // CHEMICALS ///////////////////////////////////////////////////////////////////

    // 1% Glucose Solution, C6H12O6
    if (id.includes('ib-9')) {
      itemsToAdd.push({
        idName: 'Bttl1078',
        lab: '9',
        qty: 1,
        unit: 'each'
      });
    } else if (id.includes('ib-5') || id.includes('ib-6')) {
      itemsToAdd.push({
        idName: 'Bttl1600',
        lab: '5,6',
        qty: 1,
        unit: 'each'
      });
    }

    // 4.5% Acetic Acid (vinegar), C2H4O2 Solution
    if (id.includes('ib-7') && id.includes('ib-24')) {
      itemsToAdd.push({
        idName: 'Bttl1216',
        lab: '7,24',
        qty: 2,
        unit: 'each'
      });
    } else if (id.includes('ib-7') || id.includes('ib-24')) {
      itemsToAdd.push({
        idName: 'Bttl1216',
        lab: '7,24',
        qty: 1,
        unit: 'each'
      });
    } else if (id.includes('ib-2') || id.includes('ib-20') || id.includes('ib-27')) {
      itemsToAdd.push({
        idName: 'Bttl7105',
        lab: '2,20,27',
        qty: 1,
        unit: 'each'
      });
    }

    // Iodine-Potassium Iodide, IKI Solution
    if (id.includes('ib-8')) {
      itemsToAdd.push({
        idName: 'Bttl1464',
        lab: '8',
        qty: 1,
        unit: 'each'
      });
    } else if (id.includes('ib-6')) {
      itemsToAdd.push({
        idName: 'Bttl1173',
        lab: '6',
        qty: 1,
        unit: 'each'
      });
    }

    // Liquid Starch Solution
    if (id.includes('ib-8')) {
      itemsToAdd.push({
        idName: 'Bttl1054',
        lab: '8',
        qty: 1,
        unit: 'each'
      });
    } else if (id.includes('ib-6')) {
      itemsToAdd.push({
        idName: 'Bttl5071',
        lab: '6',
        qty: 1,
        unit: 'each'
      });
    }


    return itemsToAdd;
  }

  function apAdditions(id, itemsToAdd) {

    // TEST TUBES CONDITION // - 101
    if (id.includes("ap-16") || id.includes("ap-17")) {
      itemsToAdd.push({
        idName: 'Bag1019',
        lab: '16,17',
        qty: 1,
        unit: 'each'
      });
    } else if (id.includes("ap-4") || id.includes("ap-14")) {
      itemsToAdd.push({
        idName: 'Bag1018',
        lab: '4,14',
        qty: 1,
        unit: 'each'
      });
    }

    // Pipette Condition
    let pipetteCount = 0;

    if (id.includes("ap-2")) {
      pipetteCount += 1;
    }
    if (id.includes("ap-4")) {
      pipetteCount += 5;
    }
    if (id.includes("ap-14")) {
      pipetteCount += 17;
    }
    if (id.includes("ap-15")) {
      pipetteCount += 1;
    }
    if (id.includes("ap-16")) {
      pipetteCount += 2;
    }
    if (id.includes("ap-17")) {
      pipetteCount += 11;
    }

    pipetteCount = Math.ceil(pipetteCount / 10) * 10;

    let pipette2 = Math.floor(pipetteCount / 20);
    let pipette1 = pipetteCount % 20;

    if (pipette1 > 0) {
      itemsToAdd.push({
        idName: 'Bag1030',
        lab: 100,
        qty: pipette1 / 10,
        unit: 'each'
      });
    }
    if (pipette2 > 0) {
      itemsToAdd.push({
        idName: 'Bag1028',
        lab: 100,
        qty: pipette2,
        unit: 'each'
      });
    }

    // CHEMICALS ///////////////////////////////////////////////////////////////////

    // 1% Glucose Solution Condition
    if (id.includes("ap-4") && id.includes("ap-17")) {
      itemsToAdd.push({
        idName: 'Bttl1078',
        lab: '4,17',
        qty: 1,
        unit: 'each'
      });
    } else if (id.includes("ap-4") || id.includes("ap-17")) {
      itemsToAdd.push({
        idName: 'Bttl1600',
        lab: '4,17',
        qty: 1,
        unit: 'each'
      });
    }


    return itemsToAdd;
  }

  function mbAdditions(id, itemsToAdd) {



    return itemsToAdd;
  }

  function icAdditions(id, itemsToAdd) {

    // TEST TUBES CONDITION // - 101
    if (id.includes("ic-5")) {
      itemsToAdd.push({
        idName: 'Bag1019',
        lab: '5',
        qty: 1,
        unit: 'each'
      });
    } else if (id.includes("ic-13")) {
      itemsToAdd.push({
        idName: 'Bag1018',
        lab: '13',
        qty: 1,
        unit: 'each'
      });
    } else if (id.includes("ic-12") || id.includes("ic-15") || id.includes("ic-22")) {
      itemsToAdd.push({
        idName: 'Bag1017',
        lab: '12,15,22',
        qty: 1,
        unit: 'each'
      });
    } else if (id.includes("ic-14")) {
      itemsToAdd.push({
        idName: 'Equp1019',
        lab: '14',
        qty: 1,
        unit: 'each'
      });
    }

    // Pipette Condition
    let pipetteCount = 0;

    if (id.includes("ic-1")) {
      pipetteCount += 2;
    }
    if (id.includes("ic-2")) {
      pipetteCount += 1;
    }
    if (id.includes("ic-5")) {
      pipetteCount += 1;
    }
    if (id.includes("ic-6")) {
      pipetteCount += 2;
    }
    if (id.includes("ic-14")) {
      pipetteCount += 1;
    }
    if (id.includes("ic-15")) {
      pipetteCount += 2;
    }
    if (id.includes("ic-19")) {
      pipetteCount += 1;
    }
    if (id.includes("ic-20")) {
      pipetteCount += 2;
    }
    if (id.includes("ic-23")) {
      pipetteCount += 6;
    }
    if (id.includes("ic-24")) {
      pipetteCount += 3;
    }

    pipetteCount = Math.ceil(pipetteCount / 10) * 10;

    let pipette2 = Math.floor(pipetteCount / 20);
    let pipette1 = pipetteCount % 20;

    if (pipette1 > 0) {
      itemsToAdd.push({
        idName: 'Bag1030',
        lab: 100,
        qty: pipette1 / 10,
        unit: 'each'
      });
    }
    if (pipette2 > 0) {
      itemsToAdd.push({
        idName: 'Bag1028',
        lab: 100,
        qty: pipette2,
        unit: 'each'
      });
    }

    // CHEMICALS ///////////////////////////////////////////////////////////////////

    // Iodine-Potassium Iodide Solution condition
    if (id.includes("ic-22")) {
      itemsToAdd.push({
        idName: 'Bttl1464',
        lab: '22',
        qty: 1,
        unit: 'each'
      });
    } else if (id.includes("ic-6")) {
      itemsToAdd.push({
        idName: 'Bttl1173',
        lab: '6',
        qty: 1,
        unit: 'each'
      });
    }

    // Lab 20, 22 // 3% Hydrogen Peroxide Condition //
    if (id.includes("ic-20") && id.includes("ic-22")) {
      itemsToAdd.push({
        idName: 'Bttl1046',
        lab: '20,22',
        qty: 1,
        unit: 'each'
      });
    } else if (id.includes("ic-20") || id.includes("ic-22")) {
      itemsToAdd.push({
        idName: 'Bttl1752',
        lab: '20,22',
        qty: 1,
        unit: 'each'
      });
    }

    // Lab 16,23 // 4.5 % Actic Acid (vinegar) //
    if (id.includes("ic-1") && id.includes("ic-6")) {
      itemsToAdd.push({
        idName: 'Bttl3022',
        lab: '1,6',
        qty: 1,
        unit: 'each'
      });
    } else if (id.includes("ic-1") || id.includes("ic-6")) {
      itemsToAdd.push({
        idName: 'Bttl4012',
        lab: '1,6',
        qty: 1,
        unit: 'each'
      });
    }

    // Lab 16,23 // 4.5 % Actic Acid (vinegar) //
    else if (id.includes("ic-16") && id.includes("ic-23")) {
      itemsToAdd.push({
        idName: 'Bttl1216',
        lab: '16,23',
        qty: 1,
        unit: 'each'
      });
    } else if (id.includes("ic-16")) {
      itemsToAdd.push({
        idName: 'Bttl4012',
        lab: '16',
        qty: 1,
        unit: 'each'
      });
    } else if (id.includes("ic-23")) {
      itemsToAdd.push({
        idName: 'Bttl3022',
        lab: '23',
        qty: 1,
        unit: 'each'
      });
    }

    return itemsToAdd;
  }

  function asAdditions(id, itemsToAdd) {



    return itemsToAdd;
  }

  function gbAdditions(id, itemsToAdd) {

    // TEST TUBES CONDITION //
    // This is a one time usable test tube
    if (id.includes("gb-6")) {
      itemsToAdd.push({
        idName: 'Bag1017',
        lab: '6',
        qty: 1,
        unit: 'each'
      });
    }

    // This is a normal condition
    if (id.includes("gb-8") || id.includes("gb-23")) {
      itemsToAdd.push({
        idName: 'Bag1019',
        lab: '8,23',
        qty: 1,
        unit: 'each'
      });
    } else if (id.includes("gb-5") || id.includes("gb-6") || id.includes("gb-18")) {
      itemsToAdd.push({
        idName: 'Bag1018',
        lab: '5,6,18',
        qty: 1,
        unit: 'each'
      });
    } else if (id.includes("gb-7") || id.includes("gb-15")) {
      itemsToAdd.push({
        idName: 'Bag1017',
        lab: '7,15',
        qty: 1,
        unit: 'each'
      });
    } else if (id.includes("gb-16")) {
      itemsToAdd.push({
        idName: 'Equp1015',
        lab: '16',
        qty: 1,
        unit: 'each'
      });
    }

    // Pipette Condition
    let pipetteCount = 0;

    if (id.includes("gb-2")) {
      pipetteCount += 2;
    }
    if (id.includes("gb-5")) {
      pipetteCount += 7;
    }
    if (id.includes("gb-6")) {
      pipetteCount += 10;
    }
    if (id.includes("gb-7")) {
      pipetteCount += 2;
    }
    if (id.includes("gb-8")) {
      pipetteCount += 5;
    }
    if (id.includes("gb-13")) {
      pipetteCount += 1;
    }
    if (id.includes("gb-14")) {
      pipetteCount += 1;
    }
    if (id.includes("gb-15")) {
      pipetteCount += 10;
    }
    if (id.includes("gb-18")) {
      pipetteCount += 8;
    }

    pipetteCount = Math.ceil(pipetteCount / 10) * 10;

    let pipette2 = Math.floor(pipetteCount / 20);
    let pipette1 = pipetteCount % 20;

    if (pipette1 > 0) {
      itemsToAdd.push({
        idName: 'Bag1030',
        lab: 100,
        qty: pipette1 / 10,
        unit: 'each'
      });
    }
    if (pipette2 > 0) {
      itemsToAdd.push({
        idName: 'Bag1028',
        lab: 100,
        qty: pipette2,
        unit: 'each'
      });
    }

    // Hand Lens Condition
    if (id.includes("gb--19") && !(id.includes("gb-17"))) {
      itemsToAdd.push({
        idName: 'Equp8094',
        lab: '19',
        qty: 1,
        unit: 'each'
      });
    }

    // CHEMICALS ///////////////////////////////////////////////////////////////////

    return itemsToAdd;
  }

  function esAdditions(id, itemsToAdd) {

    // Pipette Condition
    let pipetteCount = 0;

    if (id.includes("es-4")) {
      pipetteCount += 4;
    }
    if (id.includes("gc-7")) {
      pipetteCount += 1;
    }
    if (id.includes("gc-8")) {
      pipetteCount += 4;
    }
    if (id.includes("gc-9")) {
      pipetteCount += 2;
    }
    if (id.includes("gc-10")) {
      pipetteCount += 1;
    }
    if (id.includes("gc-12")) {
      pipetteCount += 1;
    }

    pipetteCount = Math.ceil(pipetteCount / 10) * 10;

    let pipette2 = Math.floor(pipetteCount / 20);
    let pipette1 = pipetteCount % 20;

    if (pipette1 > 0) {
      itemsToAdd.push({
        idName: 'Bag1030',
        lab: 100,
        qty: pipette1 / 10,
        unit: 'each'
      });
    }
    if (pipette2 > 0) {
      itemsToAdd.push({
        idName: 'Bag1028',
        lab: 100,
        qty: pipette2,
        unit: 'each'
      });
    }
    // Potting Soil Condition
    if (id.includes("es-3") || id.includes("es-5")) {
      itemsToAdd.push({
        idName: 'Bag1221',
        lab: '3,5',
        qty: 1,
        unit: 'each'
      });
    } else if (id.includes("gc-6")) {
      itemsToAdd.push({
        idName: 'Bag1228',
        lab: '6',
        qty: 1,
        unit: 'each'
      });
    }

    // Seed Mixture Packet (zinnia, marigold, morning glory, cosmos and ryegrass_
    if (id.includes("es-6") && !(id.includes("es-5"))) {
      itemsToAdd.push({
        idName: 'Bag3045',
        lab: '6',
        qty: 1,
        unit: 'each'
      });
    }

    // CHEMICALS ///////////////////////////////////////////////////////////////////

    // Acetic Acid Condition
    if (id.includes('es-7') && id.includes('es-10') && id.includes('es-13')) {
      itemsToAdd.push({
        idName: 'Bttl4012',
        lab: '7,10,13',
        qty: 1,
        unit: 'each'
      });
    } else if (id.includes('es-7') || id.includes('es-10')) {
      itemsToAdd.push({
        idName: 'Bttl3022',
        lab: '7,10',
        qty: 1,
        unit: 'each'
      });
    }



    return itemsToAdd;
  }

  function fsAdditions(id, itemsToAdd) {



    return itemsToAdd;
  }

  function ipAdditions(id, itemsToAdd) {

    // AA Battery holder Condition
    if ((id.includes("ip-20") || id.includes("ip-22")) && !(id.includes("ip-21"))) {
      itemsToAdd.push({
        idName: 'Equp2054',
        lab: '20,22',
        qty: 1,
        unit: 'each'
      });
    }

    // AA battery Condition
    if (id.includes("ip-22")) {
      itemsToAdd.push({
        idName: 'Bag8071',
        lab: '22',
        qty: 1,
        unit: 'each'
      });
    } else if (id.includes("ip-20")) {
      itemsToAdd.push({
        idName: 'Bag8070',
        lab: '20',
        qty: 1,
        unit: 'each'
      });
    }

    // Alligator Clips Condition
    if (id.includes("ip-22")) {
      itemsToAdd.push({
        idName: 'Bag2141',
        lab: '22',
        qty: 1,
        unit: 'each'
      });
    } else if (id.includes("ip-20")) {
      itemsToAdd.push({
        idName: 'Bag2429',
        lab: '20',
        qty: 1,
        unit: 'each'
      });
    }

    // Aluminum Tube Condition
    if (id.includes("ip-8") && !(id.includes("ip-19"))) {
      itemsToAdd.push({
        idName: 'Equp2132',
        lab: '8',
        qty: 1,
        unit: 'each'
      });
    }

    // Carbon Resistor Condition
    if (id.includes("ip-22") && !(id.includes("ip-21"))) {
      itemsToAdd.push({
        idName: 'Equp2433',
        lab: '22',
        qty: 1,
        unit: 'each'
      });
    }


    return itemsToAdd;
  }

  function hbAdditions(id, itemsToAdd) {

    // Pipette Condition
    let pipetteCount = 0;

    if (id.includes("hb-16")) {
      pipetteCount += 2;
    }
    if (id.includes("hb-2")) {
      pipetteCount += 5;
    }
    if (id.includes("hb-4")) {
      pipetteCount += 1;
    }
    if (id.includes("hb-9")) {
      pipetteCount += 1;
    }
    if (id.includes("hb-14")) {
      pipetteCount += 3;
    }

    pipetteCount = Math.ceil(pipetteCount / 10) * 10;

    let pipette2 = Math.floor(pipetteCount / 20);
    let pipette1 = pipetteCount % 20;

    if (pipette1 > 0) {
      itemsToAdd.push({
        idName: 'Bag1030',
        lab: 100,
        qty: pipette1 / 10,
        unit: 'each'
      });
    }
    if (pipette2 > 0) {
      itemsToAdd.push({
        idName: 'Bag1028',
        lab: 100,
        qty: pipette2,
        unit: 'each'
      });
    }

    // Glass Test Tube Condition
    if (id.includes("hb-2")) {
      itemsToAdd.push({
        idName: 'Bag1019',
        lab: '2',
        qty: 1,
        unit: 'each'
      });
    } else if (id.includes("hb-14")) {
      itemsToAdd.push({
        idName: 'Bag1017',
        lab: '14',
        qty: 1,
        unit: 'each'
      });
    }

    return itemsToAdd;
  }

  function hgAdditions(id, itemsToAdd) {



    return itemsToAdd;
  }

  function sgAdditions(id, itemsToAdd) {

    // Lab 9 - Quartz Sandstone and Granite
    if (id.includes("sg-9") && !(id.includes("sg-4")) && !(id.includes("sg-5")) && !(id.includes("sg-6"))) {
      itemsToAdd.push({
        idName: 'Equp3711',
        lab: '9',
        qty: 1,
        unit: 'each'
      });
      itemsToAdd.push({
        idName: 'Equp3024',
        lab: '9',
        qty: 1,
        unit: 'each'
      });
    }

    return itemsToAdd;
  }

  function bgAdditions(id, itemsToAdd) {



    return itemsToAdd;
  }

  function rmAdditions(id, itemsToAdd) {



    return itemsToAdd;
  }

  function ptAdditions(id, itemsToAdd) {

    // CHEMICALS ///////////////////////////////////////////////////////////////////

    if (id.includes('pt-1') && id.includes('pt-3') && id.includes('pt-5')) {
      itemsToAdd.push({
        idName: 'Bttl1515',
        lab: '1,3,5',
        qty: 1,
        unit: 'each'
      });
    } else if (id.includes('pt-3') && id.includes('pt-5')) {
      itemsToAdd.push({
        idName: 'Bttl1515',
        lab: '3,5',
        qty: 1,
        unit: 'each'
      });
    } else if (id.includes('pt-1') && id.includes('pt-5')) {
      itemsToAdd.push({
        idName: 'Bttl1515',
        lab: '3,5',
        qty: 1,
        unit: 'each'
      });
    } else if (id.includes('pt-1') && id.includes('pt-3')) {
      itemsToAdd.push({
        idName: 'Bttl1601',
        lab: '1,3',
        qty: 1,
        unit: 'each'
      });
    } else if (id.includes('pt-3') || id.includes('pt-5')) {
      itemsToAdd.push({
        idName: 'Bttl1601',
        lab: '3/5',
        qty: 1,
        unit: 'each'
      });
    } else if (id.includes('pt-1')) {
      itemsToAdd.push({
        idName: 'Bttl1603',
        lab: 1,
        qty: 1,
        unit: 'each'
      });
    }


    return itemsToAdd;
  }

  async function performComplexAdditions(sub, id) {

    // ****************************************************************//
    // IMPLEMENT THE '1. 2.Get complex conditions from the code' HERE //
    // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv //

    // array to hold special items to be added to the calculation
    let itemsToAdd = [];

    // start getting the array of special items depending on the subject
    switch (sub) {
      case 'gp':
        itemsToAdd = gpAdditions(id, itemsToAdd);
        break;
      case 'gc':
        itemsToAdd = gcAdditions(id, itemsToAdd);
        break;
      case 'ib':
        itemsToAdd = ibAdditions(id, itemsToAdd);
        break;
      case 'ap':
        itemsToAdd = apAdditions(id, itemsToAdd);
        break;
      case 'mb':
        itemsToAdd = mbAdditions(id, itemsToAdd);
        break;
      case 'ic':
        itemsToAdd = icAdditions(id, itemsToAdd);
        break;
      case 'as':
        itemsToAdd = asAdditions(id, itemsToAdd);
        break;
      case 'gb':
        itemsToAdd = gbAdditions(id, itemsToAdd);
        break;
      case 'es':
        itemsToAdd = esAdditions(id, itemsToAdd);
        break;
      case 'fs':
        itemsToAdd = fsAdditions(id, itemsToAdd);
        break;
      case 'ip':
        itemsToAdd = ipAdditions(id, itemsToAdd);
        break;
      case 'hb':
        itemsToAdd = hbAdditions(id, itemsToAdd);
        break;
      case 'hg':
        itemsToAdd = hgAdditions(id, itemsToAdd);
        break;
      case 'sg':
        itemsToAdd = sgAdditions(id, itemsToAdd);
        break;
      case 'bg':
        itemsToAdd = bgAdditions(id, itemsToAdd);
        break;
      case 'rm':
        itemsToAdd = rmAdditions(id, itemsToAdd);
        break;
      case 'pt':
        itemsToAdd = ptAdditions(id, itemsToAdd);
        break;
      default:
        console.log('error @ performComplexAdditions');
    }

    // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ //
    // IMPLEMENT THE '1. 2.Get complex conditions from the code' HERE //
    // ****************************************************************//

    itemsToAdd.forEach(function (item) {

      var firstKey = Object.keys(item)[0];
      var secondKey = Object.keys(item)[2];

      BOM.push({
        'idName': item[firstKey],
        'qty': item[secondKey]
      });
    });

    console.log("\nSpecial Items Added:", itemsToAdd);
    await rawBomSeparator4rules(itemsToAdd);

  }

  let adminPageMapping = async function (resAR, priceQueryResults, sub) {

    // console.log("Admin Calculate");
    let labsArray = [];

    // resAR.push(rawItem);
    rawItem.forEach(function (item) {
      labsArray.push(item.idName);

      var firstKey = Object.keys(item)[0];
      var secondKey = Object.keys(item)[2];
      var thirdKey = Object.keys(item)[3];

      dependencyTree.push({
        idName: item[firstKey],
        qty: item[secondKey],
        unit: item[thirdKey]
      });
    });

    // resAR.push(rawItemFromBOM);

    // Combines dependencyTree.memItem with priceQueryResults.idName to combine memItem display name
    dependencyTree.forEach(async function (item) {
      let addItem = priceQueryResults.filter(function (item2Add) {
        return item2Add.idName == item.memItem;
      });

      if (addItem.length > 0) {
        item["memDisplayName"] = addItem[0].displayName;
        item["averageCost"] = addItem[0].averageCost;
        item["purchasePrice"] = addItem[0].purchasePrice;
        item["lastPurchasePrice"] = addItem[0].lastPurchasePrice;
      }
    });
    // Combines dependencyTree.memItem with priceQueryResults.idName to combine memItem display name

    // Combines dependencyTree.idName with priceQueryResults.idName to combine item display name
    dependencyTree.forEach(async function (item) {
      let addItem = priceQueryResults.filter(function (item2Add) {
        return item2Add.idName == item.idName;
      });

      if (addItem.length > 0) {
        item["displayName"] = addItem[0].displayName;
        item["averageCost"] = addItem[0].averageCost;
        item["purchasePrice"] = addItem[0].purchasePrice;
        item["lastPurchasePrice"] = addItem[0].lastPurchasePrice;
      }
    });
    // Combines dependencyTree.idName with priceQueryResults.idName to combine item display name

    // resAR.push(dependencyTree);
    // resAR.push(priceQueryResults);

    // get the names of Assembly Items
    let flags = [],
      assembleyItemName = [],
      l = rawItemFromBOM.length,
      i;
    for (i = 0; i < l; i++) {
      if (flags[rawItemFromBOM[i].idName]) continue;
      flags[rawItemFromBOM[i].idName] = true;
      assembleyItemName.push(rawItemFromBOM[i].idName);
      labsArray.push(rawItemFromBOM[i].idName);
    }

    let assembleyItemNameDetails = [];
    if (assembleyItemName.length > 0) {
      let assemblyNameQuery = await assembleyItemNameQueryGenerator(assembleyItemName);
      // console.log("assemblyNameQuery:", assemblyNameQuery);
      assembleyItemNameDetails = await sqlQueryResultFetcher(assemblyNameQuery);
    }

    // Combines dependencyTree.idName with assembleyItemNameDetails.idName to combine Module display name
    dependencyTree.forEach(async function (item) {
      let addItem = assembleyItemNameDetails.filter(function (item2Add) {
        return item2Add.idName == item.idName;
      });

      if (addItem.length > 0) {
        item["displayName"] = addItem[0].displayName;
      }
    });
    // Combines dependencyTree.idName with assembleyItemNameDetails.idName to combine Module display name


    // resAR.push(assembleyItemNameDetails);
    // get the names of Assembly Items

    // to get all corresponding lab nos. // run from labs, get items for each sub, run subsequent lab info queryand populate
    let labsQuery = await labsQueryGenerator4displayLabs(labsArray, sub);
    // console.log("labsQuery:",labsQuery);
    let labsDetails = await sqlQueryResultFetcher(labsQuery);
    const labsresult = labsDetails.filter(function (item) {
      if (item.operator === '+' || item.operator === '/' || item.operator === '*') {
        return true;
      } else {
        return false;
      }
    });

    // let labsDetailsScoped = [];
    // labsDetails.forEach(function (rules){
    //   if(id.includes(rules.lab)){
    //     labsDetailsScoped.push(rules);
    //   }
    // });

    let labsDetailsGrouped = await groupBy(labsresult, "idName");
    // console.log("labs:", labsDetailsGrouped);

    let labsDetailsScoped = [];
    labsDetailsGrouped.forEach(async function (item) {
      // let temp = JSON.stringify(item);
      let finalObj;

      // console.log(`ITEM:${temp} has ${item.length}`);
      for (let j = 0; j < item.length; j++) {
        let tempItem = item[j];

        if (j === 0) {
          var firstKey = Object.keys(tempItem)[0];
          var secondKey = Object.keys(tempItem)[1];
          finalObj = {
            idName: tempItem[firstKey],
            lab: JSON.stringify(tempItem[secondKey])
          };
        } else {
          var secondKey = Object.keys(tempItem)[1];
          finalObj.lab = finalObj.lab + "," + tempItem[secondKey];
        }
        // console.log("Final:", finalObj);
      }

      labsDetailsScoped.push(finalObj);
    });

    // Combines dependencyTree.idName with labsDetailsScoped.idName to combine lab
    dependencyTree.forEach(async function (item) {
      let addItem = labsDetailsScoped.filter(function (item2Add) {
        return item2Add.idName == item.idName;
      });

      if (addItem.length > 0) {
        item["lab"] = addItem[0].lab;
      }
    });
    // Combines dependencyTree.idName with labsDetailsScoped.idName to combine lab

    // resAR.push(labsDetailsScoped);
    // to get all corresponding lab nos.

    // Attempt to PUSH 4, 5 as complete
    // let BOMmerged = [].concat.apply([], BOM);
    resAR.push(BOM);
    resAR.push(dependencyTree);

    // Attempt to PUSH 4, 5 as complete 
    return resAR;
  }

  async function looper4eachSubject(sub, id) {

    rawItem = [];
    bomItem = [];
    rawItemFromBOM = [];
    bomItemFromBOM = [];
    BOM = [];
    dependencyTree = [];


    // let sub = 'gc';
    // // receive the id params sent from the api request 
    // const id = req.params.id;
    // console.log('id:', id);
    // generate the basic 3 queries for the database interatcion +,/,*
    let queries2getRules = await queryGenerator4labsInitial(sub, id);
    // console.log('queries2getRules:', queries2getRules);

    // sql mode query to set the database to be grouped by single field
    let sqlMode = await sqlQueryResultFetcher("SET sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''));");
    // console.log(sqlMode);

    // query the self built database GC to or RULES to get level 1 items ****************** LOOP THIS PROCESS ************************

    while (queries2getRules.length > 0) {
      let query = queries2getRules.pop();
      let rules = await sqlQueryResultFetcher(query);

      rules.forEach(function (item) {

        var firstKey = Object.keys(item)[0];
        var secondKey = Object.keys(item)[2];

        BOM.push({
          'idName': item[firstKey],
          'qty': item[secondKey]
        });
      });

      await rawBomSeparator4rules(rules);
    }

    // ****************************************************************//
    // IMPLEMENT THE '1. 2.Get complex conditions from the code' HERE //
    // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv //

    let idASstring = '';
    id.forEach((i) => {
      idASstring += sub + '-' + i + ' ';
    });
    await performComplexAdditions(sub, await idASstring);////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ //
    // IMPLEMENT THE '1. 2.Get complex conditions from the code' HERE //
    // ****************************************************************//

    // check if the items list in raw and bom empty, if yes -> return
    if (BOM.length === 0) {
      return 'INVALID REQUEST';
    }

    // Copy bomItem to bomItemPOP. Where bomItemPOP is the array which will be poped
    // let bomItemPOP = await JSON.parse(JSON.stringify(bomItem));
    let bomItemPOP = await bomItem.slice();
    // Still need to figure out a way to inject more than 1 packaged item into each individual line item **********************************************

    // start quering the database to get down all the elements down to inventory level
    await assemblyTOstock(bomItemPOP);

    // UNIQUE STOCK WITH SUMMED QUANTITY //
    let totalRawItemsUnique = await groupNaddRawItems();
    let totalRAW = totalRawItemsUnique.slice();

    // Get full details of the all the UNIQUE STOCK items
    let priceQuery = await priceQueryGenerator(totalRawItemsUnique);
    // console.log('priceQuery:', priceQuery);
    let priceQueryResults = await sqlQueryResultFetcher(priceQuery);
    console.log("\nSQL Result Size:", priceQueryResults.length);
    // console.log(priceQueryResults);

    // For each raw material:
    // 1. Do unit conversion for cost, get average cost to base unit equivalent cost. Units Type -> *Base Unit* SYNC *Stock Unit*.
    // 2. Print items that have average cost of -1.
    priceQueryResults.forEach(async function (item) {

      // Convert Stock(Average Cost) Units to Base Units
      if ((item.unitsType.toUpperCase() === 'AREA' && item.stockUnit.toUpperCase() !== 'SQUARE FOOT') ||
        (item.unitsType.toUpperCase() === 'COUNT' && item.stockUnit.toUpperCase() !== 'EACH') ||
        (item.unitsType.toUpperCase() === 'LENGTH' && item.stockUnit.toUpperCase() !== 'INCH') ||
        (item.unitsType.toUpperCase() === 'PAD' && item.stockUnit.toUpperCase() !== 'PAD') ||
        (item.unitsType.toUpperCase() === 'VOLUME' && item.stockUnit.toUpperCase() !== 'LITER') ||
        (item.unitsType.toUpperCase() === 'WEIGHT' && item.stockUnit.toUpperCase() !== 'GRAM')) {
        // console.log(`UNIT CONVERSION ----------------- ${item.idName} ---- ${item.unitsType} ---- ${item.stockUnit}`);

        // UNITS CONVERSION : AREA, LENGTH, VOLUME, WEIGHT
        if (item.unitsType.toUpperCase() === 'AREA') {
          if (item.stockUnit.toUpperCase() === 'SQUARE INCH' && item.averageCost >= 0) {
            // console.log(`UNIT CONVERSION BEFORE ----------------- ${item.idName} ---- ${item.unitsType} ---- ${item.stockUnit} --- ${item.averageCost}`);
            item.stockUnit = 'Square Foot';
            item.averageCost = 144 * item.averageCost;
            // console.log(`UNIT CONVERSION AFTER  ----------------- ${item.idName} ---- ${item.unitsType} ---- ${item.stockUnit} --- ${item.averageCost}`);
          } else if (item.stockUnit.toUpperCase() === 'SQUARE YARD' && item.averageCost >= 0) {
            // console.log(`UNIT CONVERSION BEFORE ----------------- ${item.idName} ---- ${item.unitsType} ---- ${item.stockUnit} --- ${item.averageCost}`);
            item.stockUnit = 'Square Foot';
            item.averageCost = item.averageCost / 9;
            // console.log(`UNIT CONVERSION AFTER  ----------------- ${item.idName} ---- ${item.unitsType} ---- ${item.stockUnit} --- ${item.averageCost}`);
          } else {
            console.log(`Average Price: Price Conversion criteria not avaliable Units Type: ${item.unitsType}, Stock Unit: ${item.stockUnit}, Purchase Unit: ${item.purchaseUnit}, idName:${item.idName}`);
          }

          // Add any more conversions if it shows up in future.

        } else if (item.unitsType.toUpperCase() === 'LENGTH') {
          if (item.stockUnit.toUpperCase() === 'FOOT' && item.averageCost >= 0) {
            // console.log(`UNIT CONVERSION BEFORE ----------------- ${item.idName} ---- ${item.unitsType} ---- ${item.stockUnit} --- ${item.averageCost}`);
            item.stockUnit = 'Inch';
            item.averageCost = item.averageCost / 12;
            // console.log(`UNIT CONVERSION AFTER  ----------------- ${item.idName} ---- ${item.unitsType} ---- ${item.stockUnit} --- ${item.averageCost}`);
          } else if (item.stockUnit.toUpperCase() === 'YARD' && item.averageCost >= 0) {
            // console.log(`UNIT CONVERSION BEFORE ----------------- ${item.idName} ---- ${item.unitsType} ---- ${item.stockUnit} --- ${item.averageCost}`);
            item.stockUnit = 'Inch';
            item.averageCost = item.averageCost / 36;
            // console.log(`UNIT CONVERSION AFTER  ----------------- ${item.idName} ---- ${item.unitsType} ---- ${item.stockUnit} --- ${item.averageCost}`);
          } else {
            console.log(`Average Price: Price Conversion criteria not avaliable Units Type: ${item.unitsType}, Stock Unit: ${item.stockUnit}, Purchase Unit: ${item.purchaseUnit}, idName:${item.idName}`);
          }

          // Add any more conversions if it shows up in future.

        } else if (item.unitsType.toUpperCase() === 'VOLUME') {
          if (item.stockUnit.toUpperCase() === 'CUBIC FOOT' && item.averageCost >= 0) {
            // console.log(`UNIT CONVERSION BEFORE ----------------- ${item.idName} ---- ${item.unitsType} ---- ${item.stockUnit} --- ${item.averageCost}`);
            item.stockUnit = 'Liter';
            item.averageCost = item.averageCost / 28.317;
            // console.log(`UNIT CONVERSION AFTER  ----------------- ${item.idName} ---- ${item.unitsType} ---- ${item.stockUnit} --- ${item.averageCost}`);
          } else if (item.stockUnit.toUpperCase() === 'MILLILITER' && item.averageCost >= 0) {
            // console.log(`UNIT CONVERSION BEFORE ----------------- ${item.idName} ---- ${item.unitsType} ---- ${item.stockUnit} --- ${item.averageCost}`);
            item.stockUnit = 'Liter';
            item.averageCost = item.averageCost * 1000;
            // console.log(`UNIT CONVERSION AFTER  ----------------- ${item.idName} ---- ${item.unitsType} ---- ${item.stockUnit} --- ${item.averageCost}`);
          } else if (item.stockUnit.toUpperCase() === 'QUART' && item.averageCost >= 0) {
            // console.log(`UNIT CONVERSION BEFORE ----------------- ${item.idName} ---- ${item.unitsType} ---- ${item.stockUnit} --- ${item.averageCost}`);
            item.stockUnit = 'Liter';
            item.averageCost = item.averageCost / 1.057;
            // console.log(`UNIT CONVERSION AFTER  ----------------- ${item.idName} ---- ${item.unitsType} ---- ${item.stockUnit} --- ${item.averageCost}`);
          } else if (item.stockUnit.toUpperCase() === 'GALLON' && item.averageCost >= 0) {
            // console.log(`UNIT CONVERSION BEFORE ----------------- ${item.idName} ---- ${item.unitsType} ---- ${item.stockUnit} --- ${item.averageCost}`);
            item.stockUnit = 'Liter';
            item.averageCost = item.averageCost / 3.78541;
            // console.log(`UNIT CONVERSION AFTER  ----------------- ${item.idName} ---- ${item.unitsType} ---- ${item.stockUnit} --- ${item.averageCost}`);
          } else if (item.stockUnit.toUpperCase() === 'OUNCE' && item.averageCost >= 0) {
            // console.log(`UNIT CONVERSION BEFORE ----------------- ${item.idName} ---- ${item.unitsType} ---- ${item.stockUnit} --- ${item.averageCost}`);
            item.stockUnit = 'Liter';
            item.averageCost = item.averageCost * 33.814;
            // console.log(`UNIT CONVERSION AFTER  ----------------- ${item.idName} ---- ${item.unitsType} ---- ${item.stockUnit} --- ${item.averageCost}`);
          } else {
            console.log(`Average Price: Price Conversion criteria not avaliable Units Type: ${item.unitsType}, Stock Unit: ${item.stockUnit}, Purchase Unit: ${item.purchaseUnit}, idName:${item.idName}`);
          }

          // Add any more conversions if it shows up in future.

        } else if (item.unitsType.toUpperCase() === 'WEIGHT') {
          if (item.stockUnit.toUpperCase() === 'OUNCE' && item.averageCost >= 0) {
            // console.log(`UNIT CONVERSION BEFORE ----------------- ${item.idName} ---- ${item.unitsType} ---- ${item.stockUnit} --- ${item.averageCost}`);
            item.stockUnit = 'Gram';
            item.averageCost = item.averageCost / 28.35;
            // console.log(`UNIT CONVERSION AFTER  ----------------- ${item.idName} ---- ${item.unitsType} ---- ${item.stockUnit} --- ${item.averageCost}`);
          } else if (item.stockUnit.toUpperCase() === 'POUND' && item.averageCost >= 0) {
            // console.log(`UNIT CONVERSION BEFORE ----------------- ${item.idName} ---- ${item.unitsType} ---- ${item.stockUnit} --- ${item.averageCost}`);
            item.stockUnit = 'Gram';
            item.averageCost = item.averageCost / 453.592;
            // console.log(`UNIT CONVERSION AFTER  ----------------- ${item.idName} ---- ${item.unitsType} ---- ${item.stockUnit} --- ${item.averageCost}`);
          } else if (item.stockUnit.toUpperCase() === 'KILOGRAM' && item.averageCost >= 0) {
            // console.log(`UNIT CONVERSION BEFORE ----------------- ${item.idName} ---- ${item.unitsType} ---- ${item.stockUnit} --- ${item.averageCost}`);
            item.stockUnit = 'Gram';
            item.averageCost = item.averageCost / 1000;
            // console.log(`UNIT CONVERSION AFTER  ----------------- ${item.idName} ---- ${item.unitsType} ---- ${item.stockUnit} --- ${item.averageCost}`);
          } else {
            console.log(`Average Price: Price Conversion criteria not avaliable Units Type: ${item.unitsType}, Stock Unit: ${item.stockUnit}, Purchase Unit: ${item.purchaseUnit}, idName:${item.idName}`);
          }

          // Add any more conversions if it shows up in future.

        }
      }

      // Convert Purchase(Purchase, Last Purchase) Units to Base Units
      if ((item.unitsType.toUpperCase() === 'AREA' && item.purchaseUnit.toUpperCase() !== 'SQUARE FOOT') ||
        (item.unitsType.toUpperCase() === 'COUNT' && item.purchaseUnit.toUpperCase() !== 'EACH') ||
        (item.unitsType.toUpperCase() === 'LENGTH' && item.purchaseUnit.toUpperCase() !== 'INCH') ||
        (item.unitsType.toUpperCase() === 'PAD' && item.purchaseUnit.toUpperCase() !== 'PAD') ||
        (item.unitsType.toUpperCase() === 'VOLUME' && item.purchaseUnit.toUpperCase() !== 'LITER') ||
        (item.unitsType.toUpperCase() === 'WEIGHT' && item.purchaseUnit.toUpperCase() !== 'GRAM')) {
        // console.log(`UNIT CONVERSION ----------------- ${item.idName} ---- ${item.unitsType} ---- ${item.purchaseUnit}`);

        // UNITS CONVERSION : AREA, LENGTH, VOLUME, WEIGHT
        if (item.unitsType.toUpperCase() === 'AREA') {
          if (item.purchaseUnit.toUpperCase() === 'SQUARE INCH') {
            // console.log(`UNIT CONVERSION BEFORE ----------------- ${item.idName} ---- ${item.unitsType} ---- ${item.purchaseUnit} --- ${item.purchasePrice} --- ${item.lastPurchasePrice}`);
            if (item.purchasePrice >= 0) {
              item.purchasePrice = 144 * item.purchasePrice;
            }
            if (item.lastPurchasePrice >= 0) {
              item.lastPurchasePrice = 144 * item.lastPurchasePrice;
            }
            item.purchaseUnit = 'Square Foot';

            // console.log(`UNIT CONVERSION AFTER  ----------------- ${item.idName} ---- ${item.unitsType} ---- ${item.purchaseUnit} --- ${item.purchasePrice} --- ${item.lastPurchasePrice}`);
          } else if (item.purchaseUnit.toUpperCase() === 'SQUARE YARD') {
            // console.log(`UNIT CONVERSION BEFORE ----------------- ${item.idName} ---- ${item.unitsType} ---- ${item.purchaseUnit} --- ${item.purchasePrice} --- ${item.lastPurchasePrice}`);
            if (item.purchasePrice >= 0) {
              item.purchasePrice = item.purchasePrice / 9;
            }
            if (item.lastPurchasePrice >= 0) {
              item.lastPurchasePrice = item.lastPurchasePrice / 9;
            }
            item.purchaseUnit = 'Square Foot';

            // console.log(`UNIT CONVERSION AFTER  ----------------- ${item.idName} ---- ${item.unitsType} ---- ${item.purchaseUnit} --- ${item.purchasePrice} --- ${item.lastPurchasePrice}`);
          } else {
            console.log(`Purchase Price: Price Conversion criteria not avaliable Units Type: ${item.unitsType}, Stock Unit: ${item.stockUnit}, Purchase Unit: ${item.purchaseUnit}, idName:${item.idName}`);
          }

          // Add any more conversions if it shows up in future.

        } else if (item.unitsType.toUpperCase() === 'LENGTH') {
          if (item.purchaseUnit.toUpperCase() === 'FOOT') {
            // console.log(`UNIT CONVERSION BEFORE ----------------- ${item.idName} ---- ${item.unitsType} ---- ${item.purchaseUnit} --- ${item.purchasePrice} --- ${item.lastPurchasePrice}`);
            if (item.purchasePrice >= 0) {
              item.purchasePrice = item.purchasePrice / 12;
            }
            if (item.lastPurchasePrice >= 0) {
              item.lastPurchasePrice = item.lastPurchasePrice / 12;
            }
            item.purchaseUnit = 'Inch';

            // console.log(`UNIT CONVERSION AFTER  ----------------- ${item.idName} ---- ${item.unitsType} ---- ${item.purchaseUnit} --- ${item.purchasePrice} --- ${item.lastPurchasePrice}`);
          } else if (item.purchaseUnit.toUpperCase() === 'YARD') {
            // console.log(`UNIT CONVERSION BEFORE ----------------- ${item.idName} ---- ${item.unitsType} ---- ${item.purchaseUnit} --- ${item.purchasePrice} --- ${item.lastPurchasePrice}`);
            if (item.purchasePrice >= 0) {
              item.purchasePrice = item.purchasePrice / 36;
            }
            if (item.lastPurchasePrice >= 0) {
              item.lastPurchasePrice = item.lastPurchasePrice / 36;
            }
            item.purchaseUnit = 'Inch';

            // console.log(`UNIT CONVERSION AFTER  ----------------- ${item.idName} ---- ${item.unitsType} ---- ${item.purchaseUnit} --- ${item.purchasePrice} --- ${item.lastPurchasePrice}`);
          } else {
            console.log(`Purchase Price: Price Conversion criteria not avaliable Units Type: ${item.unitsType}, Stock Unit: ${item.stockUnit}, Purchase Unit: ${item.purchaseUnit}, idName:${item.idName}`);
          }

          // Add any more conversions if it shows up in future.

        } else if (item.unitsType.toUpperCase() === 'VOLUME') {
          if (item.purchaseUnit.toUpperCase() === 'CUBIC FOOT') {
            // console.log(`UNIT CONVERSION BEFORE ----------------- ${item.idName} ---- ${item.unitsType} ---- ${item.purchaseUnit} --- ${item.purchasePrice} --- ${item.lastPurchasePrice}`);
            if (item.purchasePrice >= 0) {
              item.purchasePrice = item.purchasePrice / 28.317;
            }
            if (item.lastPurchasePrice >= 0) {
              item.lastPurchasePrice = item.lastPurchasePrice / 28.317;
            }
            item.purchaseUnit = 'Liter';

            // console.log(`UNIT CONVERSION AFTER  ----------------- ${item.idName} ---- ${item.unitsType} ---- ${item.purchaseUnit} --- ${item.purchasePrice} --- ${item.lastPurchasePrice}`);
          } else if (item.purchaseUnit.toUpperCase() === 'MILLILITER') {
            // console.log(`UNIT CONVERSION BEFORE ----------------- ${item.idName} ---- ${item.unitsType} ---- ${item.purchaseUnit} --- ${item.purchasePrice} --- ${item.lastPurchasePrice}`);
            if (item.purchasePrice >= 0) {
              item.purchasePrice = item.purchasePrice * 1000;
            }
            if (item.lastPurchasePrice >= 0) {
              item.lastPurchasePrice = item.lastPurchasePrice * 1000;
            }
            item.purchaseUnit = 'Liter';

            // console.log(`UNIT CONVERSION AFTER  ----------------- ${item.idName} ---- ${item.unitsType} ---- ${item.purchaseUnit} --- ${item.purchasePrice} --- ${item.lastPurchasePrice}`);
          } else if (item.purchaseUnit.toUpperCase() === 'QUART') {
            // console.log(`UNIT CONVERSION BEFORE ----------------- ${item.idName} ---- ${item.unitsType} ---- ${item.purchaseUnit} --- ${item.purchasePrice} --- ${item.lastPurchasePrice}`);
            if (item.purchasePrice >= 0) {
              item.purchasePrice = item.purchasePrice / 1.057;
            }
            if (item.lastPurchasePrice >= 0) {
              item.lastPurchasePrice = item.lastPurchasePrice / 1.057;
            }
            item.purchaseUnit = 'Liter';

            // console.log(`UNIT CONVERSION AFTER  ----------------- ${item.idName} ---- ${item.unitsType} ---- ${item.purchaseUnit} --- ${item.purchasePrice} --- ${item.lastPurchasePrice}`);
          } else if (item.purchaseUnit.toUpperCase() === 'GALLON') {
            // console.log(`UNIT CONVERSION BEFORE ----------------- ${item.idName} ---- ${item.unitsType} ---- ${item.purchaseUnit} --- ${item.purchasePrice} --- ${item.lastPurchasePrice}`);
            if (item.purchasePrice >= 0) {
              item.purchasePrice = item.purchasePrice / 3.78541;
            }
            if (item.lastPurchasePrice >= 0) {
              item.lastPurchasePrice = item.lastPurchasePrice / 3.78541;
            }
            item.purchaseUnit = 'Liter';

            // console.log(`UNIT CONVERSION AFTER  ----------------- ${item.idName} ---- ${item.unitsType} ---- ${item.purchaseUnit} --- ${item.purchasePrice} --- ${item.lastPurchasePrice}`);
          } else if (item.purchaseUnit.toUpperCase() === 'OUNCE') {
            // console.log(`UNIT CONVERSION BEFORE ----------------- ${item.idName} ---- ${item.unitsType} ---- ${item.purchaseUnit} --- ${item.purchasePrice} --- ${item.lastPurchasePrice}`);
            if (item.purchasePrice >= 0) {
              item.purchasePrice = item.purchasePrice * 33.814;
            }
            if (item.lastPurchasePrice >= 0) {
              item.lastPurchasePrice = item.lastPurchasePrice * 33.814;
            }
            item.purchaseUnit = 'Liter';

            // console.log(`UNIT CONVERSION AFTER  ----------------- ${item.idName} ---- ${item.unitsType} ---- ${item.purchaseUnit} --- ${item.purchasePrice} --- ${item.lastPurchasePrice}`);
          } else {
            console.log(`Purchase Price: Price Conversion criteria not avaliable Units Type: ${item.unitsType}, Stock Unit: ${item.stockUnit}, Purchase Unit: ${item.purchaseUnit}, idName:${item.idName}`);
          }

          // Add any more conversions if it shows up in future.

        } else if (item.unitsType.toUpperCase() === 'WEIGHT') {
          if (item.purchaseUnit.toUpperCase() === 'OUNCE') {
            // console.log(`UNIT CONVERSION BEFORE ----------------- ${item.idName} ---- ${item.unitsType} ---- ${item.purchaseUnit} --- ${item.purchasePrice} --- ${item.lastPurchasePrice}`);
            if (item.purchasePrice >= 0) {
              item.purchasePrice = item.purchasePrice / 28.35;
            }
            if (item.lastPurchasePrice >= 0) {
              item.lastPurchasePrice = item.lastPurchasePrice / 28.35;
            }
            item.purchaseUnit = 'Gram';

            // console.log(`UNIT CONVERSION AFTER  ----------------- ${item.idName} ---- ${item.unitsType} ---- ${item.purchaseUnit} --- ${item.purchasePrice} --- ${item.lastPurchasePrice}`);
          } else if (item.purchaseUnit.toUpperCase() === 'POUND') {
            // console.log(`UNIT CONVERSION BEFORE ----------------- ${item.idName} ---- ${item.unitsType} ---- ${item.purchaseUnit} --- ${item.purchasePrice} --- ${item.lastPurchasePrice}`);
            if (item.purchasePrice >= 0) {
              item.purchasePrice = item.purchasePrice / 453.592;
            }
            if (item.lastPurchasePrice >= 0) {
              item.lastPurchasePrice = item.lastPurchasePrice / 453.592;
            }
            item.purchaseUnit = 'Gram';

            // console.log(`UNIT CONVERSION AFTER  ----------------- ${item.idName} ---- ${item.unitsType} ---- ${item.purchaseUnit} --- ${item.purchasePrice} --- ${item.lastPurchasePrice}`);
          } else if (item.purchaseUnit.toUpperCase() === 'KILOGRAM') {
            // console.log(`UNIT CONVERSION BEFORE ----------------- ${item.idName} ---- ${item.unitsType} ---- ${item.purchaseUnit} --- ${item.purchasePrice} --- ${item.lastPurchasePrice}`);
            if (item.purchasePrice >= 0) {
              item.purchasePrice = item.purchasePrice / 1000;
            }
            if (item.lastPurchasePrice >= 0) {
              item.lastPurchasePrice = item.lastPurchasePrice / 1000;
            }
            item.purchaseUnit = 'Gram';

            // console.log(`UNIT CONVERSION AFTER  ----------------- ${item.idName} ---- ${item.unitsType} ---- ${item.purchaseUnit} --- ${item.purchasePrice} --- ${item.lastPurchasePrice}`);
          } else {
            console.log(`Purchase Price: Price Conversion criteria not avaliable Units Type: ${item.unitsType}, Stock Unit: ${item.stockUnit}, Purchase Unit: ${item.purchaseUnit}, idName:${item.idName}`);
          }

          // Add any more conversions if it shows up in future.

        }
      }

      // if (item.unitsType.toUpperCase() === 'AREA' && item.stockUnit.toUpperCase() === 'SQUARE FOOT') {
      //   console.log(`UNIT CONVERSION ----------------- ${item.idName} ---- ${item.unitsType} ---- ${item.stockUnit}`);
      // }

      // if ((Math.round(item.averageCost/item.purchasePrice) > 10 || Math.round(item.purchasePrice/item.averageCost) > 10) && item.stockUnit === item.purchaseUnit && item.unitsType.toUpperCase() !== 'COUNT') {
      //   console.log(`COST VARIATION  ----------------- ${item.idName} ---- ${item.averageCost} ---- ${item.purchasePrice}`);
      // }

      // Average Cost set to last purchase price or purchase price if less than or equal to zero
      if (item.averageCost <= 0) {
        if (item.lastPurchasePrice > 0) {
          item.averageCost = item.lastPurchasePrice;
          // console.log(`ERROR@looper4eachSubject set to LASTPURCHASEPRICE:", ${item.idName} --- ${item.averageCost}`);
        } else if (item.purchasePrice > 0) {
          item.averageCost = item.purchasePrice;
          // console.log(`ERROR@looper4eachSubject set to PURCHASEPRICE:", ${item.idName} --- ${item.averageCost}`);
        } else {
          console.log(`ERROR@looper4eachSubject - Average Cost = 0: ${item.idName}`);
          item.averageCost = 0;
        }
      }

      // // Cost set to last purchase price if its more than average cost
      // if (item.lastPurchasePrice > item.averageCost) {
      //   console.log(`COST_SWITCH@looper4eachSubject set to LASTPURCHASEPRICE:", ${item.idName} --- ${item.averageCost} --- ${item.lastPurchasePrice} --- ${item.purchasePrice}`);
      //   item.averageCost = item.lastPurchasePrice;
      // }

    });

    // this is done coz there was a disturbacy in th price
    let resAR = [];
    let response = await adminPageMapping(resAR, priceQueryResults, sub);
    // console.log('response:', response);
    let kitCostArray = await priceCalculator(BOM, dependencyTree, sub);
    let kitCost = kitCostArray[0];
    let lastPurchasePrice = kitCostArray[1];

    let lowerPrice = kitCost / 0.35;
    let upperPrice = kitCost / 0.31;

    console.log("ESTIMATED KIT COST:", kitCostArray);

    response.push(kitCost);
    response.push(lowerPrice);
    response.push(upperPrice);

    // console.log("BOM:", BOM); //BOM is ready

    let serverResponse = [];
    // This is done only for admin's page
    // if (id.includes("x")) {

    serverResponse.push(response[3]);
    serverResponse.push(response[4]);
    serverResponse.push(response[2]);
    serverResponse.push(response[0]);
    serverResponse.push(response[1]);
    serverResponse.push(lastPurchasePrice);


    return serverResponse;

  }

  // This was the most complicated section. Please take most care while editing this function.
  // combineTHEsubjects function combines the result computed for each subject with other.
  // Equipment and ship items like beaker, thermometer, sleeve for thermometer etc. are combined meaning the max is put in the Kit.
  // Euipment that are one time consumable like Styrofoam Cup, Catch Pan are added.
  // All other Modules, Bags, Bottles are untouched.
  async function combineTHEsubjects(serverResponse, serverResponseOther, sub) {

    let interscetionItems = [];

    // this part will check for both arrays(serverResponse, serverResponseOther) and do the required comparision of equipments only
    serverResponse[3].forEach((present) => {
      serverResponseOther[3].forEach((current) => {

        // Criteria applied only to Equp and Ship
        if (current.idName.toUpperCase().startsWith('EQUP') || current.idName.toUpperCase().startsWith('SHIP')) {

          // Neglecting one time consumable items. This idNames were given by Cait.
          if (current.idName !== 'Equp2029' && current.idName !== 'Equp7030' && current.idName !== 'Equp8129' && current.idName !== 'Equp1632'
            && current.idName !== 'Equp3047' && current.idName !== 'Equp7125' && current.idName !== 'Equp9019' && current.idName !== 'Equp8026'
            && current.idName !== 'Equp6101' && current.idName !== 'Equp8014' && current.idName !== 'Equp2213' && current.idName !== 'Equp2031'
            && current.idName !== 'Equp1385' && current.idName !== 'Equp1384' && current.idName !== 'Equp8022' && current.idName !== 'Equp1237'
            && current.idName !== 'Equp1313' && current.idName !== 'Equp1680' && current.idName !== 'Equp1682' && current.idName !== 'Equp1684'
            && current.idName !== 'Ship8102') {

            // if the serverResponseOther's equp quantity is greater that the serverResponse's equp quantity
            if (present.idName === current.idName && current.qty > present.qty) {
              // console.log('in current greater:', current.idName);
              // console.log('\nSTART\nserverResponse:', serverResponse[3]);
              // console.log('serverResponseOther:', serverResponseOther[3]);
              // console.log('\nserverResponse:', serverResponse[2]);
              // console.log('serverResponseOther:', serverResponseOther[2]);

              // this part will add the difference item to the final array

              let oldQty = present.qty;
              present.qty = current.qty;
              // let posBOM = serverResponse[3].map(function (e) { return e.idName; }).indexOf(present.idName);
              let pos = serverResponseOther[4].map(function (e) { return e.idName; }).indexOf(present.idName);

              let pricePerUnit = serverResponseOther[4][pos].averageCost;
              let differenceAmount = (current.qty - oldQty) * pricePerUnit;

              let pricePerUnitLast = serverResponseOther[4][pos].lastPurchasePrice;
              let differenceAmountLast = (current.qty - oldQty) * pricePerUnitLast;

              serverResponse[0] += differenceAmount / 0.35;
              serverResponse[1] += differenceAmount / 0.31;
              serverResponse[2] += differenceAmount;
              serverResponse[5] += differenceAmountLast;

              // this part will add the difference item to the final array

              // this part will remove the added item from the current array

              serverResponseOther[0] -= pricePerUnit * current.qty / 0.35;
              serverResponseOther[1] -= pricePerUnit * current.qty / 0.31;
              serverResponseOther[2] -= pricePerUnit * current.qty;
              serverResponseOther[5] -= pricePerUnitLast * current.qty;
              interscetionItems.push(current);
              // console.log('\ndifferenceAmount 1:', differenceAmount);
              // console.log('\nEND\nserverResponse:', serverResponse[3]);
              // console.log('serverResponseOther:', serverResponseOther[3]);
              // console.log('\nserverResponse:', serverResponse[2]);
              // console.log('serverResponseOther:', serverResponseOther[2]);

              // this part will remove the added item from the current array

              // if the serverResponse's equp quantity is greater that the serverResponseOther's equp quantity
            } else if (present.idName === current.idName && present.qty > current.qty) {
              // console.log('in current lesser');
              // console.log('serverResponseOther:', serverResponseOther);
              let pos = serverResponseOther[4].map(function (e) { return e.idName; }).indexOf(present.idName);

              let pricePerUnit = serverResponseOther[4][pos].averageCost;
              // let differenceAmount = (current.qty - present.qty) * pricePerUnit;

              let pricePerUnitLast = serverResponseOther[4][pos].lastPurchasePrice;
              // let differenceAmountLast = (current.qty - oldQty) * pricePerUnitLast;

              serverResponseOther[0] -= pricePerUnit * current.qty / 0.35;
              serverResponseOther[1] -= pricePerUnit * current.qty / 0.31;
              serverResponseOther[2] -= pricePerUnit * current.qty;
              serverResponseOther[5] -= pricePerUnitLast * current.qty;
              interscetionItems.push(current);
              // console.log('\ndifferenceAmount 2:', differenceAmount);

              // if the serverResponse's equp quantity is equal to the serverResponseOther's equp quantity
            } else if (present.idName === current.idName && current.qty === present.qty) {
              // console.log('in equal:', current.idName);
              // console.log('serverResponseOther:', serverResponseOther);
              let pos = serverResponseOther[4].map(function (e) { return e.idName; }).indexOf(present.idName);
              // console.log('serverResponseOther:', pos);
              // if(serverResponse[4][pos] === undefined){
              //   console.log('present:', present);
              //   console.log('buggy:', serverResponse[4]);
              // }

              let differenceAmount = present.qty * serverResponseOther[4][pos].averageCost;

              let differenceAmountLast = present.qty * serverResponseOther[4][pos].lastPurchasePrice;

              serverResponseOther[0] -= differenceAmount / 0.35;
              serverResponseOther[1] -= differenceAmount / 0.31;
              serverResponseOther[2] -= differenceAmount;
              serverResponseOther[5] -= differenceAmountLast;
              interscetionItems.push(current);
              // console.log(differenceAmount);
            } else {
              // Use this section for console.log, if any debugging is needed
            }

          } else {
            // Use this section for console.log, if any debugging is needed
          }

        } else {
          // Use this section for console.log, if any debugging is needed
        }

      });
    });

    // console.log(interscetionItems);
    // console.log(serverResponseOther[3]);
    // this will remove intersected items from the serverResponseOther
    if (interscetionItems.length > 0) {
      await interscetionItems.forEach(async (del) => {
        let posBOM = serverResponseOther[3].map(function (e) { return e.idName; }).indexOf(del.idName);
        // let pos = serverResponseOther[4].map(function (e) { return e.idName; }).indexOf(del.idName);
        // console.log(`posBOM:${posBOM}`);
        // console.log(serverResponseOther[3]);
        await serverResponseOther[3].splice(posBOM, 1);
        // await serverResponseOther[4].splice(pos, 1);
      });
    }

    // this delay is to remove the necessary elements from serverResponseOther and later add remaining to serverResponse.
    // Not required now, add later, if needed
    // await sleep(100);

    let diffAmount = await baseKitCost(sub) * 0.5;

    // this will add the remaining items from the serverResponseOther to serverResponse and adjust the pricing
    if (serverResponseOther[3].length > 0) {

      serverResponse[0] += serverResponseOther[0] - diffAmount / 0.35;
      serverResponse[1] += serverResponseOther[1] - diffAmount / 0.31;
      serverResponse[2] += serverResponseOther[2] - diffAmount;
      serverResponse[5] += serverResponseOther[5] - diffAmount;

      serverResponseOther[3].forEach((bomItem) => {
        serverResponse[3].push(bomItem);
        // console.log('bom:', bomItem.idName);
      });

      serverResponseOther[4].forEach((dependancy) => {
        serverResponse[4].push(dependancy);
      });

    } else {
      serverResponse[0] += serverResponseOther[0] - diffAmount / 0.35;
      serverResponse[1] += serverResponseOther[1] - diffAmount / 0.31;
      serverResponse[2] += serverResponseOther[2] - diffAmount;
      serverResponse[5] += serverResponseOther[5] - diffAmount;
    }

    // this will remove duplicates from the dependency tree or the items under the modules, bags, bottles will duplicated at the UI level
    serverResponse[4] = serverResponse[4].filter((tree, index, self) =>
      index === self.findIndex((t) => (
        t.idName === tree.idName && t.memItem === tree.memItem
      ))
    );

    return await serverResponse;

  }

  const ckpProcessor = async () => {

    const id = req;

    let ids;
    let gp, gc, ib, ap, mb, ic, ast, gb, es, fs, ip, hb, hg, sg, bg, rm, pt;

    gp = [];
    gc = [];
    ib = [];
    ap = [];
    mb = [];
    ic = [];
    ast = [];
    gb = [];
    es = [];
    fs = [];
    ip = [];
    hb = [];
    hg = [];
    sg = [];
    bg = [];
    rm = [];
    pt = [];

    ids = await id.split(" ");

    // separate each subject labs
    for (let i = 0; i < ids.length; i++) {
      let subject = await ids[i].split("-");

      switch (subject[0]) {

        // no dissection kits
        case 'gp':
          if (subject.length == 2 && !subject[1].startsWith('v') && !subject[1].startsWith('d')) {
            gp.push(subject[1]);
          } else if (subject.length == 2 && (subject[1].startsWith('v') || subject[1].startsWith('d'))) {
            // do nothing for this version or dissection entity
          } else {
            console.log('somethings wrong in ckpProcessor:', subject);
          }
          break;

        case 'gc':
          if (!subject[1].startsWith('v') && !subject[1].startsWith('d')) {
            gc.push(subject[1]);
          } else if (subject.length == 2 && (subject[1].startsWith('v') || subject[1].startsWith('d'))) {
            // do nothing for this version or dissection entity
          } else {
            console.log('somethings wrong in ckpProcessor:', subject);
          }
          break;

        case 'mb':
          if (!subject[1].startsWith('v') && !subject[1].startsWith('d')) {
            mb.push(subject[1]);
          } else if (subject.length == 2 && (subject[1].startsWith('v') || subject[1].startsWith('d'))) {
            // do nothing for this version or dissection entity
          } else {
            console.log('somethings wrong in ckpProcessor:', subject);
          }
          break;

        case 'ic':
          if (!subject[1].startsWith('v') && !subject[1].startsWith('d')) {
            ic.push(subject[1]);
          } else if (subject.length == 2 && (subject[1].startsWith('v') || subject[1].startsWith('d'))) {
            // do nothing for this version or dissection entity
          } else {
            console.log('somethings wrong in ckpProcessor:', subject);
          }
          break;

        case 'as':
          if (!subject[1].startsWith('v') && !subject[1].startsWith('d')) {
            ast.push(subject[1]);
          } else if (subject.length == 2 && (subject[1].startsWith('v') || subject[1].startsWith('d'))) {
            // do nothing for this version or dissection entity
          } else {
            console.log('somethings wrong in ckpProcessor:', subject);
          }
          break;

        case 'es':
          if (!subject[1].startsWith('v') && !subject[1].startsWith('d')) {
            es.push(subject[1]);
          } else if (subject.length == 2 && (subject[1].startsWith('v') || subject[1].startsWith('d'))) {
            // do nothing for this version or dissection entity
          } else {
            console.log('somethings wrong in ckpProcessor:', subject);
          }
          break;

        case 'fs':
          if (!subject[1].startsWith('v') && !subject[1].startsWith('d')) {
            fs.push(subject[1]);
          } else if (subject.length == 2 && (subject[1].startsWith('v') || subject[1].startsWith('d'))) {
            // do nothing for this version or dissection entity
          } else {
            console.log('somethings wrong in ckpProcessor:', subject);
          }
          break;

        case 'ip':
          if (!subject[1].startsWith('v') && !subject[1].startsWith('d')) {
            ip.push(subject[1]);
          } else if (subject.length == 2 && (subject[1].startsWith('v') || subject[1].startsWith('d'))) {
            // do nothing for this version or dissection entity
          } else {
            console.log('somethings wrong in ckpProcessor:', subject);
          }
          break;

        case 'hg':
          if (!subject[1].startsWith('v') && !subject[1].startsWith('d')) {
            hg.push(subject[1]);
          } else if (subject.length == 2 && (subject[1].startsWith('v') || subject[1].startsWith('d'))) {
            // do nothing for this version or dissection entity
          } else {
            console.log('somethings wrong in ckpProcessor:', subject);
          }
          break;

        case 'sg':
          if (!subject[1].startsWith('v') && !subject[1].startsWith('d')) {
            sg.push(subject[1]);
          } else if (subject.length == 2 && (subject[1].startsWith('v') || subject[1].startsWith('d'))) {
            // do nothing for this version or dissection entity
          } else {
            console.log('somethings wrong in ckpProcessor:', subject);
          }
          break;

        case 'bg':
          if (!subject[1].startsWith('v') && !subject[1].startsWith('d')) {
            bg.push(subject[1]);
          } else if (subject.length == 2 && (subject[1].startsWith('v') || subject[1].startsWith('d'))) {
            // do nothing for this version or dissection entity
          } else {
            console.log('somethings wrong in ckpProcessor:', subject);
          }
          break;

        case 'rm':
          if (!subject[1].startsWith('v') && !subject[1].startsWith('d')) {
            rm.push(subject[1]);
          } else if (subject.length == 2 && (subject[1].startsWith('v') || subject[1].startsWith('d'))) {
            // do nothing for this version or dissection entity
          } else {
            console.log('somethings wrong in ckpProcessor:', subject);
          }
          break;

        case 'pt':
          if (!subject[1].startsWith('v') && !subject[1].startsWith('d')) {
            pt.push(subject[1]);
          } else if (subject.length == 2 && (subject[1].startsWith('v') || subject[1].startsWith('d'))) {
            // do nothing for this version or dissection entity
          } else {
            console.log('somethings wrong in ckpProcessor:', subject);
          }
          break;


        // Dissection kits
        case 'ib':
          if (subject.length > 2 && !subject[2].startsWith('v') && !subject[2].startsWith('d')) {
            ib.push(-subject[2]);
          } else if (subject.length == 2 && !subject[1].startsWith('v') && !subject[1].startsWith('d')) {
            ib.push(subject[1]);
          } else if (subject.length > 2 && (subject[2].startsWith('v') || subject[2].startsWith('d'))) {
            // do nothing for this version or dissection entity
          } else if (subject.length == 2 && (subject[1].startsWith('v') || subject[1].startsWith('d'))) {
            // do nothing for this version or dissection entity
          } else {
            console.log('somethings wrong in ckpProcessor:', subject);
          }
          break;

        case 'ap':
          if (subject.length > 2 && !subject[2].startsWith('v') && !subject[2].startsWith('d')) {
            ap.push(-subject[2]);
          } else if (subject.length == 2 && !subject[1].startsWith('v') && !subject[1].startsWith('d')) {
            ap.push(subject[1]);
          } else if (subject.length > 2 && (subject[2].startsWith('v') || subject[2].startsWith('d'))) {
            // do nothing for this version or dissection entity
          } else if (subject.length == 2 && (subject[1].startsWith('v') || subject[1].startsWith('d'))) {
            // do nothing for this version or dissection entity
          } else {
            console.log('somethings wrong in ckpProcessor:', subject);
          }
          break;

        case 'hb':
          if (subject.length > 2 && !subject[2].startsWith('v') && !subject[2].startsWith('d')) {
            hb.push(-subject[2]);
          } else if (subject.length == 2 && !subject[1].startsWith('v') && !subject[1].startsWith('d')) {
            hb.push(subject[1]);
          } else if (subject.length > 2 && (subject[2].startsWith('v') || subject[2].startsWith('d'))) {
            // do nothing for this version or dissection entity
          } else if (subject.length == 2 && (subject[1].startsWith('v') || subject[1].startsWith('d'))) {
            // do nothing for this version or dissection entity
          } else {
            console.log('somethings wrong in ckpProcessor:', subject);
          }
          break;

        case 'gb':
          if (subject.length > 2 && !subject[2].startsWith('v') && !subject[2].startsWith('d')) {
            gb.push(-subject[2]);
          } else if (subject.length == 2 && !subject[1].startsWith('v') && !subject[1].startsWith('d')) {
            gb.push(subject[1]);
          } else if (subject.length > 2 && (subject[2].startsWith('v') || subject[2].startsWith('d'))) {
            // do nothing for this version or dissection entity
          } else if (subject.length == 2 && (subject[1].startsWith('v') || subject[1].startsWith('d'))) {
            // do nothing for this version or dissection entity
          } else {
            console.log('somethings wrong in ckpProcessor:', subject);
          }
          break;

        default:
          console.log("ERROR@ckpProcessor2:", ids[i]);
          break;
      }
    }

    let serverResponse, serverResponseAP, serverResponseGC, serverResponseGP, serverResponseIB, serverResponseIC, serverResponseMB, serverResponseAS, serverResponseGB;
    let serverResponseES, serverResponseFS, serverResponseIP, serverResponseHB, serverResponseHG, serverResponseSG, serverResponseBG, serverResponseRM, serverResponsePT;
    serverResponse = [];
    serverResponseAP = [];
    serverResponseGC = [];
    serverResponseGP = [];
    serverResponseIB = [];
    serverResponseIC = [];
    serverResponseMB = [];
    serverResponseAS = [];
    serverResponseGB = [];
    serverResponseES = [];
    serverResponseFS = [];
    serverResponseIP = [];
    serverResponseHB = [];
    serverResponseHG = [];
    serverResponseSG = [];
    serverResponseBG = [];
    serverResponseRM = [];
    serverResponsePT = [];

    // get items for labs of each subject
    if (gp.length > 0)
      serverResponseGP = await looper4eachSubject('gp', gp);
    if (gc.length > 0)
      serverResponseGC = await looper4eachSubject('gc', gc);
    if (ib.length > 0)
      serverResponseIB = await looper4eachSubject('ib', ib);
    if (ap.length > 0)
      serverResponseAP = await looper4eachSubject('ap', ap);
    if (mb.length > 0)
      serverResponseMB = await looper4eachSubject('mb', mb);
    if (ic.length > 0)
      serverResponseIC = await looper4eachSubject('ic', ic);
    if (ast.length > 0)
      serverResponseAS = await looper4eachSubject('as', ast);
    if (gb.length > 0)
      serverResponseGB = await looper4eachSubject('gb', gb);
    if (es.length > 0)
      serverResponseES = await looper4eachSubject('es', es);
    if (fs.length > 0)
      serverResponseFS = await looper4eachSubject('fs', fs);
    if (ip.length > 0)
      serverResponseIP = await looper4eachSubject('ip', ip);
    if (hb.length > 0)
      serverResponseHB = await looper4eachSubject('hb', hb);
    if (hg.length > 0)
      serverResponseHG = await looper4eachSubject('hg', hg);
    if (sg.length > 0)
      serverResponseSG = await looper4eachSubject('sg', sg);
    if (bg.length > 0)
      serverResponseBG = await looper4eachSubject('bg', bg);
    if (rm.length > 0)
      serverResponseRM = await looper4eachSubject('rm', rm);
    if (pt.length > 0)
      serverResponsePT = await looper4eachSubject('pt', pt);

    // start combining the items of all subjects
    if (serverResponseGP.length > 0 && serverResponseGP !== 'INVALID REQUEST') {
      if (serverResponse.length === 0) {
        await serverResponseGP.forEach((item) => {
          serverResponse.push(item);
        });
      } else {
        // console.log('in 1');
        serverResponse = await combineTHEsubjects(serverResponse, serverResponseGP, 'gp');

      }
    }

    if (serverResponseGC.length > 0 && serverResponseGC !== 'INVALID REQUEST') {
      if (serverResponse.length === 0) {
        await serverResponseGC.forEach((item) => {
          serverResponse.push(item);
        });
      } else {
        // console.log('in 2');
        serverResponse = await combineTHEsubjects(serverResponse, serverResponseGC, 'gc');

      }
    }

    if (serverResponseIB.length > 0 && serverResponseIB !== 'INVALID REQUEST') {
      if (serverResponse.length === 0) {
        await serverResponseIB.forEach((item) => {
          serverResponse.push(item);
        });
      } else {
        // console.log('in 3');
        serverResponse = await combineTHEsubjects(serverResponse, serverResponseIB, 'ib');

      }
    }

    if (serverResponseAP.length > 0 && serverResponseAP !== 'INVALID REQUEST') {
      if (serverResponse.length === 0) {
        await serverResponseAP.forEach((item) => {
          serverResponse.push(item);
        });
      } else {
        // console.log('in 4');
        serverResponse = await combineTHEsubjects(serverResponse, serverResponseAP, 'ap');

      }
    }

    if (serverResponseMB.length > 0 && serverResponseMB !== 'INVALID REQUEST') {
      if (serverResponse.length === 0) {
        await serverResponseMB.forEach((item) => {
          serverResponse.push(item);
        });
      } else {
        // console.log('in 5');
        serverResponse = await combineTHEsubjects(serverResponse, serverResponseMB, 'mb');

      }
    }

    if (serverResponseIC.length > 0 && serverResponseIC !== 'INVALID REQUEST') {
      if (serverResponse.length === 0) {
        await serverResponseIC.forEach((item) => {
          serverResponse.push(item);
        });
      } else {
        // console.log('in 6');
        serverResponse = await combineTHEsubjects(serverResponse, serverResponseIC, 'ic');

      }
    }

    if (serverResponseAS.length > 0 && serverResponseAS !== 'INVALID REQUEST') {
      if (serverResponse.length === 0) {
        await serverResponseAS.forEach((item) => {
          serverResponse.push(item);
        });
      } else {
        // console.log('in 7');
        serverResponse = await combineTHEsubjects(serverResponse, serverResponseAS, 'as');

      }
    }

    if (serverResponseGB.length > 0 && serverResponseGB !== 'INVALID REQUEST') {
      if (serverResponse.length === 0) {
        await serverResponseGB.forEach((item) => {
          serverResponse.push(item);
        });
      } else {
        // console.log('in 8');
        serverResponse = await combineTHEsubjects(serverResponse, serverResponseGB, 'gb');

      }
    }

    if (serverResponseES.length > 0 && serverResponseES !== 'INVALID REQUEST') {
      if (serverResponse.length === 0) {
        await serverResponseES.forEach((item) => {
          serverResponse.push(item);
        });
      } else {
        // console.log('in 9');
        serverResponse = await combineTHEsubjects(serverResponse, serverResponseES, 'es');

      }
    }

    if (serverResponseFS.length > 0 && serverResponseFS !== 'INVALID REQUEST') {
      if (serverResponse.length === 0) {
        await serverResponseFS.forEach((item) => {
          serverResponse.push(item);
        });
      } else {
        // console.log('in 10');
        serverResponse = await combineTHEsubjects(serverResponse, serverResponseFS, 'fs');

      }
    }

    if (serverResponseIP.length > 0 && serverResponseIP !== 'INVALID REQUEST') {
      if (serverResponse.length === 0) {
        await serverResponseIP.forEach((item) => {
          serverResponse.push(item);
        });
      } else {
        // console.log('in 11');
        serverResponse = await combineTHEsubjects(serverResponse, serverResponseIP, 'ip');

      }
    }

    if (serverResponseHB.length > 0 && serverResponseHB !== 'INVALID REQUEST') {
      if (serverResponse.length === 0) {
        await serverResponseHB.forEach((item) => {
          serverResponse.push(item);
        });
      } else {
        // console.log('in 12');
        serverResponse = await combineTHEsubjects(serverResponse, serverResponseHB, 'hb');

      }
    }

    if (serverResponseHG.length > 0 && serverResponseHG !== 'INVALID REQUEST') {
      if (serverResponse.length === 0) {
        await serverResponseHG.forEach((item) => {
          serverResponse.push(item);
        });
      } else {
        // console.log('in 13');
        serverResponse = await combineTHEsubjects(serverResponse, serverResponseHG, 'hg');

      }
    }

    if (serverResponseSG.length > 0 && serverResponseSG !== 'INVALID REQUEST') {
      if (serverResponse.length === 0) {
        await serverResponseSG.forEach((item) => {
          serverResponse.push(item);
        });
      } else {
        // console.log('in 14');
        serverResponse = await combineTHEsubjects(serverResponse, serverResponseSG, 'sg');

      }
    }

    if (serverResponseBG.length > 0 && serverResponseBG !== 'INVALID REQUEST') {
      if (serverResponse.length === 0) {
        await serverResponseBG.forEach((item) => {
          serverResponse.push(item);
        });
      } else {
        // console.log('in 15');
        serverResponse = await combineTHEsubjects(serverResponse, serverResponseBG, 'bg');

      }
    }

    if (serverResponseRM.length > 0 && serverResponseRM !== 'INVALID REQUEST') {
      if (serverResponse.length === 0) {
        await serverResponseRM.forEach((item) => {
          serverResponse.push(item);
        });
      } else {
        // console.log('in 16');
        serverResponse = await combineTHEsubjects(serverResponse, serverResponseRM, 'rm');

      }
    }

    if (serverResponsePT.length > 0 && serverResponsePT !== 'INVALID REQUEST') {
      if (serverResponse.length === 0) {
        await serverResponsePT.forEach((item) => {
          serverResponse.push(item);
        });
      } else {
        // console.log('in 17');
        serverResponse = await combineTHEsubjects(serverResponse, serverResponsePT, 'pt');

      }
    }

    await serverResponse;

    if (serverResponse.length === 0) {
      return 'INVALID REQUEST';
    } else {
      return serverResponse;
    }

  };

  return ckpProcessor().then((message) => {
    console.log("\n#### response sent to client ####\n");
    return message;
  }, (e) => {
    console.log("ERROR@ckpProcessor:", e);
    return e;
  });
}

// 0,1 // route 1 - Admin - For Calculating the cost
app.get('/ckp1/:id', authenticate, async (req, res) => {

  // RBAC
  if (req.user.role === 2) {
    res.status(418).send();
    return;
  }

  ckpFunc(req.params.id).then((ckpAns) => {
    if (ckpAns === 'INVALID REQUEST') {
      res.status(406).send(ckpAns);
    } else if (Array.isArray(ckpAns)) {
      res.status(200).send(ckpAns);
    } else {
      res.status(500).send(ckpAns);
    }
  }, (e) => {
    console.log("ERROR@ckp1:", e);
    res.status(500).send(e);
  });

});

// 2 // route 2 - Sales - For Calculating the cost
app.get('/ckp2/:id', authenticate, async (req, res) => {

  ckpFunc(req.params.id).then((ckpAns) => {
    if (ckpAns === 'INVALID REQUEST') {
      res.status(406).send(ckpAns);
    } else if (Array.isArray(ckpAns)) {
      let ckpAnsLess = [];
      ckpAnsLess.push(Math.round(ckpAns[0]));
      ckpAnsLess.push(Math.round(ckpAns[1]));
      res.status(200).send(ckpAnsLess);
    } else {
      res.status(500).send(ckpAns);
    }
  }, (e) => {
    console.log("ERROR@ckp1:", e);
    res.status(500).send(e);
  });

});

// 0,1 // route 3 - Admin - for saving the proposal ---------------------------------- PART 1
app.post('/ckp1/save', authenticate, async (req, res) => {

  // RBAC
  if (req.user.role === 2) {
    res.status(418).send();
    return;
  }

  let cdata = req.body;

  // console.log("body:", cdata);

  let data = '';
  await Object.keys(cdata).forEach(key => {
    // console.log("\nKey:", key);
    data += key;
  });

  await Object.values(cdata).forEach(value => {
    // console.log("\nValue:", value);
    data += value;
  });

  // console.log("\n\n\nData:", data);

  let pageArray = JSON.parse(data.split('???')[0]);
  let bomArray = JSON.parse(data.split('???')[1]);
  let packingListArray = JSON.parse(data.split('???')[2]);

  let timestamp = new Date().toLocaleString();
  timestamp = timestamp.split('/').join('-');
  timestamp = timestamp.split(' ').join('');
  timestamp = timestamp.split(',').join('-');

  let sDocName;
  let cDocName = pageArray[0];
  let cDocNameSplit = cDocName.split('@');
  if (cDocNameSplit.length > 1) {
    let version = cDocNameSplit[1].split('#');
    sDocName = `${cDocNameSplit[0]}@${timestamp}#${version[1]}`;
  } else {
    sDocName = `${pageArray[0]}---${req.user.fName}@${timestamp}`;
  }

  let proposal = new Proposal({
    userID: req.user._id,
    name: sDocName,
    type: 'PROPOSAL',
    bActual: pageArray[1],
    bLower: pageArray[2],
    bUpper: pageArray[3],
    fActual: pageArray[4],
    fLower: pageArray[5],
    fUpper: pageArray[6],
    searchBox: pageArray[7],
    institution: pageArray[8],
    instructor: pageArray[9],
    pNumber: pageArray[10],
    pDescription: pageArray[11],
    estimate: pageArray[12],
    uPrice: pageArray[13],
    uShip: pageArray[14],
    txt: pageArray[15],
    notes: pageArray[16],
    proposalDOC: `proposal_${sDocName}.pdf`,
    bomCSV: `bom_${sDocName}.csv`,
    packingCSV: `packingList_${sDocName}.csv`
  });

  // console.log("\n\npageArray:", pageArray);
  // console.log("\n\nbomArray:", bomArray);
  // console.log("\n\npackingListArray:", packingListArray);

  proposal.save().then((doc) => {
    // console.log("Proposal details were saved successfully");

    // BOM FILE
    // let fileBOM = fs.createWriteStream(`bom_${pageArray[0]}---${req.user.fName}@${timestamp}.csv`);
    let fileBOM = fs.createWriteStream(bomFileServer + `bom_${sDocName}.csv`);

    fileBOM.on('error', function (err) {
      /* error handling */
      console.log("error@fileIOBOM4admin");
    });
    bomArray.forEach(function (v) {
      fileBOM.write(v + '\n');
    });
    fileBOM.end();
    // BOM FILE

    // PackingList FILE
    // let filePackingList = fs.createWriteStream(`packingList_${pageArray[0]}---${req.user.fName}@${timestamp}.csv`);
    let filePackingList = fs.createWriteStream(packingFileServer + `packingList_${sDocName}.csv`);

    filePackingList.on('error', function (err) {
      /* error handling */
      console.log("error@fileIOpackingListArray");
    });
    packingListArray.forEach(function (v) {
      filePackingList.write(v + '\n');
    });
    filePackingList.end();
    // PackingList FILE

    res.status(200).send(doc._id); // this encourages the client the send the cost and removed list to another endpoint

  }, (e) => {
    res.status(500).send(e);
    console.log('error@Proposal:', e);
  });

});

// for savePartial. This sleep function is used to wait for one second after both temp1, temp2 have been saved. this ensure the files are properly written to disk
function sleep(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}

// 0,1 // route 4 - Admin - for saving the proposal ---------------------------------- PART 2
app.post('/ckp1/savePartial', authenticate, async (req, res) => {

  // RBAC
  if (req.user.role === 2) {
    res.status(418).send();
    return;
  }

  let cdata = req.body;

  // console.log("body:", cdata);

  const update = {
    costContents: JSON.parse(cdata.pCost),
    removedContents: JSON.parse(cdata.prCost)
  };

  Proposal.findByIdAndUpdate(mongoose.Types.ObjectId(JSON.parse(cdata._id)), {
    $set: update
  }, {
      new: true
    }).then(async (prop) => {
      // res.send(prop._id);

      let pdfDocDynamic = printer.createPdfKitDocument(docDefinition.generateDocDef(req, prop));
      pdfDocDynamic.pipe(fs.createWriteStream(`temp2-${prop.proposalDOC}`));
      pdfDocDynamic.end();

      let timestamp = new Date();
      // "":"",
      let pdfFillable = pdfFillForm.writeSync('proposal_template.pdf',
        {
          "proposalBy": "eScience Labs Proposal by:",
          "proposer": `${req.user.fName} ${req.user.lName}, ${req.user.desig}`,
          "proposerContact": `888-ESL KITS | ${req.user.email}`,
          "proposalDate": `${timestamp.getMonth() + 1}/${timestamp.getDate()}/${timestamp.getFullYear()}`,
          "proposalInstitution": `${prop.institution}`,
          "proposalInstructor": `${prop.instructor}`,
          "productNumber": `${prop.pNumber}`,
          "productDescription": `${prop.pDescription}`,
          "productEnrollment": `${prop.estimate}`,
          "unitPrice": `${prop.uPrice}`,
          "shippingPrice": `${prop.uShip}`,
        }, { "save": "pdf" });
      fs.writeFileSync(`temp1-${prop.proposalDOC}`, pdfFillable);

      await sleep(1000);

      const pdfDocFinal = new HummusRecipe(`temp1-${prop.proposalDOC}`, `${proposalFileServer}${prop.proposalDOC}`);
      // let pd = `temp2-${prop.proposalDOC}`;
      const pdfStatic = `temp2-${prop.proposalDOC}`; //`temp2-${prop.proposalDOC}`
      pdfDocFinal.appendPage(pdfStatic).endPDF();

      let ProposalDOCStream = fs.readFileSync(`${proposalFileServer}${prop.proposalDOC}`, {
        encoding: 'base64'
      });
      // let download = new Buffer(ProposalDOCStream).toString('base64');
      // We replaced all the event handlers with a simple call to readStream.pipe()
      // ProposalDOCStream.pipe(res);      

      const download = Buffer.from(ProposalDOCStream.toString('utf-8'), 'base64');

      res.writeHead(200, {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `${prop.proposalDOC}`
      });

      res.end(JSON.stringify(download));

      fs.unlinkSync(`temp1-${prop.proposalDOC}`);
      fs.unlinkSync(`temp2-${prop.proposalDOC}`);

    }).catch((e) => {
      console.log(e);
      res.status(500).send(e);
    });

});

// 2 // route 5 - Sales - for saving the proposal  ------------------------------------------------------------------------------------------
app.post('/ckp2/save', authenticate, async (req, res) => {

  // call the ckpFunc() from this endpoint, get the results. Process the results to generate the proposal pdf, bom, packing list and save it in mongoDB.
  // After saving send the pdf in base64 format

  let cdata = req.body;

  let pageArray = JSON.parse(cdata.sSOP);
  // console.log("\nsop:", pageArray);

  let timestamp = new Date().toLocaleString();
  timestamp = timestamp.split('/').join('-');
  timestamp = timestamp.split(' ').join('');
  timestamp = timestamp.split(',').join('-');

  let sDocName;
  let cDocName = pageArray[1];
  let cDocNameSplit = cDocName.split('@');
  if (cDocNameSplit.length > 1) {
    let version = cDocNameSplit[1].split('#');
    sDocName = `${cDocNameSplit[0]}@${timestamp}#${version[1]}`;
  } else {
    sDocName = `${pageArray[1]}---${req.user.fName}@${timestamp}`;
  }

  let proposal = new Proposal({
    userID: req.user._id,
    name: sDocName,
    type: 'PROPOSAL',
    bLower: pageArray[2],
    bUpper: pageArray[3],
    institution: pageArray[4],
    instructor: pageArray[5],
    pNumber: pageArray[6],
    pDescription: pageArray[7],
    estimate: pageArray[8],
    uPrice: pageArray[9],
    uShip: pageArray[10],
    txt: pageArray[11],
    notes: pageArray[12],
    proposalDOC: `proposal_${sDocName}.pdf`,
    bomCSV: `bom_${sDocName}.csv`,
    packingCSV: `packingList_${sDocName}.csv`
  });

  proposal.save().then(async (prop) => {

    let isFresh = pageArray[0];
    // console.log('isFresh:', isFresh);
    if (isFresh.split('!')[0] === '0') {
      let refProposal = isFresh.split('!')[1];

      Proposal.find({
        name: refProposal
      }).then((valid) => {
        const update = {
          bomCSV: valid[0].bomCSV,
          packingCSV: valid[0].packingCSV
        };

        Proposal.findByIdAndUpdate(prop._id, {
          $set: update
        }, {
            new: true
          }).catch((e) => {
            console.log(e);
            res.status(500).send(e);
          });
      }).catch((e) => {
        console.log(e);
      });

    } else {

      let ckpAns;
      await ckpFunc(prop.txt).then((funcAns) => {
        if (funcAns === 'INVALID REQUEST') {
          res.status(406).send(ckpAns);
        } else {
          ckpAns = funcAns;
        }
      }, (e) => {
        console.log("ERROR@ckp2SAVE:", e);
        res.status(500).send(e);
      });

      // console.log('ckpAns:', ckpAns[4]);
      // let dependencyTree = ckpAns[4].filter(function (item){
      //   return (item.idName.toUpperCase().startsWith("EQUP") || item.idName.toUpperCase().startsWith("CHEM") || item.idName.toUpperCase().startsWith("SHIP"));
      // });
      // console.log('ckpAns:', dependencyTree);

      let dependencyTree = ckpAns[4];

      let bomArrayEqup = ckpAns[3].filter(function (equpItem) {
        return (equpItem.idName.toUpperCase().startsWith("EQUP") || equpItem.idName.toUpperCase().startsWith("CHEM") || equpItem.idName.toUpperCase().startsWith("SHIP"));
      });

      let bomArrayModl = ckpAns[3].filter(function (modlItem) {
        return !(modlItem.idName.toUpperCase().startsWith("EQUP") || modlItem.idName.toUpperCase().startsWith("CHEM") || modlItem.idName.toUpperCase().startsWith("SHIP"));
      });

      // BOM FILE
      // let fileBOM = fs.createWriteStream(`bom_${pageArray[0]}---${req.user.fName}@${timestamp}.csv`);
      let fileBOM = fs.createWriteStream(bomFileServer + `bom_${sDocName}.csv`);

      fileBOM.on('error', function (err) {
        /* error handling */
        console.log("error@fileIOBOM4sales");
      });
      await bomArrayEqup.forEach(function (v) {
        fileBOM.write(`${v.idName};${v.qty}` + '\n');
      });
      await bomArrayModl.forEach(function (v) {
        fileBOM.write(`${v.idName};${v.qty}` + '\n');
      });
      fileBOM.end();
      // BOM FILE

      // PackingList FILE
      let filePackingList = fs.createWriteStream(packingFileServer + `packingList_${sDocName}.csv`);

      filePackingList.on('error', function (err) {
        /* error handling */
        console.log("error@fileIOpackingListArray4sales");
      });
      filePackingList.write('Item;Name;Lab;Quantity;Price' + '\n');

      let pCounter = 1;
      await bomArrayEqup.forEach(function (v) {
        let dependency = dependencyTree.filter(function (item) {
          return v.idName === item.idName;
        });
        filePackingList.write(`${pCounter++}-${v.idName};${dependency[0].displayName};${dependency[0].lab === undefined ? 'undefined' : dependency[0].lab};${dependency[0].qty};${dependency[0].averageCost}` + '\n');
      });

      async function modlPack(bomArrayModl, dependencyTree, id) {
        if (Object.keys(bomArrayModl[0]).length === 1) {
          await bomArrayModl.forEach(function (v) {
            let dependency = dependencyTree.filter(function (item) {
              return v.idName === item.idName;
            });

            let insidePcounter = 1
            filePackingList.write(`${pCounter}.${id}-${v.idName};${dependency[0].displayName};${dependency[0].lab === undefined ? 'undefined' : dependency[0].lab};1;NULL` + '\n');

            dependency.forEach(async (item) => {
              if (item.memItem.toUpperCase().startsWith('BAG') || item.memItem.toUpperCase().startsWith('BTTL') || item.memItem.toUpperCase().startsWith('MODL')) {
                let arrayItem = [];
                arrayItem.push({ 'idName': item.memItem });
                modlPack(arrayItem, dependencyTree, insidePcounter++);
              } else {
                filePackingList.write(`${pCounter}.${id}.${insidePcounter++}-${item.memItem};${item.memDisplayName};NULL;${item.memQuantity};${item.averageCost}` + '\n');
              }
            });
          });
        } else {
          await bomArrayModl.forEach(function (v) {
            let dependency = dependencyTree.filter(function (item) {
              return v.idName === item.idName;
            });
            // console.log('v:', v);
            // console.log('dependency:',dependency);
            filePackingList.write(`${pCounter}-${v.idName};${dependency[0].displayName};${dependency[0].lab === undefined ? 'undefined' : dependency[0].lab};1;NULL` + '\n');
            let insidePcounter = 1
            dependency.forEach(async (item) => {
              if (item.memItem.toUpperCase().startsWith('BAG') || item.memItem.toUpperCase().startsWith('BTTL') || item.memItem.toUpperCase().startsWith('MODL')) {
                let arrayItem = [];
                arrayItem.push({ 'idName': item.memItem });
                modlPack(arrayItem, dependencyTree, insidePcounter++);
              } else {
                filePackingList.write(`${pCounter}.${insidePcounter++}-${item.memItem};${item.memDisplayName};NULL;${item.memQuantity};${item.averageCost}` + '\n');
              }
            });
            pCounter++;
          });
        }
      }

      modlPack(bomArrayModl, dependencyTree, 0);

      filePackingList.end();
      // PackingList FILE

    }

    // PROPOSAL PDF
    let pdfDocDynamic = printer.createPdfKitDocument(docDefinition.generateDocDef(req, prop));
    pdfDocDynamic.pipe(fs.createWriteStream(`temp2-${prop.proposalDOC}`));
    pdfDocDynamic.end();

    let timestamp2 = new Date();
    // "":"",
    let pdfFillable = pdfFillForm.writeSync('proposal_template.pdf',
      {
        "proposalBy": "eScience Labs Proposal by:",
        "proposer": `${req.user.fName} ${req.user.lName}, ${req.user.desig}`,
        "proposerContact": `888-ESL KITS | ${req.user.email}`,
        "proposalDate": `${timestamp2.getMonth() + 1}/${timestamp2.getDate()}/${timestamp2.getFullYear()}`,
        "proposalInstitution": `${prop.institution}`,
        "proposalInstructor": `${prop.instructor}`,
        "productNumber": `${prop.pNumber}`,
        "productDescription": `${prop.pDescription}`,
        "productEnrollment": `${prop.estimate}`,
        "unitPrice": `${prop.uPrice}`,
        "shippingPrice": `${prop.uShip}`,
      }, { "save": "pdf" });
    fs.writeFileSync(`temp1-${prop.proposalDOC}`, pdfFillable);

    await sleep(1000);

    const pdfDocFinal = new HummusRecipe(`temp1-${prop.proposalDOC}`, `${proposalFileServer}${prop.proposalDOC}`);
    // let pd = `temp2-${prop.proposalDOC}`;
    const pdfStatic = `temp2-${prop.proposalDOC}`; //`temp2-${prop.proposalDOC}`
    pdfDocFinal.appendPage(pdfStatic).endPDF();

    let ProposalDOCStream = fs.readFileSync(`${proposalFileServer}${prop.proposalDOC}`, {
      encoding: 'base64'
    });

    const download = Buffer.from(ProposalDOCStream.toString('utf-8'), 'base64');

    res.writeHead(200, {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `${prop.proposalDOC}`
    });

    res.end(JSON.stringify(download));

    fs.unlinkSync(`temp1-${prop.proposalDOC}`);
    fs.unlinkSync(`temp2-${prop.proposalDOC}`);

  }, (e) => {
    res.status(500).send(e);
    console.log('error@ProposalSaveSales:', e);
  });

});

// 0,1 // route 6 - Admin - for saving the draft
app.post('/ckp1/draft', authenticate, async (req, res) => {

  // RBAC
  if (req.user.role === 2) {
    res.status(418).send();
    return;
  }

  let cdata = req.body;

  // console.log("\nbody:", cdata);

  // console.log("\nsop:", cdata.dSOP);
  // console.log("\ncost:", cdata.dCost);
  // console.log("\nremoved:", cdata.drCost);

  let sop = JSON.parse(cdata.dSOP);
  let cost = JSON.parse(cdata.dCost);
  let removed = JSON.parse(cdata.drCost);

  let timestamp = new Date().toLocaleString();
  timestamp = timestamp.split('/').join('-');
  timestamp = timestamp.split(' ').join('');
  timestamp = timestamp.split(',').join('-');

  let sDocName;
  let cDocName = sop[0];
  let cDocNameSplit = cDocName.split('@');
  if (cDocNameSplit.length > 1) {
    let version = cDocNameSplit[1].split('#');
    sDocName = `${cDocNameSplit[0]}@${timestamp}#${version[1]}`;
  } else {
    sDocName = `${sop[0]}---${req.user.fName}@${timestamp}`;
  }

  let draft = new Draft({
    userID: req.user._id,
    name: sDocName,
    type: 'DRAFT',
    bActual: sop[1],
    bLower: sop[2],
    bUpper: sop[3],
    fActual: sop[4],
    fLower: sop[5],
    fUpper: sop[6],
    searchBox: sop[7],
    institution: sop[8],
    instructor: sop[9],
    pNumber: sop[10],
    pDescription: sop[11],
    estimate: sop[12],
    uPrice: sop[13],
    uShip: sop[14],
    txt: sop[15],
    notes: sop[16],
    costContents: cost,
    removedContents: removed
  });

  // draft.removeDraftByID(req.user_id).then(() => {
  //   draft.save().then((doc) => {
  //     res.status(200).send("The details were saved successfully");
  //   }, (e) => {
  //     res.status(400).send(e);
  //   });
  // }, () => {
  //   res.status(400).send();
  // });

  // delete and save new one - SINGLE DRAFT ONE USER
  // let dstatus = Draft.findOneAndDelete({ userID: req.user._id }).then((dup) => {
  //   draft.save().then((doc) => {
  //     res.status(200).send("The details were saved successfully");
  //   }, (e) => {
  //     res.status(400).send(e);
  //   });
  // }).catch((e) => {
  //   res.status(500).send(e);
  // });

  // save the draft - MULTIPLE DRAFT ONE USER
  draft.save().then((doc) => {
    res.status(200).send("The details were saved successfully");
  }, (e) => {
    res.status(400).send(e);
  });


  // draft.save().then((doc) => {
  //   res.status(200).send("The details were saved successfully");
  // }, (e) => {
  //   res.status(400).send(e);
  // });

});

// 2 // route 7 - Sales - for saving the draft  ---------------------------------------------------------------------------------------------
app.post('/ckp2/draft', authenticate, async (req, res) => {

  let cdata = req.body;

  // console.log("\nbody:", cdata);

  // console.log("\nsop:", cdata.dSOP);
  // console.log("\ncost:", cdata.dCost);
  // console.log("\nremoved:", cdata.drCost);

  let sop = JSON.parse(cdata.dSOP);

  // console.log("\nsop:", sop);

  let timestamp = new Date().toLocaleString();
  timestamp = timestamp.split('/').join('-');
  timestamp = timestamp.split(' ').join('');
  timestamp = timestamp.split(',').join('-');

  let sDocName;
  let cDocName = sop[0];
  let cDocNameSplit = cDocName.split('@');
  if (cDocNameSplit.length > 1) {
    let version = cDocNameSplit[1].split('#');
    sDocName = `${cDocNameSplit[0]}@${timestamp}#${version[1]}`;
  } else {
    sDocName = `${sop[0]}---${req.user.fName}@${timestamp}`;
  }

  let draft = new Draft({
    userID: req.user._id,
    name: sDocName,
    type: 'DRAFT',
    bLower: sop[1],
    bUpper: sop[2],
    institution: sop[3],
    instructor: sop[4],
    pNumber: sop[5],
    pDescription: sop[6],
    estimate: sop[7],
    uPrice: sop[8],
    uShip: sop[9],
    txt: sop[10],
    notes: sop[11],
    isPending: sop[12]
  });

  // console.log("\ndraft:", draft);

  // save the draft - MULTIPLE DRAFT ONE USER
  draft.save().then((doc) => {
    res.status(200).send("The details were saved successfully");
    // console.log('saved doc:', doc);
  }, (e) => {
    res.status(400).send(e);
  });

});

// 0,1,2 // route 8 - Admin & Sales - for getting the proposals - SELF Route
app.get('/ckp/selfSave', authenticate, async (req, res) => {

  Proposal.find({
    userID: req.user._id
  }).then((dup) => {
    if (dup.length > 0) {
      // let dupArray = [];
      // dupArray.push(dup);
      res.status(200).send(dup);
    } else {
      res.status(204).send();
    }
  }, (e) => {
    res.status(500).send(e);
  });

});

// 0,1,2 // route 9 - Admin & Sales - for getting the draft - SELF Route
app.get('/ckp/selfDraft', authenticate, async (req, res) => {

  Draft.find({
    userID: req.user._id
  }).then((dup) => {
    if (dup.length > 0) {
      // let dupArray = [];
      // dupArray.push(dup);
      res.status(200).send(dup);
    } else {
      res.status(204).send();
    }
  }, (e) => {
    res.status(500).send(e);
  });

});

// 0,1,2 // route 10 - Admin & Sales - for getting the proposals - OTHERS Route
app.get('/ckp/otherSave', authenticate, async (req, res) => {

  Proposal.find({
    userID: {
      $ne: req.user._id
    }
  }).then((dup) => {
    if (dup.length > 0) {
      // let dupArray = [];
      // dupArray.push(dup);
      res.status(200).send(dup);
    } else {
      res.status(204).send();
    }
  }, (e) => {
    res.status(500).send(e);
  });

});

// 0,1,2 // route 11 - Admin & Sales - for getting the draft - OTHERS Route
app.get('/ckp/otherDraft', authenticate, async (req, res) => {

  Draft.find({
    userID: {
      $ne: req.user._id
    }
  }).then((dup) => {
    if (dup.length > 0) {
      // let dupArray = [];
      // dupArray.push(dup);
      res.status(200).send(dup);
    } else {
      res.status(204).send();
    }
  }, (e) => {
    res.status(500).send(e);
  });

});

// 0,1 // route 12 - SuperAdmin & Admin - for Searching the inventory database
app.post('/ckpSearch', authenticate, async (req, res) => {

  // RBAC
  if (req.user.role === 2) {
    res.status(418).send();
    return;
  }

  let searchQuery = `SELECT idName, displayName, averageCost FROM netsuite.allItems Where displayName LIKE '%${req.body.search}%' and idName LIKE 'e%';`;
  connection.query(searchQuery, function (err, result, fields) {
    // if (err) throw err;
    if (result) {
      res.status(200).send(result);
    } else {
      console.log("error@ckpSearch");
      res.status(500);
    }
  });

});

// 0,1 // route 13 - SuperAdmin & Admin - for SQL QUERY RUNNER used to update the cost
app.post('/ckpSQL', authenticate, async (req, res) => {

  // RBAC
  if (req.user.role === 2) {
    res.status(418).send();
    return;
  }

  connection.query(req.body.query, function (err, result, fields) {
    // if (err) throw err;

    if (result) {
      res.status(200).send(result);
    } else {
      console.log("error@ckpSQL");
      res.status(404).send();
    }
  });

});

// * // route 14 - All Users - for Getting the Proposal PDF Document
app.get('/ckpPDF/:id', authenticate, async (req, res) => {

  let id = req.params.id;
  // console.log("ID:", id);

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  let ProposalDOC;
  Proposal.find({
    _id: id
  }).then((dup) => {
    if (dup.length > 0) {

      ProposalDOC = dup[0].proposalDOC;
      // console.log('ProposalDOC:', dup);

      let ProposalDOCPath = path.join(proposalFileServer, `${ProposalDOC}`);

      let ProposalDOCStream = fs.readFileSync(ProposalDOCPath, {
        encoding: 'base64'
      });
      // let download = new Buffer(ProposalDOCStream).toString('base64');
      // We replaced all the event handlers with a simple call to readStream.pipe()
      // ProposalDOCStream.pipe(res);      

      const download = Buffer.from(ProposalDOCStream.toString('utf-8'), 'base64');

      res.writeHead(200, {
        'Content-Type': 'application/pdf',
        'Content-Disposition': ProposalDOC
      });

      // console.log('downloadType:', typeof(download));
      // console.log('downloadSize:', download.length);
      // console.log('download:', download);

      res.end(JSON.stringify(download));

    } else {
      res.status(204).send();
    }
  }, (e) => {
    res.status(500).send(e);
  });

});

// 0,1,2 // route 15 - Admin & Sales - for verifying the legitimacy of the proposal name
app.get('/ckp/verifyProposal/:name', authenticate, async (req, res) => {

  let name = req.params.name;

  Proposal.find().then((dup) => {
    let present = 0;
    let version = 0;
    if (dup.length > 0) {

      dup.forEach((prop) => {
        // new
        if (prop.name.split('---')[0] === name) {
          present = -1;
          version = -1;
          // old
        } else if (prop.name.split('---')[0] === name.split('---')[0]) {
          present = 1;
          let vString = prop.name.split('#');
          if (vString.length > 1) {
            if (version < parseInt(vString[vString.length - 1].substr(1))) {
              version = vString[vString.length - 1].substr(1);
            }
          }
        }
      });

      // console.log('response:', `${present}/${version}`);
      res.status(200).send(JSON.stringify(`${present}/${version}/${req.user._id}`));
    } else {
      res.status(200).send(JSON.stringify(`${present}/${version}/${req.user._id}`));
    }
  }, (e) => {
    res.status(500).send(e);
  });

});

// 0,1,2 // route 16 - Admin & Sales - for verifying the legitimacy of the draft name
app.get('/ckp/verifyDraft/:name', authenticate, async (req, res) => {

  let name = req.params.name;

  Draft.find().then((dup) => {
    let present = 0;
    let version = 0;
    if (dup.length > 0) {

      dup.forEach((prop) => {
        // new
        if (prop.name.split('---')[0] === name) {
          present = -1;
          version = -1;
          // old
        } else if (prop.name.split('---')[0] === name.split('---')[0]) {
          present = 1;
          let vString = prop.name.split('#');
          if (vString.length > 1) {
            if (version < parseInt(vString[vString.length - 1].substr(1))) {
              version = vString[vString.length - 1].substr(1);
            }
          }
        }
      });

      // console.log('response:', `${present}/${version}`);
      res.status(200).send(JSON.stringify(`${present}/${version}/${req.user._id}`));
    } else {
      // console.log('response:', `${present}/${version}`);
      res.status(200).send(JSON.stringify(`${present}/${version}/${req.user._id}`));
    }
  }, (e) => {
    res.status(500).send(e);
  });

});

// 0,1,2 // route 16 - Admin & Sales - for verifying the legitimacy of the draft name
app.get('/switch', authenticate, async (req, res) => {

  // RBAC
  if (req.user.role === 2) {
    res.status(418).send();
    return;
  }

  let update;
  if (req.user.currentRole === 1) {
    update = {
      currentRole: 2
    };
  } else {
    update = {
      currentRole: 1
    };
  }

  User.findByIdAndUpdate(req.user._id, {
    $set: update
  }, {
      new: true
    }).then((user) => {
      if (!user) {
        return res.status(404).send();
      }
      res.status(200).send({
        user
      });
    }).catch((e) => {
      console.log(e);
      res.status(500).send(e);
    });

});

// ************************************************ Custom Kit Pricing Usage ******************************************************* //

// ROUTES //

// STARTING APP ON SPECIFIED PORT //

app.listen(port, () => {
  console.log(`CKP Server Running on port ${port}`);
});

// STARTING APP ON SPECIFIED PORT //

// DATABASE CONNECTION CLOSE() //

// connection.end(function(err) {
//   if (err) {
//     return console.log('error:' + err.message);
//   }
//   console.log('Close the database connection.');
// });

module.exports = {
  app
};