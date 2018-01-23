// Saves options to chrome.storage.sync.
function save_options() {
  var walletId = document.getElementById('walletId').value;
  chrome.storage.sync.set({
    walletId: walletId
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  chrome.storage.sync.get({
    walletId: ''
  }, function(items) {
    document.getElementById('walletId').value = items.walletId;
  });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);