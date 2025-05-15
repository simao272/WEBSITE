<?php
include 'db.php';

// Verificar se o usuário está logado
if (isset($_SESSION['user_id'])) {
    // Destruir a sessão
    session_destroy();
    echo json_encode(["success" => true, "message" => "Logout bem-sucedido"]);
} else {
    echo json_encode(["success" => false, "message" => "Nenhuma sessão ativa"]);
}
?>