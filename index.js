const dbPromise = openDatabase('testSW', 1);
let activatedSw;

async function main() {
  monitorSwStateChange();
  const url = new URL(window.location.href);
  if (url.searchParams.has('unreg')) {
    const msg = 'unregister sw';
    writePgLogToDb(msg);
    writeLogToDom(msg);

    navigator.serviceWorker
      .getRegistrations()
      .then(registrations => {
        for (const registration of registrations) {
          const msg = `Registration: ${registration.scope}`;
          writePgLogToDb(msg);
          writeLogToDom(msg);
          registration.unregister();
        }
      })
    return;
  }

  writeLogToDom(`Start to register a service worker...`);
  const reg = await navigator.serviceWorker.register('/worker.js', {
    scope: '/'
  });
  writeLogToDom(`Registration finished`);

  await new Promise(resolve => setTimeout(resolve, 100));
  writeLogToDom(`100ms finished`);

  activatedSw = getActiveWorkerAtRegistration(reg);
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    const msg = `ServiceWorkerContainer.oncontrollerchange - navigator.serviceWorker.controller: ${navigator.serviceWorker.controller != null}`;
    writePgLogToDb(msg);
    writeLogToDom(msg);
    activatedSw = navigator.serviceWorker.controller;
  });

  function getActiveWorkerAtRegistration(reg) {
    const worker =
      // Active service worker already exists. Use the currently active service worker.
      reg.active // No service worker is active yet. Send to pending one.
      || reg.waiting || reg.installing;
    if (!worker) {
      throw new Error('No worker found');
    }
    return worker;
  }

  init();
}

main();

async function init() {
  const messageDom = document.getElementById('message');
  messageDom.addEventListener(
    'click',
    () => sendMessageToSw('Hello, I am from postMessage'),
  );
  const fetchDom = document.getElementById('fetch');
  fetchDom.addEventListener('click', () => sendFetchRequest());

  const initMessage = 'init';
  writePgLogToDb(initMessage);
  writeLogToDom(initMessage);
}

async function sendFetchRequest() {
  const data = await fetch('./hello_world');
  const message = `Fetch Data: ${await data.text()}`;
  writePgLogToDb(message);
  writeLogToDom(message);
}

async function sendMessageToSw(message) {
  const _message = `Send message (${activatedSw.state}): ${message}`;
  activatedSw.postMessage(message);
  writePgLogToDb(_message);
  writeLogToDom(_message);
}

async function writePgLogToDb(message) {
  return writeLogToDb(
    await dbPromise,
    `[PG][${(new Date()).toLocaleString()}] ${message}`,
  );
}

function writeLogToDom(message) {
  const autoscrollDom = document.getElementById('autoscroll');
  const logDom = document.getElementById('log');
  const newLog = document.createElement('div');
  newLog.textContent = `[PG][${(new Date()).toLocaleString()}] ${message}`;
  logDom.appendChild(newLog);
  if (autoscrollDom.checked) {
    logDom.scrollTop = logDom.scrollHeight;
  }
}

async function monitorSwStateChange() {
  writeLogToDom('Start monitoring state...');
  const serviceWorkerRegistration = await navigator.serviceWorker.ready;
  writeLogToDom('SW.ready is resolved');
  const activeServiceWorker = serviceWorkerRegistration.active;
  writeLogToDom(`activeServiceWorker state is ${activeServiceWorker.state}`);

  activeServiceWorker.addEventListener('statechange', () => {
    writeLogToDom(`activeServiceWorker state changes to ${activeServiceWorker.state}`);
  });
}
