import { Link } from 'react-router-dom';
import WalletConnect from './WalletConnect';
import './Navbar.css';

const Navbar = ({ account, onConnect }) => {
  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          <Link to="/" className="navbar-brand">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span>NGO Blockchain</span>
          </Link>
          
          <div className="navbar-links">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/ngos" className="nav-link">NGOs</Link>
            <Link to="/donate" className="nav-link">Donate</Link>
            <Link to="/register-ngo" className="nav-link">Register NGO</Link>
            {account && (
              <>
                <Link to="/dashboard" className="nav-link">Dashboard</Link>
              </>
            )}
          </div>
          
          <WalletConnect account={account} onConnect={onConnect} />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
