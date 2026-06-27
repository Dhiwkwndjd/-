import {BrowserRouter,Routes,Route} from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import HomePage from '../pages/HomePage';
import ProfilePage from '../pages/ProfilePage';
import TripDetailPage from '../pages/TripDetailPage';
import EditTripPage from '../pages/EditTripPage';
import AuthLayout from '../pages/layouts/AuthLayout';
import MainLayout from '../pages/layouts/MainLayout';
import RequireAuth from '../pages/Require/RequireAuth';
import MyApplicationsPage from '../pages/MyApplicationsPage';
import ProfileEditPage from "../pages/ProfileEditPage";
import TripChatPage from "../pages/TripChatPage";
import MyTripsPage from "../pages/MyTripsPage";

  function App(){
    return (
        <BrowserRouter>
          <Routes>
            <Route element={<AuthLayout/>}><Route path='/login' element={<LoginPage/>}/><Route path='/register' element={<RegisterPage/>}/></Route>
            <Route element={<MainLayout/>}>
              <Route path='/' element={<RequireAuth><HomePage/></RequireAuth>}/>
              <Route path='/profile' element={<RequireAuth><ProfilePage/></RequireAuth>}/>
              <Route path="/profile/edit"element={<RequireAuth><ProfileEditPage /></RequireAuth>}/>
              <Route path='/applications' element={<RequireAuth><MyApplicationsPage/></RequireAuth>}/>
              <Route path='/trip/:id' element={<RequireAuth><TripDetailPage/></RequireAuth>}/>
              <Route path='/trip/edit/:id' element={<RequireAuth><EditTripPage/></RequireAuth>}/>
              <Route path="/trip/:id/chat" element={<RequireAuth><TripChatPage/></RequireAuth>}/>
              <Route path="/my-trips" element={<RequireAuth><MyTripsPage /></RequireAuth>}/>
            </Route>
          </Routes>
        </BrowserRouter>
        )
      }
export default App;