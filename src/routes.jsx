import App from './App.jsx'
import Home from './components/Home.jsx'
import ErrorPage from './components/ErrorPage.jsx'
import { PostsList, PostEditor } from './components/Post.jsx';
import { CommentsList } from './components/Comments.jsx';

const routes = [
    {
        path: "/",
        element: <App />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: "users/:userId",
                element: <Home />,
                children: [
                    { index: true, element: <PostsList /> },
                    { path: "posts", element: <PostsList /> },
                    { path: "posts/new", element: <PostEditor />},
                    { path: "posts/:postId", element: <PostEditor />},
                    { path: "comments", element: <CommentsList />},
                ],
            },
        ]
    },
];

export default routes;
