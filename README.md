# gam

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

## git报错

```shell
Failed to connect to github.com port 443 after 21082 ms: Couldn't connect to
```

### 解决方法

```shell
git config --global http.proxy http://127.0.0.1:1080

git config --global --unset http.proxy
```