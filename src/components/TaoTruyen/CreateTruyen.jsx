// import React, { useState } from "react";
// import { Form, Input, Select, Button, Upload, Row, Col, message } from "antd";
// import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
// import styles from "./TaoTruyen.module.css"; // Import file CSS Module
// import { useLocation } from "react-router-dom";
// import { GrLinkNext } from "react-icons/gr";

// const { Option } = Select;

// const CreateTruyen = () => {
//   const [form] = Form.useForm();
//   const [imageUrl, setImageUrl] = useState(null);
//   const location = useLocation();
//   const queryParams = new URLSearchParams(location.search);
//   const idTruyen = queryParams.get("idTruyen");
//   const genres = ["Kinh Dị", "Hài Hước", "Lãng Mạn", "Hành Động", "Phiêu Lưu"];

//   const handleImageUpload = (file) => {
//     const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
//     if (!isJpgOrPng) {
//       message.error("Bạn chỉ có thể tải lên file JPG/PNG!");
//     }
//     return isJpgOrPng;
//   };

//   const handleSubmit = (values) => {
//     console.log("Tạo bài viết với dữ liệu: ", values);
//     message.success("Tạo bài viết thành công!");
//   };

//   return (
//     <div className={styles["form-container"]}>
//       <h2 className={styles["form-header"]}>Tạo bài viết Mới</h2>

//       <Form
//         form={form}
//         onFinish={handleSubmit}
//         layout="vertical"
//         style={{
//           backgroundColor: "white",
//           padding: "20px",
//           borderRadius: "8px",
//         }}
//       >
//         <Row gutter={16}>
//           {/* Bên trái: Upload ảnh */}
//           <Col xs={24} sm={8} md={8} className={styles["form-item-col"]}>
//             <div className={styles["upload-container"]}>
//               <Form.Item
//                 label="Ảnh Bìa Của bài viết"
//                 name="anhBia"
//                 valuePropName="fileList"
//               >
//                 <Upload
//                   name="file"
//                   showUploadList={false}
//                   beforeUpload={handleImageUpload}
//                   onChange={(info) => {
//                     if (info.fileList.length > 0) {
//                       setImageUrl(info.fileList[0].thumbUrl);
//                     }
//                   }}
//                 >
//                   <Button
//                     icon={<UploadOutlined />}
//                     size="large"
//                     className={styles["upload-button"]}
//                   >
//                     Chọn ảnh
//                   </Button>
//                 </Upload>
//                 {imageUrl && (
//                   <div className={styles["uploaded-image"]}>
//                     <img src={imageUrl} alt="Ảnh bìa" />
//                   </div>
//                 )}
//               </Form.Item>
//             </div>
//           </Col>

//           {/* Bên phải: Nhập mô tả */}
//           <Col xs={24} sm={16} md={8} className={styles["form-item-col"]}>
//             <div className={styles["right-column"]}>
//               <Form.Item
//                 label="Mô Tả"
//                 name="moTa"
//                 rules={[
//                   { required: true, message: "Mô tả không được để trống!" },
//                 ]}
//               >
//                 <Input.TextArea
//                   rows={4}
//                   placeholder="Nhập mô tả bài viết"
//                   className={styles["input-style"]}
//                 />
//               </Form.Item>
//             </div>
//           </Col>

//           {/* Giữa: Tên bài viết, tác giả, thể loại */}
//           <Col xs={24} sm={16} md={8} className={styles["form-item-col"]}>
//             <div className={styles["middle-column"]}>
//               <Form.Item
//                 label="Tên bài viết"
//                 name="tenTruyen"
//                 rules={[
//                   {
//                     required: true,
//                     message: "Tên bài viết không được để trống!",
//                   },
//                 ]}
//               >
//                 <Input
//                   placeholder="Nhập tên bài viết"
//                   className={styles["input-style"]}
//                 />
//               </Form.Item>

//               <Form.Item
//                 label="Tác Giả"
//                 name="tacGia"
//                 rules={[
//                   { required: true, message: "Tác giả không được để trống!" },
//                 ]}
//               >
//                 <Input
//                   placeholder="Nhập tên tác giả"
//                   className={styles["input-style"]}
//                 />
//               </Form.Item>

//               <Form.Item
//                 label="Thể Loại"
//                 name="theLoai"
//                 rules={[{ required: true, message: "Vui lòng chọn thể loại!" }]}
//               >
//                 <Select
//                   placeholder="Chọn thể loại"
//                   size="large"
//                   //   className={styles["select-style"]}
//                 >
//                   {genres.map((genre, index) => (
//                     <Option key={index} value={genre}>
//                       {genre}
//                     </Option>
//                   ))}
//                 </Select>
//               </Form.Item>
//             </div>
//           </Col>

