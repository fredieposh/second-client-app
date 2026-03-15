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

export { convertMessagesTimeFormat, handleResponse, handleLogout };
