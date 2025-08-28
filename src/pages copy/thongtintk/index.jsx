import { Avatar, Card, Pagination, Table } from "antd"
import { CiUser } from "react-icons/ci";
import { FaCartPlus } from "react-icons/fa";
import { IoIosTimer } from "react-icons/io";
import './stylee.css'
import { FaRegCircleUser } from "react-icons/fa6";
import { MdOutlineMail } from "react-icons/md";
import { GrMoney } from "react-icons/gr";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { fetchOneAccKH } from "../../services/khachHangAPI";
import { fetchAllOrder } from "../../services/muaHangAPI";
import moment from "moment";
import LuckyWheel from "../../components/LuckyWheel";
import { BsGiftFill } from "react-icons/bs";

const ThongTinAcc = () => {
    const user = useSelector(state => state.accountKH?.user)

    const [loadingTable, setLoadingTable] = useState(false)
    const [loadingTableOrder, setLoadingTableOrder] = useState(false)

    const [dataKH, setDataKH] = useState(null)
    const [dataOrder, setDataOrder] = useState([])

    const [current, setCurrent] = useState(1)
    const [pageSize, setPageSize] = useState(12)
    const [total, setTotal] = useState(0)
    const [sortQuery, setSortQuery] = useState("sort=createdAt");

    console.log("dataKH: ", dataKH);
    console.log("dataOrder: ", dataOrder);
    
    useEffect(() => {
        fetchListKH()
    }, [user?._id])

    useEffect(() => {
        fetchTatCaOrder()
    }, [user?._id, current, pageSize])

    const fetchListKH = async () => {
        setLoadingTable(true)        
        const res = await fetchOneAccKH(user?._id)
        console.log("res TL: ", res);
        if (res && res.data) {
            setDataKH(res.data[0])
        }
        setLoadingTable(false)
    }

    const fetchTatCaOrder = async () => {
        let query = `page=${current}&limit=${pageSize}`
        if (user) {
            query += `&idKH=${encodeURIComponent(user?._id)}`;
        }  
        setLoadingTableOrder(true)        
        const res = await fetchAllOrder(query)
        if (res && res.data) {
            setDataOrder(res.data)
            setTotal(res.totalOrderSP)
        }
        setLoadingTableOrder(false)
    }

    // sử dụng khi dùng phân trang tại table antd -- và dùng cả sắp xếp khi click vào cột trong table
    const onChange = (pagination, filters, sorter, extra) => {
        console.log('Pagination Change:', { pagination, filters, sorter, extra });
        
        // Handle sorting if any
        if (sorter && sorter.field) {
            const sortOrder = sorter.order === 'ascend' ? 'asc' : 'desc'; // Determine sort order
            const newSortQuery = `sort=${sorter.field}&order=${sortOrder}`;
            if (newSortQuery !== sortQuery) {
                setSortQuery(newSortQuery); // Only update if sort query changes
            }
        }

    };

    const onChangePagination = (page, pageSize, sorter = null) => {
        setCurrent(page);
        setPageSize(pageSize); // Cập nhật pageSize nếu cần

        console.log("sorter: ", sorter);
        
        // Handle sorting if any
        if (sorter && sorter.field) {
            const sortOrder = sorter.order === 'ascend' ? 'asc' : 'desc'; // Determine sort order
            const newSortQuery = `sort=${sorter.field}&order=${sortOrder}`;
            if (newSortQuery !== sortQuery) {
                setSortQuery(newSortQuery); // Only update if sort query changes
            }
        }
    };

    const columnsSP = [
        {
            title: 'STT',
            dataIndex: 'stt',
            key: 'stt',
            render: (_, record, index) => {
            //   console.log("index: ", index+1);
              return (
                <>
                  {(index+1) + (current - 1) * pageSize}
                </>
              )
            },
            width: 50
        },     
        {
            title: 'Ảnh dự án',
            dataIndex: 'img',
            key: 'img',
            render: (text, record) => {
                const imageUrl = `${import.meta.env.VITE_BACKEND_URL}/uploads/${record.IdSP?.Image}`;
                return <Avatar style={{width: "100%", height: "100%"}} src={imageUrl} shape="square" />
            },
            width: 350
        },        
        {
            title: 'Thông tin dự án đã mua',
            dataIndex: 'Note',
            key: 'Note',
            sorter: true,
            render: (text, record) => <div>
                <strong style={{fontSize: "18px"}}>Tên dự án: </strong> <span style={{fontSize: "16px", color: "blue"}}> {record.IdSP?.TenSP}</span> <br/>
                <strong style={{fontSize: "18px"}}>Link download:</strong>
                <a style={{fontSize: "18px"}} dangerouslySetInnerHTML={{ __html: record?.IdSP?.Note }} /> <br/>

                {record?.linkDownload ? <>
                    <strong style={{fontSize: "18px"}}>Link download mới:</strong>
                    <div style={{color: "red"}}  dangerouslySetInnerHTML={{ __html: record?.linkDownload }} />
                </> : ''}               
            </div>,
        },                                  
        {
            title: 'Ngày mua',
            width: "150px",
            sorter: true,
            dataIndex: 'updatedAt',
            render: (text, record, index) => {
                return (
                    <>{moment(record?.updatedAt).format('DD-MM-YYYY hh:mm:ss')}</>
                )
            }
        },              
    ]; 

  return (
    <div>
        <div className="container-fluid page-header" style={{marginBottom: '20px'}}>
            <div className="container">
                <div className="d-flex flex-column justify-content-center" style={{minHeight: '160px'}}>
                <h3 className="display-4 text-white text-uppercase">THÔNG TIN TÀI KHOẢN</h3>
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
                <div className="max-w-5xl-detail mx-auto-detail bg-white-detail shadow-md-detail rounded-md-detail" >                
                <div className="div-box">
                    <Card
                        title={<div className="title-card"><CiUser /> THÔNG TIN NGƯỜI DÙNG</div>}
                        bordered={true}
                        className="card-component"
                        style={{
                        width: "60%",
                        padding: "10px",                                             
                        }}
                    >
                        <div className="ba-cai-div"><FaRegCircleUser /> Tên Tài Khoản: <span className="txt-user navy">{dataKH?.name}</span></div>
                        <div className="ba-cai-div"><MdOutlineMail /> Email: <span className="txt-user navy">{dataKH?.email}</span></div>
                        <div className="ba-cai-div"><GrMoney /> Số Dư: <span className="txt-user red">{dataKH?.soDu.toLocaleString()}đ</span></div>
                        {/* <div className="ba-cai-div"><BsGiftFill /> Số Lượt Quay May Mắn: <span className="txt-user red">{dataKH?.quayMayManCount} lượt</span></div> */}
                    </Card>
                    <Card
                        title={<div className="title-card"><IoIosTimer /> Lịch Sử Nạp Tiền</div>}
                        bordered={true}
                        className="card-component"
                        style={{
                        width: "100%",
                        padding: "10px",                        
                        }}
                    >
                        <p>Đang phát triển</p>
                        
                    </Card>
                    
                </div>               
                <div className="div-box">
                <Card
                        title={<div className="title-card"><FaCartPlus /> Danh Sách Đơn Hàng</div>}
                        bordered={true}
                        className="card-component"
                        style={{
                        width: "100%",
                        padding: "10px",
                        marginLeft: "20px",
                        marginTop: "30px"           
                        }}
                    >
                        <Table 
                        rowKey={"_id"} 
                        onChange={onChange}
                        pagination={false}
                        loading={loadingTable}
                        columns={columnsSP} 
                        dataSource={dataOrder}                       
                        />

                        <Pagination 
                        style={{
                            fontSize: "17px",
                            display: "flex",
                            justifyContent: "center",
                            margin: "10px 0 20px 0"
                        }}
                        current={current}
                        pageSize={pageSize}
                        total={total}
                        onChange={(page, pageSize) => onChangePagination(page, pageSize)}  // Gọi hàm onChangePagination khi thay đổi trang
                        showSizeChanger={true}
                        showQuickJumper={true}
                        showTotal={(total, range) => (
                            <div>{range[0]}-{range[1]} trên {total} tài khoản</div>
                        )}
                        locale={{
                            items_per_page: 'dòng / trang',  // Điều chỉnh "items per page"
                            jump_to: 'Đến trang số',  // Điều chỉnh "Go to"
                            jump_to_confirm: 'Xác nhận',  // Điều chỉnh "Go"
                            page: '',  // Bỏ hoặc thay đổi chữ "Page" nếu cần
                        }}
                        />
                    </Card>                    
                </div>
                
                </div>
            </div>
        </div>
    </div>
  )
}
export default ThongTinAcc