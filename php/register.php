<?php
include 'db.php';

$username = $_POST['username'];
$password = $_POST['password'];
$role = 'user';

// Verifica se já existe
$stmt = $conn->prepare("SELECT id FROM users WHERE username = ?");
$stmt->bind_param("s", $username);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows > 0) {
    echo "Usuário já existe";
} else {
    $stmt = $conn->prepare("INSERT INTO users (username, password, role) VALUES (?, ?, ?)");
    $stmt->bind_param("sss", $username, $password, $role);
    if ($stmt->execute()) {
        echo "Conta criada com sucesso";
    } else {
        echo "Erro ao criar conta";
    }
}
$conn->close();
?>
