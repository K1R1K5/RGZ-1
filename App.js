import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Home from "./components/Home";
import VideoUploader from "./components/VideoUploader";
import Login from "./Login";
import VideoPage from "./components/VideoPage";
import Gallery from "./Gallery";
import { useEffect, useState } from "react";
import VideoConfiguration from "./components/VideoConfiguration";
import './App.css'
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './components/Theme';



const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(
        () => JSON.parse(localStorage.getItem("isAuthenticated")) || false
    );
    const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user")) || null);

    const handleLogin = (evt) => {
        setIsAuthenticated(true);

        const user_data = {
            email: evt.user.email,
            avatar: evt.user.avatar,
            username: evt.user.username,
        };
        localStorage.setItem("isAuthenticated", true);
        localStorage.setItem("user", JSON.stringify(user_data));
        setUser(user_data);
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        setUser(null);

        // Очистка localStorage
        localStorage.removeItem("isAuthenticated");
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
    };

    useEffect(() => {
        // Убедимся, что localStorage корректно синхронизируется с состоянием
        localStorage.setItem("isAuthenticated", isAuthenticated);
        localStorage.setItem("user", JSON.stringify(user));
    }, [isAuthenticated, user]);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
        <div className="app-background">
            <Router>
                <Header isLoggedIn={isAuthenticated} userProfile={user} onLogout={handleLogout} />

                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route
                        path="/upl"
                        element={isAuthenticated ? <VideoUploader /> : <Navigate to="/login" />}
                    />
                    <Route
                        path="/login"
                        element={
                            isAuthenticated ? (
                                <Navigate to="/" />
                            ) : (
                                <Login onLogin={handleLogin} isAuthenticated={isAuthenticated} />
                            )
                        }
                    />
                    <Route path="/videos/:id" element={<VideoPage />} />
                    <Route path="/video-config/:id" element={<VideoConfiguration />} />
                    <Route
                        path="/gallery"
                        element={
                            isAuthenticated ? (
                                <Gallery userProfile={user} />
                            ) : (
                                <Navigate to="/login" />
                            )
                        }
                    />
                </Routes>
            </Router>
        </div>
        </ThemeProvider>
    );
};

export default App;