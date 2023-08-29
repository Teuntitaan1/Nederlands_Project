import './App.css';
import { useState} from 'react';


function App() {
  const [TextAreaValue, SetTextAreaValue] = useState("");

  const [AllowedChars] = useState(Get_Allowed_Chars());
  const [Prompt] = useState(Get_Prompt());

  const [Done, SetDone] = useState(false);
  const [Error, SetError] = useState(false);

  function Get_Allowed_Chars() {
    return [50, 100, 200, 500, 1000000][Math.round( 4 * Math.random())];
  }
  function Get_Prompt() {
    return ["een nieuwsbericht over een gestorven eend"][Math.round( 0 * Math.random())];
  }
  
  function Update_Text_Area(event) {
    if (event.target.value.length <= AllowedChars) {
      SetTextAreaValue(event.target.value);
    }
  }
  
  function Send_Data() {
    fetch("localhost://8000", {method : "POST", body : {
      Username : "Test",
      Story : TextAreaValue,
      AllowedChars : AllowedChars,
    }})
    .then(() => {SetDone(true);})
    .catch(() => {SetError(true)});
  }

  return (
    <>
      { !Done ?
        <div>
          <p>Schrijf een verhaaltje in {AllowedChars} tekens over {Prompt}</p>
          <textarea value={TextAreaValue} onChange={(event) => {Update_Text_Area(event)}}></textarea>
          <p>{AllowedChars - TextAreaValue.length}</p>

          <button onClick={() => {Send_Data()}}>Verstuur</button>
          {Error ? <p>Er is iets fout gegaan, probeer het nog eens!</p> : null}
        </div> :

        <div>
          <p>Bedankt voor uw tijd!</p>
        </div>
      }
    </>
  );
}

export default App;
