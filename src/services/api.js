import { Platform } from 'react-native';

// IMPORTANTE: troque pelo IP da sua máquina quando testar no celular físico.
// Ex.: 'http://192.168.0.10:3000'
// Emulador Android usa 10.0.2.2; iOS simulator e web usam localhost.
const HOST_PADRAO = Platform.OS === 'android' ? 'http://10.0.2.2:3000' : 'http://localhost:3000';
export const API_URL = HOST_PADRAO;

async function request(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.erro || 'Erro na requisição');
  return data;
}

export const listarLivros = (busca = '') =>
  request(`/livros${busca ? `?busca=${encodeURIComponent(busca)}` : ''}`);
export const criarLivro = (livro) =>
  request('/livros', { method: 'POST', body: JSON.stringify(livro) });
export const editarLivro = (id, livro) =>
  request(`/livros/${id}`, { method: 'PUT', body: JSON.stringify(livro) });
export const excluirLivro = (id) => request(`/livros/${id}`, { method: 'DELETE' });
