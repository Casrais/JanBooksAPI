import React, { useState, useEffect } from 'react';
import axios from 'axios';
import logo from './logo.svg';
import './App.css';
import Search from './Components/Search';
import AddNew from './Components/AddNew';
import { appRefresh } from './actions';
import { appState } from './actions';
import { selectedStateReducer } from './reducers'
import { useDispatch, useSelector } from 'react-redux';
import { useReducer } from 'react-redux';

const App = () => {
  const [myState, setState] = useState('Publisher');
  const [myCount, setCount] = useState(0);

  useEffect(() => {
    let Subscribed = true;
    if (Subscribed){dispatch({ type: 'STATE_SELECTED', payload: myState })};
    return () => Subscribed = false
    }, [myState]);

    const callback = (count) => {
      setCount(count);
  }

  const dispatch = useDispatch();
  return (
    <div className="App">
      <div className="FirstRow"><select onChange={e => {setState(e.target.value); dispatch({ type: 'STATE_SELECTED', payload: e.target.value });}} defaultValue='Publisher'>
  <option value="Publisher">Publisher</option>
  <option value="Book">Book</option>
  <option value="Author">Author</option>
  <option value="Category">Category</option>
</select><AddNew state={myState} ParentCallBack={callback}></AddNew></div>
      <div><Search state = {myState} Refresh = { myCount } /></div>
    </div>
  );
}


export default App;
