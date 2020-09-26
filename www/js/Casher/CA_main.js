// This is a JavaScript file
var CA_selectedGoodsObj; // CA_main.htmlで選択された商品を記憶する用
var CA_cartList; // CA_main.htmlの右側、カートのタグ
var CA_cartObj;
var CA_buttonElement;
var CA_cartElement;
var CA_goodsList;

document.addEventListener('init', function (event) {
  if (event.target.matches('#CA_main')) {
    CA_cartObj = document.getElementById("CA_cart");
    CA_buttonElement = DB_GoodsElement;
    CA_buttonElement.splice(CA_buttonElement.indexOf("isNewest"), 1);
    CA_cartElement = CA_buttonElement;
    CA_cartElement.push("num");
    CA_goodsList = document.getElementById("CA_goodsList");
  }
}, false);

document.addEventListener('show', function (event) {
  if (event.target.matches('#CA_main')) {
    makeRegiSidebar();
    CA_selectedGoodsObj = null;
    CA_cartList = [];
    CA_totalPrice.textContent = "￥" + 0;
    pullRecords("Goods")
      .then(function (r) {
        CA_loadGoods(r);
      })
      .catch(function (e) {
        ons.notification.alert(e);
      });
    //<ons-list-item onclick= fn.load('html/OrderDisplay/OD_main.html')  modifier= chevron  tappable><div class= left ><img class= list-item__thumbnail  src= image/Galley.png ></div><div class= center >注文表示</div></ons-list-item>

  }
}, false);

function CA_loadGoods(r) {
  var nRow;
  // var f = false;
  r.forEach(function (obj, index) {
    if (index % 3 == 0) {
      nRow = document.createElement("div");
      nRow.className = "CA_row";
      CA_goodsList.appendChild(nRow);
      // f = !f;
    }
    var button = document.createElement("ons-button");
    if (obj.inStock == 1) CA_buttonElement.forEach(value => { button[value] = obj[value]; });
    else button.disabled = true;
    button.style = "background: #d69b58;"
    // if (f) button.style = "background:red;"
    // else button.style = "background:black;"
    button.className = "CA_button";
    button.onclick = function () { CA_showSelectNum(this); };
    nRow.appendChild(button);

    var t = document.createElement("div");
    t.className = "CA_buttonText CenteringChild";
    t.textContent = obj.goodsName + "\n￥" + Number(obj.price).toLocaleString();
    button.appendChild(t);
  });
}

function CA_showSelectNum(goodsObj) {
  CA_selectedGoodsObj = goodsObj;
  CA_showDialog('CA_dialog');
}

function CA_onSelectedNum(goodsNum) {
  CA_hideDialog("CA_dialog");
  CA_addCart(goodsNum);
}

function CA_addCart(goodsNum) {
  var arr = [];
  // カート内の商品番号を取得
  CA_cartList.forEach(value => arr.push(value.objectId));
  // 重複があるときは数を足す
  var i = arr.indexOf(CA_selectedGoodsObj.objectId);
  if (i != -1) CA_cartList[i].num += goodsNum;
  else {
    var tmp = {};
    CA_buttonElement.forEach(value => tmp[value] = CA_selectedGoodsObj[value]);
    tmp.num = goodsNum;
    CA_cartList.push(tmp);
  }

  CA_reloadCart();
  CA_calcTotalPrice();
}

