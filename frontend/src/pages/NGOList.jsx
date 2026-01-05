import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../services/apiService';
import { dummyNGOs } from '../data/dummyNGOs';
import './NGOList.css';

const NGOList = () => {
  const [ngos, setNgos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNGOs();
  }, []);

  const loadNGOs = async () => {
    try {
      const response = await adminAPI.getVerifiedNGOs();
      const backendNGOs = response.data;
      // Use backend NGOs if available, otherwise use dummy data
      setNgos(backendNGOs.length > 0 ? backendNGOs : dummyNGOs);
    } catch (error) {
      console.error('Failed to load NGOs, using dummy data:', error);
      // Use dummy NGOs if backend fails
      setNgos(dummyNGOs);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading NGOs...</div>;
  }

  return (
    <div className="ngo-list-page">
      <div className="container">
        <div className="page-header">
          <h1>Verified NGOs</h1>
          <p>Support transparent and verified non-profit organizations</p>
        </div>

        <div className="ngo-grid">
          {ngos.length === 0 ? (
            <div className="empty-state">
              <h3>No verified NGOs yet</h3>
              <p>Check back soon for verified organizations</p>
            </div>
          ) : (
            ngos.map((ngo) => (
              <div key={ngo.walletAddress} className="ngo-card card">
                <div className="ngo-header">
                  <h3>{ngo.name}</h3>
                  <span className="badge badge-success">✓ Verified</span>
                </div>
                <p className="ngo-description">{ngo.description}</p>
                <div className="ngo-details">
                  <div className="detail-item">
                    <span className="label">Registration ID:</span>
                    <span className="value">{ngo.registrationId}</span>
                  </div>
                  {ngo.email && (
                    <div className="detail-item">
                      <span className="label">Email:</span>
                      <span className="value">{ngo.email}</span>
                    </div>
                  )}
                  {ngo.website && (
                    <div className="detail-item">
                      <span className="label">Website:</span>
                      <a href={ngo.website} target="_blank" rel="noopener noreferrer" className="value link">
                        Visit Website
                      </a>
                    </div>
                  )}
                </div>
                <Link to="/donor" className="btn btn-primary">
                  Donate Now
                </Link>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default NGOList;
