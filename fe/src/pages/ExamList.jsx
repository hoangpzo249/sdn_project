import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ExamList = () => {
    const [exams, setExams] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchExams = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:9999/api/exams', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setExams(res.data);
            } catch (error) {
                console.error('Lỗi khi tải danh sách đề thi', error);
            }
        };

        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
            navigate('/login');
        } else {
            fetchExams();
        }
    }, [navigate]);

    return (
        <div className="container mt-5">
            <h2 className="mb-4 text-center text-primary fw-bold">Danh sách Đề Thi / Bài Luyện Tập</h2>
            <div className="row">
                {exams.length > 0 ? (
                    exams.map((exam) => (
                        <div className="col-md-4 mb-4" key={exam._id}>
                            <div className="card shadow-sm h-100 border-0 rounded-3">
                                <div className="card-body d-flex flex-column bg-light rounded-3">
                                    <h5 className="card-title text-dark fw-bold">{exam.title}</h5>
                                    <p className="card-text text-muted flex-grow-1">{exam.description || 'Không có mô tả'}</p>
                                    
                                    <div className="d-flex justify-content-between mb-3 text-secondary small fw-medium">
                                        <span><i className="bi bi-clock"></i> Thời gian: {exam.time_limit_minutes} phút</span>
                                        <span><i className="bi bi-card-list"></i> Số câu: {exam.question_ids?.length || 0}</span>
                                    </div>
                                    <div className="d-flex justify-content-between mb-3 text-secondary small fw-medium">
                                        <span>Điểm đỗ: {exam.pass_score}/{exam.total_score}</span>
                                    </div>
                                    <button 
                                        className="btn btn-primary mt-auto text-white fw-bold shadow-sm"
                                        onClick={() => navigate(`/exams/${exam._id}/take`)}
                                        disabled={!exam.question_ids || exam.question_ids.length === 0}
                                    >
                                        Làm Bài Ngay
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-12 text-center text-muted">
                        <p>Hiện tại chưa có đề thi nào trên hệ thống.</p>
                    </div>
                )}
            </div>
            <div className="text-center mt-4">
                <button onClick={() => navigate('/')} className="btn btn-secondary">← Quay lại trang chủ</button>
            </div>
        </div>
    );
};

export default ExamList;
