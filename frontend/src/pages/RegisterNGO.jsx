import { useState } from 'react';
import { DEMO_MODE, registerNGO, generateFreshWalletAddress } from '../services/mockBlockchainService';
import { ngoAPI } from '../services/apiService';
import './RegisterNGO.css';

const RegisterNGO = ({ account }) => {
  const [formData, setFormData] = useState({
    name: '',
    registrationId: '',
    description: '',
    email: '',
    phone: '',
    website: '',
    ipfsDocHash: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // In demo mode, generate a strictly fresh wallet address for the NGO (avoid reusing donor wallet)
    const walletAddress = DEMO_MODE ? generateFreshWalletAddress() : account;
    console.log("Registering NGO with wallet address:", walletAddress);

    setLoading(true);
    try {
      // Register on blockchain (mock in demo mode)
      await registerNGO(
        formData.name,
        formData.registrationId,
        formData.description,
        formData.ipfsDocHash || 'QmDefault'
      );

      // Try to register in backend
      // We no longer swallow this error. If backend fails, the whole submission fails.
      await ngoAPI.register({
        walletAddress: walletAddress,
        ...formData
      });

      setSuccess(true);
      alert('NGO registered successfully! 🎉\nWallet: ' + walletAddress + '\n\nIn demo mode, your NGO is automatically verified.');
      setFormData({
        name: '',
        registrationId: '',
        description: '',
        email: '',
        phone: '',
        website: '',
        ipfsDocHash: ''
      });
    } catch (error) {
      console.error('Failed to register NGO:', error);
      const errorMessage = error.response?.data?.message || error.message;
      alert('Failed to register NGO: ' + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="register-ngo-page">
      <div className="container">
        <div className="page-header">
          <h1>Register Your NGO</h1>
          <p>Join the transparent blockchain-based donation platform</p>
          {!account && (
            <div className="demo-notice">
              <p>🎭 <strong>Demo Mode:</strong> No wallet needed! A fake address will be generated for you.</p>
            </div>
          )}
        </div>

        {success && (
          <div className="success-message card">
            <h3>✓ Registration Successful!</h3>
            <p>Your NGO has been registered. Please wait for admin verification to start receiving donations.</p>
          </div>
        )}

        <form className="register-form card" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>NGO Name *</label>
              <input
                type="text"
                name="name"
                className="input"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter your NGO name"
              />
            </div>

            <div className="form-group">
              <label>Registration ID *</label>
              <input
                type="text"
                name="registrationId"
                className="input"
                value={formData.registrationId}
                onChange={handleChange}
                required
                placeholder="Government registration number"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Description *</label>
            <textarea
              name="description"
              className="input"
              value={formData.description}
              onChange={handleChange}
              required
              placeholder="Describe your NGO's mission and activities"
              rows="4"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                className="input"
                value={formData.email}
                onChange={handleChange}
                placeholder="contact@ngo.org"
              />
            </div>

            <div className="form-group">
              <label>Phone</label>
              <input
                type="tel"
                name="phone"
                className="input"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 234 567 8900"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Website</label>
            <input
              type="url"
              name="website"
              className="input"
              value={formData.website}
              onChange={handleChange}
              placeholder="https://your-ngo.org"
            />
          </div>

          <div className="form-group">
            <label>IPFS Document Hash (Optional)</label>
            <input
              type="text"
              name="ipfsDocHash"
              className="input"
              value={formData.ipfsDocHash}
              onChange={handleChange}
              placeholder="QmHash... (verification documents)"
            />
            <small className="help-text">Upload verification documents to IPFS and paste the hash here</small>
          </div>

          <div className="wallet-info">
            <strong>Registering with:</strong> {DEMO_MODE ? '🎭 Auto-generated fresh wallet' : account}
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Registering...' : 'Register NGO'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterNGO;
