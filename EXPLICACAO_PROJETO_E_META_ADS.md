# Manual de Explicação do Ecossistema e Integração com Meta Ads — Lottus

Olá, Vini! Este manual foi criado para explicar de forma simples e direta como a estrutura atual do seu projeto **Lottus** funciona, para que serve a sua **Chave API de Desenvolvimento do Meta** e quais passos práticos você pode dar para preparar o seu sistema para rodar anúncios altamente otimizados no Instagram e Facebook.

---

## ⚙️ 1. Como a Estrutura Atual do Projeto Funciona?

O ecossistema da Lottus está dividido em duas pastas principais que se comunicam através da internet:

```
  +-----------------------------+
  |    lottus-app (Frontend)    | <---+ (React/Vite)
  +--------------+--------------+     |
                 |                    | Requisições HTTP
                 v                    |
  +--------------+--------------+     |
  |     api_users (Backend)     | <---+ (Express/Node.js)
  +--------------+--------------+
                 |
                 v (Prisma Client)
  +--------------+--------------+
  |    MongoDB (Banco Dados)    | (Nuvem Atlas)
  +-----------------------------+
```

### 🖥️ A. O Frontend (`lottus-app`)
* **Tecnologia:** React.js, Vite e Vanilla CSS (estilos customizados).
* **O que faz:** É a interface visual que o seu cliente acessa. Ele exibe os produtos, as coleções, as avaliações de clientes e gerencia um **Carrinho de Compras** local (`CartContext.jsx`).
* **Como funciona a venda:** Atualmente, a loja não possui gateway de pagamento integrado (como Mercado Pago ou Stripe). Em vez disso, quando o cliente vai para o checkout, o sistema lê os itens do carrinho e gera um link personalizado do **WhatsApp**. O cliente é redirecionado e a venda é fechada em uma conversa humana.
* **Painel Administrativo:** Acessando a rota de Admin, você consegue cadastrar novos produtos, gerenciar as fotos carregadas, alterar o estoque físico e aprovar avaliações enviadas por clientes.

### 🔌 B. O Backend (`api_users`)
* **Tecnologia:** Node.js, Express e Prisma ORM.
* **O que faz:** É o cérebro que roda no servidor. Ele recebe as ordens do frontend (ex: *"Me dê a lista de produtos cadastrados"*, *"Crie um novo produto"*, *"Registre um pedido feito"*).
* **Como gerencia arquivos:** Salva as imagens dos produtos na pasta `/uploads` (em ambiente local, ele joga direto na pasta `public/uploads` do React para facilitar a exibição).
* **Segurança:** Utiliza criptografia de senhas com `bcryptjs` e autenticação via tokens JWT para garantir que apenas você (o administrador) possa alterar dados críticos do site.

### 💾 C. O Banco de Dados (MongoDB)
* **Tecnologia:** MongoDB Atlas (banco de dados na nuvem).
* **O que faz:** Armazena de forma permanente os textos, preços, links de imagens, estoque e informações de cadastro que a API gerencia.

---

## 🔑 2. Para que serve a sua Chave API de Desenvolvimento do Meta?

Você perguntou: **"A chave de desenvolvimento vai servir para que, sendo que não avancei e postei o produto da API? Ela não vai ter todas as funções?"**

A resposta curta é: **Ela serve justamente para você construir e testar a integração antes de colocar o site no ar ou gastar dinheiro com anúncios.** 

Aqui está detalhado o que ela permite fazer na sua fase atual:

1. **Testes de Envio Sem Poluir Dados Reais:**
   O Meta Ads utiliza inteligência artificial baseada nos eventos recebidos para decidir para quem mostrar seus anúncios. Se você fizesse testes de compra usando a sua chave de produção real, você estaria poluindo a inteligência do pixel com dados de testes fictícios. A chave de desenvolvimento permite que você use a ferramenta **Test Events (Eventos de Teste)** do Meta para validar o envio em tempo real, marcado como ambiente de testes.
2. **Desenvolvimento da Conversions API (CAPI):**
   Como a chave de desenvolvimento dá acesso à API de testes do Graph do Facebook, você pode programar o código do seu backend (`api_users`) para enviar informações de conversão sem que o Meta exija que o seu domínio esteja verificado e o aplicativo esteja publicado na App Store do Facebook.
3. **Validação de Criptografia de Dados (Hashing SHA-256):**
   O Meta exige que dados sensíveis dos clientes (como e-mail, telefone, nome) sejam enviados criptografados em formato SHA-256. Com a chave de desenvolvimento, você pode testar se a conversão de e-mail que seu backend faz está correta e se o Meta está aceitando a correspondência de dados de forma bem-sucedida.
4. **Isenção de App Review (Revisão de Aplicativo):**
   Para colocar um aplicativo em modo de Produção Oficial no Meta (especialmente se for lidar com APIs de catálogo ou dados avançados), o Facebook exige gravações de tela do seu sistema, políticas de privacidade, etc. A chave de desenvolvimento permite que você, como administrador, utilize **todas as funcionalidades de desenvolvimento do SDK do Meta** sem precisar passar por essa aprovação prévia.

