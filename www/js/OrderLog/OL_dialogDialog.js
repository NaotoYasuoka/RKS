document.addEventListener('preshow', function (event) {
  if (event.target.matches('#OL_dialogDialog')) {
    OL_dialogDialogText.appendChild(document.getElementById("OL_totals").cloneNode(true))
    console.log(document.getElementById("OL_currentTotal").textContent)
  }
}, false);

var OL_createAlertDialog = function () {
  var dialog = document.getElementById('OL_dialogDialog');

  if (dialog) {
    dialog.show();
  } else {
    ons.createElement('html/OrderLog/OL_dialogDialog.html', { append: true })
      .then(function (dialog) {
        dialog.show();
      });
  }
};

var OL_hideAlertDialog = function (flag = false) {
  document
    .getElementById('OL_dialogDialog')
    .hide()
    .then(() => { if (flag) OL_pushEditedData(); });
};

document.addEventListener('prehide', function (event) {
  if (event.target.matches('#OL_dialogDialog')) {
    while (OL_dialogDialogText.firstChild) OL_dialogDialogText.removeChild(OL_dialogDialogText.firstChild)
  }
}, false);