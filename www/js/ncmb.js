// This is a JavaScript file

var DB_apikey = "1d9ecfbf5357f17f28ac75657ad02d36b7d9d4906e2a6f62a7c2022a079cff28";
var DB_clientkey = "3399c8201142519f65329a7ed6c1bdd396deb1f7b96d23d77c3575facf6490a3";
var ncmb = new NCMB(DB_apikey, DB_clientkey);

var DB_Goods = ncmb.DataStore("Goods");
var DB_OrderLog = ncmb.DataStore("OrderLog");
var DB_Galley = ncmb.DataStore("Galley");

// 登録時の引数の順番は各テーブル以下の配列の順番に合わせてください
var DB_GoodsAttributes = ["galleyMode", "inStock", "goodsName", "price", "isNewest"];
var DB_OrderLogAttributes = ["orderLogId", "goodsObjectId", "number", "price"];
var DB_GalleyAttributes = ["orderLogId", "goodsObjectId", "team", "state", "number", "seatNum"];

// 各テーブルの主キー
var DB_GoodsKeys = ["objectId"];
var DB_OrderLogKeys = ["orderLogId", "goodsObjectId"];
var DB_GalleyKeys = ["orderLogId", "goodsObjectId", "team"];

// 使用例
// addRecord("Goods", 1, 1, "タピオカ", 150, 1).then(function(r){成功時の処理}).catch(function(e){失敗時の処理});
function addRecord(table) {
  var data = Array.from(arguments).slice(1);
  return new Promise(function (resolve, reject) {
    NCMB_AddRecord(function (r) { resolve(r); }, function (e) { reject(e); },
      table, data);
  });
}
function NCMB_AddRecord(success, failed, table, args) {
  for (var i = 0; i < args.length; ++i)
    if (!args[i] && args[i] != 0) {
      failed("Some arguments are null. index: " + i.toString());
      return;
    }
  switch (table) {
    case ("Goods"):
      if (args.length == DB_GoodsAttributes.length) {
        var goods = new DB_Goods();
        for (var i = 0; i < DB_GoodsAttributes.length; ++i)
          goods.set(DB_GoodsAttributes[i], args[i]);
        goods.save()
          .then(function (obj) {
            success(obj);
          })
          .catch(function (err) {
            failed(err);
          });
      }
      break;
    case ("OrderLog"):
      if (args.length == DB_OrderLogAttributes.length) {
        var orderLog = new DB_OrderLog();
        for (var i = 0; i < DB_OrderLogAttributes.length; ++i)
          orderLog.set(DB_OrderLogAttributes[i], args[i]);
        orderLog.save()
          .then(function (obj) {
            success(obj);
          })
          .catch(function (err) {
            failed(err);
          });
      }
      break;
    case ("Galley"):
      if (args.length == DB_GalleyAttributes.length) {
        var galley = new DB_Galley();
        for (var i = 0; i < DB_GalleyAttributes.length; ++i)
          galley.set(DB_GalleyAttributes[i], args[i]);
        galley.save()
          .then(function (obj) {
            success(obj);
          })
          .catch(function (err) {
            failed(err);
          });
      }
      break;
    default:
      failed("Could not found table: " + table);
      break;
  }
}

// 使用例
// pullRecords("OrderLog").then(function(r){成功時の処理}).catch(function(e){失敗時の処理});
function pullRecords(table) {
  return new Promise(function (resolve, reject) {
    NCMB_PullRecords(function (r) { resolve(r); }, function (e) { reject(e); }, table);
  });
}
var NCMB_PullRecords = function (success, failed, table) {
  var arr = [];
  switch (table) {
    case ("Goods"):
      DB_Goods.equalTo("isNewest", 1)
        .fetchAll()
        .then(function (objs) {
          for (var i = 0; i < objs.length; ++i) {
            obj = objs[i]
            arr.push([obj.objectId, obj.galleyMode, obj.inStock, obj.goodsName, obj.price, obj.isNewest]);
          }
          success(arr);
        })
        .catch(function (err) {
          failed(err);
        });
      break;
    case ("OrderLog"):
      DB_OrderLog.fetchAll()
        .then(function (objs) {
          for (var i = 0; i < objs.length; ++i) {
            obj = objs[i]
            arr.push([obj.orderLogId, obj.goodsObjectId, obj.createDate, obj.number, obj.price]);
          }
          success(arr);
        })
        .catch(function (err) {
          failed(err);
        });
      break;
    case ("Galley"):
      DB_Galley.order(DB_GalleyKeys[0])
        .order(DB_GalleyKeys[1])
        .order(DB_GalleyKeys[2])
        .fetchAll()
        .then(function (objs) {
          for (var i = 0; i < objs.length; ++i) {
            obj = objs[i]
            arr.push([obj.orderLogId, obj.goodsObjectId, obj.team, obj.state, obj.number, obj.seatNum]);
          }
          success(arr);
        })
        .catch(function (err) {
          failed(err);
        });
      break;
    default:
      failed("Could not found table: " + table);
      break;
  }
}

