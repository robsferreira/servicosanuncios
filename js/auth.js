document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('../api/auth.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (data.success) {
            // Salvar token de autenticação
            localStorage.setItem('authToken', data.token);
            window.location.href = 'dashboard.html';
        } else {
            alert('Usuário ou senha inválidos');
        }
    } catch (error) {
        console.error('Erro no login:', error);
        alert('Erro ao fazer login');
    }
});