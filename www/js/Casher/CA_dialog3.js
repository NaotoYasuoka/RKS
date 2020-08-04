// This is a JavaScript file
document.addEventListener('preshow', function (event) {
  if (event.target.matches('#CA_dialog3')) {
    pullRecords("Goods")
      .then(function (r) {
        r.forEach(function (value) {
          var nRow = document.createElement("ons-list-item");
          nRow.tappable = true;
          nRow.id = r.goodsObjectId;
          nRow.galley = r.galleyMode;
          nRow.inStock = r.inStock;
          nRow.textContent = r.goodsName;
          nRow.value = r.price;
          nRow.onclick = onSelectAltGoods(this);
          document.getElementById("CA_dialogGoodsList").appendChild(nRow);
        })
      })
      .catch(function (e) {
        alert(e);
      });
  }
}, false);