---

## 📈 3. O Roteiro de Como Melhorar o Sistema para Meta Ads

Dado que o seu modelo de vendas é baseado no **WhatsApp**, o Meta Ads comum (apenas com o Pixel no navegador) falha muito. Se o cliente clica no anúncio, entra no site e vai para o WhatsApp, o Pixel do navegador perde o rastro e não sabe se a venda aconteceu ou não.

Para ter um rastreamento perfeito e anúncios de conversão otimizados, você deve aplicar estas 3 melhorias:

### 🚀 Melhoria A: Adicionar o Meta Pixel no Frontend
Instalar o script padrão no cabeçalho do seu frontend. Ele enviará sinais do navegador.
* **Eventos sugeridos:**
  * `PageView` - Em todas as páginas (assim que o usuário entra).
  * `ViewContent` - Quando ele clica e visualiza os detalhes de um produto específico.
  * `InitiateCheckout` - No momento em que ele abre a barra lateral do carrinho e clica em *"Finalizar Pedido via WhatsApp"*.

### ⚡ Melhoria B: Conversions API (CAPI) do Meta no Servidor (Essencial)
Como navegadores modernos (especialmente o Safari no iOS 14+ e navegadores com AdBlock) bloqueiam o Pixel JavaScript, você deve enviar o evento por fora (servidor-para-servidor).
* **Como funciona:**
  Quando o usuário clica no botão do WhatsApp, o frontend dispara uma chamada para o seu backend `POST /api/pixel/event`. O backend, usando a sua **Chave de API**, formata os dados do usuário, o IP, o User-Agent do navegador e envia diretamente para o Meta.
* **Vantagem:** Este evento nunca é bloqueado por bloqueadores de anúncio e garante pontuação máxima de rastreamento de conversão.

### 📦 Melhoria C: XML Feed de Produtos (Catálogo do Meta)
Anúncios dinâmicos de produto (aqueles carrosséis de produtos que aparecem no Instagram para quem já visitou o seu site) exigem que o Facebook conheça os seus produtos, preços e fotos atualizadas.
* **Como funciona:**
  Você cria uma rota na API (`api_users`), ex: `/products/facebook-feed`. Essa rota lê todos os produtos ativos do MongoDB e cospe um documento XML no formato padrão do Commerce Manager do Facebook.
  No gerenciador de anúncios, você só cadastra essa URL. O Facebook lerá esse feed a cada 1 hora ou diariamente e atualizará o preço e as imagens das campanhas automaticamente.

---

## 💻 4. Exemplos Práticos de Código para Implementar

Aqui estão exemplos práticos de como você ou seu desenvolvedor podem adicionar essas funcionalidades ao projeto atual:

### 📊 Exemplo 1: Gerando o Feed de Produtos XML (no Backend `server.js`)
Adicione esta rota pública no arquivo [server.js](file:///C:/Users/vini/Music/Lottus/api_users/server.js). O Meta usará este feed para preencher o seu catálogo de anúncios automaticamente.

```javascript
// Rota pública para o Feed de Produtos do Meta Catalog
app.get('/products/facebook-feed', async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      where: { active: true },
      include: { collection: true }
    });

    let xml = `<?xml version="1.0"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>Lottus Store Feed</title>
    <link>https://lottus-eight.vercel.app</link>
    <description>Catálogo de produtos Lottus sincronizado automaticamente</description>`;

    products.forEach(p => {
      // Pega a primeira imagem do array ou uma padrão
      const mainImage = p.images && p.images.length > 0 
        ? `https://lottus-api.onrender.com${p.images[0]}` // Troque pela URL de produção da sua API
        : 'https://lottus-eight.vercel.app/placeholder.jpg';

      xml += `
    <item>
      <g:id>${p.id}</g:id>
      <g:title><![CDATA[${p.name}]]></g:title>
      <g:description><![CDATA[${p.description || p.name}]]></g:description>
      <g:link>https://lottus-eight.vercel.app/produtos?id=${p.id}</g:link>
      <g:image_link>${mainImage}</g:image_link>
      <g:availability>${p.status === 'AVAILABLE' ? 'in stock' : 'out of stock'}</g:availability>
      <g:price>${p.price.toFixed(2)} BRL</g:price>
      <g:brand>Lottus</g:brand>
      <g:condition>new</g:condition>
      <g:google_product_category>Apparel &amp; Accessories</g:google_product_category>
    </item>`;
    });

    xml += `
  </channel>
</rss>`;

    res.header('Content-Type', 'text/xml');
    return res.status(200).send(xml);
  } catch (error) {
    return res.status(500).send(`<error>${error.message}</error>`);
  }
});
```

### 🛰️ Exemplo 2: Disparando Eventos via Conversions API (no Backend `server.js`)
Para usar no seu servidor, você pode receber dados de rastreamento do frontend e despachá-los para a API do Meta Graph usando a sua **Chave de API do Meta (Access Token)**.

Primeiro, você precisará de uma biblioteca HTTP como `axios` ou usar `fetch` nativo do Node.js.

```javascript
import crypto from 'crypto';

