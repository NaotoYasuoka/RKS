// This is a JavaScript file
document.addEventListener('show', function (event) {
  if (event.target.matches('#Home')) {
    while (menu.firstChild) menu.removeChild(menu.firstChild)
  }
}, false);

function makeRegiSidebar() {
  if (!menu.firstChild) {
    var sidemenu = document.createElement("ons-page")
    sidemenu.innerHTML = "<ons-list>	<ons-list-item>		<div class=left><img class=list-item__thumbnail src=image/RKS_ic.png></div>		<div class=center><strong>RKかたつむり</strong></div>	</ons-list-item>	<ons-list-item class=coler_back_red style='color:white;'>		<div class=left><img class=list-item__thumbnail src=image/Rezi.png></div>		<div class=center><strong>会計モード</strong></div>	</ons-list-item>	<ons-list-item onclick=fn.load('html/Home/Home.html') modifier=chevron tappable>		<div class=left><img class=list-item__thumbnail src=image/Home.png></div>		<div class=center>ホーム</div>	</ons-list-item>	<ons-list-item onclick=fn.load('html/Casher/CA_main.html') modifier=chevron tappable>		<div class=left><img class=list-item__thumbnail src=image/Casher.png></div>		<div class=center>会計</div>	</ons-list-item>	<ons-list-item onclick=fn.load( 'html/ProductManagement/PM_main.html') modifier=chevron tappable>		<div class=left><img class=list-item__thumbnail src=image/ProductManagement.png></div>		<div class=center>商品管理</div>	</ons-list-item>	<ons-list-item onclick=fn.load( 'html/OrderLog/OL_main.html') modifier=chevron tappable>		<div class=left><img class=list-item__thumbnail src=image/OrderLog.png></div>		<div class=center>商品履歴</div>	</ons-list-item></ons-list><div style='position: absolute; bottom: 10px; left: 10px; right: 10px;text-align: center;'><ons-list-item>バージョン：" + APP_VERSION + "</ons-list-item><ons-button onclick=switchToKitchen() style='display: inline-block;'>厨房モード</ons-button></div>"
    menu.appendChild(sidemenu)
  }
}
//
function makeKitchenSidebar() {
  if (!menu.firstChild) {
    var sidemenu = document.createElement("ons-page")
    sidemenu.innerHTML = "<ons-list>	<ons-list-item>		<div class=left><img class=list-item__thumbnail src=image/RKS_ic.png></div>		<div class=center><strong>RKかたつむり</strong></div>	</ons-list-item>		<ons-list-item style='color:white; background: #0076ff;'>		<div class=left><img class=list-item__thumbnail src=image/Kit.png></div>		<div class=center><strong>厨房モード</strong></div></ons-list-item>	<ons-list-item onclick=fn.load('html/Home/Home.html') modifier=chevron tappable>		<div class=left><img class=list-item__thumbnail src=image/Home.png></div>		<div class=center>ホーム</div>	</ons-list-item>	<ons-list-item onclick=fn.load('html/OrderDisplay/OD_main.html') modifier=chevron tappable>			<div class=left><img class=list-item__thumbnail src=image/Galley.png></div>			<div class=center>注文表示</div>		</ons-list-item></ons-list><div style='position: absolute; bottom: 10px; left: 10px; right: 10px;text-align: center;'><ons-list-item>バージョン：" + APP_VERSION + "</ons-list-item><ons-button onclick=switchToRegi() style='display: inline-block; background: red;'>会計モード</ons-button></div>"
    menu.appendChild(sidemenu)
  }
}

function switchToKitchen() {
  while (menu.firstChild) menu.removeChild(menu.firstChild)
  fn.load('html/OrderDisplay/OD_main.html')
}

function switchToRegi() {
  while (menu.firstChild) menu.removeChild(menu.firstChild)
  fn.load('html/Casher/CA_main.html')
}