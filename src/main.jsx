import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App.jsx';
import SearchPage from './pages/SearchPage.jsx';
import BrowsePage from './pages/BrowsePage.jsx';
import RemedyPage from './pages/RemedyPage.jsx';
import './index.css';

// Under a GitHub Pages project site the app lives at /<repo>/, so the router
// needs that prefix as its basename (Vite exposes it as BASE_URL).
const basename = import.meta.env.BASE_URL.replace(/\/$/, '') || '/';

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <App />,
      children: [
        { index: true, element: <SearchPage /> },
        { path: 'browse', element: <BrowsePage /> },
        { path: 'remedy/:id', element: <RemedyPage /> },
      ],
    },
  ],
  { basename }
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
