import {BrowserRouter,Routes,Route} from 'react-router-dom'
import '../src/assets/css/partials/App.css'
import HomePage from './views/pages/user/HomePage'
import LoginPage from './views/pages/user/LoginPage'
import SignUpPage from './views/pages/user/SignUpPage'

function App() {


  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<HomePage/>}/>
      <Route path='/SignUp' element={<SignUpPage/>}/>
      <Route path='/login' element={<LoginPage/>}/>
    </Routes>
    
    </BrowserRouter>
     
    </>
  )
}

export default App
