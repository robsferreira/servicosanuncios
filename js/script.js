// Atualizar ano do rodapé
const currentYear = new Date().getFullYear();
const footer = document.querySelector('footer p');
footer.innerHTML = `&copy; ${currentYear} Link Regional. Todos os direitos reservados.`;

// Função para carregar os serviços
async function carregarServicos() {
    try {
        const response = await fetch('servicos.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const servicos = await response.json();
        const container = document.getElementById('servicos-container');
        
        // Limpa o container antes de adicionar novos serviços
        container.innerHTML = '';

        servicos.forEach(servico => {
            const card = document.createElement('div');
            card.className = 'servico-card';

            const imagemUrl = servico.imagem || '/api/placeholder/300/200';
            
            card.innerHTML = `
                <img src="${imagemUrl}" alt="${servico.nome}" class="servico-imagem">
                <div class="servico-conteudo">
                    <h3 class="servico-titulo">${servico.nome}</h3>
                    <p class="servico-descricao">${servico.descricao}</p>
                    ${servico.detalhes ? `<p class="servico-detalhes">${servico.detalhes}</p>` : ''}
                    ${servico.whatsapp !== '+55' ? `
                        <a href="https://wa.me/${servico.whatsapp}" class="btn-whatsapp" target="_blank">
                            Contatar via WhatsApp
                        </a>
                    ` : ''}
                </div>
            `;

            container.appendChild(card);
        });
    } catch (error) {
        console.error('Erro ao carregar serviços:', error);
        document.getElementById('servicos-container').innerHTML = `
            <p style="text-align: center; color: red;">
                Erro ao carregar os serviços. Por favor, tente novamente mais tarde.
            </p>
        `;
    }
}

// Carregar serviços quando a página for carregada
document.addEventListener('DOMContentLoaded', carregarServicos);

// Adicionar log para debug
console.log('Script de carregamento de serviços iniciado');