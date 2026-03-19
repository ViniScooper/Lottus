const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const getToken = () => localStorage.getItem('lottus_adm_token');
export const setToken = (token) => localStorage.setItem('lottus_adm_token', token);
export const removeToken = () => localStorage.removeItem('lottus_adm_token');
export const isAuthenticated = () => !!getToken();

const authHeader = () => ({ Authorization: `Bearer ${getToken()}` });

// UPLOAD DE IMAGEM
export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('image', file);
  const res = await fetch(`${BASE_URL}/upload`, {
    method: 'POST',
    headers: authHeader(), // SEM Content-Type — o browser define boundary do multipart
    body: formData
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Erro no upload');
  return data.url; // ex: /uploads/1234567-img.jpg
};

// AUTH
export const login = async (email, password) => {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Erro ao fazer login');
  return data;
};

export const register = async (email, name, password) => {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, name, password })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Erro ao registrar');
  return data;
};

// PRODUCTS
export const getProducts = async (all = false) => {
  const url = all ? `${BASE_URL}/products?all=true` : `${BASE_URL}/products`;
  const res = await fetch(url);
  return res.json();
};

export const createProduct = async (product) => {
  const res = await fetch(`${BASE_URL}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify(product)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  return data;
};

export const updateProduct = async (id, product) => {
  const res = await fetch(`${BASE_URL}/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify(product)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  return data;
};

export const deleteProduct = async (id) => {
  const res = await fetch(`${BASE_URL}/products/${id}`, {
    method: 'DELETE',
    headers: authHeader()
  });
  if (!res.ok) throw new Error('Erro ao deletar produto');
};

// Alterna destaque na Home (Vitrine) — usa o PATCH dedicado
export const setProductFeatured = async (id, featured) => {
  const res = await fetch(`${BASE_URL}/products/${id}/featured`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify({ featured })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Erro ao atualizar destaque');
  return data;
};

// POSTS
export const getPosts = async (publishedOnly = false) => {
  const url = publishedOnly ? `${BASE_URL}/posts?published=true` : `${BASE_URL}/posts`;
  const res = await fetch(url);
  return res.json();
};

export const createPost = async (post) => {
  const res = await fetch(`${BASE_URL}/posts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify(post)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  return data;
};

export const updatePost = async (id, post) => {
  const res = await fetch(`${BASE_URL}/posts/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify(post)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  return data;
};

export const deletePost = async (id) => {
  const res = await fetch(`${BASE_URL}/posts/${id}`, {
    method: 'DELETE',
    headers: authHeader()
  });
  if (!res.ok) throw new Error('Erro ao deletar post');
};

// SITE CONFIG
export const getConfig = async () => {
  const res = await fetch(`${BASE_URL}/config`);
  return res.json();
};

export const updateConfig = async (configObject) => {
  const res = await fetch(`${BASE_URL}/config`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify(configObject)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  return data;
};
