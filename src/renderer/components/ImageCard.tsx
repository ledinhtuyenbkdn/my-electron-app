import { Card } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

export type ImageCardProps = {
  id?: string;
  file?: File;
  fileUrl: string;
  fileName: string;
  temperature: string;
};
const { Meta } = Card;

export default function ImageCard({
  fileName,
  fileUrl,
  temperature = 'Đang nhận diện',
}: ImageCardProps) {
  return (
    <Card
      // style={{ width: 300 }}
      cover={<img alt="example" src={fileUrl} />}
      actions={[<DeleteOutlined key="delete" />]}
    >
      <Meta title={fileName} description={temperature} />
    </Card>
  );
}
