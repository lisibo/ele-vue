## 前言
这是我第一个基于 Vue 的项目作品，目的很简单，学以致用，将之前的前端知识积累加上目前流行的前端框架，以项目的形式展现出来。

## 构建

Vue有自己的脚手架构建工具vue-cli,使用起来非常方便，使用webpack来集成各种开发便捷工具，比如：

- Hot-reload Vue的热更新，修改代码之后无需手动刷新网页，对前端开发来说非常方便
- PostCss，再也不用去管兼容性的问题了，只针对chrome这样的现代浏览器写css代码，会自动编译生成兼容多款浏览器的css代码
- ESlint，统一代码风格，规避低级错误，对于有代码洁癖的人来说是不可或缺的
- Bable，ES2015出来已经有一段时间了，但是不少浏览器还没有兼容ES6，有了bable，放心使用ES6语法，它会自动转义成ES5语法
- SCSS，一款 CSS预处理器，编译后成正常的CSS文件。为CSS增加一些编程的特性
…

除此之外，vue-cli已经使用node配置了一套本地服务器和安装命令等，本地运行和打包只需要一个命令就可以搞定，非常的方便


## 实现功能

- Goods、Ratings、Seller 组件视图均可上下滚动
- 商品页 点击左侧menu，右侧list对应跳转到相应位置
- 点击list查看商品详情页，父子组件的通信
- 评论内容可以筛选查看
- 购物车组件，包括添加删除商品及动效，购物控件与购物车组件之间为兄弟组件通信，点击购物车图标，展示已选择的商品列表
- 商家实景图片可以左右滑动
- loaclStorage 缓存商家信息（id、name）

## 组件关系
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
common/---- 文件夹存放的是通用的css和fonts
components/---- 文件夹用来存放 Vue 组件
router/---- 文件夹存放的是vue-router相关配置（linkActiveClass,routes注册组件路由）
build/---- 文件是 webpack 的打包编译配置文件
config/---- 文件夹存放的是一些配置项，比如我们服务器访问的端口配置等
dist/---- 该文件夹一开始是不存在，在项目经过 build 之后才会生成
prod.server.js---- 该文件是测试是模拟的服务器配置，用来运行dist里面的文件，在config/index.js中,build对象中添加一条端口设置port：9000，
App.vue---- 根组件，所有的子组件都将在这里被引用
index.html---- 整个项目的入口文件，将会引用我们的根组件 App.vue
main.js---- 入口文件的 js 逻辑，在 webpack 打包之后将被注入到 index.html 中
```

## 开发过程问题汇总：
### 1、better-scroll 插件在移动端使用时需要设置 click：true，否则移动端滑动无效
### 2、分开设置css样式：
- 图标icon.css--文字图标样式，通过icommon.io网站 将svg图片转成文字图标样式
- 公共base.css--处理设备像素比的一些样式，针对border-1px问题，不同设备像素比，显示的线条粗细不同
- 工具mixin.css--设置border-1px样式和背景样式


#### 移动端 border-1px 实现原理
当样式像素一定时,因手机有320px,640px等.各自的缩放比差异,所以设备显示像素就会有1Npx，2Npx。

`公式：设备上像素 = 样式像素 * 设备像素比`

为了保证设计稿高度还原，采用 `media + scale` 的方法解决
```
屏幕宽度： 320px 480px 640px
设备像素比： 1    1.5    2

通过查询它的设备像素比 devicePixelRatio

在设备像素比为1.5倍时, round(1px 1.5 / 0.7) = 1px
在设备像素比为2倍时, round(1px 2 / 0.5) = 1px
```


实现代码
```
// SCSS 语法
@mixin border-1px($color) {
  position: relative;
  &::after {
    display: block;
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    border-top: 1px solid $color;
    content: '';
  }
}

@mixin border-none() {
  &::after{
    display: none;
  }
}

@media (-webkit-min-device-pixel-ratio: 1.5), (min-device-pixel-ratio: 1.5) {
  .border-1px {
    &::after {
      -webkit-transform: scaleY(0.7);
      transform: scaleY(0.7);
    }
  }
}

