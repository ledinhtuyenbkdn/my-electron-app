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
  List,
  Avatar,
  Skeleton,
  Badge
} from 'antd';
import {
  DownCircleOutlined,
  UpCircleOutlined,
  FileImageOutlined,
  UploadOutlined,
  IssuesCloseOutlined,  
  DeleteOutlined,
  ScanOutlined
} from '@ant-design/icons';
import { v4 as uuidv4 } from 'uuid';
import { useSelector, useDispatch } from 'react-redux';
import { addImage, deleteImage, Status, updateTemperature } from './homeSlice';
import { RootState } from '../../store';
import { PresetStatusColorType } from 'antd/lib/_util/colors';
import { Buffer } from 'buffer';

const CIP = require('canvas_image_processing');
const Tesseract = require('tesseract.js');

export default function Home() {
  const images = useSelector((state: RootState) => state.home.images);
  const total = images.length;
  const lower = images.filter(o => o.status === Status.LOWER).length;
  const higher = images.filter(o => o.status === Status.HIGHER).length;
  const error = images.filter(o => o.status === Status.ERROR).length;
  const processing = images.filter(o => o.status === Status.PROCESSING).length;

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
      fileName: file.name,
      fileUrl: URL.createObjectURL(file),
      temperature: '',
      status: Status.PROCESSING,
    }));
    
    try {

      const reader = new FileReader();
    reader.onload = function(e) {
      let base64_image = e?.target?.result;
 
      CIP.cropImage64(base64_image, 0, 0, 300, 100).then((cropped_image: string) => {
        // console.log(cropped_image)
        fetch(cropped_image)
.then(res => res.blob())
.then(blob => {
  const url = URL.createObjectURL(blob);
  console.log(url);
  

  Tesseract.recognize(url, 'eng', {})
  .then(({ data: { text } }) => {
    dispatch(updateTemperature({
      id,
      temperature: text,
    }))
    return text;
  })
  .catch((err: any) => {
    console.log(err);
    dispatch(updateTemperature({
      id,
      temperature: 'error',
    }))
  });
  });

})
       

    };
    reader.readAsDataURL(file);

      
    } catch (e) {
      dispatch(updateTemperature({
        id,
        temperature: 'error',
      }));
    }
    
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
      <Row gutter={16} style={{backgroundColor: 'white'}}>
        <Col span={4}>
          <Statistic title="Tổng số file" value={total} prefix={<FileImageOutlined />} />
        </Col>
        <Col span={5}>
          <Statistic title="Nhiệt độ thấp" value={lower} prefix={<DownCircleOutlined />} valueStyle={{ color: '#3f8600' }}/>
        </Col>
        <Col span={5}>
          <Statistic title="Nhiệt độ cao" value={higher} prefix={<UpCircleOutlined />} valueStyle={{ color: '#fbc02d' }}/>
        </Col>
        <Col span={5}>
          <Statistic title="Đang xử lý" value={processing} prefix={<ScanOutlined />} valueStyle={{ color: '#1976d2' }}/>
        </Col>
        <Col span={5}>
          <Statistic title="Lỗi" value={error} prefix={<IssuesCloseOutlined />} valueStyle={{ color: '#d32f2f' }}/>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={24}>
          <Card>
          <List
        itemLayout="horizontal"
        dataSource={images}
        renderItem={item => {
          let statusLabel = 'processing';
          if (item.status == Status.LOWER) {
            statusLabel = 'success';
          }
          if (item.status == Status.HIGHER) {
            statusLabel = 'warning';
          }
          if (item.status == Status.ERROR) {
            statusLabel = 'error';
          }
          return (
            <List.Item
              actions={[<DeleteOutlined key="delete" onClick={() => handleRemoveImage(item.id)}/>]}
            >
              <Skeleton avatar title={false} active loading={false}>
                <List.Item.Meta
                  avatar={<Avatar shape="square" size={64} src={item.fileUrl} />}
                  title={item.fileName}
                  description={item.temperature}
                />
                <div><Badge status={statusLabel as PresetStatusColorType} text={item.status} /></div>
              </Skeleton>
            </List.Item>
          );
        }}
      />
          </Card>
        </Col>
      </Row>
    </Layout>
  );
}
