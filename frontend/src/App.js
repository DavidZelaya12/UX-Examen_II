import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import Restaurants from './components/restaurantss';
function App() {
    return (
        <div className="App">
            <h1>Hola Mundo</h1>
            <Restaurants />
            <ToastContainer closeButton={false} />
        </div>
    );
}

export default App;
