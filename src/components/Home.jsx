import { useState, useEffect } from "react";
import { NavLink, useParams, useOutletContext, useNavigate, Outlet, Navigate } from "react-router";
import { PostCard, PostsList, PostEditor } from "./Post.jsx";
import { CommentsList } from "./Comments.jsx";

function Home() {
    const { userId } = useParams();
    const { isAuth, isLoading, user } = useOutletContext();
    const [posts, setPosts] = useState(null);
    console.log("reached step 2")
    useEffect(() => {
        if (!isAuth) return;
        
        async function fetchPosts() {
            const response = await fetch(`http://localhost:3000/users/${userId}/posts`, {
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: 'include',
            });
            const result = await response.json();
            setPosts(Array.isArray(result) ? result : []);
        }

        fetchPosts();
    }, [userId, isAuth]);
    
    if (isLoading) {
        return <div>Loading...</div>
    }

    if (!isAuth) {
        return <Navigate to="http://localhost:5173" replace />
    };

    return (
        <div className="flex h-full">
            <aside className="w-48 shrink-0 border-r border-slate-300 bg-slate-50 flex flex-col pt-6 gap-2 px-3">
                <NavLink
                    to={`/users/${userId}/posts`}
                    className={({ isActive }) => `w-full text-left px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:cursor-pointer ${isActive ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-900 hover:bg-slate-200"}`}
                >
                    Posts
                </NavLink>
                <NavLink
                    to={`/users/${userId}/comments`}
                    className={({ isActive }) =>`w-full text-left px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:cursor-pointer ${isActive ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-900 hover:bg-slate-200"}`}
                >
                    Comments
                </NavLink>
            </aside>
            <main className="flex-1 overflow-auto p-6">
                <Outlet context={{posts, id: userId}} />
            </main>
        </div>
    );
}

export default Home;