import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import dotenv from 'dotenv';
import Routes from './routes';
import GlobalStyle from './style';


dotenv.config();

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes></Routes>
        <GlobalStyle></GlobalStyle>
      </BrowserRouter>
    </div>
  );
}

export default App;
