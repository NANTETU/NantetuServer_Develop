import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.jsx'; // 修正: 親ディレクトリを示す'../'を削除し、'./'で同じディレクトリを参照する

// アプリケーションをpublic/index.htmlのid="root"要素にレンダリングする
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
