// Lista de jogos (será carregada do servidor)
let games = [];

// Função de login
function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);

    fetch("php/login.php", {
        method: "POST",
        body: formData
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            localStorage.setItem("userRole", data.role);
            localStorage.setItem("userId", data.user_id);
            alert("Login bem-sucedido!");
            document.getElementById("login-screen").style.display = "none";
            document.querySelector(".container").style.display = "flex";
            
            if (data.role === "admin") {
                document.getElementById("menu-sugestoes").style.display = "block";
            }
            loadGames();
        } else {
            alert(data.message || "Credenciais inválidas");
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert("Erro ao fazer login");
    });
}

function logout() {
    localStorage.removeItem("userRole");
    localStorage.removeItem("userId");
    window.location.href = "index.html";
}

// Carrega os jogos do servidor
async function loadGames() {
    try {
        const response = await fetch('php/games.php');
        games = await response.json();
        
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

        for (const game of games) {
            const averageRating = await loadGameRatings(game.id);

            const gameCard = document.createElement("div");
            gameCard.className = "game-card";
            gameCard.innerHTML = `
                <h2>${game.name}</h2>
                <img src="${game.img_url}" alt="${game.name}" />
                <div class="note">Nota: ${averageRating.toFixed(1)}</div>
            `;
            gameCard.onclick = () => loadGameDetails(game.id);

            if (isAdmin) {
                const deleteBtn = document.createElement("button");
                deleteBtn.textContent  = "Excluir Jogo";
                deleteBtn.className = "deletebtn";
                deleteBtn.onclick = (e) => {
                    e.stopPropagation();
                    deleteGame(game.id);
                };
                gameCard.appendChild(deleteBtn);

             
deleteBtn.textContent = "Excluir Jogo";
deleteBtn.style.backgroundColor = "#ff3860";
deleteBtn.style.color = "white";
deleteBtn.style.border = "none";
deleteBtn.style.padding = "8px 16px";
deleteBtn.style.borderRadius = "4px";
deleteBtn.style.cursor = "pointer";
deleteBtn.style.fontFamily = "'Arial', sans-serif";
deleteBtn.style.fontSize = "14px";
deleteBtn.style.marginTop = "10px";
deleteBtn.style.transition = "all 0.3s ease";
deleteBtn.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.2)";

// Adiciona eventos para hover
deleteBtn.onmouseover = function() {
    this.style.backgroundColor = "#ff1a4a";
    this.style.transform = "translateY(-2px)";
    this.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.3)";
};

deleteBtn.onmouseout = function() {
    this.style.backgroundColor = "#ff3860";
    this.style.transform = "translateY(0)";
    this.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.2)";
};

deleteBtn.onclick = (e) => {
    e.stopPropagation();
    deleteGame(game.id);
};
            }

            gameList.appendChild(gameCard);
        }
    } catch (error) {
        console.error('Error loading games:', error);
    }
}

// Carrega avaliações do servidor
async function loadGameRatings(gameId) {
    try {
        const response = await fetch(`php/ratings.php?game_id=${gameId}`);
        const ratings = await response.json();
        
        if (ratings.length === 0) return 0;
        const total = ratings.reduce((acc, rating) => acc + rating.rating, 0);
        return total / ratings.length;
    } catch (error) {
        console.error('Error loading ratings:', error);
        return 0;
    }
}

// Excluir jogo do servidor
async function deleteGame(gameId) {
    if (!confirm("Tem certeza que deseja excluir este jogo?")) return;
    
    try {
        const response = await fetch(`php/games.php?id=${gameId}`, {
            method: 'DELETE'
        });
        
        const result = await response.json();
        if (result.success) {
            loadGames();
        } else {
            alert("Erro ao excluir jogo");
        }
    } catch (error) {
        console.error('Error deleting game:', error);
        alert("Erro ao excluir jogo");
    }
}

// Detalhes do jogo
async function loadGameDetails(gameId) {
    const game = games.find(g => g.id == gameId);
    if (!game) return;

    const gameDetails = document.getElementById("game-details");
    const averageRating = await loadGameRatings(gameId);

    // Carrega comentários
    const commentsResponse = await fetch(`php/ratings.php?game_id=${gameId}`);
    const ratings = await commentsResponse.json();
    const comments = ratings.filter(r => r.comment).map(r => r.comment);

    gameDetails.innerHTML = `
        <h2>${game.name}</h2>
        <img src="${game.img_url}" alt="${game.name}" />
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
        ${comments.length > 0 ? `
        <div class="comments-section">
            <h3>Comentários</h3>
            <ul class="comments-list">
                ${comments.map(comment => `<li>${comment}</li>`).join('')}
            </ul>
        </div>
        ` : ''}
    `;

    document.getElementById("section-games").style.display = "none";
    document.getElementById("section-search").style.display = "none";
    document.getElementById("section-details").style.display = "block";

    addRatingListeners(gameId);
    addCommentListeners(gameId);
}

function addRatingListeners(gameId) {
    document.querySelectorAll(".stars span").forEach(star => {
        star.onclick = async () => {
            const rating = parseFloat(star.dataset.star);
            
            try {
                const response = await fetch('php/ratings.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        game_id: gameId,
                        rating: rating
                    })
                });
                
                const result = await response.json();
                if (result.success) {
                    loadGameDetails(gameId);
                } else {
                    alert("Erro ao salvar avaliação");
                }
            } catch (error) {
                console.error('Error saving rating:', error);
                alert("Erro ao salvar avaliação");
            }
        };
    });
}

