var wallets = []
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
				walletId: ""
			}
		]
	}, function (items) {
		if (items.walletId != '') {
			wallets.push({
				label: "wallet",
				walletId: items.walletId
			});
		} else {
			for (var i = 0; i < items.wallets.length; i++) {
				wallets.push({
					label: items.wallets[i].label,
					walletId: items.wallets[i].walletId
				});
			}
		}
		doUpdate();
	});
}, false);

function addLoadableWalletToTable(tableElem, label, showloader) {
	// Create an empty <tr> element and add it to the 1st position of the table:
	var row = tableElem.insertRow(0);

	// Insert new cells (<td> elements) at the 1st and 2nd position of the "new" <tr> element:
	var labelCell = row.insertCell(0);
	var balanceCell = row.insertCell(1);

	// Add some text to the new cells:
	labelCell.innerHTML = label;
	if (showloader)
		balanceCell.innerHTML = "<img src='\icon.png' class='image'>"; //balance + "&#9404;";
	return balanceCell;
}

function populateRow(tableRef, wallet) {
	var request = new XMLHttpRequest();
	request.open('GET', 'http://garli.co.in/ext/getbalance/' + wallet.walletId, true);

	var balElem = addLoadableWalletToTable(tableRef, wallet.label, true);
	request.onload = function () {
		var resp = request.responseText;
		if (request.status >= 200 && request.status < 400) {
			try {
				var json = JSON.parse(request.responseText);
				if ("error" in json) {
					balElem.innerHTML = json["error"];
				} else {
					balElem.innerHTML = resp;
				}
			} catch (exception) {
				balElem.innerHTML = resp + "&#9404;";
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
	var balanceTable = document.getElementById('BalanceTable');
	balanceTable.innerHTML = "";

	if (wallets.length == 1 && wallets[0] == '') {
		addLoadableWalletToTable(balanceTable, "No wallet set", false);
	} else {
		for (var i = wallets.length - 1; i >= 0 ; i--) {
			var wallet = wallets[i];
			populateRow(balanceTable, wallet);
		}
	}
}
