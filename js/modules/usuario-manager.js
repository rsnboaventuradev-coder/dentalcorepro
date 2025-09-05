// ============================================================================
// DENTALCORE PRO - GERENCIADOR DE USUÁRIOS FIREBASE
// Sistema completo de gerenciamento de usuários com permissões
// ============================================================================

const UsuarioManager = {
    // Cache de usuários
    users: new Map(),
    currentUserRole: null,

    // Roles disponíveis
    roles: {
        admin: {
            name: 'Administrador',
            permissions: ['read', 'write', 'delete', 'manage_users', 'manage_settings'],
            color: '#ef4444',
            icon: '👑'
        },
        doctor: {
            name: 'Dentista',
            permissions: ['read', 'write', 'delete'],
            color: '#3b82f6',
            icon: '👨‍⚕️'
        },
        assistant: {
            name: 'Auxiliar',
            permissions: ['read', 'write'],
            color: '#10b981',
            icon: '👩‍⚕️'
        },
        secretary: {
            name: 'Secretária',
            permissions: ['read', 'write_appointments', 'write_patients'],
            color: '#f59e0b',
            icon: '👩‍💼'
        }
    },

    /**
     * Inicialização
     */
    init() {
        console.log('👥 Gerenciador de Usuários inicializado');
        this.loadUsers();
    },

    /**
     * Carregar usuários
     */
    async loadUsers() {
        if (typeof FirebaseSync !== 'undefined' && FirebaseSync.currentUser.uid) {
            try {
                // Simular carregamento de usuários (integração real seria via FirebaseSync)
                this.users.set('user1', {
                    uid: 'user1',
                    displayName: 'Dr. João Silva',
                    email: 'admin@clinica.com',
                    role: 'admin',
                    isOnline: true,
                    lastSeen: Date.now(),
                    createdAt: Date.now() - 86400000,
                    clinicId: 'clinic_001'
                });

                this.users.set('user2', {
                    uid: 'user2',
                    displayName: 'Ana Santos',
                    email: 'secretaria@clinica.com',
                    role: 'secretary',
                    isOnline: false,
                    lastSeen: Date.now() - 3600000,
                    createdAt: Date.now() - 172800000,
                    clinicId: 'clinic_001'
                });

                this.currentUserRole = FirebaseSync.currentUser.role || 'assistant';
                console.log('👥 Usuários carregados:', this.users.size);
            } catch (error) {
                console.error('❌ Erro ao carregar usuários:', error);
            }
        }
    },

    /**
     * Interface de gerenciamento
     */
    renderUserManagement() {
        if (!this.hasPermission('manage_users')) {
            return `
                <div style="text-align: center; padding: 40px; color: #94a3b8;">
                    <h3 style="color: #ef4444; margin-bottom: 16px;">🔒 Acesso Negado</h3>
                    <p>Você não tem permissão para gerenciar usuários.</p>
                    <p>Entre em contato com o administrador do sistema.</p>
                </div>
            `;
        }

        return `
            <style>
                .user-management {
                    padding: 20px;
                    color: #f8fafc;
                }
                
                .users-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                    gap: 20px;
                    margin-bottom: 32px;
                }
                
                .user-card {
                    background: rgba(0, 0, 0, 0.2);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 12px;
                    padding: 20px;
                    transition: all 0.2s ease;
                }
                
                .user-card:hover {
                    border-color: rgba(13, 148, 136, 0.3);
                    transform: translateY(-2px);
                }
                
                .user-header {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin-bottom: 16px;
                }
                
                .user-avatar {
                    width: 48px;
                    height: 48px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 20px;
                    font-weight: 600;
                    color: white;
                }
                
                .user-info h4 {
                    margin: 0;
                    font-size: 16px;
                    font-weight: 600;
                    color: #ffffff;
                }
                
                .user-email {
                    font-size: 12px;
                    color: #94a3b8;
                    margin: 2px 0;
                }
                
                .user-role {
                    display: inline-block;
                    padding: 2px 8px;
                    border-radius: 12px;
                    font-size: 10px;
                    font-weight: 600;
                    text-transform: uppercase;
                    margin-top: 4px;
                }
                
                .user-status {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    margin-bottom: 12px;
                    font-size: 12px;
                }
                
                .status-dot {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                }
                
                .user-actions {
                    display: flex;
                    gap: 8px;
                    flex-wrap: wrap;
                }
                
                .user-action-btn {
                    padding: 6px 12px;
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    border-radius: 6px;
                    background: rgba(0, 0, 0, 0.2);
                    color: #e2e8f0;
                    font-size: 11px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }
                
                .user-action-btn:hover {
                    background: rgba(13, 148, 136, 0.2);
                    border-color: rgba(13, 148, 136, 0.3);
                    color: #14b8a6;
                }
                
                .add-user-card {
                    background: rgba(13, 148, 136, 0.1);
                    border: 2px dashed rgba(13, 148, 136, 0.3);
                    border-radius: 12px;
                    padding: 20px;
                    text-align: center;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    min-height: 150px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                }
                
                .add-user-card:hover {
                    background: rgba(13, 148, 136, 0.15);
                    border-color: rgba(13, 148, 136, 0.5);
                }
                
                .permissions-section {
                    background: rgba(0, 0, 0, 0.2);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 12px;
                    padding: 24px;
                    margin-top: 32px;
                }
                
                .permissions-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 16px;
                    margin-top: 20px;
                }
                
                .permission-card {
                    background: rgba(0, 0, 0, 0.3);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 8px;
                    padding: 16px;
                    text-align: center;
                }
                
                .role-icon {
                    font-size: 32px;
                    margin-bottom: 8px;
                }
                
                .role-name {
                    font-weight: 600;
                    margin-bottom: 8px;
                }
                
                .role-permissions {
                    font-size: 11px;
                    color: #94a3b8;
                    line-height: 1.4;
                }
            </style>
            
            <div class="user-management">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
                    <h3 style="margin: 0; color: #ffffff; font-size: 20px;">👥 Gerenciamento de Usuários</h3>
                    <button onclick="UsuarioManager.showInviteModal()" style="
                        background: linear-gradient(135deg, #0d9488 0%, #14b8a6 100%);
                        border: none;
                        border-radius: 8px;
                        color: white;
                        padding: 12px 20px;
                        font-weight: 600;
                        cursor: pointer;
                        font-size: 14px;
                    ">➕ Convidar Usuário</button>
                </div>
                
                <div class="users-grid">
                    ${this.renderUserCards()}
                    
                    <div class="add-user-card" onclick="UsuarioManager.showInviteModal()">
                        <div style="font-size: 48px; color: #14b8a6; margin-bottom: 12px;">➕</div>
                        <div style="font-weight: 600; color: #14b8a6; margin-bottom: 4px;">Adicionar Usuário</div>
                        <div style="font-size: 12px; color: #94a3b8;">Convide novos membros para a equipe</div>
                    </div>
                </div>
                
                <div class="permissions-section">
                    <h4 style="margin: 0 0 16px 0; color: #ffffff; font-size: 18px;">🔒 Níveis de Permissão</h4>
                    <div class="permissions-grid">
                        ${this.renderPermissionCards()}
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * Renderizar cards de usuários
     */
    renderUserCards() {
        let html = '';
        
        this.users.forEach((user, uid) => {
            const role = this.roles[user.role] || this.roles.assistant;
            const isOnline = user.isOnline && (Date.now() - user.lastSeen < 60000);
            const lastSeen = this.getLastSeenText(user.lastSeen);
            
            html += `
                <div class="user-card">
                    <div class="user-header">
                        <div class="user-avatar" style="background: ${role.color};">
                            ${user.displayName?.charAt(0)?.toUpperCase() || '?'}
                        </div>
                        <div class="user-info">
                            <h4>${user.displayName || 'Sem Nome'}</h4>
                            <div class="user-email">${user.email}</div>
                            <div class="user-role" style="background: ${role.color}20; color: ${role.color}; border: 1px solid ${role.color}40;">
                                ${role.icon} ${role.name}
                            </div>
                        </div>
                    </div>
                    
                    <div class="user-status">
                        <div class="status-dot" style="background: ${isOnline ? '#10b981' : '#6b7280'};"></div>
                        <span style="color: ${isOnline ? '#10b981' : '#94a3b8'};">
                            ${isOnline ? 'Online agora' : lastSeen}
                        </span>
                    </div>
                    
                    <div style="font-size: 11px; color: #94a3b8; margin-bottom: 16px;">
                        Membro desde: ${new Date(user.createdAt).toLocaleDateString('pt-BR')}
                    </div>
                    
                    <div class="user-actions">
                        <button onclick="UsuarioManager.editUser('${uid}')" class="user-action-btn">
                            ✏️ Editar
                        </button>
                        <button onclick="UsuarioManager.changeRole('${uid}')" class="user-action-btn">
                            🔒 Função
                        </button>
                        ${user.uid !== FirebaseSync?.currentUser?.uid ? `
                            <button onclick="UsuarioManager.removeUser('${uid}')" class="user-action-btn" style="color: #f87171;">
                                🗑️ Remover
                            </button>
                        ` : ''}
                    </div>
                </div>
            `;
        });
        
        return html;
    },

    /**
     * Renderizar cards de permissões
     */
    renderPermissionCards() {
        let html = '';
        
        Object.entries(this.roles).forEach(([roleKey, role]) => {
            html += `
                <div class="permission-card">
                    <div class="role-icon">${role.icon}</div>
                    <div class="role-name" style="color: ${role.color};">${role.name}</div>
                    <div class="role-permissions">
                        ${role.permissions.map(perm => this.translatePermission(perm)).join(' • ')}
                    </div>
                </div>
            `;
        });
        
        return html;
    },

    /**
     * Traduzir permissões
     */
    translatePermission(permission) {
        const translations = {
            'read': 'Visualizar',
            'write': 'Editar',
            'delete': 'Excluir',
            'manage_users': 'Gerenciar Usuários',
            'manage_settings': 'Configurações',
            'write_appointments': 'Agendar Consultas',
            'write_patients': 'Gerenciar Pacientes'
        };
        return translations[permission] || permission;
    },

    /**
     * Verificar permissões
     */
    hasPermission(permission) {
        if (!this.currentUserRole) return false;
        const role = this.roles[this.currentUserRole];
        return role && role.permissions.includes(permission);
    },

    /**
     * Obter texto de última visualização
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
     * Mostrar modal de convite
     */
    showInviteModal() {
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
        `;
        modal.innerHTML = `
            <div style="
                background: linear-gradient(135deg, #1e3a8a 0%, #374151 100%);
                border-radius: 16px;
                max-width: 500px;
                width: 90%;
                color: #f8fafc;
            ">
                <div style="padding: 24px; border-bottom: 1px solid rgba(255, 255, 255, 0.1);">
                    <h3 style="margin: 0; font-size: 20px;">➕ Convidar Novo Usuário</h3>
                </div>
                
                <form onsubmit="UsuarioManager.sendInvite(event)" style="padding: 24px;">
                    <div style="margin-bottom: 16px;">
                        <label style="display: block; margin-bottom: 6px; font-weight: 600;">Nome Completo *</label>
                        <input type="text" name="displayName" required style="
                            width: 100%;
                            padding: 12px;
                            border: 1px solid rgba(255, 255, 255, 0.2);
                            border-radius: 8px;
                            background: rgba(0, 0, 0, 0.3);
                            color: #f8fafc;
                            box-sizing: border-box;
                        ">
                    </div>
                    
                    <div style="margin-bottom: 16px;">
                        <label style="display: block; margin-bottom: 6px; font-weight: 600;">E-mail *</label>
                        <input type="email" name="email" required style="
                            width: 100%;
                            padding: 12px;
                            border: 1px solid rgba(255, 255, 255, 0.2);
                            border-radius: 8px;
                            background: rgba(0, 0, 0, 0.3);
                            color: #f8fafc;
                            box-sizing: border-box;
                        ">
                    </div>
                    
                    <div style="margin-bottom: 24px;">
                        <label style="display: block; margin-bottom: 6px; font-weight: 600;">Função *</label>
                        <select name="role" required style="
                            width: 100%;
                            padding: 12px;
                            border: 1px solid rgba(255, 255, 255, 0.2);
                            border-radius: 8px;
                            background: rgba(0, 0, 0, 0.3);
                            color: #f8fafc;
                            box-sizing: border-box;
                        ">
                            <option value="">Selecione a função</option>
                            ${Object.entries(this.roles).map(([key, role]) => 
                                `<option value="${key}">${role.icon} ${role.name}</option>`
                            ).join('')}
                        </select>
                    </div>
                    
                    <div style="display: flex; gap: 12px;">
                        <button type="button" onclick="this.closest('div[style*=\"position: fixed\"]').remove()" style="
                            flex: 1;
                            padding: 12px;
                            border: 1px solid rgba(255, 255, 255, 0.2);
                            border-radius: 8px;
                            background: transparent;
                            color: #e2e8f0;
                            cursor: pointer;
                        ">Cancelar</button>
                        
                        <button type="submit" style="
                            flex: 1;
                            padding: 12px;
                            border: none;
                            border-radius: 8px;
                            background: linear-gradient(135deg, #0d9488 0%, #14b8a6 100%);
                            color: white;
                            font-weight: 600;
                            cursor: pointer;
                        ">Enviar Convite</button>
                    </div>
                </form>
            </div>
        `;
        
        document.body.appendChild(modal);
    },

    /**
     * Enviar convite
     */
    sendInvite(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const userData = {
            displayName: formData.get('displayName'),
            email: formData.get('email'),
            role: formData.get('role')
        };
        
        // Simular envio de convite
        setTimeout(() => {
            event.target.closest('div[style*="position: fixed"]').remove();
            this.showAlert('📧 Convite Enviado', 
                `Convite enviado para ${userData.displayName}!\n\n` +
                `E-mail: ${userData.email}\n` +
                `Função: ${this.roles[userData.role].name}\n\n` +
                `O usuário receberá um e-mail com instruções para criar a conta.`
            );
        }, 1000);
    },

    /**
     * Editar usuário
     */
    editUser(uid) {
        this.showAlert('✏️ Editar Usuário', 'Funcionalidade de edição em desenvolvimento.');
    },

    /**
     * Alterar função
     */
    changeRole(uid) {
        this.showAlert('🔒 Alterar Função', 'Funcionalidade de alteração de função em desenvolvimento.');
    },

    /**
     * Remover usuário
     */
    removeUser(uid) {
        const user = this.users.get(uid);
        if (!user) return;
        
        // Simular confirmação
        if (confirm(`Deseja realmente remover ${user.displayName} da equipe?`)) {
            this.users.delete(uid);
            this.showAlert('🗑️ Usuário Removido', `${user.displayName} foi removido da equipe.`);
            
            // Atualizar interface se estiver visível
            this.updateInterface();
        }
    },

    /**
     * Atualizar interface
     */
    updateInterface() {
        // Implementar se necessário
        console.log('👥 Interface de usuários atualizada');
    },

    /**
     * Mostrar alerta
     */
    showAlert(title, message) {
        if (typeof UI !== 'undefined' && UI.showAlert) {
            UI.showAlert(title, message);
        } else {
            alert(`${title}\n\n${message}`);
        }
    }
};

// Exportar para uso global
window.UsuarioManager = UsuarioManager;

console.log('👥 Gerenciador de Usuários carregado!');