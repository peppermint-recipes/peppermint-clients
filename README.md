# app

## Project setup

**This project is not actively maintained.**

```
yarn install
```

Copy the `capacitor.config.json.example` to `capacitor.config.json` and correct the value for `server.url` The standard vuejs deployment server is `<your-network-address>:8080`. After each configuration update you need to execute the following command to sync your changes into the native app.
```
npx cap sync
```


Have the app not use a development server, just remove the `server` object from the configuration and execute the following commands:
```
npx cap copy
npx cap sync
```


### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build

# Copy files into application
npx cap copy
npx cap sync
```

### Lints and fixes files
```
yarn lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
