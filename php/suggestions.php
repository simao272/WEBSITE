<?php
require 'db.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Verifica se o usuário está logado
    if (!isset($_SESSION['user_id'])) {
        echo json_encode(["success" => false, "message" => "Usuário não autenticado"]);
        exit;
    }

    $data = json_decode(file_get_contents("php://input"), true);

    $user_id = intval($_SESSION['user_id']); // Pega o ID da sessão
    $name = trim($data['name'] ?? '');
    $img_url = trim($data['img_url'] ?? '');
    $description = trim($data['description'] ?? '');

    if (empty($name) || empty($img_url) || empty($description)) {
        echo json_encode(["success" => false, "message" => "Todos os campos são obrigatórios"]);
        exit;
    }

    try {
        $stmt = $conn->prepare("INSERT INTO suggestions (user_id, name, img_url, description) VALUES (?, ?, ?, ?)");
        $stmt->bind_param("isss", $user_id, $name, $img_url, $description);
        
        if ($stmt->execute()) {
            echo json_encode(["success" => true, "message" => "Sugestão enviada com sucesso"]);
        } else {
            echo json_encode(["success" => false, "message" => "Erro ao enviar sugestão"]);
        }
    } catch (Exception $e) {
        echo json_encode(["success" => false, "message" => "Erro no servidor: " . $e->getMessage()]);
    }

} elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $result = $conn->query("SELECT s.*, u.username FROM suggestions s JOIN users u ON s.user_id = u.id ORDER BY s.created_at DESC");
        $rows = [];
        while ($row = $result->fetch_assoc()) {
            $rows[] = $row;
        }
        echo json_encode($rows);
    } catch (Exception $e) {
        echo json_encode(["success" => false, "message" => "Erro ao buscar sugestões"]);
    }

} elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    // Verifica se o usuário é admin
    if (!isset($_SESSION['user_id']) || $_SESSION['user_role'] !== 'admin') {
        echo json_encode(["success" => false, "message" => "Acesso não autorizado"]);
        exit;
    }

    $id = intval($_GET['id'] ?? 0);
    if ($id) {
        try {
            // Admin pode deletar qualquer sugestão
            $stmt = $conn->prepare("DELETE FROM suggestions WHERE id = ?");
            $stmt->bind_param("i", $id);
            $stmt->execute();
            
            if ($stmt->affected_rows > 0) {
                echo json_encode(["success" => true]);
            } else {
                echo json_encode(["success" => false, "message" => "Sugestão não encontrada"]);
            }
        } catch (Exception $e) {
            echo json_encode(["success" => false, "message" => "Erro ao deletar sugestão"]);
        }
    } else {
        echo json_encode(["success" => false, "message" => "ID inválido"]);
    }
}
?>