function addCommentListeners(gameId) {
    const input = document.querySelector(`.comment-box input[data-id="${gameId}"]`);
    input.addEventListener("keypress", async e => {
        if (e.key === "Enter" && input.value.trim() !== "") {
            try {
                const response = await fetch('php/ratings.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        game_id: gameId,
                        comment: input.value.trim()
                    })
                });
                
                const result = await response.json();
                if (result.success) {
                    input.value = "";
                    loadGameDetails(gameId);
                } else {
                    alert("Erro ao salvar comentário");
                }
            } catch (error) {
                console.error('Error saving comment:', error);
                alert("Erro ao salvar comentário");
            }
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
            <img src="${game.img_url}" alt="${game.name}" />
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
                color: #ffffff;
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
        color: #ffffff;
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
        color: #ffffff;
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

async function submitSuggestion() {
    const name = document.getElementById("newGameName").value;
    const img = document.getElementById("newGameImg").value;
    const description = document.getElementById("newGameDesc").value;
    const userId = localStorage.getItem("userId");

    if (!name || !img || !description) {
        alert("Preencha todos os campos!");
        return;
    }

    try {
        const response = await fetch('php/suggestions.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ user_id: userId, name, img_url: img, description })
        });

        const result = await response.json();
        if (result.success) {
            alert("Sugestão enviada com sucesso!");
            loadGames();
        } else {
            alert(result.message || "Erro ao enviar sugestão.");
        }
    } catch (error) {
        console.error('Erro ao enviar sugestão:', error);
        alert("Erro ao enviar sugestão.");
    }
}

// Aprovar / Rejeitar Sugestões (Admin)
async function loadSuggestions() {
    try {
        const response = await fetch('php/suggestions.php');
        const suggestions = await response.json();
        const suggestionList = document.getElementById("suggestion-list");
        suggestionList.innerHTML = "";

        if (suggestions.length === 0) {
            suggestionList.innerHTML = "<p style='color: white;'>Nenhuma sugestão pendente.</p>";
            return;
        }

        suggestions.forEach(sugg => {
            const card = document.createElement("div");
            card.className = "game-card";
            card.innerHTML = `
                <h2>${sugg.name}</h2>
                <img src="${sugg.img_url}" alt="${sugg.name}" />
                <p style="color: #ccc; margin-top: 10px;">${sugg.description}</p>
                <small style="color: gray;">Sugerido por: ${sugg.username}</small>
                <div style="margin-top: 10px;">
                    <button onclick="approveSuggestion(${sugg.id}, '${sugg.name.replace(/'/g, "\\'")}', '${sugg.img_url.replace(/'/g, "\\'")}', \`${sugg.description.replace(/`/g, "\\`")}\`)">Aprovar</button>
                    <button onclick="rejectSuggestion(${sugg.id})" style="margin-left: 10px;">Rejeitar</button>
                </div>
            `;
            suggestionList.appendChild(card);
        });
    } catch (error) {
        console.error('Error loading suggestions:', error);
        alert("Erro ao carregar sugestões");
    }
}

async function approveSuggestion(suggestionId, name, img_url, description) {
    try {
        // Primeiro, adiciona o jogo à tabela games
        const gameResponse = await fetch('php/games.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name,
                img_url: img_url,
                description: description
            })
        });
        
        const gameResult = await gameResponse.json();
        if (!gameResult.success) {
            throw new Error("Erro ao adicionar jogo");
        }
        
        // Depois, remove a sugestão
        const deleteResponse = await fetch(`php/suggestions.php?id=${suggestionId}`, {
            method: 'DELETE'
        });
        
        const deleteResult = await deleteResponse.json();
        if (deleteResult.success) {
            alert("Sugestão aprovada com sucesso!");
            loadSuggestions();
            loadGames();
        } else {
            alert("Erro ao remover sugestão após aprovação");
        }
    } catch (error) {
        console.error('Error approving suggestion:', error);
        alert("Erro ao aprovar sugestão");
    }
}

async function rejectSuggestion(suggestionId) {
    try {
        const response = await fetch(`php/suggestions.php?id=${suggestionId}`, {
            method: 'DELETE'
        });
        
        const result = await response.json();
        if (result.success) {
            alert("Sugestão rejeitada com sucesso!");
            loadSuggestions();
        } else {
            alert("Erro ao rejeitar sugestão");
        }
    } catch (error) {
        console.error('Error rejecting suggestion:', error);
        alert("Erro ao rejeitar sugestão");
    }
}

// Inicialização
window.onload = async function () {
    const role = localStorage.getItem("userRole");
    if (role) {
        document.getElementById("login-screen").style.display = "none";
        document.querySelector(".container").style.display = "flex";
        if (role === "admin") {
            document.getElementById("menu-sugestoes").style.display = "block";
        }
        await loadGames();
    }
};

// Funções auxiliares para registro (mantidas para compatibilidade)
function showRegister() {
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('register-form').style.display = 'block';
}

function showLogin() {
    document.getElementById('register-form').style.display = 'none';
    document.getElementById('login-form').style.display = 'block';
}