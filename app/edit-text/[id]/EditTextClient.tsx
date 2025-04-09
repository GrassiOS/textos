"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getAllTexts, updateText } from '@/lib/api';
import type { Text, TextCreateInput } from '@/lib/types';
import { TextType, TextTypeLabels } from '@/lib/types';
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function EditTextClient({ id }: { id: string }) {
  const router = useRouter();
  const [text, setText] = useState<Text | null>(null);
  const [newText, setNewText] = useState<TextCreateInput>({
    text: '',
    textType: TextType.Tutorial
  });

  useEffect(() => {
    const loadText = async () => {
      try {
        const texts = await getAllTexts();
        const foundText = texts.find(t => t.textId === parseInt(id));
        if (foundText) {
          setText(foundText);
          setNewText({ text: foundText.text, textType: foundText.textType });
        }
      } catch (error) {
        console.error('Failed to load text:', error);
        toast.error('Error al cargar el texto');
      }
    };
    loadText();
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const processedText = newText.text.replace(/\n/g, '|');
      await updateText(parseInt(id), { ...newText, text: processedText });
      toast.success('Texto actualizado exitosamente');
      router.push('/');
    } catch (error) {
      console.error('Failed to update text:', error);
      toast.error('Error al actualizar el texto');
    }
  }

  if (!text) return <div>Cargando...</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-gray-50 p-8"
    >
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Editar Texto #{id}</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="text">Contenido del Texto</Label>
              <textarea
                id="text"
                className="w-full min-h-[400px] p-4 border rounded-lg text-lg"
                value={newText.text}
                onChange={(e) => setNewText({ ...newText, text: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="textType">Tipo de Texto</Label>
              <Select
                value={newText.textType.toString()}
                onValueChange={(value) => setNewText({ ...newText, textType: parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(TextTypeLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-4">
              <Button type="submit" style={{ backgroundColor: '#2CB5E0' }} className="flex-1">
                Guardar Cambios
              </Button>
              <Button type="button" variant="outline" onClick={() => router.push('/')} className="flex-1">
                Cancelar
              </Button>
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  );
} 