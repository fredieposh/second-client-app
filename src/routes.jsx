import App from './App.jsx'
import Home from './components/Home.jsx'
import ErrorPage from './components/ErrorPage.jsx'

const routes = [
    {
        path: "/",
        element: <App />,
        errorElement: <ErrorPage />,
        children: [
            { path: "/users/:id/home", element: <Home /> },
        ]
    },
];

export default routes;
