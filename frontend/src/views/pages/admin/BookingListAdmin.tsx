import React, { useState, useEffect } from 'react';
import '../../../assets/css/admin/BookingListAdmin.css';
import { Clock, Calendar, Truck, Battery, Zap, DollarSign, Check, X, RefreshCw, ChevronRight } from 'lucide-react';
import api from '../../../services/axiosInstance';


type BookingStatus = 'Booked' | 'Charging' | 'Completed' | 'Cancelled';


interface Booking {
  _id: string;
  user: string;
  bunk: string;
  slotTime: string;
  bookingDate: string;
  vehicleNumber: string;
  connectorType: string;
  chargingType: string;
  status: BookingStatus;
  price: number;
}

const BookingListAdmin: React.FC = () => {

  const [animatelogo, setAnimateLogo] = useState<boolean>(false);
  
  // Toggle BMW logo animation
  const toggleLogoAnimation = () => {
    setAnimateLogo(prev => !prev);
  };
  // State for bookings
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [message, setmessage] = useState<string>('');


  useEffect(() => {
 
    const getBookings=async()=>{
        try {
            const response=await api.get('/admin/roles/getBookings')
            if(response.data.success){
                setBookings(response.data.bookings)
             return   setIsLoading(false)
            }
          return  setmessage(response.data.message)
        } catch (error) {
            setmessage('server error try later')
            console.log('error in getBookings adminside BookingListAdmin');
            
        }
    }
    getBookings()
  }, [bookings]);

  // Function to update booking status
  const updateBookingStatus =async (id: string, newStatus: BookingStatus) => {

    try {
        const response = await api.patch(`/admin/role/updateBookingStatus`, {
            bookingId: id,
            status: newStatus,
          });
          
        if(response.data.success){
         return   setBookings(
                bookings.map((booking) => 
                  booking._id === id ? { ...booking, status: newStatus } : booking
                )
              );
        }
      return  setmessage('couldint update Status try later')
    } catch (error) {
        setmessage('server error try later')
        console.log('error in booking Status update adminside',error);
        
    }
    
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Filter bookings based on status and search term
  const filteredBookings = bookings.filter((booking) => {
    const matchesFilter = filter === 'all' || booking.status.toLowerCase() === filter;
    const matchesSearch = 
      booking.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.slotTime.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.connectorType.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Get badge class based on status
  const getStatusBadgeClass = (status: BookingStatus) => {
    switch (status) {
      case 'Booked': return 'bookingListAdmin-status-badge bookingListAdmin-status-booked';
      case 'Completed': return 'bookingListAdmin-status-badge bookingListAdmin-status-completed';
      case 'Cancelled': return 'bookingListAdmin-status-badge bookingListAdmin-status-cancelled';
      default: return 'bookingListAdmin-status-badge';
    }
  };

  return (
    <div className="bookingListAdmin-container">
      <div className="bookingListAdmin-branding">
        <div className={`bookingListAdmin-logo-container ${animatelogo ? 'animate' : ''}`} onClick={toggleLogoAnimation}>
          <div className="bookingListAdmin-logo">
           
            <div className="bookingListAdmin-bmw-logo">
              <div className="bookingListAdmin-bmw-circle">
                <img src="\images\png-transparent-bmw-car-logo.png" alt="logo" />
              </div>
            </div>
          </div>
          <div className="bookingListAdmin-brand-text">
            <h2>BMW</h2>
            <h3>Charging Network</h3>
           
             <p style={{color:'white'}}>{message}</p>
          
          </div>
        </div>
      </div>
      
      <header className="bookingListAdmin-header">
        <h1>Charging Station Bookings</h1>
        <div className="bookingListAdmin-controls">
          <div className="bookingListAdmin-search">
            <input
              type="text"
              placeholder="Search by vehicle number, slot time..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bookingListAdmin-search-input"
            />
          </div>
          <div className="bookingListAdmin-filter">
            <select 
              value={filter} 
              onChange={(e) => setFilter(e.target.value)}
              className="bookingListAdmin-filter-select"
            >
              <option value="all">All Bookings</option>
              <option value="booked">Booked</option>
              <option value="completed">Completed</option>
              <option value="Charging">Charging</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </header>

      {isLoading ? (
        <div className="bookingListAdmin-loading">
          <RefreshCw className="bookingListAdmin-loading-icon" size={32} />
          <p>Loading bookings...</p>
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="bookingListAdmin-empty">
          <p>No bookings found matching your criteria.</p>
        </div>
      ) : (
        <div className="bookingListAdmin-grid">
          {filteredBookings.map((booking) => (
            <div key={booking._id} className="bookingListAdmin-card">
              <div className="bookingListAdmin-card-header">
                <span className={getStatusBadgeClass(booking.status)}>
                  {booking.status}
                </span>
                <span className="bookingListAdmin-price">
                  <DollarSign size={16} /> ₹{booking.price}
                </span>
              </div>
              
              <div className="bookingListAdmin-card-body">
                <div className="bookingListAdmin-bmw-indicator">
                  <div className="bookingListAdmin-bmw-dot"></div>
                  <div className="bookingListAdmin-bmw-dot"></div>
                  <div className="bookingListAdmin-bmw-dot"></div>
                </div>
                <div className="bookingListAdmin-info-row">
                  <Truck size={18} />
                  <span className="bookingListAdmin-vehicle-number">{booking.vehicleNumber}</span>
                </div>
                
                <div className="bookingListAdmin-info-row">
                  <Clock size={18} />
                  <span>{booking.slotTime}</span>
                </div>
                
                <div className="bookingListAdmin-info-row">
                  <Calendar size={18} />
                  <span>{formatDate(booking.bookingDate)}</span>
                </div>
                
                <div className="bookingListAdmin-info-row">
                  <Battery size={18} />
                  <span>{booking.connectorType}</span>
                </div>
                
                <div className="bookingListAdmin-info-row">
                  <Zap size={18} />
                  <span>{booking.chargingType}</span>
                </div>
              </div>
              
              <div className="bookingListAdmin-card-actions">
                {booking.status === 'Booked' && (
                  <>
                    <button 
                      className="bookingListAdmin-btn bookingListAdmin-btn-charging"
                      onClick={() => updateBookingStatus(booking._id, 'Charging')}
                    >
                      <span>Start Charging</span>
                      <ChevronRight size={16} />
                    </button>
                    <button 
                      className="bookingListAdmin-btn bookingListAdmin-btn-cancel"
                      onClick={() => updateBookingStatus(booking._id, 'Cancelled')}
                    >
                      <span>Cancel</span>
                      <X size={16} />
                    </button>
                  </>
                )}

                {booking.status==='Charging'&&(
                    <button 
                    className="bookingListAdmin-btn bookingListAdmin-btn-cancel"
                    onClick={() => updateBookingStatus(booking._id, 'Completed')}
                  >
                    <span>Charging Completed</span>
                    <X size={16} />
                  </button>
                )}
                  
                
                {(booking.status === 'Completed' || booking.status === 'Cancelled') && (
                  <div className="bookingListAdmin-status-message">
                    {booking.status === 'Completed' ? (
                      <span><Check size={18} /> Charging session completed</span>
                    ) : (
                      <span><X size={18} /> Booking cancelled</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookingListAdmin;