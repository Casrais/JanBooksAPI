import React, { useState, useEffect } from 'react';
import axios from 'axios';
//import logo from './logo.svg';
//import './App.css';




const PublisherNameSelect = ( { Props } ) => {
  const [myState, setState] = useState([]);
  //const [myBookid, setBookid] = useState(Props.BookId);
  const [myPublisher, setPublisher] = useState([Props.PublisherId, Props.BookId]);

  const getPublisher = async function (isSubscribed) {
    await axios.get(`http://localhost:8000/api/Publisher`).then( response => {if (isSubscribed) {setState(response.data.rows)}; console.log(response.data.rows)});
  }

 useEffect(() => {
    let Subscribed = true;
    if (Subscribed){getInitialState()};
    return () => Subscribed = false
    }, [Props]);


  useEffect(() => {
    
    let isSubscribed = true
    //if (isSubscribed) {setBookid(Book.BookId)};
     if(isSubscribed && myPublisher[1] && myPublisher.length === 2) {postBookPublisher({PublisherId:myPublisher[0],BookId:myPublisher[1]})}
    getPublisher(isSubscribed);
      return () => isSubscribed = false
    }, [myPublisher]);

    async function postBookPublisher(BookObj) {await axios.post(`http://localhost:8000/api/Book/PublisherID/`,BookObj).then( response => { console.log(response)})};

    function handleChange(event) {
      setPublisher([event, Props.BookId]);
    }

    function getInitialState() { 
      setPublisher([Props.PublisherId,Props.BookId]);
      };

const maptype = function() {
      return myState.map(record => <option value={record.PublisherId} >{record.PublisherName}</option>);
    }
    

  return (
    
    <div className="PublisherSearch">
      <select value={myPublisher[0]} onChange={e => {handleChange(e.target.value)}} >{ maptype() }</select>
    </div>
  );
}

export default PublisherNameSelect;
