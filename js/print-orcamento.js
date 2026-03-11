// Sistema de Orçamento com Impressão
class OrcamentoManager {
    constructor() {
        this.numeroOrcamento = this.gerarNumeroOrcamento();
        this.data = new Date();
    }

    gerarNumeroOrcamento() {
        const data = new Date();
        const ano = data.getFullYear();
        const mes = String(data.getMonth() + 1).padStart(2, '0');
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        return `ORC-${ano}${mes}-${random}`;
    }

    formatarData(data) {
        return data.toLocaleDateString('pt-MZ', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }

    formatarMoeda(valor) {
        return new Intl.NumberFormat('pt-MZ', {
            style: 'currency',
            currency: 'MZN'
        }).format(valor);
    }

    calcularPrecoBase(servico) {
        const precos = {
            'canalizacao': 2500,
            'serralharia': 5000,
            'limpeza': 1500,
            'outro': 2000
        };
        return precos[servico] || 2000;
    }

    calcularPrecoUrgencia(urgencia, precoBase) {
        const fatores = {
            'baixa': 1.0,
            'media': 1.2,
            'alta': 1.5,
            'emergencia': 2.0
        };
        return precoBase * (fatores[urgencia] || 1.0);
    }

    gerarItensOrcamento(dados) {
        const precoBase = this.calcularPrecoBase(dados.servico);
        const precoFinal = this.calcularPrecoUrgencia(dados.urgencia, precoBase);
        
        const itens = [
            {
                descricao: `Serviço de ${this.getNomeServico(dados.servico)}`,
                quantidade: 1,
                valorUnitario: precoBase,
                total: precoBase
            }
        ];

        if (dados.urgencia !== 'baixa') {
            const acrescimo = precoFinal - precoBase;
            itens.push({
                descricao: `Taxa de urgência (${this.getNomeUrgencia(dados.urgencia)})`,
                quantidade: 1,
                valorUnitario: acrescimo,
                total: acrescimo
            });
        }

        return itens;
    }

    getNomeServico(servico) {
        const nomes = {
            'canalizacao': 'Canalização',
            'serralharia': 'Serralharia',
            'limpeza': 'Limpeza Profissional',
            'outro': 'Serviço Especial'
        };
        return nomes[servico] || servico;
    }

    getNomeUrgencia(urgencia) {
        const nomes = {
            'baixa': 'Sem urgência',
            'media': 'Urgência média',
            'alta': 'Urgente',
            'emergencia': 'Emergência (24h)'
        };
        return nomes[urgencia] || urgencia;
    }

    gerarHTMLOrcamento(dados) {
        const itens = this.gerarItensOrcamento(dados);
        const subtotal = itens.reduce((acc, item) => acc + item.total, 0);
        const iva = subtotal * 0.16; // 16% IVA em Moçambique
        const total = subtotal + iva;

        return `
            <div class="orcamento-pdf">
                <div class="header">
                    <div class="logo-area">
                        <h1>LU SERVIÇO</h1>
                        <p>Soluções para sua casa e empresa</p>
                    </div>
                    <div class="numero">
                        <h3>${this.numeroOrcamento}</h3>
                        <p>Data: ${this.formatarData(this.data)}</p>
                    </div>
                </div>

                <div class="info-cliente">
                    <h3>Dados do Cliente</h3>
                    <table>
                        <tr>
                            <td><strong>Nome:</strong></td>
                            <td>${dados.nome}</td>
                        </tr>
                        <tr>
                            <td><strong>Email:</strong></td>
                            <td>${dados.email}</td>
                        </tr>
                        <tr>
                            <td><strong>Telefone:</strong></td>
                            <td>${dados.telefone}</td>
                        </tr>
                        <tr>
                            <td><strong>Endereço:</strong></td>
                            <td>${dados.endereco || 'Não informado'}</td>
                        </tr>
                    </table>
                </div>

                <div class="info-servico">
                    <h3>Detalhes do Serviço</h3>
                    <table>
                        <tr>
                            <td><strong>Serviço:</strong></td>
                            <td>${this.getNomeServico(dados.servico)}</td>
                        </tr>
                        <tr>
                            <td><strong>Urgência:</strong></td>
                            <td>${this.getNomeUrgencia(dados.urgencia)}</td>
                        </tr>
                        <tr>
                            <td><strong>Descrição:</strong></td>
                            <td>${dados.descricao}</td>
                        </tr>
                    </table>
                </div>

                <h3>Itens do Orçamento</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Descrição</th>
                            <th>Quant.</th>
                            <th>Valor Unit.</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${itens.map(item => `
                            <tr>
                                <td>${item.descricao}</td>
                                <td>${item.quantidade}</td>
                                <td>${this.formatarMoeda(item.valorUnitario)}</td>
                                <td>${this.formatarMoeda(item.total)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>

                <div class="total">
                    <p>Subtotal: ${this.formatarMoeda(subtotal)}</p>
                    <p>IVA (16%): ${this.formatarMoeda(iva)}</p>
                    <p><strong>Total: ${this.formatarMoeda(total)}</strong></p>
                </div>

                <div class="observacoes">
                    <h4>Observações:</h4>
                    <p>• Orçamento válido por 30 dias</p>
                    <p>• Os preços incluem material e mão de obra</p>
                    <p>• Pagamento: 50% no início e 50% na conclusão</p>
                    <p>• Garantia de 90 dias em todos os serviços</p>
                </div>

                <div class="footer">
                    <p>Lu Serviço Moçambique - NUIT: 123456789</p>
                    <p>+258 84 574 6227 | luisfrancicochauque21@gmail.com | Maputo, Moçambique</p>
                </div>
            </div>
        `;
    }

    gerarOrcamentoParaImpressao(dados) {
        return `
            <html>
            <head>
                <title>Orçamento Lu Serviço</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        line-height: 1.6;
                        color: #333;
                        max-width: 800px;
                        margin: 0 auto;
                        padding: 20px;
                    }
                    .header {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        margin-bottom: 30px;
                        padding-bottom: 20px;
                        border-bottom: 2px solid #3498DB;
                    }
                    .logo-area h1 {
                        font-size: 2rem;
                        margin: 0;
                        color: #2C3E50;
                    }
                    .logo-area p {
                        margin: 5px 0 0;
                        color: #7F8C8D;
                    }
                    .numero {
                        text-align: right;
                    }
                    .numero h3 {
                        color: #3498DB;
                        margin: 0 0 5px;
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                        margin: 20px 0;
                    }
                    th {
                        background: linear-gradient(135deg, #3498DB, #2ECC71);
                        color: white;
                        padding: 12px;
                        text-align: left;
                    }
                    td {
                        padding: 12px;
                        border-bottom: 1px solid #ECF0F1;
                    }
                    .total {
                        text-align: right;
                        font-size: 1.3rem;
                        font-weight: bold;
                        color: #27AE60;
                        margin-top: 20px;
                    }
                    .observacoes {
                        margin-top: 30px;
                        padding: 20px;
                        background: #F8FAFC;
                        border-radius: 8px;
                    }
                    .footer {
                        margin-top: 40px;
                        text-align: center;
                        color: #7F8C8D;
                        font-size: 0.9rem;
                        padding-top: 20px;
                        border-top: 1px solid #ECF0F1;
                    }
                    @media print {
                        body { margin: 0; padding: 15px; }
                        .header { border-bottom-color: #000; }
                    }
                </style>
            </head>
            <body>
                ${this.gerarHTMLOrcamento(dados)}
            </body>
            </html>
        `;
    }
}

// Instância global
const orcamentoManager = new OrcamentoManager();

// Funções globais
function previewOrcamento() {
    const form = document.getElementById('orcamentoForm');
    if (!form.checkValidity()) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        form.reportValidity();
        return;
    }

    const dados = {
        nome: document.getElementById('nome').value,
        email: document.getElementById('email').value,
        telefone: document.getElementById('telefone').value,
        servico: document.getElementById('servico').value,
        urgencia: document.getElementById('urgencia').value,
        endereco: document.getElementById('endereco').value,
        descricao: document.getElementById('descricao').value
    };

    const previewHTML = orcamentoManager.gerarHTMLOrcamento(dados);
    document.getElementById('orcamentoPreview').innerHTML = previewHTML;
    document.getElementById('orcamentoModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function fecharModal() {
    document.getElementById('orcamentoModal').classList.remove('active');
    document.body.style.overflow = 'auto';
}

function imprimirOrcamento() {
    const form = document.getElementById('orcamentoForm');
    const dados = {
        nome: document.getElementById('nome').value,
        email: document.getElementById('email').value,
        telefone: document.getElementById('telefone').value,
        servico: document.getElementById('servico').value,
        urgencia: document.getElementById('urgencia').value,
        endereco: document.getElementById('endereco').value,
        descricao: document.getElementById('descricao').value
    };

    const printWindow = window.open('', '_blank');
    printWindow.document.write(orcamentoManager.gerarOrcamentoParaImpressao(dados));
    printWindow.document.close();
    printWindow.focus();
    
    setTimeout(() => {
        printWindow.print();
    }, 500);
}

function baixarOrcamentoPDF() {
    const form = document.getElementById('orcamentoForm');
    const dados = {
        nome: document.getElementById('nome').value,
        email: document.getElementById('email').value,
        telefone: document.getElementById('telefone').value,
        servico: document.getElementById('servico').value,
        urgencia: document.getElementById('urgencia').value,
        endereco: document.getElementById('endereco').value,
        descricao: document.getElementById('descricao').value
    };

    const element = document.createElement('div');
    element.innerHTML = orcamentoManager.gerarHTMLOrcamento(dados);
    
    const opt = {
        margin: [0.5, 0.5, 0.5, 0.5],
        filename: `${orcamentoManager.numeroOrcamento}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, letterRendering: true },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save();
}

function abrirOrcamento(servico) {
    document.getElementById('orcamento').scrollIntoView({ behavior: 'smooth' });
    if (servico) {
        const select = document.getElementById('servico');
        select.value = servico;
    }
}