function CA_reloadCart() {
  // htmlのカート内の要素を全削除
  while (CA_cartObj.firstChild) CA_cartObj.removeChild(CA_cartObj.firstChild);
  // リスト内の商品を配置
  CA_cartList.forEach(function (obj, index) {
    var nItem = document.createElement("ons-list-item");
    nItem.style = "min-height: 60px;"

    var box = document.createElement("div")
    box.style = "width: 100%; height: 100%; display: flex;flex-direction: row;flex-wrap: wrap;justify-content: space-between; align-items: center;"

    var name = document.createElement("div");
    // カート内の商品の変更
    name.onclick = function () {
      CA_showDialog("CA_dialog3");
      var tmp = document.getElementsByClassName("CA_button");
      Array.prototype.forEach.call(tmp, value => {
        value.style = "background: maroon";
        // 変更の処理
        value.onclick = function () {
          CA_selectedGoodsObj = this;
          var num = obj.num;
          CA_removeCartList(index);
          CA_addCart(num);
          // 商品ボタンの処理を戻す
          Array.prototype.forEach.call(tmp, value_ => {
            value_.style = "background: #d69b58;";
            CA_hideDialog("CA_dialog3");
            value_.onclick = function () { CA_showSelectNum(this); };
          });
        }
      });
    }
    name.style = "width: 40%; font-size: 1.2em;";
    name.className = "TextButton";
    name.textContent = obj.goodsName;

    var subtotal = document.createElement("div");
    subtotal.style = "width: 30%; text-align: right; font-size: 1.5em;";
    subtotal.textContent = "￥" + (obj.price * obj.num).toLocaleString();

    var num = document.createElement("input");
    num.type = "number";
    num.style = "width: 50px; font-size: 1.2em;";
    num.value = obj.num;
    num.oninput = function () {
      num.value = num.value < 1 ? 1 : num.value;
      CA_cartList[index].num = num.value;
      subtotal.textContent = "￥" + (CA_cartList[index].num * CA_cartList[index].price).toLocaleString();
      CA_calcTotalPrice();
    }

    var del = document.createElement("div");
    del.innerHTML = "<ons-icon icon=fa-trash size=20px></ons-icon>"
    del.className = "CancelTextButton"
    del.index = index;
    del.onclick = () => {
      CA_removeCartList(del.index);
    }

    CA_cartObj.appendChild(nItem);
    nItem.appendChild(box)
    box.appendChild(name);
    box.appendChild(num);
    box.appendChild(subtotal);
    box.appendChild(del);
  });
}

function CA_removeCartList(i) {
  CA_cartList.splice(i, 1);

  CA_reloadCart();
  CA_calcTotalPrice();
}

function CA_calcTotalPrice() {
  var sum = 0;
  CA_cartList.forEach(value => sum += value.num * value.price);
  CA_totalPrice.textContent = "￥" + sum.toLocaleString();
}

function CA_showSelectSeat() {
  if (!CA_cartList.length) return;
  CA_showDialog('CA_dialog2');
}

function CA_onSelectedSeat(seatNum) {
  CA_hideDialog("CA_dialog2");
  CA_pushDB(seatNum);
}

function CA_pushDB(seatNum) {
  var now = new Date();
  const currentDate = now.getFullYear() + "/" + (now.getMonth() + 1) + "/" + now.getDate() + " " + now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
  var orderId = 1;
  pullRecords("OrderLog")
    .then(function (r) {
      // 前回の注文＋１で注文番号を設定
      if (r.length) orderId = r.slice(-1)[0].orderLogId + 1;
      // プッシュ成功確認用フラグ
      var n = CA_cartList.length;
      // カートの中身をすべてDBに登録する
      while (CA_cartList.length) {
        var value = CA_cartList.shift();
        addRecord("OrderLog", orderId, value.objectId, currentDate, value.num, value.price * value.num, seatNum)
          .catch(e => ons.notification.alert("注文履歴テーブルへのプッシュに失敗。\n" + e));
        if (value.galleyMode) {
          addRecord("Galley", orderId, value.objectId, 0, 0, value.num, seatNum, 0)
            .then(function () {
              if (--n == 0) {
                ons.notification.alert("プッシュ成功。");
                CA_reloadCart();
                CA_calcTotalPrice();
              }
            })
            .catch(e => ons.notification.alert("厨房テーブルへのプッシュに失敗。\n" + e));
        }
        else if (--n == 0) {
          ons.notification.alert("プッシュ成功。");
          CA_reloadCart();
          CA_calcTotalPrice();
        }
      }

    })
    .catch(e => ons.notification.alert("テーブルのプルに失敗。\n" + e));
}