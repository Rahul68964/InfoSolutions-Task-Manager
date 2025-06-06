import React, { useState } from 'react';
import AllUsersDisplay from './AllUsersDisplay';
import axios from 'axios'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const TaskForm = ({ adminToken }) => {
    const [addMember, setAddMember] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState([]);
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
            const response = await axios.post(backendUrl + '/admin/addtask', form, { headers: { adminToken } });
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
                setSelectedUsers([]);

                setAddMember(false);
            }
        } catch (error) {
            console.log(error);
            toast.error("Error to add task");
        } finally {


            setLoading(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto pb-6 pl-6 pr-6 bg-white shadow-lg rounded-xl ">
            <h2 className="text-2xl font-bold mb-6 text-center">Create Task</h2>
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

                {/* <button
                    type="button"
                    onClick={() => setAddMember(true)}
                    className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                >
                    Add Members
                </button>

                {selectedUsers.length > 0 && (
                    <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm mt-4">
                        <p className="text-base font-semibold text-gray-800 mb-2">Selected Members:</p>
                        {selectedUsers.length > 0 ? (
                            <ul className="list-disc list-inside text-gray-700 space-y-1">
                                {selectedUsers.map((user) => (
                                    <li key={user._id} className="pl-1">{user.name}</li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500 italic">No members selected.</p>
                        )}
                    </div>

                )}

                {addMember && (
                    <div className="mt-4 border-t pt-4">
                        <AllUsersDisplay onDone={handleUserSelection} setAddMember={setAddMember} />
                    </div>
                )} */}

                <button type="submit" className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600" disabled={loading}>
                    {loading ? 'Submitting...' : 'Submit'}
                </button>
            </form>
        </div>
    );
};

export default TaskForm;
