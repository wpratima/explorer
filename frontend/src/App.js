import { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import Header from './components/Header';
import Login from './components/LoginForm';
import { Register } from './components/RegistrationForm';

function App(props) {

  const [isLogginActive, setIsLogginActive] = useState(false);

  return (
    <div className="App">
    <div className="login">
      <div className="container">
        {
        isLogginActive ?
          <Login />
          :
          <Register />
        }
      </div>
    </div>
  </div>
  );
}

export default App;
