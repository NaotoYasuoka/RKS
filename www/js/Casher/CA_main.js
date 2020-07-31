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
      button.id = r[row * 3 + col][0];
      button.galley = r[row * 3 + col][1];
      button.textContent = r[row * 3 + col][3];
      button.value = r[row * 3 + col][4];
      button.onclick = function () {
        CA_showDialog(this);
      };

      document.getElementById(nRow.id).appendChild(button);
    }
  }
}

function CA_showDialog(goodsObj) {
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

function CA_hideDialog(goodsNum) {
  document.getElementById("CA_dialog").hide();
  CA_addCart(goodsNum);
}

function CA_addCart(goodsNum) {
  var i;
  for(i=0; i<CA_cartList.length; i++);
  if (i != CA_cartList.length) {
    alert(tmp);
    CA_cartList[tmp][4] += goodsNum;
  }
  else {
    CA_cartList.push([CA_selectedGoodsObj.id, CA_selectedGoodsObj.galley, CA_selectedGoodsObj.textContent, CA_selectedGoodsObj.value, goodsNum]);
  }
  CA_reloadCart();
  CA_calcTotalPrice();
}

function CA_reloadCart() {
  while (CA_cartObj.firstChild) {
    CA_cartObj.removeChild(CA_cartObj.firstChild);
  }

  CA_cartList.forEach(function (value) {
    var nItem = document.createElement("ons-list-item");
    CA_cartObj.appendChild(nItem);

    var left = document.createElement("label");
    left.id = value[0];
    left.galley = value[1];
    left.textContent = value[2];
    left.value = value[3];
    left.num = value[4];

    var right = document.createElement("label");
    right.textContent = left.num;

    nItem.appendChild(left);
    nItem.appendChild(right);
  });
}

function CA_calcTotalPrice() {
  var sum = 0;
  CA_cartList.forEach(function (value) {
    sum += value[3] * value[4];
  });
  CA_totalPrice.value = sum;
}