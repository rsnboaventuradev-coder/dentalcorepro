// ============================================================================
// DENTALCORE PRO - SETUP INICIAL DA CLÍNICA
// Configuração profissional completa no primeiro acesso
// ============================================================================

const SetupInicial = {
    // Estado do setup
    currentStep: 1,
    totalSteps: 5,
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
     * Interface do wizard de setup
     */
    renderSetupWizard() {
        return `
            <style>
                /* CSS SETUP INICIAL */
                .setup-workspace {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 20px;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                }

                .setup-container {
                    background: rgba(255, 255, 255, 0.95);
                    backdrop-filter: blur(20px);
                    border-radius: 20px;
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
                    max-width: 800px;
                    width: 100%;
                    overflow: hidden;
                    border: 1px solid rgba(255, 255, 255, 0.2);
                }

                .setup-header {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    padding: 30px 40px;
                    text-align: center;
                    color: white;
                }

                .setup-logo {
                    font-size: 48px;
                    margin-bottom: 15px;
                }

                .setup-title {
                    font-size: 28px;
                    font-weight: 700;
                    margin: 0 0 8px 0;
                    letter-spacing: -0.025em;
                }

                .setup-subtitle {
                    font-size: 16px;
                    opacity: 0.9;
                    margin: 0;
                    font-weight: 400;
                }

                .setup-progress {
                    background: #f8fafc;
                    padding: 20px 40px;
                    border-bottom: 1px solid #e2e8f0;
                }

                .progress-bar {
                    width: 100%;
                    height: 8px;
                    background: #e2e8f0;
                    border-radius: 4px;
                    overflow: hidden;
                    margin-bottom: 12px;
                }

                .progress-fill {
                    height: 100%;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border-radius: 4px;
                    transition: width 0.3s ease;
                }

                .progress-text {
                    font-size: 14px;
                    color: #4a5568;
                    font-weight: 600;
                    text-align: center;
                }

                .setup-content {
                    padding: 40px;
                    min-height: 400px;
                }

                .step-content {
                    display: none;
                }

                .step-content.active {
                    display: block;
                    animation: fadeIn 0.3s ease;
                }

                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .step-title {
                    font-size: 24px;
                    font-weight: 700;
                    color: #2d3748;
                    margin: 0 0 8px 0;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .step-description {
                    font-size: 16px;
                    color: #718096;
                    margin: 0 0 30px 0;
                    line-height: 1.6;
                }

                .form-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 20px;
                    margin-bottom: 20px;
                }

                .form-group {
                    margin-bottom: 20px;
                }

                .form-group.full-width {
                    grid-column: 1 / -1;
                }

                .form-label {
                    display: block;
                    font-weight: 600;
                    color: #2d3748;
                    margin-bottom: 8px;
                    font-size: 14px;
                }

                .form-label.required::after {
                    content: " *";
                    color: #e53e3e;
                }

                .form-input,
                .form-select,
                .form-textarea {
                    width: 100%;
                    padding: 14px 16px;
                    border: 2px solid #e2e8f0;
                    border-radius: 10px;
                    font-size: 16px;
                    transition: all 0.2s ease;
                    background: white;
                    color: #2d3748;
                    box-sizing: border-box;
                }

                .form-input:focus,
                .form-select:focus,
                .form-textarea:focus {
                    outline: none;
                    border-color: #667eea;
                    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
                }

                .form-textarea {
                    resize: vertical;
                    min-height: 100px;
                }

                .specialties-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 12px;
                    margin-top: 20px;
                }

                .specialty-item {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 12px;
                    background: #f7fafc;
                    border: 2px solid #e2e8f0;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }

                .specialty-item:hover {
                    border-color: #667eea;
                    background: #edf2f7;
                }

                .specialty-item.selected {
                    border-color: #667eea;
                    background: rgba(102, 126, 234, 0.1);
                }

                .specialty-checkbox {
                    width: 18px;
                    height: 18px;
                    accent-color: #667eea;
                }

                .setup-actions {
                    padding: 20px 40px;
                    background: #f8fafc;
                    border-top: 1px solid #e2e8f0;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .setup-btn {
                    padding: 14px 28px;
                    border: none;
                    border-radius: 10px;
                    font-weight: 600;
                    font-size: 16px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .setup-btn.primary {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                }

                .setup-btn.secondary {
                    background: #e2e8f0;
                    color: #4a5568;
                }

                .setup-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
                }

                .setup-btn:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                    transform: none;
                }

                .welcome-animation {
                    text-align: center;
                    padding: 40px 20px;
                }

                .welcome-icon {
                    font-size: 80px;
                    margin-bottom: 20px;
                    animation: bounce 2s infinite;
                }

                @keyframes bounce {
                    0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
                    40% { transform: translateY(-10px); }
                    60% { transform: translateY(-5px); }
                }

                .feature-list {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 20px;
                    margin-top: 30px;
                }

                .feature-item {
                    display: flex;
                    align-items: flex-start;
                    gap: 12px;
                    padding: 16px;
                    background: #f7fafc;
                    border-radius: 10px;
                    border: 1px solid #e2e8f0;
                }

                .feature-icon {
                    font-size: 24px;
                    margin-top: 2px;
                }

                .feature-text h4 {
                    margin: 0 0 4px 0;
                    color: #2d3748;
                    font-weight: 600;
                }

                .feature-text p {
                    margin: 0;
                    color: #718096;
                    font-size: 14px;
                    line-height: 1.4;
                }

                /* Responsividade */
                @media (max-width: 768px) {
                    .setup-container {
                        margin: 10px;
                    }
                    
                    .setup-content {
                        padding: 30px 20px;
                    }
                    
                    .form-grid {
                        grid-template-columns: 1fr;
                    }
                    
                    .setup-actions {
                        padding: 20px;
                        flex-direction: column;
                        gap: 12px;
                    }
                    
                    .setup-btn {
                        width: 100%;
                        justify-content: center;
                    }
                }
            </style>

            <div class="setup-workspace">
                <div class="setup-container">
                    <!-- Header -->
                    <div class="setup-header">
                        <div class="setup-logo">🦷</div>
                        <h1 class="setup-title">Bem-vindo ao DentalCore Pro</h1>
                        <p class="setup-subtitle">Configure sua clínica em poucos passos e comece a usar</p>
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
                        
                        <button onclick="SetupInicial.nextStep()" class="setup-btn primary" id="nextButton">
                            ${this.currentStep === this.totalSteps ? 'Finalizar Setup 🚀' : 'Próximo →'}
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
                return this.renderSpecialtiesStep();
            case 5:
                return this.renderPreferencesStep();
            default:
                return this.renderWelcomeStep();
        }
    },

    /**
     * Passo 1: Boas-vindas
     */
    renderWelcomeStep() {
        return `
            <div class="step-content active">
                <div class="welcome-animation">
                    <div class="welcome-icon">👋</div>
                    <h2 class="step-title">Seja bem-vindo(a) ao futuro da odontologia!</h2>
                    <p class="step-description">
                        O DentalCore Pro é um sistema completo para gestão da sua clínica odontológica.
                        Em poucos minutos você terá tudo configurado e pronto para usar.
                    </p>
                </div>

                <div class="feature-list">
                    <div class="feature-item">
                        <div class="feature-icon">📅</div>
                        <div class="feature-text">
                            <h4>Agenda Inteligente</h4>
                            <p>Gerencie consultas com sincronização em tempo real</p>
                        </div>
                    </div>
                    
                    <div class="feature-item">
                        <div class="feature-icon">👥</div>
                        <div class="feature-text">
                            <h4>Multi-usuário</h4>
                            <p>Equipe colaborando simultaneamente</p>
                        </div>
                    </div>
                    
                    <div class="feature-item">
                        <div class="feature-icon">🦷</div>
                        <div class="feature-text">
                            <h4>Prontuário Digital</h4>
                            <p>Anamnese completa e organizada</p>
                        </div>
                    </div>
                    
                    <div class="feature-item">
                        <div class="feature-icon">💰</div>
                        <div class="feature-text">
                            <h4>Gestão Financeira</h4>
                            <p>Orçamentos e controle de débitos</p>
                        </div>
                    </div>
                    
                    <div class="feature-item">
                        <div class="feature-icon">📊</div>
                        <div class="feature-text">
                            <h4>Relatórios Premium</h4>
                            <p>Analytics avançados da sua clínica</p>
                        </div>
                    </div>
                    
                    <div class="feature-item">
                        <div class="feature-icon">📱</div>
                        <div class="feature-text">
                            <h4>Responsivo</h4>
                            <p>Acesso de qualquer dispositivo</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * Passo 2: Dados da clínica
     */
    renderClinicStep() {
        return `
            <div class="step-content active">
                <h2 class="step-title">🏥 Dados da sua clínica</h2>
                <p class="step-description">Vamos começar configurando as informações básicas da sua clínica</p>

                <form id="clinicForm">
                    <div class="form-grid">
                        <div class="form-group full-width">
                            <label class="form-label required">Nome da Clínica</label>
                            <input type="text" class="form-input" name="clinicName" placeholder="Clínica Odontológica Dr. Silva" required>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label required">CNPJ</label>
                            <input type="text" class="form-input" name="cnpj" placeholder="00.000.000/0001-00" required>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">CRO da Clínica</label>
                            <input type="text" class="form-input" name="croClinic" placeholder="CRO-SP 12345">
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label required">Telefone Principal</label>
                            <input type="tel" class="form-input" name="phone" placeholder="(11) 99999-9999" required>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">WhatsApp</label>
                            <input type="tel" class="form-input" name="whatsapp" placeholder="(11) 99999-9999">
                        </div>
                        
                        <div class="form-group full-width">
                            <label class="form-label required">Email da Clínica</label>
                            <input type="email" class="form-input" name="email" placeholder="contato@clinica.com" required>
                        </div>
                        
                        <div class="form-group full-width">
                            <label class="form-label required">Endereço Completo</label>
                            <textarea class="form-textarea" name="address" placeholder="Rua das Flores, 123 - Jardim Botânico - São Paulo/SP - CEP: 01234-567" required></textarea>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Website</label>
                            <input type="url" class="form-input" name="website" placeholder="https://www.clinica.com">
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Instagram</label>
                            <input type="text" class="form-input" name="instagram" placeholder="@clinicadr.silva">
                        </div>
                    </div>
                </form>
            </div>
        `;
    },

    /**
     * Passo 3: Dados do profissional
     */
    renderProfessionalStep() {
        return `
            <div class="step-content active">
                <h2 class="step-title">👨‍⚕️ Seus dados profissionais</h2>
                <p class="step-description">Agora vamos configurar suas informações como profissional responsável</p>

                <form id="professionalForm">
                    <div class="form-grid">
                        <div class="form-group">
                            <label class="form-label required">Nome Completo</label>
                            <input type="text" class="form-input" name="fullName" placeholder="Dr. João Silva Santos" required>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label required">CRO</label>
                            <input type="text" class="form-input" name="cro" placeholder="CRO-SP 98765" required>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label required">CPF</label>
                            <input type="text" class="form-input" name="cpf" placeholder="000.000.000-00" required>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">RG</label>
                            <input type="text" class="form-input" name="rg" placeholder="00.000.000-0">
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label required">Email Pessoal</label>
                            <input type="email" class="form-input" name="personalEmail" placeholder="dr.joao@email.com" required>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Telefone Pessoal</label>
                            <input type="tel" class="form-input" name="personalPhone" placeholder="(11) 99999-9999">
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Universidade de Formação</label>
                            <input type="text" class="form-input" name="university" placeholder="Universidade de São Paulo - USP">
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Ano de Formação</label>
                            <input type="number" class="form-input" name="graduationYear" placeholder="2010" min="1950" max="2024">
                        </div>
                        
                        <div class="form-group full-width">
                            <label class="form-label">Endereço Pessoal</label>
                            <textarea class="form-textarea" name="personalAddress" placeholder="Rua dos Profissionais, 456 - Vila Dentista - São Paulo/SP"></textarea>
                        </div>
                    </div>
                </form>
            </div>
        `;
    },

    /**
     * Passo 4: Especialidades
     */
    renderSpecialtiesStep() {
        const specialties = [
            { id: 'clinica_geral', name: 'Clínica Geral', icon: '🦷' },
            { id: 'ortodontia', name: 'Ortodontia', icon: '🔧' },
            { id: 'endodontia', name: 'Endodontia', icon: '🔴' },
            { id: 'periodontia', name: 'Periodontia', icon: '🟢' },
            { id: 'cirurgia', name: 'Cirurgia Oral', icon: '⚕️' },
            { id: 'implantodontia', name: 'Implantodontia', icon: '🔩' },
            { id: 'protese', name: 'Prótese Dentária', icon: '🦷' },
            { id: 'odontopediatria', name: 'Odontopediatria', icon: '👶' },
            { id: 'estetica', name: 'Estética/Harmonização', icon: '✨' },
            { id: 'dtm', name: 'DTM e Dor Orofacial', icon: '😬' },
            { id: 'radiologia', name: 'Radiologia', icon: '📷' },
            { id: 'patologia', name: 'Patologia Oral', icon: '🔬' }
        ];

        return `
            <div class="step-content active">
                <h2 class="step-title">🎯 Especialidades e Procedimentos</h2>
                <p class="step-description">Selecione suas especialidades para personalizar os procedimentos disponíveis</p>

                <form id="specialtiesForm">
                    <div class="specialties-grid">
                        ${specialties.map(specialty => `
                            <div class="specialty-item" onclick="SetupInicial.toggleSpecialty('${specialty.id}')">
                                <input type="checkbox" class="specialty-checkbox" name="specialties" value="${specialty.id}" id="${specialty.id}">
                                <label for="${specialty.id}" style="cursor: pointer; display: flex; align-items: center; gap: 8px; flex: 1;">
                                    <span style="font-size: 20px;">${specialty.icon}</span>
                                    <span style="font-weight: 600;">${specialty.name}</span>
                                </label>
                            </div>
                        `).join('')}
                    </div>
                    
                    <div class="form-group" style="margin-top: 30px;">
                        <label class="form-label">Outras especialidades ou procedimentos especiais</label>
                        <textarea class="form-textarea" name="otherSpecialties" placeholder="Descreva outros procedimentos que você realiza..."></textarea>
                    </div>
                </form>
            </div>
        `;
    },

    /**
     * Passo 5: Preferências do sistema
     */
    renderPreferencesStep() {
        return `
            <div class="step-content active">
                <h2 class="step-title">⚙️ Preferências do Sistema</h2>
                <p class="step-description">Configure as preferências básicas para otimizar seu fluxo de trabalho</p>

                <form id="preferencesForm">
                    <div class="form-grid">
                        <div class="form-group">
                            <label class="form-label">Horário de Funcionamento - Início</label>
                            <input type="time" class="form-input" name="workStartTime" value="08:00">
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Horário de Funcionamento - Fim</label>
                            <input type="time" class="form-input" name="workEndTime" value="18:00">
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Duração Padrão da Consulta (minutos)</label>
                            <select class="form-select" name="defaultAppointmentDuration">
                                <option value="30">30 minutos</option>
                                <option value="45">45 minutos</option>
                                <option value="60" selected>60 minutos</option>
                                <option value="90">90 minutos</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Intervalo entre Consultas (minutos)</label>
                            <select class="form-select" name="appointmentInterval">
                                <option value="0">Sem intervalo</option>
                                <option value="10">10 minutos</option>
                                <option value="15" selected>15 minutos</option>
                                <option value="30">30 minutos</option>
                            </select>
                        </div>
                        
                        <div class="form-group full-width">
                            <label class="form-label">Dias de Funcionamento</label>
                            <div style="display: flex; gap: 12px; flex-wrap: wrap; margin-top: 8px;">
                                ${['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'].map((day, index) => `
                                    <div style="display: flex; align-items: center; gap: 6px; padding: 8px 12px; background: #f7fafc; border-radius: 6px; border: 1px solid #e2e8f0;">
                                        <input type="checkbox" name="workDays" value="${index}" id="day${index}" ${index < 5 ? 'checked' : ''}>
                                        <label for="day${index}" style="cursor: pointer; font-size: 14px; font-weight: 500;">${day}</label>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Tema Preferido</label>
                            <select class="form-select" name="theme">
                                <option value="auto" selected>Automático (sistema)</option>
                                <option value="light">Claro</option>
                                <option value="dark">Escuro</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Cor Principal do Sistema</label>
                            <select class="form-select" name="primaryColor">
                                <option value="blue" selected>Azul Profissional</option>
                                <option value="teal">Verde Água</option>
                                <option value="purple">Roxo Moderno</option>
                                <option value="green">Verde Saúde</option>
                            </select>
                        </div>
                        
                        <div class="form-group full-width">
                            <label class="form-label">Lembrete para Pacientes</label>
                            <div style="display: flex; gap: 12px; flex-wrap: wrap; margin-top: 8px;">
                                <div style="display: flex; align-items: center; gap: 6px; padding: 8px 12px; background: #f7fafc; border-radius: 6px;">
                                    <input type="checkbox" name="reminderEmail" id="reminderEmail" checked>
                                    <label for="reminderEmail" style="cursor: pointer; font-size: 14px;">📧 E-mail</label>
                                </div>
                                <div style="display: flex; align-items: center; gap: 6px; padding: 8px 12px; background: #f7fafc; border-radius: 6px;">
                                    <input type="checkbox" name="reminderWhatsapp" id="reminderWhatsapp" checked>
                                    <label for="reminderWhatsapp" style="cursor: pointer; font-size: 14px;">📱 WhatsApp</label>
                                </div>
                                <div style="display: flex; align-items: center; gap: 6px; padding: 8px 12px; background: #f7fafc; border-radius: 6px;">
                                    <input type="checkbox" name="reminderSms" id="reminderSms">
                                    <label for="reminderSms" style="cursor: pointer; font-size: 14px;">💬 SMS</label>
                                </div>
                            </div>
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
     * Próximo passo
     */
    nextStep() {
        if (this.currentStep < this.totalSteps) {
            // Validar passo atual
            if (this.validateCurrentStep()) {
                this.saveCurrentStepData();
                this.currentStep++;
                this.updateSetupInterface();
            }
        } else {
            // Finalizar setup
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
     * Validar passo atual
     */
    validateCurrentStep() {
        switch (this.currentStep) {
            case 1:
                return true; // Boas-vindas, sempre válido
                
            case 2:
                // Validar dados da clínica
                const clinicForm = document.getElementById('clinicForm');
                const requiredFields = clinicForm.querySelectorAll('[required]');
                
                for (let field of requiredFields) {
                    if (!field.value.trim()) {
                        this.showAlert('⚠️ Campos Obrigatórios', `Por favor, preencha o campo: ${field.previousElementSibling.textContent}`);
                        field.focus();
                        return false;
                    }
                }
                return true;
                
            case 3:
                // Validar dados profissionais
                const profForm = document.getElementById('professionalForm');
                const profRequiredFields = profForm.querySelectorAll('[required]');
                
                for (let field of profRequiredFields) {
                    if (!field.value.trim()) {
                        this.showAlert('⚠️ Campos Obrigatórios', `Por favor, preencha o campo: ${field.previousElementSibling.textContent}`);
                        field.focus();
                        return false;
                    }
                }
                return true;
                
            case 4:
                // Validar especialidades (pelo menos uma)
                const selectedSpecialties = document.querySelectorAll('input[name="specialties"]:checked');
                if (selectedSpecialties.length === 0) {
                    this.showAlert('⚠️ Especialidades', 'Por favor, selecione pelo menos uma especialidade.');
                    return false;
                }
                return true;
                
            case 5:
                return true; // Preferências, sempre válido
                
            default:
                return true;
        }
    },

    /**
     * Salvar dados do passo atual
     */
    saveCurrentStepData() {
        switch (this.currentStep) {
            case 2:
                const clinicForm = document.getElementById('clinicForm');
                const clinicData = new FormData(clinicForm);
                this.setupData.clinic = Object.fromEntries(clinicData);
                break;
                
            case 3:
                const profForm = document.getElementById('professionalForm');
                const profData = new FormData(profForm);
                this.setupData.professional = Object.fromEntries(profData);
                break;
                
            case 4:
                const specForm = document.getElementById('specialtiesForm');
                const specData = new FormData(specForm);
                const selectedSpecs = [];
                for (let [key, value] of specData.entries()) {
                    if (key === 'specialties') {
                        selectedSpecs.push(value);
                    }
                }
                this.setupData.specialties = selectedSpecs;
                this.setupData.otherSpecialties = specData.get('otherSpecialties');
                break;
                
            case 5:
                const prefForm = document.getElementById('preferencesForm');
                const prefData = new FormData(prefForm);
                this.setupData.preferences = Object.fromEntries(prefData);
                break;
        }
        
        console.log('💾 Dados salvos do passo', this.currentStep, ':', this.setupData);
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
        
        // Limpar dados de demonstração
        this.clearDemoData();
        
        // Mostrar tela de sucesso
        this.showSuccessScreen();
        
        // Ir para o sistema após 3 segundos
        setTimeout(() => {
            this.goToSystem();
        }, 3000);
    },

    /**
     * Aplicar configurações ao sistema
     */
    applyConfiguration() {
        const config = {
            clinic: this.setupData.clinic,
            professional: this.setupData.professional,
            specialties: this.setupData.specialties,
            preferences: this.setupData.preferences,
            setupDate: new Date().toISOString()
        };
        
        // Salvar configurações globais
        localStorage.setItem('dentalcore_config', JSON.stringify(config));
        
        // Aplicar tema
        if (config.preferences.theme) {
            document.documentElement.setAttribute('data-theme', config.preferences.theme);
        }
        
        // Aplicar cor principal
        if (config.preferences.primaryColor) {
            document.documentElement.setAttribute('data-color', config.preferences.primaryColor);
        }
        
        console.log('⚙️ Configurações aplicadas:', config);
    },

    /**
     * Limpar dados de demonstração
     */
    clearDemoData() {
        // Limpar pacientes de demo
        localStorage.removeItem('dentalcore_demo_patients');
        
        // Limpar outros dados de demo
        localStorage.removeItem('dentalcore_demo_appointments');
        localStorage.removeItem('dentalcore_demo_treatments');
        
        console.log('🗑️ Dados de demonstração limpos');
    },

    /**
     * Mostrar tela de sucesso
     */
    showSuccessScreen() {
        const setupScreen = document.getElementById('setupScreen');
        if (setupScreen) {
            setupScreen.innerHTML = `
                <div class="setup-workspace">
                    <div class="setup-container">
                        <div class="setup-content" style="text-align: center; padding: 60px 40px;">
                            <div style="font-size: 80px; margin-bottom: 20px; animation: bounce 2s infinite;">🎉</div>
                            <h2 style="font-size: 32px; color: #2d3748; margin: 0 0 16px 0;">Configuração Concluída!</h2>
                            <p style="font-size: 18px; color: #718096; margin: 0 0 30px 0;">
                                Sua clínica <strong>${this.setupData.clinic?.clinicName}</strong> está pronta para usar o DentalCore Pro!
                            </p>
                            
                            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 16px; padding: 24px; margin: 30px 0;">
                                <h3 style="margin: 0 0 12px 0;">🚀 Sistema Personalizado</h3>
                                <p style="margin: 0; opacity: 0.9;">
                                    Todas as suas configurações foram aplicadas e o sistema está otimizado para seu fluxo de trabalho.
                                </p>
                            </div>
                            
                            <div style="font-size: 16px; color: #4a5568; margin-top: 20px;">
                                Redirecionando para o sistema em 3 segundos...
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
        
        // Mostrar alerta de boas-vindas
        setTimeout(() => {
            if (typeof UI !== 'undefined' && UI.showAlert) {
                UI.showAlert(
                    '🎉 Bem-vindo ao DentalCore Pro!', 
                    `Configuração concluída com sucesso!\n\nSua clínica ${this.setupData.clinic?.clinicName} está pronta para usar todas as funcionalidades do sistema.\n\nComece adicionando seus primeiros pacientes e consultas!`
                );
            }
        }, 1000);
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
    },

    /**
     * Mostrar alerta
     */
    showAlert(title, message) {
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.6);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10001;
            backdrop-filter: blur(4px);
        `;
        modal.innerHTML = `
            <div style="
                background: white;
                border-radius: 16px;
                max-width: 400px;
                width: 90%;
                margin: 20px;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
                overflow: hidden;
            ">
                <div style="padding: 24px 24px 0 24px; text-align: center;">
                    <h3 style="font-size: 20px; font-weight: 600; margin: 0; color: #2d3748;">${title}</h3>
                </div>
                <div style="padding: 16px 24px;">
                    <p style="color: #4a5568; line-height: 1.5; margin: 0; text-align: center;">${message}</p>
                </div>
                <div style="padding: 0 24px 24px 24px; text-align: center;">
                    <button onclick="this.closest('div[style*=\"position: fixed\"]').remove()" style="
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        border: none;
                        border-radius: 8px;
                        color: white;
                        padding: 12px 24px;
                        font-weight: 600;
                        font-size: 14px;
                        cursor: pointer;
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
window.SetupInicial = SetupInicial;

console.log('🏥 Setup Inicial da Clínica carregado!');
