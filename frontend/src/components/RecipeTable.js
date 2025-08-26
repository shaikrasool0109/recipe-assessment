import React, { useEffect, useState } from 'react';
import client from '../api';
import { Table, TableBody, TableCell, TableHead, TableRow, TableContainer, Paper, Select, MenuItem, TextField, Button } from '@mui/material';
import RecipeDrawer from './RecipeDrawer';
import Rating from 'react-rating-stars-component';

const PER_PAGE_OPTIONS = [15, 25, 50];

export default function RecipeTable() {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(15);
  const [total, setTotal] = useState(0);
  const [selected, setSelected] = useState(null);

  const [titleFilter, setTitleFilter] = useState('');
  const [cuisineFilter, setCuisineFilter] = useState('');
  const [ratingFilter, setRatingFilter] = useState('');

  useEffect(() => {
    fetchData();
  }, [page, limit]);

  async function fetchData() {
    try {
      const res = await client.get(`/recipes?page=${page}&limit=${limit}`);
      setData(res.data.data);
      setTotal(res.data.total);
    } catch (err) {
      console.error(err);
    }
  }

  async function applySearchFilters() {
    const params = new URLSearchParams();
    if (titleFilter) params.append('title', titleFilter);
    if (cuisineFilter) params.append('cuisine', cuisineFilter);
    if (ratingFilter) params.append('rating', ratingFilter);

    try {
      const res = await client.get(`/recipes/search?${params.toString()}`);
      setData(res.data.data);
      setTotal(res.data.data.length);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div>
      <div style={{ marginBottom: 12, display: 'flex', gap: 8 }}>
        <TextField label="Title filter" value={titleFilter} onChange={(e)=>setTitleFilter(e.target.value)} />
        <TextField label="Cuisine filter" value={cuisineFilter} onChange={(e)=>setCuisineFilter(e.target.value)} />
        <TextField label="Rating filter (e.g. >=4.5)" value={ratingFilter} onChange={(e)=>setRatingFilter(e.target.value)} />
        <Button variant="contained" onClick={applySearchFilters}>Apply</Button>
        <Button variant="outlined" onClick={()=>{ setTitleFilter(''); setCuisineFilter(''); setRatingFilter(''); fetchData(); }}>Reset</Button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <div>Total results: {total}</div>
        <div>
          per page
          <Select value={limit} onChange={(e)=>{setLimit(e.target.value); setPage(1);}}>
            {PER_PAGE_OPTIONS.map(o => <MenuItem key={o} value={o}>{o}</MenuItem>)}
          </Select>
        </div>
      </div>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Cuisine</TableCell>
              <TableCell>Rating</TableCell>
              <TableCell>Total Time</TableCell>
              <TableCell>Serves</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map(r => (
              <TableRow key={r.id} hover style={{ cursor: 'pointer' }} onClick={()=>setSelected(r)}>
                <TableCell style={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.title}</TableCell>
                <TableCell>{r.cuisine}</TableCell>
                <TableCell><Rating value={r.rating || 0} edit={false} isHalf={true} /></TableCell>
                <TableCell>{r.total_time ?? '-'}</TableCell>
                <TableCell>{r.serves ?? '-'}</TableCell>
              </TableRow>
            ))}
            {data.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">No results found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
        <Button variant="contained" disabled={page<=1} onClick={()=>setPage(p=>p-1)}>Prev</Button>
        <div>Page {page}</div>
        <Button variant="contained" onClick={()=>setPage(p=>p+1)}>Next</Button>
      </div>

      <RecipeDrawer recipe={selected} onClose={()=>setSelected(null)} />
    </div>
  )
}
