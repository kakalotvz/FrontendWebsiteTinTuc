import { useEffect, useState } from "react"
import LuckyWheel from "../../components/LuckyWheel"
import { fetchAllPhanThuong } from "../../services/quaySoVaNhanThuongAPI"
import './css.css'
import imgAnh from '../../../public/img/lovepik-red-exquisite-gift-box-elements-png-image_400833573_wh1200.png'
const QuaySo = () => {
    
    const [dataPhanThuong, setDataPhanThuong] = useState([])

    const fetchTatCaPhanThuong = async () => {
        let query = 'page=1&limit=1000'
        let res = await fetchAllPhanThuong(query)
        if(res && res.data){
            setDataPhanThuong(res.data)
        }
    }

    useEffect(() => {
        fetchTatCaPhanThuong()
    }, [])

  return (
    <div>
        <div className="container-fluid page-header" style={{marginBottom: '20px'}}>
            <div className="container">
                <div className="d-flex flex-column justify-content-center" style={{minHeight: '160px'}}>
                {/* <h3 className="display-4 text-white text-uppercase">THỬ VẬN MAY ĐẦU NĂM</h3> */}
                <div className="scrolling-container">
                    <div className="scrolling-text">
                        QUAY SỐ TRÚNG THƯỞNG 5k/1 lần quay
                    </div>
                </div>
                <div className="d-inline-flex text-white">
                    <p className="m-0 text-uppercase"></p>
                    {/* <i className="fa fa-angle-double-right pt-2 px-3" /> */}
                    {/* <p className="m-0 text-uppercase">Tên tài khoản: &nbsp; {dataDetail?.TenSP}</p> */}
                </div>
                </div>
            </div>
        </div>

        <div className="container-fluid">
            <div className="container">
                <div style={{display: 'flex', justifyContent: 'center'}}>
                    <LuckyWheel/>
                </div>
                <div className="box-qua"> <br/>
                    <h3 className="title">
                        Phần quà may mắn sẽ được nhận ngẫu nhiên
                    </h3>
                </div>                    
                    <div className="row  mt-2">
                        {dataPhanThuong?.map((item, index) => (
                            <div className="col-lg-4 col-md-6 mb-4">
                            <div className="course-card rounded overflow-hidden mb-2">
                                <div className="image-wrapper">
                                    <img className="img-fluid" src={imgAnh} alt="" />                               
                                </div>
                                <div className="bg-secondary p-4">                              
                                    <span className="h5 course-title">{item?.code}</span>
                                    <div className="border-top pt-3">
                                    <h5 className="m-0">                                    
                                        <span style={{color: '#ff6600', fontSize: '1em'}}>Nhận {item?.phanThuong.toLocaleString()} vào tài khoản</span> &nbsp;&nbsp;
                                    </h5>
                                    </div>
                                </div>
                                </div>
                            </div>                          
                        ))}
                    </div>
            </div>
        </div>
    </div>
  )
}
export default QuaySo