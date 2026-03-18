// seed.js — Popula o banco MongoDB com os produtos iniciais da Lottus
// Rode com: node seed.js  (com o servidor api_users rodando na porta 3001)

const API = 'http://localhost:3001';

// 1. Faz login para pegar o token JWT
const loginRes = await fetch(`${API}/auth/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'admin@lottus.com', password: 'lottus2024' })
});
const { token } = await loginRes.json();

if (!token) {
  console.error('❌ Falha no login. Verifique se o servidor está rodando e as credenciais estão corretas.');
  process.exit(1);
}
console.log('✅ Login efetuado!');

const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`
};

// 2. Produtos para inserir
const products = [
  {
    name: 'Bolsa Boho Lottus',
    price: 180.00,
    category: 'Bolsas',
    tag: 'Bestseller',
    description: 'Uma bolsa versátil e elegante, perfeita para o dia a dia. Feita com fio de algodão sustentável. Dimensões: 30cm x 25cm x 10cm.',
    images: ['/images/crochet_bag_1773664603233.png'],
    featured: true
  },
  {
    name: 'Manta Cozy Color',
    price: 350.00,
    category: 'Casa',
    tag: 'Novo',
    description: 'Aconchego puro para suas noites. Cores vibrantes que alegram qualquer ambiente. Tamanho casal: 1.50m x 2.00m.',
    images: ['/images/crochet_blanket_1773664622003.png'],
    featured: true
  },
  {
    name: 'Top Crochet Summer',
    price: 120.00,
    category: 'Roupas',
    tag: 'Premium',
    description: 'Leveza e estilo para os dias de sol. Design exclusivo que se molda ao corpo. Tamanhos P/M. Largura 40cm.',
    images: ['/images/crochet_top_1773664642938.png'],
    featured: true
  },
  {
    name: 'Kit Sousplat Mandala',
    price: 95.00,
    category: 'Casa',
    tag: 'Artesanal',
    description: 'Mesa posta com carinho. Conjunto de 4 peças com tramas em relevo. Diâmetro: 35cm cada.',
    images: ['/images/crochet_rugs_1773664671137.png'],
    featured: true
  },
  {
    name: 'Bolsa de Praia Shell',
    price: 150.00,
    category: 'Bolsas',
    tag: 'Verão',
    description: 'Espaçosa e ideal para o verão. Leve para a praia ou passeio. Tamanho G: 45cm x 40cm.',
    images: ['/images/crochet_bag_1773664603233.png'],
    featured: false
  },
  {
    name: 'Cestinho Organizador',
    price: 45.00,
    category: 'Casa',
    tag: 'Organização',
    description: 'Mantenha tudo no lugar com charme. Pequeno e funcional para qualquer cômodo. Tamanho P: 15cm x 15cm.',
    images: ['/images/crochet_rugs_1773664671137.png'],
    featured: false
  }
];

// 3. Insere cada produto
let ok = 0;
let fail = 0;

for (const product of products) {
  const res = await fetch(`${API}/products`, {
    method: 'POST',
    headers,
    body: JSON.stringify(product)
  });

  const data = await res.json();
  if (res.ok) {
    const status = product.featured ? '🏠 (na Home)' : '📦 (catálogo)';
    console.log(`✅ "${product.name}" criado ${status}`);
    ok++;
  } else {
    console.error(`❌ Erro ao criar "${product.name}":`, data.error);
    fail++;
  }
}

console.log(`\n🎉 Seed finalizado! ${ok} criados, ${fail} erros.`);
