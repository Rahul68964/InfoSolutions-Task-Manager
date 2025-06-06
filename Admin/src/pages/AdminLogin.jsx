import React, { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom';



const AdminLogin = ({setAdminToken}) => {
    const [currentState, setCurrentState] = useState('Login')
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const navigate = useNavigate();

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        try {
            if (currentState === 'Login') {
                const response = await axios.post(backendUrl + '/admin/login', { email, password });
                console.log(response);
                if (response.data.success) {
                    setAdminToken(response.data.token)
                    toast.success("Logined Successfully");
                    navigate('/admin/dashboard');
                }
                else {
                    toast.error(response.data.message);
                }
            }
            else{
                const response = await axios.post(backendUrl + '/admin/signup', { name, email, password });
                console.log(response);
                if (response.data.success) {
                    setAdminToken(response.data.token)
                    toast.success("Registerd Successfully");
                    navigate('/admin/dashboard');
                }
                else {
                    toast.error(response.data.message);
                }

            }



        } catch (error) {
            console.log(error);
            toast.error(error.message)
        }

    }
    return (
        <form onSubmit={onSubmitHandler} className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800'>
            <div className='inline-flex items-center gap-2 mb-2 mt-10'>
                <p className='prata-regular text-3xl'> Admin {currentState}</p>
                <hr className='border-none h-[1.5px] w-8 bg-gray-800' />
            </div>
            {currentState === 'Sign Up' ? <input onChange={(e) => setName(e.target.value)} type="text" placeholder='Name' className='w-full px-3 py-2 border border-gray-800' required /> : ''}
            <input onChange={(e) => setEmail(e.target.value)} type="email" placeholder='Email' className='w-full px-3 py-2 border border-gray-800' required />
            <input onChange={(e) => setPassword(e.target.value)} type="password" placeholder='Password' className='w-full px-3 py-2 border border-gray-800' required />
            <div className='w-full flex justify-between text-sm mt-[-8px]'>
                <p className='cursor-pointer'>Forgot your password</p>
                {
                    currentState === 'Login' ?
                        <p onClick={() => setCurrentState('Sign Up')} className='cursor-pointer'>Sign Up</p> :
                        <p onClick={() => setCurrentState('Login')} className='cursor-pointer'>Login</p>
                }
            </div>
            <button className='font-light px-8 mt-4 py-2 bg-black text-white'>{currentState === 'Login' ? 'Login' : 'Sign Up'}</button>
        </form>
    )
}

export default AdminLogin