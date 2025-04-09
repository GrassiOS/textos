import { HelpCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Text, TextCreateInput, TextType, TextTypeLabels } from '@/lib/types';
import { useState, useEffect } from 'react';
import { updateText } from '@/lib/api';
import { toast } from "sonner";
import { CustomTooltip } from '@/components/CustomTooltip';

interface EditDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingText: Text | null;
  onSuccess: () => void;
}

export function EditDialog({ isOpen, onOpenChange, editingText, onSuccess }: EditDialogProps) {
  const [newText, setNewText] = useState<TextCreateInput>({
    text: '',
    textType: TextType.Tutorial
  });

  useEffect(() => {
    if (editingText) {
      setNewText({ text: editingText.text, textType: editingText.textType });
    }
  }, [editingText]);

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!editingText) return;
    
    try {
      const processedText = newText.text.replace(/\n/g, '|');
      await updateText(editingText.textId, { ...newText, text: processedText });
      toast.success('Texto actualizado exitosamente', {
        description: `Se ha actualizado el texto #${editingText.textId} de tipo ${TextTypeLabels[newText.textType]}`,
        duration: 3000,
        icon: '✅',
        style: {
          background: '#f0fdf4',
          color: '#166534',
          border: '1px solid #bbf7d0',
        }
      });
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      console.error('Failed to update text:', error);
      toast.error('Error al actualizar el texto', {
        description: 'Ha ocurrido un error al intentar actualizar el texto. Por favor, inténtalo de nuevo.',
        duration: 4000,
        icon: '❌',
      });
    }
  }

  if (!editingText) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] h-[80vh]">
        <DialogHeader>
          <DialogTitle>Editar Texto #{editingText.textId}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleUpdate} className="space-y-4 h-full">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Label htmlFor="editText">Contenido del Texto</Label>
              <CustomTooltip content="Los textos que sean escritos en el formato indicado, ignora los '|' ya que el sistema lo hara automaticamente">
                <HelpCircle className="h-4 w-4 text-gray-400 cursor-help" />
              </CustomTooltip>
            </div>
            <textarea
              id="editText"
              className="w-full h-[50vh] p-4 border rounded-md text-lg resize-none"
              value={newText.text}
              onChange={(e) => setNewText({ ...newText, text: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="editTextType">Tipo de Texto</Label>
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
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancelar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 