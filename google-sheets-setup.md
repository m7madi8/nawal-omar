# Google Sheets Integration Setup

Use these steps once, then your site form and dashboard work directly with Google Sheets.

## 1) Create Google Sheet

- Create a new Google Sheet.
- Rename first tab to: `Requests`
- Add this header row exactly:

`id | source | retreatType | submittedAt | fullName | phone | age | city | reason | expectation | yogaExperience | healthStatus | healthDetails | activities | freeNote | status`

## 2) Create Apps Script Web App

- Open: `Extensions -> Apps Script`
- Replace code with:

```javascript
const SHEET_NAME = "Requests";
const TOKEN = "CHANGE_ME_SECRET_TOKEN";

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  return sheet;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function parseBody_(e) {
  if (!e || !e.postData || !e.postData.contents) return {};
  try {
    return JSON.parse(e.postData.contents);
  } catch (err) {
    return {};
  }
}

function readRowsAsObjects_() {
  const sheet = getSheet_();
  const values = sheet.getDataRange().getValues();
  if (!values.length) return [];
  const headers = values[0];
  return values.slice(1).map((row) => {
    const obj = {};
    headers.forEach((h, i) => (obj[h] = row[i]));
    return obj;
  });
}

function doGet(e) {
  const token = (e && e.parameter && e.parameter.token) || "";
  if (TOKEN && token !== TOKEN) return json_({ success: false, error: "Unauthorized" });

  const source = (e && e.parameter && e.parameter.source) || "";
  let requests = readRowsAsObjects_();
  if (source) {
    requests = requests.filter((r) => String(r.source || "") === source);
  }
  return json_({ success: true, requests });
}

function doPost(e) {
  const body = parseBody_(e);
  if (TOKEN && String(body.token || "") !== TOKEN) {
    return json_({ success: false, error: "Unauthorized" });
  }

  const action = String(body.action || "create");
  const sheet = getSheet_();
  const values = sheet.getDataRange().getValues();
  const headers = values.length ? values[0] : [];
  const idCol = headers.indexOf("id") + 1;
  const statusCol = headers.indexOf("status") + 1;

  if (action === "updateStatus") {
    if (!idCol || !statusCol) return json_({ success: false, error: "Missing required columns" });
    const id = String(body.id || "");
    const nextStatus = String(body.status || "pending");
    for (let r = 2; r <= sheet.getLastRow(); r++) {
      if (String(sheet.getRange(r, idCol).getValue()) === id) {
        sheet.getRange(r, statusCol).setValue(nextStatus);
        return json_({ success: true });
      }
    }
    return json_({ success: false, error: "ID not found" });
  }

  if (action === "delete") {
    if (!idCol) return json_({ success: false, error: "Missing id column" });
    const id = String(body.id || "");
    for (let r = sheet.getLastRow(); r >= 2; r--) {
      if (String(sheet.getRange(r, idCol).getValue()) === id) {
        sheet.deleteRow(r);
        return json_({ success: true });
      }
    }
    return json_({ success: false, error: "ID not found" });
  }

  const nowIso = new Date().toISOString();
  const row = {
    id: String(body.id || "req-" + Date.now()),
    source: String(body.source || "wadi-rum-registration"),
    retreatType: String(body.retreatType || "Wadi Rum"),
    submittedAt: String(body.submittedAt || nowIso),
    fullName: String(body.fullName || ""),
    phone: String(body.phone || ""),
    age: String(body.age || ""),
    city: String(body.city || ""),
    reason: String(body.reason || ""),
    expectation: String(body.expectation || ""),
    yogaExperience: String(body.yogaExperience || ""),
    healthStatus: String(body.healthStatus || ""),
    healthDetails: String(body.healthDetails || ""),
    activities: Array.isArray(body.activities) ? body.activities.join(", ") : String(body.activities || ""),
    freeNote: String(body.freeNote || ""),
    status: String(body.status || "pending")
  };

  const headerRow = headers.length ? headers : Object.keys(row);
  if (!headers.length) sheet.appendRow(headerRow);
  const ordered = headerRow.map((h) => row[h] || "");
  sheet.appendRow(ordered);
  return json_({ success: true, id: row.id });
}
```

## 3) Deploy Web App

- Click `Deploy -> New deployment`
- Type: `Web app`
- Execute as: `Me`
- Who has access: `Anyone`
- Deploy and copy the Web App URL.

## 4) Update Website Config

1. Open `wadi-rum-registration.html` and set form attrs:
   - `data-sheet-endpoint="YOUR_WEB_APP_URL"`
   - `data-sheet-token="YOUR_SECRET_TOKEN"`

2. Open `dashboard.html` and set:
   - `window.YOGA_DASHBOARD_CONFIG.sheetsEndpoint = "YOUR_WEB_APP_URL"`
   - `window.YOGA_DASHBOARD_CONFIG.sheetsToken = "YOUR_SECRET_TOKEN"`

## 5) Test

- Submit one request from `wadi-rum-registration.html`
- Open the Google Sheet and confirm a row was added
- Login to `dashboard.html` (`nawal` / `nawalll`) and verify request appears
- Test `Mark Completed` and `Delete` from Retreat Requests
