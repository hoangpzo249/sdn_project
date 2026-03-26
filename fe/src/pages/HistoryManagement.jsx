import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const HistoryManagement = () => {
    const [histories, setHistories] = useState([]);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await axios.get('http://localhost:9999/api/history/histories', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                setHistories(res.data);
            } catch (error) {
                console.log(error);
            }
        };
        if (token) {
            fetchHistory();
        } else {
            navigate('/login');
        }
    }, [token, navigate]);

    return (
        <div className="container mt-5">
            <h2>Lịch sử thi của Admin</h2>
            <button className="btn btn-secondary mb-3" onClick={() => navigate('/')}>
                Trở lại Trang Chủ
            </button>
            <table className="table table-striped table-bordered mt-3">
                <thead className="table-dark">
                    <tr>
                        <th>Tên Đề Thi</th>
                        <th>Người thi</th>
                        <th>Điểm Số</th>
                        <th>Thời Gian Thi</th>
                        <th>Thời Gian Nộp Bài</th>
                    </tr>
                </thead>
                <tbody>
                    {histories.map((h) => (
                        <tr key={h._id}>
                            <td>{h.exam_id?.title || 'Đề thi đã bị xóa'}</td>
                            <td>{h.user_id.name || 'Người dùng không tên'}</td>
                            <td>{h.score}</td>
                            <td>{new Date(h.started_at).toLocaleString()}</td>
                            <td>{h.completed_at ? new Date(h.completed_at).toLocaleString() : new Date(h.updatedAt).toLocaleString()}</td>
                        </tr>
                    ))}
                    {histories.length === 0 && (
                        <tr>
                            <td colSpan="4" className="text-center">Chưa có lịch sử thi nào.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default HistoryManagement;