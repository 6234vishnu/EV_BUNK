import React, { useState, useEffect } from 'react';
import '../../../assets/css/admin/adminEvBunk.css'
import Lottie from "react-lottie";
import animationData from "../../../assets/animations/Animation - 1745829370634-successAnimtion.json";
import api from '../../../services/axiosInstance';
import { Options } from 'react-lottie';

interface FormData {
  name?: string;
  address?: string;
  city?: string;
  contactNo?: string;
  mapEmbed?: string;
  totalPorts?: number|any;
  availablePorts?: number |any;
  chargingType?: string |any;
  supportedConnectors?: string[]|any;
  pricePerKWh?: number|any;
  flatRate?: number|any;
  is24Hours?: boolean|any;
  status?: string|any;
  allowBooking?: boolean|any;
  landmarks?: string[]|any;
}


const AdminEvBunkPage: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [message, setMessage] = useState<string>("")
  const [formData, setFormData] = useState<FormData>({
    name: '',
    address: '',
    city: '',
    contactNo: '',
    mapEmbed: '',
    totalPorts: 0,
    availablePorts: 0,
    chargingType: '',
    supportedConnectors: [],
    pricePerKWh: 0,
    flatRate: undefined, // optional, so can be undefined
    is24Hours: false,
    status: '',
    allowBooking: false,
    landmarks: []
  });
  


  const [formErrors, setFormErrors] = useState<Partial<FormData>>({});
  const [showSuccessMessage, setShowSuccessMessage] = useState<boolean>(false);

  const defaultOptions: Options = {
    loop: true,
    autoplay: true, // Animation plays automatically
    animationData: animationData, // The Lottie JSON animation data
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setMessage("")
    }, 4000)
    return () => clearTimeout(timer)
  }, [message])


  useEffect(() => {
    // Animation effect on page load
    setTimeout(() => {
      setIsLoaded(true);
    }, 300);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
  
    if (name === 'supportedConnectors') {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value ? value.split(',').map((connector) => connector.trim()) : [], 
      }));
    } else if (name === 'landmarks') {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value ? value.split(',').map((landmark) => landmark.trim()) : [],
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  
    // Clear error for this field when user types
    if (formErrors[name as keyof FormData]) {
      setFormErrors({
        ...formErrors,
        [name]: undefined, // Clear the error message for the field
      });
    }
  };


  
  
  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    
    setFormData((prevData) => ({
      ...prevData,
      [name]: checked,
    }));
    
    // Clear error for this field when user changes it
    if (formErrors[name as keyof FormData]) {
      setFormErrors({
        ...formErrors,
        [name]: undefined,
      });
    }
  };

  type ValidationResult = {
    isValid: boolean;
    errors: Partial<FormData>;
  };
  
  const validateForm = (): ValidationResult => {
    const errors: Partial<FormData> = {};
    let isValid = true;
  
    if (!formData.name?.trim()) {
      errors.name = 'Bunk Name is required';
      isValid = false;
    }
  
    if (!formData.address?.trim()) {
      errors.address = 'Address is required';
      isValid = false;
    }
  
    if (!formData.city?.trim()) {
      errors.city = 'City is required';
      isValid = false;
    }
  
    if (!formData.contactNo?.trim()) {
      errors.contactNo = 'Contact Number is required';
      isValid = false;
    } else if (!/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/im.test(formData.contactNo)) {
      errors.contactNo = 'Please enter a valid contact number';
      isValid = false;
    }
  
    if (!formData.mapEmbed?.trim()) {
      errors.mapEmbed = 'Google Map Embed URL is required';
      isValid = false;
    } else if (!formData.mapEmbed.includes('google.com/maps/embed')) {
      errors.mapEmbed = 'Please enter a valid Google Maps embed URL';
      isValid = false;
    }
  
    if (!formData.totalPorts || formData.totalPorts <= 0) {
      errors.totalPorts = 'Total Ports must be greater than zero';
      isValid = false;
    }
  
    if (
      formData.availablePorts === undefined ||
      formData.availablePorts < 0 ||
      (formData.totalPorts && formData.availablePorts > formData.totalPorts)
    ) {
      errors.availablePorts = 'Available Ports must be between 0 and Total Ports';
      isValid = false;
    }
  
    if (!formData.chargingType?.trim()) {
      errors.chargingType = 'Charging Type is required';
      isValid = false;
    }
  
    if (!formData.supportedConnectors || formData.supportedConnectors.length === 0) {
      errors.supportedConnectors = 'At least one supported connector is required';
      isValid = false;
    }
  
    if (!formData.pricePerKWh || formData.pricePerKWh <= 0) {
      errors.pricePerKWh = 'Price per KWh must be greater than zero';
      isValid = false;
    }
  
    if (formData.flatRate !== undefined && formData.flatRate <= 0) {
      errors.flatRate = 'Flat Rate must be greater than zero';
      isValid = false;
    }
  
    if (formData.is24Hours === undefined) {
      errors.is24Hours = 'Please specify if open 24 hours';
      isValid = false;
    }
  
    if (!formData.status?.trim()) {
      errors.status = 'Status is required';
      isValid = false;
    }
  
  
    if (formData.allowBooking === undefined) {
      errors.allowBooking = 'Please specify if booking is allowed';
      isValid = false;
    }
  
    setFormErrors(errors);
    return { isValid, errors };
  };
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { isValid, errors } = validateForm();

