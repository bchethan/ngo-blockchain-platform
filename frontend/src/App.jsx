import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Dashboard from './pages/Dashboard';
import DonatePage from './pages/DonatePage';
import AdminDashboard from './pages/AdminDashboard';
import NGODashboard from './pages/NGODashboard';
import DonorDashboard from './pages/DonorDashboard';
import NGOList from './pages/NGOList';
import RegisterNGO from './pages/RegisterNGO';
import './styles/main.css';
import './styles/forms.css';
import './App.css';

function App() {
  const [account, setAccount] = useState(null);

  useEffect(() => {
    // Check if wallet is already connected
    const checkWalletConnection = async () => {
      if (typeof window.ethereum !== 'undefined') {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            setAccount(accounts[0]);
          }
        } catch (error) {
          console.error('Error checking wallet connection:', error);
        }
      }
    };

    checkWalletConnection();

    // Listen for account changes
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        } else {
          setAccount(null);
        }
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners('accountsChanged');
      }
    };
  }, []);

  const handleConnect = (address) => {
    setAccount(address);
  };

  return (
    <Router>
      <div className="app">
        <Navbar account={account} onConnect={handleConnect} />
        <main>
          <Routes>
            <Route path="/" element={
              <div className="home-container">
                <div className="container">
                  <h1>Welcome to NGO Blockchain Platform</h1>
                  <p>Transparent and secure donation management powered by blockchain technology.</p>
                  {!account && (
                    <p style={{ color: 'var(--text-secondary)' }}>
                      Connect your wallet to get started
                    </p>
                  )}
                </div>
              </div>
            } />
            <Route path="/dashboard" element={<Dashboard account={account} />} />
            <Route path="/donate" element={<DonatePage account={account} />} />
            <Route path="/ngos" element={<NGOList />} />
            <Route path="/register-ngo" element={<RegisterNGO account={account} />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/ngo" element={<NGODashboard account={account} />} />
            <Route path="/donor" element={<DonorDashboard account={account} />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
