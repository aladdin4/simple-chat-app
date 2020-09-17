function createStore(reducer, initialState) {
  let state = initialState;

  //an array of subscribers, each listener is a callback function to alert the component of state changes at the store.
  const listeners = [];

  //adding a listener.
  const subscribe = (listener) => listeners.push(listener);

  const getState = () => state;

  //the dispatch now calls every callback function in the subscribers list, to notify them of state changes, so they call getState().
  const dispatch = (action) => {
    state = reducer(state, action);

    //any call to dispatch is a call to the subscriber callbacks
    listeners.forEach((listener) => listener());
  };

  return {
    //...
    //making subscribe() exposed by returning it in the object
    subscribe,
    getState,
    dispatch,
  };
}

function reducer(state, action) {
  //the logic for the addition.
  if (action.type === "ADD_MESSAGE") {
    return {
      messages: state.messages.concat(action.message),
    };

    //the logic for the deletion.
  } else if (action.type === "DELETE_MESSAGE") {
    return {
      messages: [
        ...state.messages.slice(0, action.index),
        ...state.messages.slice(action.index + 1, state.messages.length),
      ],
    };
  } else {
    return state;
  }
}

const initialState = { messages: [] };

const store = createStore(reducer, initialState);

//a test listener.
const listener = () => {
  console.log("Current state: ");
  console.log(store.getState());
};

store.subscribe(listener);

const addMessageAction1 = {
  type: "ADD_MESSAGE",
  message: "How do you read?",
};
store.dispatch(addMessageAction1);
// -> `listener()` is called

const addMessageAction2 = {
  type: "ADD_MESSAGE",
  message: "I read you loud and clear, Houston.",
};
store.dispatch(addMessageAction2);
// -> `listener()` is called

const deleteMessageAction = {
  type: "DELETE_MESSAGE",
  index: 0,
};
store.dispatch(deleteMessageAction);
// -> `listener()` is called

const App = { createStore, reducer, initialState }; // for tests
export default App;
