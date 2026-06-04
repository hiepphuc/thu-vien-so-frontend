import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Librarian = () => {
    const [documents, setDocuments] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ id: null, title: '', author: '', publishYear: '', category: '', description: '' });
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "Trang Thủ Thư - Thư Viện Số";
        loadDocuments();
    }, []);

    const loadDocuments = async () => {
        try {

            const res = await axios.get('/SpringSaleAppV1/api/documents/?page=1');
            setDocuments(res.data);
        } catch (err) { console.error(err); }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post('/SpringSaleAppV1/api/documents/', formData, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            alert(formData.id ? "Cập nhật thành công!" : "Thêm tài liệu thành công!");
            setShowModal(false);
            loadDocuments(); 
        } catch (err) { 
            alert("Có lỗi xảy ra khi lưu!"); 
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa tài liệu này?")) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`/SpringSaleAppV1/api/documents/${id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                alert("Đã xóa thành công!");
                loadDocuments();
            } catch (err) { 
                alert("Lỗi khi xóa!"); 
            }
        }
    };

    const openModal = (doc = null) => {
        if (doc) {
            setFormData(doc);
        } else {
            setFormData({ id: null, title: '', author: '', publishYear: '', category: '', description: '' });
        }
        setShowModal(true);
    };

    return (
        <div className="pb-5">
            <div className="d-flex justify-content-between align-items-center mb-4 bg-dark text-white p-3 rounded shadow">
                <h4 className="m-0 fw-bold">🛠 KHU VỰC THỦ THƯ - QUẢN LÝ HỌC LIỆU</h4>
                <button className="btn btn-outline-light" onClick={() => navigate('/login')}>Đăng Xuất</button>
            </div>

            <button className="btn btn-success mb-3 fw-bold shadow-sm" onClick={() => openModal()}>
                + THÊM HỌC LIỆU MỚI
            </button>

            <div className="card shadow-sm border-0">
                <div className="card-body p-0">
                    <table className="table table-hover table-bordered mb-0 text-center align-middle">
                        <thead className="table-primary">
                            <tr>
                                <th>ID</th>
                                <th>Tên Tài Liệu</th>
                                <th>Tác Giả</th>
                                <th>Năm XB</th>
                                <th>Chuyên Ngành</th>
                                <th>Hành Động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {documents.map(d => (
                                <tr key={d.id}>
                                    <td>{d.id}</td>
                                    <td className="text-start fw-bold text-primary">{d.title}</td>
                                    <td>{d.author}</td>
                                    <td>{d.publishYear}</td>
                                    <td><span className="badge bg-secondary">{d.category}</span></td>
                                    <td>
                                        <button className="btn btn-sm btn-warning me-2 fw-bold" onClick={() => openModal(d)}>Sửa</button>
                                        <button className="btn btn-sm btn-danger fw-bold" onClick={() => handleDelete(d.id)}>Xóa</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {showModal && (
                <div className="modal show d-block" style={{background: 'rgba(0,0,0,0.5)'}}>
                    <div className="modal-dialog modal-lg">
                        <form className="modal-content" onSubmit={handleSave}>
                            <div className="modal-header bg-success text-white">
                                <h5 className="modal-title fw-bold">{formData.id ? "Cập Nhật Học Liệu" : "Thêm Mới Học Liệu"}</h5>
                                <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="fw-bold">Tên tài liệu</label>
                                        <input type="text" className="form-control" required 
                                            value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="fw-bold">Tác giả</label>
                                        <input type="text" className="form-control" required 
                                            value={formData.author} onChange={e => setFormData({...formData, author: e.target.value})} />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="fw-bold">Năm xuất bản</label>
                                        <input type="number" className="form-control" required 
                                            value={formData.publishYear} onChange={e => setFormData({...formData, publishYear: e.target.value})} />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="fw-bold">Chuyên ngành / Thể loại</label>
                                        <input type="text" className="form-control" required 
                                            value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} />
                                    </div>
                                    <div className="col-md-12 mb-3">
                                        <label className="fw-bold">Mô tả chi tiết</label>
                                        <textarea className="form-control" rows="3" required 
                                            value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="fw-bold">Ảnh bìa (Bản mềm)</label>
                                        <input type="file" className="form-control" />
                                        <small className="text-muted">Hệ thống sẽ tự động tối ưu ảnh</small>
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="fw-bold">File tài liệu (PDF/DOCX/VIDEO)</label>
                                        <input type="file" className="form-control" />
                                        <small className="text-muted">Đã thiết lập mã hóa bảo vệ bản quyền</small>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer bg-light">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Hủy</button>
                                <button type="submit" className="btn btn-success fw-bold">Lưu Thông Tin</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Librarian;