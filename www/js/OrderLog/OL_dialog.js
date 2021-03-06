// This is a JavaScript file
// OL_main.js で定義したグローバル変数
// OL_dialogObj: OrderLogテーブル
// OL_dialogClickInfo.num: 注文番号(orderLogId)
var OL_targetOrderLog
var OL_group
var targetOrderLogId

document.addEventListener('preshow', function (event) {
  if (event.target.matches('#OL_dialog')) {
    // var t = document.getElementById("OL_goodsInfo")
    // while (t.firstChild) t.removeChild(t.firstChild)
    OL_removeDialogChildren()
    OL_group = 0
    targetOrderLogId = OL_dialogClickInfo.num
    OL_setValues()
  }
}, false);

function OL_removeDialogChildren() {
  while (OL_goodsInfo.firstChild) OL_goodsInfo.removeChild(OL_goodsInfo.firstChild)
}

function OL_culcTotal() {
  var preTotal = 0
  var curTotal = 0
  OL_targetOrderLog.forEach(value => {
    preTotal += value.subtotal
    curTotal += value.goodsPrice * value.newNumber
  })
  OL_previousTotal.textContent = "￥" + preTotal.toLocaleString()
  OL_currentTotal.textContent = "￥" + curTotal.toLocaleString()
  OL_differenceTotal.style = (curTotal - preTotal) >= 0 ? "color:black;" : "color:red;"
  OL_differenceTotal.textContent = curTotal - preTotal
}

function OL_setValues() {
  OL_targetOrderLog = [] // 対象の注文データ格納用
  var targetGoodsObjectIds = [] // 対象のグッズIDを格納
  // OL_dialogObj(orderLogテーブル)から検索
  Array.prototype.forEach.call(OL_dialogObj, value => {
    if (value.orderLogId == targetOrderLogId) {
      var tmp = {}
      DB_OrderLogElement.forEach(key => {
        tmp[key] = value[key]
      })
      tmp["newNumber"] = value["number"] // 編集後の値を格納
      OL_targetOrderLog.push(tmp)
      targetGoodsObjectIds.push(tmp["goodsObjectId"]) // グッズIDを格納
    }
  })

  if (OL_targetOrderLog == []) ons.notification.alert("error")
  else {
    // 会計日時と座席番号をセット
    OL_OrderDate.textContent = "会計日時：" + OL_targetOrderLog[0].orderDate
    OL_seatNum.textContent = (OL_targetOrderLog[0].seatNum == -1) ? "座席番号：お持ち帰り" : "座席番号：" + OL_targetOrderLog[0].seatNum

    // 商品番号から商品名と単価を取得
    translateIdsToNames(targetGoodsObjectIds, true).then(r => {
      Array.prototype.forEach.call(r, (value, index) => {
        OL_targetOrderLog[index]["goodsName"] = value[0]
        OL_targetOrderLog[index]["goodsPrice"] = value[1]
      })

      OL_reloadGoods(OL_group)
    })
  }
}

