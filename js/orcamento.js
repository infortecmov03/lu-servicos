// Validação e envio do formulário de orçamento
document.addEventListener('DOMContentLoaded', () => {
    const orcamentoForm = document.getElementById('orcamentoForm');
    
    if (orcamentoForm) {
        orcamentoForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = orcamentoForm.querySelector('.btn-submit');
            const originalText = submitBtn.innerHTML;
            
            // Validar telefone
            const telefone = document.getElementById('telefone').value;
            if (!validarTelefone(telefone)) {
                alert('Por favor, insira um número de telefone válido (ex: +258 84 574 6227)');
                return;
            }
            
            // Validar email
            const email = document.getElementById('email').value;
            if (!validarEmail(email)) {
                alert('Por favor, insira um email válido');
                return;
            }
            
            // Mostrar loading
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Gerando orçamento...';
            submitBtn.disabled = true;
            
            try {
                // Simular processamento
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                // Gerar preview do orçamento
                previewOrcamento();
                
                // Resetar botão
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                
            } catch (error) {
                console.error('Erro:', error);
                alert('Ocorreu um erro ao gerar o orçamento. Tente novamente.');
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
    }
    
    // Máscara para telefone
    const telefoneInput = document.getElementById('telefone');
    if (telefoneInput) {
        telefoneInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 12) value = value.slice(0, 12);
            
            if (value.length > 0) {
                if (value.length <= 2) {
                    value = `+${value}`;
                } else if (value.length <= 5) {
                    value = `+${value.slice(0,2)} ${value.slice(2)}`;
                } else if (value.length <= 8) {
                    value = `+${value.slice(0,2)} ${value.slice(2,5)} ${value.slice(5)}`;
                } else {
                    value = `+${value.slice(0,2)} ${value.slice(2,5)} ${value.slice(5,8)} ${value.slice(8)}`;
                }
            }
            e.target.value = value;
        });
    }
    
    // Fechar modal com ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            fecharModal();
        }
    });
    
    // Fechar modal clicando fora
    window.addEventListener('click', (e) => {
        const modal = document.getElementById('orcamentoModal');
        if (e.target === modal) {
            fecharModal();
        }
    });
});

function validarTelefone(telefone) {
    const regex = /^\+258\s?\d{2}\s?\d{3}\s?\d{4}$/;
    return regex.test(telefone);
}

function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}