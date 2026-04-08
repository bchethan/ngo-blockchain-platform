import { useState, useEffect } from 'react';
import { adminAPI, donorAPI } from '../services/apiService';
import { verifyNGO as verifyNGOBlockchain } from '../services/mockBlockchainService';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [ngos, setNgos] = useState([]);
  const [donations, setDonations] = useState([]);
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDonor, setSelectedDonor] = useState(null);
  const [donorTransactions, setDonorTransactions] = useState([]);
  const [loadingTransactions, setLoadingTransactions] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [ngosRes, donationsRes, donorsRes] = await Promise.all([
        adminAPI.getAllNGOs(),
        adminAPI.getAllDonations(),
        donorAPI.getAllDonors()
      ]);
      setNgos(ngosRes.data);
      setDonations(donationsRes.data);
      setDonors(donorsRes.data);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyNGO = async (ngoAddress) => {
    try {
      // Verify on blockchain
      await verifyNGOBlockchain(ngoAddress);
      // Update in backend
      await adminAPI.verifyNGO(ngoAddress);
      // Reload data
      await loadData();
      alert('NGO verified successfully!');
    } catch (error) {
      console.error('Failed to verify NGO:', error);
      alert('Failed to verify NGO');
    }
  };

  const handleSelectDonor = async (donor) => {
    setSelectedDonor(donor);
    setLoadingTransactions(true);
    try {
      const response = await donorAPI.getTransactions(donor._id);
      setDonorTransactions(response.data);
    } catch (error) {
      console.error('Failed to fetch donor transactions', error);
      setDonorTransactions([]);
    } finally {
      setLoadingTransactions(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="admin-dashboard">
      <div className="container">
        <h1 className="dashboard-title">Admin Dashboard</h1>
        
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total NGOs</h3>
            <p className="stat-value">{ngos.length}</p>
          </div>
          <div className="stat-card">
            <h3>Verified NGOs</h3>
            <p className="stat-value">{ngos.filter(n => n.isVerified).length}</p>
          </div>
          <div className="stat-card">
            <h3>Total Donations</h3>
            <p className="stat-value">{donations.length}</p>
          </div>
          <div className="stat-card">
            <h3>Total Donors</h3>
            <p className="stat-value">{donors.length}</p>
          </div>
        </div>

        <section className="dashboard-section">
          <h2>NGO Management</h2>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Wallet Address</th>
                  <th>Registration ID</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {ngos.map((ngo) => (
                  <tr key={ngo.walletAddress}>
                    <td>{ngo.name}</td>
                    <td className="address">{ngo.walletAddress.substring(0, 10)}...</td>
                    <td>{ngo.registrationId}</td>
                    <td>
                      {ngo.isVerified ? (
                        <span className="badge badge-success">Verified</span>
                      ) : (
                        <span className="badge badge-warning">Pending</span>
                      )}
                    </td>
                    <td>
                      {!ngo.isVerified && (
                        <button 
                          className="btn btn-primary btn-sm"
                          onClick={() => handleVerifyNGO(ngo.walletAddress)}
                        >
                          Verify
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="dashboard-section">
          <h2>Recent Donations</h2>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Donor</th>
                  <th>NGO</th>
                  <th>Amount (ETH)</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {donations.slice(0, 10).map((donation, idx) => (
                  <tr key={idx}>
                    <td className="address">{donation.donor.substring(0, 10)}...</td>
                    <td className="address">{donation.ngo.substring(0, 10)}...</td>
                    <td>{donation.amount}</td>
                    <td>{new Date(donation.timestamp).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
        <section className="dashboard-section">
          <h2>Donor Management</h2>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Registered Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {donors.map((donor, idx) => (
                  <tr key={idx}>
                    <td>{donor.name}</td>
                    <td>{donor.email || 'N/A'}</td>
                    <td>{new Date(donor.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button 
                        className="btn btn-secondary btn-sm"
                        onClick={() => handleSelectDonor(donor)}
                      >
                        View History
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {selectedDonor && (
          <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div className="modal-content card" style={{ background: '#c57777ff', padding: '20px', borderRadius: '8px', minWidth: '400px', maxWidth: '80%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h3 style={{ margin: 0 }}>Transaction History: {selectedDonor.name}</h3>
                <button className="btn btn-secondary btn-sm" onClick={() => setSelectedDonor(null)}>Close</button>
              </div>

              {loadingTransactions ? (
                <p>Loading transactions...</p>
              ) : donorTransactions.length === 0 ? (
                <p>No transactions found for this donor.</p>
              ) : (
                <div className="table-container" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>NGO</th>
                        <th>Amount (ETH)</th>
                        <th>Date</th>
                        <th>Message</th>
                      </tr>
                    </thead>
                    <tbody>
                      {donorTransactions.map((tx, idx) => (
                        <tr key={idx}>
                          <td>{tx.ngoId ? tx.ngoId.name : 'Legacy NGO'}</td>
                          <td>{tx.amount}</td>
                          <td>{new Date(tx.timestamp).toLocaleString()}</td>
                          <td>{tx.message || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
