// This is a JavaScript file

function OD_selectNum(id){
  const splitID = id.split("_");
  let selectNum;

  if(splitID[0] == "ODButton"){
    selectNum = Number(splitID[1]);
  }else{
    selectNum = Number(document.getElementById("OD_textbox").value);
  }
  alert(selectNum);
}

