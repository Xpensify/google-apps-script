const URL = 'https://api.xpensify.app/api/v1/invoices';
const API_KEY = 'CHANGE_WITH_YOUR_ACCOUNT_KEY';

const invoicesCache = {};

const buildHash_ = (filters) =>
  Object.keys(filters).map((key) => `${key.id}=${values[key.id]}`).join('|');

const buildUrlWithQueryParams_ = (url, params) => {
  const query = Object.keys(params)
      .map((key) => key + '=' + params[key])
      .join('&');

  return `${url}?${query}`;
};

const deepCopyObject_ = (obj) => JSON.parse(JSON.stringify(obj));

const fetchInvoices = (filters) => { // eslint-disable-line
  const filtersHash = buildHash_(filters);
  if (invoicesCache[filtersHash]) {
    return invoicesCache[filtersHash];
  }

  const httpParams = {
    'method': 'GET',
    'headers': {
      'Authorization': 'Bearer ' + API_KEY,
      'Content-Type': 'application/json',
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
