import React, { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom';



const AddSubAgent = ({ userToken }) => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [phone, setPhone] = useState('')
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const navigate = useNavigate();

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        try {

            const response = await axios.post(backendUrl + '/user/createSubAgent', { name, email, password, phone }, { headers: { userToken } });
            console.log(response);
            if (response.data.success) {
                toast.success("SubAgent added Successfully");
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
                <p className='prata-regular text-3xl text-green-800'> Add SubAgent</p>
                <hr className='border-none h-[1.5px] w-8 bg-green-800' />
            </div>
            <>
                <input onChange={(e) => setName(e.target.value)} type="text" placeholder='Name' className='w-full px-3 py-2 border border-gray-800 text-green-800' required />
                <div className="w-full">
                    <div className="flex">
                        <select
                            className="border border-gray-300 bg-gray-100 px-3 py-2 text-green-800 rounded-l-md text-sm"
                            defaultValue="+91"
                        >
                            <option value="+91">🇮🇳 +91</option>
                            <option value="+1">🇺🇸 +1</option>
                            <option value="+44">🇬🇧 +44</option>
                            <option value="+61">🇦🇺 +61</option>
                            {/* Add more country codes as needed */}
                        </select>
                        <input
                            onChange={(e) => setPhone(e.target.value)}
                            type="tel"
                            id="phone"
                            placeholder="Phone number"
                            className="flex-1 px-3 py-2 border-t border-b border-r border-gray-300 rounded-r-md text-green-800 "
                            required
                        />
                    </div>
                </div>


            </>





            <input onChange={(e) => setEmail(e.target.value)} type="email" placeholder='Email' className='w-full px-3 py-2 border border-gray-800 text-green-800' required />
            <input onChange={(e) => setPassword(e.target.value)} type="password" placeholder='Password' className='w-full px-3 py-2 border border-gray-800 text-green-800' required />

            <button className='font-light px-8 mt-4 py-2 bg-green-600 text-white'>Add</button>
        </form>
    )
}

export default AddSubAgent