@media (-webkit-min-device-pixel-ratio: 2), (min-device-pixel-ratio: 2) {
  .border-1px {
    &::after {
      -webkit-transform: scaleY(0.5);
      transform: scaleY(0.5);
    }
  }
}
```

### 3、sticky-footer布局
在 header 组件的详情页采用 sticky-footer 布局，主要特点是如果页面内容不够长的时候，页脚块粘贴在视窗底部；如果内容足够长时，页脚块会被内容向下推送

#### 实现：
父级 position:fixed，内容设 为padding-bottom:64px，页脚相对定位，margin-top:-64px，clear:both
为了保证兼容性，父级要清除浮动

参考：
https://www.cnblogs.com/shicongbuct/p/6487122.html
https://www.w3cplus.com/css3/css-secrets/sticky-footers.html

### 4、要求自适应的布局
#### 1、左侧宽度固定，右侧宽度自适应
```
// 左侧固定width：80px，右侧自适应
parent:
    display:fiexd;
child-left:
    flex:0 0 80px
child-right:
    flex:1
```
#### 2、元素宽度自适应设备宽度，且元素要求等宽高样式

例如：商品详情页面的商品图片展示样式
```
// stylus语法
.img_header {
    position:relative
    width:100% // width是 设备宽度
    height:0
    padding-top:100% // 高度设为0,使用padding撑开
    .img {
        position:absolute //定位布局
        top:0
        left:0
        width:100%
        height:100%
    }
}
```

### 5、背景模糊效果
filter：blur(10px),注意，所有在内的子元素也会模糊，包括文字，所以采用定位布局，背景单独占用一个层，ios有一个设置backdrop-filter:blur(10px)，只会模糊背景,但不支持android

### 6、transition过渡
在购买控件中使用transition过渡效果，实现添加减少按钮的动效，和小球飞入购物车的动效（模仿贝塞尔曲线的效果）

vue2.x里面定义了transition过渡状态，
name - string, 用于自动生成 CSS 过渡类名。
```
例如：name: 'fade' 将自动拓展为.fade-enter，.fade-enter-active等。默认类名为 "v"

fade-enter
fade-enter-active
fade-leave
fade-leave-active
```
包括transition过渡的钩子函数
```
before-enter
before-leave
before-appear
enter
leave
appear
after-enter
after-leave
after-appear
enter-cancelled
leave-cancelled (v-show only)
appear-cancelled
```

### 7、seller组件：
#### 问题一：seller页面中商品商家实景图片横向滚动

解决方案：每个 li 要 display：inline-block，因为width不会自动撑开父级ul，所以需要将计算后的宽度赋值给ul的width，（每一张图片的width+margin）*图片数量-一个margin，因为最后一张图片没有margin
同时new BScroll里面要设置scrollX: true,eventPassthrough: 'vertical', // 滚动方向横向

#### 问题二：打开seller页面，无法滚动

问题分析：出现这种现象是因为better-scroll插件是严格基于DOM的，数据是采用异步传输的，页面刚打开，DOM并没有被渲染，所以，要确保DOM渲染了，才能使用 better-scroll，
解决方案：用到mounted钩子函数，同时必须搭配this.$nextTick()

#### 问题三：在seller页面，刷新后，无法滚动

问题分析：出现这种情况是因为mounted函数在整个生命周期中只会只行一次
解决方案：使用watch方法监控数据变化，并执行滚动函数 `this._initScroll();this._initPicScroll();`


### 8、缓存数据
使用window.localStorage保存和设置缓存信息，封装在store.js文件内
```
//将页面信息保存到localStorage里
export function saveToLocal(id, key, value) {
  let store = window.localStorage._store_; // 新定义一个key值_store_，存放要保存的数据对象
  // _store_ {
  //   store[id]: {
  //     key: value
  //   }
  // }
  if (!store) {
    store = {};
    store[id] = {};
  } else {
    store = JSON.parse(store); // String格式--> json格式
    if (!store[id]) {
      store[id] = {};
    }
  }
  store[id][key] = value;
  window.localStorage._store_ = JSON.stringify(store); // 将json格式转成String格式，存放到window.localStorage._store中
}



//将localStorage信息设置到页面中
export function loadFromLocal(id, key, defaults) {
  let store = window.localStorage._store_;
  if (!store) { // 一开始是没有的，因为没有点击事件，所以显示默认数据
    return defaults;
  }
  store = JSON.parse(store)[id]; // 将json格式-->String格式
  // console.log(store); // {"isFavorite":true}
  if (!store) {
    return defaults;
  }
  let ret = store[key];
  return ret || defaults;
}
```

### 9、解析url，得到商家信息，包括id，name，在获取数据时，直接赋值，商家的id或name会被丢掉
使用window.localStorage.search获取url地址，并进行解析
封装在util.js文件内

```
/**
 * 解析URL参数
 * @example ?id=12345&a=b
 * @return Object {id:12345, a:b}
 **/

