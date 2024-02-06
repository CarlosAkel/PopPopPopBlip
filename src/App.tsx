import React from 'react';
import './App.css';
import Gravity from './components/gravity'
import pip from './images/pip.png'

function App() {
  return (
    <div>
      <Gravity></Gravity>
      <img src={pip} className="App-logo" alt="logo" />
    </div>
  );
}

export default App;
