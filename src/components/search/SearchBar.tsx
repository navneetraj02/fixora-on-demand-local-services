import { useState } from 'react';
import { Search, MapPin, ChevronDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  className?: string;
}

export function SearchBar({ placeholder = "Search for services...", onSearch, className }: SearchBarProps) {
  const [query, setQuery] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(query);
  };
  
  return (
    <form onSubmit={handleSubmit} className={cn("relative", className)}>
      <div className="flex items-center gap-2 p-1 bg-card rounded-xl shadow-card border border-border">
        {/* Location */}
        <button
          type="button"
          className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <MapPin className="w-4 h-4 text-primary" />
          <span className="hidden sm:inline">Mumbai</span>
          <ChevronDown className="w-3 h-3" />
        </button>
        
        <div className="w-px h-6 bg-border" />
        
        {/* Search Input */}
        <div className="flex-1 flex items-center">
          <Search className="w-4 h-4 ml-2 text-muted-foreground" />
          <Input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className="border-0 shadow-none focus-visible:ring-0 bg-transparent"
          />
        </div>
      </div>
    </form>
  );
}
