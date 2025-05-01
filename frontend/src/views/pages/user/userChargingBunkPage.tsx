import React, { useState, useEffect } from "react";
import { Player } from "@lottiefiles/react-lottie-player";
import fastChargingAnim from "../../../assets/animations/Animation - 1745558547996-adminSideLogo.json";
import "../../../assets/css/user/userChargingBunk.css";
import { useLocation } from "react-router-dom";
import api from "../../../services/axiosInstance";

export interface BookingFormData {
  slotTime: string;
  bookingDate: string;
  vehicleNumber: string;
  connectorType: string;
  chargingType: "AC" | "DC";
  status: "Booked" | "Cancelled" | "Completed";
  price: number | string;
}

interface BunkInfo {
  _id: any;
  name: string;
  address: string;
  city: string;
  contactNo: string;
  mapEmbed: string;
  totalPorts: number;
  availablePorts: number;
  chargingType: string;
  supportedConnectors: string[];
  pricePerKWh: number;
  flatRate: number;
  is24Hours: boolean;
  status: string;
  allowBooking: boolean;
  landmarks: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

const UserChargingBunkPage: React.FC = () => {
  const { state } = useLocation();
  const bunk = state?.bunk;
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState("info");
  const [bunkInfo, setBunkInfo] = useState<BunkInfo | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const userId = localStorage.getItem("userId");
  const [message, setMessage] = useState<string>("");

  const [formData, setFormData] = useState<BookingFormData>({
    slotTime: "",
    bookingDate: "",
    vehicleNumber: "",
    connectorType: "",
    chargingType: "AC",
    status: "Booked",
    price: "",
  });

  useEffect(() => {
    if (bunk) {
      setBunkInfo({
        _id: bunk._id,
        name: bunk.name,
        address: bunk.address,
        city: bunk.city,
        contactNo: bunk.contactNo,
        mapEmbed: bunk.mapEmbed,
        totalPorts: bunk.totalPorts,
        availablePorts: bunk.availablePorts,
        chargingType: bunk.chargingType,
        supportedConnectors: bunk.supportedConnectors,
        pricePerKWh: bunk.pricePerKWh,
        flatRate: bunk.flatRate,
        is24Hours: bunk.is24Hours,
        status: bunk.status,
        allowBooking: bunk.allowBooking,
        landmarks: bunk.landmarks,
        createdAt: new Date(bunk.createdAt),
        updatedAt: new Date(bunk.updatedAt),
      });
    }

    setTimeout(() => {
      setIsLoaded(true);
    }, 300);
  }, [bunk]);

  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => {
      setMessage("");
    }, 3000);
    return clearInterval(timer);
  }, [message]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" ? parseFloat(value) : value,
    }));
  };

  const validateForm = () => {
    const {
      slotTime,
      bookingDate,
      vehicleNumber,
      connectorType,
      chargingType,
      status,
      price,
    } = formData;

    if (!slotTime.trim()) {
      setMessage("Please enter a valid slot time.");
      return false;
    }

    if (!bookingDate.trim()) {
      setMessage("Please select a booking date.");
      return false;
    }

    if (!vehicleNumber.trim()) {
      setMessage("Please enter your vehicle number.");
      return false;
    }

    if (!connectorType.trim()) {
      setMessage("Please enter connector type.");
      return false;
    }

    if (!chargingType || (chargingType !== "AC" && chargingType !== "DC")) {
      setMessage("Please select a valid charging type.");
      return false;
    }

    if (!status || !["Booked", "Cancelled", "Completed"].includes(status)) {
      setMessage("Please select a valid status.");
      return false;
    }

    if (price === "" || isNaN(Number(price)) || Number(price) <= 0) {
      setMessage("Please enter a valid price greater than 0.");
      return false;
    }

    return true;
  };

  const handleSubmit =async (e: any) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
