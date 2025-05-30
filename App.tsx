import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import { AuthModal } from './components/AuthModal';
import { Navbar } from './components/Navbar';
import { HomePage } from './pages/HomePage';
import { ExplorePage } from './pages/ExplorePage';
import { ProfilePage } from './pages/ProfilePage';
import { RewardsPage } from './pages/RewardsPage';
import { User as UserType } from './types';
import { supabase } from './lib/supabase';

function App() {
  const [showAuth, setShowAuth] = useState(false);
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const checkUser = async () => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) {
        setUser(null);
        setLoading(false);
        return;
      }

      const [profileResponse, bookingsResponse] = await Promise.all([
        supabase
          .from('profiles')
          .select('*')
          .eq('id', authUser.id)
          .single(),
        supabase
          .from('bookings')
          .select('*')
          .eq('user_id', authUser.id)
      ]);

      let profile = profileResponse.data;
      if (!profile && !profileResponse.error) {
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert([{
            id: authUser.id,
            full_name: authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'User',
            created_at: new Date().toISOString()
          }])
          .select()
          .single();

        if (createError) throw createError;
        profile = newProfile;
      }

      if (profile) {
        setUser({
          id: authUser.id,
          name: profile.full_name,
          email: authUser.email!,
          avatar: profile.avatar_url,
          bookings: bookingsResponse.data || []
        });
      } else {
        throw new Error('Failed to load or create user profile');
      }
    } catch (error: any) {
      console.error('Error in checkUser:', error);
      toast.error('Failed to load user profile. Please try signing in again.');
      await supabase.auth.signOut();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        await checkUser();
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        navigate('/');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast.success('Signed out successfully');
    } catch (error) {
      toast.error('Failed to sign out');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      <Toaster position="top-right" />
      
      <Navbar 
        user={user}
        loading={loading}
        onSignOut={handleSignOut}
        onShowAuth={() => setShowAuth(true)}
      />

      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <HomePage user={user} onShowAuth={() => setShowAuth(true)} />
            </motion.div>
          } />
          <Route path="/explore" element={
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <ExplorePage user={user} onShowAuth={() => setShowAuth(true)} />
            </motion.div>
          } />
          <Route path="/profile" element={
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {user ? (
                <ProfilePage user={user} />
              ) : (
                <div className="container mx-auto px-4 py-8 text-center">
                  <h2 className="text-2xl font-semibold mb-4">Please sign in to view your profile</h2>
                  <button
                    onClick={() => setShowAuth(true)}
                    className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-6 py-2 rounded-xl hover:shadow-lg transition-all"
                  >
                    Sign In
                  </button>
                </div>
              )}
            </motion.div>
          } />
          <Route path="/rewards" element={
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {user ? (
                <RewardsPage />
              ) : (
                <div className="container mx-auto px-4 py-8 text-center">
                  <h2 className="text-2xl font-semibold mb-4">Please sign in to view your rewards</h2>
                  <button
                    onClick={() => setShowAuth(true)}
                    className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-6 py-2 rounded-xl hover:shadow-lg transition-all"
                  >
                    Sign In
                  </button>
                </div>
              )}
            </motion.div>
          } />
        </Routes>
      </AnimatePresence>

      {showAuth && (
        <AuthModal onClose={() => setShowAuth(false)} />
      )}
    </div>
  );
}

export default App