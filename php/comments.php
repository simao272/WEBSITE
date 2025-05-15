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
        // Obter comentários de um jogo específico
        if (isset($_GET['game_id'])) {
            $game_id = $_GET['game_id'];
            
            $stmt = $conn->prepare("
                SELECT c.*, u.username 
                FROM comments c
                JOIN users u ON c.user_id = u.id
                WHERE c.game_id = ?
                ORDER BY c.created_at DESC
            ");
            $stmt->bind_param("i", $game_id);
            $stmt->execute();
            $result = $stmt->get_result();
            
            $comments = [];
            while ($row = $result->fetch_assoc()) {
                $comments[] = $row;
            }
            echo json_encode($comments);
        } else {
            // Se não houver ID de jogo, retorna erro
            echo json_encode(["success" => false, "error" => "ID do jogo não especificado"]);
        }
        break;
        
    case 'POST':
        // Adicionar novo comentário
        $data = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($data['game_id']) || !isset($data['comment']) || empty($data['comment'])) {
            echo json_encode(["success" => false, "error" => "Dados incompletos"]);
            exit;
        }
        
        $game_id = $data['game_id'];
        $comment = $data['comment'];
        
        // Verificar se o jogo existe
        $stmt = $conn->prepare("SELECT id FROM games WHERE id = ?");
        $stmt->bind_param("i", $game_id);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows === 0) {
            echo json_encode(["success" => false, "error" => "Jogo não encontrado"]);
            exit;
        }
        
        // Inserir o comentário
        $stmt = $conn->prepare("INSERT INTO comments (game_id, user_id, comment) VALUES (?, ?, ?)");
        $stmt->bind_param("iis", $game_id, $user_id, $comment);
        
        if ($stmt->execute()) {
            echo json_encode([
                "success" => true, 
                "id" => $conn->insert_id,
                "message" => "Comentário adicionado com sucesso!"
            ]);
        } else {
            echo json_encode(["success" => false, "error" => $conn->error]);
        }
        break;
        
    case 'DELETE':
        // Remover comentário (somente o proprietário ou admin pode fazer isso)
        if (!isset($_GET['id'])) {
            echo json_encode(["success" => false, "error" => "ID do comentário não especificado"]);
            exit;
        }
        
        $comment_id = $_GET['id'];
        $user_role = $_SESSION['user_role'];
        
        // Verificar se é o proprietário ou admin
        if ($user_role === 'admin') {
            // Admin pode deletar qualquer comentário
            $stmt = $conn->prepare("DELETE FROM comments WHERE id = ?");
            $stmt->bind_param("i", $comment_id);
        } else {
            // Usuário normal só pode deletar os próprios comentários
            $stmt = $conn->prepare("DELETE FROM comments WHERE id = ? AND user_id = ?");
            $stmt->bind_param("ii", $comment_id, $user_id);
        }
        
        if ($stmt->execute()) {
            if ($stmt->affected_rows > 0) {
                echo json_encode(["success" => true, "message" => "Comentário removido com sucesso"]);
            } else {
                echo json_encode(["success" => false, "error" => "Comentário não encontrado ou sem permissão"]);
            }
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