// 使用例
// editRecord("Goods", "objectId"(商品番号), "isNewest", 0, "inStock", 0).then(function(r){成功時の処理}).catch(function(e){失敗時の処理});
function editRecord(table) {
  var data = Array.from(arguments).slice(1);
  return new Promise(function (resolve, reject) {
    NCMB_EditRecord(function (r) { resolve(r); }, function (e) { reject(e); }, table, data);
  });
}
var NCMB_EditRecord = function (success, failed, table, args) {
  switch (table) {
    case ("Goods"):
      DB_Goods.equalTo(DB_GoodsKeys[0], args[0])
        .fetchAll()
        .then(function (objs) {
          obj = objs[0];
          for (var i = 1; i < args.length; i += 2)
            obj.set(args[i], args[i + 1]);
          return obj.update();
        })
        .then(function (obj) {
          success(obj);
        })
        .catch(function (err) {
          failed(err);
        });
      break;
    case ("OrderLog"):
      DB_OrderLog.equalTo(DB_OrderLogKeys[0], args[0])
        .equalTo(DB_OrderLogKeys[1], args[1])
        .fetchAll()
        .then(function (objs) {
          obj = objs[0];
          for (var i = 2; i < args.length; i += 2)
            obj.set(args[i], args[i + 1]);
          return obj.update();
        })
        .then(function (obj) {
          success(obj);
        })
        .catch(function (err) {
          failed(err);
        });
      break;
    case ("Galley"):
      DB_Galley.equalTo(DB_GalleyKeys[0], args[0])
        .equalTo(DB_GalleyKeys[1], args[1])
        .equalTo(DB_GalleyKeys[2], args[2])
        .fetchAll()
        .then(function (objs) {
          obj = objs[0];
          for (var i = 3; i < args.length; i += 2)
            obj.set(args[i], args[i + 1]);
          return obj.update();
        })
        .then(function (obj) {
          success(obj);
        })
        .catch(function (err) {
          failed(err);
        });
      break;
    default:
      failed("Could not found table: " + table);
      break;
  }
}

// 使用例
// deleteRecord("Galley", "orderLogId"(注文番号), "goodsObjectId"(商品番号), "team"(チーム)).then(function(r){成功時の処理}).catch(function(e){失敗時の処理});
function deleteRecord(table) {
  var data = Array.from(arguments).slice(1);
  return new Promise(function (resolve, reject) {
    NCMB_DeleteRecord(function (r) { resolve(r); }, function (e) { reject(e); }, table, data);
  });
}
var NCMB_DeleteRecord = function (success, failed, table, args) {
  var state = false;
  switch (table) {
    case ("Goods"):
      DB_Goods.equalTo(DB_GoodsKeys[0], args[0])
        .fetchAll()
        .then(function (objs) {
          obj = objs[0];
          obj.delete()
            .then(function () {
              success();
            })
            .catch(function () {
              failed();
            })
        })
        .catch(function (err) {
          failed();
        });
      break;
    case ("OrderLog"):
      DB_OrderLog.equalTo(DB_OrderLogKeys[0], args[0])
        .equalTo(DB_OrderLogKeys[1], args[1])
        .fetchAll()
        .then(function (objs) {
          obj = objs[0];
          obj.delete()
            .then(function () {
              success();
            })
            .catch(function () {
              failed();
            })
        })
        .catch(function (err) {
          failed();
        });
      break;
    case ("Galley"):
      DB_Galley.equalTo(DB_GalleyKeys[0], args[0])
        .equalTo(DB_GalleyKeys[1], args[1])
        .equalTo(DB_GalleyKeys[2], args[2])
        .fetchAll()
        .then(function (objs) {
          obj = objs[0];
          obj.delete()
            .then(function () {
              success();
            })
            .catch(function () {
              failed();
            })
        })
        .catch(function (err) {
          failed();
        });
      break;
    default:
      failed("Could not found table: " + table);
      break;
  }
}

// 使用例
// translateIdsToNames([商品番号, ...]).then(function(r){成功時の処理}).catch(function(e){失敗時の処理});
function translateIdsToNames(ids) {
  return new Promise(function (resolve, reject) {
    NCMB_TranslateIdsToNames(function (r) { resolve(r); }, function (e) { reject(e); }, ids);
  });
}
function NCMB_TranslateIdsToNames(success, failed, ids) {
  var names = [];
  pullRecords("Goods")
    .then(function (r) {
      GoodsList = r;
      var nameList = [];
      var idList = [];
      GoodsList.forEach(function (value) { idList.push(value[0]); nameList.push(value[3]); })
      ids.forEach(function (value) { names.push(nameList[idList.indexOf(value)]) });
      success(names);
    })
    .catch(function (e) {
      failed(e);
    });
}