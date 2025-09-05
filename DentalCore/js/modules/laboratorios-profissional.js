// ============================================================================
// DENTALCORE PRO - MÓDULO DE CONTROLE DE LABORATÓRIOS PREMIUM
// Hub de Controle de Próteses com gestão completa de casos e prazos
// Paleta: Azul-marinho, Carvão e Azul-petróleo
// ============================================================================

const LaboratoriosProfissional = {
    // Estado atual do sistema de laboratórios
    currentLab: {
        selectedCase: null,
        selectedLab: null,
        filter: 'todos',
        sortBy: 'dataEnvio',
        viewMode: 'cards'
    },

    // Laboratórios cadastrados
    laboratories: [
        {
            id: 1,
            name: 'Lab Dental Excellence',
            contact: 'Dr. Roberto Silva',
            phone: '(11) 3456-7890',
            email: 'contato@labexcellence.com.br',
            address: 'Rua das Próteses, 123 - São Paulo/SP',
            specialties: ['Prótese Total', 'Prótese Parcial', 'Implantes', 'Ortodontia'],
            averageDelivery: 7,
            rating: 4.8,
            status: 'ativo'
        },
        {
            id: 2,
            name: 'ProLab Digital',
            contact: 'Dra. Marina Costa',
            phone: '(11) 2345-6789',
            email: 'digital@prolab.com.br',
            address: 'Av. Tecnológica, 456 - São Paulo/SP',
            specialties: ['CAD/CAM', 'Implantes', 'Estética'],
            averageDelivery: 5,
            rating: 4.9,
            status: 'ativo'
        },
        {
            id: 3,
            name: 'Laboratório Premium',
            contact: 'Carlos Mendes',
            phone: '(11) 4567-8901',
            email: 'premium@labpremium.com.br',
            address: 'Rua Premium, 789 - São Paulo/SP',
            specialties: ['Prótese Total', 'Estética', 'Ortodontia'],
            averageDelivery: 10,
            rating: 4.7,
            status: 'ativo'
        }
    ],

    // Casos de laboratório
    laboratoryCases: [
        {
            id: 1,
            patientId: 1,
            patientName: 'Maria Silva Santos',
            laboratoryId: 1,
            laboratoryName: 'Lab Dental Excellence',
            caseType: 'Prótese Parcial Superior',
            material: 'Acrílico com grampos em CoCr',
            dateCreated: '2024-11-15',
            dateSent: '2024-11-16',
            expectedDelivery: '2024-11-23',
            actualDelivery: null,
            status: 'em-producao',
            priority: 'normal',
            cost: 850.00,
            paid: false,
            notes: 'Paciente prefere cor mais clara. Atenção especial aos contatos oclusais.',
            files: [],
            history: [
                { date: '2024-11-15', action: 'Caso criado', user: 'Dr. Responsável' },
                { date: '2024-11-16', action: 'Enviado para laboratório', user: 'Dr. Responsável' }
            ]
        },
        {
            id: 2,
            patientId: 2,
            patientName: 'João Carlos Oliveira',
            laboratoryId: 2,
            laboratoryName: 'ProLab Digital',
            caseType: 'Coroa Cerâmica',
            material: 'Zircônia translúcida',
            dateCreated: '2024-11-10',
            dateSent: '2024-11-11',
            expectedDelivery: '2024-11-18',
            actualDelivery: '2024-11-17',
            status: 'concluido',
            priority: 'alta',
            cost: 1200.00,
            paid: true,
            notes: 'Dente 11. Cor A2. Paciente jovem, priorizar estética.',
            files: [],
            history: [
                { date: '2024-11-10', action: 'Caso criado', user: 'Dr. Responsável' },
                { date: '2024-11-11', action: 'Enviado para laboratório', user: 'Dr. Responsável' },
                { date: '2024-11-17', action: 'Recebido do laboratório', user: 'Dr. Responsável' },
                { date: '2024-11-17', action: 'Caso finalizado', user: 'Dr. Responsável' }
            ]
        },
        {
            id: 3,
            patientId: 3,
            patientName: 'Ana Paula Costa',
            laboratoryId: 1,
            laboratoryName: 'Lab Dental Excellence',
            caseType: 'Prótese Total Superior e Inferior',
            material: 'Acrílico convencional',
            dateCreated: '2024-11-12',
            dateSent: '2024-11-13',
            expectedDelivery: '2024-11-25',
            actualDelivery: null,
            status: 'aguardando-retorno',
            priority: 'normal',
            cost: 1500.00,
            paid: false,
            notes: 'Primeira prótese total da paciente. Orientar sobre adaptação.',
            files: [],
            history: [
                { date: '2024-11-12', action: 'Caso criado', user: 'Dr. Responsável' },
                { date: '2024-11-13', action: 'Enviado para laboratório', user: 'Dr. Responsável' },
                { date: '2024-11-20', action: 'Prótese pronta - aguardando retirada', user: 'Lab Dental Excellence' }
            ]
        }
    ],

    // Tipos de próteses
    prothesisTypes: [
        'Prótese Total Superior',
        'Prótese Total Inferior',
        'Prótese Total Superior e Inferior',
        'Prótese Parcial Superior',
        'Prótese Parcial Inferior',
        'Coroa Unitária',
        'Ponte Fixa',
        'Implante Unitário',
        'Prótese sobre Implante',
        'Faceta Cerâmica',
        'Onlay/Inlay',
        'Aparelho Ortodôntico',
        'Contenção Ortodôntica',
        'Placa Oclusal',
        'Outros'
    ],

    // Materiais
    materials: [
        'Acrílico Convencional',
        'Acrílico com Grampos CoCr',
        'Acrílico com Grampos Estéticos',
        'Silicone Flexível',
        'Porcelana Feldspática',
        'Cerâmica Prensada',
        'Zircônia',
        'Zircônia Translúcida',
        'Metal Cerâmica',
        'Resina Composta',
        'Titânio',
        'Liga Áurea',
        'Liga de CoCr',
        'Outros'
    ],

    // Status dos casos
    statusConfig: {
        'rascunho': {
            label: 'Rascunho',
            color: '#6b7280',
            bgColor: 'rgba(107, 114, 128, 0.1)',
            icon: '📝'
        },
        'enviado': {
            label: 'Enviado',
            color: '#3b82f6',
            bgColor: 'rgba(59, 130, 246, 0.1)',
            icon: '📤'
        },
        'em-producao': {
            label: 'Em Produção',
            color: '#f59e0b',
            bgColor: 'rgba(245, 158, 11, 0.1)',
            icon: '🔧'
        },
        'aguardando-retorno': {
            label: 'Aguardando Retorno',
            color: '#8b5cf6',
            bgColor: 'rgba(139, 92, 246, 0.1)',
            icon: '⏳'
        },
        'concluido': {
            label: 'Concluído',
            color: '#10b981',
            bgColor: 'rgba(16, 185, 129, 0.1)',
            icon: '✅'
        },
        'cancelado': {
            label: 'Cancelado',
            color: '#ef4444',
            bgColor: 'rgba(239, 68, 68, 0.1)',
            icon: '❌'
        }
    },

    currentPatient: null,

    /**
     * Inicialização do módulo
     */
    init() {
        console.log('🏥 Módulo Laboratórios Profissional inicializado');
        this.loadLabData();
    },

    /**
     * Carregar dados do laboratório
     */
    loadLabData() {
        // Carregar dados do localStorage se existirem
        const savedCases = localStorage.getItem('laboratoryCases');
        if (savedCases) {
            this.laboratoryCases = JSON.parse(savedCases);
        }
        
        const savedLabs = localStorage.getItem('laboratories');
        if (savedLabs) {
            this.laboratories = JSON.parse(savedLabs);
        }
    },

    /**
     * Interface principal do módulo
     */
    renderProfessionalInterface(patient = null) {
        if (patient) {
            this.currentPatient = patient;
        }

        return `
            <style>
                /* CSS INLINE PARA GARANTIR FUNCIONAMENTO */
                .lab-workspace {
                    background: linear-gradient(135deg, #1e3a8a 0%, #374151 100%);
                    min-height: 100vh;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', sans-serif;
                    color: #f8fafc;
                    padding: 0;
                    margin: 0;
                }

                .lab-header {
                    background: rgba(255, 255, 255, 0.05);
                    backdrop-filter: blur(20px);
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                    padding: 24px 40px;
                    position: sticky;
                    top: 0;
                    z-index: 100;
                }

                .workspace-title {
                    font-size: 28px;
                    font-weight: 300;
                    color: #ffffff;
                    margin: 0;
                    letter-spacing: -0.025em;
                    text-align: center;
                }

                .workspace-subtitle {
                    font-size: 14px;
                    color: #94a3b8;
                    margin: 4px 0 0 0;
                    font-weight: 400;
                    text-align: center;
                }

                .lab-main-container {
                    padding: 40px;
                    max-width: 1400px;
                    margin: 0 auto;
                    display: grid;
                    grid-template-columns: 1fr 350px;
                    gap: 32px;
                }

                /* PAINEL PRINCIPAL - GERENCIAMENTO DE CASOS */
                .cases-management-panel {
                    background: rgba(255, 255, 255, 0.02);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    border-radius: 16px;
                    padding: 32px;
                    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
                }

                .panel-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 24px;
                    padding-bottom: 16px;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                }

                .panel-title {
                    font-size: 24px;
                    font-weight: 600;
                    color: #ffffff;
                    margin: 0;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .panel-actions {
                    display: flex;
                    gap: 12px;
                }

                .panel-action-btn {
                    padding: 10px 16px;
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    border-radius: 8px;
                    background: rgba(0, 0, 0, 0.2);
                    color: #e2e8f0;
                    font-size: 12px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }

                .panel-action-btn:hover {
                    background: rgba(13, 148, 136, 0.2);
                    border-color: rgba(13, 148, 136, 0.3);
                    color: #14b8a6;
                }

                .panel-action-btn.primary {
                    background: linear-gradient(135deg, #0d9488 0%, #14b8a6 100%);
                    border-color: transparent;
                    color: white;
                }

                /* CONTROLES E FILTROS */
                .controls-section {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 24px;
                    flex-wrap: wrap;
                    gap: 16px;
                }

                .view-controls {
                    display: flex;
                    gap: 8px;
                }

                .view-btn {
                    padding: 8px 12px;
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    border-radius: 6px;
                    background: rgba(0, 0, 0, 0.2);
                    color: #94a3b8;
                    font-size: 12px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }

                .view-btn.active {
                    background: rgba(13, 148, 136, 0.2);
                    border-color: rgba(13, 148, 136, 0.3);
                    color: #14b8a6;
                }

                .filter-controls {
                    display: flex;
                    gap: 12px;
                    align-items: center;
                }

                .filter-select {
                    background: rgba(0, 0, 0, 0.3);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 6px;
                    padding: 8px 12px;
                    color: #f8fafc;
                    font-size: 13px;
                    min-width: 120px;
                }

                /* CARDS DE CASOS */
                .cases-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
                    gap: 20px;
                }

                .case-card {
                    background: rgba(0, 0, 0, 0.2);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 12px;
                    padding: 20px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    position: relative;
                    overflow: hidden;
                }

                .case-card:hover {
                    background: rgba(0, 0, 0, 0.3);
                    border-color: rgba(13, 148, 136, 0.3);
                    transform: translateY(-2px);
                    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
                }

                .case-card.priority-alta {
                    border-left: 4px solid #ef4444;
                }

                .case-card.priority-normal {
                    border-left: 4px solid #14b8a6;
                }

                .case-card-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 16px;
                }

                .case-info {
                    flex: 1;
                }

                .case-patient {
                    font-size: 16px;
                    font-weight: 600;
                    color: #f8fafc;
                    margin: 0 0 4px 0;
                }

                .case-type {
                    font-size: 14px;
                    color: #14b8a6;
                    font-weight: 600;
                    margin: 0 0 8px 0;
                }

                .case-lab {
                    font-size: 12px;
                    color: #94a3b8;
                    margin: 0;
                }

                .case-status {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    padding: 6px 12px;
                    border-radius: 8px;
                    font-size: 11px;
                    font-weight: 600;
                    white-space: nowrap;
                }

                .case-details {
                    margin-bottom: 16px;
                }

                .case-material {
                    font-size: 13px;
                    color: #d1d5db;
                    margin: 0 0 8px 0;
                }

                .case-dates {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 12px;
                    font-size: 12px;
                }

                .date-item {
                    display: flex;
                    flex-direction: column;
                    gap: 2px;
                }

                .date-label {
                    color: #94a3b8;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }

                .date-value {
                    color: #e2e8f0;
                    font-weight: 600;
                }

                .date-value.overdue {
                    color: #f87171;
                }

                .date-value.today {
                    color: #fbbf24;
                }

                .case-footer {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding-top: 16px;
                    border-top: 1px solid rgba(255, 255, 255, 0.1);
                }

                .case-cost {
                    font-size: 16px;
                    font-weight: 700;
                    color: #14b8a6;
                }

                .case-actions {
                    display: flex;
                    gap: 8px;
                }

                .case-action-btn {
                    padding: 4px 8px;
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    border-radius: 4px;
                    background: rgba(0, 0, 0, 0.2);
                    color: #94a3b8;
                    font-size: 10px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }

                .case-action-btn:hover {
                    background: rgba(13, 148, 136, 0.2);
                    border-color: rgba(13, 148, 136, 0.3);
                    color: #14b8a6;
                }

                /* PAINEL LATERAL - REGISTRO E CONTROLES */
                .sidebar-panel {
                    display: flex;
                    flex-direction: column;
                    gap: 24px;
                }

                .sidebar-section {
                    background: rgba(255, 255, 255, 0.02);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    border-radius: 16px;
                    padding: 24px;
                    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
                }

                .sidebar-title {
                    font-size: 18px;
                    font-weight: 600;
                    color: #ffffff;
                    margin: 0 0 16px 0;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                /* FORMULÁRIO DE NOVO CASO */
                .new-case-form {
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                }

                .form-group {
                    display: flex;
                    flex-direction: column;
                    gap: 6px;
                }

                .form-label {
                    font-size: 12px;
                    font-weight: 600;
                    color: #e2e8f0;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }

                .form-input,
                .form-select,
                .form-textarea {
                    background: rgba(0, 0, 0, 0.3);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 6px;
                    padding: 10px 12px;
                    color: #f8fafc;
                    font-size: 14px;
                    transition: all 0.2s ease;
                }

                .form-input:focus,
                .form-select:focus,
                .form-textarea:focus {
                    outline: none;
                    border-color: #0d9488;
                    box-shadow: 0 0 0 2px rgba(13, 148, 136, 0.1);
                }

                .form-textarea {
                    resize: vertical;
                    min-height: 80px;
                }

                .form-btn {
                    padding: 12px 20px;
                    border: none;
                    border-radius: 8px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    justify-content: center;
                }

                .form-btn.primary {
                    background: linear-gradient(135deg, #0d9488 0%, #14b8a6 100%);
                    color: white;
                }

                .form-btn.secondary {
                    background: rgba(255, 255, 255, 0.1);
                    color: #e2e8f0;
                    border: 1px solid rgba(255, 255, 255, 0.2);
                }

                .form-btn:hover {
                    transform: translateY(-1px);
                }

                /* PRAZOS E ALERTAS */
                .deadlines-section {
                    max-height: 300px;
                    overflow-y: auto;
                }

                .deadline-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 12px;
                    margin-bottom: 8px;
                    background: rgba(0, 0, 0, 0.2);
                    border-radius: 8px;
                    border-left: 4px solid;
                }

                .deadline-item.overdue {
                    border-left-color: #ef4444;
                    background: rgba(239, 68, 68, 0.1);
                }

                .deadline-item.today {
                    border-left-color: #f59e0b;
                    background: rgba(245, 158, 11, 0.1);
                }

                .deadline-item.upcoming {
                    border-left-color: #14b8a6;
                    background: rgba(20, 184, 166, 0.1);
                }

                .deadline-info {
                    flex: 1;
                }

                .deadline-patient {
                    font-size: 13px;
                    font-weight: 600;
                    color: #f8fafc;
                    margin: 0 0 2px 0;
                }

                .deadline-type {
                    font-size: 11px;
                    color: #94a3b8;
                    margin: 0;
                }

                .deadline-date {
                    font-size: 12px;
                    font-weight: 600;
                    color: #e2e8f0;
                }

                /* ESTATÍSTICAS RÁPIDAS */
                .stats-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 12px;
                }

                .stat-item {
                    text-align: center;
                    padding: 16px;
                    background: rgba(0, 0, 0, 0.2);
                    border-radius: 8px;
                    border: 1px solid rgba(255, 255, 255, 0.1);
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

                /* RESPONSIVIDADE */
                @media (max-width: 1200px) {
                    .lab-main-container {
                        grid-template-columns: 1fr;
                        gap: 24px;
                    }
                    
                    .sidebar-panel {
                        order: -1;
                    }
                }

                @media (max-width: 768px) {
                    .lab-main-container {
                        padding: 20px;
                    }
                    
                    .cases-grid {
                        grid-template-columns: 1fr;
                    }
                    
                    .case-dates {
                        grid-template-columns: 1fr;
                    }
                    
                    .controls-section {
                        flex-direction: column;
                        align-items: stretch;
                    }
                    
                    .stats-grid {
                        grid-template-columns: 1fr;
                    }
                }
            </style>

            <div class="lab-workspace">
                <!-- Header -->
                <div class="lab-header">
                    <h1 class="workspace-title">🏥 Hub de Controle de Laboratórios</h1>
                    <p class="workspace-subtitle">Gestão completa de próteses e casos laboratoriais</p>
                </div>

                <!-- Container Principal -->
                <div class="lab-main-container">
                    <!-- Painel Principal - Gerenciamento de Casos -->
                    <div class="cases-management-panel">
                        <div class="panel-header">
                            <h2 class="panel-title">
                                🔬 Gerenciamento de Casos
                            </h2>
                            <div class="panel-actions">
                                <button onclick="LaboratoriosProfissional.refreshCases()" class="panel-action-btn">
                                    🔄 Atualizar
                                </button>
                                <button onclick="LaboratoriosProfissional.exportReport()" class="panel-action-btn">
                                    📄 Relatório
                                </button>
                            </div>
                        </div>

                        <!-- Controles e Filtros -->
                        <div class="controls-section">
                            <div class="view-controls">
                                <button onclick="LaboratoriosProfissional.setViewMode('cards')" class="view-btn ${this.currentLab.viewMode === 'cards' ? 'active' : ''}">
                                    📋 Cards
                                </button>
                                <button onclick="LaboratoriosProfissional.setViewMode('list')" class="view-btn ${this.currentLab.viewMode === 'list' ? 'active' : ''}">
                                    📄 Lista
                                </button>
                            </div>
                            
                            <div class="filter-controls">
                                <select onchange="LaboratoriosProfissional.setFilter(this.value)" class="filter-select">
                                    <option value="todos">Todos os Status</option>
                                    <option value="enviado">Enviados</option>
                                    <option value="em-producao">Em Produção</option>
                                    <option value="aguardando-retorno">Aguardando Retorno</option>
                                    <option value="concluido">Concluídos</option>
                                </select>
                                
                                <select onchange="LaboratoriosProfissional.setSortBy(this.value)" class="filter-select">
                                    <option value="dataEnvio">Data de Envio</option>
                                    <option value="dataEntrega">Data de Entrega</option>
                                    <option value="paciente">Paciente</option>
                                    <option value="laboratorio">Laboratório</option>
                                    <option value="custo">Custo</option>
                                </select>
                            </div>
                        </div>

                        <!-- Lista de Casos -->
                        <div class="cases-grid">
                            ${this.renderCasesList()}
                        </div>
                    </div>

                    <!-- Painel Lateral -->
                    <div class="sidebar-panel">
                        <!-- Registro de Novo Caso -->
                        <div class="sidebar-section">
                            <h3 class="sidebar-title">➕ Registro de Novo Caso</h3>
                            
                            <form class="new-case-form" onsubmit="LaboratoriosProfissional.saveNewCase(event)">
                                <div class="form-group">
                                    <label class="form-label">Paciente</label>
                                    <select name="patientId" class="form-select" required>
                                        <option value="">Selecione o paciente</option>
                                        ${this.renderPatientOptions()}
                                    </select>
                                </div>
                                
                                <div class="form-group">
                                    <label class="form-label">Laboratório</label>
                                    <select name="laboratoryId" class="form-select" required>
                                        <option value="">Selecione o laboratório</option>
                                        ${this.renderLaboratoryOptions()}
                                    </select>
                                </div>
                                
                                <div class="form-group">
                                    <label class="form-label">Tipo de Prótese</label>
                                    <select name="caseType" class="form-select" required>
                                        <option value="">Selecione o tipo</option>
                                        ${this.prothesisTypes.map(type => `<option value="${type}">${type}</option>`).join('')}
                                    </select>
                                </div>
                                
                                <div class="form-group">
                                    <label class="form-label">Material</label>
                                    <select name="material" class="form-select" required>
                                        <option value="">Selecione o material</option>
                                        ${this.materials.map(material => `<option value="${material}">${material}</option>`).join('')}
                                    </select>
                                </div>
                                
                                <div class="form-group">
                                    <label class="form-label">Data de Entrega Desejada</label>
                                    <input type="date" name="expectedDelivery" class="form-input" required>
                                </div>
                                
                                <div class="form-group">
                                    <label class="form-label">Custo do Laboratório (R$)</label>
                                    <input type="number" name="cost" class="form-input" step="0.01" min="0" placeholder="0,00" required>
                                </div>
                                
                                <div class="form-group">
                                    <label class="form-label">Prioridade</label>
                                    <select name="priority" class="form-select">
                                        <option value="normal">Normal</option>
                                        <option value="alta">Alta</option>
                                    </select>
                                </div>
                                
                                <div class="form-group">
                                    <label class="form-label">Observações</label>
                                    <textarea name="notes" class="form-textarea" placeholder="Instruções especiais, cores, etc."></textarea>
                                </div>
                                
                                <div style="display: flex; gap: 12px;">
                                    <button type="button" onclick="LaboratoriosProfissional.clearForm()" class="form-btn secondary" style="flex: 1;">
                                        🔄 Limpar
                                    </button>
                                    <button type="submit" class="form-btn primary" style="flex: 1;">
                                        💾 Salvar Caso
                                    </button>
                                </div>
                            </form>
                        </div>

                        <!-- Prazos de Devolução -->
                        <div class="sidebar-section">
                            <h3 class="sidebar-title">⏰ Prazos de Devolução</h3>
                            
                            <div class="deadlines-section">
                                ${this.renderDeadlines()}
                            </div>
                        </div>

                        <!-- Estatísticas Rápidas -->
                        <div class="sidebar-section">
                            <h3 class="sidebar-title">📊 Estatísticas</h3>
                            
                            <div class="stats-grid">
                                ${this.renderQuickStats()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * Renderizar lista de casos
     */
    renderCasesList() {
        let cases = [...this.laboratoryCases];
        
        // Aplicar filtros
        if (this.currentLab.filter !== 'todos') {
            cases = cases.filter(c => c.status === this.currentLab.filter);
        }
        
        // Aplicar ordenação
        cases.sort((a, b) => {
            switch (this.currentLab.sortBy) {
                case 'dataEnvio':
                    return new Date(b.dateSent || b.dateCreated) - new Date(a.dateSent || a.dateCreated);
                case 'dataEntrega':
                    return new Date(a.expectedDelivery) - new Date(b.expectedDelivery);
                case 'paciente':
                    return a.patientName.localeCompare(b.patientName);
                case 'laboratorio':
                    return a.laboratoryName.localeCompare(b.laboratoryName);
                case 'custo':
                    return b.cost - a.cost;
                default:
                    return 0;
            }
        });
        
        if (cases.length === 0) {
            return `
                <div style="grid-column: 1 / -1; text-align: center; padding: 40px;">
                    <div style="font-size: 48px; margin-bottom: 16px;">🔬</div>
                    <h3 style="color: #f8fafc; font-size: 20px; margin: 0 0 8px 0;">Nenhum caso encontrado</h3>
                    <p style="color: #94a3b8; margin: 0;">Registre um novo caso de laboratório para começar</p>
                </div>
            `;
        }
        
        return cases.map(labCase => {
            const status = this.statusConfig[labCase.status];
            const isOverdue = new Date(labCase.expectedDelivery) < new Date() && labCase.status !== 'concluido';
            const isToday = new Date(labCase.expectedDelivery).toDateString() === new Date().toDateString();
            
            return `
                <div class="case-card priority-${labCase.priority}" onclick="LaboratoriosProfissional.openCaseDetails(${labCase.id})">
                    <div class="case-card-header">
                        <div class="case-info">
                            <h4 class="case-patient">${labCase.patientName}</h4>
                            <div class="case-type">${labCase.caseType}</div>
                            <div class="case-lab">${labCase.laboratoryName}</div>
                        </div>
                        <div class="case-status" style="color: ${status.color}; background-color: ${status.bgColor};">
                            ${status.icon} ${status.label}
                        </div>
                    </div>
                    
                    <div class="case-details">
                        <div class="case-material">Material: ${labCase.material}</div>
                        
                        <div class="case-dates">
                            <div class="date-item">
                                <div class="date-label">Enviado</div>
                                <div class="date-value">${labCase.dateSent ? new Date(labCase.dateSent).toLocaleDateString('pt-BR') : 'Não enviado'}</div>
                            </div>
                            <div class="date-item">
                                <div class="date-label">Entrega</div>
                                <div class="date-value ${isOverdue ? 'overdue' : isToday ? 'today' : ''}">${new Date(labCase.expectedDelivery).toLocaleDateString('pt-BR')}</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="case-footer">
                        <div class="case-cost">R$ ${labCase.cost.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</div>
                        <div class="case-actions">
                            <button onclick="event.stopPropagation(); LaboratoriosProfissional.updateStatus(${labCase.id})" class="case-action-btn">
                                📝 Status
                            </button>
                            <button onclick="event.stopPropagation(); LaboratoriosProfissional.addNote(${labCase.id})" class="case-action-btn">
                                💬 Nota
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    },

    /**
     * Renderizar opções de pacientes
     */
    renderPatientOptions() {
        if (typeof DataPersistence !== 'undefined') {
            const patients = DataPersistence.getPatients();
            return patients.map(patient => 
                `<option value="${patient.id}">${patient.name}</option>`
            ).join('');
        }
        return '<option value="">Nenhum paciente encontrado</option>';
    },

    /**
     * Renderizar opções de laboratórios
     */
    renderLaboratoryOptions() {
        return this.laboratories
            .filter(lab => lab.status === 'ativo')
            .map(lab => 
                `<option value="${lab.id}">${lab.name}</option>`
            ).join('');
    },

    /**
     * Renderizar prazos
     */
    renderDeadlines() {
        const activeCases = this.laboratoryCases.filter(c => 
            c.status !== 'concluido' && c.status !== 'cancelado'
        );
        
        const today = new Date();
        const sortedCases = activeCases.sort((a, b) => 
            new Date(a.expectedDelivery) - new Date(b.expectedDelivery)
        );
        
        if (sortedCases.length === 0) {
            return `
                <div style="text-align: center; padding: 20px; color: #94a3b8;">
                    📅 Nenhum prazo pendente
                </div>
            `;
        }
        
        return sortedCases.slice(0, 5).map(labCase => {
            const deliveryDate = new Date(labCase.expectedDelivery);
            const isOverdue = deliveryDate < today;
            const isToday = deliveryDate.toDateString() === today.toDateString();
            
            let className = 'upcoming';
            if (isOverdue) className = 'overdue';
            else if (isToday) className = 'today';
            
            return `
                <div class="deadline-item ${className}" onclick="LaboratoriosProfissional.openCaseDetails(${labCase.id})">
                    <div class="deadline-info">
                        <div class="deadline-patient">${labCase.patientName}</div>
                        <div class="deadline-type">${labCase.caseType}</div>
                    </div>
                    <div class="deadline-date">${deliveryDate.toLocaleDateString('pt-BR')}</div>
                </div>
            `;
        }).join('');
    },

    /**
     * Renderizar estatísticas rápidas
     */
    renderQuickStats() {
        const total = this.laboratoryCases.length;
        const active = this.laboratoryCases.filter(c => 
            c.status !== 'concluido' && c.status !== 'cancelado'
        ).length;
        const overdue = this.laboratoryCases.filter(c => 
            new Date(c.expectedDelivery) < new Date() && c.status !== 'concluido'
        ).length;
        const thisMonth = this.laboratoryCases.filter(c => {
            const created = new Date(c.dateCreated);
            const now = new Date();
            return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
        }).length;
        
        return `
            <div class="stat-item">
                <div class="stat-value">${total}</div>
                <div class="stat-label">Total de Casos</div>
            </div>
            <div class="stat-item">
                <div class="stat-value">${active}</div>
                <div class="stat-label">Casos Ativos</div>
            </div>
            <div class="stat-item">
                <div class="stat-value">${overdue}</div>
                <div class="stat-label">Em Atraso</div>
            </div>
            <div class="stat-item">
                <div class="stat-value">${thisMonth}</div>
                <div class="stat-label">Este Mês</div>
            </div>
        `;
    },

    /**
     * FUNÇÕES DE INTERAÇÃO
     */
    setViewMode(mode) {
        this.currentLab.viewMode = mode;
        this.refreshInterface();
    },

    setFilter(filter) {
        this.currentLab.filter = filter;
        this.refreshInterface();
    },

    setSortBy(sortBy) {
        this.currentLab.sortBy = sortBy;
        this.refreshInterface();
    },

    refreshInterface() {
        const casesGrid = document.querySelector('.cases-grid');
        if (casesGrid) {
            casesGrid.innerHTML = this.renderCasesList();
        }
        
        const deadlinesSection = document.querySelector('.deadlines-section');
        if (deadlinesSection) {
            deadlinesSection.innerHTML = this.renderDeadlines();
        }
        
        const statsGrid = document.querySelector('.stats-grid');
        if (statsGrid) {
            statsGrid.innerHTML = this.renderQuickStats();
        }
    },

    saveNewCase(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const patientId = parseInt(formData.get('patientId'));
        
        // Buscar dados do paciente
        let patientName = 'Paciente Desconhecido';
        if (typeof DataPersistence !== 'undefined') {
            const patient = DataPersistence.getPatients().find(p => p.id === patientId);
            if (patient) {
                patientName = patient.name;
            }
        }
        
        // Buscar dados do laboratório
        const laboratoryId = parseInt(formData.get('laboratoryId'));
        const laboratory = this.laboratories.find(l => l.id === laboratoryId);
        const laboratoryName = laboratory ? laboratory.name : 'Laboratório Desconhecido';
        
        const newCase = {
            id: Date.now(),
            patientId: patientId,
            patientName: patientName,
            laboratoryId: laboratoryId,
            laboratoryName: laboratoryName,
            caseType: formData.get('caseType'),
            material: formData.get('material'),
            dateCreated: new Date().toISOString().split('T')[0],
            dateSent: null,
            expectedDelivery: formData.get('expectedDelivery'),
            actualDelivery: null,
            status: 'rascunho',
            priority: formData.get('priority'),
            cost: parseFloat(formData.get('cost')),
            paid: false,
            notes: formData.get('notes') || '',
            files: [],
            history: [
                {
                    date: new Date().toISOString().split('T')[0],
                    action: 'Caso criado',
                    user: 'Dr. Responsável'
                }
            ]
        };
        
        this.laboratoryCases.push(newCase);
        this.saveData();
        this.clearForm();
        this.refreshInterface();
        
        this.showAlert('✅ Caso Salvo', `Caso criado com sucesso!\n\nPaciente: ${patientName}\nTipo: ${newCase.caseType}\nLaboratório: ${laboratoryName}`);
        
        // Integrar com módulo financeiro se disponível
        this.integrateWithFinancials(newCase);
    },

    clearForm() {
        const form = document.querySelector('.new-case-form');
        if (form) {
            form.reset();
        }
    },

    openCaseDetails(caseId) {
        const labCase = this.laboratoryCases.find(c => c.id === caseId);
        if (!labCase) return;
        
        this.showCaseDetailsModal(labCase);
    },

    updateStatus(caseId) {
        const labCase = this.laboratoryCases.find(c => c.id === caseId);
        if (!labCase) return;
        
        this.showStatusUpdateModal(labCase);
    },

    addNote(caseId) {
        const labCase = this.laboratoryCases.find(c => c.id === caseId);
        if (!labCase) return;
        
        const note = prompt('Adicionar observação:', labCase.notes);
        if (note !== null) {
            labCase.notes = note;
            labCase.history.push({
                date: new Date().toISOString().split('T')[0],
                action: 'Observação adicionada',
                user: 'Dr. Responsável'
            });
            this.saveData();
            this.refreshInterface();
        }
    },

    refreshCases() {
        this.loadLabData();
        this.refreshInterface();
        this.showAlert('🔄 Atualizado', 'Lista de casos atualizada com sucesso!');
    },

    exportReport() {
        this.showAlert('📄 Relatório', 'Funcionalidade de exportação será implementada em breve!');
    },

    /**
     * Salvar dados
     */
    saveData() {
        localStorage.setItem('laboratoryLases', JSON.stringify(this.laboratoryCases));
        localStorage.setItem('laboratories', JSON.stringify(this.laboratories));
    },

    /**
     * Integração com módulo financeiro
     */
    integrateWithFinancials(labCase) {
        if (typeof DebitosProfissional !== 'undefined') {
            try {
                // Adicionar custo como débito do paciente
                const debitData = {
                    id: Date.now(),
                    description: `Laboratório - ${labCase.caseType}`,
                    originalValue: labCase.cost,
                    remainingBalance: labCase.cost,
                    dueDate: labCase.expectedDelivery,
                    status: 'aberto',
                    installment: '1/1',
                    category: 'Laboratório',
                    labCaseId: labCase.id
                };
                
                // Integrar com sistema de débitos
                console.log('💰 Integrando com sistema financeiro:', debitData);
            } catch (error) {
                console.warn('⚠️ Erro na integração financeira:', error);
            }
        }
    },

    /**
     * Modals e alertas
     */
    showCaseDetailsModal(labCase) {
        const status = this.statusConfig[labCase.status];
        const laboratory = this.laboratories.find(l => l.id === labCase.laboratoryId);
        
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
                max-width: 600px;
                width: 100%;
                margin: 20px;
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
                color: #f8fafc;
                max-height: 90vh;
                overflow-y: auto;
            ">
                <div style="padding: 24px 24px 0 24px; border-bottom: 1px solid rgba(255, 255, 255, 0.1);">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <h3 style="font-size: 20px; font-weight: 600; margin: 0; color: #ffffff;">
                            🔬 Detalhes do Caso #${labCase.id}
                        </h3>
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
                </div>
                
                <div style="padding: 24px;">
                    <div style="display: grid; gap: 20px;">
                        <div>
                            <h4 style="color: #14b8a6; margin: 0 0 8px 0;">Informações Básicas</h4>
                            <div style="background: rgba(0, 0, 0, 0.2); padding: 16px; border-radius: 8px;">
                                <p><strong>Paciente:</strong> ${labCase.patientName}</p>
                                <p><strong>Tipo:</strong> ${labCase.caseType}</p>
                                <p><strong>Material:</strong> ${labCase.material}</p>
                                <p><strong>Laboratório:</strong> ${labCase.laboratoryName}</p>
                                <p><strong>Status:</strong> <span style="color: ${status.color};">${status.icon} ${status.label}</span></p>
                                <p><strong>Prioridade:</strong> ${labCase.priority === 'alta' ? '🔴 Alta' : '🟢 Normal'}</p>
                            </div>
                        </div>
                        
                        <div>
                            <h4 style="color: #14b8a6; margin: 0 0 8px 0;">Prazos e Custos</h4>
                            <div style="background: rgba(0, 0, 0, 0.2); padding: 16px; border-radius: 8px;">
                                <p><strong>Data de Criação:</strong> ${new Date(labCase.dateCreated).toLocaleDateString('pt-BR')}</p>
                                <p><strong>Data de Envio:</strong> ${labCase.dateSent ? new Date(labCase.dateSent).toLocaleDateString('pt-BR') : 'Não enviado'}</p>
                                <p><strong>Entrega Esperada:</strong> ${new Date(labCase.expectedDelivery).toLocaleDateString('pt-BR')}</p>
                                <p><strong>Custo:</strong> R$ ${labCase.cost.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</p>
                                <p><strong>Pagamento:</strong> ${labCase.paid ? '✅ Pago' : '⏳ Pendente'}</p>
                            </div>
                        </div>
                        
                        ${labCase.notes ? `
                        <div>
                            <h4 style="color: #14b8a6; margin: 0 0 8px 0;">Observações</h4>
                            <div style="background: rgba(0, 0, 0, 0.2); padding: 16px; border-radius: 8px;">
                                <p style="margin: 0; white-space: pre-wrap;">${labCase.notes}</p>
                            </div>
                        </div>
                        ` : ''}
                        
                        ${laboratory ? `
                        <div>
                            <h4 style="color: #14b8a6; margin: 0 0 8px 0;">Contato do Laboratório</h4>
                            <div style="background: rgba(0, 0, 0, 0.2); padding: 16px; border-radius: 8px;">
                                <p><strong>Contato:</strong> ${laboratory.contact}</p>
                                <p><strong>Telefone:</strong> ${laboratory.phone}</p>
                                <p><strong>Email:</strong> ${laboratory.email}</p>
                            </div>
                        </div>
                        ` : ''}
                    </div>
                    
                    <div style="display: flex; gap: 12px; margin-top: 24px;">
                        <button onclick="LaboratoriosProfissional.updateStatus(${labCase.id}); this.closest('div[style*=\"position: fixed\"]').remove();" style="
                            flex: 1;
                            background: linear-gradient(135deg, #0d9488 0%, #14b8a6 100%);
                            border: none;
                            border-radius: 8px;
                            color: white;
                            padding: 12px 24px;
                            font-weight: 600;
                            cursor: pointer;
                        ">📝 Atualizar Status</button>
                        
                        <button onclick="this.closest('div[style*=\"position: fixed\"]').remove()" style="
                            flex: 1;
                            background: rgba(255, 255, 255, 0.1);
                            border: 1px solid rgba(255, 255, 255, 0.2);
                            border-radius: 8px;
                            color: #e2e8f0;
                            padding: 12px 24px;
                            font-weight: 600;
                            cursor: pointer;
                        ">Fechar</button>
                    </div>
                </div>
            </div>
        `;
        modal.onclick = (e) => {
            if (e.target === modal) modal.remove();
        };
        document.body.appendChild(modal);
    },

    showStatusUpdateModal(labCase) {
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
                <div style="padding: 24px 24px 0 24px;">
                    <h3 style="font-size: 20px; font-weight: 600; margin: 0; color: #ffffff;">
                        📝 Atualizar Status - ${labCase.patientName}
                    </h3>
                </div>
                
                <form onsubmit="LaboratoriosProfissional.handleStatusUpdate(event, ${labCase.id})" style="padding: 16px 24px 24px 24px;">
                    <div style="margin-bottom: 16px;">
                        <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #e2e8f0;">Novo Status:</label>
                        <select name="status" required style="
                            width: 100%;
                            background: rgba(0, 0, 0, 0.3);
                            border: 1px solid rgba(255, 255, 255, 0.1);
                            border-radius: 6px;
                            padding: 10px 12px;
                            color: #f8fafc;
                            font-size: 14px;
                        ">
                            ${Object.entries(this.statusConfig).map(([key, config]) => 
                                `<option value="${key}" ${key === labCase.status ? 'selected' : ''}>${config.icon} ${config.label}</option>`
                            ).join('')}
                        </select>
                    </div>
                    
                    <div style="margin-bottom: 16px;">
                        <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #e2e8f0;">Observação:</label>
                        <textarea name="note" placeholder="Adicione uma observação sobre a mudança de status..." style="
                            width: 100%;
                            background: rgba(0, 0, 0, 0.3);
                            border: 1px solid rgba(255, 255, 255, 0.1);
                            border-radius: 6px;
                            padding: 10px 12px;
                            color: #f8fafc;
                            font-size: 14px;
                            resize: vertical;
                            min-height: 80px;
                        "></textarea>
                    </div>
                    
                    <div style="display: flex; gap: 12px;">
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
                            background: linear-gradient(135deg, #0d9488 0%, #14b8a6 100%);
                            border: none;
                            border-radius: 8px;
                            color: white;
                            padding: 12px 24px;
                            font-weight: 600;
                            cursor: pointer;
                        ">Atualizar</button>
                    </div>
                </form>
            </div>
        `;
        modal.onclick = (e) => {
            if (e.target === modal) modal.remove();
        };
        document.body.appendChild(modal);
    },

    handleStatusUpdate(event, caseId) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const newStatus = formData.get('status');
        const note = formData.get('note');
        
        const labCase = this.laboratoryCases.find(c => c.id === caseId);
        if (!labCase) return;
        
        const oldStatus = labCase.status;
        labCase.status = newStatus;
        
        // Atualizar datas baseado no status
        const today = new Date().toISOString().split('T')[0];
        if (newStatus === 'enviado' && !labCase.dateSent) {
            labCase.dateSent = today;
        } else if (newStatus === 'concluido' && !labCase.actualDelivery) {
            labCase.actualDelivery = today;
        }
        
        // Adicionar ao histórico
        const statusConfig = this.statusConfig[newStatus];
        labCase.history.push({
            date: today,
            action: `Status alterado: ${this.statusConfig[oldStatus]?.label} → ${statusConfig.label}`,
            user: 'Dr. Responsável',
            note: note
        });
        
        this.saveData();
        this.refreshInterface();
        
        // Fechar modal
        event.target.closest('div[style*="position: fixed"]').remove();
        
        this.showAlert('✅ Status Atualizado', `Status do caso alterado para: ${statusConfig.icon} ${statusConfig.label}`);
    },

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
window.LaboratoriosProfissional = LaboratoriosProfissional;

console.log('🏥 Módulo Laboratórios Profissional carregado!');