import { useState, useEffect } from "react";
import { NavLink, useParams, useOutletContext, useNavigate, Outlet, Navigate, useLocation } from "react-router";

function Home() {
    const { userId } = useParams();
    const { isAuth, isLoading, user } = useOutletContext();
    const navigate = useNavigate();
    const location = useLocation();
    const [posts, setPosts] = useState(null);
    
    const refreshKey = location?.state?.refreshKey;
    const isPostsRoute = location.pathname.replace(/\/$/, "") === `/users/${userId}/posts`;

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
    }, [userId, isAuth, refreshKey]);
    
    if (isLoading) {
        return <div>Loading...</div>
    }

    if (!isAuth) {
        return <Navigate to="http://localhost:5173" replace />
    };

    return (
        <div className="relative flex h-full">
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
            {isPostsRoute && (
                <button
                    type="button"
                    onClick={() => navigate(`/users/${userId}/posts/new`)}
                    className="fixed bottom-6 right-6 rounded-full bg-slate-900 px-5 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:cursor-pointer hover:bg-slate-700"
                >
                    New Post +
                </button>
            )}
        </div>
    );
}

export default Home;