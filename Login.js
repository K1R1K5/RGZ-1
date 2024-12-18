import React, {useEffect, useState} from "react";
import "./Login.css";
import API from "./components/API";
import { useNavigate } from "react-router-dom";

const Login = ({onLogin, isAuthenticated}) => {
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            navigate("/");
        }
    }, [isAuthenticated, navigate]);

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [currentView, setCurrentView] = useState("login"); // Переключение между окнами
    const [registerName, setRegisterName] = useState("");
    const [registerEmail, setRegisterEmail] = useState("");
    const [registerPassword, setRegisterPassword] = useState("");

    const [resetEmail, setResetEmail] = useState("");
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const endpoint = "/auth/login";
            const { data } = await API.post(endpoint, { username, password });
            localStorage.setItem("token", data.access_token);
            localStorage.setItem("refreshToken", data.refresh_token);
            onLogin(data);
            navigate("/");
            alert("Logged in successfully!");
        } catch (err) {
            console.error(err);
            alert("Error occurred!");
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const endpoint = "/auth/register";
            await API.post(endpoint, { username: registerName, password: registerPassword, email: registerEmail });
            alert("Registration successful!");
            setCurrentView("login"); // Возврат к окну логина после регистрации
        } catch (err) {
            console.error(err);
            alert("Error occurred!");
        }
    };

    const handlePasswordReset = async (e) => {
        e.preventDefault();
        try {
            const endpoint = "/auth/reset";
            const response = await API.post(endpoint, { email: resetEmail });
            alert(response.data.message);
            setCurrentView("login"); // Возврат к окну логина после сброса
        } catch (err) {
            console.error(err);
            alert("Error occurred!");
        }
    };

    return (
        <div className="login-container">
            {currentView === "login" && (
                <div className="login-box">
                    <h2>Вход</h2>
                    <form onSubmit={handleLogin}>
                        <input
                            type="text"
                            placeholder="Имя пользователя"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Пароль"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button type="submit">Войти</button>
                        <button type="button" onClick={() => setCurrentView("register")}>
                            Регистрация
                        </button>
                        <a href="#" className="forgot-password" onClick={() => setCurrentView("reset")}>Забыли пароль?</a>
                    </form>
                </div>
            )}

            {currentView === "register" && (
                <div className="login-box">
                    <h2>Регистрация</h2>
                    <form onSubmit={handleRegister}>
                        <input
                            type="text"
                            placeholder="Имя пользователя"
                            value={registerName}
                            onChange={(e) => setRegisterName(e.target.value)}
                            required
                        />
                        <input
                            type="email"
                            placeholder="Электронная почта"
                            value={registerEmail}
                            onChange={(e) => setRegisterEmail(e.target.value)}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Пароль"
                            value={registerPassword}
                            onChange={(e) => setRegisterPassword(e.target.value)}
                            required
                        />
                        <button type="submit">Зарегистрироваться</button>
                        <button type="button" onClick={() => setCurrentView("login")}>
                            Назад
                        </button>
                    </form>
                </div>
            )}

            {currentView === "reset" && (
                <div className="login-box">
                    <h2>Сброс пароля</h2>
                    <form onSubmit={handlePasswordReset}>
                        <input
                            type="email"
                            placeholder="Введите вашу электронную почту"
                            value={resetEmail}
                            onChange={(e) => setResetEmail(e.target.value)}
                            required
                        />
                        <button type="submit">Сбросить пароль</button>
                        <button type="button" onClick={() => setCurrentView("login")}>
                            Назад
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Login;

