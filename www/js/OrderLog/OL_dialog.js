// This is a JavaScript file
var OL_editingData
var olid

document.addEventListener('preshow', function (event) {
  if (event.target.matches('#OL_dialog')) {
    // var tmp = document.getElementsByClassName("OL_goodsInfoRow")
    // Array.prototype.forEach.call(tmp, value => value.parentNode.removeChild(value))
    // var elements = document.getElementsByClassName("OL_goodsInfoRow")
    // for (var i = 0; i < elements.length; i++) {
    //   var e = elements[i];
    //   if (e) {
    //     e.parentNode.removeChild(e);
    //   }
    // }
    var t = document.getElementById("OL_goodsInfo")
    while (t.firstChild) t.removeChild(t.firstChild)
    OL_setValues()
  }
}, false);

function OL_setValues() {
  olid = OL_dialogClickInfo.num
  var data = []
  for (var i = 0; i < OL_dialogObj.length; i++) if (olid == OL_dialogObj[i].orderLogId) data.push(OL_dialogObj[i])
  if (data == []) {
    alert("error")
  }
  else {
    OL_editingData = data
    OL_OrderDate.textContent = "会計日時：" + data[0].orderDate
    if(data[0].seatNum == -1) OL_seatNum.textContent = "座席番号：お持ち帰り"
    else OL_seatNum.textContent = "座席番号：" + data[0].seatNum
    var id = []
    data.forEach(value => id.push(value.goodsObjectId))
    translateIdsToNames(id, true).then(r => {
      data.forEach(value => {
        var goods = document.createElement("ons-list-item")
        OL_goodsInfo.appendChild(goods)

        var nl = document.createElement("label")
        var np = r.shift()
        nl.textContent = np[0]
        nl.style = "width: 70%; font-size: 1.1em;"
        goods.appendChild(nl)

        var pl = document.createElement("label")
        pl.textContent = "￥" + np[1]
        pl.price = np[1]
        pl.style = "width: 30%; text-align: right;"
        goods.appendChild(pl)

        var n = document.createElement("input")
        n.type = "number"
        n.style = "width: 30%; font-size: 1.15em; text-align: right;"
        n.value = value.number
        n.oninput = () => {
          if (n.value < 0) n.value = 0
          s.textContent = "￥" + value.subtotal + "→" + "￥" + n.value * Number(pl.price)
        }
        goods.appendChild(n)

        var s = document.createElement("label")
        s.style = "width: 70%; text-align: right;"
        s.textContent = value.subtotal
        goods.appendChild(s)

        var d = document.createElement("ons-button")
        d.textContent = "削除"
        d.style = "background: red;"
        d.onclick = () => {
          n.value = 0
          s.textContent = "￥" + value.subtotal + "→" + "￥" + n.value * Number(pl.price)
        }
        goods.appendChild(d)
      })
    })
  }
}

function OL_pushEditedData() {

  pullRecords("Galley").then(r => {
    var t = document.getElementById("OL_goodsInfo")
    var targetData = []
    var nums = []
    // ダイアログの個数入力ボックスから数値を取得
    Array.prototype.forEach.call(t.children, value => nums.push(value.getElementsByTagName("input")[0].value))
    // 編集した注文のデータだけ取り出す
    var galley = Array.prototype.filter.call(r, value => { return value.orderLogId == olid })
    OL_editingData.forEach(value => {
      var galleyData = galley.filter(value_ => { return value_.goodsObjectId == value.goodsObjectId })
      var editedNum = nums.shift()
      // 編集前と編集後で数が変わっているもの
      if (value.number != editedNum)
        //チームが分かれておらず、準備待ちのものを対象
        if (galleyData.length == 1 && galleyData[0].state == 0) targetData.push([value, editedNum])
        else alert("手配済み")
    })

    targetData.forEach((value, index) => {
      var originData = value[0]
      var editedNum = value[1]
      if (editedNum == 0) {
        deleteRecord("OrderLog", originData.orderLogId, originData.goodsObjectId).catch(e => alert(e))
        deleteRecord("Galley", originData.orderLogId, originData.goodsObjectId, 0)
          .then(() => {
            if (targetData.length - 1 == index) {
              alert("更新完了")
              hideDialog("OL_dialog")
              loadTable("OL_table", "OrderLog", "orderDate");
            }
          })
          .catch(e => alert(e))
      }
      else {
        // OrderLogとGalley両方を編集
        editRecord("OrderLog", originData.orderLogId, originData.goodsObjectId, "number", editedNum)
          .then()
          .catch(e => alert(e))

        editRecord("Galley", originData.orderLogId, originData.goodsObjectId, 0, "number", editedNum, "subtotal", originData.subtotal / originData.number * editedNum)
          .then(() => {
            if (targetData.length - 1 == index) {
              alert("更新完了")
              hideDialog("OL_dialog")
              loadTable("OL_table", "OrderLog", "orderDate");
            }
          })
          .catch(e => alert(e))
      }
    })

  })


}