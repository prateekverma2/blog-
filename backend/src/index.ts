import express, { Request, Response } from 'express';
import cors from 'cors';
import auth from './routes/auth'
import dotenv from 'dotenv';
import logger from './utils/logging';
import tts from './routes/tts';
import posts from './routes/posts';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8080;


app.use(cors());
app.use(express.json());
app.use('/api/auth', auth);
app.use('/api/posts', posts);
app.use('/api/tts', tts);

app.get('/ping', (req: Request, res: Response) => {
    res.send('Hello welcome the ReadME API');
});

app.listen(PORT, () => {
    logger.success(`🚀 Server running at http://localhost:${PORT}`);

});
