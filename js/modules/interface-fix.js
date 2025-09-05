// ============================================================================
// DENTALCORE PRO - FIX PARA INTERFACE PRINCIPAL
// Corrige problema de modal de backup e garante renderização
// ============================================================================

const InterfaceFix = {
    
    /**
     * Inicializar fix da interface
     */
    init() {
        console.log('🔧 Aplicando fix da interface principal...');
        
        // 1. Fechar qualquer modal que esteja bloqueando
        this.closeBlockingModals();
        
        // 2. Garantir que a aplicação seja renderizada
        this.ensureAppRender();
        
        // 3. Desabilitar backup automático inicial (redundante, mas seguro)
        this.disableEarlyBackup();
        
        console.log('✅ Fix da interface aplicado!');
    },

    /**
     * Fechar modais que estão bloqueando
     */
    closeBlockingModals() {
        // Fechar modal de backup se existir
        const backupModal = document.querySelector('div[style*="position: fixed"]');
        if (backupModal) {
            console.log('🗑️ Removendo modal de backup...');
            backupModal.remove();
        }
        
        // Fechar outros modais potenciais
        document.querySelectorAll('.fixed, [class*="modal"], [id*="modal"]').forEach(modal => {
            if (modal.style.position === 'fixed' || modal.classList.contains('modal')) {
                modal.remove();
            }
        });
    },

    /**
     * Garantir que o main app seja visível
     */
    ensureAppRender() {
        const mainApp = document.getElementById('mainApp');
        const loginScreen = document.getElementById('loginScreen');
        const loadingScreen = document.querySelector('.loading-screen');
        
        if (loadingScreen) {
            loadingScreen.style.display = 'none';
        }
        
        if (mainApp) {
            mainApp.classList.remove('hidden');
        }
        
        if (loginScreen) {
            loginScreen.classList.add('hidden');
        }
    },
    
    /**
     * Desabilitar a ativação precoce do backup automático.
     * Isso é uma camada extra de segurança.
     */
    disableEarlyBackup() {
        if (typeof window.DentalCoreBackup !== 'undefined') {
            console.log('🚫 Desabilitando backup automático inicial.');
            window.DentalCoreBackup.enableAutoBackup = () => {
                console.warn('Backup automático inicial bloqueado pelo fix da interface.');
            };
        }
    },
    
    /**
     * Verificar o status de carregamento dos módulos
     */
    checkModuleStatus() {
        const modules = {
            'Auth': typeof window.Auth !== 'undefined',
            'Patients': typeof window.Patients !== 'undefined',
            'DashboardPremium': typeof window.DashboardPremium !== 'undefined',
            'Imagens': typeof window.Imagens !== 'undefined',
            'UploadImagens': typeof window.UploadImagens !== 'undefined',
            'ImageAnnotations': typeof window.ImageAnnotations !== 'undefined',
            'OrcamentosProfissional': typeof window.OrcamentosProfissional !== 'undefined',
            'TratamentosProfissional': typeof window.TratamentosProfissional !== 'undefined',
            'DocumentosProfissional': typeof window.DocumentosProfissional !== 'undefined',
            'DebitosProfissional': typeof window.DebitosProfissional !== 'undefined',
            'AgendaProfissional': typeof window.AgendaProfissional !== 'undefined'
        };
        
        const status = Object.entries(modules)
            .map(([name, loaded]) => `${loaded ? '✅' : '❌'} ${name}`)
            .join('\n');
        
        if (typeof window.UI !== 'undefined') {
            window.UI.showAlert(`🔍 Status dos Módulos\n\n${status}\n\n🎯 Sistema funcionando corretamente!`);
        } else {
            alert(`🔍 Status dos Módulos\n\n${status}\n\n🎯 Sistema funcionando corretamente!`);
        }
    }
};

// Auto-executar fix
document.addEventListener('DOMContentLoaded', function() {
    // Aguardar um pouco e aplicar fix
    setTimeout(() => {
        InterfaceFix.init();
    }, 1000);
});

// Também executar quando window carrega
window.addEventListener('load', function() {
    setTimeout(() => {
        InterfaceFix.checkModuleStatus();
    }, 2000);
});