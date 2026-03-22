
const API_URL = 'http://localhost:3001';
const ADMIN_EMAIL = 'admin@lottus.com';
const ADMIN_PASS = 'lottus2024';

const newProducts = [
  {
    name: "Bolsa Boho Bloom",
    price: 249.90,
    category: "Bolsas",
    tag: "Exclusivo",
    description: "Uma bolsa delicada com padrões florais feitos à mão, ideal para passeios leves.",
    collectionName: "Inverno 2024",
    images: ["https://images.unsplash.com/photo-1614633833026-00201389426f?q=80&w=800"]
  },
  {
    name: "Top Serenity Crochê",
    price: 189.90,
    category: "Roupas",
    tag: "Bestseller",
    description: "Top leve e elegante em tons pastel, perfeito para combinar com looks modernos.",
    collectionName: "Inverno 2024",
    images: ["https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=800"]
  },
  {
    name: "Cachecol Azure Mist",
    price: 120.00,
    category: "Acessórios",
    tag: "Novo",
    description: "Maciez e calor em cada ponto, feito com lã premium para os dias frios.",
    collectionName: "Inverno 2024",
    images: ["https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?q=80&w=800"]
  },
  {
    name: "Vaso de Crochê 'Luz'",
    price: 85.00,
    category: "Casa",
    tag: "Artesanal",
    description: "Capa para vaso em crochê, trazendo aconchego e estilo para sua decoração.",
    collectionName: "Especial Casa",
    images: ["https://images.unsplash.com/photo-1614633833502-d9f75f788102?q=80&w=800"]
  },
  {
    name: "Mochila Urban Knots",
    price: 320.00,
    category: "Bolsas",
    tag: "Premium",
    description: "Ampla e resistente, com detalhes em nós que dão um toque contemporâneo ao crochê.",
    collectionName: "Especial Casa",
    images: ["https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=800"]
  }
];

async function seed() {
  try {
    console.log('--- Fazendo login admin ---');
    const loginRes = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASS })
    });
    
    const { token } = await loginRes.json();
    if (!token) throw new Error('Falha no login');
    console.log('Login OK!');

    for (const p of newProducts) {
      console.log(`Cadastrando: ${p.name}...`);
      const res = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(p)
      });
      
      if (res.ok) {
        console.log(`Sucesso: ${p.name} adicionado à coleção ${p.collectionName}`);
      } else {
        const err = await res.json();
        console.log(`Erro em ${p.name}:`, err.error);
      }
    }

    console.log('--- Cadastro de sementes finalizado! ---');
  } catch (err) {
    console.error('Erro no script:', err.message);
  }
}

seed();
