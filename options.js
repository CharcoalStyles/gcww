var numWallets = 0;
var walIntIds = [];

function addInput(wallet) {
	var walletsDiv = document.getElementById('walletsList');
	
	var walletDiv = document.createElement("div");
	walletDiv.className = "walletOption";
	
	var walLabelInputs = getHtmlInputs('text', 'label' + numWallets, wallet.label, "Label", "width: 270px;");
	var walletInputs = getHtmlInputs('text', 'wallet' + numWallets, wallet.walletId, "Wallet", "width: 270px;");
	var mBtcInputs = getHtmlInputs('checkbox', 'mbtc' + numWallets, wallet.showMbtc, "Show in mBTC", "");
	console.log(wallet.showMbtc);
	var usdInputs = getHtmlInputs('checkbox', 'usd' + numWallets, wallet.showUsd, "Show in USD", "");
	console.log(wallet.showUsd);

	walletDiv.appendChild (walLabelInputs.label);
	walletDiv.appendChild (walLabelInputs.input);
	walletDiv.appendChild (walletInputs.label);
	walletDiv.appendChild (walletInputs.input);
	
	walletDiv.appendChild (mBtcInputs.input);
	walletDiv.appendChild (mBtcInputs.label);
	walletDiv.appendChild (usdInputs.input);
	walletDiv.appendChild (usdInputs.label);
	
	var delWallet = document.createElement("span"); 
	delWallet.style.cssText = "margin-top: 10px; float: right;";
	delWallet.id = "close-" + numWallets;
	delWallet.innerHTML = "X";
	walletDiv.appendChild(delWallet);
	delWallet.addEventListener('click',
		function () {
			var walIntID = parseInt(delWallet.id.split("-")[1]);
			
			var index = walIntIds.indexOf(walIntID);
			if (index > -1) {
				walIntIds.splice(index, 1);
			}
			
			walletsDiv.removeChild(walletDiv);
	});
	
	walletsDiv.appendChild(walletDiv);
	walIntIds.push(numWallets);
	numWallets++;
}

function getHtmlInputs(type, id, value, labelText, css)
{
	var input = document.createElement("input"); 
	input.id = id;
	input.setAttribute('type', type);
	if (type == "checkbox" && value)
		input.setAttribute('checked', "true");
	else
		input.setAttribute('value', value);
	input.style.cssText = css;
	
	var label = document.createElement("label"); 
	label.htmlFor = id;
	label.innerHTML = labelText;
	label.style.cssText = css;
	
	return {
		input: input,
		label: label
	}
}

// Saves options to chrome.storage.sync.
function save_options() {
	var wallets = [];

	walIntIds.forEach(function (item){
			var showMbtc = (document.getElementById('mbtc' + item).checked === undefined) ? false : document.getElementById('mbtc' + item).checked;
			var showUsd = (document.getElementById('usd' + item).checked === undefined) ? false : document.getElementById('usd' + item).checked;
		wallets.push({
			label: document.getElementById('label' + item).value,
			walletId: document.getElementById('wallet' + item).value,
			showMbtc: showMbtc,
			showUsd: showUsd
		});
	});
	
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
				walletId: "",
				showMbtc: false,
				showUsd: false
			}
		]
	}, function (items) {
		if (items.walletId) {
			addInput({
				label: "Wallet",
				walletId: items.walletId,
				showMbtc: false,
				showUsd: false
			});
		} else {
			for (var i = 0; i < items.wallets.length; i++)
			{
				console.log(items);
				addInput(items.wallets[i]);
			}
		}
	});
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
	save_options);

document.getElementById('addWallet').addEventListener('click',
	function () {
	addInput({
		label: "",
		walletId: "",
		showMbtc: false,
		showUsd: false
	});
});
