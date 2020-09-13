// This is a JavaScript file

ons.ready(function () {
  console.log("Onsen UI is ready!");
});

window.fn = {};
window.fn.open = function () {
  var menu = document.getElementById('menu');
  menu.open();
};
// window.fn.open2 = function () {
//   var menu = document.getElementById('menu2');
//   menu.open();
// };
window.fn.load = function (page) {
  var content = document.getElementById('content');
  var menu = document.getElementById('menu');
  content
    .load(page)
    .then(menu.close.bind(menu));
};

if (ons.platform.isIPhoneX()) {
  document.documentElement.setAttribute('onsflag-iphonex-portrait', '');
  document.documentElement.setAttribute('onsflag-iphonex-landscape', '');
}

APP_VERSION = ""
$.getJSON("version.json", (data) => {
  APP_VERSION = data.version;
  console.log(APP_VERSION)
});
