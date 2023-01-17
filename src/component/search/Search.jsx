/* eslint-disable */

import React, { Fragment, useState } from "react";
import Map from '../map/Map';

function SearchPlace() {
    const [inputText, setInputText] = useState("");
    const [place, setPlace] = useState("");
    //useState 값 초기화

    const onChange = (e) => {
      setInputText(e.target.value);
      
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      setPlace(inputText);
      setInputText("");
      
      
    };

    const valueCheker = () => {
        if(inputText == "") {
            alert("검색어를 입력하세요");
        }
    }
    
    return(
        <div className="search_map" style={{ width: "100%", height:"100%"}}>
            <div className="form_div">
            <form className="form" onSubmit={handleSubmit}>
                    <input className="input" placeholder="위치 검색" onChange={onChange} value={inputText}/>
                    <button type="submit" onClick={valueCheker}>검색</button>
            </form>
            </div>
            <div style={{ width: "100%", height:"100%"}}>
                <Map searchPlace={place}/> 
            </div>
            
        </div>
        
    );
};

export default SearchPlace;