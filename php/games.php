<?php
include 'db.php';

header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        // Obter lista de jogos
        $result = $conn->query("SELECT * FROM games ORDER BY name ASC");
        $games = [];
        while ($row = $result->fetch_assoc()) {
            $games[] = $row;
        }
        echo json_encode($games);
        break;
        
    case 'POST':
        // Verificar se o usuário está autenticado
        if (!isset($_SESSION['user_id'])) {
            http_response_code(401);
            echo json_encode(["success" => false, "error" => "Não autenticado"]);
            exit;
        }
        
        // Adicionar novo jogo
        $data = json_decode(file_get_contents('php://input'), true);
        $name = $data['name'];
        $img_url = $data['img_url'];
        $description = $data['description'];
        
        $stmt = $conn->prepare("INSERT INTO games (name, img_url, description) VALUES (?, ?, ?)");
        $stmt->bind_param("sss", $name, $img_url, $description);
        
        if ($stmt->execute()) {
            echo json_encode(["success" => true, "id" => $conn->insert_id]);
        } else {
            echo json_encode(["success" => false, "error" => $conn->error]);
        }
        break;
        
    case 'DELETE':
        // Verificar se o usuário é admin
        if (!isset($_SESSION['user_id']) || $_SESSION['user_role'] !== 'admin') {
            http_response_code(403);
            echo json_encode(["success" => false, "error" => "Acesso negado"]);
            exit;
        }
        
        // Remover jogo
        $id = $_GET['id'];
        $stmt = $conn->prepare("DELETE FROM games WHERE id = ?");
        $stmt->bind_param("i", $id);
        
        if ($stmt->execute()) {
            echo json_encode(["success" => true]);
        } else {
            echo json_encode(["success" => false, "error" => $conn->error]);
        }
        break;
        
    default:
        http_response_code(405);
        echo json_encode(["error" => "Método não permitido"]);
}

$conn->close();
?>