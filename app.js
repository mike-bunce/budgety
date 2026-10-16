const URL = 'https://script.google.com/macros/s/DEPLOYMENT_ID/exec';

// Read
const data = await fetch(URL + '?action=list').then(r => r.json());

// Write (see CORS note below)
await fetch(URL, {
  method: 'POST',
  body: JSON.stringify({ action: 'save', fileName, base64Data })
});
