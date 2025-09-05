// ============================================================================
// DENTALCORE PRO - MÓDULO DE PACIENTES - VERSÃO CORRIGIDA
// Interface sofisticada com módulo único de orçamentos profissional
// ============================================================================

const Patients = {
    patients: [],
    searchQuery: '',
    currentView: 'list', // 'list' ou 'profile'
    currentPatient: null,
    currentTab: 'sobre',
    formMode: 'create',

    /**
     * Inicializar módulo
     */
    init() {
        console.log('👥 Módulo de Pacientes Profissional carregado');
        this.loadPatients();
        this.addProfessionalStyles();
    },

    /**
     * Carregar pacientes
     */
    loadPatients() {
        try {
            const patientsData = DataPersistence.getPatients();
            this.patients = Array.isArray(patientsData) ? patientsData : [];
            
            if (this.patients.length === 0) {
                this.patients = this.getDemoPatients();
                DataPersistence.savePatients(this.patients);
            }
            
            console.log('📖 Pacientes carregados:', this.patients.length);
        } catch (error) {
            console.error('Erro ao carregar pacientes:', error);
            this.patients = [];
        }
    },

    /**
     * Dados demo profissionais
     */
    getDemoPatients() {
        return [
            {
                id: 1,
                name: 'Maria Silva Santos',
                phone: '(11) 99999-1234',
                email: 'maria.silva@email.com',
                birthDate: '1990-05-15',
                lastVisit: '2023-11-20',
                status: 'ativo',
                notes: 'Paciente com histórico de sensibilidade nos dentes 24 e 25.'
            },
            {
                id: 2,
                name: 'João Pedro Costa',
                phone: '(21) 98888-5678',
                email: 'joao.costa@email.com',
                birthDate: '1985-08-22',
                lastVisit: '2024-01-10',
                status: 'ativo',
                notes: 'Necessário agendar retorno para avaliação de prótese.'
            },
            {
                id: 3,
                name: 'Ana Carolina Lima',
                phone: '(31) 97777-9012',
                email: 'ana.lima@email.com',
                birthDate: '1998-02-28',
                lastVisit: '2024-01-25',
                status: 'inativo',
                notes: 'Aguardando aprovação de orçamento para clareamento.'
            }
        ];
    },

    /**
     * Renderizar a interface de gerenciamento de pacientes
     */
    renderPatientsInterface() {
        return `
            <div class="patients-management-container p-8">
                <div class="patients-header mb-8">
                    <h1 class="text-3xl font-bold text-slate-100">Gerenciamento de Pacientes</h1>
                    <p class="text-slate-400 mt-2">Visão geral e acesso rápido aos registros dos pacientes.</p>
                </div>

                <div class="search-command-center flex items-center justify-between gap-4 p-4 mb-8 bg-slate-800 rounded-xl shadow-lg">
                    <div class="search-input-container relative flex-grow">
                        <input type="text" id="patientSearchInput" placeholder="Buscar por nome, telefone ou email..." 
                               oninput="Patients.searchPatients(this.value)"
                               class="w-full pl-10 pr-4 py-2 bg-slate-700 rounded-full text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors">
                        <svg class="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
                        </svg>
                    </div>
                    <div class="action-buttons flex gap-2">
                        <button onclick="Patients.showCreateForm()" 
                                class="action-btn bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-6 rounded-full transition-colors flex items-center gap-2">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM12 15a4 4 0 11-8 0 4 4 0 018 0z"/>
                            </svg>
                            Novo Paciente
                        </button>
                    </div>
                </div>

                <div id="patientListContainer" class="patients-professional-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    ${this.renderPatientCards()}
                </div>
            </div>
        `;
    },

    /**
     * Renderizar cartões de pacientes
     */
    renderPatientCards() {
        if (this.patients.length === 0) {
            return `<div class="p-8 text-center text-slate-500 col-span-full">
                        <svg class="w-24 h-24 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1">
                            <path d="M12 4.354V4a1 1 0 00-1-1H3a1 1 0 00-1 1v12a1 1 0 001 1h8.146M15 15.646V20a1 1 0 01-1 1H6a1 1 0 01-1-1V8a1 1 0 011-1h6.146M16 11H4m8-4h.01M16 15h.01m-6.01.01V2.146a.5.5 0 00-.854-.354L5.354 5.354A.5.5 0 005.146 5a.5.5 0 00.354.146L8 7.146M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p class="text-xl font-semibold">Nenhum paciente encontrado.</p>
                        <p class="mt-2 text-sm">Use o botão "Novo Paciente" para começar a gerenciar sua clínica.</p>
                    </div>`;
        }

        const filteredPatients = this.patients.filter(p =>
            p.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
            p.phone.includes(this.searchQuery) ||
            p.email.toLowerCase().includes(this.searchQuery.toLowerCase())
        );

        if (filteredPatients.length === 0) {
            return `<div class="p-8 text-center text-slate-500 col-span-full">
                        <svg class="w-24 h-24 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M15 15.75l-6-6m0 0l-6.146 6.146M12 6V3M15 12h-3m3 3v3M9 12h3m-3-3v3m0 0l-6.146-6.146" />
                        </svg>
                        <p class="text-xl font-semibold">Nenhum resultado para a sua busca.</p>
                        <p class="mt-2 text-sm">Tente uma palavra-chave diferente ou adicione um novo paciente.</p>
                    </div>`;
        }

        return filteredPatients.map(patient => `
            <div onclick="Patients.openProfile(${patient.id})" class="patient-card premium-card cursor-pointer">
                <div class="patient-card-header">
                    <div class="patient-avatar bg-primary-600 text-white">${patient.name.charAt(0)}</div>
                    <div class="patient-info">
                        <h3 class="patient-name">${patient.name}</h3>
                        <p class="patient-contact">
                            ${patient.email ? `<span>${patient.email}</span>` : ''}
                            ${patient.phone ? `<span class="ml-2">${patient.phone}</span>` : ''}
                        </p>
                    </div>
                </div>
                <div class="patient-card-body">
                    <div class="info-item">
                        <svg class="w-4 h-4 text-primary-500 mr-2" fill="currentColor" viewBox="0 0 20 20"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path><path fill-rule="evenodd" d="M.458 10C1.732 5.097 6.002 2 10 2s8.268 3.097 9.542 8c-1.274 4.903-5.544 8-9.542 8S1.732 14.903.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"></path></svg>
                        <span>Última Visita: ${patient.lastVisit ? new Date(patient.lastVisit).toLocaleDateString() : 'N/A'}</span>
                    </div>
                    <div class="info-item">
                        <svg class="w-4 h-4 text-primary-500 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path></svg>
                        <span>Status: <span class="patient-status patient-status-${patient.status}">${patient.status.charAt(0).toUpperCase() + patient.status.slice(1)}</span></span>
                    </div>
                </div>
            </div>
        `).join('');
    },

    /**
     * Buscar pacientes
     */
    searchPatients(query) {
        this.searchQuery = query;
        const patientListContainer = document.getElementById('patientListContainer');
        if (patientListContainer) {
            patientListContainer.innerHTML = this.renderPatientCards();
        }
    },

    /**
     * Mostrar formulário de criação/edição
     */
    showCreateForm(patient = null) {
        this.formMode = patient ? 'edit' : 'create';
        this.currentPatient = patient;

        const content = document.getElementById('content');
        if (!content) return;

        content.innerHTML = this.renderPatientForm();
    },

    /**
     * Renderizar formulário
     */
    renderPatientForm() {
        const patient = this.currentPatient || {};
        const title = this.formMode === 'create' ? 'Novo Paciente' : 'Editar Paciente';
        const submitText = this.formMode === 'create' ? 'Salvar Paciente' : 'Atualizar Paciente';

        return `
            <div class="p-8">
                <div class="premium-card max-w-2xl mx-auto">
                    <h2 class="text-2xl font-bold text-slate-100 mb-6">${title}</h2>
                    <form id="patientForm" onsubmit="Patients.savePatient(event)">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <label for="patientName" class="form-label">Nome Completo</label>
                                <input type="text" id="patientName" name="name" class="form-input" value="${patient.name || ''}" required>
                            </div>
                            <div>
                                <label for="patientPhone" class="form-label">Telefone</label>
                                <input type="tel" id="patientPhone" name="phone" class="form-input" value="${patient.phone || ''}">
                            </div>
                            <div>
                                <label for="patientEmail" class="form-label">Email</label>
                                <input type="email" id="patientEmail" name="email" class="form-input" value="${patient.email || ''}">
                            </div>
                            <div>
                                <label for="patientBirthDate" class="form-label">Data de Nascimento</label>
                                <input type="date" id="patientBirthDate" name="birthDate" class="form-input" value="${patient.birthDate || ''}">
                            </div>
                            <div class="md:col-span-2">
                                <label for="patientNotes" class="form-label">Observações</label>
                                <textarea id="patientNotes" name="notes" rows="4" class="form-input">${patient.notes || ''}</textarea>
                            </div>
                        </div>
                        <div class="flex justify-end gap-4">
                            <button type="button" onclick="Patients.renderMainView()" class="btn-secondary">Cancelar</button>
                            <button type="submit" class="btn-primary">${submitText}</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
    },

    /**
     * Salvar novo paciente ou atualizar existente
     */
    savePatient(event) {
        event.preventDefault();
        const form = event.target;
        const formData = new FormData(form);
        const newPatient = {};
        for (let [key, value] of formData.entries()) {
            newPatient[key] = value;
        }

        if (this.formMode === 'create') {
            newPatient.id = this.patients.length ? Math.max(...this.patients.map(p => p.id)) + 1 : 1;
            newPatient.lastVisit = new Date().toISOString().split('T')[0];
            newPatient.status = 'ativo';
            this.patients.unshift(newPatient);
            UI.showAlert(`✅ Paciente Salvo!\n\n${newPatient.name} foi adicionado com sucesso.`, 'success');
        } else {
            const index = this.patients.findIndex(p => p.id === this.currentPatient.id);
            if (index !== -1) {
                this.patients[index] = { ...this.patients[index], ...newPatient };
                UI.showAlert(`✅ Paciente Atualizado!\n\n${newPatient.name} teve o cadastro atualizado com sucesso.`, 'success');
            }
        }
        
        // Salvar no local storage
        DataPersistence.save('patients', this.patients);
        
        // Voltar para a lista
        this.renderMainView();
    },

    /**
     * Excluir paciente
     */
    deletePatient(patientId) {
        if (confirm('Tem certeza que deseja excluir este paciente? Esta ação não pode ser desfeita.')) {
            this.patients = this.patients.filter(p => p.id !== patientId);
            DataPersistence.save('patients', this.patients);
            UI.showAlert('🗑️ Paciente Excluído!\n\nO registro foi removido permanentemente.', 'error');
            this.renderMainView();
        }
    },

    /**
     * Voltar para a visualização principal
     */
    renderMainView() {
        this.currentView = 'list';
        const content = document.getElementById('content');
        if (content) {
            content.innerHTML = this.renderPatientsInterface();
            this.loadPatients();
        }
    },

    /**
     * Abrir o perfil do paciente
     */
    openProfile(patientId) {
        this.currentPatient = this.patients.find(p => p.id === patientId);
        if (this.currentPatient) {
            this.currentView = 'profile';
            this.currentTab = 'sobre';
            const content = document.getElementById('content');
            if (content) {
                // Renderizar interface do prontuário
                content.innerHTML = this.renderProfileInterface();
            }
        } else {
            UI.showAlert('❌ Paciente não encontrado.', 'error');
        }
    },

    /**
     * Renderizar a interface de perfil do paciente
     */
    renderProfileInterface() {
        if (!this.currentPatient) return '<div>Erro: Paciente não encontrado</div>';

        return `
            <div class="patient-profile-container p-8">
                <div class="patient-header mb-8 flex items-center justify-between gap-4">
                    <div class="flex items-center gap-4">
                        <div class="patient-avatar-large bg-primary-600 text-white">${this.currentPatient.name.charAt(0)}</div>
                        <div>
                            <h2 class="text-3xl font-bold text-slate-100">${this.currentPatient.name}</h2>
                            <p class="text-slate-400">Desde: ${new Date(this.currentPatient.lastVisit).toLocaleDateString()}</p>
                        </div>
                    </div>
                    <div class="action-buttons flex gap-2">
                        <button onclick="Patients.showCreateForm(Patients.currentPatient)" class="btn-tertiary">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.536L15.232 5.232z"></path></svg>
                            Editar
                        </button>
                        <button onclick="Patients.deletePatient(${this.currentPatient.id})" class="btn-danger">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                            Excluir
                        </button>
                        <button onclick="Patients.renderMainView()" class="btn-secondary">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                            Voltar
                        </button>
                    </div>
                </div>

                <div class="profile-tabs flex flex-wrap gap-2 mb-6 border-b border-slate-700 overflow-x-auto">
                    <button onclick="Patients.switchTab('sobre')" class="patient-tab ${this.currentTab === 'sobre' ? 'active' : ''}">Sobre</button>
                    <button onclick="Patients.switchTab('orcamentos')" class="patient-tab ${this.currentTab === 'orcamentos' ? 'active' : ''}">Orçamentos</button>
                    <button onclick="Patients.switchTab('tratamentos')" class="patient-tab ${this.currentTab === 'tratamentos' ? 'active' : ''}">Tratamentos</button>
                    <button onclick="Patients.switchTab('documentos')" class="patient-tab ${this.currentTab === 'documentos' ? 'active' : ''}">Documentos</button>
                    <button onclick="Patients.switchTab('imagens')" class="patient-tab ${this.currentTab === 'imagens' ? 'active' : ''}">Imagens</button>
                    <button onclick="Patients.switchTab('anamnese')" class="patient-tab ${this.currentTab === 'anamnese' ? 'active' : ''}">Anamnese</button>
                </div>
                
                <div id="patientTabContent">
                    </div>
            </div>
        `;
    },

    /**
     * Alternar entre as abas do prontuário
     */
    switchTab(tab) {
        this.currentTab = tab;
        const tabContent = document.getElementById('patientTabContent');
        if (!tabContent) return;

        // Resetar botões de aba
        document.querySelectorAll('.patient-tab').forEach(btn => btn.classList.remove('active'));
        document.querySelector(`.patient-tab[onclick*="'${tab}'"]`).classList.add('active');

        tabContent.innerHTML = '<div class="p-8 text-center text-slate-500">Carregando...</div>';

        // Carregar conteúdo da aba dinamicamente
        switch (tab) {
            case 'sobre':
                tabContent.innerHTML = this.renderAboutTab();
                break;
            case 'orcamentos':
                if (typeof OrcamentosProfissional !== 'undefined') {
                    tabContent.innerHTML = OrcamentosProfissional.renderTabOrcamentos(this.currentPatient);
                } else {
                    tabContent.innerHTML = this.renderModuleNotLoaded('Orçamentos');
                }
                break;
            case 'tratamentos':
                if (typeof TratamentosProfissional !== 'undefined') {
                    tabContent.innerHTML = TratamentosProfissional.renderTabTratamentos(this.currentPatient);
                } else {
                    tabContent.innerHTML = this.renderModuleNotLoaded('Tratamentos');
                }
                break;
            case 'documentos':
                if (typeof DocumentosProfissional !== 'undefined') {
                    tabContent.innerHTML = DocumentosProfissional.renderTabDocumentos(this.currentPatient);
                } else {
                    tabContent.innerHTML = this.renderModuleNotLoaded('Documentos');
                }
                break;
            case 'imagens':
                if (typeof Imagens !== 'undefined') {
                    tabContent.innerHTML = Imagens.renderTabImagens(this.currentPatient);
                } else {
                    tabContent.innerHTML = this.renderModuleNotLoaded('Imagens');
                }
                break;
            case 'anamnese':
                if (typeof Anamnese !== 'undefined') {
                    tabContent.innerHTML = Anamnese.renderTabAnamnese(this.currentPatient);
                } else {
                    tabContent.innerHTML = this.renderModuleNotLoaded('Anamnese');
                }
                break;
            default:
                tabContent.innerHTML = `<div class="p-8 text-center text-slate-500">Aba não encontrada.</div>`;
        }
    },

    /**
     * Renderizar aba "Sobre"
     */
    renderAboutTab() {
        if (!this.currentPatient) return '';

        return `
            <div class="sobre-tab-content premium-card p-6">
                <div class="sobre-grid grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="info-item">
                        <span class="info-label">Nome Completo:</span>
                        <span class="info-value">${this.currentPatient.name}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Email:</span>
                        <span class="info-value">${this.currentPatient.email || 'N/A'}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Telefone:</span>
                        <span class="info-value">${this.currentPatient.phone || 'N/A'}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Data de Nascimento:</span>
                        <span class="info-value">${this.currentPatient.birthDate ? new Date(this.currentPatient.birthDate).toLocaleDateString() : 'N/A'}</span>
                    </div>
                    <div class="info-item md:col-span-2">
                        <span class="info-label">Observações:</span>
                        <p class="info-value-block">${this.currentPatient.notes || 'Nenhuma observação.'}</p>
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * Renderizar mensagem de módulo não carregado
     */
    renderModuleNotLoaded(moduleName) {
        return `
            <div class="text-center text-slate-500 p-12 bg-slate-800 rounded-xl shadow-lg">
                <svg class="w-20 h-20 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.023 3.377 1.624 3.377h14.006c1.602 0 2.49-1.877 1.624-3.377L13.991 6.32c-.866-1.5-3.044-1.5-3.91 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
                <h3 class="text-xl font-bold">Módulo de ${moduleName} não carregado</h3>
                <p class="mt-2 text-sm">Este módulo ainda está em desenvolvimento ou não foi configurado corretamente no sistema.</p>
                <p class="mt-1 text-xs text-slate-600">Verifique os arquivos de dependência e a ordem de carregamento.</p>
            </div>
        `;
    },

    /**
     * Adicionar estilos premium
     */
    addProfessionalStyles() {
        if (!document.getElementById('patientsPremiumStyles')) {
            const styles = document.createElement('style');
            styles.id = 'patientsPremiumStyles';
            styles.textContent = `
                /* GERAL */
                .patients-management-container {
                    background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
                    min-height: calc(100vh - 80px); /* Altura da tela menos header */
                    color: #e2e8f0;
                    font-family: 'Inter', sans-serif;
                }

                .premium-card {
                    background: linear-gradient(135deg, #334155 0%, #1e293b 100%);
                    border: 1px solid rgba(71, 85, 105, 0.4);
                    border-radius: 16px;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.1), 0 1px 3px rgba(0,0,0,0.08);
                    backdrop-filter: blur(5px);
                    -webkit-backdrop-filter: blur(5px);
                    transition: transform 0.2s ease, box-shadow 0.2s ease;
                }
                
                .premium-card:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 10px 15px rgba(0,0,0,0.2), 0 4px 6px rgba(0,0,0,0.1);
                }

                /* BOTÕES PREMIUM */
                .action-btn {
                    background: linear-gradient(135deg, #0d9488 0%, #14b8a6 100%);
                    border: none;
                    color: white;
                    font-weight: 600;
                    transition: all 0.3s ease;
                }

                .action-btn:hover {
                    transform: translateY(-1px) scale(1.02);
                    box-shadow: 0 4px 15px rgba(20, 184, 166, 0.4);
                }

                .btn-primary {
                    background: linear-gradient(135deg, #0d9488 0%, #14b8a6 100%);
                    color: white;
                    padding: 12px 24px;
                    border-radius: 9999px;
                    font-weight: 600;
                    transition: all 0.3s ease;
                    border: none;
                }

                .btn-primary:hover {
                    box-shadow: 0 4px 15px rgba(20, 184, 166, 0.4);
                    transform: translateY(-1px);
                }

                .btn-secondary {
                    background: transparent;
                    color: #94a3b8;
                    border: 1px solid #475569;
                    padding: 12px 24px;
                    border-radius: 9999px;
                    font-weight: 600;
                    transition: all 0.3s ease;
                }

                .btn-secondary:hover {
                    border-color: #64748b;
                    color: #e2e8f0;
                }
                
                .btn-tertiary {
                    background: #334155;
                    color: #64748b;
                    border: none;
                    padding: 8px 16px;
                    border-radius: 9999px;
                    font-weight: 600;
                    transition: all 0.3s ease;
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                }
                
                .btn-tertiary:hover {
                    background: #475569;
                    color: #e2e8f0;
                }

                .btn-danger {
                    background: #b91c1c;
                    color: white;
                    padding: 8px 16px;
                    border-radius: 9999px;
                    font-weight: 600;
                    transition: all 0.3s ease;
                    border: none;
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                }

                .btn-danger:hover {
                    background: #dc2626;
                }

                /* FORMULÁRIO */
                .form-label {
                    display: block;
                    color: #94a3b8;
                    font-size: 0.875rem;
                    font-weight: 500;
                    margin-bottom: 8px;
                }

                .form-input {
                    width: 100%;
                    background-color: #1e293b;
                    border: 1px solid #475569;
                    color: #f1f5f9;
                    padding: 12px 16px;
                    border-radius: 12px;
                    font-size: 1rem;
                    transition: all 0.2s ease;
                }

                .form-input:focus {
                    outline: none;
                    border-color: #14b8a6;
                    box-shadow: 0 0 0 3px rgba(20, 184, 166, 0.5);
                }

                .form-input::placeholder {
                    color: #64748b;
                }
                
                .form-input-group {
                    display: flex;
                    align-items: center;
                    background-color: #1e293b;
                    border: 1px solid #475569;
                    border-radius: 12px;
                    transition: all 0.2s ease;
                }
                
                .form-input-group:focus-within {
                    border-color: #14b8a6;
                    box-shadow: 0 0 0 3px rgba(20, 184, 166, 0.5);
                }
                
                .form-input-group .form-input {
                    border: none;
                    background: transparent;
                    padding-right: 0;
                }
                
                /* TABELA */
                .table-container {
                    overflow-x: auto;
                    background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
                    border-radius: 16px;
                    border: 1px solid rgba(71, 85, 105, 0.4);
                    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                    backdrop-filter: blur(5px);
                }

                .styled-table {
                    width: 100%;
                    border-collapse: collapse;
                    min-width: 700px;
                }

                .styled-table th, .styled-table td {
                    text-align: left;
                    padding: 16px 24px;
                }

                .styled-table th {
                    background-color: rgba(71, 85, 105, 0.2);
                    color: #cbd5e1;
                    font-weight: 600;
                    text-transform: uppercase;
                    font-size: 0.75rem;
                    border-bottom: 1px solid rgba(71, 85, 105, 0.4);
                }

                .styled-table td {
                    color: #e2e8f0;
                    border-bottom: 1px solid rgba(71, 85, 105, 0.2);
                }

                .styled-table tbody tr:last-child td {
                    border-bottom: none;
                }

                .styled-table tbody tr:hover {
                    background-color: rgba(71, 85, 105, 0.1);
                }

                /* STATUS BADGES */
                .status-badge {
                    display: inline-flex;
                    padding: 4px 12px;
                    border-radius: 9999px;
                    font-size: 0.75rem;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }

                .status-badge.draft { background-color: rgba(148, 163, 184, 0.2); color: #94a3b8; }
                .status-badge.pending { background-color: rgba(251, 191, 36, 0.2); color: #facc15; }
                .status-badge.sent { background-color: rgba(52, 211, 153, 0.2); color: #34d399; }
                .status-badge.approved { background-color: rgba(20, 184, 166, 0.2); color: #14b8a6; }
                .status-badge.rejected { background-color: rgba(239, 68, 68, 0.2); color: #ef4444; }
                
                /* TABS */
                .patient-tab {
                    padding: 12px 24px;
                    font-weight: 600;
                    color: #94a3b8;
                    border-bottom: 2px solid transparent;
                    transition: all 0.2s ease;
                    cursor: pointer;
                    white-space: nowrap;
                }
                
                .patient-tab:hover {
                    color: #cbd5e1;
                }

                .patient-tab.active {
                    color: #14b8a6;
                    border-color: #14b8a6;
                }
                
                /* PACIENT CARD */
                .patient-card {
                    padding: 24px;
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                }
                
                .patient-card-header {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                }
                
                .patient-avatar {
                    width: 56px;
                    height: 56px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 24px;
                    font-weight: 600;
                    flex-shrink: 0;
                }
                
                .patient-info .patient-name {
                    font-size: 1.25rem;
                    font-weight: 600;
                    color: #f1f5f9;
                }
                
                .patient-info .patient-contact {
                    font-size: 0.875rem;
                    color: #94a3b8;
                    margin-top: 4px;
                }
                
                .patient-card-body {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                    color: #cbd5e1;
                    font-size: 0.875rem;
                }
                
                .info-item {
                    display: flex;
                    align-items: center;
                    font-size: 0.875rem;
                }
                
                .patient-status {
                    font-weight: 600;
                    font-size: 0.75rem;
                    padding: 4px 8px;
                    border-radius: 9999px;
                    text-transform: uppercase;
                }
                
                .patient-status-ativo { background-color: rgba(20, 184, 166, 0.2); color: #14b8a6; }
                .patient-status-inativo { background-color: rgba(148, 163, 184, 0.2); color: #94a3b8; }
                
                .patient-avatar-large {
                    width: 80px;
                    height: 80px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 36px;
                    font-weight: 600;
                    flex-shrink: 0;
                }
                
                /* TAB SOBRE */
                .sobre-tab-content {
                    color: #e2e8f0;
                }
                
                .sobre-tab-content .info-label {
                    color: #94a3b8;
                    font-weight: 500;
                    font-size: 0.875rem;
                    margin-bottom: 4px;
                    display: block;
                }
                
                .sobre-tab-content .info-value {
                    color: #f1f5f9;
                    font-size: 1rem;
                }
                
                .sobre-tab-content .info-value-block {
                    background-color: #1e293b;
                    border: 1px solid #475569;
                    padding: 12px;
                    border-radius: 8px;
                    font-size: 0.95rem;
                    white-space: pre-wrap;
                }

                /* RESPONSIVIDADE */
                @media (max-width: 1024px) {
                    .patients-professional-grid {
                        grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
                    }
                    
                    .search-command-center {
                        flex-direction: column;
                        gap: 16px;
                    }
                    
                    .profile-tabs {
                        justify-content: flex-start;
                    }
                }

                @media (max-width: 768px) {
                    .patients-management-container {
                        padding: 16px;
                    }
                    
                    .patients-professional-grid {
                        grid-template-columns: 1fr;
                    }
                    
                    .profile-header {
                        flex-direction: column;
                        gap: 16px;
                        text-align: center;
                    }
                    
                    .sobre-grid {
                        grid-template-columns: 1fr;
                    }
                }
            `;
            document.head.appendChild(styles);
        }
    }
};

// Exportar para uso global
window.Patients = Patients;

console.log('👥 Módulo de Pacientes - VERSÃO CORRIGIDA COM FORMATAÇÃO carregado!');