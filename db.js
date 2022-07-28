function openDatabase(name, version) {
  return new Promise((resolve, reject) => {
    const openReq = indexedDB.open(name, version);
    openReq.onupgradeneeded = () => {
      console.log('onupgradeneeded');
      const dbResult = openReq.result;
      dbResult.createObjectStore('timestamp');
      dbResult.createObjectStore('log');
    };
    openReq.onerror = () => reject(openReq.error);
    openReq.onsuccess = () => {
      resolve(openReq.result);
    };
  });
}

function writeTimestamp(db) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction('timestamp', 'readwrite');
    tx.onerror = event => {
      console.log('[TRX - error]', event);
      reject(event.target.error);
    };
    tx.onabort = event => {
      console.log('[TRX - abort]', event);
      reject(new Error('TransactionAborted'));
    };
    tx.oncomplete = event => resolve();

    const store = tx.objectStore('timestamp');
    store.put({ data: Date.now() }, 'timestamp');
  });
}

function readTimestamp(db) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction('timestamp', 'readonly');
    tx.onerror = event => {
      console.log('[TRX - error]', event);
      reject(event.target.error);
    };
    tx.onabort = event => {
      console.log('[TRX - abort]', event);
      reject(new Error('TransactionAborted'));
    };
    tx.oncomplete = event => resolve(getReq.result);

    const store = tx.objectStore('timestamp');
    const getReq = store.get('timestamp');
  });
}

let index = 1;
function writeLogToDb(db, message) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction('log', 'readwrite');
    tx.onerror = event => {
      console.log('[TRX - error]', event);
      reject(event.target.error);
    };
    tx.onabort = event => {
      console.log('[TRX - abort]', event);
      reject(new Error('TransactionAborted'));
    };
    tx.oncomplete = event => resolve();

    const store = tx.objectStore('log');
    store.put(message, `${Date.now()}-${(index++) % 9 + 1}-${Math.floor(Math.random() * 899 + 100)}`);
  });
}

function clearLogStore(db) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction('log', 'readwrite');
    tx.onerror = event => {
      console.log('[TRX - error]', event);
      reject(event.target.error);
    };
    tx.onabort = event => {
      console.log('[TRX - abort]', event);
      reject(new Error('TransactionAborted'));
    };
    tx.oncomplete = event => resolve();

    const store = tx.objectStore('log');
    store.clear();
  });
}
