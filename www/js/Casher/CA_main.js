// This is a JavaScript file
var CA_selectedGoodsObj;
var CA_cartList;
var CA_cartObj;
var CA_totalPrice;

document.addEventListener('init', function (event) {
  if (event.target.matches('#CA_main')) {
    CA_cartObj = document.getElementById("CA_cart");
    CA_totalPrice = document.getElementById("CA_totalPrice");
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
  for (let row = 0; row <= (r.length / 3 + r.length % 3); row++) {
    var nRow = document.createElement("ons-row");
    nRow.style = "padding: 2px 2px;";
    nRow.id = "CA_Row_" + row;
    document.getElementById("CA_goodsList").appendChild(nRow);

    for (let col = 0; row * 3 + col < r.length; ++col) {
      var button = document.createElement("ons-button");
      if (r[row * 3 + col][2] != 0) {
        button.id = r[row * 3 + col][0];
        button.galley = r[row * 3 + col][1];
        button.inStock = r[row * 3 + col][2];
        button.textContent = r[row * 3 + col][3];
        button.value = r[row * 3 + col][4];
      }
      else {
        button.disabled = true;
        button.textContent = r[row * 3 + col][3];
      }
      button.onclick = function () {
        CA_showSelectNum(this);
      }

      document.getElementById(nRow.id).appendChild(button);
    }
  }
}

function CA_showSelectNum(goodsObj) {
  CA_selectedGoodsObj = goodsObj;

  var dialog = document.getElementById('CA_dialog');

  if (dialog) {
    dialog.show();
  } else {
    ons.createElement('html/Casher/CA_dialog.html', { append: true })
      .then(function (dialog) {
        dialog.show();
      });
  }
}

function CA_onSelectedNum(goodsNum) {
  document.getElementById("CA_dialog").hide();
  CA_addCart(goodsNum);
}

function CA_addCart(goodsNum) {
  var arr = [];
  CA_cartList.forEach(function (value) {
    arr.push(value[0]);
  });
  var i = arr.indexOf(CA_selectedGoodsObj.id)
  if (i != -1) {
    CA_cartList[i][4] += goodsNum;
  }
  else {
    CA_cartList.push([CA_selectedGoodsObj.id, CA_selectedGoodsObj.galley, CA_selectedGoodsObj.textContent, CA_selectedGoodsObj.value, goodsNum]);
  }

  CA_reloadCart();
  CA_calcTotalPrice();
}

function CA_reloadCart() {
  // htmlのカート内の要素を全削除
  while (CA_cartObj.firstChild) CA_cartObj.removeChild(CA_cartObj.firstChild);

  CA_cartList.forEach(function (value, index) {
    var nItem = document.createElement("ons-list-item");
    CA_cartObj.appendChild(nItem);

    var left = document.createElement("label");
    left.id = value[0];
    left.galley = value[1];
    left.textContent = value[2];
    left.value = value[3];
    left.num = value[4];

    var right = document.createElement("input");
    right.type = "number";
    right.style = "width: 30px;";
    right.oninput = function () {
      if (this.value > 0) CA_cartList[index][4] = this.value;
      else this.value = 1;
      CA_calcTotalPrice();
    }
    right.value = left.num;

    var del = document.createElement("input");
    del.type = "button";
    del.value = "削除";
    del.index = index;
    del.onclick = () => CA_removeCartList(this.index);

    nItem.appendChild(left);
    nItem.appendChild(right);
    nItem.appendChild(del);
  });
}

function CA_calcTotalPrice() {
  var sum = 0;
  CA_cartList.forEach(value => sum += value[3] * value[4]);
  CA_totalPrice.value = sum;
}

function CA_showSelectSeat() {
  if(!CA_cartList.length) return;
  var dialog = document.getElementById('CA_dialog2');
  if (dialog) {
    dialog.show();
  } else {
    ons.createElement('html/Casher/CA_dialog2.html', { append: true })
      .then(function (dialog) {
        dialog.show();
      });
  }
}

function CA_onSelectedSeat(seatNum) {
  document.getElementById("CA_dialog2").hide();
  CA_pushDB(seatNum);
}

function CA_pushDB(seatNum) {
  var Id = 1;
  pullRecords("OrderLog")
    .then(function (r) {
      // 前回の注文＋１で注文番号を設定
      if (r.length) Id = r.slice(-1)[0][0] + 1;
      // プッシュ成功確認用フラグ
      var n = CA_cartList.length;
      // カートの中身をすべてDBに登録する
      while (CA_cartList.length) {
        var value = CA_cartList.shift();
        addRecord("OrderLog", Id, value[0], value[4], value[3])
          .then(function () {
            if (value[1]) {
              addRecord("Galley", Id, value[0], 1, 0, value[4], seatNum)
                .then(function () {
                  if (--n == 0) alert("Success pushing to DB.");
                  CA_reloadCart();
                  CA_calcTotalPrice();
                })
                .catch(e => alert("Failed to push DB.\n" + e));
            }
            else if (--n == 0) alert("Success pushing to DB.");
          })
          .catch(e => alert("Failed to push DB.\n" + e));
      }

    })
    .catch(e => alert("Failed to pull DB to push.\n" + e));
}

function CA_removeCartList(i) {
  CA_cartList.splice(i, 1);

  CA_reloadCart();
  CA_calcTotalPrice();
}