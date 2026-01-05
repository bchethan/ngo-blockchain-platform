import { useState, useEffect } from 'react';
import { donate } from '../services/mockBlockchainService';
import { donorAPI } from '../services/apiService';
import { dummyNGOs } from '../data/dummyNGOs';
import './DonatePage.css';

const DonatePage = ({ account }) => {
  const [verifiedNGOs, setVerifiedNGOs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [donateForm, setDonateForm] = useState({
    ngoAddress: '',
    amount: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadNGOs();
  }, []);

  const loadNGOs = async () => {
    try {
      // Try to load from backend
      const response = await fetch('http://localhost:5000/api/admin/ngos/verified');
      const backendNGOs = await response.json();
      
      // Combine backend NGOs with dummy NGOs (dummy NGOs as fallback)
      const allNGOs = backendNGOs.length > 0 ? backendNGOs : dummyNGOs;
      setVerifiedNGOs(allNGOs);
    } catch (error) {
      console.error('Failed to load NGOs, using dummy data:', error);
      // Use dummy NGOs if backend fails
      setVerifiedNGOs(dummyNGOs);
    } finally {
      setLoading(false);
    }
  };

  const handleDonate = async (e) => {
    e.preventDefault();
    
    if (!account) {
      alert('Please connect your wallet first');
      return;
    }

    setSubmitting(true);
    try {
      // Donate on blockchain (mock in demo mode)
      const tx = await donate(donateForm.ngoAddress, donateForm.message, donateForm.amount);
      
      // Try to record in backend (optional in demo mode)
      try {
        await donorAPI.recordDonation({
          donor: account,
          ngo: donateForm.ngoAddress,
          amount: donateForm.amount,
          message: donateForm.message,
          transactionHash: tx.hash,
          blockNumber: tx.blockNumber
        });
      } catch (backendError) {
        console.log('Backend recording failed (demo mode OK):', backendError);
      }
      
      alert('Donation successful! 🎉\nTransaction Hash: ' + tx.hash);
      setDonateForm({ ngoAddress: '', amount: '', message: '' });
    } catch (error) {
      console.error('Failed to donate:', error);
      alert('Failed to donate: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const selectedNGO = verifiedNGOs.find(ngo => ngo.walletAddress === donateForm.ngoAddress);

  if (!account) {
    return (
      <div className="donate-page">
        <div className="container">
          <div className="not-connected">
            <h2>Connect Your Wallet</h2>
            <p>Please connect your MetaMask wallet to make donations</p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return <div className="loading">Loading NGOs...</div>;
  }

  return (
    <div className="donate-page">
      <div className="container">
        <div className="page-header">
          <h1>Make a Donation</h1>
          <p>Support verified NGOs with transparent blockchain donations</p>
        </div>

        <form className="donate-form-page card" onSubmit={handleDonate}>
          <div className="form-group">
            <label>Select NGO *</label>
            <select
              className="input"
              value={donateForm.ngoAddress}
              onChange={(e) => setDonateForm({...donateForm, ngoAddress: e.target.value})}
              required
            >
              <option value="">-- Choose an NGO to support --</option>
              {verifiedNGOs.map((ngo) => (
                <option key={ngo.walletAddress} value={ngo.walletAddress}>
                  {ngo.name}
                </option>
              ))}
            </select>
          </div>

          {selectedNGO && (
            <div className="ngo-preview card">
              <h3>{selectedNGO.name}</h3>
              <p>{selectedNGO.description}</p>
              <div className="ngo-details">
                {selectedNGO.website && (
                  <a href={selectedNGO.website} target="_blank" rel="noopener noreferrer">
                    Visit Website →
                  </a>
                )}
              </div>
            </div>
          )}

          <div className="form-group">
            <label>Donation Amount (ETH) *</label>
            <input
              type="number"
              step="0.0001"
              min="0.0001"
              className="input"
              value={donateForm.amount}
              onChange={(e) => setDonateForm({...donateForm, amount: e.target.value})}
              placeholder="0.1"
              required
            />
            <small className="help-text">Minimum: 0.0001 ETH</small>
          </div>

          <div className="form-group">
            <label>Message (Optional)</label>
            <textarea
              className="input"
              value={donateForm.message}
              onChange={(e) => setDonateForm({...donateForm, message: e.target.value})}
              placeholder="Leave an encouraging message for the NGO..."
              rows="4"
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary btn-large" 
            disabled={submitting}
          >
            {submitting ? 'Processing...' : `Donate ${donateForm.amount || '0'} ETH`}
          </button>
        </form>

        {verifiedNGOs.length === 0 && (
          <div className="empty-state">
            <h3>No NGOs Available</h3>
            <p>There are currently no verified NGOs. Check back soon!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DonatePage;
