import React, { useEffect, useState } from "react";
import "../../../assets/css/admin/BunkDetailsAdmin.css";
import api from "../../../services/axiosInstance";
import AdminNav from "../../partials/admin/SideBarAdmin";

type Bunk = {
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
  flatRate?: number;
  is24Hours: boolean;
  status: "active" | "maintenance" | "inactive";
  allowBooking: boolean;
};

const BunkDetailsAdmin: React.FC = () => {
  const [bunks, setBunks] = useState<Bunk[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Bunk>>({});
  const [message, setMessage] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [successModal,setSuccessModal]=useState(false)
  const itemsPerPage = 4; 

useEffect(()=>{
  if(!successModal)return
  const timer=setTimeout(()=>{
    setSuccessModal(false)
  },3500)
 return ()=>clearInterval(timer)
},[successModal])


  useEffect(() => {
    fetchBunks();
  }, []);

  const fetchBunks = async () => {
    try {
      const res = await api.get("/admin/role/bunksdetails");
      if (res.data.success) {
        setBunks(res.data.bunks);
      }
      setMessage(res.data.message);
    } catch (error) {
      console.log("server error in fetch bunks in BunkDetailsAdmin", error);
      setMessage("server error try later");
    }
  };

  const handleEditClick = (bunk: Bunk) => {
    setEditingId(bunk._id);
    setFormData({ ...bunk });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, type, value } = e.target;

    let val: string | number | boolean;

    if (type === "checkbox") {
      val = (e.target as HTMLInputElement).checked;
    } else if (type === "number") {
      val = Number(value);
    } else {
      val = value;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: val,
    }));
  };

  const handleUpdate = async () => {
    if (!editingId) return;

    try {
      const response = await api.patch(
        `/admin/role/Updatebunks/${editingId}`,
        {formData}
      );
      if (response.data.success) {
        setSuccessModal(true)
      }
      setMessage(response.data.message);
    } catch (error) {
      setMessage("server error try later");
      console.log("error in handleUpdate in bunkdetailsUpdateAdmin", error);
    } finally {
      setEditingId(null);
      fetchBunks();
    }
  };

  const totalPages = Math.ceil(bunks.length / itemsPerPage);
const indexOfLastItem = currentPage * itemsPerPage;
const indexOfFirstItem = indexOfLastItem - itemsPerPage;
const currentItems = bunks.slice(indexOfFirstItem, indexOfLastItem);

const handlePrevPage = () => {
  if (currentPage > 1) setCurrentPage((prev) => prev - 1);
};

const handleNextPage = () => {
  if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
};


  return (
    <>
    <AdminNav/>
    <div className="bunkdetailsUpdateAdmin-container">
      <h1 className="bunkdetailsUpdateAdmin-title">EV Charging Bunks</h1>
      <p style={{color:"white"}}>{message}</p>

      <div className="bunkdetailsUpdateAdmin-grid">
        {currentItems.map((bunk) => (
          <div key={bunk._id} className="bunkdetailsUpdateAdmin-card">
            <img style={{width:"30px",height:'30px',borderRadius:"150px"}} src="\images\png-transparent-bmw-car-logo.png" alt="logo" />
            {editingId === bunk._id ? (
              <div className="bunkdetailsUpdateAdmin-form">
                <input
                  name="name"
                  value={formData.name || ""}
                  onChange={handleChange}
                  placeholder="Name"
                />
                <input
                  name="address"
                  value={formData.address || ""}
                  onChange={handleChange}
                  placeholder="Address"
                />
                <input
                  name="city"
                  value={formData.city || ""}
                  onChange={handleChange}
                  placeholder="City"
                />
                <input
                  name="contactNo"
                  value={formData.contactNo || ""}
                  onChange={handleChange}
                  placeholder="Contact No"
                />
                <input
                  name="totalPorts"
                  type="number"
                  value={formData.totalPorts || 0}
                  onChange={handleChange}
                  placeholder="Total Ports"
                />
                <input
                  name="availablePorts"
                  type="number"
                  value={formData.availablePorts || 0}
                  onChange={handleChange}
                  placeholder="Available Ports"
                />
                <input
                  name="chargingType"
                  value={formData.chargingType || ""}
                  onChange={handleChange}
                  placeholder="Charging Type"
                />
                <input
                  name="pricePerKWh"
                  type="number"
                  value={formData.pricePerKWh || 0}
                  onChange={handleChange}
                  placeholder="Price per kWh"
                />
                <input
                  name="flatRate"
                  type="number"
                  value={formData.flatRate || 0}
                  onChange={handleChange}
                  placeholder="Flat Rate (optional)"
                />
                <select
                  name="status"
                  value={formData.status || "active"}
                  onChange={handleChange}
                >
                  <option value="active">Active</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="inactive">Inactive</option>
                </select>
                <label>
                  <input
                    type="checkbox"
                    name="is24Hours"
                    checked={formData.is24Hours || false}
                    onChange={handleChange}
                  />{" "}
                  24 Hours
                </label>
                <label>
                  <input
                    type="checkbox"
                    name="allowBooking"
                    checked={formData.allowBooking || false}
                    onChange={handleChange}
                  />{" "}
                  Allow Booking
                </label>
                <button onClick={handleUpdate}>Update</button>
                <button onClick={()=>{
                  setEditingId(null)
                  setFormData({})
                    setMessage("")
                  
                }}>Cancel</button>
              </div>
            ) : (
              <>
                <h2>{bunk.name}</h2>
                <p>
                  {bunk.address}, {bunk.city}
                </p>
                <p>Contact: {bunk.contactNo}</p>
                <p>
                  Ports: {bunk.availablePorts}/{bunk.totalPorts}
                </p>
                <p>Charging: {bunk.chargingType}</p>
                <p>
                  ₹{bunk.pricePerKWh}/kWh{" "}
                  {bunk.flatRate ? ` | Flat: ₹${bunk.flatRate}` : ""}
                </p>
                <p>Status: {bunk.status}</p>
                <p>{bunk.is24Hours ? "24/7 Available" : "Limited Hours"}</p>
                <p>Booking: {bunk.allowBooking ? "Yes" : "No"}</p>
                <button onClick={() => handleEditClick(bunk)}>Edit</button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
    <div className="bunkdetailsUpdateAdmin-pagination">
    <button onClick={handlePrevPage} disabled={currentPage === 1}>
      Prev
    </button>
    <span>
      Page {currentPage} of {totalPages}
    </span>
    <button onClick={handleNextPage} disabled={currentPage === totalPages}>
      Next
    </button>
  </div>
  {successModal&&(
    <div className="updateSuccessModal-overlay">
    <div className="updateSuccessModal-container">
      <div className="updateSuccessModal-image">
        {/* You can place an image here */}
        <img
          src="\images\png-transparent-bmw-car-logo.png"
          alt="Success"
          className="updateSuccessModal-img"
        />
      </div>
      <div className="updateSuccessModal-content">
        <h2>Update Successful!</h2>
        <p style={{color:"black"}}>The bunk details have been updated successfully.</p>
        <button onClick={()=>setSuccessModal(false)}>Close</button>
      </div>
    </div>
  </div>
  
  )}
  
   </>
  );
};

export default BunkDetailsAdmin;
