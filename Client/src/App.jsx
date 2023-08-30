import './App.css';
import { useState} from 'react';

const URL = "localhost://8000";

function lerp( a, b, alpha ) {
  return a + alpha * ( b - a );
}



function App() {
  
  // Text input variables
  const [TextAreaValue, SetTextAreaValue] = useState("");
  const [Username, SetUsername] = useState("");

  // Test parameter variables
  const [AllowedChars] = useState(Get_Allowed_Chars());
  const [Prompt] = useState(Get_Prompt());

  // program variables
  const [HasStarted, SetHasStarted] = useState(false);
  const [Done, SetDone] = useState(false);
  const [StoryDone, SetStoryDone] = useState(false);
  const [HasError, SetHasError] = useState(false);

  // returns the test parameters
  function Get_Allowed_Chars() {
    return [50, 100, 200, 500, 1000000][Math.round( 4 * Math.random())];
  }
    // returns the test parameters
  function Get_Prompt() {
    return ["een nieuwsbericht over een gestorven eend"][Math.round( 0 * Math.random())];
  }
  
  function Send_Data() {
    fetch(URL, {method : "POST", body : {
      Username : Username !== "" ? Username : "Anoniem",
      Story : TextAreaValue,
      AllowedChars : AllowedChars,
    }})
    .then(() => {SetDone(true);})
    .catch(() => {SetHasError(true)});
  }

  return (
    <>
      { 
        HasStarted ?
          !StoryDone ?
              <>

                <p>Schrijf een verhaaltje in {AllowedChars} tekens over {Prompt}</p>
                <textarea value={TextAreaValue} onChange={(event) => {SetTextAreaValue(event.target.value)}} maxLength={AllowedChars}></textarea>

                <p style={{color : `rgb(${lerp(0, 225, TextAreaValue.length/AllowedChars)}, ${lerp(0, 225, 1-(TextAreaValue.length/AllowedChars))}, 0)`}}>{AllowedChars - TextAreaValue.length} tekens over</p>
                <button onClick={() => {SetStoryDone(true);}}>Volgende</button> 

              </> : !Done ?
                  <>

                    <input value={Username} placeholder="Je naam: Anoniem" onChange={(event) => {SetUsername(event.target.value);}} maxLength={16}></input>
                    <button onClick={() => {Send_Data()}}>Verstuur</button>
                    {HasError ? <p>Er is iets fout gegaan, probeer het nog eens!</p> : null}

                  </> :

                  <>

                    <p>Verstuurd! Bedankt voor uw tijd :)</p>

                  </>
        :
        <>

          <h1>Welkom bij ons Nederlands onderzoek!</h1>
          <p>Ons onderzoek gaat over het veranderen van de taal die mensen gebruiken om een onderwerp te omschrijven wanneer hij/zij een letterlimiet voorgeschoteld krijgt.</p>
          <button onClick={() => {SetHasStarted(true);}}>Beginnen</button> 

        </>
      }
    </>
  );
}

export default App;
