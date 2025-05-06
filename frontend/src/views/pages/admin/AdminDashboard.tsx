import "../../../assets/css/admin/Dashboard.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import AdminNav from "../../partials/admin/SideBarAdmin";
import { useEffect, useState } from "react";
import api from "../../../services/axiosInstance";

interface bookingInfo {
  month: string;
  bookings: number;
}

const AdminDashboard = () => {
  const [message, setMessage] = useState<string>("");
  const [chargingStations, setChargingStations] = useState<any>([]);
  const [totalAmountThisMonth, setTotalAmountThisMonth] = useState<number>(0);
  const [bookingData, setBookingData] = useState<bookingInfo[]>([]);

  useEffect(() => {
    const getDashboardData = async () => {
      try {
        const response = await api.get("/admin/role/getDashboardData");
        if (response.data.success) {
          console.log("data", response.data);

          const { bookings, chargingStations, totalAmountThisMonth } =
            response.data;

          setBookingData(bookings);
          setChargingStations(chargingStations);

          setTotalAmountThisMonth(totalAmountThisMonth);
        }
        setMessage(response.data.message);
      } catch (error) {
        console.log("Error fetching dashboard data", error);
      }
    };

    getDashboardData();
  }, []);

  console.log("stations", chargingStations);

  return (
    <>
      <AdminNav />
      <div className="adminDashboard">
        <div className="adminMain">
          <div className="adminContent">
            <div className="carCard">
              <div className="carCard__logo">
                <img
                  src="\images\png-transparent-bmw-car-logo.png"
                  alt="logo"
                />
              </div>
              <h2>Latest Launches</h2>
              <div style={{ display: "flex" }}>
                <img src="\images\cosySec (2).webp" alt="BMW" />
                <img src="\images\cosySec.webp" alt="BMW" />
                <img src="\images\cosySec (3).webp" alt="BMW" />
                <img src="\images\cosySec (1).webp" alt="BMW" />
              </div>
            </div>

            <div className="dashboardCards">
              <div className="card chargingStations">
                <h4>Charging Stations</h4>
                {chargingStations.map((data: any, index: number) => {
                  return (
                    <div key={index}>
                      <p>Total: {data.total}</p>
                      <p>Available: {data.available}</p>
                      <p>Unavailable: {data.unavailable}</p>
                    </div>
                  );
                })}
              </div>

              <div className="card smartCharging">
                <h4>
                  Total Amount <strong>( this month )</strong>
                </h4>
                <div className="circleGraphPlaceholder">
                  ₹{totalAmountThisMonth}
                </div>
              </div>
            </div>

            {/* Booking Chart */}
            <div className="adminDashboard__chartCard">
              <h3 className="adminDashboard__chartTitle">
                Monthly Booking Statistics
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={bookingData}
                  margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar
                    dataKey="bookings"
                    fill="#171717"
                    radius={[10, 10, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
