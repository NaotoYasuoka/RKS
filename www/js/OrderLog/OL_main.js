// This is a JavaScript file
const stateObjects={ 0:'準備待ち', 1:'準備中', 2:'配膳待ち' };
dialogIDObjects={"PM":"PM_dialog", "OL":"OL_dialog", "OD":"OD_dialog"};
dialogPathObjects={"PM":"html/ProductManagement/PM_dialog.html", 
            "OL":"html/OrderLog/OL_dialog.html", 
            "OD":"html/OrderDisplay/OD_dialog.html"};
dbNameObjects={"PM":"Goods", "OL":"OrderLog", "OD":"Galley"};

document.addEventListener('show', function(event){
  if(event.target.matches('#PM_main')){
    loadTable("PM_table","Goods","goodsObjectId");
  }else if(event.target.matches('#OL_main')){
    loadTable("OL_table","OrderLog","orderDate");
  }else if(event.target.matches('#OD_main')){
    loadTable("OD_table","Galley","seatNum");
  }else{
  }
}, false);


/* テーブルのロード */
function loadTable(tableID, dbname, fixed){
  pullRecords(dbname).then(function(r){
    obj = r;
    deleteTable(tableID);
    makeTable(tableID, dbname, obj, fixed);
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
function makeTable(tableID, dbname, obj, fixed){
  var GoodsObIDList = new Array(obj.length);

  // GoodsObjectID → 商品名取得
  switch(dbname){
    case "Goods":
      break;
    case "OrderLog":
    case "Galley":
      for(i=0; i < obj.length; i++){
        GoodsObIDList[i] = obj[i]["goodsObjectId"];
      }
      break;
  }

  getGoodsNames(dbname, GoodsObIDList).then(function(r){
    let goodsNameList = r;
    makeRow(tableID, dbname, obj, goodsNameList, fixed);
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

/* テーブルのRow部分作成 */
function makeRow(tableID, dbname, obj, goodsNameList, fixed){
  var value="";
  var old_value="";
  var tableEle = document.getElementById(tableID);

  for (var i=0; i < obj.length; i++){
    var tr = document.createElement('tr');

    if(old_value != obj[i][fixed]){
      modificat = 1;
      for(var j=i+1,c=1, old_value=obj[i][fixed]; j < obj.length && old_value == obj[j][fixed]; j++, c++);
      switch(dbname){
        case "Goods":
          break;
        case "OrderLog":
          var td = document.createElement('td');
          td.style.textAlign = "center";
          td.rowSpan = c;
            td.innerHTML = obj[i][fixed] + "<br><br><span style='float: right;'><input type='button' id="+"OL_button_"+obj["orderLogId"]+" value='編集' onclick='getID(this.id);'></spen>";
          tr.appendChild(td);
          break;
        case "Galley":
        var td = document.createElement('td');
          td.style.textAlign = "center";
          td.rowSpan = c;
          if(obj[i][fixed] != -1){
            td.innerHTML = obj[i][fixed];
          }else{
            td.innerHTML = '―';
          }
          tr.appendChild(td);
          break;
        default:
          alert("Internal Error: Part of the program is wrong. (Error location: makeRow() function)");
          break;
      }
    }else{
      modificat = 0;
    }
    switch(dbname){
      case "Goods":
        tr = PM_makeCell(tr, obj, i);
        break;
      case "OrderLog":
        tr = OL_makeCell(tr, obj, goodsNameList, i);
        if(modificat){
          var sum_price = 0;
          for(j=i; j < i+c; j++){
            sum_price += obj[j]["subtotal"];
          }
          var td = document.createElement('td');
          td.style.textAlign = "center";
          td.rowSpan = c;
          td.innerHTML = sum_price;
          tr.appendChild(td);
        }
        break;
      case "Galley":
        tr = OD_makeCell(tr, obj, goodsNameList, i);
        break;
      default:
        break;
    }
    tableEle.appendChild(tr);
  }
}


function PM_makeCell(tr, obj, i){
  // 厨房モードの有無の表示
  var td = document.createElement('td');
  td.style.textAlign = "center";
  if(obj[i]["galleyMode"]){
    td.innerHTML = "<span style='float: center;'>👀</span>";
  }else{
    td.innerHTML = "<span style='float: center;'></span>";
  }
  tr.appendChild(td);
  // 在庫の有無の表示
  var td = document.createElement('td');
  td.style.textAlign = "center";
  if(obj[i]["inStock"] == 1){
    td.innerHTML = "<span style='float: center;'>○</span>";
  }else{
    td.innerHTML = "<span style='float: center;'>X</span>";
  }
  tr.appendChild(td);
  // 商品名の表示
  var td = document.createElement('td'); 
  td.innerHTML = "<span style='float: left;'>"+obj[i]["goodsName"]+"</span> <span style='float: right;'><input type='button' id="+"PM_button_"+i+" value='編集' onclick='getID(this.id);'> </span>";
  tr.appendChild(td);
  // 値段の表示
  var td = document.createElement('td');
  td.style.textAlign = "center";
  td.innerHTML = "<span style='float: center;'>"+obj[i]["price"]+"</span>";
  tr.appendChild(td);

  return tr;
}


function OL_makeCell(tr, obj, goodsNameList, i){
  // 商品名の表示
  var td = document.createElement('td');
  td.innerHTML = goodsNameList[i];
  tr.appendChild(td);
  // 個数の表示
  var td = document.createElement('td');
  td.style.textAlign = "center";
  td.innerHTML = obj[i]["number"];
  tr.appendChild(td);
  return tr;
}


function OD_makeCell(tr, obj, goodsNameList, i){
  // 商品名の表示
  var td = document.createElement('td');
  td.innerHTML = goodsNameList[i];
  tr.appendChild(td);
  // 個数の表示
  var td = document.createElement('td');
  td.style.textAlign = "center";
  td.innerHTML = obj[i]["number"];
  tr.appendChild(td);
  // ボタンの作成
  var td = document.createElement('td');
  td.className = "OD_table4";
  td.style.textAlign = "center";
  if(obj[i]["state"] == 0){
    td.innerHTML = "<ons-button style='width:100%;height:100%;' id="+ 'OL_back_' +i+ " disabled='true' onclick='getId(GalleyList, this.id);'>←</ons-button>";
  }else{
    td.innerHTML = "<ons-button style='width:100%;height:100%;' id="+'OL_back_' +i+ "  onclick='OD_stateUpedate(GalleyList, this.id);'>←</ons-button>";
  }
  tr.appendChild(td);
  // 状態の表示
  var td = document.createElement('td');
  td.className = "OD_table5";
  td.style.textAlign = "center";
  td.innerHTML = stateObjects[obj[i]["state"]];  
  tr.appendChild(td);
  // ボタンの作成
  var td = document.createElement('td');
  td.style.textAlign = "center";
  td.innerHTML = "<ons-button style='width:100%;height:100%;' id="+'OD_next_'+i+" onclick='OD_stateUpedate(GalleyList, this.id);'>→</ons-button>";
  tr.appendChild(td);
  return tr;
}

function getID(id){
  var splitID = id.split("_");
  makeDialog(splitID[0], splitID[1], splitID[2]);
}

var makeDialog = function(name, state, num) {
  var dialog = document.getElementById(dialogIDObjects[name]);
  alert(dialog);
  if (dialog) {
    alert("表示します");
    dialog.show();
    editDialogSelector(name, state, num);
  }else {
    ons.createElement(dialogPathObjects[name], { append: true })
    .then(function(dialog) {
      alert("表示します");
      dialog.show();
      editDialogSelector(name, state, num);
    });
  }
};

function editDialogSelector(name, state, num){
  pullRecords(dbNameObjects[name]).then(function(r){
    var obj = r;
    switch(name){
      case "PM":
        PM_editDialog(obj, num);
        break;
      case "OL":
        OL_editDialog(obj, num);
        break;
      case "OD":
        OD_editDialog(obj, state, num);
        break;
    }
  }).catch( function(e){
    alert(e);
  })
}

/* 商品追加・編集画面のテキスト表示 */
function PM_editDialog(obj, num){
  if(num == -1){
    document.getElementById("PM_addPE_Title").innerText = "商品追加";
    // 厨房モード：ON 
    var switch_value = document.getElementById("PM_switch_1");
    switch_value.checked = true;
    // 在庫あり：ON
    var switch_value = document.getElementById("PM_switch_2");
    switch_value.checked = true;
    // 名前入力なし
    document.getElementById( "PM_textbox_1" ).value = "";
    // 値段入力なし
    document.getElementById( "PM_textbox_2" ).value = "";
    var button_value = document.getElementById("PM_deleteButton");
    button_value.disabled = true;

  }else{
    document.getElementById("PM_addPE_Title").innerText = "商品編集";
    // 厨房モードの選択
    if(obj[num]["galleyMode"] == 1){
      var switch_value = document.getElementById("PM_switch_1");
      switch_value.checked = true;
    }else{
      var switch_value = document.getElementById("PM_switch_1");
      switch_value.checked = false;
    }
    // 在庫の有無の選択
    if(obj[num]["inStock"] == 1){
      var switch_value = document.getElementById("PM_switch_2");
      switch_value.checked = true;
    }else{
      var switch_value = document.getElementById("PM_switch_2");
      switch_value.checked = false;
    }
    // 商品名の表示
    document.getElementById( "PM_textbox_1" ).value = obj[num]["goodsName"] ;
    // 金額の表示
    document.getElementById( "PM_textbox_2" ).value = obj[num]["price"] ;
    // 削除ボタンを押せなくする
    var button_value = document.getElementById("PM_deleteButton");
    button_value.disabled = false;
  }
}

function OD_editDialog(obj, state, num){
  goodsNum = obj[num]["number"];
  for(var i=goodsNum+1; i <= 6;i++){
    var buttonID = "OD_button_" + String(i);
    var button_value = document.getElementById(buttonID);
    button_value.disabled = true;
  }
}

function OL_editDialog(obj, num){
  OL_OrderDate.innerHTML = "会計日時：";
  OL_seatNum.innerHTML = "座席番号："

}