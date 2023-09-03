import axios from "axios";

const Axios = axios.create({
    baseURL : import.meta.env.API_URL || "http://localhost:3000"
})

export default Axios;

