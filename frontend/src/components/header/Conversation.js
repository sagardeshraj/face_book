import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { getUser } from "../../functions/user"



function Conversation({chat}) {
const {user} = useSelector((state)=>({...state}))
const [otherUser, setOtherUser] = useState({})
 
useEffect(()=> {

    const userId = chat.members.find((id)=>id!==user.id)
    const getUserData = async ()=> {
      try
      {
          const data =await getUser(userId)
          setOtherUser(data)
      }
      catch(error)
      {
        console.log(error)
      }
    }
    getUserData();
  }, [])

  return (
    <div className="conversation">
       <img src={otherUser?.picture} alt="kln"/>
        <div className="info">
            <span>{otherUser.first_name}</span>
        </div>
    </div>
  )
}

export default Conversation