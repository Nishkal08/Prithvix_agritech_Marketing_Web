import { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, ShieldCheck, WifiOff, Users } from 'lucide-react';
import { AuthContext } from '../../../context/AuthContext';
import PageTransition from '../ui/PageTransition';
import Logo from '../../ui/Logo';
import CropField from '../../3d/CropField';
import Button from '../../ui/Button';

export default function Login() {
  const [activeTab, setActiveTab] = useState('dealer'); // 'dealer' or 'staff'
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  
  const { loginDealer, loginStaff, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  // If user came from marketing site, we apply a delayed fade in
  const cameFromMarketing = location.key === 'default';

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (activeTab === 'dealer') {
      if (!email.includes('@')) {
        setError('Please enter a valid email.');
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters.');
        return;
      }
      const res = loginDealer(email, password);
      if (!res.success) setError(res.message);
    } else {
      if (!username) {
        setError('Please enter your staff username.');
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters.');
        return;
      }
      const res = loginStaff(username, password);
      if (!res.success) setError(res.message);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-offwhite flex flex-col md:flex-row font-ui">
        
        {/* Left Brand Panel - Hidden on very small mobile, visible md+ */}
        <div className="hidden md:flex md:w-[45%] bg-dark text-offwhite flex-col justify-center px-12 lg:px-20 relative overflow-hidden">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="z-10"
          >
            <Logo variant="light" className="mb-6 h-10 w-auto" />
            <h1 className="font-display font-bold text-4xl lg:text-5xl leading-tight mb-4 tracking-tight">
              Kisan ka saathi.<br/>Dealer ka software.
            </h1>
            <p className="text-muted text-lg mb-10 max-w-sm">
              The smartest way to manage your input shop, track Udhaar, and advise farmers.
            </p>

            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-forest flex items-center justify-center text-gold">
                  <ShieldCheck size={20} />
                </div>
                <span className="text-sm font-medium">Made in India. Built for Bharat.</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-forest flex items-center justify-center text-gold">
                  <WifiOff size={20} />
                </div>
                <span className="text-sm font-medium">Offline-First Capabilities</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-forest flex items-center justify-center text-gold">
                  <Users size={20} />
                </div>
                <span className="text-sm font-medium">Trusted by 2000+ Farmers</span>
              </div>
            </div>
          </motion.div>

          {/* Background 3D element */}
          <div className="absolute -bottom-32 -right-32 w-96 h-96 opacity-40 pointer-events-none">
            <CropField className="w-full h-full" />
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-24 bg-offwhite py-12">
          
          <div className="w-full max-w-sm mx-auto">
            {/* Mobile Logo Fallback */}
            <div className="md:hidden mb-12 flex justify-center">
              <Logo variant="dark" className="h-8 w-auto" />
            </div>

            <motion.div
              initial={cameFromMarketing ? { opacity: 0 } : false}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              <h2 className="font-display font-bold text-3xl text-dark mb-2">Welcome back</h2>
              <p className="text-secondary text-sm mb-8">Sign in to your Prithvix dashboard.</p>

              {/* Tabs */}
              <motion.div 
                className="flex border-b border-[#E8E3DA] mb-8 relative"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                {['dealer', 'staff'].map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => {
                      setActiveTab(tab);
                      setError('');
                    }}
                    className={`flex-1 pb-3 text-sm font-medium transition-colors relative capitalize ${
                      activeTab === tab ? 'text-dark' : 'text-muted hover:text-secondary'
                    }`}
                  >
                    {tab} Login
                    {activeTab === tab && (
                      <motion.div
                        layoutId="tab-indicator"
                        className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-gold"
                        transition={{ duration: 0.2 }}
                      />
                    )}
                  </button>
                ))}
              </motion.div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                {activeTab === 'dealer' ? (
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ staggerChildren: 0.08 }}
                    className="flex flex-col gap-5"
                  >
                    <div>
                      <label className="block text-sm font-medium text-dark mb-1.5">Email address</label>
                      <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="dealer@example.com"
                        className="w-full bg-white border border-[#E8E3DA] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-colors"
                      />
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col gap-5"
                  >
                    <div>
                      <label className="block text-sm font-medium text-dark mb-1.5">Staff Username</label>
                      <input 
                        type="text" 
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="staff_username"
                        className="w-full bg-white border border-[#E8E3DA] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-colors"
                      />
                    </div>
                  </motion.div>
                )}

                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 }}
                >
                  <label className="block text-sm font-medium text-dark mb-1.5">Password</label>
                  <div className="relative">
                    <input 
                      type={showPassword ? "text" : "password"} 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-white border border-[#E8E3DA] rounded-xl pl-4 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-colors"
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-dark transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  
                  {/* Forgot Password */}
                  <div className="pt-2 flex justify-end">
                    <a href="#" className="text-xs text-muted hover:text-gold transition-colors">Forgot Password?</a>
                  </div>
                </motion.div>

                {/* Error Message */}
                {error && (
                  <motion.p 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} 
                    className="text-[#D44A4A] text-xs font-medium"
                  >
                    {error}
                  </motion.p>
                )}

                {/* Submit */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="mt-2"
                >
                  <Button type="submit" variant="primary" className="w-full font-display py-3.5 rounded-xl">
                    Sign In
                  </Button>
                </motion.div>
              </form>

              {/* Dev Note */}
              <div className="mt-8 p-4 bg-[#EDE8DF] rounded-xl text-xs text-secondary border border-[#E8E3DA]/50">
                <span className="font-semibold block mb-1">Demo Credentials:</span>
                <div>Dealer: demo@prithvix.com / Prithvix@123</div>
                <div>Staff: staff_demo / Staff@123</div>
              </div>

            </motion.div>
          </div>

        </div>
      </div>
    </PageTransition>
  );
}
