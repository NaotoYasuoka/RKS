// js/OrderDisplay/OD_main.js

var OD_cellNum;

document.addEventListener('show', function(event) {

  if (event.target.matches('#OD_main')) { 

    OD_loadTable();

  }
}, false);


/* テーブルのロード */
function OD_loadTable(){
  // alert("Hello!!");
  pullRecords("Galley")
  .then(function(list){
    
    GalleyList=list;
    deleteTable("OD_table");
    OD_makeTable(GalleyList);

  }).catch(function (e){
    alert(e);
  });

}


/* 注文表示画面のテーブル作成 */
function OD_makeTable(List){
  var old_value="";
  var tableEle = document.getElementById('OD_table');
  var goodsObIDList=new Array(GalleyList.length);
  for(i=0;i < GalleyList.length; i++){
    goodsObIDList[i] = GalleyList[i][1];
  }
  translateIdsToNames(goodsObIDList).then(function(r){
    const goodsNameList = r;
    for (var i=0; i < List.length; i++) {

      var tr = document.createElement('tr');

      if( old_value != List[i][0]){
        var cou = 1;
        old_value = List[i][0];
        var value = List[i][0];
        var c=i+1;
        while(c < List.length && value == List[c][0]){
          c++;
          cou++;
        }
        // 座席番号の表示
        var td = document.createElement('td');
        td.style.textAlign = "center";
        td.rowSpan = cou;
        td.innerHTML = List[i][5];
        tr.appendChild(td);
      }

      // 商品名の表示
      var td = document.createElement('td');
      td.innerHTML = goodsNameList[i];
      tr.appendChild(td);

      // 個数の表示
      var td = document.createElement('td');
      td.style.textAlign = "center";
      td.innerHTML = List[i][4];
      tr.appendChild(td);

      // ボタンの作成
      var td = document.createElement('td');
      td.className = "OD_table4";
      td.style.textAlign = "center";
      if(List[i][3] == 0){
        td.innerHTML = "<ons-button style='width:100%;height:100%;' id="+ 'back_' +i+ " disabled='true' onclick='getId(GalleyList, this.id);'>←</ons-button>";
      }else{
        td.innerHTML = "<ons-button style='width:100%;height:100%;' id="+'back_' +i+ "  onclick='OD_stateUpedate(GalleyList, this.id);'>←</ons-button>";
      }
      tr.appendChild(td);

      // 状態の表示
      var td = document.createElement('td');
      td.className = "OD_table5";
      td.style.textAlign = "center";
      td.innerHTML = OD_makeCell(List[i][3]);
      tr.appendChild(td);
      // ボタンの作成
      var td = document.createElement('td');
      td.style.textAlign = "center";
      td.innerHTML = "<ons-button style='width:100%;height:100%;' id="+'next_'+i+" onclick='OD_stateUpedate(GalleyList, this.id);'>→</ons-button>";
      tr.appendChild(td);

      tableEle.appendChild(tr);
    }

  }).catch(function(e){
    alert(e);
  });
}


function OD_makeCell(value){

  var return_value;

  switch(value){
    case 0:
      return_value = "準備待ち";
      break;
    case 1:
      return_value = "準備中";
      break;
    case 2:
      return_value = "配膳待ち";
      break;

    default:
      return_value = value;
      break;
  }
  return return_value;
}


function OD_stateUpedate(List, buttonID){

  alert(buttonID);
  const splitID = buttonID.split('_');
  OD_cellNum = splitID[1];
  switch(splitID[0]){
    case "back":
      var status = GalleyList[OD_cellNum][3]-1;
      break;

    case "next":
      var status = GalleyList[OD_cellNum][3]+1;
      if(status == 1){
        selectQuantityDialog();
      }
      break;

    default:
     break;
  }
  if(status == 3){
    deleteRecord("Galley", GalleyList[OD_cellNum][0], GalleyList[OD_cellNum][1], GalleyList[OD_cellNum][2]).then(function(r){
      OD_loadTable();
    }).catch(function(e){
      alert(e);
      });
  
  }else if(status != 1){
    editRecord("Galley", GalleyList[OD_cellNum][0], GalleyList[OD_cellNum][1], GalleyList[OD_cellNum][2], "state", status).then(function(r){
      OD_loadTable();
    }).catch(function (e){
      alert(e);
    });
  }

}


var selectQuantityDialog = function() {
      var dialog = document.getElementById('OD_dialog');

      if (dialog) {
        dialog.show();
        OD_initValue(GalleyList[OD_cellNum][4]);
      } else {

       ons.createElement('html/OrderDisplay/OD_dialog.html', { append: true })
      .then(function(dialog) {
        dialog.show();
        OD_initValue(GalleyList[OD_cellNum][4]);

      });
    }
  };