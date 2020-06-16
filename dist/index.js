// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"constants/tax.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Tax = void 0;
const Tax = {
  "Book": {
    name: "Book",
    taxes: [{
      min: 0,
      value: 0
    }]
  },
  "Clothes": {
    name: "Clothes",
    taxes: [{
      min: 0,
      value: 5,
      max: 999
    }, {
      min: 1000,
      value: 12
    }]
  },
  "Food": {
    name: "Food",
    taxes: [{
      min: 0,
      value: 5
    }]
  },
  "Imported": {
    name: "Imported",
    taxes: [{
      min: 0,
      value: 18
    }]
  },
  "Medicine": {
    name: "Medicine",
    taxes: [{
      min: 0,
      value: 5
    }]
  },
  "Music": {
    name: "Music",
    taxes: [{
      min: 0,
      value: 3
    }]
  },
  "Total": {
    name: "Total",
    discounts: [{
      min: 2000,
      value: 5
    }]
  }
};
exports.Tax = Tax;
},{}],"controller/createBill.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createBill;

var _tax = require("../constants/tax");

var _async = _interopRequireDefault(require("async"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createBill(req, res) {
  try {
    let items = req.body.items;
    let bill = {
      dateOfPurchase: new Date(),
      timeOfPurchase: new Date(),
      discount: 0,
      totalAmount: 0
    };

    _async.default.each(items, (item, cb) => {
      try {
        item["priceBeforeTax"] = item.quantity * item.price;
        let taxCategory = _tax.Tax[item.itemCategory];
        taxCategory.taxes.every((taxSlab, i) => {
          if (item["priceBeforeTax"] >= taxSlab.min) {
            if (taxSlab.max) {
              if (item["priceBeforeTax"] <= taxSlab.max) {
                item["tax"] = parseFloat((item["priceBeforeTax"] * taxSlab.value / 100).toFixed(2));
                item["finalPrice"] = item["priceBeforeTax"] + item["tax"];
                bill.totalAmount = item["finalPrice"];
                return false;
              }
            } else {
              item["tax"] = parseFloat((item["priceBeforeTax"] * taxSlab.value / 100).toFixed(2));
              item["finalPrice"] = item["priceBeforeTax"] + item["tax"];
              bill.totalAmount += item["finalPrice"];
              return false;
            }
          }

          return true;
        });
        cb();
      } catch (e) {
        cb(e);
      }
    }, err => {
      if (err) {
        console.log("Error occured while creating bill : ", err);
        res.status(500).json("Error in creating bill");
      }
    });
    /* Using Promises
    calculateBill(item) {
        return new Promise((resolve, reject) => {
            resolve(item)
            reject({message: , error})
        })
    }
    calculatediscount() {
        Tax["total"]
        resolve(bill)
     }
     Promise.all([calculateBill(0), calculateBill(1)])
        .then(results => {
            if (results && results.length) {
                results[0] = item[0]
            }
            bill.items.push(results[i])
            return calculatediscount(bill)
        })
        .then(bill => {
            res.status(200).json(bill)
        })
        .catch(e => {
            console.log()
            res.status(500).json({message: })
        })
    
    */


    bill["items"] = items;

    if (_tax.Tax["Total"] && _tax.Tax["Total"].discounts && _tax.Tax["Total"].discounts.length) {
      _tax.Tax["Total"].discounts.every((discountSlab, i) => {
        if (bill["totalAmount"] >= discountSlab.min) {
          if (discountSlab.max) {
            if (discountSlab.max >= bill["totalAmount"]) {
              bill["discount"] = parseFloat((bill["totalAmount"] * discountSlab.value / 100).toFixed(2));
              bill.totalAmount = bill.totalAmount - bill["discount"];
              return false;
            }
          } else {
            bill["discount"] = parseFloat((bill["totalAmount"] * discountSlab.value / 100).toFixed(2));
            bill.totalAmount = bill.totalAmount - bill["discount"];
            return false;
          }
        }

        return true;
      });
    }

    res.status(200).json(bill);
  } catch (e) {
    console.log("Error occured while creating bill : ", e);
    res.status(500).json("Error in creating bill");
  }
}
},{"../constants/tax":"constants/tax.js"}],"controller/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "createBill", {
  enumerable: true,
  get: function () {
    return _createBill.default;
  }
});

var _createBill = _interopRequireDefault(require("./createBill"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
},{"./createBill":"controller/createBill.js"}],"app.js":[function(require,module,exports) {
"use strict";

var _controller = require("./controller");

const express = require('express');

const app = express();

const bodyParser = require('body-parser');

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <title>A JavaScript project</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body>
  <h1>A JavaScript project</h1>
</body>
</html>`;
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.get('/', (req, res) => {
  res.set('Content-Type', 'text/html');
  res.status(200).send(html);
});
app.post("/api/create_bill", _controller.createBill);
module.exports = app;
},{"./controller":"controller/index.js"}],"index.js":[function(require,module,exports) {
const app = require('./app');

const port = '8888';
app.listen(port, () => {
  console.log(`Server is listening on port ${port}...`);
});
},{"./app":"app.js"}]},{},["index.js"], null)
//# sourceMappingURL=/index.js.map