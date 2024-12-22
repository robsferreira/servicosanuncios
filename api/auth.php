<?php
header('Content-Type: application/json');

// Configurações
require_once 'config.php';

// Recebe dados do POST
$data = json_decode(file_get_contents('php://input'), true);
$username = $data['username'] ?? '';
$password = $data['password'] ?? '';

// Verificar credenciais (exemplo simples - deve ser melhorado para produção)
if ($username === ADMIN_USER && password_verify($password, ADMIN_PASS_HASH)) {
    // Gerar token JWT
    $token = generateJWT([
        'user' => $username,
        'exp' => time() + (60 * 60) // 1 hora
    ]);

    echo json_encode([
        'success' => true,
        'token' => $token
    ]);
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Credenciais inválidas'
    ]);
}