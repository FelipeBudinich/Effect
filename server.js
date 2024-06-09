import express from 'express';
import path from 'path';
import fs from 'fs/promises'; 
import { glob } from 'glob';
import { outputFile } from './tools/fs-utils.js';

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

app.post('/api/save', async (req, res) => {
    const { path: reqPath, data } = req.body;

    if (!reqPath || !data) {
        return res.send({ error: 1, msg: 'No Data or Path specified' });
    }

    if (!/\.js$/.test(reqPath)) {
        return res.send({ error: 3, msg: 'File must have a .js suffix' });
    }

    try {
        await outputFile(path.join(root, reqPath), data);
        res.send({ error: 0 });
    } catch (err) {
        console.error('Error writing to file:', err);
        res.send({ error: 2, msg: 'Couldn\'t write to file: ' + reqPath });
    }
});

app.get('/api/browse', async (req, res) => {
    const dir = req.query.dir || '';
    const type = req.query.type;
    const types = { scripts: ['.js'], images: ['.png', '.gif', '.jpg', '.jpeg'] };
    const result = { dirs: [], files: [] };

    const filter = (type && types[type]) ? types[type] : false;

    result.parent = dir ? dir.substring(0, dir.lastIndexOf('/')) : false;

    let normalizedDir = dir.endsWith('/') ? dir.slice(0, -1) : dir;
    normalizedDir += '/';

    const dirpath = path.normalize(path.join(root, normalizedDir));

    try {
        const files = await fs.readdir(dirpath);
        for (const file of files) {
            const resPath = (normalizedDir !== '/' ? normalizedDir : '') + file;
            const stats = await fs.stat(path.join(dirpath, file));

            if (stats.isDirectory()) {
                result.dirs.push(resPath);
            } else if (stats.isFile()) {
                if (filter) {
                    if (filter.includes(path.extname(file))) {
                        result.files.push(resPath);
                    }
                } else {
                    result.files.push(resPath);
                }
            }
        }

        res.send(result);
    } catch (err) {
        console.error('Error reading directory:', err);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
