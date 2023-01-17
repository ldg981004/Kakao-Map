/* eslint-disable */

import React from "react";
import { useState } from "react";
import './distance.css';

function firstToend(){
    const [inputs, setInputs] = useState({
        depart:'',
        arrive:'',
    });
    
    const {depart, arrive} = inputs;

    const onChange = (e) => {
        const { name, value } = e.target;

        setInputs({
            ...inputs, 
            [name]:value,});
    };

    function goSearch(){
        location.href = "https://map.kakao.com/?sName="+depart+"&eName="+arrive;
        setInputs({
            depart:'',
            arrive:''
        });
    }

    return(
        <div className="tool">
            <div className="second_tool">
                <input className="dep" Name="depart" onChange={onChange} value={depart} placeholder="출발지"></input>
            </div>

            <div className="second_tool">
                <input className="arr" Name="arrive" onChange={onChange} value={arrive} placeholder="도착지"></input>
            </div>

            <button className="btn_sub" onClick={goSearch}>길찾기</button>
            
        </div>
    );
}

export default firstToend;