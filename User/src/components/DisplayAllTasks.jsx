import React, { useState, useEffect } from 'react'
import Task from './Task'
import axios from 'axios'

const DisplayAllTasks = ({ userToken }) => {

  const [taskArray, setTaskArray] = useState([])
  const [loading, setLoading] = useState(true) // 🔁 Loader state

  const backendUrl = import.meta.env.VITE_BACKEND_URL

  const getAllTasks = async () => {
    try {
      setLoading(true)
      const response = await axios.post(backendUrl + '/user/getAllTasks', {}, { headers: { userToken } })
      if (response.data.success) {
        setTaskArray(response.data.taskArray)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getAllTasks()
  }, [userToken])

  return (
    <div className='h-full'>

      {loading ? (
        <div className="flex justify-center items-center h-60">
          <div className="h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          {taskArray.length > 0 ? (
            <div className='grid grid-cols-4 gap-5'>
              {taskArray.map((task, index) => (
                <Task key={index} task={task.taskDetails} csvPart={task.csvPart} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col mt-30 items-center w-full h-full text-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
              </svg>

              <h1 className="text-2xl font-semibold text-gray-600">No Task Assigned</h1>
              <p className="text-gray-500 mt-2">Sit back and relax!</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default DisplayAllTasks
