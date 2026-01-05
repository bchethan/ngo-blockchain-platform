import { Link } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = ({ account }) => {
  if (!account) {
    return (
      <div className="dashboard-page">
        <div className="container">
          <div className="not-connected">
            <h2>Connect Your Wallet</h2>
            <p>Please connect your MetaMask wallet to access your dashboard</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="container">
        <div className="page-header">
          <h1>Your Dashboard</h1>
          <p>Manage your NGO blockchain activities</p>
        </div>

        <div className="dashboard-grid">
          <Link to="/donate" className="dashboard-card card">
            <div className="card-icon">💰</div>
            <h3>Make a Donation</h3>
            <p>Support verified NGOs with transparent blockchain donations</p>
            <span className="card-arrow">→</span>
          </Link>

          <Link to="/ngos" className="dashboard-card card">
            <div className="card-icon">🏛️</div>
            <h3>Browse NGOs</h3>
            <p>Explore all verified non-profit organizations</p>
            <span className="card-arrow">→</span>
          </Link>

          <Link to="/register-ngo" className="dashboard-card card">
            <div className="card-icon">📝</div>
            <h3>Register NGO</h3>
            <p>Register your organization on the blockchain</p>
            <span className="card-arrow">→</span>
          </Link>

          <Link to="/donor" className="dashboard-card card">
            <div className="card-icon">📊</div>
            <h3>Donor History</h3>
            <p>View your donation history and impact</p>
            <span className="card-arrow">→</span>
          </Link>

          <Link to="/ngo" className="dashboard-card card">
            <div className="card-icon">🏢</div>
            <h3>NGO Dashboard</h3>
            <p>Manage your NGO profile and expenditures</p>
            <span className="card-arrow">→</span>
          </Link>

          <Link to="/admin" className="dashboard-card card">
            <div className="card-icon">⚙️</div>
            <h3>Admin Panel</h3>
            <p>Verify NGOs and monitor platform activity</p>
            <span className="card-arrow">→</span>
          </Link>
        </div>

        <div className="quick-stats">
          <h2>Quick Info</h2>
          <div className="info-grid">
            <div className="info-card">
              <strong>Connected Wallet:</strong>
              <span className="wallet-address">{account}</span>
            </div>
            <div className="info-card">
              <strong>Network:</strong>
              <span>Hardhat Local (Chain ID: 31337)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
