import React, { useEffect, useState } from "react";
import {
  Table, Button, Modal, Form, Input, Select,
  Switch, Space, Tag, message, Card, Tabs, Popconfirm, DatePicker
} from "antd";
import moment from "moment";
import {
  PlusOutlined, EditOutlined, DeleteOutlined, 
  PlayCircleOutlined, SettingOutlined, GlobalOutlined,
  PauseOutlined, CaretRightOutlined, LoadingOutlined
} from "@ant-design/icons";
import { apiFetchTongQuat } from "../../services/apiTongQuat";
import { io } from "socket.io-client";

const { Option } = Select;

export default function CrawlerManager() {
  const [configs, setConfigs] = useState([]);
  const [theLoaiMap, setTheLoaiMap] = useState([]);
  const [settings, setSettings] = useState({ geminiKey: "", frequency: "6h" });
  const [loading, setLoading] = useState(false);
  const [openConfigModal, setOpenConfigModal] = useState(false);
  const [editingConfig, setEditingConfig] = useState(null);
  
  const [formConfig] = Form.useForm();
  const [formSettings] = Form.useForm();

  // State cho progress
  const [progress, setProgress] = useState(null); // { current, total, title, source }
  const [isCrawling, setIsCrawling] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [configList, tlList, currentSettings] = await Promise.all([
        apiFetchTongQuat("/crawler/config"),
        apiFetchTongQuat("/bai-viet/get-the-loai"),
        apiFetchTongQuat("/crawler/settings")
      ]);
      setConfigs(configList);
      setTheLoaiMap(tlList.data || []);
      setSettings(currentSettings);
      formSettings.setFieldsValue(currentSettings);
    } catch (e) {
      message.error("Lỗi khi tải dữ liệu");
    }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  // Kết nối socket để nhận progress
  useEffect(() => {
    const socket = io(import.meta.env.VITE_API_URL || "https://backendwebapptintuc-backendwebapptintuc.up.railway.app");
    
    socket.on("crawler:status", (data) => {
      setIsCrawling(data.running);
      if (!data.running) {
        setTimeout(() => setProgress(null), 3000); // Ẩn progress sau khi xong 3 giây
      }
    });

    socket.on("crawler:progress", (data) => {
      setProgress(data);
      setIsCrawling(true);
    });

    return () => socket.disconnect();
  }, []);

  const handleSaveConfig = async (values) => {
    // Chuẩn hóa dữ liệu ngày tháng
    const payload = { ...values };
    if (values.dateRange) {
        payload.startDate = values.dateRange[0].toDate();
        payload.endDate = values.dateRange[1].toDate();
    } else if (values.specificDate) {
        payload.startDate = values.specificDate.toDate();
        payload.endDate = values.specificDate.toDate();
    }

    try {
      if (editingConfig) {
        await apiFetchTongQuat(`/crawler/config/${editingConfig._id}`, {
          method: "PUT",
          body: payload
        });
        message.success("Cập nhật thành công");
      } else {
        await apiFetchTongQuat("/crawler/config", {
          method: "POST",
          body: payload
        });
        message.success("Thêm mới thành công");
      }
      setOpenConfigModal(false);
      fetchData();
    } catch (e) { message.error(e.message); }
  };

  const handleDeleteConfig = async (id) => {
    try {
      await apiFetchTongQuat(`/crawler/config/${id}`, { method: "DELETE" });
      message.success("Đã xóa");
      fetchData();
    } catch (e) { message.error(e.message); }
  };

  const handleSaveSettings = async (values) => {
    try {
      await apiFetchTongQuat("/crawler/settings", {
        method: "POST",
        body: values
      });
      message.success("Đã lưu cài đặt");
      fetchData();
    } catch (e) { message.error(e.message); }
  };

  const handleRunNow = async () => {
    try {
      await apiFetchTongQuat("/crawler/run-now", { method: "POST" });
      message.success("Hệ thống đã bắt đầu quét tin ngầm...");
    } catch (e) { message.error(e.message); }
  };

  const columns = [
    { title: "Tên nguồn", dataIndex: "name", key: "name" },
    { title: "Link RSS", dataIndex: "url", key: "url", ellipsis: true },
    { 
        title: "Danh mục đích", 
        dataIndex: "targetCategory", 
        key: "targetCategory",
        render: (cat) => <Tag color="blue">{cat?.ten || "N/A"}</Tag>
    },
    { 
        title: "Hoạt động", 
        dataIndex: "isActive", 
        key: "isActive",
        render: (active, record) => (
            <Switch 
                checked={active} 
                onChange={(val) => handleSaveConfig({ ...record, isActive: val })} 
            />
        )
    },
    {
        title: "Tạm dừng",
        dataIndex: "isPaused",
        key: "isPaused",
        render: (isPaused, record) => (
            <Button 
                size="small"
                type={isPaused ? "primary" : "default"}
                danger={!isPaused}
                icon={isPaused ? <CaretRightOutlined /> : <PauseOutlined />}
                onClick={() => handleSaveConfig({ ...record, isPaused: !isPaused })}
            >
                {isPaused ? "Tiếp tục" : "Tạm dừng"}
            </Button>
        )
    },
    { 
        title: "Lần chạy cuối", 
        dataIndex: "lastRun", 
        key: "lastRun",
        render: (date) => date ? new Date(date).toLocaleString("vi-VN") : "Chưa chạy"
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button 
            icon={<EditOutlined />} 
            onClick={() => {
              setEditingConfig(record);
              formConfig.setFieldsValue({
                ...record,
                targetCategory: record.targetCategory?._id,
                dateRange: record.startDate && record.endDate ? [moment(record.startDate), moment(record.endDate)] : null,
                specificDate: record.startDate ? moment(record.startDate) : null
              });
              setOpenConfigModal(true);
            }} 
          />
          <Popconfirm title="Xóa nguồn này?" onConfirm={() => handleDeleteConfig(record._id)}>
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Card 
        title={<span><GlobalOutlined /> Quản lý Tự động lấy tin (Auto Crawler)</span>}
        extra={
          <Space>
            <Button type="primary" danger icon={<PlayCircleOutlined />} onClick={handleRunNow}>
              Quét ngay bây giờ
            </Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => {
                setEditingConfig(null);
                formConfig.resetFields();
                setOpenConfigModal(true);
            }}>
              Thêm nguồn RSS
            </Button>
          </Space>
        }
      >
        <Tabs defaultActiveKey="1">
          <Tabs.TabPane tab={<span><GlobalOutlined /> Danh sách nguồn tin</span>} key="1">
            {progress && (
              <Card size="small" style={{ marginBottom: 16, border: '1px solid #1890ff', backgroundColor: '#e6f7ff' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span><b>Đang quét:</b> {progress.source}</span>
                  <span><b>Tiến độ:</b> {progress.current} / {progress.total} bài</span>
                </div>
                <div style={{ padding: '0 10px' }}>
                  <div style={{ marginBottom: 5, fontSize: 13, color: '#555' }}>
                    <LoadingOutlined /> Đang xử lý: <i>{progress.title}</i>
                  </div>
                  <div style={{ height: 10, background: '#f5f5f5', borderRadius: 5, overflow: 'hidden' }}>
                      <div style={{ 
                          height: '100%', 
                          width: `${(progress.current / progress.total) * 100}%`, 
                          background: 'linear-gradient(90deg, #1890ff 0%, #00c6ff 100%)',
                          transition: 'width 0.3s ease'
                      }} />
                  </div>
                </div>
              </Card>
            )}

            <Table 
                rowKey="_id" 
                dataSource={configs} 
                columns={columns} 
                loading={loading} 
                pagination={false}
            />
          </Tabs.TabPane>
          
          <Tabs.TabPane tab={<span><SettingOutlined /> Cài đặt hệ thống</span>} key="2">
            <Form 
                form={formSettings} 
                layout="vertical" 
                onFinish={handleSaveSettings}
                style={{ maxWidth: 600 }}
            >
              <Form.Item 
                label="Gemini AI API Key" 
                name="geminiKey"
                help="Lấy tại Google AI Studio (miễn phí)"
              >
                <Input.Password placeholder="Nhập API Key..." />
              </Form.Item>
              
              <Form.Item label="Tần suất quét tự động" name="frequency">
                <Select>
                  <Option value="30m">30 phút / lần</Option>
                  <Option value="1h">1 giờ / lần</Option>
                  <Option value="6h">6 giờ / lần</Option>
                  <Option value="12h">12 giờ / lần</Option>
                  <Option value="1d">1 ngày / lần</Option>
                </Select>
              </Form.Item>

              <Form.Item 
                label="Giới hạn số bài viết mỗi lần quét" 
                name="maxArticles"
                help="Tránh lãng phí tài nguyên AI nếu RSS có quá nhiều tin cũ"
              >
                <Input type="number" min={1} max={50} style={{ width: '100%' }} />
              </Form.Item>
              
              <Form.Item>
                <Button type="primary" htmlType="submit">Lưu cài đặt</Button>
              </Form.Item>
            </Form>
          </Tabs.TabPane>
        </Tabs>
      </Card>

      <Modal
        title={editingConfig ? "Sửa nguồn RSS" : "Thêm nguồn RSS mới"}
        open={openConfigModal}
        onCancel={() => setOpenConfigModal(false)}
        onOk={() => formConfig.submit()}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form form={formConfig} layout="vertical" onFinish={handleSaveConfig}>
          <Form.Item name="name" label="Tên nguồn (Gợi nhớ)" rules={[{ required: true }]}>
            <Input placeholder="VD: VnExpress - Tin mới nhất" />
          </Form.Item>
          <Form.Item name="url" label="Link RSS" rules={[{ required: true, type: 'url' }]}>
            <Input placeholder="https://vnexpress.net/rss/tin-moi-nhat.rss" />
          </Form.Item>
          <Form.Item name="targetCategory" label="Danh mục lưu vào" rules={[{ required: true }]}>
            <Select placeholder="Chọn danh mục">
              {theLoaiMap.map(tl => (
                <Option key={tl._id} value={tl._id}>{tl.ten}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="isActive" label="Kích hoạt hệ thống" valuePropName="checked" initialValue={true}>
            <Switch />
          </Form.Item>
          
          <Form.Item name="crawlMode" label="Chế độ quét tin" initialValue="all">
            <Select>
              <Option value="all">Tất cả bài mới nhất</Option>
              <Option value="date_range">Theo khoảng ngày</Option>
              <Option value="specific_day">Một ngày cố định</Option>
            </Select>
          </Form.Item>

          <Form.Item noStyle shouldUpdate={(prev, curr) => prev.crawlMode !== curr.crawlMode}>
            {({ getFieldValue }) => {
              const mode = getFieldValue("crawlMode");
              if (mode === "date_range") {
                return (
                  <Form.Item name="dateRange" label="Chọn khoảng ngày" rules={[{ required: true }]}>
                    <DatePicker.RangePicker style={{ width: '100%' }} />
                  </Form.Item>
                );
              }
              if (mode === "specific_day") {
                return (
                  <Form.Item name="specificDate" label="Chọn ngày" rules={[{ required: true }]}>
                    <DatePicker style={{ width: '100%' }} />
                  </Form.Item>
                );
              }
              return null;
            }}
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
