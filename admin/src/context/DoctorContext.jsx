import { createContext, useState } from "react";
import axios from 'axios'
import { toast } from 'react-toastify'


export const DoctorContext = createContext()

const DoctorContextProvider = (props) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL?.replace(/\/$/, '') || 'http://localhost:5000'
    const [dToken, setDToken] = useState(localStorage.getItem('dToken') ? localStorage.getItem('dToken') : '')
    const [appointments, setAppointments] = useState([])
    const [dashData, setDashData] = useState(false)
    const [profileData, setProfileData] = useState(false)

    // Getting Doctor appointment data from Database using API
    const getAppointments = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/doctor/appointments`, 
                { 
                    headers: { dToken },
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

    // Getting Doctor profile data from Database using API
    const getProfileData = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/doctor/profile`, 
                { 
                    headers: { dToken },
                    withCredentials: true 
                }
            )
            if (data.success) {
                setProfileData(data.profileData)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.error('Error fetching profile:', error)
            toast.error(error.response?.data?.message || error.message || 'Failed to fetch profile')
        }
    }

    // Function to cancel doctor appointment using API
    const cancelAppointment = async (appointmentId) => {
        try {
            const { data } = await axios.post(`${backendUrl}/api/doctor/cancel-appointment`, 
                { appointmentId }, 
                { 
                    headers: { dToken },
                    withCredentials: true 
                }
            )
            if (data.success) {
                toast.success(data.message)
                getAppointments()
                getDashData()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.error('Error canceling appointment:', error)
            toast.error(error.response?.data?.message || error.message || 'Failed to cancel appointment')
        }
    }

    // Function to Mark appointment completed using API
    const completeAppointment = async (appointmentId) => {
        try {
            const { data } = await axios.post(`${backendUrl}/api/doctor/complete-appointment`, 
                { appointmentId }, 
                { 
                    headers: { dToken },
                    withCredentials: true 
                }
            )
            if (data.success) {
                toast.success(data.message)
                getAppointments()
                getDashData()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.error('Error completing appointment:', error)
            toast.error(error.response?.data?.message || error.message || 'Failed to complete appointment')
        }
    }

    // Getting Doctor dashboard data using API
    const getDashData = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/doctor/dashboard`, 
                { 
                    headers: { dToken },
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
        dToken, setDToken, backendUrl,
        appointments,
        getAppointments,
        cancelAppointment,
        completeAppointment,
        dashData, getDashData,
        profileData, setProfileData,
        getProfileData,
    }

    return (
        <DoctorContext.Provider value={value}>
            {props.children}
        </DoctorContext.Provider>
    )
}

export default DoctorContextProvider