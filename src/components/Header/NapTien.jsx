import { Drawer } from "antd"
import { BsBank } from "react-icons/bs";
import './styles.css'
import { useSelector } from "react-redux";
const NapTien = (props) => {

    const {
        openDrawer, setOpenDrawer
    } = props

    const userName = useSelector(state => state.accountKH.user.name)
    const userId = useSelector(state => state.accountKH.user._id)

    const onClose = () => {
        setOpenDrawer(false)
    }

  return (
    <Drawer
        title={<div style={{textAlign: "center"}}><BsBank />&nbsp; NẠP TIỀN VÀO TÀI KHOẢN</div>}
        placement={"left"}
        closable={true}
        onClose={onClose}
        open={openDrawer}
        width={450}
        key={'left'}
      >
        <div className="box-drawer">
            <div style={{fontWeight: "bold", fontSize: "20px"}}>Thông tin chuyển khoản</div>
            <div style={{fontSize: "16px"}}>Vui lòng quét mã QR bên dưới:</div>
            <div>
                <img height={300} src={`https://img.vietqr.io/image/970422-0972138493-compact.png?addInfo=NAP${userName}&accountName=DO+KHAC+TU`} alt="" />
                {/* <img src={`https://qr.sepay.vn/img?acc=VQRQABFQK3720&bank=MBBank&amount=100000&des=DH102969`}></img> */}
            </div>
            <div style={{fontSize: "16px"}}>Hoặc chuyển khoản theo thông tin bên dưới:</div>
            <div style={{
                width: "100%", backgroundColor: "#e6e8eb", borderRadius: "10px", textAlign: "start", padding: "5px 15px", 
            }}>
                <div className="txt-bank">Ngân Hàng: <span className="txt-nho">MBBank</span></div>
                <div className="txt-bank">Số tài khoản: <span className="txt-nho">0972138493</span></div>
                <div className="txt-bank">Chủ tài khoản: <span className="txt-nho">DO KHAC TU</span></div>
                <div className="txt-bank">Nội dung: <span className="txt-nho">NAP{userName}</span></div>
            </div>
            <div style={{fontSize: "14px"}}>Đơn sẽ được tự động duyệt sau từ 1 đến 5 phút</div>
        </div>
    </Drawer>
  )
}
export default NapTien