import { Card } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

export type ImageCardProps = {
  id: string;
  file?: File;
  fileUrl: string;
  fileName: string;
  temperature: string;
  onDelete: Function;
};

const { Meta } = Card;

export default function ImageCard({
  id,
  fileName,
  fileUrl,
  temperature,
  onDelete
}: ImageCardProps) {
  return (
    <Card
      // style={{ width: 300 }}
      cover={<img alt="example" src={fileUrl} />}
      actions={[<DeleteOutlined key="delete" onClick={() => onDelete(id)}/>]}
    >
      <Meta title={fileName} description={temperature} />
    </Card>
  );
}
