// ============================================================================
// DENTALCORE PRO - SETUP INICIAL DA CLÍNICA - VERSÃO OTIMIZADA
// Configuração profissional compacta e opcional
// ============================================================================

const SetupInicial = {
    // Estado do setup
    currentStep: 1,
    totalSteps: 4, // Reduzido para 4 passos
    setupData: {},

    /**
     * Inicialização
     */
    init() {
        console.log('🏥 Setup Inicial da Clínica carregado');
        
        // Verificar se já foi configurado
        const isConfigured = localStorage.getItem('dentalcore_setup_complete');
        if (!isConfigured) {
            this.showSetupWizard();
        }
    },

    /**
     * Verificar se precisa mostrar setup
     */
    needsSetup() {
        return !localStorage.getItem('dentalcore_setup_complete');
    },

    /**
     * Interface do wizard de setup - COMPACTA
     */
    renderSetupWizard() {
        return `
            <style>
                /* CSS SETUP INICIAL - VERSÃO COMPACTA E LEGÍVEL */
                * {
                    box-sizing: border-box;
                }

                .setup-workspace {
                    background: linear-gradient(135deg, #1e3a8a 0%, #3730a3 100%);
                    min-height: 100vh;
                    padding: 15px;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                    overflow-y: auto;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .setup-container {
                    background: #ffffff;
                    border-radius: 12px;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
                    max-width: 600px;
                    width: 100%;
                    max-height: 85vh;
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;
                    margin: 0 auto;
                }

                .setup-header {
                    background: linear-gradient(135deg, #1e3a8a 0%, #3730a3 100%);
                    padding: 20px 25px;
                    text-align: center;
                    color: white;
                    flex-shrink: 0;
                }

                .setup-logo {
                    font-size: 32px;
                    margin-bottom: 8px;
                }

                .setup-title {
                    font-size: 20px;
                    font-weight: 700;
                    margin: 0 0 4px 0;
                    letter-spacing: -0.025em;
                }

                .setup-subtitle {
                    font-size: 13px;
                    opacity: 0.9;
                    margin: 0;
                    font-weight: 400;
                }

                .setup-progress {
                    background: #f8fafc;
                    padding: 12px 25px;
                    border-bottom: 1px solid #e2e8f0;
                    flex-shrink: 0;
                }

                .progress-bar {
                    width: 100%;
                    height: 4px;
                    background: #e2e8f0;
                    border-radius: 2px;
                    overflow: hidden;
                    margin-bottom: 8px;
                }

                .progress-fill {
                    height: 100%;
                    background: linear-gradient(135deg, #1e3a8a 0%, #3730a3 100%);
                    border-radius: 2px;
                    transition: width 0.3s ease;
                }

                .progress-text {
                    font-size: 11px;
                    color: #4a5568;
                    font-weight: 600;
                    text-align: center;
                }

                .setup-content {
                    padding: 20px 25px;
                    overflow-y: auto;
                    flex: 1;
                    max-height: calc(85vh - 160px);
                    color: #2d3748;
                }

                .step-content {
                    display: none;
                }

                .step-content.active {
                    display: block;
                    animation: fadeIn 0.3s ease;
                }

                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .step-title {
                    font-size: 18px;
                    font-weight: 700;
                    color: #1a202c;
                    margin: 0 0 6px 0;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .step-description {
                    font-size: 13px;
                    color: #4a5568;
                    margin: 0 0 20px 0;
                    line-height: 1.4;
                }

                .form-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 12px;
                    margin-bottom: 12px;
                }

                .form-group {
                    margin-bottom: 12px;
                }

                .form-group.full-width {
                    grid-column: 1 / -1;
                }

                .form-label {
                    display: block;
                    font-weight: 600;
                    color: #1a202c;
                    margin-bottom: 4px;
                    font-size: 12px;
                    text-transform: uppercase;
                    letter-spacing: 0.025em;
                }

                .form-input,
                .form-select,
                .form-textarea {
                    width: 100%;
                    padding: 8px 10px;
                    border: 1px solid #d1d5db;
                    border-radius: 6px;
                    font-size: 14px;
                    transition: all 0.2s ease;
                    background: #ffffff;
                    color: #1f2937;
                    box-sizing: border-box;
                }

                .form-input:focus,
                .form-select:focus,
                .form-textarea:focus {
                    outline: none;
                    border-color: #1e3a8a;
                    box-shadow: 0 0 0 2px rgba(30, 58, 138, 0.1);
                }

                .form-textarea {
                    resize: vertical;
                    min-height: 60px;
                }

                .specialties-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
                    gap: 8px;
                    margin-top: 12px;
                }

                .specialty-item {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    padding: 8px;
                    background: #f9fafb;
                    border: 1px solid #e5e7eb;
                    border-radius: 6px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    font-size: 12px;
                }

                .specialty-item:hover {
                    border-color: #1e3a8a;
                    background: #eff6ff;
                }

                .specialty-item.selected {
                    border-color: #1e3a8a;
                    background: rgba(30, 58, 138, 0.1);
                    color: #1e3a8a;
                }

                .specialty-checkbox {
                    width: 14px;
                    height: 14px;
                    accent-color: #1e3a8a;
                }

                .setup-actions {
                    padding: 15px 25px;
                    background: #f8fafc;
                    border-top: 1px solid #e2e8f0;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    flex-shrink: 0;
                }

                .setup-btn {
                    padding: 8px 16px;
                    border: none;
                    border-radius: 6px;
                    font-weight: 600;
                    font-size: 13px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }

                .setup-btn.primary {
                    background: linear-gradient(135deg, #1e3a8a 0%, #3730a3 100%);
                    color: white;
                }

                .setup-btn.secondary {
                    background: #e5e7eb;
                    color: #374151;
                }

                .setup-btn:hover:not(:disabled) {
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                }

                .setup-btn:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                    transform: none;
                }

                .welcome-animation {
                    text-align: center;
                    padding: 15px 10px;
                }

                .welcome-icon {
                    font-size: 48px;
                    margin-bottom: 12px;
                    animation: bounce 2s infinite;
                }

                @keyframes bounce {
                    0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
                    40% { transform: translateY(-6px); }
                    60% { transform: translateY(-3px); }
                }

                .feature-list {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
                    gap: 10px;
                    margin-top: 15px;
                }

                .feature-item {
                    display: flex;
                    align-items: flex-start;
                    gap: 8px;
                    padding: 10px;
                    background: #f9fafb;
                    border-radius: 6px;
                    border: 1px solid #e5e7eb;
                }

                .feature-icon {
                    font-size: 16px;
                    margin-top: 1px;
                }

                .feature-text h4 {
                    margin: 0 0 2px 0;
                    color: #1f2937;
                    font-weight: 600;
                    font-size: 12px;
                }

                .feature-text p {
                    margin: 0;
                    color: #6b7280;
                    font-size: 11px;
                    line-height: 1.3;
                }

                .skip-setup {
                    text-align: center;
                    margin-top: 15px;
                    padding-top: 15px;
                    border-top: 1px solid #e5e7eb;
                }

                .skip-btn {
                    background: none;
                    border: none;
                    color: #6b7280;
                    font-size: 12px;
                    cursor: pointer;
                    text-decoration: underline;
                }

                .skip-btn:hover {
                    color: #1e3a8a;
                }

                /* Responsividade */
                @media (max-width: 768px) {
                    .setup-workspace {
                        padding: 10px;
                    }
                    
                    .setup-container {
                        margin: 0;
                        border-radius: 8px;
                        max-height: 95vh;
                    }
                    
                    .setup-header {
                        padding: 15px 20px;
                    }
                    
                    .setup-content {
                        padding: 15px 20px;
                        max-height: calc(95vh - 140px);
                    }
                    
                    .form-grid {
                        grid-template-columns: 1fr;
                        gap: 10px;
                    }
                    
                    .setup-actions {
                        padding: 12px 20px;
                        flex-direction: column;
                        gap: 8px;
                    }
                    
                    .setup-btn {
                        width: 100%;
                        justify-content: center;
                        padding: 10px 16px;
                    }
                    
                    .specialties-grid {
                        grid-template-columns: 1fr;
                    }
                    
                    .feature-list {
                        grid-template-columns: 1fr;
                        gap: 8px;
                    }
                }

                /* Melhorar scroll */
                .setup-content::-webkit-scrollbar {
                    width: 4px;
                }

                .setup-content::-webkit-scrollbar-track {
                    background: #f1f1f1;
                    border-radius: 2px;
                }

                .setup-content::-webkit-scrollbar-thumb {
                    background: #c1c1c1;
                    border-radius: 2px;
                }
            </style>

            <div class="setup-workspace">
                <div class="setup-container">
                    <!-- Header -->
                    <div class="setup-header">
                        <div class="setup-logo">🦷</div>
                        <h1 class="setup-title">Bem-vindo ao DentalCore Pro</h1>
                        <p class="setup-subtitle">Configure sua clínica rapidamente (opcional)</p>
                    </div>

                    <!-- Progress Bar -->
                    <div class="setup-progress">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${(this.currentStep / this.totalSteps) * 100}%"></div>
                        </div>
                        <div class="progress-text">Passo ${this.currentStep} de ${this.totalSteps}</div>
                    </div>

                    <!-- Content -->
                    <div class="setup-content">
                        ${this.renderCurrentStep()}
                    </div>

                    <!-- Actions -->
                    <div class="setup-actions">
                        <button onclick="SetupInicial.previousStep()" class="setup-btn secondary" ${this.currentStep === 1 ? 'disabled' : ''}>
                            ← Anterior
                        </button>
                        
                        <button onclick="SetupInicial.nextStep()" class="setup-btn primary">
                            ${this.currentStep === this.totalSteps ? 'Finalizar 🚀' : 'Próximo →'}
                        </button>
                    </div>
                    
                    <!-- Skip Option -->
                    <div class="skip-setup">
                        <button onclick="SetupInicial.skipSetup()" class="skip-btn">
                            Pular configuração e usar sistema
                        </button>
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * Renderizar passo atual
     */
    renderCurrentStep() {
        switch (this.currentStep) {
            case 1:
                return this.renderWelcomeStep();
            case 2:
                return this.renderClinicStep();
            case 3:
                return this.renderProfessionalStep();
            case 4:
                return this.renderPreferencesStep();
            default:
                return this.renderWelcomeStep();
        }
    },

    /**
     * Passo 1: Boas-vindas COMPACTO
     */
    renderWelcomeStep() {
        return `
            <div class="step-content active">
                <div class="welcome-animation">
                    <div class="welcome-icon">👋</div>
                    <h2 class="step-title">Bem-vindo ao futuro da odontologia!</h2>
                    <p class="step-description">
                        Sistema completo para gestão da sua clínica. Configure rapidamente ou pule e comece a usar.
                    </p>
                </div>

                <div class="feature-list">
                    <div class="feature-item">
                        <div class="feature-icon">📅</div>
                        <div class="feature-text">
                            <h4>Agenda Inteligente</h4>
                            <p>Consultas em tempo real</p>
                        </div>
                    </div>
                    
                    <div class="feature-item">
                        <div class="feature-icon">👥</div>
                        <div class="feature-text">
                            <h4>Multi-usuário</h4>
                            <p>Equipe colaborando</p>
                        </div>
                    </div>
                    
                    <div class="feature-item">
                        <div class="feature-icon">🦷</div>
                        <div class="feature-text">
                            <h4>Prontuário Digital</h4>
                            <p>Anamnese completa</p>
                        </div>
                    </div>
                    
                    <div class="feature-item">
                        <div class="feature-icon">💰</div>
                        <div class="feature-text">
                            <h4>Gestão Financeira</h4>
                            <p>Orçamentos e débitos</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * Passo 2: Dados da clínica - SEM OBRIGATORIEDADE
     */
    renderClinicStep() {
        return `
            <div class="step-content active">
                <h2 class="step-title">🏥 Dados da sua clínica</h2>
                <p class="step-description">Preencha apenas as informações que desejar (todos os campos são opcionais)</p>

                <form id="clinicForm">
                    <div class="form-grid">
                        <div class="form-group full-width">
                            <label class="form-label">Nome da Clínica</label>
                            <input type="text" class="form-input" name="clinicName" placeholder="Clínica Odontológica Dr. Silva">
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">CNPJ</label>
                            <input type="text" class="form-input" name="cnpj" placeholder="00.000.000/0001-00">
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Telefone</label>
                            <input type="tel" class="form-input" name="phone" placeholder="(11) 99999-9999">
                        </div>
                        
                        <div class="form-group full-width">
                            <label class="form-label">Email</label>
                            <input type="email" class="form-input" name="email" placeholder="contato@clinica.com">
                        </div>
                        
                        <div class="form-group full-width">
                            <label class="form-label">Endereço</label>
                            <textarea class="form-textarea" name="address" placeholder="Rua das Flores, 123 - São Paulo/SP"></textarea>
                        </div>
                    </div>
                </form>
            </div>
        `;
    },

    /**
     * Passo 3: Dados profissionais - SEM OBRIGATORIEDADE
     */
    renderProfessionalStep() {
        return `
            <div class="step-content active">
                <h2 class="step-title">👨‍⚕️ Dados profissionais</h2>
                <p class="step-description">Suas informações profissionais (opcional)</p>

                <form id="professionalForm">
                    <div class="form-grid">
                        <div class="form-group">
                            <label class="form-label">Nome Completo</label>
                            <input type="text" class="form-input" name="fullName" placeholder="Dr. João Silva">
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">CRO</label>
                            <input type="text" class="form-input" name="cro" placeholder="CRO-SP 98765">
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Email</label>
                            <input type="email" class="form-input" name="personalEmail" placeholder="dr.joao@email.com">
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Telefone</label>
                            <input type="tel" class="form-input" name="personalPhone" placeholder="(11) 99999-9999">
                        </div>
                        
                        <div class="form-group full-width">
                            <label class="form-label">Especialidades</label>
                            <div class="specialties-grid">
                                ${this.renderSpecialtiesList()}
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        `;
    },

    /**
     * Lista de especialidades COMPACTA
     */
    renderSpecialtiesList() {
        const specialties = [
            { id: 'clinica_geral', name: 'Clínica Geral', icon: '🦷' },
            { id: 'ortodontia', name: 'Ortodontia', icon: '🔧' },
            { id: 'endodontia', name: 'Endodontia', icon: '🔴' },
            { id: 'periodontia', name: 'Periodontia', icon: '🟢' },
            { id: 'cirurgia', name: 'Cirurgia', icon: '⚕️' },
            { id: 'implantodontia', name: 'Implantes', icon: '🔩' },
            { id: 'estetica', name: 'Estética', icon: '✨' },
            { id: 'odontopediatria', name: 'Pediatria', icon: '👶' }
        ];

        return specialties.map(specialty => `
            <div class="specialty-item" onclick="SetupInicial.toggleSpecialty('${specialty.id}')">
                <input type="checkbox" class="specialty-checkbox" name="specialties" value="${specialty.id}" id="${specialty.id}">
                <label for="${specialty.id}" style="cursor: pointer; display: flex; align-items: center; gap: 4px; flex: 1;">
                    <span>${specialty.icon}</span>
                    <span style="font-weight: 600;">${specialty.name}</span>
                </label>
            </div>
        `).join('');
    },

    /**
     * Passo 4: Preferências SIMPLIFICADO
     */
    renderPreferencesStep() {
        return `
            <div class="step-content active">
                <h2 class="step-title">⚙️ Preferências básicas</h2>
                <p class="step-description">Configure o sistema do seu jeito</p>

                <form id="preferencesForm">
                    <div class="form-grid">
                        <div class="form-group">
                            <label class="form-label">Início do expediente</label>
                            <input type="time" class="form-input" name="workStartTime" value="08:00">
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Fim do expediente</label>
                            <input type="time" class="form-input" name="workEndTime" value="18:00">
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Duração consulta padrão</label>
                            <select class="form-select" name="defaultAppointmentDuration">
                                <option value="30">30 minutos</option>
                                <option value="60" selected>60 minutos</option>
                                <option value="90">90 minutos</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Tema do sistema</label>
                            <select class="form-select" name="theme">
                                <option value="auto" selected>Automático</option>
                                <option value="light">Claro</option>
                                <option value="dark">Escuro</option>
                            </select>
                        </div>
                    </div>
                </form>
            </div>
        `;
    },

    /**
     * Alternar especialidade
     */
    toggleSpecialty(specialtyId) {
        const checkbox = document.getElementById(specialtyId);
        const item = checkbox.closest('.specialty-item');
        
        checkbox.checked = !checkbox.checked;
        
        if (checkbox.checked) {
            item.classList.add('selected');
        } else {
            item.classList.remove('selected');
        }
    },

    /**
     * Próximo passo - SEM VALIDAÇÃO OBRIGATÓRIA
     */
    nextStep() {
        if (this.currentStep < this.totalSteps) {
            this.saveCurrentStepData();
            this.currentStep++;
            this.updateSetupInterface();
        } else {
            this.finishSetup();
        }
    },

    /**
     * Passo anterior
     */
    previousStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.updateSetupInterface();
        }
    },

    /**
     * Pular setup
     */
    skipSetup() {
        this.finishSetup();
    },

    /**
     * Salvar dados do passo atual
     */
    saveCurrentStepData() {
        switch (this.currentStep) {
            case 2:
                const clinicForm = document.getElementById('clinicForm');
                if (clinicForm) {
                    const clinicData = new FormData(clinicForm);
                    this.setupData.clinic = Object.fromEntries(clinicData);
                }
                break;
                
            case 3:
                const profForm = document.getElementById('professionalForm');
                if (profForm) {
                    const profData = new FormData(profForm);
                    const selectedSpecs = [];
                    for (let [key, value] of profData.entries()) {
                        if (key === 'specialties') {
                            selectedSpecs.push(value);
                        }
                    }
                    this.setupData.professional = Object.fromEntries(profData);
                    this.setupData.specialties = selectedSpecs;
                }
                break;
                
            case 4:
                const prefForm = document.getElementById('preferencesForm');
                if (prefForm) {
                    const prefData = new FormData(prefForm);
                    this.setupData.preferences = Object.fromEntries(prefData);
                }
                break;
        }
        
        console.log('💾 Dados salvos do passo', this.currentStep);
    },

    /**
     * Atualizar interface do setup
     */
    updateSetupInterface() {
        const setupScreen = document.getElementById('setupScreen');
        if (setupScreen) {
            setupScreen.innerHTML = this.renderSetupWizard();
        }
    },

    /**
     * Finalizar setup
     */
    finishSetup() {
        // Salvar dados do último passo
        this.saveCurrentStepData();
        
        // Aplicar configurações ao sistema
        this.applyConfiguration();
        
        // Marcar setup como completo
        localStorage.setItem('dentalcore_setup_complete', 'true');
        localStorage.setItem('dentalcore_setup_data', JSON.stringify(this.setupData));
        
        // LIMPAR DADOS DE DEMONSTRAÇÃO COMPLETAMENTE
        this.clearAllDemoData();
        
        // Mostrar tela de sucesso
        this.showSuccessScreen();
        
        // Ir para o sistema após 2 segundos
        setTimeout(() => {
            this.goToSystem();
        }, 2000);
    },

    /**
     * Aplicar configurações ao sistema
     */
    applyConfiguration() {
        const config = {
            clinic: this.setupData.clinic || {},
            professional: this.setupData.professional || {},
            specialties: this.setupData.specialties || [],
            preferences: this.setupData.preferences || {},
            setupDate: new Date().toISOString()
        };
        
        // Salvar configurações globais
        localStorage.setItem('dentalcore_config', JSON.stringify(config));
        
        console.log('⚙️ Configurações aplicadas:', config);
    },

    /**
     * LIMPAR TODOS OS DADOS DE DEMONSTRAÇÃO
     */
    clearAllDemoData() {
        // Lista completa de chaves a serem removidas
        const keysToRemove = [
            // Dados de demo antigos
            'dentalcore_demo_patients',
            'dentalcore_demo_appointments', 
            'dentalcore_demo_treatments',
            'dentalcore_demo_budgets',
            
            // Dados principais do sistema
            'dentalcore_patients',
            'dentalcore_appointments',
            'dentalcore_budgets', 
            'dentalcore_treatments',
            'dentalcore_reports',
            'dentalcore_laboratories',
            'dentalcore_documents',
            
            // Dados persistentes antigos
            'patients_data',
            'appointments_data',
            'treatments_data',
            'budget_data',
            
            // Cache e temporários
            'dashboard_cache',
            'reports_cache',
            'calendar_cache'
        ];
        
        // Remover todas as chaves
        keysToRemove.forEach(key => {
            localStorage.removeItem(key);
        });
        
        // Inicializar arrays vazios para dados principais
        localStorage.setItem('dentalcore_patients', JSON.stringify([]));
        localStorage.setItem('dentalcore_appointments', JSON.stringify([]));
        localStorage.setItem('dentalcore_budgets', JSON.stringify([]));
        localStorage.setItem('dentalcore_treatments', JSON.stringify([]));
        
        console.log('🗑️ TODOS os dados de demonstração foram removidos - Sistema limpo');
    },

    /**
     * Mostrar tela de sucesso COMPACTA
     */
    showSuccessScreen() {
        const setupScreen = document.getElementById('setupScreen');
        if (setupScreen) {
            setupScreen.innerHTML = `
                <div class="setup-workspace">
                    <div class="setup-container">
                        <div class="setup-content" style="text-align: center; padding: 40px 25px; display: flex; flex-direction: column; justify-content: center;">
                            <div style="font-size: 64px; margin-bottom: 16px;">🎉</div>
                            <h2 style="font-size: 24px; color: #1a202c; margin: 0 0 12px 0;">Sistema Configurado!</h2>
                            <p style="font-size: 14px; color: #4a5568; margin: 0 0 20px 0;">
                                ${this.setupData.clinic?.clinicName ? 
                                    `Sua clínica <strong>${this.setupData.clinic.clinicName}</strong> está pronta!` : 
                                    'Sistema pronto para usar!'
                                }
                            </p>
                            
                            <div style="background: linear-gradient(135deg, #1e3a8a 0%, #3730a3 100%); color: white; border-radius: 12px; padding: 20px; margin: 20px 0;">
                                <h3 style="margin: 0 0 8px 0; font-size: 16px;">🚀 Pronto para usar</h3>
                                <p style="margin: 0; opacity: 0.9; font-size: 13px;">
                                    Dados limpos e sistema personalizado
                                </p>
                            </div>
                            
                            <div style="font-size: 13px; color: #6b7280;">
                                Entrando no sistema...
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }
    },

    /**
     * Ir para o sistema principal
     */
    goToSystem() {
        // Ocultar setup
        const setupScreen = document.getElementById('setupScreen');
        if (setupScreen) {
            setupScreen.style.display = 'none';
        }
        
        // Mostrar sistema principal
        const mainApp = document.getElementById('mainApp');
        if (mainApp) {
            mainApp.style.display = 'block';
        }
        
        // Ir para dashboard
        if (typeof showTab === 'function') {
            showTab('dashboard');
        }
        
        // Recarregar dados para garantir que sistema está limpo
        if (typeof DataPersistence !== 'undefined') {
            DataPersistence.init();
        }
        
        console.log('✅ Sistema iniciado com dados limpos!');
    },

    /**
     * Mostrar wizard de setup
     */
    showSetupWizard() {
        // Criar ou atualizar tela de setup
        let setupScreen = document.getElementById('setupScreen');
        if (!setupScreen) {
            setupScreen = document.createElement('div');
            setupScreen.id = 'setupScreen';
            setupScreen.style.cssText = `
                position: fixed;
                inset: 0;
                z-index: 10000;
                background: white;
            `;
            document.body.appendChild(setupScreen);
        }
        
        setupScreen.innerHTML = this.renderSetupWizard();
        setupScreen.style.display = 'block';
        
        // Ocultar outras telas
        const loginScreen = document.getElementById('loginScreen');
        const mainApp = document.getElementById('mainApp');
        
        if (loginScreen) loginScreen.style.display = 'none';
        if (mainApp) mainApp.style.display = 'none';
    }
};

// Exportar para uso global
window.SetupInicial = SetupInicial;

console.log('🏥 Setup Inicial Otimizado carregado!');
