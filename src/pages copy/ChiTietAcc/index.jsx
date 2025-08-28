import { useLocation } from "react-router-dom";
import { findOneProduct } from "../../services/productAPI";
import { useEffect, useState } from "react";
import { findOneCategory } from "../../services/theLoaiAPI";
import { Avatar, Divider, message, Modal, notification, Popconfirm, QRCode, Image } from 'antd'
import './style-chu-chay.css'
import { useSelector } from "react-redux";
import { fetchOneAccKH } from "../../services/khachHangAPI";
import { muaHangTuTaiKhoan } from "../../services/muaHangAPI";
import ThongBao from "../../components/ThongBao/ThongBao";
import { useTranslation } from "react-i18next";
import { VscFeedback } from "react-icons/vsc";

const DetailAcc = () => {

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    let idAcc = queryParams.get('IdAcc')
    let idLoaiSP = queryParams.get('IdLoaiSP')

    const [dataDetail, setDataDetail] = useState(null)
    const [dataLoaiSP, setDataLoaiSP] = useState([])
    const [openTT, setOpenTT] = useState(false)
    const user = useSelector(state => state.accountKH?.isAuthenticated)
    const userId = useSelector(state => state.accountKH?.user)
    const [dataKH, setDataKH] = useState(null)


    const findOneAcc = async () => {
        let query = `IdAcc=${idAcc}`
        let res = await findOneProduct(query)
        console.log("res detail: ", res);
        if(res && res.data){
            setDataDetail(res.data)
        }
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
    
    useEffect(() => {
        findOneAcc()
    },[idAcc])

    useEffect(() => {
        fetchOneLSP()
    }, [idAcc, idLoaiSP])

    const urlLinkTheLoai = (url) => {
        const idLoaiSPString = url._id;
        window.location.href = `/list-product-category?IdLoaiSP=${idLoaiSPString}`
    } 

    const giaSauKM = Math.floor(dataDetail?.GiaBan - (dataDetail?.GiaBan * (dataDetail?.GiamGiaSP / 100)))
    const imageUrl = `${import.meta.env.VITE_BACKEND_URL}/uploads/${dataDetail?.Image}`;

    const muaHangBangTaiKhoan = async () => {
        console.log("GiamGiaSP:", dataDetail?.GiamGiaSP);  
        console.log("SoDu:", dataKH?.soDu);  
        
        let giaCanThanhToan = dataDetail?.GiamGiaSP !== 0 
        ? dataDetail?.GiaBan - (dataDetail?.GiaBan * (dataDetail?.GiamGiaSP / 100)) 
        : dataDetail?.GiaBan; 

        console.log("GiaCanThanhToan:", giaCanThanhToan);

        if (dataKH?.soDu >= giaCanThanhToan) {
            let res = await muaHangTuTaiKhoan(dataDetail?._id, userId?._id, 1);
            
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
    console.log("dataKH:", dataKH);  
    const { t, i18n } = useTranslation();

  return (
    <div>
        <div className="container-fluid page-header" style={{marginBottom: '20px'}}>
            <div className="container">
                <div className="d-flex flex-column justify-content-center" style={{minHeight: '160px'}}>
                <h5 className="display-4 text-white text-uppercase">{t('xem chi tiết')}</h5>
                <div className="d-inline-flex text-white">
                    <p className="m-0 text-uppercase">
                    <a className="text-white" href="#" onClick={() => urlLinkTheLoai(dataLoaiSP)}>{dataLoaiSP?.TenLoaiSP}</a>
                    </p>
                    <i className="fa fa-angle-double-right pt-2 px-3" />
                    <p className="m-0 text-uppercase"> {dataDetail?.TenSP}</p>
                </div>
                </div>
            </div>
        </div>

        <div className="container-fluid">
            <div className="container">
                <div className="max-w-5xl-detail mx-auto-detail bg-white-detail shadow-md-detail rounded-md-detail">
                <div className="flex-container-detail">
                    {/* Section 1 */}
                    <div className="left-section-detail">
                    <div className="border-box-detail">
                        {/* <img alt={`account ${dataDetail?.TenSP}`} className="img-detail" src={imageUrl} /> */}
                        <Image 
                        // style={{ height: "180px", objectFit: "cover", borderTopLeftRadius: "10px", borderTopRightRadius: "10px" }} 
                        src={imageUrl} />
                    </div>
                    <div className="button-group-detail">
                        <a href="#" target="_blank">
                        <button className="contact-button-detail">
                            <i className="fa fa-comment" /> {t('Nhắn Tin Trực Tiếp')}
                        </button>
                        </a>
                        <a href={`${dataDetail?.urlDriverVideo}`} target="_blank">
                        <button className="trial-button-detail">
                            <i className="fa fa-desktop" aria-hidden="true" /> {t('Xem video')}
                        </button>
                        </a>
                    </div>
                    </div>
                    {/* Section 2 */}
                    <div className="right-section-detail">
                        <br/>
                    <h1 className="course-title-detail"> {dataDetail?.TenSP}</h1>
                    <div className="course-price-detail">
                        <h5 className="m-0">                           
                            {dataDetail?.GiamGiaSP !== 0 ? <>
                                <span className="old-price-detail">{dataDetail?.GiaBan?.toLocaleString()}đ</span> &nbsp;&nbsp;
                                <span className="new-price-detail">{parseInt(giaSauKM).toLocaleString()}đ</span>                               
                            </> : <>
                            <span className="new-price-detail">{dataDetail?.GiaBan?.toLocaleString()}đ</span> &nbsp;&nbsp;
                            </>}
                        </h5>
                    </div>
                    <div className="course-info-detail">
                        <div className="course-detail-item-detail">
                            <span className="text-gray-500-detail">{t('Hỗ trợ cài đặt?')}</span>
                            <span className="ml-auto-detail">{t('Hỗ trợ thông qua UltraView')}</span>
                        </div>                      
                        <div className="course-detail-item-detail mt-2-detail">
                            <span className="text-gray-500-detail">{t('Sở hữu')}</span>
                            <span className="ml-auto-detail">{t('Trọn đời')}</span>
                        </div>
                    </div>
                    {/* <div className="payment-button-container-detail">
                        <a href="#" onClick={() => setOpenTT(true)}>
                        <button className="payment-button-detail" style={{backgroundColor: "#ff6600"}}>
                            <i className="fa fa-credit-card" /> {t('Thanh toán trực tiếp qua thông tin chuyển khoản Admin')}
                        </button>
                        </a>
                    </div> */}
                    
                    {user ? <>
                        <Popconfirm
                        title={`Ấn xác nhận lại để tiến hành mua dự án này✔`}
                        description="Bạn có chắc chắn muốn mua dự án này không?"
                        onConfirm={() => muaHangBangTaiKhoan()}
                        onCancel={() => message.error('Không Mua nữa!')}
                        okText="Xác Nhận Mua"
                        cancelText="Không Mua"
                        >
                            <div className="payment-button-container-detail">
                                <a>
                                <button className="payment-button-detail" style={{backgroundColor: "#ff6600"}}>
                                    <i className="fa fa-credit-card" /> {t('Thanh toán bằng số dư trong tài khoản')}
                                </button>
                                </a>
                            </div>    
                        </Popconfirm>
                    </> : ''}
                    <div className="payment-button-container-detail">
                        <a href="/feedback">
                        <button className="payment-button-detail" style={{backgroundColor: "#ff6600"}}>
                        <VscFeedback size={25} /> {t('Xem đánh giá (feedback)')}
                        </button>
                        </a>
                    </div>

                    <Modal         
                        width={500}               
                        title="Thông tin tài khoản ngân hàng"
                        centered                       
                        open={openTT}
                        onCancel={() => setOpenTT(false)}
                        footer={null}  // Không hiển thị footer
                    >
                        <Divider/>
                        <div style={{display: "flex", justifyContent: "center"}}>
                            <img width={400} src={`https://img.vietqr.io/image/970407-19035666339011-print.png?amount=${giaSauKM}&addInfo=${dataDetail?.TenSP}+_+SoDienThoaiCuaBan&accountName=DO KHAC TU`} />                       
                        </div>
                    </Modal>
                    </div>
                    {/* Section 3 */}
                    {/* <div className="benefits-section-detail">
                    <div className="benefit-item-detail">
                        <img alt="Icon of a computer with a graduation cap" className="icon-detail" src="../img/benefit1.png" />
                        <div>
                        <span className="benefit-title-detail">Đầy Đủ Bài Giảng</span>
                        <p className="benefit-description-detail">
                            Cam kết video bài giảng và tài liệu giống mô tả
                        </p>
                        </div>
                    </div>
                    <div className="benefit-item-detail">
                        <img alt="Icon of people with a play button" className="icon-detail" src="../img/benefit3.png" />
                        <div>
                        <span className="benefit-title-detail">Học Online Tiện Lợi</span>
                        <p className="benefit-description-detail">
                            Học online trên drive bằng điện thoại hoặc máy tính
                        </p>
                        </div>
                    </div>
                    <div className="benefit-item-detail">
                        <img alt="Icon of a clock" className="icon-detail" src="../img/benefit2.png" />
                        <div>
                        <span className="benefit-title-detail">Update Liên Tục</span>
                        <p className="benefit-description-detail">
                            Cập nhật 7- 15 khóa học mới hằng tuần
                        </p>
                        </div>
                    </div>
                    </div> */}
                </div>
                {/* Right Sidebar */}
                <div className="mt-4-detail p-4-detail border-2-detail border-red-500-detail rounded-md-detail">
                    <div className="flex-detail items-center-detail mb-4-detail">
                    <i className="fas fa-chalkboard-teacher-detail text-2xl-detail text-blue-500-detail mr-2-detail" />
                    <div>
                        {/* <p style={{padding: '12px', background: '#e8e8e8', borderRadius: '10px', width: "500px",}}> 
                            <div class="marquee-container">
                                <div class="marquee-text">
                                    Chúc bạn chơi game vui vẻ 😍🥰
                                </div>
                            </div>                           
                        </p> <br/> */}
                        <Divider/>
                        <h4 className="font-bold-detail">
                        {t('Dưới đây là chi tiết về dự án')} ✨
                        </h4>
                        <p className="text-xl-detail">
                        {/* Với 100+ bài học, bài tập và thử thách, đây sẽ là khóa học bài bản và chi tiết nhất bạn có thể tìm kiếm được ở trên Internet.<br /> */}
                        </p>
                        <div                           
                            className="youtube-video"
                            dangerouslySetInnerHTML={{ __html: dataDetail?.urlYoutube }}
                        />
                        <div className="truncate"  dangerouslySetInnerHTML={{ __html: dataDetail?.MoTa }} />
                        {dataDetail?.ImageSlider.map((item, index) => (
                            <Image 
                            // style={{ objectFit: 'cover', borderRadius: "10px", border: "2px solid blue", margin: "10px 0", width: "100%" }}
                            style={{
                                objectFit: 'contain',  // Thay 'cover' thành 'contain' để ảnh không bị cắt
                                borderRadius: "10px", 
                                border: "2px solid blue", 
                                margin: "10px 0", 
                                width: "100%", 
                                height: "100%",  // Đảm bảo chiều cao cũng được quy định để ảnh không bị biến dạng
                            }}
                            src={`${import.meta.env.VITE_BACKEND_URL}/uploads/${item}`}
                            shape="square" size={1000} />
                        ))} 
                        {/* <div style={{maxWidth: "800px"}}>
                        </div>                        */}
                    </div>
                    </div>
                </div>
                </div>
            </div>
        </div>
        <ThongBao/>
    </div>
  )
}
export default DetailAcc