console.log("slotTime",formData.slotTime);

      const response = await api.post(`/user/bookBunk?userId=${userId}&bunkId=${bunkInfo?._id}`, formData);
   if(response.data.success){
    setIsModalOpen(false)
    setFormData({
      slotTime: "",
    bookingDate: "",
    vehicleNumber: "",
    connectorType: "",
    chargingType: "AC",
    status: "Booked",
    price: "",
    })
   return setSuccessModal(true)
   }
   return setMessage(response.data.message)

    } catch (error) {
      console.log('error in booking bunk in userChargingBunkPage',error); 
      setMessage('server error try later')
    }
  };

  useEffect(() => {
    if (!successModal) return;
  
    const timer = setTimeout(() => {
      setSuccessModal(false);
    }, 3500); 
  
    return () => clearTimeout(timer);
  }, [successModal]);
  

  return (
    <>
      <div
        className={`adminEvBunkPage ${
          isLoaded ? "adminEvBunkPage--loaded" : ""
        }`}
      >
        <div className="adminEvBunkPage__container">
          <div className="adminEvBunkPage__header">
            <h1 className="adminEvBunkPage__title">
              <span
                style={{ color: "white" }}
                className="adminEvBunkPage__title-animation"
              >
                {bunkInfo?.name}
              </span>
            </h1>
            <div className="adminEvBunkPage__tabs">
              <button
                className={`adminEvBunkPage__tab ${
                  activeTab === "info" ? "active" : ""
                }`}
                onClick={() => setActiveTab("info")}
              >
                Information
              </button>
              <button
                className={`adminEvBunkPage__tab ${
                  activeTab === "map" ? "active" : ""
                }`}
                onClick={() => setActiveTab("map")}
              >
                Location
              </button>
            </div>
          </div>

          <div className="adminEvBunkPage__content">
            <div className="adminEvBunkPage__car-container">
              <div className="adminEvBunkPage__car">
                {/* Placeholder for car image */}
                <div className="userEvBunkPage__car-silhouette">
                  <img src="/images/greySedan.webp" alt="Car" />
                </div>
                <div className="adminEvBunkPage__charge-animation"></div>
              </div>
            </div>

            <div
              className={`adminEvBunkPage__info-panel ${
                activeTab === "info" ? "active" : ""
              }`}
            >
              <div className="adminEvBunkPage__info-card">
                <div className="adminEvBunkPage__info-item">
                  <span className="adminEvBunkPage__info-label">Address</span>
                  <span className="adminEvBunkPage__info-value">
                    {bunkInfo?.address}
                  </span>
                </div>
                <div className="adminEvBunkPage__info-item">
                  <span className="adminEvBunkPage__info-label">City</span>
                  <span className="adminEvBunkPage__info-value">
                    {bunkInfo?.city}
                  </span>
                </div>
                <div className="adminEvBunkPage__info-item">
                  <span className="adminEvBunkPage__info-label">Contact</span>
                  <span className="adminEvBunkPage__info-value">
                    {bunkInfo?.contactNo}
                  </span>
                </div>
                <div className="adminEvBunkPage__info-item">
                  <span className="adminEvBunkPage__info-label">
                    Charging Type
                  </span>
                  <span className="adminEvBunkPage__info-value">
                    {bunkInfo?.chargingType}
                  </span>
                </div>
                <div className="adminEvBunkPage__info-item">
                  <span className="adminEvBunkPage__info-label">
                    Connectors
                  </span>
                  <span className="adminEvBunkPage__info-value">
                    {bunkInfo?.supportedConnectors?.join(", ")}
                  </span>
                </div>
                <div className="adminEvBunkPage__info-item">
                  <span className="adminEvBunkPage__info-label">
                    Price per kWh
                  </span>
                  <span className="adminEvBunkPage__info-value">
                    ₹{bunkInfo?.pricePerKWh}
                  </span>
                </div>
                <div className="adminEvBunkPage__info-item">
                  <span className="adminEvBunkPage__info-label">Flat Rate</span>
                  <span className="adminEvBunkPage__info-value">
                    ₹{bunkInfo?.flatRate}
                  </span>
                </div>
                <div className="adminEvBunkPage__info-item">
                  <span className="adminEvBunkPage__info-label">
                    Available Ports
                  </span>
                  <span className="adminEvBunkPage__info-value">
                    {bunkInfo?.availablePorts}/{bunkInfo?.totalPorts}
                  </span>
                </div>
                <div className="adminEvBunkPage__info-item">
                  <span className="adminEvBunkPage__info-label">
                    24/7 Available
                  </span>
                  <span className="adminEvBunkPage__info-value">
                    {bunkInfo?.is24Hours ? "Yes" : "No"}
                  </span>
                </div>
                <div className="adminEvBunkPage__info-item">
                  <span className="adminEvBunkPage__info-label">Status</span>
                  <span className="adminEvBunkPage__info-value">
                    {bunkInfo?.status}
                  </span>
                </div>
                <div className="adminEvBunkPage__info-item">
                  <span className="adminEvBunkPage__info-label">
                    Booking Allowed
                  </span>
                  <span className="adminEvBunkPage__info-value">
                    {bunkInfo?.allowBooking ? "Yes" : "No"}
                  </span>
                </div>

                <div className="adminEvBunkPage__cta-container">
                  <button
                    onClick={() => setIsModalOpen(true)}
                    style={{ color: "black" }}
                    className="adminEvBunkPage__cta-button"
                  >
                    Book a Charge
                  </button>
                  <button
                    style={{ color: "black" }}
                    className="adminEvBunkPage__cta-button adminEvBunkPage__cta-button--secondary"
                  >
                    View Availability
                  </button>
                </div>
              </div>

              <div className="adminEvBunkPage__features">
                <h3 className="adminEvBunkPage__features-title">
                  Available Services
                </h3>

                <div className="adminEvBunkPage__features-grid">
                  <div className="adminEvBunkPage__feature">
                    <div className="adminEvBunkPage__feature-icon adminEvBunkPage__feature-icon--wifi"></div>
                    <span className="adminEvBunkPage__feature-label">
                      Free WiFi
                    </span>
                  </div>

                  <div className="adminEvBunkPage__feature">
                    <div className="adminEvBunkPage__feature-icon adminEvBunkPage__feature-icon--cafe"></div>
                    <span className="adminEvBunkPage__feature-label">Café</span>
                  </div>

                  <div className="adminEvBunkPage__feature">
                    <div className="adminEvBunkPage__feature-icon adminEvBunkPage__feature-icon--24h"></div>
                    <span className="adminEvBunkPage__feature-label">
                      24/7 Service
                    </span>
                  </div>

                  <div className="adminEvBunkPage__feature">
                    <div className="adminEvBunkPage__feature-icon adminEvBunkPage__feature-icon--fast"></div>
                    <span className="adminEvBunkPage__feature-label">
                      Fast Charging
                    </span>
                  </div>
                </div>

                {/* Full-width animation placed outside the grid */}
                <div className="adminEvBunkPage__animation-wrapper">
                  <Player
                    autoplay
                    loop
                    src={fastChargingAnim}
                    style={{ width: "100%", height: "900px" }}
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: "1rem",
                    justifyContent: "center",
                  }}
                >
                  <h1>BMW</h1>
                  <img
                    style={{
                      width: "70px",
                      height: "70px",
                      borderRadius: "120px",
                    }}
                    src="\images\png-transparent-bmw-car-logo.png"
                    alt="logo"
                  />
                </div>
              </div>
            </div>

            <div
              className={`adminEvBunkPage__map-panel ${
                activeTab === "map" ? "active" : ""
              }`}
            >
              <div className="adminEvBunkPage__map-wrapper">
                <iframe
                  src={bunkInfo?.mapEmbed}
                  className="adminEvBunkPage__map"
                  title="EV Bunk Location"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
              <div className="adminEvBunkPage__directions">
                <h3 className="adminEvBunkPage__directions-title">
                  Feel Free TO Contact Us
                </h3>
                <p
                  style={{ fontSize: "1.5rem" }}
                  className="adminEvBunkPage__directions-text"
                >
                  <strong style={{ color: "#bb0000" }}>
                    Phone +91-7012143978
                  </strong>
                </p>
                <p>If you have any quires please contact to this number</p>
                <div className="adminEvBunkPage__hours">
                  <h4 className="adminEvBunkPage__hours-title">
                    Hours of Operation
                  </h4>
                  <p className="adminEvBunkPage__hours-text">
                    Open 24 hours, 7 days a week
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="adminEvBunkPage__footer">
          <p className="adminEvBunkPage__copyright" style={{ color: "white" }}>
            © {new Date().getFullYear()} ElectroCharge Network. All rights
            reserved.
          </p>
          <div className="adminEvBunkPage__footer-links">
            <a href="#" className="adminEvBunkPage__footer-link">
              Privacy Policy
            </a>
            <a href="#" className="adminEvBunkPage__footer-link">
              Terms of Service
            </a>
            <a href="#" className="adminEvBunkPage__footer-link">
              Support
            </a>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="bookingModal-overlay">
          <div className="bookingModal-container">
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <img
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "120px",
                }}
                src="/images/png-transparent-bmw-car-logo.png"
                alt="logo"
              />
            </div>
            <h2 className="bookingModal-title">Book Charging Slot</h2>
            <p style={{color:"red"}}>{message}</p>
            <form onSubmit={handleSubmit} className="bookingModal-form">
              <input
                type="text"
                name="slotTime"
                placeholder="Slot Time (e.g., 10:30 AM - 11:30 AM)"
                value={formData.slotTime}
                onChange={handleChange}
                required
              />
              <input
                type="date"
                name="bookingDate"
                value={formData.bookingDate}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="vehicleNumber"
                placeholder="Vehicle Number"
                value={formData.vehicleNumber}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="connectorType"
                placeholder="Connector Type (e.g., CCS, Type-2)"
                value={formData.connectorType}
                onChange={handleChange}
                required
              />
              <select
                name="chargingType"
                value={formData.chargingType}
                onChange={handleChange}
                required
              >
                <option value={bunkInfo?.chargingType}>{bunkInfo?.chargingType}</option>
               
              </select>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
              >
                <option value="Booked">Booked</option>
                <option value="Cancelled">Cancelled</option>
                <option value="Completed">Completed</option>
              </select>
              <input
                type="number"
                name="price"
                placeholder="Price"
                value={formData.price}
                onChange={handleChange}
                required
              />
              <div className="bookingModal-buttons">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="cancel-button"
                >
                  Cancel
                </button>
                <button type="submit" className="confirm-button">
                  Confirm Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {successModal&&(
        <div className="BookingSuccessUserModalOverlay">
        <div className="BookingSuccessUserModalContent">
         
          <div className="BookingSuccessUserModalHeader">
            <div className="BookingSuccessUserVideoSpace">
              {/* You can add your video here */}
              <video className="BookingSuccessUserVideo" autoPlay muted loop>
                <source src="\videos\bmw-animated-icon-SuccessMessage.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
          <div className="BookingSuccessUserMessage">
            <h2>Booking Successful</h2>
            <p style={{color:"green"}}>Your booking has been successfully completed!</p>
          </div>
        </div>
      </div>
      )}
    </>
  );
};

export default UserChargingBunkPage;