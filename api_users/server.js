import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { PrismaClient } from './generated/prisma/index.js';
import { authMiddleware, JWT_SECRET } from './middleware/auth.js';

// Resolver __dirname em ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Pasta de destino dos uploads
// Em dev (local), salva no public do lottus-app para o Vite enxergar.
// Em prod (Render), salva no próprio api_users.
const UPLOADS_DEV = path.join(__dirname, '..', 'lottus-app', 'public', 'uploads');
const UPLOADS_PROD = path.join(__dirname, 'uploads');

// Se a pasta lottus-app estiver acima (local), usa ela; senão (prod), usa local
const UPLOADS_DIR = fs.existsSync(path.join(__dirname, '..', 'lottus-app')) 
  ? UPLOADS_DEV 
  : UPLOADS_PROD;

if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

const prisma = new PrismaClient();
const app = express();

// CORS — aceita o Vercel em produção e localhost em desenvolvimento
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:4173',
  'https://lottus-eight.vercel.app',
  /\.vercel\.app$/  // qualquer preview do Vercel
];

app.use(cors({
  origin: (origin, callback) => {
    // Permite sem origin (ex: curl, mobile apps) ou origens na lista
    if (!origin) return callback(null, true);
    const allowed = allowedOrigins.some(o =>
      typeof o === 'string' ? o === origin : o.test(origin)
    );
    callback(allowed ? null : new Error('CORS: origem não permitida'), allowed);
  },
  credentials: true
}));
app.use(express.json());

// Serve as imagens de upload como arquivos estáticos (necessário no Render)
app.use('/uploads', express.static(UPLOADS_DIR));

// ============================================================
// UPLOAD DE IMAGENS
// ============================================================

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e6);
    cb(null, unique + ext);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (_req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    if (ext && mime) return cb(null, true);
    cb(new Error('Apenas imagens são permitidas (jpeg, png, gif, webp).'));
  }
});

// Rota de upload (protegida por token)
app.post('/upload', authMiddleware, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Nenhum arquivo enviado.' });
  const url = `/uploads/${req.file.filename}`;
  return res.status(201).json({ url });
});


// ============================================================
// ROTAS PÚBLICAS — Usuários (legado)
// ============================================================

