import React, { useState, useContext } from 'react';
import { authDataContext } from '../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Registration = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { backendUrl } = useContext(authDataContext);

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        
        // FIX: Added 'email &&' to prevent the endsWith crash
        if (email && !email.endsWith("@gmail.com")) {
            return toast.error("Please use a valid @gmail.com address");
        }

        try {
            const response = await axios.post(`${backendUrl}/api/auth/registration`, { name, email, password });
            if (response.data.success) {
                toast.success("Registration Successful!");
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error("Signup Error Details:", error.message);
            toast.error("Registration failed. Check console for details.");
        }
    };

    return (
        <form onSubmit={onSubmitHandler} className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4">
            <input onChange={(e) => setName(e.target.value)} value={name} type="text" placeholder="Name" className="w-full px-3 py-2 border border-gray-800" required />
            <input onChange={(e) => setEmail(e.target.value)} value={email} type="email" placeholder="Email" className="w-full px-3 py-2 border border-gray-800" required />
            <input onChange={(e) => setPassword(e.target.value)} value={password} type="password" placeholder="Password" className="w-full px-3 py-2 border border-gray-800" required />
            <button className="bg-black text-white font-light px-8 py-2 mt-4">Sign Up</button>
        </form>
    );
};

export default Registration;