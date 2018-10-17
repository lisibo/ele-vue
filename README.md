# Vue2.x 仿饿了么 App
基于 `vue-cli` 脚手架 + `vue` 仿饿了么的webapp，路由 `vue-router` 实现，服务端数据请求选用 `axios` 实现，页面滚动 `better-scroll` 实现。

## 项目截图

<div align=center>
	<img src="https://github.com/lisibo/ele-vue/blob/master/img/ele1.png" width="25%">
	<img src="https://github.com/lisibo/ele-vue/blob/master/img/ele2.png" width="25%">
  <img src="https://github.com/lisibo/ele-vue/blob/master/img/ele3.png" width="25%">
</div>

## 主要技术栈

- Vue.js
- vue-cli 脚手架搭建项目
- vue-router 实现路由切换
- axios 进行数据请求
- webpack 打包项目文件
- ES6 + ESlint 语法/语法检测
- flex 弹性布局
- Stylus 编写样式
- Vue 过渡动画
- 联动滚动借助了 better-scroll 插件
- localStorage 本地数据存取

## 实现功能

- Goods、Ratings、Seller 组件视图均可上下滚动
- 商品页 点击左侧menu，右侧list对应跳转到相应位置
- 点击list查看商品详情页，父子组件的通信
- 评论内容可以筛选查看
- 购物车组件，包括添加删除商品及动效，购物控件与购物车组件之间为兄弟组件通信，点击购物车图标，展示已选择的商品列表
- 商家实景图片可以左右滑动
- loaclStorage 缓存商家信息（id、name）

## 组件关系

<div align=center>
	<img src="https://github.com/lisibo/ele-vue/blob/master/img/ele4.png" width="50%">
</div>

```
├──app.vue
  │  ├──header.vue--头部组件
  │  │  ├──star.vue--星星评分组件
  │  ├──goods.vue--商品组件
  │  │  ├──shopcart.vue--购物车组件,包括小球飞入购物车动画
  │  │  ├──cartcontrol.vue--购买加减图标控件--选中数量返回给父组件goods，goods响应后，重新计算选中数量，将数据发送给购物车组件，
  │  │  ├──food.vue--商品详情页
  │  │  │  ├──ratingselect.vue--评价内容筛选组件
  │  ├──ratings.vue--评论组件
  │  │  ├──ratingselect.vue--评价内容筛选组件
  │  ├──seller.vue--商家组件

独立组件
  ├──split.vue--关于分割线组件
```

## 项目结构
```
common/---- 文件夹存放的是通用的styl和fonts
components/---- 文件夹用来存放 Vue 组件
router/---- 文件夹存放的是vue-router相关配置（linkActiveClass,routes注册组件路由）
build/---- 文件是 webpack 的打包编译配置文件
config/---- 文件夹存放的是一些配置项，比如我们服务器访问的端口配置等
dist/---- 该文件夹一开始是不存在，在项目经过 build 之后才会生成
App.vue---- 根组件，所有的子组件都将在这里被引用
index.html---- 整个项目的入口文件，将会引用我们的根组件 App.vue
main.js---- 入口文件的 js 逻辑，在 webpack 打包之后将被注入到 index.html 中
```

## 项目总结

想写的详细一点，另开一篇

### [项目总结 & 问题](https://github.com/lisibo/ele-vue/blob/master/conclusion.md)

#### 如果觉得对您有帮助，您可以在右上角给我个star支持一下，谢谢！

## 项目运行

``` bash
# clone
git clone https://github.com/lisibo/ele-vue.git

# install dependencies
npm install

# serve with hot reload at localhost:8081
npm run dev

# build for production with minification
npm run build
```
