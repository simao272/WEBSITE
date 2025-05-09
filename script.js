// Usuários
const users = [
    { username: "admin", password: "1234", role: "admin" },
    { username: "user", password: "1234", role: "user" }
];

// Lista de jogos
let games = [
    {
        id: 1,
        name: "Apex Legends SUCK",
        img: "Imagens/apex_imagem.png",
        description: "Apex Legends é um jogo de tiro battle royale onde equipes de lendas competem para ser a última sobrevivente."
    },
    {
        id: 2,
        name: "CS:GO SUCKS",
        img: "Imagens/cs_imagem.png",
        description: "Counter-Strike: Global Offensive é um jogo de tiro tático em equipe onde terroristas e contra-terroristas lutam em missões."
    },
    {
        id: 3,
        name: "Rocket League SUCKS",
        img: "Imagens/rocket_imagem.png",
        description: "Rocket League combina futebol com carros controlados por jogadores em arenas tridimensionais."
    },
    {
        id: 4,
        name: "League of Legends ROCKS",
        img: "Imagens/league_imagem.png",
        description: "League of Legends é um MOBA onde equipes de campeões lutam para destruir a base adversária."
    }
];

// Função de login
function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    
    const storedUsers = JSON.parse(localStorage.getItem("users")) || [
        { username: "admin", password: "1234", role: "admin" },
        { username: "user", password: "1234", role: "user" }
    ];

    const user = storedUsers.find(u => u.username === username && u.password === password);

    if (user) {
        localStorage.setItem("userRole", user.role);
        document.getElementById("login-screen").style.display = "none";
        document.querySelector(".container").style.display = "flex";
        if (user.role === "admin") {
            document.getElementById("menu-sugestoes").style.display = "block";
        }
        loadGames();
    } else {
        alert("Usuário ou senha inválidos");
    }
}

function logout() {
    localStorage.removeItem("userRole");
    location.reload();
}

// Média de avaliações
function calculateAverageRating(ratings) {
    if (ratings.length === 0) return 0;
    const total = ratings.reduce((acc, rating) => acc + rating, 0);
    return total / ratings.length;
}

// Carrega os jogos
function loadGames() {
    const isAdmin = localStorage.getItem("userRole") === "admin";
    const isUser = localStorage.getItem("userRole") === "user";
    const gameList = document.getElementById("game-list");
    gameList.innerHTML = "";

    if (isUser) {
        const addCard = document.createElement("div");
        addCard.className = "game-card add-card";
        addCard.innerHTML = `
            <h2 style="text-align:center">Sugerir Jogo</h2>
            <div style="font-size: 1000%; text-align: center; color: #00ffe1;">+</div>
        `;
        addCard.onclick = openSuggestionForm;
        gameList.appendChild(addCard);
    }

    games.forEach(game => {
        const savedRatings = JSON.parse(localStorage.getItem(`ratings-${game.id}`)) || [];
        const averageRating = calculateAverageRating(savedRatings);

        const gameCard = document.createElement("div");
        gameCard.className = "game-card";
        gameCard.innerHTML = `
            <h2>${game.name}</h2>
            <img src="${game.img}" alt="${game.name}" />
            <div class="note">Nota: ${averageRating.toFixed(1)}</div>
        `;
        gameCard.onclick = () => loadGameDetails(game.id);

        if (isAdmin) {
            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "Excluir Jogo";
            deleteBtn.className = "delete-btn";
            deleteBtn.onclick = (e) => {
                e.stopPropagation();
                deleteGame(game.id);
            };
            gameCard.appendChild(deleteBtn);
        }

        gameList.appendChild(gameCard);
    });
}

// Excluir jogo
function deleteGame(gameId) {
    const index = games.findIndex(g => g.id === gameId);
    if (index !== -1) {
        games.splice(index, 1);
        localStorage.removeItem(`ratings-${gameId}`);
        localStorage.removeItem(`comments-${gameId}`);
        loadGames();
    }
}

