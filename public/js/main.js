const form = document.getElementById("searchForm");
const card = document.querySelector(".card");
const favoriteBtn = document.getElementById("favoriteStar");
const favList = document.getElementById("favList");
const emptyMsg = document.getElementById("emptyFavMessage");

// -----------------------------
// AO CARREGAR A PÁGINA
// -----------------------------
document.addEventListener("DOMContentLoaded", () => {
    restoreFavorites();
    updateFavoriteStar();
});

// -----------------------------
// BUSCA DE MOEDA
// -----------------------------
form.addEventListener("submit", (e) => {
    e.preventDefault();
    const coinName = document.getElementById("searchInput").value.trim();
    if (!coinName) return;

    favoriteBtn.classList.remove("active");
    updateCoin(coinName);
});

async function updateCoin(name) {
    card.classList.add("updating");
    setTimeout(() => card.classList.remove("updating"), 600);
    hideError();

    try {
        const req = await fetch(`/api/coin?name=${encodeURIComponent(name)}`);
        const result = await req.json();

        if (!result.success) {
            showError(result.message);
            return;
        }

        const coin = result.data;

        // atualiza os data-attributes do card
        card.dataset.coinId = coin.id;
        card.dataset.coinName = coin.name;
        card.dataset.largeImg = coin.image.large;

        const logo = document.querySelector(".coin-logo");
        logo.src = coin.image.large;
        logo.dataset.largeImg = coin.image.large;

        document.querySelector(".info h2").textContent = coin.name;
        document.querySelector(".info span").textContent = coin.symbol.toUpperCase();

        const price = coin.market_data.current_price.usd;
        const change = coin.market_data.price_change_percentage_24h;
        const isNeg = change < 0;
        //toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 8 })
        document.querySelector(".price").innerHTML = `
            $${price.toLocaleString()} 
            <span class="price-change ${isNeg ? "negative" : "positive"}">
                <i class="fa-solid ${isNeg ? "fa-arrow-down" : "fa-arrow-up"}"></i>
                ${Math.abs(change).toFixed(2)}%
            </span>
        `;

        document.querySelector(".details div:nth-child(1) p:last-child").textContent =
            "US$" + coin.market_data.market_cap.usd.toLocaleString();

        document.querySelector(".details div:nth-child(2) p:last-child").textContent =
            "US$" + coin.market_data.total_volume.usd.toLocaleString();

        updateFavoriteStar();
    } catch (e) {
        console.error(e);
        showError("Erro ao buscar dados. Tente novamente.");
    }
}

// -----------------------------
// PEGAR DADOS ATUAIS DO CARD
// -----------------------------
function getCurrentCoinData() {
    const cardEl = document.querySelector(".card");
    const logo = document.querySelector(".coin-logo");

    if (!cardEl || !logo) return null;

    return {
        id: cardEl.dataset.coinId || "unknown",
        name: cardEl.dataset.coinName || document.querySelector(".info h2")?.textContent || "Unknown",
        symbol: document.querySelector(".info span")?.textContent?.toUpperCase() || "",
        largeImg: cardEl.dataset.largeImg || logo.src || "",
        price: document.querySelector(".price")?.childNodes[0]?.textContent?.trim() || "$0",
        change24h: document.querySelector(".price-change")?.textContent?.trim() || "0%",
        volume: document.querySelector(".details div:nth-child(2) p:last-child")?.textContent || "US$0",
        marketcap: document.querySelector(".details div:nth-child(1) p:last-child")?.textContent || "US$0"
    };
}

// -----------------------------
// FAVORITAR / DESFAVORITAR
// -----------------------------
favoriteBtn.addEventListener("click", async () => {
    const current = getCurrentCoinData();
    if (!current || !current.id || current.id === "unknown") return;

    const favorites = getFavorites();

    if (favoriteBtn.classList.contains("active")) {
        // REMOVER
        removeFromFavorites(current.id);
        favoriteBtn.classList.remove("active");
    } else {
        // ADICIONAR
        if (favorites.length >= 5) {
            alert("Limite de 5 favoritos atingido! Remova um para adicionar outro.");
            return;
        }

        if (favorites.some(f => f.id === current.id)) return;

        const favoriteCoin = {
            id: current.id,
            name: current.name,
            symbol: current.symbol,
            largeImg: current.largeImg
        };

        favorites.push(favoriteCoin);
        localStorage.setItem("favorites", JSON.stringify(favorites));

        renderFavoriteRow({
            id: favoriteCoin.id,
            name: favoriteCoin.name,
            symbol: favoriteCoin.symbol,
            img: favoriteCoin.largeImg,
            price: current.price,
            change24h: current.change24h,
            volume: current.volume,
            marketcap: current.marketcap
        });

        emptyMsg.style.display = "none";
        favoriteBtn.classList.add("active");
    }
});

