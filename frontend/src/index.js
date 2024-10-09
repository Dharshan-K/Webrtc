import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './App.css';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import CreateRoom from './components/CreateRoom';
import JoinRoom from './components/JoinRoom';
import VideoRoom from './components/videoRoomComponent';

const router = createBrowserRouter([
  { path: '/', element: <App/>},
  { path: '/createRoom', element: <CreateRoom />},
  { path: '/joinRoom', element: <JoinRoom />},
  { path: '/videoRoom', element: <VideoRoom />}
])
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>
);

// If you want to start measu ring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