// Detalhes do jogo
function loadGameDetails(gameId) {
    const game = games.find(g => g.id === gameId);
    const gameDetails = document.getElementById("game-details");

    const savedRatings = JSON.parse(localStorage.getItem(`ratings-${gameId}`)) || [];
    const averageRating = calculateAverageRating(savedRatings);

    gameDetails.innerHTML = `
        <h2>${game.name}</h2>
        <img src="${game.img}" alt="${game.name}" />
        <p>${game.description}</p>
        <div class="note">Nota: ${averageRating.toFixed(1)}</div>
        <div class="stars" data-id="${game.id}">
            ${[1.0, 2.0, 3.0, 4.0, 5.0].map(i => 
                `<span class="star ${i <= averageRating ? 'selected' : ''}" data-star="${i}">&#9733;</span>`
            ).join('')}
        </div>
        <div class="comment-box">
            <input type="text" placeholder="Deixe um comentário..." data-id="${game.id}" />
        </div>
    `;

    document.getElementById("section-games").style.display = "none";
    document.getElementById("section-search").style.display = "none";
    document.getElementById("section-details").style.display = "block";

    addRatingListeners(gameId);
    addCommentListeners(gameId);
}

// Eventos
function addRatingListeners(gameId) {
    document.querySelectorAll(".stars span").forEach(star => {
        star.onclick = () => {
            const rating = parseFloat(star.dataset.star);
            const savedRatings = JSON.parse(localStorage.getItem(`ratings-${gameId}`)) || [];
            savedRatings.length = 0;
            savedRatings.push(rating);
            localStorage.setItem(`ratings-${gameId}`, JSON.stringify(savedRatings));
            loadGameDetails(gameId);
        };
    });
}

function addCommentListeners(gameId) {
    const input = document.querySelector(`.comment-box input[data-id="${gameId}"]`);
    input.addEventListener("keypress", e => {
        if (e.key === "Enter" && input.value.trim() !== "") {
            const existingComments = JSON.parse(localStorage.getItem(`comments-${gameId}`)) || [];
            existingComments.push(input.value.trim());
            localStorage.setItem(`comments-${gameId}`, JSON.stringify(existingComments));
            input.value = "";
            loadGameDetails(gameId);
        }
    });
}

// Menu Navegação
document.getElementById("menu-inicio").addEventListener("click", e => {
    document.getElementById("section-games").style.display = "block";
    document.getElementById("section-search").style.display = "none";
    document.getElementById("section-details").style.display = "none";
    document.getElementById("section-suggestions").style.display = "none";
    document.getElementById("section-title").innerText = "Galeria de Jogos";
    loadGames();
});

document.getElementById("menu-pesquisa").addEventListener("click", e => {
    document.getElementById("section-games").style.display = "none";
    document.getElementById("section-search").style.display = "block";
    document.getElementById("section-details").style.display = "none";
    document.getElementById("section-suggestions").style.display = "none";
    document.getElementById("section-title").innerText = "Pesquisa de Jogos";
});

document.getElementById("menu-sugestoes").addEventListener("click", () => {
    document.getElementById("section-games").style.display = "none";
    document.getElementById("section-search").style.display = "none";
    document.getElementById("section-details").style.display = "none";
    document.getElementById("section-suggestions").style.display = "block";
    document.getElementById("section-title").innerText = "Sugestões de Jogos";
    loadSuggestions();
});

document.getElementById("search-input").addEventListener("input", e => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredGames = games.filter(game => game.name.toLowerCase().includes(searchTerm));
    
    const searchResults = document.getElementById("search-results");
    searchResults.innerHTML = filteredGames.map(game => `
        <div class="game-card" onclick="loadGameDetails(${game.id})">
            <h2>${game.name}</h2>
            <img src="${game.img}" alt="${game.name}" />
        </div>
    `).join('');
});

// Sugestão de Jogo (Usuário)
function openSuggestionForm() {
    const suggestionForm = document.createElement("div");
    suggestionForm.className = "suggestion-form";
    suggestionForm.innerHTML = `
        <h2 style="color: #ffdd57">Sugerir Novo Jogo</h2>

    <input style="
    background-color:#1e1e2f; 
    border: 2px solid #00ffe1; 
    padding: 10px; 
    border-radius: 12px; 
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.4);
    width: 50%;
    max-width: 80%;
    margin: 1% auto;
    font-family: 'Arial', sans-serif;"    
    type="text" id="newGameName" class="form-input" placeholder="Nome do jogo">

    <input style="
    background-color:#1e1e2f; 
    border: 2px solid #00ffe1; 
    padding: 10px; 
    border-radius: 12px; 
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.4);
    width: 50%;
    max-width: 80%;
    margin: 1% auto;
    font-family: 'Arial', sans-serif;"  
    type="text" id="newGameImg" class="form-input" placeholder="URL da imagem">

    <textarea style="
    background-color:#1e1e2f; 
    border: 2px solid #00ffe1; 
    padding: 5px; 
    border-radius: 12px; 
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.4);
    width: 51%;
    max-width: 100%;
    margin: 1% auto;
    font-family: 'Arial', sans-serif;"  
    id="newGameDesc" class="form-input" placeholder="Descrição do jogo"></textarea>

    <button style="
    color:#FFF;
    background-color:#1e1e2f; 
    border: 2px solid #00ffe1; 
    padding: 10px; 
    border-radius: 12px; 
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.4);
    width: 50%;
    max-width: 80%;
    margin: 5% auto;
    font-family: 'Arial', sans-serif;"  
    class="form-button" onclick="submitSuggestion()">Enviar Sugestão</button>
    `;
    
    const gameList = document.getElementById("game-list");
    gameList.innerHTML = "";  // Limpa a lista de jogos
    gameList.appendChild(suggestionForm);  // Adiciona o formulário sugerido
}

function submitSuggestion() {
    const name = document.getElementById("newGameName").value;
    const img = document.getElementById("newGameImg").value;
    const description = document.getElementById("newGameDesc").value;

    const suggestions = JSON.parse(localStorage.getItem("gameSuggestions")) || [];
    suggestions.push({ name, img, description });
    localStorage.setItem("gameSuggestions", JSON.stringify(suggestions));

    alert("Sugestão enviada com sucesso!");
    loadGames();
}

// Aprovar / Rejeitar Sugestões (Admin)
function loadSuggestions() {
    const suggestions = JSON.parse(localStorage.getItem("gameSuggestions")) || [];
    const suggestionList = document.getElementById("suggestion-list");
    suggestionList.innerHTML = "";

    if (suggestions.length === 0) {
        suggestionList.innerHTML = "<p style='color: white;'>Nenhuma sugestão pendente.</p>";
        return;
    }

    suggestions.forEach((sugg, index) => {
        const card = document.createElement("div");
        card.className = "game-card";
        card.innerHTML = `
            <h2>${sugg.name}</h2>
            <img src="${sugg.img}" alt="${sugg.name}" />
            <p style="color: #ccc; margin-top: 10px;">${sugg.description}</p>
            <div style="margin-top: 10px;">
                <button onclick="approveSuggestion(${index})">Aprovar</button>
                <button onclick="rejectSuggestion(${index})" style="margin-left: 10px;">Rejeitar</button>
            </div>
        `;
        suggestionList.appendChild(card);
    });
}

function approveSuggestion(index) {
    const suggestions = JSON.parse(localStorage.getItem("gameSuggestions")) || [];
    const suggestion = suggestions[index];

    const newId = games.length ? Math.max(...games.map(g => g.id)) + 1 : 1;
    games.push({ id: newId, name: suggestion.name, img: suggestion.img, description: suggestion.description });

    suggestions.splice(index, 1);
    localStorage.setItem("gameSuggestions", JSON.stringify(suggestions));

    alert("Jogo aprovado e adicionado à galeria.");
    loadSuggestions();
    loadGames();
}

function rejectSuggestion(index) {
    const suggestions = JSON.parse(localStorage.getItem("gameSuggestions")) || [];
    suggestions.splice(index, 1);
    localStorage.setItem("gameSuggestions", JSON.stringify(suggestions));

    alert("Sugestão rejeitada.");
    loadSuggestions();
}

// Inicialização
window.onload = function () {
    const role = localStorage.getItem("userRole");
    if (role) {
        document.getElementById("login-screen").style.display = "none";
        document.querySelector(".container").style.display = "flex";
        if (role === "admin") {
            document.getElementById("menu-sugestoes").style.display = "block";
        }
        loadGames();
    }
};

// Função que exibe o formulário de registro
function showRegister() {
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('register-form').style.display = 'block';
}


function showLogin() {
    document.getElementById('register-form').style.display = 'none';
    document.getElementById('login-form').style.display = 'block';
}

function register() {
    const username = document.getElementById("register-username").value;
    const password = document.getElementById("register-password").value;
    const role = document.getElementById("register-role").value;

    if (!username || !password) {
        alert("Preencha todos os campos.");
        return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [
        { username: "admin", password: "1234", role: "admin" },
        { username: "user", password: "1234", role: "user" }
    ];

    if (users.find(u => u.username === username)) {
        alert("Nome de usuário já existe.");
        return;
    }

    // Adiciona o novo usuário
    users.push({ username, password, role });
    localStorage.setItem("users", JSON.stringify(users));

    // Faz o login após o registro
    localStorage.setItem("userRole", role);
    alert("Conta criada com sucesso!");
    
    // Redireciona para a tela principal
    document.getElementById('register-form').style.display = 'none';
    document.querySelector(".container").style.display = "flex";
    loadGames();  // Carrega a lista de jogos
}

