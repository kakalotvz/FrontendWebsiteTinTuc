import axios from "../utils/axios-customize";

// upload hình ảnh
export const uploadImg = (file) => {
    const bodyFormData = new FormData();
    bodyFormData.append("file", file);
    return axios({
        method: "post",
        url: "/api/upload/upload",
        data: bodyFormData,
        headers: {
            "Content-Type": "multipart/form-data",
            "upload-type": "book",
        },
    });
};

export const uploadSliderImgs = (files) => {
    const formData = new FormData();
    files.forEach((file) => {
        formData.append("files", file); // "files" là field trùng với multer
    });

    return axios.post("/api/upload/uploadSlider", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};

export const deleteImg = (public_id) => {
    return axios.post("/api/upload/delete", {
        public_id,
    });
};


// 📝 Sinh file Word từ nội dung định dạng chuẩn
export const generateWordFile = async (content) => {
  try {
    const res = await axios.post(
      "/api/word/generate",
      { content },
      { responseType: "blob" }
    );
    return res;
  } catch (err) {
    console.error("❌ Error creating Word file:", err);
    throw err;
  }
};

export const uploadAudio = (file) => {
  const formData = new FormData();
  formData.append("audio", file);
  return axios.post("/api/audio/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const deleteAudio = (public_id) => {
  return axios.post("/api/audio/delete", { public_id });
};
