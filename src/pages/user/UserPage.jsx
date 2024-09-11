import React from 'react' 
import UserComp from '../../components/userComp'
import { useNavigate } from 'react-router';

const UserPage = () => {
    let navigate = useNavigate();
    
    const logout = () => {
        localStorage.removeItem("tokenbek");
        navigate("/login");
    };
  return (
    <div>
      <UserComp/>
      
    </div>
  )
}

export default UserPage
