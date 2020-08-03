// This is a JavaScript file
document.addEventListener('preshow', function (event) {
  if (event.target.matches('#CA_dialog3')) {
    pullRecords("Goods")
      .then(function (r) {
        r.forEach(function (value) {
          var nRow = document.createElement("ons-list-item");
          nRow.tappable = true;
          nRow.id = r[row * 3 + col][0];
          nRow.galley = r[row * 3 + col][1];
          nRow.inStock = r[row * 3 + col][2];
          nRow.textContent = r[row * 3 + col][3];
          nRow.value = r[row * 3 + col][4];
          nRow.onclick = onSelectAltGoods(this);
          document.getElementById("CA_dialogGoodsList").appendChild(nRow);
        })
      })
      .catch(function (e) {
        alert(e);
      });
  }
}, false);