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

console.log('Populando Estoque com dados fake...');

const stockData = [
  { name: 'Linha Rosa Millennial 100g', category: 'Linha', quantity: 25, unit: 'rolos', minAlert: 10 },
  { name: 'Linha Branco Suave 100g', category: 'Linha', quantity: 5, unit: 'rolos', minAlert: 8 },
  { name: 'Linha Preto Nobre 100g', category: 'Linha', quantity: 0, unit: 'rolos', minAlert: 5 },
  { name: 'Sacola Kraft G', category: 'Sacola', quantity: 150, unit: 'unidades', minAlert: 50 },
  { name: 'Sacola Kraft M', category: 'Sacola', quantity: 20, unit: 'unidades', minAlert: 50 },
  { name: 'Adesivo Lottus Dourado', category: 'Adesivo', quantity: 300, unit: 'unidades', minAlert: 100 },
  { name: 'Cartão de Agradecimento', category: 'Cartão', quantity: 50, unit: 'unidades', minAlert: 100 },
  { name: 'Etiqueta de Couro', category: 'Etiqueta', quantity: 15, unit: 'unidades', minAlert: 30 },
  { name: 'Bolsa Boho (Pronta)', category: 'Peças Prontas', quantity: 2, unit: 'unidades', minAlert: 1 }
];

let stockOk = 0;
for (const item of stockData) {
  const res = await fetch(`${API}/stock`, {
    method: 'POST',
    headers,
    body: JSON.stringify(item)
  });
  if (res.ok) stockOk++;
}
console.log(`✅ ${stockOk} itens de estoque criados.`);

console.log('Populando Pedidos com dados fake...');

const d = new Date();
const orderData = [
  { clientName: 'Amanda Silva', description: 'Bolsa Tiracolo Azul bebê com alça dourada', saleType: 'SOB_ENCOMENDA', value: 240.0, dueDate: new Date(d.getFullYear(), d.getMonth(), d.getDate() + 5), status: 'TODO', notes: 'Quer a embalagem para presente' },
  { clientName: 'Beatriz Costa', description: '2x Sousplat Cru Premium', saleType: 'SOB_ENCOMENDA', value: 90.0, dueDate: new Date(d.getFullYear(), d.getMonth(), d.getDate() + 2), status: 'TODO', notes: 'Entregar na portaria' },
  { clientName: 'Camila Pereira', description: 'Bolsa de Praia G Gelo', saleType: 'SOB_ENCOMENDA', value: 320.0, dueDate: new Date(d.getFullYear(), d.getMonth(), d.getDate() - 1), status: 'IN_PROGRESS', notes: 'Urgente! Viaja na sexta.' },
  { clientName: 'Daniela Ferreira', description: 'Bolsa Redonda Preta', saleType: 'PRONTA_ENTREGA', value: 180.0, dueDate: new Date(d.getFullYear(), d.getMonth(), d.getDate()), status: 'IN_PROGRESS', notes: null },
  { clientName: 'Fernanda Lima', description: 'Jogo Americano (4 peças) Terracota', saleType: 'SOB_ENCOMENDA', value: 160.0, dueDate: new Date(d.getFullYear(), d.getMonth(), d.getDate() - 3), status: 'DONE', notes: 'Esperando cliente buscar' },
  { clientName: 'Loja Colaborativa', description: '10x Chaveiros de Coração Variados', saleType: 'ATACADO', value: 250.0, dueDate: new Date(d.getFullYear(), d.getMonth(), d.getDate()), status: 'DONE', notes: 'Ligar para confirmar motoboy' },
  { clientName: 'Gabriela Rocha', description: 'Bolsa Clutch Nude', saleType: 'PRONTA_ENTREGA', value: 120.0, dueDate: new Date(d.getFullYear(), d.getMonth(), d.getDate() - 7), status: 'DELIVERED', notes: 'Enviado por Correios (Código ABC123BR)' }
];

let orderOk = 0;
for (const order of orderData) {
  const res = await fetch(`${API}/orders`, {
    method: 'POST',
    headers,
    body: JSON.stringify(order)
  });
  if (res.ok) orderOk++;
}
console.log(`✅ ${orderOk} pedidos criados.`);

console.log('🎉 Seed finalizado com sucesso!');
