// This is a JavaScript file
document.addEventListener('preshow', function (event) {
  if (event.target.matches('#CA_dialog')) {
    document.getElementById("CA_textbox").value = null;
  }
}, false);
function CA_selectNum(id) {
  switch (id.split("_")[1]) {
    case ("button"):
      CA_onSelectedNum(Number(id.split("_")[2]));
      break;
    case ("textbox"):
    if(document.getElementById(id).value) CA_onSelectedNum(Number(document.getElementById(id).value));
      break;
    default:
      alert("error in www/html/Casher/CA_dialog.js");
  };
}
function CA_keepPositive(obj) {
  obj.value = obj.value < 1 ? 1 : obj.value;
}