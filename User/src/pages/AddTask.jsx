import React, { useState } from 'react';
import axios from 'axios'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const AddTask = ({ userToken }) => {
    const [loading, setLoading] = useState(false);
    const [fileInputKey, setFileInputKey] = useState(Date.now());



    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const [formData, setFormData] = useState({
        taskName: '',
        taskDescription: '',
        endDate: '',
        file: false
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleUserSelection = (users) => {
        setSelectedUsers(users);
        setAddMember(false);
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const form = new FormData();
        form.append('taskName', formData.taskName);
        form.append('taskDescription', formData.taskDescription);
        form.append('endDate', formData.endDate);
        form.append('file', formData.file);

        try {
            const response = await axios.post(backendUrl + '/user/addTaskToSubAgent', form, { headers: { userToken } });
            console.log("Response", response.data)

            if (response.data.success) {
                toast.success(response.data.message)
                setFormData({
                    taskName: '',
                    taskDescription: '',
                    endDate: '',
                    file: false
                });

                setFileInputKey(Date.now());
            }
        } catch (error) {
            console.log(error);
            toast.error("Error to add task");
        } finally {


            setLoading(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto pb-6 pl-6 pr-6 bg-white shadow-lg rounded-xl mt-30">
            <h2 className="text-2xl mb-6 text-center font-medium">Add Task For SubAgents</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    required
                    name="taskName"
                    onChange={handleInputChange}
                    type="text"
                    value={formData.taskName}
                    placeholder="Task Name"
                    className="w-full p-2 border border-gray-300 rounded"
                />
                <textarea
                    required
                    name="taskDescription"
                    onChange={handleInputChange}
                    placeholder="Task Description"
                    value={formData.taskDescription}
                    className="w-full p-2 border border-gray-300 rounded"
                ></textarea>

                <div className="flex gap-4 items-center">
                    <p className='border border-gray-300 p-2 rounded flex gap-4 items-center'>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
                            <path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 6a.75.75 0 0 0-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 0 0 0-1.5h-3.75V6Z" clip-rule="evenodd" />
                        </svg>

                        Deadline</p>
                    <input
                        required
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleInputChange}
                        placeholder='End Date'
                        type="date"
                        className="w-72 p-2 border border-gray-300 rounded"
                    />
                </div>
                <input
                    onChange={(e) => setFormData((prevData) => ({
                        ...prevData,
                        file: e.target.files[0]
                    }))}
                    required
                    key={fileInputKey}
                    type="file"
                    accept=".csv"
                    className="w-full p-2 border border-gray-300 rounded"
                />

                <button type="submit" className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600" disabled={loading}>
                    {loading ? 'Submitting...' : 'Submit'}
                </button>
            </form>
        </div>
    );
};

export default AddTask;