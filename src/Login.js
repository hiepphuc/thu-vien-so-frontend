import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "Đăng Nhập - Thư Viện Số";
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/SpringSaleAppV1/api/login', {
                username: username,
                password: password
            });
            localStorage.setItem('token', response.data);
            navigate('/documents');
        } catch (err) {
            setError('Sai tài khoản hoặc mật khẩu!');
        }
    };

    return (
        <div className="row justify-content-center">
            <div className="col-md-4">
                <div className="card shadow border-0 rounded-3 mt-5">
                    <div className="card-body p-4">
                        <h4 className="text-center mb-4 text-primary fw-bold">ĐĂNG NHẬP</h4>
                        {error && <div className="alert alert-danger">{error}</div>}
                        <form onSubmit={handleLogin}>
                            <div className="mb-3">
                                <label className="form-label fw-semibold">Tài khoản</label>
                                <input type="text" className="form-control" value={username} 
                                    onChange={(e) => setUsername(e.target.value)} required />
                            </div>
                            <div className="mb-4">
                                <label className="form-label fw-semibold">Mật khẩu</label>
                                <input type="password" className="form-control" value={password} 
                                    onChange={(e) => setPassword(e.target.value)} required />
                            </div>
                            <button type="submit" className="btn btn-primary w-100 fw-bold mb-3">Đăng Nhập</button>
                        </form>
                        <div className="text-center mt-3">
                            <span className="text-muted">Chưa có tài khoản? </span>
                            <Link to="/register" className="text-decoration-none fw-bold">Đăng ký ngay</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;