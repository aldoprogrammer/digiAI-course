import { useEffect } from 'react';
import { Route, Routes, useSearchParams } from 'react-router-dom';

import ProtectedRoute from './components/features/ProtectedRoute/ProtectedRoute';
import useICP from './hooks/useICP';
import useUser from './hooks/useUser';
import ContentPage from './pages/ContentPage';
import ExplorePage from './pages/ExplorePage';
import LandingPage from './pages/LandingPage';
import CreatePostPage from './pages/user/courses/CreatePostPage';
import CreatorStudioPage from './pages/user/courses/CreatorStudioPage';
import MyFollowersPage from './pages/user/courses/MyFollowersPage';
import MyReferrals from './pages/user/courses/MyReferralsPage';
import MySupporterPage from './pages/user/courses/MySupporterPage';
import WalletPage from './pages/user/courses/WalletPage';
import ProfilePage from './pages/user/ProfilePage';
import DiscoverPage from './pages/user/supporter/DiscoverPage';
import FollowedCreatorsPage from './pages/user/supporter/FollowedCreatorsPage';
import PurchasedContentPage from './pages/user/supporter/PurchasedContentPage';
import StudentEnrolledPage from './pages/user/supporter/StudentEnrolledPage';
import ViewedProfilePage from './pages/user/ViewedProfilePage';
import { useAuthManager } from './store/AuthProvider';

function App() {
  const [searchParams] = useSearchParams();

  const { updateReferralCode } = useUser();
  const { initializeAuth, isAuthenticated } = useAuthManager();
  const { fetchIcpUsdPrice, icpPrice } = useICP();

  // INITIALIZE AUTHENTICATION
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // FETCH ICP PRICE
  useEffect(() => {
    const loadPrice = async () => {
      try {
        await fetchIcpUsdPrice();
      } catch (error) {
        console.error('Failed to fetch ICP price:', error);
      }
    };

    if (!icpPrice || icpPrice === 0) loadPrice();

    const intervalId = setInterval(loadPrice, 30000);

    return () => clearInterval(intervalId);
  }, [fetchIcpUsdPrice, icpPrice]);

  useEffect(() => {
    const referralCode = searchParams.get('referral');
    if (referralCode) updateReferralCode(referralCode);
  }, [searchParams, updateReferralCode]);

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/courses" element={<ExplorePage />} />
      <Route path="/courses/:username" element={<ViewedProfilePage />} />
      <Route path="/courses/content/:contentId" element={<ContentPage />} />

      {/* Protected Routes = Authenticated */}
      <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
        {/* Supporter Dashboard */}
        <Route path="/dashboard/discover" element={<DiscoverPage />} />
        <Route
          path="/dashboard/purchased-content"
          element={<PurchasedContentPage />}
        />
        <Route path="/dashboard/following" element={<FollowedCreatorsPage />} />
        <Route path="/dashboard/support-given" element={<StudentEnrolledPage />} />

        {/* Creator Dashboard */}
        <Route path="/dashboard" element={<ProfilePage />} />
        <Route
          path="/dashboard/courses-studio"
          element={<CreatorStudioPage />}
        />
        <Route
          path="/dashboard/courses-studio/post"
          element={<CreatePostPage />}
        />
        <Route path="/dashboard/wallet" element={<WalletPage />} />
        <Route path="/dashboard/supporter" element={<MySupporterPage />} />
        <Route path="/dashboard/followers" element={<MyFollowersPage />} />
        <Route path="/dashboard/referrals" element={<MyReferrals />} />
      </Route>
    </Routes>
  );
}

export default App;
