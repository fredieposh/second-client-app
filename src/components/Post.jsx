import { useState, useEffect } from "react";
import { Link, useParams, useOutletContext, useLocation, useNavigate } from "react-router";
import { convertMessagesTimeFormat } from "../utils.jsx";
import { useEditor, EditorContent } from "@tiptap/react";
import { generateHTML } from "@tiptap/html";
import StarterKit from "@tiptap/starter-kit";
import { contentToTiptap, handlePostUpdate, isContentJson } from "../utils.jsx";
import Toolbar from "./Toolbar.jsx";

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

    const html = isContentJson(postContent) ?
        generateHTML(JSON.parse(postContent), [StarterKit]) :
        null;

    return (
        <div className="flex flex-col items-left gap-3 border-1 border-slate-400 bg-slate-100 rounded-lg p-4 w-[95%] lg:w-[80%]">
            <div className="font-bold text-xl">{postTitle}</div>
            <div className="mt-3 relative max-h-[14rem] overflow-hidden">
                {html
                    ?<div dangerouslySetInnerHTML={{ __html: html }} />
                    :<div className="whitespace-pre-wrap">{postContent}</div>
                    }
                <div
                    className="absolute bottom-0 left-0 right-0 h-12 pointer-events-none bg-gradient-to-t from-slate-100 to-transparent"
                    aria-hidden="true"
                />
            </div>
            <div className="flex justify-between items-center text-sm mt-6">
                <span className={isPublished ? publishedBadgeClass : draftBadgeClass}>
                    {isPublished ? "Published" : "Draft"}
                </span>
                <div className="flex items-center gap-3">
                    <div><span className="font-bold">Posted on:</span> {createdAt}</div>
                    <Link
                        to={`/users/${userId}/posts/${postid}`}
                        state={{ postTitle, postContent, createdAt, isPublished }}
                        className="bg-blue-600 text-white px-3 py-1 rounded text-xs font-semibold hover:bg-blue-700 transition-colors"
                    >
                        Update
                    </Link>
                </div>
            </div>
        </div>
    );
}

export function PostEditor() {
    const [editorPostTitle, setEditorPostTitle] = useState('');
    const { userId, postId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    
    const isNew = postId ? false: true;
    const { postTitle, postContent, createdAt, isPublished } = location.state || {};

    
    const initialContent = isNew ? {}: postContent;
    
    const editor = useEditor({
        extensions: [StarterKit],
        content: contentToTiptap(initialContent),
    });
    
    useEffect(() => {
        if (!isNew && postTitle) setEditorPostTitle(postTitle);
    }, [isNew, postTitle]);

    const editorPostContent = JSON.stringify(editor.getJSON());

    return (
        <div>
            <input
            type="text"
            value={editorPostTitle}
            className="w-full border-1 border-slate-400 rounded-md p-2 mb-2"
            placeholder="Post title"
            onChange={(e) => setEditorPostTitle(e.target.value)}
            />
            <Toolbar editor={editor} />
            <div className="prose max-w-none">
                <EditorContent editor={editor} />
            </div>
            <button
            onClick={() => handlePostUpdate({ postId, userId, title: editorPostTitle, content: editorPostContent, navigate})}
            className="bg-blue-600 text-white px-3 py-1 rounded text-xs font-semibold hover:bg-blue-700 hover:cursor-pointer transition-colors"
            >
                Save
            </button>
      </div>
    )
};