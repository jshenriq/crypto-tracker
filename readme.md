# Crypto Tracker - CoinGecko API

<div align="center">
  <p>
    <a href="#portuguese">Leia em Português</a> • 
    <a href="#english">Read in English</a> •
    <!-- <a href="#"><strong>VER DEMO AO VIVO</strong></a> -->
  </p>
</div>

---

<div id="portuguese"></div>

## 🇧🇷 Português

Aplicação web para acompanhar preços de criptomoedas em tempo real, consumindo a API da CoinGecko.

### Tecnologias
- **Backend:** Node.js & Express
- **HTTP Client:** Axios
- **View Engine:** EJS
- **Segurança:** Rate Limiting

### Funcionalidades
- Consulta de preços em tempo real
- Market Cap e Volume 24h
- Lista de favoritos persistida no localStorage
- Rate Limiting para proteção da API

### Como rodar
1. Clone o repositório
2. Rode `npm install`
3. Configure o `.env` com sua chave da CoinGecko:
```env
CG_API_KEY=sua_chave_aqui
```
4. Run `node --watch index.js`

---
<br>
<br>

<div id="english"></div>

## 🇺🇸 English

Web app to track cryptocurrency prices in real time using the CoinGecko API.

### Tech Stack
- **Backend:** Node.js & Express
- **HTTP Client:** Axios
- **View Engine:** EJS
- **Security:** Rate Limiting

### Features
- Real-time price tracking
- Market Cap and 24h Volume
- Favorites list persisted in localStorage
- Rate Limiting to protect API usage

### How to run
1. Clone the repository
2. Run `npm install`
3. Set up `.env` with your CoinGecko key:
```env
CG_API_KEY=your_key_here
```
4. Run `node --watch index.js`

---