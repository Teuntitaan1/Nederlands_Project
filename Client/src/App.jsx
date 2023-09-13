import './App.css';
import { useState } from 'react';
import BedanktGifje from '../assets/BedanktGifje.gif';
import { lerp, clamp } from './Functions.jsx';

const Standard_Char_Ranges = [[1, 50], [100, 150], [250, 300], [400, 450], [800, 850], [1000, 1050]]

export default function App(props) {
  
  // Text input variables
  const [Username, SetUsername] = useState("");
  const [ActiveTextAreaValue, SetActiveTextAreaValue] = useState("");
  const [TextAreaValues, SetTextAreaValues] = useState(Array(props.AmountOfPrompts).fill(""));
  const [Char_Ranges] = useState(Standard_Char_Ranges.slice(0, props.AmountOfPrompts));
  const [ActivePrompt, SetActivePrompt] = useState(0);

  // Test parameter variables
  const [Prompt] = useState("Schrijf een fictief verhaal over het ontploffen van een atoombom in Amsterdam, doe dit in de stijl van een nieuwsbericht van de NOS, laat hier geen mening in doorschijnen.");

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
      Char_Ranges : Char_Ranges,
      Prompt : Prompt,
      Date : Date.now()
    })}).then(() => {SetDone(true); Set_Loading(false)}).catch(() => {SetHasServerError(true); Set_Loading(false)});
  }

  function SaveTextArea() {
    var TextAreaValuesNew = TextAreaValues;
    TextAreaValuesNew[ActivePrompt] = ActiveTextAreaValue;
    SetTextAreaValues(TextAreaValuesNew);

  }

  function Previous() {
    SaveTextArea();

    SetActivePrompt(clamp(0, TextAreaValues.length - 1, ActivePrompt - 1));
    if (ActivePrompt === 0) {
      SetHasStarted(false);
      return }
    SetActiveTextAreaValue(TextAreaValues[clamp(0, TextAreaValues.length, ActivePrompt - 1)]);
    SetHasClientError(false);
  }

  function Next() {
    SaveTextArea();
    SetHasClientError(false);
    
    if (ActiveTextAreaValue.length >= Char_Ranges[ActivePrompt][0]) {
      SetActivePrompt(clamp(0, TextAreaValues.length - 1, ActivePrompt + 1));
      if (ActivePrompt === TextAreaValues.length - 1) {
        SetStoryDone(true);
        return }
      SetActiveTextAreaValue(TextAreaValues[clamp(0, TextAreaValues.length, ActivePrompt + 1)]);
    }
    else {
      SetHasClientError(true);
      return
    }

  }

  return (
    <div id='Root_Container'>
      { 
        HasStarted ?
          !StoryDone ?
              <>
                <h1>{props.AmountOfPrompts - ActivePrompt < props.AmountOfPrompts ? `Nog maar ${props.AmountOfPrompts - ActivePrompt} ${props.AmountOfPrompts - ActivePrompt !== 1 ? "Verhaaltjes" : "Verhaaltje"}!` : `Daar gaan we dan!`}</h1>
                {HasClientError ? <p id='Error_Message'>Nog niet genoeg letters! Vul iets meer in en probeer het opnieuw</p> : null} 
                <p>Schrijf een verhaaltje van tussen de <span>{Char_Ranges[ActivePrompt][0]}</span> en <span>{Char_Ranges[ActivePrompt][1]}</span> letters. De opdracht is: {Prompt}</p>

                <div>
                  <p id='Letter_Counter' style={{color : `rgb(${lerp(0, 225, ActiveTextAreaValue.length/Char_Ranges[ActivePrompt][1])}, ${lerp(0, 225, 1-(ActiveTextAreaValue.length/Char_Ranges[ActivePrompt][1]))}, 0)`,}}>
                    Nog {ActiveTextAreaValue.length >= Char_Ranges[ActivePrompt][0] ? Char_Ranges[ActivePrompt][1] - ActiveTextAreaValue.length : Char_Ranges[ActivePrompt][0] - ActiveTextAreaValue.length}
                    {Math.abs(Char_Ranges[ActivePrompt][0] - ActiveTextAreaValue.length) !== 1 ? " letters" : " letter"} 
                    {ActiveTextAreaValue.length > Char_Ranges[ActivePrompt][0] ? " over" : " te typen"}
                  </p>

                  <textarea
                    value={ActiveTextAreaValue}
                    onChange={(event) => {SetActiveTextAreaValue(event.target.value)}}
                    minLength={Char_Ranges[ActivePrompt][0]}
                    maxLength={Char_Ranges[ActivePrompt][1]}
                    placeholder={Prompt}
                  />
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
          <h1>Welkom bij ons Nederlands taalkundig onderzoek!</h1>
          <p>Ons onderzoek gaat over het veranderen van de taal die mensen gebruiken tijdens het schrijven van een tekst wanneer ze maar een bepaald aantal letters mogen gebruiken. Hier kunt u ons bij helpen door een verhaaltje te schrijven, Meer niet! U zal ongeveer 5 a 10 minuten bezig zijn.</p>
          <button style={{width : "50vw", height : "10vh"}} onClick={() => {SetHasStarted(true);}}>Beginnen</button> 
        </>
      }
      <footer>Teun Weijdener & Niek Rossel</footer>
    </div>
  );
}
