import { Pencil, Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Text } from '@/lib/types';
import { useState } from 'react';

interface PreviewDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  previewingText: Text | null;
  onEdit: (text: Text) => void;
  onDelete: (text: Text) => void;
}

export function PreviewDialog({ 
  isOpen, 
  onOpenChange, 
  previewingText, 
  onEdit, 
  onDelete 
}: PreviewDialogProps) {
  const [showFormatted, setShowFormatted] = useState(false);

  function formatText(text: string) {
    const parts = text.split(/(\|+)/); // Split and keep | groups
  
    const output = [];
  
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
  
      if (/\|+/.test(part)) {
        const breaks = part.length;
        for (let j = 0; j < breaks; j++) {
          output.push(<br key={`br-${i}-${j}`} />);
        }
      } else if (part.trim()) {
        output.push(<span key={`text-${i}`}>{part.trim()}</span>);
      }
    }
  
    return <div>{output}</div>;
  }
  
  
  

  if (!previewingText) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            <span>Texto #{previewingText.textId}</span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowFormatted(!showFormatted)}
                className="text-blue-600"
              >
                {showFormatted ? 'Ver Original' : 'Ver Formateado'}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  onOpenChange(false);
                  onEdit(previewingText);
                }}
              >
                <Pencil className="h-4 w-4 mr-2" />
                Editar
              </Button>
              <Button
                variant="outline"
                className="text-red-600 hover:text-red-700"
                onClick={() => {
                  onOpenChange(false);
                  onDelete(previewingText);
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4 overflow-y-auto max-h-[60vh] p-4 bg-white rounded-lg">
          {showFormatted ? (
            <div className="prose max-w-none">
              {formatText(previewingText.text)}
            </div>
          ) : (
            <pre className="whitespace-pre-wrap font-mono text-sm">
              {previewingText.text}
            </pre>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
} 