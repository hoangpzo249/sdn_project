import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <div className="container mt-5">
            <div className="jumbotron p-5 bg-light rounded text-center">
                <h1 className="display-4">English Quiz Exams</h1>
                <p className="lead">Hệ thống Thi Trắc Nghiệm Tiếng Anh Trực Tuyến dành cho Học Sinh, Sinh Viên</p>
                <hr className="my-4" />
                {token && user ? (
                    <div>
                        <h4>Xin chào, {user.name} ({user.role})!</h4>
                        <div className="mt-4">
                            {user.role === 'admin' ? (
                                <>
                                    <button onClick={() => navigate('/admin/exams')} className="btn btn-dark me-3">Quản lý Đề Thi</button>
                                    <button onClick={() => navigate('/admin/histories')} className="btn btn-dark me-3">Quản lý Lịch Sử Thi</button>
                                </>
                            ) : (
                                <>
                                    <button onClick={() => navigate('/exams')} className="btn btn-primary me-3">Vào ôn luyện</button>
                                    <button onClick={() => navigate('/history')} className="btn btn-info me-3 text-white">Xem lịch sử thi</button>
                                </>
                            )}
                            <button onClick={handleLogout} className="btn btn-danger">Đăng xuất</button>
                        </div>
                    </div>
                ) : (
                    <div>
                        <p>Vui lòng đăng nhập để bắt đầu.</p>
                        <button onClick={() => navigate('/login')} className="btn btn-primary btn-lg me-3" role="button">
                            Đăng nhập
                        </button>
                        <button onClick={() => navigate('/register')} className="btn btn-success btn-lg" role="button">
                            Đăng ký
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;
