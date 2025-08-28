import { useEffect, useState } from "react"
import { fetchAllOrderThongBao } from "../../services/muaHangAPI"
import { message, notification } from "antd"
import styled from 'styled-components';

const ThongBao = () => {

    let [dataThongBao, setDataThongBao] = useState([])
    const [current, setCurrent] = useState(1)
    const [pageSize, setPageSize] = useState(12)
    const [total, setTotal] = useState(0)

    const fetchOrderAll = async () => {
        let query = `page=1&limit=9999`                                                
    
        const res = await fetchAllOrderThongBao(query)
        console.log("res order: ", res);
        if (res && res.data) {
            setDataThongBao(res.data)
            setTotal(res.totalOrderSP)
        }
    }

    useEffect(() => {
        fetchOrderAll();
    }, []);
        
    const TimeAgoStyled = styled.span`
    color: red;
    font-weight: bold;
    font-size: 14px;
    `;
    
    useEffect(() => {
        if (dataThongBao.length === 0) return;
    
        let index = 0; // Dùng chỉ số để lặp qua các đơn hàng
    
        const interval = setInterval(() => {
            if (index < dataThongBao.length) {
                const item = dataThongBao[index];
                const maskedName = item.IdKH?.name ? item.IdKH.name.slice(0, -4) + '****' : '';
                notification.success({
                    placement: 'bottomLeft',
                    message: (
                        <span>
                            Cảm ơn bạn: <strong>{maskedName}</strong> đã chốt thành công 👇👇👇 &nbsp; &nbsp; &nbsp;
                            <TimeAgoStyled>({timeAgo(item.updatedAt)})</TimeAgoStyled>
                        </span>
                    ),
                    description: `Dự án: ${item.IdSP?.TenSP} 😍😍`,
                });
    
                index += 1; // Tăng chỉ số sau mỗi lần thông báo
            } else {
                clearInterval(interval); // Dừng lại khi hết các đơn hàng
            }
        }, 10000); // Mỗi 10 giây
    
        // Cleanup khi component unmount hoặc dữ liệu thay đổi
        return () => clearInterval(interval);
    }, [dataThongBao]);
    
    function timeAgo(updatedAt) {
        const now = new Date();
        const updatedDate = new Date(updatedAt);
        const diffInSeconds = Math.floor((now - updatedDate) / 1000);
    
        if (diffInSeconds < 60) {
            return `${diffInSeconds} giây trước`;
        }
    
        const diffInMinutes = Math.floor(diffInSeconds / 60);
        if (diffInMinutes < 60) {
            return `${diffInMinutes} phút trước`;
        }
    
        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) {
            return `${diffInHours} giờ trước`;
        }
    
        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays < 30) {
            return `${diffInDays} ngày trước`;
        }
    
        const diffInMonths = Math.floor(diffInDays / 30);
        if (diffInMonths < 12) {
            return `${diffInMonths} tháng trước`;
        }
    
        const diffInYears = Math.floor(diffInMonths / 12);
        return `${diffInYears} năm trước`;
    }

  return (
    <div></div>
  )
}
export default ThongBao