import React, { useState, useEffect } from 'react';
import { Modal, Button, Divider } from 'antd';
import { getAllThongBao } from '../../services/thongBaoBannerAPI';
import { motion } from "framer-motion";

const ThongBaoDauTrang = () => {
  // State để điều khiển việc hiển thị modal
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [dataUpdateSP, setDataUpdateSP] = useState(null)

  // Mở modal khi trang được load
  useEffect(() => {
    setIsModalVisible(true);
  }, []);

  // Hàm đóng modal
  const handleOk = () => {
    setIsModalVisible(false);  // Đóng modal khi nhấn OK
  };

  // Hàm đóng modal khi nhấn Cancel
  const handleCancel = () => {
    setIsModalVisible(false);  // Đóng modal khi nhấn Cancel
  };

  useEffect(() => {
      fetchThongBaoBanner()
  }, [])
  
  const fetchThongBaoBanner = async () => {
              
      const res = await getAllThongBao()
      console.log("res TL: ", res);
      if (res && res.data) {
          setDataUpdateSP(res.data)
      }
  }

  return (
    <div>
      {/* Modal từ Ant Design */}
      <Modal
        title={
          <motion.span 
            style={{ fontSize: "30px", color: "white", display: "inline-block", textShadow: "2px 2px 0px red, -2px -2px 0px red, -2px 2px 0px red, 2px -2px 0px red" }}
            animate={{ rotate: [0, 10, -10, 5, 0] }}
            transition={{ repeat: Infinity, duration: 1, ease: "easeInOut" }}
          >
            🎉 ƯU ĐÃI KHỦNG
          </motion.span>
        }
        width={800}
        visible={isModalVisible}
        onOk={handleOk}  // Hàm khi nhấn OK
        onCancel={handleCancel}  // Hàm khi nhấn Cancel
        footer={null}
      >
        <Divider/>        
        <div className="truncate"  dangerouslySetInnerHTML={{ __html: dataUpdateSP?.title }} />
      </Modal>
    </div>
  );
};

export default ThongBaoDauTrang;
