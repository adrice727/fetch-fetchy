/** Constants */
let origin = window.location.origin;
const url = R.contains('localhost', origin) ? 'http://localhost:3001' : 'https://ibs-dev-server.herokuapp.com';
const defaultHeaders = { 'Content-Type': 'application/json' };
const defaultOptions = { json: true };
/** ********* */

/** Generator headers for a request */
const headers = (customHeaders): Headers => Object.assign({}, defaultHeaders, customHeaders);

/** Check for external route containing http/https */
const getURL = (route)=> route.includes('http') ? route : `${apiUrl}/${route}`;

/**
 * Set a custom base url
 * @param {String} customUrl
 * @returns {String}
 */
const setUrl = (customUrl) => {
  url = customUrl;
  return customUrl;
}

/**
 * Set default headers
 * @param {Object} defaultHeaders
 * @returns {Object}
 */
const setHeaders = (headers) => {
  defaultHeaders = headers;
  return headers;
}

/**
 * Set default options
 * @param {Object} options
 * @returns {Object}
 */
const setOptions = (options) => {
  defaultOptions = options;
  return options;
}

/** Parse a response based on the type */
const parseResponse = (response: Response): * => {
  const contentType = (response.headers.get('content-type') || '')).split(';')[0]
  if (contentType === 'application/json') {
    return response.json();
  } else if ( contentType === 'multipart/form-data') {
    return response.formData();
  } else if (contentType === 'text/html') {
    return response.text();
  } else if (contentType === 'application/octet-stream') {
    return response.blob();
  }
};

/** Check for API-level errors */
const checkStatus = (response: Response): PromiseLike =>
  new Promise((resolve: PromiseLike, reject: PromiseLike): Promise => {
    if (response.ok) {
      return resolve(response);
    }
    parseResponse(response)
      .then(({ message }: { message: string }): PromiseLike => reject(new Error(message)))
      .catch(reject);
  });

/** Create a new Request object */
const request = (method, route, data = null, options = {}): Request => {
  const options = Object.assign({}, defaultOptions, options);
  let body;
  if (data) {
    body = options.json ? JSON.stringify(data) : body;
  }
  const body = data && JSON.stringify(data);
  return new Request(getURL(route), {
    method: method.toUpperCase(),
    mode: 'cors',
    headers: new Headers(headers(requiresAuth)),
    body,
  });
};

/** Execute a request using fetch */
const execute = (method, route, body, options): Promise =>
  new Promise((resolve: PromiseLike, reject: PromiseLike) => {
    fetch(request(method, route, body, options))
      .then(checkStatus)
      .then(parseResponse)
      .then(resolve)
      .catch(reject);
  });

/** HTTP Methods */
const get = (route, options) => execute('get', route, options);
const post = (route, body, options) => execute('post', route, body, options);
const put = (route, body, options) => execute('put', route, body, options);
const patch = (route, body, options) => execute('patch', route, body, options);
const del = (route) => execute('delete', route);

/** Exports */
module.exports = {
get,
post,
put,
patch,
del,
setUrl,
setHeaders,
setOptions,
};
