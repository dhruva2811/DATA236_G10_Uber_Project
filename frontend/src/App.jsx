import React, { useContext } from 'react'
import { Route, Routes } from 'react-router-dom'
import Start from './pages/Start'
import UserLogin from './pages/UserLogin'
import UserSignup from './pages/UserSignup'
import Captainlogin from './pages/Captainlogin'
import CaptainSignup from './pages/CaptainSignup'
import Home from './pages/Home'
import UserProtectWrapper from './pages/UserProtectWrapper'
import UserLogout from './pages/UserLogout'
import CaptainHome from './pages/CaptainHome'
import CaptainProtectWrapper from './pages/CaptainProtectWrapper'
import CaptainLogout from './pages/CaptainLogout'
import Riding from './pages/Riding'
import CaptainRiding from './pages/CaptainRiding'
import 'remixicon/fonts/remixicon.css'
import AdminLogin from './pages/AdminLogin';
import AdminSignup from './pages/AdminSignup';
import AdminBilling from './pages/AdminBilling';
import RideRequestPage from './pages/RideRequestPage';
import CaptainOtpPage from './pages/CaptainOtpPage';
import AdminAnalytics from './pages/AdminAnalytics';
import CaptainEditForm from './pages/CaptainEditForm';
import IntroVideoUploader from './pages/IntroVideoUploader'; 
import CaptainSearchForm from './pages/CaptainSearchForm';
import CaptainProfile from './pages/CaptainProfile';
import UserProfile from './pages/UserProfile';
import UserEditForm from './pages/UserEditForm';
import UserPaymentSummary from './pages/UserPaymentSummary';
import UserReceiptPage from './pages/UserReceiptPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminCaptainList from './pages/AdminCaptainList';
import AdminAddCaptain from './pages/AdminAddCaptain';
import AdminEditCaptain from './pages/AdminEditCaptain';
import AdminCaptainRides from './pages/AdminCaptainRides';
import AdminCustomerList from './pages/AdminCustomerList';
import AdminEditCustomer from './pages/AdminEditCustomer';
import AdminCustomerRides from './pages/AdminCustomerRides';
import AdminAddCustomer from './pages/AdminAddCustomer';
import AdminSupport from './pages/AdminSupport';





const App = () => {

  return (
    <div>
      <Routes>
        <Route path='/' element={<Start />} />
        <Route path='/login' element={<UserLogin />} />
        <Route path='/riding' element={<Riding />} />
        <Route path='/captain-riding' element={<CaptainRiding />} />

        <Route path='/signup' element={<UserSignup />} />
        <Route path='/captain-login' element={<Captainlogin />} />
        <Route path='/captain-signup' element={<CaptainSignup />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/signup" element={<AdminSignup />} />
        <Route path="/admin/billing" element={<AdminBilling />} />
        <Route path='/captain/ride-request' element={<RideRequestPage />} />
        <Route path='/captain-home' element={<CaptainHome />} />
        <Route path="/captain/otp" element={<CaptainOtpPage />} />
        <Route path="/admin/analytics" element={<AdminAnalytics />} />
        <Route path="/captain/edit/:id" element={<CaptainEditForm />} />
        <Route path="/captain/video/:id" element={<IntroVideoUploader />} />
        <Route path="/admin/captains/search" element={<CaptainSearchForm />} />
        <Route path="/captain/profile" element={<CaptainProfile />} />
        <Route path="/user/profile" element={<UserProfile />} />
        <Route path="/user/edit" element={<UserEditForm />} />
        <Route path="/user/payment-summary/:rideId" element={<UserPaymentSummary />} />
        <Route path="/user/receipt/:rideId" element={<UserReceiptPage />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/captains" element={<AdminCaptainList />} />
        <Route path="/admin/captains/add" element={<AdminAddCaptain />} />
        <Route path="/admin/captains/edit/:id" element={<AdminEditCaptain />} />
        <Route path="/captain/edit/:id" element={<CaptainEditForm />} />
        <Route path="/admin/captains/rides/:id" element={<AdminCaptainRides />} />
        <Route path="/admin/customers" element={<AdminCustomerList />} />
        <Route path="/admin/customers/edit/:id" element={<AdminEditCustomer />} />
        <Route path="/admin/customers/rides/:id" element={<AdminCustomerRides />} />
        <Route path="/admin/customers/add" element={<AdminAddCustomer />} />
        <Route path="/admin/support" element={<AdminSupport />} />

        <Route path='/home'
        
          element={
            <UserProtectWrapper>
              <Home />
            </UserProtectWrapper>
          } />
        <Route path='/user/logout'
          element={<UserProtectWrapper>
            <UserLogout />
          </UserProtectWrapper>
          } />
        <Route path='/captain-home' element={
          <CaptainProtectWrapper>
            <CaptainHome />
          </CaptainProtectWrapper>

        } />
        <Route path='/captain/logout' element={
          <CaptainProtectWrapper>
            <CaptainLogout />
          </CaptainProtectWrapper>
        } />
      </Routes>
    </div>
  )
}

export default App