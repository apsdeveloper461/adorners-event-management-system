import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import LogIn from './components/LogIn';
import SignUp from './components/SignUp';
import ForgotPassword from './components/ForgotPassword';
import UserPanel from './components/UserPanel';
import AuthMiddlewareAdmin from './Middleware/AuthMiddlewareAdmin';
import AuthMiddlewareUser from './Middleware/AuthMiddlewareUser';
import EventRecord from './pages/EventRecord';
import GalleryPage from './pages/GalleryPage';
import Inventory from './pages/Inventory';
import InvoiceGenerate from './pages/InvoiceGenerate';
import Ledger from './pages/Ledger';
import AdminPanel from './components/AdminPanel';

function App() {
  return (
    <Router>
      <div>
        <Toaster />
        <Routes>
          <Route path="/login" element={<LogIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/admin-panel" element={<AuthMiddlewareAdmin><AdminPanel><EventRecord /></AdminPanel></AuthMiddlewareAdmin>} />
          <Route path="/" element={<AuthMiddlewareAdmin><AdminPanel><EventRecord /></AdminPanel></AuthMiddlewareAdmin>} />
          <Route path="/admin-panel/events" element={<AuthMiddlewareAdmin><AdminPanel><EventRecord /></AdminPanel></AuthMiddlewareAdmin>} />
          <Route path="/admin-panel/gallery" element={<AuthMiddlewareAdmin><AdminPanel><GalleryPage /></AdminPanel></AuthMiddlewareAdmin>} />
          <Route path="/admin-panel/inventory" element={<AuthMiddlewareAdmin><AdminPanel><Inventory /></AdminPanel></AuthMiddlewareAdmin>} />
          <Route path="/admin-panel/invoice" element={<AuthMiddlewareAdmin><AdminPanel><InvoiceGenerate /></AdminPanel></AuthMiddlewareAdmin>} />
          <Route path="/admin-panel/ledger" element={<AuthMiddlewareAdmin><AdminPanel><Ledger /></AdminPanel></AuthMiddlewareAdmin>} />
          <Route path="/user-panel" element={<AuthMiddlewareUser><UserPanel /></AuthMiddlewareUser>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
