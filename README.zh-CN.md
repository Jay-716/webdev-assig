# webdev-assig

[English](https://github.com/Jay-716/webdev-assig/blob/master/README.md) | *简体中文*

---

一个基于Vue3的在线商城。[链接](https://webdev-assig.pages.dev/)

本仓库将在**3个月后**转为私有！

学号：202230442159

姓名：卢俊杰


## 项目依赖

 - Vue.js 3
 - Wrangler


## 启动项目

开发：

`pnpm run dev`

部署：

`pnpm run build` or `pnpm run deploy`

后者会在构建项目后自动部署至CloudFlare Pages.（可能需要登录）


## 开发指引：

源码树解释如下：

public: 公共静态资源。

index.html: 网站入口点。

\*.json: 一大堆前端-狗屎-配置。

src: 主要源码。

 - api: 访问后端API.
 - assets: 静态资源。
 - components: Vue组件。
 - router: Vue路由。
 - store: Pinia store.
 - views: 页面。
 - App.vue, main.ts: Vue应用入口点。

