import './App.css';
import { useState} from 'react';

function lerp( a, b, alpha ) {
  return a + alpha * ( b - a );
}

function App() {
  
  const [TextAreaValue, SetTextAreaValue] = useState("");
  const [Username, Set_Username] = useState("");

  const [AllowedChars] = useState(Get_Allowed_Chars());
  const [Prompt] = useState(Get_Prompt());

  const [Done, SetDone] = useState(false);
  const [StoryDone, SetStoryDone] = useState(false);

  const [HasError, SetHasError] = useState(false);

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
      Username : Username,
      Story : TextAreaValue,
      AllowedChars : AllowedChars,
    }})
    .then(() => {SetDone(true);})
    .catch(() => {SetHasError(true)});
  }

  return (
    <>
      { !StoryDone ?
          <div>
            <p>Schrijf een verhaaltje in {AllowedChars} tekens over {Prompt}</p>
            <textarea value={TextAreaValue} onChange={(event) => {Update_Text_Area(event)}}></textarea>

            <p style={{color : `rgb(${lerp(0, 225, TextAreaValue.length/AllowedChars)}, ${lerp(0, 225, 1-(TextAreaValue.length/AllowedChars))}, 0)`}}>{AllowedChars - TextAreaValue.length}</p>
            
            <button onClick={() => {SetStoryDone(true);}}>Volgende</button>
            {HasError ? <p>Er is iets fout gegaan, probeer het nog eens!</p> : null} 
          </div> : !Done ?
              <div>
                <input value={Username} placeholder="Je naam:" onChange={(event) => {Set_Username(event.target.value);}}></input>
                <button onClick={() => {Send_Data()}}>Verstuur</button>
              </div> :

              <div>
                <p>Bedankt voor uw tijd!</p>
              </div>
      }
    </>
  );
}

export default App;
