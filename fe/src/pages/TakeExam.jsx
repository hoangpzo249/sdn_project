import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const TakeExam = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [exam, setExam] = useState(null);
    const [answers, setAnswers] = useState({}); // { question_id: 'A' }
    const [timeLeft, setTimeLeft] = useState(0);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [result, setResult] = useState(null);

    useEffect(() => {
        const fetchExamData = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`http://localhost:9999/api/exams/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setExam(res.data);
                setTimeLeft(res.data.time_limit_minutes * 60); // Đổi sang giây
            } catch (error) {
                alert('Không thể tải bài thi');
                navigate('/exams');
            }
        };
        fetchExamData();
    }, [id, navigate]);

    // Đếm ngược thời gian
    useEffect(() => {
        if (isSubmitted) return;
        if (timeLeft <= 0 && exam) {
            handleSubmit(); // Hết giờ tự nộp
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft, exam, isSubmitted]);

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
    };

    const handleSelectAnswer = (questionId, optionId) => {
        if (isSubmitted) return;
        setAnswers({
            ...answers,
            [questionId]: optionId,
        });
    };

    const handleSubmit = async () => {
        if (!isSubmitted && timeLeft > 0 && !window.confirm('Bạn có chắc chắn muốn nộp bài sớm không?')) return;

        try {
            const token = localStorage.getItem('token');
            const submitData = {
                answers: Object.keys(answers).map(qId => ({
                    question_id: qId,
                    selected_option_id: answers[qId]
                }))
            };

            const res = await axios.post(`http://localhost:9999/api/exams/${id}/submit`, submitData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setIsSubmitted(true);
            setResult(res.data);
        } catch (error) {
            console.error(error);
            alert('Có lỗi xảy ra khi nộp bài');
        }
    };

    if (!exam) return <div className="text-center mt-5">Đang làm bài, vui lòng chờ...</div>;

    return (

        <div className="container mt-4 mb-5">
            <div className="row">
                <div className="col-md-9 border-end">
                    <h3 className="mb-2 text-primary">{exam.title}</h3>
                    <p className="text-muted mb-4">{exam.description}</p>

                    {exam.questions.map((q, qIndex) => (
                        <div className="card mb-4 shadow-sm border-0 bg-light" key={q._id}>
                            <div className="card-body">
                                <h5 className="card-title fw-bold mb-3">
                                    <span className="text-primary me-2">Câu {qIndex + 1}:</span>
                                    {q.content}
                                </h5>
                                <div className="ms-3">
                                    {q.options.map(opt => (
                                        <div className="form-check mb-2" key={opt.id}>
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                name={`question-${q._id}`}
                                                id={`q${q._id}-opt${opt.id}`}
                                                checked={answers[q._id] === opt.id}
                                                onChange={() => handleSelectAnswer(q._id, opt.id)}
                                                disabled={isSubmitted}
                                            />
                                            <label className="form-check-label ms-2" htmlFor={`q${q._id}-opt${opt.id}`} style={{ cursor: isSubmitted ? 'default' : 'pointer' }}>
                                                <strong>{opt.id}.</strong> {opt.text}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}

                    {isSubmitted && (
                        <div className="">
                            <div className="">
                                <h4 className=""> Kết Quả</h4>
                                <div className="">
                                    <table className="table ">
                                        <thead className="">
                                            <tr>
                                                <th scope="col">Câu hỏi</th>
                                                <th scope="col">Đáp án của bạn</th>
                                                <th scope="col">Đáp án đúng</th>
                                                <th scope="col">Kết quả</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {exam.questions.map((q, qIndex) => {
                                                const isCorrect = answers[q._id] === q.correct_answer;
                                                return (
                                                    <tr key={q._id}>
                                                        <td className="fw-bold">Câu {qIndex + 1}</td>
                                                        <td>{answers[q._id] || "Không trả lời"}</td>
                                                        <td className="fw-bold">{q.correct_answer}</td>
                                                        <td>{isCorrect ? 'Đúng' : 'Sai'}</td>
                                                    </tr>
                                                );
                                            })}

                                        </tbody>
                                    </table>
                                    <div className={` ${result?.score < 5 ? 'text-danger' : 'text-primary'}`}>
                                        Điểm của bạn: {result?.score} / {exam.total_score}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Thanh Timer và Submmit bên phải */}
                <div className="col-md-3">
                    <div className="position-sticky top-0 pt-4">
                        <div className="card shadow border-0 text-center">
                            <div className={`card-header text-white fw-bold ${timeLeft < 60 ? 'bg-danger' : 'bg-dark'}`}>
                                THỜI GIAN CÒN LẠI
                            </div>
                            <div className="card-body">
                                <h2 className={`display-4 fw-bold ${timeLeft < 60 ? 'text-danger' : 'text-primary'}`}>
                                    {formatTime(timeLeft)}
                                </h2>
                                <hr />
                                <div className="text-start small text-muted mb-3 fw-bold">
                                    Tiến độ: {Object.keys(answers).length} / {exam.questions.length} câu
                                </div>
                                {!isSubmitted ? (
                                    <button className="btn btn-success btn-lg w-100 shadow fw-bold" onClick={handleSubmit}>
                                        NỘP BÀI
                                    </button>
                                ) : (
                                    <div className="mt-3">
                                        <div className="mt-4">
                                            <button onClick={() => navigate('/')} className="btn btn-secondary">Quay lại Trang Chủ</button>
                                        </div>
                                    </div>

                                )}
                            </div>
                        </div>
                    </div>
                </div>


            </div>
        </div>
    );
};

export default TakeExam;