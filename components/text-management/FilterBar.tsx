import { Search, Check } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TextType, TextTypeLabels } from '@/lib/types';

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedType: TextType | null;
  onTypeChange: (type: TextType | null) => void;
}

export function FilterBar({ 
  searchQuery, 
  onSearchChange, 
  selectedType, 
  onTypeChange 
}: FilterBarProps) {
  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          className="pl-10"
          placeholder="Buscar textos..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="flex gap-2 flex-wrap">
        <Button
          variant={selectedType === null ? "default" : "outline"}
          onClick={() => onTypeChange(null)}
          style={selectedType === null ? { backgroundColor: '#2CB5E0' } : {}}
        >
          Todos
          {selectedType === null && <Check className="ml-2 h-4 w-4" />}
        </Button>
        {Object.entries(TextTypeLabels).map(([value, label]) => (
          <Button
            key={value}
            variant={selectedType === parseInt(value) ? "default" : "outline"}
            onClick={() => onTypeChange(selectedType === parseInt(value) ? null : parseInt(value))}
            style={selectedType === parseInt(value) ? { backgroundColor: '#2CB5E0' } : {}}
          >
            {label}
            {selectedType === parseInt(value) && <Check className="ml-2 h-4 w-4" />}
          </Button>
        ))}
      </div>
    </div>
  );
} 