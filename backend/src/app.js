const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const recipesRouter = require('./routes/recipes');

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.use('/api/recipes', recipesRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
