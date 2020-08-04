// This is a JavaScript file
document.addEventListener('preshow', function (event) {
  if (event.target.matches('#CA_dialog2')) {
    document.getElementById("CA_textbox").value = null;
  }
}, false);
function CA_selectSeat(id) {
  switch (id.split("_")[1]) {
    case ("button"):
      CA_onSelectedSeat(Number(id.split("_")[2]));
      break;
    case ("textbox"):
      if(document.getElementById(id).value) CA_onSelectedSeat(Number(document.getElementById(id).value));
      break;
    default:
      alert("error in www/html/Casher/CA_dialog2.js");
  };
}