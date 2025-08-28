import { Button, Col, Divider, Form, Input, message, Modal, notification, Row } from "antd"
import { useState } from "react";
import { FiLogIn } from "react-icons/fi";
import DangKy from "./DangKy";
import { handleLogin, handleQuenPassword } from "../../services/loginKHAPI";
import { useDispatch } from "react-redux";
import { doLoginAction } from "../../redux/accKH/accountSlice";

const DangNhap = (props) => {

    const {
        openModalLogin, setOpenModalLogin
    } = props

    const [form] = Form.useForm()
    const [isSubmit, setIsSubmit] = useState(false);
    const [openModalRegister, setOpenModalRegister] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const dispatch = useDispatch()
    const [formLayMK] = Form.useForm()
    const [isLoadingDoiMK, setIsLoadingDoiMK] = useState(false)
    const [openQuenMK, setOpenQuenMK] = useState(false);

    const handleOk = async (values) => {

        const {name, password} = values
        setIsSubmit(true)
        const res = await handleLogin(name, password)
        if(res && res.data) {
            localStorage.setItem("access_token", res.access_token)   
            dispatch(doLoginAction(res.data))         
            message.success(res.message)            
            handleCancel()
        } else {
            notification.error({ 
                message: "Đăng nhập không thành công!",
                description:
                    res.message && Array.isArray(res.message) ? res.message[0] : res.message,
                duration: 5
            })
        }
        setIsSubmit(false)
    }

    const handleCancel = async () => {
        setOpenModalLogin(false)
        form.resetFields()
    }

    const openFormRegister = () => {
        setOpenModalRegister(true)
    }

    const handleLayMK = async (values) => {
        const email_doimk = values.email; 
        console.log("email_doimk: ", email_doimk);  
    
        if (!email_doimk) {
            notification.error({ 
                message: "Lỗi", 
                description: "Vui lòng nhập email!"
            });
            return;
        }

        try {
            setIsLoadingDoiMK(true)
            const res = await handleQuenPassword(email_doimk);
            console.log("res: ", res);
            
            if (res.data) {
                notification.success({
                    message: "Lấy lại mật khẩu thành công!",
                    description: res.message
                });                
            } else {
                notification.error({ 
                    message: "Lấy lại mật khẩu thất bại!",
                    description: res.message && Array.isArray(res.message) ? res.message[0] : res.message,
                    duration: 5,
                });
            }
            setIsLoadingDoiMK(false)
        } catch (error) {
            notification.error({ 
                message: "Lấy lại mật khẩu thất bại!",
                description: error.message,
            });
        } 
    };
  return (
    <Modal 
        open={openModalLogin} 
        onCancel={handleCancel}
        footer={null}
        maskClosable={false}
    >
        <h4 style={{textAlign: "center", color: "navy"}}>ĐĂNG NHẬP</h4>
        <Divider/>
        <Form
            form={form}
            name="basic"        
            layout="vertical"                
            style={{
                maxWidth: "100%",
            }}
            initialValues={{
                remember: true,
            }}
            onFinish={handleOk}
            autoComplete="off"
        >
            <Row gutter={[10,5]}>
                <Col md={24} sm={24} xs={24}>
                    <Form.Item
                        layout="vertical"
                        hasFeedback
                        label="Tên tài khoản"
                        name="name"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập tên tài khoản!',
                            },
                            {
                                pattern: /^[a-zA-Z0-9]+$/, // Chỉ cho phép chữ cái (không dấu) và số
                                message: 'Tên tài khoản chỉ có thể chứa chữ cái và số, không có dấu và ký tự đặc biệt.',
                            },
                            {
                            validator: (_, value) => {
                                // Kiểm tra không có dấu (chỉ cho phép không dấu)
                                const hasDiacritics = /[áàạảãâấầậẫăắằặẳẵ]/i.test(value);
                                if (hasDiacritics) {
                                return Promise.reject('Tên tài khoản không được có dấu!');
                                }
                                return Promise.resolve();
                            },
                            },
                        ]}
                    >
                    <Input size="large" placeholder="Nhập tài khoản..." />
                    </Form.Item>
                </Col>

                <Col md={24} sm={24} xs={24}>
                    <Form.Item
                        layout="vertical"
                        hasFeedback
                        label="Mật khẩu"
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập mật khẩu!',
                            },
                            {
                                min: 6,
                                message: 'Mật khẩu phải có ít nhất 6 ký tự!',
                            },
                            {
                                pattern: /^[^\s]+$/, // Kiểm tra không có dấu cách (space)
                                message: 'Mật khẩu không được chứa dấu cách!',
                            },
                        ]}
                    >
                    <Input.Password size="large" placeholder="Nhập mật khẩu" />
                    </Form.Item>
                </Col>

                <Col md={24} sm={24} xs={24}>
                    <Button 
                    loading={isSubmit}
                    icon={<FiLogIn size={20} />} 
                    type="primary" size="large" 
                    style={{width: "100%", fontSize: "18px", backgroundColor: "#ff6600"}}
                    onClick={() => form.submit()}
                    >ĐĂNG NHẬP</Button>
                </Col>
            </Row>
        </Form>
            
        <Row gutter={[10,5]} style={{marginTop: "15px"}}>
            <Col md={24} xs={24} style={{display: "flex", justifyContent: "center"}}>
                <a href="#" onClick={() => setOpenQuenMK(true)}>Quên mật khẩu?</a>
            </Col>
            <Col md={24} xs={24} style={{display: "flex", justifyContent: "center"}}>
                <p>Bạn chưa có tài khoản? <a href="#" onClick={() => openFormRegister()}>Đăng ký ngay!</a></p>
            </Col>
        </Row>

        <DangKy
        setOpenModalRegister={setOpenModalRegister}
        openModalRegister={openModalRegister}
        />

        <Modal 
            centered 
            loading={isLoadingDoiMK}
            open={openQuenMK} 
            footer={null}
            width={500}                           
            onCancel={() => {
                setOpenQuenMK(false)
                formLayMK.resetFields()
            }}
        >
            <h4 style={{textAlign: "center", color: "navy"}}>QUÊN MẬT KHẨU</h4>
            <Divider/>
            <Form
            form={formLayMK}
            className="registration-form"                                
            layout="vertical"                                    
            onFinish={handleLayMK} 
            >
                <Row>
                    <Col span={24}>
                        <Form.Item
                            label="Nhập Email đăng ký để lấy mật khẩu"                                        
                            name="email"                                                
                            rules={[
                                {
                                    required: true,
                                    message: 'Nhập email chính xác để lấy lại mật khẩu!',
                                },
                                {
                                    type: "email",
                                    message: 'Vui lòng nhập đúng định dạng địa chỉ email',
                                },

                            ]}
                            hasFeedback
                        ><Input placeholder="Email của bạn..." />
                        </Form.Item>                        
                    </Col>
                    <Col md={24} sm={24} xs={24}>
                        <Button                         
                        type="primary" size="large" 
                        style={{width: "100%", fontSize: "18px", backgroundColor: "#ff6600"}}
                        onClick={() => formLayMK.submit()}
                        >LẤY LẠI MẬT KHẨU</Button>
                    </Col>
                </Row>
            </Form>
        </Modal>   
    </Modal>
  )
}
export default DangNhap