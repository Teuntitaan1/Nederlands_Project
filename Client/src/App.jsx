import './App.css';
import { useState, useEffect } from 'react';
import BedanktGifje from '../assets/BedanktGifje.gif';
import { lerp, clamp } from './Functions.jsx';


// Stops auto zooming on ios
if(navigator.userAgent.indexOf('iPhone') > -1 ) { document.querySelector("[name=viewport]").setAttribute("content","width=device-width, initial-scale=1, maximum-scale=1");}



const Allowed_Chars_Ranges = [[50, 100], [100, 150], [200, 250], [1000, 1100], [0, Infinity]];
const Standard_Prompts = ["Een fictief over het ontploffen van een atoombom in Amsterdam, doe dit in de stijl van een nieuwsbericht van de NOS, laat hier geen mening in doorschijnen"];

function App() {
  
  // Text input variables
  const [Username, SetUsername] = useState("");
  const [TextAreaValues, SetTextAreaValues] = useState(["", "", ""]);
  const [Char_Ranges] = useState([[1, 50], [100, 150], [250, 300]]);
  const [ActivePrompt, SetActivePrompt] = useState(0);

  // Test parameter variables
  const [Prompt] = useState(Standard_Prompts[Math.round( 0 * Math.random())]);

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
      TextAreaValues : TextAreaValues,
      Allowed_Chars_Ranges : Allowed_Chars_Ranges,
      Prompt : Prompt,
      Date : Date.now()
    })}).then(() => {SetDone(true); Set_Loading(false)}).catch(() => {SetHasServerError(true); Set_Loading(false)});
  }

  function Update_Input(event) {
    var TextAreaValuesNew = TextAreaValues;
    TextAreaValuesNew[ActivePrompt] = event.target.value;
    SetTextAreaValues(TextAreaValuesNew);
  }

  function Previous() {
    SetActivePrompt(clamp(0, 2, ActivePrompt - 1));
    if (ActivePrompt === 0) {
      SetHasStarted(false);
    }
  }

  function Next() {
    if (TextAreaValues[ActivePrompt].length > Char_Ranges[ActivePrompt][0]) {
      SetActivePrompt(clamp(0, 2, ActivePrompt + 1));
      
      if (ActivePrompt === 2) {
        SetStoryDone(true);
      }
    }
    else {
      SetHasClientError(true);
    }
  }

  return (
    <div id='Root_Container'>
      { 
        HasStarted ?
          !StoryDone ?
              <>
                <h1>Daar gaan we dan!</h1>

                {HasClientError ? <p id='Error_Message'>Nog niet genoeg tekens! Vul iets meer in en probeer het opnieuw</p> : null} 
                
                
                <p>Schrijf een verhaaltje van tussen de {Char_Ranges[ActivePrompt][0]} en {Char_Ranges[ActivePrompt][1]} tekens over {Prompt}. </p>
                <div>
                  
                <p id='Letter_Counter' style={{color : `rgb(${lerp(0, 225, TextAreaValues[ActivePrompt].length/Char_Ranges[ActivePrompt][1])}, ${lerp(0, 225, 1-(TextAreaValues[ActivePrompt].length/Char_Ranges[ActivePrompt][1]))}, 0)`,}}>Nog {Char_Ranges[ActivePrompt][1] !== Infinity ? TextAreaValues[ActivePrompt].length > Char_Ranges[ActivePrompt][0] ? Char_Ranges[ActivePrompt][1] - TextAreaValues[ActivePrompt].length : Char_Ranges[ActivePrompt][0] - TextAreaValues[ActivePrompt].length : "oneindig"} tekens {TextAreaValues[ActivePrompt].length > Char_Ranges[ActivePrompt][0] ? "over" : "te typen"}</p>

                <textarea
                    value={TextAreaValues[ActivePrompt]}
                    onChange={(event) => {Update_Input(event);}}
                    minLength={Char_Ranges[ActivePrompt][0]}
                    maxLength={Char_Ranges[ActivePrompt][1]}
                    placeholder={`Uw verhaaltje over ${Prompt}:`}/>
                </div>
                

                <div>
                  <button style={{width : "25vw", height : "5vh"}} onClick={() => {Previous();}}>Terug</button> 
                  <button style={{width : "25vw", height : "5vh"}} onClick={() => {Next();}}>Volgende</button>
                </div>
              </> : !Done ?
                  <>
                    <h1>Bijna klaar!</h1>
                    <p>We hebben alleen nog uw naam nodig, geen behoefte deze te geven? Laat hem dan leeg!</p>
                    
                    <div>
                      <button style={{width : "20vw", height : "6vh"}} onClick={() => {SetStoryDone(false); SetHasClientError(false);}}>Ga terug</button>
                      <input style={{width : "50vw", height : "5vh"}} value={Username} placeholder="Je naam: Anoniem" onChange={(event) => {SetUsername(event.target.value);}} maxLength={16}></input>
                      <button style={{width : "20vw", height : "6vh"}} onClick={() => {if(!Loading) {Send_Data();}}}>Verstuur</button>
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
