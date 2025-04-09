import { Plus, HelpCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TextCreateInput, TextType, TextTypeLabels } from '@/lib/types';
import { useState } from 'react';
import { createText } from '@/lib/api';
import { toast } from "sonner";
import { CustomTooltip } from '@/components/CustomTooltip';

interface CreateDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function CreateDialog({ isOpen, onOpenChange, onSuccess }: CreateDialogProps) {
  const [newText, setNewText] = useState<TextCreateInput>({
    text: '',
    textType: TextType.Tutorial
  });

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    try {
      const processedText = newText.text.replace(/\n/g, '|');
      await createText({ ...newText, text: processedText });
      toast.success('Texto creado exitosamente', {
        description: `Se ha creado un nuevo texto de tipo ${TextTypeLabels[newText.textType]}`,
        duration: 3000,
        icon: '✅',
        style: {
          background: '#f0fdf4',
          color: '#166534',
          border: '1px solid #bbf7d0',
        }
      });
      setNewText({ text: '', textType: TextType.Tutorial });
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      console.error('Failed to create text:', error);
      toast.error('Error al crear el texto', {
        description: 'Ha ocurrido un error al intentar crear el texto. Por favor, inténtalo de nuevo.',
        duration: 4000,
        icon: '❌',
      });
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button style={{ backgroundColor: '#2CB5E0' }}>
          <Plus className="mr-2 h-4 w-4" />
          Agregar Nuevo Texto
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] h-[80vh]">
        <DialogHeader>
          <DialogTitle>Agregar Nuevo Texto</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleCreate} className="space-y-4 h-full">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Label htmlFor="text">Contenido del Texto</Label>
              <CustomTooltip content="Los textos que sean escritos en el formato indicado, ignora los '|' ya que el sistema lo hara automaticamente">
                <HelpCircle className="h-4 w-4 text-gray-400 cursor-help" />
              </CustomTooltip>
            </div>
            <textarea
              id="text"
              className="w-full h-[50vh] p-4 border rounded-md text-lg resize-none"
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
          <Button type="submit" style={{ backgroundColor: '#2CB5E0' }}>
            Crear Texto
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
} 