import {BrowserRouter,Routes,Route} from 'react-router-dom'
import '../src/assets/css/partials/App.css'
import HomePage from './views/pages/user/HomePage'
import LoginPage from './views/pages/user/LoginPage'
import SignUpPage from './views/pages/user/SignUpPage'
import AdminLoginPage from './views/pages/admin/AdminLoginPage'
import AdminDashboard from './views/pages/admin/AdminDashboard'

function App() {


  return (
    <>
    <BrowserRouter>
    <Routes>

      {/*user Side */}

      <Route path='/' element={<HomePage/>}/>
      <Route path='/SignUp' element={<SignUpPage/>}/>
      <Route path='/login' element={<LoginPage/>}/>

      {/*admin Side */}

      <Route path='/admin/login' element={<AdminLoginPage/>}/>
      <Route path='/admin/dashboard' element={<AdminDashboard/>}/>
    </Routes>
    
    </BrowserRouter>
     
    </>
  )
}

export default App
