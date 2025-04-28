import React, { useState, useEffect } from 'react';
import '../../../assets/css/admin/adminEvBunk.css'
import Lottie from "react-lottie";
import animationData from "../../../assets/animations/Animation - 1745829370634-successAnimtion.json";
import api from '../../../services/axiosInstance';
import { Options } from 'react-lottie';

interface FormData {
  name: string;
  address: string;
  city: string;
  contactNo: string;
  mapEmbed: string;
}

const AdminEvBunkPage: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [message,setMessage]=useState<string>("")
  const [formData, setFormData] = useState<FormData>({
    name: '',
    address: '',
    city: '',
    contactNo: '',
    mapEmbed: ''
  });

  const [formErrors, setFormErrors] = useState<Partial<FormData>>({});
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const defaultOptions:Options = {
    loop: true,
    autoplay: true, // Animation plays automatically
    animationData: animationData, // The Lottie JSON animation data
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  
  useEffect(()=>{
    const timer=setTimeout(()=>{
setMessage("")
    },3000)
    return ()=>clearInterval(timer)
  },[message])


  useEffect(() => {
    // Animation effect on page load
    setTimeout(() => {
      setIsLoaded(true);
    }, 300);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error for this field when user types
    if (formErrors[name as keyof FormData]) {
      setFormErrors({
        ...formErrors,
        [name]: undefined
      });
    }
  };


  const validateForm = (): boolean => {
    const errors: Partial<FormData> = {};
    let isValid = true;

    if (!formData.name.trim()) {
      errors.name = 'Bunk Name is required';
      isValid = false;
    }

    if (!formData.address.trim()) {
      errors.address = 'Address is required';
      isValid = false;
    }

    if (!formData.city.trim()) {
      errors.city = 'City is required';
      isValid = false;
    }

    if (!formData.contactNo.trim()) {
      errors.contactNo = 'Contact Number is required';
      isValid = false;
    } else if (!/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/im.test(formData.contactNo)) {
      errors.contactNo = 'Please enter a valid contact number';
      isValid = false;
    }

    if (!formData.mapEmbed.trim()) {
      errors.mapEmbed = 'Google Map Embed URL is required';
      isValid = false;
    } else if (!formData.mapEmbed.includes('google.com/maps/embed')) {
      errors.mapEmbed = 'Please enter a valid Google Maps embed URL';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
    
    if (!validateForm()) {
        console.log('form not validated');
        
      return;
    }
    
    try {
  const response=await api.post("/admin/roles/createBunk",formData)
console.log(response);

  if(response.data.success){

    setShowSuccessMessage(true);
     // Reset form after 3 seconds
     setTimeout(() => {
        setFormData({
          name: '',
          address: '',
          city: '',
          contactNo: '',
          mapEmbed: ''
        });
        setShowSuccessMessage(false);
      }, 3000);
  }
      
  return  setMessage(response.data.message)
      
    } catch (error) {
      console.error('Error submitting form:', error);
      setMessage("server error try later")
    } 
  };


  return (
    <div className={`adminEvBunkPage ${isLoaded ? 'adminEvBunkPage--loaded' : ''}`}>
      <div className="adminEvBunkPage__container">
        <div className="adminEvBunkPage__header">
          <h1 className="adminEvBunkPage__title">
            <span style={{color:"white"}} className="adminEvBunkPage__title-animation">Create EV Charging Station</span>
          </h1>
          <p  style={{color:"white"}} className="adminEvBunkPage__subtitle">
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
                    <div >
                    <img style={{width:"50px",height:"50px",gap:"0rem"}} src="\images\png-transparent-bmw-car-logo.png" alt="" />
                    </div>
                    <h2 >BMW</h2>
                    <h6 style={{color:"red"}}>{message}</h6>
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
                      placeholder="Enter charging station name"
                    />
                    {formErrors.name && <div className="adminEvBunkPage__error-message">{formErrors.name}</div>}
                  </div>
                  
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
                </div>
                
                
                
                <div className="adminEvBunkPage__form-actions">
                  <button 
                    type="button" 
                    className="adminEvBunkPage__button adminEvBunkPage__button--secondary"
                    onClick={() => {
                      setFormData({
                        name: '',
                        address: '',
                        city: '',
                        contactNo: '',
                        mapEmbed: ''
                      });
                      setFormErrors({});
                    }}
                  >
                    Reset
                  </button>
                  <button 
                  style={{color:"white",backgroundColor:"black"}}
                    type="submit" 
                    className="adminEvBunkPage__button adminEvBunkPage__button--primary"
                  
                  >
                   Create Bunk
                  </button>
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