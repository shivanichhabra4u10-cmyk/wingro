import React from 'react';
import { 
  Route, 
  Navigate,
  createRoutesFromElements,
  createBrowserRouter,
  RouterProvider,
  Outlet
} from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { Layout } from './components';
import AdminProtected from './components/AdminProtected';
import './styles/index.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Pages
const GrowthLink = React.lazy(() => import('./pages/programs/growth-link'));
const EIncubator = React.lazy(() => import('./pages/programs/e-incubator'));
const EAccelrator = React.lazy(() => import('./pages/programs/e-accelrator'));
const EAcceleratorScreening = React.lazy(() => import('./pages/programs/EAcceleratorScreening'));
const GrowthLinkPainDiscovery = React.lazy(() => import('./pages/programs/GrowthLinkPainDiscovery'));
const ProviderIntelligence = React.lazy(() => import('./pages/programs/ProviderIntelligence'));
const GrowthLinkProviderMarketplace = React.lazy(() => import('./pages/programs/GrowthLinkProviderMarketplace'));
const Login = React.lazy(() => import('./pages/Login'));
const Register = React.lazy(() => import('./pages/Register'));
const ResetPassword = React.lazy(() => import('./pages/ResetPassword'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const NotFound = React.lazy(() => import('./pages/NotFound'));
const GoogleCallback = React.lazy(() => import('./pages/GoogleCallback'));
const Profile = React.lazy(() => import('./pages/Profile'));
const AccessDenied = React.lazy(() => import('./pages/AccessDenied'));
const Home = React.lazy(() => import('./pages/Home'));
const AboutUs = React.lazy(() => import('./pages/AboutUs'));
const WhyWinGroX = React.lazy(() => import('./pages/WhyWinGroX'));
const HowItWorks = React.lazy(() => import('./pages/HowItWorks'));
const WhoWeServe = React.lazy(() => import('./pages/WhoWeServe'));
const Products = React.lazy(() => import('./pages/Products'));
const ProductDetail = React.lazy(() => import('./pages/ProductDetail'));
const Knowledge = React.lazy(() => import('./pages/Knowledge'));
const Marketplace = React.lazy(() => import('./pages/Marketplace'));
const CoachProfile = React.lazy(() => import('./pages/CoachProfile'));
const AssessmentSelection = React.lazy(() => import('./pages/AssessmentSelection'));
const CareerAssessment = React.lazy(() => import('./pages/CareerAssessment'));
const OrganizationAssessment = React.lazy(() => import('./pages/OrganizationAssessment'));
const Contact = React.lazy(() => import('./pages/Contact'));
const JoinAsCoach = React.lazy(() => import('./pages/JoinAsCoach'));
const GrowthSeeker = React.lazy(() => import('./pages/GrowthSeeker'));
const GrowWithCommunity = React.lazy(() => import('./pages/GrowWithCommunity'));

const Playbooks = React.lazy(() => import('./pages/Playbooks'));
const DiagnosticTool = React.lazy(() => import('./pages/DiagnosticTool'));
const BrandingKit = React.lazy(() => import('./pages/BrandingKit'));
const DigitalTwinCareer = React.lazy(() => import('./pages/DigitalTwinCareer'));
const DigitalTwinEnrollment = React.lazy(() => import('./pages/DigitalTwinEnrollment'));

const Cart = React.lazy(() => import('./components/Cart'));
const Download = React.lazy(() => import('./pages/Download'));

// Admin Pages
const AdminDashboard = React.lazy(() => import('./pages/admin/AdminDashboard'));
const AdminProducts = React.lazy(() => import('./pages/admin/AdminProducts'));
const AdminCoaches = React.lazy(() => import('./pages/admin/AdminCoaches'));
const AdminUsers = React.lazy(() => import('./pages/admin/AdminUsers'));
const AdminBookings = React.lazy(() => import('./pages/admin/AdminBookings'));
const AdminSettings = React.lazy(() => import('./pages/admin/AdminSettings'));

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout><Outlet /></Layout>}>
      <Route path="/" element={<Home />} />
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route path="auth/google/callback" element={<GoogleCallback />} />
      <Route path="reset-password" element={<ResetPassword />} />
      {/* Public routes */}
      <Route path="about-us" element={<AboutUs />} />
      <Route path="why-wingrox" element={<WhyWinGroX />} />
      <Route path="how-it-works" element={<HowItWorks />} />
      <Route path="who-we-serve" element={<WhoWeServe />} />
      <Route path="products" element={<Products />} />
      <Route path="product/:id" element={<ProductDetail />} />
      <Route path="knowledge" element={<Knowledge />} />
      <Route path="marketplace" element={<Marketplace />} />
      <Route path="coach/:id" element={<CoachProfile />} />
      <Route path="assessment-selection" element={<AssessmentSelection />} />
      <Route path="digital-twin" element={<DigitalTwinCareer />} />
      <Route path="digital-twin-enrollment" element={<DigitalTwinEnrollment />} />
      <Route path="student-9-10" element={<CareerAssessment />} />
      <Route path="student-11-12" element={<CareerAssessment />} />
      <Route path="professional" element={<CareerAssessment />} />
      <Route path="organization" element={<OrganizationAssessment />} />
      <Route path="contact" element={<Contact />} />
      <Route path="join-as-coach" element={<JoinAsCoach />} />
      <Route path="start-your-journey" element={<GrowthSeeker />} />
      <Route path="grow-with-community" element={<GrowWithCommunity />} />
      <Route path="community/provider-marketplace" element={<React.Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}><GrowthLinkProviderMarketplace /></React.Suspense>} />
      <Route path="playbooks" element={<Playbooks />} />
      <Route path="diagnostic-tool" element={<DiagnosticTool />} />
      <Route path="branding-kit" element={<BrandingKit />} />
      <Route path="access-denied" element={<AccessDenied />} />
  {/* Our Programs submenu routes */}
  <Route path="programs/growth-link" element={<React.Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}><GrowthLink /></React.Suspense>} />
  <Route path="programs/growth-link/pain-discovery" element={<React.Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}><GrowthLinkPainDiscovery /></React.Suspense>} />
  <Route path="programs/e-incubator" element={<React.Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}><EIncubator /></React.Suspense>} />
  <Route path="programs/e-accelrator" element={<React.Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}><EAccelrator /></React.Suspense>} />
  <Route path="programs/e-accelrator/screening" element={<React.Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}><EAcceleratorScreening /></React.Suspense>} />
  <Route path="programs/join-as-provider" element={<React.Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}><ProviderIntelligence /></React.Suspense>} />
      {/* Protected user routes */}
      <Route element={<ProtectedRoute><Outlet /></ProtectedRoute>}>
        <Route path="cart" element={<Cart />} />
        <Route path="download" element={<Download />} />
        <Route path="profile" element={<Profile />} />
        <Route path="dashboard" element={<Dashboard />} />
      </Route>
      {/* Admin Routes */}
      <Route path="admin-direct" element={<Navigate to="/admin" replace />} />
      <Route path="admin" element={<AdminProtected><AdminDashboard /></AdminProtected>} />
      <Route path="admin/products" element={<AdminProtected><AdminProducts /></AdminProtected>} />
      <Route path="admin/coaches" element={<AdminProtected><AdminCoaches /></AdminProtected>} />
      <Route path="admin/bookings" element={<AdminProtected><AdminBookings /></AdminProtected>} />
      <Route path="admin/users" element={<AdminProtected><AdminUsers /></AdminProtected>} />
      <Route path="admin/settings" element={<AdminProtected><AdminSettings /></AdminProtected>} />
      <Route path="*" element={<NotFound />} />
    </Route>
  )
);

const App = () => {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      }
    >
      <AuthProvider>
        <CartProvider>
          <RouterProvider router={router} />
          <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
        </CartProvider>
      </AuthProvider>
    </React.Suspense>
  );
};

export default App;
