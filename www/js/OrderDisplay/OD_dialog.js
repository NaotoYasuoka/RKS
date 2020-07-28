// This is a JavaScript file

function OD_selectNum(id){
  var splitID = id.split("_");

  if(splitID[0] == "ODButton"){
    selectNum = Number(splitID[1]);
  }else{
    selectNum = Number(document.getElementById("OD_textbox").value);
  }
}

