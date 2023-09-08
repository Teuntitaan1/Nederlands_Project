import './App.css';
import { useState } from 'react';
import BedanktGifje from '../assets/BedanktGifje.gif';

// Stops auto zooming on ios
if(navigator.userAgent.indexOf('iPhone') > -1 ) { document.querySelector("[name=viewport]").setAttribute("content","width=device-width, initial-scale=1, maximum-scale=1");}

function lerp( a, b, alpha ) {
  return a + alpha * ( b - a );
}

const Allowed_Chars_Ranges = [[50, 100], [100, 150], [200, 250], [1000, 1100], [0, Infinity]];
const Prompts = ["Een fictief over het ontploffen van een atoombom in Amsterdam, doe dit in de stijl van een nieuwsbericht van de NOS, laat hier geen mening in doorschijnen"];

function App() {
  
  // Text input variables
  const [TextAreaValue, SetTextAreaValue] = useState("");
  const [Username, SetUsername] = useState("");

  // Test parameter variables
  const [AllowedChars] = useState(Allowed_Chars_Ranges[Math.round( 4 * Math.random())]);
  const [Prompt] = useState(Prompts[Math.round( 0 * Math.random())]);

  // program variables
  const [HasStarted, SetHasStarted] = useState(false);
  const [Done, SetDone] = useState(false);
  const [StoryDone, SetStoryDone] = useState(false);

  const [Loading, Set_Loading] = useState(false);

  const [HasServerError, SetHasServerError] = useState(false);
  const [HasClientError, SetHasClientError] = useState(false);
  
  function Send_Data() {
    Set_Loading(true);

    fetch("https://nederlands-onderzoek-server.onrender.com", {method : "POST", body : JSON.stringify({
      Username : Username !== "" && Username.length > 3 ? Username : "Anoniem",
      Story : TextAreaValue,
      AllowedChars : AllowedChars,
      Prompt : Prompt,
      Date : Date.now()
    })}).then(() => {SetDone(true); Set_Loading(false)}).catch(() => {SetHasServerError(true); Set_Loading(false)});
  }

  return (
    <div id='Root_Container'>
      { 
        HasStarted ?
          !StoryDone ?
              <>
                <h1>Daar gaan we dan!</h1>

                {HasClientError ? <p id='Error_Message'>Nog niet genoeg tekens! Vul iets meer in en probeer het opnieuw</p> : null} 
                
                
                <p>Schrijf een verhaaltje {AllowedChars[1] !== Infinity ? `van tussen de ${AllowedChars[0]} en ${AllowedChars[1]} tekens` : null} over {Prompt}. {AllowedChars[1] === Infinity ? "Er is geen woord limiet" : null}</p>
                <div>
                  
                <p id='Letter_Counter' style={{color : `rgb(${lerp(0, 225, TextAreaValue.length/AllowedChars[1])}, ${lerp(0, 225, 1-(TextAreaValue.length/AllowedChars[1]))}, 0)`,}}>Nog {AllowedChars[1] !== Infinity ? AllowedChars[1] - TextAreaValue.length : "oneindig"} tekens {TextAreaValue.length > AllowedChars[0] ? "over" : "te typen"}</p>

                <textarea
                    value={TextAreaValue}
                    onChange={(event) => {SetTextAreaValue(event.target.value)}}
                    minLength={AllowedChars[0]}
                    maxLength={AllowedChars[1]}
                    placeholder={`Uw verhaaltje over ${Prompt}:`}/>
                </div>
                

                <div>
                  <button style={{width : "25vw", height : "5vh"}} onClick={() => {SetHasStarted(false);}}>Terug</button> 
                  <button style={{width : "25vw", height : "5vh"}} onClick={() => {TextAreaValue.length > AllowedChars[0] ? SetStoryDone(true) : SetHasClientError(true);}}>Volgende</button>
                </div>
              </> : !Done ?
                  <>
                    <h1>Bijna klaar!</h1>
                    <p>We hebben alleen nog uw naam nodig, geen behoefte deze te geven? Laat hem dan leeg!</p>
                    
                    <div>
                      <button style={{width : "20vw", height : "6vh"}} onClick={() => {SetStoryDone(false); SetHasClientError(false);}}>Ga terug</button>
                      <input style={{width : "50vw", height : "5vh"}} value={Username} placeholder="Je naam: Anoniem" onChange={(event) => {SetUsername(event.target.value);}} maxLength={16}></input>
                      <button style={{width : "20vw", height : "6vh"}} onClick={() => {if(!Loading) {Send_Data()}}}>Verstuur</button>
                    </div>
                    {Loading ? <p id='Loading_Message'>Aan het versturen...</p> : null}
                    {HasServerError ? <p id='Error_Message'>Er is iets fout gegaan, probeer het nog eens!</p> : null}
                  </> :
                  <>
                    <p id='Thanks_Message'>Verstuurd! Bedankt voor uw tijd :)</p>
                    <img src={BedanktGifje}></img>
                    <button style={{width : "25vw", height : "5vh"}} onClick={() => {location.reload()}}>Reset</button> 
                  </>
        :
        <>
          <h1>Welkom bij ons Nederlands onderzoek!</h1>
          <p>Ons onderzoek gaat over het veranderen van de taal die mensen gebruiken om een onderwerp te omschrijven wanneer hij/zij een letterlimiet voorgeschoteld krijgt. Hier kunt u ons bij helpen door een verhaaltje te schrijven.</p>
          <button style={{width : "50vw", height : "10vh"}} onClick={() => {SetHasStarted(true);}}>Beginnen</button> 
        </>
      }
    </div>
  );
}

export default App;