app.post('/usuarios', async (req, res) => {
  try {
    const user = await prisma.user.create({
      data: { email: req.body.email, name: req.body.name, age: req.body.age }
    });
    return res.status(201).json(user);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.get('/usuarios', async (req, res) => {
  const { age, name, email } = req.query;
  try {
    const where = {};
    if (name)  where.name  = name;
    if (age)   where.age   = age;
    if (email) where.email = email;
    const users = await prisma.user.findMany({ where });
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao buscar usuários' });
  }
});

app.put('/usuarios/:id', async (req, res) => {
  try {
    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: { email: req.body.email, name: req.body.name, age: req.body.age }
    });
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.delete('/usuarios/:id', async (req, res) => {
  try {
    await prisma.user.delete({ where: { id: req.params.id } });
    return res.status(200).json({ message: 'Usuário deletado com sucesso' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// ============================================================
// ROTAS DE AUTENTICAÇÃO ADM
// ============================================================

// Registro do primeiro admin (pode ser desabilitado depois)
app.post('/auth/register', async (req, res) => {
  const { email, name, password } = req.body;
  if (!email || !name || !password) {
    return res.status(400).json({ error: 'Email, nome e senha são obrigatórios.' });
  }
  try {
    const existing = await prisma.adminUser.findUnique({ where: { email } });
    if (existing) return res.status(409).json({ error: 'Admin já existe.' });

    const passwordHash = await bcrypt.hash(password, 10);
    const admin = await prisma.adminUser.create({ data: { email, name, passwordHash } });
    return res.status(201).json({ id: admin.id, email: admin.email, name: admin.name });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Login do admin
app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
  }
  try {
    const admin = await prisma.adminUser.findUnique({ where: { email } });
    if (!admin) return res.status(401).json({ error: 'Credenciais inválidas.' });

    const valid = await bcrypt.compare(password, admin.passwordHash);
    if (!valid) return res.status(401).json({ error: 'Credenciais inválidas.' });

    const token = jwt.sign(
      { id: admin.id, email: admin.email, name: admin.name },
      JWT_SECRET,
      { expiresIn: '8h' }
    );
    return res.status(200).json({ token, name: admin.name, email: admin.email });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// ============================================================
// ROTAS PÚBLICAS — Produtos (leitura livre)
// ============================================================

app.get('/products', async (req, res) => {
  try {
    const where = { active: true };
    if (req.query.featured === 'true') where.featured = true;
    const products = await prisma.product.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });
    return res.status(200).json(products);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.get('/products/:id', async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id },
      include: { 
        reviews: { 
          where: { approved: true },
          orderBy: { createdAt: 'desc' } 
        },
        collection: true
      }
    });
    if (!product) return res.status(404).json({ error: 'Produto não encontrado.' });
    return res.status(200).json(product);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// ============================================================
// ROTAS PÚBLICAS — Coleções
// ============================================================

app.get('/collections', async (req, res) => {
  try {
    const collections = await prisma.collection.findMany({
      include: { _count: { select: { products: true } } },
      orderBy: { name: 'asc' }
    });
    return res.status(200).json(collections);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.get('/collections/:id', async (req, res) => {
  try {
    const collection = await prisma.collection.findUnique({
      where: { id: req.params.id },
      include: { 
        products: {
          where: { active: true },
          orderBy: { createdAt: 'desc' }
        }
      }
    });
    if (!collection) return res.status(404).json({ error: 'Coleção não encontrada.' });
    return res.status(200).json(collection);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// ============================================================
// ROTAS PÚBLICAS — Reviews (leitura/criação livre)
// ============================================================

app.post('/products/:id/reviews', async (req, res) => {
  const { name, email, review } = req.body;
  const productId = req.params.id;

  if (!name || !email || !review) {
    return res.status(400).json({ error: 'Nome, email e comentário são obrigatórios.' });
  }

  try {
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) return res.status(404).json({ error: 'Produto não encontrado.' });

    const newReview = await prisma.review.create({
      data: { name, email, review, productId }
    });
    return res.status(201).json(newReview);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// ============================================================
// ROTAS PROTEGIDAS — Produtos (CRUD admin)
// ============================================================

app.post('/products', authMiddleware, async (req, res) => {
  const { name, price, category, tag, description, images, collectionName, collectionId, status } = req.body;
  
  try {
    let finalCollectionId = collectionId;

    // Se passou nome mas não ID, tenta achar ou criar a coleção
    if (collectionName && !finalCollectionId) {
      const coll = await prisma.collection.upsert({
        where: { name: collectionName },
        update: {},
        create: { name: collectionName }
      });
      finalCollectionId = coll.id;
    }

    const product = await prisma.product.create({
      data: { 
        name, 
        price: parseFloat(price), 
        category, 
        tag, 
        description, 
        images: images || [],
        collectionId: finalCollectionId,
        status: status || 'AVAILABLE'
      }
    });
    return res.status(201).json(product);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.put('/products/:id', authMiddleware, async (req, res) => {
  const { name, price, category, tag, description, images, active, featured, collectionId, collectionName, status } = req.body;
  try {
    let finalCollectionId = collectionId;

    if (collectionName && !finalCollectionId) {
      const coll = await prisma.collection.upsert({
        where: { name: collectionName },
        update: {},
        create: { name: collectionName }
      });
      finalCollectionId = coll.id;
    }

    const product = await prisma.product.update({
      where: { id: req.params.id },
      data: { 
        name, 
        price: parseFloat(price), 
        category, 
        tag, 
        description, 
        images, 
        active, 
        featured,
        collectionId: finalCollectionId,
        status: status || 'AVAILABLE'
      }
    });
    return res.status(200).json(product);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Rota dedicada para alternar destaque na Home (Vitrine)
app.patch('/products/:id/featured', authMiddleware, async (req, res) => {
  const { featured } = req.body;
  if (typeof featured !== 'boolean') {
    return res.status(400).json({ error: 'O campo featured deve ser boolean.' });
  }
  try {
    const product = await prisma.product.update({
      where: { id: req.params.id },
      data: { featured }
    });
    return res.status(200).json(product);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.delete('/products/:id', authMiddleware, async (req, res) => {
  try {
    await prisma.product.delete({ where: { id: req.params.id } });
    return res.status(200).json({ message: 'Produto deletado com sucesso.' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// ============================================================
// ROTAS PROTEGIDAS — Coleções (CRUD admin)
// ============================================================

app.post('/collections', authMiddleware, async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'Nome da coleção é obrigatório.' });
  try {
    const collection = await prisma.collection.create({ data: { name } });
    return res.status(201).json(collection);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.delete('/collections/:id', authMiddleware, async (req, res) => {
  try {
    await prisma.collection.delete({ where: { id: req.params.id } });
    return res.status(200).json({ message: 'Coleção deletada com sucesso.' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// ============================================================
// ROTAS PROTEGIDAS — Reviews (CRUD admin)
// ============================================================

app.get('/reviews/pending', authMiddleware, async (req, res) => {
  try {
    const reviews = await prisma.review.findMany({
      where: { approved: false },
      include: {
        product: { select: { name: true, images: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    return res.status(200).json(reviews);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.put('/reviews/:id/approve', authMiddleware, async (req, res) => {
  try {
    const review = await prisma.review.update({
      where: { id: req.params.id },
      data: { approved: true }
    });
    return res.status(200).json(review);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.delete('/reviews/:id', authMiddleware, async (req, res) => {
  try {
    await prisma.review.delete({ where: { id: req.params.id } });
    return res.status(200).json({ message: 'Avaliação deletada com sucesso.' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// ============================================================
// ROTAS PÚBLICAS — Posts (leitura livre)
// ============================================================

app.get('/posts', async (req, res) => {
  try {
    const where = {};
    if (req.query.published === 'true') where.published = true;
    const posts = await prisma.post.findMany({ where, orderBy: { createdAt: 'desc' } });
    return res.status(200).json(posts);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.get('/posts/:id', async (req, res) => {
  try {
    const post = await prisma.post.findUnique({ where: { id: req.params.id } });
    if (!post) return res.status(404).json({ error: 'Post não encontrado.' });
    return res.status(200).json(post);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// ============================================================
// ROTAS PROTEGIDAS — Posts (CRUD admin)
// ============================================================

app.post('/posts', authMiddleware, async (req, res) => {
  const { title, content, image, published } = req.body;
  try {
    const post = await prisma.post.create({
      data: { title, content, image, published: published || false }
    });
    return res.status(201).json(post);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.put('/posts/:id', authMiddleware, async (req, res) => {
  const { title, content, image, published } = req.body;
  try {
    const post = await prisma.post.update({
      where: { id: req.params.id },
      data: { title, content, image, published }
    });
    return res.status(200).json(post);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.delete('/posts/:id', authMiddleware, async (req, res) => {
  try {
    await prisma.post.delete({ where: { id: req.params.id } });
    return res.status(200).json({ message: 'Post deletado com sucesso.' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// ============================================================
// ROTAS — Configurações do Site
// ============================================================

app.get('/config', async (req, res) => {
  try {
    const configs = await prisma.siteConfig.findMany();
    // Retorna como objeto chave->valor para facilitar no frontend
    const result = {};
    configs.forEach(c => { result[c.key] = c.value; });
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.put('/config', authMiddleware, async (req, res) => {
  // Recebe um objeto { key: value, key2: value2 }
  const updates = req.body;
  try {
    const promises = Object.entries(updates).map(([key, value]) =>
      prisma.siteConfig.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value) }
      })
    );
    await Promise.all(promises);
    return res.status(200).json({ message: 'Configurações salvas com sucesso.' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// ============================================================
// START
// ============================================================

app.listen(3001, () => {
  console.log('🌿 Lottus API rodando na porta 3001');
});