// This is a JavaScript file
var CA_selectedGoodsObj;
var CA_cartList;
var CA_cartObj;
var CA_totalPrice;
var CA_buttonElement;
var CA_cartElement;

document.addEventListener('init', function (event) {
  if (event.target.matches('#CA_main')) {
    CA_cartObj = document.getElementById("CA_cart");
    CA_totalPrice = document.getElementById("CA_totalPrice");
    CA_buttonElement = DB_GoodsElement;
    CA_buttonElement.splice(CA_buttonElement.indexOf("isNewest"), 1);
    CA_cartElement = CA_buttonElement;
    CA_cartElement.push("num");
  }
}, false);

document.addEventListener('show', function (event) {
  if (event.target.matches('#CA_main')) {
    CA_selectedGoodsObj = null;
    CA_cartList = [];
    CA_totalPrice.value = 0;
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
    switch(index % 3) {
      case(0):
        break;
      case(1):
        break;
      case(2):
        break;
      default:
        alert("www/js/Casher/CA_main.js");
        break;
    }
    if (index % 3 == 0) {
      nRow = document.createElement("ons-list-item");
      nRow.className = "CA_r";
      document.getElementById("CA_goodsList").appendChild(nRow);
    }
    var button = document.createElement("button");
    if (obj.inStock == 1) {
      CA_buttonElement.forEach(value => {
        button[value] = obj[value];
      });
    }
    else button.disabled = true;
    button.className = "CA_b";
    button.onclick = function () { CA_showSelectNum(this); };
    nRow.appendChild(button);

    var t = document.createElement("div");
    t.className = "CA_t";
    t.textContent = obj.goodsName + "\n" + obj.price;
    button.appendChild(t);


    // var str = "";
    // if (obj.inStock == 1) CA_buttonElement.forEach(value => str += value + "=\"" + obj[value] + "\"");
    // else 
    // nRow.innerHTML += "<ons-button " + str + " onclick=\"CA_showSelectNum(this)\">" + obj.goodsName + "<br>" + obj.price + "</ons-button>";


    // var p = document.createElement("p");
    // p.textContent = obj.price;
    // button.appendChild(p);
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
    CA_buttonElement.forEach(value => {
      tmp[value] = CA_selectedGoodsObj[value];
    });
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
    CA_cartObj.appendChild(nItem);

    var name = document.createElement("label");
    // CA_cartElement.forEach(value => {
    //   name[value] = obj[value];
    // });
    name.style = "width: 40%;";
    name.textContent = obj.goodsName;

    var subtotal = document.createElement("input");
    subtotal.type = "number";
    subtotal.style = "width: 40%; text-align: right;";
    subtotal.value = obj.price * obj.num;
    subtotal.readOnly = true;

    var num = document.createElement("input");
    num.type = "number";
    num.style = "width: 30px;";
    num.value = obj.num;
    num.oninput = function () {
      CA_cartList[index].num = CA_keepPositive(this);
      subtotal.value = CA_cartList[index].num * CA_cartList[index].price;
      CA_calcTotalPrice();
    }

    var del = document.createElement("input");
    del.type = "button";
    del.value = "削除";
    del.index = index;
    del.onclick = () => CA_removeCartList(this.index);

    nItem.appendChild(name);
    nItem.appendChild(num);
    nItem.appendChild(subtotal);
    nItem.appendChild(del);
  });
}

function CA_calcTotalPrice() {
  var sum = 0;
  CA_cartList.forEach(value => sum += value.num * value.price);
  CA_totalPrice.value = sum;
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
  const currentDate = now.getFullYear() + "/" + (now.getMonth() + 1) + "/" + now.getDate() + "/" + now.getHours() + "/" + now.getMinutes() + "/" + now.getSeconds();
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
          .then(function () {
            if (value.galleyMode) {
              addRecord("Galley", orderId, value.objectId, 1, 0, value.num, seatNum)
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
          })
          .catch(e => alert("Failed to push OrderLog.\n" + e));
      }

    })
    .catch(e => alert("Failed to pull DB to push.\n" + e));
}

function CA_removeCartList(i) {
  CA_cartList.splice(i, 1);

  CA_reloadCart();
  CA_calcTotalPrice();
}

function CA_keepPositive(numInput) {
  if (numInput.value < 1) numInput.value = 1;
  return numInput.value;
}