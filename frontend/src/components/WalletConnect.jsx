import { useState } from 'react';
import { connectWallet, DEMO_MODE } from '../services/mockBlockchainService';
import './WalletConnect.css';

const WalletConnect = ({ onConnect, account }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleConnect = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const address = await connectWallet();
      onConnect(address);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (account) {
    return (
      <div className="wallet-connected">
        <div className="wallet-address">
          {DEMO_MODE && <span className="demo-badge">🎭 DEMO</span>}
          <span>{account.substring(0, 6)}...{account.substring(38)}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="wallet-connect">
      <button 
        className="wallet-connect-btn" 
        onClick={handleConnect}
        disabled={loading}
      >
        {loading ? 'Connecting...' : (DEMO_MODE ? '🎭 Connect (Demo)' : 'Connect Wallet')}
      </button>
      {error && <div className="wallet-error">{error}</div>}
    </div>
  );
};

export default WalletConnect;
