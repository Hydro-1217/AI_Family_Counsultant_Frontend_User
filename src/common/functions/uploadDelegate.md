### uploadDelegate

需要在项目里引入依赖 Tracer SDK 及 Sentry SDK

```javascript
const ud = new UploadDelegate({
  file: {
    name: "demo.txt",
    size: 1024 * 1024,
  },
});

ud.startUpload(); // 开始上传 埋点等

ud.endUpload(); // 成功上传 埋点等

ud.sendTrackEvent(); // 其他埋点

ud.sendSentryEvent(err); // 错误sentry上报

ud.getUploadSession(); // 获取此次上传session
```
