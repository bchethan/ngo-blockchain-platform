import { useState, useEffect } from 'react';
import { donorAPI, ngoAPI } from '../services/apiService';
import { donate, getDonationsByDonor } from '../services/blockchainService';
import './DonorDashboard.css';

const DonorDashboard = ({ account }) => {
  const [donations, setDonations] = useState([]);
  const [verifiedNGOs, setVerifiedNGOs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDonateForm, setShowDonateForm] = useState(false);
  const [donateForm, setDonateForm] = useState({
    ngoAddress: '',
    amount: '',
    message: ''
  });

  useEffect(() => {
    if (account) {
      loadData();
    }
  }, [account]);

  const loadData = async () => {
    try {
      const [donationsRes, ngosRes] = await Promise.all([
        donorAPI.getDonations(account),
        ngoAPI.getProfile(account).catch(() => ({ data: [] }))
      ]);
      setDonations(donationsRes.data);
      
      // Load verified NGOs
      const verifiedRes = await fetch('http://localhost:5000/api/admin/ngos/verified');
      const verified = await verifiedRes.json();
      setVerifiedNGOs(verified);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDonate = async (e) => {
    e.preventDefault();
    try {
      // Donate on blockchain
      const tx = await donate(donateForm.ngoAddress, donateForm.message, donateForm.amount);
      
      // Record in backend
      await donorAPI.recordDonation({
        donor: account,
        ngo: donateForm.ngoAddress,
        amount: donateForm.amount,
        message: donateForm.message,
        transactionHash: tx.hash,
        blockNumber: tx.blockNumber
      });
      
      alert('Donation successful!');
      setShowDonateForm(false);
      setDonateForm({ ngoAddress: '', amount: '', message: '' });
      await loadData();
    } catch (error) {
      console.error('Failed to donate:', error);
      alert('Failed to donate');
    }
  };

  const totalDonated = donations.reduce((sum, d) => sum + parseFloat(d.amount || 0), 0);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="donor-dashboard">
      <div className="container">
        <h1 className="dashboard-title">Donor Dashboard</h1>

        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Donated</h3>
            <p className="stat-value">{totalDonated.toFixed(4)} ETH</p>
          </div>
          <div className="stat-card">
            <h3>Donations Made</h3>
            <p className="stat-value">{donations.length}</p>
          </div>
          <div className="stat-card">
            <h3>NGOs Supported</h3>
            <p className="stat-value">{new Set(donations.map(d => d.ngo)).size}</p>
          </div>
        </div>

        <section className="dashboard-section">
          <div className="section-header">
            <h2>Make a Donation</h2>
            <button 
              className="btn btn-primary"
              onClick={() => setShowDonateForm(!showDonateForm)}
            >
              {showDonateForm ? 'Cancel' : 'Donate Now'}
            </button>
          </div>

          {showDonateForm && (
            <form className="donate-form card" onSubmit={handleDonate}>
              <div className="form-group">
                <label>Select NGO</label>
                <select
                  className="input"
                  value={donateForm.ngoAddress}
                  onChange={(e) => setDonateForm({...donateForm, ngoAddress: e.target.value})}
                  required
                >
                  <option value="">-- Select an NGO --</option>
                  {verifiedNGOs.map((ngo) => (
                    <option key={ngo.walletAddress} value={ngo.walletAddress}>
                      {ngo.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Amount (ETH)</label>
                <input
                  type="number"
                  step="0.0001"
                  className="input"
                  value={donateForm.amount}
                  onChange={(e) => setDonateForm({...donateForm, amount: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Message (optional)</label>
                <textarea
                  className="input"
                  value={donateForm.message}
                  onChange={(e) => setDonateForm({...donateForm, message: e.target.value})}
                  placeholder="Leave a message for the NGO..."
                />
              </div>
              <button type="submit" className="btn btn-primary">Donate</button>
            </form>
          )}
        </section>

        <section className="dashboard-section">
          <h2>Your Donation History</h2>
          <div className="donations-list">
            {donations.length === 0 ? (
              <p className="empty-state">No donations yet. Start making a difference today!</p>
            ) : (
              donations.map((donation, idx) => (
                <div key={idx} className="card donation-card">
                  <div className="donation-header">
                    <div>
                      <h4>To: {donation.ngo.substring(0, 10)}...</h4>
                      {donation.message && <p className="message">{donation.message}</p>}
                    </div>
                    <span className="amount">{donation.amount} ETH</span>
                  </div>
                  <div className="donation-footer">
                    <small>{new Date(donation.timestamp).toLocaleDateString()}</small>
                    {donation.transactionHash && (
                      <a 
                        href={`https://etherscan.io/tx/${donation.transactionHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="tx-link"
                      >
                        View Transaction
                      </a>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default DonorDashboard;
