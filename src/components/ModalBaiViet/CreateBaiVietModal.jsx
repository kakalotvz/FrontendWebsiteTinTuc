import { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Input,
  Upload,
  Select,
  Switch,
  Row,
  Col,
  Button,
  message,
  Space,
  Typography,
} from "antd";
import {
  InboxOutlined,
  TagsOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import "./CreateBaiVietModal.css";
import {
  deleteImg,
  uploadAudio,
  uploadImg,
  uploadVideo,
} from "../../services/uploadAPI";
import { createBaiViet } from "../../services/apiPost";
import { apiFetchTongQuat } from "../../services/apiTongQuat";
import { useAuthMe } from "../../contexts/AuthMeContext";

// ⬇️ service upload ảnh & tạo bài viết – thay bằng API của bạn
// ví dụ: uploadImg(file) -> { data: { url } }

const { Title, Text } = Typography;
const { Dragger } = Upload;

export default function CreateBaiVietModal({ open, setOpen, hienThiPost }) {
  const { me, role } = useAuthMe();
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [noiDungChinh, setNoiDungChinh] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [fileList, setFileList] = useState([]);
  const [coverPublicId, setCoverPublicId] = useState("");
  const [dataTheLoai, setDataTheLoai] = useState([]);
  const [valueTL, setValueTL] = useState("");

  useEffect(() => {
    hienThiAllTL();
  }, [open]);

  const hienThiAllTL = async () => {
    try {
      let res = await apiFetchTongQuat("/bai-viet/get-the-loai", {
        method: "GET",
      });
      if (res.data) {
        setDataTheLoai(res.data);
      }
    } catch (error) {}
  };

  const onChageTL = (e) => {
    console.log(e);
    setValueTL(e);
  };

  const customUpload = async ({ file, onSuccess, onError }) => {
    try {
      const res = await uploadImg(file);
      console.log("res: ", res);

      const url = res?.data?.url;
      if (!url) throw new Error("Không nhận được URL ảnh.");
      setCoverUrl(url);
      setCoverPublicId(res?.data?.public_id);
      setFileList([
        {
          uid: file.uid,
          name: file.name,
          status: "done",
          url,
          public_id: res?.data?.public_id,
        },
      ]);
      onSuccess?.("ok");
      message.success("✅ Ảnh bìa đã được tải lên");
    } catch (e) {
      console.error(e);
      onError?.(e);
      message.error("❌ Tải ảnh bìa thất bại");
    }
  };

  const confirm = (title, content) =>
    new Promise((resolve) => {
      Modal.confirm({
        title,
        content,
        okText: "Xóa",
        okButtonProps: { danger: true },
        cancelText: "Hủy",
        centered: true,
        onOk: () => resolve(true),
        onCancel: () => resolve(false),
      });
    });

  const handleRemove = async (file) => {
    const ok = await confirm("Xóa ảnh bìa?", "Ảnh sẽ bị xóa trên máy chủ.");
    if (!ok) return false;

    try {
      const pid = file?.public_id || coverPublicId;
      if (pid) {
        await deleteImg(coverPublicId);
      }
      setCoverUrl("");
      setCoverPublicId("");
      setFileList([]);
      message.success("🗑️ Đã xóa ảnh bìa");
      return true; // cho phép antd gỡ file khỏi danh sách
    } catch (e) {
      console.error(e);
      message.error("❌ Xóa ảnh trên server thất bại");
      return false; // chặn antd xóa khỏi UI
    }
  };

  const onCancel = () => {
    setOpen(false);
    form.resetFields("");
    setNoiDungChinh("");
    setFileList([]);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      console.log("values: ", values);
      console.log("coverUrl: ", coverUrl);
      console.log("noiDungChinh: ", noiDungChinh);
      console.log("valueTL: ", valueTL);

      if (!coverUrl) {
        message.warning("Vui lòng tải ảnh bìa.");
        return;
      }
      if (!noiDungChinh || !noiDungChinh.trim()) {
        message.warning("Vui lòng nhập nội dung chính.");
        return;
      }

      setSubmitting(true);
      const payload = {
        title: values.title,
        anhBia: coverUrl,
        moTaNgan: values.moTaNgan,
        noiDungChinh,
        tags: values.tags || [],
        theLoai: valueTL,
        nguoiTao: me?._id,
      };

      //   const res = await createBaiViet(payload);
      const res = await apiFetchTongQuat("/bai-viet/create-bai-viet", {
        method: "POST",
        body: payload,
      });
      if (res.data) {
        message.success("🎉 Tạo bài viết thành công!");
        await hienThiPost();
        // reset
        form.resetFields();
        setNoiDungChinh("");
        setCoverUrl("");
        setFileList([]);
        onCancel();
      }
    } catch (err) {
      // đã được antd hiển thị lỗi validate, chỉ log khi catch khác
      if (err?.errorFields) return;
      console.error(err);
      message.error("Có lỗi xảy ra khi tạo bài viết.");
    } finally {
      setSubmitting(false);
    }
  };

  // ====== CKEditor Upload Adapter (ẢNH) ======
  const customUploadAdapter1 = (loader) => {
    return {
      upload: () =>
        new Promise((resolve, reject) => {
          loader.file.then((file) => {
            uploadImg(file)
              .then((res) => {
                message.success(`✅ Upload ảnh thành công: ${file?.name}`);
                resolve({ default: res.data.url });
              })
              .catch((err) => {
                console.error("❌ Upload ảnh lỗi:", err);
                reject(err);
              });
          });
        }),
    };
  };
  // ====== Upload Adapter (ẢNH + VIDEO) ======
  const customUploadAdapter = (loader, editor) => ({
    upload: () =>
      new Promise((resolve, reject) => {
        loader.file.then(async (file) => {
          try {
            // ====== AUDIO ======
            if (file.type.startsWith("audio/")) {
              const res = await uploadAudio(file);
              const url = res?.data?.url;
              if (!url) throw new Error("Không nhận được URL audio");
              insertAudioTag(editor, url); // chèn <audio>
              insertOembed(editor, url);
              resolve({ default: url });
              return;
            }

            if (file.type.startsWith("video/")) {
              const res = await uploadVideo(file); // API upload video của bạn
              const url = res?.data?.url;
              if (!url) throw new Error("Không nhận được URL video");
              insertOembed(editor, url); // 👈 chèn bằng oEmbed
              resolve({ default: url });
              return;
            }
            // Ảnh giữ nguyên
            const res = await uploadImg(file);
            const url = res?.data?.url;
            if (!url) throw new Error("Không nhận được URL ảnh");
            resolve({ default: url });
          } catch (e) {
            console.error(e);
            reject(e);
          }
        });
      }),
    abort: () => {},
  });

  function uploadPlugin(editor) {
    editor.plugins.get("FileRepository").createUploadAdapter = (loader) =>
      customUploadAdapter(loader, editor);
  }

  function uploadPlugin1(editor) {
    editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
      return customUploadAdapter(loader);
    };
  }

  const handleTagsChange = (vals) => {
    // loại bỏ trống + trùng lặp
    let uniq = Array.from(
      new Set((vals || []).map((v) => String(v).trim()).filter(Boolean))
    );

    if (uniq.length > 10) {
      uniq = uniq.slice(0, 10); // cắt còn 10
      message.warning("Chỉ chọn/tạo tối đa 10 tag");
    }
    form.setFieldsValue({ tags: uniq }); // cập nhật lại vào Form
  };

  const blockWhenFull = (e) => {
    const curr = form.getFieldValue("tags") || [];
    if (
      curr.length >= 10 &&
      (e.key === "Enter" || e.key === "Tab" || e.key === ",")
    ) {
      e.preventDefault(); // chặn thêm tag mới
      message.warning("Đã đủ 10 tag");
    }
  };

  // tùy chọn kéo thả video
  function videoDropPlugin(editor) {
    const view = editor.editing.view;

    view.document.on("drop", async (evt, data) => {
      const f = [...(data.dataTransfer?.files || [])].find((f) =>
        f.type.startsWith("video/")
      );
      if (!f) return;
      evt.stop();
      try {
        const res = await uploadVideo(f);
        const url = res?.data?.url;
        if (url) insertOembed(editor, url);
      } catch (e) {
        console.error(e);
      }
    });

    view.document.on("clipboardInput", async (evt, data) => {
      const f = [...(data.dataTransfer?.files || [])].find((f) =>
        f.type.startsWith("video/")
      );
      if (!f) return;
      evt.stop();
      try {
        const res = await uploadVideo(f);
        const url = res?.data?.url;
        if (url) insertOembed(editor, url);
      } catch (e) {
        console.error(e);
      }
    });
  }

  // chèn block MediaEmbed (an toàn với build Classic mặc định)
  function insertOembed1(editor, url) {
    const html = `<figure class="media"><oembed url="${url}"></oembed></figure>`;
    editor.model.change((writer) => {
      const viewFrag = editor.data.processor.toView(html);
      const modelFrag = editor.data.toModel(viewFrag);
      editor.model.insertContent(modelFrag, editor.model.document.selection);
    });
  }
  // dùng chung cho audio + video
  function insertOembed(editor, url) {
    const html = `<figure class="media"><oembed url="${url}"></oembed></figure>`;
    editor.model.change(() => {
      const viewFrag = editor.data.processor.toView(html);
      const modelFrag = editor.data.toModel(viewFrag);
      editor.model.insertContent(modelFrag, editor.model.document.selection);
    });
  }

  function insertAudioTag(editor, url) {
    const html = `
    <figure class="media">
      <audio
        src="${url}"
        controls
        controlsList="nodownload noplaybackrate"
        oncontextmenu="return false;"
        style="width:100%;outline:none"
      ></audio>
    </figure>`;
    editor.model.change(() => {
      const viewFrag = editor.data.processor.toView(html);
      const modelFrag = editor.data.toModel(viewFrag);
      editor.model.insertContent(modelFrag, editor.model.document.selection);
    });
  }
  // cho phép kéo thả audio/video
  function avDropPlugin1(editor) {
    const view = editor.editing.view;

    const handle = async (file) => {
      try {
        if (file.type.startsWith("audio/")) {
          const r = await uploadAudio(file);
          const url = r?.data?.url;
          if (url) insertAudioTag(editor, url);
        } else if (file.type.startsWith("video/")) {
          const r = await uploadVideo(file);
          const url = r?.data?.url;
          if (url) insertOembed(editor, url);
        }
      } catch (e) {
        console.error(e);
      }
    };

    view.document.on("drop", async (evt, data) => {
      const f = [...(data.dataTransfer?.files || [])].find(
        (f) => f.type.startsWith("audio/") || f.type.startsWith("video/")
      );
      if (!f) return;
      evt.stop();
      await handle(f);
    });

    view.document.on("clipboardInput", async (evt, data) => {
      const f = [...(data.dataTransfer?.files || [])].find(
        (f) => f.type.startsWith("audio/") || f.type.startsWith("video/")
      );
      if (!f) return;
      evt.stop();
      await handle(f);
    });
  }
  function avDropPlugin(editor) {
    const view = editor.editing.view;

    const handle = async (evt, data) => {
      const files = [...(data.dataTransfer?.files || [])];
      if (!files.length) return;

      const f = files.find((x) => /^audio\/|^video\//.test(x.type));
      if (!f) return;

      evt.stop(); // chặn CKEditor xử lý mặc định

      try {
        const api = f.type.startsWith("audio/") ? uploadAudio : uploadVideo;
        const res = await api(f);
        const url = res?.data?.url;
        if (url) insertOembed(editor, url);
      } catch (e) {
        console.error(e);
      }
    };

    view.document.on("drop", handle);
    view.document.on("clipboardInput", handle);
  }

  return (
    <Modal
      className="create-post-modal"
      title={
        <Title level={4} style={{ margin: 0 }}>
          ✍️ Thêm bài viết
        </Title>
      }
      open={open}
      onCancel={onCancel}
      width={1080}
      okText="Lưu bài viết"
      cancelText="Hủy"
      onOk={handleOk}
      confirmLoading={submitting}
      destroyOnClose
      maskClosable={false}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{ status: true, tags: [] }}
      >
        <Row gutter={[24, 16]}>
          <Col xs={24} md={14}>
            <Form.Item
              name="title"
              label="Tiêu đề"
              rules={[
                { required: true, message: "Vui lòng nhập tiêu đề." },
                { max: 150, message: "Tối đa 150 ký tự." },
              ]}
            >
              <Input
                size="large"
                placeholder="Nhập tiêu đề hấp dẫn..."
                allowClear
              />
            </Form.Item>

            <Form.Item
              name="moTaNgan"
              label="Mô tả ngắn"
              rules={[
                { required: true, message: "Vui lòng nhập mô tả ngắn." },
                { max: 500, message: "Tối đa 500 ký tự." },
              ]}
            >
              <Input.TextArea
                size="large"
                showCount
                maxLength={500}
                autoSize={{ minRows: 3, maxRows: 5 }}
                placeholder="Tóm tắt nội dung chính, hiển thị trong danh sách bài viết…"
              />
            </Form.Item>

            <div className="ck-label">
              <Space align="center" size={8}>
                <FileTextOutlined />
                <Text strong>Nội dung chính</Text>
              </Space>
            </div>
            <div className="editor-wrap">
              {/* <CKEditor
                editor={ClassicEditor}
                data={noiDungChinh}
                onChange={(_, editor) => setNoiDungChinh(editor.getData())}
                config={{
                  placeholder: "Soạn nội dung bài viết tại đây…",
                }}
              /> */}
              <CKEditor
                editor={ClassicEditor}
                config={{
                  extraPlugins: [uploadPlugin, avDropPlugin], // ảnh + video
                  placeholder: "Soạn nội dung ở đây...",
                  toolbar: [
                    "heading",
                    "|",
                    "bold",
                    "italic",
                    "link",
                    "bulletedList",
                    "numberedList",
                    "|",
                    "mediaEmbed",
                    "imageUpload",
                    "blockQuote",
                    "undo",
                    "redo",
                  ],
                  htmlSupport: {
                    allow: [
                      {
                        name: /^(audio|video|source|figure|div)$/,
                        attributes: true,
                        classes: true,
                        styles: true,
                      },
                    ],
                  },
                  mediaEmbed: {
                    previewsInData: true, // lưu HTML render vào data
                    providers: [
                      // Audio trực tiếp mp3/wav/ogg/m4a
                      {
                        name: "directAudio",
                        url: /https?:\/\/.*\.(mp3|wav|ogg|m4a)(\?.*)?$/i,
                        html: (match) =>
                          `<div class="ck-media__wrapper">
             <audio controls controlsList="nodownload noplaybackrate"
                    oncontextmenu="return false;" src="${match[0]}"
                    style="width:100%"></audio>
           </div>`,
                      },
                      // match mọi URL mp4/webm/ogg
                      {
                        name: "directVideo",
                        url: /https?:\/\/.*\.(mp4|webm|ogg)(\?.*)?$/i,
                        html: (match) =>
                          `<div class="ck-media__wrapper">
               <video controls src="${match[0]}" style="max-width:100%;height:auto;border-radius:8px"></video>
             </div>`,
                      },
                      // Cloudinary video
                      {
                        name: "cloudinaryVideo",
                        url: /https?:\/\/res\.cloudinary\.com\/.*\/video\/upload\/.*\.(mp4|webm|ogg)(\?.*)?$/i,
                        html: (match) =>
                          `<div class="ck-media__wrapper">
               <video controls src="${match[0]}" style="max-width:100%;height:auto;border-radius:8px"></video>
             </div>`,
                      },
                    ],
                  },
                  heading: {
                    options: [
                      {
                        model: "paragraph",
                        title: "Paragraph",
                        class: "ck-heading_paragraph",
                      },
                      {
                        model: "heading1",
                        view: "h1",
                        title: "Heading 1",
                        class: "ck-heading_heading1",
                      },
                      {
                        model: "heading2",
                        view: "h2",
                        title: "Heading 2",
                        class: "ck-heading_heading2",
                      },
                      {
                        model: "heading3",
                        view: "h3",
                        title: "Heading 3",
                        class: "ck-heading_heading3",
                      },
                    ],
                  },
                }}
                data={noiDungChinh}
                onChange={(event, editor) => setNoiDungChinh(editor.getData())}
              />
            </div>
          </Col>

          <Col xs={24} md={10}>
            <Form.Item label="Ảnh bìa" required>
              <Dragger
                name="file"
                accept="image/*"
                multiple={false}
                maxCount={1}
                listType="picture-card"
                customRequest={customUpload}
                fileList={fileList}
                onRemove={handleRemove}
                // ✅ Validate đúng cách: cho phép upload (return true) hoặc bỏ qua file (LIST_IGNORE)
                beforeUpload={(file) => {
                  const isImage = file.type.startsWith("image/");
                  const isLt2M = file.size / 1024 / 1024 < 2;

                  if (!isImage) {
                    message.error("Chỉ nhận file ảnh!");
                    return Upload.LIST_IGNORE;
                  }
                  if (!isLt2M) {
                    message.error("Ảnh phải nhỏ hơn 2MB!");
                    return Upload.LIST_IGNORE;
                  }
                  return true; // rất quan trọng: KHÔNG return false ở đây
                }}
                onChange={({ file }) => {
                  if (file.status === "uploading") {
                    // message.loading({
                    //   content: "Đang tải ảnh...",
                    //   key: "up",
                    //   duration: 0,
                    // });
                  } else {
                    message.destroy("up");
                  }
                }}
              >
                {!fileList.length && (
                  <div className="drag-inner">
                    <p className="ant-upload-drag-icon">📁</p>
                    <p className="ant-upload-text">
                      Kéo thả ảnh vào đây hoặc bấm để chọn
                    </p>
                    <p className="ant-upload-hint">Ảnh ngang, &lt; 2MB</p>
                  </div>
                )}
              </Dragger>
            </Form.Item>

            <Form.Item
              name="theLoai"
              required
              label="Thể loại"
              tooltip="Thể loại tương ứng"
            >
              <Select
                className="w100"
                size="large"
                allowClear
                placeholder="Thể loại"
                value={valueTL}
                onChange={(e) => onChageTL(e)}
              >
                {dataTheLoai.map((item, index) => (
                  <Option key={index} value={item._id}>
                    {item.ten}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item name="tags" label="Tags (nhập & Enter)">
              <Select
                mode="tags"
                size="large"
                placeholder="Ví dụ: Toán, Ôn thi, Kinh nghiệm…"
                allowClear
                suffixIcon={<TagsOutlined />}
                maxTagCount="responsive" // chỉ ảnh hưởng hiển thị
                onChange={handleTagsChange} // 👈 giới hạn 2
                onInputKeyDown={blockWhenFull} // 👈 chặn phím khi đã đủ
                tokenSeparators={[","]} // (tuỳ chọn) nhập nhanh bằng dấu phẩy
              />
            </Form.Item>

            <Space style={{ marginTop: 8 }} direction="vertical" size={4}>
              <Text type="secondary">
                • Nhấn <b>Lưu bài viết</b> để tạo mới.
              </Text>
              <Text type="secondary">
                • Bạn có thể sửa/xóa/bật tắt hiển thị ở trang quản lý.
              </Text>
            </Space>
          </Col>
        </Row>
      </Form>

      <div className="footer-help">
        <Text type="secondary">
          Mẹo: bạn có thể dán hình ảnh trực tiếp vào nội dung CKEditor.
        </Text>
      </div>
    </Modal>
  );
}
