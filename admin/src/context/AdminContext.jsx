import axios from "axios";
import { createContext, useState } from "react";
import { toast } from "react-toastify";


export const AdminContext = createContext()

const AdminContextProvider = (props) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL?.replace(/\/$/, '') || 'http://localhost:5000'
    const [aToken, setAToken] = useState(localStorage.getItem('aToken') ? localStorage.getItem('aToken') : '')
    const [appointments, setAppointments] = useState([])
    const [doctors, setDoctors] = useState([])
    const [dashData, setDashData] = useState(false)

    // Getting all Doctors data from Database using API
    const getAllDoctors = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/admin/all-doctors`, 
                { 
                    headers: { aToken },
                    withCredentials: true 
                }
            )
            if (data.success) {
                setDoctors(data.doctors)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.error('Error fetching doctors:', error)
            toast.error(error.response?.data?.message || error.message || 'Failed to fetch doctors')
        }
    }

    // Function to change doctor availablity using API
    const changeAvailability = async (docId) => {
        try {
            const { data } = await axios.post(`${backendUrl}/api/admin/change-availability`, 
                { docId }, 
                { 
                    headers: { aToken },
                    withCredentials: true 
                }
            )
            if (data.success) {
                toast.success(data.message)
                getAllDoctors()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.error('Error changing availability:', error)
            toast.error(error.response?.data?.message || error.message || 'Failed to change availability')
        }
    }

    // Getting all appointment data from Database using API
    const getAllAppointments = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/admin/appointments`, 
                { 
                    headers: { aToken },
                    withCredentials: true 
                }
            )
            if (data.success) {
                setAppointments(data.appointments.reverse())
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.error('Error fetching appointments:', error)
            toast.error(error.response?.data?.message || error.message || 'Failed to fetch appointments')
        }
    }

    // Function to cancel appointment using API
    const cancelAppointment = async (appointmentId) => {
        try {
            const { data } = await axios.post(`${backendUrl}/api/admin/cancel-appointment`, 
                { appointmentId }, 
                { 
                    headers: { aToken },
                    withCredentials: true 
                }
            )
            if (data.success) {
                toast.success(data.message)
                getAllAppointments()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.error('Error canceling appointment:', error)
            toast.error(error.response?.data?.message || error.message || 'Failed to cancel appointment')
        }
    }

    // Getting Admin Dashboard data from Database using API
    const getDashData = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/admin/dashboard`, 
                { 
                    headers: { aToken },
                    withCredentials: true 
                }
            )
            if (data.success) {
                setDashData(data.dashData)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.error('Error fetching dashboard data:', error)
            toast.error(error.response?.data?.message || error.message || 'Failed to fetch dashboard data')
        }
    }

    const value = {
        aToken, setAToken,
        doctors,
        getAllDoctors,
        changeAvailability,
        appointments,
        getAllAppointments,
        getDashData,
        cancelAppointment,
        dashData
    }

    return (
        <AdminContext.Provider value={value}>
            {props.children}
        </AdminContext.Provider>
    )
}

export default AdminContextProvider