export function urlParse() {
  let url = window.location.search;
  let obj = {};
  let reg = /[?&][^?&]+=[^?&]+/g;
  let arr = url.match(reg);
  // ['?id=12345', '&a=b']
  if (arr) {
    arr.forEach((item) => {
      let temArr = item.substring(1).split('=');
      let key = decodeURIComponent(temArr[0]);
      let value = decodeURIComponent(temArr[1]);
      obj[key] = value;
    });
  }
  return obj;
};
```

我们需要将得到的 id 和 name 带到数据中，实际上在获取数据的时候，并没有带着id和name，这时就要用到 es6 语法中`Object.assign()`,官方解释为：可以把任意多个的源对象自身的可枚举属性拷贝给目标对象，然后返回目标对象。

```
this.seller = Object.assign({}, this.seller, response.data);

//即将vm.seller属性和请求返回数据对象合并到空对象，然后赋值给vm.seller,这里加上this.seller即提供了一种可扩展的机制，倘若原来的属性中有预定义的其他属性。
```

### 10、goods,ratings,seller组件之间切换时会重新渲染
解决方案：在 app.vu 内使用 keep-alive，保留各组件状态，避免重新渲染
```
<keep-alive>
    <router-view :seller="seller"></router-view>
</keep-alive>
```


## Vue 使用技巧
### 1、vue-router
使用`<router-link>`组件完成导航，`<router-link>` 默认会被渲染成一个 `<a>` 标签，但必须使用 `to属性`，指定连接

```
// app.vue
 <!-- 导航 -->
<router-link to="/home">home</router-link>
<router-link to="/about">about</router-link>

<!-- 路由出口 组件渲染容器 -->
<router-view></router-view>
```
```
// router: index.js

import Vue from 'vue';
import Router from 'vue-router';
import goods from 'components/goods/goods.vue';
import ratings from 'components/ratings/ratings.vue';
import seller from 'components/seller/seller.vue';

Vue.use(Router);

const routes = [{
  path: '/',
  redirect: '/goods'
}, {
  path: '/goods',
  component: goods
}, {
  path: '/ratings',
  component: ratings
}, {
  path: '/seller',
  component: seller
}];

export default new Router({
  routes,
  linkActiveClass: 'active'
});
```

### 2、axios

在vue1.x的时候，vue的官方推荐HTTP请求工具是vue-resource，但是在vue2.0的时候将推荐工具改成了axios。

如果想像以前使用 vue-resource 那样 this.$http.get 调用，要这样定义：

`Vue.prototype.$http = axios;`

通过 this.$http.get 来定义通过vue实例来发送get请求，然后通过then后面的回调函数将请求成功的数据接收，通过状态码来判断是否成功以及复制给vue的数据对象。由于这里是用的mock数据（模拟后台数据），所以用的模拟状态码。

```
const ERR_OK = 0;//表示没有错误信息，即获取数据成功
this.$http.get('/api/seller').then((response) => {
  response = response.data;
  if (response.errno === ERR_OK) {
    this.seller = Object.assign({}, this.seller, response.data);
  }
});
```
### 3、组件间通讯
vue是组件式开发，所以组件间通讯是必不可少的

- 父传子: props
- 子传父: $emit
- 兄弟通讯: 1. event bus: 利用一个中间组件来作为信息传递中介；2. vuex: 信息树


#### 父传子: props
vue提供了一种方式，即在子组件定义 props 来接受父组件传递来的数据对象。
```
// 父组件
<v-header :seller="seller"></v-header>

// 子组件 header.vue
props: {
  seller: {
    type: Object
  }
}
```

#### 子传父: $emit
如果是子组件想传递数据给父组件，需要派发自定义事件，使用 $emit 派发，
父组件使用v-on接收监控（v-on可以简写成@）

```
// 子组件 RatingSelect.vue，派发自定义事件isContent，将this.onlyContent数据传给父级

this.$emit('isContent', this.onlyContent);
this.$emit('selRatings', this.selectType);

// 父组件 foodInfo.vue 在子组件的模板标签里，使用v-on监控isContent传过来的数据

<v-ratingselect @selRatings="filterRatings" @isContent="iscontent"></v-ratingselect>

