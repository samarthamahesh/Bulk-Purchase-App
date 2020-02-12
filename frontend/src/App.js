import React, { Component } from 'react';
import './App.css';
import { Container } from 'reactstrap';
import RegisterModal from './components/auth/RegisterModal';
import 'bootstrap/dist/css/bootstrap.min.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <h1>Bulk Purchase App</h1>
        <Container>
          <RegisterModal/>
        </Container>
      </div>
    );
  }
}

export default App;
