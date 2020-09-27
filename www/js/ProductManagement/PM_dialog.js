// js/ProductManagement/PM_dialog
/* 商品編集画面の値の削除 */
function PM_deleteGoods(obj, id) {
  hideDialog(id);
  editRecord("Goods", obj[ClickInfoObjects.num]["objectId"], "isNewest", 0).then(function(r){
    loadTable("PM_table","Goods","goodsObjectId");
  }).catch(function (e){
    alert(e);
  });
}

/* 商品追加・編集画面の値の保存 */
function PM_saveGoods(obj, id){
  if(ClickInfoObjects.name == "PM"){
    if(document.getElementById('PM_switch_1').checked){
      var galley_switch = 1;
    }else{
      var galley_switch = 0;
    }
    if(document.getElementById('PM_switch_2').checked){
      var stock_switch = 1;
    }else{
      var stock_switch = 0;
    }
    var GoodsName = document.getElementById('PM_textbox_1').value;
    var price = document.getElementById('PM_textbox_2').value;
    if(price != "" && GoodsName != ""){
      price == Number(price)
      if(GoodsName != "" && price){
        hideDialog(id);
      }
      if( "addButton" == ClickInfoObjects.state){
        addRecord("Goods", galley_switch, stock_switch, GoodsName, Number(price), 1).then(function(r){
          loadTable("PM_table","Goods","goodsObjectId");
        }).catch(function (e){
          alert(e);
        });
      }else if(GoodsName == obj[ClickInfoObjects.num]["goodsName"] && price == obj[ClickInfoObjects.num]["price"]){
        editRecord("Goods", obj[ClickInfoObjects.num]["objectId"], "galleyMode", galley_switch, "inStock", stock_switch).then(function(r){
          loadTable("PM_table","Goods","goodsObjectId");
        }).catch(function (e){
          alert(e);
        });
      }else{
        editRecord("Goods", obj[ClickInfoObjects.num]["objectId"], "isNewest", 0).then(function(r){
          addRecord("Goods", galley_switch, stock_switch, GoodsName, Number(price), 1).then(function(r){
            loadTable("PM_table","Goods","goodsObjectId");
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