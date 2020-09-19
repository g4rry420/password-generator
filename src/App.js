import React, { useState, useRef, useEffect } from 'react';

import './App.css';

function App() {
  const [slideValue, setSlideValue] = useState(20);
  const [divValue, setDivValue] = useState(1);
  const [password, setPassword] = useState("");
  const [decreaseValue, setDecreaseValue] = useState(28);
  const [label, setLabel] = useState("Strong");

  const divValueRef = useRef();
  const slideValueRef = useRef();
  const symbolsRef = useRef();
  const numbersRef = useRef();
  const uppercaseRef = useRef();
  const lowercaseRef = useRef();
  const passwordRef = useRef();
  const passwordContainerRef = useRef();
  const labelIconRef = useRef();


  useEffect(() => {
    if(divValueRef.current){
      divValueRef.current.style.left = divValue;
    }
  }, [divValue])

  useEffect(() => {
    if(slideValueRef.current){
      let min = parseInt(slideValueRef.current.min);
      let max = parseInt(slideValueRef.current.max);


      let newVal = ((slideValue - min) * 100)/ (max - min);
      let posii = `calc(${newVal}% + (${8 - newVal * 0.30}px))`;

      if(divValue !== posii){
        setDivValue(posii)
      }
    }

    if((slideValue === 28 || slideValue > 28) && (decreaseValue !== 18) ){
      passwordRef.current.style.fontSize = `${decreaseValue}px`;
      setDecreaseValue(decreaseValue - 1);
    }
    
    if(slideValue < 11 && slideValue > 6){
      passwordContainerRef.current.style.backgroundColor = "#f9622f";
      setLabel("Weak");
      labelIconRef.current.style.backgroundPosition = "20px 0px";
    }else if(slideValue < 6 || slideValue === 6){
      passwordContainerRef.current.style.backgroundColor = "#c81a00";
      setLabel("Bad");
    }else if(slideValue < 47){
      passwordContainerRef.current.style.backgroundColor = " #339933";
      setLabel("Strong");
      labelIconRef.current.style.backgroundPosition = "initial";
    }

    const length = slideValue;
    const hasUppper = uppercaseRef.current.checked;
    const hasLower = lowercaseRef.current.checked;
    const hasNumber = numbersRef.current.checked;
    const hasSymbol = symbolsRef.current.checked;

    generatePassword(hasUppper, hasLower, hasNumber, hasSymbol, length);

  },[slideValue])

  const checkedFunc = () => {
    const length = slideValue;
    const hasUppper = uppercaseRef.current.checked;
    const hasLower = lowercaseRef.current.checked;
    const hasNumber = numbersRef.current.checked;
    const hasSymbol = symbolsRef.current.checked;

    generatePassword(hasUppper, hasLower, hasNumber, hasSymbol, length);
  }


  const slideChanger = (e) => {
    let targetValue = parseInt(e.target.value);

    if((slideValue > targetValue ) && (decreaseValue !== 31)){
      passwordRef.current.style.fontSize = `${decreaseValue}px`
      setDecreaseValue(decreaseValue + 1)
    }
    
    setSlideValue(targetValue);
  }

  const copyPassword = () => {
    let selection = window.getSelection();
    selection.removeAllRanges();

    let range = new Range();
    range.selectNodeContents(passwordRef.current);
    selection.addRange(range);

    document.execCommand("copy");
  }

  const uppercase = () => {
    return String.fromCharCode(Math.floor(Math.random()*26) + 65);
  }

  const lowercase = () => {
    return String.fromCharCode(Math.floor(Math.random()*26) + 97);
  }

  const numbers = () => {
    return String.fromCharCode(Math.floor(Math.random()*10) + 48);
  }

  const symbols = () => {
    let symbol = "!@#$%^&*(){}[]=<>/,.|~?";
    return symbol[Math.floor(Math.random()*symbol.length)];
  }

  const randomFunc = {
    upper: uppercase,
    lower: lowercase,
    number: numbers,
    symbol: symbols
  }

  const generatePassword = (upper, lower, number, symbol, length) => {
    let generatedPassword = "";

    const typeCount = upper + lower + number + symbol;

    const typeArr = [{upper}, {lower}, {number}, {symbol}].filter(item => Object.values(item)[0]);

    if(typeCount === 0){
      return "";
    }

    for (let index = 0; index < length; index += typeCount) {
      typeArr.forEach(type => {
        const funcName = Object.keys(type)[0];
        generatedPassword += randomFunc[funcName]();
      })
    }

    const finalPassword = generatedPassword.slice(0, length);
    setPassword(finalPassword);
  }

  return (
    <div className="App">
      <div className="main-container">
        <header className="heading-container">
          <h1>Create a strong password with Password Generator</h1>
        </header>

        <main ref={passwordContainerRef} className="password-gen-container">
          <div>
            <div ref={passwordRef} className="password"> {password} </div>
            <div>
              <div onClick={checkedFunc} className="reset-pass"></div>
              <div onClick={copyPassword} className="copy-pass">Copy&nbsp;Password</div>
            </div>
          </div>
          <div className="labels-container">
            <span ref={labelIconRef} className="pass-label-icon icon"></span>
            <span className="pass-label">{label} Password</span>
          </div>
        </main>

        <div className="credentials-container">
          <p>Use the slider, and select from the options, below, to lengthen your password and strength your security.</p>

          <label className="checkbox-container">Include Symbols
            <input onChange={checkedFunc} ref={symbolsRef} type="checkbox" />
            <span className="checkmark"></span>
          </label>

          <label className="checkbox-container">Include Numbers
            <input onChange={checkedFunc} ref={numbersRef} type="checkbox" defaultChecked={true} />
            <span className="checkmark"></span>
          </label>

          <label className="checkbox-container">UpperCase
            <input onChange={checkedFunc} ref={uppercaseRef} type="checkbox" defaultChecked={true} />
            <span className="checkmark"></span>
          </label>

          <label className="checkbox-container">LowerCase
            <input onChange={checkedFunc} ref={lowercaseRef} type="checkbox" defaultChecked={true} />
            <span className="checkmark"></span>
          </label>

          <div className="slide-container">
            <p>Password Length (4-47)</p>
            <div ref={divValueRef} className="range-value">{slideValue}</div>
            <input ref={slideValueRef} onChange={slideChanger} className="slide-range" step="1" type="range" min="4" max="47" value={slideValue}  />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;