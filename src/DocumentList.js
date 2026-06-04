import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const DocumentList = () => {
    const [documents, setDocuments] = useState([]);
    const [page, setPage] = useState(1);
    const [kw, setKw] = useState('');
    const [searchBy, setSearchBy] = useState('title'); // State mới: Tiêu chí tìm kiếm
    const [selectedDoc, setSelectedDoc] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "Học Liệu - Thư Viện Số";
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        const fetchProfile = async () => {
            try {
                const res = await axios.get('/SpringSaleAppV1/api/secure/profile', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setCurrentUser(res.data);
            } catch (err) {
                localStorage.removeItem('token');
                navigate('/login');
            }
        };

        fetchProfile();
        fetchDocuments(page, kw, searchBy);
    }, [page, navigate]); // Bỏ kw và searchBy ra khỏi mảng này để không bị gọi API liên tục khi gõ

    // Gửi thêm params searchBy xuống Backend
    const fetchDocuments = async (pageNumber, keyword, criteria) => {
        try {
            const response = await axios.get(`/SpringSaleAppV1/api/documents/?page=${pageNumber}&kw=${keyword}&searchBy=${criteria}`);
            setDocuments(response.data);
        } catch (err) {
            console.error("Lỗi lấy dữ liệu", err);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(1); 
        fetchDocuments(1, kw, searchBy);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const defaultBookCover = "https://cdn-icons-png.flaticon.com/512/2232/2232688.png";

    return (
        <div className="pb-5">
            <div className="d-flex justify-content-between align-items-center mb-4 bg-light p-3 rounded shadow-sm border">
                <h4 className="text-primary m-0 fw-bold">Hệ Thống Tra Cứu Học Liệu</h4>
                <div className="d-flex align-items-center">
                    {currentUser && (
                        <div className="d-flex align-items-center me-4">
                            <img 
                                src={"https://static.vecteezy.com/system/resources/previews/070/116/151/non_2x/simple-flat-design-human-avatar-with-red-hair-person-illustration-vector.jpg" || currentUser.avatarUrl} 
                                alt="avatar" 
                                className="rounded-circle me-2 shadow-sm border border-2 border-success" 
                                style={{width: '45px', height: '45px', objectFit: 'cover'}}
                            />
                            <span className="fw-bold text-dark" style={{fontSize: '1.1rem'}}>Xin chào, {currentUser.fullName}!</span>
                        </div>
                    )}
                    <button className="btn btn-danger fw-bold shadow-sm" onClick={handleLogout}>Đăng Xuất</button>
                </div>
            </div>
            
            {/* THANH TÌM KIẾM ĐA TIÊU CHÍ */}
            <div className="card mb-4 shadow-sm border-0 bg-white">
                <div className="card-body">
                    <form onSubmit={handleSearch} className="d-flex w-100">
                        {/* Dropdown chọn tiêu chí */}
                        <select 
                            className="form-select border-primary me-2 fw-bold text-primary" 
                            style={{maxWidth: '220px'}}
                            value={searchBy}
                            onChange={(e) => setSearchBy(e.target.value)}
                        >
                            <option value="title">Tên sách</option>
                            <option value="author">Tác giả</option>
                            <option value="category">Chủ đề / Chuyên ngành</option>
                            <option value="year">Năm xuất bản</option>
                        </select>

                        <input 
                            type="text" 
                            className="form-control me-2 border-primary form-control-lg" 
                            placeholder="Nhập từ khóa cần tìm..." 
                            value={kw} 
                            onChange={(e) => setKw(e.target.value)} 
                        />
                        <button type="submit" className="btn btn-primary px-4 fw-bold shadow-sm">TÌM KIẾM</button>
                    </form>
                </div>
            </div>

            <div className="row">
                {documents.length === 0 ? (
                    <div className="text-center text-muted mt-5">
                        <h5>Không tìm thấy tài liệu nào phù hợp.</h5>
                    </div>
                ) : (
                    documents.map(doc => (
                        <div className="col-md-3 mb-4" key={doc.id}>
                            <div className="card h-100 shadow-sm border-0" style={{transition: "0.3s"}}>
                                <div className="card-body text-center d-flex flex-column p-4">
                                    <img src={defaultBookCover} alt="cover" className="mb-3 mx-auto" style={{width: '100px', height: '100px', objectFit: 'contain'}}/>
                                    <h6 className="card-title text-truncate fw-bold" title={doc.title}>{doc.title}</h6>
                                    <p className="card-text text-muted small mb-1">{doc.author}</p>
                                    <span className="badge bg-info text-dark mb-4 mx-auto px-3 py-2">{doc.category}</span>
                                    
                                    <div className="mt-auto">
                                        <button className="btn btn-sm btn-outline-primary w-100 fw-bold" onClick={() => setSelectedDoc(doc)}>
                                            Xem chi tiết
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="d-flex justify-content-center mt-4">
                <button className="btn btn-primary me-3 fw-bold px-4" disabled={page === 1} onClick={() => setPage(page - 1)}>
                    &laquo; Trang trước
                </button>
                <span className="align-self-center fw-bold fs-5 text-secondary">Trang {page}</span>
                <button className="btn btn-primary ms-3 fw-bold px-4" disabled={documents.length < 20} onClick={() => setPage(page + 1)}>
                    Trang sau &raquo;
                </button>
            </div>

            {selectedDoc && (
                <div className="modal show d-block" tabIndex="-1" style={{backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1050}}>
                    <div className="modal-dialog modal-dialog-centered modal-lg">
                        <div className="modal-content border-0 shadow-lg">
                            <div className="modal-header bg-primary text-white border-0">
                                <h5 className="modal-title fw-bold">📘 {selectedDoc.title}</h5>
                                <button type="button" className="btn-close btn-close-white" onClick={() => setSelectedDoc(null)}></button>
                            </div>
                            <div className="modal-body p-4">
                                <div className="row align-items-center">
                                    <div className="col-md-4 text-center mb-3 mb-md-0">
                                        <img src={defaultBookCover} alt="cover" className="img-fluid" style={{maxWidth: '150px'}} />
                                    </div>
                                    <div className="col-md-8">
                                        <p className="mb-2"><strong className="text-primary">Tác giả:</strong> {selectedDoc.author}</p>
                                        <p className="mb-2"><strong className="text-primary">Năm xuất bản:</strong> {selectedDoc.publishYear}</p>
                                        <p className="mb-3"><strong className="text-primary">Chuyên ngành:</strong> <span className="badge bg-success">{selectedDoc.category}</span></p>
                                        <div className="p-3 bg-light rounded text-muted" style={{fontSize: '0.95rem'}}>
                                            {selectedDoc.description}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer bg-light border-0">
                                <button type="button" className="btn btn-secondary px-4 fw-bold" onClick={() => setSelectedDoc(null)}>Đóng</button>
                                <button type="button" className="btn btn-success px-4 fw-bold" onClick={() => {
                                    alert(`Ghi nhận mượn tài liệu: ${selectedDoc.title} thành công!`);
                                    setSelectedDoc(null);
                                }}>Mượn tài liệu này</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DocumentList;