```

### 非父子组件之间通信

1. 大型项目可以用 Vue官方推荐的vuex
2. EventBus ：https://n-y.io/vue-eventbus/
3. 子组件A $emit 派发具体事件，由父组件 @ 监听得到数据
父组件再利用 $refs 直接访问子组件B的方法，间接实现数据从子组件A传递至子组件B

### 4、组件提取管理
将相同样式或功能的区块单独提出来，作为一个组件。
另外组件中用到的图片等资源就近维护，即可以考虑在组件文件夹中新建images文件夹。

抽离组件遵循原则：
要尽量遵循单一职责原则，复用性更高，不要设置额外的margin等影响布局的东西


### 5、打开app应用，默认显示 goods 页面内容
想要达到这种目的，有两种方法，一种是利用重定向，另一种是利用vue-router的导航式编程。

#### 1、重定向
```
//在router的index.js文件中设置，要多写一个对象，指向目标组件

Vue.use(Router);

const routes = [{
  path: '/',
  redirect: '/goods'   // 重定向
}, {
  path: '/goods',
  component: goods
}, {
  path: '/ratings',
  component: ratings
}, {
  path: '/seller',
  component: seller
}];

export default new Router({
  routes,
  linkActiveClass: 'active'
});
```
#### 2、导航式编程
```
router.push('/Goods');
```


## 项目难点

### 1、关于购物车添加按钮的动画


#### html代码
- 生成一个动画小球的div,并且生成五个小球,五个是为了生成一定数量的小球来作为操作使用,按照小球动画的速度,一般来说五个也可以保证有足够的小球数量来运行动画
- 动画的内容分别是外层和内层,外层控制动画小球的轨道和方向,内层控制动画小球自身的运行状态
- 动画使用vue的js钩子实现
- 因为小球动画只有一个方向(只执行单方向从上到下滚落),所以只用了before-enter,enter,after-enter
- 用v-show控制小球的可见性,在动画执行期间可见,其余时候隐藏
```
    <div class="ball-container">
      <div v-for="ball in balls">
      //用了两种方式的动画,css和js钩子
        <transition name="drop" @before-enter="beforeDrop" @enter="dropping" @after-enter="afterDrop">
        //外层动画
          <div class="ball" v-show="ball.show">
          //内层动画
            <div class="inner inner-hook"></div>
          </div>
        </transition>
      </div>
    </div>
```
#### js代码
- 设置了balls数组来代表五个小球
- 设置了dropBalls数组正在运行的小球

```
 data(){
      return {
        balls: [
          {show: false},
          {show: false},
          {show: false},
          {show: false},
          {show: false}
        ],
        dropBalls: []
      }
    },
```

- 只要触发了drop事件,不止是drop事件里面的代码会执行,另外几个vue的js监听钩子也会一起按顺序执行
    - 触发了 drop 事件
    - beforeDrop 开始执行
    - dropping 开始执行
    - afterDrop 开始执行
- drop 事件的触发可以通过点击 cartcontrol 组件的添加小球按钮 addCart 事件触发使用 `$emit` ，也可以父组件  `this.$refs.shopcart.drop(target);` 直接触发
    - 这么做的目的是实现，在子组件 cartcontrol 点击之后，可以将具体点击的 dom 传给父组件 goods 然后再传给子组件 shopcart，（因为目前他们之间的通道就是这样，shopcart子组件并没有导入cartcontrol子组件，所以没有直接通讯）这样就实现了多个组件之间的通讯（也可以使用 EventBus 和 vuex），从而可以实现需求，例如这里就是实现点击子组件 cartcontrol 后添加一个动画,将小球滑落到另外一个组件shopcart
- `$emit` 是触发当前实例上的事件。附加参数都会传给监听器回调。

```
methods: {
      drop(el) {
      //触发一次事件就会将所有小球进行遍历
        for (let i = 0; i < this.balls.length; i++) {
          let ball = this.balls[i];
          if (!ball.show) { //将false的小球放到dropBalls
            ball.show = true;
            ball.el = el; //设置小球的el属性为一个dom对象
            this.dropBalls.push(ball);
            return;
          }
        }
      },

      beforeDrop(el){ //这个方法的执行是因为这是一个vue的监听事件
        let count = this.balls.length;
        while (count--) {
          let ball = this.balls[count];
          if (ball.show) {
            let rect = ball.el.getBoundingClientRect(); //获取小球的相对于视口的位移(小球高度)
            let x = rect.left - 32;
            let y = -(window.innerHeight - rect.top - 22); //负数,因为是从左上角往下的的方向
            el.style.display = ''; //清空display
            el.style.webkitTransform = `translate3d(0,${y}px,0)`;
            el.style.transform = `translate3d(0,${y}px,0)`;
            //处理内层动画
            let inner = el.getElementsByClassName('inner-hook')[0]; //使用inner-hook类来单纯被js操作
            inner.style.webkitTransform = `translate3d(${x}px,0,0)`;
            inner.style.transform = `translate3d(${x}px,0,0)`;
          }
        }
      },

      dropping(el, done) { //这个方法的执行是因为这是一个vue的监听事件
        /* eslint-disable no-unused-vars */
        let rf = el.offsetHeight; //触发重绘html
        this.$nextTick(() => { //让动画效果异步执行,提高性能
          el.style.webkitTransform = 'translate3d(0,0,0)';
          el.style.transform = 'translate3d(0,0,0)';
          //处理内层动画
          let inner = el.getElementsByClassName('inner-hook')[0]; //使用inner-hook类来单纯被js操作
          inner.style.webkitTransform = 'translate3d(0,0,0)';
          inner.style.transform = 'translate3d(0,0,0)';
          el.addEventListener('transitionend', done); //Vue为了知道过渡的完成，必须设置相应的事件监听器。
        });
      },

      afterDrop(el) { //这个方法的执行是因为这是一个vue的监听事件
        let ball = this.dropBalls.shift(); //完成一次动画就删除一个dropBalls的小球
        if (ball) {
          ball.show = false;
          el.style.display = 'none'; //隐藏小球
        }
      }
    }
