<?php
include 'db.php';

$username = $_POST['username'];
$password = $_POST['password'];

$stmt = $conn->prepare("SELECT role FROM users WHERE username = ? AND password = ?");
$stmt->bind_param("ss", $username, $password);
$stmt->execute();
$result = $stmt->get_result();

if ($user = $result->fetch_assoc()) {
    echo json_encode(["success" => true, "role" => $user['role']]);
} else {
    echo json_encode(["success" => false]);
}

$conn->close();
?>
