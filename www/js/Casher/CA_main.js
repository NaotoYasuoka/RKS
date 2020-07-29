// This is a JavaScript file
CA_selectedGoodsObj="";
document.addEventListener('show', function (event) {
  if (event.target.matches('#CA_main')) {
    pullRecords("Goods").then(function (r) {
      for (let row = 0; row <= (r.length / 3 + r.length % 3); ++row) {
        var nRow = document.createElement("ons-row");
        nRow.style = "padding: 2px 2px;";
        nRow.id = "pRow" + row;
        document.getElementById("goodsList").appendChild(nRow);

        for (let col = 0; row * 3 + col < r.length; ++col) {
          var button = document.createElement("ons-button");
          button.onclick = function () {
            CA_showDialog(this);
          };

          button.id = r[row * 3 + col][0];
          button.galley = r[row * 3 + col][1];
          button.textContent = r[row * 3 + col][3];
          button.value = r[row * 3 + col][4]; 
          document.getElementById(nRow.id).appendChild(button);
        }
      }
    })
      .catch(function (e) {
        alert(e);
      });
  }
}, false);

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
};

function CA_hideDialog(num) {
  document.getElementById("CA_dialog").hide();
  var nItem = document.createElement("ons-list-item");
  document.getElementById("pCart").appendChild(nItem);

  var left = document.createElement("label");
  left.id = CA_selectedGoodsObj.id;
  left.textContent = CA_selectedGoodsObj.textContent;
  left.value = CA_selectedGoodsObj.value;
  left.galley = CA_selectedGoodsObj.galley;
  left.num = num;
  nItem.appendChild(left);

  var right = document.createElement("label");
  right.textContent = left.num;
  nItem.appendChild(right);
};

// var showPopover = function(target) {
//   document
//     .getElementById('popover')
//     .show(target);
// };

// var hidePopover = function() {
//   document
//     .getElementById('popover')
//     .hide();
// };