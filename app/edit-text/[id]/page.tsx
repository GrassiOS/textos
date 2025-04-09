import EditTextClient from './EditTextClient';

export default function EditTextPage({ params }: { params: { id: string } }) {
  return <EditTextClient id={params.id} />;
}