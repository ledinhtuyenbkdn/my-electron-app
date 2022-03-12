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
  DownCircleOutlined,
  UpCircleOutlined,
  FileImageOutlined,
  UploadOutlined,
  IssuesCloseOutlined
} from '@ant-design/icons';
import { v4 as uuidv4 } from 'uuid';
import ImageCard from '../../components/ImageCard';
import { useSelector, useDispatch } from 'react-redux';
import { addImage, deleteImage, Status, updateTemperature } from './homeSlice';
import { RootState } from '../../store';

const Tesseract = require('tesseract.js');

export default function Home() {
  const images = useSelector((state: RootState) => state.home.images);
  const dispatch = useDispatch();

  const onFinish = (values: any) => {
    console.log('Success:', values);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  const handleOnUploadImage = (file: any) => {
    console.log(file);
    const id = uuidv4();
    dispatch(addImage({
      id,
      file,
      fileName: file.name,
      fileUrl: URL.createObjectURL(file),
      temperature: '',
      status: Status.PROCESSING,
    }));
    
    Tesseract.recognize(file, 'eng', {})
      .then(({ data: { text } }) => {
        dispatch(updateTemperature({
          id,
          temperature: text,
        }))
        return text;
      })
      .catch((err: any) => {
        console.log(err);
      });
    return false;
  };

  const handleRemoveImage = (id: string) => {
      dispatch(deleteImage(id));
  };

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
                  beforeUpload={handleOnUploadImage}
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
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng số file"
              value={images.length}
              prefix={<FileImageOutlined />}
              suffix="file"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Nhiệt độ thấp"
              value={11.28}
              precision={2}
              valueStyle={{ color: '#3f8600' }}
              prefix={<DownCircleOutlined />}
              suffix="file"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Nhiệt độ cao"
              value={9.3}
              valueStyle={{ color: '#cf1322' }}
              prefix={<UpCircleOutlined />}
              suffix="file"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Không xác định"
              value={9.3}
              valueStyle={{ color: '#fdd835' }}
              prefix={<IssuesCloseOutlined />}
              suffix="file"
            />
          </Card>
        </Col>
      </Row>
      <Row gutter={16}>
        {images.map((image) => (
          <Col span={4}>
            <ImageCard
              id={image.id}
              fileUrl={image.fileUrl}
              fileName={image.fileName}
              temperature={image.temperature}
              onDelete={handleRemoveImage}
            />
          </Col>
        ))}
      </Row>
    </Layout>
  );
}
