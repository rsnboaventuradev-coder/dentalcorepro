// ============================================================================
// DENTALCORE PRO - SISTEMA DE BACKUP/RESTORE REAL (CORRIGIDO)
// Backup completo de todos os dados do sistema
// ============================================================================

const DentalCoreBackup = {
    
    /**
     * Fazer backup completo do sistema
     */
    async createBackup() {
        try {
            const backupData = {
                version: '2.0.0',
                timestamp: new Date().toISOString(),
                data: await this.collectAllData()
            };

            const filename = `dentalcore_backup_${new Date().toISOString().split('T')[0]}_${Date.now()}.json`;
            
            const blob = new Blob([JSON.stringify(backupData, null, 2)], {
                type: 'application/json'
            });
            
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            this.showAlert('✅ Backup Criado', 
                `Backup realizado com sucesso!\n\n` +
                `Arquivo: ${filename}\n` +
                `Tamanho: ${this.formatFileSize(blob.size)}\n` +
                `Data: ${new Date().toLocaleString('pt-BR')}\n\n` +
                `Guarde este arquivo em local seguro.`
            );

            // Registrar backup no histórico
            this.registerBackupInHistory(filename, blob.size);

        } catch (error) {
            console.error('❌ Erro ao criar backup:', error);
            this.showAlert('❌ Erro no Backup', 
                `Falha ao criar backup:\n${error.message}\n\nTente novamente.`
            );
        }
    },

    /**
     * Coletar todos os dados do sistema
     */
    async collectAllData() {
        const data = {};

        // Dados de pacientes
        if (typeof DataPersistence !== 'undefined') {
            data.patients = DataPersistence.getPatients?.() || [];
        }

        // Dados de orçamentos
        if (typeof window.OrcamentosProfissional !== 'undefined') {
            data.quotes = OrcamentosProfissional.quotes || [];
        }

        // Dados de tratamentos
        if (typeof window.TratamentosProfissional !== 'undefined') {
            data.treatments = TratamentosProfissional.currentTreatments || [];
            data.treatmentPlans = TratamentosProfissional.treatmentPlans || [];
        }

        // Dados de débitos
        if (typeof window.DebitosProfissional !== 'undefined') {
            data.debits = DebitosProfissional.patientDebits || [];
            data.transactions = DebitosProfissional.transactionHistory || [];
        }

        // Dados de agenda
        if (typeof window.AgendaProfissional !== 'undefined') {
            data.appointments = AgendaProfissional.appointments || [];
            data.scheduleSettings = AgendaProfissional.currentSchedule || {};
        }

        // Dados de documentos
        if (typeof window.DocumentosProfissional !== 'undefined') {
            data.documents = DocumentosProfissional.documents || [];
        }

        // Configurações do sistema
        data.settings = this.getSystemSettings();

        return data;
    },

    /**
     * Obter configurações do sistema
     */
    getSystemSettings() {
        return {
            clinic: {
                name: localStorage.getItem('clinic_name') || 'DentalCore Pro',
                address: localStorage.getItem('clinic_address') || '',
                phone: localStorage.getItem('clinic_phone') || '',
                email: localStorage.getItem('clinic_email') || ''
            },
            system: {
                theme: localStorage.getItem('system_theme') || 'auto',
                language: localStorage.getItem('system_language') || 'pt-BR',
                timezone: localStorage.getItem('system_timezone') || 'America/Sao_Paulo'
            },
            lastBackup: localStorage.getItem('last_backup_date'),
            backupHistory: JSON.parse(localStorage.getItem('backup_history') || '[]')
        };
    },

    /**
     * Restaurar backup do sistema
     */
    async restoreBackup() {
        try {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.json';
            
            input.onchange = async (event) => {
                const file = event.target.files[0];
                if (!file) return;

                try {
                    const text = await file.text();
                    const backupData = JSON.parse(text);

                    // Validar estrutura do backup
                    if (!this.validateBackupData(backupData)) {
                        throw new Error('Arquivo de backup inválido ou corrompido');
                    }

                    // Confirmar restauração
                    this.showConfirmDialog(
                        'Confirmar Restauração',
                        `⚠️ ATENÇÃO: Esta ação irá SUBSTITUIR todos os dados atuais!\n\n` +
                        `Backup: ${file.name}\n` +
                        `Data: ${new Date(backupData.timestamp).toLocaleString('pt-BR')}\n` +
                        `Versão: ${backupData.version}\n\n` +
                        `Deseja continuar?`,
                        () => this.performRestore(backupData)
                    );

                } catch (error) {
                    this.showAlert('❌ Erro na Restauração', 
                        `Falha ao ler arquivo de backup:\n${error.message}`
                    );
                }
            };

            input.click();

        } catch (error) {
            console.error('❌ Erro ao restaurar backup:', error);
            this.showAlert('❌ Erro na Restauração', 
                `Falha ao restaurar backup:\n${error.message}`
            );
        }
    },

    /**
     * Validar dados do backup
     */
    validateBackupData(backupData) {
        return backupData && 
               backupData.version && 
               backupData.timestamp && 
               backupData.data &&
               typeof backupData.data === 'object';
    },

    /**
     * Realizar restauração dos dados
     */
    async performRestore(backupData) {
        try {
            const data = backupData.data;

            // Restaurar dados de pacientes
            if (data.patients && typeof DataPersistence !== 'undefined') {
                localStorage.setItem('patients', JSON.stringify(data.patients));
            }

            // Restaurar orçamentos
            if (data.quotes && typeof window.OrcamentosProfissional !== 'undefined') {
                OrcamentosProfissional.quotes = data.quotes;
            }

            // Restaurar tratamentos
            if (data.treatments && typeof window.TratamentosProfissional !== 'undefined') {
                TratamentosProfissional.currentTreatments = data.treatments;
                TratamentosProfissional.treatmentPlans = data.treatmentPlans || [];
            }

            // Restaurar débitos
            if (data.debits && typeof window.DebitosProfissional !== 'undefined') {
                DebitosProfissional.patientDebits = data.debits;
                DebitosProfissional.transactionHistory = data.transactions || [];
                DebitosProfissional.loadFinancialData();
            }

            // Restaurar agenda
            if (data.appointments && typeof window.AgendaProfissional !== 'undefined') {
                AgendaProfissional.appointments = data.appointments;
                AgendaProfissional.loadAppointments();
            }

            // Restaurar documentos
            if (data.documents && typeof window.DocumentosProfissional !== 'undefined') {
                DocumentosProfissional.documents = data.documents;
            }

            // Restaurar configurações
            if (data.settings) {
                this.restoreSystemSettings(data.settings);
            }

            // Recarregar página para aplicar mudanças
            this.showAlert('✅ Restauração Concluída', 
                `Backup restaurado com sucesso!\n\n` +
                `Data do backup: ${new Date(backupData.timestamp).toLocaleString('pt-BR')}\n` +
                `Versão: ${backupData.version}\n\n` +
                `A página será recarregada para aplicar as mudanças.`,
                () => {
                    window.location.reload();
                }
            );

        } catch (error) {
            console.error('❌ Erro ao realizar restauração:', error);
            this.showAlert('❌ Erro na Restauração', 
                `Falha ao restaurar dados:\n${error.message}\n\nAlguns dados podem ter sido parcialmente restaurados.`
            );
        }
    },

    /**
     * Restaurar configurações do sistema
     */
    restoreSystemSettings(settings) {
        if (settings.clinic) {
            Object.keys(settings.clinic).forEach(key => {
                localStorage.setItem(`clinic_${key}`, settings.clinic[key]);
            });
        }

        if (settings.system) {
            Object.keys(settings.system).forEach(key => {
                localStorage.setItem(`system_${key}`, settings.system[key]);
            });
        }
    },

    /**
     * Registrar backup no histórico
     */
    registerBackupInHistory(filename, size) {
        const history = JSON.parse(localStorage.getItem('backup_history') || '[]');
        
        history.unshift({
            filename,
            size,
            date: new Date().toISOString(),
            timestamp: Date.now()
        });

        // Manter apenas os últimos 10 backups no histórico
        if (history.length > 10) {
            history.splice(10);
        }

        localStorage.setItem('backup_history', JSON.stringify(history));
        localStorage.setItem('last_backup_date', new Date().toISOString());
    },

    /**
     * Obter histórico de backups
     */
    getBackupHistory() {
        return JSON.parse(localStorage.getItem('backup_history') || '[]');
    },

    /**
     * Formatar tamanho de arquivo
     */
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    },

    /**
     * Backup automático periódico
     */
    enableAutoBackup() {
        // Verificar se já foi feito backup hoje
        const lastBackup = localStorage.getItem('last_backup_date');
        const today = new Date().toDateString();
        
        if (!lastBackup || new Date(lastBackup).toDateString() !== today) {
            // Perguntar se deseja fazer backup automático
            setTimeout(() => {
                this.showConfirmDialog(
                    'Backup Automático',
                    `🔄 Backup automático diário\n\n` +
                    `Último backup: ${lastBackup ? new Date(lastBackup).toLocaleDateString('pt-BR') : 'Nunca'}\n\n` +
                    `Deseja fazer backup dos dados agora?`,
                    () => this.createBackup()
                );
            }, 2000);
        }
    },

    /**
     * Mostrar dialog de confirmação (CORRIGIDO)
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
        
        const modalContent = document.createElement('div');
        modalContent.style.cssText = `
            background: linear-gradient(135deg, #1e3a8a 0%, #374151 100%);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 16px;
            max-width: 500px;
            width: 90%;
            margin: 20px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
            color: #f8fafc;
        `;
        
        modalContent.innerHTML = `
            <div style="padding: 24px 24px 0 24px;">
                <h3 style="font-size: 20px; font-weight: 600; margin: 0; color: #ffffff;">${title}</h3>
            </div>
            <div style="padding: 16px 24px;">
                <p style="color: #d1d5db; line-height: 1.5; margin: 0; white-space: pre-line;">${message}</p>
            </div>
            <div style="padding: 0 24px 24px 24px; display: flex; justify-content: flex-end; gap: 12px;">
                <button class="cancel-btn" style="
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
        `;
        
        modal.appendChild(modalContent);
        
        // Event listeners para os botões
        const cancelBtn = modalContent.querySelector('.cancel-btn');
        const confirmBtn = modalContent.querySelector('.confirm-btn');
        
        cancelBtn.addEventListener('click', () => {
            modal.remove();
        });
        
        confirmBtn.addEventListener('click', () => {
            modal.remove();
            if (onConfirm && typeof onConfirm === 'function') {
                onConfirm();
            }
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
        
        document.body.appendChild(modal);
    },

    /**
     * Mostrar alerta (CORRIGIDO)
     */
    showAlert(title, message, onClose = null) {
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
        
        const modalContent = document.createElement('div');
        modalContent.style.cssText = `
            background: linear-gradient(135deg, #1e3a8a 0%, #374151 100%);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 16px;
            max-width: 450px;
            width: 90%;
            margin: 20px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
            color: #f8fafc;
        `;
        
        modalContent.innerHTML = `
            <div style="padding: 24px 24px 0 24px;">
                <h3 style="font-size: 20px; font-weight: 600; margin: 0; color: #ffffff;">${title}</h3>
            </div>
            <div style="padding: 16px 24px;">
                <p style="color: #d1d5db; line-height: 1.5; margin: 0; white-space: pre-line;">${message}</p>
            </div>
            <div style="padding: 0 24px 24px 24px; display: flex; justify-content: flex-end;">
                <button class="ok-btn" style="
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
        `;
        
        modal.appendChild(modalContent);
        
        // Event listener para o botão OK
        const okBtn = modalContent.querySelector('.ok-btn');
        okBtn.addEventListener('click', () => {
            modal.remove();
            if (onClose && typeof onClose === 'function') {
                onClose();
            }
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
        
        document.body.appendChild(modal);
    }
};

// Auto-habilitar backup automático quando a página carrega
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        DentalCoreBackup.enableAutoBackup();
    }, 3000);
});

// Exportar para uso global
window.DentalCoreBackup = DentalCoreBackup;

console.log('💾 Sistema de Backup/Restore carregado!');