```


- 关于 [transitionend](https://cn.vuejs.org/v2/guide/transitions.html#同时使用过渡和动画)
- 关于drop方法,是实现每一个ball的show属性和el属性处理,并且点击一次会自动将一个小球放到 dropBalls 数组里面,放到里面就代表的是一个小球已经被开始执行动画,但是由于动画是异步的,所以先主动设置.
- 关于 `getBoundingClientRect` (位移的计算是从左上角开始)
    - 使用  `getBoundingClientRect` 获取到当前元素的坐标,然后需要位移的left减去元素的宽获取真正的最终位移x坐标
    - 使用 `getBoundingClientRect` 获取到当前元素的坐标,然后需要当前屏幕的高度减去元素的 top 再减去元素本身的高度获取到真正的最终位移 y 坐标,并且这个是负数,因为是从左上角往下的方向
- 关于html重绘
    - 因为浏览器对于重绘是有要求并且是有队列完成的,这是主要为了性能,虽然动画隐藏了小球display none,但没有触发html重绘,或者说没有立即触发html重绘,所以需要手动
    - `let rf = el.offsetHeight;` **这是一个手动触发html重绘的方法**
    - [网页性能管理详解](http://www.ruanyifeng.com/blog/2015/09/web-page-performance-in-depth.html)
    - [高性能JavaScript 重排与重绘](http://www.cnblogs.com/zichi/p/4720000.html)


#### css代码

```
    .ball-container
      .ball
        position: fixed //小球动画必须脱离html布局流
        left: 32px
        bottom: 22px
        z-index: 200
        transition: all 0.4s cubic-bezier(0.49, -0.29, 0.75, 0.41)
        .inner
          width: 16px
          height: 16px
          border-radius: 50%
          background: rgb(0, 160, 220)
          transition: all 0.4s linear
```
- 关于cubic-bezier(0.49, -0.29, 0.75, 0.41),是动画抛物曲线(贝塞尔曲线)的配置，基于css3实现，参考贝塞尔曲线与CSS3动画、SVG和canvas的基情 ,至于抛物线放在外层就是为了控制内层的元素的轨道和方向的.


### 2、星星组件star.vue

整个流程是:

1. 绑定星星类型的class(48,36,24尺寸),使用starType
2. 使用class来显示星星,有3种类型,全星,半星,无星,使用star-item代表星星本身,然后分别使用on,off,half代表三种不同类型的星星
3. 一个span代表一个星星项目,并且使用v-for循环将星星项目输出

最后形成的星星html就类似这样

```
<div class="star star-48">
<span class="star-item on"></span>
<span class="star-item on"></span>
<span class="star-item on"></span>
<span class="star-item on"></span>
<span class="star-item half"></span>
</div>
```

#### html部分

```
<template>
  <div class="star" :class="starType">
    <span v-for="itemClass in itemClasses" :class="itemClass" class="star-item"></span>
  </div>
