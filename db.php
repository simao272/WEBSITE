<?php
$host = "localhost";
$user = "root";
$pass = ""; // tua senha
$dbname = "website";

$conn = new mysqli($host, $user, $pass, $dbname);

if ($conn->connect_error) {
    die("Erro na conexão: " . $conn->connect_error);
}

// Inicia a sessão em todos os arquivos PHP que usam conexão
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}
?>