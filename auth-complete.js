// ============================================================================
// DENTALCORE PRO - SISTEMA DE AUTENTICAÇÃO COMPLETO
// Login + Cadastro + Multi-usuário + Validação
// ============================================================================

const AuthComplete = {
    // Usuários padrão do sistema
    defaultUsers: [
        {
            id: 1,
            username: 'admin',
            password: 'admin123',
            name: 'Administrador',
            email: 'admin@clinica.com',
            role: 'admin',
            created: new Date().toISOString()
        },
        {
            id: 2,
            username: 'dentista',
            password: '123456',
            name: 'Dr. João Silva',
            email: 'dentista@clinica.com',
            role: 'doctor',
            created: new Date().toISOString()
        }
    ],

    // Usuário atual
    currentUser: null,

    /**
     * Inicialização
     */
    init() {
        console.log('🔐 Sistema de Autenticação Completo inicializado');
        this.loadUsers();
        this.checkLoggedUser();
    },

    /**
     * Carregar usuários
     */
    loadUsers() {
        let users = localStorage.getItem('dentalcore_users');
        if (!users) {
            localStorage.setItem('dentalcore_users', JSON.stringify(this.defaultUsers));
            users = this.defaultUsers;
        } else {
            users = JSON.parse(users);
        }
        return users;
    },

    /**
     * Verificar usuário logado
     */
    checkLoggedUser() {
        const savedUser = localStorage.getItem('dentalcore_current_user');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
            return true;
        }
        return false;
    },

    /**
     * Interface completa de login/cadastro
     */
    renderAuthInterface() {
        return `
            <style>
                /* CSS COMPLETO PARA AUTH */
                .auth-container {
                    min-height: 100vh;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 20px;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                }

                .auth-box {
                    background: rgba(255, 255, 255, 0.95);
                    backdrop-filter: blur(20px);
                    border-radius: 20px;
                    padding: 40px;
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
                    max-width: 450px;
                    width: 100%;
                    border: 1px solid rgba(255, 255, 255, 0.2);
                }

                .auth-header {
                    text-align: center;
                    margin-bottom: 30px;
                }

                .auth-logo {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 15px;
                    margin-bottom: 20px;
                }

                .logo-icon {
                    font-size: 48px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                .logo-text h1 {
                    font-size: 28px;
                    font-weight: 700;
                    color: #2d3748;
                    margin: 0;
                    letter-spacing: -0.025em;
                }

                .logo-text p {
                    font-size: 14px;
                    color: #718096;
                    margin: 5px 0 0 0;
                    font-weight: 500;
                }

                .auth-tabs {
                    display: flex;
                    background: #f7fafc;
                    border-radius: 12px;
                    padding: 4px;
                    margin-bottom: 25px;
                }

                .auth-tab {
                    flex: 1;
                    padding: 12px 16px;
                    border: none;
                    border-radius: 8px;
                    font-weight: 600;
                    font-size: 14px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    background: transparent;
                    color: #718096;
                }

                .auth-tab.active {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
                }

                .auth-form {
                    display: none;
                }

                .auth-form.active {
                    display: block;
                }

                .form-group {
                    margin-bottom: 20px;
                }

                .form-group label {
                    display: block;
                    font-weight: 600;
                    color: #2d3748;
                    margin-bottom: 8px;
                    font-size: 14px;
                }

                .form-group input,
                .form-group select {
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

                .form-group input:focus,
                .form-group select:focus {
                    outline: none;
                    border-color: #667eea;
                    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
                }

                .auth-btn {
                    width: 100%;
                    padding: 16px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    border: none;
                    border-radius: 12px;
                    font-weight: 700;
                    font-size: 16px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    margin-top: 10px;
                }

                .auth-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4);
                }

                .auth-btn:active {
                    transform: translateY(0);
                }

                .auth-footer {
                    text-align: center;
                    margin-top: 25px;
                    padding-top: 20px;
                    border-top: 1px solid #e2e8f0;
                }

                .test-credentials {
                    background: #f0fff4;
                    border: 1px solid #9ae6b4;
                    border-radius: 8px;
                    padding: 12px;
                    font-size: 12px;
                    color: #276749;
                    line-height: 1.4;
                }

                .auth-alert {
                    padding: 12px 16px;
                    border-radius: 8px;
                    margin-bottom: 20px;
                    font-size: 14px;
                    font-weight: 600;
                }

                .auth-alert.success {
                    background: #f0fff4;
                    border: 1px solid #9ae6b4;
                    color: #276749;
                }

                .auth-alert.error {
                    background: #fed7d7;
                    border: 1px solid #feb2b2;
                    color: #c53030;
                }

                /* Responsividade */
                @media (max-width: 480px) {
                    .auth-box {
                        padding: 30px 20px;
                        margin: 10px;
                    }
                    
                    .logo-icon {
                        font-size: 40px;
                    }
                    
                    .logo-text h1 {
                        font-size: 24px;
                    }
                }
            </style>

            <div class="auth-container">
                <div class="auth-box">
                    <div class="auth-header">
                        <div class="auth-logo">
                            <div class="logo-icon">🦷</div>
                            <div class="logo-text">
                                <h1>DentalCore Pro</h1>
                                <p>Sistema Odontológico Profissional</p>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Alert Area -->
                    <div id="authAlert" style="display: none;"></div>

                    <!-- Abas Login/Cadastro -->
                    <div class="auth-tabs">
                        <button onclick="AuthComplete.showLoginTab()" class="auth-tab active" id="loginTab">
                            🔐 Entrar
                        </button>
                        <button onclick="AuthComplete.showRegisterTab()" class="auth-tab" id="registerTab">
                            ➕ Cadastrar
                        </button>
                    </div>

                    <!-- Formulário de Login -->
                    <form id="loginForm" class="auth-form active" onsubmit="AuthComplete.handleLogin(event)">
                        <div class="form-group">
                            <label for="loginUsername">Usuário</label>
                            <input type="text" id="loginUsername" name="username" placeholder="dentista" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="loginPassword">Senha</label>
                            <input type="password" id="loginPassword" name="password" placeholder="••••••" required>
                        </div>
                        
                        <button type="submit" class="auth-btn">
                            🔐 Entrar no Sistema
                        </button>
                    </form>

                    <!-- Formulário de Cadastro -->
                    <form id="registerForm" class="auth-form" onsubmit="AuthComplete.handleRegister(event)">
                        <div class="form-group">
                            <label for="registerName">Nome Completo</label>
                            <input type="text" id="registerName" name="name" placeholder="Dr. João Silva" required>
                        </div>

                        <div class="form-group">
                            <label for="registerEmail">Email</label>
                            <input type="email" id="registerEmail" name="email" placeholder="joao@clinica.com" required>
                        </div>

                        <div class="form-group">
                            <label for="registerUsername">Usuário</label>
                            <input type="text" id="registerUsername" name="username" placeholder="dr.joao" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="registerPassword">Senha</label>
                            <input type="password" id="registerPassword" name="password" placeholder="••••••" required minlength="6">
                        </div>

                        <div class="form-group">
                            <label for="registerRole">Função na Clínica</label>
                            <select id="registerRole" name="role" required>
                                <option value="">Selecione sua função</option>
                                <option value="admin">👑 Administrador</option>
                                <option value="doctor">👨‍⚕️ Dentista</option>
                                <option value="assistant">👩‍⚕️ Auxiliar</option>
                                <option value="secretary">👩‍💼 Secretária</option>
                            </select>
                        </div>
                        
                        <button type="submit" class="auth-btn">
                            ➕ Criar Conta
                        </button>
                    </form>
                    
                    <div class="auth-footer">
                        <div class="test-credentials">
                            <strong>✅ Credenciais de teste:</strong><br>
                            👤 dentista / 123456<br>
                            👑 admin / admin123
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * Mostrar aba de login
     */
    showLoginTab() {
        document.getElementById('loginTab').classList.add('active');
        document.getElementById('registerTab').classList.remove('active');
        document.getElementById('loginForm').classList.add('active');
        document.getElementById('registerForm').classList.remove('active');
        this.hideAlert();
    },

    /**
     * Mostrar aba de cadastro
     */
    showRegisterTab() {
        document.getElementById('registerTab').classList.add('active');
        document.getElementById('loginTab').classList.remove('active');
        document.getElementById('registerForm').classList.add('active');
        document.getElementById('loginForm').classList.remove('active');
        this.hideAlert();
    },

    /**
     * Processar login
     */
    handleLogin(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const username = formData.get('username');
        const password = formData.get('password');
        
        console.log('🔐 Tentativa de login:', username);
        
        const users = this.loadUsers();
        const user = users.find(u => u.username === username && u.password === password);
        
        if (user) {
            this.currentUser = user;
            localStorage.setItem('dentalcore_current_user', JSON.stringify(user));
            
            this.showAlert('success', `✅ Login realizado com sucesso!\nBem-vindo(a), ${user.name}!`);
            
            setTimeout(() => {
                // Ocultar tela de login
                document.getElementById('loginScreen').style.display = 'none';
                document.getElementById('mainApp').style.display = 'block';
                
                // Atualizar interface do usuário
                this.updateUserInterface();
                
                // Carregar dashboard
                if (typeof showTab === 'function') {
                    showTab('dashboard');
                }
            }, 1500);
        } else {
            this.showAlert('error', '❌ Usuário ou senha incorretos!\nTente: dentista / 123456');
        }
    },

    /**
     * Processar cadastro
     */
    handleRegister(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const userData = {
            id: Date.now(),
            name: formData.get('name'),
            email: formData.get('email'),
            username: formData.get('username'),
            password: formData.get('password'),
            role: formData.get('role'),
            created: new Date().toISOString()
        };
        
        console.log('➕ Tentativa de cadastro:', userData.username);
        
        // Validações
        if (userData.password.length < 6) {
            this.showAlert('error', '❌ A senha deve ter pelo menos 6 caracteres!');
            return;
        }
        
        const users = this.loadUsers();
        
        // Verificar se usuário já existe
        if (users.find(u => u.username === userData.username)) {
            this.showAlert('error', '❌ Este nome de usuário já existe!\nTente outro nome de usuário.');
            return;
        }
        
        if (users.find(u => u.email === userData.email)) {
            this.showAlert('error', '❌ Este email já está cadastrado!\nTente outro email.');
            return;
        }
        
        // Adicionar novo usuário
        users.push(userData);
        localStorage.setItem('dentalcore_users', JSON.stringify(users));
        
        this.showAlert('success', `✅ Conta criada com sucesso!\nUsuário: ${userData.username}\n\nAgora você pode fazer login!`);
        
        // Limpar formulário
        event.target.reset();
        
        // Voltar para aba de login após 2 segundos
        setTimeout(() => {
            this.showLoginTab();
        }, 2000);
    },

    /**
     * Mostrar alerta
     */
    showAlert(type, message) {
        const alertDiv = document.getElementById('authAlert');
        alertDiv.className = `auth-alert ${type}`;
        alertDiv.innerHTML = message.replace(/\n/g, '<br>');
        alertDiv.style.display = 'block';
        
        setTimeout(() => {
            alertDiv.style.display = 'none';
        }, 5000);
    },

    /**
     * Ocultar alerta
     */
    hideAlert() {
        const alertDiv = document.getElementById('authAlert');
        if (alertDiv) {
            alertDiv.style.display = 'none';
        }
    },

    /**
     * Atualizar interface do usuário
     */
    updateUserInterface() {
        if (!this.currentUser) return;
        
        // Atualizar sidebar com informações do usuário
        const userNameSpan = document.querySelector('.user-name');
        const userRoleSpan = document.querySelector('.user-role');
        
        if (userNameSpan) {
            userNameSpan.textContent = this.currentUser.name;
        }
        
        if (userRoleSpan) {
            const roleNames = {
                admin: 'Administrador',
                doctor: 'Dentista',
                assistant: 'Auxiliar',
                secretary: 'Secretária'
            };
            userRoleSpan.textContent = roleNames[this.currentUser.role] || 'Usuário';
        }
        
        console.log('✅ Interface do usuário atualizada:', this.currentUser.name);
    },

    /**
     * Logout
     */
    logout() {
        this.currentUser = null;
        localStorage.removeItem('dentalcore_current_user');
        
        // Mostrar tela de login
        document.getElementById('loginScreen').style.display = 'flex';
        document.getElementById('mainApp').style.display = 'none';
        
        console.log('👋 Logout realizado');
    },

    /**
     * Obter usuário atual
     */
    getCurrentUser() {
        return this.currentUser;
    },

    /**
     * Verificar se está logado
     */
    isLoggedIn() {
        return this.currentUser !== null;
    }
};

// Exportar para uso global
window.AuthComplete = AuthComplete;

// Substituir função handleLogin global
window.handleLogin = function(event) {
    AuthComplete.handleLogin(event);
};

window.handleRegister = function(event) {
    AuthComplete.handleRegister(event);
};

console.log('🔐 Sistema de Autenticação Completo carregado!');