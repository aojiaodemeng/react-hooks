主要内容：  
- 为什么 useState 要使用数组而不是对象？
- React Hooks 解决了哪些问题？
- useEffect 与 useLayoutEffect 的区别

参考链接：  

# 为什么 useState 要使用数组而不是对象？
先看一下ES6中的解构赋值：
```js
// 数组的解构赋值
const foo = [1, 2, 3];
const [one, two, three] = foo;
console.log(one);	// 1
console.log(two);	// 2
console.log(three);	// 3

// 对象的解构赋值
const user = {
  id: 888,
  name: "xiaoxin"
};
const { id, name } = user;
console.log(id);	// 888
console.log(name);	// "xiaoxin"

// 如果 useState 返回对象：
// 第一次使用
const { state, setState } = useState(false);
// 第二次使用
const { state: counter, setState: setCounter } = useState(0) 
```
- 如果useState返回的是数组，那么使用者可以对数组中的元素命名，代码看起来也更干净
- 如果useState返回的是对象，在解构对象时必须要和 useState 内部实现返回的对象同名，想要使用多次的话，必须得设置别名才能使用返回值
总结：useState 返回的是 array 而不是 object 的原因就是为了降低使用的复杂度，返回数组的话可以直接根据顺序解构，而返回对象的话要想使用多次就需要定义别名了。


# React Hooks 解决了哪些问题？  
[面试官：说说对React中类组件和函数组件的理解？有什么区别？](https://blog.csdn.net/weixin_44475093/article/details/118586430)  
[hooks和类组件的区别](https://www.jianshu.com/p/89fcebd63f06)   
类组件的不足：
- 状态逻辑难以复用。虽然在类组件中可以用**高阶组件+继承**解决，但hooks的解决方案更好
- 业务代码难以维护。类组件通常使用生命周期函数处理这些副作用，因此有时会将同一组相关业务拆分到不同生命周期函数里。
- this指向问题。当给一个元素绑定了事件，在事件处理函数中需要更改状态时，需要更改this的执行，增加维护成本。

# useEffect 与 useLayoutEffect 的区别
[React16 useEffect和useLayoutEffect的区别](https://blog.csdn.net/yingzizizizizizzz/article/details/107773111?spm=1001.2101.3001.6650.5&utm_medium=distribute.pc_relevant.none-task-blog-2%7Edefault%7ECTRLIST%7Edefault-5.no_search_link&depth_1-utm_source=distribute.pc_relevant.none-task-blog-2%7Edefault%7ECTRLIST%7Edefault-5.no_search_link)  

共同点：使用方式相同、且两者都是用来处理副作用（改变 DOM、设置订阅、操作定时器等）  
不同点：
- useEffect是被异步调用的，在浏览器将所有变化渲染到屏幕后才会被执行
- seLayoutEffect是同步执行的，在浏览器将所有变化渲染到屏幕之前执行的

使用：
一般情况把初始化请求放在useEffect，有DOM操作时使用useLayoutEffect。useLayoutEffect总是比useEffect先执行。

