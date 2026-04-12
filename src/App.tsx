import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage.tsx'
import LoginPage from './pages/LoginPage.tsx'
import RegisterPage from './pages/RegisterPage.tsx'
import InvestorDashboard from './pages/investor/Dashboard.tsx'
import MarketplacePage from './pages/investor/Marketplace.tsx'
import PortfolioPage from './pages/investor/Portfolio.tsx'
import OrderbookPage from './pages/investor/Orderbook.tsx'
import InvestorProfile from './pages/investor/Profile.tsx'
import UmkmDashboard from './pages/umkm/Dashboard.tsx'
import UmkmListingForm from './pages/umkm/ListingForm.tsx'
import UmkmListingDetail from './pages/umkm/ListingDetail.tsx'
import UmkmReports from './pages/umkm/Reports.tsx'
import UmkmProfile from './pages/umkm/Profile.tsx'
import UmkmInvestors from './pages/umkm/Investors.tsx'
import AuditorDashboard from './pages/auditor/Dashboard.tsx'
import AuditorReview from './pages/auditor/Review.tsx'
import AuditorApproved from './pages/auditor/Approved.tsx'
import AuditorProfile from './pages/auditor/Profile.tsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      
      {/* Investor Routes */}
      <Route path="/investor/dashboard" element={<InvestorDashboard />} />
      <Route path="/investor/marketplace" element={<MarketplacePage />} />
      <Route path="/investor/portfolio" element={<PortfolioPage />} />
      <Route path="/investor/orderbook/:umkmId" element={<OrderbookPage />} />
      <Route path="/investor/profile" element={<InvestorProfile />} />
      
      {/* UMKM Routes */}
      <Route path="/umkm/dashboard" element={<UmkmDashboard />} />
      <Route path="/umkm/listing" element={<UmkmListingForm />} />
      <Route path="/umkm/listing-detail" element={<UmkmListingDetail />} />
      <Route path="/umkm/edit-listing" element={<UmkmListingForm />} />
      <Route path="/umkm/reports" element={<UmkmReports />} />
      <Route path="/umkm/investors" element={<UmkmInvestors />} />
      <Route path="/umkm/profile" element={<UmkmProfile />} />
      <Route path="/umkm/edit-profile" element={<UmkmProfile />} />
      
      {/* Auditor Routes */}
      <Route path="/auditor/dashboard" element={<AuditorDashboard />} />
      <Route path="/auditor/review/:umkmId" element={<AuditorReview />} />
      <Route path="/auditor/approved" element={<AuditorApproved />} />
      <Route path="/auditor/profile" element={<AuditorProfile />} />
    </Routes>
  )
}

export default App
