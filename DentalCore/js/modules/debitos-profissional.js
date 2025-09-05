// ============================================================================
// DENTALCORE PRO - MÓDULO DE DÉBITOS PROFISSIONAL
// Painel financeiro poderoso com fluxo claro e intuitivo
// Paleta: Azul-marinho, Carvão e Azul-petróleo
// ============================================================================

window.DebitosProfissional = window.DebitosProfissional || {

    // Estado atual do sistema financeiro
    currentFinancial: {
        patientId: null,
        patientName: '',
        totalReceivable: 0,
        totalReceived: 0,
        remainingBalance: 0,
        treatmentProgress: 0,
        paymentProgress: 0,
        debits: [],
        transactions: []
    },

    // Base de dados de débitos do paciente
    patientDebits: [
        {
            id: 1,
            description: 'Limpeza e Profilaxia Dental',
            originalValue: 150.00,
            remainingBalance: 0.00,
            dueDate: '2024-01-15',
            status: 'quitado',
            installment: '1/1',
            category: 'Prevenção'
        },
        {
            id: 2,
            description: 'Restauração em Resina Composta',
            originalValue: 280.00,
            remainingBalance: 140.00,
            dueDate: '2024-02-15',
            status: 'pago-parcialmente',
            installment: '1/2',
            category: 'Dentística'
        },
        {
            id: 3,
            description: 'Tratamento Endodôntico',
            originalValue: 800.00,
            remainingBalance: 800.00,
            dueDate: '2024-03-15',
            status: 'aberto',
            installment: '1/1',
            category: 'Endodontia'
        },
        {
            id: 4,
            description: 'Coroa em Porcelana',
            originalValue: 1400.00,
            remainingBalance: 1400.00,
            dueDate: '2024-04-15',
            status: 'aberto',
            installment: '1/2',
            category: 'Prótese'
        }
    ],

    // Histórico de transações
    transactionHistory: [
        {
            id: 1,
            date: '2024-01-15',
            description: 'Pagamento - Limpeza e Profilaxia',
            amount: 150.00,
            method: 'PIX',
            type: 'pagamento',
            debitId: 1
        },
        {
            id: 2,
            date: '2024-01-20',
            description: 'Pagamento Parcial - Restauração',
            amount: 140.00,
            method: 'Cartão de Crédito',
            type: 'pagamento',
            debitId: 2
        }
    ],

    // Configuração de status
    statusConfig: {
        'aberto': { 
            label: 'Aberto', 
            color: '#ef4444', 
            bgColor: 'rgba(239, 68, 68, 0.1)',
            icon: '📋'
        },
        'pago-parcialmente': { 
            label: 'Pago Parcialmente', 
            color: '#f59e0b', 
            bgColor: 'rgba(245, 158, 11, 0.1)',
            icon: '⏳'
        },
        'quitado': { 
            label: 'Quitado', 
            color: '#10b981', 
            bgColor: 'rgba(16, 185, 129, 0.1)',
            icon: '✅'
        },
        'vencido': { 
            label: 'Vencido', 
            color: '#dc2626', 
            bgColor: 'rgba(220, 38, 38, 0.1)',
            icon: '⚠️'
        }
    },

    // Métodos de pagamento
    paymentMethods: [
        { id: 'pix', label: '📱 PIX', icon: '📱' },
        { id: 'cartao-credito', label: '💳 Cartão de Crédito', icon: '💳' },
        { id: 'cartao-debito', label: '💳 Cartão de Débito', icon: '💳' },
        { id: 'dinheiro', label: '💰 Dinheiro', icon: '💰' },
        { id: 'transferencia', label: '🏦 Transferência', icon: '🏦' },
        { id: 'cheque', label: '📝 Cheque', icon: '📝' }
    ],

    currentPatient: null,

    /**
     * Inicialização do módulo
     */
    init() {
        console.log('💰 Módulo Débitos Profissional inicializado');
        this.loadFinancialData();
        this.calculateFinancialSummary();
    },

    /**
     * Carregar dados financeiros
     */
    loadFinancialData() {
        this.currentFinancial.debits = [...this.patientDebits];
        this.currentFinancial.transactions = [...this.transactionHistory];
        this.calculateFinancialSummary();
    },

    /**
     * Calcular resumo financeiro
     */
    calculateFinancialSummary() {
        const totalReceivable = this.currentFinancial.debits.reduce((sum, debit) => sum + debit.originalValue, 0);
        const totalReceived = this.currentFinancial.transactions
            .filter(t => t.type === 'pagamento')
            .reduce((sum, transaction) => sum + transaction.amount, 0);
        const remainingBalance = totalReceivable - totalReceived;

        // Calcular progresso do tratamento (simulado baseado em débitos quitados)
        const completedDebits = this.currentFinancial.debits.filter(d => d.status === 'quitado').length;
        const treatmentProgress = this.currentFinancial.debits.length > 0 ? 
            (completedDebits / this.currentFinancial.debits.length) * 100 : 0;

        // Calcular progresso do pagamento
        const paymentProgress = totalReceivable > 0 ? (totalReceived / totalReceivable) * 100 : 0;

        this.currentFinancial.totalReceivable = totalReceivable;
        this.currentFinancial.totalReceived = totalReceived;
        this.currentFinancial.remainingBalance = remainingBalance;
        this.currentFinancial.treatmentProgress = treatmentProgress;
        this.currentFinancial.paymentProgress = paymentProgress;
    },

    /**
     * Interface principal da aba Débitos
     */
    renderProfessionalInterface(patient = null) {
        if (patient) {
            this.currentPatient = patient;
            this.currentFinancial.patientId = patient.id;
            this.currentFinancial.patientName = patient.name;
        }

        return `
            <style>
                /* CSS INLINE PARA GARANTIR FUNCIONAMENTO */
                .debits-workspace {
                    background: linear-gradient(135deg, #1e3a8a 0%, #374151 100%);
                    min-height: 100vh;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', sans-serif;
                    color: #f8fafc;
                    padding: 0;
                    margin: 0;
                }

                .debits-header {
                    background: rgba(255, 255, 255, 0.05);
                    backdrop-filter: blur(20px);
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                    padding: 24px 40px;
                    position: sticky;
                    top: 0;
                    z-index: 100;
                }

                .header-title-section {
                    text-align: center;
                }

                .workspace-title {
                    font-size: 28px;
                    font-weight: 300;
                    color: #ffffff;
                    margin: 0;
                    letter-spacing: -0.025em;
                }

                .workspace-subtitle {
                    font-size: 14px;
                    color: #94a3b8;
                    margin: 4px 0 0 0;
                    font-weight: 400;
                }

                .debits-main-container {
                    padding: 40px;
                    max-width: 1400px;
                    margin: 0 auto;
                    display: flex;
                    flex-direction: column;
                    gap: 32px;
                }

                /* RESUMO FINANCEIRO */
                .financial-summary-panel {
                    background: rgba(255, 255, 255, 0.02);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    border-radius: 16px;
                    padding: 32px;
                    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
                }

                .summary-title {
                    font-size: 20px;
                    font-weight: 600;
                    color: #ffffff;
                    margin: 0 0 24px 0;
                    letter-spacing: -0.012em;
                    text-align: center;
                }

                .financial-metrics {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 24px;
                    margin-bottom: 32px;
                }

                .metric-card {
                    background: rgba(0, 0, 0, 0.2);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 12px;
                    padding: 24px;
                    text-align: center;
                    transition: all 0.3s ease;
                }

                .metric-card:hover {
                    background: rgba(0, 0, 0, 0.3);
                    border-color: rgba(13, 148, 136, 0.3);
                    transform: translateY(-2px);
                }

                .metric-label {
                    font-size: 14px;
                    font-weight: 600;
                    color: #94a3b8;
                    margin: 0 0 8px 0;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }

                .metric-value {
                    font-size: 32px;
                    font-weight: 700;
                    margin: 0;
                    letter-spacing: -0.02em;
                }

                .metric-value.receivable {
                    color: #60a5fa;
                }

                .metric-value.received {
                    color: #14b8a6;
                }

                .metric-value.balance {
                    color: #f59e0b;
                }

                .metric-description {
                    font-size: 12px;
                    color: #6b7280;
                    margin: 8px 0 0 0;
                }

                /* BARRA DE PROGRESSO COMPARATIVA */
                .progress-comparison-section {
                    background: rgba(13, 148, 136, 0.05);
                    border: 1px solid rgba(13, 148, 136, 0.2);
                    border-radius: 12px;
                    padding: 24px;
                    margin-top: 24px;
                }

                .progress-title {
                    font-size: 16px;
                    font-weight: 600;
                    color: #14b8a6;
                    margin: 0 0 20px 0;
                    text-align: center;
                }

                .progress-bars-container {
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                }

                .progress-bar-item {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                }

                .progress-label {
                    font-size: 14px;
                    font-weight: 600;
                    color: #e2e8f0;
                    min-width: 140px;
                    text-align: right;
                }

                .progress-bar-track {
                    flex: 1;
                    height: 12px;
                    background: rgba(0, 0, 0, 0.3);
                    border-radius: 6px;
                    overflow: hidden;
                    position: relative;
                }

                .progress-bar-fill {
                    height: 100%;
                    border-radius: 6px;
                    transition: width 0.8s ease;
                    position: relative;
                }

                .progress-bar-fill.treatment {
                    background: linear-gradient(90deg, #3b82f6, #60a5fa);
                }

                .progress-bar-fill.payment {
                    background: linear-gradient(90deg, #0d9488, #14b8a6);
                }

                .progress-percentage {
                    font-size: 14px;
                    font-weight: 700;
                    color: #ffffff;
                    min-width: 50px;
                    text-align: center;
                }

                .progress-comparison-note {
                    text-align: center;
                    font-size: 12px;
                    color: #94a3b8;
                    margin-top: 16px;
                    font-style: italic;
                }

                /* LISTA DE DÉBITOS */
                .debits-list-section {
                    background: rgba(255, 255, 255, 0.02);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    border-radius: 16px;
                    padding: 32px;
                    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
                }

                .section-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 24px;
                }

                .section-title {
                    font-size: 20px;
                    font-weight: 600;
                    color: #ffffff;
                    margin: 0;
                }

                .section-actions {
                    display: flex;
                    gap: 8px;
                }

                .section-action-btn {
                    padding: 8px 16px;
                    border: none;
                    border-radius: 6px;
                    font-size: 12px;
                    font-weight: 600;
                    cursor: pointer;
                    background: rgba(255, 255, 255, 0.1);
                    color: #e2e8f0;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    transition: all 0.2s ease;
                }

                .section-action-btn:hover {
                    background: rgba(13, 148, 136, 0.2);
                    border-color: rgba(13, 148, 136, 0.3);
                    color: #14b8a6;
                }

                .debits-list {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }

                .debit-item {
                    background: rgba(0, 0, 0, 0.2);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 12px;
                    padding: 20px;
                    transition: all 0.2s ease;
                    cursor: pointer;
                }

                .debit-item:hover {
                    background: rgba(0, 0, 0, 0.3);
                    border-color: rgba(255, 255, 255, 0.2);
                    transform: translateY(-1px);
                }

                .debit-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 12px;
                }

                .debit-main-info {
                    flex: 1;
                }

                .debit-description {
                    font-size: 16px;
                    font-weight: 600;
                    color: #f8fafc;
                    margin: 0 0 4px 0;
                }

                .debit-category {
                    font-size: 12px;
                    color: #14b8a6;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }

                .debit-status {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    padding: 6px 12px;
                    border-radius: 8px;
                    font-size: 12px;
                    font-weight: 600;
                    white-space: nowrap;
                }

                .debit-details {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                    gap: 16px;
                    font-size: 14px;
                }

                .debit-detail-item {
                    display: flex;
                    flex-direction: column;
                    gap: 2px;
                }

                .detail-label {
                    font-size: 11px;
                    color: #94a3b8;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }

                .detail-value {
                    color: #e2e8f0;
                    font-weight: 600;
                }

                .detail-value.amount {
                    color: #14b8a6;
                    font-size: 16px;
                }

                .detail-value.due-date {
                    color: #f59e0b;
                }

                .detail-value.overdue {
                    color: #ef4444;
                }

                /* REGISTRO DE PAGAMENTOS */
                .payment-registry-section {
                    background: rgba(255, 255, 255, 0.02);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    border-radius: 16px;
                    padding: 32px;
                    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
                }

                .payment-form {
                    background: rgba(0, 0, 0, 0.2);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 12px;
                    padding: 24px;
                    margin-top: 16px;
                }

                .form-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 16px;
                    margin-bottom: 20px;
                }

                .form-group {
                    display: flex;
                    flex-direction: column;
                    gap: 6px;
                }

                .form-label {
                    font-size: 12px;
                    font-weight: 600;
                    color: #e2e8f0;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }

                .form-input,
                .form-select {
                    background: rgba(0, 0, 0, 0.3);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 6px;
                    padding: 10px 12px;
                    color: #f8fafc;
                    font-size: 14px;
                    transition: all 0.2s ease;
                }

                .form-input:focus,
                .form-select:focus {
                    outline: none;
                    border-color: #0d9488;
                    box-shadow: 0 0 0 2px rgba(13, 148, 136, 0.1);
                }

                .form-actions {
                    display: flex;
                    gap: 12px;
                    justify-content: flex-end;
                }

                .form-btn {
                    padding: 12px 24px;
                    border: none;
                    border-radius: 8px;
                    font-size: 14px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .form-btn.secondary {
                    background: rgba(255, 255, 255, 0.1);
                    color: #e2e8f0;
                    border: 1px solid rgba(255, 255, 255, 0.2);
                }

                .form-btn.primary {
                    background: linear-gradient(135deg, #0d9488 0%, #14b8a6 100%);
                    color: white;
                }

                .form-btn:hover {
                    transform: translateY(-1px);
                }

                /* HISTÓRICO DE TRANSAÇÕES */
                .transactions-history-section {
                    background: rgba(255, 255, 255, 0.02);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    border-radius: 16px;
                    padding: 32px;
                    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
                }

                .transactions-list {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                    margin-top: 16px;
                }

                .transaction-item {
                    background: rgba(0, 0, 0, 0.2);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 8px;
                    padding: 16px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    transition: all 0.2s ease;
                }

                .transaction-item:hover {
                    background: rgba(0, 0, 0, 0.3);
                    border-color: rgba(13, 148, 136, 0.2);
                }

                .transaction-info {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                }

                .transaction-icon {
                    width: 40px;
                    height: 40px;
                    background: rgba(13, 148, 136, 0.2);
                    border: 1px solid rgba(13, 148, 136, 0.3);
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 16px;
                }

                .transaction-details {
                    flex: 1;
                }

                .transaction-description {
                    font-size: 14px;
                    font-weight: 600;
                    color: #f8fafc;
                    margin: 0 0 4px 0;
                }

                .transaction-meta {
                    font-size: 12px;
                    color: #94a3b8;
                    display: flex;
                    gap: 12px;
                }

                .transaction-amount {
                    font-size: 16px;
                    font-weight: 700;
                    color: #10b981;
                }

                /* Responsividade */
                @media (max-width: 1024px) {
                    .debits-main-container {
                        padding: 24px;
                    }
                    
                    .debits-header {
                        padding: 20px 24px;
                    }
                    
                    .financial-metrics {
                        grid-template-columns: 1fr;
                    }
                    
                    .form-grid {
                        grid-template-columns: 1fr;
                    }
                    
                    .debit-details {
                        grid-template-columns: 1fr;
                    }
                    
                    .progress-bar-item {
                        flex-direction: column;
                        gap: 8px;
                    }
                    
                    .progress-label {
                        min-width: auto;
                        text-align: left;
                    }
                }

                @media (max-width: 768px) {
                    .workspace-title {
                        font-size: 24px;
                    }
                    
                    .debit-header {
                        flex-direction: column;
                        gap: 12px;
                    }
                    
                    .section-header {
                        flex-direction: column;
                        gap: 16px;
                    }
                    
                    .section-actions {
                        width: 100%;
                        justify-content: center;
                    }
                    
                    .form-actions {
                        flex-direction: column;
                    }
                    
                    .transaction-item {
                        flex-direction: column;
                        gap: 12px;
                        text-align: center;
                    }
                    
                    .transaction-info {
                        flex-direction: column;
                        text-align: center;
                    }
                }
            </style>

            <div class="debits-workspace">
                <!-- Header -->
                <div class="debits-header">
                    <div class="header-title-section">
                        <h1 class="workspace-title">💰 Painel Financeiro</h1>
                        <p class="workspace-subtitle">Gestão completa de débitos para ${this.currentPatient?.name || 'Paciente'}</p>
                    </div>
                </div>

                <!-- Container Principal -->
                <div class="debits-main-container">
                    <!-- Resumo Financeiro -->
                    <div class="financial-summary-panel">
                        <h2 class="summary-title">📊 Resumo Financeiro</h2>
                        
                        <div class="financial-metrics">
                            <div class="metric-card">
                                <div class="metric-label">Total a Receber</div>
                                <div class="metric-value receivable">R$ ${this.currentFinancial.totalReceivable.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</div>
                                <div class="metric-description">Valor total dos tratamentos</div>
                            </div>
                            
                            <div class="metric-card">
                                <div class="metric-label">Valor Recebido</div>
                                <div class="metric-value received">R$ ${this.currentFinancial.totalReceived.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</div>
                                <div class="metric-description">Pagamentos já efetuados</div>
                            </div>
                            
                            <div class="metric-card">
                                <div class="metric-label">Saldo Devedor</div>
                                <div class="metric-value balance">R$ ${this.currentFinancial.remainingBalance.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</div>
                                <div class="metric-description">Valor pendente de pagamento</div>
                            </div>
                        </div>

                        <!-- Barra de Progresso Comparativa -->
                        <div class="progress-comparison-section">
                            <h3 class="progress-title">📈 Comparativo de Progresso</h3>
                            
                            <div class="progress-bars-container">
                                <div class="progress-bar-item">
                                    <div class="progress-label">Tratamento Concluído:</div>
                                    <div class="progress-bar-track">
                                        <div class="progress-bar-fill treatment" style="width: ${this.currentFinancial.treatmentProgress}%"></div>
                                    </div>
                                    <div class="progress-percentage">${this.currentFinancial.treatmentProgress.toFixed(1)}%</div>
                                </div>
                                
                                <div class="progress-bar-item">
                                    <div class="progress-label">Valor Pago:</div>
                                    <div class="progress-bar-track">
                                        <div class="progress-bar-fill payment" style="width: ${this.currentFinancial.paymentProgress}%"></div>
                                    </div>
                                    <div class="progress-percentage">${this.currentFinancial.paymentProgress.toFixed(1)}%</div>
                                </div>
                            </div>
                            
                            <div class="progress-comparison-note">
                                ${this.getProgressComparisonNote()}
                            </div>
                        </div>
                    </div>

                    <!-- Lista Detalhada de Débitos -->
                    <div class="debits-list-section">
                        <div class="section-header">
                            <h2 class="section-title">📋 Lista de Débitos</h2>
                            <div class="section-actions">
                                <button onclick="DebitosProfissional.refreshDebits()" class="section-action-btn">
                                    🔄 Atualizar
                                </button>
                                <button onclick="DebitosProfissional.exportReport()" class="section-action-btn">
                                    📄 Relatório
                                </button>
                            </div>
                        </div>
                        
                        <div class="debits-list">
                            ${this.renderDebitsList()}
                        </div>
                    </div>

                    <!-- Registro de Pagamentos -->
                    <div class="payment-registry-section">
                        <div class="section-header">
                            <h2 class="section-title">💳 Registro de Pagamentos</h2>
                        </div>
                        
                        <div class="payment-form">
                            <div class="form-grid">
                                <div class="form-group">
                                    <label class="form-label">Débito</label>
                                    <select id="paymentDebit" class="form-select">
                                        <option value="">Selecione o débito</option>
                                        ${this.renderDebitOptions()}
                                    </select>
                                </div>
                                
                                <div class="form-group">
                                    <label class="form-label">Valor do Pagamento</label>
                                    <input type="number" id="paymentAmount" class="form-input" placeholder="0,00" step="0.01" min="0">
                                </div>
                                
                                <div class="form-group">
                                    <label class="form-label">Método de Pagamento</label>
                                    <select id="paymentMethod" class="form-select">
                                        <option value="">Selecione o método</option>
                                        ${this.renderPaymentMethods()}
                                    </select>
                                </div>
                                
                                <div class="form-group">
                                    <label class="form-label">Data do Pagamento</label>
                                    <input type="date" id="paymentDate" class="form-input" value="${new Date().toISOString().split('T')[0]}">
                                </div>
                            </div>
                            
                            <div class="form-actions">
                                <button onclick="DebitosProfissional.clearPaymentForm()" class="form-btn secondary">
                                    🔄 Limpar
                                </button>
                                <button onclick="DebitosProfissional.registerPayment()" class="form-btn primary">
                                    💾 Registrar Pagamento
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Histórico de Transações -->
                    <div class="transactions-history-section">
                        <div class="section-header">
                            <h2 class="section-title">📜 Histórico de Transações</h2>
                            <div class="section-actions">
                                <button onclick="DebitosProfissional.filterTransactions()" class="section-action-btn">
                                    🔍 Filtrar
                                </button>
                            </div>
                        </div>
                        
                        <div class="transactions-list">
                            ${this.renderTransactionHistory()}
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * Renderizar lista de débitos
     */
    renderDebitsList() {
        if (this.currentFinancial.debits.length === 0) {
            return `
                <div style="text-align: center; padding: 40px; color: #6b7280; font-style: italic;">
                    📋 Nenhum débito encontrado para este paciente
                </div>
            `;
        }

        return this.currentFinancial.debits.map(debit => {
            const statusConfig = this.statusConfig[debit.status];
            const isOverdue = new Date(debit.dueDate) < new Date() && debit.status !== 'quitado';
            const dueDateClass = isOverdue ? 'overdue' : 'due-date';

            return `
                <div class="debit-item" onclick="DebitosProfissional.selectDebit(${debit.id})">
                    <div class="debit-header">
                        <div class="debit-main-info">
                            <h4 class="debit-description">${debit.description}</h4>
                            <div class="debit-category">${debit.category}</div>
                        </div>
                        
                        <div class="debit-status" style="background: ${statusConfig.bgColor}; color: ${statusConfig.color};">
                            <span>${statusConfig.icon}</span>
                            <span>${statusConfig.label}</span>
                        </div>
                    </div>
                    
                    <div class="debit-details">
                        <div class="debit-detail-item">
                            <div class="detail-label">Valor Original</div>
                            <div class="detail-value">R$ ${debit.originalValue.toFixed(2)}</div>
                        </div>
                        
                        <div class="debit-detail-item">
                            <div class="detail-label">Saldo Restante</div>
                            <div class="detail-value amount">R$ ${debit.remainingBalance.toFixed(2)}</div>
                        </div>
                        
                        <div class="debit-detail-item">
                            <div class="detail-label">Data de Vencimento</div>
                            <div class="detail-value ${dueDateClass}">
                                ${new Date(debit.dueDate).toLocaleDateString('pt-BR')}
                                ${isOverdue ? ' (VENCIDO)' : ''}
                            </div>
                        </div>
                        
                        <div class="debit-detail-item">
                            <div class="detail-label">Parcela</div>
                            <div class="detail-value">${debit.installment}</div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    },

    /**
     * Renderizar opções de débitos para pagamento
     */
    renderDebitOptions() {
        return this.currentFinancial.debits
            .filter(debit => debit.remainingBalance > 0)
            .map(debit => `
                <option value="${debit.id}">
                    ${debit.description} - R$ ${debit.remainingBalance.toFixed(2)} (${debit.installment})
                </option>
            `).join('');
    },

    /**
     * Renderizar métodos de pagamento
     */
    renderPaymentMethods() {
        return this.paymentMethods.map(method => `
            <option value="${method.id}">${method.label}</option>
        `).join('');
    },

    /**
     * Renderizar histórico de transações
     */
    renderTransactionHistory() {
        if (this.currentFinancial.transactions.length === 0) {
            return `
                <div style="text-align: center; padding: 40px; color: #6b7280; font-style: italic;">
                    📜 Nenhuma transação registrada ainda
                </div>
            `;
        }

        return this.currentFinancial.transactions
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .map(transaction => {
                const method = this.paymentMethods.find(m => m.id === transaction.method) || 
                    { icon: '💳', label: transaction.method };

                return `
                    <div class="transaction-item">
                        <div class="transaction-info">
                            <div class="transaction-icon">${method.icon}</div>
                            <div class="transaction-details">
                                <div class="transaction-description">${transaction.description}</div>
                                <div class="transaction-meta">
                                    <span>${new Date(transaction.date).toLocaleDateString('pt-BR')}</span>
                                    <span>${method.label}</span>
                                </div>
                            </div>
                        </div>
                        <div class="transaction-amount">+ R$ ${transaction.amount.toFixed(2)}</div>
                    </div>
                `;
            }).join('');
    },

    /**
     * Gerar nota comparativa de progresso
     */
    getProgressComparisonNote() {
        const treatmentProgress = this.currentFinancial.treatmentProgress;
        const paymentProgress = this.currentFinancial.paymentProgress;
        const difference = Math.abs(treatmentProgress - paymentProgress);

        if (difference <= 5) {
            return '✅ Progresso do tratamento e pagamentos estão alinhados';
        } else if (paymentProgress > treatmentProgress) {
            return '📈 Pagamentos estão adiantados em relação ao tratamento';
        } else {
            return '⚠️ Tratamento está adiantado em relação aos pagamentos';
        }
    },

    /**
     * FUNÇÕES DE INTERAÇÃO
     */

    selectDebit(debitId) {
        const debit = this.currentFinancial.debits.find(d => d.id === debitId);
        if (debit) {
            // Pré-selecionar o débito no formulário de pagamento
            const selectElement = document.getElementById('paymentDebit');
            if (selectElement) {
                selectElement.value = debitId;
            }
            
            // Sugerir valor do pagamento
            const amountElement = document.getElementById('paymentAmount');
            if (amountElement) {
                amountElement.value = debit.remainingBalance.toFixed(2);
            }

            this.showAlert('📋 Débito Selecionado', 
                `${debit.description}\n\n` +
                `Status: ${this.statusConfig[debit.status].label}\n` +
                `Saldo: R$ ${debit.remainingBalance.toFixed(2)}\n` +
                `Vencimento: ${new Date(debit.dueDate).toLocaleDateString('pt-BR')}\n\n` +
                `Débito pré-selecionado no formulário de pagamento abaixo.`
            );
        }
    },

    registerPayment() {
        const debitId = document.getElementById('paymentDebit')?.value;
        const amount = parseFloat(document.getElementById('paymentAmount')?.value || 0);
        const method = document.getElementById('paymentMethod')?.value;
        const date = document.getElementById('paymentDate')?.value;

        if (!debitId || !amount || !method || !date) {
            this.showAlert('⚠️ Campos Obrigatórios', 'Preencha todos os campos para registrar o pagamento.');
            return;
        }

        const debit = this.currentFinancial.debits.find(d => d.id === parseInt(debitId));
        if (!debit) {
            this.showAlert('❌ Erro', 'Débito não encontrado.');
            return;
        }

        if (amount > debit.remainingBalance) {
            this.showAlert('⚠️ Valor Inválido', 
                `O valor do pagamento (R$ ${amount.toFixed(2)}) é maior que o saldo devedor (R$ ${debit.remainingBalance.toFixed(2)}).`
            );
            return;
        }

        // Registrar a transação
        const newTransaction = {
            id: Date.now(),
            date: date,
            description: `Pagamento - ${debit.description}`,
            amount: amount,
            method: method,
            type: 'pagamento',
            debitId: parseInt(debitId)
        };

        this.currentFinancial.transactions.push(newTransaction);

        // Atualizar o débito
        debit.remainingBalance -= amount;
        if (debit.remainingBalance <= 0) {
            debit.status = 'quitado';
            debit.remainingBalance = 0;
        } else if (debit.remainingBalance < debit.originalValue) {
            debit.status = 'pago-parcialmente';
        }

        // Recalcular resumo financeiro
        this.calculateFinancialSummary();

        // Limpar formulário
        this.clearPaymentForm();

        // Atualizar interface
        this.updateInterface();

        // Mostrar confirmação
        this.showAlert('✅ Pagamento Registrado', 
            `Pagamento de R$ ${amount.toFixed(2)} registrado com sucesso!\n\n` +
            `Débito: ${debit.description}\n` +
            `Saldo restante: R$ ${debit.remainingBalance.toFixed(2)}\n` +
            `Status: ${this.statusConfig[debit.status].label}`
        );
    },

    clearPaymentForm() {
        const fields = ['paymentDebit', 'paymentAmount', 'paymentMethod', 'paymentDate'];
        fields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                if (fieldId === 'paymentDate') {
                    field.value = new Date().toISOString().split('T')[0];
                } else {
                    field.value = '';
                }
            }
        });
    },

    refreshDebits() {
        this.loadFinancialData();
        this.updateInterface();
        this.showAlert('🔄 Atualizado', 'Lista de débitos atualizada com sucesso!');
    },

    exportReport() {
        this.showAlert('📄 Relatório', 'Funcionalidade de exportação de relatório será implementada.');
    },

    filterTransactions() {
        this.showAlert('🔍 Filtros', 'Funcionalidade de filtros avançados será implementada.');
    },

    updateInterface() {
        // Recarregar interface completa
        const currentInterface = this.renderProfessionalInterface(this.currentPatient);
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
            mainContent.innerHTML = currentInterface;
        }
    },

    showAlert(title, message) {
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.6);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            backdrop-filter: blur(4px);
        `;
        modal.innerHTML = `
            <div style="
                background: linear-gradient(135deg, #1e3a8a 0%, #374151 100%);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 16px;
                max-width: 450px;
                width: 100%;
                margin: 20px;
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
                color: #f8fafc;
            ">
                <div style="padding: 24px 24px 0 24px;">
                    <h3 style="font-size: 20px; font-weight: 600; margin: 0; color: #ffffff;">${title}</h3>
                </div>
                <div style="padding: 16px 24px;">
                    <p style="color: #d1d5db; line-height: 1.5; margin: 0; white-space: pre-line;">${message}</p>
                </div>
                <div style="padding: 0 24px 24px 24px; display: flex; justify-content: flex-end;">
                    <button onclick="this.closest('div[style*=\"position: fixed\"]').remove()" style="
                        background: linear-gradient(135deg, #0d9488 0%, #14b8a6 100%);
                        border: none;
                        border-radius: 8px;
                        color: white;
                        padding: 12px 24px;
                        font-weight: 600;
                        font-size: 14px;
                        cursor: pointer;
                        transition: all 0.2s ease;
                    ">Entendi</button>
                </div>
            </div>
        `;
        modal.onclick = (e) => {
            if (e.target === modal) modal.remove();
        };
        document.body.appendChild(modal);
    }
};

// Exportar para uso global
window.DebitosProfissional = DebitosProfissional;

console.log('💰 Módulo Débitos Profissional carregado!');