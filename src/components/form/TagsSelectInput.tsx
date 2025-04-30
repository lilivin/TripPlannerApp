import React, { useState } from 'react';
import { Check, X } from 'lucide-react';
import type { TagDto } from '../types';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface TagsSelectInputProps {
  availableTags: TagDto[];
  selectedTagIds: string[];
  onChange: (tagIds: string[]) => void;
  label: string;
  placeholder?: string;
}

const TagsSelectInput: React.FC<TagsSelectInputProps> = ({
  availableTags,
  selectedTagIds,
  onChange,
  label,
  placeholder = "Wyszukaj tagi...",
}) => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Group tags by category
  const tagsByCategory = availableTags.reduce((acc, tag) => {
    if (!acc[tag.category]) {
      acc[tag.category] = [];
    }
    acc[tag.category].push(tag);
    return acc;
  }, {} as Record<string, TagDto[]>);

  const handleSelectTag = (tagId: string) => {
    // Add tag if not already selected
    if (!selectedTagIds.includes(tagId)) {
      onChange([...selectedTagIds, tagId]);
    }
    setSearchQuery('');
  };

  const handleRemoveTag = (tagId: string) => {
    onChange(selectedTagIds.filter(id => id !== tagId));
  };

  const getTagById = (id: string) => {
    return availableTags.find(tag => tag.id === id);
  };

  // Helper function to highlight the matching part of the tag name
  const highlightMatch = (text: string, query: string) => {
    if (!query) return text;
    
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, i) => 
      regex.test(part) ? <span key={i} className="bg-yellow-200 dark:bg-yellow-800">{part}</span> : part
    );
  };

  return (
    <div className="space-y-2">
      <Label className="font-medium">
        {label}
      </Label>
      
      {/* Selected tags */}
      <div className="flex flex-wrap gap-2 mb-2">
        {selectedTagIds.map(tagId => {
          const tag = getTagById(tagId);
          if (!tag) return null;
          
          return (
            <Badge key={tagId} variant="secondary" className="h-7 pl-2 pr-1 flex items-center gap-1">
              {tag.name}
              <button
                type="button"
                onClick={() => handleRemoveTag(tagId)}
                className="ml-1 rounded-full p-0.5 hover:bg-muted/60"
                aria-label={`Usuń tag ${tag.name}`}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </Badge>
          );
        })}
        {selectedTagIds.length === 0 && (
          <div className="text-muted-foreground text-sm py-1.5">Brak wybranych tagów</div>
        )}
      </div>
      
      {/* Tags selector */}
      <Command className="border rounded-md shadow-sm">
        <CommandInput 
          placeholder={placeholder} 
          value={searchQuery}
          onValueChange={setSearchQuery}
          className="h-9"
        />
        
        <CommandEmpty>Nie znaleziono pasujących tagów</CommandEmpty>
        
        <div className="max-h-64 overflow-auto">
          {Object.entries(tagsByCategory).map(([category, tags]) => {
            // Filter tags by search query and exclude already selected tags
            const filteredTags = tags.filter(tag => 
              !selectedTagIds.includes(tag.id) && 
              tag.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
            
            if (filteredTags.length === 0) return null;
            
            return (
              <CommandGroup key={category} heading={category} className="px-1 py-1.5">
                {filteredTags.map(tag => (
                  <CommandItem
                    key={tag.id}
                    value={tag.id}
                    onSelect={handleSelectTag}
                    className="flex items-center justify-between cursor-pointer"
                  >
                    <span>{highlightMatch(tag.name, searchQuery)}</span>
                    {selectedTagIds.includes(tag.id) && (
                      <Check className="h-4 w-4 text-green-600" />
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            );
          })}
        </div>
      </Command>
    </div>
  );
};

export default TagsSelectInput; 