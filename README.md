# Minha Biblioteca — Frontend (React Native + Expo)

App mobile para gerenciar uma lista de livros (título, autor, gênero, status e nota). Consome a API do repositório **biblioteca-api** e implementa um **CRUD completo**:

- **Create** – botão `+` abre o formulário e cadastra o livro
- **Read** – lista com busca por título/autor e pull-to-refresh
- **Update** – toque em um livro para editar
- **Delete** – ícone da lixeira (com confirmação)

## Requisitos
- Node.js 18+
- App **Expo Go** no celular (ou emulador Android/iOS)
- O backend rodando (veja o README do repositório `biblioteca-api`)

## Como rodar
```bash
git clone <URL-DESTE-REPOSITORIO>
cd biblioteca-app
npm install
npx expo start
```
Leia o QR Code com o Expo Go (Android) ou a câmera (iOS). Também é possível pressionar `a` (emulador Android) ou `w` (navegador).

## Configurando o endereço da API
Edite `src/services/api.js` e ajuste `API_URL`:

| Ambiente                | Endereço                               |
|-------------------------|----------------------------------------|
| Emulador Android        | `http://10.0.2.2:3000` (padrão)        |
| iOS Simulator / Web     | `http://localhost:3000` (padrão)       |
| **Celular físico**      | `http://<IP-DO-SEU-PC>:3000`           |

No celular físico, o aparelho e o computador devem estar na **mesma rede Wi-Fi**.

## Estrutura
```
App.js                    # navegação (Stack)
src/services/api.js       # chamadas HTTP à API
src/screens/ListaScreen.js  # listar, buscar, excluir
src/screens/FormScreen.js   # cadastrar e editar
```
