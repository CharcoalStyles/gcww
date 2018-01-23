var walletId = ""
	document.addEventListener('DOMContentLoaded', function () {
		var updateButton = document.getElementById('update');
		updateButton.addEventListener('click', doUpdate, false);

		var settingsButton = document.getElementById('settings');
		settingsButton.addEventListener('click', function () {
			chrome.runtime.openOptionsPage();
		}, false);

		chrome.storage.sync.get({
			walletId: ""
		}, function (items) {
			walletId = items.walletId;
			doUpdate();
		});
	}, false);

function doUpdate() {
	var balanceSpan = document.getElementById('balance');

	if (walletId.length == 0) {
		balanceSpan.innerHTML = "No wallet set";
	} else {
		var request = new XMLHttpRequest();
		request.open('GET', 'http://52.89.91.13/ext/getbalance/' + walletId, true);

		balanceSpan.innerHTML = "<img src='\icon.png' class='image'>";

		request.onload = function () {
			var resp = request.responseText;
			if (request.status >= 200 && request.status < 400) {
				try {
					var json = JSON.parse(request.responseText);
					if ("error" in json) {
						balanceSpan.innerHTML = json["error"];
					} else {
						balanceSpan.innerHTML = resp;
					}
				} catch (exception) {
					balanceSpan.innerHTML = resp + "&#9404;";
				}
			} else {
				balanceSpan.innerHTML = "ERR";
			}
		};

		request.onerror = function () {
			balanceSpan.innerHTML = "ERR";
		};

		request.send();
	}
}
