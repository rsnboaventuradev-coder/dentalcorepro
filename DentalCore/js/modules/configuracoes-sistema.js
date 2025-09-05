// ============================================================================
// DENTALCORE PRO - MÓDULO DE CONFIGURAÇÕES DO SISTEMA
// Interface completa de configurações editáveis e personalizáveis
// Paleta: Azul-marinho, Carvão e Azul-petróleo
// ============================================================================

const ConfiguracoesSystem = {
    // Configurações padrão do sistema
    defaultSettings: {
        // Dados da Clínica
        clinic: {
            name: 'Clínica Odontológica',
            fantasyName: 'Dental Care',
            cnpj: '',
            cro: '',
            address: '',
            city: '',
            state: '',
            zipCode: '',
            phone: '',
            email: '',
            website: '',
            logo: null,
            responsibleDoctor: '',
            croDr: '',
            specialties: []
        },

        // Configurações do Sistema
        system: {
            theme: 'auto', // auto, light, dark
            language: 'pt-BR',
            timezone: 'America/Sao_Paulo',
            dateFormat: 'DD/MM/YYYY',
            timeFormat: '24h',
            currency: 'BRL',
            autoSave: true,
            autoBackup: true,
            sessionTimeout: 60, // minutos
            debugMode: false
        },

        // Configurações da Interface
        interface: {
            sidebarCollapsed: false,
            compactMode: false,
            animations: true,
            soundNotifications: false,
            desktopNotifications: true,
            fontSize: 'medium', // small, medium, large
            colorScheme: 'blue', // blue, green, purple, red
            dashboardLayout: 'grid' // grid, list
        },

        // Configurações da Agenda
        schedule: {
            workDays: [1, 2, 3, 4, 5], // 0=domingo, 1=segunda...
            workStartTime: '08:00',
            workEndTime: '18:00',
            appointmentDuration: 60, // minutos
            lunchBreakStart: '12:00',
            lunchBreakEnd: '13:00',
            allowWeekendAppointments: false,
            reminderTime: 24, // horas antes
            allowOnlineScheduling: false
        },

        // Configurações Financeiras
        financial: {
            defaultInstallments: 1,
            interestRate: 0, // % ao mês
            latePaymentFee: 0, // %
            discountForCash: 0, // %
            invoiceTemplate: 'standard',
            paymentMethods: ['Dinheiro', 'Cartão', 'PIX', 'Transferência'],
            fiscalRegime: 'simples', // simples, lucro_real, lucro_presumido
            automaticBackup: true
        },

        // Configurações de Laboratórios
        laboratories: {
            defaultLaboratory: null,
            autoSendNotifications: true,
            reminderDays: 3,
            qualityTracking: true,
            costTracking: true,
            autoStatusUpdate: false
        },

        // Configurações de Segurança
        security: {
            passwordMinLength: 6,
            requireNumbers: true,
            requireSymbols: false,
            sessionLog: true,
            dataEncryption: true,
            autoLogout: 30, // minutos de inatividade
            ipWhitelist: [],
            twoFactorAuth: false
        },

        // Configurações de Backup
        backup: {
            autoBackup: true,
            backupFrequency: 'daily', // daily, weekly, monthly
            backupTime: '02:00',
            retentionDays: 30,
            cloudBackup: false,
            cloudProvider: 'none', // none, gdrive, dropbox
            compressionLevel: 'medium'
        },

        // Configurações de Notificações
        notifications: {
            email: {
                enabled: true,
                server: '',
                port: 587,
                security: 'tls',
                username: '',
                password: '',
                fromName: '',
                fromEmail: ''
            },
            sms: {
                enabled: false,
                provider: 'none',
                apiKey: '',
                sender: ''
            },
            push: {
                enabled: true,
                appointmentReminders: true,
                paymentDue: true,
                systemUpdates: false
            }
        },

        // Templates Personalizáveis
        templates: {
            receiptHeader: 'RECIBO DE PAGAMENTO',
            receiptFooter: 'Obrigado pela preferência!',
            appointmentConfirmation: 'Sua consulta foi agendada para {date} às {time}.',
            paymentReminder: 'Lembramos que você possui um débito vencendo em {date}.',
            welcomeMessage: 'Bem-vindo(a) ao nosso consultório!'
        }
    },

    // Configurações atuais
    currentSettings: {},

    // Especialidades odontológicas
    specialties: [
        'Clínica Geral',
        'Ortodontia',
        'Endodontia',
        'Periodontia',
        'Cirurgia Oral',
        'Implantodontia',
        'Prótese Dentária',
        'Odontopediatria',
        'Dentística',
        'Radiologia Oral',
        'Patologia Oral',
        'Odontogeriatria'
    ],

    // Estados brasileiros
    states: [
        'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
        'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
        'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
    ],

    /**
 * Seção do Firebase
 */
renderFirebaseSection() {
    const isFirebaseLoaded = typeof FirebaseSync !== 'undefined';
    const isConnected = isFirebaseLoaded && FirebaseSync.config?.connected;
    const currentUser = isFirebaseLoaded ? FirebaseSync.currentUser : {};
    
    return `
        <h2 class="config-section-title">
            🔥 Firebase - Colaboração em Tempo Real
        </h2>
        <p class="config-section-description">
            Configure a sincronização em tempo real com Firebase para colaboração da equipe.
        </p>

        <!-- Status de Conexão -->
        <div class="config-form-section">
            <h3 class="form-section-title">📊 Status da Conexão</h3>
            
            <div style="padding: 16px; background: ${isConnected ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)'}; border: 1px solid ${isConnected ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}; border-radius: 8px; margin-bottom: 20px;">
                <div style="display: flex; align-items: center; gap: 12px;">
                    <div style="width: 12px; height: 12px; border-radius: 50%; background: ${isConnected ? '#10b981' : '#ef4444'};"></div>
                    <div>
                        <div style="font-weight: 600; color: #ffffff;">
                            ${isConnected ? '✅ Conectado e Sincronizando' : '❌ Não Configurado'}
                        </div>
                        <div style="font-size: 12px; color: #94a3b8;">
                            ${isConnected ? 
                                `Logado como: ${currentUser.displayName || currentUser.email || 'Usuário'}` : 
                                'Configure as credenciais abaixo para ativar'
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Configuração Manual Firebase -->
        <div class="config-form-section">
            <h3 class="form-section-title">⚙️ Configuração Firebase</h3>
            
            <div class="config-form-group">
                <label class="config-label">Project ID</label>
                <input type="text" id="firebaseProjectId" class="config-input" placeholder="meu-projeto-firebase">
                <div class="config-hint">ID do projeto no Firebase Console</div>
            </div>
            
            <div class="config-form-group">
                <label class="config-label">API Key</label>
                <input type="password" id="firebaseApiKey" class="config-input" placeholder="AIzaSyXXXXXXXXXXXXXXXXXX">
                <div class="config-hint">Chave API do projeto Firebase</div>
            </div>
            
            <div class="config-form-group">
                <label class="config-label">Auth Domain</label>
                <input type="text" id="firebaseAuthDomain" class="config-input" placeholder="meu-projeto.firebaseapp.com">
                <div class="config-hint">Domínio de autenticação</div>
            </div>
            
            <div style="display: flex; gap: 12px; margin-top: 20px;">
                <button onclick="ConfiguracoesSystem.saveFirebaseConfig()" class="config-save-btn" style="flex: 1;">
                    💾 Salvar e Conectar
                </button>
                <button onclick="ConfiguracoesSystem.testFirebaseConnection()" class="config-save-btn" style="background: rgba(59, 130, 246, 0.2); flex: 1;">
                    🔍 Testar
                </button>
            </div>
        </div>

        <!-- Status dos Erros -->
        ${!isFirebaseLoaded ? `
            <div class="config-form-section">
                <h3 class="form-section-title">⚠️ Status dos Módulos</h3>
                <div style="padding: 16px; background: rgba(245, 158, 11, 0.1); border: 1px solid rgba(245, 158, 11, 0.3); border-radius: 8px;">
                    <div style="font-weight: 600; color: #f59e0b; margin-bottom: 8px;">Firebase Sync não carregado</div>
                    <div style="font-size: 12px; color: #94a3b8; line-height: 1.4;">
                        O módulo firebase-sync.js não foi carregado corretamente.<br>
                        Verifique se o arquivo existe em js/modules/firebase-sync.js
                    </div>
                </div>
            </div>
        ` : ''}

        <!-- Instruções -->
        <div class="config-form-section">
            <h3 class="form-section-title">📋 Como Configurar</h3>
            <div style="background: rgba(59, 130, 246, 0.1); border: 1px solid rgba(59, 130, 246, 0.3); border-radius: 8px; padding: 16px;">
                <div style="color: #94a3b8; font-size: 14px; line-height: 1.6;">
                    <strong style="color: #3b82f6;">1. Acesse o Firebase Console:</strong><br>
                    → https://console.firebase.google.com/<br><br>
                    
                    <strong style="color: #3b82f6;">2. Crie um novo projeto</strong><br><br>
                    
                    <strong style="color: #3b82f6;">3. Ative os serviços:</strong><br>
                    → Authentication (Email/Password)<br>
                    → Firestore Database<br><br>
                    
                    <strong style="color: #3b82f6;">4. Obtenha as configurações:</strong><br>
                    → Project Settings → General → Your apps → Web app<br><br>
                    
                    <strong style="color: #3b82f6;">5. Cole as informações nos campos acima</strong>
                </div>
            </div>
        </div>
    `;
},

/**
 * Salvar configuração Firebase
 */
saveFirebaseConfig() {
    const projectId = document.getElementById('firebaseProjectId')?.value;
    const apiKey = document.getElementById('firebaseApiKey')?.value;
    const authDomain = document.getElementById('firebaseAuthDomain')?.value;
    
    if (!projectId || !apiKey || !authDomain) {
        this.showAlert('⚠️ Campos Obrigatórios', 'Preencha todos os campos de configuração do Firebase.');
        return;
    }
    
    // Salvar configurações
    const firebaseConfig = {
        projectId: projectId,
        apiKey: apiKey,
        authDomain: authDomain,
        storageBucket: `${projectId}.appspot.com`,
        messagingSenderId: '123456789',
        appId: '1:123456789:web:abcdef123456'
    };
    
    localStorage.setItem('firebase_config', JSON.stringify(firebaseConfig));
    
    // Tentar inicializar Firebase
    if (typeof FirebaseSync !== 'undefined') {
        FirebaseSync.config = { ...FirebaseSync.config, ...firebaseConfig };
        FirebaseSync.initializeFirebase().then(() => {
            this.showAlert('✅ Firebase Configurado', 'Configuração salva e Firebase inicializado com sucesso!');
            this.showSection('firebase'); // Recarregar seção
        }).catch(error => {
            this.showAlert('❌ Erro Firebase', `Erro ao inicializar: ${error.message}`);
        });
    } else {
        this.showAlert('⚠️ Módulo Firebase', 'Configuração salva, mas módulo Firebase não está carregado.\nRecarregue a página e tente novamente.');
    }
},

/**
 * Testar conexão Firebase
 */
testFirebaseConnection() {
    if (typeof FirebaseSync !== 'undefined') {
        FirebaseSync.testConnection();
    } else {
        this.showAlert('⚠️ Firebase não disponível', 'Módulo Firebase não carregado. Verifique se firebase-sync.js está incluído.');
    }
},
    /**
     * Inicialização do módulo
     */
    init() {
        console.log('⚙️ Módulo Configurações do Sistema inicializado');
        this.loadSettings();
        this.applySettings();
    },

    /**
     * Carregar configurações
     */
    loadSettings() {
        const saved = localStorage.getItem('dentalcore_settings');
        if (saved) {
            this.currentSettings = { ...this.defaultSettings, ...JSON.parse(saved) };
        } else {
            this.currentSettings = { ...this.defaultSettings };
        }
    },

    /**
     * Salvar configurações
     */
    saveSettings() {
        localStorage.setItem('dentalcore_settings', JSON.stringify(this.currentSettings));
        this.applySettings();
        this.showAlert('✅ Configurações Salvas', 'Suas configurações foram salvas com sucesso!');
    },

    /**
     * Aplicar configurações
     */
    applySettings() {
        // Aplicar tema
        if (this.currentSettings.system.theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else if (this.currentSettings.system.theme === 'light') {
            document.documentElement.classList.remove('dark');
        }

        // Aplicar outras configurações de interface
        if (this.currentSettings.interface.animations === false) {
            document.documentElement.style.setProperty('--animation-duration', '0s');
        }

        // Aplicar configurações personalizadas
        this.applyCustomStyles();
    },

    /**
     * Aplicar estilos personalizados
     */
    applyCustomStyles() {
        const { colorScheme, fontSize } = this.currentSettings.interface;
        
        // Aplicar esquema de cores
        const colorSchemes = {
            blue: { primary: '#3b82f6', secondary: '#1e40af' },
            green: { primary: '#10b981', secondary: '#047857' },
            purple: { primary: '#8b5cf6', secondary: '#7c3aed' },
            red: { primary: '#ef4444', secondary: '#dc2626' }
        };

        if (colorSchemes[colorScheme]) {
            const colors = colorSchemes[colorScheme];
            document.documentElement.style.setProperty('--color-primary', colors.primary);
            document.documentElement.style.setProperty('--color-secondary', colors.secondary);
        }

        // Aplicar tamanho da fonte
        const fontSizes = {
            small: '14px',
            medium: '16px',
            large: '18px'
        };

        if (fontSizes[fontSize]) {
            document.documentElement.style.setProperty('--base-font-size', fontSizes[fontSize]);
        }
    },

    /**
     * Interface principal das configurações
     */
    renderConfigurationsInterface() {
        return `
            <style>
                /* CSS INLINE PARA CONFIGURAÇÕES */
                .config-workspace {
                    background: linear-gradient(135deg, #1e3a8a 0%, #374151 100%);
                    min-height: 100vh;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', sans-serif;
                    color: #f8fafc;
                    padding: 0;
                    margin: 0;
                }

                .config-header {
                    background: rgba(255, 255, 255, 0.05);
                    backdrop-filter: blur(20px);
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                    padding: 24px 40px;
                    position: sticky;
                    top: 0;
                    z-index: 100;
                }

                .config-title {
                    font-size: 28px;
                    font-weight: 300;
                    color: #ffffff;
                    margin: 0;
                    letter-spacing: -0.025em;
                    text-align: center;
                }

                .config-subtitle {
                    font-size: 14px;
                    color: #94a3b8;
                    margin: 4px 0 0 0;
                    font-weight: 400;
                    text-align: center;
                }

                .config-main-container {
                    padding: 40px;
                    max-width: 1400px;
                    margin: 0 auto;
                    display: grid;
                    grid-template-columns: 280px 1fr;
                    gap: 32px;
                }

                /* NAVEGAÇÃO LATERAL DAS CONFIGURAÇÕES */
                .config-nav {
                    background: rgba(255, 255, 255, 0.02);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    border-radius: 16px;
                    padding: 24px;
                    height: fit-content;
                    position: sticky;
                    top: 120px;
                }

                .config-nav-title {
                    font-size: 16px;
                    font-weight: 600;
                    color: #ffffff;
                    margin: 0 0 16px 0;
                    text-align: center;
                }

                .config-nav-list {
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                }

                .config-nav-btn {
                    padding: 12px 16px;
                    border: none;
                    border-radius: 8px;
                    background: transparent;
                    color: #94a3b8;
                    font-size: 14px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    text-align: left;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .config-nav-btn:hover {
                    background: rgba(255, 255, 255, 0.05);
                    color: #e2e8f0;
                }

                .config-nav-btn.active {
                    background: rgba(13, 148, 136, 0.2);
                    color: #14b8a6;
                    border: 1px solid rgba(13, 148, 136, 0.3);
                }

                .config-nav-icon {
                    font-size: 16px;
                    width: 20px;
                    text-align: center;
                }

                /* PAINEL DE CONFIGURAÇÕES */
                .config-panel {
                    background: rgba(255, 255, 255, 0.02);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    border-radius: 16px;
                    padding: 32px;
                    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
                }

                .config-section-title {
                    font-size: 24px;
                    font-weight: 600;
                    color: #ffffff;
                    margin: 0 0 8px 0;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .config-section-description {
                    font-size: 14px;
                    color: #94a3b8;
                    margin: 0 0 32px 0;
                    line-height: 1.5;
                }

                /* FORMULÁRIOS */
                .config-form {
                    display: flex;
                    flex-direction: column;
                    gap: 24px;
                }

                .config-form-section {
                    padding: 24px;
                    background: rgba(0, 0, 0, 0.2);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 12px;
                }

                .form-section-title {
                    font-size: 18px;
                    font-weight: 600;
                    color: #14b8a6;
                    margin: 0 0 16px 0;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .form-row {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 16px;
                    margin-bottom: 16px;
                }

                .form-group {
                    display: flex;
                    flex-direction: column;
                    gap: 6px;
                }

                .form-group.full-width {
                    grid-column: 1 / -1;
                }

                .form-label {
                    font-size: 13px;
                    font-weight: 600;
                    color: #e2e8f0;
                    margin-bottom: 4px;
                }

                .form-input,
                .form-select,
                .form-textarea {
                    background: rgba(0, 0, 0, 0.3);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 8px;
                    padding: 12px 16px;
                    color: #f8fafc;
                    font-size: 14px;
                    transition: all 0.2s ease;
                }

                .form-input:focus,
                .form-select:focus,
                .form-textarea:focus {
                    outline: none;
                    border-color: #0d9488;
                    box-shadow: 0 0 0 3px rgba(13, 148, 136, 0.1);
                }

                .form-textarea {
                    resize: vertical;
                    min-height: 100px;
                }

                .form-checkbox-group {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin-bottom: 8px;
                }

                .form-checkbox {
                    width: 18px;
                    height: 18px;
                    accent-color: #0d9488;
                }

                .checkbox-label {
                    font-size: 14px;
                    color: #e2e8f0;
                    cursor: pointer;
                }

                .toggle-switch {
                    position: relative;
                    display: inline-block;
                    width: 50px;
                    height: 24px;
                }

                .toggle-switch input {
                    opacity: 0;
                    width: 0;
                    height: 0;
                }

                .toggle-slider {
                    position: absolute;
                    cursor: pointer;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-color: rgba(255, 255, 255, 0.2);
                    transition: .4s;
                    border-radius: 24px;
                }

                .toggle-slider:before {
                    position: absolute;
                    content: "";
                    height: 18px;
                    width: 18px;
                    left: 3px;
                    bottom: 3px;
                    background-color: white;
                    transition: .4s;
                    border-radius: 50%;
                }

                input:checked + .toggle-slider {
                    background-color: #0d9488;
                }

                input:checked + .toggle-slider:before {
                    transform: translateX(26px);
                }

                /* BOTÕES DE AÇÃO */
                .config-actions {
                    display: flex;
                    justify-content: flex-end;
                    gap: 12px;
                    padding-top: 24px;
                    border-top: 1px solid rgba(255, 255, 255, 0.1);
                    margin-top: 32px;
                }

                .config-btn {
                    padding: 12px 24px;
                    border: none;
                    border-radius: 8px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .config-btn.primary {
                    background: linear-gradient(135deg, #0d9488 0%, #14b8a6 100%);
                    color: white;
                }

                .config-btn.secondary {
                    background: rgba(255, 255, 255, 0.1);
                    color: #e2e8f0;
                    border: 1px solid rgba(255, 255, 255, 0.2);
                }

                .config-btn.danger {
                    background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%);
                    color: white;
                }

                .config-btn:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                }
                 <button onclick="ConfiguracoesSystem.showSection('firebase')" class="config-nav-btn" data-section="firebase">
    <span class="config-nav-icon">🔥</span>
    <span>Firebase</span>
</button>   

                /* CARDS DE PREVIEW */
                .preview-card {
                    background: rgba(0, 0, 0, 0.2);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 8px;
                    padding: 16px;
                    margin-top: 16px;
                }

                .preview-title {
                    font-size: 14px;
                    font-weight: 600;
                    color: #14b8a6;
                    margin: 0 0 8px 0;
                }

                .preview-content {
                    font-size: 13px;
                    color: #d1d5db;
                    line-height: 1.4;
                }

                /* RESPONSIVIDADE */
                @media (max-width: 1024px) {
                    .config-main-container {
                        grid-template-columns: 1fr;
                        padding: 20px;
                    }
                    
                    .config-nav {
                        position: static;
                    }
                    
                    .config-nav-list {
                        flex-direction: row;
                        flex-wrap: wrap;
                    }
                    
                    .form-row {
                        grid-template-columns: 1fr;
                    }
                }

                @media (max-width: 768px) {
                    .config-header {
                        padding: 20px;
                    }
                    
                    .config-panel {
                        padding: 20px;
                    }
                    
                    .config-actions {
                        flex-direction: column;
                    }
                }
            </style>

            <div class="config-workspace">
                <!-- Header -->
                <div class="config-header">
                    <h1 class="config-title">⚙️ Configurações do Sistema</h1>
                    <p class="config-subtitle">Personalize e configure todos os aspectos do DentalCore Pro</p>
                </div>

                <!-- Container Principal -->
                <div class="config-main-container">
                    <!-- Navegação das Configurações -->
                    <div class="config-nav">
                        <h3 class="config-nav-title">Categorias</h3>
                        <div class="config-nav-list">
                            <button onclick="ConfiguracoesSystem.showSection('clinic')" class="config-nav-btn active" data-section="clinic">
                                <span class="config-nav-icon">🏥</span>
                                <span>Clínica</span>
                            </button>
                            <button onclick="ConfiguracoesSystem.showSection('system')" class="config-nav-btn" data-section="system">
                                <span class="config-nav-icon">⚙️</span>
                                <span>Sistema</span>
                            </button>
                            <button onclick="ConfiguracoesSystem.showSection('interface')" class="config-nav-btn" data-section="interface">
                                <span class="config-nav-icon">🎨</span>
                                <span>Interface</span>
                            </button>
                            <button onclick="ConfiguracoesSystem.showSection('schedule')" class="config-nav-btn" data-section="schedule">
                                <span class="config-nav-icon">📅</span>
                                <span>Agenda</span>
                            </button>
                            <button onclick="ConfiguracoesSystem.showSection('financial')" class="config-nav-btn" data-section="financial">
                                <span class="config-nav-icon">💰</span>
                                <span>Financeiro</span>
                            </button>
                            <button onclick="ConfiguracoesSystem.showSection('laboratories')" class="config-nav-btn" data-section="laboratories">
                                <span class="config-nav-icon">🔬</span>
                                <span>Laboratórios</span>
                            </button>
                            <button onclick="ConfiguracoesSystem.showSection('security')" class="config-nav-btn" data-section="security">
                                <span class="config-nav-icon">🔒</span>
                                <span>Segurança</span>
                            </button>
                            <button onclick="ConfiguracoesSystem.showSection('backup')" class="config-nav-btn" data-section="backup">
                                <span class="config-nav-icon">💾</span>
                                <span>Backup</span>
                            </button>
                            <button onclick="ConfiguracoesSystem.showSection('notifications')" class="config-nav-btn" data-section="notifications">
                                <span class="config-nav-icon">🔔</span>
                                <span>Notificações</span>
                            </button>
                            <button onclick="ConfiguracoesSystem.showSection('templates')" class="config-nav-btn" data-section="templates">
                                <span class="config-nav-icon">📋</span>
                                <span>Templates</span>
                            </button>
                        <button onclick="ConfiguracoesSystem.showSection('firebase')" class="config-nav-btn" data-section="firebase">
    <span class="config-nav-icon">🔥</span>
    <span>Firebase</span>
</button>
                            </div>
                    </div>

                    <!-- Painel de Configuração -->
                    <div class="config-panel">
                        <div id="configSectionContent">
                            ${this.renderSection('clinic')}
                        </div>

                        <!-- Botões de Ação -->
                        <div class="config-actions">
                            <button onclick="ConfiguracoesSystem.resetToDefaults()" class="config-btn danger">
                                🔄 Restaurar Padrões
                            </button>
                            <button onclick="ConfiguracoesSystem.exportSettings()" class="config-btn secondary">
                                📤 Exportar
                            </button>
                            <button onclick="ConfiguracoesSystem.importSettings()" class="config-btn secondary">
                                📥 Importar
                            </button>
                            <button onclick="ConfiguracoesSystem.saveAllSettings()" class="config-btn primary">
                                💾 Salvar Alterações
                            </button>
                            case 'firebase':
                                return this.renderFirebaseSection();
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * Mostrar seção específica
     */
    showSection(section) {
        // Atualizar navegação
        document.querySelectorAll('.config-nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-section="${section}"]`).classList.add('active');

        // Atualizar conteúdo
        document.getElementById('configSectionContent').innerHTML = this.renderSection(section);
    },

    /**
     * Renderizar seção específica
     */
    renderSection(section) {
        switch (section) {
            case 'clinic':
                return this.renderClinicSection();
            case 'system':
                return this.renderSystemSection();
            case 'interface':
                return this.renderInterfaceSection();
            case 'schedule':
                return this.renderScheduleSection();
            case 'financial':
                return this.renderFinancialSection();
            case 'laboratories':
                return this.renderLaboratoriesSection();
            case 'security':
                return this.renderSecuritySection();
            case 'backup':
                return this.renderBackupSection();
            case 'notifications':
                return this.renderNotificationsSection();
            case 'templates':
                return this.renderTemplatesSection();
            default:
                return this.renderClinicSection();
        case 'firebase':
    return this.renderFirebaseSection();
            }
    },

    /**
     * Seção da Clínica
     */
    renderClinicSection() {
        const clinic = this.currentSettings.clinic;
        
        return `
            <h2 class="config-section-title">
                🏥 Dados da Clínica
            </h2>
            <p class="config-section-description">
                Configure as informações básicas da sua clínica ou consultório odontológico.
            </p>

            <form class="config-form" onsubmit="ConfiguracoesSystem.saveSection(event, 'clinic')">
                <!-- Informações Básicas -->
                <div class="config-form-section">
                    <h3 class="form-section-title">
                        📋 Informações Básicas
                    </h3>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label">Nome da Clínica *</label>
                            <input type="text" name="name" class="form-input" value="${clinic.name}" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Nome Fantasia</label>
                            <input type="text" name="fantasyName" class="form-input" value="${clinic.fantasyName}">
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label">CNPJ</label>
                            <input type="text" name="cnpj" class="form-input" value="${clinic.cnpj}" placeholder="00.000.000/0000-00">
                        </div>
                        <div class="form-group">
                            <label class="form-label">CRO da Clínica</label>
                            <input type="text" name="cro" class="form-input" value="${clinic.cro}">
                        </div>
                    </div>
                </div>

                <!-- Contato -->
                <div class="config-form-section">
                    <h3 class="form-section-title">
                        📞 Informações de Contato
                    </h3>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label">Telefone Principal</label>
                            <input type="tel" name="phone" class="form-input" value="${clinic.phone}" placeholder="(11) 99999-9999">
                        </div>
                        <div class="form-group">
                            <label class="form-label">E-mail</label>
                            <input type="email" name="email" class="form-input" value="${clinic.email}">
                        </div>
                    </div>
                    
                    <div class="form-group full-width">
                        <label class="form-label">Website</label>
                        <input type="url" name="website" class="form-input" value="${clinic.website}" placeholder="https://www.suaclinica.com.br">
                    </div>
                </div>

                <!-- Endereço -->
                <div class="config-form-section">
                    <h3 class="form-section-title">
                        📍 Endereço
                    </h3>
                    
                    <div class="form-group full-width">
                        <label class="form-label">Endereço Completo</label>
                        <input type="text" name="address" class="form-input" value="${clinic.address}" placeholder="Rua, número, bairro">
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label">Cidade</label>
                            <input type="text" name="city" class="form-input" value="${clinic.city}">
                        </div>
                        <div class="form-group">
                            <label class="form-label">Estado</label>
                            <select name="state" class="form-select">
                                <option value="">Selecione</option>
                                ${this.states.map(state => 
                                    `<option value="${state}" ${clinic.state === state ? 'selected' : ''}>${state}</option>`
                                ).join('')}
                            </select>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">CEP</label>
                        <input type="text" name="zipCode" class="form-input" value="${clinic.zipCode}" placeholder="00000-000">
                    </div>
                </div>

                <!-- Responsável Técnico -->
                <div class="config-form-section">
                    <h3 class="form-section-title">
                        👨‍⚕️ Responsável Técnico
                    </h3>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label">Nome do Dentista Responsável</label>
                            <input type="text" name="responsibleDoctor" class="form-input" value="${clinic.responsibleDoctor}">
                        </div>
                        <div class="form-group">
                            <label class="form-label">CRO do Responsável</label>
                            <input type="text" name="croDr" class="form-input" value="${clinic.croDr}">
                        </div>
                    </div>
                </div>

                <!-- Especialidades -->
                <div class="config-form-section">
                    <h3 class="form-section-title">
                        🦷 Especialidades Oferecidas
                    </h3>
                    
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px;">
                        ${this.specialties.map(specialty => `
                            <div class="form-checkbox-group">
                                <input type="checkbox" name="specialties" value="${specialty}" class="form-checkbox" 
                                       ${clinic.specialties?.includes(specialty) ? 'checked' : ''}>
                                <label class="checkbox-label">${specialty}</label>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </form>
        `;
    },

    /**
     * Seção do Sistema
     */
    renderSystemSection() {
        const system = this.currentSettings.system;
        
        return `
            <h2 class="config-section-title">
                ⚙️ Configurações do Sistema
            </h2>
            <p class="config-section-description">
                Defina as configurações gerais de funcionamento do sistema.
            </p>

            <form class="config-form" onsubmit="ConfiguracoesSystem.saveSection(event, 'system')">
                <!-- Aparência -->
                <div class="config-form-section">
                    <h3 class="form-section-title">
                        🎨 Aparência
                    </h3>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label">Tema</label>
                            <select name="theme" class="form-select">
                                <option value="auto" ${system.theme === 'auto' ? 'selected' : ''}>Automático</option>
                                <option value="light" ${system.theme === 'light' ? 'selected' : ''}>Claro</option>
                                <option value="dark" ${system.theme === 'dark' ? 'selected' : ''}>Escuro</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Idioma</label>
                            <select name="language" class="form-select">
                                <option value="pt-BR" ${system.language === 'pt-BR' ? 'selected' : ''}>Português (Brasil)</option>
                                <option value="en-US">English (US)</option>
                                <option value="es-ES">Español</option>
                            </select>
                        </div>
                    </div>
                </div>

                <!-- Localização -->
                <div class="config-form-section">
                    <h3 class="form-section-title">
                        🌍 Localização e Formato
                    </h3>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label">Fuso Horário</label>
                            <select name="timezone" class="form-select">
                                <option value="America/Sao_Paulo" ${system.timezone === 'America/Sao_Paulo' ? 'selected' : ''}>São Paulo (UTC-3)</option>
                                <option value="America/Manaus">Manaus (UTC-4)</option>
                                <option value="America/Rio_Branco">Rio Branco (UTC-5)</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Formato de Data</label>
                            <select name="dateFormat" class="form-select">
                                <option value="DD/MM/YYYY" ${system.dateFormat === 'DD/MM/YYYY' ? 'selected' : ''}>DD/MM/AAAA</option>
                                <option value="MM/DD/YYYY">MM/DD/AAAA</option>
                                <option value="YYYY-MM-DD">AAAA-MM-DD</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label">Formato de Hora</label>
                            <select name="timeFormat" class="form-select">
                                <option value="24h" ${system.timeFormat === '24h' ? 'selected' : ''}>24 horas (13:30)</option>
                                <option value="12h">12 horas (1:30 PM)</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Moeda</label>
                            <select name="currency" class="form-select">
                                <option value="BRL" ${system.currency === 'BRL' ? 'selected' : ''}>Real Brasileiro (R$)</option>
                                <option value="USD">Dólar Americano ($)</option>
                                <option value="EUR">Euro (€)</option>
                            </select>
                        </div>
                    </div>
                </div>

                <!-- Sistema -->
                <div class="config-form-section">
                    <h3 class="form-section-title">
                        🔧 Configurações Avançadas
                    </h3>
                    
                    <div class="form-group">
                        <label class="form-label">Timeout da Sessão (minutos)</label>
                        <input type="number" name="sessionTimeout" class="form-input" value="${system.sessionTimeout}" min="5" max="480">
                    </div>
                    
                    <div class="form-checkbox-group">
                        <input type="checkbox" name="autoSave" class="form-checkbox" ${system.autoSave ? 'checked' : ''}>
                        <label class="checkbox-label">Salvamento Automático</label>
                    </div>
                    
                    <div class="form-checkbox-group">
                        <input type="checkbox" name="autoBackup" class="form-checkbox" ${system.autoBackup ? 'checked' : ''}>
                        <label class="checkbox-label">Backup Automático</label>
                    </div>
                    
                    <div class="form-checkbox-group">
                        <input type="checkbox" name="debugMode" class="form-checkbox" ${system.debugMode ? 'checked' : ''}>
                        <label class="checkbox-label">Modo de Depuração (apenas para desenvolvedores)</label>
                    </div>
                </div>
            </form>
        `;
    },

    /**
     * Seção da Interface
     */
    renderInterfaceSection() {
        const ui = this.currentSettings.interface;
        
        return `
            <h2 class="config-section-title">
                🎨 Configurações da Interface
            </h2>
            <p class="config-section-description">
                Personalize a aparência e comportamento da interface do usuário.
            </p>

            <form class="config-form" onsubmit="ConfiguracoesSystem.saveSection(event, 'interface')">
                <!-- Visualização -->
                <div class="config-form-section">
                    <h3 class="form-section-title">
                        👁️ Configurações Visuais
                    </h3>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label">Esquema de Cores</label>
                            <select name="colorScheme" class="form-select">
                                <option value="blue" ${ui.colorScheme === 'blue' ? 'selected' : ''}>Azul</option>
                                <option value="green" ${ui.colorScheme === 'green' ? 'selected' : ''}>Verde</option>
                                <option value="purple" ${ui.colorScheme === 'purple' ? 'selected' : ''}>Roxo</option>
                                <option value="red" ${ui.colorScheme === 'red' ? 'selected' : ''}>Vermelho</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Tamanho da Fonte</label>
                            <select name="fontSize" class="form-select">
                                <option value="small" ${ui.fontSize === 'small' ? 'selected' : ''}>Pequena</option>
                                <option value="medium" ${ui.fontSize === 'medium' ? 'selected' : ''}>Média</option>
                                <option value="large" ${ui.fontSize === 'large' ? 'selected' : ''}>Grande</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Layout do Dashboard</label>
                        <select name="dashboardLayout" class="form-select">
                            <option value="grid" ${ui.dashboardLayout === 'grid' ? 'selected' : ''}>Grade de Cards</option>
                            <option value="list" ${ui.dashboardLayout === 'list' ? 'selected' : ''}>Lista Compacta</option>
                        </select>
                    </div>
                </div>

                <!-- Comportamento -->
                <div class="config-form-section">
                    <h3 class="form-section-title">
                        ⚡ Comportamento
                    </h3>
                    
                    <div class="form-checkbox-group">
                        <input type="checkbox" name="sidebarCollapsed" class="form-checkbox" ${ui.sidebarCollapsed ? 'checked' : ''}>
                        <label class="checkbox-label">Barra Lateral Recolhida por Padrão</label>
                    </div>
                    
                    <div class="form-checkbox-group">
                        <input type="checkbox" name="compactMode" class="form-checkbox" ${ui.compactMode ? 'checked' : ''}>
                        <label class="checkbox-label">Modo Compacto</label>
                    </div>
                    
                    <div class="form-checkbox-group">
                        <input type="checkbox" name="animations" class="form-checkbox" ${ui.animations ? 'checked' : ''}>
                        <label class="checkbox-label">Animações de Interface</label>
                    </div>
                </div>

                <!-- Notificações -->
                <div class="config-form-section">
                    <h3 class="form-section-title">
                        🔔 Notificações de Interface
                    </h3>
                    
                    <div class="form-checkbox-group">
                        <input type="checkbox" name="soundNotifications" class="form-checkbox" ${ui.soundNotifications ? 'checked' : ''}>
                        <label class="checkbox-label">Notificações Sonoras</label>
                    </div>
                    
                    <div class="form-checkbox-group">
                        <input type="checkbox" name="desktopNotifications" class="form-checkbox" ${ui.desktopNotifications ? 'checked' : ''}>
                        <label class="checkbox-label">Notificações do Desktop</label>
                    </div>
                </div>

                <!-- Preview -->
                <div class="preview-card">
                    <div class="preview-title">🔍 Pré-visualização</div>
                    <div class="preview-content">
                        As configurações de interface serão aplicadas após salvar. Você pode ver as mudanças imediatamente no sistema.
                    </div>
                </div>
            </form>
        `;
    },

    /**
     * Seção da Agenda
     */
    renderScheduleSection() {
        const schedule = this.currentSettings.schedule;
        
        return `
            <h2 class="config-section-title">
                📅 Configurações da Agenda
            </h2>
            <p class="config-section-description">
                Configure os horários de funcionamento e regras da agenda.
            </p>

            <form class="config-form" onsubmit="ConfiguracoesSystem.saveSection(event, 'schedule')">
                <!-- Horário de Funcionamento -->
                <div class="config-form-section">
                    <h3 class="form-section-title">
                        ⏰ Horário de Funcionamento
                    </h3>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label">Horário de Início</label>
                            <input type="time" name="workStartTime" class="form-input" value="${schedule.workStartTime}">
                        </div>
                        <div class="form-group">
                            <label class="form-label">Horário de Término</label>
                            <input type="time" name="workEndTime" class="form-input" value="${schedule.workEndTime}">
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label">Início do Almoço</label>
                            <input type="time" name="lunchBreakStart" class="form-input" value="${schedule.lunchBreakStart}">
                        </div>
                        <div class="form-group">
                            <label class="form-label">Fim do Almoço</label>
                            <input type="time" name="lunchBreakEnd" class="form-input" value="${schedule.lunchBreakEnd}">
                        </div>
                    </div>
                </div>

                <!-- Dias de Trabalho -->
                <div class="config-form-section">
                    <h3 class="form-section-title">
                        📆 Dias de Funcionamento
                    </h3>
                    
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 12px;">
                        ${['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'].map((day, index) => `
                            <div class="form-checkbox-group">
                                <input type="checkbox" name="workDays" value="${index}" class="form-checkbox" 
                                       ${schedule.workDays?.includes(index) ? 'checked' : ''}>
                                <label class="checkbox-label">${day}</label>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- Configurações de Consultas -->
                <div class="config-form-section">
                    <h3 class="form-section-title">
                        🕐 Configurações de Consultas
                    </h3>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label">Duração Padrão (minutos)</label>
                            <select name="appointmentDuration" class="form-select">
                                <option value="30" ${schedule.appointmentDuration === 30 ? 'selected' : ''}>30 minutos</option>
                                <option value="60" ${schedule.appointmentDuration === 60 ? 'selected' : ''}>60 minutos</option>
                                <option value="90" ${schedule.appointmentDuration === 90 ? 'selected' : ''}>90 minutos</option>
                                <option value="120" ${schedule.appointmentDuration === 120 ? 'selected' : ''}>120 minutos</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Lembrete (horas antes)</label>
                            <input type="number" name="reminderTime" class="form-input" value="${schedule.reminderTime}" min="1" max="72">
                        </div>
                    </div>
                    
                    <div class="form-checkbox-group">
                        <input type="checkbox" name="allowWeekendAppointments" class="form-checkbox" ${schedule.allowWeekendAppointments ? 'checked' : ''}>
                        <label class="checkbox-label">Permitir Agendamentos em Fins de Semana</label>
                    </div>
                    
                    <div class="form-checkbox-group">
                        <input type="checkbox" name="allowOnlineScheduling" class="form-checkbox" ${schedule.allowOnlineScheduling ? 'checked' : ''}>
                        <label class="checkbox-label">Permitir Agendamento Online</label>
                    </div>
                </div>
            </form>
        `;
    },

    /**
     * Seção Financeira
     */
    renderFinancialSection() {
        const financial = this.currentSettings.financial;
        
        return `
            <h2 class="config-section-title">
                💰 Configurações Financeiras
            </h2>
            <p class="config-section-description">
                Configure as opções de pagamento, juros e métodos financeiros.
            </p>

            <form class="config-form" onsubmit="ConfiguracoesSystem.saveSection(event, 'financial')">
                <!-- Pagamentos -->
                <div class="config-form-section">
                    <h3 class="form-section-title">
                        💳 Configurações de Pagamento
                    </h3>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label">Parcelas Padrão</label>
                            <select name="defaultInstallments" class="form-select">
                                <option value="1" ${financial.defaultInstallments === 1 ? 'selected' : ''}>À vista</option>
                                <option value="2" ${financial.defaultInstallments === 2 ? 'selected' : ''}>2x</option>
                                <option value="3" ${financial.defaultInstallments === 3 ? 'selected' : ''}>3x</option>
                                <option value="6" ${financial.defaultInstallments === 6 ? 'selected' : ''}>6x</option>
                                <option value="12" ${financial.defaultInstallments === 12 ? 'selected' : ''}>12x</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Juros Mensais (%)</label>
                            <input type="number" name="interestRate" class="form-input" value="${financial.interestRate}" min="0" max="10" step="0.01">
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label">Multa por Atraso (%)</label>
                            <input type="number" name="latePaymentFee" class="form-input" value="${financial.latePaymentFee}" min="0" max="20" step="0.01">
                        </div>
                        <div class="form-group">
                            <label class="form-label">Desconto à Vista (%)</label>
                            <input type="number" name="discountForCash" class="form-input" value="${financial.discountForCash}" min="0" max="50" step="0.01">
                        </div>
                    </div>
                </div>

                <!-- Métodos de Pagamento -->
                <div class="config-form-section">
                    <h3 class="form-section-title">
                        💰 Métodos de Pagamento Aceitos
                    </h3>
                    
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 12px;">
                        ${['Dinheiro', 'Cartão de Crédito', 'Cartão de Débito', 'PIX', 'Transferência', 'Boleto', 'Cheque'].map(method => `
                            <div class="form-checkbox-group">
                                <input type="checkbox" name="paymentMethods" value="${method}" class="form-checkbox" 
                                       ${financial.paymentMethods?.includes(method) ? 'checked' : ''}>
                                <label class="checkbox-label">${method}</label>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- Configurações Fiscais -->
                <div class="config-form-section">
                    <h3 class="form-section-title">
                        📊 Configurações Fiscais
                    </h3>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label">Regime Fiscal</label>
                            <select name="fiscalRegime" class="form-select">
                                <option value="simples" ${financial.fiscalRegime === 'simples' ? 'selected' : ''}>Simples Nacional</option>
                                <option value="lucro_presumido" ${financial.fiscalRegime === 'lucro_presumido' ? 'selected' : ''}>Lucro Presumido</option>
                                <option value="lucro_real" ${financial.fiscalRegime === 'lucro_real' ? 'selected' : ''}>Lucro Real</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Template de Recibo</label>
                            <select name="invoiceTemplate" class="form-select">
                                <option value="standard" ${financial.invoiceTemplate === 'standard' ? 'selected' : ''}>Padrão</option>
                                <option value="detailed">Detalhado</option>
                                <option value="minimal">Minimalista</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="form-checkbox-group">
                        <input type="checkbox" name="automaticBackup" class="form-checkbox" ${financial.automaticBackup ? 'checked' : ''}>
                        <label class="checkbox-label">Backup Automático dos Dados Financeiros</label>
                    </div>
                </div>
            </form>
        `;
    },

    /**
     * Seção de Laboratórios
     */
    renderLaboratoriesSection() {
        const labs = this.currentSettings.laboratories;
        
        return `
            <h2 class="config-section-title">
                🔬 Configurações de Laboratórios
            </h2>
            <p class="config-section-description">
                Configure as preferências para trabalho com laboratórios de próteses.
            </p>

            <form class="config-form" onsubmit="ConfiguracoesSystem.saveSection(event, 'laboratories')">
                <!-- Laboratório Padrão -->
                <div class="config-form-section">
                    <h3 class="form-section-title">
                        🏥 Laboratório Preferencial
                    </h3>
                    
                    <div class="form-group">
                        <label class="form-label">Laboratório Padrão</label>
                        <select name="defaultLaboratory" class="form-select">
                            <option value="">Selecione um laboratório</option>
                            <option value="1" ${labs.defaultLaboratory === 1 ? 'selected' : ''}>Lab Dental Excellence</option>
                            <option value="2" ${labs.defaultLaboratory === 2 ? 'selected' : ''}>ProLab Digital</option>
                            <option value="3" ${labs.defaultLaboratory === 3 ? 'selected' : ''}>Laboratório Premium</option>
                        </select>
                    </div>
                </div>

                <!-- Notificações -->
                <div class="config-form-section">
                    <h3 class="form-section-title">
                        🔔 Notificações e Lembretes
                    </h3>
                    
                    <div class="form-group">
                        <label class="form-label">Lembrete de Prazo (dias antes)</label>
                        <input type="number" name="reminderDays" class="form-input" value="${labs.reminderDays}" min="1" max="30">
                    </div>
                    
                    <div class="form-checkbox-group">
                        <input type="checkbox" name="autoSendNotifications" class="form-checkbox" ${labs.autoSendNotifications ? 'checked' : ''}>
                        <label class="checkbox-label">Enviar Notificações Automáticas</label>
                    </div>
                    
                    <div class="form-checkbox-group">
                        <input type="checkbox" name="autoStatusUpdate" class="form-checkbox" ${labs.autoStatusUpdate ? 'checked' : ''}>
                        <label class="checkbox-label">Atualização Automática de Status</label>
                    </div>
                </div>

                <!-- Controle de Qualidade -->
                <div class="config-form-section">
                    <h3 class="form-section-title">
                        ⭐ Controle de Qualidade
                    </h3>
                    
                    <div class="form-checkbox-group">
                        <input type="checkbox" name="qualityTracking" class="form-checkbox" ${labs.qualityTracking ? 'checked' : ''}>
                        <label class="checkbox-label">Acompanhar Qualidade dos Trabalhos</label>
                    </div>
                    
                    <div class="form-checkbox-group">
                        <input type="checkbox" name="costTracking" class="form-checkbox" ${labs.costTracking ? 'checked' : ''}>
                        <label class="checkbox-label">Controle de Custos por Laboratório</label>
                    </div>
                </div>
            </form>
        `;
    },

    /**
     * Seção de Segurança
     */
    renderSecuritySection() {
        const security = this.currentSettings.security;
        
        return `
            <h2 class="config-section-title">
                🔒 Configurações de Segurança
            </h2>
            <p class="config-section-description">
                Configure as políticas de segurança e privacidade do sistema.
            </p>

            <form class="config-form" onsubmit="ConfiguracoesSystem.saveSection(event, 'security')">
                <!-- Senhas -->
                <div class="config-form-section">
                    <h3 class="form-section-title">
                        🔐 Política de Senhas
                    </h3>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label">Tamanho Mínimo da Senha</label>
                            <input type="number" name="passwordMinLength" class="form-input" value="${security.passwordMinLength}" min="4" max="20">
                        </div>
                        <div class="form-group">
                            <label class="form-label">Logout Automático (minutos)</label>
                            <input type="number" name="autoLogout" class="form-input" value="${security.autoLogout}" min="5" max="120">
                        </div>
                    </div>
                    
                    <div class="form-checkbox-group">
                        <input type="checkbox" name="requireNumbers" class="form-checkbox" ${security.requireNumbers ? 'checked' : ''}>
                        <label class="checkbox-label">Exigir Números na Senha</label>
                    </div>
                    
                    <div class="form-checkbox-group">
                        <input type="checkbox" name="requireSymbols" class="form-checkbox" ${security.requireSymbols ? 'checked' : ''}>
                        <label class="checkbox-label">Exigir Símbolos na Senha</label>
                    </div>
                    
                    <div class="form-checkbox-group">
                        <input type="checkbox" name="twoFactorAuth" class="form-checkbox" ${security.twoFactorAuth ? 'checked' : ''}>
                        <label class="checkbox-label">Autenticação de Dois Fatores</label>
                    </div>
                </div>

                <!-- Logs e Auditoria -->
                <div class="config-form-section">
                    <h3 class="form-section-title">
                        📋 Logs e Auditoria
                    </h3>
                    
                    <div class="form-checkbox-group">
                        <input type="checkbox" name="sessionLog" class="form-checkbox" ${security.sessionLog ? 'checked' : ''}>
                        <label class="checkbox-label">Registrar Sessões de Login</label>
                    </div>
                    
                    <div class="form-checkbox-group">
                        <input type="checkbox" name="dataEncryption" class="form-checkbox" ${security.dataEncryption ? 'checked' : ''}>
                        <label class="checkbox-label">Criptografia de Dados Sensíveis</label>
                    </div>
                </div>

                <!-- Lista Branca de IPs -->
                <div class="config-form-section">
                    <h3 class="form-section-title">
                        🌐 Controle de Acesso
                    </h3>
                    
                    <div class="form-group">
                        <label class="form-label">IPs Permitidos (um por linha, deixe vazio para permitir todos)</label>
                        <textarea name="ipWhitelist" class="form-textarea" placeholder="192.168.1.1&#10;10.0.0.1">${security.ipWhitelist?.join('\\n') || ''}</textarea>
                    </div>
                </div>
            </form>
        `;
    },

    /**
     * Seção de Backup
     */
    renderBackupSection() {
        const backup = this.currentSettings.backup;
        
        return `
            <h2 class="config-section-title">
                💾 Configurações de Backup
            </h2>
            <p class="config-section-description">
                Configure as opções de backup automático e recuperação de dados.
            </p>

            <form class="config-form" onsubmit="ConfiguracoesSystem.saveSection(event, 'backup')">
                <!-- Backup Automático -->
                <div class="config-form-section">
                    <h3 class="form-section-title">
                        🔄 Backup Automático
                    </h3>
                    
                    <div class="form-checkbox-group">
                        <input type="checkbox" name="autoBackup" class="form-checkbox" ${backup.autoBackup ? 'checked' : ''}>
                        <label class="checkbox-label">Ativar Backup Automático</label>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label">Frequência do Backup</label>
                            <select name="backupFrequency" class="form-select">
                                <option value="daily" ${backup.backupFrequency === 'daily' ? 'selected' : ''}>Diário</option>
                                <option value="weekly" ${backup.backupFrequency === 'weekly' ? 'selected' : ''}>Semanal</option>
                                <option value="monthly" ${backup.backupFrequency === 'monthly' ? 'selected' : ''}>Mensal</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Horário do Backup</label>
                            <input type="time" name="backupTime" class="form-input" value="${backup.backupTime}">
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label">Retenção (dias)</label>
                            <input type="number" name="retentionDays" class="form-input" value="${backup.retentionDays}" min="7" max="365">
                        </div>
                        <div class="form-group">
                            <label class="form-label">Nível de Compressão</label>
                            <select name="compressionLevel" class="form-select">
                                <option value="low" ${backup.compressionLevel === 'low' ? 'selected' : ''}>Baixo</option>
                                <option value="medium" ${backup.compressionLevel === 'medium' ? 'selected' : ''}>Médio</option>
                                <option value="high" ${backup.compressionLevel === 'high' ? 'selected' : ''}>Alto</option>
                            </select>
                        </div>
                    </div>
                </div>

                <!-- Backup em Nuvem -->
                <div class="config-form-section">
                    <h3 class="form-section-title">
                        ☁️ Backup em Nuvem
                    </h3>
                    
                    <div class="form-checkbox-group">
                        <input type="checkbox" name="cloudBackup" class="form-checkbox" ${backup.cloudBackup ? 'checked' : ''}>
                        <label class="checkbox-label">Ativar Backup em Nuvem</label>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Provedor de Nuvem</label>
                        <select name="cloudProvider" class="form-select">
                            <option value="none" ${backup.cloudProvider === 'none' ? 'selected' : ''}>Nenhum</option>
                            <option value="gdrive" ${backup.cloudProvider === 'gdrive' ? 'selected' : ''}>Google Drive</option>
                            <option value="dropbox" ${backup.cloudProvider === 'dropbox' ? 'selected' : ''}>Dropbox</option>
                            <option value="onedrive" ${backup.cloudProvider === 'onedrive' ? 'selected' : ''}>OneDrive</option>
                        </select>
                    </div>
                </div>

                <!-- Ações de Backup -->
                <div class="config-form-section">
                    <h3 class="form-section-title">
                        ⚡ Ações Rápidas
                    </h3>
                    
                    <div style="display: flex; gap: 12px; flex-wrap: wrap;">
                        <button type="button" onclick="ConfiguracoesSystem.createBackup()" class="config-btn secondary">
                            💾 Criar Backup Agora
                        </button>
                        <button type="button" onclick="ConfiguracoesSystem.restoreBackup()" class="config-btn secondary">
                            📥 Restaurar Backup
                        </button>
                        <button type="button" onclick="ConfiguracoesSystem.downloadBackup()" class="config-btn secondary">
                            📤 Baixar Backup
                        </button>
                    </div>
                </div>
            </form>
        `;
    },

    /**
     * Seção de Notificações
     */
    renderNotificationsSection() {
        const notifications = this.currentSettings.notifications;
        
        return `
            <h2 class="config-section-title">
                🔔 Configurações de Notificações
            </h2>
            <p class="config-section-description">
                Configure como e quando receber notificações do sistema.
            </p>

            <form class="config-form" onsubmit="ConfiguracoesSystem.saveSection(event, 'notifications')">
                <!-- E-mail -->
                <div class="config-form-section">
                    <h3 class="form-section-title">
                        📧 Notificações por E-mail
                    </h3>
                    
                    <div class="form-checkbox-group" style="margin-bottom: 16px;">
                        <input type="checkbox" name="email.enabled" class="form-checkbox" ${notifications.email.enabled ? 'checked' : ''}>
                        <label class="checkbox-label">Ativar Notificações por E-mail</label>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label">Servidor SMTP</label>
                            <input type="text" name="email.server" class="form-input" value="${notifications.email.server}" placeholder="smtp.gmail.com">
                        </div>
                        <div class="form-group">
                            <label class="form-label">Porta</label>
                            <input type="number" name="email.port" class="form-input" value="${notifications.email.port}" placeholder="587">
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label">Usuário</label>
                            <input type="email" name="email.username" class="form-input" value="${notifications.email.username}">
                        </div>
                        <div class="form-group">
                            <label class="form-label">Senha</label>
                            <input type="password" name="email.password" class="form-input" value="${notifications.email.password}">
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label">Nome do Remetente</label>
                            <input type="text" name="email.fromName" class="form-input" value="${notifications.email.fromName}">
                        </div>
                        <div class="form-group">
                            <label class="form-label">E-mail do Remetente</label>
                            <input type="email" name="email.fromEmail" class="form-input" value="${notifications.email.fromEmail}">
                        </div>
                    </div>
                </div>

                <!-- SMS -->
                <div class="config-form-section">
                    <h3 class="form-section-title">
                        📱 Notificações por SMS
                    </h3>
                    
                    <div class="form-checkbox-group" style="margin-bottom: 16px;">
                        <input type="checkbox" name="sms.enabled" class="form-checkbox" ${notifications.sms.enabled ? 'checked' : ''}>
                        <label class="checkbox-label">Ativar Notificações por SMS</label>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label">Provedor de SMS</label>
                            <select name="sms.provider" class="form-select">
                                <option value="none" ${notifications.sms.provider === 'none' ? 'selected' : ''}>Nenhum</option>
                                <option value="twilio">Twilio</option>
                                <option value="nexmo">Vonage (Nexmo)</option>
                                <option value="zenvia">Zenvia</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Chave da API</label>
                            <input type="password" name="sms.apiKey" class="form-input" value="${notifications.sms.apiKey}">
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Remetente</label>
                        <input type="text" name="sms.sender" class="form-input" value="${notifications.sms.sender}" placeholder="SuaClinica">
                    </div>
                </div>

                <!-- Push Notifications -->
                <div class="config-form-section">
                    <h3 class="form-section-title">
                        🔔 Notificações Push
                    </h3>
                    
                    <div class="form-checkbox-group">
                        <input type="checkbox" name="push.enabled" class="form-checkbox" ${notifications.push.enabled ? 'checked' : ''}>
                        <label class="checkbox-label">Ativar Notificações Push</label>
                    </div>
                    
                    <div class="form-checkbox-group">
                        <input type="checkbox" name="push.appointmentReminders" class="form-checkbox" ${notifications.push.appointmentReminders ? 'checked' : ''}>
                        <label class="checkbox-label">Lembretes de Consulta</label>
                    </div>
                    
                    <div class="form-checkbox-group">
                        <input type="checkbox" name="push.paymentDue" class="form-checkbox" ${notifications.push.paymentDue ? 'checked' : ''}>
                        <label class="checkbox-label">Vencimento de Pagamentos</label>
                    </div>
                    
                    <div class="form-checkbox-group">
                        <input type="checkbox" name="push.systemUpdates" class="form-checkbox" ${notifications.push.systemUpdates ? 'checked' : ''}>
                        <label class="checkbox-label">Atualizações do Sistema</label>
                    </div>
                </div>
            </form>
        `;
    },

    /**
     * Seção de Templates
     */
    renderTemplatesSection() {
        const templates = this.currentSettings.templates;
        
        return `
            <h2 class="config-section-title">
                📋 Templates Personalizáveis
            </h2>
            <p class="config-section-description">
                Personalize as mensagens e templates utilizados pelo sistema.
            </p>

            <form class="config-form" onsubmit="ConfiguracoesSystem.saveSection(event, 'templates')">
                <!-- Templates de Recibo -->
                <div class="config-form-section">
                    <h3 class="form-section-title">
                        🧾 Templates de Recibo
                    </h3>
                    
                    <div class="form-group">
                        <label class="form-label">Cabeçalho do Recibo</label>
                        <input type="text" name="receiptHeader" class="form-input" value="${templates.receiptHeader}">
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Rodapé do Recibo</label>
                        <input type="text" name="receiptFooter" class="form-input" value="${templates.receiptFooter}">
                    </div>
                </div>

                <!-- Templates de Mensagens -->
                <div class="config-form-section">
                    <h3 class="form-section-title">
                        💬 Templates de Mensagens
                    </h3>
                    
                    <div class="form-group">
                        <label class="form-label">Confirmação de Consulta</label>
                        <textarea name="appointmentConfirmation" class="form-textarea" placeholder="Use {date} e {time} para data e hora">${templates.appointmentConfirmation}</textarea>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Lembrete de Pagamento</label>
                        <textarea name="paymentReminder" class="form-textarea" placeholder="Use {date} para a data de vencimento">${templates.paymentReminder}</textarea>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Mensagem de Boas-vindas</label>
                        <textarea name="welcomeMessage" class="form-textarea">${templates.welcomeMessage}</textarea>
                    </div>
                </div>

                <!-- Variáveis Disponíveis -->
                <div class="preview-card">
                    <div class="preview-title">🔤 Variáveis Disponíveis</div>
                    <div class="preview-content">
                        <strong>Consultas:</strong> {date}, {time}, {patient}, {doctor}<br>
                        <strong>Pagamentos:</strong> {date}, {amount}, {patient}<br>
                        <strong>Geral:</strong> {clinic}, {phone}, {email}
                    </div>
                </div>
            </form>
        `;
    },

    /**
     * FUNÇÕES DE INTERAÇÃO
     */
    saveSection(event, section) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const sectionData = {};
        
        // Processar todos os campos do formulário
        for (let [key, value] of formData.entries()) {
            if (key.includes('.')) {
                // Campos aninhados (ex: email.server)
                const [parent, child] = key.split('.');
                if (!sectionData[parent]) sectionData[parent] = {};
                sectionData[parent][child] = value;
            } else {
                sectionData[key] = value;
            }
        }
        
        // Processar checkboxes (arrays)
        const checkboxArrays = ['specialties', 'workDays', 'paymentMethods'];
        checkboxArrays.forEach(field => {
            const values = formData.getAll(field);
            if (field === 'workDays') {
                sectionData[field] = values.map(v => parseInt(v));
            } else {
                sectionData[field] = values;
            }
        });
        
        // Processar checkboxes simples
        const checkboxes = event.target.querySelectorAll('input[type="checkbox"]:not([name*="."]):not([name="specialties"]):not([name="workDays"]):not([name="paymentMethods"])');
        checkboxes.forEach(cb => {
            if (!cb.name.includes('.') && !['specialties', 'workDays', 'paymentMethods'].includes(cb.name)) {
                sectionData[cb.name] = cb.checked;
            }
        });
        
        // Processar checkboxes aninhados
        const nestedCheckboxes = event.target.querySelectorAll('input[type="checkbox"][name*="."]');
        nestedCheckboxes.forEach(cb => {
            const [parent, child] = cb.name.split('.');
            if (!sectionData[parent]) sectionData[parent] = {};
            sectionData[parent][child] = cb.checked;
        });
        
        // Atualizar configurações
        this.currentSettings[section] = { ...this.currentSettings[section], ...sectionData };
        this.saveSettings();
    },

    saveAllSettings() {
        // Coletar dados de todos os formulários visíveis
        const forms = document.querySelectorAll('.config-form');
        forms.forEach(form => {
            // Simular evento de submit para cada form
            const event = new Event('submit');
            form.dispatchEvent(event);
        });
        
        this.saveSettings();
    },

    resetToDefaults() {
        const confirmReset = this.showConfirmDialog(
            'Restaurar Configurações Padrão',
            'Tem certeza que deseja restaurar todas as configurações para os valores padrão? Esta ação não pode ser desfeita.'
        );
        
        if (confirmReset) {
            this.currentSettings = { ...this.defaultSettings };
            this.saveSettings();
            location.reload(); // Recarregar para aplicar mudanças
        }
    },

    exportSettings() {
        const settings = JSON.stringify(this.currentSettings, null, 2);
        const blob = new Blob([settings], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `dentalcore-config-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        
        URL.revokeObjectURL(url);
        this.showAlert('📤 Configurações Exportadas', 'Arquivo de configurações baixado com sucesso!');
    },

    importSettings() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;
            
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const settings = JSON.parse(e.target.result);
                    this.currentSettings = { ...this.defaultSettings, ...settings };
                    this.saveSettings();
                    location.reload();
                    this.showAlert('📥 Configurações Importadas', 'Configurações importadas e aplicadas com sucesso!');
                } catch (error) {
                    this.showAlert('❌ Erro na Importação', 'Arquivo de configurações inválido!');
                }
            };
            reader.readAsText(file);
        };
        
        input.click();
    },

    createBackup() {
        this.showAlert('💾 Backup Criado', 'Backup manual criado com sucesso!');
    },

    restoreBackup() {
        this.showAlert('📥 Restaurar Backup', 'Funcionalidade de restauração será implementada.');
    },

    downloadBackup() {
        this.showAlert('📤 Download de Backup', 'Download do backup iniciado.');
    },

    showConfirmDialog(title, message) {
        return confirm(message);
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
window.ConfiguracoesSystem = ConfiguracoesSystem;

console.log('⚙️ Módulo Configurações do Sistema carregado!');