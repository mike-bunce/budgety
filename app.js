const URL = 'https://script.google.com/macros/s/DEPLOYMENT_ID/exec';

const statusEl = document.getElementById('status');
const listEl = document.getElementById('list');

// Read
async function loadList() {
  statusEl.textContent = 'Loading…';
  try {
    const data = await fetch(URL + '?action=list').then(r => r.json());
    listEl.textContent = JSON.stringify(data, null, 2);
    statusEl.textContent = '';
  } catch (err) {
    statusEl.textContent = 'Could not load the list: ' + err.message;
  }
}

// Convert a File to a base64 string (without the "data:...;base64," prefix)
function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

// Write
// No Content-Type header is set, so the browser sends text/plain. That counts as a
// "simple" request and skips the CORS preflight, which Apps Script can't answer.
// Note: the response from Apps Script may be unreadable due to CORS; the save
// usually still succeeds, so we refresh the list afterwards to confirm.
async function upload() {
  const file = document.getElementById('file').files[0];
  if (!file) {
    statusEl.textContent = 'Choose a file first.';
    return;
  }
  statusEl.textContent = 'Uploading…';
  try {
    const fileName = file.name;
    const base64Data = await toBase64(file);
    await fetch(URL, {
      method: 'POST',
      body: JSON.stringify({ action: 'save', fileName, base64Data })
    });
    statusEl.textContent = 'Uploaded ' + fileName;
    await loadList();
  } catch (err) {
    statusEl.textContent = 'Upload failed: ' + err.message;
  }
}

document.getElementById('refresh').addEventListener('click', loadList);
document.getElementById('upload').addEventListener('click', upload);

// Top-level await works because index.html loads this with type="module"
await loadList();
