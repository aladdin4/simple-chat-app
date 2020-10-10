//as app is the top-level component, it will be the one that subscribe to the store becausethe only function we need to notify when state updates is render(), that will cause the required re-render effect
import React from "react";

function createStore(reducer, initialState) {
  let state = initialState;
  const listeners = [];

  const subscribe = (listener) => listeners.push(listener);

  const getState = () => state;

  const dispatch = (action) => {
    state = reducer(state, action);
    listeners.forEach((l) => l());
  };

  return {
    subscribe,
    getState,
    dispatch,
  };
}

function reducer(state, action) {
  if (action.type === "ADD_MESSAGE") {
    return {
      messages: state.messages.concat(action.message),
    };
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

//our top-level component, the one that subscribes to; and reads from the store
class App extends React.Component {
  //
  //the best place to subscribe is here
  componentDidMount() {
    //
    //we use forceUpdate() to reRender the component, and so reRender all the children components.
    store.subscribe(() => this.forceUpdate());
  }

  render() {
    //
    //we get the most updated state when reRender()
    const messages = store.getState().messages;

    return (
      <div className="ui segment">
        {/*this child component will read from the state and update it's view through a reRender */}
        <MessageView messages={messages} />
        <MessageInput />
      </div>
    );
  }
}

//a component that have an input form and submit btn
class MessageInput extends React.Component {
  state = {
    value: "",
  };

  //we will keep the entered data locally in the form state.
  onChange = (e) => {
    this.setState({
      value: e.target.value,
    });
  };

  //a callback function, instead of calling the parent's handler through props, it calls the store.dispatch() method.
  handleSubmit = () => {
    store.dispatch({
      type: "ADD_MESSAGE",
      message: this.state.value,
    });
    this.setState({
      value: "",
    });
  };

  render() {
    return (
      <div className="ui input">
        <input onChange={this.onChange} value={this.state.value} type="text" />
        <button
          onClick={this.handleSubmit}
          className="ui primary button"
          type="submit"
        >
          Submit
        </button>
      </div>
    );
  }
}

class MessageView extends React.Component {
  handleClick = (index) => {
    store.dispatch({
      type: "DELETE_MESSAGE",
      index: index,
    });
  };

  render() {
    const messages = this.props.messages.map((message, index) => (
      <div
        className="comment"
        key={index}
        onClick={() => this.handleClick(index)}
      >
        {message}
      </div>
    ));
    return <div className="ui comments">{messages}</div>;
  }
}

export default App;
