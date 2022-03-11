import { Card } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

export type ImageCardProps = {
  file: File;
  fileUrl: string;
  fileName: string;
  temperature: string;
  processing: boolean;
};
const { Meta } = Card;

export default function ImageCard({
  fileName,
  fileUrl,
  temperature = 'Đang nhận diện',
  processing,
}: ImageCardProps) {
  return (
    <Card
      // style={{ width: 300 }}
      cover={<img alt="example" src={fileUrl} />}
      actions={[<DeleteOutlined key="delete" />]}
      loading={processing}
    >
      <Meta title={fileName} description={temperature} />
    </Card>
  );
}
