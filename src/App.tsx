import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'sonner'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import HomePage from './pages/HomePage.tsx'
import LoginPage from './pages/LoginPage.tsx'
import RegisterPage from './pages/RegisterPage.tsx'
import InvestorDashboard from './pages/investor/Dashboard.tsx'
import MarketplacePage from './pages/investor/Marketplace.tsx'
import PortfolioPage from './pages/investor/Portfolio.tsx'
import OrderbookPage from './pages/investor/Orderbook.tsx'
import InvestorProfile from './pages/investor/Profile.tsx'
import InvestorDeposit from './pages/investor/Deposit.tsx'
import InvestorDividend from './pages/investor/Dividend.tsx'
import UmkmDashboard from './pages/umkm/Dashboard.tsx'
import UmkmListingForm from './pages/umkm/ListingForm.tsx'
import UmkmListingDetail from './pages/umkm/ListingDetail.tsx'
import UmkmReports from './pages/umkm/Reports.tsx'
import UmkmProfile from './pages/umkm/Profile.tsx'
import UmkmInvestors from './pages/umkm/Investors.tsx'
import UmkmDividend from './pages/umkm/Dividend.tsx'
import AuditorDashboard from './pages/auditor/Dashboard.tsx'
import AuditorReview from './pages/auditor/Review.tsx'
import AuditorApproved from './pages/auditor/Approved.tsx'
import AuditorProfile from './pages/auditor/Profile.tsx'

function App() {
  return (
    <AuthProvider>
      <Toaster position="top-center" richColors />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Investor Routes */}
        <Route
          path="/investor/dashboard"
          element={
            <ProtectedRoute allowedRoles={['investor']}>
              <InvestorDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/investor/marketplace"
          element={
            <ProtectedRoute allowedRoles={['investor']}>
              <MarketplacePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/investor/portfolio"
          element={
            <ProtectedRoute allowedRoles={['investor']}>
              <PortfolioPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/investor/orderbook/:id"
          element={
            <ProtectedRoute allowedRoles={['investor']}>
              <OrderbookPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/investor/deposit"
          element={
            <ProtectedRoute allowedRoles={['investor']}>
              <InvestorDeposit />
            </ProtectedRoute>
          }
        />
        <Route
          path="/investor/dividend"
          element={
            <ProtectedRoute allowedRoles={['investor']}>
              <InvestorDividend />
            </ProtectedRoute>
          }
        />
        <Route
          path="/investor/profile"
          element={
            <ProtectedRoute allowedRoles={['investor']}>
              <InvestorProfile />
            </ProtectedRoute>
          }
        />
        
        {/* UMKM Routes */}
        <Route
          path="/umkm/dashboard"
          element={
            <ProtectedRoute allowedRoles={['umkm']}>
              <UmkmDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/umkm/listing"
          element={
            <ProtectedRoute allowedRoles={['umkm']}>
              <UmkmListingForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/umkm/listing-detail"
          element={
            <ProtectedRoute allowedRoles={['umkm']}>
              <UmkmListingDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/umkm/edit-listing"
          element={
            <ProtectedRoute allowedRoles={['umkm']}>
              <UmkmListingForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/umkm/reports"
          element={
            <ProtectedRoute allowedRoles={['umkm']}>
              <UmkmReports />
            </ProtectedRoute>
          }
        />
        <Route
          path="/umkm/investors"
          element={
            <ProtectedRoute allowedRoles={['umkm']}>
              <UmkmInvestors />
            </ProtectedRoute>
          }
        />
        <Route
          path="/umkm/dividend"
          element={
            <ProtectedRoute allowedRoles={['umkm']}>
              <UmkmDividend />
            </ProtectedRoute>
          }
        />
        <Route
          path="/umkm/profile"
          element={
            <ProtectedRoute allowedRoles={['umkm']}>
              <UmkmProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/umkm/edit-profile"
          element={
            <ProtectedRoute allowedRoles={['umkm']}>
              <UmkmProfile />
            </ProtectedRoute>
          }
        />
        
        {/* Auditor Routes */}
        <Route
          path="/auditor/dashboard"
          element={
            <ProtectedRoute allowedRoles={['auditor']}>
              <AuditorDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/auditor/review/:umkmId"
          element={
            <ProtectedRoute allowedRoles={['auditor']}>
              <AuditorReview />
            </ProtectedRoute>
          }
        />
        <Route
          path="/auditor/approved"
          element={
            <ProtectedRoute allowedRoles={['auditor']}>
              <AuditorApproved />
            </ProtectedRoute>
          }
        />
        <Route
          path="/auditor/profile"
          element={
            <ProtectedRoute allowedRoles={['auditor']}>
              <AuditorProfile />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  )
}

export default App
