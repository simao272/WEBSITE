<?php
include 'db.php';

header('Content-Type: application/json');

// Verificar se o usuário está autenticado
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(["error" => "Não autenticado"]);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];
$user_id = $_SESSION['user_id'];

switch ($method) {
    case 'GET':
        // Obter avaliações de um jogo
        $game_id = isset($_GET['game_id']) ? (int)$_GET['game_id'] : null;
        
        if (!$game_id) {
            echo json_encode(["error" => "ID do jogo não fornecido"]);
            exit;
        }
        
        // Consulta para obter avaliações com nomes de usuários
        $stmt = $conn->prepare("
            SELECT r.*, u.username 
            FROM ratings r
            JOIN users u ON r.user_id = u.id
            WHERE r.game_id = ?
            ORDER BY r.created_at DESC
        ");
        $stmt->bind_param("i", $game_id);
        $stmt->execute();
        $result = $stmt->get_result();
        
        $ratings = [];
        while ($row = $result->fetch_assoc()) {
            $ratings[] = $row;
        }
        echo json_encode($ratings);
        break;
        
    case 'POST':
        // Adicionar/atualizar avaliação
        $data = json_decode(file_get_contents('php://input'), true);
        $game_id = isset($data['game_id']) ? (int)$data['game_id'] : null;
        $rating = isset($data['rating']) ? (int)$data['rating'] : null;
        $comment = isset($data['comment']) ? $data['comment'] : null;
        
        if (!$game_id) {
            echo json_encode(["success" => false, "error" => "ID do jogo não fornecido"]);
            exit;
        }
        
        // Verificar se o usuário já avaliou este jogo
        $check = $conn->prepare("SELECT id FROM ratings WHERE user_id = ? AND game_id = ?");
        $check->bind_param("ii", $user_id, $game_id);
        $check->execute();
        $checkResult = $check->get_result();
        
        if ($checkResult->num_rows > 0) {
            // Atualizar avaliação existente
            $row = $checkResult->fetch_assoc();
            $rating_id = $row['id'];
            
            // Construir query de atualização com base nos campos fornecidos
            $updateFields = [];
            $updateTypes = "";
            $updateValues = [];
            
            if ($rating !== null) {
                $updateFields[] = "rating = ?";
                $updateTypes .= "i";
                $updateValues[] = $rating;
            }
            
            if ($comment !== null) {
                $updateFields[] = "comment = ?";
                $updateTypes .= "s";
                $updateValues[] = $comment;
            }
            
            if (empty($updateFields)) {
                echo json_encode(["success" => false, "error" => "Nenhum dado para atualizar"]);
                exit;
            }
            
            $updateValues[] = $rating_id;
            $updateQuery = "UPDATE ratings SET " . implode(", ", $updateFields) . " WHERE id = ?";
            
            $stmt = $conn->prepare($updateQuery);
            $stmt->bind_param($updateTypes . "i", ...$updateValues);
        } else {
            // Criar nova avaliação
            if ($rating === null && $comment === null) {
                echo json_encode(["success" => false, "error" => "Avaliação ou comentário deve ser fornecido"]);
                exit;
            }
            
            $stmt = $conn->prepare("INSERT INTO ratings (user_id, game_id, rating, comment) VALUES (?, ?, ?, ?)");
            $stmt->bind_param("iiis", $user_id, $game_id, $rating, $comment);
        }
        
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