function OL_reloadGoods(group) {
  OL_culcTotal()
  var maxRows = 3 // 一度に表示する商品の数
  var startIndex = group * maxRows
  var endIndex = (startIndex + maxRows < OL_targetOrderLog.length) ? startIndex + maxRows : OL_targetOrderLog.length

  // 商品を並べていく
  OL_targetOrderLog.slice(startIndex, endIndex).forEach(value => {
    var goods = document.createElement("ons-list-item")

    var nameText = document.createElement("strong")
    nameText.innerHTML = "<ons-icon icon=fa-trash size=20px class='CancelTextButton'></ons-icon>" + value.goodsName
    nameText.style = "font-size: 1.1em;"
    nameText.onclick = () => {
      num.value = 0
      value.newNumber = Number(num.value)
      subtotal.textContent = "￥" + (value.newNumber * value.goodsPrice).toLocaleString()
      OL_culcTotal()
    }

    var row = document.createElement("div")
    row.textContent = "個数："
    row.style = "width: 100%; padding: 5px;"

    var num = document.createElement("input")
    num.type = "number"
    num.style = "width: 20%; font-size: 1.15em; text-align: right;"
    num.value = value.newNumber
    num.oninput = () => {
      if (num.value < 0) num.value = 0
      value.newNumber = Number(num.value)
      subtotal.textContent = "￥" + (value.newNumber * value.goodsPrice).toLocaleString()
      OL_culcTotal()
    }

    var subtotal = document.createElement("div")
    subtotal.style = "width: 50%; text-align: right; display: inline-block; _display: inline;"
    subtotal.textContent = "￥" + (value.goodsPrice * value.newNumber).toLocaleString()

    OL_goodsInfo.appendChild(goods)
    goods.appendChild(nameText)
    goods.appendChild(row)
    row.appendChild(num)
    row.appendChild(subtotal)
  })

  var onsRow = document.createElement("ons-list-item")

  var row = document.createElement("div")
  row.style = "width:100%; padding: 5px 5px; display: flex;flex-direction: row;flex-wrap: wrap;justify-content: space-around; align-items: baseline;"

  // 表示する商品を変えるボタン
  var leftButton = document.createElement("ons-button")
  leftButton.textContent = "←"
  leftButton.disabled = OL_group <= 0 ? true : false
  leftButton.onclick = () => {
    OL_removeDialogChildren()
    OL_reloadGoods(--OL_group)
  }

  var groupInfo = document.createElement("div")
  groupInfo.textContent = OL_group + 1 + "/" + Math.ceil(OL_targetOrderLog.length / maxRows)

  var rightButton = document.createElement("ons-button")
  rightButton.textContent = "→"
  rightButton.disabled = endIndex == OL_targetOrderLog.length ? true : false
  rightButton.onclick = () => {
    OL_removeDialogChildren()
    OL_reloadGoods(++OL_group)
  }


  OL_goodsInfo.appendChild(onsRow)
  onsRow.appendChild(row)
  row.appendChild(leftButton)
  row.appendChild(groupInfo)
  row.appendChild(rightButton)
}

function OL_removeAllGoods() {
  OL_targetOrderLog.forEach(value => value.newNumber = 0)
  OL_removeDialogChildren()
  OL_reloadGoods(OL_group)
}

function OL_pushEditedData() {
  pullRecords("Galley").then(r => {
    var targetGalley = Array.prototype.filter.call(r, value => { return value.orderLogId == targetOrderLogId })
    // 個数が変わった商品を抽出
    var editedData = OL_targetOrderLog.filter(value => { return value.number != value.newNumber })
    // そのうち準備待ちの商品を抽出
    var targerData = editedData.filter(value => {
      var galleyData = targetGalley.filter(value_ => { return value_.goodsObjectId == value.goodsObjectId })
      return galleyData.length == 1 && galleyData[0].state == 0
    })
    // 準備待ちでない商品があった場合はアラートを出す
    if (editedData.length != targerData.length) {
      var blockedGoodsNames = []
      editedData.filter(value => { return targerData.indexOf(value) == -1 }).forEach(value => blockedGoodsNames.push(value.goodsName))
      ons.notification.alert("以下の商品がすでに準備中です。\n" + blockedGoodsNames.join(", "))
    }
    else {
      // 更新するデータを頭から取り出していく
      targerData.forEach((data, index) => {
        // 0個のときは削除
        if (data.newNumber == 0) {
          deleteRecord("OrderLog", data.orderLogId, data.goodsObjectId)
            .catch(e => ons.notification.alert(e))
          deleteRecord("Galley", data.orderLogId, data.goodsObjectId, 0)
            .then(() => {
              if (targerData.length - 1 == index) {
                ons.notification.alert("更新完了")
                hideDialog("OL_dialog")
                loadTable("OL_table", "OrderLog", "orderDate");
              }
            })
            .catch(e => ons.notification.alert(e))
        }
        // それ以外は編集して更新
        else {
          // OrderLogとGalley両方を編集
          editRecord("OrderLog", data.orderLogId, data.goodsObjectId, "number", data.newNumber, "subtotal", data.goodsPrice * data.newNumber)
            .catch(e => ons.notification.alert(e))

          editRecord("Galley", data.orderLogId, data.goodsObjectId, 0, "number", data.newNumber)
            .then(() => {
              if (targerData.length - 1 == index) {
                ons.notification.alert("更新完了")
                hideDialog("OL_dialog")
                loadTable("OL_table", "OrderLog", "orderDate");
              }
            })
            .catch(e => ons.notification.alert(e))
        }
      })
    }
  })
}