</template>
```


#### js部分

- 设置常量是为了方便解耦
- 星星计算比较巧妙(根据分数转换为星星数)
    - 对于分数score进行乘以2然后向下取整，然后再除以2，是为了获取所有星星的数量，并且这个数量是0.5倍数的,例如4.6 2就是9.2，然后向下取整是9，然后再除以2就是4.5，那么就可以得到一个0.5倍数的星星数，可以转换为4个全星+一个半星
    - 对于非整数的星星算作是半个星星，需要知道是否有存在这种情况，所以分数score%1 ，例如 8 % 1是0，8.5 % 1就不是0，并且这个半星只会出现一次，因为半星状态就只要一个
    - 没有星星的部分是要补全的，这里使用while循环来处理这种情况

```
<script>
  //设置常量
  const LENGTH = 5;
  const CLS_ON = 'on';
  const CLS_HALF = 'half';
  const CLS_OFF = 'off';

  export default{
    props: {
      size: { //传入的size变量
        type: Number //设置变量类型
      },
      score: { //传入的score变量
        type: Number
      }
    },
    computed: {
      starType(){ //通过计算属性,返回组装过的类型,用来对应class类型
        return 'star-' + this.size;
      },
      itemClasses(){
        let result = []; //返回的是一个数组,用来遍历输出星星
        let score = Math.floor(this.score * 2) / 2; //计算所有星星的数量
        let hasDecimal = score % 1 !== 0; //非整数星星判断
        let integer = Math.floor(score); //整数星星判断
        for (let i = 0; i < integer; i++) { //整数星星使用on
          result.push(CLS_ON);//一个整数星星就push一个CLS_ON到数组
        }
        if (hasDecimal) { //非整数星星使用half
          result.push(CLS_HALF);//类似
        }
        while (result.length < LENGTH) { //余下的用无星星补全,使用off
          result.push(CLS_OFF);//类似
        }
        return result;
      }
    }
  }
</script>
```

#### css部分
- 引入mixin.styl是为了使用bg-image的mixin,因为之前做了一个mixin是专门处理2x和3x图片的转换
- 因为这里有3种类型的星星图片,分别是48尺寸,36尺寸,24尺寸,所以对于每一个类别的图片分别使用一种class做对应
- 每一种星星的尺寸都是有一种相对应的图片的,例如48尺寸的星星就会有,并且图片放在相对应的vue文件目录下

```
star48_half@2x.png
star48_half@3x.png
star48_off@2x.png
star48_off@3x.png
star48_on@2x.png
star48_on@3x.png
```

```
<style lang="scss" rel="stylesheet/scss">
  @import "../../common/css/mixin";

  .star {
    font-size: 0;
    .star-item {
      display: inline-block;
      background-repeat: no-repeat;
    }
    &.star-48 {  //48尺寸的星星
      .star-item {  //每一个星星的基本css信息
        width: 20px;
        height: 20px;
        margin-right: 22px;   //每一个星星dom都有外边距
        background-size: 20px 20px;
        &:last-child {  //最后一个的外边距就是0
          margin-right: 0;
        }
        &.on {  //全星状态的class
          @include bg-img('star48_on')
        }
        &.half {  //半星状态的class
          @include bg-img('star48_half')
        }
        &.off {   //无星状态的class
          @include bg-img('star48_off')
        }
      }
    }
    &.star-36 {
      .star-item {
        width: 15px;
        height: 15px;
        margin-right: 6px;
        background-size: 15px 15px;
        &:last-child {
          margin-right: 0;
        }
        &.on {
          @include bg-img('star36_on')
        }
        &.half {
          @include bg-img('star36_half')
        }
        &.off {
          @include bg-img('star36_off')
        }
      }
    }
    &.star-24 {
      .star-item {
        width: 10px;
        height: 10px;
        margin-right: 3px;
        background-size: 10px 10px;
        &:last-child {
          margin-right: 0;
        }
        &.on {
          @include bg-img('star24_on')
        }
        &.half {
          @include bg-img('star24_half')
        }
        &.off {
          @include bg-img('star24_off')
        }
      }
    }
  }
</style>
```


### 3、ratingselect组件

#### html代码

> 备注:父组件food.vue传入的数据
```
    <ratingselect @select="selectRating" @toggle="toggleContent" :selectType="selectType"
                        :onlyContent="onlyContent" :desc="desc"
                        :ratings="food.ratings"></ratingselect>
