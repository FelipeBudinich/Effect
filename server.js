import express from 'express';
import { glob } from 'glob';
import path from 'path';

const app = express();
const port = 3000;
const root = path.resolve(process.cwd(), 'public');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(root, 'index.html'));
});

app.get('/api/glob', async (req, res) => {
    try {
        const patterns = Array.isArray(req.query.glob) ? req.query.glob : [req.query.glob];
        let matches = [];

        for (const pattern of patterns) {
            const files = await glob(pattern, { cwd: root });
            matches = matches.concat(files);
        }

        res.json(matches);
    } catch (err) {
        console.error('Error fetching files with glob:', err);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
