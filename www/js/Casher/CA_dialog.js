// This is a JavaScript file
function CA_selectNum(id) {
  switch (id.split("_")[1]) {
    case ("button"):
      CA_hideDialog(Number(id.split("_")[2]));
      break;
    case ("textbox"):
      CA_hideDialog(Number(document.getElementById(id).value));
      break;
    default:
      alert("error in www/html/Casher/CA_dialog.js");
  };
}