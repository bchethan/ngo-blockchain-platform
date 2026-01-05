import { useState, useEffect } from 'react';
import { ngoAPI } from '../services/apiService';
import { recordExpenditure, getExpendituresByNGO } from '../services/blockchainService';
import './NGODashboard.css';

const NGODashboard = ({ account }) => {
  const [ngoProfile, setNgoProfile] = useState(null);
  const [donations, setDonations] = useState([]);
  const [expenditures, setExpenditures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showExpenditureForm, setShowExpenditureForm] = useState(false);
  const [expenditureForm, setExpenditureForm] = useState({
    amount: '',
    recipient: '',
    description: '',
    ipfsHash: ''
  });

  useEffect(() => {
    if (account) {
      loadData();
    }
  }, [account]);

  const loadData = async () => {
    try {
      const [profileRes, donationsRes] = await Promise.all([
        ngoAPI.getProfile(account),
        ngoAPI.getDonations(account)
      ]);
      setNgoProfile(profileRes.data);
      setDonations(donationsRes.data);
      
      // Load expenditures from blockchain
      const exp = await getExpendituresByNGO(account);
      setExpenditures(exp);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRecordExpenditure = async (e) => {
    e.preventDefault();
    try {
      await recordExpenditure(
        expenditureForm.amount,
        expenditureForm.recipient,
        expenditureForm.description,
        expenditureForm.ipfsHash
      );
      alert('Expenditure recorded successfully!');
      setShowExpenditureForm(false);
      setExpenditureForm({ amount: '', recipient: '', description: '', ipfsHash: '' });
      await loadData();
    } catch (error) {
      console.error('Failed to record expenditure:', error);
      alert('Failed to record expenditure');
    }
  };

  const totalDonations = donations.reduce((sum, d) => sum + parseFloat(d.amount || 0), 0);
  const totalExpenditures = expenditures.reduce((sum, e) => sum + parseFloat(e.amount || 0), 0);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!ngoProfile) {
    return (
      <div className="ngo-dashboard">
        <div className="container">
          <div className="not-registered">
            <h2>NGO Not Registered</h2>
            <p>Please register your NGO first.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="ngo-dashboard">
      <div className="container">
        <div className="profile-header">
          <h1>{ngoProfile.name}</h1>
          {ngoProfile.isVerified ? (
            <span className="badge badge-success">✓ Verified</span>
          ) : (
            <span className="badge badge-warning">Pending Verification</span>
          )}
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Donations</h3>
            <p className="stat-value">{totalDonations.toFixed(4)} ETH</p>
          </div>
          <div className="stat-card">
            <h3>Total Expenditures</h3>
            <p className="stat-value">{totalExpenditures.toFixed(4)} ETH</p>
          </div>
          <div className="stat-card">
            <h3>Remaining Balance</h3>
            <p className="stat-value">{(totalDonations - totalExpenditures).toFixed(4)} ETH</p>
          </div>
        </div>

        <section className="dashboard-section">
          <div className="section-header">
            <h2>Expenditures</h2>
            <button 
              className="btn btn-primary"
              onClick={() => setShowExpenditureForm(!showExpenditureForm)}
            >
              Record Expenditure
            </button>
          </div>

          {showExpenditureForm && (
            <form className="expenditure-form card" onSubmit={handleRecordExpenditure}>
              <div className="form-group">
                <label>Amount (ETH)</label>
                <input
                  type="number"
                  step="0.0001"
                  className="input"
                  value={expenditureForm.amount}
                  onChange={(e) => setExpenditureForm({...expenditureForm, amount: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Recipient</label>
                <input
                  type="text"
                  className="input"
                  value={expenditureForm.recipient}
                  onChange={(e) => setExpenditureForm({...expenditureForm, recipient: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  className="input"
                  value={expenditureForm.description}
                  onChange={(e) => setExpenditureForm({...expenditureForm, description: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>IPFS Receipt Hash (optional)</label>
                <input
                  type="text"
                  className="input"
                  value={expenditureForm.ipfsHash}
                  onChange={(e) => setExpenditureForm({...expenditureForm, ipfsHash: e.target.value})}
                />
              </div>
              <button type="submit" className="btn btn-primary">Submit</button>
            </form>
          )}

          <div className="expenditures-list">
            {expenditures.map((exp, idx) => (
              <div key={idx} className="card expenditure-card">
                <div className="expenditure-header">
                  <h4>{exp.recipient}</h4>
                  <span className="amount">{exp.amount} ETH</span>
                </div>
                <p>{exp.description}</p>
                <small>{new Date(exp.timestamp * 1000).toLocaleDateString()}</small>
              </div>
            ))}
          </div>
        </section>

        <section className="dashboard-section">
          <h2>Donations Received</h2>
          <div className="donations-list">
            {donations.map((donation, idx) => (
              <div key={idx} className="card donation-card">
                <div className="donation-header">
                  <span className="address">{donation.donor.substring(0, 10)}...</span>
                  <span className="amount">{donation.amount} ETH</span>
                </div>
                {donation.message && <p className="message">{donation.message}</p>}
                <small>{new Date(donation.timestamp).toLocaleDateString()}</small>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default NGODashboard;
