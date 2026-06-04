import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
    const [fullName, setFullName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [avatar, setAvatar] = useState(null);
    const [message, setMessage] = useState({ text: '', type: '' });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "Đăng Ký - Thư Viện Số";
    }, []);

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ text: '', type: '' });

        try {
            await axios.post('/SpringSaleAppV1/api/users', {
                fullName: fullName,
                username: username,
                password: password
            });
            
            setMessage({ text: 'Đăng ký thành công! Đang chuyển hướng...', type: 'success' });
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setMessage({ text: 'Lỗi đăng ký! Tên đăng nhập này có thể đã tồn tại.', type: 'danger' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="row justify-content-center">
            <div className="col-md-5">
                <div className="card shadow border-0 rounded-3 mt-4">
                    <div className="card-body p-4">
                        <h4 className="text-center mb-4 text-success fw-bold">ĐĂNG KÝ TÀI KHOẢN</h4>
                        {message.text && <div className={`alert alert-${message.type}`}>{message.text}</div>}
                        
                        <form onSubmit={handleRegister}>
                            <div className="mb-3">
                                <label className="form-label fw-semibold">Họ và Tên</label>
                                <input type="text" className="form-control" value={fullName} 
                                    onChange={(e) => setFullName(e.target.value)} required placeholder="VD: Nguyễn Văn A"/>
                            </div>
                            <div className="mb-3">
                                <label className="form-label fw-semibold">Tên đăng nhập</label>
                                <input type="text" className="form-control" value={username} 
                                    onChange={(e) => setUsername(e.target.value)} required />
                            </div>
                            <div className="mb-3">
                                <label className="form-label fw-semibold">Mật khẩu</label>
                                <input type="password" className="form-control" value={password} 
                                    onChange={(e) => setPassword(e.target.value)} required />
                            </div>
                            <div className="mb-4">
                                <label className="form-label fw-semibold">Ảnh đại diện (Avatar)</label>
                                <input type="file" className="form-control" accept="image/*" 
                                    onChange={(e) => setAvatar(e.target.files[0])} required />
                            </div>
                            
                            <button type="submit" className="btn btn-success w-100 fw-bold mb-3" disabled={loading}>
                                {loading ? 'Đang xử lý...' : 'Đăng Ký'}
                            </button>
                        </form>
                        <div className="text-center mt-2">
                            <span className="text-muted">Đã có tài khoản? </span>
                            <Link to="/login" className="text-decoration-none fw-bold">Đăng nhập</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;