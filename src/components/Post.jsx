import { useState, useEffect } from "react";
import { Link, useParams, useOutletContext } from "react-router";
import { convertMessagesTimeFormat } from "../utils.jsx";

const publishedBadgeClass = "bg-green-100 text-green-800 px-2 py-0.5 rounded text-xs font-semibold";
const draftBadgeClass = "bg-amber-100 text-amber-800 px-2 py-0.5 rounded text-xs font-semibold";


export function PostsList() {
    const { posts,id } = useOutletContext();
    if (!posts) {
        return <div className="flex justify-center mt-8 text-slate-500">Loading posts...</div>;
    }

    if (posts.length === 0) {
        return <div className="flex justify-center mt-8 text-slate-500">No posts to display</div>;
    }

    return (
        <div className="flex flex-col items-center gap-4">
            {posts.map(post => (
                <PostCard
                    key={post.id}
                    postid={post.id}
                    userId={id}
                    postTitle={post.postTitle}
                    postContent={post.postContent}
                    createdAt={convertMessagesTimeFormat(post)}
                    isPublished={post.isPublished}
                />
            ))}
        </div>
    );
}

export function PostCard({ postTitle, postContent, createdAt, isPublished, postid, userId }) {
    return (
        <div className="flex flex-col items-left gap-3 border-1 border-slate-400 bg-slate-100 rounded-lg p-4 w-[95%] lg:w-[80%]">
            <div className="font-bold text-xl hover:underline"><Link to={`/users/${userId}/posts/${postid}`}>{postTitle}</Link></div>
            <div className="mt-3 relative max-h-[14rem] overflow-hidden">
                <div className="whitespace-pre-wrap">{postContent}</div>
                <div
                    className="absolute bottom-0 left-0 right-0 h-12 pointer-events-none bg-gradient-to-t from-slate-100 to-transparent"
                    aria-hidden="true"
                />
            </div>
            <div className="flex justify-between items-center text-sm mt-6">
                <span className={isPublished ? publishedBadgeClass : draftBadgeClass}>
                    {isPublished ? "Published" : "Draft"}
                </span>
                <div><span className="font-bold">Posted on:</span> {createdAt}</div>
            </div>
        </div>
    );
}

export function PostEditor() {
    const [postToEdit, setPostToEdit] = useState(null);
    const { userId, postId } = useParams();
    const isNew = postId ? true: false;

    useEffect(() => {
        if (isNew) return;

        async function fetchData(){
            const response = await fetch(`http://localhost:3000/posts/${postId}`, {
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            });
            const result = await response.json();
            const post = Array.isArray(result?.posts) ? result.posts[0] : null; 
            setPostToEdit(post);
        };
    })
};