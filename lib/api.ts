import { Text, TextCreateInput } from './types';

//use prdduction url from env ->
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5092/Api';

export async function getAllTexts(): Promise<Text[]> {
  const response = await fetch(`${API_BASE_URL}/Texts/GET-ALL`);
  if (!response.ok) throw new Error('Failed to fetch texts');
  return response.json();
}

export async function createText(text: TextCreateInput): Promise<Text> {
  const response = await fetch(`${API_BASE_URL}/Texts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(text),
  });
  if (!response.ok) throw new Error('Failed to create text');
  console.log('Text created:', text);
  //console log the api url
  console.log('API URL:', API_BASE_URL);
  return response.json();
}

export async function updateText(textId: number, text: TextCreateInput): Promise<Text> {
  const response = await fetch(`${API_BASE_URL}/Texts/Edit/${textId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(text),
  });
  if (!response.ok) throw new Error('Failed to update text');
  return response.json();
}