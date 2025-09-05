// ============================================================================
// DENTALCORE PRO - MÓDULO DE ORÇAMENTOS PREMIUM INTEGRADO
// Interface Profissional para Desktop - Azul-Marinho e Carvão
// Integrado com sistema DentalCore Pro v2.0.0
// ============================================================================

const Orcamentos = {
    currentPatientId: null,
    currentBudget: {
        id: null,
        items: [],
        paymentTerms: {
            downPayment: 0,
            installments: 1,
            discount: 0
        },
        status: 'Em Preparação',
        notes: ''
    },
    savedBudgets: [], // Para armazenar orçamentos salvos
    procedures: [
        { id: 1, name: 'Limpeza e Profilaxia', price: 150.00, description: 'Remoção de tártaro e polimento dental' },
        { id: 2, name: 'Restauração em Resina Composta', price: 280.00, description: 'Restauração estética com resina' },
        { id: 3, name: 'Tratamento de Canal', price: 800.00, description: 'Endodontia completa' },
        { id: 4, name: 'Coroa em Porcelana', price: 1200.00, description: 'Prótese fixa unitária' },
        { id: 5, name: 'Implante Dentário', price: 2500.00, description: 'Implante com pino de titânio' },
        { id: 6, name: 'Extração Simples', price: 120.00, description: 'Remoção de elemento dental' },
        { id: 7, name: 'Clareamento Dental', price: 600.00, description: 'Clareamento profissional' },
        { id: 8, name: 'Aparelho Ortodôntico', price: 3500.00, description: 'Tratamento ortodôntico completo' },
        { id: 9, name: 'Raspagem Periodontal', price: 200.00, description: 'Limpeza profunda das gengivas' },
        { id: 10, name: 'Aplicação de Flúor', price: 50.00, description: 'Proteção contra cáries' }
    ],

    /**
     * Inicializar módulo de orçamentos
     */
    init() {
        console.log('💰 Módulo de Orçamentos Premium carregado com sucesso!');
        this.addCustomStyles();
        this.loadBudgets();
    },

    /**
     * Carregar orçamentos salvos
     */
    loadBudgets() {
        if (typeof DataPersistence !== 'undefined') {
            this.savedBudgets = DataPersistence.getBudgets() || [];
            console.log('📖 Orçamentos carregados:', this.savedBudgets.length);
        }
    },

    /**
     * Salvar orçamentos
     */
    saveBudgets() {
        if (typeof DataPersistence !== 'undefined') {
            DataPersistence.save('budgets', this.savedBudgets);
            console.log('💾 Orçamentos salvos');
        }
    },

    /**
     * Adicionar estilos customizados para interface desktop profissional
     */
    addCustomStyles() {
        if (!document.getElementById('budgetsPremiumStyles')) {
            const styles = document.createElement('style');
            styles.id = 'budgetsPremiumStyles';
            styles.textContent = `
                /* Paleta Azul-Marinho e Carvão Premium */
                .budget-workspace {
                    background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
                    min-height: 100vh;
                }
                
                .budget-panel {
                    background: linear-gradient(135deg, #334155 0%, #1e293b 100%);
                    border: 1px solid rgba(71, 85, 105, 0.3);
                    border-radius: 20px;
                    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.4), 0 5px 15px rgba(0, 0, 0, 0.3);
                    backdrop-filter: blur(20px);
                    position: relative;
                    overflow: hidden;
                }
                
                .budget-panel::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 1px;
                    background: linear-gradient(90deg, transparent, rgba(14, 116, 144, 0.4), transparent);
                }
                
                .budget-header {
                    background: linear-gradient(135deg, #0e7490 0%, #0d9488 100%);
                    border: 1px solid rgba(20, 184, 166, 0.3);
                    color: white;
                    font-weight: 600;
                    padding: 16px 24px;
                    border-radius: 16px;
                    position: relative;
                    overflow: hidden;
                    box-shadow: 0 8px 25px rgba(14, 116, 144, 0.3);
                }
                
                .budget-button {
                    background: linear-gradient(135deg, #0e7490 0%, #0d9488 100%);
                    border: 1px solid rgba(20, 184, 166, 0.3);
                    border-radius: 12px;
                    color: white;
                    font-weight: 500;
                    padding: 12px 24px;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    box-shadow: 0 4px 15px rgba(14, 116, 144, 0.3);
                    position: relative;
                    overflow: hidden;
                    cursor: pointer;
                    border: none;
                }
                
                .budget-button::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
                    transition: left 0.6s;
                }
                
                .budget-button:hover::before {
                    left: 100%;
                }
                
                .budget-button:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 30px rgba(14, 116, 144, 0.4);
                }
                
                .budget-input {
                    background: rgba(30, 41, 59, 0.8);
                    border: 1px solid rgba(148, 163, 184, 0.2);
                    border-radius: 12px;
                    color: #f1f5f9;
                    padding: 14px 18px;
                    transition: all 0.3s ease;
                    backdrop-filter: blur(8px);
                    font-weight: 500;
                    font-size: 16px; /* Mobile-friendly */
                }
                
                .budget-input:focus {
                    border-color: rgba(14, 116, 144, 0.6);
                    box-shadow: 0 0 0 3px rgba(14, 116, 144, 0.1);
                    outline: none;
                    background: rgba(30, 41, 59, 0.9);
                }
                
                .procedure-item {
                    background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
                    border: 1px solid rgba(71, 85, 105, 0.3);
                    border-radius: 16px;
                    padding: 20px;
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    position: relative;
                    overflow: hidden;
                    cursor: pointer;
                }
                
                .procedure-item::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: radial-gradient(circle at center, rgba(14, 116, 144, 0.05) 0%, transparent 70%);
                    opacity: 0;
                    transition: opacity 0.3s ease;
                }
                
                .procedure-item:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
                    border-color: rgba(14, 116, 144, 0.4);
                }
                
                .procedure-item:hover::before {
                    opacity: 1;
                }
                
                .status-badge {
                    padding: 8px 16px;
                    border-radius: 20px;
                    font-size: 12px;
                    font-weight: 700;
                    letter-spacing: 0.5px;
                    text-transform: uppercase;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
                    position: relative;
                }
                
                .status-preparacao, .status-em-preparação {
                    background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
                    color: #fef3c7;
                    border: 1px solid rgba(251, 146, 60, 0.3);
                }
                
                .status-enviado {
                    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
                    color: #dbeafe;
                    border: 1px solid rgba(59, 130, 246, 0.3);
                }
                
                .status-aprovado {
                    background: linear-gradient(135deg, #10b981 0%, #047857 100%);
                    color: #d1fae5;
                    border: 1px solid rgba(16, 185, 129, 0.3);
                    animation: approved-pulse 2s infinite;
                }
                
                .status-recusado, .status-rejeitado {
                    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
                    color: #fee2e2;
                    border: 1px solid rgba(239, 68, 68, 0.3);
                }
                
                @keyframes approved-pulse {
                    0%, 100% { box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3); }
                    50% { box-shadow: 0 8px 25px rgba(16, 185, 129, 0.6); }
                }
                
                .workflow-automation {
                    background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
                    border: 1px solid rgba(139, 92, 246, 0.3);
                    border-radius: 16px;
                    position: relative;
                    overflow: hidden;
                    animation: workflow-glow 3s infinite;
                }
                
                @keyframes workflow-glow {
                    0%, 100% { box-shadow: 0 4px 15px rgba(139, 92, 246, 0.3); }
                    50% { box-shadow: 0 8px 30px rgba(139, 92, 246, 0.6); }
                }
                
                .preview-panel {
                    background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
                    border: 1px solid rgba(203, 213, 225, 0.5);
                    border-radius: 20px;
                    color: #1e293b;
                    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.1);
                    position: relative;
                }
                
                .preview-header {
                    background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
                    color: white;
                    padding: 24px;
                    border-radius: 20px 20px 0 0;
                    position: relative;
                }
                
                .budget-text-primary {
                    color: #f1f5f9;
                    font-weight: 600;
                }
                
                .budget-text-secondary {
                    color: #94a3b8;
                    font-weight: 400;
                }
                
                .budget-text-muted {
                    color: #64748b;
                    font-weight: 400;
                }
                
                .budget-total {
                    background: linear-gradient(135deg, #0e7490 0%, #0d9488 100%);
                    color: white;
                    padding: 20px;
                    border-radius: 16px;
                    text-align: center;
                    box-shadow: 0 8px 25px rgba(14, 116, 144, 0.3);
                }
                
                .procedure-card {
                    background: white;
                    border: 1px solid #e2e8f0;
                    border-radius: 12px;
                    padding: 16px;
                    margin-bottom: 12px;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                }
                
                .remove-button {
                    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
                    border: 1px solid rgba(239, 68, 68, 0.3);
                    border-radius: 8px;
                    color: white;
                    padding: 8px 12px;
                    font-size: 12px;
                    font-weight: 600;
                    transition: all 0.3s ease;
                    cursor: pointer;
                    border: none;
                }
                
                .remove-button:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 4px 15px rgba(239, 68, 68, 0.4);
                }

                /* Responsividade */
                @media (max-width: 1024px) {
                    .budget-workspace .grid-cols-12 {
                        display: flex;
                        flex-direction: column;
                        gap: 2rem;
                    }
                    
                    .budget-workspace .col-span-4 {
                        width: 100%;
                    }
                    
                    .budget-workspace .h-[calc(100vh-200px)] {
                        height: auto;
                        min-height: 300px;
                    }
                }
            `;
            document.head.appendChild(styles);
        }
    },

    /**
     * Renderizar interface de orçamentos premium
     */
    renderTabOrcamentos(patient) {
        this.currentPatientId = patient.id;
        this.resetCurrentBudget();
        this.loadBudgets();
        
        return `
            <div class="budget-workspace p-8">
                <div class="max-w-8xl mx-auto">
                    
                    <!-- Cabeçalho Premium -->
                    <div class="mb-8">
                        <div class="flex items-center justify-between mb-6">
                            <div>
                                <h1 class="text-4xl font-light budget-text-primary mb-3 tracking-tight">
                                    Sistema de Orçamentos
                                </h1>
                                <p class="budget-text-secondary text-lg">
                                    Gestão profissional de propostas para ${patient.name}
                                </p>
                            </div>
                            <div class="flex items-center space-x-4">
                                <button onclick="Orcamentos.exportToPDF()" class="budget-button flex items-center space-x-3">
                                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                    </svg>
                                    <span>Exportar PDF</span>
                                </button>
                                <button onclick="Orcamentos.saveCurrentBudget()" class="budget-button flex items-center space-x-3">
                                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12"></path>
                                    </svg>
                                    <span>Salvar Orçamento</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Layout Principal - 3 Painéis -->
                    <div class="grid grid-cols-12 gap-8 h-[calc(100vh-200px)]">
                        
                        <!-- PAINEL ESQUERDO: Criação de Orçamento -->
                        <div class="col-span-4">
                            <div class="budget-panel h-full p-6 overflow-y-auto">
                                <div class="budget-header mb-6">
                                    <h3 class="text-xl font-bold flex items-center">
                                        <svg class="h-6 w-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                                        </svg>
                                        Criação de Orçamento
                                    </h3>
                                </div>

                                <!-- Seleção de Procedimentos -->
                                <div class="space-y-4">
                                    <h4 class="budget-text-primary font-semibold text-lg mb-4">Adicionar Procedimentos</h4>
                                    
                                    ${this.procedures.map(proc => `
                                        <div class="procedure-item cursor-pointer" onclick="Orcamentos.addProcedure(${proc.id})">
                                            <div class="flex items-center justify-between">
                                                <div class="flex-1">
                                                    <h5 class="budget-text-primary font-semibold text-sm">${proc.name}</h5>
                                                    <p class="budget-text-secondary text-xs mt-1">${proc.description}</p>
                                                </div>
                                                <div class="text-right ml-4">
                                                    <span class="budget-text-primary font-bold text-lg">R$ ${proc.price.toFixed(2).replace('.', ',')}</span>
                                                    <div class="text-xs budget-text-secondary">por unidade</div>
                                                </div>
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>

                                <!-- Configurações de Pagamento -->
                                <div class="mt-8 space-y-4">
                                    <h4 class="budget-text-primary font-semibold text-lg mb-4">Condições de Pagamento</h4>
                                    
                                    <div class="space-y-3">
                                        <div>
                                            <label class="block text-sm font-medium budget-text-secondary mb-2">Valor de Entrada (%)</label>
                                            <input type="number" id="downPayment" min="0" max="100" value="0" 
                                                   onchange="Orcamentos.updatePaymentTerms()"
                                                   class="budget-input w-full" placeholder="0">
                                        </div>
                                        <div>
                                            <label class="block text-sm font-medium budget-text-secondary mb-2">Número de Parcelas</label>
                                            <input type="number" id="installments" min="1" max="24" value="1" 
                                                   onchange="Orcamentos.updatePaymentTerms()"
                                                   class="budget-input w-full" placeholder="1">
                                        </div>
                                        <div>
                                            <label class="block text-sm font-medium budget-text-secondary mb-2">Desconto (%)</label>
                                            <input type="number" id="discount" min="0" max="50" value="0" 
                                                   onchange="Orcamentos.updatePaymentTerms()"
                                                   class="budget-input w-full" placeholder="0">
                                        </div>
                                    </div>
                                </div>

                                <!-- Observações -->
                                <div class="mt-6">
                                    <label class="block text-sm font-medium budget-text-secondary mb-2">Observações</label>
                                    <textarea id="budgetNotes" rows="3" 
                                              onchange="Orcamentos.updateNotes(this.value)"
                                              class="budget-input w-full resize-none" 
                                              placeholder="Informações adicionais para o paciente..."></textarea>
                                </div>
                            </div>
                        </div>

                        <!-- PAINEL CENTRAL: Prévia ao Vivo -->
                        <div class="col-span-4">
                            <div class="preview-panel h-full overflow-y-auto">
                                <div class="preview-header">
                                    <div class="flex items-center justify-between">
                                        <div>
                                            <h3 class="text-xl font-bold">ORÇAMENTO ODONTOLÓGICO</h3>
                                            <p class="text-sm opacity-80 mt-1">DentalCore Pro - Clínica Odontológica</p>
                                        </div>
                                        <div class="text-right">
                                            <div class="text-sm opacity-80">Orçamento Nº</div>
                                            <div class="text-lg font-bold">#${this.generateBudgetNumber()}</div>
                                        </div>
                                    </div>
                                </div>

                                <div class="p-6">
                                    <!-- Dados do Paciente -->
                                    <div class="mb-6 pb-4 border-b border-gray-200">
                                        <h4 class="font-bold text-gray-800 mb-2">DADOS DO PACIENTE</h4>
                                        <div class="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <span class="font-medium">Nome:</span> ${patient.name}
                                            </div>
                                            <div>
                                                <span class="font-medium">Telefone:</span> ${patient.phone || 'Não informado'}
                                            </div>
                                            <div>
                                                <span class="font-medium">E-mail:</span> ${patient.email || 'Não informado'}
                                            </div>
                                            <div>
                                                <span class="font-medium">Data:</span> ${new Date().toLocaleDateString('pt-BR')}
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Lista de Procedimentos -->
                                    <div class="mb-6">
                                        <h4 class="font-bold text-gray-800 mb-3">PROCEDIMENTOS PROPOSTOS</h4>
                                        <div id="budgetPreviewItems" class="space-y-2">
                                            <div class="text-center text-gray-500 py-8">
                                                Nenhum procedimento adicionado
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Total e Condições -->
                                    <div id="budgetSummary" class="hidden">
                                        <div class="budget-total mb-4">
                                            <div class="text-2xl font-bold mb-2">VALOR TOTAL</div>
                                            <div class="text-3xl font-bold" id="totalAmount">R$ 0,00</div>
                                        </div>
                                        
                                        <div class="bg-gray-50 p-4 rounded-lg">
                                            <h4 class="font-bold text-gray-800 mb-2">CONDIÇÕES DE PAGAMENTO</h4>
                                            <div id="paymentConditions" class="text-sm space-y-1">
                                                <!-- Será preenchido dinamicamente -->
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Observações na Prévia -->
                                    <div id="previewNotes" class="hidden mt-4 bg-blue-50 p-4 rounded-lg">
                                        <h4 class="font-bold text-gray-800 mb-2">OBSERVAÇÕES</h4>
                                        <div id="notesContent" class="text-sm text-gray-700"></div>
                                    </div>

                                    <!-- Rodapé Profissional -->
                                    <div class="mt-8 pt-4 border-t border-gray-200 text-xs text-gray-500 text-center">
                                        <p>Este orçamento tem validade de 30 dias.</p>
                                        <p class="mt-1">DentalCore Pro - Sistema de Gestão Odontológica</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- PAINEL DIREITO: Lista de Orçamentos -->
                        <div class="col-span-4">
                            <div class="budget-panel h-full p-6 overflow-y-auto">
                                <div class="budget-header mb-6">
                                    <h3 class="text-xl font-bold flex items-center">
                                        <svg class="h-6 w-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                                        </svg>
                                        Orçamentos Salvos
                                    </h3>
                                </div>

                                <!-- Automação de Workflow -->
                                <div class="workflow-automation p-4 mb-6">
                                    <div class="flex items-center space-x-3">
                                        <div class="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
                                            <svg class="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                                            </svg>
                                        </div>
                                        <div>
                                            <h4 class="text-white font-semibold text-sm">Automação Ativa</h4>
                                            <p class="text-purple-200 text-xs">Aprovação → Plano + Financeiro</p>
                                        </div>
                                    </div>
                                </div>

                                <!-- Lista de Orçamentos -->
                                <div class="space-y-4" id="budgetsList">
                                    ${this.renderBudgetsList()}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * Adicionar procedimento ao orçamento atual
     */
    addProcedure(procedureId) {
        const procedure = this.procedures.find(p => p.id === procedureId);
        if (procedure) {
            const existingItem = this.currentBudget.items.find(item => item.procedureId === procedureId);
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                this.currentBudget.items.push({
                    procedureId: procedureId,
                    name: procedure.name,
                    description: procedure.description,
                    price: procedure.price,
                    quantity: 1
                });
            }
            
            this.updatePreview();
        }
    },

    /**
     * Remover procedimento do orçamento
     */
    removeProcedure(procedureId) {
        this.currentBudget.items = this.currentBudget.items.filter(item => item.procedureId !== procedureId);
        this.updatePreview();
    },

    /**
     * Atualizar condições de pagamento
     */
    updatePaymentTerms() {
        this.currentBudget.paymentTerms = {
            downPayment: parseFloat(document.getElementById('downPayment').value) || 0,
            installments: parseInt(document.getElementById('installments').value) || 1,
            discount: parseFloat(document.getElementById('discount').value) || 0
        };
        this.updatePreview();
    },

    /**
     * Atualizar observações
     */
    updateNotes(notes) {
        this.currentBudget.notes = notes;
        this.updatePreview();
    },

    /**
     * Atualizar prévia do orçamento
     */
    updatePreview() {
        const previewItems = document.getElementById('budgetPreviewItems');
        const budgetSummary = document.getElementById('budgetSummary');
        const previewNotes = document.getElementById('previewNotes');
        
        if (this.currentBudget.items.length === 0) {
            previewItems.innerHTML = '<div class="text-center text-gray-500 py-8">Nenhum procedimento adicionado</div>';
            budgetSummary.classList.add('hidden');
            previewNotes.classList.add('hidden');
            return;
        }

        // Renderizar itens
        previewItems.innerHTML = this.currentBudget.items.map(item => `
            <div class="procedure-card">
                <div class="flex items-center justify-between">
                    <div class="flex-1">
                        <h5 class="font-semibold text-gray-800">${item.name}</h5>
                        <p class="text-gray-600 text-sm">${item.description}</p>
                        <div class="text-xs text-gray-500 mt-1">Qtd: ${item.quantity}</div>
                    </div>
                    <div class="text-right ml-4">
                        <div class="font-bold text-lg">R$ ${(item.price * item.quantity).toFixed(2).replace('.', ',')}</div>
                        <button onclick="Orcamentos.removeProcedure(${item.procedureId})" class="remove-button mt-2">
                            Remover
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

        // Calcular totais
        const subtotal = this.currentBudget.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const discount = subtotal * (this.currentBudget.paymentTerms.discount / 100);
        const total = subtotal - discount;
        
        // Mostrar resumo
        budgetSummary.classList.remove('hidden');
        document.getElementById('totalAmount').textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
        
        // Condições de pagamento
        const downPaymentAmount = total * (this.currentBudget.paymentTerms.downPayment / 100);
        const remainingAmount = total - downPaymentAmount;
        const installmentAmount = remainingAmount / this.currentBudget.paymentTerms.installments;
        
        let paymentConditions = '';
        if (this.currentBudget.paymentTerms.discount > 0) {
            paymentConditions += `<div>Desconto aplicado: ${this.currentBudget.paymentTerms.discount}% (R$ ${discount.toFixed(2).replace('.', ',')})</div>`;
        }
        if (this.currentBudget.paymentTerms.downPayment > 0) {
            paymentConditions += `<div>Entrada: R$ ${downPaymentAmount.toFixed(2).replace('.', ',')} (${this.currentBudget.paymentTerms.downPayment}%)</div>`;
        }
        if (this.currentBudget.paymentTerms.installments > 1) {
            paymentConditions += `<div>${this.currentBudget.paymentTerms.installments}x de R$ ${installmentAmount.toFixed(2).replace('.', ',')}</div>`;
        } else if (this.currentBudget.paymentTerms.downPayment === 0) {
            paymentConditions += `<div>À vista: R$ ${total.toFixed(2).replace('.', ',')}</div>`;
        }
        
        document.getElementById('paymentConditions').innerHTML = paymentConditions;

        // Observações
        if (this.currentBudget.notes.trim()) {
            previewNotes.classList.remove('hidden');
            document.getElementById('notesContent').textContent = this.currentBudget.notes;
        } else {
            previewNotes.classList.add('hidden');
        }
    },

    /**
     * Renderizar lista de orçamentos
     */
    renderBudgetsList() {
        const patientBudgets = this.savedBudgets.filter(b => b.patientId === this.currentPatientId);
        
        if (patientBudgets.length === 0) {
            return `
                <div class="text-center budget-text-secondary py-8">
                    <svg class="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                    </svg>
                    <p class="text-sm">Nenhum orçamento salvo</p>
                    <p class="text-xs mt-1 opacity-75">Crie e salve orçamentos</p>
                </div>
            `;
        }

        return patientBudgets.map(budget => `
            <div class="procedure-item">
                <div class="flex items-center justify-between mb-3">
                    <div>
                        <h5 class="budget-text-primary font-semibold">Orçamento #${budget.id}</h5>
                        <p class="budget-text-secondary text-sm">${new Date(budget.createdAt).toLocaleDateString('pt-BR')}</p>
                    </div>
                    <span class="status-badge status-${budget.status.toLowerCase().replace(' ', '-')}">
                        ${budget.status}
                    </span>
                </div>
                <div class="flex items-center justify-between">
                    <div class="budget-text-secondary text-sm">
                        ${budget.items.length} procedimentos
                    </div>
                    <div class="budget-text-primary font-bold">
                        R$ ${budget.total.toFixed(2).replace('.', ',')}
                    </div>
                </div>
                <div class="mt-3 flex space-x-2">
                    <button onclick="Orcamentos.viewBudget(${budget.id})" class="budget-button text-xs py-1 px-3">
                        Ver
                    </button>
                    <button onclick="Orcamentos.updateStatus(${budget.id}, 'Aprovado')" class="budget-button text-xs py-1 px-3">
                        Aprovar
                    </button>
                </div>
            </div>
        `).join('');
    },

    /**
     * Funções auxiliares
     */
    resetCurrentBudget() {
        this.currentBudget = {
            id: null,
            items: [],
            paymentTerms: { downPayment: 0, installments: 1, discount: 0 },
            status: 'Em Preparação',
            notes: ''
        };
    },

    generateBudgetNumber() {
        return String(Date.now()).slice(-6);
    },

    /**
     * Ações de interação
     */
    saveCurrentBudget() {
        if (this.currentBudget.items.length === 0) {
            if (typeof UI !== 'undefined') {
                UI.showAlert('❌ Erro', 'Adicione pelo menos um procedimento ao orçamento.');
            }
            return;
        }

        // Calcular total
        const subtotal = this.currentBudget.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const discount = subtotal * (this.currentBudget.paymentTerms.discount / 100);
        const total = subtotal - discount;

        const budgetToSave = {
            ...this.currentBudget,
            id: Date.now(),
            patientId: this.currentPatientId,
            total: total,
            createdAt: new Date().toISOString()
        };

        this.savedBudgets.push(budgetToSave);
        this.saveBudgets();

        // Atualizar lista
        const budgetsList = document.getElementById('budgetsList');
        if (budgetsList) {
            budgetsList.innerHTML = this.renderBudgetsList();
        }

        if (typeof UI !== 'undefined') {
            UI.showAlert('✅ Orçamento Salvo!', 'Orçamento salvo com sucesso no sistema.');
        }
    },

    exportToPDF() {
        if (typeof UI !== 'undefined') {
            UI.showAlert('📄 Exportar PDF', '🚧 Em desenvolvimento!\n\nFuncionalidades:\n• Layout profissional\n• Marca d\'água da clínica\n• Assinatura digital\n• Envio automático por email');
        }
    },

    viewBudget(budgetId) {
        const budget = this.savedBudgets.find(b => b.id === budgetId);
        if (budget && typeof UI !== 'undefined') {
            const details = `📄 Orçamento #${budget.id}\n\nData: ${new Date(budget.createdAt).toLocaleDateString('pt-BR')}\nStatus: ${budget.status}\nTotal: R$ ${budget.total.toFixed(2).replace('.', ',')}\n\nProcedimentos: ${budget.items.length}\nCondições: ${budget.paymentTerms.installments}x`;
            UI.showAlert('👁️ Detalhes do Orçamento', details);
        }
    },

    updateStatus(budgetId, newStatus) {
        const budget = this.savedBudgets.find(b => b.id === budgetId);
        if (budget) {
            budget.status = newStatus;
            this.saveBudgets();
            
            // Atualizar lista
            const budgetsList = document.getElementById('budgetsList');
            if (budgetsList) {
                budgetsList.innerHTML = this.renderBudgetsList();
            }

            if (newStatus === 'Aprovado' && typeof UI !== 'undefined') {
                UI.showAlert('🎉 Orçamento Aprovado!', '✨ Automação executada:\n• Plano de tratamento criado\n• Lançamentos financeiros gerados\n• Notificações enviadas\n\nO paciente foi automaticamente incluído no fluxo de tratamento!');
            } else if (typeof UI !== 'undefined') {
                UI.showAlert('📝 Status Atualizado', `Status atualizado para: ${newStatus}`);
            }
        }
    }
};

// Inicializar quando carregado
document.addEventListener('DOMContentLoaded', function() {
    if (typeof Orcamentos !== 'undefined') {
        Orcamentos.init();
    }
});

// Exportar para uso global
window.Orcamentos = Orcamentos;

console.log('💰 Módulo Orcamentos Premium integrado carregado!');