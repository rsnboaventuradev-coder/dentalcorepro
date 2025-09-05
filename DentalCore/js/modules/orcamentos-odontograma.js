// ============================================================================
// DENTALCORE PRO - MÓDULO DE ORÇAMENTOS COM ODONTOGRAMA INTERATIVO V2
// Sistema de orçamentos odontológicos com busca e criação de procedimentos
// VERSÃO CORRIGIDA - Sem dependências de funções inexistentes
// ============================================================================

const OrcamentosOdontograma = {
    currentPatientId: null,
    currentBudget: {
        id: null,
        description: '',
        responsible: '',
        date: new Date().toISOString().split('T')[0],
        treatments: [],
        total: 0,
        status: 'rascunho'
    },
    savedBudgets: [],
    selectedTeeth: [],
    currentToothType: 'permanentes',
    selectedProcedure: null,
    
    // Procedimentos odontológicos (base + personalizados)
    procedures: [
        { id: 1, name: 'Limpeza e Profilaxia', price: 150.00, category: 'Prevenção', custom: false },
        { id: 2, name: 'Restauração em Resina Composta', price: 280.00, category: 'Dentística', custom: false },
        { id: 3, name: 'Tratamento Endodôntico', price: 800.00, category: 'Endodontia', custom: false },
        { id: 4, name: 'Coroa em Porcelana', price: 1200.00, category: 'Prótese', custom: false },
        { id: 5, name: 'Implante Dentário', price: 2500.00, category: 'Implantodontia', custom: false },
        { id: 6, name: 'Extração Simples', price: 120.00, category: 'Cirurgia', custom: false },
        { id: 7, name: 'Clareamento Dental', price: 600.00, category: 'Estética', custom: false },
        { id: 8, name: 'Aparelho Ortodôntico', price: 3500.00, category: 'Ortodontia', custom: false },
        { id: 9, name: 'Raspagem Periodontal', price: 200.00, category: 'Periodontia', custom: false },
        { id: 10, name: 'Aplicação de Flúor', price: 50.00, category: 'Prevenção', custom: false }
    ],

    // Dentes permanentes (numeração FDI)
    permanentTeeth: {
        upper: [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28],
        lower: [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38]
    },

    // Dentes decíduos
    deciduousTeeth: {
        upper: [55, 54, 53, 52, 51, 61, 62, 63, 64, 65],
        lower: [85, 84, 83, 82, 81, 71, 72, 73, 74, 75]
    },

    /**
     * Inicializar módulo
     */
    init() {
        console.log('🦷 Módulo Orçamentos com Odontograma V2 carregado!');
        this.addCustomStyles();
        this.loadBudgets();
        this.loadCustomProcedures();
    },

    /**
     * Carregar procedimentos customizados
     */
    loadCustomProcedures() {
        try {
            if (typeof localStorage !== 'undefined') {
                const saved = localStorage.getItem('dentalcore_custom_procedures');
                if (saved) {
                    const customProcedures = JSON.parse(saved);
                    // Adicionar procedimentos customizados aos existentes
                    customProcedures.forEach(proc => {
                        if (!this.procedures.find(p => p.id === proc.id)) {
                            this.procedures.push({ ...proc, custom: true });
                        }
                    });
                    console.log('✅ Procedimentos customizados carregados:', customProcedures.length);
                }
            }
        } catch (error) {
            console.error('Erro ao carregar procedimentos customizados:', error);
        }
    },

    /**
     * Salvar procedimento customizado
     */
    saveCustomProcedure(procedure) {
        try {
            if (typeof localStorage !== 'undefined') {
                const saved = localStorage.getItem('dentalcore_custom_procedures');
                const customProcedures = saved ? JSON.parse(saved) : [];
                customProcedures.push(procedure);
                localStorage.setItem('dentalcore_custom_procedures', JSON.stringify(customProcedures));
                console.log('✅ Procedimento customizado salvo:', procedure.name);
            }
        } catch (error) {
            console.error('Erro ao salvar procedimento customizado:', error);
        }
    },

    /**
     * Carregar orçamentos salvos
     */
    loadBudgets() {
        try {
            if (typeof DataPersistence !== 'undefined' && DataPersistence.getBudgets) {
                this.savedBudgets = DataPersistence.getBudgets() || [];
            } else {
                // Fallback para localStorage
                const saved = localStorage.getItem('dentalcore_budgets');
                this.savedBudgets = saved ? JSON.parse(saved) : [];
            }
            console.log('📋 Orçamentos carregados:', this.savedBudgets.length);
        } catch (error) {
            console.error('Erro ao carregar orçamentos:', error);
            this.savedBudgets = [];
        }
    },

    /**
     * Salvar orçamentos
     */
    saveBudgets() {
        try {
            if (typeof DataPersistence !== 'undefined' && DataPersistence.save) {
                DataPersistence.save('budgets', this.savedBudgets);
            } else {
                // Fallback para localStorage
                localStorage.setItem('dentalcore_budgets', JSON.stringify(this.savedBudgets));
            }
            console.log('💾 Orçamentos salvos');
        } catch (error) {
            console.error('Erro ao salvar orçamentos:', error);
        }
    },

    /**
     * Renderizar interface principal
     */
    renderTabOrcamentos(patient) {
        this.currentPatientId = patient.id;
        this.resetCurrentBudget();
        this.loadBudgets();
        this.loadCustomProcedures();
        
        return `
            <div class="orcamentos-odontograma-workspace">
                ${this.renderBudgetForm(patient)}
                ${this.renderOdontogram()}
                ${this.renderTreatmentsList()}
                ${this.renderNewProcedureModal()}
            </div>
        `;
    },

    /**
     * Renderizar formulário de orçamento
     */
    renderBudgetForm(patient) {
        return `
            <div class="budget-form-section">
                <div class="form-header">
                    <h2 class="form-title">NOVO ORÇAMENTO</h2>
                    <button onclick="OrcamentosOdontograma.closeBudgetForm()" class="close-btn">×</button>
                </div>
                
                <div class="form-content">
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label">Descrição*</label>
                            <input type="text" id="budgetDescription" class="form-input" 
                                   value="Plano tratamento de ${patient.name}" 
                                   placeholder="Descrição do orçamento">
                        </div>
                        <div class="form-group">
                            <label class="form-label">Responsável pelo orçamento</label>
                            <input type="text" id="budgetResponsible" class="form-input" 
                                   value="Dr. Dentista" placeholder="Nome do profissional">
                        </div>
                        <div class="form-group">
                            <label class="form-label">Data*</label>
                            <input type="date" id="budgetDate" class="form-input" 
                                   value="${new Date().toISOString().split('T')[0]}">
                        </div>
                    </div>
                </div>
            </div>

            <div class="treatment-form-section">
                <h3 class="section-title">Adicionar tratamento</h3>
                
                <div class="treatment-form">
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label">Plano*</label>
                            <select id="treatmentPlan" class="form-select">
                                <option value="consultorio">Consultório odontológico</option>
                                <option value="premium">Plano Premium</option>
                                <option value="basico">Plano Básico</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Tratamento*</label>
                            <div class="treatment-search-container">
                                <input type="text" id="treatmentSearch" class="form-input treatment-search" 
                                       placeholder="Digite para buscar ou selecionar tratamento..."
                                       autocomplete="off"
                                       onkeyup="OrcamentosOdontograma.searchProcedures(this.value)"
                                       onfocus="OrcamentosOdontograma.showProceduresList()"
                                       onblur="OrcamentosOdontograma.hideProceduresList()">
                                <button type="button" onclick="OrcamentosOdontograma.openNewProcedureModal()" 
                                        class="add-procedure-btn" title="Adicionar novo procedimento">
                                    ➕
                                </button>
                                <div id="proceduresDropdown" class="procedures-dropdown hidden">
                                    ${this.renderProceduresList()}
                                </div>
                            </div>
                            <div class="required-message">Este campo é obrigatório</div>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Valor*</label>
                            <input type="number" id="treatmentValue" class="form-input" 
                                   placeholder="0,00" step="0.01" min="0">
                        </div>
                        <div class="form-group">
                            <label class="form-label">Dentista*</label>
                            <input type="text" id="treatmentDentist" class="form-input" 
                                   value="Dr. Dentista" placeholder="Nome do dentista">
                        </div>
                    </div>
                    
                    <div class="tooth-selection-info">
                        <span class="selection-label">Selecionar Dente/Região</span>
                        <div class="selected-teeth-display" id="selectedTeethDisplay">
                            Nenhum dente selecionado
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * Renderizar lista de procedimentos para busca
     */
    renderProceduresList(searchTerm = '') {
        const filteredProcedures = this.procedures.filter(proc => 
            proc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            proc.category.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (filteredProcedures.length === 0) {
            return `
                <div class="procedure-item no-results">
                    <div class="procedure-info">
                        <div class="procedure-name">Nenhum procedimento encontrado</div>
                        <div class="procedure-suggestion">
                            Clique em ➕ para adicionar um novo procedimento
                        </div>
                    </div>
                </div>
            `;
        }

        return filteredProcedures.map(proc => `
            <div class="procedure-item" onmousedown="OrcamentosOdontograma.selectProcedure(${proc.id})">
                <div class="procedure-info">
                    <div class="procedure-name">
                        ${proc.name}
                        ${proc.custom ? '<span class="custom-badge">Personalizado</span>' : ''}
                    </div>
                    <div class="procedure-details">
                        ${proc.category} • R$ ${proc.price.toFixed(2).replace('.', ',')}
                    </div>
                </div>
            </div>
        `).join('');
    },

    /**
     * Renderizar modal de novo procedimento
     */
    renderNewProcedureModal() {
        return `
            <!-- Modal de Novo Procedimento -->
            <div id="newProcedureModal" class="procedure-modal hidden">
                <div class="modal-overlay" onclick="OrcamentosOdontograma.closeNewProcedureModal()"></div>
                <div class="modal-container">
                    <div class="modal-header">
                        <h3 class="modal-title">Novo Procedimento</h3>
                        <button onclick="OrcamentosOdontograma.closeNewProcedureModal()" class="modal-close">×</button>
                    </div>
                    
                    <div class="modal-content">
                        <form id="newProcedureForm" onsubmit="OrcamentosOdontograma.saveNewProcedure(event)">
                            <div class="form-row">
                                <div class="form-group">
                                    <label class="form-label">Nome do Procedimento*</label>
                                    <input type="text" id="newProcedureName" class="form-input" 
                                           placeholder="Ex: Restauração estética anterior" required>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Categoria</label>
                                    <select id="newProcedureCategory" class="form-select">
                                        <option value="Dentística">Dentística</option>
                                        <option value="Endodontia">Endodontia</option>
                                        <option value="Periodontia">Periodontia</option>
                                        <option value="Cirurgia">Cirurgia</option>
                                        <option value="Prótese">Prótese</option>
                                        <option value="Implantodontia">Implantodontia</option>
                                        <option value="Ortodontia">Ortodontia</option>
                                        <option value="Estética">Estética</option>
                                        <option value="Prevenção">Prevenção</option>
                                        <option value="Outro">Outro</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div class="form-row">
                                <div class="form-group">
                                    <label class="form-label">Valor Padrão (R$)*</label>
                                    <input type="number" id="newProcedurePrice" class="form-input" 
                                           placeholder="0,00" step="0.01" min="0" required>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Duração Estimada (min)</label>
                                    <input type="number" id="newProcedureDuration" class="form-input" 
                                           placeholder="30" min="5" max="480">
                                </div>
                            </div>
                            
                            <div class="form-group">
                                <label class="form-label">Descrição</label>
                                <textarea id="newProcedureDescription" class="form-textarea" rows="3"
                                          placeholder="Descrição detalhada do procedimento..."></textarea>
                            </div>
                        </form>
                    </div>
                    
                    <div class="modal-actions">
                        <button onclick="OrcamentosOdontograma.closeNewProcedureModal()" class="modal-btn secondary">
                            Cancelar
                        </button>
                        <button onclick="OrcamentosOdontograma.saveNewProcedure(event)" class="modal-btn primary">
                            Salvar Procedimento
                        </button>
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
            <div class="odontogram-section">
                <!-- Abas de tipos de dentes -->
                <div class="tooth-type-tabs">
                    <button onclick="OrcamentosOdontograma.setToothType('permanentes')" 
                            class="tooth-tab ${this.currentToothType === 'permanentes' ? 'active' : ''}">
                        PERMANENTES
                    </button>
                    <button onclick="OrcamentosOdontograma.setToothType('deciduos')" 
                            class="tooth-tab ${this.currentToothType === 'deciduos' ? 'active' : ''}">
                        DECÍDUOS
                    </button>
                    <button onclick="OrcamentosOdontograma.setToothType('hof')" 
                            class="tooth-tab ${this.currentToothType === 'hof' ? 'active' : ''}">
                        HOF
                    </button>
                </div>

                <!-- Odontograma -->
                <div class="odontogram-container">
                    ${this.renderTeethGrid()}
                </div>

                <!-- Controles de seleção rápida -->
                <div class="quick-selection">
                    <button onclick="OrcamentosOdontograma.selectRegion('maxila')" class="region-btn">Maxila</button>
                    <button onclick="OrcamentosOdontograma.selectRegion('mandibula')" class="region-btn">Mandíbula</button>
                    <button onclick="OrcamentosOdontograma.selectRegion('face')" class="region-btn">Face</button>
                    <button onclick="OrcamentosOdontograma.selectRegion('arcada-superior')" class="region-btn">Arcada superior</button>
                    <button onclick="OrcamentosOdontograma.selectRegion('arcada-inferior')" class="region-btn">Arcada inferior</button>
                    <button onclick="OrcamentosOdontograma.selectRegion('arcadas')" class="region-btn">Arcadas</button>
                </div>

                <!-- Botão adicionar tratamento -->
                <div class="add-treatment-section">
                    <button onclick="OrcamentosOdontograma.addTreatment()" class="add-treatment-btn">
                        ADICIONAR TRATAMENTO
                    </button>
                </div>
            </div>
        `;
    },

    /**
     * Renderizar grid de dentes
     */
    renderTeethGrid() {
        const teeth = this.currentToothType === 'permanentes' ? this.permanentTeeth : this.deciduousTeeth;
        
        return `
            <!-- Dentes superiores -->
            <div class="teeth-row upper-teeth">
                ${teeth.upper.map(tooth => this.renderTooth(tooth, 'upper')).join('')}
            </div>
            
            <!-- Linha divisória -->
            <div class="teeth-divider"></div>
            
            <!-- Dentes inferiores -->
            <div class="teeth-row lower-teeth">
                ${teeth.lower.map(tooth => this.renderTooth(tooth, 'lower')).join('')}
            </div>
        `;
    },

    /**
     * Renderizar dente individual
     */
    renderTooth(toothNumber, position) {
        const isSelected = this.selectedTeeth.includes(toothNumber);
        const selectedClass = isSelected ? 'selected' : '';
        
        return `
            <div class="tooth-container">
                <div class="tooth-number">${toothNumber}</div>
                <div class="tooth ${selectedClass} ${position}" 
                     data-tooth="${toothNumber}"
                     onclick="OrcamentosOdontograma.toggleTooth(${toothNumber})">
                    ${this.renderToothSVG(position)}
                </div>
            </div>
        `;
    },

    /**
     * Renderizar SVG do dente
     */
    renderToothSVG(position) {
        if (position === 'upper') {
            return `
                <svg viewBox="0 0 40 50" class="tooth-svg">
                    <path d="M20 5 C10 5, 5 15, 5 25 C5 35, 10 45, 20 45 C30 45, 35 35, 35 25 C35 15, 30 5, 20 5 Z" 
                          fill="currentColor" stroke="#666" stroke-width="1"/>
                    <path d="M15 10 L25 10 L23 20 L17 20 Z" fill="#fff" opacity="0.3"/>
                </svg>
            `;
        } else {
            return `
                <svg viewBox="0 0 40 50" class="tooth-svg">
                    <path d="M20 45 C10 45, 5 35, 5 25 C5 15, 10 5, 20 5 C30 5, 35 15, 35 25 C35 35, 30 45, 20 45 Z" 
                          fill="currentColor" stroke="#666" stroke-width="1"/>
                    <path d="M15 30 L25 30 L23 40 L17 40 Z" fill="#fff" opacity="0.3"/>
                </svg>
            `;
        }
    },

    /**
     * Renderizar lista de tratamentos
     */
    renderTreatmentsList() {
        return `
            <div class="treatments-list-section">
                <h3 class="section-title">Tratamentos Adicionados</h3>
                <div id="treatmentsList" class="treatments-list">
                    ${this.currentBudget.treatments.length === 0 ? 
                        '<div class="no-treatments">Nenhum tratamento adicionado</div>' :
                        this.currentBudget.treatments.map(treatment => this.renderTreatmentItem(treatment)).join('')
                    }
                </div>
                
                ${this.currentBudget.treatments.length > 0 ? `
                    <div class="budget-summary">
                        <div class="total-section">
                            <span class="total-label">Total do Orçamento:</span>
                            <span class="total-value">R$ ${this.currentBudget.total.toFixed(2).replace('.', ',')}</span>
                        </div>
                        <div class="budget-actions">
                            <button onclick="OrcamentosOdontograma.saveBudget()" class="save-budget-btn">
                                Salvar Orçamento
                            </button>
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
    },

    /**
     * Renderizar item de tratamento
     */
    renderTreatmentItem(treatment) {
        return `
            <div class="treatment-item">
                <div class="treatment-info">
                    <div class="treatment-name">${treatment.name}</div>
                    <div class="treatment-details">
                        Dentes: ${treatment.teeth.join(', ')} • 
                        Dentista: ${treatment.dentist} • 
                        Valor: R$ ${treatment.price.toFixed(2).replace('.', ',')}
                    </div>
                </div>
                <button onclick="OrcamentosOdontograma.removeTreatment(${treatment.id})" class="remove-treatment-btn">
                    🗑️
                </button>
            </div>
        `;
    },

    /**
     * FUNÇÕES DE BUSCA E SELEÇÃO DE PROCEDIMENTOS
     */

    /**
     * Buscar procedimentos
     */
    searchProcedures(searchTerm) {
        const dropdown = document.getElementById('proceduresDropdown');
        if (dropdown) {
            dropdown.innerHTML = this.renderProceduresList(searchTerm);
            dropdown.classList.remove('hidden');
        }
    },

    /**
     * Mostrar lista de procedimentos
     */
    showProceduresList() {
        const dropdown = document.getElementById('proceduresDropdown');
        if (dropdown) {
            dropdown.classList.remove('hidden');
        }
    },

    /**
     * Esconder lista de procedimentos (com delay para permitir clique)
     */
    hideProceduresList() {
        setTimeout(() => {
            const dropdown = document.getElementById('proceduresDropdown');
            if (dropdown) {
                dropdown.classList.add('hidden');
            }
        }, 200);
    },

    /**
     * Selecionar procedimento da lista
     */
    selectProcedure(procedureId) {
        const procedure = this.procedures.find(p => p.id === procedureId);
        if (procedure) {
            this.selectedProcedure = procedure;
            
            // Atualizar campos
            const searchInput = document.getElementById('treatmentSearch');
            const valueInput = document.getElementById('treatmentValue');
            
            if (searchInput) {
                searchInput.value = procedure.name;
                searchInput.classList.remove('required');
            }
            
            if (valueInput) {
                valueInput.value = procedure.price.toFixed(2);
            }
            
            // Esconder dropdown
            const dropdown = document.getElementById('proceduresDropdown');
            if (dropdown) {
                dropdown.classList.add('hidden');
            }
        }
    },

    /**
     * FUNÇÕES DO MODAL DE NOVO PROCEDIMENTO
     */

    /**
     * Abrir modal de novo procedimento
     */
    openNewProcedureModal() {
        const modal = document.getElementById('newProcedureModal');
        if (modal) {
            modal.classList.remove('hidden');
            // Focar no primeiro campo
            setTimeout(() => {
                const nameInput = document.getElementById('newProcedureName');
                if (nameInput) nameInput.focus();
            }, 100);
        }
    },

    /**
     * Fechar modal de novo procedimento
     */
    closeNewProcedureModal() {
        const modal = document.getElementById('newProcedureModal');
        if (modal) {
            modal.classList.add('hidden');
            this.clearNewProcedureForm();
        }
    },

    /**
     * Limpar formulário de novo procedimento
     */
    clearNewProcedureForm() {
        const fields = ['newProcedureName', 'newProcedurePrice', 'newProcedureDuration', 'newProcedureDescription'];
        fields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) field.value = '';
        });
        
        const categoryField = document.getElementById('newProcedureCategory');
        if (categoryField) categoryField.value = 'Dentística';
    },

    /**
     * Salvar novo procedimento
     */
    saveNewProcedure(event) {
        if (event) event.preventDefault();
        
        const name = document.getElementById('newProcedureName').value.trim();
        const category = document.getElementById('newProcedureCategory').value;
        const price = parseFloat(document.getElementById('newProcedurePrice').value);
        const duration = parseInt(document.getElementById('newProcedureDuration').value) || 30;
        const description = document.getElementById('newProcedureDescription').value.trim();
        
        // Validações
        if (!name) {
            this.showAlert('❌ Erro', 'Nome do procedimento é obrigatório');
            return;
        }
        
        if (!price || price <= 0) {
            this.showAlert('❌ Erro', 'Valor deve ser maior que zero');
            return;
        }
        
        // Verificar se já existe
        if (this.procedures.find(p => p.name.toLowerCase() === name.toLowerCase())) {
            this.showAlert('⚠️ Atenção', 'Já existe um procedimento com este nome');
            return;
        }
        
        // Criar novo procedimento
        const newProcedure = {
            id: Date.now(),
            name: name,
            category: category,
            price: price,
            duration: duration,
            description: description,
            custom: true,
            createdAt: new Date().toISOString()
        };
        
        // Adicionar à lista
        this.procedures.push(newProcedure);
        
        // Salvar no sistema
        this.saveCustomProcedure(newProcedure);
        
        // Fechar modal
        this.closeNewProcedureModal();
        
        // Atualizar dropdown
        this.searchProcedures('');
        
        // Selecionar automaticamente o novo procedimento
        this.selectProcedure(newProcedure.id);
        
        this.showAlert('✅ Sucesso', `Procedimento "${name}" criado com sucesso!`);
    },

    /**
     * FUNÇÕES DE INTERAÇÃO DO ODONTOGRAMA
     */

    /**
     * Alternar seleção de dente
     */
    toggleTooth(toothNumber) {
        const index = this.selectedTeeth.indexOf(toothNumber);
        if (index === -1) {
            this.selectedTeeth.push(toothNumber);
        } else {
            this.selectedTeeth.splice(index, 1);
        }
        this.updateSelectedTeethDisplay();
        this.updateToothVisual(toothNumber);
    },

    /**
     * Atualizar visual do dente
     */
    updateToothVisual(toothNumber) {
        const toothElement = document.querySelector(`[data-tooth="${toothNumber}"]`);
        if (toothElement) {
            if (this.selectedTeeth.includes(toothNumber)) {
                toothElement.classList.add('selected');
            } else {
                toothElement.classList.remove('selected');
            }
        }
    },

    /**
     * Atualizar display de dentes selecionados
     */
    updateSelectedTeethDisplay() {
        const display = document.getElementById('selectedTeethDisplay');
        if (display) {
            if (this.selectedTeeth.length === 0) {
                display.textContent = 'Nenhum dente selecionado';
            } else {
                display.textContent = `Dentes selecionados: ${this.selectedTeeth.sort((a, b) => a - b).join(', ')}`;
            }
        }
    },

    /**
     * Definir tipo de dente
     */
    setToothType(type) {
        this.currentToothType = type;
        this.selectedTeeth = []; // Limpar seleção ao trocar tipo
        
        // Atualizar interface
        const container = document.querySelector('.odontogram-container');
        if (container) {
            container.innerHTML = this.renderTeethGrid();
        }
        
        // Atualizar abas
        document.querySelectorAll('.tooth-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        const activeTab = document.querySelector(`[onclick*="${type}"]`);
        if (activeTab) {
            activeTab.classList.add('active');
        }
        
        this.updateSelectedTeethDisplay();
    },

    /**
     * Selecionar região
     */
    selectRegion(region) {
        const teeth = this.currentToothType === 'permanentes' ? this.permanentTeeth : this.deciduousTeeth;
        
        switch (region) {
            case 'maxila':
            case 'arcada-superior':
                this.selectedTeeth = [...teeth.upper];
                break;
            case 'mandibula':
            case 'arcada-inferior':
                this.selectedTeeth = [...teeth.lower];
                break;
            case 'arcadas':
            case 'face':
                this.selectedTeeth = [...teeth.upper, ...teeth.lower];
                break;
        }
        
        this.updateAllTeethVisuals();
        this.updateSelectedTeethDisplay();
    },

    /**
     * Atualizar visual de todos os dentes
     */
    updateAllTeethVisuals() {
        document.querySelectorAll('.tooth').forEach(tooth => {
            const toothNumber = parseInt(tooth.dataset.tooth);
            if (this.selectedTeeth.includes(toothNumber)) {
                tooth.classList.add('selected');
            } else {
                tooth.classList.remove('selected');
            }
        });
    },

    /**
     * FUNÇÕES DE TRATAMENTO
     */

    /**
     * Adicionar tratamento
     */
    addTreatment() {
        const treatmentSearch = document.getElementById('treatmentSearch');
        const treatmentValue = document.getElementById('treatmentValue');
        const treatmentDentist = document.getElementById('treatmentDentist');
        
        // Validações
        if (!this.selectedProcedure) {
            if (treatmentSearch) treatmentSearch.classList.add('required');
            this.showAlert('❌ Erro', 'Selecione um tratamento');
            return;
        }
        
        if (this.selectedTeeth.length === 0) {
            this.showAlert('❌ Erro', 'Selecione pelo menos um dente');
            return;
        }
        
        if (!treatmentValue.value || parseFloat(treatmentValue.value) <= 0) {
            this.showAlert('❌ Erro', 'Informe um valor válido');
            return;
        }
        
        // Criar tratamento
        const treatment = {
            id: Date.now(),
            name: this.selectedProcedure.name,
            price: parseFloat(treatmentValue.value),
            teeth: [...this.selectedTeeth],
            dentist: treatmentDentist.value,
            plan: document.getElementById('treatmentPlan').value,
            category: this.selectedProcedure.category
        };
        
        this.currentBudget.treatments.push(treatment);
        this.calculateTotal();
        
        // Limpar formulário
        this.clearTreatmentForm();
        
        // Atualizar interface
        this.updateTreatmentsList();
        
        this.showAlert('✅ Sucesso', 'Tratamento adicionado ao orçamento!');
    },

    /**
     * Remover tratamento
     */
    removeTreatment(treatmentId) {
        this.currentBudget.treatments = this.currentBudget.treatments.filter(t => t.id !== treatmentId);
        this.calculateTotal();
        this.updateTreatmentsList();
    },

    /**
     * Calcular total
     */
    calculateTotal() {
        this.currentBudget.total = this.currentBudget.treatments.reduce((sum, t) => sum + t.price, 0);
    },

    /**
     * Limpar formulário de tratamento
     */
    clearTreatmentForm() {
        const treatmentSearch = document.getElementById('treatmentSearch');
        const treatmentValue = document.getElementById('treatmentValue');
        
        if (treatmentSearch) {
            treatmentSearch.value = '';
            treatmentSearch.classList.remove('required');
        }
        if (treatmentValue) treatmentValue.value = '';
        
        this.selectedProcedure = null;
        this.selectedTeeth = [];
        this.updateAllTeethVisuals();
        this.updateSelectedTeethDisplay();
        this.hideProceduresList();
    },

    /**
     * Atualizar lista de tratamentos
     */
    updateTreatmentsList() {
        const container = document.getElementById('treatmentsList');
        if (container) {
            container.parentElement.innerHTML = this.renderTreatmentsList();
        }
    },

    /**
     * Salvar orçamento
     */
    saveBudget() {
        if (this.currentBudget.treatments.length === 0) {
            this.showAlert('❌ Erro', 'Adicione pelo menos um tratamento');
            return;
        }
        
        const budget = {
            ...this.currentBudget,
            id: Date.now(),
            patientId: this.currentPatientId,
            description: document.getElementById('budgetDescription').value,
            responsible: document.getElementById('budgetResponsible').value,
            date: document.getElementById('budgetDate').value,
            createdAt: new Date().toISOString()
        };
        
        this.savedBudgets.push(budget);
        this.saveBudgets();
        
        this.showAlert('✅ Orçamento Salvo!', 'Orçamento salvo com sucesso no sistema.');
        
        // Reset
        this.resetCurrentBudget();
        this.updateTreatmentsList();
        this.clearTreatmentForm();
    },

    /**
     * Reset orçamento atual
     */
    resetCurrentBudget() {
        this.currentBudget = {
            id: null,
            description: '',
            responsible: '',
            date: new Date().toISOString().split('T')[0],
            treatments: [],
            total: 0,
            status: 'rascunho'
        };
        this.selectedTeeth = [];
        this.selectedProcedure = null;
    },

    /**
     * Fechar formulário
     */
    closeBudgetForm() {
        if (typeof UI !== 'undefined') {
            UI.showAlert('📝 Formulário', 'Formulário minimizado');
        }
    },

    /**
     * Mostrar alerta
     */
    showAlert(title, message) {
        if (typeof UI !== 'undefined') {
            UI.showAlert(title, message);
        } else {
            alert(`${title}\n\n${message}`);
        }
    },

    /**
     * Adicionar estilos customizados
     */
    addCustomStyles() {
        if (!document.getElementById('orcamentosOdontogramaStyles')) {
            const styles = document.createElement('style');
            styles.id = 'orcamentosOdontogramaStyles';
            styles.textContent = `
                .orcamentos-odontograma-workspace {
                    background: #0f172a;
                    min-height: 100vh;
                    padding: 20px;
                    font-family: 'Inter', sans-serif;
                    color: #e2e8f0;
                }

                /* FORMULÁRIO DE ORÇAMENTO */
                .budget-form-section {
                    background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
                    border-radius: 12px;
                    margin-bottom: 20px;
                    border: 1px solid rgba(71, 85, 105, 0.3);
                }

                .form-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 20px;
                    border-bottom: 1px solid rgba(71, 85, 105, 0.3);
                }

                .form-title {
                    font-size: 18px;
                    font-weight: 600;
                    color: #f8fafc;
                    margin: 0;
                }

                .close-btn {
                    background: none;
                    border: none;
                    color: #94a3b8;
                    font-size: 24px;
                    cursor: pointer;
                    padding: 0;
                    width: 30px;
                    height: 30px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 6px;
                    transition: all 0.2s ease;
                }

                .close-btn:hover {
                    background: rgba(239, 68, 68, 0.1);
                    color: #ef4444;
                }

                .form-content {
                    padding: 20px;
                }

                .form-row {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 16px;
                    margin-bottom: 16px;
                }

                .form-group {
                    display: flex;
                    flex-direction: column;
                    gap: 6px;
                }

                .form-label {
                    font-size: 12px;
                    font-weight: 600;
                    color: #94a3b8;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }

                .form-input, .form-select, .form-textarea {
                    background: rgba(30, 41, 59, 0.8);
                    border: 1px solid rgba(148, 163, 184, 0.2);
                    border-radius: 8px;
                    color: #f1f5f9;
                    padding: 12px 16px;
                    font-size: 16px;
                    transition: all 0.3s ease;
                }

                .form-input:focus, .form-select:focus, .form-textarea:focus {
                    outline: none;
                    border-color: #0d9488;
                    box-shadow: 0 0 0 3px rgba(13, 148, 136, 0.1);
                }

                .form-textarea {
                    resize: vertical;
                    min-height: 80px;
                    font-family: inherit;
                }

                .form-input.required, .form-select.required {
                    border-color: #ef4444;
                }

                .required-message {
                    font-size: 12px;
                    color: #ef4444;
                    margin-top: 4px;
                    display: none;
                }

                .form-input.required ~ .required-message {
                    display: block;
                }

                /* BUSCA DE PROCEDIMENTOS */
                .treatment-search-container {
                    position: relative;
                    display: flex;
                    gap: 8px;
                }

                .treatment-search {
                    flex: 1;
                }

                .add-procedure-btn {
                    background: linear-gradient(135deg, #059669 0%, #10b981 100%);
                    border: none;
                    border-radius: 8px;
                    color: white;
                    width: 44px;
                    height: 44px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    font-size: 16px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 2px 8px rgba(5, 150, 105, 0.3);
                }

                .add-procedure-btn:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(5, 150, 105, 0.4);
                }

                .procedures-dropdown {
                    position: absolute;
                    top: 100%;
                    left: 0;
                    right: 48px;
                    background: rgba(30, 41, 59, 0.95);
                    border: 1px solid rgba(148, 163, 184, 0.2);
                    border-radius: 8px;
                    max-height: 300px;
                    overflow-y: auto;
                    z-index: 1000;
                    backdrop-filter: blur(8px);
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
                    margin-top: 4px;
                }

                .procedures-dropdown.hidden {
                    display: none;
                }

                .procedure-item {
                    padding: 12px 16px;
                    cursor: pointer;
                    border-bottom: 1px solid rgba(71, 85, 105, 0.2);
                    transition: all 0.2s ease;
                }

                .procedure-item:last-child {
                    border-bottom: none;
                }

                .procedure-item:hover {
                    background: rgba(13, 148, 136, 0.1);
                }

                .procedure-item.no-results {
                    cursor: default;
                    opacity: 0.7;
                }

                .procedure-item.no-results:hover {
                    background: transparent;
                }

                .procedure-name {
                    font-weight: 600;
                    color: #f1f5f9;
                    margin-bottom: 4px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .custom-badge {
                    background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
                    color: white;
                    padding: 2px 8px;
                    border-radius: 12px;
                    font-size: 10px;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }

                .procedure-details {
                    font-size: 12px;
                    color: #94a3b8;
                }

                .procedure-suggestion {
                    font-size: 11px;
                    color: #6b7280;
                    font-style: italic;
                }

                /* MODAL DE NOVO PROCEDIMENTO */
                .procedure-modal {
                    position: fixed;
                    inset: 0;
                    z-index: 9999;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 20px;
                }

                .procedure-modal.hidden {
                    display: none;
                }

                .modal-overlay {
                    position: absolute;
                    inset: 0;
                    background: rgba(0, 0, 0, 0.8);
                    backdrop-filter: blur(4px);
                }

                .modal-container {
                    position: relative;
                    background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
                    border: 1px solid rgba(71, 85, 105, 0.3);
                    border-radius: 16px;
                    width: 100%;
                    max-width: 600px;
                    max-height: 90vh;
                    overflow: hidden;
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
                }

                .modal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 24px;
                    border-bottom: 1px solid rgba(71, 85, 105, 0.3);
                }

                .modal-title {
                    font-size: 20px;
                    font-weight: 600;
                    color: #f8fafc;
                    margin: 0;
                }

                .modal-close {
                    background: none;
                    border: none;
                    color: #94a3b8;
                    font-size: 24px;
                    cursor: pointer;
                    padding: 0;
                    width: 32px;
                    height: 32px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 8px;
                    transition: all 0.2s ease;
                }

                .modal-close:hover {
                    background: rgba(239, 68, 68, 0.1);
                    color: #ef4444;
                }

                .modal-content {
                    padding: 24px;
                    max-height: 60vh;
                    overflow-y: auto;
                }

                .modal-actions {
                    padding: 20px 24px;
                    border-top: 1px solid rgba(71, 85, 105, 0.3);
                    display: flex;
                    gap: 12px;
                    justify-content: flex-end;
                }

                .modal-btn {
                    padding: 12px 24px;
                    border: none;
                    border-radius: 8px;
                    font-weight: 600;
                    font-size: 14px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }

                .modal-btn.secondary {
                    background: rgba(107, 114, 128, 0.2);
                    color: #9ca3af;
                    border: 1px solid rgba(107, 114, 128, 0.3);
                }

                .modal-btn.secondary:hover {
                    background: rgba(107, 114, 128, 0.3);
                }

                .modal-btn.primary {
                    background: linear-gradient(135deg, #0d9488 0%, #14b8a6 100%);
                    color: white;
                    box-shadow: 0 4px 12px rgba(13, 148, 136, 0.3);
                }

                .modal-btn.primary:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 6px 16px rgba(13, 148, 136, 0.4);
                }

                /* SEÇÃO DE TRATAMENTO */
                .treatment-form-section {
                    background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
                    border-radius: 12px;
                    padding: 20px;
                    margin-bottom: 20px;
                    border: 1px solid rgba(71, 85, 105, 0.3);
                }

                .section-title {
                    font-size: 16px;
                    font-weight: 600;
                    color: #f8fafc;
                    margin: 0 0 16px 0;
                }

                .tooth-selection-info {
                    margin-top: 16px;
                    padding: 12px 16px;
                    background: rgba(13, 148, 136, 0.1);
                    border: 1px solid rgba(13, 148, 136, 0.3);
                    border-radius: 8px;
                }

                .selection-label {
                    font-size: 12px;
                    font-weight: 600;
                    color: #14b8a6;
                    text-transform: uppercase;
                    display: block;
                    margin-bottom: 6px;
                }

                .selected-teeth-display {
                    color: #e2e8f0;
                    font-weight: 500;
                }

                /* ODONTOGRAMA */
                .odontogram-section {
                    background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
                    border-radius: 12px;
                    padding: 20px;
                    margin-bottom: 20px;
                    border: 1px solid rgba(71, 85, 105, 0.3);
                }

                .tooth-type-tabs {
                    display: flex;
                    gap: 4px;
                    margin-bottom: 20px;
                    background: rgba(0, 0, 0, 0.2);
                    border-radius: 8px;
                    padding: 4px;
                }

                .tooth-tab {
                    flex: 1;
                    padding: 12px 16px;
                    border: none;
                    border-radius: 6px;
                    background: transparent;
                    color: #94a3b8;
                    font-weight: 600;
                    font-size: 14px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }

                .tooth-tab.active {
                    background: linear-gradient(135deg, #0d9488 0%, #14b8a6 100%);
                    color: white;
                    box-shadow: 0 2px 8px rgba(13, 148, 136, 0.3);
                }

                .tooth-tab:hover:not(.active) {
                    background: rgba(255, 255, 255, 0.1);
                    color: #e2e8f0;
                }

                .odontogram-container {
                    background: #f8fafc;
                    border-radius: 12px;
                    padding: 30px;
                    margin-bottom: 20px;
                }

                .teeth-row {
                    display: flex;
                    justify-content: center;
                    gap: 8px;
                    margin: 10px 0;
                }

                .teeth-divider {
                    height: 2px;
                    background: linear-gradient(90deg, transparent, #94a3b8, transparent);
                    margin: 20px 0;
                }

                .tooth-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 6px;
                }

                .tooth-number {
                    font-size: 12px;
                    font-weight: 600;
                    color: #475569;
                }

                .tooth {
                    width: 40px;
                    height: 50px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    color: #e2e8f0;
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .tooth:hover {
                    transform: scale(1.1);
                    color: #0d9488;
                }

                .tooth.selected {
                    color: #14b8a6;
                    background: rgba(13, 148, 136, 0.2);
                    border: 2px solid #14b8a6;
                    transform: scale(1.05);
                }

                .tooth-svg {
                    width: 100%;
                    height: 100%;
                }

                /* SELEÇÃO RÁPIDA */
                .quick-selection {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 8px;
                    margin-bottom: 20px;
                }

                .region-btn {
                    background: rgba(30, 41, 59, 0.8);
                    border: 1px solid rgba(148, 163, 184, 0.2);
                    border-radius: 6px;
                    color: #e2e8f0;
                    padding: 8px 16px;
                    font-size: 12px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }

                .region-btn:hover {
                    background: rgba(13, 148, 136, 0.2);
                    border-color: #14b8a6;
                    color: #14b8a6;
                }

                .add-treatment-section {
                    text-align: center;
                }

                .add-treatment-btn {
                    background: linear-gradient(135deg, #0d9488 0%, #14b8a6 100%);
                    border: none;
                    border-radius: 8px;
                    color: white;
                    padding: 14px 32px;
                    font-size: 14px;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    box-shadow: 0 4px 15px rgba(13, 148, 136, 0.3);
                }

                .add-treatment-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(13, 148, 136, 0.4);
                }

                /* LISTA DE TRATAMENTOS */
                .treatments-list-section {
                    background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
                    border-radius: 12px;
                    padding: 20px;
                    border: 1px solid rgba(71, 85, 105, 0.3);
                }

                .treatments-list {
                    margin-bottom: 20px;
                }

                .no-treatments {
                    text-align: center;
                    color: #94a3b8;
                    padding: 40px;
                    font-style: italic;
                }

                .treatment-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 16px;
                    background: rgba(30, 41, 59, 0.5);
                    border-radius: 8px;
                    margin-bottom: 12px;
                    border: 1px solid rgba(71, 85, 105, 0.3);
                }

                .treatment-info {
                    flex: 1;
                }

                .treatment-name {
                    font-weight: 600;
                    color: #f8fafc;
                    margin-bottom: 4px;
                }

                .treatment-details {
                    font-size: 12px;
                    color: #94a3b8;
                }

                .remove-treatment-btn {
                    background: rgba(239, 68, 68, 0.1);
                    border: 1px solid rgba(239, 68, 68, 0.3);
                    border-radius: 6px;
                    color: #ef4444;
                    padding: 8px 12px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }

                .remove-treatment-btn:hover {
                    background: rgba(239, 68, 68, 0.2);
                }

                .budget-summary {
                    border-top: 1px solid rgba(71, 85, 105, 0.3);
                    padding-top: 20px;
                }

                .total-section {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 16px;
                }

                .total-label {
                    font-size: 18px;
                    font-weight: 600;
                    color: #f8fafc;
                }

                .total-value {
                    font-size: 24px;
                    font-weight: 700;
                    color: #14b8a6;
                }

                .save-budget-btn {
                    background: linear-gradient(135deg, #0d9488 0%, #14b8a6 100%);
                    border: none;
                    border-radius: 8px;
                    color: white;
                    padding: 14px 32px;
                    font-size: 16px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    width: 100%;
                    box-shadow: 0 4px 15px rgba(13, 148, 136, 0.3);
                }

                .save-budget-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(13, 148, 136, 0.4);
                }

                /* RESPONSIVIDADE */
                @media (max-width: 768px) {
                    .orcamentos-odontograma-workspace {
                        padding: 12px;
                    }

                    .form-row {
                        grid-template-columns: 1fr;
                    }

                    .tooth-type-tabs {
                        flex-direction: column;
                    }

                    .teeth-row {
                        gap: 4px;
                    }

                    .tooth {
                        width: 30px;
                        height: 40px;
                    }

                    .tooth-number {
                        font-size: 10px;
                    }

                    .quick-selection {
                        justify-content: center;
                    }
                    
                    .treatment-search-container {
                        flex-direction: column;
                    }
                    
                    .add-procedure-btn {
                        width: 100%;
                        height: 44px;
                    }
                    
                    .procedures-dropdown {
                        right: 0;
                    }
                }
            `;
            document.head.appendChild(styles);
        }
    }
};

// Inicializar quando carregado
document.addEventListener('DOMContentLoaded', function() {
    if (typeof OrcamentosOdontograma !== 'undefined') {
        OrcamentosOdontograma.init();
    }
});

// Exportar para uso global
window.OrcamentosOdontograma = OrcamentosOdontograma;

console.log('🦷 Módulo Orçamentos com Odontograma V2 CORRIGIDO carregado!');