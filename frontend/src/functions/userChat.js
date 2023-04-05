import axios from "axios";


export const getUserChat = async (userId) => {

    try {
      const { data } = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/chat/${userId}`);
      return data;
    } catch (error) {
      return error.response.data.message
    }
  }