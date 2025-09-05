// ============================================================================
// DENTALCORE PRO - MÓDULO DE SINCRONIZAÇÃO GOOGLE CALENDAR
// Integração completa com Google Calendar API v3
// Sincronização bidirecional de eventos e consultas
// ============================================================================

const GoogleCalendarSync = {
    // Configurações da API
    config: {
        clientId: '', // Configurado pelo usuário
        apiKey: '', // Configurado pelo usuário
        scope: 'https://www.googleapis.com/auth/calendar',
        discoveryUrl: 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'
    },

    // Estado da sincronização
    syncState: {
        isConnected: false,
        isAuthorized: false,
        lastSync: null,
        calendarId: 'primary',
        syncDirection: 'bidirectional', // bidirectional, to_google, from_google
        autoSync: true,
        syncInterval: 300000, // 5 minutos
        conflictResolution: 'manual' // manual, google_wins, local_wins
    },

    // Cache de eventos
    eventsCache: {
        googleEvents: [],
        localEvents: [],
        syncMap: {}, // Mapeia IDs locais para IDs do Google
        conflicts: []
    },

    // Timer de sincronização automática
    syncTimer: null,

    /**
     * Inicialização do módulo
     */
    init() {
        console.log('📅 Módulo Google Calendar Sync inicializado');
        this.loadSyncConfig();
        this.loadGoogleAPI();
    },

    /**
     * Carregar configurações de sincronização
     */
    loadSyncConfig() {
        const saved = localStorage.getItem('google_calendar_config');
        if (saved) {
            const config = JSON.parse(saved);
            this.config = { ...this.config, ...config };
            this.syncState = { ...this.syncState, ...config.syncState };
        }
    },

    /**
     * Salvar configurações
     */
    saveSyncConfig() {
        const configToSave = {
            ...this.config,
            syncState: this.syncState
        };
        localStorage.setItem('google_calendar_config', JSON.stringify(configToSave));
    },

    /**
     * Carregar Google API
     */
    loadGoogleAPI() {
        if (window.gapi) {
            this.initializeGoogleAPI();
            return;
        }

        // Carregar Google API Script
        const script = document.createElement('script');
        script.src = 'https://apis.google.com/js/api.js';
        script.onload = () => {
            this.initializeGoogleAPI();
        };
        script.onerror = () => {
            console.error('❌ Erro ao carregar Google API');
            this.showAlert('❌ Erro de Conexão', 'Não foi possível carregar a API do Google Calendar.\nVerifique sua conexão com a internet.');
        };
        document.head.appendChild(script);
    },

    /**
     * Inicializar Google API
     */
    async initializeGoogleAPI() {
        try {
            await new Promise((resolve, reject) => {
                window.gapi.load('client:auth2', {
                    callback: resolve,
                    onerror: reject
                });
            });

            if (this.config.clientId && this.config.apiKey) {
                await this.setupGoogleClient();
            }
        } catch (error) {
            console.error('❌ Erro ao inicializar Google API:', error);
        }
    },

    /**
     * Configurar cliente Google
     */
    async setupGoogleClient() {
        try {
            await window.gapi.client.init({
                apiKey: this.config.apiKey,
                clientId: this.config.clientId,
                discoveryDocs: [this.config.discoveryUrl],
                scope: this.config.scope
            });

            // Verificar se já está autorizado
            const authInstance = window.gapi.auth2.getAuthInstance();
            this.syncState.isAuthorized = authInstance.isSignedIn.get();
            this.syncState.isConnected = true;

            if (this.syncState.isAuthorized && this.syncState.autoSync) {
                this.startAutoSync();
            }

            console.log('✅ Google Calendar API inicializada');
        } catch (error) {
            console.error('❌ Erro ao configurar cliente Google:', error);
            this.showAlert('❌ Erro de Configuração', 'Erro ao configurar a conexão com Google Calendar.\nVerifique suas credenciais.');
        }
    },

    /**
     * Interface principal de sincronização
     */
    renderSyncInterface() {
        return `
            <style>
                /* CSS INLINE PARA GOOGLE CALENDAR SYNC */
                .gcal-workspace {
                    background: linear-gradient(135deg, #1e3a8a 0%, #374151 100%);
                    min-height: 100vh;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', sans-serif;
                    color: #f8fafc;
                    padding: 0;
                    margin: 0;
                }

                .gcal-header {
                    background: rgba(255, 255, 255, 0.05);
                    backdrop-filter: blur(20px);
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                    padding: 24px 40px;
                    position: sticky;
                    top: 0;
                    z-index: 100;
                }

                .gcal-title {
                    font-size: 28px;
                    font-weight: 300;
                    color: #ffffff;
                    margin: 0;
                    letter-spacing: -0.025em;
                    text-align: center;
                }

                .gcal-subtitle {
                    font-size: 14px;
                    color: #94a3b8;
                    margin: 4px 0 0 0;
                    font-weight: 400;
                    text-align: center;
                }

                .gcal-main-container {
                    padding: 40px;
                    max-width: 1200px;
                    margin: 0 auto;
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 32px;
                }

                .gcal-section {
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

                .status-indicator.pending {
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

                .gcal-btn {
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

                .gcal-btn.primary {
                    background: linear-gradient(135deg, #0d9488 0%, #14b8a6 100%);
                    color: white;
                }

                .gcal-btn.google {
                    background: linear-gradient(135deg, #4285f4 0%, #34a853 100%);
                    color: white;
                }

                .gcal-btn.secondary {
                    background: rgba(255, 255, 255, 0.1);
                    color: #e2e8f0;
                    border: 1px solid rgba(255, 255, 255, 0.2);
                }

                .gcal-btn.danger {
                    background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%);
                    color: white;
                }

                .gcal-btn:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                }

                .gcal-btn:disabled {
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
                    color: #14b8a6;
                    margin: 0 0 4px 0;
                }

                .stat-label {
                    font-size: 11px;
                    color: #94a3b8;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }

                .sync-log {
                    max-height: 300px;
                    overflow-y: auto;
                    background: rgba(0, 0, 0, 0.2);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 8px;
                    padding: 16px;
                }

                .log-entry {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 8px 0;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
                    font-size: 13px;
                }

                .log-entry:last-child {
                    border-bottom: none;
                }

                .log-message {
                    color: #e2e8f0;
                }

                .log-time {
                    color: #94a3b8;
                    font-size: 11px;
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

                /* RESPONSIVIDADE */
                @media (max-width: 1024px) {
                    .gcal-main-container {
                        grid-template-columns: 1fr;
                        padding: 20px;
                    }
                    
                    .sync-stats {
                        grid-template-columns: 1fr;
                    }
                }
            </style>

            <div class="gcal-workspace">
                <!-- Header -->
                <div class="gcal-header">
                    <h1 class="gcal-title">📅 Sincronização Google Calendar</h1>
                    <p class="gcal-subtitle">Integração completa entre DentalCore Pro e Google Calendar</p>
                </div>

                <!-- Container Principal -->
                <div class="gcal-main-container">
                    <!-- Configuração de Conexão -->
                    <div class="gcal-section">
                        <h2 class="section-title">
                            🔗 Configuração de Conexão
                        </h2>
                        <p class="section-description">
                            Configure a conexão com sua conta do Google Calendar para sincronização automática de eventos.
                        </p>

                        <!-- Status da Conexão -->
                        <div class="connection-status">
                            <div class="status-indicator ${this.getConnectionStatusClass()}"></div>
                            <div class="status-text">
                                <div class="status-title">${this.getConnectionStatusTitle()}</div>
                                <div class="status-details">${this.getConnectionStatusDetails()}</div>
                            </div>
                        </div>

                        ${this.renderConnectionAlert()}

                        <!-- Formulário de Configuração -->
                        <form class="config-form" onsubmit="GoogleCalendarSync.saveConfiguration(event)">
                            <div class="form-group">
                                <label class="form-label">Client ID do Google</label>
                                <input 
                                    type="text" 
                                    name="clientId" 
                                    class="form-input" 
                                    value="${this.config.clientId}"
                                    placeholder="000000000000-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com"
                                    required
                                >
                            </div>

                            <div class="form-group">
                                <label class="form-label">API Key do Google</label>
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
                                <label class="form-label">Calendário de Destino</label>
                                <select name="calendarId" class="form-select">
                                    <option value="primary" ${this.syncState.calendarId === 'primary' ? 'selected' : ''}>Calendário Principal</option>
                                </select>
                            </div>

                            <div class="form-group">
                                <label class="form-label">Direção da Sincronização</label>
                                <select name="syncDirection" class="form-select">
                                    <option value="bidirectional" ${this.syncState.syncDirection === 'bidirectional' ? 'selected' : ''}>Bidirecional (Recomendado)</option>
                                    <option value="to_google" ${this.syncState.syncDirection === 'to_google' ? 'selected' : ''}>Apenas para Google</option>
                                    <option value="from_google" ${this.syncState.syncDirection === 'from_google' ? 'selected' : ''}>Apenas do Google</option>
                                </select>
                            </div>

                            <div class="form-checkbox-group">
                                <input type="checkbox" name="autoSync" class="form-checkbox" ${this.syncState.autoSync ? 'checked' : ''}>
                                <label class="checkbox-label">Sincronização Automática (a cada 5 minutos)</label>
                            </div>

                            <div style="display: flex; gap: 12px; margin-top: 20px;">
                                <button type="submit" class="gcal-btn primary" style="flex: 1;">
                                    💾 Salvar Configuração
                                </button>
                                <button type="button" onclick="GoogleCalendarSync.testConnection()" class="gcal-btn secondary">
                                    🔍 Testar
                                </button>
                            </div>
                        </form>

                        ${this.renderConnectionActions()}
                    </div>

                    <!-- Status de Sincronização -->
                    <div class="gcal-section">
                        <h2 class="section-title">
                            📊 Status de Sincronização
                        </h2>
                        <p class="section-description">
                            Monitore o status da sincronização e gerencie conflitos entre eventos.
                        </p>

                        <!-- Estatísticas -->
                        <div class="sync-stats">
                            <div class="stat-card">
                                <div class="stat-value">${this.eventsCache.localEvents.length}</div>
                                <div class="stat-label">Eventos Locais</div>
                            </div>
                            <div class="stat-card">
                                <div class="stat-value">${this.eventsCache.googleEvents.length}</div>
                                <div class="stat-label">Eventos Google</div>
                            </div>
                            <div class="stat-card">
                                <div class="stat-value">${Object.keys(this.eventsCache.syncMap).length}</div>
                                <div class="stat-label">Sincronizados</div>
                            </div>
                            <div class="stat-card">
                                <div class="stat-value">${this.eventsCache.conflicts.length}</div>
                                <div class="stat-label">Conflitos</div>
                            </div>
                        </div>

                        <!-- Ações de Sincronização -->
                        <div style="display: flex; gap: 12px; margin-bottom: 20px;">
                            <button onclick="GoogleCalendarSync.performManualSync()" class="gcal-btn google" style="flex: 1;" ${!this.syncState.isAuthorized ? 'disabled' : ''}>
                                🔄 Sincronizar Agora
                            </button>
                            <button onclick="GoogleCalendarSync.resolveConflicts()" class="gcal-btn secondary" ${this.eventsCache.conflicts.length === 0 ? 'disabled' : ''}>
                                ⚠️ Resolver Conflitos
                            </button>
                        </div>

                        <!-- Log de Sincronização -->
                        <div>
                            <h3 style="color: #14b8a6; margin: 0 0 12px 0; font-size: 16px;">📋 Log de Atividades</h3>
                            <div class="sync-log">
                                ${this.renderSyncLog()}
                            </div>
                        </div>

                        <!-- Última Sincronização -->
                        <div style="margin-top: 20px; padding: 12px; background: rgba(0, 0, 0, 0.2); border-radius: 8px; text-align: center;">
                            <div style="font-size: 12px; color: #94a3b8;">Última Sincronização:</div>
                            <div style="font-weight: 600; color: #e2e8f0;">
                                ${this.syncState.lastSync ? new Date(this.syncState.lastSync).toLocaleString('pt-BR') : 'Nunca'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * Renderizar alerta de conexão
     */
    renderConnectionAlert() {
        if (!this.config.clientId || !this.config.apiKey) {
            return `
                <div class="alert-box">
                    <div class="alert-title">🔧 Configuração Necessária</div>
                    <div class="alert-message">
                        Para usar a sincronização com Google Calendar, você precisa:<br>
                        1. Criar um projeto no Google Cloud Console<br>
                        2. Ativar a Calendar API<br>
                        3. Criar credenciais OAuth 2.0<br>
                        4. Inserir o Client ID e API Key nos campos acima
                    </div>
                </div>
            `;
        }

        if (!this.syncState.isAuthorized) {
            return `
                <div class="alert-box info">
                    <div class="alert-title">🔐 Autorização Necessária</div>
                    <div class="alert-message">
                        As credenciais estão configuradas. Clique em "Conectar com Google" para autorizar o acesso ao seu calendário.
                    </div>
                </div>
            `;
        }

        if (this.syncState.isAuthorized) {
            return `
                <div class="alert-box success">
                    <div class="alert-title">✅ Conectado com Sucesso</div>
                    <div class="alert-message">
                        Sua conta Google está conectada e a sincronização está ativa.
                    </div>
                </div>
            `;
        }

        return '';
    },

    /**
     * Renderizar ações de conexão
     */
    renderConnectionActions() {
        if (!this.config.clientId || !this.config.apiKey) {
            return `
                <div style="margin-top: 20px; padding: 16px; background: rgba(0, 0, 0, 0.2); border-radius: 8px; text-align: center;">
                    <div style="color: #94a3b8; font-size: 13px;">Configure as credenciais acima para habilitar a conexão</div>
                </div>
            `;
        }

        if (!this.syncState.isAuthorized) {
            return `
                <div style="margin-top: 20px;">
                    <button onclick="GoogleCalendarSync.authorizeGoogle()" class="gcal-btn google" style="width: 100%;">
                        🔐 Conectar com Google
                    </button>
                </div>
            `;
        }

        return `
            <div style="margin-top: 20px; display: flex; gap: 12px;">
                <button onclick="GoogleCalendarSync.disconnectGoogle()" class="gcal-btn danger" style="flex: 1;">
                    🔌 Desconectar
                </button>
                <button onclick="GoogleCalendarSync.refreshConnection()" class="gcal-btn secondary" style="flex: 1;">
                    🔄 Atualizar
                </button>
            </div>
        `;
    },

    /**
     * Renderizar log de sincronização
     */
    renderSyncLog() {
        const logs = this.getSyncLogs();
        
        if (logs.length === 0) {
            return `
                <div style="text-align: center; padding: 20px; color: #94a3b8;">
                    📝 Nenhuma atividade registrada
                </div>
            `;
        }

        return logs.slice(0, 10).map(log => `
            <div class="log-entry">
                <div class="log-message">${log.message}</div>
                <div class="log-time">${new Date(log.timestamp).toLocaleTimeString('pt-BR')}</div>
            </div>
        `).join('');
    },

    /**
     * Obter logs de sincronização
     */
    getSyncLogs() {
        const logs = JSON.parse(localStorage.getItem('gcal_sync_logs') || '[]');
        return logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    },

    /**
     * Adicionar log
     */
    addSyncLog(message) {
        const logs = this.getSyncLogs();
        logs.unshift({
            timestamp: new Date().toISOString(),
            message: message
        });
        
        // Manter apenas os últimos 50 logs
        if (logs.length > 50) {
            logs.splice(50);
        }
        
        localStorage.setItem('gcal_sync_logs', JSON.stringify(logs));
    },

    /**
     * Obter classe de status da conexão
     */
    getConnectionStatusClass() {
        if (!this.config.clientId || !this.config.apiKey) {
            return 'disconnected';
        }
        if (!this.syncState.isAuthorized) {
            return 'pending';
        }
        return 'connected';
    },

    /**
     * Obter título do status da conexão
     */
    getConnectionStatusTitle() {
        if (!this.config.clientId || !this.config.apiKey) {
            return 'Não Configurado';
        }
        if (!this.syncState.isAuthorized) {
            return 'Aguardando Autorização';
        }
        return 'Conectado e Sincronizando';
    },

    /**
     * Obter detalhes do status da conexão
     */
    getConnectionStatusDetails() {
        if (!this.config.clientId || !this.config.apiKey) {
            return 'Configure as credenciais do Google para começar';
        }
        if (!this.syncState.isAuthorized) {
            return 'Clique em "Conectar com Google" para autorizar';
        }
        return `Último sync: ${this.syncState.lastSync ? new Date(this.syncState.lastSync).toLocaleString('pt-BR') : 'Nunca'}`;
    },

    /**
     * FUNÇÕES DE INTERAÇÃO
     */

    /**
     * Salvar configuração
     */
    saveConfiguration(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        
        // Atualizar configurações
        this.config.clientId = formData.get('clientId');
        this.config.apiKey = formData.get('apiKey');
        this.syncState.calendarId = formData.get('calendarId');
        this.syncState.syncDirection = formData.get('syncDirection');
        this.syncState.autoSync = formData.has('autoSync');
        
        // Salvar configurações
        this.saveSyncConfig();
        
        // Reinicializar API se necessário
        if (this.config.clientId && this.config.apiKey) {
            this.setupGoogleClient();
        }
        
        this.addSyncLog('Configurações salvas com sucesso');
        this.showAlert('✅ Configurações Salvas', 'As configurações do Google Calendar foram salvas com sucesso!');
        
        // Atualizar interface
        this.refreshInterface();
    },

    /**
     * Testar conexão
     */
    async testConnection() {
        if (!this.config.clientId || !this.config.apiKey) {
            this.showAlert('❌ Configuração Incompleta', 'Configure o Client ID e API Key antes de testar a conexão.');
            return;
        }

        try {
            await this.setupGoogleClient();
            this.addSyncLog('Teste de conexão bem-sucedido');
            this.showAlert('✅ Teste de Conexão', 'Conexão com Google Calendar testada com sucesso!');
        } catch (error) {
            this.addSyncLog(`Erro no teste de conexão: ${error.message}`);
            this.showAlert('❌ Erro no Teste', `Erro ao testar conexão: ${error.message}`);
        }
    },

    /**
     * Autorizar Google
     */
    async authorizeGoogle() {
        try {
            const authInstance = window.gapi.auth2.getAuthInstance();
            await authInstance.signIn();
            
            this.syncState.isAuthorized = true;
            this.saveSyncConfig();
            
            this.addSyncLog('Autorização Google concedida');
            this.showAlert('✅ Autorização Concedida', 'Sua conta Google foi conectada com sucesso!\nA sincronização já está ativa.');
            
            if (this.syncState.autoSync) {
                this.startAutoSync();
            }
            
            this.refreshInterface();
        } catch (error) {
            this.addSyncLog(`Erro na autorização: ${error.message}`);
            this.showAlert('❌ Erro de Autorização', `Erro ao conectar com Google: ${error.message}`);
        }
    },

    /**
     * Desconectar Google
     */
    async disconnectGoogle() {
        try {
            const authInstance = window.gapi.auth2.getAuthInstance();
            await authInstance.signOut();
            
            this.syncState.isAuthorized = false;
            this.stopAutoSync();
            this.saveSyncConfig();
            
            this.addSyncLog('Desconectado do Google Calendar');
            this.showAlert('🔌 Desconectado', 'Sua conta Google foi desconectada com sucesso.');
            
            this.refreshInterface();
        } catch (error) {
            this.addSyncLog(`Erro ao desconectar: ${error.message}`);
            this.showAlert('❌ Erro', `Erro ao desconectar: ${error.message}`);
        }
    },

    /**
     * Atualizar conexão
     */
    async refreshConnection() {
        try {
            await this.setupGoogleClient();
            this.addSyncLog('Conexão atualizada');
            this.showAlert('🔄 Conexão Atualizada', 'A conexão com Google Calendar foi atualizada.');
            this.refreshInterface();
        } catch (error) {
            this.addSyncLog(`Erro ao atualizar conexão: ${error.message}`);
            this.showAlert('❌ Erro', `Erro ao atualizar conexão: ${error.message}`);
        }
    },

    /**
     * Sincronização manual
     */
    async performManualSync() {
        if (!this.syncState.isAuthorized) {
            this.showAlert('❌ Não Autorizado', 'Você precisa autorizar o acesso ao Google Calendar primeiro.');
            return;
        }

        try {
            this.addSyncLog('Iniciando sincronização manual');
            
            // Sincronização bidirecional
            await this.syncToGoogle();
            await this.syncFromGoogle();
            
            this.syncState.lastSync = new Date().toISOString();
            this.saveSyncConfig();
            
            this.addSyncLog('Sincronização manual concluída');
            this.showAlert('✅ Sincronização Concluída', 'Eventos sincronizados com sucesso entre DentalCore Pro e Google Calendar.');
            
            this.refreshInterface();
        } catch (error) {
            this.addSyncLog(`Erro na sincronização: ${error.message}`);
            this.showAlert('❌ Erro na Sincronização', `Erro durante a sincronização: ${error.message}`);
        }
    },

    /**
     * Sincronizar para Google
     */
    async syncToGoogle() {
        if (this.syncState.syncDirection === 'from_google') return;

        try {
            // Obter eventos locais (da agenda do sistema)
            const localEvents = this.getLocalEvents();
            
            for (const localEvent of localEvents) {
                const googleEventId = this.eventsCache.syncMap[localEvent.id];
                
                if (googleEventId) {
                    // Atualizar evento existente
                    await this.updateGoogleEvent(googleEventId, localEvent);
                } else {
                    // Criar novo evento
                    const googleEvent = await this.createGoogleEvent(localEvent);
                    this.eventsCache.syncMap[localEvent.id] = googleEvent.id;
                }
            }
            
            this.addSyncLog(`${localEvents.length} eventos enviados para Google Calendar`);
        } catch (error) {
            throw new Error(`Erro ao sincronizar para Google: ${error.message}`);
        }
    },

    /**
     * Sincronizar do Google
     */
    async syncFromGoogle() {
        if (this.syncState.syncDirection === 'to_google') return;

        try {
            // Obter eventos do Google Calendar
            const response = await window.gapi.client.calendar.events.list({
                calendarId: this.syncState.calendarId,
                timeMin: new Date().toISOString(),
                maxResults: 250,
                singleEvents: true,
                orderBy: 'startTime'
            });

            const googleEvents = response.result.items || [];
            
            for (const googleEvent of googleEvents) {
                const localEventId = this.findLocalEventByGoogleId(googleEvent.id);
                
                if (localEventId) {
                    // Atualizar evento local existente
                    await this.updateLocalEvent(localEventId, googleEvent);
                } else {
                    // Criar novo evento local
                    const localEvent = await this.createLocalEvent(googleEvent);
                    this.eventsCache.syncMap[localEvent.id] = googleEvent.id;
                }
            }
            
            this.eventsCache.googleEvents = googleEvents;
            this.addSyncLog(`${googleEvents.length} eventos recebidos do Google Calendar`);
        } catch (error) {
            throw new Error(`Erro ao sincronizar do Google: ${error.message}`);
        }
    },

    /**
     * Criar evento no Google Calendar
     */
    async createGoogleEvent(localEvent) {
        const googleEvent = {
            summary: localEvent.title || localEvent.patientName,
            description: `Consulta odontológica - ${localEvent.type || 'Consulta'}\nPaciente: ${localEvent.patientName}\nObservações: ${localEvent.notes || ''}`,
            start: {
                dateTime: localEvent.start,
                timeZone: 'America/Sao_Paulo'
            },
            end: {
                dateTime: localEvent.end,
                timeZone: 'America/Sao_Paulo'
            },
            colorId: '9', // Azul para consultas odontológicas
            reminders: {
                useDefault: false,
                overrides: [
                    { method: 'email', minutes: 24 * 60 }, // 1 dia antes
                    { method: 'popup', minutes: 60 } // 1 hora antes
                ]
            }
        };

        const response = await window.gapi.client.calendar.events.insert({
            calendarId: this.syncState.calendarId,
            resource: googleEvent
        });

        return response.result;
    },

    /**
     * Atualizar evento no Google Calendar
     */
    async updateGoogleEvent(googleEventId, localEvent) {
        const googleEvent = {
            summary: localEvent.title || localEvent.patientName,
            description: `Consulta odontológica - ${localEvent.type || 'Consulta'}\nPaciente: ${localEvent.patientName}\nObservações: ${localEvent.notes || ''}`,
            start: {
                dateTime: localEvent.start,
                timeZone: 'America/Sao_Paulo'
            },
            end: {
                dateTime: localEvent.end,
                timeZone: 'America/Sao_Paulo'
            }
        };

        const response = await window.gapi.client.calendar.events.update({
            calendarId: this.syncState.calendarId,
            eventId: googleEventId,
            resource: googleEvent
        });

        return response.result;
    },

    /**
     * Obter eventos locais
     */
    getLocalEvents() {
        // Integração com sistema de agenda
        if (typeof AgendaProfissional !== 'undefined' && AgendaProfissional.getEvents) {
            return AgendaProfissional.getEvents();
        }
        
        // Dados de exemplo se não houver agenda
        return [
            {
                id: 1,
                patientName: 'Maria Silva',
                type: 'Consulta',
                start: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
                end: new Date(Date.now() + 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString(),
                notes: 'Consulta de rotina'
            }
        ];
    },

    /**
     * Criar evento local
     */
    async createLocalEvent(googleEvent) {
        // Integração com sistema de agenda
        if (typeof AgendaProfissional !== 'undefined' && AgendaProfissional.createEvent) {
            return AgendaProfissional.createEvent({
                title: googleEvent.summary,
                start: googleEvent.start.dateTime,
                end: googleEvent.end.dateTime,
                description: googleEvent.description,
                source: 'google_calendar'
            });
        }
        
        // Retornar objeto simulado se não houver agenda
        return { id: Date.now() };
    },

    /**
     * Atualizar evento local
     */
    async updateLocalEvent(localEventId, googleEvent) {
        // Integração com sistema de agenda
        if (typeof AgendaProfissional !== 'undefined' && AgendaProfissional.updateEvent) {
            return AgendaProfissional.updateEvent(localEventId, {
                title: googleEvent.summary,
                start: googleEvent.start.dateTime,
                end: googleEvent.end.dateTime,
                description: googleEvent.description
            });
        }
    },

    /**
     * Encontrar evento local por ID do Google
     */
    findLocalEventByGoogleId(googleEventId) {
        for (const [localId, gId] of Object.entries(this.eventsCache.syncMap)) {
            if (gId === googleEventId) {
                return parseInt(localId);
            }
        }
        return null;
    },

    /**
     * Iniciar sincronização automática
     */
    startAutoSync() {
        if (this.syncTimer) {
            clearInterval(this.syncTimer);
        }
        
        this.syncTimer = setInterval(() => {
            if (this.syncState.isAuthorized && this.syncState.autoSync) {
                this.performManualSync();
            }
        }, this.syncState.syncInterval);
        
        this.addSyncLog('Sincronização automática ativada');
    },

    /**
     * Parar sincronização automática
     */
    stopAutoSync() {
        if (this.syncTimer) {
            clearInterval(this.syncTimer);
            this.syncTimer = null;
        }
        
        this.addSyncLog('Sincronização automática desativada');
    },

    /**
     * Resolver conflitos
     */
    resolveConflicts() {
        this.showAlert('⚠️ Resolução de Conflitos', 'Funcionalidade de resolução de conflitos será implementada.');
    },

    /**
     * Atualizar interface
     */
    refreshInterface() {
        // Atualizar a interface se estiver visível
        const workspace = document.querySelector('.gcal-workspace');
        if (workspace) {
            const mainContent = document.getElementById('main-content');
            if (mainContent) {
                mainContent.innerHTML = this.renderSyncInterface();
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
window.GoogleCalendarSync = GoogleCalendarSync;

console.log('📅 Módulo Google Calendar Sync carregado!');