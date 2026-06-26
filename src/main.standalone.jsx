// Standalone entry: identical app, but hash-based routing so the single-file
// build works when opened directly from disk (file://) with no web server.
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createHashRouter, RouterProvider } from 'react-router-dom';
import App from './App.jsx';
import SearchPage from './pages/SearchPage.jsx';
import BrowsePage from './pages/BrowsePage.jsx';
import RemedyPage from './pages/RemedyPage.jsx';
import './index.css';

const router = createHashRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <SearchPage /> },
      { path: 'browse', element: <BrowsePage /> },
      { path: 'remedy/:id', element: <RemedyPage /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