```

- 方法有：`@select="selectRating" @toggle="toggleContent"`，通过将字组件的方法和父组件的方法进行关联，这样就能够实现跨组件通讯和操作

- 属性有：`:selectType="selectType":onlyContent="onlyContent" :desc="desc":ratings="food.ratings"`，这是通过pros传入到子组件的属性，将父组件的数据传到子组件里面，也带有一种通过父组件来初始化子组件属性的意思.

```
  <div class="ratingselect">
  <!--有使用一个border-1px的mixin-->
    <div class="rating-type border-1px">
    <!--绑定一个select方法控制切换,绑定class控制切换之后的按钮样式显示-->
      <span @click="select(2,$event)" class="block positive" :class="{'active':selectType ===2}">{{desc.all}}<span
        class="count">{{ratings.length}}</span></span>
      <span @click="select(0,$event)" class="block positive" :class="{'active':selectType ===0}">{{desc.positive}}<span
        class="count">{{positives.length}}</span></span>
      <span @click="select(1,$event)" class="block negative" :class="{'active':selectType ===1}">{{desc.negative}}<span
        class="count">{{negatives.length}}</span></span>
    </div>
    <!--绑定一个toggleContent方法来控制有内容和无内容的显示-->
    <div @click="toggleContent" class="switch" :class="{'on':onlyContent}">
      <span class="icon-check_circle"></span>
      <span class="text">只看有内容的评价</span>
    </div>
  </div>
```


- `@click="select(2,$event)"`  select方法传入类型和事件,然后在methods里面调用父组件的方法,实现子组件控制父组件的目的
- `:class="{'active':selectType ===2}"`  根据类型来确定显示的class,实现不同类型显示不同样式的目的
- `positives.length` 使用计算属性自动计算类型数组的长度,用来显示不同类型的数量
- `@click="toggleContent" :class="{'on':onlyContent}"`
  - `toggleContent` 控制是否展示有内容的rate,也是在methods里面调用父组件的方法,实现子组件控制父组件的目的
  - 绑定`on`这个class来控制该按钮的样式


#### JS代码

```
  const POSITIVE = 0; //设置显示常量
  const NEGATIVE = 1;
  const ALL = 2;

  export default{
    props: {
      ratings: { //传入ratings数组,跟food.ratings关联
        type: Array,
        default(){
          return [];
        }
      },
      selectType: { //跟selectType关联,通过在父组件里面设置这3个值来实现控制子组件的操作
        type: Number,
        default: ALL
      },
      onlyContent: { //跟onlyContent关联
        type: Boolean,
        default: true
      },
      desc: { //跟desc关联
        type: Object,
        default(){
          return {
            all: '全部',
            positive: '满意',
            negative: '不满意'
          }
        }
      }
    },
    computed: {
      positives(){ //自动过滤rateType(正面的rate)
        return this.ratings.filter((rating) => { //js的filter函数会返回一个处理后的(为true)结果的结果数组
          return rating.rateType === POSITIVE;
        })
      },
      negatives(){ //自动过滤rateType(反面的rate)
        return this.ratings.filter((rating) => {
          return rating.rateType === NEGATIVE;
        })
      }
    },
    methods: {
      select(type, event) { // 选择rateType并且通知父组件
        if (!event._constructed) {
          return;
        }
        this.$emit('select', type); // 派发事件，父组件监听此事件
      },
      toggleContent(event) { // 选择是否显示有内容的rate,并且通知父组件
        if (!event._constructed) {
          return;
        }
        this.$emit('toggle');
      }
    }
  }
