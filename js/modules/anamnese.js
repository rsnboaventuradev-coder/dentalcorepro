// ============================================================================
// DENTALCORE PRO - MÓDULO DE ANAMNESE PREMIUM
// Formulários profissionais e inteligentes para anamnese odontológica
// ============================================================================

const Anamnese = {
    currentPatientId: null,
    currentAnamnesis: null,
    isEditing: false,
    autoSaveTimeout: null,

    /**
     * Inicializar módulo de anamnese
     */
    init() {
        console.log('📝 Módulo de Anamnese Premium carregado');
        this.addCustomStyles();
        this.setupEventListeners();
    },

    /**
     * Configurar event listeners
     */
    setupEventListeners() {
        // Auto-save listener
        window.addEventListener('autosave', () => {
            if (this.currentPatientId && this.currentAnamnesis) {
                this.saveAnamnesis();
            }
        });
    },

    /**
     * Renderizar interface de anamnese
     */
    renderTabAnamnese(patient) {
        this.currentPatientId = patient.id;
        this.loadAnamnesis();
        
        return `
            <div class="anamnesis-workspace p-8">
                <div class="max-w-6xl mx-auto">
                    
                    <!-- Cabeçalho Premium -->
                    <div class="anamnesis-header-card mb-8">
                        <div class="flex items-center justify-between mb-6">
                            <div>
                                <h1 class="text-4xl font-light text-white mb-3 tracking-tight">
                                    Anamnese Odontológica
                                </h1>
                                <p class="text-gray-300 text-lg">
                                    Histórico médico e dental completo para ${patient.name}
                                </p>
                            </div>
                            <div class="flex items-center space-x-4">
                                <div class="anamnesis-status">
                                    ${this.currentAnamnesis ? `
                                        <span class="status-completed">✅ Completa</span>
                                        <span class="last-update">Atualizada em ${new Date(this.currentAnamnesis.lastUpdate).toLocaleDateString('pt-BR')}</span>
                                    ` : `
                                        <span class="status-pending">⏳ Pendente</span>
                                        <span class="last-update">Aguardando preenchimento</span>
                                    `}
                                </div>
                                <button onclick="Anamnese.toggleEditMode()" class="anamnesis-action-btn">
                                    <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                    </svg>
                                    ${this.isEditing ? 'Visualizar' : 'Editar'}
                                </button>
                                <button onclick="Anamnese.printAnamnesis()" class="anamnesis-action-btn">
                                    <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path>
                                    </svg>
                                    Imprimir
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Formulário de Anamnese -->
                    <div class="anamnesis-form-container">
                        ${this.renderAnamnesisForm()}
                    </div>

                    <!-- Análise de Risco (IA) -->
                    <div class="risk-analysis-panel">
                        ${this.renderRiskAnalysis()}
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * Renderizar formulário de anamnese
     */
    renderAnamnesisForm() {
        const data = this.currentAnamnesis || this.getEmptyAnamnesis();
        
        return `
            <form id="anamnesisForm" class="anamnesis-form" onsubmit="return Anamnese.handleSubmit(event)">
                
                <!-- Seção 1: Dados Pessoais -->
                <div class="form-section">
                    <div class="section-header">
                        <h3 class="section-title">👤 Dados Pessoais e Identificação</h3>
                        <div class="section-progress">
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${this.calculateSectionProgress('personal')}%"></div>
                            </div>
                            <span class="progress-text">${this.calculateSectionProgress('personal')}%</span>
                        </div>
                    </div>
                    
                    <div class="form-grid">
                        <div class="form-group full-width">
                            <label class="form-label">Nome Completo</label>
                            <input type="text" 
                                   class="form-input" 
                                   name="fullName" 
                                   value="${data.personal?.fullName || ''}"
                                   ${this.isEditing ? '' : 'readonly'}
                                   oninput="Anamnese.handleFieldChange(this)">
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Data de Nascimento</label>
                            <input type="date" 
                                   class="form-input" 
                                   name="birthDate" 
                                   value="${data.personal?.birthDate || ''}"
                                   ${this.isEditing ? '' : 'readonly'}
                                   oninput="Anamnese.handleFieldChange(this)">
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Gênero</label>
                            <select class="form-input" 
                                    name="gender" 
                                    ${this.isEditing ? '' : 'disabled'}
                                    onchange="Anamnese.handleFieldChange(this)">
                                <option value="">Selecionar</option>
                                <option value="masculino" ${data.personal?.gender === 'masculino' ? 'selected' : ''}>Masculino</option>
                                <option value="feminino" ${data.personal?.gender === 'feminino' ? 'selected' : ''}>Feminino</option>
                                <option value="outro" ${data.personal?.gender === 'outro' ? 'selected' : ''}>Outro</option>
                                <option value="nao-informar" ${data.personal?.gender === 'nao-informar' ? 'selected' : ''}>Prefiro não informar</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Estado Civil</label>
                            <select class="form-input" 
                                    name="maritalStatus" 
                                    ${this.isEditing ? '' : 'disabled'}
                                    onchange="Anamnese.handleFieldChange(this)">
                                <option value="">Selecionar</option>
                                <option value="solteiro" ${data.personal?.maritalStatus === 'solteiro' ? 'selected' : ''}>Solteiro(a)</option>
                                <option value="casado" ${data.personal?.maritalStatus === 'casado' ? 'selected' : ''}>Casado(a)</option>
                                <option value="divorciado" ${data.personal?.maritalStatus === 'divorciado' ? 'selected' : ''}>Divorciado(a)</option>
                                <option value="viuvo" ${data.personal?.maritalStatus === 'viuvo' ? 'selected' : ''}>Viúvo(a)</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Profissão</label>
                            <input type="text" 
                                   class="form-input" 
                                   name="profession" 
                                   value="${data.personal?.profession || ''}"
                                   ${this.isEditing ? '' : 'readonly'}
                                   oninput="Anamnese.handleFieldChange(this)">
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Telefone de Emergência</label>
                            <input type="tel" 
                                   class="form-input" 
                                   name="emergencyPhone" 
                                   value="${data.personal?.emergencyPhone || ''}"
                                   ${this.isEditing ? '' : 'readonly'}
                                   oninput="Anamnese.handleFieldChange(this)">
                        </div>
                    </div>
                </div>

                <!-- Seção 2: História Médica -->
                <div class="form-section">
                    <div class="section-header">
                        <h3 class="section-title">🏥 História Médica Geral</h3>
                        <div class="section-progress">
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${this.calculateSectionProgress('medical')}%"></div>
                            </div>
                            <span class="progress-text">${this.calculateSectionProgress('medical')}%</span>
                        </div>
                    </div>
                    
                    <div class="checkbox-grid">
                        ${this.renderMedicalConditions(data.medical)}
                    </div>
                    
                    <div class="form-group full-width">
                        <label class="form-label">Medicamentos em Uso</label>
                        <textarea class="form-textarea" 
                                  name="medications" 
                                  rows="3"
                                  ${this.isEditing ? '' : 'readonly'}
                                  placeholder="Liste todos os medicamentos que você usa regularmente, incluindo vitaminas e suplementos"
                                  oninput="Anamnese.handleFieldChange(this)">${data.medical?.medications || ''}</textarea>
                    </div>
                    
                    <div class="form-group full-width">
                        <label class="form-label">Alergias Conhecidas</label>
                        <textarea class="form-textarea" 
                                  name="allergies" 
                                  rows="2"
                                  ${this.isEditing ? '' : 'readonly'}
                                  placeholder="Descreva qualquer alergia a medicamentos, alimentos ou outras substâncias"
                                  oninput="Anamnese.handleFieldChange(this)">${data.medical?.allergies || ''}</textarea>
                    </div>
                </div>

                <!-- Seção 3: História Dental -->
                <div class="form-section">
                    <div class="section-header">
                        <h3 class="section-title">🦷 História Dental e Oral</h3>
                        <div class="section-progress">
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${this.calculateSectionProgress('dental')}%"></div>
                            </div>
                            <span class="progress-text">${this.calculateSectionProgress('dental')}%</span>
                        </div>
                    </div>
                    
                    <div class="form-grid">
                        <div class="form-group">
                            <label class="form-label">Última Consulta Odontológica</label>
                            <input type="date" 
                                   class="form-input" 
                                   name="lastDentalVisit" 
                                   value="${data.dental?.lastDentalVisit || ''}"
                                   ${this.isEditing ? '' : 'readonly'}
                                   oninput="Anamnese.handleFieldChange(this)">
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Motivo da Consulta Atual</label>
                            <select class="form-input" 
                                    name="visitReason" 
                                    ${this.isEditing ? '' : 'disabled'}
                                    onchange="Anamnese.handleFieldChange(this)">
                                <option value="">Selecionar</option>
                                <option value="rotina" ${data.dental?.visitReason === 'rotina' ? 'selected' : ''}>Consulta de Rotina</option>
                                <option value="dor" ${data.dental?.visitReason === 'dor' ? 'selected' : ''}>Dor de Dente</option>
                                <option value="estetico" ${data.dental?.visitReason === 'estetico' ? 'selected' : ''}>Tratamento Estético</option>
                                <option value="urgencia" ${data.dental?.visitReason === 'urgencia' ? 'selected' : ''}>Urgência</option>
                                <option value="limpeza" ${data.dental?.visitReason === 'limpeza' ? 'selected' : ''}>Limpeza</option>
                                <option value="outro" ${data.dental?.visitReason === 'outro' ? 'selected' : ''}>Outro</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Frequência de Escovação</label>
                            <select class="form-input" 
                                    name="brushingFrequency" 
                                    ${this.isEditing ? '' : 'disabled'}
                                    onchange="Anamnese.handleFieldChange(this)">
                                <option value="">Selecionar</option>
                                <option value="1x" ${data.dental?.brushingFrequency === '1x' ? 'selected' : ''}>1x ao dia</option>
                                <option value="2x" ${data.dental?.brushingFrequency === '2x' ? 'selected' : ''}>2x ao dia</option>
                                <option value="3x" ${data.dental?.brushingFrequency === '3x' ? 'selected' : ''}>3x ao dia</option>
                                <option value="3x+" ${data.dental?.brushingFrequency === '3x+' ? 'selected' : ''}>Mais de 3x ao dia</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Uso de Fio Dental</label>
                            <select class="form-input" 
                                    name="flossing" 
                                    ${this.isEditing ? '' : 'disabled'}
                                    onchange="Anamnese.handleFieldChange(this)">
                                <option value="">Selecionar</option>
                                <option value="diario" ${data.dental?.flossing === 'diario' ? 'selected' : ''}>Diariamente</option>
                                <option value="semanal" ${data.dental?.flossing === 'semanal' ? 'selected' : ''}>Algumas vezes por semana</option>
                                <option value="raramente" ${data.dental?.flossing === 'raramente' ? 'selected' : ''}>Raramente</option>
                                <option value="nunca" ${data.dental?.flossing === 'nunca' ? 'selected' : ''}>Nunca</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="checkbox-grid">
                        ${this.renderDentalSymptoms(data.dental)}
                    </div>
                    
                    <div class="form-group full-width">
                        <label class="form-label">Histórico de Tratamentos Dentários</label>
                        <textarea class="form-textarea" 
                                  name="dentalHistory" 
                                  rows="3"
                                  ${this.isEditing ? '' : 'readonly'}
                                  placeholder="Descreva tratamentos anteriores: obturações, extrações, ortodontia, etc."
                                  oninput="Anamnese.handleFieldChange(this)">${data.dental?.dentalHistory || ''}</textarea>
                    </div>
                </div>

                <!-- Seção 4: Hábitos e Estilo de Vida -->
                <div class="form-section">
                    <div class="section-header">
                        <h3 class="section-title">🚭 Hábitos e Estilo de Vida</h3>
                        <div class="section-progress">
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${this.calculateSectionProgress('lifestyle')}%"></div>
                            </div>
                            <span class="progress-text">${this.calculateSectionProgress('lifestyle')}%</span>
                        </div>
                    </div>
                    
                    <div class="habit-questions">
                        ${this.renderHabitQuestions(data.lifestyle)}
                    </div>
                </div>

                <!-- Botões de Ação -->
                ${this.isEditing ? `
                    <div class="form-actions">
                        <button type="button" onclick="Anamnese.cancelEdit()" class="btn-cancel">
                            Cancelar
                        </button>
                        <button type="button" onclick="Anamnese.saveDraft()" class="btn-draft">
                            Salvar Rascunho
                        </button>
                        <button type="submit" class="btn-save">
                            Salvar Anamnese
                        </button>
                    </div>
                ` : ''}
            </form>
        `;
    },

    /**
     * Renderizar condições médicas
     */
    renderMedicalConditions(medicalData) {
        const conditions = [
            { id: 'diabetes', label: '💉 Diabetes' },
            { id: 'hypertension', label: '❤️ Hipertensão' },
            { id: 'heartDisease', label: '💔 Doença Cardíaca' },
            { id: 'asthma', label: '🫁 Asma' },
            { id: 'epilepsy', label: '🧠 Epilepsia' },
            { id: 'hepatitis', label: '🔬 Hepatite' },
            { id: 'hiv', label: '🔬 HIV' },
            { id: 'cancer', label: '🎗️ Câncer' },
            { id: 'pregnancy', label: '🤱 Gravidez' },
            { id: 'bleeding', label: '🩸 Distúrbios de Coagulação' },
            { id: 'kidney', label: '🫘 Problemas Renais' },
            { id: 'thyroid', label: '🦋 Problemas de Tireoide' }
        ];

        return conditions.map(condition => `
            <div class="checkbox-item">
                <input type="checkbox" 
                       id="${condition.id}" 
                       name="medical.${condition.id}" 
                       ${medicalData?.[condition.id] ? 'checked' : ''}
                       ${this.isEditing ? '' : 'disabled'}
                       onchange="Anamnese.handleFieldChange(this)">
                <label for="${condition.id}" class="checkbox-label">
                    ${condition.label}
                </label>
            </div>
        `).join('');
    },

    /**
     * Renderizar sintomas dentais
     */
    renderDentalSymptoms(dentalData) {
        const symptoms = [
            { id: 'toothache', label: '😣 Dor de Dente' },
            { id: 'sensitivity', label: '❄️ Sensibilidade' },
            { id: 'bleeding', label: '🩸 Sangramento Gengival' },
            { id: 'badBreath', label: '💨 Mau Hálito' },
            { id: 'dryMouth', label: '👄 Boca Seca' },
            { id: 'grinding', label: '😬 Ranger os Dentes' },
            { id: 'clicking', label: '🔊 Estalos na ATM' },
            { id: 'swelling', label: '😳 Inchaço' }
        ];

        return symptoms.map(symptom => `
            <div class="checkbox-item">
                <input type="checkbox" 
                       id="${symptom.id}" 
                       name="dental.${symptom.id}" 
                       ${dentalData?.[symptom.id] ? 'checked' : ''}
                       ${this.isEditing ? '' : 'disabled'}
                       onchange="Anamnese.handleFieldChange(this)">
                <label for="${symptom.id}" class="checkbox-label">
                    ${symptom.label}
                </label>
            </div>
        `).join('');
    },

    /**
     * Renderizar perguntas sobre hábitos
     */
    renderHabitQuestions(lifestyleData) {
        const habits = [
            {
                id: 'smoking',
                question: '🚭 Você fuma ou já fumou?',
                options: [
                    { value: 'never', label: 'Nunca fumei' },
                    { value: 'current', label: 'Fumo atualmente' },
                    { value: 'former', label: 'Ex-fumante' }
                ]
            },
            {
                id: 'alcohol',
                question: '🍷 Com que frequência consome álcool?',
                options: [
                    { value: 'never', label: 'Nunca' },
                    { value: 'social', label: 'Socialmente' },
                    { value: 'weekly', label: 'Semanalmente' },
                    { value: 'daily', label: 'Diariamente' }
                ]
            },
            {
                id: 'exercise',
                question: '🏃‍♂️ Pratica exercícios regularmente?',
                options: [
                    { value: 'never', label: 'Não pratico' },
                    { value: 'occasionally', label: 'Ocasionalmente' },
                    { value: 'weekly', label: '2-3 vezes por semana' },
                    { value: 'daily', label: 'Diariamente' }
                ]
            },
            {
                id: 'stress',
                question: '😰 Como avalia seu nível de estresse?',
                options: [
                    { value: 'low', label: 'Baixo' },
                    { value: 'moderate', label: 'Moderado' },
                    { value: 'high', label: 'Alto' },
                    { value: 'very-high', label: 'Muito alto' }
                ]
            }
        ];

        return habits.map(habit => `
            <div class="habit-question">
                <h4 class="question-title">${habit.question}</h4>
                <div class="radio-group">
                    ${habit.options.map(option => `
                        <div class="radio-item">
                            <input type="radio" 
                                   id="${habit.id}_${option.value}" 
                                   name="lifestyle.${habit.id}" 
                                   value="${option.value}"
                                   ${lifestyleData?.[habit.id] === option.value ? 'checked' : ''}
                                   ${this.isEditing ? '' : 'disabled'}
                                   onchange="Anamnese.handleFieldChange(this)">
                            <label for="${habit.id}_${option.value}" class="radio-label">
                                ${option.label}
                            </label>
                        </div>
                    `).join('')}
                </div>
            </div>
        `).join('');
    },

    /**
     * Renderizar análise de risco
     */
    renderRiskAnalysis() {
        if (!this.currentAnamnesis) {
            return `
                <div class="risk-analysis-card">
                    <h3 class="risk-title">🤖 Análise de Risco por IA</h3>
                    <p class="risk-message">Preencha a anamnese para gerar uma análise de risco personalizada.</p>
                </div>
            `;
        }

        const riskScore = this.calculateRiskScore();
        const recommendations = this.generateRecommendations();

        return `
            <div class="risk-analysis-card">
                <h3 class="risk-title">🤖 Análise de Risco por IA</h3>
                
                <div class="risk-score-container">
                    <div class="risk-score ${riskScore.level}">
                        <div class="score-number">${riskScore.score}/100</div>
                        <div class="score-label">Pontuação de Risco</div>
                    </div>
                    <div class="risk-level">
                        <span class="level-badge ${riskScore.level}">${riskScore.levelText}</span>
                        <p class="level-description">${riskScore.description}</p>
                    </div>
                </div>

                <div class="recommendations">
                    <h4 class="recommendations-title">💡 Recomendações Clínicas</h4>
                    <div class="recommendations-list">
                        ${recommendations.map(rec => `
                            <div class="recommendation-item">
                                <span class="rec-icon">${rec.icon}</span>
                                <div class="rec-content">
                                    <h5 class="rec-title">${rec.title}</h5>
                                    <p class="rec-description">${rec.description}</p>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * FUNÇÕES DE CONTROLE
     */

    toggleEditMode() {
        this.isEditing = !this.isEditing;
        this.refreshForm();
    },

    handleFieldChange(element) {
        if (!this.isEditing) return;
        
        // Auto-save com debounce
        clearTimeout(this.autoSaveTimeout);
        this.autoSaveTimeout = setTimeout(() => {
            this.saveDraft();
        }, 2000);
        
        // Atualizar dados temporários
        if (!this.currentAnamnesis) {
            this.currentAnamnesis = this.getEmptyAnamnesis();
        }
        
        this.updateFormData(element);
    },

    updateFormData(element) {
        const name = element.name;
        const value = element.type === 'checkbox' ? element.checked : element.value;
        
        // Navegar pela estrutura do objeto
        const keys = name.split('.');
        let current = this.currentAnamnesis;
        
        for (let i = 0; i < keys.length - 1; i++) {
            if (!current[keys[i]]) {
                current[keys[i]] = {};
            }
            current = current[keys[i]];
        }
        
        current[keys[keys.length - 1]] = value;
    },

    handleSubmit(event) {
        event.preventDefault();
        this.saveAnamnesis();
        return false;
    },

    saveDraft() {
        if (!this.currentAnamnesis) return;
        
        this.currentAnamnesis.lastUpdate = new Date().toISOString();
        this.currentAnamnesis.status = 'draft';
        
        DataPersistence.saveAnamnesis(this.currentPatientId, this.currentAnamnesis);
        this.showSaveIndicator('💾 Rascunho salvo automaticamente');
    },

    saveAnamnesis() {
        if (!this.currentAnamnesis) return;
        
        this.currentAnamnesis.lastUpdate = new Date().toISOString();
        this.currentAnamnesis.status = 'completed';
        this.currentAnamnesis.completedAt = new Date().toISOString();
        
        DataPersistence.saveAnamnesis(this.currentPatientId, this.currentAnamnesis);
        
        this.isEditing = false;
        this.refreshForm();
        
        UI.showAlert('✅ Anamnese Salva!\n\nAnamnese foi salva com sucesso.\nAnálise de risco atualizada.');
    },

    cancelEdit() {
        this.isEditing = false;
        this.loadAnamnesis(); // Recarregar dados originais
        this.refreshForm();
    },

    /**
     * FUNÇÕES DE DADOS
     */

    loadAnamnesis() {
        this.currentAnamnesis = DataPersistence.getAnamnesis(this.currentPatientId);
        console.log('📖 Anamnese carregada:', this.currentAnamnesis ? 'Completa' : 'Vazia');
    },

    getEmptyAnamnesis() {
        return {
            personal: {},
            medical: {},
            dental: {},
            lifestyle: {},
            status: 'pending',
            createdAt: new Date().toISOString()
        };
    },

    /**
     * FUNÇÕES DE ANÁLISE
     */

    calculateRiskScore() {
        if (!this.currentAnamnesis) return { score: 0, level: 'unknown', levelText: 'Desconhecido', description: '' };
        
        let score = 0;
        const factors = [];
        
        // Fatores médicos
        if (this.currentAnamnesis.medical?.diabetes) { score += 15; factors.push('Diabetes'); }
        if (this.currentAnamnesis.medical?.hypertension) { score += 10; factors.push('Hipertensão'); }
        if (this.currentAnamnesis.medical?.heartDisease) { score += 20; factors.push('Doença Cardíaca'); }
        if (this.currentAnamnesis.medical?.bleeding) { score += 15; factors.push('Problemas de Coagulação'); }
        
        // Fatores dentais
        if (this.currentAnamnesis.dental?.toothache) { score += 10; }
        if (this.currentAnamnesis.dental?.bleeding) { score += 8; }
        if (this.currentAnamnesis.dental?.grinding) { score += 5; }
        
        // Fatores de estilo de vida
        if (this.currentAnamnesis.lifestyle?.smoking === 'current') { score += 20; factors.push('Tabagismo'); }
        if (this.currentAnamnesis.lifestyle?.stress === 'high') { score += 8; }
        if (this.currentAnamnesis.lifestyle?.stress === 'very-high') { score += 12; }
        
        let level, levelText, description;
        
        if (score <= 20) {
            level = 'low';
            levelText = 'Baixo Risco';
            description = 'Paciente apresenta baixo risco para complicações odontológicas.';
        } else if (score <= 40) {
            level = 'moderate';
            levelText = 'Risco Moderado';
            description = 'Atenção especial necessária durante procedimentos.';
        } else {
            level = 'high';
            levelText = 'Alto Risco';
            description = 'Paciente requer cuidados especiais e possível interconsulta médica.';
        }
        
        return { score, level, levelText, description, factors };
    },

    generateRecommendations() {
        const recommendations = [];
        const riskAnalysis = this.calculateRiskScore();
        
        if (this.currentAnamnesis.medical?.diabetes) {
            recommendations.push({
                icon: '💉',
                title: 'Controle Glicêmico',
                description: 'Verificar nível de glicose antes de procedimentos. Agendar preferencialmente no período da manhã.'
            });
        }
        
        if (this.currentAnamnesis.medical?.hypertension) {
            recommendations.push({
                icon: '❤️',
                title: 'Monitoramento da Pressão',
                description: 'Aferir pressão arterial antes do tratamento. Evitar anestésicos com vasoconstrictor se pressão > 160x100.'
            });
        }
        
        if (this.currentAnamnesis.lifestyle?.smoking === 'current') {
            recommendations.push({
                icon: '🚭',
                title: 'Cessação do Tabagismo',
                description: 'Orientar sobre riscos. Considerar adiamento de cirurgias até cessação ou redução significativa.'
            });
        }
        
        if (this.currentAnamnesis.dental?.grinding) {
            recommendations.push({
                icon: '😬',
                title: 'Proteção Noturna',
                description: 'Confeccionar placa miorrelaxante para proteção dental durante o sono.'
            });
        }
        
        if (recommendations.length === 0) {
            recommendations.push({
                icon: '✅',
                title: 'Paciente de Baixo Risco',
                description: 'Nenhuma precaução especial necessária. Seguir protocolo padrão de atendimento.'
            });
        }
        
        return recommendations;
    },

    calculateSectionProgress(section) {
        if (!this.currentAnamnesis) return 0;
        
        const sectionData = this.currentAnamnesis[section];
        if (!sectionData) return 0;
        
        const totalFields = {
            'personal': 6,
            'medical': 15,
            'dental': 12,
            'lifestyle': 4
        };
        
        const filledFields = Object.values(sectionData).filter(value => 
            value !== '' && value !== null && value !== undefined
        ).length;
        
        return Math.round((filledFields / totalFields[section]) * 100);
    },

    /**
     * FUNÇÕES AUXILIARES
     */

    refreshForm() {
        const container = document.querySelector('.anamnesis-form-container');
        if (container) {
            container.innerHTML = this.renderAnamnesisForm();
        }
        
        const riskContainer = document.querySelector('.risk-analysis-panel');
        if (riskContainer) {
            riskContainer.innerHTML = this.renderRiskAnalysis();
        }
    },

    showSaveIndicator(message) {
        // Criar indicador temporário
        const indicator = document.createElement('div');
        indicator.className = 'save-indicator';
        indicator.textContent = message;
        indicator.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(16, 185, 129, 0.9);
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            z-index: 1000;
            font-size: 14px;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(indicator);
        
        setTimeout(() => {
            indicator.remove();
        }, 3000);
    },

    printAnamnesis() {
        window.print();
    },

    /**
     * ESTILOS CUSTOMIZADOS
     */
    addCustomStyles() {
        if (!document.getElementById('anamnesisStyles')) {
            const styles = document.createElement('style');
            styles.id = 'anamnesisStyles';
            styles.textContent = `
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                
                .anamnesis-workspace {
                    background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
                    min-height: 100vh;
                }
                
                .anamnesis-header-card {
                    background: linear-gradient(135deg, #334155 0%, #1e293b 100%);
                    border: 1px solid rgba(71, 85, 105, 0.3);
                    border-radius: 24px;
                    padding: 32px;
                    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.4);
                }
                
                .anamnesis-status {
                    text-align: right;
                }
                
                .status-completed {
                    color: #10b981;
                    font-weight: 600;
                    display: block;
                }
                
                .status-pending {
                    color: #f59e0b;
                    font-weight: 600;
                    display: block;
                }
                
                .last-update {
                    color: #94a3b8;
                    font-size: 14px;
                    display: block;
                    margin-top: 4px;
                }
                
                .anamnesis-action-btn {
                    background: linear-gradient(135deg, #0e7490 0%, #0d9488 100%);
                    border: 1px solid rgba(20, 184, 166, 0.3);
                    border-radius: 12px;
                    color: white;
                    font-weight: 600;
                    padding: 12px 20px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 15px rgba(14, 116, 144, 0.3);
                    display: flex;
                    align-items: center;
                }
                
                .anamnesis-action-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 30px rgba(14, 116, 144, 0.4);
                }
                
                .anamnesis-form-container {
                    background: linear-gradient(135deg, #334155 0%, #1e293b 100%);
                    border: 1px solid rgba(71, 85, 105, 0.3);
                    border-radius: 24px;
                    padding: 32px;
                    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.4);
                    margin-bottom: 32px;
                }
                
                .form-section {
                    margin-bottom: 48px;
                    padding-bottom: 32px;
                    border-bottom: 1px solid rgba(71, 85, 105, 0.3);
                }
                
                .form-section:last-child {
                    border-bottom: none;
                    margin-bottom: 0;
                }
                
                .section-header {
                    display: flex;
                    items-center;
                    justify-content: space-between;
                    margin-bottom: 24px;
                }
                
                .section-title {
                    color: #f1f5f9;
                    font-size: 1.5rem;
                    font-weight: 600;
                    margin: 0;
                }
                
                .section-progress {
                    display: flex;
                    align-items: center;
                    space-x: 12px;
                }
                
                .progress-bar {
                    width: 120px;
                    height: 8px;
                    background: rgba(71, 85, 105, 0.3);
                    border-radius: 4px;
                    overflow: hidden;
                }
                
                .progress-fill {
                    height: 100%;
                    background: linear-gradient(90deg, #0e7490, #0d9488);
                    border-radius: 4px;
                    transition: width 0.3s ease;
                }
                
                .progress-text {
                    color: #94a3b8;
                    font-size: 14px;
                    font-weight: 600;
                    margin-left: 12px;
                }
                
                .form-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 24px;
                }
                
                .form-group {
                    display: flex;
                    flex-direction: column;
                }
                
                .form-group.full-width {
                    grid-column: 1 / -1;
                }
                
                .form-label {
                    color: #94a3b8;
                    font-size: 14px;
                    font-weight: 600;
                    margin-bottom: 8px;
                }
                
                .form-input, .form-textarea {
                    background: rgba(30, 41, 59, 0.8);
                    border: 1px solid rgba(148, 163, 184, 0.2);
                    border-radius: 12px;
                    color: #f1f5f9;
                    padding: 14px 18px;
                    font-size: 14px;
                    transition: all 0.3s ease;
                }
                
                .form-input:focus, .form-textarea:focus {
                    border-color: rgba(14, 116, 144, 0.6);
                    box-shadow: 0 0 0 3px rgba(14, 116, 144, 0.1);
                    outline: none;
                    background: rgba(30, 41, 59, 0.9);
                }
                
                .form-input:read-only, .form-textarea:read-only {
                    background: rgba(30, 41, 59, 0.4);
                    color: #94a3b8;
                }
                
                .checkbox-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 16px;
                    margin: 24px 0;
                }
                
                .checkbox-item {
                    display: flex;
                    align-items: center;
                    space-x: 12px;
                }
                
                .checkbox-item input[type="checkbox"] {
                    width: 18px;
                    height: 18px;
                    accent-color: #0d9488;
                    margin-right: 12px;
                }
                
                .checkbox-label {
                    color: #f1f5f9;
                    font-size: 14px;
                    cursor: pointer;
                }
                
                .habit-questions {
                    space-y: 32px;
                }
                
                .habit-question {
                    margin-bottom: 32px;
                }
                
                .question-title {
                    color: #f1f5f9;
                    font-size: 16px;
                    font-weight: 600;
                    margin-bottom: 16px;
                }
                
                .radio-group {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 12px;
                }
                
                .radio-item {
                    display: flex;
                    align-items: center;
                    space-x: 12px;
                }
                
                .radio-item input[type="radio"] {
                    width: 16px;
                    height: 16px;
                    accent-color: #0d9488;
                    margin-right: 12px;
                }
                
                .radio-label {
                    color: #f1f5f9;
                    font-size: 14px;
                    cursor: pointer;
                }
                
                .form-actions {
                    display: flex;
                    justify-content: flex-end;
                    space-x: 16px;
                    margin-top: 32px;
                    padding-top: 32px;
                    border-top: 1px solid rgba(71, 85, 105, 0.3);
                }
                
                .btn-cancel {
                    background: rgba(107, 114, 128, 0.8);
                    border: 1px solid rgba(107, 114, 128, 0.3);
                    border-radius: 12px;
                    color: white;
                    font-weight: 500;
                    padding: 12px 24px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    margin-right: 16px;
                }
                
                .btn-draft {
                    background: rgba(245, 158, 11, 0.8);
                    border: 1px solid rgba(245, 158, 11, 0.3);
                    border-radius: 12px;
                    color: white;
                    font-weight: 500;
                    padding: 12px 24px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    margin-right: 16px;
                }
                
                .btn-save {
                    background: linear-gradient(135deg, #0e7490 0%, #0d9488 100%);
                    border: 1px solid rgba(20, 184, 166, 0.3);
                    border-radius: 12px;
                    color: white;
                    font-weight: 600;
                    padding: 12px 32px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 15px rgba(14, 116, 144, 0.3);
                }
                
                .btn-save:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 30px rgba(14, 116, 144, 0.4);
                }
                
                .risk-analysis-panel {
                    margin-top: 32px;
                }
                
                .risk-analysis-card {
                    background: linear-gradient(135deg, #334155 0%, #1e293b 100%);
                    border: 1px solid rgba(71, 85, 105, 0.3);
                    border-radius: 24px;
                    padding: 32px;
                    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.4);
                }
                
                .risk-title {
                    color: #f1f5f9;
                    font-size: 1.5rem;
                    font-weight: 600;
                    margin-bottom: 24px;
                }
                
                .risk-score-container {
                    display: flex;
                    items-center;
                    space-x: 32px;
                    margin-bottom: 32px;
                }
                
                .risk-score {
                    text-align: center;
                }
                
                .score-number {
                    font-size: 3rem;
                    font-weight: 800;
                    margin-bottom: 8px;
                }
                
                .risk-score.low .score-number { color: #10b981; }
                .risk-score.moderate .score-number { color: #f59e0b; }
                .risk-score.high .score-number { color: #ef4444; }
                
                .score-label {
                    color: #94a3b8;
                    font-size: 14px;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                
                .level-badge {
                    padding: 8px 16px;
                    border-radius: 20px;
                    font-size: 14px;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                
                .level-badge.low {
                    background: rgba(16, 185, 129, 0.2);
                    color: #10b981;
                }
                
                .level-badge.moderate {
                    background: rgba(245, 158, 11, 0.2);
                    color: #f59e0b;
                }
                
                .level-badge.high {
                    background: rgba(239, 68, 68, 0.2);
                    color: #ef4444;
                }
                
                .level-description {
                    color: #94a3b8;
                    margin-top: 8px;
                }
                
                .recommendations-title {
                    color: #f1f5f9;
                    font-size: 1.25rem;
                    font-weight: 600;
                    margin-bottom: 16px;
                }
                
                .recommendations-list {
                    space-y: 16px;
                }
                
                .recommendation-item {
                    display: flex;
                    items-start;
                    space-x: 16px;
                    background: rgba(30, 41, 59, 0.4);
                    border: 1px solid rgba(148, 163, 184, 0.2);
                    border-radius: 12px;
                    padding: 20px;
                    margin-bottom: 16px;
                }
                
                .rec-icon {
                    font-size: 24px;
                    flex-shrink: 0;
                }
                
                .rec-title {
                    color: #f1f5f9;
                    font-size: 16px;
                    font-weight: 600;
                    margin-bottom: 8px;
                }
                
                .rec-description {
                    color: #94a3b8;
                    font-size: 14px;
                    line-height: 1.5;
                    margin: 0;
                }
            `;
            document.head.appendChild(styles);
        }
    }
};

// Auto-inicializar
document.addEventListener('DOMContentLoaded', function() {
    if (typeof Anamnese !== 'undefined') {
        Anamnese.init();
    }
});

// Exportar para uso global
window.Anamnese = Anamnese;

console.log('📝 Módulo de Anamnese Premium carregado!');