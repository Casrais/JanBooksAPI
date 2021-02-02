import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';
import DatePicker from "react-datepicker";
import "../../node_modules/react-datepicker/dist/react-datepicker.css";
//import { connect } from 'react-redux';
import { appRefresh } from '../actions'
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';


const AddNew = ( { state, ParentCallBack } ) => {
  const [showPopup, setPopup] = useState(false);
  const [passState, setPassState] = useState('Publisher');
  const [myCount, setCount] = useState(1);
  
  const [input1, setinput1] = useState('1');
  const [input2, setinput2] = useState('2');
  const [input3, setinput3] = useState('3');
  const [input4, setinput4] = useState('4');
  const [input5, setinput5] = useState('5');
  const [input6, setinput6] = useState('6');
  const [input7, setinput7] = useState('7');
  const [input8, setinput8] = useState('8');
  const [input9, setinput9] = useState('9');
  const [input10, setinput10] = useState('10');
  const [date, setDate] = useState(new Date());

  const [Processing, setProcessing] = useState(false);
  
    const dispatch = useDispatch();

 //const appState = useSelector(appState => state.selectedState);
  const appRefreshState = useSelector(appRefreshState => appRefreshState.appRefresh);


  const handleChangeDate = function(e) {
    setDate(e);
  }

  const handleChange1 = function(e) {
    setinput1(e);
  }
  const handleChange2 = function(e) {
    setinput2(e);
  }
  const handleChange3 = function(e) {
    setinput3(e);
  }
  const handleChange4 = function(e) {
    setinput4(e);
  }
  const handleChange5 = function(e) {
    setinput5(e);
  }
  const handleChange6 = function(e) {
    setinput6(e);
  }
  const handleChange7 = function(e) {
    setinput7(e);
  }
  const handleChange8 = function(e) {
    setinput8(e);
  }
  const handleChange9 = function(e) {
    setinput9(e);
  }
  const handleChange10 = function(e) {
    setinput10(e);
  }

  function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}
  useEffect(() => {
    let Subscribed = true;
    if (Subscribed){setPassState(state)};
    return () => Subscribed = false
    }, [state]);

const CountUp = () => {
  const newValue = myCount + 1;
  setCount(newValue);
}

async function newBook (BookObj) {setProcessing(true); await axios.post(`http://localhost:8000/api/Book/`,BookObj).then( response => { setPopup(!showPopup);setProcessing(false); CountUp(); ParentCallBack(myCount); console.log(response)})};
async function newPublisher (PublisherObj) {setProcessing(true); await axios.post(`http://localhost:8000/api/Publisher/`,PublisherObj).then( response => { setPopup(!showPopup);setProcessing(false); CountUp(); ParentCallBack(myCount); console.log(response)})};
async function newCategory (CategoryObj) {setProcessing(true); await axios.post(`http://localhost:8000/api/Category/`,CategoryObj).then( response => { setPopup(!showPopup);setProcessing(false);  CountUp(); ParentCallBack(myCount); console.log(response)})};
async function newAuthor (AuthorObj) {setProcessing(true); await axios.post(`http://localhost:8000/api/Author/`,AuthorObj).then( response => { setPopup(!showPopup);setProcessing(false);  CountUp(); ParentCallBack(myCount); console.log(response)})};

const newPubl = () => {
  if (input1 !== '' && input2 !== '' && Processing !== true) {
     newPublisher({PublisherName:input1, PublisherLocation:input2}); 
  }

}
const newBk = () => {
  if (input1 !== '' && input2 !== '' && date !== '' && input4 !== '' && input5 !== '' && input6 !== '' && input7 !== '' && input8 !== '' && input9 !== '' && input10 !== '' && Processing !== true) {
  newBook({Title:input1, SubTitle:input2,CopyrightDate:formatDate(date),CopyrightHolder:input4,Synopsis:input5,Quantity:input6,AmountSold:input7,ISBN:input8,Price:input9,Rating:input10});
  }
}
const newCat = () => {
  if (input1 !== '' && input2 !== '' && Processing !== true) {
  newCategory({CategoryName:input1, CategoryDesc:input2});
  }
}
const newAuth = () => {
  if (input1 !== '' && input3 !== '' && date !== ''&& Processing !== true) {
  newAuthor({FirstName:input1, MiddleName:input2,LastName:input3,DOB:formatDate(date),Bio:input5});
  }
}

