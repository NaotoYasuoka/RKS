// This is a JavaScript file

function OD_initValue(num){
  for(var i=num+1; i <= 6;i++){
    var buttonID = "ODbutton_" + String(i);
    var button_value = document.getElementById(buttonID);
    button_value.disabled = true;
  }
}


function OD_selectNum(id){

  const splitID = id.split("_");
  let selectNum;

  if(splitID[0] == "ODbutton"){
    selectNum = Number(splitID[1]);
  }else{
    selectNum = Number(document.getElementById("OD_textbox").value);
  }
  
  if(selectNum <= GalleyList[OD_cellNum][4]){

    var GoodsNum = GalleyList[OD_cellNum][4];
    if(GoodsNum == selectNum){
      editRecord("Galley", GalleyList[OD_cellNum][0], GalleyList[OD_cellNum][1], GalleyList[OD_cellNum][2], "state", 1).then(function(r){
        OD_loadTable();
      }).catch(function (e){
        alert(e);
      });

    }else{
      GalleyList
      for(i=0; GalleyList[OD_cellNum][0]!=GalleyList[i][0] && GalleyList[OD_cellNum][1]!=GalleyList[i][1];i++);
      for(j=0;GalleyList[OD_cellNum][0]==GalleyList[i][0] && GalleyList[OD_cellNum][1]==GalleyList[i][1];j++,i++);
      alert(j);
      GoodsNum -= selectNum;
      editRecord("Galley", GalleyList[OD_cellNum][0], GalleyList[OD_cellNum][1], GalleyList[OD_cellNum][2], "number", GoodsNum).then(function(r){
        addRecord("Galley", GalleyList[OD_cellNum][0], GalleyList[OD_cellNum][1], j, 1, selectNum, GalleyList[OD_cellNum][5]).then(function(r){
          OD_loadTable();
        }).catch(function(e){
          alert(e);
        });
      }).catch(function (e){
        alert(e);
      });

    }
    hideDialog("OD_dialog");
  }else{
    alert("キーボードで入力された値が大きすぎます。")
  }
}