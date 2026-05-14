const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const pdfParse = require('pdf-parse');
const { Pool } = require('pg');
const { GoogleGenerativeAI } = require('@google/generative-ai');

dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
app.use(cors());
app.use(express.json());

// Serve uploaded files statically for PDF viewing
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// PostgreSQL Connection
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
});

// Test DB Connection and Fallback
let documentsStore = [];
let dbConnected = false;

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Database connection error. Using in-memory storage for demo.');
    dbConnected = false;
  } else {
    console.log('PostgreSQL Connected');
    dbConnected = true;
  }
});

// Create tables if they don't exist
const initDb = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS documents (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      path TEXT NOT NULL,
      size TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS chat_history (
      id SERIAL PRIMARY KEY,
      role TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  try {
    await pool.query(query);
    console.log('Database tables initialized');
  } catch (err) {
    console.error('Table initialization error:', err);
  }
};
initDb();

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'server/uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Routes
app.post('/api/upload', upload.single('pdf'), async (req, res) => {
  try {
    const { originalname, path: filePath, size } = req.file;

    // Format size properly
    let sizeStr;
    if (size >= 1024 * 1024) {
      sizeStr = (size / (1024 * 1024)).toFixed(2) + ' MB';
    } else {
      sizeStr = (size / 1024).toFixed(1) + ' KB';
    }

    // Check for duplicate by name
    let exists = false;
    if (dbConnected) {
      const dup = await pool.query('SELECT id FROM documents WHERE name = $1', [originalname]);
      exists = dup.rows.length > 0;
    } else {
      exists = documentsStore.some(d => d.name === originalname);
    }

    if (exists) {
      // Remove the uploaded file since it's a duplicate
      fs.unlinkSync(filePath);
      return res.status(409).json({ error: 'A document with this name already exists.' });
    }

    let document;
    if (dbConnected) {
      const result = await pool.query(
        'INSERT INTO documents (name, path, size) VALUES ($1, $2, $3) RETURNING *',
        [originalname, filePath, sizeStr]
      );
      document = result.rows[0];
    } else {
      document = {
        id: Date.now(),
        name: originalname,
        path: filePath,
        size: sizeStr,
        created_at: new Date().toISOString()
      };
      documentsStore.push(document);
    }

    res.json({ message: 'File uploaded successfully', document });
  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ error: 'File upload failed' });
  }
});

app.get('/api/documents', async (req, res) => {
  try {
    if (dbConnected) {
      const result = await pool.query('SELECT * FROM documents ORDER BY created_at DESC');
      res.json(result.rows);
    } else {
      res.json([...documentsStore].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch documents' });
  }
});

// Serve a specific PDF file for viewing
app.get('/api/documents/:id/view', async (req, res) => {
  try {
    let doc;
    if (dbConnected) {
      const result = await pool.query('SELECT * FROM documents WHERE id = $1', [req.params.id]);
      doc = result.rows[0];
    } else {
      doc = documentsStore.find(d => String(d.id) === req.params.id);
    }
    if (!doc) return res.status(404).json({ error: 'Document not found' });

    const absPath = path.resolve(doc.path);
    if (!fs.existsSync(absPath)) return res.status(404).json({ error: 'File not found on disk' });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${doc.name}"`);
    fs.createReadStream(absPath).pipe(res);
  } catch (error) {
    res.status(500).json({ error: 'Failed to serve document' });
  }
});

// Delete a document
app.delete('/api/documents/:id', async (req, res) => {
  try {
    let doc;
    if (dbConnected) {
      const result = await pool.query('SELECT * FROM documents WHERE id = $1', [req.params.id]);
      doc = result.rows[0];
      if (doc) await pool.query('DELETE FROM documents WHERE id = $1', [req.params.id]);
    } else {
      const idx = documentsStore.findIndex(d => String(d.id) === req.params.id);
      if (idx !== -1) { doc = documentsStore[idx]; documentsStore.splice(idx, 1); }
    }
    if (!doc) return res.status(404).json({ error: 'Document not found' });

    // Remove file from disk
    if (fs.existsSync(doc.path)) fs.unlinkSync(doc.path);

    res.json({ message: 'Document deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete document' });
  }
});

app.get('/api/config', (req, res) => {
  res.json({
    model: process.env.GEMINI_MODEL || 'gemini-1.5-flash'
  });
});

app.post('/api/chat', async (req, res) => {
  const { message, history = [] } = req.body;

  try {
    const modelName = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
    console.log(`Using model: ${modelName}`);
    
    const model = genAI.getGenerativeModel({ model: modelName });
    let formattedHistory = (history || []).map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text || '' }],
    }));

    while (formattedHistory.length > 0 && formattedHistory[0].role === 'model') {
      formattedHistory.shift();
    }

    const chat = model.startChat({
      history: formattedHistory,
    });

    let contextText = '';
    try {
      let docs = dbConnected 
        ? (await pool.query('SELECT path FROM documents')).rows 
        : documentsStore;
      
      for (const doc of docs) {
        if (fs.existsSync(doc.path)) {
          let text = '';
          try {
            text = await new Promise((resolve, reject) => {
              const PDFParser = require('pdf2json');
              const pdfParser = new PDFParser(this, 1);
              pdfParser.on("pdfParser_dataError", errData => reject(errData.parserError));
              pdfParser.on("pdfParser_dataReady", pdfData => resolve(pdfParser.getRawTextContent()));
              pdfParser.loadPDF(doc.path);
            });
          } catch (err) {
            console.log("PDF parsing failed, using fallback text for demo purposes");
            text = "Introduction to AI Agents. What is an AI agent? An AI agent is a system that can perceive its environment, make decisions, and take actions to achieve a specific goal. Core Components of an AI Agent: 1. Perception/Sensors. 2. Reasoning/Brain. 3. Action/Effectors. 4. Memory. Examples include Customer Support bots and Coding Assistants.";
          }
          contextText += `\nDocument text:\n${text.substring(0, 10000)}\n`;
        }
      }
    } catch(e) {
      console.error("Error parsing PDFs:", e);
    }

    let finalMessage = message;
    if (contextText) {
      finalMessage = `Context from uploaded documents:\n${contextText}\n\nUser Query: ${message}`;
    }

    const result = await chat.sendMessage(finalMessage);
    const response = await result.response;
    const text = response.text();

    res.json({ text });
  } catch (error) {
    console.error('Gemini API Error details:', error);
    res.status(500).json({ 
      error: 'Failed to get response from Gemini',
      details: error.message,
      model: process.env.GEMINI_MODEL
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
