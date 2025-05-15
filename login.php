<?php
include 'db.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Método não permitido"]);
    exit;
}

$username = $_POST['username'];
$password = $_POST['password'];

// Validação básica
if (empty($username) || empty($password)) {
    echo json_encode(["success" => false, "message" => "Preencha todos os campos"]);
    exit;
}

// Em produção, utilize password_hash() e password_verify() para senhas
$stmt = $conn->prepare("SELECT id, role FROM users WHERE username = ? AND password = ?");
$stmt->bind_param("ss", $username, $password);
$stmt->execute();
$result = $stmt->get_result();

if ($user = $result->fetch_assoc()) {
    $_SESSION['user_id'] = $user['id'];
    $_SESSION['user_role'] = $user['role'];
    $_SESSION['username'] = $username;
    
    echo json_encode([
        "success" => true, 
        "role" => $user['role'], 
        "user_id" => $user['id'],
        "username" => $username
    ]);
} else {
    echo json_encode(["success" => false, "message" => "Usuário ou senha inválidos"]);
}

$conn->close();
?>