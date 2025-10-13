// components/search-bar.tsx
'use client';
import { useSearch } from './search-context';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export default function SearchBar() {
  const { query, setQuery } = useSearch();
  return (
    <div className="relative w-full max-w-xl">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search tutors by name, subject, or course code..."
        className="pl-9"
      />
    </div>
  );
}
