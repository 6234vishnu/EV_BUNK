import { BrowserRouter, Routes, Route } from "react-router-dom";
import "../src/assets/css/partials/App.css";
import HomePage from "./views/pages/user/HomePage";
import LoginPage from "./views/pages/user/LoginPage";
import SignUpPage from "./views/pages/user/SignUpPage";
import AdminLoginPage from "./views/pages/admin/AdminLoginPage";
import AdminDashboard from "./views/pages/admin/AdminDashboard";
import UserChargingBunkPage from "./views/pages/user/userChargingBunkPage";
import AdminEvBunkPage from "./views/pages/admin/AdminEvBunkPage";
import BunkListPage from "./views/pages/user/BunkListPage";
import NewCarsShowcase from "./views/pages/user/NewCarsShowcase";
import BookingListAdmin from "./views/pages/admin/BookingListAdmin";
import BunkDetailsAdmin from "./views/pages/admin/BunkdetailsUpdateAdmin";
import AuthenticateAdmin from "./views/partials/admin/AuthenticateAdmin";
import UserNav from "./views/partials/user/UserNav";
import ContactAndTerms from "./views/pages/user/ContactAndTerms";
import UserProfile from "./views/pages/user/UserProfile";
import AuthenticateUser from "./views/partials/user/AuthenticateUser";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/*user Side */}

          <Route path="/" element={<HomePage />} />
          <Route path="/SignUp" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/user/Terms-Conditions" element={<ContactAndTerms />} />
          <Route element={<AuthenticateUser/>}>   
          <Route path="/user/BunkList" element={<BunkListPage />} />
          <Route path="/user/EvBunkPage" element={<UserChargingBunkPage />} />
          <Route path="/user/latestCars" element={<NewCarsShowcase />} />         
          <Route path="/user/Profile" element={<UserProfile />} />
          <Route path="/user/sidebar" element={<UserNav />} />
          </Route>

          {/*admin Side */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route element={<AuthenticateAdmin />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/EvBunkPage" element={<AdminEvBunkPage />} />
            <Route path="/admin/bookingLists" element={<BookingListAdmin />} />
            <Route
              path="/admin/BunkDetailsAdmin"
              element={<BunkDetailsAdmin />}
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
