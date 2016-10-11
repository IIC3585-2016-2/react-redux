import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Provider, connect } from 'react-redux';
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';

// Constants
const ADD_TODO = 'ADD_TODO';
const REMOVE_TODO = 'REMOVE_TODO';

// Reducer
function todos(state = [], action) {
  switch (action.type) {
  case ADD_TODO:
    return [...state, action.text];
  case REMOVE_TODO:
    return [
      ...state.slice(0, action.index),
      ...state.slice(action.index + 1),
    ];
  default:
    return state;
  }
}

// Actions
const addTodoAction = (text) => ({
  type: ADD_TODO,
  text,
});
const removeTodoAction = (index) => ({
  type: REMOVE_TODO,
  index,
});

// Combine reducers into a big reducer
const reducers = combineReducers({
  todos,
});

// Create redux store:
const INITIAL_STATE = {
  todos: ['Aprender Redux', 'Dominar el mundo'],
};
const devTools = window.devToolsExtension ? window.devToolsExtension() : () => {};
const logger = createLogger();
const enhancer = compose(applyMiddleware(thunk, logger), devTools);
const store = createStore(reducers, INITIAL_STATE, enhancer);

// console.log('store:', store.getState());
// > store: Object {todos: Array[0]}

// Presentational component
const App = (props) => {

  // console.log(props);
  // > Object {
  //   dispatch: function dispatch(action)
  //   todos: Array[0]
  // }

  const { todos } = props;
  return (
    <ul>
      {todos.map((todo, i) => (
        <li key={i}>
          {todo} <button onClick={() => props.remove(i)}>X</button>
        </li>
      ))}
      <ReduxForm />
    </ul>
  );
};

class Form extends Component {
  state = {
    text: '',
  }
  submit = (e) => {
    e.preventDefault();
    this.props.submit(this.state.text);
    this.setState({ text: '' });
  }
  render = () => (
    <form onSubmit={this.submit}>
      <input
        value={this.state.text}
        onChange={e => this.setState({ text: e.target.value })}
        placeholder="Ingresa una nueva tarea..."
      />
    </form>
  )
}

let mapDispatchToProps;
let mapStateToProps;

// App Container (smart) component
mapDispatchToProps = (dispatch) => ({
  remove(index) {
    dispatch(removeTodoAction(index));
  },
});
mapStateToProps = (state) => state;
const ReduxApp = connect(mapStateToProps, mapDispatchToProps)(App);

// Form Container (smart) component
mapDispatchToProps = { submit: addTodoAction };
const ReduxForm = connect(null, mapDispatchToProps)(Form);

// Mount React app
ReactDOM.render(
  <Provider store={store}>
    <ReduxApp />
  </Provider>,
  document.getElementById('root')
);
