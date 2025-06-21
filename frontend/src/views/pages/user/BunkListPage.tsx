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

interface BunkWithDistance extends Bunk {
  distance: number;
}
const haversineDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const R = 6371; // Earth's radius in kilometers

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const radLat1 = toRad(lat1);
  const radLat2 = toRad(lat2);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(radLat1) *
      Math.cos(radLat2) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return distance;
};

const BunkListPage: React.FC = () => {
  const [bunks, setBunks] = useState<Bunk[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const loadingLottieRef = useRef<HTMLDivElement>(null);
  const sideAnimationRef = useRef<HTMLDivElement>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lon: number;
  } | null>(null);
  const [nearest, setNearest] = useState<BunkWithDistance | null>(null);
  const [FindNearestBunkModal, setFindNearestBunkModal] =
    useState<boolean>(false);
  const [locationLoading, setLocationLoading] = useState<boolean>(false);
  const [sortedBunks, setSortedBunks] = useState<BunkWithDistance[]>([]);
  const navigate = useNavigate();
  const itemsPerPage = 4;

  // Initialize Lottie animations
  useEffect(() => {
    const initializeLottie = (ref: React.RefObject<HTMLDivElement>) => {
      if (ref.current) {
        const anim = lottie.loadAnimation({
          container: ref.current,
          renderer: "svg",
          loop: true,
          autoplay: true,
          animationData: lottieAnimtion,
        });
        return anim;
      }
      return null;
    };

    const loadingAnim = initializeLottie(loadingLottieRef as any);
    const sideAnim = initializeLottie(sideAnimationRef as any);

    return () => {
      loadingAnim?.destroy();
      sideAnim?.destroy();
    };
  }, []);

  // Fetch bunks from API
  useEffect(() => {
    const fetchBunks = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get("/user/getBunkList");

        if (response.data.success) {
          setBunks(response.data.bunks);
          setError(null);
        } else {
          setError(response.data.message || "Failed to fetch bunks");
        }
      } catch (err) {
        setError("Error fetching bunks. Please try again later.");
        console.error("Error fetching bunks:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBunks();
  }, []);

  // Get user location
  useEffect(() => {
    const getUserLocation = () => {
      setLocationLoading(true);

      if (!navigator.geolocation) {
        alert("Geolocation is not supported by this browser.");
        setLocationLoading(false);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          };
          setUserLocation(location);
          setLocationLoading(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          setLocationLoading(false);

          let errorMessage = "Unable to get your location. ";
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage +=
                "Please allow location access to find nearest bunks.";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage += "Location information is unavailable.";
              break;
            case error.TIMEOUT:
              errorMessage += "Location request timed out.";
              break;
            default:
              errorMessage += "An unknown error occurred.";
              break;
          }
          alert(errorMessage);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // 5 minutes
        }
      );
    };

    getUserLocation();
  }, []);

  // Calculate distances and sort bunks when location or bunks change
  useEffect(() => {
    if (userLocation && bunks.length > 0) {
      const bunksWithDistance: BunkWithDistance[] = bunks
        .filter((bunk) => {
          const isValid =
            bunk.latitude &&
            bunk.longitude &&
            !isNaN(bunk.latitude) &&
            !isNaN(bunk.longitude);
          if (!isValid) {
            console.warn(
              `Invalid coordinates for bunk ${bunk.name}: (${bunk.latitude}, ${bunk.longitude})`
            );
          }
          return isValid;
        })
        .map((bunk) => {
          const distance = haversineDistance(
            userLocation.lat,
            userLocation.lon,
            bunk.latitude,
            bunk.longitude
          );

          return { ...bunk, distance };
        })
        .sort((a, b) => a.distance - b.distance);

      setSortedBunks(bunksWithDistance);

      if (bunksWithDistance.length > 0) {
        setNearest(bunksWithDistance[0]);
      } else {
        setNearest(null);
      }
    }
  }, [userLocation, bunks]);

  // Handle search and pagination
  const filteredBunks = bunks.filter((bunk) =>
    `${bunk.name} ${bunk.city} ${bunk.address}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const paginatedBunks = filteredBunks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Update total pages when search term or bunks change
  useEffect(() => {
    const total = Math.max(1, Math.ceil(filteredBunks.length / itemsPerPage));
    setTotalPages(total);

    // Reset to first page if current page is out of range
    if (currentPage > total) {
      setCurrentPage(1);
    }
  }, [searchTerm, bunks, currentPage, filteredBunks.length]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const handleFindNearestBunk = () => {
    if (!userLocation) {
      alert("Please allow location access to find the nearest bunk.");
      return;
    }

    if (!nearest) {
      alert("No bunks available or still calculating distances.");
      return;
    }

    setFindNearestBunkModal(true);
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
      <UserNav />
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
                onClick={handleFindNearestBunk}
                disabled={locationLoading || !userLocation}
              >
                {locationLoading
                  ? "Getting Location..."
                  : !userLocation
                  ? "Location Required"
                  : "Find Nearest EV Bunk"}
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
                <button onClick={() => window.location.reload()}>
                  Try Again
                </button>
              </div>
            ) : bunks.length === 0 ? (
              <div className="no-bunks-message">
                <p>No bunks available at the moment.</p>
              </div>
            ) : filteredBunks.length === 0 ? (
              <div className="no-bunks-message">
                <p>No bunks found matching your search.</p>
              </div>
            ) : (
              <div className="bunk-grid">
                {paginatedBunks.map((bunk) => {
                  const bunkWithDistance = sortedBunks.find(
                    (sb) => sb._id === bunk._id
                  );

                  return (
                    <div key={bunk._id} className="bunk-card">
                      <div className="bunk-details">
                        <h2>{bunk.name}</h2>
                        <p style={{ color: "black" }} className="bunk-location">
                          {bunk.address}, {bunk.city}
                        </p>
                        {bunkWithDistance && (
                          <p
                            style={{ color: "#0066cc", fontWeight: "bold" }}
                            className="bunk-distance"
                          >
                            Distance: {bunkWithDistance.distance.toFixed(2)} km
                          </p>
                        )}
                        <p style={{ color: "black" }} className="bunk-capacity">
                          Available: {bunk.availablePorts} / {bunk.totalPorts}{" "}
                          ports
                        </p>
                        <p
                          style={{ color: "black" }}
                          className="bunk-charging-type"
                        >
                          Charging Type: {bunk.chargingType}
                        </p>
                        <p style={{ color: "black" }} className="bunk-price">
                          Price: ₹{bunk.pricePerKWh}/kWh (Flat rate: ₹
                          {bunk.flatRate})
                        </p>
                        <div className="bunk-status">
                          <span
                            className={`status-indicator ${
                              bunk.allowBooking && bunk.availablePorts > 0
                                ? "available"
                                : "unavailable"
                            }`}
                          ></span>
                          <span>
                            {bunk.allowBooking && bunk.availablePorts > 0
                              ? "Available"
                              : "Unavailable"}
                          </span>
                        </div>
                        <button
                          className={`bunk-action-button ${
                            !bunk.allowBooking || bunk.availablePorts === 0
                              ? "disabled"
                              : ""
                          }`}
                          disabled={
                            !bunk.allowBooking || bunk.availablePorts === 0
                          }
                          onClick={() => {
                            if (bunk.allowBooking && bunk.availablePorts > 0) {
                              navigate(`/user/EvBunkPage`, {
                                state: { bunk: bunk },
                              });
                            }
                          }}
                        >
                          {bunk.allowBooking && bunk.availablePorts > 0
                            ? "Book Now"
                            : "Unavailable"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {!loading &&
              !error &&
              filteredBunks.length > 0 &&
              renderPagination()}
          </main>

          <aside className="side-animation">
            <div className="lottie-container" ref={sideAnimationRef}></div>
            <div className="info-box">
              <h3>Need Help?</h3>
              <p style={{ color: "black" }}>
                Contact our support team for assistance with booking.
              </p>
              {userLocation && sortedBunks.length > 0 && (
                <div
                  style={{
                    marginTop: "10px",
                    fontSize: "0.9em",
                    color: "#666",
                  }}
                >
                  <p>📍 {sortedBunks.length} bunks found near you</p>
                  <p>Nearest: {sortedBunks[0]?.distance.toFixed(1)} km away</p>
                </div>
              )}
              <button
                className="contact-button"
                onClick={() => navigate("/user/Terms-Conditions")}
              >
                Contact Support
              </button>
            </div>
          </aside>
        </div>
      </div>

      {FindNearestBunkModal && (
        <div className="findNearestBunk__modalOverlay">
          <div className="findNearestBunk__container">
            <div style={{ position: "absolute", top: "10px", right: "10px" }}>
              <button
                className="bunk-close-button"
                onClick={() => setFindNearestBunkModal(false)}
              >
                ✕
              </button>
            </div>
            <h2 className="findNearestBunk__title">Nearest EV Bunk</h2>

            {nearest ? (
              <div className="findNearestBunk__card">
                <h3>{nearest.name}</h3>
                <p className="bunk-address">
                  {nearest.address}, {nearest.city}
                </p>
                <p className="bunk-coordinates">
                  Coordinates: {nearest.latitude.toFixed(6)},{" "}
                  {nearest.longitude.toFixed(6)}
                </p>
                <p className="bunk-distance-info">
                  Distance: <strong>{nearest.distance.toFixed(2)} km</strong>
                </p>
                <div className="bunk-details-summary">
                  <p>
                    {" "}
                    Available Ports: {nearest.availablePorts}/
                    {nearest.totalPorts}
                  </p>
                  <p> Charging Type: {nearest.chargingType}</p>
                  <p> Price: ₹{nearest.pricePerKWh}/kWh</p>
                  <p>
                    {" "}
                    {nearest.is24Hours ? "24/7 Available" : "Limited Hours"}
                  </p>
                </div>
                <div className="button-group">
                  <button
                    className={`bunk-action-button ${
                      !nearest.allowBooking || nearest.availablePorts === 0
                        ? "disabled"
                        : ""
                    }`}
                    disabled={
                      !nearest.allowBooking || nearest.availablePorts === 0
                    }
                    onClick={() => {
                      if (nearest.allowBooking && nearest.availablePorts > 0) {
                        navigate("/user/EvBunkPage", {
                          state: { bunk: nearest },
                        });
                      }
                    }}
                  >
                    {nearest.allowBooking && nearest.availablePorts > 0
                      ? "Book This Bunk"
                      : "Unavailable"}
                  </button>
                  <button
                    className="bunk-action-button secondary"
                    onClick={() => {
                      const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${nearest.latitude},${nearest.longitude}`;
                      window.open(googleMapsUrl, "_blank");
                    }}
                  >
                    Get Directions
                  </button>
                </div>
              </div>
            ) : (
              <div className="loading-nearest">
                <p>🔍 Finding nearest bunk...</p>
                {!userLocation && <p>📍 Please allow location access</p>}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default BunkListPage;
