// This is a JavaScript file
const elementGoodsList = ["goodsObjectId", "galleyMode", "inStock", "goodsName", "price", "isNewest"];
const elementOrderLogList = ["orderLogId", "goodsObjectId", "createDate", "number", "price"];
const elementGalleyList = ["orderLogId", "goodsObjectId", "team", "state", "number", "seatNum"];
const stateList=["準備待ち", "準備中", "配膳待ち"];

document.addEventListener('show', function(event){
  if(event.target.matches('#PM_main')){
    loadTable("PM_table","Goods","goodsObjectId");
  }else if(event.target.matches('#OL_main')){
    loadTable("OL_table","OrderLog","createDate");
  }else if(event.target.matches('#OD_main')){
    loadTable("OD_table","Galley","seatNum");
  }else{
  }
}, false);


/* テーブルのロード */
function loadTable(tableID, dbname, fixed){
  pullRecords(dbname).then(function(r){
    list = r;
    deleteTable(tableID);
    makeTable(tableID, dbname, list, fixed);
  }).catch(function (e){
    alert(e);
  });
}

/*tableの削除*/
function deleteTable(id) {
  var table = document.getElementById(id);
  var rowLen = table.rows.length;
  //上の行から削除していくと下の行がずれていくので下から検査
  for (var i = rowLen-1; i > 0; i--) {
      table.deleteRow(i);
  }
}


/* テーブル作成 */
function makeTable(tableID, dbname, list, fixed){
  var GoodsObIDList = new Array(list.length);
  switch(dbname){
    case "Goods":
      var goodsIdNum = "null";
      break;
    case "OrderLog":
      var goodsIdNum = elementOrderLogList.indexOf("goodsObjectId");
      break;
    case "Galley":
      var goodsIdNum = elementGalleyList.indexOf("goodsObjectId");
      break;
    default:
      alert("Internal Error: Part of the program is wrong. (Error location: makeTable() function)")
      break;
  }
  for(i=0; i < list.length && goodsIdNum != "null"; i++){
    GoodsObIDList[i] = list[i][goodsIdNum];
  }
  getGoodsNames(dbname, GoodsObIDList).then(function(r){
    let goodsNameList = r;
    makeRow(tableID, dbname, list, goodsNameList, fixed);
  })
  .catch(function(e){
    alert(e);
  });
}

function getGoodsNames(dbname, list){
  return new Promise(function (resolve, reject){
    Pr_getGoodsNames(function (r) { resolve(r); }, function (e) { reject(e); }, dbname, list);
  })
}
function Pr_getGoodsNames(success, failed, dbname, list){
  if(dbname=="OrderLog" || dbname=="Galley"){
    translateIdsToNames(list).then(function(r){
      const goodsNameList = r;
      success(goodsNameList);
    })
    .catch(function (e){
      alert(e);
    });
  }else if(dbname=="Goods"){
    success("null");
  }else{
    failed("Error: Different TableID is entered.");
  }
}

