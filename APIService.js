const URL = 'https://api.xtract.app/api/v1/invoices';

const invoicesCache = {};

const buildHash_ = (filters) =>
  Object.entries(filters)
      .map(([key, value]) => `${key}=${value}`)
      .join('|');

const buildUrlWithQueryParams_ = (url, params) => {
  const query = Object.entries(params)
      .map(([key, value]) => `${key}=${value}`)
      .join('&');

  return `${url}?${query}`;
};

const deepCopyObject_ = (obj) => JSON.parse(JSON.stringify(obj));

function fetchInvoices(apiKey, filters) { // eslint-disable-line
  const filtersHash = buildHash_(filters);
  if (invoicesCache[filtersHash]) {
    return invoicesCache[filtersHash];
  }

  const httpParams = {
    'method': 'GET',
    'headers': {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    'muteHttpExceptions': true,
  };
  const result = [];

  const firstPageResponse = UrlFetchApp.fetch(buildUrlWithQueryParams_(URL, filters), httpParams);
  const firstPageData = JSON.parse(firstPageResponse.getContentText());
  result.push(firstPageData.data);

  for (let page = 2; page <= firstPageData.total_pages; page++) {
    const newParams = deepCopyObject_(filters);
    newParams.page = page;
    const pageResponse = UrlFetchApp.fetch(buildUrlWithQueryParams_(URL, newParams), httpParams);
    result.push(JSON.parse(pageResponse.getContentText()).data);
  }

  invoicesCache[filtersHash] = result.flat();
  return invoicesCache[filtersHash];
};

function clearFilters(sheetName, filtersPositions) { // eslint-disable-line
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  Object.entries(filtersPositions)
      .forEach(([_, value]) => sheet.getRange(value).clearContent());
};

function getFilters(sheetName, filtersPositions) { // eslint-disable-line
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);

  return Object.keys(filtersPositions)
      .reduce((acc, key) => {
        const value = sheet.getRange(filtersPositions[key]).getValue();
        if (value) {
          acc[key] = value;
        }
        return acc;
      }, {});
};
