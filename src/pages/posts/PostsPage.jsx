import React from 'react'
import PostsComp from '../../components/posts/postsComp'
import { useNavigate } from 'react-router';
import PostDetail from '../../components/posts/PostDetail';


const PostsPage = () => {
    let navigate = useNavigate();
    
    const logout = () => {
        localStorage.removeItem("tokenbek");
        navigate("/login");
    };
  return (
    <div>
      <PostsComp/>
      <button onClick={logout}>
        Log out
      </button>
    </div>

  )
}

export default PostsPage
