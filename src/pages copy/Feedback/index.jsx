import { Carousel } from "antd";
import { useTranslation } from "react-i18next";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useEffect, useState } from "react";
import { fetchAllFeedback } from "../../services/productAPI";
const FeedBack = () => {

    const { t, i18n } = useTranslation();
    const [dataSP, setDataSP] = useState([])

    const feedbackImages = [
        "https://source.unsplash.com/400x300/?person",
        "https://source.unsplash.com/400x300/?customer",
        "https://source.unsplash.com/400x300/?feedback",
        "https://source.unsplash.com/400x300/?review",
        "https://source.unsplash.com/400x300/?user",
        "https://source.unsplash.com/400x300/?business",
        "https://source.unsplash.com/400x300/?client",
        "https://source.unsplash.com/400x300/?people",
    ];
  
    const settings = {
        dots: false,          // Hiển thị dấu chấm điều hướng
        infinite: true,      // Chạy vòng lặp vô hạn
        speed: 500,          // Thời gian chuyển đổi (ms)
        slidesToShow: 4,     // Hiển thị 4 ảnh cùng lúc
        slidesToScroll: 1,   // Cuộn 1 ảnh mỗi lần
        autoplay: true,      // Tự động chạy slider
        autoplaySpeed: 3000, // Chuyển slide mỗi 3 giây
        swipeToSlide: true,  // Vuốt để chuyển slide
        draggable: true,     // Kéo chuột để chuyển slide
        responsive: [
            {
                breakpoint: 768, 
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                }
            }
        ]
    };

    const fetchListSP = async () => {
        let query = `page=1&limit=9999`

        const res = await fetchAllFeedback(query)
        if (res && res.data) {
            setDataSP(res.data)
        }
    }
    useEffect(() => {
        fetchListSP()
    }, [])

    console.log("dataSP: ", dataSP);
    // Chuyển tất cả ảnh trong các feedback thành 1 mảng lớn
    const allImages = dataSP.flatMap((item) =>
        item.ImageSlider.map((img) => `${import.meta.env.VITE_BACKEND_URL}/uploads/${img}`)
    );

  return (
    <div>
        <div className="container-fluid">
            <div className="container"> <br/>
            <h3 className="text-center" style={{color: "blue"}}>{t('DƯỚI ĐÂY LÀ CÁC GIAO DỊCH ĐÃ THÀNH CÔNG')}</h3>
            <br/>
            <Carousel {...settings}>
            {allImages.map((img, index) => (
                <div key={index} style={{ padding: "20px",border: "none", outline: "none", }}>
                <img
                    key={index}
                    src={img}
                    alt={`Feedback ${index + 1}`}
                    style={{
                        width: "95%",
                        height: "500px",
                        objectFit: "cover",
                        borderRadius: "10px",
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", // Hiệu ứng đổ bóng đẹp hơn
                    }}
                />
                </div>
            ))}
            </Carousel>
            <br/>
            <br/>
            <div className="container"> 
                <h3 className="text-center" style={{color: "blue"}}>{t('VIDEO DEMO CÁC DỰ ÁN PRO')}</h3>
                <div className="text-center">
                    <iframe width="1000" height="450" src="https://www.youtube.com/embed/Vxxe_x-iLW8?si=vzYPSI9dkTFjbhQx" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
                    <iframe width="1000" height="450" src="https://www.youtube.com/embed/loaur6lwdoY?si=DEWCaLrK0fu4m6S0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
                </div>
            </div>
            </div>
        </div>
    </div>
  )
}
export default FeedBack