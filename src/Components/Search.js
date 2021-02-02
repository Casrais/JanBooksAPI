import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PublisherSelect from './PublisherNameSelect';
import { appRefresh } from '../actions'
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
//import logo from './logo.svg';
//import './App.css';




const Search = ( { state, Refresh } ) => {
  const [myState, setState] = useState([]);
  const [refresh, setRefresh] = useState(0);

useEffect(() => {
(async state => {
  await axios.get(`http://localhost:8000/api/${ state }`).then( response => {setState(response.data.rows); console.log(response.data.rows)});
})(state);
}, [state]);

const RefreshBool = useSelector(appRefresh => appRefresh.appRefresh);
const dispatch = useDispatch();
useEffect(() => {
  (async state => {
    await axios.get(`http://localhost:8000/api/${ state }`).then( response => {setState(response.data.rows); console.log(response.data.rows)});
  })(state)
  setRefresh(Refresh);
  }, [Refresh]);

const maptype = function(state) {
  if (state === 'Publisher') {
    return myState.map(record => <div>{record.PublisherName}</div>)
  }
  else if (state === 'Book'){
    return myState.map(record => <div><div>{record.Title +" "+ record.SubTitle}</div><PublisherSelect Props={{BookId:record.BookId,PublisherId:record.PublisherId}} /><div></div></div>)
  }
  else if (state === 'Author'){
    return myState.map(record => <div>{record.FirstName +" "+ record.LastName}</div>)
  }
  else if (state === 'Category'){
    return myState.map(record => <div>{record.CategoryName}</div>)
  }
}

  return (
    <div className="Search">
      <div>{ maptype(state) }</div>
    </div>
  );
}

export default Search;
