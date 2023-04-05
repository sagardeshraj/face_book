import axios from 'axios'


export const getMessages = async(id)=>{
    try {
      const { data } = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/message/${id}`);
      return data;
    } catch (error) {
      return error.response.data.message
    }
  }

export const addMessage = async( messageData) =>{
    try {

      const { data } = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/message`, messageData );
      return data;
    } catch (error) {
      return error.response.data.message
    }
  }

  export const getAllMessages = async (a,b) => {

    try {
      const { data } = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/getAllChats/${a}/${b}`);
      return data;
    } catch (error) {
      return error.response.data.message
    }
  }

