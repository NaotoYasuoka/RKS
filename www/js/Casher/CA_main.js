// This is a JavaScript file

var i = 0;
document.addEventListener('show', function (event) {
  if (event.target.matches('#CA_main')) {
    pullRecords("Goods").then(function (r) {
      for (let row = 0; row <= (r.length / 3 + r.length % 3); ++row) {
        var nRow = document.createElement("ons-row");
        nRow.style = "padding: 2px 2px;"
        nRow.id = "pRow" + row;
        document.getElementById("goodsList").appendChild(nRow);


        for (let col = 0; row * 3 + col < r.length; ++col) {
          var button = document.createElement("ons-button");
          button.onclick = function () {
            showTemplateDialog();
            // var nItem = document.createElement("ons-list-item");
            // nItem.id = "nItem" + i++;
            // document.getElementById("pCart").appendChild(nItem);
            // var n = document.createElement("label");
            // n.id = this.id;
            // n.textContent = this.textContent;
            // document.getElementById(nItem.id).appendChild(n);
          };
          button.textContent = r[row*3+col][3];
          button.id = r[row*3+col][0];
          document.getElementById(nRow.id).appendChild(button);
        }
      }
    })
      .catch(function (e) {
        alert(e);
      });
  }
}, false);

var showTemplateDialog = function() {
  var dialog = document.getElementById('CA_dialog');

  if (dialog) {
    dialog.show();
  } else {
    ons.createElement('html/Casher/CA_dialog.html', { append: true })
      .then(function(dialog) {
        dialog.show();
      });
  }
};

var hideDialog = function(id) {
  document
    .getElementById(id)
    .hide();
};

var showPopover = function(target) {
  document
    .getElementById('popover')
    .show(target);
};

var hidePopover = function() {
  document
    .getElementById('popover')
    .hide();
};