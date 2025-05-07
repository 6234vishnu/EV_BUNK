import React, { useEffect, useState } from "react";
import "../../../assets/css/user/proile.css";
import UserNav from "../../partials/user/UserNav";
import api from "../../../services/axiosInstance";
import { useNavigate } from "react-router-dom";

interface bookingInfo {
  _id: Object | any;
  bookingDate: Date;
  status: string;
  vehicleNumber: string;
  price: Number | any;
  slotTime: string;
  connectorType: string;
  chargingType: string;
}
const BOOKINGS_PER_PAGE = 2;

const UserProfile: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [bookings, setBookings] = useState<bookingInfo | any>([]);
  const [message, setMessage] = useState<string>("");
  const [selectedBooking, setSelectedBooking] = useState<bookingInfo | null>(
    null
  );
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [cancelBookingId, setCancelBookingId] = useState<string | null>(null);
  const images = [
    "/images/cosySec (1).webp",
    "/images/cosySec (2).webp",
    "/images/cosySec (3).webp",
  ];
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);
  const navigate = useNavigate();

  useEffect(() => {
    if (showSuccessModal) {
      const timer = setTimeout(() => {
        setShowSuccessModal(false);
      }, 3500);

      return () => clearTimeout(timer);
    }
  }, [showSuccessModal]);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
      }, 3500);

      return () => clearTimeout(timer);
    }
  }, [message]);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      navigate("/login");
    }
  }, [navigate]);

  const userId = localStorage.getItem("userId");
  if (!userId) return null;
  useEffect(() => {
    const getBookings = async () => {
      try {
        const response = await api.get(
          `/user/getBookingHistory?userId=${userId}`
        );
        if (response.data.success) {
          setBookings(response.data.bookings);
        }
        setMessage(response.data.message);
      } catch (error) {
        setMessage("server error");
        console.log("error in get Booking profilePage", error);
      }
    };

    getBookings();
  }, []);

  const handleViewDetails = (booking: bookingInfo) => {
    console.log("selected bk", booking);

    setSelectedBooking(booking);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedBooking(null);
  };

  const confirmCancelBooking = (bookingId: string) => {
    setCancelBookingId(bookingId);
    setShowConfirmModal(true);
  };

  const handleConfirmCancel = async () => {
    if (!cancelBookingId) return;
    try {
      const response = await api.patch(
        `/user/cancelBooking/${cancelBookingId}`
      );
      if (response.data.success) {
        setMessage("Booking Cancelled");
        setBookings((prev: bookingInfo[]) =>
          prev.map((b) =>
            b._id === cancelBookingId ? { ...b, status: "Cancelled" } : b
          )
        );
        setShowModal(false);
        setShowSuccessModal(true);
      }
      return setMessage(response.data.message);
    } catch (error) {
      setMessage("server error try later");
      console.log("error in  cancel booking", error);
    } finally {
      setShowConfirmModal(false);
      setCancelBookingId(null);
    }
  };

  const totalPages = Math.ceil(bookings.length / BOOKINGS_PER_PAGE);
  const startIdx = (currentPage - 1) * BOOKINGS_PER_PAGE;
  const currentBookings = bookings.slice(
    startIdx,
    startIdx + BOOKINGS_PER_PAGE
  );

  return (
    <>
      <UserNav />
      <div className="userProfileContainer">
        <div className="userProfileLeft">
          <img
            src={images[currentImageIndex]}
            alt={`slide-${currentImageIndex}`}
            className="userProfileSliderImg"
          />
          <p style={{ color: "white" }}>{message}</p>
        </div>

        <div className="userProfileRight">
          <div className="userProfileHeader">
            <div className="userProfileText">
              <h2 className="userProfileTitle">User Profile</h2>
              <div className="userProfileInfo">
                <p>
                  <strong>Name:</strong> John Doe
                </p>
                <p>
                  <strong>Email:</strong> john@example.com
                </p>
                <p>
                  <strong>Phone:</strong> +91 9876543210
                </p>
              </div>
            </div>

            <div className="userProfileLogoContainer">
              <img
                className="userProfileLogo"
                src="/images/png-transparent-bmw-car-logo.png"
                alt="logo"
              />
            </div>
          </div>

          <div className="userProfileButtons">
            <button className="userProfileBtn editBtn">Edit Profile</button>
            <button className="userProfileBtn bookingBtn">
              View Past Bookings
            </button>
          </div>
        </div>
      </div>

      <div className="userProfileBookings">
        {currentBookings.map((booking: any) => (
          <div className="bookingCard" key={booking._id}>
            <p>
              <strong>Date:</strong> {booking.bookingDate}
            </p>
            <p>
              <strong>Status:</strong> {booking.status}
            </p>
            <p>
              <strong>Vehicle:</strong> {booking.vehicleNumber}
            </p>
            <p>
              <strong>Price:</strong> ₹{booking.price}
            </p>
            <button
              className="viewDetailsBtn"
              onClick={() => handleViewDetails(booking)}
            >
              View Details
            </button>
          </div>
        ))}
      </div>

      <div className="paginationControls">
        <button
          className="paginationBtn"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="paginationText">
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="paginationBtn"
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>

      {showModal && selectedBooking && (
        <div className="bookingModalOverlay">
          <div className="bookingModal">
            <h2>Booking Details</h2>
            <p>
              <strong>Booking ID:</strong> {selectedBooking._id}
            </p>
            <p>
              <strong>Status:</strong> {selectedBooking.status}
            </p>
            <p>
              <strong>Booking Date:</strong>{" "}
              {new Date(selectedBooking.bookingDate).toLocaleDateString()}
            </p>
            <p>
              <strong>Vehicle Number:</strong> {selectedBooking.vehicleNumber}
            </p>
            <p>
              <strong>Connector Type:</strong> {selectedBooking.connectorType}
            </p>
            <p>
              <strong>Charging Type:</strong> {selectedBooking.chargingType}
            </p>
            <p>
              <strong>Slot Time:</strong> {selectedBooking.slotTime}
            </p>
            <p>
              <strong>Price:</strong> ₹{selectedBooking.price}
            </p>

            <div style={{ display: "flex", gap: "1rem" }}>
              {selectedBooking.status === "Booked" && (
                <button
                  className="bookingModalCancelBtn"
                  onClick={() => confirmCancelBooking(selectedBooking._id)}
                >
                  Cancel Booking
                </button>
              )}
              <button
                className="bookingModalCloseBtn"
                onClick={handleCloseModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {showConfirmModal && (
        <div className="confirmModalOverlay">
          <div className="confirmModal">
            <p>Are you sure you want to cancel this booking?</p>
            <div className="confirmModalBtns">
              <button
                className="confirmBtn yesBtn"
                onClick={handleConfirmCancel}
              >
                Yes
              </button>
              <button
                className="confirmBtn noBtn"
                onClick={() => setShowConfirmModal(false)}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {showSuccessModal && (
        <div className="successModalOverlay">
          <div className="successModal">
            <h2> Booking Cancelled!</h2>
            <p>Your booking has been successfully cancelled.</p>
            <button
              className="successModalBtn"
              onClick={() => setShowSuccessModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default UserProfile;
