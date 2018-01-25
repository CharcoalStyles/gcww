function addInput(label, wallet) {
	var walletsDiv = document.getElementById('walletsList');

	var labelTxt = document.createElement("input"); //input element, text
	labelTxt.setAttribute('type', "text");
	labelTxt.setAttribute('value', label);
	labelTxt.style.cssText = "width: 160px; margin-top: 10px; margin-right: 10px;";
	walletsDiv.appendChild(labelTxt);

	var walletTxt = document.createElement("input"); //input element, text
	walletTxt.setAttribute('type', "text");
	walletTxt.setAttribute('value', wallet);
	walletTxt.style.cssText = "width: 160px; margin-top: 10px; margin-right: 10px;";
	walletsDiv.appendChild(walletTxt);
	
	var delWallet = document.createElement("span"); //input element, text
	delWallet.style.cssText = "margin-top: 10px;";
	delWallet.innerHTML = "X";
	walletsDiv.appendChild(delWallet);
	delWallet.addEventListener('click',
		function () {
			walletsDiv.removeChild(labelTxt);
			walletsDiv.removeChild(walletTxt);
			walletsDiv.removeChild(delWallet);
	});
}

// Saves options to chrome.storage.sync.
function save_options() {
	var wallets = [];

	var children = document.getElementById('walletsList').children;
	
	for (var i = 0; i < Math.floor(children.length / 2); i++) {
		var label = children[i * 2];
		var wallet = children[i * 2 + 1];
		wallets.push({
			label: label.value,
			walletId: wallet.value
		});
	}
	chrome.storage.sync.set({
		walletId: '',
		wallets: wallets
	}, function () {
		// Update status to let user know options were saved.
		var status = document.getElementById('status');
		status.textContent = 'Options saved.';
		setTimeout(function () {
			status.textContent = '';
		}, 1500);
	});
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
	chrome.storage.sync.get({
		walletId: '',
		wallets: [{
				label: "",
				walletId: ""
			}
		]
	}, function (items) {
		if (items.walletId) {
			addInput("wallet", items.walletId);
		} else {
			for (var i = 0; i < items.wallets.length; i++) {
				addInput(items.wallets[i].label, items.wallets[i].walletId);
			}
		}
	});
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
	save_options);

document.getElementById('addWallet').addEventListener('click',
	function () {
	addInput("", "");
});
