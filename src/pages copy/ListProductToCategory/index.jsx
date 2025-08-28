import { useLocation } from "react-router-dom";
import GameLienQuan from "../../components/GameLienQuan/GameLienQuan"
import { useEffect, useState } from "react";
import { findOneCategory } from "../../services/theLoaiAPI";
import { fetchAllProductToCategory } from "../../services/productAPI";
import { Col, Divider, message, notification, Pagination, Popconfirm, Row, Select } from "antd";
import './PaginationStyles.css'
import ThongBao from "../../components/ThongBao/ThongBao";
import { useSelector } from "react-redux";
import { fetchOneAccKH } from "../../services/khachHangAPI";
import { muaHangTuTaiKhoan } from "../../services/muaHangAPI";
import { useTranslation } from "react-i18next";
const ListProductToCategory = () => {

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    let idLoaiSP = queryParams.get('IdLoaiSP')
    const [dataLoaiSP, setDataLoaiSP] = useState([])

    const [dataListSP, setDataListSP] = useState([])
    const [current, setCurrent] = useState(1)
    const [pageSize, setPageSize] = useState(12)
    const [total, setTotal] = useState(0)
    const [selectedLocTheoGia, setSelectedLocTheoGia] = useState([]);
    const user = useSelector(state => state.accountKH?.isAuthenticated)
    const userId = useSelector(state => state.accountKH?.user)
    const [dataKH, setDataKH] = useState(null)

    const locTheoGia = [
        {_id: 0, value: "1-999999999", label: "Tất cả"},
        {_id: 1, value: "1-100000", label: "Dưới 100.000 VNĐ"},
        {_id: 2, value: "100001-500000", label: "100.000 VNĐ - 500.000 VNĐ"},
        {_id: 3, value: "500001-5000000", label: "500.000 VNĐ - 5.000.000 VNĐ"},
        {_id: 4, value: "5000001-10000000", label: "5.000.000 VNĐ - 10.000.000 VNĐ"},
        {_id: 5, value: "10000001-20000000", label: "10.000.000 VNĐ - 20.000.000 VNĐ"},
        {_id: 6, value: "20000001-999999999", label: "20.000.000 VNĐ đổ lên"},
    ]
    const onChangeTheoGia = async (e) => {
        console.log("e: ", e);
        setSelectedLocTheoGia(e)
    }

    const fetchOneLSP = async () => {
        let query = ''
        
        if (idLoaiSP) {
          query += `IdLoaiSP=${idLoaiSP}`;  // Chuyển mảng thành chuỗi cách nhau bằng dấu phẩy
        }  

        const res = await findOneCategory(query)
        if (res && res.data) {
            setDataLoaiSP(res.data)
        }
    }

    const fetchListSP = async () => {
        let query = `page=${current}&limit=${pageSize}&isActive=true`     
  
        // if (tenSearch) {
        //   query += `&TenSP=${encodeURIComponent(tenSearch)}`;
        // }  
        // Nếu selectedLoaiSP là mảng, chuyển nó thành chuỗi query
        // if (tuSelected) {
        //     query += `&tu=${tuSelected}`;
        // }
        // if (denSelected) {
        //     query += `&den=${denSelected}`;
        // }                     
        
        if (idLoaiSP) {
            query += `&IdLoaiSP=${idLoaiSP}`;  
        }     
        if (selectedLocTheoGia) {
            query += `&locTheoGia=${encodeURIComponent(selectedLocTheoGia)}`;
        }  
    
        const res = await fetchAllProductToCategory(query)
        console.log("res sp theo loai: ", res);
        if (res && res.data) {
            setDataListSP(res.data)
            setTotal(res.totalSanPham)
        }
    }

    useEffect(() => {
        fetchListSP()
    }, [current, pageSize, idLoaiSP])

    useEffect(() => {
        fetchOneLSP()
    }, [])

    useEffect(() => {
        if (selectedLocTheoGia.length > 0) {
            fetchListSP();
        } else {
            fetchListSP(); // Nếu không có loại nào được chọn, fill lại giá trị bandđầu
        }
    }, [selectedLocTheoGia]);

    const onChangePagination = (page, pageSize, sorter = null) => {
        setCurrent(page);
        setPageSize(pageSize); // Cập nhật pageSize nếu cần        
    };

    const urlLinkDetailAcc = (url) => {
        const idSPString = url._id;
        const idLoaiSPString = url.IdLoaiSP._id;
        window.location.href = `/detail-product?IdAcc=${idSPString}&IdLoaiSP=${idLoaiSPString}`
    }

    const fetchListKH = async () => {
        const res = await fetchOneAccKH(userId?._id)
        console.log("res TL: ", res);
        if (res && res.data) {
            setDataKH(res.data[0])
        }
    }

    useEffect(() => {
        fetchListKH()
    }, [userId?._id])
    
    const muaHangBangTaiKhoan = async (_idSP, GiamGiaSP, GiaBan) => {
        console.log("GiamGiaSP:", GiamGiaSP);  
        console.log("SoDu:", dataKH?.soDu);              

        let giaCanThanhToan = GiamGiaSP !== 0 
        ? GiaBan - (GiaBan * (GiamGiaSP / 100)) 
        : GiaBan; 

        console.log("GiaCanThanhToan:", giaCanThanhToan);

        if (dataKH?.soDu >= giaCanThanhToan) {
            let res = await muaHangTuTaiKhoan(_idSP, userId?._id, 1);
            
            if (res && res.errCode === 0) {
                message.success(res.message);
            } else {
                notification.error({
                    message: "Không thể chốt tài khoản này.",
                    description: res.message || "Lỗi không xác định.",
                });
            }
        } else {
            notification.error({
                message: "Số dư không đủ để mua hàng",
                description: "Vui lòng nạp thêm vào tài khoản để mua hàng!",
            });
        }
    }
    const { t, i18n } = useTranslation();
  return (
    <div>
        <div className="container-fluid page-header" style={{marginBottom: '20px'}}>
            <div className="container">
                <div className="d-flex flex-column justify-content-center" style={{minHeight: '160px'}}>
                <h3 className="display-4 text-white text-uppercase">{t('DỰ ÁN THEO LOẠI')}</h3>
                <div className="d-inline-flex text-white align-items-center">
                    <p className="m-0 text-uppercase">
                    <a className="text-white" href="/">{t('TRANG CHỦ')}</a>
                    </p>
                    <i className="fa fa-angle-double-right pt-2 px-3" />
                    <p className="m-0 text-uppercase"> {dataLoaiSP?.TenLoaiSP}</p>
                </div>
                </div>
            </div>
        </div>

        <div className="container-fluid">
            <div className="container">
                <div className="row">
                <h4 className="course-title-header w-100 mb-4"> {dataLoaiSP?.TenLoaiSP}</h4>
                <p className=" w-100 mb-4 pl-4"> 
                    <Select
                        showSearch
                        placeholder="Lọc theo giá"
                        value={selectedLocTheoGia}
                        onChange={(e) => onChangeTheoGia(e)}
                        style={{
                            width: '300px', marginRight: "20px", border: "2px solid blue", borderRadius: "10px"
                        }}
                        size="large"
                        options={locTheoGia.map((item) => ({
                            value: item.value,
                            label: item.label,
                        }))}
                        filterOption={(input, option) => {
                            return option.label.toLowerCase().includes(input.toLowerCase()); // Tìm kiếm trong 'label' của từng option
                        }}  
                    /> 
                </p>
                
                {dataListSP?.length > 0 ? 
                // dataListSP?.map((item, index) => {
                    dataListSP.filter(item => item?.isActive).map((item, index) => {
                    // if (!item?.isActive) return null;  // Không render nếu isActive là false
                    const imageUrl = `${import.meta.env.VITE_BACKEND_URL}/uploads/${item?.Image}`;
                    const giaSauKM = item.GiaBan - (item.GiaBan * (item.GiamGiaSP / 100))
                    return (
                        <div className="col-lg-4 col-md-6 mb-4">
                            <div className="course-card rounded overflow-hidden mb-2">
                            <div className="image-wrapper">
                                <a href="#" onClick={() => urlLinkDetailAcc(item)}>
                                <img className="img-fluid" src={imageUrl} alt="" />
                                {item?.GiamGiaSP !== 0 ? <>
                                    <div className="discount-label">-{item?.GiamGiaSP}%</div>                                
                                </> : ''}
                                </a>
                            </div>
                            <div className="bg-secondary p-4">
                                <div className="d-flex justify-content-between mb-2">
                                <small className="m-0"><i className="fa fa-user text-primary mr-2" />{item?.IdLoaiSP.TenLoaiSP}</small>
                                <small className="m-0">
                                    {/* <i className="fa fa-star text-primary mr-2" />4.9
                                    <small>(999)</small> */}
                                    <i className="fa fa-download text-primary mr-1" /> {item?.SoLuongBan}
                                </small>
                                </div>
                                <a className="h5 course-title" href="#" onClick={() => urlLinkDetailAcc(item)}>{item?.TenSP}
                                </a>
                                <div className="border-top mt-3 pt-3">
                                <h5 className="m-0">
                                    {item?.GiamGiaSP !== 0 ? <>
                                        <span style={{textDecoration: 'line-through', fontSize: '0.8em'}}>{item?.GiaBan.toLocaleString()}đ</span> &nbsp;&nbsp;
                                        <span style={{color: '#ff6600', fontSize: '1.1em'}}>{parseInt(giaSauKM).toLocaleString()}đ</span>                                    
                                    </> : <>
                                    <span style={{color: '#ff6600', fontSize: '1.1em'}}>{item?.GiaBan.toLocaleString()}đ</span> &nbsp;&nbsp;
                                    </>}
                                </h5>
                                {/* {user ? <>
                                    <Popconfirm
                                    title={`Ấn xác nhận lại để tiến hành mua dự án này✔`}
                                    description="Bạn có chắc chắn muốn mua dự án này không?"
                                    onConfirm={() => muaHangBangTaiKhoan(item?._id, item?.GiamGiaSP, item?.GiaBan)}
                                    onCancel={() => message.error('Không Mua nữa!')}
                                    okText="Xác Nhận Mua"
                                    cancelText="Không Mua"
                                    >
                                        <div className="payment-button-container-detail">
                                            <a>
                                            <button className="payment-button-detail" style={{backgroundColor: "#ff6600"}}>
                                                <i className="fa fa-credit-card" /> Thanh toán bằng số dư trong tài khoản
                                            </button>
                                            </a>
                                        </div>    
                                    </Popconfirm>
                                </> : ''}   */}
                                </div>
                            </div>
                            </div>
                        </div>    
                    )
                }) : <span>{t('Admin chưa update')}</span>}
               
                </div>

                <Divider/>
                <Row>
                    <Col span={24} md={24}>
                        <Pagination 
                            className="pagination-custom"
                            current={current}
                            pageSize={pageSize}
                            total={total}
                            onChange={(page, pageSize) => onChangePagination(page, pageSize)}  // Gọi hàm onChangePagination khi thay đổi trang
                            showSizeChanger={true}
                            showQuickJumper={true}
                            // showTotal={(total, range) => (
                            //     <div>{range[0]}-{range[1]} trên {total} tài khoản</div>
                            // )}
                            locale={{
                                items_per_page: 'dòng / trang',  // Điều chỉnh "items per page"
                                jump_to: 'Đến trang số',  // Điều chỉnh "Go to"
                                jump_to_confirm: 'Xác nhận',  // Điều chỉnh "Go"
                                page: '',  // Bỏ hoặc thay đổi chữ "Page" nếu cần
                            }}
                        />                    
                    </Col>
                </Row>
            </div>
        </div>
        <GameLienQuan/>
        <ThongBao/>
    </div>
  )
}
export default ListProductToCategory