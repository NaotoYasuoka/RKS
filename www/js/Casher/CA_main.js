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
    CA_selectedGoodsObj = null;
    CA_cartList = [];
    CA_totalPrice.textContent = "￥" + 0;
    pullRecords("Goods")
      .then(function (r) {
        CA_loadGoods(r);
      })
      .catch(function (e) {
        alert(e);
      });
  }
}, false);

function CA_loadGoods(r) {
  var nRow;
  r.forEach(function (obj, index) {
    if (index % 3 == 0) {
      nRow = document.createElement("div");
      nRow.className = "CA_row";
      CA_goodsList.appendChild(nRow);
    }
    var button = document.createElement("ons-button");
    if (obj.inStock == 1) CA_buttonElement.forEach(value => { button[value] = obj[value]; });
    else button.disabled = true;
    button.className = "CA_button";
    button.onclick = function () { CA_showSelectNum(this); };
    nRow.appendChild(button);

    var t = document.createElement("div");
    t.className = "CA_buttonText";
    t.textContent = obj.goodsName + "\n￥" + Number(obj.price).toLocaleString();
    button.appendChild(t);
  });
}

function CA_showSelectNum(goodsObj) {
  CA_selectedGoodsObj = goodsObj;
  var dialog = document.getElementById('CA_dialog');
  if (dialog) dialog.show();
  else {
    ons.createElement('html/Casher/CA_dialog.html', { append: true })
      .then(dialog => dialog.show());
  }
}

function CA_onSelectedNum(goodsNum) {
  document.getElementById("CA_dialog").hide();
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
    nItem.style = "height: 50px;"
    nItem.id = "CA_cartRow";

    var name = document.createElement("button");
    // カート内の商品の変更
    name.onclick = function () {
      var tmp = document.getElementsByClassName("CA_button");
      Array.prototype.forEach.call(tmp, value => {
        value.style = "background: green;";
        // 変更の処理
        value.onclick = function () {
          CA_selectedGoodsObj = this;
          var num = obj.num;
          CA_removeCartList(index);
          CA_addCart(num);
          // 商品ボタンの処理を戻す
          Array.prototype.forEach.call(tmp, value => {
            value.style = "";
            value.onclick = function () { CA_showSelectNum(this); };
          });
        }
      });
    }
    name.style = "width: 40%; font-size: 1.2em;";
    name.textContent = obj.goodsName;

    var subtotal = document.createElement("label");
    subtotal.style = "width: 40%; text-align: right; font-size: 1.5em;";
    subtotal.textContent = "￥" + (obj.price * obj.num).toLocaleString();

    var num = document.createElement("input");
    num.type = "number";
    num.style = "width: 30px; font-size: 1.2em;";
    num.value = obj.num;
    num.oninput = function () {
      num.value = num.value < 1 ? 1 : num.value;
      CA_cartList[index].num = num.value;
      subtotal.textContent = "￥" + (CA_cartList[index].num * CA_cartList[index].price).toLocaleString();
      CA_calcTotalPrice();
    }

    var del = document.createElement("ons-button");
    del.className = "right";
    del.textContent = "×";
    del.style = "background: red;border-radius: 100%;";
    del.index = index;
    del.onclick = () => {
      CA_removeCartList(del.index);
    }

    CA_cartObj.appendChild(nItem);
    nItem.appendChild(name);
    nItem.appendChild(num);
    nItem.appendChild(subtotal);
    nItem.appendChild(del);
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
  var dialog = document.getElementById('CA_dialog2');
  if (dialog) {
    dialog.show();
  } else {
    ons.createElement('html/Casher/CA_dialog2.html', { append: true })
      .then(dialog => dialog.show());
  }
}

function CA_onSelectedSeat(seatNum) {
  document.getElementById("CA_dialog2").hide();
  CA_pushDB(seatNum);
}

function CA_pushDB(seatNum) {
  var now = new Date();
  const currentDate = now.getFullYear() + "/" + (now.getMonth() + 1) + "/" + now.getDate() + "_" + now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
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
          .catch(e => alert("Failed to push OrderLog.\n" + e));
        if (value.galleyMode) {
          addRecord("Galley", orderId, value.objectId, 0, 0, value.num, seatNum)
            .then(function () {
              if (--n == 0) {
                alert("Success pushing to DB.");
                CA_reloadCart();
                CA_calcTotalPrice();
              }
            })
            .catch(e => alert("Failed to push Galley.\n" + e));
        }
        else if (--n == 0) {
          alert("Success pushing to DB.");
          CA_reloadCart();
          CA_calcTotalPrice();
        }
      }

    })
    .catch(e => alert("Failed to pull DB to push.\n" + e));
}

/*
 * スワイプイベント設定
 */
function setSwipe(elem) {
  // let t = document.querySelector(elem);
  let t = elem;
  let startX;		// タッチ開始 x座標
  let startY;		// タッチ開始 y座標
  let moveX;	// スワイプ中の x座標
  let moveY;	// スワイプ中の y座標
  let dist = 30;	// スワイプを感知する最低距離（ピクセル単位）

  // タッチ開始時： xy座標を取得
  t.addEventListener("touchstart", function (e) {
    e.preventDefault();
    startX = e.touches[0].pageX;
    startY = e.touches[0].pageY;
  });

  // スワイプ中： xy座標を取得
  t.addEventListener("touchmove", function (e) {
    e.preventDefault();
    moveX = e.changedTouches[0].pageX;
    moveY = e.changedTouches[0].pageY;
  });

  // タッチ終了時： スワイプした距離から左右どちらにスワイプしたかを判定する/距離が短い場合何もしない
  t.addEventListener("touchend", function (e) {
    if (startX > moveX && startX > moveX + dist) {		// 右から左にスワイプ
      alert("右から左");
    }
    else if (startX < moveX && startX + dist < moveX) {	// 左から右にスワイプ
      alert("左から右");
    }
  });
}