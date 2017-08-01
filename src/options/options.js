function save_options() {
    let attr = document.getElementById('attrId').value;

    chrome.storage.sync.set({
        attributeId: attr
    }, function () {
        var status = document.getElementById('status');
        status.textContent = 'Options saved.';
        setTimeout(function () {
            status.textContent = '';
        }, 750);
    });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
    // Use default value color = 'red' and likesColor = true.
    chrome.storage.sync.get({
        attributeId: 'e2e-id'
    }, function (items) {
        document.getElementById('attrId').value = items.attributeId;
    });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);