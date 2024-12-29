<?php
header('Content-Type: application/json; charset=utf-8');

try {
    // Receber os dados JSON
    $dados = json_decode(file_get_contents('php://input'), true);
    
    if ($dados === null) {
        throw new Exception('Dados JSON inválidos');
    }
    
    // Caminho do arquivo servicos.json
    $arquivo = '../servicos.json';
    
    // Salvar os dados no arquivo
    if (file_put_contents($arquivo, json_encode($dados, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE))) {
        echo json_encode(['success' => true, 'message' => 'Dados salvos com sucesso']);
    } else {
        throw new Exception('Erro ao salvar arquivo');
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}