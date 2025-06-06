import React from 'react'
import DisplayAllTasks from '../components/DisplayAllTasks'
import { Link, useNavigate } from 'react-router-dom'
import { useEffect } from 'react';

const UserDashboard = ({ userToken, setUserToken }) => {

  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('userToken');
    setUserToken('')
    navigate('/');
  };

  useEffect(() => {
    if (!userToken) {
      navigate('/', { replace: true });
    }
  }, [userToken]);

  return (
    <div className='p-5 h-lvh '>
      <h2 className="flex justify-between bg-blue-50 border border-blue-200 rounded-xl shadow-sm mb-2 p-4">
        <div className=' flex text-3xl font-bold text-blue-300 '>My Tasks</div>
        <div className='inline-flex items-center gap-2'>
          <Link to={'/add-subagent'} className='bg-blue-400 p-2 text-white rounded'>Add SubAgent</Link>
          <Link to={'/see-subagents'} className='bg-green-500 p-2 text-white rounded'>See All SubAgents</Link>
          <Link to={'/add-task'} className='bg-yellow-500 p-2 text-white rounded'>Add Task</Link>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition duration-300 flex gap-0.5">

            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
              <path fill-rule="evenodd" d="M7.5 3.75A1.5 1.5 0 0 0 6 5.25v13.5a1.5 1.5 0 0 0 1.5 1.5h6a1.5 1.5 0 0 0 1.5-1.5V15a.75.75 0 0 1 1.5 0v3.75a3 3 0 0 1-3 3h-6a3 3 0 0 1-3-3V5.25a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3V9A.75.75 0 0 1 15 9V5.25a1.5 1.5 0 0 0-1.5-1.5h-6Zm10.72 4.72a.75.75 0 0 1 1.06 0l3 3a.75.75 0 0 1 0 1.06l-3 3a.75.75 0 1 1-1.06-1.06l1.72-1.72H9a.75.75 0 0 1 0-1.5h10.94l-1.72-1.72a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" />
            </svg>

            Logout
          </button>
        </div>

      </h2>

      <div className='h-full '>
        <DisplayAllTasks userToken={userToken} />
      </div>

    </div>
  )
}

export default UserDashboard