// -----------------------------
// FUNÇÕES DE FAVORITOS
// -----------------------------
function getFavorites() {
    return JSON.parse(localStorage.getItem("favorites")) || [];
}

function removeFromFavorites(id) {
    let favorites = getFavorites();
    favorites = favorites.filter(f => f.id !== id);
    localStorage.setItem("favorites", JSON.stringify(favorites));

    const row = document.getElementById("fav-" + id);
    if (row) row.remove();

    if (favList.children.length === 0) {
        emptyMsg.style.display = "block";
    }

    updateFavoriteStar();
}

// -----------------------------
// RENDERIZAR LINHA DE FAVORITO
// -----------------------------
function renderFavoriteRow(coin) {
    const rowId = "fav-" + coin.id;
    if (document.getElementById(rowId)) return;

    const template = document.getElementById("fav-row-template");
    const row = template.content.cloneNode(true).querySelector("tr");

    row.id = rowId;

    // Preenche os dados
    row.querySelector(".fav-coin-img").src = coin.img;
    row.querySelector(".fav-coin-img").alt = coin.name;
    row.querySelector(".fav-coin-img").onerror = function () {
        this.src = 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@master/32x32/generic.png';
    };

    row.querySelector(".coin-name").textContent = coin.name;
    row.querySelector(".coin-symbol").textContent = coin.symbol;
    row.querySelector(".price-cell").textContent = coin.price;

    const isNegative = coin.change24h.includes("-") || parseFloat(coin.change24h) < 0;
    const icon = row.querySelector(".change-cell i");
    icon.className = "fa-solid " + (isNegative ? "fa-arrow-down" : "fa-arrow-up");

    row.querySelector(".change-cell span").textContent = coin.change24h.replace(/[▼▲-]/g, "").trim();

    const changeCell = row.querySelector(".change-cell");
    changeCell.className = `change-cell price-change ${isNegative ? "negative" : "positive"}`;

    row.querySelector(".volume-cell").textContent = coin.volume;
    row.querySelector(".marketcap-cell").textContent = coin.marketcap;

    // Botão de remover
    row.querySelector(".remove-fav").dataset.id = coin.id;
    row.querySelector(".remove-fav").addEventListener("click", () => {
        removeFromFavorites(coin.id);
    });

    favList.appendChild(row);
}

// -----------------------------
// RESTAURAR FAVORITOS 
// -----------------------------
async function restoreFavorites() {
    const favorites = getFavorites();
    console.log(favorites);
    if (favorites.length === 0) {
        emptyMsg.style.display = "block";
        return;
    }

    const ids = favorites.map(f => f.id).filter(Boolean).join(",");
    if (!ids) {
        emptyMsg.style.display = "block";
        return;
    }

    try {
        const response = await fetch(`/api/favorites?list=${ids}`);
        const result = await response.json();

        if (!result.success || !result.data || result.data.length === 0) {
            emptyMsg.style.display = "block";
            return;
        }

        emptyMsg.style.display = "none";
        favList.innerHTML = "";

        const coinMap = result.data.reduce((acc, c) => {
            acc[c.id] = c;
            return acc;
        }, {});

        for (const fav of favorites) {
            const apiCoin = coinMap[fav.id];  

            if (!apiCoin) continue;

            renderFavoriteRow({
                id: fav.id,
                name: fav.name,
                symbol: fav.symbol,
                img: fav.largeImg,
                price: "$" + Number(apiCoin.current_price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 8 }),
                change24h: apiCoin.price_change_percentage_24h.toFixed(2) + "%",
                volume: "US$" + Number(apiCoin.total_volume).toLocaleString(),
                marketcap: "US$" + Number(apiCoin.market_cap).toLocaleString()
            });
        }
    } catch (err) {
        console.error("Erro ao restaurar favoritos:", err);
        emptyMsg.style.display = "block";
    }
}

// -----------------------------
// ATUALIZAR ESTRELA
// -----------------------------
function updateFavoriteStar() {
    const current = getCurrentCoinData();
    if (!current || !current.id) {
        favoriteBtn.classList.remove("active");
        return;
    }

    const favorites = getFavorites();
    const isFav = favorites.some(f => f.id === current.id);

    favoriteBtn.classList.toggle("active", isFav);
}

// -----------------------------
// MSG DE ERRO
// -----------------------------
function showError(msg) {
    const errorBox = document.querySelector(".card-error");
    const errorMsg = document.querySelector(".error-message");

    errorMsg.textContent = msg; 
    errorBox.classList.remove("hidden");

}

function hideError() {
    const errorBox = document.querySelector(".card-error");
    errorBox.classList.add("hidden");
}

document.querySelector(".close-error").addEventListener("click", hideError);