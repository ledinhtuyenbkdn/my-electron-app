import {
  Button,
  Layout,
  Row,
  Col,
  Card,
  Statistic,
  Form,
  Input,
  Upload,
} from 'antd';
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  FileImageOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import ImageCard, { ImageCardProps } from '../../components/ImageCard';

const Tesseract = require('tesseract.js');

export default function Home() {
  const [images, setImages] = useState<ImageCardProps[]>([]);

  const onFinish = (values: any) => {
    console.log('Success:', values);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  const addImage = (file: any) => {
    console.log(file);
    const id = uuidv4();
    setImages([
      ...images,
      {
        id,
        file,
        fileName: file.name,
        fileUrl: URL.createObjectURL(file),
        temperature: '',
      },
    ]);
    //
    // Tesseract.recognize(file, 'eng', {})
    //   .then(({ data: { text } }) => {
    //     console.log(text);
    //
    //     const updatedImages = images.map((image) => {
    //       if (image.id === id) {
    //         return {
    //           ...image,
    //           temperature: text,
    //         };
    //       }
    //       return image;
    //     });
    //     console.log(updatedImages);
    //     // setImages(updatedImages);
    //     return text;
    //   })
    //   .catch((err: any) => {
    //     console.log(err);
    //   });
    return false;
  };

  const removeImage = () => {};

  return (
    <Layout>
      <Row>
        <Col span={24}>
          <Card>
            <Form
              name="basic"
              labelCol={{ span: 12 }}
              wrapperCol={{ span: 12 }}
              initialValues={{ temperature: 20 }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
              layout="inline"
            >
              <Form.Item
                label="Giới hạn nhiệt độ cao nhất"
                name="temperature"
                rules={[{ required: true, message: 'Vui lòng nhập vào 1 số!' }]}
              >
                <Input addonAfter="độ C" />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Áp dụng
                </Button>
              </Form.Item>
              <Form.Item>
                <Upload
                  showUploadList={false}
                  beforeUpload={addImage}
                  accept="image/*"
                  multiple
                >
                  <Button icon={<UploadOutlined />}>Thêm ảnh</Button>
                </Upload>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={8}>
          <Card>
            <Statistic
              title="Tổng số file"
              value={12}
              prefix={<FileImageOutlined />}
              suffix="file"
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Active"
              value={11.28}
              precision={2}
              valueStyle={{ color: '#3f8600' }}
              prefix={<ArrowDownOutlined />}
              suffix="%"
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Idle"
              value={9.3}
              precision={2}
              valueStyle={{ color: '#cf1322' }}
              prefix={<ArrowUpOutlined />}
              suffix="%"
            />
          </Card>
        </Col>
      </Row>
      <Row gutter={16}>
        {images.map((image) => (
          <Col span={6}>
            <ImageCard
              fileUrl={image.fileUrl}
              fileName={image.fileName}
              temperature={image.temperature}
            />
          </Col>
        ))}
      </Row>
    </Layout>
  );
}
