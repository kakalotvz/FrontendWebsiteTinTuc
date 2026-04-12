import { Button, Col, Divider, Form, Input, InputNumber, message, Modal, notification, Row } from "antd"
import { useState } from "react";
import { MdCreateNewFolder } from "react-icons/md";
import { handleRegister, handleXacThucOTP } from "../../services/loginKHAPI";
;

const DangKy = (props) => {

    const {
        openModalRegister, setOpenModalRegister
    } = props

    const [form] = Form.useForm()
    const [formOTP] = Form.useForm()
    const [isSubmit, setIsSubmit] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [isLoadingOTP, setIsLoadingOTP] = useState(false);

    const handleOk = async (values) => {
        
        const {email, name, password} = values
        formOTP.setFieldsValue({email: email})
        setIsSubmit(true)
        const res = await handleRegister(email, password, name)
        if(res.success === true) {
            message.success(res.message)
            setShowModal(true)
            form.resetFields()
        } else {
            notification.error({ 
                message: "Đăng ký không thành công!",
                description:
                    res.message && Array.isArray(res.message) ? res.message[0] : res.message,
                duration: 5
            })
        }
        setIsSubmit(false)
    }

    const handleXacThucTaiKhoanOTP = async (values) => {
        const {
            otp, email
        } = values

        console.log("otp, email: ", otp, email);
        
        setIsLoadingOTP(true)
        try {
            const res = await handleXacThucOTP(otp, email)
            console.log("res: ", res);
            
            if(res.success === true) {
                // message.success('Đăng ký tài khoản thành công! Bạn có thể đăng nhập!')
                message.success(res.message)
                formOTP.resetFields()
                form.resetFields()
                setShowModal(false)
                setOpenModalRegister(false)
            } else {
                notification.error({ 
                    message: "Xác thực OTP không thành công!",
                    description:
                        res.message && Array.isArray(res.message) ? res.message[0] : res.message,
                    duration: 5
                })
            }
        } catch (error) {
            console.error('Error verifying OTP:', error);
            notification.error({
                message: "Xác thực OTP không thành công!",
                description: "Đã xảy ra lỗi, vui lòng thử lại!",
                duration: 5
            });
        }
        setIsLoadingOTP(false)
    }

    const handleCancel = () => {
        setOpenModalRegister(false)
        form.resetFields()
    }

    const cancelModalOTP = () => {
        setShowModal(false)
        formOTP.resetFields()
    }


  return (
    <>
        <Modal 
            open={openModalRegister} 
            onCancel={handleCancel}
            footer={null}
            maskClosable={false}
        >
            <h4 style={{textAlign: "center", color: "navy"}}>ĐĂNG KÝ</h4>
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
                            label="Email"
                            name="email"
                            rules={[
                                {
                                    required: true,
                                    message: 'Không bỏ trống',
                                }, 
                                {
                                    type: "email",
                                    message: 'Không đúng định dạng',
                                },                            
                            ]}
                        >
                        <Input 
                         onChange={(e) => {
                            const newValue = e.target.value.toLowerCase(); // Chuyển toàn bộ thành chữ thường
                            form.setFieldsValue({ email: newValue }); // Cập nhật lại giá trị vào Form
                        }}
                        type="email" size="large" placeholder="Nhập email..." />
                        </Form.Item>
                    </Col>
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
                        <Input 
                        onChange={(e) => {
                            const newValue = e.target.value.toLowerCase(); // Chuyển toàn bộ thành chữ thường
                            form.setFieldsValue({ name: newValue }); // Cập nhật lại giá trị vào Form
                        }}
                        size="large" placeholder="Nhập tài khoản..." />
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
                        icon={<MdCreateNewFolder size={20} />} 
                        type="primary" size="large" 
                        style={{width: "100%", fontSize: "18px", backgroundColor: "#ff6600"}}
                        onClick={() => form.submit()}
                        >ĐĂNG KÝ TÀI KHOẢN</Button>
                    </Col>
                </Row>
            </Form>  

        </Modal>
        <Modal 
            maskClosable={false} 
            title="Vui lòng nhập mã OTP để xác thực tài khoản!" 
            open={showModal} 
            onOk={() => formOTP.submit()} 
            onCancel={() => cancelModalOTP()}
        >
            <Divider />
            <Form
                form={formOTP}
                name="basic"        
                layout="vertical"                                                        
                onFinish={handleXacThucTaiKhoanOTP}
                autoComplete="off"
                loading={isLoadingOTP}
            >
                <Row gutter={[20,15]}>
                    <Col span={24} md={24} sm={24} xs={24}>
                        <Form.Item hidden name="email" ><Input /></Form.Item>

                        <Form.Item
                            hasFeedback
                            layout="vertical"
                            label="Nhập mã OTP vừa gửi tới email đăng ký"
                            name="otp"
                            rules={[
                                {
                                    required: true,
                                    message: 'Nhập chính xác OTP của bạn!',
                                },
                            ]}
                        >
                        <InputNumber style={{width: "max-content"}} placeholder="Nhập mã OTP" />
                        </Form.Item>
                    </Col> 
                </Row>
            </Form>
        </Modal>                
    </>
  )
}
export default DangKy