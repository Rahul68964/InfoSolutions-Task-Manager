import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

const AllSubAgents = ({ userToken }) => {
  const [agents, setAgents] = useState([])
  const [loading, setLoading] = useState(true) // <-- loading state
  const [showModal, setShowModal] = useState(false)
  const [editingAgent, setEditingAgent] = useState(null)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')

  const backendUrl = import.meta.env.VITE_BACKEND_URL

  const fetchAgents = async () => {
    try {
      setLoading(true)
      const res = await axios.post(`${backendUrl}/user/getAllSubAgents`, {}, {
        headers: { userToken }
      })

      if (res.data.success) {
        setAgents(res.data.SubAgents)
      } else {
        toast.error(res.data.message)
      }
    } catch (err) {
      console.error(err)
      toast.error('Failed to load Sub Agents')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      const response = await axios.post(`${backendUrl}/user/deleteSubAgent`, { agentId: id }, {
        headers: { userToken }
      })
      if (response.data.success) {
        setAgents(agents.filter(agent => agent._id !== id))
        toast.success('SubAgent deleted successfully')
      } else {
        toast.error(response.data.message)
      }

    } catch (error) {
      console.error('Error deleting SubAgent:', error)
      toast.error('Failed to delete SubAgent')
    }
  }

  const handleUpdate = (agent) => {
    setEditingAgent(agent)
    setName(agent.name)
    setEmail(agent.email)
    setPhone(agent.phone)
    setShowModal(true)
  }

  const handleUpdateSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post(`${backendUrl}/user/updateSubAgent`, {
        agentId: editingAgent._id,
        name, email, phone
      }, {
        headers: { userToken }
      })

      if (res.data.success) {
        toast.success("SubAgent updated successfully")
        fetchAgents()
        setShowModal(false)
      } else {
        toast.error(res.data.message)
      }

    } catch (error) {
      console.error(error)
      toast.error('Failed to update SubAgent')
    }
  }

  useEffect(() => {
    fetchAgents()
  }, [])

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-10">
      <h1 className="text-3xl font-semibold text-blue-800 mb-6 text-center">All Sub Agents</h1>

      {loading ? (
        <div className="flex justify-center items-center h-60">
          <div className="h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          {agents.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {agents.map(agent => (
                <div key={agent._id} className="bg-white shadow-md rounded-2xl p-6 hover:shadow-lg transition-all">
                  <h2 className="text-xl font-bold text-gray-800 mb-2">{agent.name}</h2>
                  <p className="text-gray-600 mb-1"><strong>Email:</strong> {agent.email}</p>
                  <p className="text-gray-600 mb-4"><strong>Phone:</strong> {agent.phone}</p>

                  <div className="flex justify-between">
                    <button
                      onClick={() => handleUpdate(agent)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => handleDelete(agent._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 mt-10">No agents found.</p>
          )}
        </>
      )}

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-md">
            <h2 className="text-xl font-semibold text-blue-700 mb-4">Update Agent</h2>
            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-300 rounded-md">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AllSubAgents
