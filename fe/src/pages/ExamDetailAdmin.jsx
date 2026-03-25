import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const ExamDetailAdmin = () => {
    const { id } = useParams(); // Lấy ID đề thi từ URL
    const navigate = useNavigate();
    
    const [exam, setExam] = useState(null);
    
    // State cho Form tạo câu hỏi
    const [content, setContent] = useState('');
    const [difficulty, setDifficulty] = useState('easy');
    const [optA, setOptA] = useState('');
    const [optB, setOptB] = useState('');
    const [optC, setOptC] = useState('');
    const [optD, setOptD] = useState('');
    const [correctAnswer, setCorrectAnswer] = useState('A');

    const fetchExamDetail = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`http://localhost:9999/api/exams/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setExam(res.data);
        } catch (error) {
            console.error('Lỗi khi lấy chi tiết đề thi:', error);
            alert('Không tìm thấy đề thi');
            navigate('/admin/exams');
        }
    };

    useEffect(() => {
        fetchExamDetail();
    }, [id]);

    const resetForm = () => {
        setContent(''); setOptA(''); setOptB(''); setOptC(''); setOptD('');
        setCorrectAnswer('A'); setDifficulty('easy');
    };

    const handleAddQuestion = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const payload = {
                content,
                difficulty,
                correct_answer: correctAnswer,
                options: [
                    { id: 'A', text: optA },
                    { id: 'B', text: optB },
                    { id: 'C', text: optC },
                    { id: 'D', text: optD }
                ]
            };

            await axios.post(`http://localhost:9999/api/exams/${id}/questions`, payload, {
                headers: { Authorization: `Bearer ${token}` }
            });
            resetForm();
            fetchExamDetail(); // Cập nhật lại list câu hỏi phía dưới
        } catch (error) {
            alert('Lỗi khi thêm câu hỏi!');
        }
    };

    const handleDeleteQuestion = async (questionId) => {
        if (!window.confirm('Xoá câu hỏi này khỏi đề thi?')) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:9999/api/exams/${id}/questions/${questionId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchExamDetail();
        } catch (error) {
            alert('Không thể xoá câu hỏi');
        }
    };

    if (!exam) return <div className="container mt-5 text-center">Đang tải cấu trúc đề...</div>;

    return (
        <div className="container mt-4 mb-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Cấu trúc đề: <span className="text-primary">{exam.title}</span></h2>
                <button onClick={() => navigate('/admin/exams')} className="btn btn-secondary">Quay lại danh sách Đề</button>
            </div>

            <div className="row">
                <div className="col-md-5">
                    <div className="card shadow border-0">
                        <div className="card-header bg-success text-white">Thêm Câu Hỏi Vào Đề Này</div>
                        <div className="card-body bg-light">
                            <form onSubmit={handleAddQuestion}>
                                <div className="mb-3">
                                    <label className="fw-bold">Nội dung câu hỏi</label>
                                    <textarea className="form-control" rows="3" required
                                        value={content} onChange={e => setContent(e.target.value)} />
                                </div>
                                <div className="row mb-2">
                                    <div className="col-12 mb-2">
                                        <div className="input-group">
                                            <span className="input-group-text bg-white fw-bold text-success">A</span>
                                            <input type="text" className="form-control" placeholder="Đáp án A" required value={optA} onChange={e=>setOptA(e.target.value)}/>
                                        </div>
                                    </div>
                                    <div className="col-12 mb-2">
                                        <div className="input-group">
                                            <span className="input-group-text bg-white fw-bold text-success">B</span>
                                            <input type="text" className="form-control" placeholder="Đáp án B" required value={optB} onChange={e=>setOptB(e.target.value)}/>
                                        </div>
                                    </div>
                                    <div className="col-12 mb-2">
                                        <div className="input-group">
                                            <span className="input-group-text bg-white fw-bold text-success">C</span>
                                            <input type="text" className="form-control" placeholder="Đáp án C"  required value={optC} onChange={e=>setOptC(e.target.value)}/>
                                        </div>
                                    </div>
                                    <div className="col-12 mb-2">
                                        <div className="input-group">
                                            <span className="input-group-text bg-white fw-bold text-success">D</span>
                                            <input type="text" className="form-control" placeholder="Đáp án D" required value={optD} onChange={e=>setOptD(e.target.value)}/>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="row mt-3">
                                    <div className="col-6">
                                        <label className="fw-bold">Đáp án đúng is:</label>
                                        <select className="form-select border-success text-success fw-bold" value={correctAnswer} onChange={e=>setCorrectAnswer(e.target.value)}>
                                            <option value="A">A</option><option value="B">B</option>
                                            <option value="C">C</option><option value="D">D</option>
                                        </select>
                                    </div>
                                    <div className="col-6">
                                        <label className="fw-bold">Độ khó</label>
                                        <select className="form-select" value={difficulty} onChange={e=>setDifficulty(e.target.value)}>
                                            <option value="easy">Dễ</option><option value="medium">Trung bình</option><option value="hard">Khó</option>
                                        </select>
                                    </div>
                                </div>
                                <button type="submit" className="btn btn-success w-100 mt-4 fw-bold">Đẩy vào bộ đề thi</button>
                            </form>
                        </div>
                    </div>
                </div>

                <div className="col-md-7">
                    <div className="card shadow border-0">
                        <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
                            <span>Danh sách câu hỏi trong đề</span>
                            <span className="badge bg-warning text-dark fs-6">{exam.questions?.length || 0} câu</span>
                        </div>
                        <div className="card-body p-3" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                            {exam.questions && exam.questions.length > 0 ? (
                                exam.questions.map((q, idx) => (
                                    <div className="card mb-3 border-start border-4 border-primary" key={q._id}>
                                        <div className="card-body py-2">
                                            <div className="d-flex justify-content-between align-items-start">
                                                <p className="mb-1 fw-bold text-dark">Câu {idx + 1}: <span className="fw-normal">{q.content}</span></p>
                                                <button onClick={() => handleDeleteQuestion(q._id)} className="btn btn-sm btn-outline-danger ms-2" title="Xoá khỏi đề">X</button>
                                            </div>
                                            <ul className="list-unstyled mb-0 ms-3 mt-2 small text-muted">
                                                {q.options.map(opt => (
                                                    <li key={opt.id} className={q.correct_answer === opt.id ? 'text-success fw-bold' : ''}>
                                                        {opt.id}. {opt.text} {q.correct_answer === opt.id && ' ✓'}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center mt-3 text-muted">Đề thi này hiện trống, chưa có câu hỏi nào.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExamDetailAdmin;
