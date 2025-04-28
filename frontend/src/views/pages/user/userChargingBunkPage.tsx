import React, { useState, useEffect } from 'react';
import '../../../assets/css/user/userChargingBunk.css';

interface BunkInfo {
  name: string;
  address: string;
  city: string;
  contactNo: string;
  mapUrl: string;
}

const UserChargingBunkPage: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState('info');
  
  // Sample bunk information - in a real app this would come from an API
  const bunkInfo: BunkInfo = {
    name: "ElectroCharge Station",
    address: "123 Green Energy Drive",
    city: "San Francisco, CA 94107",
    contactNo: "+1 (555) 123-4567",
    mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.0657400102907!2d-122.40270108469028!3d37.78895301908857!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085807ded297e89%3A0x9cdf304c060e753b!2sTesla%20Supercharger!5e0!3m2!1sen!2sus!4v1651234567890!5m2!1sen!2sus"
  };

  useEffect(() => {
    // Animation effect on page load
    setTimeout(() => {
      setIsLoaded(true);
    }, 300);
  }, []);

  return (
    <div className={`adminEvBunkPage ${isLoaded ? 'adminEvBunkPage--loaded' : ''}`}>
      <div className="adminEvBunkPage__container">
        <div className="adminEvBunkPage__header">
          <h1 className="adminEvBunkPage__title">
            <span className="adminEvBunkPage__title-animation">{bunkInfo.name}</span>
          </h1>
          <div className="adminEvBunkPage__tabs">
            <button 
              className={`adminEvBunkPage__tab ${activeTab === 'info' ? 'active' : ''}`}
              onClick={() => setActiveTab('info')}
            >
              Information
            </button>
            <button 
              className={`adminEvBunkPage__tab ${activeTab === 'map' ? 'active' : ''}`}
              onClick={() => setActiveTab('map')}
            >
              Location
            </button>
          </div>
        </div>
        
        <div className="adminEvBunkPage__content">
          <div className="adminEvBunkPage__car-container">
            <div className="adminEvBunkPage__car">
              {/* Placeholder for car image */}
              <div className="adminEvBunkPage__car-silhouette"></div>
              <div className="adminEvBunkPage__charge-animation">
                <div className="adminEvBunkPage__charge-bolt"></div>
                <div className="adminEvBunkPage__charge-circle"></div>
              </div>
            </div>
          </div>
          
          <div className={`adminEvBunkPage__info-panel ${activeTab === 'info' ? 'active' : ''}`}>
            <div className="adminEvBunkPage__info-card">
              <div className="adminEvBunkPage__info-item">
                <span className="adminEvBunkPage__info-label">Address</span>
                <span className="adminEvBunkPage__info-value">{bunkInfo.address}</span>
              </div>
              <div className="adminEvBunkPage__info-item">
                <span className="adminEvBunkPage__info-label">City</span>
                <span className="adminEvBunkPage__info-value">{bunkInfo.city}</span>
              </div>
              <div className="adminEvBunkPage__info-item">
                <span className="adminEvBunkPage__info-label">Contact</span>
                <span className="adminEvBunkPage__info-value">{bunkInfo.contactNo}</span>
              </div>
              
              <div className="adminEvBunkPage__cta-container">
                <button className="adminEvBunkPage__cta-button">
                  Book a Charge
                </button>
                <button className="adminEvBunkPage__cta-button adminEvBunkPage__cta-button--secondary">
                  View Availability
                </button>
              </div>
            </div>
            
            <div className="adminEvBunkPage__features">
              <h3 className="adminEvBunkPage__features-title">Available Services</h3>
              <div className="adminEvBunkPage__features-grid">
                <div className="adminEvBunkPage__feature">
                  <div className="adminEvBunkPage__feature-icon adminEvBunkPage__feature-icon--fast"></div>
                  <span className="adminEvBunkPage__feature-label">Fast Charging</span>
                </div>
                <div className="adminEvBunkPage__feature">
                  <div className="adminEvBunkPage__feature-icon adminEvBunkPage__feature-icon--wifi"></div>
                  <span className="adminEvBunkPage__feature-label">Free WiFi</span>
                </div>
                <div className="adminEvBunkPage__feature">
                  <div className="adminEvBunkPage__feature-icon adminEvBunkPage__feature-icon--cafe"></div>
                  <span className="adminEvBunkPage__feature-label">Café</span>
                </div>
                <div className="adminEvBunkPage__feature">
                  <div className="adminEvBunkPage__feature-icon adminEvBunkPage__feature-icon--24h"></div>
                  <span className="adminEvBunkPage__feature-label">24/7 Service</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className={`adminEvBunkPage__map-panel ${activeTab === 'map' ? 'active' : ''}`}>
            <div className="adminEvBunkPage__map-wrapper">
              <iframe 
                src={bunkInfo.mapUrl}
                className="adminEvBunkPage__map"
                title="EV Bunk Location"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade">
              </iframe>
            </div>
            <div className="adminEvBunkPage__directions">
              <h3 className="adminEvBunkPage__directions-title">Getting Here</h3>
              <p className="adminEvBunkPage__directions-text">
                Located at the intersection of Green Energy Drive and Tech Avenue.
                Easy access from Highway 101, take exit 432B and follow signs for
                ElectroCharge Station.
              </p>
              <div className="adminEvBunkPage__hours">
                <h4 className="adminEvBunkPage__hours-title">Hours of Operation</h4>
                <p className="adminEvBunkPage__hours-text">
                  Open 24 hours, 7 days a week
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="adminEvBunkPage__footer">
        <p className="adminEvBunkPage__copyright">
          © {new Date().getFullYear()} ElectroCharge Network. All rights reserved.
        </p>
        <div className="adminEvBunkPage__footer-links">
          <a href="#" className="adminEvBunkPage__footer-link">Privacy Policy</a>
          <a href="#" className="adminEvBunkPage__footer-link">Terms of Service</a>
          <a href="#" className="adminEvBunkPage__footer-link">Support</a>
        </div>
      </div>
    </div>
  );
};

export default UserChargingBunkPage;