import React from 'react';
import { Drawer, Typography, Divider, IconButton, Collapse } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export default function RecipeDrawer({ recipe, onClose }) {
  const [expanded, setExpanded] = React.useState(false);
  if (!recipe) return null;

  const nutrients = recipe.nutrients || {};

  return (
    <Drawer anchor="right" open={!!recipe} onClose={onClose}>
      <div style={{ width: 420, padding: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <Typography variant="h6">{recipe.title}</Typography>
            <Typography variant="subtitle2">{recipe.cuisine}</Typography>
          </div>
          <div>
            <IconButton onClick={onClose}>X</IconButton>
          </div>
        </div>

        <Divider style={{ margin: '8px 0' }} />

        <div>
          <b>Description:</b>
          <div>{recipe.description || '—'}</div>
        </div>

        <div style={{ marginTop: 8 }}>
          <b>Total Time:</b> {recipe.total_time ?? '-'}
          <IconButton onClick={()=>setExpanded(e=>!e)}><ExpandMoreIcon /></IconButton>
          <Collapse in={expanded}>
            <div style={{ paddingLeft: 8 }}>
              <div><b>Prep Time:</b> {recipe.prep_time ?? '-'}</div>
              <div><b>Cook Time:</b> {recipe.cook_time ?? '-'}</div>
            </div>
          </Collapse>
        </div>

        <div style={{ marginTop: 12 }}>
          <b>Nutrition</b>
          <table style={{ width: '100%', marginTop: 8, borderCollapse: 'collapse' }}>
            <tbody>
              <tr><td>Calories</td><td>{nutrients.calories ?? '-'}</td></tr>
              <tr><td>Carbohydrate</td><td>{nutrients.carbohydrateContent ?? '-'}</td></tr>
              <tr><td>Cholesterol</td><td>{nutrients.cholesterolContent ?? '-'}</td></tr>
              <tr><td>Fiber</td><td>{nutrients.fiberContent ?? '-'}</td></tr>
              <tr><td>Protein</td><td>{nutrients.proteinContent ?? '-'}</td></tr>
              <tr><td>Saturated Fat</td><td>{nutrients.saturatedFatContent ?? '-'}</td></tr>
              <tr><td>Sodium</td><td>{nutrients.sodiumContent ?? '-'}</td></tr>
              <tr><td>Sugar</td><td>{nutrients.sugarContent ?? '-'}</td></tr>
              <tr><td>Fat</td><td>{nutrients.fatContent ?? '-'}</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </Drawer>
  )
}
