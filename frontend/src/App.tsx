import {BrowserRouter,Routes,Route} from 'react-router-dom'
import '../src/assets/css/partials/App.css'
import HomePage from './views/pages/user/HomePage'
import LoginPage from './views/pages/user/LoginPage'
import SignUpPage from './views/pages/user/SignUpPage'
import AdminLoginPage from './views/pages/admin/AdminLoginPage'
import AdminDashboard from './views/pages/admin/AdminDashboard'
import UserChargingBunkPage from './views/pages/user/userChargingBunkPage'
import AdminEvBunkPage from './views/pages/admin/AdminEvBunkPage'
import BunkListPage from './views/pages/user/BunkListPage'


function App() {


  return (
    <>
    <BrowserRouter>
    <Routes>

      {/*user Side */}

      <Route path='/' element={<HomePage/>}/>
      <Route path='/SignUp' element={<SignUpPage/>}/>
      <Route path='/login' element={<LoginPage/>}/>
      <Route path='/user/EvBunkPage' element={<UserChargingBunkPage/>}/>
      <Route path='/user/BunkList' element={<BunkListPage/>}/>

      {/*admin Side */}

      <Route path='/admin/login' element={<AdminLoginPage/>}/>
      <Route path='/admin/dashboard' element={<AdminDashboard/>}/>
      <Route path='/admin/EvBunkPage' element={<AdminEvBunkPage/>}/>
      
    </Routes>
    
    </BrowserRouter>
     
    </>
  )
}

export default App
