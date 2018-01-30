var wallets = []
var conv = {
	mBtc: 0,
	usd: 0
};
var rows = 0;

document.addEventListener('DOMContentLoaded', function () {
	var updateButton = document.getElementById('update');
	updateButton.addEventListener('click', doUpdate, false);

	var settingsButton = document.getElementById('settings');
	settingsButton.addEventListener('click', function () {
		chrome.runtime.openOptionsPage();
	}, false);

	chrome.storage.sync.get({
		walletId: "",
		wallets: [{
				label: "",
				walletId: "",
				showMbtc: false,
				showUsd: false
			}
		]
	}, function (items) {
		if (items.walletId != '') {
			wallets.push({
				label: "wallet",
				walletId: items.walletId
			});
		} else {
			wallets = items.wallets;
		}
		doUpdate();
	});
}, false);

function addLoadableWalletToTable(tableElem, label, showloader) {
	// Create an empty <tr> element and add it to the 1st position of the table:
	var row = tableElem.insertRow(rows);

	// Insert new cells (<td> elements) at the 1st and 2nd position of the "new" <tr> element:
	var labelCell = row.insertCell(0);
	var balanceCell = row.insertCell(1);

	// Add some text to the new cells:
	labelCell.innerHTML = label;
	if (showloader)
		balanceCell.innerHTML = "<img src='\icon.png' class='image'>"; //balance + "&#9404;";
	
	rows ++;
	
	return balanceCell;
}

function populateRow(tableRef, wallet) {
	var request = new XMLHttpRequest();
	request.open('GET', 'https://garli.co.in/ext/getbalance/' + wallet.walletId, true);

	var balElem = addLoadableWalletToTable(tableRef, wallet.label, true);
	request.onload = function () {
		var resp = request.responseText;
		if (request.status >= 200 && request.status < 400) {
			try {
				var json = JSON.parse(request.responseText);
				if ("error" in resp) {
					balElem.innerHTML = json["error"];
				} else {
					balElem.innerHTML = resp;
				}
			} catch (exception) {
				balElem.innerHTML = resp + "&#9404;";
				var bal = parseInt(resp);
					
				if (wallet.showMbtc && conv.mBtc > 0)
				{
					balElem.innerHTML += "<p class='minip'>" + (bal * conv.mBtc) + "mBtc</p>";
				}
				
				if (wallet.showUsd && conv.usd > 0)
				{
					balElem.innerHTML += "<p class='minip'>$" + (bal * conv.usd) + "USD</p>";
				}
			}
		} else {
			balElem.innerHTML = "ERR";
		}
	};

	request.onerror = function () {
		balElem.innerHTML = "ERR";
	};

	request.send();
}

function doUpdate() {
	var request = new XMLHttpRequest();
	request.open('GET', 'https://api.coinmarketcap.com/v1/ticker/garlicoin/', true);
	request.onload = function () {
		var resp = request.responseText;
		if (request.status >= 200 && request.status < 400) {
			var json = JSON.parse(request.responseText);
			conv = {
				mBtc: json[0].price_btc,
				usd: json[0].price_usd
			};
		}
	};
	request.send();
	
	var balanceTable = document.getElementById('BalanceTable');
	balanceTable.innerHTML = "";
	rows = 0;

	if (wallets.length == 1 && wallets[0] == '') {
		addLoadableWalletToTable(balanceTable, "No wallet set", false);
	} else {
		for (var i = 0; i < wallets.length ; i++) {
			var wallet = wallets[i];
			populateRow(balanceTable, wallet);
		}
	}
}
