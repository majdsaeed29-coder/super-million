const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// خدمة ملفات الـ static من مجلد public
app.use(express.static(path.join(__dirname, 'public')));

// جميع الطلبات ترجع لـ index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`✅ السيرفر شغال على http://localhost:${PORT}`);
    console.log(`📁 الملفات من: ${path.join(__dirname, 'public')}`);
});
