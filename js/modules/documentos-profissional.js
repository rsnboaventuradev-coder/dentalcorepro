// ============================================================================
// DENTALCORE PRO - MÓDULO DE DOCUMENTOS PROFISSIONAL
// Hub inteligente com cartões flutuantes e elegantes
// Paleta: Azul-marinho, Carvão e Azul-petróleo
// ============================================================================

window.DocumentosProfissional = window.DocumentosProfissional || {
    // Estado atual do sistema
    currentDocument: {
        type: null,
        patientId: null,
        patientName: '',
        template: null,
        history: []
    },

    // Templates de documentos disponíveis
    documentTemplates: [
        {
            id: 'contrato-tratamento',
            title: 'Contrato de Tratamento',
            icon: '📋',
            description: 'Contrato formal para procedimentos odontológicos',
            category: 'Contratos',
            requiresSignature: true,
            template: 'contrato_template'
        },
        {
            id: 'tcle',
            title: 'TCLE',
            icon: '📄',
            description: 'Termo de Consentimento Livre e Esclarecido',
            category: 'Consentimentos',
            requiresSignature: true,
            template: 'tcle_template'
        },
        {
            id: 'anamnese-completa',
            title: 'Anamnese Completa',
            icon: '📝',
            description: 'Formulário detalhado de histórico médico',
            category: 'Formulários',
            requiresSignature: false,
            template: 'anamnese_template'
        },
        {
            id: 'orcamento-detalhado',
            title: 'Orçamento Detalhado',
            icon: '💰',
            description: 'Proposta comercial detalhada de tratamento',
            category: 'Comercial',
            requiresSignature: true,
            template: 'orcamento_template'
        },
        {
            id: 'receituario',
            title: 'Receituário',
            icon: '💊',
            description: 'Prescrição médica e orientações',
            category: 'Prescrições',
            requiresSignature: false,
            template: 'receita_template'
        },
        {
            id: 'atestado',
            title: 'Atestado Médico',
            icon: '🏥',
            description: 'Comprovante de comparecimento ou afastamento',
            category: 'Atestados',
            requiresSignature: false,
            template: 'atestado_template'
        },
        {
            id: 'termo-responsabilidade',
            title: 'Termo de Responsabilidade',
            icon: '⚖️',
            description: 'Documento de responsabilização do paciente',
            category: 'Termos',
            requiresSignature: true,
            template: 'responsabilidade_template'
        },
        {
            id: 'protocolo-urgencia',
            title: 'Protocolo de Urgência',
            icon: '🚨',
            description: 'Documento para casos de emergência',
            category: 'Protocolos',
            requiresSignature: false,
            template: 'urgencia_template'
        }
    ],

    // Histórico de documentos do paciente
    documentHistory: {
        'contrato-tratamento': [
            { id: 1, date: '2024-01-20', status: 'assinado', version: '1.0' },
            { id: 2, date: '2024-01-15', status: 'enviado', version: '1.0' }
        ],
        'tcle': [
            { id: 3, date: '2024-01-18', status: 'assinado', version: '2.1' }
        ]
    },

    currentPatient: null,
    selectedDocumentType: null,

    /**
     * Inicialização do módulo
     */
    init() {
        console.log('📄 Módulo Documentos Profissional inicializado');
        this.loadDocumentHistory();
    },

    /**
     * Carregar histórico de documentos
     */
    loadDocumentHistory() {
        // Aqui seria carregado do banco de dados
        console.log('📚 Histórico de documentos carregado');
    },

    /**
     * Interface principal da aba Documentos
     */
    renderProfessionalInterface(patient = null) {
        if (patient) {
            this.currentPatient = patient;
            this.currentDocument.patientId = patient.id;
            this.currentDocument.patientName = patient.name;
        }

        return `
            <style>
                /* CSS INLINE PARA GARANTIR FUNCIONAMENTO */
                .documents-workspace {
                    background: linear-gradient(135deg, #1e3a8a 0%, #374151 100%);
                    min-height: 100vh;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', sans-serif;
                    color: #f8fafc;
                    padding: 0;
                    margin: 0;
                }

                .documents-header {
                    background: rgba(255, 255, 255, 0.05);
                    backdrop-filter: blur(20px);
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                    padding: 24px 40px;
                    position: sticky;
                    top: 0;
                    z-index: 100;
                }

                .header-title-section {
                    text-align: center;
                }

                .workspace-title {
                    font-size: 28px;
                    font-weight: 300;
                    color: #ffffff;
                    margin: 0;
                    letter-spacing: -0.025em;
                }

                .workspace-subtitle {
                    font-size: 14px;
                    color: #94a3b8;
                    margin: 4px 0 0 0;
                    font-weight: 400;
                }

                .documents-main-container {
                    padding: 40px;
                    max-width: 1400px;
                    margin: 0 auto;
                }

                /* GRADE DE CARTÕES PRINCIPAIS */
                .documents-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                    gap: 24px;
                    margin-bottom: 40px;
                }

                .document-card {
                    background: rgba(255, 255, 255, 0.02);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    border-radius: 16px;
                    padding: 24px;
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    position: relative;
                    overflow: hidden;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                }

                .document-card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.2);
                    border-color: rgba(13, 148, 136, 0.3);
                    background: rgba(255, 255, 255, 0.04);
                }

                .document-card::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 3px;
                    background: linear-gradient(90deg, #0d9488, #14b8a6);
                    opacity: 0;
                    transition: opacity 0.3s ease;
                }

                .document-card:hover::before {
                    opacity: 1;
                }

                .card-header {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    margin-bottom: 16px;
                }

                .card-icon {
                    width: 48px;
                    height: 48px;
                    background: rgba(13, 148, 136, 0.1);
                    border: 1px solid rgba(13, 148, 136, 0.2);
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 20px;
                    transition: all 0.3s ease;
                }

                .document-card:hover .card-icon {
                    background: rgba(13, 148, 136, 0.2);
                    border-color: rgba(13, 148, 136, 0.4);
                    transform: scale(1.05);
                }

                .card-title-section {
                    flex: 1;
                }

                .card-title {
                    font-size: 18px;
                    font-weight: 600;
                    color: #f8fafc;
                    margin: 0 0 4px 0;
                    letter-spacing: -0.008em;
                }

                .card-category {
                    font-size: 12px;
                    color: #14b8a6;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }

                .card-description {
                    font-size: 14px;
                    color: #94a3b8;
                    line-height: 1.4;
                    margin: 0 0 16px 0;
                }

                .card-actions {
                    display: flex;
                    gap: 8px;
                    margin-top: 16px;
                }

                .card-action-btn {
                    padding: 6px 12px;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 6px;
                    background: rgba(0, 0, 0, 0.2);
                    color: #e2e8f0;
                    font-size: 11px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }

                .card-action-btn:hover {
                    background: rgba(13, 148, 136, 0.2);
                    border-color: rgba(13, 148, 136, 0.3);
                    color: #14b8a6;
                }

                .card-action-btn.primary {
                    background: linear-gradient(135deg, #0d9488 0%, #14b8a6 100%);
                    border-color: transparent;
                    color: white;
                }

                .card-action-btn.primary:hover {
                    background: linear-gradient(135deg, #0f766e 0%, #0d9488 100%);
                    transform: translateY(-1px);
                }

                .signature-indicator {
                    position: absolute;
                    top: 12px;
                    right: 12px;
                    width: 8px;
                    height: 8px;
                    background: #f59e0b;
                    border-radius: 50%;
                    opacity: 0.7;
                }

                .signature-indicator.required {
                    background: #ef4444;
                    animation: pulse 2s infinite;
                }

                .signature-indicator.completed {
                    background: #10b981;
                }

                @keyframes pulse {
                    0%, 100% { opacity: 0.7; }
                    50% { opacity: 1; }
                }

                .history-count {
                    position: absolute;
                    top: 8px;
                    right: 32px;
                    background: rgba(13, 148, 136, 0.2);
                    color: #14b8a6;
                    padding: 2px 6px;
                    border-radius: 8px;
                    font-size: 10px;
                    font-weight: 600;
                }

                /* CARTÃO ESPECIAL - DOCUMENTO PERSONALIZADO */
                .custom-document-section {
                    margin-top: 40px;
                    border-top: 1px solid rgba(255, 255, 255, 0.1);
                    padding-top: 40px;
                }

                .section-header {
                    text-align: center;
                    margin-bottom: 24px;
                }

                .section-title {
                    font-size: 20px;
                    font-weight: 600;
                    color: #f8fafc;
                    margin: 0 0 8px 0;
                }

                .section-subtitle {
                    font-size: 14px;
                    color: #94a3b8;
                    margin: 0;
                }

                .custom-document-card {
                    background: linear-gradient(135deg, rgba(13, 148, 136, 0.1) 0%, rgba(20, 184, 166, 0.05) 100%);
                    border: 2px dashed rgba(13, 148, 136, 0.3);
                    border-radius: 16px;
                    padding: 32px;
                    text-align: center;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    position: relative;
                    overflow: hidden;
                }

                .custom-document-card:hover {
                    border-color: rgba(13, 148, 136, 0.5);
                    background: linear-gradient(135deg, rgba(13, 148, 136, 0.15) 0%, rgba(20, 184, 166, 0.08) 100%);
                    transform: translateY(-2px);
                }

                .custom-card-icon {
                    width: 64px;
                    height: 64px;
                    background: rgba(13, 148, 136, 0.2);
                    border: 2px solid rgba(13, 148, 136, 0.3);
                    border-radius: 16px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 28px;
                    margin: 0 auto 16px;
                    transition: all 0.3s ease;
                }

                .custom-document-card:hover .custom-card-icon {
                    transform: scale(1.05);
                    background: rgba(13, 148, 136, 0.3);
                }

                .custom-card-title {
                    font-size: 20px;
                    font-weight: 600;
                    color: #14b8a6;
                    margin: 0 0 8px 0;
                }

                .custom-card-description {
                    font-size: 14px;
                    color: #94a3b8;
                    margin: 0 0 20px 0;
                    line-height: 1.5;
                }

                .custom-card-actions {
                    display: flex;
                    gap: 12px;
                    justify-content: center;
                }

                .custom-action-btn {
                    padding: 10px 20px;
                    border: none;
                    border-radius: 8px;
                    font-weight: 600;
                    font-size: 14px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .custom-action-btn.upload {
                    background: rgba(255, 255, 255, 0.1);
                    color: #e2e8f0;
                    border: 1px solid rgba(255, 255, 255, 0.2);
                }

                .custom-action-btn.create {
                    background: linear-gradient(135deg, #0d9488 0%, #14b8a6 100%);
                    color: white;
                }

                .custom-action-btn:hover {
                    transform: translateY(-1px);
                }

                /* MODAL DE DOCUMENTO */
                .document-modal {
                    position: fixed;
                    inset: 0;
                    background: rgba(0, 0, 0, 0.8);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 9999;
                    backdrop-filter: blur(4px);
                    opacity: 0;
                    visibility: hidden;
                    transition: all 0.3s ease;
                }

                .document-modal.active {
                    opacity: 1;
                    visibility: visible;
                }

                .modal-container {
                    background: linear-gradient(135deg, #1e3a8a 0%, #374151 100%);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 16px;
                    width: 90%;
                    max-width: 800px;
                    max-height: 90vh;
                    overflow: hidden;
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
                    transform: scale(0.9);
                    transition: transform 0.3s ease;
                }

                .document-modal.active .modal-container {
                    transform: scale(1);
                }

                .modal-header {
                    padding: 24px 32px;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .modal-title {
                    font-size: 20px;
                    font-weight: 600;
                    color: #f8fafc;
                    margin: 0;
                }

                .modal-close {
                    background: rgba(239, 68, 68, 0.2);
                    border: none;
                    border-radius: 8px;
                    color: #f87171;
                    width: 32px;
                    height: 32px;
                    cursor: pointer;
                    font-size: 16px;
                    font-weight: bold;
                    transition: all 0.2s ease;
                }

                .modal-close:hover {
                    background: rgba(239, 68, 68, 0.3);
                }

                .modal-content {
                    padding: 32px;
                    max-height: 60vh;
                    overflow-y: auto;
                }

                .document-preview {
                    background: #ffffff;
                    color: #000000;
                    padding: 40px;
                    border-radius: 8px;
                    font-family: 'Times New Roman', serif;
                    line-height: 1.6;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                }

                .document-header-preview {
                    text-align: center;
                    margin-bottom: 30px;
                    border-bottom: 2px solid #000;
                    padding-bottom: 20px;
                }

                .clinic-name {
                    font-size: 24px;
                    font-weight: bold;
                    margin: 0 0 8px 0;
                }

                .document-type-title {
                    font-size: 18px;
                    font-weight: bold;
                    text-transform: uppercase;
                    margin: 20px 0;
                }

                .patient-info-preview {
                    background: #f8f9fa;
                    padding: 20px;
                    border-radius: 8px;
                    margin: 20px 0;
                }

                .patient-field {
                    margin: 8px 0;
                    font-weight: bold;
                }

                .highlight-field {
                    background: #ffeb3b;
                    padding: 2px 4px;
                    border-radius: 2px;
                }

                .modal-actions {
                    padding: 24px 32px;
                    border-top: 1px solid rgba(255, 255, 255, 0.1);
                    display: flex;
                    gap: 12px;
                    justify-content: flex-end;
                }

                .modal-action-btn {
                    padding: 12px 24px;
                    border: none;
                    border-radius: 8px;
                    font-weight: 600;
                    font-size: 14px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .modal-action-btn.secondary {
                    background: rgba(255, 255, 255, 0.1);
                    color: #e2e8f0;
                    border: 1px solid rgba(255, 255, 255, 0.2);
                }

                .modal-action-btn.primary {
                    background: linear-gradient(135deg, #0d9488 0%, #14b8a6 100%);
                    color: white;
                }

                .modal-action-btn.signature {
                    background: linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%);
                    color: white;
                }

                .modal-action-btn:hover {
                    transform: translateY(-1px);
                }

                /* MODAL DE HISTÓRICO */
                .history-modal {
                    position: fixed;
                    inset: 0;
                    background: rgba(0, 0, 0, 0.8);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 9999;
                    backdrop-filter: blur(4px);
                    opacity: 0;
                    visibility: hidden;
                    transition: all 0.3s ease;
                }

                .history-modal.active {
                    opacity: 1;
                    visibility: visible;
                }

                .history-container {
                    background: linear-gradient(135deg, #1e3a8a 0%, #374151 100%);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 16px;
                    width: 90%;
                    max-width: 600px;
                    max-height: 80vh;
                    overflow: hidden;
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
                }

                .history-list {
                    padding: 20px;
                    max-height: 50vh;
                    overflow-y: auto;
                }

                .history-item {
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 8px;
                    padding: 16px;
                    margin-bottom: 12px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .history-info {
                    flex: 1;
                }

                .history-date {
                    font-size: 14px;
                    font-weight: 600;
                    color: #14b8a6;
                    margin: 0 0 4px 0;
                }

                .history-status {
                    font-size: 12px;
                    color: #94a3b8;
                    margin: 0;
                }

                .status-badge {
                    padding: 4px 8px;
                    border-radius: 4px;
                    font-size: 10px;
                    font-weight: 600;
                    text-transform: uppercase;
                }

                .status-assinado {
                    background: rgba(16, 185, 129, 0.2);
                    color: #10b981;
                }

                .status-enviado {
                    background: rgba(245, 158, 11, 0.2);
                    color: #f59e0b;
                }

                .status-rascunho {
                    background: rgba(107, 114, 128, 0.2);
                    color: #6b7280;
                }

                /* Responsividade */
                @media (max-width: 1024px) {
                    .documents-grid {
                        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                        gap: 20px;
                    }
                    
                    .documents-main-container {
                        padding: 24px;
                    }
                    
                    .documents-header {
                        padding: 20px 24px;
                    }
                }

                @media (max-width: 768px) {
                    .documents-grid {
                        grid-template-columns: 1fr;
                    }
                    
                    .card-actions {
                        flex-direction: column;
                    }
                    
                    .custom-card-actions {
                        flex-direction: column;
                    }
                    
                    .modal-container {
                        width: 95%;
                    }
                    
                    .modal-content {
                        padding: 20px;
                    }
                    
                    .document-preview {
                        padding: 20px;
                    }
                    
                    .modal-actions {
                        flex-direction: column;
                    }
                    
                    .workspace-title {
                        font-size: 24px;
                    }
                }
            </style>

            <div class="documents-workspace">
                <!-- Header -->
                <div class="documents-header">
                    <div class="header-title-section">
                        <h1 class="workspace-title">📄 Hub Inteligente de Documentos</h1>
                        <p class="workspace-subtitle">Sistema profissional de documentos para ${this.currentPatient?.name || 'Paciente'}</p>
                    </div>
                </div>

                <!-- Container Principal -->
                <div class="documents-main-container">
                    <!-- Grade de Cartões de Documentos -->
                    <div class="documents-grid">
                        ${this.renderDocumentCards()}
                    </div>

                    <!-- Seção de Documento Personalizado -->
                    <div class="custom-document-section">
                        <div class="section-header">
                            <h2 class="section-title">📝 Documento Personalizado</h2>
                            <p class="section-subtitle">Ferramenta versátil para criar ou carregar documentos únicos</p>
                        </div>
                        
                        <div class="custom-document-card" onclick="DocumentosProfissional.openCustomDocument()">
                            <div class="custom-card-icon">📋</div>
                            <h3 class="custom-card-title">Criar Documento Personalizado</h3>
                            <p class="custom-card-description">
                                Carregue seu próprio arquivo ou crie um documento personalizado do zero,
                                que será salvo no prontuário do paciente.
                            </p>
                            <div class="custom-card-actions">
                                <button onclick="event.stopPropagation(); DocumentosProfissional.uploadCustomDocument()" class="custom-action-btn upload">
                                    📤 Carregar Arquivo
                                </button>
                                <button onclick="event.stopPropagation(); DocumentosProfissional.createFromScratch()" class="custom-action-btn create">
                                    ✨ Criar do Zero
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Modal de Documento -->
                <div id="documentModal" class="document-modal">
                    <div class="modal-container">
                        <div class="modal-header">
                            <h3 id="modalTitle" class="modal-title">Documento</h3>
                            <button onclick="DocumentosProfissional.closeModal()" class="modal-close">×</button>
                        </div>
                        <div class="modal-content">
                            <div id="documentPreview" class="document-preview">
                                <!-- Conteúdo do documento será inserido aqui -->
                            </div>
                        </div>
                        <div class="modal-actions">
                            <button onclick="DocumentosProfissional.saveDocument()" class="modal-action-btn secondary">
                                💾 Salvar Rascunho
                            </button>
                            <button onclick="DocumentosProfissional.downloadPDF()" class="modal-action-btn primary">
                                📄 Baixar PDF
                            </button>
                            <button onclick="DocumentosProfissional.sendForSignature()" class="modal-action-btn signature">
                                ✍️ Enviar para Assinatura
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Modal de Histórico -->
                <div id="historyModal" class="history-modal">
                    <div class="history-container">
                        <div class="modal-header">
                            <h3 id="historyModalTitle" class="modal-title">Histórico de Documentos</h3>
                            <button onclick="DocumentosProfissional.closeHistoryModal()" class="modal-close">×</button>
                        </div>
                        <div class="history-list" id="historyList">
                            <!-- Lista de histórico será inserida aqui -->
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * Renderizar cartões de documentos
     */
    renderDocumentCards() {
        return this.documentTemplates.map(doc => {
            const historyCount = this.documentHistory[doc.id]?.length || 0;
            const hasSignedDocument = this.documentHistory[doc.id]?.some(h => h.status === 'assinado');
            const signatureClass = doc.requiresSignature ? 
                (hasSignedDocument ? 'completed' : 'required') : '';

            return `
                <div class="document-card" onclick="DocumentosProfissional.openDocument('${doc.id}')">
                    ${doc.requiresSignature ? `<div class="signature-indicator ${signatureClass}"></div>` : ''}
                    ${historyCount > 0 ? `<div class="history-count">${historyCount}</div>` : ''}
                    
                    <div class="card-header">
                        <div class="card-icon">${doc.icon}</div>
                        <div class="card-title-section">
                            <h3 class="card-title">${doc.title}</h3>
                            <div class="card-category">${doc.category}</div>
                        </div>
                    </div>
                    
                    <p class="card-description">${doc.description}</p>
                    
                    <div class="card-actions">
                        <button onclick="event.stopPropagation(); DocumentosProfissional.openDocument('${doc.id}')" class="card-action-btn primary">
                            📄 Gerar
                        </button>
                        ${doc.requiresSignature ? `
                            <button onclick="event.stopPropagation(); DocumentosProfissional.sendForSignature('${doc.id}')" class="card-action-btn">
                                ✍️ Assinar
                            </button>
                        ` : ''}
                        ${historyCount > 0 ? `
                            <button onclick="event.stopPropagation(); DocumentosProfissional.viewHistory('${doc.id}')" class="card-action-btn">
                                📚 Histórico
                            </button>
                        ` : ''}
                    </div>
                </div>
            `;
        }).join('');
    },

    /**
     * Renderizar template de documento
     */
    renderDocumentTemplate(docType) {
        const doc = this.documentTemplates.find(d => d.id === docType);
        if (!doc) return '';

        const patient = this.currentPatient;
        const currentDate = new Date().toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });

        switch (docType) {
            case 'contrato-tratamento':
                return `
                    <div class="document-header-preview">
                        <h1 class="clinic-name">DentalCore Pro</h1>
                        <p><strong>CRO: 12345 | CNPJ: 12.345.678/0001-90</strong></p>
                        <p>Rua das Flores, 123 - Centro - São Paulo/SP</p>
                    </div>
                    
                    <h2 class="document-type-title">Contrato de Tratamento Odontológico</h2>
                    
                    <div class="patient-info-preview">
                        <h3>Dados do Paciente</h3>
                        <div class="patient-field">Nome: <span class="highlight-field">${patient?.name || '[NOME DO PACIENTE]'}</span></div>
                        <div class="patient-field">Telefone: <span class="highlight-field">${patient?.phone || '[TELEFONE]'}</span></div>
                        <div class="patient-field">Data: <span class="highlight-field">${currentDate}</span></div>
                    </div>
                    
                    <p><strong>CLÁUSULA PRIMEIRA - DO OBJETO</strong></p>
                    <p>O presente contrato tem por objeto a prestação de serviços odontológicos pelo profissional acima qualificado ao paciente, compreendendo os procedimentos especificados no plano de tratamento anexo.</p>
                    
                    <p><strong>CLÁUSULA SEGUNDA - DOS PROCEDIMENTOS</strong></p>
                    <p>Os procedimentos a serem realizados incluem: [LISTA DE PROCEDIMENTOS A SER PREENCHIDA]</p>
                    
                    <p><strong>CLÁUSULA TERCEIRA - DO VALOR E FORMA DE PAGAMENTO</strong></p>
                    <p>O valor total do tratamento é de R$ [VALOR TOTAL], a ser pago conforme condições especificadas no orçamento anexo.</p>
                    
                    <p><strong>CLÁUSULA QUARTA - DAS RESPONSABILIDADES</strong></p>
                    <p>O paciente se compromete a seguir todas as orientações pós-operatórias e comparecer às consultas agendadas.</p>
                    
                    <br><br>
                    <div style="display: flex; justify-content: space-between; margin-top: 50px;">
                        <div style="text-align: center; width: 45%;">
                            <div style="border-top: 1px solid #000; padding-top: 8px;">
                                <strong>Paciente</strong><br>
                                ${patient?.name || '[NOME DO PACIENTE]'}
                            </div>
                        </div>
                        <div style="text-align: center; width: 45%;">
                            <div style="border-top: 1px solid #000; padding-top: 8px;">
                                <strong>Profissional</strong><br>
                                Dr. Responsável - CRO 12345
                            </div>
                        </div>
                    </div>
                `;

            case 'tcle':
                return `
                    <div class="document-header-preview">
                        <h1 class="clinic-name">DentalCore Pro</h1>
                    </div>
                    
                    <h2 class="document-type-title">Termo de Consentimento Livre e Esclarecido</h2>
                    
                    <div class="patient-info-preview">
                        <div class="patient-field">Paciente: <span class="highlight-field">${patient?.name || '[NOME DO PACIENTE]'}</span></div>
                        <div class="patient-field">Data: <span class="highlight-field">${currentDate}</span></div>
                    </div>
                    
                    <p>Eu, <strong>${patient?.name || '[NOME DO PACIENTE]'}</strong>, declaro ter sido informado(a) de forma clara e detalhada sobre:</p>
                    
                    <ul>
                        <li>O diagnóstico da minha condição odontológica;</li>
                        <li>O(s) procedimento(s) que será(ão) realizado(s);</li>
                        <li>Os riscos e benefícios do tratamento;</li>
                        <li>As alternativas de tratamento disponíveis;</li>
                        <li>As consequências da não realização do tratamento;</li>
                        <li>Os cuidados pós-operatórios necessários.</li>
                    </ul>
                    
                    <p><strong>RISCOS E COMPLICAÇÕES:</strong></p>
                    <p>Fui informado(a) que, como em qualquer procedimento médico/odontológico, existem riscos inerentes, incluindo mas não limitado a: dor, sangramento, infecção, necessidade de tratamentos adicionais.</p>
                    
                    <p><strong>CONSENTIMENTO:</strong></p>
                    <p>Após ter recebido todas as informações necessárias e ter tido a oportunidade de esclarecer minhas dúvidas, consinto livremente com a realização do tratamento proposto.</p>
                    
                    <br><br>
                    <div style="text-align: center; margin-top: 50px;">
                        <div style="border-top: 1px solid #000; padding-top: 8px; width: 300px; margin: 0 auto;">
                            <strong>Assinatura do Paciente</strong><br>
                            ${patient?.name || '[NOME DO PACIENTE]'}
                        </div>
                    </div>
                `;

            case 'receituario':
                return `
                    <div class="document-header-preview">
                        <h1 class="clinic-name">Dr. Responsável</h1>
                        <p><strong>CRO: 12345 | Cirurgião-Dentista</strong></p>
                        <p>Rua das Flores, 123 - Centro - São Paulo/SP</p>
                    </div>
                    
                    <h2 class="document-type-title">Receituário</h2>
                    
                    <div class="patient-info-preview">
                        <div class="patient-field">Paciente: <span class="highlight-field">${patient?.name || '[NOME DO PACIENTE]'}</span></div>
                        <div class="patient-field">Data: <span class="highlight-field">${currentDate}</span></div>
                    </div>
                    
                    <div style="min-height: 200px; border: 1px solid #ddd; padding: 20px; margin: 20px 0;">
                        <p><strong>PRESCRIÇÃO:</strong></p>
                        <br>
                        <p>1. ________________________</p>
                        <br>
                        <p>2. ________________________</p>
                        <br>
                        <p>3. ________________________</p>
                        <br><br>
                        <p><strong>ORIENTAÇÕES:</strong></p>
                        <p>_________________________________</p>
                        <p>_________________________________</p>
                    </div>
                    
                    <div style="text-align: right; margin-top: 50px;">
                        <div style="border-top: 1px solid #000; padding-top: 8px; width: 200px; margin-left: auto;">
                            <strong>Dr. Responsável</strong><br>
                            CRO 12345
                        </div>
                    </div>
                `;

            default:
                return `
                    <div class="document-header-preview">
                        <h1 class="clinic-name">DentalCore Pro</h1>
                    </div>
                    
                    <h2 class="document-type-title">${doc.title}</h2>
                    
                    <div class="patient-info-preview">
                        <div class="patient-field">Paciente: <span class="highlight-field">${patient?.name || '[NOME DO PACIENTE]'}</span></div>
                        <div class="patient-field">Data: <span class="highlight-field">${currentDate}</span></div>
                    </div>
                    
                    <p>Conteúdo do documento ${doc.title} será implementado conforme necessidade específica.</p>
                    
                    <div style="min-height: 300px; border: 1px solid #ddd; padding: 20px; margin: 20px 0;">
                        <p><em>Área para conteúdo específico do documento...</em></p>
                    </div>
                `;
        }
    },

    /**
     * FUNÇÕES DE INTERAÇÃO
     */

    openDocument(docType) {
        this.selectedDocumentType = docType;
        const doc = this.documentTemplates.find(d => d.id === docType);
        
        document.getElementById('modalTitle').textContent = doc.title;
        document.getElementById('documentPreview').innerHTML = this.renderDocumentTemplate(docType);
        document.getElementById('documentModal').classList.add('active');
    },

    closeModal() {
        document.getElementById('documentModal').classList.remove('active');
    },

    viewHistory(docType) {
        const doc = this.documentTemplates.find(d => d.id === docType);
        const history = this.documentHistory[docType] || [];
        
        document.getElementById('historyModalTitle').textContent = `Histórico - ${doc.title}`;
        
        const historyHTML = history.length > 0 ? 
            history.map(item => `
                <div class="history-item">
                    <div class="history-info">
                        <div class="history-date">${new Date(item.date).toLocaleDateString('pt-BR')}</div>
                        <div class="history-status">Versão ${item.version}</div>
                    </div>
                    <div class="status-badge status-${item.status}">${item.status}</div>
                </div>
            `).join('') :
            '<div style="text-align: center; padding: 40px; color: #6b7280;">Nenhum documento encontrado no histórico</div>';
        
        document.getElementById('historyList').innerHTML = historyHTML;
        document.getElementById('historyModal').classList.add('active');
    },

    closeHistoryModal() {
        document.getElementById('historyModal').classList.remove('active');
    },

    saveDocument() {
        this.showAlert('💾 Documento Salvo', 'Documento salvo como rascunho no prontuário do paciente.');
    },

    downloadPDF() {
        this.showAlert('📄 Gerando PDF', 'Download do documento em PDF iniciado.');
    },

    sendForSignature(docType = null) {
        const selectedType = docType || this.selectedDocumentType;
        const doc = this.documentTemplates.find(d => d.id === selectedType);
        
        this.showAlert('✍️ Enviado para Assinatura', 
            `${doc.title} enviado para assinatura eletrônica!\n\n` +
            `📧 Notificação enviada para: ${this.currentPatient?.email || 'email@paciente.com'}\n` +
            `📱 SMS enviado para: ${this.currentPatient?.phone || '(11) 99999-9999'}\n\n` +
            `Status: Aguardando assinatura`
        );
    },

    openCustomDocument() {
        this.showAlert('📝 Documento Personalizado', 'Funcionalidade de documento personalizado será implementada.');
    },

    uploadCustomDocument() {
        this.showAlert('📤 Upload de Arquivo', 'Funcionalidade de upload será implementada.');
    },

    createFromScratch() {
        this.showAlert('✨ Criar do Zero', 'Editor de documentos será implementado.');
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
window.DocumentosProfissional = DocumentosProfissional;

console.log('📄 Módulo Documentos Profissional carregado!');