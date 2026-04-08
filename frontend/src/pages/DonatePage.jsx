import { useState, useEffect } from 'react';
import { donate } from '../services/mockBlockchainService';
import { donorAPI } from '../services/apiService';
import './DonatePage.css';

const DonatePage = ({ account }) => {
  const [verifiedNGOs, setVerifiedNGOs] = useState([]);
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [donateForm, setDonateForm] = useState({
    donorId: '',
    ngoAddress: '',
    amount: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [showCreateDonor, setShowCreateDonor] = useState(false);
  const [newDonorForm, setNewDonorForm] = useState({ name: '', email: '' });
  const [creatingDonor, setCreatingDonor] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [ngosRes, donorsRes] = await Promise.all([
        fetch('http://localhost:5000/api/admin/ngos/verified').then(r => r.json()),
        donorAPI.getAllDonors().then(r => r.data)
      ]);
      setVerifiedNGOs(ngosRes);
      setDonors(donorsRes);
    } catch (error) {
      console.error('Failed to load data:', error);
      setVerifiedNGOs([]);
      setDonors([]);
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
      
      // Try to record in backend
      const selectedNgoObj = verifiedNGOs.find(n => n.walletAddress === donateForm.ngoAddress);
      try {
        await donorAPI.recordDonation({
          donor: account,
          ngo: donateForm.ngoAddress,
          amount: donateForm.amount,
          message: donateForm.message,
          transactionHash: tx.hash,
          blockNumber: tx.blockNumber,
          donorId: donateForm.donorId,
          ngoId: selectedNgoObj ? selectedNgoObj._id : undefined
        });
      } catch (backendError) {
        console.log('Backend recording failed (demo mode OK):', backendError);
      }
      
      alert('Donation successful! 🎉\nTransaction Hash: ' + tx.hash);
      setDonateForm({ donorId: '', ngoAddress: '', amount: '', message: '' });
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

  const handleCreateDonor = async (e) => {
    e.preventDefault();
    setCreatingDonor(true);
    try {
      const { data } = await donorAPI.createDonor(newDonorForm);
      setDonors([data, ...donors]);
      setDonateForm({ ...donateForm, donorId: data._id });
      setShowCreateDonor(false);
      setNewDonorForm({ name: '', email: '' });
      alert('Donor profile created successfully!');
    } catch (error) {
      console.error('Failed to create donor:', error);
      const errorMessage = error.response?.data?.message || error.message;
      alert(`Failed to create donor profile: ${errorMessage}`);
    } finally {
      setCreatingDonor(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading Data...</div>;
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
            <label>Select Donor *</label>
            <div className="donor-select-header" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <select
                className="input"
                style={{ flex: 1 }}
                value={donateForm.donorId}
                onChange={(e) => setDonateForm({ ...donateForm, donorId: e.target.value })}
                required
              >
                <option value="">-- Choose your Donor Profile --</option>
                {donors.map((donor) => (
                  <option key={donor._id} value={donor._id}>
                    {donor.name} {donor.email ? `(${donor.email})` : ''}
                  </option>
                ))}
              </select>
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={() => setShowCreateDonor(!showCreateDonor)}
              >
                {showCreateDonor ? 'Cancel' : 'New Donor'}
              </button>
            </div>
          </div>

          {showCreateDonor && (
            <div className="create-donor-section" style={{ background: '#2b83dbff', padding: '15px', borderRadius: '5px', marginBottom: '20px' }}>
              <h4>Register New Donor</h4>
              <div className="form-group">
                <input 
                  type="text" 
                  className="input" 
                  style={{ marginBottom: '10px' }}
                  placeholder="Donor Name" 
                  value={newDonorForm.name}
                  onChange={(e) => setNewDonorForm({ ...newDonorForm, name: e.target.value })}
                />
                <input 
                  type="email" 
                  className="input" 
                  style={{ marginBottom: '10px' }}
                  placeholder="Email (Optional)" 
                  value={newDonorForm.email}
                  onChange={(e) => setNewDonorForm({ ...newDonorForm, email: e.target.value })}
                />
                <button 
                  type="button" 
                  className="btn btn-primary btn-sm"
                  onClick={handleCreateDonor}
                  disabled={creatingDonor || !newDonorForm.name}
                >
                  {creatingDonor ? 'Creating...' : 'Register'}
                </button>
              </div>
            </div>
          )}

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
