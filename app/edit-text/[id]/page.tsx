import EditTextClient from './EditTextClient';

// Remove generateStaticParams since we're using server-side rendering

export default function EditTextPage({ params }: { params: { id: string } }) {
  return <EditTextClient id={params.id} />;
}