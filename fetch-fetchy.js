;
(() => { // eslint-disable-line no-extra-semi

  /** Constants */
  let defaultOptions = {
      json: true,
      url: window.location.origin,
      headers: { 'Content-Type': 'application/json' },
      mode: 'cors',
    }
    /** ********* */

  /**
   * Generate headers for a request
   * @param {Object} [customHeaders]
   * @returns {Object}
   */
  const headers = (customHeaders = {}) => Object.assign({}, defaultOptions.headers, customHeaders);

  /**
   * Generator the url for a request.
   * @param {String} route - Routes starting with '/' are assumed to be api requests and will
   *                         be combined with the specified (or default) url domain
   * @returns {String}
   */
  const getURL = (route) => route.startsWith('/') ? `${defaultOptions.url}${route}` : route;

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
    return new Request(getURL(route), {
      method: method.toUpperCase(),
      mode: options.mode,
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
    const configurableOptions = ['json', 'url', 'headers', 'mode'];
    const definedOptions = Object.keys(options).reduce((acc, k) => {
      if (configurableOptions.includes(k)) {
        acc.update[k] = options[k];
      } else {
        acc.errors.push(k)
      }
      return acc;
    }, { update: {}, errors: [] });
    const { update, errors } = definedOptions;
    if (errors.length) {
      const warning = `ƒetch ƒetchy: ${errors.join(', ')} ${errors.length > 1 ? 'are' : 'is'} not configurable.`
      console.warn(warning);
    };
    const updatedOptions = Object.assign({}, defaultOptions, update);
    defaultOptions = updatedOptions;
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

  const fetchFetchy = {
    configure,
    get,
    post,
    put,
    patch,
    del,
  };

  if (typeof exports === 'object') {
    module.exports = fetchFetchy;
    /*eslint-disable no-undef */
  } else if (typeof define === 'function' && define.amd) {
    define(() => fetchFetchy);
    /*eslint-disable no-undef */
  } else {
    this.fetchFetchy = fetchFetchy;
  }

})(this);