```

### 4、商品区域goods.vue

#### HTML

1. v-for使用已经很常见了,不过这里需要了解，vue1和2有区别,现在是用vue2,所以index变量传递会变成现在这种模式 `(item,index) in goods`
2. vue传递原生事件使用$event
3. `:class="{'current':currentIndex === index}"` 是vue的绑定class的使用方法，通过绑定一个class变量来直接操作，并且这里的逻辑会跟js代码里面对应
    1. 通过currentIndex和index做对比，来确认是否添加current类，他们之间的对比关系也就是 menu 区域和 foods 区域的显示区域的对比关系
    1. 通过添加current类来实现当前页面的区域的样式变化
    1. currentIndex是一个计算属性，可以随时变化并且直接反应到dom上(看js里面逻辑)
1. `v-show` 和 `v-if` 的区别官网已经说过
    1. v-if 是“真正的”条件渲染，因为它会确保在切换过程中条件块内的事件监听器和子组件适当地被销毁和重建。
    2. v-if 也是惰性的：如果在初始渲染时条件为假，则什么也不做——直到条件第一次变为真时，才会开始渲染条件块。
一般来说， v-if 有更高的切换开销，而 v-show 有更高的初始渲染开销。因此，如果需要非常频繁地切换，则使用 v-show 较好；如果在运行时条件不太可能改变，则使用 v-if 较好。

1. `$refs` 的使用是vue操作dom的一种方式:
    1. ref 被用来给元素或子组件注册引用信息。引用信息将会注册在父组件的 $refs 对象上。
    1. 如果在普通的 DOM 元素上使用，引用指向的就是 DOM 元素; 如果用在子组件上，引用就指向组件实例:
1. hook钩子类的使用,需要结合js里面的语法来看,这个类只是用来操作,不会产生dom的渲染,方便js控制清晰.


#### JS

- `<food @add="addFood" :food="selectedFood" ref="food">` 是通过selectFood方法写入到vue实例里面,然后传给子组件food
- `<shopcart ref="shopcart" :selectFoods="selectFoods"`  这里selectFoods被自动添加了count属性,是为了让购物车更加简单的计算已选择的food
- 这里最关键的是menu和food两个区域的对应处理:
    - 在vue实例生命周期的开始created分别加载`_initScroll`和`_calculateHeight`
    - 通过 `_calculateHeight` 计算foods内部每一个块的高度,组成一个数组listHeight
    - 在 `_initScroll` 里面,设置了bscroll插件的一个监听事件scroll,将food区域当前的滚动到的位置的y坐标设置到一个vue实例属性 `scrollY this.scrollY = Math.abs(Math.round(pos.y));`
    - 通过计算属性currentIndex,获取到food滚动区域对应的menu区域的子块的索引,然后通过设置一个class来做样式切换变化`:class="{'current':currentIndex === index}`，实现联动
    - 另外当点击menu 区域的时候,会触发selectMenu事件,也会根据点击到的menu子块的索引然后去触发food区域滚动到对应的高度区块区间`this.foodsScroll.scrollToElement(el, 300);`
    - 这样完成整个对应.
- 抛物线小球动画横跨多个vue组件(也可以说是横跨了多个DOM)
- better-scroll需要安装,npm安装,具体参看better-scroll官网
- 关于在`selectMenu`中点击，在pc界面会出现两次事件,在移动端就只出现一次事件的问题:
    - 原因:
        - bsScrooler会监听事件(例如touchmove,click之类),并且阻止默认事件(prevent stop),并且他只会监听移动端的,pc端的没有监听
        - 在pc页面上 bsScroller也派发了一次click事件,原生也派发了一次click事件
    - 解决:
        - 针对bsScroole的事件,有`_constructed: true`，所以做处理,return 掉非bsScroll的事件


## SCSS 预处理器
### css预处理器

index.scss是SCSS文件的入口文件，里面使用 @import 引入各种SCSS文件
```
@import "./base";
@import "./mixin";
@import "./icon.css";
```
在入口文件main.js中全局引用index.scss
```
import 'common/css/index.scss';
```
## 关于ESlint
eslint 是一个js代码风格检查器，配合vue-cli脚手架中的热更新，可以很方便的定位和提示错误。在公司多人协作开发时可以确保代码风格保持一致，可以很方便的阅读他人的代码。

## 手机测试网页技巧
将 localhost 换成自己的ip (Windows在命令行执行ipconfig查看，mac执行ifconfig查看)

然后复制地址栏地址，进入草料二维码，然后生成二维码，然后用手机扫一扫就可以查看了，前提是，你手机和电脑必须在同一个局域网。


## 项目运行
```
克隆项目到本地
git clone https://github.com/lisibo/ele-vue.git

安装依赖
npm install

本地开发，开启服务器，浏览器访问http://localhost:8081
npm run dev

构建生产
npm run build

运行打包文件
node prod.server.js

会看到 Listening at http://localhost:9000 在浏览器中打开即可
```



---

## 学习参考
- Vue2.0 官网： https://vuefe.cn/v2/guide/
- vue-cli：https://github.com/vuejs/vue-cli
- vue-router 2.0文档：https://router.vuejs.org/zh-cn/
- axios：https://github.com/axios/axios
- webpack官网：https://webpack.js.org/
- better-scroll 插件使用：https://github.com/ustbhuangyi/better-scroll
- SCSS 预处理器： https://www.sass.hk/
- ESlint 代码风格检查：http://eslint.org/docs/rules/
- ES6 入门: http://es6.ruanyifeng.com/
- Sticky footers http://www.w3cplus.com/css3/css-secrets/sticky-footers.html
- Flex 弹性布局: http://www.ruanyifeng.com/blog/2015/07/flex-grammar.html?utm_source=tuicool
- 设备像素比：http://www.zhangxinxu.com/wordpress/2012/08/window-devicepixelratio/
- 贝塞尔曲线生成器：http://cubic-bezier.com/#.17,.67,.83,.67
- localStorage 本地存储: http://www.cnblogs.com/st-leslie/p/5617130.html
