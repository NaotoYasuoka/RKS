// This is a JavaScript file
function OD_selectNum(obj, id){
  const splitID = id.split("_");
  let selectNum;

  if(splitID[1] == "button"){
    selectNum = splitID[2];
  }else{
    selectNum = document.getElementById("OD_textbox").value;
  }
  var carousel = document.getElementById('carousel');
  var carouselNum = carousel.getActiveIndex()+1;

  if(Number(selectNum) && selectNum >= 0){
    BeginLoading()
    var GoodsNum = obj[ClickInfoObjects.num]["number"];
    if(selectNum <= GoodsNum){
      hideDialog("OD_dialog");
      if(GoodsNum == selectNum){
        editRecord("Galley", obj[ClickInfoObjects.num]["orderLogId"], obj[ClickInfoObjects.num]["goodsObjectId"], obj[ClickInfoObjects.num]["team"], "state", 1).then(function(r){
          editRecord("Galley", obj[ClickInfoObjects.num]["orderLogId"], obj[ClickInfoObjects.num]["goodsObjectId"], obj[ClickInfoObjects.num]["team"], "inCharge", Number(carouselNum)).then(function(r){
            EndLoading();
            loadTable("OD_table","Galley","seatNum");
          }).catch(function (e){
            alert(e);
          });
        }).catch(function (e){
          alert(e);
        });
      }else{
        for(i=0; obj[ClickInfoObjects.num]["orderLogId"] != obj[i]["orderLogId"] && 
                 obj[ClickInfoObjects.num]["goodsObjectId"] != obj[i]["goodsObjectId"]; i++);
        for(j=0; obj[ClickInfoObjects.num]["orderLogId"] == obj[i]["orderLogId"] && 
                 obj[ClickInfoObjects.num]["goodsObjectId"] == obj[i]["goodsObjectId"]; i++, j++);
        var remaining = GoodsNum - selectNum;
        editRecord("Galley", obj[ClickInfoObjects.num]["orderLogId"], obj[ClickInfoObjects.num]["goodsObjectId"], obj[ClickInfoObjects.num]["team"], "number", Number(remaining)).then(function(r){
          addRecord("Galley", obj[ClickInfoObjects.num]["orderLogId"], obj[ClickInfoObjects.num]["goodsObjectId"], j, 1, Number(selectNum), obj[ClickInfoObjects.num]["seatNum"], Number(carouselNum)).then(function(r){
            EndLoading();
            loadTable("OD_table","Galley","seatNum");
          }).catch(function(e){
            alert(e);
          });
        }).catch(function (e){
          alert(e);
        });
      }
    }else{
      alert("キーボードで入力された値が大きすぎます。")
    }
  }else{
    alert("入力された値が不適切です。");
  }
}

function OD_updateState(obj, id){
  let splitID = id.split('_');
  var ButtonInfoObjects={};
  ButtonInfoObjects.name = splitID[0];
  ButtonInfoObjects.state = splitID[1];
  ButtonInfoObjects.num = splitID[2];
  if(ButtonInfoObjects.state == "next"){
    let nextState = obj[ButtonInfoObjects.num]["state"] + 1;
    if( 3 == nextState){
      deleteRecord("Galley", obj[ButtonInfoObjects.num]["orderLogId"], obj[ButtonInfoObjects.num]["goodsObjectId"], obj[ButtonInfoObjects.num]["team"]).then(function(r){
        EndLoading();
        loadTable("OD_table","Galley","seatNum");
      }).catch(function (e){
        alert(e);
      });
    }else{
      editRecord("Galley", obj[ButtonInfoObjects.num]["orderLogId"], obj[ButtonInfoObjects.num]["goodsObjectId"], obj[ButtonInfoObjects.num]["team"], "state", nextState).then(function(r){
        EndLoading();
        loadTable("OD_table","Galley","seatNum");
      }).catch(function (e){
        alert(e);
      });
    }
  }else if(ButtonInfoObjects.state == "back"){
    let backState = obj[ButtonInfoObjects.num]["state"] - 1;
    editRecord("Galley", obj[ButtonInfoObjects.num]["orderLogId"], obj[ButtonInfoObjects.num]["goodsObjectId"], obj[ButtonInfoObjects.num]["team"], "state", Number(backState)).then(function(r){
      if( 0 == backState){
        editRecord("Galley", obj[ButtonInfoObjects.num]["orderLogId"], obj[ButtonInfoObjects.num]["goodsObjectId"], obj[ButtonInfoObjects.num]["team"], "inCharge", Number(0)).then(function(r){
          EndLoading();
          loadTable("OD_table","Galley","seatNum");
        }).catch(function (e){
          alert(e);
        });
      }else{
        EndLoading();
        loadTable("OD_table","Galley","seatNum");
      }
    }).catch(function (e){
      alert(e);
    });
  }else{
    alert("Error:")
  }
}