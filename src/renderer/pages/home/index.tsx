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
  Badge,
} from 'antd';
import {
  DownCircleOutlined,
  UpCircleOutlined,
  FileImageOutlined,
  UploadOutlined,
  IssuesCloseOutlined,
  DeleteOutlined,
  ScanOutlined,
  DownloadOutlined,
} from '@ant-design/icons';
import { v4 as uuidv4 } from 'uuid';
import { useSelector, useDispatch } from 'react-redux';
import { PresetStatusColorType } from 'antd/lib/_util/colors';
import { ipcRenderer } from 'electron';
import pLimit from 'p-limit';
import {
  addImages,
  deleteImage,
  Status,
  updateTemperature,
  setLimit, startProcessing, finishProcessing
} from "./homeSlice";
import { RootState } from '../../store';
import textProcessing from './textProcessing';

const { Image } = require('image-js');
const Tesseract = require('tesseract.js');

export default function Home() {
  const images = useSelector((state: RootState) => state.home.images);
  const loading = useSelector((state: RootState) => state.home.processing);
  const total = images.length;
  const lower = images.filter((o) => o.status === Status.LOWER).length;
  const higher = images.filter((o) => o.status === Status.HIGHER).length;
  const error = images.filter((o) => o.status === Status.ERROR).length;
  const processing = images.filter(
    (o) => o.status === Status.PROCESSING
  ).length;

  const dispatch = useDispatch();

  const onFinish = (values: any) => {
    console.log('Success:', values);
    dispatch(setLimit(values.temperature));
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  const handleOnSave = () => {
    ipcRenderer.send('ipc-example', images);
  };

  const processSingleFile = async (fileUpload) => {
    try {
      console.log('start');
      // preprocessing image
      const image = await Image.load(fileUpload.fileUrl);
      const preprocessed = image
        .crop({ x: 50, y: 0, width: 160, height: 54 })
        .grey()
        .mask({ algorithm: 'threshold', threshold: 150 })
        .invert();
      const base64 = preprocessed.toDataURL();
      // ocr
      const ocrResult = await Tesseract.recognize(base64, 'eng', {});
      const { text } = ocrResult.data;
      // save to redux
      dispatch(
        updateTemperature({
          id: fileUpload.id,
          temperature: textProcessing(text),
        })
      );
      console.log('end');
    } catch (e) {
      console.log(e);
      dispatch(
        updateTemperature({
          id: fileUpload.id,
          temperature: 'error',
        })
      );
    }
  };

  const handleOnUploadImage = async (_: any, fileList: any[]) => {
    // start
    dispatch(startProcessing());
    // check file
    const uploadLength = fileList.length;
    const notUndefinedItem = JSON.parse(JSON.stringify(fileList)).filter(
      (e) => e.uid !== undefined
    ).length;
    if (notUndefinedItem !== uploadLength) {
      return false;
    }
    // add file to redux
    const newFiles = fileList.map((fileUpload) => {
      const id = uuidv4();
      const fileUrl = URL.createObjectURL(fileUpload);
      return {
        id,
        fileName: fileUpload.name,
        fileUrl,
        path: fileUpload.path,
        temperature: '',
        status: Status.PROCESSING,
      };
    });
    dispatch(addImages(newFiles));
    // processing
    const limit = pLimit(2);
    const tasks = newFiles.map((uploadFile) =>
      limit(() => processSingleFile(uploadFile))
    );
    await Promise.all(tasks);
    // finish
    dispatch(finishProcessing());
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
                label="Gi???i h???n nhi???t ????? cao nh???t"
                name="temperature"
                rules={[{ required: true, message: 'Vui l??ng nh???p v??o 1 s???!' }]}
              >
                <Input addonAfter="????? C" />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  ??p d???ng
                </Button>
              </Form.Item>
              <Form.Item>
                <Upload
                  showUploadList={false}
                  beforeUpload={handleOnUploadImage}
                  accept="image/*"
                  multiple
                >
                  <Button
                    icon={<UploadOutlined />}
                    loading={loading}
                    disabled={loading}
                  >
                    {loading ? '??ang x??? l??' : 'Th??m ???nh'}
                  </Button>
                </Upload>
              </Form.Item>
              <Form.Item>
                <Button icon={<DownloadOutlined />} onClick={handleOnSave}>
                  Save file
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
      <Row gutter={16} style={{ backgroundColor: 'white' }}>
        <Col span={4}>
          <Statistic
            title="T???ng s??? file"
            value={total}
            prefix={<FileImageOutlined />}
          />
        </Col>
        <Col span={5}>
          <Statistic
            title="Nhi???t ????? th???p"
            value={lower}
            prefix={<DownCircleOutlined />}
            valueStyle={{ color: '#3f8600' }}
          />
        </Col>
        <Col span={5}>
          <Statistic
            title="Nhi???t ????? cao"
            value={higher}
            prefix={<UpCircleOutlined />}
            valueStyle={{ color: '#fbc02d' }}
          />
        </Col>
        <Col span={5}>
          <Statistic
            title="??ang x??? l??"
            value={processing}
            prefix={<ScanOutlined />}
            valueStyle={{ color: '#1976d2' }}
          />
        </Col>
        <Col span={5}>
          <Statistic
            title="L???i"
            value={error}
            prefix={<IssuesCloseOutlined />}
            valueStyle={{ color: '#d32f2f' }}
          />
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={24}>
          <Card>
            <List
              itemLayout="horizontal"
              dataSource={images}
              renderItem={(item) => {
                let statusLabel = 'processing';
                if (item.status === Status.LOWER) {
                  statusLabel = 'success';
                }
                if (item.status === Status.HIGHER) {
                  statusLabel = 'warning';
                }
                if (item.status === Status.ERROR) {
                  statusLabel = 'error';
                }
                return (
                  <List.Item
                    actions={[
                      <DeleteOutlined
                        key="delete"
                        onClick={() => handleRemoveImage(item.id)}
                      />,
                    ]}
                  >
                    <Skeleton avatar title={false} active loading={false}>
                      <List.Item.Meta
                        avatar={
                          <Avatar shape="square" size={64} src={item.fileUrl} />
                        }
                        title={item.fileName}
                        description={item.temperature}
                      />
                      <div>
                        <Badge
                          status={statusLabel as PresetStatusColorType}
                          text={item.status}
                        />
                      </div>
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
