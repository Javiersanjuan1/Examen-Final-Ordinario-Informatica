const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

const scoresPath = path.join(__dirname, 'scores.json');

app.use(express.json());

app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/scores', (req, res) => {
    fs.readFile(scoresPath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error al leer scores.json:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
        res.json(JSON.parse(data));
    });
});

app.post('/scores', (req, res) => {
    const { name, score } = req.body;

    if (!name || typeof score !== 'number') {
        return res.status(400).json({ error: 'Datos inválidos' });
    }

    fs.readFile(scoresPath, 'utf8', (err, data) => {
        let scores = [];

        if (!err) {
            try {
                scores = JSON.parse(data);
            } catch (parseError) {
                console.warn('Archivo JSON corrupto. Se sobrescribirá.');
            }
        }

        scores.push({ name, score, timestamp: new Date().toISOString() });

        fs.writeFile(scoresPath, JSON.stringify(scores, null, 2), (writeErr) => {
            if (writeErr) {
                console.error('Error al guardar en scores.json:', writeErr);
                return res.status(500).json({ error: 'No se pudo guardar el puntaje' });
            }

            res.status(201).json({ message: 'Puntaje guardado correctamente' });
        });
    });
});

app.listen(PORT, () => {
    console.log(`Servidor iniciado en http://localhost:${PORT}`);
});
