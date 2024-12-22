// Funções para gerenciamento de serviços
async function carregarServicos() {
    try {
        const response = await fetch('../servicos.json');
        const servicos = await response.json();
        exibirServicos(servicos);
    } catch (error) {
        console.error('Erro ao carregar serviços:', error);
        alert('Erro ao carregar serviços');
    }
}

function exibirServicos(servicos) {
    const grid = document.getElementById('servicosGrid');
    grid.innerHTML = '';

    servicos.forEach((servico, index) => {
        const card = document.createElement('div');
        card.className = 'servico-card';
        card.innerHTML = `
            <h3>${servico.nome}</h3>
            <p>${servico.descricao}</p>
            <p>WhatsApp: ${servico.whatsapp}</p>
            <div class="servico-acoes">
                <button onclick="editarServico(${index})">Editar</button>
                <button onclick="excluirServico(${index})" class="btn-danger">Excluir</button>
            </div>
        `;
        grid.appendChild(card);
    });
}

async function salvarServico(event) {
    event.preventDefault();
    
    const servicoData = {
        nome: document.getElementById('nome').value,
        descricao: document.getElementById('descricao').value,
        detalhes: document.getElementById('detalhes').value,
        whatsapp: document.getElementById('whatsapp').value,
        imagem: '' // Será atualizado se houver upload
    };

    try {
        // Carregar serviços existentes
        const response = await fetch('../servicos.json');
        let servicos = await response.json();

        // Adicionar novo serviço
        const id = document.getElementById('servicoId').value;
        if (id) {
            // Editando serviço existente
            servicos[id] = servicoData;
        } else {
            // Novo serviço
            servicos.push(servicoData);
        }

        // Salvar arquivo atualizado
        await salvarArquivoJson(servicos);

        alert('Serviço salvo com sucesso!');
        fecharModal();
        carregarServicos();
    } catch (error) {
        console.error('Erro ao salvar serviço:', error);
        alert('Erro ao salvar serviço');
    }
}

async function salvarArquivoJson(dados) {
    try {
        const response = await fetch('../api/salvar_servicos.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dados)
        });

        if (!response.ok) {
            throw new Error('Erro ao salvar arquivo');
        }

        return await response.json();
    } catch (error) {
        throw new Error('Erro ao salvar arquivo: ' + error.message);
    }
}

function abrirModalNovoServico() {
    document.getElementById('modalTitle').textContent = 'Novo Anúncio';
    document.getElementById('servicoForm').reset();
    document.getElementById('servicoId').value = '';
    document.getElementById('servicoModal').style.display = 'block';
}

function editarServico(index) {
    document.getElementById('modalTitle').textContent = 'Editar Anúncio';
    document.getElementById('servicoId').value = index;
    
    // Carregar dados do serviço no formulário
    fetch('../servicos.json')
        .then(response => response.json())
        .then(servicos => {
            const servico = servicos[index];
            document.getElementById('nome').value = servico.nome;
            document.getElementById('descricao').value = servico.descricao;
            document.getElementById('detalhes').value = servico.detalhes || '';
            document.getElementById('whatsapp').value = servico.whatsapp;
        });

    document.getElementById('servicoModal').style.display = 'block';
}

async function excluirServico(index) {
    if (confirm('Tem certeza que deseja excluir este anúncio?')) {
        try {
            const response = await fetch('../servicos.json');
            let servicos = await response.json();
            
            servicos.splice(index, 1);
            await salvarArquivoJson(servicos);
            
            alert('Serviço excluído com sucesso!');
            carregarServicos();
        } catch (error) {
            console.error('Erro ao excluir serviço:', error);
            alert('Erro ao excluir serviço');
        }
    }
}

function fecharModal() {
    document.getElementById('servicoModal').style.display = 'none';
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    carregarServicos();
    document.getElementById('servicoForm').addEventListener('submit', salvarServico);
});

// Fechar modal quando clicar fora dele
window.onclick = function(event) {
    const modal = document.getElementById('servicoModal');
    if (event.target === modal) {
        fecharModal();
    }
}

