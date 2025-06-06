import { use, useEffect, useState } from "react"
import { Route, Routes } from "react-router-dom"
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import { ToastContainer, toast } from 'react-toastify';
import AddingAgent from "./pages/AddingAgent";
import AllAgents from "./pages/AllAgents";



function App() {
  const [adminToken, setAdminToken] = useState(localStorage.getItem("adminToken")? localStorage.getItem("adminToken") : '')

  useEffect(() => {
    localStorage.setItem("adminToken", adminToken)
  },[adminToken])


  return (
    <div>
      <ToastContainer />
      {
        adminToken === '' ? (
          <AdminLogin setAdminToken={setAdminToken}/>
        ):(
          <Routes>
            <Route path="/admin/dashboard" element={<AdminDashboard adminToken={adminToken} setAdminToken={setAdminToken}/>} />
            <Route path="/" element={<AdminDashboard adminToken={adminToken} setAdminToken={setAdminToken}/>} />
            <Route path="/add-agent" element={<AddingAgent adminToken={adminToken} setAdminToken={setAdminToken}/>} />
            <Route path="/all-agents" element={<AllAgents adminToken={adminToken} setAdminToken={setAdminToken}/>} />
          </Routes>
        )
      }
    </div>
  )
}
{/* <Route path="/" element={<AdminLogin />} />
<Route path="/admin/dashboard" element={<AdminDashboard />} /> */}
export default App
