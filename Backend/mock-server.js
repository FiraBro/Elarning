const express = require('express');
const app = express();
const authRoutes = require('./routes/authRoutes');

app.use(express.json());
app.use('/api/auth', authRoutes);

app.use((req, res) => {
    res.status(404).send('Not Found in mock server: ' + req.originalUrl);
});

app.listen(5001, () => console.log('Mock server on 5001'));
