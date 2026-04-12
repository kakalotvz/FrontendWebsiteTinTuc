import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { getAllThongBao } from "../../services/thongBaoBannerAPI";

const NotificationModal = () => {
  const [show, setShow] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const [dataUpdateSP, setDataUpdateSP] = useState(null)
  const cookieName = "modal_dismiss_56533b4875724683083c9625bc1f3af7";

  useEffect(() => {
    if (!document.cookie.split("; ").some((row) => row.startsWith(cookieName))) {
      setShow(true);
    }
  }, []);

  const handleClose = () => {
    setShow(false);
    if (dontShowAgain) {
      const expires = new Date(Date.now() + 60 * 60 * 1000).toUTCString(); // 1 hour
      document.cookie = `${cookieName}=true; expires=${expires}; path=/`;
    }
  };

  useEffect(() => {
    fetchGiaRobux()
  }, [])

  const fetchGiaRobux = async () => {
              
      const res = await getAllThongBao()
      console.log("res TL: ", res);
      if (res && res.data) {
          setDataUpdateSP(res.data[0])
      }
  }

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>THÔNG BÁO</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* <p>
          <span style={{ color: "#212529", backgroundColor: "#b5d6a5", fontSize: "20.8px" }}>
          Shop Robux chính thức chỉ có link shoprobux.store còn lại là fake và scam ✅
          </span>
        </p>      
        <p>
        Cám ơn các bạn đã tin tưởng ủng 
        Shop Robux nhé !!!
        </p>
        <p>
          ☎ Phone: <a href="tel:0372449167">0372449167</a>
        </p> */}
         <div className="truncate"  dangerouslySetInnerHTML={{ __html: dataUpdateSP?.title }} />
      </Modal.Body>
      <Modal.Footer>
        <Form.Check 
          type="checkbox" 
          label="Không hiển thị lại!" 
          onChange={(e) => setDontShowAgain(e.target.checked)} 
        />
        <Button variant="secondary" onClick={handleClose}>
          Skip
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default NotificationModal;
