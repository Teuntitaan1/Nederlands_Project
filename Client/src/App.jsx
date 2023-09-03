import './App.css';
import { useState } from 'react';
const URL = "http://localhost:3000";
import BedanktGifje from '../assets/BedanktGifje.gif';

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

  const [HasServerError, SetHasServerError] = useState(false);
  const [HasClientError, SetHasClientError] = useState(false);
  // returns the test parameters
  function Get_Allowed_Chars() {
    const Allowed_Chars = [50, 100, 500, 1000, Infinity]
    return Allowed_Chars[Math.round( Allowed_Chars.length * Math.random())];
  }
    // returns the test parameters
  function Get_Prompt() {
    const Prompts = ["een nieuwsbericht over een gestorven eend"]
    return Prompts[Math.round( Prompts.length * Math.random())];
  }
  
  function Send_Data() {
    fetch(URL, {method : "POST", body : JSON.stringify({
      Username : Username !== "" && Username.length > 3 ? Username : "Anoniem",
      Story : TextAreaValue,
      AllowedChars : AllowedChars,
      Prompt : Prompt,
      Date : Date.now()
    })}).then(() => {SetDone(true);}).catch(() => {SetHasServerError(true)});
  }

  return (
    <div id='Root_Container'>
      { 
        HasStarted ?
          !StoryDone ?
              <>
                <h1>Daar gaan we dan!</h1>
                <p>Schrijf een verhaaltje {AllowedChars !== Infinity ? `in ${AllowedChars} tekens` : null} over {Prompt}. {AllowedChars === Infinity ? "Er is geen woord limiet" : null}</p>
                <textarea
                  value={TextAreaValue}
                  onChange={(event) => {SetTextAreaValue(event.target.value)}}
                  maxLength={AllowedChars}
                  placeholder={`Uw verhaaltje over ${Prompt}:`}/>

                <p style={{color : `rgb(${lerp(0, 225, TextAreaValue.length/AllowedChars)}, ${lerp(0, 225, 1-(TextAreaValue.length/AllowedChars))}, 0)`}}>Nog {AllowedChars !== Infinity ? AllowedChars - TextAreaValue.length : "oneindig"} tekens over</p>
                <div>
                  <button onClick={() => {SetHasStarted(false);}}>Terug</button> 
                  <button onClick={() => {TextAreaValue.length > 0 ? SetStoryDone(true) : SetHasClientError(true);}}>Volgende</button>
                </div>
                {HasClientError ? <p id='Error_Message'>Het tekstveld is leeg! Vul iets in en probeer het opnieuw</p> : null} 
              </> : !Done ?
                  <>
                    <h1>Bijna klaar!</h1>
                    <p>We hebben alleen nog uw naam nodig, geen behoefte deze te geven? Laat hem dan leeg!</p>
                    
                    <div>
                      <button onClick={() => {SetStoryDone(false); SetHasClientError(false);}}>Ga terug</button>
                      <input value={Username} placeholder="Je naam: Anoniem" onChange={(event) => {SetUsername(event.target.value);}} maxLength={16}></input>
                      <button onClick={() => {Send_Data()}}>Verstuur</button>
                    </div>
                    {HasServerError ? <p id='Error_Message'>Er is iets fout gegaan, probeer het nog eens!</p> : null}
                  </> :
                  <>
                    <p>Verstuurd! Bedankt voor uw tijd :)</p>
                    <img src={BedanktGifje}></img>
                  </>
        :
        <>
          <h1>Welkom bij ons Nederlands onderzoek!</h1>
          <p>Ons onderzoek gaat over het veranderen van de taal die mensen gebruiken om een onderwerp te omschrijven wanneer hij/zij een letterlimiet voorgeschoteld krijgt. Hier kunt u ons bij helpen door een verhaaltje te schrijven.</p>
          <button onClick={() => {SetHasStarted(true);}}>Beginnen</button> 
        </>
      }
    </div>
  );
}

export default App;
