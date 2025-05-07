import React, { useEffect, useState, useRef } from "react";
import lottie from "lottie-web";
import "../../../assets/css/user/BunkListStyles.css";
import api from "../../../services/axiosInstance";
import lottieAnimtion from "../../../assets/animations/Animation - 1745388982332.json";
import { useNavigate } from "react-router-dom";
import UserNav from "../../partials/user/UserNav";

interface Bunk {
  _id: string;
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
  longitude: number;
  latitude: number;
  is24Hours: boolean;
  status: string;
  allowBooking: boolean;
  landmarks: string[];
}

const haversineDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
};

const BunkListPage: React.FC = () => {
  const [bunks, setBunks] = useState<Bunk[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const loadingLottieRef = useRef<HTMLDivElement>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lon: number;
  } | null>(null);
  const [nearest, setNearest] = useState<Bunk | null>(null);
  const [FindNearestBunkModal, setFindNearestBunkModal] =
    useState<boolean>(false);
  const navigate = useNavigate();
  const itemsPerPage = 4;

  useEffect(() => {
    if (loadingLottieRef.current) {
      const anim = lottie.loadAnimation({
        container: loadingLottieRef.current,
        renderer: "svg",
        loop: true,
        autoplay: true,
        animationData: lottieAnimtion,
      });

      return () => anim.destroy();
    }
  }, []);

  useEffect(() => {
    const fetchBunks = async () => {
      try {
        setLoading(true);
        const response = await api.get("/user/getBunkList");
        if (response.data.success) {
          setBunks(response.data.bunks);
          setTotalPages(Math.ceil(response.data.bunks.length / itemsPerPage));
          setError(null);
        }
        setError(response.data.message);
      } catch (err) {
        setError("Error fetching bunks. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBunks();
  }, [currentPage]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
      },
      (error) => {
        console.error("Error getting location", error);
        alert("Please turn on the location to find the nearest bunk.");
      }
    );
  }, []);

  useEffect(() => {
    if (userLocation && bunks.length > 0) {
      const sorted = [...bunks].sort((a, b) => {
        const distA = haversineDistance(
          userLocation.lat,
          userLocation.lon,
          a.latitude,
          a.longitude
        );
        const distB = haversineDistance(
          userLocation.lat,
          userLocation.lon,
          b.latitude,
          b.longitude
        );
        return distA - distB;
      });
      setNearest(sorted[0]);
    }
  }, [userLocation, bunks]);

  const filteredBunks = bunks.filter((bunk) =>
    `${bunk.name} ${bunk.city} ${bunk.address}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );
  const paginatedBunks = filteredBunks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  useEffect(() => {
    const total = Math.ceil(
      bunks.filter((bunk) =>
        `${bunk.name} ${bunk.city} ${bunk.address}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      ).length / itemsPerPage
    );
    setTotalPages(total || 1);
  }, [searchTerm, bunks]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const renderPagination = () => {
    const pages = [];
    const maxPagesToShow = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    pages.push(
      <button
        key="prev"
        className="pagination-button"
        disabled={currentPage === 1}
        onClick={() => handlePageChange(currentPage - 1)}
      >
        &laquo;
      </button>
    );

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          className={`pagination-button ${currentPage === i ? "active" : ""}`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    }

    pages.push(
      <button
        key="next"
        className="pagination-button"
        disabled={currentPage === totalPages}
        onClick={() => handlePageChange(currentPage + 1)}
      >
        &raquo;
      </button>
    );

    return <div className="pagination-container">{pages}</div>;
  };

  return (
    <>
    <UserNav/>
      <div className="bunk-list-page">
        <header className="page-header">
          <div className="header-content">
            <div className="text-content">
              <h1>Available Bunks</h1>
              <p>Find and book your perfect bunk accommodation</p>
            </div>
            <img src="/images/png-transparent-bmw-car-logo.png" alt="logo" />
            <div className="search-container">
              <input
                type="text"
                placeholder="Search by name, city, or address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />

              <button
                className="findNearestBunk__openButton"
                onClick={() => setFindNearestBunkModal(true)}
              >
                Find Nearest EV Bunk
              </button>
            </div>
          </div>
        </header>

        <div className="content-container">
          <main className="bunk-list-container">
            {loading ? (
              <div className="loading-container">
                <div className="lottie-animation" ref={loadingLottieRef}></div>
                <p>Loading bunks...</p>
              </div>
            ) : error ? (
              <div className="error-message">
                <p>{error}</p>
                <button onClick={() => setCurrentPage(1)}>Try Again</button>
              </div>
            ) : bunks.length === 0 ? (
              <div className="no-bunks-message">
                <p>No bunks available at the moment.</p>
              </div>
            ) : (
              <div className="bunk-grid">
                {paginatedBunks.map((bunk) => (
                  <div key={bunk._id} className="bunk-card">
                    <div className="bunk-details">
                      <h2>{bunk.name}</h2>
                      <p style={{ color: "black" }} className="bunk-location">
                        {bunk.address}, {bunk.city}
                      </p>
                      <p style={{ color: "black" }} className="bunk-capacity">
                        Capacity: {bunk.totalPorts - bunk.availablePorts} /{" "}
                        {bunk.totalPorts} ports available
                      </p>
                      <p
                        style={{ color: "black" }}
                        className="bunk-charging-type"
                      >
                        Charging Type: {bunk.chargingType}
                      </p>
                      <p style={{ color: "black" }} className="bunk-price">
                        Price: {bunk.pricePerKWh} / kWh (Flat rate:{" "}
                        {bunk.flatRate})
                      </p>
                      <div className="bunk-status">
                        <span
                          className={`status-indicator ${
                            bunk.allowBooking ? "available" : "unavailable"
                          }`}
                        ></span>
                        <span>
                          {bunk.allowBooking ? "Available" : "Unavailable"}
                        </span>
                      </div>
                      <button
                        className={`bunk-action-button ${
                          !bunk.allowBooking ? "disabled" : ""
                        }`}
                        disabled={!bunk.allowBooking}
                        onClick={() => {
                          if (bunk.allowBooking) {
                            navigate(`/user/EvBunkPage`, {
                              state: { bunk: bunk },
                            });
                          }
                        }}
                      >
                        {bunk.allowBooking ? "Book Now" : "Unavailable"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!loading && !error && bunks.length > 0 && renderPagination()}
          </main>

          <aside className="side-animation">
            <div className="lottie-container" ref={loadingLottieRef}></div>
            <div className="info-box">
              <h3>Need Help?</h3>
              <p style={{ color: "black" }}>
                Contact our support team for assistance with booking.
              </p>
              <button className="contact-button">Contact Support</button>
            </div>
          </aside>
        </div>
      </div>

      {FindNearestBunkModal && (
        <div className="findNearestBunk__modalOverlay">
          <div className="findNearestBunk__container">
            <div style={{ position: "absolute" }}>
              <button
                className="bunk-close-button"
                onClick={() => setFindNearestBunkModal(false)}
              >
                Close
              </button>
            </div>
            <h2 className="findNearestBunk__title">Nearest EV Bunk</h2>

            {nearest ? (
              <div className="findNearestBunk__card">
                <h3>{nearest.name}</h3>
                <p>
                  {nearest.address}, {nearest.city}
                </p>
                <p>
                  Latitude: {nearest.latitude}, Longitude: {nearest.longitude}
                </p>
                <p>
                  Distance:{" "}
                  {userLocation && nearest
                    ? haversineDistance(
                        userLocation.lat,
                        userLocation.lon,
                        nearest.latitude,
                        nearest.longitude
                      ).toFixed(2) + " km"
                    : "N/A"}
                </p>
                <button
                  className="bunk-action-button"
                  onClick={() => {
                    navigate("/user/EvBunkPage", { state: { bunk: nearest } });
                  }}
                >
                  Book This Bunk
                </button>
              </div>
            ) : (
              <p>Finding nearest bunk...</p>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default BunkListPage;
