import React, { useState, useContext } from 'react';
import { adminDataContext } from '../context/AdminContext';
import { toast } from 'react-toastify';
import Loading from '../component/Loading'; // Ensure this path is correct

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localLoading, setLocalLoading] = useState(false);

  // Context se login functions nikaalein
  const { loginAdmin, getAdmin } = useContext(adminDataContext);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLocalLoading(true);

    try {
      const success = await loginAdmin(email, password);
      if (success) {
        // Login success ke baad admin data fetch karna zaroori hai
        // taaki App.jsx mein 'adminData' update ho aur buffer ruk jaye
        await getAdmin(); 
      }
    } catch (error) {
      console.error("Login UI Error:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setLocalLoading(false);
    }
  };

  return (
    <div className='w-[100vw] h-[100vh] bg-gradient-to-l from-[#141414] to-[#0c2025] flex items-center justify-center p-4'>
      <div className='w-full max-w-[450px] bg-[#1a1a1a]/80 backdrop-blur-md border border-gray-800 p-8 md:p-10 rounded-2xl shadow-2xl'>
        
        <div className='flex flex-col items-center mb-8'>
          <h1 className='text-4xl font-bold text-white tracking-tight'>One<span className='text-[#46d1f7]'>Cart</span></h1>
          <p className='text-gray-400 mt-2 text-sm uppercase tracking-widest'>Admin Control Panel</p>
        </div>

        <form onSubmit={onSubmitHandler} className='flex flex-col gap-5'>
          <div className='flex flex-col gap-2'>
            <label className='text-gray-300 text-sm font-medium ml-1'>Admin Email</label>
            <input 
              type="email" 
              placeholder='Enter your email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='w-full bg-[#0c2025] border border-gray-700 p-3.5 rounded-xl text-white focus:outline-none focus:border-[#46d1f7] transition-all'
              required 
            />
          </div>

          <div className='flex flex-col gap-2'>
            <label className='text-gray-300 text-sm font-medium ml-1'>Password</label>
            <input 
              type="password" 
              placeholder='Enter your password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='w-full bg-[#0c2025] border border-gray-700 p-3.5 rounded-xl text-white focus:outline-none focus:border-[#46d1f7] transition-all'
              required 
            />
          </div>

          <button 
            type="submit" 
            disabled={localLoading}
            className='w-full mt-4 py-4 bg-[#46d1f7] text-black font-bold rounded-xl hover:bg-[#3bb8db] transform active:scale-95 transition-all flex items-center justify-center'
          >
            {localLoading ? <Loading /> : "LOG IN TO DASHBOARD"}
          </button>
        </form>

        <p className='text-center text-gray-500 text-xs mt-8'>
          &copy; 2026 OneCart E-commerce System
        </p>
      </div>
    </div>
  );
}

export default Login;