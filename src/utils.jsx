function convertMessagesTimeFormat(post) {
    const rawDate = new Date(post?.createdAt);
    const formattedDate = new Intl.DateTimeFormat("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour12: false,
    })
        .format(rawDate)
        .replace(",", "");
    return formattedDate;
}

async function handleLogout({ setUser, setIsAuth }) {
    setUser(null);
    setIsAuth(false);

    await fetch('http://localhost:3000/logout', {
        method: 'POST',
        credentials: 'include',
    });

    window.location.href = 'http://localhost:5173?logout=true';
}

function handleResponse({ result, setIsAuth, setUser, user, isAuth }) {
    if (result.isAuth && !isAuth) {
        setIsAuth(true);
    }
    if (result.user && !user) {
        setUser(result.user);
    }

    if (!result.isAuth && isAuth) {
        setIsAuth(false);
        setUser(null);
    }
}

function isContentJson(content) {
    try {
        const parsed = JSON.parse(content);
        if (parsed?.type === "doc") return parsed;
    } catch {
        return false;
    };
};

function contentToTiptap(raw) {
    if (!raw) return { type: 'doc', content: [{ type: 'paragraph' }] };
    const parseContent = isContentJson(raw);
    if (parseContent) return parseContent;

    const paras = raw.split('\n').map(line => ({
        type: "paragraph",
        content: line ? [{ type: "text", text: line}]: []
    }));

    return { type: 'doc', content: paras };
}

async function handlePostUpdate({postId, userId, title, content, navigate}) {
    const response = await fetch(`http://localhost:3000/users/${userId}/posts/${postId}`, {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ title, content }),
        credentials: 'include',
    });
    const result = await response.json();
    if (response.status >= 400) {
        throw new Error(result.msg);
    };
    navigate(`/users/${userId}/posts/${postId}`, { state: { postContent:content, postTitle: title}})
};

export {
    convertMessagesTimeFormat, 
    handleResponse, 
    handleLogout, 
    contentToTiptap, 
    handlePostUpdate,
    isContentJson,
};
