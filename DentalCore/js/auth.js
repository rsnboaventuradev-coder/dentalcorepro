// ============================================================================
// DENTALCORE PRO - MÓDULO DE AUTENTICAÇÃO
// ============================================================================

const SimpleAuth = {
    currentUser: null,
    currentSession: null,

    /**
     * Inicializar módulo de autenticação
     */
    init() {
        this.checkExistingSession();
        console.log('🔐 Autenticação inicializada');
    },

    /**
     * Verificar sessão existente
     */
    checkExistingSession() {
        try {
            const userData = localStorage.getItem('dentalcore_user');
            if (userData) {
                this.currentUser = JSON.parse(userData);
                return true;
            }
        } catch (e) {
            console.warn('Erro ao verificar sessão existente');
        }
        return false;
    },

    /**
     * Realizar login
     */
    async login(username, password) {
        try {
            await new Promise(resolve => setTimeout(resolve, 300));

            const validCredentials = {
                'dentista': { password: '123456', name: 'Dra. Ana Oliveira', role: 'dentist' },
                'admin': { password: 'admin123', name: 'Dr. João Silva', role: 'admin' }
            };

            const userConfig = validCredentials[username];
            
            if (!userConfig || userConfig.password !== password) {
                UI.showAlert('❌ Credenciais inválidas!', '✅ Use uma das opções:\n• dentista / 123456\n• admin / admin123');
                return false;
            }

            this.currentUser = {
                username: username,
                name: userConfig.name,
                role: userConfig.role
            };

            console.log('✅ Login bem-sucedido:', this.currentUser.name);

            try {
                localStorage.setItem('dentalcore_user', JSON.stringify(this.currentUser));
            } catch (e) {
                console.warn('localStorage não disponível');
            }

            return true;

        } catch (error) {
            console.error('❌ Erro no login:', error);
            UI.showAlert('❌ Erro interno do sistema', 'Tente novamente ou recarregue a página.');
            return false;
        }
    },

    /**
     * Realizar logout
     */
    logout() {
        UI.showConfirmDialog('🚪 Sair do Sistema', 'Tem certeza que deseja sair do DentalCore Pro?', () => {
            try {
                localStorage.removeItem('dentalcore_user');
            } catch (e) {
                console.warn('localStorage não disponível');
            }
            
            this.currentUser = null;
            this.currentSession = null;
            
            const loginScreen = document.getElementById('loginScreen');
            const mainApp = document.getElementById('mainApp');
            const username = document.getElementById('username');
            const password = document.getElementById('password');
            
            if (mainApp) mainApp.classList.add('hidden');
            if (loginScreen) loginScreen.classList.remove('hidden');
            if (username) username.value = 'dentista';
            if (password) password.value = '123456';
            
            UI.showAlert('👋 Logout realizado!', 'Volte sempre ao DentalCore Pro');
        });
    },

    /**
     * Verificar se usuário está logado
     */
    isLoggedIn() {
        return this.currentUser !== null;
    },

    /**
     * Obter usuário atual
     */
    getCurrentUser() {
        return this.currentUser;
    },

    /**
     * Atualizar interface do usuário
     */
    updateUserInterface() {
        if (this.currentUser) {
            const userNameEl = document.getElementById('userName');
            const userInitialsEl = document.getElementById('userInitials');
            
            if (userNameEl) userNameEl.textContent = this.currentUser.name;
            if (userInitialsEl) {
                const initials = this.currentUser.name.split(' ').map(n => n[0]).join('').substring(0, 2);
                userInitialsEl.textContent = initials;
            }
        }
    }
};

// Exportar módulo
window.SimpleAuth = SimpleAuth;