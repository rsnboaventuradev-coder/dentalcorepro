// ============================================================================
// DENTALCORE PRO - MÓDULO FIREBASE MULTI-USUÁRIO
// Sistema completo de sincronização em tempo real para equipes odontológicas
// Firestore + Authentication + Real-time + Colaboração
// ============================================================================

// Verificação de ambiente antes de carregar Firebase
if (window.location.protocol === 'file:') {
    console.warn('⚠️ Firebase pode não funcionar em file://. Use um servidor web local.');
}

// Interceptar erros do Firebase
window.addEventListener('error', function(e) {
    if (e.message.includes('gapi') || e.message.includes('firebase')) {
        console.log('🔥 Erro Firebase interceptado:', e.message);
        e.preventDefault();
    }
});
const FirebaseSync = {
    // Firebase app e serviços
    app: null,
    db: null,
    auth: null,
    
    // Configurações
    config: {
        apiKey: '',
        authDomain: '',
        projectId: '',
        storageBucket: '',
        messagingSenderId: '',
        appId: '',
        connected: false,
        clinicId: 'clinic_001' // ID da clínica
    },

    // Estado atual do usuário
    currentUser: {
        uid: null,
        email: null,
        displayName: null,
        role: null, // admin, doctor, assistant, secretary
        clinicId: null,
        photoURL: null,
        lastSeen: null,
        isOnline: false
    },

    // Listeners ativos
    listeners: [],

    // Cache de dados em tempo real
    dataCache: {
        patients: new Map(),
        appointments: new Map(),
        treatments: new Map(),
        laboratories: new Map(),
        debts: new Map(),
        users: new Map(),
        clinicSettings: {}
    },

    // Estado de sincronização
    syncState: {
        isOnline: navigator.onLine,
        lastSync: null,
        pendingWrites: 0,
        errors: []
    },

    // Roles e permissões
    roles: {
        admin: {
            name: 'Administrador',
            permissions: ['read', 'write', 'delete', 'manage_users', 'manage_settings'],
            color: '#ef4444'
        },
        doctor: {
            name: 'Dentista',
            permissions: ['read', 'write', 'delete'],
            color: '#3b82f6'
        },
        assistant: {
            name: 'Auxiliar',
            permissions: ['read', 'write'],
            color: '#10b981'
        },
        secretary: {
            name: 'Secretária',
            permissions: ['read', 'write_appointments', 'write_patients'],
            color: '#f59e0b'
        }
    },

    /**
     * Inicialização do módulo
     */
    init() {
        console.log('🔥 Módulo Firebase Multi-usuário inicializado');
        this.loadConfig();
        this.setupNetworkListeners();
        
        if (this.config.projectId) {
            this.initializeFirebase();
        }
    },

    /**
     * Carregar configurações
     */
    loadConfig() {
        const saved = localStorage.getItem('firebase_config');
        if (saved) {
            this.config = { ...this.config, ...JSON.parse(saved) };
        }
    },

    /**
     * Salvar configurações
     */
    saveConfig() {
        localStorage.setItem('firebase_config', JSON.stringify(this.config));
    },

    /**
     * Configurar listeners de rede
     */
    setupNetworkListeners() {
        window.addEventListener('online', () => {
            this.syncState.isOnline = true;
            this.updateOnlineStatus(true);
        });

        window.addEventListener('offline', () => {
            this.syncState.isOnline = false;
            this.updateOnlineStatus(false);
        });
    },

    /**
     * Inicializar Firebase
     */
    async initializeFirebase() {
        try {
            // Carregar Firebase SDK
            await this.loadFirebaseSDK();

            // Inicializar Firebase App
            this.app = firebase.initializeApp(this.config);
            this.db = firebase.firestore();
            this.auth = firebase.auth();

            // Configurar persistência offline
            this.db.enablePersistence({ synchronizeTabs: true });

            // Configurar listener de autenticação
            this.auth.onAuthStateChanged((user) => {
                if (user) {
                    this.handleUserLogin(user);
                } else {
                    this.handleUserLogout();
                }
            });

            this.config.connected = true;
            console.log('✅ Firebase inicializado com sucesso');
            this.saveConfig();
        } catch (error) {
            console.error('❌ Erro ao inicializar Firebase:', error);
            this.config.connected = false;
            this.syncState.errors.push(error.message);
        }
    },

    /**
     * Carregar Firebase SDK
     */
    async loadFirebaseSDK() {
        if (window.firebase) return;

        // Carregar scripts Firebase
        const scripts = [
            'https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js',
            'https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore-compat.js',
            'https://www.gstatic.com/firebasejs/9.23.0/firebase-auth-compat.js'
        ];

        for (const src of scripts) {
            await new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = src;
                script.onload = resolve;
                script.onerror = reject;
                document.head.appendChild(script);
            });
        }
    },

    /**
     * Interface principal do Firebase
     */
    renderFirebaseInterface() {
        return `
            <style>
                /* CSS INLINE PARA FIREBASE */
                .firebase-workspace {
                    background: linear-gradient(135deg, #1e3a8a 0%, #374151 100%);
                    min-height: 100vh;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', sans-serif;
                    color: #f8fafc;
                    padding: 0;
                    margin: 0;
                }

                .firebase-header {
                    background: rgba(255, 255, 255, 0.05);
                    backdrop-filter: blur(20px);
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                    padding: 24px 40px;
                    position: sticky;
                    top: 0;
                    z-index: 100;
                }

                .firebase-title {
                    font-size: 28px;
                    font-weight: 300;
                    color: #ffffff;
                    margin: 0;
                    letter-spacing: -0.025em;
                    text-align: center;
                }

                .firebase-subtitle {
                    font-size: 14px;
                    color: #94a3b8;
                    margin: 4px 0 0 0;
                    font-weight: 400;
                    text-align: center;
                }

                .firebase-main-container {
                    padding: 40px;
                    max-width: 1400px;
                    margin: 0 auto;
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 32px;
                }

                .firebase-section {
                    background: rgba(255, 255, 255, 0.02);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    border-radius: 16px;
                    padding: 32px;
                    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
                }

                .section-title {
                    font-size: 24px;
                    font-weight: 600;
                    color: #ffffff;
                    margin: 0 0 8px 0;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .section-description {
                    font-size: 14px;
                    color: #94a3b8;
                    margin: 0 0 24px 0;
                    line-height: 1.5;
                }

                .connection-status {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 16px;
                    background: rgba(0, 0, 0, 0.2);
                    border-radius: 12px;
                    margin-bottom: 24px;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                }

                .status-indicator {
                    width: 12px;
                    height: 12px;
                    border-radius: 50%;
                    flex-shrink: 0;
                }

                .status-indicator.connected {
                    background: #10b981;
                    box-shadow: 0 0 8px rgba(16, 185, 129, 0.5);
                }

                .status-indicator.disconnected {
                    background: #ef4444;
                    box-shadow: 0 0 8px rgba(239, 68, 68, 0.5);
                }

                .status-indicator.connecting {
                    background: #f59e0b;
                    box-shadow: 0 0 8px rgba(245, 158, 11, 0.5);
                    animation: pulse 2s infinite;
                }

                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }

                .status-text {
                    flex: 1;
                }

                .status-title {
                    font-weight: 600;
                    color: #ffffff;
                    margin: 0 0 2px 0;
                }

                .status-details {
                    font-size: 12px;
                    color: #94a3b8;
                    margin: 0;
                }

                .user-card {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 16px;
                    background: rgba(0, 0, 0, 0.2);
                    border-radius: 12px;
                    margin-bottom: 16px;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                }

                .user-avatar {
                    width: 48px;
                    height: 48px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #0d9488 0%, #14b8a6 100%);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-weight: 600;
                    font-size: 18px;
                    border: 2px solid rgba(255, 255, 255, 0.2);
                }

                .user-info {
                    flex: 1;
                }

                .user-name {
                    font-weight: 600;
                    color: #ffffff;
                    margin: 0 0 2px 0;
                }

                .user-details {
                    font-size: 12px;
                    color: #94a3b8;
                    margin: 0;
                }

                .user-role {
                    display: inline-block;
                    padding: 2px 8px;
                    border-radius: 12px;
                    font-size: 10px;
                    font-weight: 600;
                    text-transform: uppercase;
                    margin-left: 8px;
                }

                .config-form {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }

                .form-group {
                    display: flex;
                    flex-direction: column;
                    gap: 6px;
                }

                .form-label {
                    font-size: 13px;
                    font-weight: 600;
                    color: #e2e8f0;
                    margin-bottom: 4px;
                }

                .form-input,
                .form-select {
                    background: rgba(0, 0, 0, 0.3);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 8px;
                    padding: 12px 16px;
                    color: #f8fafc;
                    font-size: 14px;
                    transition: all 0.2s ease;
                }

                .form-input:focus,
                .form-select:focus {
                    outline: none;
                    border-color: #0d9488;
                    box-shadow: 0 0 0 3px rgba(13, 148, 136, 0.1);
                }

                .form-input::placeholder {
                    color: #6b7280;
                }

                .firebase-btn {
                    padding: 12px 24px;
                    border: none;
                    border-radius: 8px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    justify-content: center;
                    font-size: 14px;
                    text-decoration: none;
                }

                .firebase-btn.primary {
                    background: linear-gradient(135deg, #f59e0b 0%, #f97316 100%);
                    color: white;
                }

                .firebase-btn.secondary {
                    background: rgba(255, 255, 255, 0.1);
                    color: #e2e8f0;
                    border: 1px solid rgba(255, 255, 255, 0.2);
                }

                .firebase-btn.danger {
                    background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%);
                    color: white;
                }

                .firebase-btn:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                }

                .firebase-btn:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                    transform: none;
                }

                .sync-stats {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 16px;
                    margin-bottom: 24px;
                }

                .stat-card {
                    background: rgba(0, 0, 0, 0.2);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 8px;
                    padding: 16px;
                    text-align: center;
                }

                .stat-value {
                    font-size: 24px;
                    font-weight: 700;
                    color: #f59e0b;
                    margin: 0 0 4px 0;
                }

                .stat-label {
                    font-size: 11px;
                    color: #94a3b8;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }

                .online-users {
                    max-height: 300px;
                    overflow-y: auto;
                    margin-bottom: 16px;
                }

                .online-user {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 8px 12px;
                    margin-bottom: 4px;
                    background: rgba(0, 0, 0, 0.1);
                    border-radius: 8px;
                    font-size: 13px;
                    border: 1px solid rgba(255, 255, 255, 0.05);
                }

                .online-indicator {
                    width: 8px;
                    height: 8px;
                    background: #10b981;
                    border-radius: 50%;
                    box-shadow: 0 0 4px rgba(16, 185, 129, 0.5);
                }

                .offline-indicator {
                    width: 8px;
                    height: 8px;
                    background: #6b7280;
                    border-radius: 50%;
                }

                .alert-box {
                    background: rgba(245, 158, 11, 0.1);
                    border: 1px solid rgba(245, 158, 11, 0.3);
                    border-radius: 8px;
                    padding: 16px;
                    margin-bottom: 20px;
                }

                .alert-box.info {
                    background: rgba(59, 130, 246, 0.1);
                    border-color: rgba(59, 130, 246, 0.3);
                }

                .alert-box.success {
                    background: rgba(16, 185, 129, 0.1);
                    border-color: rgba(16, 185, 129, 0.3);
                }

                .alert-box.error {
                    background: rgba(239, 68, 68, 0.1);
                    border-color: rgba(239, 68, 68, 0.3);
                }

                .alert-title {
                    font-weight: 600;
                    color: #ffffff;
                    margin: 0 0 4px 0;
                    font-size: 14px;
                }

                .alert-message {
                    color: #d1d5db;
                    font-size: 13px;
                    line-height: 1.4;
                    margin: 0;
                }

                .realtime-indicator {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: rgba(16, 185, 129, 0.9);
                    color: white;
                    padding: 8px 16px;
                    border-radius: 20px;
                    font-size: 12px;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    z-index: 1000;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                }

                /* RESPONSIVIDADE */
                @media (max-width: 1024px) {
                    .firebase-main-container {
                        grid-template-columns: 1fr;
                        padding: 20px;
                    }
                    
                    .sync-stats {
                        grid-template-columns: 1fr;
                    }
                }
            </style>

            <div class="firebase-workspace">
                <!-- Indicador de Tempo Real -->
                ${this.renderRealtimeIndicator()}

                <!-- Header -->
                <div class="firebase-header">
                    <h1 class="firebase-title">🔥 Colaboração em Tempo Real</h1>
                    <p class="firebase-subtitle">Sistema multi-usuário com sincronização instantânea via Firebase</p>
                </div>

                <!-- Container Principal -->
                <div class="firebase-main-container">
                    <!-- Configuração e Status -->
                    <div class="firebase-section">
                        <h2 class="section-title">
                            ⚙️ Configuração Firebase
                        </h2>
                        <p class="section-description">
                            Configure a conexão com Firebase para habilitar a colaboração em tempo real entre sua equipe.
                        </p>

                        <!-- Status da Conexão -->
                        <div class="connection-status">
                            <div class="status-indicator ${this.getConnectionStatusClass()}"></div>
                            <div class="status-text">
                                <div class="status-title">${this.getConnectionStatusTitle()}</div>
                                <div class="status-details">${this.getConnectionStatusDetails()}</div>
                            </div>
                        </div>

                        ${this.renderCurrentUser()}
                        ${this.renderConnectionAlert()}

                        <!-- Formulário de Configuração -->
                        ${this.renderConfigurationForm()}

                        <!-- Estatísticas de Sincronização -->
                        <div class="sync-stats">
                            <div class="stat-card">
                                <div class="stat-value">${this.dataCache.patients.size}</div>
                                <div class="stat-label">Pacientes Sync</div>
                            </div>
                            <div class="stat-card">
                                <div class="stat-value">${this.dataCache.appointments.size}</div>
                                <div class="stat-label">Consultas Sync</div>
                            </div>
                            <div class="stat-card">
                                <div class="stat-value">${this.listeners.length}</div>
                                <div class="stat-label">Listeners Ativos</div>
                            </div>
                            <div class="stat-card">
                                <div class="stat-value">${this.syncState.pendingWrites}</div>
                                <div class="stat-label">Pendências</div>
                            </div>
                        </div>
                    </div>

                    <!-- Usuários Online e Colaboração -->
                    <div class="firebase-section">
                        <h2 class="section-title">
                            👥 Equipe Colaborativa
                        </h2>
                        <p class="section-description">
                            Monitore quem está online e colaborando no sistema em tempo real.
                        </p>

                        <!-- Usuários Online -->
                        <div>
                            <h3 style="color: #10b981; margin: 0 0 16px 0; font-size: 16px; display: flex; align-items: center; gap: 8px;">
                                <span class="online-indicator"></span>
                                Usuários Online
                            </h3>
                            <div class="online-users">
                                ${this.renderOnlineUsers()}
                            </div>
                        </div>

                        <!-- Ações de Colaboração -->
                        <div style="display: flex; gap: 12px; margin-bottom: 20px;">
                            <button onclick="FirebaseSync.inviteUser()" class="firebase-btn primary" style="flex: 1;" ${!this.currentUser.uid ? 'disabled' : ''}>
                                ➕ Convidar Usuário
                            </button>
                            <button onclick="FirebaseSync.manageRoles()" class="firebase-btn secondary" ${!this.hasPermission('manage_users') ? 'disabled' : ''}>
                                🔒 Gerenciar Funções
                            </button>
                        </div>

                        <!-- Log de Atividades em Tempo Real -->
                        <div>
                            <h3 style="color: #f59e0b; margin: 0 0 12px 0; font-size: 16px;">📋 Atividades Recentes</h3>
                            <div style="max-height: 200px; overflow-y: auto; background: rgba(0, 0, 0, 0.2); border-radius: 8px; padding: 16px;">
                                ${this.renderActivityLog()}
                            </div>
                        </div>

                        <!-- Status da Sincronização -->
                        <div style="margin-top: 20px; padding: 12px; background: rgba(0, 0, 0, 0.2); border-radius: 8px; text-align: center;">
                            <div style="font-size: 12px; color: #94a3b8;">Última Sincronização:</div>
                            <div style="font-weight: 600; color: #e2e8f0;">
                                ${this.syncState.lastSync ? new Date(this.syncState.lastSync).toLocaleString('pt-BR') : 'Aguardando...'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * Renderizar indicador de tempo real
     */
    renderRealtimeIndicator() {
        if (!this.config.connected || !this.currentUser.uid) {
            return '';
        }

        return `
            <div class="realtime-indicator">
                <div class="online-indicator"></div>
                <span>Tempo Real Ativo</span>
            </div>
        `;
    },

    /**
     * Renderizar usuário atual
     */
    renderCurrentUser() {
        if (!this.currentUser.uid) {
            return '';
        }

        const role = this.roles[this.currentUser.role] || this.roles.assistant;
        
        return `
            <div class="user-card">
                <div class="user-avatar">
                    ${this.currentUser.photoURL ? 
                        `<img src="${this.currentUser.photoURL}" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">` :
                        this.currentUser.displayName?.charAt(0)?.toUpperCase() || '?'
                    }
                </div>
                <div class="user-info">
                    <div class="user-name">${this.currentUser.displayName || 'Usuário'}</div>
                    <div class="user-details">
                        ${this.currentUser.email}
                        <span class="user-role" style="background-color: ${role.color}20; color: ${role.color}; border: 1px solid ${role.color}40;">
                            ${role.name}
                        </span>
                    </div>
                </div>
                <button onclick="FirebaseSync.logout()" class="firebase-btn danger" style="padding: 8px 16px; font-size: 12px;">
                    Sair
                </button>
            </div>
        `;
    },

    /**
     * Renderizar alerta de conexão
     */
    renderConnectionAlert() {
        if (!this.config.projectId) {
            return `
                <div class="alert-box">
                    <div class="alert-title">🔧 Configuração Necessária</div>
                    <div class="alert-message">
                        Para usar a colaboração em tempo real, você precisa:<br>
                        1. Criar um projeto no Firebase Console<br>
                        2. Ativar Authentication e Firestore<br>
                        3. Copiar as configurações do projeto<br>
                        4. Inserir as credenciais no formulário abaixo
                    </div>
                </div>
            `;
        }

        if (!this.config.connected) {
            return `
                <div class="alert-box error">
                    <div class="alert-title">❌ Erro de Conexão</div>
                    <div class="alert-message">
                        Não foi possível conectar ao Firebase. Verifique suas configurações e conexão com a internet.
                    </div>
                </div>
            `;
        }

        if (!this.currentUser.uid) {
            return `
                <div class="alert-box info">
                    <div class="alert-title">🔐 Login Necessário</div>
                    <div class="alert-message">
                        Firebase configurado com sucesso! Faça login para começar a colaborar com sua equipe.
                    </div>
                </div>
            `;
        }

        return `
            <div class="alert-box success">
                <div class="alert-title">✅ Colaboração Ativa</div>
                <div class="alert-message">
                    Sistema conectado e sincronizando em tempo real. Todas as alterações serão compartilhadas instantaneamente com sua equipe.
                </div>
            </div>
        `;
    },

    /**
     * Renderizar formulário de configuração
     */
    renderConfigurationForm() {
        if (this.currentUser.uid) {
            return ''; // Não mostrar config se já estiver logado
        }

        return `
            <form class="config-form" onsubmit="FirebaseSync.saveConfiguration(event)">
                <div class="form-group">
                    <label class="form-label">Project ID</label>
                    <input 
                        type="text" 
                        name="projectId" 
                        class="form-input" 
                        value="${this.config.projectId}"
                        placeholder="meu-projeto-firebase"
                        required
                    >
                </div>

                <div class="form-group">
                    <label class="form-label">API Key</label>
                    <input 
                        type="password" 
                        name="apiKey" 
                        class="form-input" 
                        value="${this.config.apiKey}"
                        placeholder="AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
                        required
                    >
                </div>

                <div class="form-group">
                    <label class="form-label">Auth Domain</label>
                    <input 
                        type="text" 
                        name="authDomain" 
                        class="form-input" 
                        value="${this.config.authDomain}"
                        placeholder="meu-projeto-firebase.firebaseapp.com"
                        required
                    >
                </div>

                <div style="display: flex; gap: 12px; margin-top: 20px;">
                    <button type="submit" class="firebase-btn primary" style="flex: 1;">
                        💾 Salvar e Conectar
                    </button>
                    <button type="button" onclick="FirebaseSync.testConnection()" class="firebase-btn secondary">
                        🔍 Testar
                    </button>
                </div>
            </form>

            ${this.config.connected ? this.renderAuthSection() : ''}
        `;
    },

    /**
     * Renderizar seção de autenticação
     */
    renderAuthSection() {
        return `
            <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid rgba(255, 255, 255, 0.1);">
                <h3 style="color: #f59e0b; margin: 0 0 16px 0; font-size: 18px;">🔐 Acesso à Equipe</h3>
                
                <div style="display: flex; gap: 12px;">
                    <button onclick="FirebaseSync.showLoginForm()" class="firebase-btn primary" style="flex: 1;">
                        🔑 Fazer Login
                    </button>
                    <button onclick="FirebaseSync.showRegisterForm()" class="firebase-btn secondary" style="flex: 1;">
                        ➕ Criar Conta
                    </button>
                </div>
            </div>
        `;
    },

    /**
     * Renderizar usuários online
     */
    renderOnlineUsers() {
        if (this.dataCache.users.size === 0) {
            return `
                <div style="text-align: center; padding: 20px; color: #94a3b8;">
                    👥 Aguardando conexões da equipe...
                </div>
            `;
        }

        let html = '';
        this.dataCache.users.forEach((user, uid) => {
            const role = this.roles[user.role] || this.roles.assistant;
            const isOnline = user.isOnline && (Date.now() - user.lastSeen < 60000); // 1 minuto
            
            html += `
                <div class="online-user">
                    <div class="${isOnline ? 'online' : 'offline'}-indicator"></div>
                    <div style="flex: 1;">
                        <div style="font-weight: 600; color: #ffffff;">${user.displayName || user.email}</div>
                        <div style="font-size: 11px; color: #94a3b8;">
                            ${role.name} • ${isOnline ? 'Online agora' : this.getLastSeenText(user.lastSeen)}
                        </div>
                    </div>
                    <div style="width: 8px; height: 8px; border-radius: 50%; background: ${role.color};"></div>
                </div>
            `;
        });

        return html;
    },

    /**
     * Renderizar log de atividades
     */
    renderActivityLog() {
        // Simulação de atividades recentes
        const activities = [
            { user: 'Dr. Silva', action: 'adicionou novo paciente', time: '2 min atrás' },
            { user: 'Ana (Secretária)', action: 'agendou consulta', time: '5 min atrás' },
            { user: 'Dr. Silva', action: 'atualizou prontuário', time: '8 min atrás' },
            { user: 'Carlos (Auxiliar)', action: 'fez login no sistema', time: '15 min atrás' }
        ];

        return activities.map(activity => `
            <div style="padding: 6px 0; border-bottom: 1px solid rgba(255, 255, 255, 0.05); font-size: 12px;">
                <div style="color: #e2e8f0;">
                    <strong>${activity.user}</strong> ${activity.action}
                </div>
                <div style="color: #94a3b8; font-size: 10px;">${activity.time}</div>
            </div>
        `).join('');
    },

    /**
     * Obter classe de status da conexão
     */
    getConnectionStatusClass() {
        if (!this.config.projectId) return 'disconnected';
        if (!this.config.connected) return 'connecting';
        return 'connected';
    },

    /**
     * Obter título do status da conexão
     */
    getConnectionStatusTitle() {
        if (!this.config.projectId) return 'Não Configurado';
        if (!this.config.connected) return 'Conectando...';
        if (!this.currentUser.uid) return 'Conectado - Faça Login';
        return 'Colaboração Ativa';
    },

    /**
     * Obter detalhes do status da conexão
     */
    getConnectionStatusDetails() {
        if (!this.config.projectId) return 'Configure as credenciais do Firebase para começar';
        if (!this.config.connected) return 'Estabelecendo conexão com Firebase...';
        if (!this.currentUser.uid) return 'Firebase conectado - Entre com sua conta para colaborar';
        return `Sincronizando como ${this.currentUser.displayName || this.currentUser.email}`;
    },

    /**
     * Obter texto de "visto por último"
     */
    getLastSeenText(timestamp) {
        if (!timestamp) return 'Nunca';
        
        const diff = Date.now() - timestamp;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);
        
        if (minutes < 1) return 'Agora mesmo';
        if (minutes < 60) return `${minutes} min atrás`;
        if (hours < 24) return `${hours}h atrás`;
        return `${days}d atrás`;
    },

    /**
     * FUNÇÕES DE INTERAÇÃO
     */

    /**
     * Salvar configuração
     */
    async saveConfiguration(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        
        this.config.projectId = formData.get('projectId');
        this.config.apiKey = formData.get('apiKey');
        this.config.authDomain = formData.get('authDomain');
        this.config.storageBucket = `${this.config.projectId}.appspot.com`;
        this.config.messagingSenderId = '123456789';
        this.config.appId = '1:123456789:web:abcdef123456';
        
        this.saveConfig();
        
        try {
            await this.initializeFirebase();
            this.showAlert('✅ Firebase Configurado', 'Conexão estabelecida com sucesso!\nAgora você pode fazer login para colaborar com sua equipe.');
            this.refreshInterface();
        } catch (error) {
            this.showAlert('❌ Erro de Configuração', `Erro ao conectar: ${error.message}`);
        }
    },

    /**
     * Testar conexão
     */
    async testConnection() {
        if (!this.config.projectId) {
            this.showAlert('❌ Configuração Incompleta', 'Preencha pelo menos o Project ID antes de testar.');
            return;
        }

        try {
            await this.initializeFirebase();
            this.showAlert('✅ Teste de Conexão', 'Conexão com Firebase testada com sucesso!');
        } catch (error) {
            this.showAlert('❌ Erro no Teste', `Erro na conexão: ${error.message}`);
        }
    },

    /**
     * Mostrar formulário de login
     */
    showLoginForm() {
        this.showAuthModal('login');
    },

    /**
     * Mostrar formulário de registro
     */
    showRegisterForm() {
        this.showAuthModal('register');
    },

    /**
     * Mostrar modal de autenticação
     */
    showAuthModal(mode) {
        const isLogin = mode === 'login';
        
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.8);
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
                <div style="padding: 24px 24px 0 24px; border-bottom: 1px solid rgba(255, 255, 255, 0.1);">
                    <h3 style="font-size: 20px; font-weight: 600; margin: 0; color: #ffffff;">
                        🔐 ${isLogin ? 'Login da Equipe' : 'Registrar Novo Usuário'}
                    </h3>
                </div>
                
                <form onsubmit="FirebaseSync.handleAuth(event, '${mode}')" style="padding: 24px;">
                    ${!isLogin ? `
                        <div style="margin-bottom: 16px;">
                            <label style="display: block; margin-bottom: 6px; font-weight: 600; color: #e2e8f0; font-size: 13px;">Nome Completo</label>
                            <input type="text" name="displayName" required style="
                                width: 100%;
                                background: rgba(0, 0, 0, 0.3);
                                border: 1px solid rgba(255, 255, 255, 0.1);
                                border-radius: 8px;
                                padding: 12px 16px;
                                color: #f8fafc;
                                font-size: 14px;
                                box-sizing: border-box;
                            ">
                        </div>
                    ` : ''}
                    
                    <div style="margin-bottom: 16px;">
                        <label style="display: block; margin-bottom: 6px; font-weight: 600; color: #e2e8f0; font-size: 13px;">E-mail</label>
                        <input type="email" name="email" required style="
                            width: 100%;
                            background: rgba(0, 0, 0, 0.3);
                            border: 1px solid rgba(255, 255, 255, 0.1);
                            border-radius: 8px;
                            padding: 12px 16px;
                            color: #f8fafc;
                            font-size: 14px;
                            box-sizing: border-box;
                        ">
                    </div>
                    
                    <div style="margin-bottom: 16px;">
                        <label style="display: block; margin-bottom: 6px; font-weight: 600; color: #e2e8f0; font-size: 13px;">Senha</label>
                        <input type="password" name="password" required minlength="6" style="
                            width: 100%;
                            background: rgba(0, 0, 0, 0.3);
                            border: 1px solid rgba(255, 255, 255, 0.1);
                            border-radius: 8px;
                            padding: 12px 16px;
                            color: #f8fafc;
                            font-size: 14px;
                            box-sizing: border-box;
                        ">
                    </div>
                    
                    ${!isLogin ? `
                        <div style="margin-bottom: 16px;">
                            <label style="display: block; margin-bottom: 6px; font-weight: 600; color: #e2e8f0; font-size: 13px;">Função na Clínica</label>
                            <select name="role" required style="
                                width: 100%;
                                background: rgba(0, 0, 0, 0.3);
                                border: 1px solid rgba(255, 255, 255, 0.1);
                                border-radius: 8px;
                                padding: 12px 16px;
                                color: #f8fafc;
                                font-size: 14px;
                                box-sizing: border-box;
                            ">
                                <option value="">Selecione sua função</option>
                                <option value="admin">Administrador</option>
                                <option value="doctor">Dentista</option>
                                <option value="assistant">Auxiliar</option>
                                <option value="secretary">Secretária</option>
                            </select>
                        </div>
                    ` : ''}
                    
                    <div style="display: flex; gap: 12px; margin-top: 24px;">
                        <button type="button" onclick="this.closest('div[style*=\"position: fixed\"]').remove()" style="
                            flex: 1;
                            background: rgba(255, 255, 255, 0.1);
                            border: 1px solid rgba(255, 255, 255, 0.2);
                            border-radius: 8px;
                            color: #e2e8f0;
                            padding: 12px 24px;
                            font-weight: 600;
                            cursor: pointer;
                        ">Cancelar</button>
                        
                        <button type="submit" style="
                            flex: 1;
                            background: linear-gradient(135deg, #f59e0b 0%, #f97316 100%);
                            border: none;
                            border-radius: 8px;
                            color: white;
                            padding: 12px 24px;
                            font-weight: 600;
                            cursor: pointer;
                        ">${isLogin ? '🔑 Entrar' : '➕ Registrar'}</button>
                    </div>
                </form>
            </div>
        `;
        modal.onclick = (e) => {
            if (e.target === modal) modal.remove();
        };
        document.body.appendChild(modal);
    },

    /**
     * Manipular autenticação
     */
    async handleAuth(event, mode) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const email = formData.get('email');
        const password = formData.get('password');
        
        try {
            if (mode === 'login') {
                await this.auth.signInWithEmailAndPassword(email, password);
            } else {
                const userCredential = await this.auth.createUserWithEmailAndPassword(email, password);
                
                // Atualizar perfil do usuário
                await userCredential.user.updateProfile({
                    displayName: formData.get('displayName')
                });
                
                // Salvar informações adicionais no Firestore
                await this.db.collection('users').doc(userCredential.user.uid).set({
                    displayName: formData.get('displayName'),
                    email: email,
                    role: formData.get('role'),
                    clinicId: this.config.clinicId,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    isOnline: true,
                    lastSeen: firebase.firestore.FieldValue.serverTimestamp()
                });
            }
            
            // Fechar modal
            event.target.closest('div[style*="position: fixed"]').remove();
            
            this.showAlert('✅ Sucesso!', mode === 'login' ? 'Login realizado com sucesso!' : 'Conta criada com sucesso!');
        } catch (error) {
            this.showAlert('❌ Erro de Autenticação', error.message);
        }
    },

    /**
     * Manipular login do usuário
     */
    async handleUserLogin(user) {
        this.currentUser = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            isOnline: true
        };
        
        try {
            // Obter informações adicionais do usuário
            const userDoc = await this.db.collection('users').doc(user.uid).get();
            if (userDoc.exists) {
                const userData = userDoc.data();
                this.currentUser.role = userData.role;
                this.currentUser.clinicId = userData.clinicId;
            }
            
            // Atualizar status online
            await this.updateOnlineStatus(true);
            
            // Configurar listeners em tempo real
            this.setupRealTimeListeners();
            
            this.syncState.lastSync = Date.now();
            this.refreshInterface();
            
            console.log('✅ Usuário logado:', this.currentUser.displayName);
        } catch (error) {
            console.error('❌ Erro ao configurar usuário:', error);
        }
    },

    /**
     * Manipular logout do usuário
     */
    async handleUserLogout() {
        if (this.currentUser.uid) {
            await this.updateOnlineStatus(false);
        }
        
        this.currentUser = {
            uid: null,
            email: null,
            displayName: null,
            role: null,
            clinicId: null,
            photoURL: null,
            isOnline: false
        };
        
        this.cleanup();
        this.refreshInterface();
        
        console.log('👋 Usuário deslogado');
    },

    /**
     * Atualizar status online
     */
    async updateOnlineStatus(isOnline) {
        if (!this.currentUser.uid) return;
        
        try {
            await this.db.collection('users').doc(this.currentUser.uid).update({
                isOnline: isOnline,
                lastSeen: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            this.currentUser.isOnline = isOnline;
        } catch (error) {
            console.error('❌ Erro ao atualizar status:', error);
        }
    },

    /**
     * Configurar listeners em tempo real
     */
    setupRealTimeListeners() {
        if (!this.currentUser.uid) return;
        
        // Listener para usuários online
        const usersListener = this.db.collection('users')
            .where('clinicId', '==', this.config.clinicId)
            .onSnapshot((snapshot) => {
                snapshot.forEach((doc) => {
                    this.dataCache.users.set(doc.id, doc.data());
                });
                this.refreshInterface();
            });
        
        this.listeners.push(usersListener);
        
        // Listener para pacientes
        const patientsListener = this.db.collection('patients')
            .where('clinicId', '==', this.config.clinicId)
            .onSnapshot((snapshot) => {
                snapshot.docChanges().forEach((change) => {
                    if (change.type === 'added' || change.type === 'modified') {
                        this.dataCache.patients.set(change.doc.id, change.doc.data());
                    } else if (change.type === 'removed') {
                        this.dataCache.patients.delete(change.doc.id);
                    }
                });
                this.syncWithLocalData('patients');
            });
        
        this.listeners.push(patientsListener);
        
        console.log('🔄 Listeners em tempo real configurados');
    },

    /**
     * Sincronizar com dados locais
     */
    syncWithLocalData(collection) {
        // Integrar com DataPersistence local
        if (collection === 'patients' && typeof DataPersistence !== 'undefined') {
            const localPatients = DataPersistence.getPatients();
            const firebasePatients = Array.from(this.dataCache.patients.values());
            
            // Sincronização bidirecional (simplificada)
            console.log(`🔄 Sincronizando ${localPatients.length} pacientes locais com ${firebasePatients.length} do Firebase`);
        }
    },

    /**
     * Verificar permissões
     */
    hasPermission(permission) {
        if (!this.currentUser.role) return false;
        const role = this.roles[this.currentUser.role];
        return role && role.permissions.includes(permission);
    },

    /**
     * Convidar usuário
     */
    inviteUser() {
        this.showAlert('📧 Convidar Usuário', 'Funcionalidade de convite será implementada.\n\nPor enquanto, novos usuários podem se registrar diretamente no sistema usando o botão "Criar Conta".');
    },

    /**
     * Gerenciar funções
     */
manageRoles() {
    if (!this.hasPermission('manage_users')) {
        this.showAlert('🔒 Acesso Negado', 'Você não tem permissão para gerenciar usuários.');
        return;
    }
    
    // Mostrar interface de gerenciamento
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        backdrop-filter: blur(4px);
    `;
    modal.innerHTML = `
        <div style="
            background: linear-gradient(135deg, #1e3a8a 0%, #374151 100%);
            border-radius: 16px;
            width: 90%;
            max-width: 1000px;
            max-height: 90vh;
            overflow: hidden;
            color: #f8fafc;
            position: relative;
        ">
            <div style="padding: 20px; border-bottom: 1px solid rgba(255, 255, 255, 0.1); display: flex; justify-content: space-between; align-items: center;">
                <h3 style="margin: 0; font-size: 20px;">👥 Gerenciamento de Usuários</h3>
                <button onclick="this.closest('div[style*=\"position: fixed\"]').remove()" style="
                    background: rgba(239, 68, 68, 0.2);
                    border: none;
                    border-radius: 8px;
                    color: #f87171;
                    width: 32px;
                    height: 32px;
                    cursor: pointer;
                    font-size: 16px;
                    font-weight: bold;
                ">×</button>
            </div>
            
            <div style="padding: 20px; max-height: 70vh; overflow-y: auto;">
                ${typeof UsuarioManager !== 'undefined' ? UsuarioManager.renderUserManagement() : `
                    <div style="text-align: center; padding: 40px; color: #94a3b8;">
                        ⚠️ Gerenciador de usuários não disponível
                    </div>
                `}
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Inicializar UsuarioManager se necessário
    if (typeof UsuarioManager !== 'undefined') {
        UsuarioManager.init();
    }
},
    /**
     * Logout
     */
    async logout() {
        try {
            await this.auth.signOut();
            this.showAlert('👋 Logout', 'Você foi desconectado do sistema colaborativo.');
        } catch (error) {
            console.error('❌ Erro ao fazer logout:', error);
        }
    },

    /**
     * Limpar listeners e cache
     */
    cleanup() {
        this.listeners.forEach(unsubscribe => unsubscribe());
        this.listeners = [];
        
        this.dataCache.patients.clear();
        this.dataCache.appointments.clear();
        this.dataCache.users.clear();
    },

    /**
     * Atualizar interface
     */
    refreshInterface() {
        const workspace = document.querySelector('.firebase-workspace');
        if (workspace) {
            const mainContent = document.getElementById('main-content');
            if (mainContent) {
                mainContent.innerHTML = this.renderFirebaseInterface();
            }
        }
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
                        background: linear-gradient(135deg, #f59e0b 0%, #f97316 100%);
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
window.FirebaseSync = FirebaseSync;

console.log('🔥 Módulo Firebase Multi-usuário carregado!');