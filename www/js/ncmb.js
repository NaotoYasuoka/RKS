// This is a JavaScript file

var apikey = "1d9ecfbf5357f17f28ac75657ad02d36b7d9d4906e2a6f62a7c2022a079cff28";
var clientkey = "3399c8201142519f65329a7ed6c1bdd396deb1f7b96d23d77c3575facf6490a3";
var ncmb = new NCMB(apikey, clientkey);

var Goods = ncmb.DataStore("Goods");
var OrderLog = ncmb.DataStore("OrderLog");
var Galley = ncmb.DataStore("Galley");

// 登録時の引数の順番は各テーブル以下の配列の順番に合わせてください
var GoodsAttributes = ["galleyMode", "inStock", "goodsName", "price", "isNewest"];
var OrderLogAttributes = ["orderLogId", "goodsObjectId", "number", "price"];
var GalleyAttributes = ["orderLogId", "goodsObjectId", "team", "state", "number", "seatNum"];

// 各テーブルの主キー
var GoodsKeys = ["objectId"];
var OrderLogKeys = ["orderLogId", "goodsObjectId"];
var GalleyKeys = ["orderLogId", "goodsObjectId", "team"];

// 使用例
// addRecord("Goods", 1, 1, "タピオカ", 150, 1).then(function(r){成功時の処理}).catch(function(e){失敗時の処理});
function addRecord(table) {
  var data = Array.from(arguments).slice(1);
  return new Promise(function (resolve, reject) {
    NCMB_AddRecord(function (r) { resolve(r); }, function (e) { reject(e); },
      table, data);
  });
}
var NCMB_AddRecord = function (success, failed, table, args) {
  for (var i = 0; i < args.length; ++i)
    if (!args[i] && args[i] != 0) {
      failed("Some arguments are null. index: " + i.toString());
      return;
    }
  switch (table) {
    case ("Goods"):
      if (args.length == GoodsAttributes.length) {
        var goods = new Goods();
        for (var i = 0; i < GoodsAttributes.length; ++i)
          goods.set(GoodsAttributes[i], args[i]);
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
      if (args.length == OrderLogAttributes.length) {
        var orderLog = new OrderLog();
        for (var i = 0; i < OrderLogAttributes.length; ++i)
          orderLog.set(OrderLogAttributes[i], args[i]);
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
      if (args.length == GalleyAttributes.length) {
        var galley = new Galley();
        for (var i = 0; i < GalleyAttributes.length; ++i)
          galley.set(GalleyAttributes[i], args[i]);
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
      Goods.equalTo("isNewest", 1)
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
      OrderLog.fetchAll()
        .then(function (objs) {
          for (var i = 0; i < objs.length; ++i) {
            obj = objs[i]
            arr.push([obj.orderLogId, obj.goodsObjectId, obj.number, obj.price]);
          }
          success(arr);
        })
        .catch(function (err) {
          failed(err);
        });
      break;
    case ("Galley"):
      Galley.order(GalleyKeys[0])
        .order(GalleyKeys[1])
        .order(GalleyKeys[2])
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
      Goods.equalTo(GoodsKeys[0], args[0])
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
      OrderLog.equalTo(OrderLogKeys[0], args[0])
        .equalTo(OrderLogKeys[1], args[1])
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
      Galley.equalTo(GalleyKeys[0], args[0])
        .equalTo(GalleyKeys[1], args[1])
        .equalTo(GalleyKeys[2], args[2])
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
      Goods.equalTo(GoodsKeys[0], args[0])
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
      OrderLog.equalTo(OrderLogKeys[0], args[0])
        .equalTo(OrderLogKeys[1], args[1])
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
      Galley.equalTo(GalleyKeys[0], args[0])
        .equalTo(GalleyKeys[1], args[1])
        .equalTo(GalleyKeys[2], args[2])
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