const NewFunction = function() { if (showPopup) {
  if (passState === 'Publisher')
  {
    return (  
          <div className='popup'>  
          <div className='popupinner'>  
          <h1>Create a new Publisher?</h1>  
          <div>Publisher Name: <input id="PublisherName" onChange={e => {handleChange1(e.target.value)}}></input></div>
          <div>Publisher Location: <input id="PublisherName" onChange={e => {handleChange2(e.target.value)}}></input></div>
          <div>
          <button onClick={() => {setPopup(!showPopup)}}>close</button>  
          <button  className='New' onClick={() => {newPubl()}}>commit</button> 
          </div>
          </div>  
          </div>  
          )
  }
  if (passState === 'Book')
  {
          return (  
            <div className='popup'>  
            <div className='popupinner'>  
            <div>
            <h1>Create a new Book?</h1>  
            <div>Title: <input id="Title" onChange={e => {handleChange1(e.target.value)}}></input></div>
            <div>Subtitle: <input id="SubTitle" onChange={e => {handleChange2(e.target.value)}}></input></div>
            <div>CopyrightDate: <DatePicker id="CopyrightDate" selected={date} onChange={date => {handleChangeDate(date)}} /></div>
            <div>CopyrightHolder: <input id="CopyrightHolder" onChange={e => {handleChange4(e.target.value)}}></input></div>
            <div>Synopsis: <textarea id="Synopsis" onChange={e => {handleChange5(e.target.value)}}></textarea></div>
            <div>Quantity: <input id="Quantity" onChange={e => {handleChange6(e.target.value)}}></input></div>
            <div>AmountSold: <input id="AmountSold" onChange={e => {handleChange7(e.target.value)}}></input></div>
            <div>ISBN: <input id="ISBN" onChange={e => {handleChange8(e.target.value)}}></input></div>
            <div>Price: <input id="Price" onChange={e => {handleChange9(e.target.value)}}></input></div>
            <div>Rating: <input id="Rating" onChange={e => {handleChange10(e.target.value)}}></input></div>
            <div>
          <button onClick={() => {setPopup(!showPopup)}}>close</button>  
          <button  className='New' onClick={() => {newBk()}}>commit</button> 
          </div>
          </div>
            </div>  
            </div>  
            ) 
                }
                else if (passState === 'Author')
                {
          return (  
            <div className='popup'>  
            <div className='popupinner'>  
            <h1>Create a new Author?</h1>  
            <div>FirstName: <input id="FirstName" onChange={e => {handleChange1(e.target.value)}}></input></div>
            <div>MiddleName: <input id="MiddleName" onChange={e => {handleChange2(e.target.value)}}></input></div>
            <div>LastName: <input id="LastName" onChange={e => {handleChange3(e.target.value)}}></input></div>
            <div>DOB: <DatePicker id="DOB" selected={date} onChange={date => {handleChangeDate(date)}} /></div>
            <div>Bio: <textarea id="Bio" onChange={e => {handleChange5(e.target.value)}}></textarea></div>
            <div>
          <button onClick={() => {setPopup(!showPopup)}}>close</button>  
          <button className='New' onClick={() => {newAuth()}}>commit</button> 
          </div>
            </div>  
            </div>  
            )
                }
                else if (passState === 'Category')
                {
          return (  
            <div className='popup'>  
            <div className='popupinner'>  
            <h1>Create a new Category?</h1>  
            <div>Category Name: <input id="CategoryName" onChange={e => {handleChange1(e.target.value)}}></input></div>
            <div>Category Description: <input id="CategoryDesc" onChange={e => {handleChange2(e.target.value)}}></input></div>
            <div>
          <button onClick={() => {setPopup(!showPopup)}}>close</button>  
          <button  className='New' onClick={() => {newCat()}}>commit</button> 
          </div>
            </div>  
            </div>  
            )
                }
      else {
        return (<div className='popup'>  
        <div className='popupinner'>  
        <h1>Sorry, I didn't find that...</h1>  
        <div>
      <button onClick={() => {setPopup(!showPopup)}}>close</button>
      </div>
        </div>  
        </div>  )
              }
        }
 else {return null};
};

  return (
    <div className="FirstRow">
      {console.log(appRefreshState)}
       {NewFunction({passState})}
       <button className="New" onClick={() => {setPopup(!showPopup)}}>+</button>
    </div>
  );
}


export default AddNew;
