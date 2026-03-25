import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ExamManagement = () => {
    const [exams, setExams] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [timeLimit, setTimeLimit] = useState(60);
    const [editingExamId, setEditingExamId] = useState(null);
    const navigate = useNavigate();

    const fetchExams = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:9999/api/exams', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setExams(res.data);
        } catch (error) {
            console.error('Lỗi khi lấy danh sách đề thi', error);
        }
    };

    useEffect(() => {
        // Kiểm tra role Admin
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || user.role !== 'admin') {
            navigate('/');
        } else {
            fetchExams();
        }
    }, [navigate]);

    const handleCreateOrUpdateExam = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            if (editingExamId) {
                // Nếu đang có ID, gọi lệnh Edit
                await axios.put(`http://localhost:9999/api/exams/${editingExamId}`,
                    { title, description, time_limit_minutes: timeLimit },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            } else {
                // Ngược lại, tạo mới
                await axios.post('http://localhost:9999/api/exams',
                    { title, description, time_limit_minutes: timeLimit },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            }

            setTitle('');
            setDescription('');
            setTimeLimit(60);
            setEditingExamId(null);
            fetchExams();
        } catch (error) {
            console.error('Lỗi khi lưu đề thi', error);
            alert('Không thể lưu đề thi');
        }
    };

    const handleEditClick = (exam) => {
        setEditingExamId(exam._id);
        setTitle(exam.title);
        setDescription(exam.description || '');
        setTimeLimit(exam.time_limit_minutes);
    };

    const handleDeleteExam = async (id) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa đề thi này không?')) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:9999/api/exams/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchExams();
        } catch (error) {
            console.error('Lỗi khi xóa', error);
            alert('Không thể xóa đề thi');
        }
    };

    return (
        <div className="container mt-4">
            <h2>Quản lý Đề Thi (Admin)</h2>
            <div className="row mt-4">
                {/* Form Tạo Đề Thi Mới */}
                <div className="col-md-4">
                    <div className="card shadow mb-4">
                        <div className={`card-header text-white ${editingExamId ? 'bg-warning' : 'bg-primary'}`}>
                            {editingExamId ? 'Cập Nhật Đề Thi' : 'Thêm Đề Thi Mới'}
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleCreateOrUpdateExam}>
                                <div className="mb-3">
                                    <label className="form-label">Tên Đề Thi</label>
                                    <input type="text" className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} required />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Mô tả</label>
                                    <textarea className="form-control" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Thời gian (phút)</label>
                                    <input type="number" className="form-control" value={timeLimit} onChange={(e) => setTimeLimit(e.target.value)} required min="1" />
                                </div>
                                <button type="submit" className={`btn w-100 ${editingExamId ? 'btn-warning' : 'btn-success'}`}>
                                    {editingExamId ? 'Lưu thay đổi' : 'Tạo mới'}
                                </button>
                                {editingExamId && (
                                    <button type="button" className="btn btn-secondary w-100 mt-2" onClick={() => {
                                        setEditingExamId(null);
                                        setTitle('');
                                        setDescription('');
                                        setTimeLimit(60);
                                    }}>Hủy cập nhật</button>
                                )}
                            </form>
                        </div>
                    </div>
                </div>

                {/* Danh Sách Đề Thi */}
                <div className="col-md-8">
                    <div className="card shadow">
                        <div className="card-header bg-dark text-white">Danh sách các Đề Thi</div>
                        <div className="card-body p-0">
                            <table className="table table-hover mb-0">
                                <thead>
                                    <tr>
                                        <th>Tên đề</th>
                                        <th>Thời gian</th>
                                        <th>Hành động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {exams.length > 0 ? (
                                        exams.map((exam) => (
                                            <tr key={exam._id}>
                                                <td>
                                                    <strong>{exam.title}</strong>
                                                    <br />
                                                    <small className="text-muted">{exam.description}</small>

                                                </td>
                                                <td>{exam.time_limit_minutes} phút</td>
                                                <td>
                                                    <button onClick={() => navigate(`/admin/exams/${exam._id}`)} className="btn btn-sm btn-info text-white me-2">Chi tiết / Thêm câu hỏi</button>
                                                    <button onClick={() => handleEditClick(exam)} className="btn btn-sm btn-outline-primary me-2">Sửa Đề</button>
                                                    <button onClick={() => handleDeleteExam(exam._id)} className="btn btn-sm btn-outline-danger">Xóa</button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr><td colSpan="3" className="text-center">Chưa có đề thi nào</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-4">
                <button onClick={() => navigate('/')} className="btn btn-secondary">Quay lại Trang Chủ</button>
            </div>
        </div>
    );
};

export default ExamManagement;
