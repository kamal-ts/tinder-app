import axios from 'axios';


// TODO UPDATE THE BASE URL HERE SO THAT IT WORKS IN THE DEVELOPMENT AS WELL
export const axiosInstance = axios.create({
    baseURL: "http://localhost:5000/api",
    withCredentials: true
})