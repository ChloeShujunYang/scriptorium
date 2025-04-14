import { useState } from 'react';
import { TextField, CircularProgress, Alert } from '@mui/material';
import { useDebounce } from '@/hooks/useDebounce';

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const debouncedSearch = useDebounce(async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`/api/posts/search?q=${encodeURIComponent(searchQuery)}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to search posts');
      }
      
      const data = await response.json();
      onSearch(data);
    } catch (err) {
      console.error('Search error:', err);
      setError(err instanceof Error ? err.message : 'Failed to search posts');
    } finally {
      setLoading(false);
    }
  }, 300);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setQuery(value);
    debouncedSearch(value);
  };

  return (
    <>
      <TextField
        fullWidth
        value={query}
        onChange={handleSearchChange}
        placeholder="Search posts..."
        InputProps={{
          endAdornment: loading && <CircularProgress size={20} />,
        }}
      />
      {error && (
        <Alert severity="error" sx={{ mt: 1 }}>
          {error}
        </Alert>
      )}
    </>
  );
} 