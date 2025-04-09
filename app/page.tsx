"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { getAllTexts } from '@/lib/api';
import type { Text } from '@/lib/types';
import { TextType } from '@/lib/types';
import { toast } from "sonner";
import { 
  TextCard, 
  CreateDialog, 
  EditDialog, 
  PreviewDialog, 
  DeleteDialog,
  FilterBar
} from '@/components/text-management';

export default function Home() {
  const [texts, setTexts] = useState<Text[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<TextType | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);
  const [editingText, setEditingText] = useState<Text | null>(null);
  const [deletingText, setDeletingText] = useState<Text | null>(null);
  const [previewingText, setPreviewingText] = useState<Text | null>(null);

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

  function handleEditClick(text: Text) {
    setEditingText(text);
    setIsEditDialogOpen(true);
  }

  function handleDeleteClick(text: Text) {
    setDeletingText(text);
    setIsDeleteDialogOpen(true);
  }

  function handlePreviewClick(text: Text) {
    setPreviewingText(text);
    setIsPreviewDialogOpen(true);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Textos</h1>
          
          <CreateDialog 
            isOpen={isCreateDialogOpen} 
            onOpenChange={setIsCreateDialogOpen} 
            onSuccess={loadTexts} 
          />
        </div>

        <FilterBar 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedType={selectedType}
          onTypeChange={setSelectedType}
        />

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
                <TextCard
                  key={text.textId}
                  text={text}
                  onPreview={handlePreviewClick}
                  onEdit={handleEditClick}
                  onDelete={handleDeleteClick}
                />
              ))}
            </AnimatePresence>
          )}
        </motion.div>

        <EditDialog 
          isOpen={isEditDialogOpen} 
          onOpenChange={setIsEditDialogOpen} 
          editingText={editingText} 
          onSuccess={loadTexts} 
        />

        <PreviewDialog 
          isOpen={isPreviewDialogOpen} 
          onOpenChange={setIsPreviewDialogOpen} 
          previewingText={previewingText} 
          onEdit={handleEditClick} 
          onDelete={handleDeleteClick} 
        />

        <DeleteDialog 
          isOpen={isDeleteDialogOpen} 
          onOpenChange={setIsDeleteDialogOpen} 
          deletingText={deletingText} 
          onSuccess={loadTexts} 
        />
      </div>
    </div>
  );
}