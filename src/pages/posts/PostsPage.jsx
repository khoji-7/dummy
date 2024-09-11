import React from 'react'
import PostsComp from '../../components/posts/postsComp'
import { useNavigate } from 'react-router';


const PostsPage = () => {
    let navigate = useNavigate();
    
    const logout = () => {
        localStorage.removeItem("tokenbek");
        navigate("/login");
    };
  return (
    <div>
      <PostsComp/>
      
    </div>

  )
}

export default PostsPage
