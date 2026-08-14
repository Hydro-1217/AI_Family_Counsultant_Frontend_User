git# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## 启动：
```pnpm run dev```（开发调试）


## 构建部署
### 1.ssh 公钥给我，我添加到服务器上

```bash
cd 仓库根目录
cd scripts
# 第一次执行一下就可以了
chmod +x build_deploy.sh 
./build_deploy.sh
```

入口
App.jsx
- 通过Routes来控制路由（页面)
- hooks 好好学
- antd-mobile（https://mobile.ant.design/）