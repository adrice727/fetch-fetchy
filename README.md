### ƒetch ƒetchy
#### A simplified fetch API

 - A method for each HTTP verb
 - Better error handling
 - Built-in response parsing
 - Options to customize for you API

#### Install
```bash
$ npm i --save fetch-fetchy
```
#### Basic Usage
```
import { get, post } from 'fetch-fetchy';

/**
 * Create a user
 */
post('/user', formData)
  .then(onSuccess)
  .catch(onError)

/**
 * Fetch a user
 */
get('/user/hs9hsbs7')
  .then(onSuccess)
  .catch(onError)
```


#### Configuration
The default configuration is as follows:
```javascript
{
	json: true,
	url: window.location.origin,
	headers: { 'Content-Type': 'application/json' },
	mode: 'cors'
}
```

**`json`**

*If set to `true`, request data will automatically be converted to JSON.*

**`url`**

*The `url` to be used for `api` requests.  When a route begins with `/`, it is assumed that the request is being made to the application's API.  This means that you can define `/user` as the route instead of `https://myapplicationdomain/user`.*  If you set `url` to `https://someotherdomain` and specify `/user` as the route, the request will be made to `https://someotherdomain/user`.  When the route does not begin with `/`, the full route will be used.

**`headers`**

The [headers](https://developer.mozilla.org/en-US/docs/Web/API/Request/headers) for requests.

 **`mode`**

 The request [mode](https://developer.mozilla.org/en-US/docs/Web/API/Request/mode).

You may override these options for all requests by calling `setOptions()`.  The default options will be overridden using [`Object.assign()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign).  If you wish to apply options for a single request, just pass those options into that request.
```
import { configure } from 'fetch-fetchy';
/**
 * Configure fetch-fetchy
 */
const options = {
  url: 'https://myapi.com',
  headers: { Authorization: `Bearer ${jwt}`},
}
configure(options);
```

#### API Methods
→  `get`: Make a `GET` request
→  `post`: Make a `POST` request
→  `put`: Make a `PUT` request
→  `patch`: Make a `PATCH` request
→  `del`: Make a `DELETE` request
→ `configure`: Configure `fetch-fetchy`

*See [source](https://github.com/adrice727/fetch-fetchy/blob/develop/fetch-fetchy.js#L94) for full details*





