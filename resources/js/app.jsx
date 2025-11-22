import './bootstrap';
import React from 'react';
import ReactDOM from 'react-dom/client';
import HelloReact from './components/HelloReact';

const root = ReactDOM.createRoot(document.getElementById('app'));
root.render(
    <React.StrictMode>
        <HelloReact />
    </React.StrictMode>
);