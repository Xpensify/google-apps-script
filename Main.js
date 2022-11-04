const API_KEY = 'CHANGE_WITH_YOUR_ACCOUNT_KEY';
const REPORT_SHEET_NAME = 'Report';
const FILTERS_SHEET_NAME = 'Filters';
const FILTERS_POSITIONS = {
  date_from: 'B2',
  date_to: 'B3',
  provider_tax_id: 'B4',
};

const onOpen = () => { // eslint-disable-line
  const ui = SpreadsheetApp.getUi();
  const menu = ui.createMenu('Xtract');
  menu.addItem('Clear filters', 'clearFilters2');
  menu.addItem('Generate report', 'generateReport');
  menu.addToUi();
};

const clearFilters2 = () => clearFilters(FILTERS_SHEET_NAME, FILTERS_POSITIONS); // eslint-disable-line

const generateReport = () => { // eslint-disable-line
  const filters = getFilters(FILTERS_SHEET_NAME, FILTERS_POSITIONS);
  const invoices = fetchInvoices(API_KEY, filters);
  const rows = [];

  invoices.forEach((invoice, idx) => {
    rows.push([idx, invoice.number]);
  });

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(REPORT_SHEET_NAME);
  sheet.clearContents();
  sheet.getRange(1, 1, rows.length, rows[0].length).setValues(rows);
};
