# 一、什么是副作用？

在一个组件中，只要不是把数据转化成视图的代码，就属于副作用。比如获取 dom 元素，为 dom 元素添加事件，设置定时器，以及发送 ajax 请求等都属于副作用代码，在类组件中，通常使用生命周期函数处理这些副作用，在函数组件中，就使用 hooks 来处理这些副作用。

# 二、类组件的不足

## 1.缺少逻辑复用机制

在类组件中，通常使用渲染属性和高阶组件来实现逻辑复用，但两者代码本身看起来就很复杂，而且为了实现逻辑复用，都是在组件的外部又包裹了一层组件，而这层组件又没有实际的渲染效果，所以增加了组件层级的同时又显得十分臃肿。

## 2.类组件由于依靠生命周期会将一组相关业务拆分到了不同生命周期函数中

## 3.this 指向的问题

当给一个元素绑定了事件，在事件处理函数中需要更改状态时，此时需要更改 this 的指向，否则就会指向 undefined，通常会使用 bind 或嵌套函数的方法更改 this 指向。这样也会增加维护成本。

# 三、useState

注意事项：
参数可以是一个函数，函数返回值就是初始值，这个函数只会被调用一次，用在初始值为动态值的情况。

```javascript
// 错误用法——当组件重新渲染时，propsCount就会重新计算，无意义
const propsCount = props.count || 0;
const [count, setCount] = useState(propsCount);

// 正确用法
const [count, setCount] = useState(() => props.count || 0);
```

# 三、ReactDOM.unmountComponentAtNode 可以直接销毁组件

```javascript
ReactDOM.unmountComponentAtNode(document.getElementById("root"));
```

# 四、钩子函数与异步函数相结合

在钩子函数 useEffect 中如果需要使用异步函数，不能按通常的逻辑处理，而是需要执行一个自执行函数，这个自执行函数是一个异步函数，在这个自执行函数内部使用 await 关键字。

# 五、useCallback

观看下面的代码，当点击 button1 时，执行了 resetCount 方法，使得 count 数值更改，使得 App 组件重新渲染，也使得 resetCount 函数实例重新生成，虽然 Foo 组件被 memo（如果本组件中的数据没有发生变化, 就阻止组件更新） 包裹了，但是由于给 Foo 组件传递了 resetCount 函数，Foo 组件就认为传递的数据发生了变化，使得 Foo 组件也重新渲染。

此时，因此在这种情况下需要使用 useCallback 缓存函数实例。

```javascript
import React, { useState, memo } from "react";

function App() {
  const [count, setCount] = useState(0);
  const resetCount = () => {
    setCount(0);
  };
  return (
    <div>
      <span>{count}</span>
      <button onClick={() => setCount(count + 1)} id="button1">
        +1
      </button>
      <Foo resetCount={setCount} />
    </div>
  );
}

const Foo = memo(function Foo(props) {
  return (
    <div>
      我是Foo组件
      <button onClick={props.resetCount} id="button2">
        reset
      </button>
    </div>
  );
});
```

// 只有当 setCount 发生变化时，resetCount 才会重新生成

```javascript
const resetCount = useCallback(() => {
  setCount(0);
}, [setCount]);
```

# 六、useRef

useRef 与 useState 的区别：useState 保存的数据是状态数据，数据发生改变时会触发组件重新渲染，useRef 保存的数据不是状态数据，数据更改时组件不会重新渲染。

# 七、自定义 hook

```javascript
function useUpdateInput(initialValue) {
  const [value, setValue] = useState(initialValue);
  return {
    value,
    onChange: (event) => setValue(event.target.value),
  };
}
function App() {
  const usernameInput = useUpdateInput("");
  const passwordInput = useUpdateInput("");
  const submitForm = (event) => {
    event.preventDefault();
    console.log(usernameInput.value);
    console.log(passwordInput.value);
  };
  return (
    <form onSubmit={submitForm}>
      <input type="text" name="username" {...usernameInput} />
      <input type="password" name="password" {...passwordInput} />
      <input type="submit" />
    </form>
  );
}
```

# 八、useState 实现原理

1.当在 useState 方法中重新调用 render 方法时，App 组件重新渲染，此时 initialState 又重新为 0，因此需要将 state 写在 useState 方法外面。
2.useState 可以被调用多次。因此 state 数据类型选择为数组，存储的是状态值。setters 存储的是对应的设置状态值的方法。利用索引 stateIndex 建立对应关系。

3.useState 每次调用时，都需要使用闭包将 stateIndex 存储下来，在 useState 方法外创建 createSetter 方法（createSetter 方法里使用了形参 index，并返回了函数，index 保存了下来）

4.当调用 createSetter 方法时，执行了 render 方法，使得 App 重新渲染，useState 也会被重新执行，此时 useState 方法里的 stateIndex++也会执行，这样更改了 index 是不行的，因此在 render 方法里要执行归零操作 stateIndex=0

```javascript
import React from "react";
import ReactDOM from "react-dom";

let state = [];
let setters = [];
let stateIndex = 0;

function createSetter(index) {
  return function (newState) {
    state[index] = newState;
    render();
  };
}
function useState(initialState) {
  state[stateIndex] = state[stateIndex] ? state[stateIndex] : initialState;
  setters.push(createSetter(stateIndex));
  let value = state[stateIndex];
  let setter = setters[stateIndex];
  stateIndex++;
  return [value, setter];
}

function render() {
  stateIndex = 0;
  ReactDOM.render(<App />, document.getElementById("root"));
}

function App() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState("san");
  return (
    <>
      <div>
        {name}
        <button onClick={() => setName("si")}>setCount</button>
      </div>
      <div>
        {count}
        <button onClick={() => setCount(count + 1)}>setCount</button>
      </div>
    </>
  );
}
export default App;
```
