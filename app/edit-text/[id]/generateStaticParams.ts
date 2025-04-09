import { getAllTexts } from '@/lib/api';

// This function tells Next.js which dynamic paths to pre-render
export async function generateStaticParams() {
  try {
    const texts = await getAllTexts();
    return texts.map((text) => ({
      id: text.textId.toString(),
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
} 