// ============================================================================
// DENTALCORE PRO - MÓDULO DE ORÇAMENTOS PROFISSIONAL
// Interface sofisticada para criação e gestão de propostas
// ============================================================================

const Budgets = {
    currentBudget: null,
    procedures: [],
    selectedProcedures: [],
    budgetsList: [],
    teethChart: new Set(),

    /**
     * Inicializar módulo
     */
    init() {
        this.loadBudgets();
        this.loadProcedures();
        this.addCustomStyles();
        console.log('💰 Módulo de Orçamentos Profissional carregado');
    },

    /**
     * Renderizar interface principal de orçamentos
     */
    renderBudgetsInterface() {
        return `
            <div class="budgets-workspace">
                <div class="workspace-container">
                    
                    <!-- Header -->
                    <div class="workspace-header">
                        <div class="header-content">
                            <div class="header-info">
                                <h1 class="workspace-title">Orçamentos</h1>
                                <p class="workspace-subtitle">Criação e gestão de propostas de tratamento</p>
                            </div>
                            <div class="header-actions">
                                <button onclick="Budgets.newBudget()" class="primary-action-btn">
                                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                                    </svg>
                                    Novo Orçamento
                                </button>
                                <button onclick="Budgets.exportBudgets()" class="secondary-action-btn">
                                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                                    </svg>
                                    Exportar
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Main Workspace -->
                    <div class="workspace-main">
                        
                        <!-- Left Panel: Criação de Orçamento -->
                        <div class="creation-panel">
                            <div class="panel-header">
                                <h2 class="panel-title">Criar Novo Orçamento</h2>
                                <p class="panel-subtitle">Adicione procedimentos e gere propostas profissionais</p>
                            </div>

                            <!-- Informações do Paciente -->
                            <div class="patient-info-section">
                                <h3 class="section-title">Informações do Paciente</h3>
                                <div class="form-grid">
                                    <div class="form-group">
                                        <label class="form-label">Paciente</label>
                                        <select id="budgetPatient" class="form-select" onchange="Budgets.selectPatient(this.value)">
                                            <option value="">Selecione o paciente</option>
                                            ${this.renderPatientsOptions()}
                                        </select>
                                    </div>
                                    <div class="form-group">
                                        <label class="form-label">Data do Orçamento</label>
                                        <input type="date" id="budgetDate" class="form-input" value="${new Date().toISOString().split('T')[0]}">
                                    </div>
                                </div>
                            </div>

                            <!-- Busca de Procedimentos -->
                            <div class="procedures-section">
                                <h3 class="section-title">Buscar Procedimentos</h3>
                                <div class="search-container">
                                    <div class="search-input-container">
                                        <input type="text" 
                                               id="procedureSearch" 
                                               class="procedure-search-input"
                                               placeholder="Digite o nome do procedimento..."
                                               oninput="Budgets.searchProcedures(this.value)"
                                               autocomplete="off">
                                        <svg class="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                                        </svg>
                                    </div>
                                    
                                    <!-- Lista Dinâmica de Procedimentos -->
                                    <div id="procedureResults" class="procedure-results hidden">
                                        <!-- Preenchido dinamicamente -->
                                    </div>
                                </div>
                            </div>

                            <!-- Odontograma Interativo -->
                            <div class="odontogram-section">
                                <h3 class="section-title">Seleção de Dentes</h3>
                                <div class="odontogram-container">
                                    ${this.renderOdontogram()}
                                </div>
                                <div class="teeth-input-group">
                                    <input type="text" 
                                           id="manualTeeth" 
                                           class="teeth-input"
                                           placeholder="Ex: 11, 12, 21-24, arcada superior"
                                           oninput="Budgets.parseTeethInput(this.value)">
                                </div>
                            </div>

                            <!-- Procedimentos Selecionados -->
                            <div class="selected-procedures-section">
                                <h3 class="section-title">Procedimentos Selecionados</h3>
                                <div id="selectedProceduresList" class="selected-procedures-list">
                                    ${this.renderSelectedProcedures()}
                                </div>
                            </div>
                        </div>

                        <!-- Center Panel: Pré-visualização do Orçamento -->
                        <div class="preview-panel">
                            <div class="panel-header">
                                <h2 class="panel-title">Pré-visualização</h2>
                                <div class="preview-actions">
                                    <button onclick="Budgets.generatePDF()" class="pdf-btn">
                                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                                        </svg>
                                        Exportar PDF
                                    </button>
                                </div>
                            </div>

                            <!-- Documento de Orçamento -->
                            <div class="budget-document">
                                <div class="document-header">
                                    <div class="clinic-info">
                                        <h3 class="clinic-name">DentalCore Pro</h3>
                                        <p class="clinic-details">Sistema Odontológico Profissional</p>
                                    </div>
                                    <div class="document-info">
                                        <div class="document-number">Orçamento #<span id="budgetNumber">001</span></div>
                                        <div class="document-date" id="documentDate">${new Date().toLocaleDateString('pt-BR')}</div>
                                    </div>
                                </div>

                                <div class="patient-details" id="documentPatient">
                                    <h4 class="patient-name">Selecione um paciente</h4>
                                    <p class="patient-info">Para gerar o orçamento</p>
                                </div>

                                <div class="procedures-table">
                                    <div class="table-header">
                                        <div class="col-description">Procedimento</div>
                                        <div class="col-teeth">Dentes</div>
                                        <div class="col-unit">Valor Unit.</div>
                                        <div class="col-qty">Qtd</div>
                                        <div class="col-total">Total</div>
                                    </div>
                                    <div id="documentProcedures" class="table-body">
                                        <div class="empty-table">
                                            <p>Nenhum procedimento adicionado</p>
                                        </div>
                                    </div>
                                </div>

                                <div class="budget-summary">
                                    <div class="summary-row">
                                        <span class="summary-label">Subtotal:</span>
                                        <span class="summary-value" id="documentSubtotal">R$ 0,00</span>
                                    </div>
                                    <div class="summary-row total-row">
                                        <span class="summary-label">Total Geral:</span>
                                        <span class="summary-value" id="documentTotal">R$ 0,00</span>
                                    </div>
                                </div>

                                <div class="payment-terms">
                                    <h4 class="terms-title">Condições de Pagamento</h4>
                                    <div class="payment-options">
                                        <label class="payment-option">
                                            <input type="radio" name="paymentType" value="cash" checked onchange="Budgets.updatePaymentTerms()">
                                            <span>À vista</span>
                                        </label>
                                        <label class="payment-option">
                                            <input type="radio" name="paymentType" value="installments" onchange="Budgets.updatePaymentTerms()">
                                            <span>Parcelado</span>
                                        </label>
                                    </div>
                                    <div id="paymentDetails" class="payment-details">
                                        <p>Pagamento à vista com desconto de 5%</p>
                                    </div>
                                </div>

                                <div class="document-footer">
                                    <div class="notes-section">
                                        <h4 class="notes-title">Observações</h4>
                                        <textarea id="budgetNotes" 
                                                  class="notes-textarea" 
                                                  placeholder="Adicione observações personalizadas para o paciente..."
                                                  oninput="Budgets.updateNotes()"></textarea>
                                    </div>
                                </div>
                            </div>

                            <!-- Ações do Orçamento -->
                            <div class="budget-actions">
                                <button onclick="Budgets.saveBudget('draft')" class="action-btn draft-btn">
                                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
                                    </svg>
                                    Salvar Rascunho
                                </button>
                                <button onclick="Budgets.saveBudget('sent')" class="action-btn sent-btn">
                                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
                                    </svg>
                                    Enviar Orçamento
                                </button>
                            </div>
                        </div>

                        <!-- Right Panel: Lista de Orçamentos -->
                        <div class="budgets-list-panel">
                            <div class="panel-header">
                                <h2 class="panel-title">Orçamentos Atuais</h2>
                                <div class="list-actions">
                                    <button onclick="Budgets.filterBudgets('all')" class="filter-btn active" data-filter="all">
                                        Todos
                                    </button>
                                    <button onclick="Budgets.filterBudgets('draft')" class="filter-btn" data-filter="draft">
                                        Rascunhos
                                    </button>
                                    <button onclick="Budgets.filterBudgets('sent')" class="filter-btn" data-filter="sent">
                                        Enviados
                                    </button>
                                </div>
                            </div>

                            <div class="budgets-list" id="budgetsList">
                                ${this.renderBudgetsList()}
                            </div>

                            <!-- Fluxo Automatizado -->
                            <div class="automation-info">
                                <div class="automation-icon">
                                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                                    </svg>
                                </div>
                                <div class="automation-text">
                                    <h4 class="automation-title">Fluxo Automatizado</h4>
                                    <p class="automation-description">
                                        Quando aprovado, o sistema cria automaticamente o plano de tratamento e lançamentos financeiros
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * Renderizar odontograma interativo
     */
    renderOdontogram() {
        return `
            <div class="odontogram">
                <!-- Arcada Superior -->
                <div class="dental-arch upper-arch">
                    <div class="arch-label">Arcada Superior</div>
                    <div class="teeth-row">
                        ${Array.from({length: 8}, (_, i) => {
                            const toothNum = 18 - i;
                            return `<button class="tooth-btn" data-tooth="${toothNum}" onclick="Budgets.toggleTooth(${toothNum})">${toothNum}</button>`;
                        }).join('')}
                        ${Array.from({length: 8}, (_, i) => {
                            const toothNum = 21 + i;
                            return `<button class="tooth-btn" data-tooth="${toothNum}" onclick="Budgets.toggleTooth(${toothNum})">${toothNum}</button>`;
                        }).join('')}
                    </div>
                </div>

                <!-- Arcada Inferior -->
                <div class="dental-arch lower-arch">
                    <div class="teeth-row">
                        ${Array.from({length: 8}, (_, i) => {
                            const toothNum = 48 - i;
                            return `<button class="tooth-btn" data-tooth="${toothNum}" onclick="Budgets.toggleTooth(${toothNum})">${toothNum}</button>`;
                        }).join('')}
                        ${Array.from({length: 8}, (_, i) => {
                            const toothNum = 31 + i;
                            return `<button class="tooth-btn" data-tooth="${toothNum}" onclick="Budgets.toggleTooth(${toothNum})">${toothNum}</button>`;
                        }).join('')}
                    </div>
                    <div class="arch-label">Arcada Inferior</div>
                </div>
            </div>
        `;
    },

    /**
     * Renderizar opções de pacientes
     */
    renderPatientsOptions() {
        const patients = DataPersistence.getPatients();
        return patients.map(patient => 
            `<option value="${patient.id}">${patient.name}</option>`
        ).join('');
    },

    /**
     * Renderizar procedimentos selecionados
     */
    renderSelectedProcedures() {
        if (this.selectedProcedures.length === 0) {
            return `
                <div class="empty-procedures">
                    <svg class="empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                    </svg>
                    <p>Nenhum procedimento selecionado</p>
                    <span>Use a busca acima para adicionar procedimentos</span>
                </div>
            `;
        }

        return this.selectedProcedures.map(proc => `
            <div class="procedure-item" data-id="${proc.id}">
                <div class="procedure-info">
                    <h4 class="procedure-name">${proc.name}</h4>
                    <div class="procedure-details">
                        <span class="procedure-teeth">Dentes: ${proc.teeth.join(', ')}</span>
                        <span class="procedure-category">${proc.category}</span>
                    </div>
                </div>
                <div class="procedure-pricing">
                    <div class="price-input-group">
                        <span class="currency">R$</span>
                        <input type="number" 
                               class="price-input" 
                               value="${proc.unitPrice}" 
                               step="0.01"
                               onchange="Budgets.updateProcedurePrice(${proc.id}, this.value)">
                    </div>
                    <div class="quantity-info">
                        <span class="qty-label">Qtd: ${proc.quantity}</span>
                        <span class="total-price">R$ ${(proc.unitPrice * proc.quantity).toLocaleString('pt-BR', {minimumFractionDigits: 2})}</span>
                    </div>
                </div>
                <button class="remove-procedure" onclick="Budgets.removeProcedure(${proc.id})">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                </button>
            </div>
        `).join('');
    },

    /**
     * Renderizar lista de orçamentos
     */
    renderBudgetsList() {
        if (this.budgetsList.length === 0) {
            return `
                <div class="empty-budgets">
                    <svg class="empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 002 2z"/>
                    </svg>
                    <p>Nenhum orçamento criado</p>
                    <span>Crie seu primeiro orçamento</span>
                </div>
            `;
        }

        return this.budgetsList.map(budget => `
            <div class="budget-card" data-id="${budget.id}" onclick="Budgets.loadBudget('${budget.id}')">
                <div class="budget-header">
                    <div class="budget-info">
                        <h4 class="budget-title">${budget.patientName}</h4>
                        <p class="budget-date">${new Date(budget.date).toLocaleDateString('pt-BR')}</p>
                    </div>
                    <div class="budget-status">
                        <span class="status-badge status-${budget.status}">
                            ${this.getStatusText(budget.status)}
                        </span>
                        ${budget.status === 'approved' ? '<div class="automation-indicator"></div>' : ''}
                    </div>
                </div>
                <div class="budget-content">
                    <div class="budget-summary">
                        <span class="procedures-count">${budget.procedures.length} procedimento(s)</span>
                        <span class="budget-total">R$ ${budget.total.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</span>
                    </div>
                </div>
                <div class="budget-actions">
                    <button onclick="event.stopPropagation(); Budgets.duplicateBudget('${budget.id}')" class="action-btn-small">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                        </svg>
                    </button>
                    <button onclick="event.stopPropagation(); Budgets.updateBudgetStatus('${budget.id}', 'approved')" class="action-btn-small">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                        </svg>
                    </button>
                </div>
            </div>
        `).join('');
    },

    /**
     * FUNCIONALIDADES PRINCIPAIS
     */

    /**
     * Carregar base de dados
     */
    loadProcedures() {
        this.procedures = [
            { id: 1, name: 'Restauração em Resina Composta', category: 'Dentística', price: 150.00 },
            { id: 2, name: 'Limpeza e Profilaxia Dental', category: 'Prevenção', price: 80.00 },
            { id: 3, name: 'Extração Dentária Simples', category: 'Cirurgia', price: 200.00 },
            { id: 4, name: 'Tratamento Endodôntico (Canal)', category: 'Endodontia', price: 800.00 },
            { id: 5, name: 'Coroa em Porcelana', category: 'Prótese', price: 1200.00 },
            { id: 6, name: 'Implante Dentário Unitário', category: 'Implantodontia', price: 2500.00 },
            { id: 7, name: 'Clareamento Dental Profissional', category: 'Estética', price: 500.00 },
            { id: 8, name: 'Aparelho Ortodôntico Fixo', category: 'Ortodontia', price: 3000.00 },
            { id: 9, name: 'Faceta em Porcelana', category: 'Estética', price: 1500.00 },
            { id: 10, name: 'Raspagem Periodontal', category: 'Periodontia', price: 120.00 },
            { id: 11, name: 'Prótese Total (Dentadura)', category: 'Prótese', price: 2000.00 },
            { id: 12, name: 'Cirurgia de Terceiro Molar', category: 'Cirurgia', price: 400.00 },
            { id: 13, name: 'Gengivoplastia', category: 'Periodontia', price: 600.00 },
            { id: 14, name: 'Ponte Fixa (3 elementos)', category: 'Prótese', price: 2400.00 },
            { id: 15, name: 'Aplicação de Flúor', category: 'Prevenção', price: 40.00 }
        ];
    },

    loadBudgets() {
        this.budgetsList = JSON.parse(localStorage.getItem('dentalcore_budgets') || '[]');
    },

    saveBudgets() {
        localStorage.setItem('dentalcore_budgets', JSON.stringify(this.budgetsList));
    },

    /**
     * Buscar procedimentos
     */
    searchProcedures(query) {
        const resultsContainer = document.getElementById('procedureResults');
        
        if (!query.trim()) {
            resultsContainer.classList.add('hidden');
            return;
        }

        const filtered = this.procedures.filter(proc => 
            proc.name.toLowerCase().includes(query.toLowerCase()) ||
            proc.category.toLowerCase().includes(query.toLowerCase())
        );

        if (filtered.length > 0) {
            resultsContainer.innerHTML = filtered.map(proc => `
                <div class="procedure-result" onclick="Budgets.selectProcedure(${proc.id})">
                    <div class="result-info">
                        <h4 class="result-name">${proc.name}</h4>
                        <span class="result-category">${proc.category}</span>
                    </div>
                    <div class="result-price">R$ ${proc.price.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</div>
                </div>
            `).join('');
            resultsContainer.classList.remove('hidden');
        } else {
            resultsContainer.innerHTML = `
                <div class="no-results">
                    <p>Nenhum procedimento encontrado</p>
                </div>
            `;
            resultsContainer.classList.remove('hidden');
        }
    },

    /**
     * Selecionar procedimento
     */
    selectProcedure(procedureId) {
        const procedure = this.procedures.find(p => p.id === procedureId);
        if (!procedure) return;

        // Verificar se há dentes selecionados
        if (this.teethChart.size === 0) {
            UI.showAlert('⚠️ Selecione os dentes\n\nPor favor, selecione pelo menos um dente antes de adicionar um procedimento.');
            return;
        }

        // Criar procedimento selecionado
        const selectedProcedure = {
            id: Date.now(),
            originalId: procedure.id,
            name: procedure.name,
            category: procedure.category,
            unitPrice: procedure.price,
            teeth: Array.from(this.teethChart),
            quantity: this.teethChart.size
        };

        this.selectedProcedures.push(selectedProcedure);

        // Limpar seleções
        this.clearTeethSelection();
        document.getElementById('procedureSearch').value = '';
        document.getElementById('procedureResults').classList.add('hidden');

        // Atualizar interface
        this.updateInterface();
        this.updateOdontogramVisualization();
    },

    /**
     * Toggle seleção de dente
     */
    toggleTooth(toothNumber) {
        const toothBtn = document.querySelector(`[data-tooth="${toothNumber}"]`);
        
        if (this.teethChart.has(toothNumber)) {
            this.teethChart.delete(toothNumber);
            toothBtn.classList.remove('selected');
        } else {
            this.teethChart.add(toothNumber);
            toothBtn.classList.add('selected');
        }

        this.updateTeethInput();
    },

    /**
     * Processar entrada manual de dentes
     */
    parseTeethInput(input) {
        this.teethChart.clear();
        
        const parts = input.split(',');
        parts.forEach(part => {
            part = part.trim().toLowerCase();
            
            // Ranges (11-14)
            if (part.includes('-')) {
                const [start, end] = part.split('-').map(n => parseInt(n.trim()));
                if (!isNaN(start) && !isNaN(end)) {
                    for (let i = Math.min(start, end); i <= Math.max(start, end); i++) {
                        if (this.isValidTooth(i)) this.teethChart.add(i);
                    }
                }
            }
            // Números únicos
            else if (!isNaN(parseInt(part))) {
                const tooth = parseInt(part);
                if (this.isValidTooth(tooth)) this.teethChart.add(tooth);
            }
            // Regiões
            else if (part.includes('superior') || part.includes('inferior')) {
                this.selectArchRegion(part);
            }
        });

        this.updateOdontogramSelection();
    },

    /**
     * Atualizar visualização do odontograma
     */
    updateOdontogramVisualization() {
        // Remover todas as marcas anteriores
        document.querySelectorAll('.tooth-btn.has-procedure').forEach(btn => {
            btn.classList.remove('has-procedure');
        });

        // Marcar dentes com procedimentos
        this.selectedProcedures.forEach(proc => {
            proc.teeth.forEach(tooth => {
                const toothBtn = document.querySelector(`[data-tooth="${tooth}"]`);
                if (toothBtn) {
                    toothBtn.classList.add('has-procedure');
                }
            });
        });
    },

    /**
     * Atualizar toda a interface
     */
    updateInterface() {
        // Atualizar lista de procedimentos selecionados
        document.getElementById('selectedProceduresList').innerHTML = this.renderSelectedProcedures();
        
        // Atualizar documento de orçamento
        this.updateBudgetDocument();
    },

    /**
     * Atualizar documento de orçamento
     */
    updateBudgetDocument() {
        const proceduresTable = document.getElementById('documentProcedures');
        const subtotalEl = document.getElementById('documentSubtotal');
        const totalEl = document.getElementById('documentTotal');

        if (this.selectedProcedures.length === 0) {
            proceduresTable.innerHTML = `
                <div class="empty-table">
                    <p>Nenhum procedimento adicionado</p>
                </div>
            `;
            subtotalEl.textContent = 'R$ 0,00';
            totalEl.textContent = 'R$ 0,00';
            return;
        }

        // Renderizar procedimentos na tabela
        proceduresTable.innerHTML = this.selectedProcedures.map(proc => `
            <div class="table-row">
                <div class="col-description">${proc.name}</div>
                <div class="col-teeth">${proc.teeth.join(', ')}</div>
                <div class="col-unit">R$ ${proc.unitPrice.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</div>
                <div class="col-qty">${proc.quantity}</div>
                <div class="col-total">R$ ${(proc.unitPrice * proc.quantity).toLocaleString('pt-BR', {minimumFractionDigits: 2})}</div>
            </div>
        `).join('');

        // Calcular totais
        const subtotal = this.selectedProcedures.reduce((sum, proc) => sum + (proc.unitPrice * proc.quantity), 0);
        
        subtotalEl.textContent = `R$ ${subtotal.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`;
        totalEl.textContent = `R$ ${subtotal.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`;
    },

    /**
     * Salvar orçamento
     */
    saveBudget(status) {
        const patientId = document.getElementById('budgetPatient').value;
        const budgetDate = document.getElementById('budgetDate').value;
        const notes = document.getElementById('budgetNotes').value;

        if (!patientId) {
            UI.showAlert('❌ Selecione um paciente\n\nPor favor, selecione o paciente para o orçamento.');
            return;
        }

        if (this.selectedProcedures.length === 0) {
            UI.showAlert('❌ Adicione procedimentos\n\nPor favor, adicione pelo menos um procedimento ao orçamento.');
            return;
        }

        const patients = DataPersistence.getPatients();
        const patient = patients.find(p => p.id == patientId);

        const budget = {
            id: Date.now().toString(),
            patientId: patientId,
            patientName: patient ? patient.name : 'Paciente não encontrado',
            date: budgetDate,
            procedures: [...this.selectedProcedures],
            total: this.selectedProcedures.reduce((sum, proc) => sum + (proc.unitPrice * proc.quantity), 0),
            status: status,
            notes: notes,
            createdAt: new Date().toISOString()
        };

        this.budgetsList.push(budget);
        this.saveBudgets();

        // Limpar formulário
        this.clearBudgetForm();

        // Atualizar lista
        document.getElementById('budgetsList').innerHTML = this.renderBudgetsList();

        const statusText = status === 'draft' ? 'Rascunho salvo' : 'Orçamento enviado';
        UI.showAlert(`✅ ${statusText}!\n\nOrçamento para ${patient.name} foi ${status === 'draft' ? 'salvo como rascunho' : 'enviado'} com sucesso.\n\nTotal: R$ ${budget.total.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`);
    },

    /**
     * FUNÇÕES AUXILIARES
     */
    
    clearTeethSelection() {
        this.teethChart.clear();
        document.querySelectorAll('.tooth-btn.selected').forEach(btn => {
            btn.classList.remove('selected');
        });
        document.getElementById('manualTeeth').value = '';
    },

    clearBudgetForm() {
        this.selectedProcedures = [];
        this.clearTeethSelection();
        document.getElementById('budgetPatient').value = '';
        document.getElementById('budgetNotes').value = '';
        document.getElementById('procedureSearch').value = '';
        this.updateInterface();
        this.updateOdontogramVisualization();
    },

    updateTeethInput() {
        const selectedTeeth = Array.from(this.teethChart).sort((a, b) => a - b);
        document.getElementById('manualTeeth').value = selectedTeeth.join(', ');
    },

    updateOdontogramSelection() {
        document.querySelectorAll('.tooth-btn').forEach(btn => {
            const toothNumber = parseInt(btn.dataset.tooth);
            if (this.teethChart.has(toothNumber)) {
                btn.classList.add('selected');
            } else {
                btn.classList.remove('selected');
            }
        });
    },

    isValidTooth(toothNumber) {
        return (toothNumber >= 11 && toothNumber <= 18) ||
               (toothNumber >= 21 && toothNumber <= 28) ||
               (toothNumber >= 31 && toothNumber <= 38) ||
               (toothNumber >= 41 && toothNumber <= 48);
    },

    selectArchRegion(region) {
        if (region.includes('superior')) {
            if (region.includes('direito')) {
                for (let i = 11; i <= 18; i++) this.teethChart.add(i);
            } else if (region.includes('esquerdo')) {
                for (let i = 21; i <= 28; i++) this.teethChart.add(i);
            } else {
                for (let i = 11; i <= 28; i++) this.teethChart.add(i);
            }
        } else if (region.includes('inferior')) {
            if (region.includes('direito')) {
                for (let i = 41; i <= 48; i++) this.teethChart.add(i);
            } else if (region.includes('esquerdo')) {
                for (let i = 31; i <= 38; i++) this.teethChart.add(i);
            } else {
                for (let i = 31; i <= 48; i++) this.teethChart.add(i);
            }
        }
    },

    getStatusText(status) {
        const statusMap = {
            'draft': 'Em Elaboração',
            'sent': 'Enviado',
            'approved': 'Aprovado',
            'rejected': 'Recusado'
        };
        return statusMap[status] || status;
    },

    selectPatient(patientId) {
        if (!patientId) return;
        
        const patients = DataPersistence.getPatients();
        const patient = patients.find(p => p.id == patientId);
        
        if (patient) {
            const patientDetails = document.getElementById('documentPatient');
            patientDetails.innerHTML = `
                <h4 class="patient-name">${patient.name}</h4>
                <p class="patient-info">${patient.phone ? `Tel: ${patient.phone}` : ''} ${patient.email ? `• ${patient.email}` : ''}</p>
            `;
        }
    },

    updatePaymentTerms() {
        const paymentType = document.querySelector('input[name="paymentType"]:checked').value;
        const paymentDetails = document.getElementById('paymentDetails');
        
        if (paymentType === 'cash') {
            paymentDetails.innerHTML = '<p>Pagamento à vista com desconto de 5%</p>';
        } else {
            paymentDetails.innerHTML = `
                <div class="installment-options">
                    <label><input type="radio" name="installments" value="3"> 3x sem juros</label>
                    <label><input type="radio" name="installments" value="6"> 6x com juros de 2% a.m.</label>
                    <label><input type="radio" name="installments" value="12"> 12x com juros de 3% a.m.</label>
                </div>
            `;
        }
    },

    updateNotes() {
        // Função para atualizar observações em tempo real
    },

    removeProcedure(procedureId) {
        this.selectedProcedures = this.selectedProcedures.filter(p => p.id !== procedureId);
        this.updateInterface();
        this.updateOdontogramVisualization();
    },

    updateProcedurePrice(procedureId, newPrice) {
        const procedure = this.selectedProcedures.find(p => p.id === procedureId);
        if (procedure) {
            procedure.unitPrice = parseFloat(newPrice) || 0;
            this.updateBudgetDocument();
        }
    },

    newBudget() {
        this.clearBudgetForm();
        UI.showAlert('✨ Novo Orçamento\n\nFormulário limpo e pronto para um novo orçamento!');
    },

    generatePDF() {
        UI.showAlert('📄 Exportar PDF\n\n🚧 Funcionalidade será implementada!\n\nGerará um PDF profissional do orçamento.');
    },

    exportBudgets() {
        UI.showAlert('📤 Exportar Orçamentos\n\n🚧 Funcionalidade será implementada!\n\nFormatos:\n• PDF\n• Excel\n• CSV');
    },

    filterBudgets(filter) {
        // Atualizar botões de filtro
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-filter="${filter}"]`).classList.add('active');
        
        // Aplicar filtro (implementar lógica de filtro)
        console.log('Filtrar por:', filter);
    },

    loadBudget(budgetId) {
        console.log('Carregar orçamento:', budgetId);
        UI.showAlert('📋 Carregar Orçamento\n\n🚧 Funcionalidade será implementada!\n\nCarregará o orçamento para edição.');
    },

    duplicateBudget(budgetId) {
        console.log('Duplicar orçamento:', budgetId);
        UI.showAlert('📋 Duplicar Orçamento\n\n🚧 Funcionalidade será implementada!');
    },

    updateBudgetStatus(budgetId, newStatus) {
        const budget = this.budgetsList.find(b => b.id === budgetId);
        if (budget) {
            budget.status = newStatus;
            this.saveBudgets();
            
            if (newStatus === 'approved') {
                // Simular fluxo automatizado
                UI.showAlert(`✅ Orçamento Aprovado!\n\n🚀 Fluxo automatizado ativado:\n\n• Plano de tratamento criado\n• Lançamentos financeiros gerados\n• Paciente notificado\n\nOrçamento: ${budget.patientName}\nTotal: R$ ${budget.total.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`);
            }
            
            // Atualizar lista
            document.getElementById('budgetsList').innerHTML = this.renderBudgetsList();
        }
    },

    /**
     * Carregar estilos CSS
     */
    addCustomStyles() {
        if (!document.getElementById('budgetsStyles')) {
            const styles = document.createElement('style');
            styles.id = 'budgetsStyles';
            styles.textContent = `
                .budgets-workspace {
                    background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
                    min-height: 100vh;
                    padding: 24px;
                }

                .workspace-container {
                    max-width: 1600px;
                    margin: 0 auto;
                }

                .workspace-header {
                    background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
                    border: 1px solid rgba(71, 85, 105, 0.3);
                    border-radius: 20px;
                    padding: 24px 32px;
                    margin-bottom: 24px;
                    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3);
                }

                .header-content {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .workspace-title {
                    font-size: 32px;
                    font-weight: 300;
                    color: #f8fafc;
                    margin: 0;
                    letter-spacing: -0.02em;
                }

                .workspace-subtitle {
                    color: #94a3b8;
                    margin: 4px 0 0 0;
                    font-size: 16px;
                }

                .header-actions {
                    display: flex;
                    gap: 12px;
                }

                .primary-action-btn {
                    background: linear-gradient(135deg, #0d9488 0%, #14b8a6 100%);
                    border: none;
                    border-radius: 12px;
                    color: white;
                    padding: 12px 24px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    box-shadow: 0 4px 15px rgba(13, 148, 136, 0.3);
                }

                .primary-action-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 25px rgba(13, 148, 136, 0.4);
                }

                .secondary-action-btn {
                    background: rgba(71, 85, 105, 0.3);
                    border: 1px solid rgba(71, 85, 105, 0.5);
                    border-radius: 12px;
                    color: #e2e8f0;
                    padding: 12px 24px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                }

                .secondary-action-btn:hover {
                    background: rgba(71, 85, 105, 0.5);
                    transform: translateY(-1px);
                }

                .workspace-main {
                    display: grid;
                    grid-template-columns: 1fr 1fr 400px;
                    gap: 24px;
                    min-height: 800px;
                }

                .creation-panel, .preview-panel, .budgets-list-panel {
                    background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
                    border: 1px solid rgba(71, 85, 105, 0.3);
                    border-radius: 20px;
                    padding: 24px;
                    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3);
                }

                .panel-header {
                    margin-bottom: 24px;
                    padding-bottom: 16px;
                    border-bottom: 1px solid rgba(71, 85, 105, 0.3);
                }

                .panel-title {
                    font-size: 20px;
                    font-weight: 600;
                    color: #f8fafc;
                    margin: 0 0 4px 0;
                }

                .panel-subtitle {
                    color: #94a3b8;
                    font-size: 14px;
                    margin: 0;
                }

                .section-title {
                    font-size: 16px;
                    font-weight: 600;
                    color: #f1f5f9;
                    margin: 0 0 12px 0;
                }

                .form-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 16px;
                    margin-bottom: 24px;
                }

                .form-group {
                    display: flex;
                    flex-direction: column;
                }

                .form-label {
                    color: #cbd5e1;
                    font-size: 14px;
                    font-weight: 500;
                    margin-bottom: 6px;
                }

                .form-input, .form-select {
                    background: rgba(30, 41, 59, 0.8);
                    border: 1px solid rgba(71, 85, 105, 0.5);
                    border-radius: 8px;
                    color: #f1f5f9;
                    padding: 10px 12px;
                    font-size: 14px;
                    transition: all 0.3s ease;
                }

                .form-input:focus, .form-select:focus {
                    outline: none;
                    border-color: #14b8a6;
                    box-shadow: 0 0 0 3px rgba(20, 184, 166, 0.1);
                }

                .search-input-container {
                    position: relative;
                    margin-bottom: 12px;
                }

                .procedure-search-input {
                    width: 100%;
                    background: rgba(30, 41, 59, 0.8);
                    border: 2px solid rgba(71, 85, 105, 0.5);
                    border-radius: 12px;
                    color: #f1f5f9;
                    padding: 14px 16px 14px 48px;
                    font-size: 16px;
                    transition: all 0.3s ease;
                }

                .procedure-search-input:focus {
                    outline: none;
                    border-color: #14b8a6;
                    box-shadow: 0 0 0 4px rgba(20, 184, 166, 0.1);
                }

                .search-icon {
                    position: absolute;
                    left: 16px;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 20px;
                    height: 20px;
                    color: #64748b;
                }

                .procedure-results {
                    background: rgba(15, 23, 42, 0.95);
                    border: 1px solid rgba(71, 85, 105, 0.5);
                    border-radius: 12px;
                    max-height: 300px;
                    overflow-y: auto;
                    backdrop-filter: blur(8px);
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
                }

                .procedure-result {
                    padding: 16px;
                    border-bottom: 1px solid rgba(71, 85, 105, 0.3);
                    cursor: pointer;
                    transition: all 0.2s ease;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .procedure-result:hover {
                    background: rgba(20, 184, 166, 0.1);
                    border-left: 3px solid #14b8a6;
                }

                .result-name {
                    color: #f1f5f9;
                    font-weight: 500;
                    margin: 0 0 4px 0;
                    font-size: 14px;
                }

                .result-category {
                    color: #94a3b8;
                    font-size: 12px;
                }

                .result-price {
                    color: #14b8a6;
                    font-weight: 600;
                    font-size: 16px;
                }

                .odontogram {
                    background: rgba(15, 23, 42, 0.8);
                    border: 1px solid rgba(71, 85, 105, 0.3);
                    border-radius: 12px;
                    padding: 20px;
                    margin-bottom: 16px;
                }

                .dental-arch {
                    margin-bottom: 16px;
                }

                .arch-label {
                    text-align: center;
                    color: #94a3b8;
                    font-size: 12px;
                    font-weight: 500;
                    margin-bottom: 8px;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                .teeth-row {
                    display: flex;
                    justify-content: center;
                    gap: 4px;
                    margin-bottom: 8px;
                }

                .tooth-btn {
                    width: 32px;
                    height: 32px;
                    background: linear-gradient(145deg, #475569 0%, #334155 100%);
                    border: 2px solid #64748b;
                    border-radius: 6px;
                    color: #e2e8f0;
                    font-weight: 600;
                    font-size: 11px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .tooth-btn:hover {
                    background: linear-gradient(145deg, #64748b 0%, #475569 100%);
                    transform: translateY(-1px);
                }

                .tooth-btn.selected {
                    background: linear-gradient(145deg, #14b8a6 0%, #0d9488 100%);
                    border-color: #5eead4;
                    color: white;
                    box-shadow: 0 0 15px rgba(20, 184, 166, 0.4);
                }

                .tooth-btn.has-procedure {
                    background: linear-gradient(145deg, #7c3aed 0%, #6366f1 100%);
                    border-color: #a78bfa;
                    color: white;
                }

                .teeth-input {
                    width: 100%;
                    background: rgba(30, 41, 59, 0.8);
                    border: 1px solid rgba(71, 85, 105, 0.5);
                    border-radius: 8px;
                    color: #f1f5f9;
                    padding: 10px 12px;
                    font-size: 14px;
                }

                .selected-procedures-list {
                    min-height: 200px;
                }

                .procedure-item {
                    background: rgba(15, 23, 42, 0.8);
                    border: 1px solid rgba(71, 85, 105, 0.3);
                    border-radius: 8px;
                    padding: 16px;
                    margin-bottom: 12px;
                    transition: all 0.3s ease;
                    position: relative;
                }

                .procedure-item:hover {
                    border-color: rgba(20, 184, 166, 0.5);
                }

                .procedure-info {
                    margin-bottom: 8px;
                }

                .procedure-name {
                    color: #f1f5f9;
                    font-weight: 600;
                    margin: 0 0 4px 0;
                    font-size: 14px;
                }

                .procedure-details {
                    display: flex;
                    gap: 16px;
                    font-size: 12px;
                    color: #94a3b8;
                }

                .procedure-pricing {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .price-input-group {
                    display: flex;
                    align-items: center;
                    gap: 4px;
                }

                .currency {
                    color: #14b8a6;
                    font-weight: 600;
                }

                .price-input {
                    background: transparent;
                    border: 1px solid rgba(71, 85, 105, 0.5);
                    border-radius: 4px;
                    color: #f1f5f9;
                    padding: 4px 8px;
                    width: 80px;
                    font-size: 14px;
                }

                .quantity-info {
                    display: flex;
                    flex-direction: column;
                    align-items: flex-end;
                    gap: 2px;
                }

                .qty-label {
                    font-size: 12px;
                    color: #94a3b8;
                }

                .total-price {
                    color: #14b8a6;
                    font-weight: 600;
                    font-size: 14px;
                }

                .remove-procedure {
                    position: absolute;
                    top: 8px;
                    right: 8px;
                    background: rgba(239, 68, 68, 0.2);
                    border: 1px solid rgba(239, 68, 68, 0.3);
                    border-radius: 4px;
                    color: #f87171;
                    padding: 4px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .remove-procedure:hover {
                    background: rgba(239, 68, 68, 0.3);
                }

                .budget-document {
                    background: #ffffff;
                    color: #1f2937;
                    border-radius: 8px;
                    padding: 32px;
                    margin-bottom: 20px;
                    min-height: 600px;
                    box-shadow: 0 4px 25px rgba(0, 0, 0, 0.1);
                }

                .document-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 32px;
                    padding-bottom: 16px;
                    border-bottom: 2px solid #e5e7eb;
                }

                .clinic-name {
                    font-size: 24px;
                    font-weight: 700;
                    color: #0d9488;
                    margin: 0;
                }

                .clinic-details {
                    color: #6b7280;
                    margin: 4px 0 0 0;
                }

                .document-number {
                    font-size: 18px;
                    font-weight: 600;
                    color: #374151;
                }

                .document-date {
                    color: #6b7280;
                    font-size: 14px;
                }

                .patient-details {
                    margin-bottom: 24px;
                    padding: 16px;
                    background: #f9fafb;
                    border-radius: 8px;
                }

                .patient-name {
                    font-size: 18px;
                    font-weight: 600;
                    color: #111827;
                    margin: 0 0 4px 0;
                }

                .patient-info {
                    color: #6b7280;
                    margin: 0;
                }

                .procedures-table {
                    margin-bottom: 24px;
                }

                .table-header {
                    display: grid;
                    grid-template-columns: 2fr 1fr 1fr 0.5fr 1fr;
                    gap: 16px;
                    padding: 12px 16px;
                    background: #0d9488;
                    color: white;
                    border-radius: 8px 8px 0 0;
                    font-weight: 600;
                    font-size: 14px;
                }

                .table-row {
                    display: grid;
                    grid-template-columns: 2fr 1fr 1fr 0.5fr 1fr;
                    gap: 16px;
                    padding: 12px 16px;
                    border-bottom: 1px solid #e5e7eb;
                    font-size: 14px;
                }

                .budget-summary {
                    border-top: 2px solid #e5e7eb;
                    padding-top: 16px;
                    margin-bottom: 24px;
                }

                .summary-row {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 8px;
                }

                .summary-row.total-row {
                    font-size: 18px;
                    font-weight: 700;
                    color: #0d9488;
                    border-top: 1px solid #e5e7eb;
                    padding-top: 8px;
                }

                .payment-terms {
                    background: #f9fafb;
                    padding: 16px;
                    border-radius: 8px;
                    margin-bottom: 24px;
                }

                .terms-title {
                    font-size: 16px;
                    font-weight: 600;
                    color: #374151;
                    margin: 0 0 12px 0;
                }

                .payment-options {
                    display: flex;
                    gap: 16px;
                    margin-bottom: 12px;
                }

                .payment-option {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    cursor: pointer;
                }

                .notes-textarea {
                    width: 100%;
                    background: #f9fafb;
                    border: 1px solid #d1d5db;
                    border-radius: 6px;
                    padding: 12px;
                    min-height: 80px;
                    resize: vertical;
                    font-family: inherit;
                    font-size: 14px;
                }

                .budget-actions {
                    display: flex;
                    gap: 12px;
                }

                .action-btn {
                    padding: 12px 24px;
                    border-radius: 8px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    border: none;
                }

                .draft-btn {
                    background: rgba(71, 85, 105, 0.2);
                    color: #64748b;
                }

                .sent-btn {
                    background: linear-gradient(135deg, #0d9488 0%, #14b8a6 100%);
                    color: white;
                }

                .budgets-list {
                    max-height: 500px;
                    overflow-y: auto;
                    margin-bottom: 20px;
                }

                .budget-card {
                    background: rgba(15, 23, 42, 0.8);
                    border: 1px solid rgba(71, 85, 105, 0.3);
                    border-radius: 8px;
                    padding: 16px;
                    margin-bottom: 12px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .budget-card:hover {
                    border-color: rgba(20, 184, 166, 0.5);
                    transform: translateY(-1px);
                }

                .budget-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 8px;
                }

                .budget-title {
                    color: #f1f5f9;
                    font-weight: 600;
                    margin: 0;
                    font-size: 14px;
                }

                .budget-date {
                    color: #94a3b8;
                    font-size: 12px;
                    margin: 2px 0 0 0;
                }

                .status-badge {
                    padding: 4px 8px;
                    border-radius: 12px;
                    font-size: 10px;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                .status-draft {
                    background: rgba(156, 163, 175, 0.2);
                    color: #9ca3af;
                }

                .status-sent {
                    background: rgba(59, 130, 246, 0.2);
                    color: #3b82f6;
                }

                .status-approved {
                    background: rgba(34, 197, 94, 0.2);
                    color: #22c55e;
                }

                .status-rejected {
                    background: rgba(239, 68, 68, 0.2);
                    color: #ef4444;
                }

                .budget-summary {
                    display: flex;
                    justify-content: space-between;
                    color: #cbd5e1;
                    font-size: 12px;
                    margin-bottom: 8px;
                }

                .budget-total {
                    color: #14b8a6;
                    font-weight: 600;
                }

                .budget-actions {
                    display: flex;
                    gap: 6px;
                    justify-content: flex-end;
                }

                .action-btn-small {
                    background: rgba(71, 85, 105, 0.3);
                    border: 1px solid rgba(71, 85, 105, 0.5);
                    border-radius: 4px;
                    color: #cbd5e1;
                    padding: 4px 6px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .action-btn-small:hover {
                    background: rgba(20, 184, 166, 0.2);
                    color: #14b8a6;
                }

                .filter-btn {
                    background: rgba(71, 85, 105, 0.2);
                    border: 1px solid rgba(71, 85, 105, 0.3);
                    border-radius: 6px;
                    color: #94a3b8;
                    padding: 6px 12px;
                    font-size: 12px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .filter-btn.active {
                    background: linear-gradient(135deg, #0d9488 0%, #14b8a6 100%);
                    color: white;
                    border-color: transparent;
                }

                .automation-info {
                    background: linear-gradient(135deg, rgba(13, 148, 136, 0.1) 0%, rgba(20, 184, 166, 0.05) 100%);
                    border: 1px solid rgba(20, 184, 166, 0.2);
                    border-radius: 12px;
                    padding: 16px;
                    display: flex;
                    gap: 12px;
                    align-items: flex-start;
                }

                .automation-icon {
                    background: rgba(13, 148, 136, 0.2);
                    border-radius: 8px;
                    padding: 8px;
                    color: #14b8a6;
                }

                .automation-title {
                    color: #14b8a6;
                    font-weight: 600;
                    margin: 0 0 4px 0;
                    font-size: 14px;
                }

                .automation-description {
                    color: #94a3b8;
                    font-size: 12px;
                    line-height: 1.4;
                    margin: 0;
                }

                .empty-procedures, .empty-budgets {
                    text-align: center;
                    padding: 32px 16px;
                    color: #64748b;
                }

                .empty-icon {
                    width: 48px;
                    height: 48px;
                    margin: 0 auto 16px;
                    opacity: 0.5;
                }

                .empty-procedures p, .empty-budgets p {
                    margin: 0 0 4px 0;
                    font-weight: 500;
                }

                .empty-procedures span, .empty-budgets span {
                    font-size: 12px;
                    opacity: 0.7;
                }

                .hidden {
                    display: none;
                }

                @media (max-width: 1200px) {
                    .workspace-main {
                        grid-template-columns: 1fr;
                        gap: 16px;
                    }
                }
            `;
            document.head.appendChild(styles);
        }
    }
};

// Auto-inicializar
document.addEventListener('DOMContentLoaded', function() {
    if (typeof Budgets !== 'undefined') {
        Budgets.init();
    }
});

// Exportar para uso global
window.Budgets = Budgets;

console.log('💰 Módulo de Orçamentos Profissional carregado!');