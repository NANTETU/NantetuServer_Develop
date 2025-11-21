import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '../App.jsx'; // App.jsxをインポート

// アプリケーションをpublic/index.htmlのid="root"要素にレンダリングする
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
