(() => {
  /** Constants */
  let url = window.location.origin;
  let defaultHeaders = { 'Content-Type': 'application/json' };
  let defaultOptions = { json: true };
  /** ********* */

  /** Generator headers for a request */
  const headers = (customHeaders = {}) => Object.assign({}, defaultHeaders, customHeaders);

  /** Check for external route containing http/https */
  const getURL = (route) => route.includes('http') ? route : `${url}${route}`;

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

  /** Check for API-level errors */
  const checkStatus = (response) =>
    new Promise((resolve, reject) => {
      if (response.ok) {
        return resolve(response);
      }
      parseResponse(response)
        .then(reject)
        .catch(reject);
    });

  /** Create a new Request object */
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

  /** Execute a request using fetch */
  const execute = (method, route, body, options) =>
    new Promise((resolve, reject) => {
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
  const fetchFetchy = {
    get,
    post,
    put,
    patch,
    del,
    setUrl,
    setHeaders,
    setOptions,
  };

  window.fetchFetchy = fetchFetchy;

})();
