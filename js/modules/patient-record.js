// ============================================================================
// DENTALCORE PRO - PATIENT RECORD PREMIUM - VERSÃO CORRIGIDA
// ============================================================================

const PatientRecordPremium = {
    currentPatient: null,
    activeTab: 'sobre',

    /**
     * Abrir registro do paciente
     */
    openPatientRecord(patient) {
        console.log('👤 Abrindo registro do paciente:', patient.name);
        
        this.currentPatient = patient;
        this.activeTab = 'sobre';
        
        // Limpar conteúdo atual
        const content = document.getElementById('content');
        if (!content) {
            console.error('❌ Elemento #content não encontrado');
            return;
        }
        
        content.innerHTML = this.renderPatientInterface();
        
        // Carregar aba inicial
        this.switchTab('sobre');
    },

    /**
     * Renderizar interface do paciente
     */
    renderPatientInterface() {
        if (!this.currentPatient) {
            console.error('❌ Nenhum paciente selecionado');
            return '<div class="error">Erro: Nenhum paciente selecionado</div>';
        }

        return `
            <div class="patient-record-workspace">
                <!-- Cabeçalho do Paciente -->
                <div class="patient-header-card">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-6">
                            <div class="patient-avatar-large">
                                ${this.getPatientInitials(this.currentPatient.name)}
                            </div>
                            <div>
                                <h1 class="text-3xl font-bold text-white mb-2">${this.currentPatient.name}</h1>
                                <div class="flex items-center space-x-4 text-gray-300">
                                    <span>📧 ${this.currentPatient.email || 'Email não informado'}</span>
                                    <span>📞 ${this.currentPatient.phone || 'Telefone não informado'}</span>
                                    <span>🎂 ${this.calculateAge(this.currentPatient.birthDate)} anos</span>
                                </div>
                            </div>
                        </div>
                        <div class="flex items-center space-x-3">
                            <button onclick="PatientRecordPremium.closeRecord()" class="close-btn">
                                <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Navegação por Abas -->
                <div class="tabs-navigation">
                    <button onclick="PatientRecordPremium.switchTab('sobre')" 
                            class="tab-btn ${this.activeTab === 'sobre' ? 'active' : ''}" 
                            data-tab="sobre">
                        👤 Sobre
                    </button>
                    <button onclick="PatientRecordPremium.switchTab('anamnese')" 
                            class="tab-btn ${this.activeTab === 'anamnese' ? 'active' : ''}" 
                            data-tab="anamnese">
                        📝 Anamnese
                    </button>
                    <button onclick="PatientRecordPremium.switchTab('tratamentos')" 
                            class="tab-btn ${this.activeTab === 'tratamentos' ? 'active' : ''}" 
                            data-tab="tratamentos">
                        🦷 Tratamentos
                    </button>
                    <button onclick="PatientRecordPremium.switchTab('orcamentos')" 
                            class="tab-btn ${this.activeTab === 'orcamentos' ? 'active' : ''}" 
                            data-tab="orcamentos">
                        💰 Orçamentos
                    </button>
                    <button onclick="PatientRecordPremium.switchTab('imagens')" 
                            class="tab-btn ${this.activeTab === 'imagens' ? 'active' : ''}" 
                            data-tab="imagens">
                        📸 Imagens
                    </button>
                </div>

                <!-- Conteúdo da Aba -->
                <div id="tabContent" class="tab-content">
                    <!-- Conteúdo será carregado dinamicamente -->
                </div>
            </div>
        `;
    },

    /**
     * Alternar entre abas
     */
switchTab(tabName) {
        if (!this.currentPatient) {
            console.error('❌ Nenhum paciente selecionado.');
            return;
        }

        this.activeTab = tabName;
        const tabContentElement = document.getElementById('tabContent');

        let contentHTML = '';
        let moduleExists = false;

        // Resetar abas ativas
        document.querySelectorAll('.patient-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`.patient-tab[data-tab='${tabName}']`).classList.add('active');

        // Lógica para renderizar o conteúdo de cada aba
        switch (tabName) {
            case 'anamnese':
                if (typeof Anamnese !== 'undefined' && Anamnese.renderTabAnamnese) {
                    contentHTML = Anamnese.renderTabAnamnese(this.currentPatient);
                    moduleExists = true;
                }
                break;
            case 'tratamentos':
                if (typeof TratamentosProfissional !== 'undefined' && TratamentosProfissional.renderTabTratamentos) {
                    contentHTML = TratamentosProfissional.renderTabTratamentos(this.currentPatient);
                    moduleExists = true;
                }
                break;
            case 'orcamentos':
                if (typeof OrcamentosProfissional !== 'undefined' && OrcamentosProfissional.renderTabOrcamentos) {
                    contentHTML = OrcamentosProfissional.renderTabOrcamentos(this.currentPatient);
                    moduleExists = true;
                }
                break;
            case 'documentos':
                if (typeof DocumentosProfissional !== 'undefined' && DocumentosProfissional.renderTabDocumentos) {
                    contentHTML = DocumentosProfissional.renderTabDocumentos(this.currentPatient);
                    moduleExists = true;
                }
                break;
            case 'debitos':
                if (typeof DebitosProfissional !== 'undefined' && DebitosProfissional.renderTabDebitos) {
                    contentHTML = DebitosProfissional.renderTabDebitos(this.currentPatient);
                    moduleExists = true;
                }
                break;
            case 'imagens':
                 if (typeof Imagens !== 'undefined' && Imagens.renderTabImagens) {
                    contentHTML = Imagens.renderTabImagens(this.currentPatient);
                    moduleExists = true;
                }
                break;
            default: // Aba 'sobre' ou qualquer outra
                contentHTML = this.renderAboutTab(this.currentPatient);
                moduleExists = true;
                break;
        }

        if (moduleExists) {
            tabContentElement.innerHTML = contentHTML;
        } else {
            tabContentElement.innerHTML = `
                <div class="p-8 text-center text-slate-400">
                    <h3 class="text-xl font-bold mb-2">Módulo Não Encontrado</h3>
                    <p>O módulo para a aba '${tabName}' não foi carregado corretamente ou não existe.</p>
                </div>
            `;
            console.error(`❌ Módulo para a aba '${tabName}' não encontrado.`);
        }
    },

    /**
     * Renderizar placeholder para módulos não carregados
     */
    renderPlaceholder(moduleName, icon, message) {
        return `
            <div class="placeholder-content">
                <div class="placeholder-icon">${icon}</div>
                <h3 class="placeholder-title">${moduleName}</h3>
                <p class="placeholder-message">${message}</p>
                <button onclick="location.reload()" class="reload-btn">
                    🔄 Recarregar Página
                </button>
            </div>
        `;
    },

    /**
     * Renderizar erro
     */
    renderError(tabName, errorMessage) {
        return `
            <div class="error-content">
                <div class="error-icon">❌</div>
                <h3 class="error-title">Erro na aba ${tabName}</h3>
                <p class="error-message">${errorMessage}</p>
                <button onclick="location.reload()" class="reload-btn">
                    🔄 Recarregar Página
                </button>
            </div>
        `;
    },

    /**
     * Fechar registro do paciente
     */
    closeRecord() {
        this.currentPatient = null;
        this.activeTab = 'sobre';
        
        // Voltar para a lista de pacientes
        if (typeof window.Patients !== 'undefined' && window.Patients.renderPatientsInterface) {
            document.getElementById('content').innerHTML = window.Patients.renderPatientsInterface();
        } else {
            location.reload();
        }
    },

    /**
     * Funções auxiliares
     */
    getPatientInitials(name) {
        return name
            .split(' ')
            .map(word => word.charAt(0).toUpperCase())
            .slice(0, 2)
            .join('');
    },

    calculateAge(birthDate) {
        if (!birthDate) return 'N/A';
        
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        
        return age;
    },

    formatDate(dateString) {
        if (!dateString) return 'Não informado';
        
        try {
            return new Date(dateString).toLocaleDateString('pt-BR');
        } catch (e) {
            return 'Data inválida';
        }
    }
};

// Auto-inicializar
document.addEventListener('DOMContentLoaded', function() {
    console.log('👤 PatientRecordPremium carregado');
});

// Exportar para uso global
window.PatientRecordPremium = PatientRecordPremium;

// Adicionar estilos se não existirem
if (!document.getElementById('patientRecordStyles')) {
    const styles = document.createElement('style');
    styles.id = 'patientRecordStyles';
    styles.textContent = `
        .patient-record-workspace {
            background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
            min-height: 100vh;
            padding: 24px;
        }
        
        .patient-header-card {
            background: linear-gradient(135deg, #334155 0%, #1e293b 100%);
            border: 1px solid rgba(71, 85, 105, 0.3);
            border-radius: 20px;
            padding: 24px;
            margin-bottom: 24px;
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.4);
        }
        
        .patient-avatar-large {
            width: 80px;
            height: 80px;
            border-radius: 20px;
            background: linear-gradient(135deg, #0e7490 0%, #0d9488 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            font-size: 28px;
            color: white;
            box-shadow: 0 8px 25px rgba(14, 116, 144, 0.3);
        }
        
        .tabs-navigation {
            display: flex;
            background: linear-gradient(135deg, #334155 0%, #1e293b 100%);
            border: 1px solid rgba(71, 85, 105, 0.3);
            border-radius: 16px;
            padding: 8px;
            margin-bottom: 24px;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
        }
        
        .tab-btn {
            flex: 1;
            background: transparent;
            border: none;
            border-radius: 12px;
            color: #94a3b8;
            font-weight: 500;
            padding: 12px 16px;
            cursor: pointer;
            transition: all 0.3s ease;
            font-size: 14px;
        }
        
        .tab-btn:hover {
            color: #e2e8f0;
            background: rgba(148, 163, 184, 0.1);
        }
        
        .tab-btn.active {
            background: linear-gradient(135deg, #0e7490 0%, #0d9488 100%);
            color: white;
            box-shadow: 0 4px 15px rgba(14, 116, 144, 0.3);
        }
        
        .tab-content {
            background: linear-gradient(135deg, #334155 0%, #1e293b 100%);
            border: 1px solid rgba(71, 85, 105, 0.3);
            border-radius: 20px;
            min-height: 400px;
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.4);
        }
        
        .sobre-workspace {
            background: transparent;
        }
        
        .info-card {
            background: rgba(30, 41, 59, 0.6);
            border: 1px solid rgba(148, 163, 184, 0.2);
            border-radius: 16px;
            padding: 24px;
        }
        
        .card-title {
            color: #f1f5f9;
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 20px;
        }
        
        .info-grid {
            display: grid;
            gap: 16px;
        }
        
        .info-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-bottom: 12px;
            border-bottom: 1px solid rgba(148, 163, 184, 0.1);
        }
        
        .info-label {
            color: #94a3b8;
            font-weight: 500;
        }
        
        .info-value {
            color: #f1f5f9;
            font-weight: 600;
        }
        
        .summary-stats {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 16px;
        }
        
        .stat-item {
            text-align: center;
            padding: 16px;
            background: rgba(14, 116, 144, 0.1);
            border-radius: 12px;
        }
        
        .stat-number {
            font-size: 24px;
            font-weight: 700;
            color: #0d9488;
            margin-bottom: 4px;
        }
        
        .stat-label {
            color: #94a3b8;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .quick-actions {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
        }
        
        .quick-action-btn {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 16px;
            background: rgba(14, 116, 144, 0.1);
            border: 1px solid rgba(14, 116, 144, 0.2);
            border-radius: 12px;
            color: #f1f5f9;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .quick-action-btn:hover {
            background: rgba(14, 116, 144, 0.2);
            transform: translateY(-2px);
        }
        
        .btn-icon {
            font-size: 24px;
            margin-bottom: 8px;
        }
        
        .btn-text {
            font-size: 12px;
            font-weight: 500;
        }
        
        .activity-list {
            space-y: 12px;
        }
        
        .activity-item {
            display: flex;
            align-items: center;
            space-x: 12px;
            padding: 12px;
            background: rgba(14, 116, 144, 0.05);
            border-radius: 8px;
        }
        
        .activity-icon {
            font-size: 20px;
            margin-right: 12px;
        }
        
        .activity-title {
            color: #f1f5f9;
            font-weight: 500;
            font-size: 14px;
        }
        
        .activity-date {
            color: #94a3b8;
            font-size: 12px;
        }
        
        .close-btn {
            background: rgba(239, 68, 68, 0.2);
            border: 1px solid rgba(239, 68, 68, 0.3);
            border-radius: 12px;
            color: #f87171;
            padding: 8px;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .close-btn:hover {
            background: rgba(239, 68, 68, 0.3);
            transform: scale(1.05);
        }
        
        .placeholder-content, .error-content {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 400px;
            text-align: center;
            padding: 40px;
        }
        
        .placeholder-icon, .error-icon {
            font-size: 64px;
            margin-bottom: 16px;
        }
        
        .placeholder-title, .error-title {
            color: #f1f5f9;
            font-size: 24px;
            font-weight: 600;
            margin-bottom: 12px;
        }
        
        .placeholder-message, .error-message {
            color: #94a3b8;
            margin-bottom: 24px;
            max-width: 400px;
        }
        
        .reload-btn {
            background: linear-gradient(135deg, #0e7490 0%, #0d9488 100%);
            border: none;
            border-radius: 12px;
            color: white;
            font-weight: 600;
            padding: 12px 24px;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .reload-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(14, 116, 144, 0.4);
        }
    `;
    document.head.appendChild(styles);
}

console.log('👤 Módulo PatientRecordPremium carregado com verificações de segurança!');