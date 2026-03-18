import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import AboutPage from './pages/AboutPage';
import Header from './components/Header';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import PrivateRoute from './components/PrivateRoute';
import LoginPage from './pages/adm/LoginPage';
import DashboardPage from './pages/adm/DashboardPage';
import './App.css';

function App() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: false,
      offset: 100,
    });
  }, []);

  return (
    <Router>
      <div className="app">
        <Routes>
          {/* Rotas Públicas do Site */}
          <Route path="/" element={
            <>
              <Header />
              <HomePage />
              <Footer />
            </>
          } />
          <Route path="/pecas" element={<ProductsPage />} />
          <Route path="/sobre" element={<AboutPage />} />

          {/* Rotas do Painel ADM */}
          <Route path="/adm/login" element={<LoginPage />} />
          <Route path="/adm" element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          } />
        </Routes>

        {/* WhatsApp só aparece nas páginas públicas */}
        <WhatsAppButton />
      </div>
    </Router>
  );
}

export default App;
