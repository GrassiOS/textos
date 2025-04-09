import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Text } from '@/lib/types';
import { deleteText } from '@/lib/api';
import { toast } from "sonner";

interface DeleteDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  deletingText: Text | null;
  onSuccess: () => void;
}

export function DeleteDialog({ isOpen, onOpenChange, deletingText, onSuccess }: DeleteDialogProps) {
  async function handleDelete() {
    if (!deletingText) return;
    
    try {
      await deleteText(deletingText.textId);
      toast.success('Texto eliminado exitosamente', {
        description: `Se ha eliminado el texto #${deletingText.textId}`,
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
      console.error('Failed to delete text:', error);
      toast.error('Error al eliminar el texto', {
        description: 'Ha ocurrido un error al intentar eliminar el texto. Por favor, inténtalo de nuevo.',
        duration: 4000,
        icon: '❌',
      });
    }
  }

  if (!deletingText) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no se puede deshacer. El texto #{deletingText.textId} será eliminado permanentemente.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
            Eliminar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
} 