// Função auxiliar para criptografar em SHA-256 (Exigência do Meta)
const sha256 = (text) => {
  if (!text) return null;
  return crypto.createHash('sha256').update(String(text).trim().toLowerCase()).digest('hex');
};

app.post('/api/pixel/event', async (req, res) => {
  const { eventName, eventSourceUrl, userData, customData } = req.body;
  
  // Variáveis de ambiente configuradas no seu .env da API
  const PIXEL_ID = process.env.META_PIXEL_ID;
  const ACCESS_TOKEN = process.env.META_ACCESS_TOKEN; // Aqui entra a sua chave de desenvolvimento ou produção
  const TEST_EVENT_CODE = process.env.META_TEST_EVENT_CODE; // Código gerado na aba "Eventos de Teste" do Meta

  if (!PIXEL_ID || !ACCESS_TOKEN) {
    return res.status(500).json({ error: 'Configurações do Meta Ads ausentes no servidor.' });
  }

  try {
    const eventPayload = {
      data: [
        {
          event_name: eventName, // Ex: "InitiateCheckout" ou "Purchase"
          event_time: Math.floor(Date.now() / 1000),
          action_source: "website",
          event_source_url: eventSourceUrl || "https://lottus-eight.vercel.app",
          user_data: {
            // Meta exige SHA-256 nestes dados de identificação do cliente
            em: userData?.email ? [sha256(userData.email)] : [],
            ph: userData?.phone ? [sha256(userData.phone)] : [],
            client_ip_address: req.ip,
            client_user_agent: req.headers['user-agent']
          },
          custom_data: {
            value: customData?.value || 0.0,
            currency: "BRL",
            contents: customData?.contents || [] // Array de { id, quantity }
          }
        }
      ]
    };

    // Se estiver em ambiente de testes, adiciona o código de evento de teste
    if (TEST_EVENT_CODE) {
      eventPayload.test_event_code = TEST_EVENT_CODE;
    }

    const response = await fetch(`https://graph.facebook.com/v19.0/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(eventPayload)
    });

    const result = await response.json();
    return res.status(200).json(result);
  } catch (error) {
    console.error('❌ Erro Conversions API:', error);
    return res.status(500).json({ error: 'Falha ao despachar evento para o Meta Ads.' });
  }
});
```

### 🛒 Exemplo 3: Alterando o Frontend para Notificar o Servidor
Edite a função de checkout em seu frontend [CartContext.jsx](file:///C:/Users/vini/Music/Lottus/lottus-app/src/context/CartContext.jsx) para registrar a conversão de checkout no exato momento que o cliente clica para abrir o WhatsApp:

```javascript
const checkout = async () => {
  // 1. Rastrear o evento silenciosamente no servidor (CAPI)
  try {
    const cartContents = cartItems.map(item => ({
      id: item.product.id,
      quantity: item.quantity
    }));

    await fetch(`${import.meta.env.VITE_API_URL}/api/pixel/event`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventName: 'InitiateCheckout',
        eventSourceUrl: window.location.href,
        userData: {
          // Opcional: Se você tiver os dados do formulário do cliente preenchidos antes
          email: '', 
          phone: ''
        },
        customData: {
          value: cartTotal,
          contents: cartContents
        }
      })
    });
  } catch (err) {
    console.warn('Erro ao registrar evento de rastreamento:', err);
  }

  // 2. Redirecionar para o WhatsApp conforme comportamento antigo
  window.open(getWhatsAppLink(), '_blank');
};
```

---

## 🛠️ 5. Resumo de Recomendações e Próximos Passos

1. **Configure as Variáveis de Ambiente:** No seu arquivo `.env` do backend (`api_users`), adicione:
   ```env
   META_PIXEL_ID="SEU_ID_DO_PIXEL"
   META_ACCESS_TOKEN="SUA_CHAVE_DE_DESENVOLVIMENTO_DO_META"
   META_TEST_EVENT_CODE="TESTXXXXX" # Código temporário gerado no Painel do Meta Ads
   ```
2. **Crie a Rota do Feed XML:** A rota `/products/facebook-feed` permitirá que você configure o catálogo no Commerce Manager imediatamente.
3. **Insira a chamada da Conversions API no fluxo do Carrinho:** Assim, toda vez que alguém clicar para falar com você no WhatsApp demonstrando intenção real de compra de produtos específicos, o Facebook saberá exatamente qual produto foi e qual o valor daquela intenção de conversão.

Se precisar de ajuda para codificar ou ativar qualquer uma destas pontes de integração diretamente no código fonte atual, basta me pedir! 🚀
