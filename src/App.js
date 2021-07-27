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
