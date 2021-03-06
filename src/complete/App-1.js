//we modified createStore() to accept any state initialization, so it's flexible to work with more state data structures than just int. numbers.
function createStore(reducer, initialState) {
  let state = initialState;
  // ...

  const getState = () => state;

  //dispatch will change the state object by concat. the new string to it.
  const dispatch = (action) => {
    state = reducer(state, action);
  };

  return {
    getState,
    dispatch,
  };
}

//our reducer() should be pure function.
function reducer(state, action) {
  if (action.type === "ADD_MESSAGE") {
    return {
      messages: state.messages.concat(action.message),
    };
  } else {
    return state;
  }
}

const initialState = { messages: [] };

const store = createStore(reducer, initialState);

const addMessageAction1 = {
  type: "ADD_MESSAGE",
  message: "How does it look, Neil?",
};

store.dispatch(addMessageAction1);
const stateV1 = store.getState();

const addMessageAction2 = {
  type: "ADD_MESSAGE",
  message: "Looking good.",
};

store.dispatch(addMessageAction2);
const stateV2 = store.getState();

console.log("State v1:");
console.log(stateV1);
console.log("State v2:");
console.log(stateV2);

const App = { createStore, reducer, initialState }; // for tests
export default App;
