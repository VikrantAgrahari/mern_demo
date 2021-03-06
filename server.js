const express = require('express');
const connection = require('./config/db');
const app = express();

connection();

app.use(express.json({ extended: false }));

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.use('/api/users', require('./routes/api/users'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));
app.use('/api/auth', require('./routes/api/auth'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Port is running on ${PORT}`));
