// js/ProductManagement/PM_dialog

/*dialogから商品管理画面への遷移*/
var hideDialog = function(id) {
  document
    .getElementById(id)
    .hide();
};

/* 商品編集画面の値の削除 */
function deleteGoods(id) {
  hideDialog(id);
  editRecord("Goods", GoodsList[PM_cellNum][0], "isNewest", 0).then(function(r){
    PM_loadTable();
  }).catch(function (e){
    alert(e);
  });

}


/* 商品追加・編集画面の値の保存 */
function saveGoods(id) {

  var list = new Array(1);
  var galley_switch;
  var stock_switch;

  var swtch_id = document.getElementById('PM_switch_1');
  if (swtch_id.checked) {
    galley_switch = 1;
  }else{
    galley_switch = 0;
  }

  swtch_id = document.getElementById('PM_switch_2');
  if (swtch_id.checked == true) {
    stock_switch = 1;
  }else{
    stock_switch = 0;
  }

  var GoodsName = document.getElementById('PM_textbox_1').value;
  var price = document.getElementById('PM_textbox_2').value;

  if(price = Number(price)){

    if(GoodsName != "" && price){
      hideDialog(id);
      if(PM_cellNum == -1){

        addRecord("Goods", galley_switch, stock_switch, GoodsName, price, 1).then(function(r){
          PM_loadTable();
        }).catch(function (e){
          alert(e);
        });

      }else if(GoodsName == GoodsList[PM_cellNum][3] && price == GoodsList[PM_cellNum][4]){

        editRecord("Goods", GoodsList[PM_cellNum][0], "galleyMode", galley_switch, "inStock", stock_switch).then(function(r){
          PM_loadTable();
        }).catch(function (e){
          alert(e);
        });

      }else{

        editRecord("Goods", GoodsList[PM_cellNum][0], "isNewest", 0).then(function(r){
          addRecord("Goods", galley_switch, stock_switch, GoodsName, price, 1).then(function(r){
            PM_loadTable();
          }).catch(function (e){
            alert(e);
          });
        }).catch(function (e){
          alert(e);
        });
      }


    }else{
      alert("商品名もしくは、値段が入力されていません。");
    }
  }else{
    alert("値段が正しく入力されていません。");
  }

}



/* 商品追加・編集画面のテキスト表示 */
function InitValue_addProductEdit(num){

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
    if(GoodsList[num][1] == 1){
      var switch_value = document.getElementById("PM_switch_1");
      switch_value.checked = true;
    }else{
      var switch_value = document.getElementById("PM_switch_1");
      switch_value.checked = false;
    }
    // 在庫の有無の選択
    if(GoodsList[num][2] == 1){
      var switch_value = document.getElementById("PM_switch_2");
      switch_value.checked = true;
    }else{
      var switch_value = document.getElementById("PM_switch_2");
      switch_value.checked = false;
    }
    // 商品名の表示
    document.getElementById( "PM_textbox_1" ).value = GoodsList[num][3] ;
    // 金額の表示
    document.getElementById( "PM_textbox_2" ).value = GoodsList[num][4] ;


    var button_value = document.getElementById("PM_deleteButton");
    button_value.disabled = false;
  }
}