import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// Stops auto zooming on ios
if(navigator.userAgent.indexOf('iPhone') > -1 ) { document.querySelector("[name=viewport]").setAttribute("content","width=device-width, initial-scale=1, maximum-scale=1");}

ReactDOM.createRoot(document.getElementById('root')).render(<App AmountOfPrompts={3}/>);