//           <Col span={24}>
//             <Form.Item>
//               <Button
//                 type="#"
//                 htmlType="submit"
//                 icon={<PlusOutlined />}
//                 size="large"
//                 block
//                 className={styles["primary-button"]}
//                 // onClick={() => {
//                 //     form.validateFields().then(values => {
//                 //         if (idTruyen) {
//                 //             handleUpdateSP(values);
//                 //         } else {
//                 //             handleCreateSP(values);
//                 //         }
//                 //     }).catch(info => {
//                 //         console.log('Validate Failed:', info);
//                 //     });
//                 // }}
//               >
//                 {idTruyen ? "Lưu lại bài viết" : "Tạo mới bài viết"}
//               </Button>
//             </Form.Item>
//           </Col>
//           {idTruyen ? (
//             <Col span={24}>
//               <Form.Item>
//                 <Button
//                   type="#"
//                   htmlType="submit"
//                   icon={<GrLinkNext />}
//                   size="large"
//                   block
//                   className={styles["primary-button"]}
//                 >
//                   Thêm chi tiết số tập
//                 </Button>
//               </Form.Item>
//             </Col>
//           ) : (
//             ""
//           )}
//         </Row>
//       </Form>
//     </div>
//   );
// };

// export default CreateTruyen;

import React, { useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import { GrLinkNext } from "react-icons/gr";

// Validation Schema với Yup
const validationSchema = Yup.object({
  tenTruyen: Yup.string().required("Tên bài viết không được để trống!"),
  tacGia: Yup.string().required("Tác giả không được để trống!"),
  theLoai: Yup.string().required("Vui lòng chọn thể loại!"),
  moTa: Yup.string().required("Mô tả không được để trống!"),
});

const CreateTruyen = () => {
  const [imageUrl, setImageUrl] = useState(null);
  const genres = ["Kinh Dị", "Hài Hước", "Lãng Mạn", "Hành Động", "Phiêu Lưu"];

  const handleImageUpload = (file) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      alert("Bạn chỉ có thể tải lên file JPG/PNG!");
    }
    return isJpgOrPng;
  };

  // Hàm xử lý submit của Formik
  const handleSubmit = (values) => {
    console.log("Dữ liệu form sau khi submit: ", values);
    // Xử lý submit (ví dụ gửi dữ liệu)
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-semibold text-center text-blue-600 mb-6">
        Tạo bài viết Mới
      </h2>

      {/* Formik Form */}
      <Formik
        initialValues={{
          tenTruyen: "",
          tacGia: "",
          theLoai: "",
          moTa: "",
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ setFieldValue, values, touched, errors }) => (
          <Form>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Bên trái: Upload ảnh */}
              <div className="flex flex-col items-center hover:scale-105 hover:translate-y-1 hover:shadow-lg hover:rounded-3xl transition-transform duration-300">
                <label className="text-sm font-medium text-gray-700">
                  Ảnh Bìa Của bài viết
                </label>
                <div className="mt-2">
                  <input
                    type="file"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      handleImageUpload(file);
                      setImageUrl(URL.createObjectURL(file));
                      setFieldValue("image", file);
                    }}
                    className="p-2 border border-gray-300 rounded-md"
                  />
                  {imageUrl && (
                    <div className="mt-2">
                      <img
                        src={imageUrl}
                        alt="Ảnh bìa"
                        className="w-40 h-40 object-cover rounded-md"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Bên phải: Mô tả */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Mô Tả
                </label>
                <Field
                  as="textarea"
                  rows="4"
                  name="moTa"
                  placeholder="Nhập mô tả bài viết"
                  className={`mt-2 p-2 w-full border rounded-md ${
                    errors.moTa && touched.moTa
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                <ErrorMessage
                  name="moTa"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Giữa: Tên bài viết, tác giả, thể loại */}
              <div className="flex flex-col space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Tên bài viết
                  </label>
                  <Field
                    type="text"
                    name="tenTruyen"
                    placeholder="Nhập tên bài viết"
                    className="mt-2 p-2 w-full border border-gray-300 rounded-md"
                  />
                  <ErrorMessage
                    name="tenTruyen"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Tác Giả
                  </label>
                  <Field
                    type="text"
                    name="tacGia"
                    placeholder="Nhập tên tác giả"
                    className="mt-2 p-2 w-full border border-gray-300 rounded-md"
                  />
                  <ErrorMessage
                    name="tacGia"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Thể Loại
                  </label>
                  <Field
                    as="select"
                    name="theLoai"
                    className="mt-2 p-2 w-full border border-gray-300 rounded-md"
                  >
                    {genres.map((genre, index) => (
                      <option key={index} value={genre}>
                        {genre}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage
                    name="theLoai"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
              </div>
            </div>

            {/* Nút submit */}
            <div className="mt-6 text-center">
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
              >
                Tạo mới bài viết <PlusOutlined className="ml-2" />
              </button>
            </div>

            {/* Nút thêm chi tiết số tập nếu có idTruyen */}
            <div className="mt-4 text-center">
              {false ? (
                <button
                  type="button"
                  className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600"
                >
                  Thêm chi tiết số tập <GrLinkNext className="ml-2" />
                </button>
              ) : null}
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default CreateTruyen;
