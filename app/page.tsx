"use client";

import { useState, useEffect } from 'react';
import { Search, Plus, Check } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getAllTexts, createText, updateText } from '@/lib/api';
import type { Text, TextCreateInput } from '@/lib/types';
import { TextType, TextTypeLabels } from '@/lib/types';
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [texts, setTexts] = useState<Text[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<TextType | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingText, setEditingText] = useState<Text | null>(null);
  const [newText, setNewText] = useState<TextCreateInput>({
    text: '',
    textType: TextType.Tutorial
  });

  useEffect(() => {
    loadTexts();
  }, []);

  async function loadTexts() {
    try {
      const data = await getAllTexts();
      setTexts(data);
    } catch (error) {
      console.error('Failed to load texts:', error);
      toast.error('Error al cargar los textos');
    } finally {
      setIsLoading(false);
    }
  }

  const filteredTexts = texts.filter(text => {
    const matchesSearch = text.text.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === null || text.textType === selectedType;
    return matchesSearch && matchesType;
  });

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    try {
      const processedText = newText.text.replace(/\n/g, '|');
      await createText({ ...newText, text: processedText });
      toast.success('Texto creado exitosamente');
      setNewText({ text: '', textType: TextType.Tutorial });
      setIsCreateDialogOpen(false);
      loadTexts();
    } catch (error) {
      console.error('Failed to create text:', error);
      toast.error('Error al crear el texto');
    }
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!editingText) return;
    
    try {
      const processedText = newText.text.replace(/\n/g, '|');
      await updateText(editingText.textId, { ...newText, text: processedText });
      toast.success('Texto actualizado exitosamente');
      setIsEditDialogOpen(false);
      setEditingText(null);
      setNewText({ text: '', textType: TextType.Tutorial });
      loadTexts();
    } catch (error) {
      console.error('Failed to update text:', error);
      toast.error('Error al actualizar el texto');
    }
  }

  function handleEditClick(text: Text) {
    setEditingText(text);
    setNewText({ text: text.text, textType: text.textType });
    setIsEditDialogOpen(true);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Textos</h1>
          
          {/* Create Dialog */}
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
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
                  <Label htmlFor="text">Contenido del Texto</Label>
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

          {/* Edit Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="sm:max-w-[800px] h-[80vh]">
              <DialogHeader>
                <DialogTitle>Editar Texto #{editingText?.textId}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleUpdate} className="space-y-4 h-full">
                <div className="flex-1">
                  <Label htmlFor="editText">Contenido del Texto</Label>
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
                  
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditDialogOpen(false)}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" style={{ backgroundColor: '#2CB5E0' }} className="flex-1">
                    Guardar Cambios
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              className="pl-10"
              placeholder="Buscar textos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            <Button
              variant={selectedType === null ? "default" : "outline"}
              onClick={() => setSelectedType(null)}
              style={selectedType === null ? { backgroundColor: '#2CB5E0' } : {}}
            >
              Todos
              {selectedType === null && <Check className="ml-2 h-4 w-4" />}
            </Button>
            {Object.entries(TextTypeLabels).map(([value, label]) => (
              <Button
                key={value}
                variant={selectedType === parseInt(value) ? "default" : "outline"}
                onClick={() => setSelectedType(selectedType === parseInt(value) ? null : parseInt(value))}
                style={selectedType === parseInt(value) ? { backgroundColor: '#2CB5E0' } : {}}
              >
                {label}
                {selectedType === parseInt(value) && <Check className="ml-2 h-4 w-4" />}
              </Button>
            ))}
          </div>
        </div>

        <motion.div 
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-6"
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
        >
          {isLoading ? (
            <p>Cargando...</p>
          ) : (
            <AnimatePresence>
              {filteredTexts.map((text) => (
                <motion.div
                  key={text.textId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex justify-between items-center">
                        <span>Texto #{text.textId}</span>
                        <Button
                          variant="outline"
                          onClick={() => handleEditClick(text)}
                        >
                          Editar
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600">{text.text}</p>
                      <div className="mt-4 text-sm text-gray-500">
                        <p>Tipo: {TextTypeLabels[text.textType]}</p>
                        <p>Creado: {new Date(text.dateCreated).toLocaleDateString('es-ES')}</p>
                        <p>Modificado: {new Date(text.modifiedDate).toLocaleDateString('es-ES')}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </motion.div>
      </div>
    </div>
  );
}