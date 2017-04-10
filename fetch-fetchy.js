/** Constants */
let url = window.location.origin;
let defaultHeaders = { 'Content-Type': 'application/json' };
let defaultOptions = { json: true, mode: 'cors' };
let defaultOptions = {
  json: true,
  url: window.location.origin,
  headers: { 'Content-Type': 'application/json' };
  mode: 'cors'
}
/** ********* */

/** Generator headers for a request */
const headers = (customHeaders = {}) => Object.assign({}, defaultHeaders, customHeaders);

/** Check for external route containing http/https */
const getURL = (route) => route.includes('http') ? route : `${url}${route}`;

/**
 * Parse a reponse based on the type
 * @param {Response} response
 * @returns {Promise} <resolve: *, reject: Error>
 */
const parseResponse = (response) => {
  const contentType = (response.headers.get('content-type') || '').split(';')[0];
  if (contentType === 'application/json') {
    return response.json();
  } else if (contentType === 'multipart/form-data') {
    return response.formData();
  } else if (contentType === 'text/html') {
    return response.text();
  } else if (contentType === 'application/octet-stream') {
    return response.blob();
  }
};


/**
 * Check for API-level errors
 * @param {Response} response
 * @returns {Promise} <resolve: Response, reject: Error>
 */
const checkStatus = (response) =>
  new Promise((resolve, reject) => {
    if (response.ok) {
      return resolve(response);
    }
    parseResponse(response)
      .then(reject)
      .catch(reject);
  });

/**
 * Create a new Request object
 * @param {String} method
 * @param {String} route
 * @param {*} [data]
 * @param {Object} [options]
 * @returns {Request}
 */
const request = (method, route, data = null, requestOptions = {}) => {
  const options = Object.assign({}, defaultOptions, requestOptions);
  let body;
  if (data) {
    body = options.json ? JSON.stringify(data) : body;
  } else {
    body = {};
  }
  // const body = data && JSON.stringify(data);
  return new Request(getURL(route), {
    method: method.toUpperCase(),
    mode: 'cors',
    headers: new Headers(headers(options.headers)),
    body,
  });
};

/**
 * Execute a request using fetch
 * @param {String} method
 * @param {String} route
 * @param {*} [body]
 * @param {Object} [options]
 */
const execute = (method, route, body, options) =>
  new Promise((resolve, reject) => {
    fetch(request(method, route, body, options))
      .then(checkStatus)
      .then(parseResponse)
      .then(resolve)
      .catch(reject);
  });

/** Exports */

/**
 * Update the default configuration for all requests
 * @param {Object} options
 * @param {Boolean} [json]
 * @param {String} [url]
 * @param {Object} [headers]
 * @param {String} [mode]
 * @returns Object
 */
const configure = (options) => {
  const updatedOptions = Object.assign({}, defaultOptions, options);
  let defaultOptions = updatedOptions;
  return updatedOptions;
}

/**
 * Make a GET request
 * @param {String} route
 * @param {Object} [options]
 * @returns {Promise} <resolve: Response, reject: Error>
 */
const get = (route, options) => execute('get', route, options);

/**
 * Make a POST request
 * @param {String} route
 * @param {String} [body]
 * @param {Object} [options]
 * @returns {Promise} <resolve: Response, reject: Error>
 */
const post = (route, body, options) => execute('post', route, body, options);

/**
 * Make a PUT request
 * @param {String} route
 * @param {String} [body]
 * @param {Object} [options]
 * @returns {Promise} <resolve: Response, reject: Error>
 */
const put = (route, body, options) => execute('put', route, body, options);

/**
 * Make a PATCH request
 * @param {String} route
 * @param {String} [body]
 * @param {Object} [options]
 * @returns {Promise} <resolve: Response, reject: Error>
 */
const patch = (route, body, options) => execute('patch', route, body, options);

/**
 * Make a DELETE request
 * @param {String} route
 * @param {Object} [options]
 * @returns {Promise} <resolve: Response, reject: Error>
 */
const del = (route) => execute('delete', route);

module.exports = {
  configure,
  get,
  post,
  put,
  patch,
  del,
};
