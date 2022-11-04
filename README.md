# Xpensify + Google Apps Script

This repo contains the code that powers the Xtract API connector library that you can use directly from Google Apps Script.
If you don't want to use the library you can copy and modify the code in this repo as you need.

The library's script ID is `1oW5XdZwVg31CSl9LYMEiuvm0BcWz8omozSXqdl9uJxFa-WAPclG4fPwg`

## Using the library

First create a new Apps Script Project. This can be done directly [here](https://script.google.com) or after creating a new spreadsheet you can click `Extensions -> Apps Script`.

After this you can start coding the code that will interact between you spreadsheet and the Xtract API.

On your left click `Libraries +` and paste the script ID mentioned before.

Create 2 sheets one called `Filters` and the other one called `Report`.

Then you can get started with the following example:

```js
const API_KEY = 'CHANGE_WITH_YOUR_ACCOUNT_KEY';

// Add a menu at the top of the spreadsheet to easily execute
const onOpen = () => { // eslint-disable-line
  const ui = SpreadsheetApp.getUi();
  const menu = ui.createMenu('Xtract');
  menu.addItem('Generate report', 'generateReport');
  menu.addToUi();
};

// This function gets called after pressing the generate report button
const generateReport = () => { // eslint-disable-line
  const invoices = Xtract.fetchInvoices(API_KEY, {});
  const rows = [];

  invoices.forEach((invoice, idx) => {
    rows.push([idx, invoice.number]);
  });

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Report');
  sheet.clearContents();
  sheet.getRange(1, 1, rows.length, rows[0].length).setValues(rows);
};
```

If you want to add some filters you can do the following:

```js
const API_KEY = 'CHANGE_WITH_YOUR_ACCOUNT_KEY';
const REPORT_SHEET_NAME = 'Report';
const FILTERS_SHEET_NAME = 'Filters';
/*
  Location of the filters
    - Key is the query param used to call the API
    - Value is the cell where you can get the value
 */
const FILTERS_POSITIONS = {
  date_from: 'B2',
  date_to: 'B3',
  provider_tax_id: 'B4',
};

const onOpen = () => { // eslint-disable-line
  const ui = SpreadsheetApp.getUi();
  const menu = ui.createMenu('Xtract');
  menu.addItem('Generate report', 'generateReport');
  menu.addToUi();
};

const generateReport = () => { // eslint-disable-line
  const filters = Xtract.getFilters(FILTERS_SHEET_NAME, FILTERS_POSITIONS);
  const invoices = Xtract.fetchInvoices(API_KEY, filters);
  const rows = [];

  invoices.forEach((invoice, idx) => {
    rows.push([idx, invoice.number]);
  });

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(REPORT_SHEET_NAME);
  sheet.clearContents();
  sheet.getRange(1, 1, rows.length, rows[0].length).setValues(rows);
};
```
