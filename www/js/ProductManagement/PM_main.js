// js/ProductManagement/PM_main.js

var PM_cellNum;

/* 画面遷移時のリロード */
document.addEventListener('show', function(event) {
  if (event.target.matches('#ProductManagement')) {
    
    PM_loadTable();

  }
}, false);


function PM_loadTable(){

  pullRecords("Goods")
  .then(function(list){

    GoodsList=list;
    deleteTable("PM_table");
    makeTable(GoodsList);

  }).catch(function (e){
    alert(e);
  });
  
}


/* テーブルの作成 */
function makeTable(List){

  var tableEle = document.getElementById('PM_table');
  for (var i=0; i < List.length; i++) {

    if(GoodsList[i][5] == 1){
      var tr = document.createElement('tr');

      for (var j=1; j < 5; j++) {
        var td = document.createElement('td');
        td.style.textAlign = "center";
        var value = List[i][j];
        td.innerHTML = makeCell(i,j, value,);

        tr.appendChild(td);
      }
      tableEle.appendChild(tr);
    }
  }
}

/* セルの動的作成 */
function makeCell(i=0, j, value){
  
  var rturn_value;
  switch(j){
    case 1:
      if(value == 1){
        return_value = "<span style='float: center;'>👀</span>";
      }else{
        return_value = "<span style='float: center;'></span>";
      }
      break;
          
      case 2:
        if(value == 1){
          return_value = "<span style='float: center;'>○</span>";
        }else{
          return_value = "<span style='float: center;'>X</span>";
        }
        break;
          
      case 3:
        return_value = "<span style='float: left;'>"+value+"</span> <span style='float: right;'><input type='button' id="+i+" value='編集' onclick='getId(this);'> </span>";
        break;
          
      case 4:
        return_value = "<span style='float: center;'>"+value+"</span>";
        break;
          
      default:
        break;
  }
  return return_value;
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


/*商品追加・編集への遷移*/
var addProductEdit = function(num=-1) {
      var dialog = document.getElementById('PM_dialog');

      if (dialog) {

        dialog.show();
        /* 商品追加・編集画面への初期値の代入 */
        InitValue_addProductEdit(num);
      } else {

       ons.createElement('html/ProductManagement/PM_dialog.html', { append: true })
      .then(function(dialog) {

        dialog.show();
        /* 商品追加・編集画面への初期値の代入 */
        InitValue_addProductEdit(num);
      });
    }
  };



/*編集ボタンクリック時の処理*/
function getId(ele){
    var PM_cellNum = ele.id; // eleのプロパティとしてidを取得
    alert(PM_cellNum);
    // console.log(id_value); //「id01」
    addProductEdit(PM_cellNum);
}
