<?php
// Configurações de segurança
define('ADMIN_USER', 'Robson'); // Altere para o nome de usuário desejado
define('ADMIN_PASS_HASH', password_hash('Batman@1979', PASSWORD_DEFAULT)); // Altere 'sua_senha_aqui'
define('JWT_SECRET', '5d41402abc4b2a76b9719d911017c592'); // Altere para uma chave secreta forte

// Configurações de upload
define('MAX_FILE_SIZE', 5 * 1024 * 1024); // 5MB em bytes
define('ALLOWED_EXTENSIONS', ['jpg', 'jpeg', 'png', 'gif']);

// Configurações de tempo
define('TOKEN_EXPIRATION', 60 * 60); // 1 hora em segundos

// Função para verificar token JWT
function verificarToken() {
    $headers = getallheaders();
    $token = $headers['Authorization'] ?? '';
    
    if (empty($token)) {
        header('HTTP/1.0 401 Unauthorized');
        die(json_encode(['error' => 'Token não fornecido']));
    }
    
    try {
        $token = str_replace('Bearer ', '', $token);
        $decoded = jwt_decode($token, JWT_SECRET);
        
        if ($decoded['exp'] < time()) {
            header('HTTP/1.0 401 Unauthorized');
            die(json_encode(['error' => 'Token expirado']));
        }
    } catch (Exception $e) {
        header('HTTP/1.0 401 Unauthorized');
        die(json_encode(['error' => 'Token inválido']));
    }
}

// Função para gerar token JWT
function generateJWT($payload) {
    $header = json_encode(['typ' => 'JWT', 'alg' => 'HS256']);
    $header = base64_encode($header);
    
    $payload = json_encode($payload);
    $payload = base64_encode($payload);
    
    $signature = hash_hmac('sha256', "$header.$payload", JWT_SECRET, true);
    $signature = base64_encode($signature);
    
    return "$header.$payload.$signature";
}

// Função para decodificar token JWT
function jwt_decode($token, $secret) {
    $parts = explode('.', $token);
    if (count($parts) != 3) {
        throw new Exception('Token malformado');
    }
    
    list($header, $payload, $signature) = $parts;
    
    $valid = hash_hmac('sha256', "$header.$payload", $secret, true);
    $valid = base64_encode($valid);
    
    if ($signature !== $valid) {
        throw new Exception('Assinatura inválida');
    }
    
    return json_decode(base64_decode($payload), true);
}

// Função auxiliar para limpar strings
function sanitize_input($data) {
    return htmlspecialchars(strip_tags(trim($data)));
}

// Configurar headers para CORS se necessário
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Authorization, Content-Type');