# axiosone

A simple module that turns all your [axios](https://github.com/axios/axios) request configs into callable functions.

Basically, instead of setting up the query everytime you want to call this query

```
axios.get("/example/posts", { ...some config });
```

you can do this instead.

```
axiosone.getPosts(...params);
```
Continue below to read how you can achieve this. See [axios config](https://github.com/axios/axios/blob/dbc634cf700595845abc43604e1fb6cea903b97f/index.d.ts#L50) for the request config object.

## Installing

Using npm

`npm install axiosone`

Using yarn

`
yarn add axiosone
`

## Examples (CommonJS)

*The example below use es5 syntax, but you can also swap with es6+ syntax.*
```javascript
var axiosone = require("axiosone");

// Simple usage with simple axios request config.
axiosone.bindConfig({
  exampleQuery: {
    method: "get",
    url: "/yoururl"
  }
});

// Now call your query by accessing the query name as a function.
axiosone.exampleQuery()
  .then(response => {...})
  .catch(error => {...});
```

If you want to pass in parameters into your query function, then do the following:

```javascript
axiosone.bindConfig({
  examplePostQuery: function(text) {
    method: "post",
    url: "/yoururl",
    data: {
      text: text,
    }
  }
});

// Then call like this!
axiosone.examplePostQuery("This is how you call your function.");
```

Suppose you want to reuse the same config over multiple requests.
Then you can provide a list of configs to your query as shown below.

```javascript
var sharedConfig = {
  ...
};

axiosone.bindConfig({
  exampleQuery: [
    sharedConfig,
    {
      method: "get",
      url: "/yoururl",
    }
  ]
});

// axiosone will merge all your configs in order.
// Then call your function as usual.
axiosone.exampleQuery();
```

If you want all requests to use the same shared config, then call `extendGlobalConfig` method.

```javascript
// This will automatically bind this config to all your declared axiosone functions.
axiosone.extendGlobalConfig({
  baseUrl: "http://localhost:8000",
  headers: {
    ['Content-Type']: "application/json"
  }
});
```

### Using Typescript

Using Typescript will be more involved, but will allow type checks when passing inputs and receiving outputs from
your queries.

```typescript
import axiosone from "axiosone";

// This will make the function methods inside axiosone instance
// visible.
declare module "axiosone" {
  interface AxiosoneInstance {
    // Passing the config as parameter type will create an query function with parameters.
    login: AxiosoneQueryFunction<typeof config.login>; 
    // Without parameters.
    logout: AxiosoneQueryFunction;
  }
}

// Do not specify type for this config as the type check
// happens during `bindConfig`.
const config = {
  login: (email: string, password: string) => ({
    method: "POST",
    url: "user/login/",
    data: {
      email,
      password,
    },
  }),

  logout: {
    method: "POST",
    url: "user/logout/",
  },
};

axiosone.bindConfig(config);

// When calling your function with incorrect types as inputs...
axiosone.login("name", 1); // Will SCREAM TS-ERROR
axiosone.login("name", "password"); // no errors

// To specify output types, you can declare an input type when calling
// your query function.
const response = await axiosone.login<{ token: string }>(email, password);
```
### Code Splitting (es6)

To separate config from your main code, you can declare `bindConfig` in a separate
as a module before importing inside your main application file.

```typescript
// apiModule.js
import axiosone from "axiosone"

axiosone.bindConfig({
  exampleQuery: {
    method: "get",
    url: "/user"
  }
});

// app.js (or anywhere to ensure the code above is executed)
import "./apiModule"
```

## Credits

This small package is inspired by its dependency [axios](https://github.com/axios/axios).

## License

[MIT](LICENSE)
