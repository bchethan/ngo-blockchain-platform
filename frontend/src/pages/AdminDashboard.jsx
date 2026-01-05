import { useState, useEffect } from 'react';
import { adminAPI } from '../services/apiService';
import { verifyNGO as verifyNGOBlockchain } from '../services/blockchainService';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [ngos, setNgos] = useState([]);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [ngosRes, donationsRes] = await Promise.all([
        adminAPI.getAllNGOs(),
        adminAPI.getAllDonations()
      ]);
      setNgos(ngosRes.data);
      setDonations(donationsRes.data);
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
      </div>
    </div>
  );
};

export default AdminDashboard;