function makeRow(tableID, dbname, list, goodsNameList, fixed){
  switch(dbname){
    case "Goods":
      var fixedNum = elementGoodsList.indexOf(fixed);
      break;
    case "OrderLog":
      var fixedNum = elementOrderLogList.indexOf(fixed);
      break;
    case "Galley":
      var fixedNum = elementGalleyList.indexOf(fixed);
      break;
    default:
      alert("Internal Error: Part of the program is wrong. (Error location: makeRow() function)");
      break;
  }
  var value="";
  var old_value="";
  var tableEle = document.getElementById(tableID);
  for (var i=0; i < list.length; i++){
    var tr = document.createElement('tr');
    if(old_value != list[i][fixedNum]){
      for(j=i+1, c=1, old_value=list[i][fixedNum]; j < list.length && old_value == list[j][fixedNum]; j++, c++);
      switch(dbname){
        case "Goods":
          break;
        case "OrderLog":
          var td = document.createElement('td');
          td.style.textAlign = "center";
          td.rowSpan = c;
          td.innerHTML = list[i][fixedNum];
          tr.appendChild(td);
          break;
        case "Galley":
          // 座席番号の表示
          var td = document.createElement('td');
          td.style.textAlign = "center";
          td.rowSpan = c;
          td.innerHTML = list[i][fixedNum];
          tr.appendChild(td);
          break;
        default:
          alert("Internal Error: Part of the program is wrong. (Error location: makeRow() function)");
          break;
      }
    }
    alert(list)
    switch(dbname){
      case "Goods":
        tr = PM_makeCell(tr, list, i);
        break;
      case "OrderLog":
        tr = OL_makeCell(tr, list, goodsNameList, i);
        if(value != list[i][fixedNum]){
          var sum_price=0;
          for(j=i+1, count=1, value=list[i][fixedNum]; j < list.length && value == list[j][fixedNum]; j++, count++){
            sum_price += list[i][elementOrderLogList.indexOf("price")];
          }
          var td = document.createElement('td');
          td.style.textAlign = "center";
          td.rowSpan = count;
          td.innerHTML = sum_price;
          tr.appendChild(td);
        }
        alert(goodsNameList)
        break;
      case "Galley":
        tr = OD_makeCell(tr, list, goodsNameList, i);
        break;
      default:
        break;
    }
    tableEle.appendChild(tr);
  }
}


function PM_makeCell(tr, list, i){
  for (var j=1; j < 5; j++) {
    var td = document.createElement('td');
    td.style.textAlign = "center";
    var value = list[i][j];
    switch(j){
      case 1:
        if(value == 1){
          td.innerHTML = "<span style='float: center;'>👀</span>";
        }else{
          td.innerHTML = "<span style='float: center;'></span>";
        }
        break; 
      case 2:
        if(value == 1){
          td.innerHTML = "<span style='float: center;'>○</span>";
        }else{
          td.innerHTML = "<span style='float: center;'>X</span>";
        }
        break;        
      case 3:
        td.innerHTML = "<span style='float: left;'>"+value+"</span> <span style='float: right;'><input type='button' id="+i+" value='編集' onclick='getId(this);'> </span>";
        break;     
      case 4:
        td.innerHTML = "<span style='float: center;'>"+value+"</span>";
        break;  
      default:
        break;
    }
    tr.appendChild(td);
  }
  return tr;
}


function OL_makeCell(tr, list, goodsNameList, i){
  // 商品名の表示
  var td = document.createElement('td');
  td.innerHTML = goodsNameList[i];
  tr.appendChild(td);
  // 個数の表示
  var td = document.createElement('td');
  td.style.textAlign = "center";
  td.innerHTML = list[i][elementOrderLogList.indexOf("number")];
  tr.appendChild(td);
  return tr;
}


function OD_makeCell(tr, list, goodsNameList, i){
  // 商品名の表示
  var td = document.createElement('td');
  td.innerHTML = goodsNameList[i];
  tr.appendChild(td);
  // 個数の表示
  var td = document.createElement('td');
  td.style.textAlign = "center";
  td.innerHTML = list[i][4];
  tr.appendChild(td);
  // ボタンの作成
  var td = document.createElement('td');
  td.className = "OD_table4";
  td.style.textAlign = "center";
  if(list[i][3] == 0){
    td.innerHTML = "<ons-button style='width:100%;height:100%;' id="+ 'back_' +i+ " disabled='true' onclick='getId(GalleyList, this.id);'>←</ons-button>";
  }else{
    td.innerHTML = "<ons-button style='width:100%;height:100%;' id="+'back_' +i+ "  onclick='OD_stateUpedate(GalleyList, this.id);'>←</ons-button>";
  }
  tr.appendChild(td);
  // 状態の表示
  var td = document.createElement('td');
  td.className = "OD_table5";
  td.style.textAlign = "center";
  td.innerHTML = stateList[list[i][3]];  
  tr.appendChild(td);
  // ボタンの作成
  var td = document.createElement('td');
  td.style.textAlign = "center";
  td.innerHTML = "<ons-button style='width:100%;height:100%;' id="+'next_'+i+" onclick='OD_stateUpedate(GalleyList, this.id);'>→</ons-button>";
  tr.appendChild(td);
  return tr;
}