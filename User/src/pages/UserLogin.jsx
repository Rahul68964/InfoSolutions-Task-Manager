import React, { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom';



const UserLogin = ({ setUserToken }) => {
    const [currentState, setCurrentState] = useState('Login')
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [phone, setPhone] = useState('')
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const navigate = useNavigate();

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(backendUrl + '/user/login', { email, password });
           
                if (response.data.success) {
                    setUserToken(response.data.token);
                    toast.success("Logined Successfully");
                    navigate('/user/dashboard');
                }
                else {
                    toast.error(response.data.message);
                }
            


        } catch (error) {
            console.log(error);
            toast.error(error.message)
        }

    }
    return (
        <form onSubmit={onSubmitHandler} className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-blue-800'>
            <div className='inline-flex items-center gap-2 mb-2 mt-10'>
                <p className='prata-regular text-3xl text-blue-800'> User {currentState}</p>
                <hr className='border-none h-[1.5px] w-8 bg-blue-800' />
            </div>
            

            <input onChange={(e) => setEmail(e.target.value)} type="email" placeholder='Email' className='w-full px-3 py-2 border border-gray-800' required />
            <input onChange={(e) => setPassword(e.target.value)} type="password" placeholder='Password' className='w-full px-3 py-2 border border-gray-800' required />
           
            <button className='font-light px-8 mt-4 py-2 bg-blue-600 text-white'>{currentState === 'Login' ? 'Login' : 'Sign Up'}</button>
        </form>
    )
}

export default UserLogin