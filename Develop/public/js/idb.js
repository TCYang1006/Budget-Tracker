let db
const request = indexDB.open('budget_tracker', 1);

request.onUpgrade = function (event) {
    const db = event.target.result;
    db.createObjectSore('New-Transaction', { autoIncrement: true });
}

function saveRecord(record) {
    const transaction = db.transaction(['New-Transaction'], 'readwrite');
    const budgetObjectStore = transaction.objectStore('New-Transaction');
    budgetObjectStore.add(record);
}

function uploadTransaction() {
    const transaction = db.transaction(['New-Transaction'], 'readwrite');
    const budgetObjectStore = transaction.objectStore('New-Transaction');
    const getAll = budgetObjectStore.getAll();

    getAll.onsuccess = function () {
        if (getAll.result.length > 0) {
            fetch('/api/transaction', {
                method: 'POST',
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                }
            })
                .then(response => response.json())
                .then(serverResponse => {
                    if (serverResponse.message) {
                        throw new Error(serverResponse);
                    }
                    const transaction = db.transaction(['New-Transaction'], 'readwrite');
                    const budgetObjectStore = transaction.objectStore('New-Transaction');
                    budgetObjectStore.clear();
                    alert('All saved transaction submitted')
                })
                .catch(e => {
                    res.json(e)
                });
        }
    }
}
window.addEventListener('online', uploadTransaction);