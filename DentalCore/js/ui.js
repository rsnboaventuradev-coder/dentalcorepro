// ============================================================================
// DENTALCORE PRO - MÓDULO DE INTERFACE DO USUÁRIO CENTRALIZADO
// Componentes e utilitários de interface para alertas, modais e notificações
// ============================================================================

const UI = {
    /**
     * Inicializar módulo de UI
     */
    init() {
        console.log('🎨 UI Module inicializado');
        this.setupEventListeners();
    },

    /**
     * Configurar event listeners globais
     */
    setupEventListeners() {
        // Fechar modais ao clicar fora
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-backdrop')) {
                e.target.remove();
            }
        });

        // Fechar modais com ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const modals = document.querySelectorAll('.fixed.inset-0');
                modals.forEach(modal => modal.remove());
            }
        });
    },

    /**
     * Mostrar um alerta personalizado com estilo premium
     */
    showAlert(title, message, onClose = null) {
        // Remover alerta existente
        const existingAlert = document.getElementById('customAlert');
        if (existingAlert) {
            existingAlert.remove();
        }

        const alertHTML = `
            <div id="customAlert" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
                <div class="bg-slate-800 border border-slate-700/50 p-6 rounded-xl shadow-2xl max-w-sm w-full transform transition-transform duration-300 scale-95">
                    <div class="flex flex-col items-center text-center">
                        <div class="text-3xl mb-4 text-emerald-500">
                            <span class="emoji">${this.getIconForMessage(title)}</span>
                        </div>
                        <h3 class="text-xl font-bold text-slate-50">${title}</h3>
                        <p class="text-slate-400 mt-2 text-sm whitespace-pre-line">${message}</p>
                    </div>
                    <div class="mt-6 flex justify-end">
                        <button onclick="this.closest('#customAlert').remove(); ${onClose ? 'onClose()' : ''}" class="premium-button-primary">Entendi</button>
                    </div>
                </div>
            </div>
            <style>
                .premium-button-primary {
                    background: linear-gradient(135deg, #0d9488 0%, #14b8a6 100%);
                    border: none;
                    border-radius: 8px;
                    color: white;
                    padding: 12px 24px;
                    font-weight: 600;
                    font-size: 14px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    text-align: center;
                }
            </style>
        `;
        document.body.insertAdjacentHTML('beforeend', alertHTML);
        // Animar a entrada
        setTimeout(() => {
            const modal = document.getElementById('customAlert');
            if (modal) modal.querySelector('div:first-child').classList.remove('scale-95');
        }, 10);
    },

    /**
     * Mostrar um diálogo de confirmação
     */
    showConfirmDialog(title, message, onConfirm) {
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
                max-width: 500px;
                width: 90%;
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
                <div style="padding: 0 24px 24px 24px; display: flex; justify-content: flex-end; gap: 12px;">
                    <button onclick="this.closest('div[style*=\"position: fixed\"]').remove()" style="
                        background: rgba(255, 255, 255, 0.1);
                        border: 1px solid rgba(255, 255, 255, 0.2);
                        border-radius: 8px;
                        color: #e2e8f0;
                        padding: 12px 24px;
                        font-weight: 600;
                        font-size: 14px;
                        cursor: pointer;
                        transition: all 0.2s ease;
                    ">Cancelar</button>
                    <button class="confirm-btn" style="
                        background: linear-gradient(135deg, #0d9488 0%, #14b8a6 100%);
                        border: none;
                        border-radius: 8px;
                        color: white;
                        padding: 12px 24px;
                        font-weight: 600;
                        font-size: 14px;
                        cursor: pointer;
                        transition: all 0.2s ease;
                    ">Confirmar</button>
                </div>
            </div>
        `;
        
        const confirmBtn = modal.querySelector('.confirm-btn');
        confirmBtn.onclick = () => {
            modal.remove();
            if (onConfirm && typeof onConfirm === 'function') {
                onConfirm();
            }
        };
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
        
        document.body.appendChild(modal);
    },

    /**
     * Mostrar um modal completo com conteúdo customizável
     */
    showModal(title, content, options = {}) {
        const modalId = options.id || 'customModal';
        const existingModal = document.getElementById(modalId);
        if (existingModal) {
            existingModal.remove();
        }

        const modalHTML = `
            <div id="${modalId}" class="modal-backdrop fixed inset-0 z-40 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
                <div class="bg-slate-800 border border-slate-700/50 rounded-xl shadow-2xl max-w-2xl w-full transform transition-transform duration-300 scale-95">
                    <div class="flex items-center justify-between p-4 border-b border-slate-700/50">
                        <h3 class="text-xl font-bold text-slate-50">${title}</h3>
                        <button onclick="UI.closeModal('${modalId}')" class="text-slate-400 hover:text-slate-200">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                        </button>
                    </div>
                    <div class="p-6">
                        ${content}
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        setTimeout(() => {
            const modal = document.getElementById(modalId);
            if (modal) modal.querySelector('div:first-child').classList.remove('scale-95');
        }, 10);
    },

    /**
     * Fechar um modal específico
     */
    closeModal(modalId = 'customModal') {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.remove();
        }
    },

    /**
     * Mostrar uma notificação toast
     */
    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        const bgColor = type === 'success' ? 'bg-emerald-600' : type === 'error' ? 'bg-rose-600' : 'bg-slate-700';
        toast.className = `fixed bottom-4 right-4 z-50 p-4 rounded-lg shadow-lg text-sm text-white ${bgColor} transform transition-transform duration-300 translate-x-full`;
        toast.innerHTML = `
            <div class="flex items-start">
                <div class="text-xl mr-3">${this.getIconForMessage(type)}</div>
                <div class="flex-1">
                    <p class="text-slate-100 text-sm">${message}</p>
                </div>
                <button onclick="this.closest('.fixed').remove()" class="text-white/80 hover:text-white ml-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                </button>
            </div>
        `;
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.classList.remove('translate-x-full');
        }, 100);
        setTimeout(() => {
            toast.classList.add('translate-x-full');
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.remove();
                }
            }, 300);
        }, 5000);
    },

    /**
     * Obter um ícone para o título ou tipo da mensagem
     */
    getIconForMessage(titleOrType) {
        const lower = titleOrType.toLowerCase();
        if (lower.includes('sucesso') || lower.includes('salvo') || lower.includes('enviado') || lower.includes('concluído')) return '✅';
        if (lower.includes('erro')) return '❌';
        if (lower.includes('alerta') || lower.includes('aviso') || lower.includes('atenção')) return '⚠️';
        if (lower.includes('exportar')) return '📤';
        if (lower.includes('carregando') || lower.includes('aguardando')) return '⏳';
        if (lower.includes('backup')) return '💾';
        return '💡'; // Ícone padrão
    }
};

// Exportar o módulo globalmente
window.UI = UI;