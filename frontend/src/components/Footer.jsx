import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>NGO Blockchain Platform</h3>
            <p>Transparent and secure donation management powered by blockchain technology.</p>
          </div>
          
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/ngos">NGOs</Link></li>
              <li><Link to="/donate">Donate</Link></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Technology</h4>
            <ul>
              <li>Ethereum Blockchain</li>
              <li>Smart Contracts</li>
              <li>MetaMask Integration</li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2026 NGO Blockchain Platform. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
