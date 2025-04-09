import { Eye, Pencil, Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Text, TextTypeLabels } from '@/lib/types';
import { motion } from "framer-motion";

interface TextCardProps {
  text: Text;
  onPreview: (text: Text) => void;
  onEdit: (text: Text) => void;
  onDelete: (text: Text) => void;
}

const MAX_PREVIEW_LENGTH = 250;

export function TextCard({ text, onPreview, onEdit, onDelete }: TextCardProps) {
  function truncateText(text: string) {
    if (text.length <= MAX_PREVIEW_LENGTH) return text;
    return text.substring(0, MAX_PREVIEW_LENGTH) + '...';
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Texto #{text.textId}</span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => onPreview(text)}
                className="text-blue-600"
              >
                <Eye className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                onClick={() => onEdit(text)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="text-red-600 hover:text-red-700"
                onClick={() => onDelete(text)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">{truncateText(text.text)}</p>
          <div className="mt-4 text-sm text-gray-500">
            <p>Tipo: {TextTypeLabels[text.textType]}</p>
            <p>Creado: {new Date(text.dateCreated).toLocaleDateString('es-ES')}</p>
            <p>Modificado: {new Date(text.modifiedDate).toLocaleDateString('es-ES')}</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
} 