if (!isValid) {
  const errorMessages = Object.values(errors).filter(Boolean).join(' | ');
  setMessage(errorMessages);

  console.log("Validation failed:", errors);
  return;
}
   
    
    try {
      const response = await api.post("/admin/roles/createBunk", formData);
      console.log(response);

      if (response.data.success) {
        setShowSuccessMessage(true);
        // Reset form after 3 seconds
        setTimeout(() => {
          setFormData({
            name: '',
            address: '',
            city: '',
            contactNo: '',
            mapEmbed: '',
            totalPorts: 0,
            availablePorts: 0,
            chargingType: '',
            supportedConnectors: [],
            pricePerKWh: 0,
            flatRate: undefined,
            is24Hours: false,
            status: '',
            allowBooking: false,
            landmarks: []
          });
          setShowSuccessMessage(false);
        }, 3000);
      }
      
      setMessage(response.data.message);
    } catch (error) {
      console.error('Error submitting form:', error);
      setMessage("server error try later");
    } 
  };


  return (
    <div className={`adminEvBunkPage ${isLoaded ? 'adminEvBunkPage--loaded' : ''}`}>
      <div className="adminEvBunkPage__container">
        <div className="adminEvBunkPage__header">
          <h1 className="adminEvBunkPage__title">
            <span style={{color:"white"}} className="adminEvBunkPage__title-animation">Create EV Charging Station</span>
          </h1>
          <p style={{color:"white"}} className="adminEvBunkPage__subtitle">
            Add a new EV charging station to the network
          </p>
        </div>
        
        <div className="adminEvBunkPage__content">
          <div className="adminEvBunkPage__car-container">
            <div className="adminEvBunkPage__car">
              <div className="adminEvBunkPage__car-silhouette"></div>
             
            </div>
          </div>
          
          <div className="adminEvBunkPage__form-container">
            {showSuccessMessage ? (
              <div className="adminEvBunkPage__success-message">
                <div className="adminEvBunkPage__success-icon">
                <Lottie options={defaultOptions} height={100} width={100} />
                </div>
        
                <h3>Success!</h3>
                <p>The EV charging station has been created successfully.</p>
              </div>
            ) : (
              <form className="adminEvBunkPage__form" onSubmit={handleSubmit}>
              <div className="adminEvBunkPage__form-grid">
                
                  <img
                    style={{ width: "50px", height: "50px",  }}
                    src="/images/png-transparent-bmw-car-logo.png"
                    alt="logo"
                  />
               
                <h2>BMW</h2>
                <h6 style={{ color: "red" }}>{message}</h6>
                
                {/* Bunk Name */}
                <div className="adminEvBunkPage__form-group">
                  <label htmlFor="name" className="adminEvBunkPage__form-label">
                    Bunk Name <span className="adminEvBunkPage__required">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange} 
                    className={`adminEvBunkPage__form-input ${formErrors.name ? 'adminEvBunkPage__form-input--error' : ''}`}
                    placeholder="Enter charging station name (Enter Main Place name Eg:kochi)"
                  />
                  {formErrors.name && <div className="adminEvBunkPage__error-message">{formErrors.name}</div>}
                </div>
                
                {/* Address */}
                <div className="adminEvBunkPage__form-group">
                  <label htmlFor="address" className="adminEvBunkPage__form-label">
                    Address <span className="adminEvBunkPage__required">*</span>
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className={`adminEvBunkPage__form-input ${formErrors.address ? 'adminEvBunkPage__form-input--error' : ''}`}
                    placeholder="Enter full address"
                  />
                  {formErrors.address && <div className="adminEvBunkPage__error-message">{formErrors.address}</div>}
                </div>
                
                {/* City */}
                <div className="adminEvBunkPage__form-group">
                  <label htmlFor="city" className="adminEvBunkPage__form-label">
                    City <span className="adminEvBunkPage__required">*</span>
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className={`adminEvBunkPage__form-input ${formErrors.city ? 'adminEvBunkPage__form-input--error' : ''}`}
                    placeholder="Enter city, state, zip code"
                  />
                  {formErrors.city && <div className="adminEvBunkPage__error-message">{formErrors.city}</div>}
                </div>
                
                {/* Contact Number */}
                <div className="adminEvBunkPage__form-group">
                  <label htmlFor="contactNo" className="adminEvBunkPage__form-label">
                    Contact Number <span className="adminEvBunkPage__required">*</span>
                  </label>
                  <input
                    type="text"
                    id="contactNo"
                    name="contactNo"
                    value={formData.contactNo}
                    onChange={handleInputChange}
                    className={`adminEvBunkPage__form-input ${formErrors.contactNo ? 'adminEvBunkPage__form-input--error' : ''}`}
                    placeholder="Enter contact number"
                  />
                  {formErrors.contactNo && <div className="adminEvBunkPage__error-message">{formErrors.contactNo}</div>}
                </div>
            
                {/* Google Map Embed URL */}
                <div className="adminEvBunkPage__form-group adminEvBunkPage__form-group--full">
                  <label htmlFor="mapEmbed" className="adminEvBunkPage__form-label">
                    Google Map Embed URL <span className="adminEvBunkPage__required">*</span>
                  </label>
                  <input
                    type="text"
                    id="mapEmbed"
                    name="mapEmbed"
                    value={formData.mapEmbed}
                    onChange={handleInputChange}
                    className={`adminEvBunkPage__form-input ${formErrors.mapEmbed ? 'adminEvBunkPage__form-input--error' : ''}`}
                    placeholder="Enter Google Maps embed URL"
                  />
                  {formErrors.mapEmbed && <div className="adminEvBunkPage__error-message">{formErrors.mapEmbed}</div>}
                  <div className="adminEvBunkPage__map-help">
                    <small>Tip: Go to Google Maps, search for the location, click "Share", then "Embed a map" and copy the src URL from the iframe code.</small>
                  </div>
                </div>
            
                {/* Total Ports */}
                <div className="adminEvBunkPage__form-group">
                  <label htmlFor="totalPorts" className="adminEvBunkPage__form-label">
                    Total Ports <span className="adminEvBunkPage__required">*</span>
                  </label>
                  <input
                    type="number"
                    id="totalPorts"
                    name="totalPorts"
                    value={formData.totalPorts}
                    onChange={handleInputChange}
                    className={`adminEvBunkPage__form-input ${formErrors.totalPorts ? 'adminEvBunkPage__form-input--error' : ''}`}
                    placeholder="Enter total number of ports"
                  />
                  {formErrors.totalPorts && <div className="adminEvBunkPage__error-message">{formErrors.totalPorts}</div>}
                </div>
            
                {/* Available Ports */}
                <div className="adminEvBunkPage__form-group">
                  <label htmlFor="availablePorts" className="adminEvBunkPage__form-label">
                    Available Ports <span className="adminEvBunkPage__required">*</span>
                  </label>
                  <input
                    type="number"
                    id="availablePorts"
                    name="availablePorts"
                    value={formData.availablePorts}
                    onChange={handleInputChange}
                    className={`adminEvBunkPage__form-input ${formErrors.availablePorts ? 'adminEvBunkPage__form-input--error' : ''}`}
                    placeholder="Enter available number of ports"
                  />
                  {formErrors.availablePorts && <div className="adminEvBunkPage__error-message">{formErrors.availablePorts}</div>}
                </div>
            
                {/* Charging Type */}
<div className="adminEvBunkPage__form-group">
  <label htmlFor="chargingType" className="adminEvBunkPage__form-label">
    Charging Type <span className="adminEvBunkPage__required">*</span>
  </label>
  <select
    id="chargingType"
    name="chargingType"
    value={formData.chargingType}
    onChange={handleInputChange}
    className={`adminEvBunkPage__form-input ${formErrors.chargingType ? 'adminEvBunkPage__form-input--error' : ''}`}
  >
    <option value="">Select charging type</option>
    <option value="AC">AC</option>
    <option value="DC">DC</option>
  </select>
  {formErrors.chargingType && (
    <div className="adminEvBunkPage__error-message">{formErrors.chargingType}</div>
  )}
</div>

            
                {/* Supported Connectors */}
                <div className="adminEvBunkPage__form-group">
                  <label htmlFor="supportedConnectors" className="adminEvBunkPage__form-label">
                    Supported Connectors <span className="adminEvBunkPage__required">*</span>
                  </label>
                  <input
                    type="text"
                    id="supportedConnectors"
                    name="supportedConnectors"
                    value={formData.supportedConnectors?.join(', ') || ''}
                    onChange={handleInputChange}
                    className={`adminEvBunkPage__form-input ${formErrors.supportedConnectors ? 'adminEvBunkPage__form-input--error' : ''}`}
                    placeholder="Enter supported connectors (comma separated)"
                  />
                  {formErrors.supportedConnectors && <div className="adminEvBunkPage__error-message">{formErrors.supportedConnectors}</div>}
                </div>
            
                {/* Price per KWh */}
                <div className="adminEvBunkPage__form-group">
                  <label htmlFor="pricePerKWh" className="adminEvBunkPage__form-label">
                    Price per KWh <span className="adminEvBunkPage__required">*</span>
                  </label>
                  <input
                    type="number"
                    id="pricePerKWh"
                    name="pricePerKWh"
                    value={formData.pricePerKWh}
                    onChange={handleInputChange}
                    className={`adminEvBunkPage__form-input ${formErrors.pricePerKWh ? 'adminEvBunkPage__form-input--error' : ''}`}
                    placeholder="Enter price per KWh"
                  />
                  {formErrors.pricePerKWh && <div className="adminEvBunkPage__error-message">{formErrors.pricePerKWh}</div>}
                </div>
            
                {/* Flat Rate */}
                <div className="adminEvBunkPage__form-group">
                  <label htmlFor="flatRate" className="adminEvBunkPage__form-label">
                    Flat Rate (Optional)
                  </label>
                  <input
                    type="number"
                    id="flatRate"
                    name="flatRate"
                    value={formData.flatRate || ''}
                    onChange={handleInputChange}
                    className={`adminEvBunkPage__form-input ${formErrors.flatRate ? 'adminEvBunkPage__form-input--error' : ''}`}
                    placeholder="Enter flat rate (optional)"
                  />
                  {formErrors.flatRate && <div className="adminEvBunkPage__error-message">{formErrors.flatRate}</div>}
                </div>
            
                {/* 24-Hour Availability */}
                <div className="adminEvBunkPage__form-group">
                  <label htmlFor="is24Hours" className="adminEvBunkPage__form-label">
                    24 Hours Availability <span className="adminEvBunkPage__required">*</span>
                  </label>
                  <input
                    type="checkbox"
                    id="is24Hours"
                    name="is24Hours"
                    checked={formData.is24Hours}
                    onChange={handleCheckboxChange}
                    className={`adminEvBunkPage__form-input ${formErrors.is24Hours ? 'adminEvBunkPage__form-input--error' : ''}`}
                  />
                  {formErrors.is24Hours && <div className="adminEvBunkPage__error-message">{formErrors.is24Hours}</div>}
                </div>
            
                {/* Status */}
                <div className="adminEvBunkPage__form-group">
                  <label htmlFor="status" className="adminEvBunkPage__form-label">
                    Status <span className="adminEvBunkPage__required">*</span>
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className={`adminEvBunkPage__form-input ${formErrors.status ? 'adminEvBunkPage__form-input--error' : ''}`}
                  >
                    <option value="">Select Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                  {formErrors.status && <div className="adminEvBunkPage__error-message">{formErrors.status}</div>}
                </div>
            
                {/* Allow Booking */}
                <div className="adminEvBunkPage__form-group">
                  <label htmlFor="allowBooking" className="adminEvBunkPage__form-label">
                    Allow Booking <span className="adminEvBunkPage__required">*</span>
                  </label>
                  <input
                    type="checkbox"
                    id="allowBooking"
                    name="allowBooking"
                    checked={formData.allowBooking}
                    onChange={handleCheckboxChange}
                    className={`adminEvBunkPage__form-input ${formErrors.allowBooking ? 'adminEvBunkPage__form-input--error' : ''}`}
                  />
                  {formErrors.allowBooking && <div className="adminEvBunkPage__error-message">{formErrors.allowBooking}</div>}
                </div>
            
                {/* Landmarks */}
                <div className="adminEvBunkPage__form-group">
                  <label htmlFor="landmarks" className="adminEvBunkPage__form-label">
                    Landmarks (Optional)
                  </label>
                  <input
                  style={{color:"black",backgroundColor:"white"}}
                    type="text"
                    id="landmarks"
                    name="landmarks"
                    value={formData.landmarks?.join(', ') || ''}
                    onChange={handleInputChange}
                    className="adminEvBunkPage__form-input"
                    placeholder="Enter nearby landmarks (comma separated)"
                  />
                </div>

          
            
                {/* Submit Button */}
                <div  className="adminEvBunkPage__form-group adminEvBunkPage__form-group--full">
                  <button style={{color:"white",backgroundColor:"gray",marginBottom:"15px"}}>Reset form</button>
                  <button style={{color:"white"}} type="submit" className="adminEvBunkPage__form-submit-button">
                    Submit
                  </button>
                </div>
              </div>
            </form>
            
            )}
          </div>
        </div>
      </div>
      
      <div className="adminEvBunkPage__footer">
        <p className="adminEvBunkPage__copyright">
          © {new Date().getFullYear()} EV Admin Dashboard. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default AdminEvBunkPage;