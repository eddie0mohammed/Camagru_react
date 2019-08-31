import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import axios from 'axios';

const token = localStorage.getItem('camagru-access');
axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

ReactDOM.render(<App auth={token}/>, document.getElementById('root'));