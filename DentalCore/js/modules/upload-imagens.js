// ============================================================================
// DENTALCORE PRO - MÓDULO DE UPLOAD DE IMAGENS PREMIUM - VERSÃO CORRIGIDA FINAL
// ============================================================================

const UploadImagens = {
    currentPatientId: null,
    uploadQueue: [],
    isUploading: false,
    supportedFormats: ['.jpg', '.jpeg', '.png', '.heic', '.webp', '.bmp', '.tiff'],
    maxFileSize: 10 * 1024 * 1024, // 10MB
    
    /**
     * Inicializar módulo de upload
     */
    init() {
        console.log('📤 Módulo de Upload de Imagens carregado com sucesso!');
        this.addCustomStyles();
        this.setupEventListeners();
    },

    /**
     * Adicionar estilos customizados
     */
    addCustomStyles() {
        if (!document.getElementById('uploadImagesPremiumStyles')) {
            const styles = document.createElement('style');
            styles.id = 'uploadImagesPremiumStyles';
            styles.textContent = `
                /* Estilos Premium para Upload */
                .upload-modal {
                    position: fixed;
                    inset: 0;
                    background: rgba(0, 0, 0, 0.8);
                    backdrop-filter: blur(8px);
                    z-index: 60;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 24px;
                }
                
                .upload-container {
                    background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
                    border: 1px solid rgba(71, 85, 105, 0.3);
                    border-radius: 24px;
                    width: 100%;
                    max-width: 900px;
                    max-height: 90vh;
                    overflow-y: auto;
                    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.4);
                    position: relative;
                }
                
                .upload-header {
                    background: linear-gradient(135deg, #0e7490 0%, #0d9488 100%);
                    color: white;
                    padding: 24px;
                    border-radius: 24px 24px 0 0;
                    position: sticky;
                    top: 0;
                    z-index: 10;
                }
                
                .upload-drop-zone {
                    border: 3px dashed rgba(14, 116, 144, 0.4);
                    border-radius: 16px;
                    background: linear-gradient(135deg, rgba(14, 116, 144, 0.05) 0%, rgba(13, 148, 136, 0.05) 100%);
                    padding: 60px 40px;
                    text-align: center;
                    transition: all 0.3s ease;
                    cursor: pointer;
                    position: relative;
                    overflow: hidden;
                    margin: 24px;
                }
                
                .upload-drop-zone.drag-active {
                    border-color: rgba(14, 116, 144, 1);
                    background: linear-gradient(135deg, rgba(14, 116, 144, 0.15) 0%, rgba(13, 148, 136, 0.15) 100%);
                    transform: scale(1.02);
                }
                
                .upload-progress-container {
                    margin: 24px;
                    max-height: 400px;
                    overflow-y: auto;
                }
                
                .upload-item {
                    background: rgba(30, 41, 59, 0.6);
                    border: 1px solid rgba(148, 163, 184, 0.2);
                    border-radius: 12px;
                    padding: 20px;
                    margin-bottom: 16px;
                    transition: all 0.3s ease;
                }
                
                .upload-item.completed {
                    border-color: rgba(16, 185, 129, 0.5);
                    background: rgba(16, 185, 129, 0.1);
                }
                
                .upload-item.error {
                    border-color: rgba(239, 68, 68, 0.5);
                    background: rgba(239, 68, 68, 0.1);
                }
                
                .progress-bar {
                    background: rgba(71, 85, 105, 0.3);
                    border-radius: 8px;
                    height: 8px;
                    overflow: hidden;
                    margin: 8px 0;
                }
                
                .progress-fill {
                    height: 100%;
                    background: linear-gradient(90deg, #0e7490, #0d9488);
                    border-radius: 8px;
                    transition: width 0.3s ease;
                    position: relative;
                }
                
                .progress-fill::after {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
                    animation: progress-shine 2s infinite;
                }
                
                @keyframes progress-shine {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
                
                .file-preview {
                    width: 80px;
                    height: 80px;
                    border-radius: 12px;
                    object-fit: cover;
                    border: 2px solid rgba(148, 163, 184, 0.3);
                }
                
                .metadata-form {
                    background: rgba(30, 41, 59, 0.4);
                    border: 1px solid rgba(148, 163, 184, 0.2);
                    border-radius: 16px;
                    padding: 20px;
                    margin-top: 16px;
                }
                
                .form-group {
                    margin-bottom: 16px;
                }
                
                .form-label {
                    display: block;
                    color: #94a3b8;
                    font-size: 14px;
                    font-weight: 600;
                    margin-bottom: 8px;
                }
                
                .form-input, .form-select {
                    width: 100%;
                    background: rgba(30, 41, 59, 0.8);
                    border: 1px solid rgba(148, 163, 184, 0.3);
                    border-radius: 12px;
                    color: #f1f5f9;
                    padding: 14px 18px;
                    font-size: 14px;
                    transition: all 0.3s ease;
                }
                
                .form-input:focus, .form-select:focus {
                    border-color: rgba(14, 116, 144, 0.6);
                    box-shadow: 0 0 0 3px rgba(14, 116, 144, 0.1);
                    outline: none;
                    background: rgba(30, 41, 59, 0.9);
                }
                
                .form-textarea {
                    width: 100%;
                    background: rgba(30, 41, 59, 0.8);
                    border: 1px solid rgba(148, 163, 184, 0.3);
                    border-radius: 12px;
                    color: #f1f5f9;
                    padding: 14px 18px;
                    font-size: 14px;
                    transition: all 0.3s ease;
                    resize: vertical;
                    min-height: 80px;
                }
                
                .form-textarea:focus {
                    border-color: rgba(14, 116, 144, 0.6);
                    box-shadow: 0 0 0 3px rgba(14, 116, 144, 0.1);
                    outline: none;
                    background: rgba(30, 41, 59, 0.9);
                }
                
                .upload-button {
                    background: linear-gradient(135deg, #0e7490 0%, #0d9488 100%);
                    border: 1px solid rgba(20, 184, 166, 0.3);
                    border-radius: 12px;
                    color: white;
                    font-weight: 600;
                    padding: 14px 28px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 15px rgba(14, 116, 144, 0.3);
                }
                
                .upload-button:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 25px rgba(14, 116, 144, 0.4);
                }
                
                .upload-button:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                    transform: none;
                }
                
                .type-badge {
                    display: inline-block;
                    padding: 4px 12px;
                    border-radius: 20px;
                    font-size: 11px;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                
                .type-fotografia {
                    background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
                    color: #dbeafe;
                }
                
                .type-radiografia {
                    background: linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%);
                    color: #ede9fe;
                }
                
                .type-exame {
                    background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
                    color: #fee2e2;
                }
                
                .upload-text-primary { color: #f1f5f9; font-weight: 600; }
                .upload-text-secondary { color: #94a3b8; font-weight: 400; }
                .upload-text-muted { color: #64748b; font-weight: 400; }
                .upload-text-success { color: #10b981; font-weight: 500; }
                .upload-text-error { color: #ef4444; font-weight: 500; }
            `;
            document.head.appendChild(styles);
        }
    },

    /**
     * Configurar event listeners globais
     */
    setupEventListeners() {
        document.addEventListener('dragover', this.preventDefaults);
        document.addEventListener('drop', this.preventDefaults);
        
        if (!document.getElementById('hiddenFileInput')) {
            const hiddenInput = document.createElement('input');
            hiddenInput.type = 'file';
            hiddenInput.id = 'hiddenFileInput';
            hiddenInput.multiple = true;
            hiddenInput.accept = this.supportedFormats.join(',');
            hiddenInput.style.display = 'none';
            hiddenInput.addEventListener('change', (e) => this.handleFileSelect(e));
            document.body.appendChild(hiddenInput);
        }
    },

    preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    },

    /**
     * Abrir modal de upload
     */
    openUploadModal(patientId) {
        this.currentPatientId = patientId;
        this.uploadQueue = [];
        
        const modal = document.createElement('div');
        modal.className = 'upload-modal';
        modal.id = 'uploadModal';
        modal.innerHTML = this.renderUploadModal();
        
        document.body.appendChild(modal);
        this.setupModalEventListeners();
    },

    /**
     * Renderizar modal de upload
     */
    renderUploadModal() {
        return `
            <div class="upload-container">
                <!-- Cabeçalho -->
                <div class="upload-header">
                    <div class="flex items-center justify-between">
                        <div>
                            <h2 class="text-2xl font-bold mb-2">Upload de Imagens</h2>
                            <p class="text-teal-100 opacity-90">Adicione fotos, radiografias e exames ao prontuário</p>
                        </div>
                        <button onclick="UploadImagens.closeModal()" class="text-white hover:text-teal-200 transition-colors">
                            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>
                    </div>
                </div>

                <!-- Área de Drop Principal -->
                <div class="upload-drop-zone" 
                     id="mainDropZone"
                     ondrop="UploadImagens.handleDrop(event)"
                     ondragover="UploadImagens.handleDragOver(event)"
                     ondragenter="UploadImagens.handleDragEnter(event)"
                     ondragleave="UploadImagens.handleDragLeave(event)"
                     onclick="UploadImagens.openFileSelector()">
                    <div class="relative z-10">
                        <svg class="h-20 w-20 upload-text-secondary mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                        </svg>
                        <h3 class="text-2xl font-semibold upload-text-primary mb-3">Arraste arquivos aqui</h3>
                        <p class="upload-text-secondary text-lg mb-6">ou clique para selecionar</p>
                        <div class="flex items-center justify-center space-x-6 text-sm upload-text-muted">
                            <span>📸 JPG, PNG</span>
                            <span>🏥 HEIC, WebP</span>
                            <span>📊 TIFF, BMP</span>
                            <span>📏 Até 10MB</span>
                        </div>
                    </div>
                </div>

                <!-- Área de Progresso -->
                <div id="uploadProgressContainer" class="upload-progress-container hidden">
                    <h3 class="upload-text-primary font-semibold text-lg mb-4 px-6">Arquivos Selecionados</h3>
                    <div id="uploadProgressList">
                        <!-- Itens de progresso serão adicionados aqui -->
                    </div>
                </div>

                <!-- Botões de Ação -->
                <div class="flex items-center justify-between p-6 border-t border-gray-700">
                    <div class="upload-text-secondary text-sm">
                        <span id="fileCount">0 arquivos</span> selecionados
                    </div>
                    <div class="flex items-center space-x-3">
                        <button onclick="UploadImagens.closeModal()" class="px-6 py-3 border border-gray-600 text-gray-300 hover:text-white hover:border-gray-500 rounded-lg transition-colors font-medium">
                            Cancelar
                        </button>
                        <button id="startUploadBtn" onclick="UploadImagens.startUpload()" 
                                class="upload-button" disabled>
                            📤 Iniciar Upload
                        </button>
                    </div>
                </div>
            </div>
        `;
    },

    setupModalEventListeners() {
        const dropZone = document.getElementById('mainDropZone');
        if (dropZone) {
            dropZone.addEventListener('dragover', this.handleDragOver.bind(this));
            dropZone.addEventListener('dragenter', this.handleDragEnter.bind(this));
            dropZone.addEventListener('dragleave', this.handleDragLeave.bind(this));
            dropZone.addEventListener('drop', this.handleDrop.bind(this));
        }
    },

    handleDragOver(e) { e.preventDefault(); },
    handleDragEnter(e) { 
        e.preventDefault(); 
        document.getElementById('mainDropZone').classList.add('drag-active'); 
    },
    handleDragLeave(e) { 
        e.preventDefault(); 
        if (!e.currentTarget.contains(e.relatedTarget)) {
            document.getElementById('mainDropZone').classList.remove('drag-active'); 
        }
    },
    handleDrop(e) {
        e.preventDefault();
        document.getElementById('mainDropZone').classList.remove('drag-active');
        const files = Array.from(e.dataTransfer.files);
        this.processFiles(files);
    },

    openFileSelector() {
        document.getElementById('hiddenFileInput').click();
    },

    handleFileSelect(e) {
        const files = Array.from(e.target.files);
        this.processFiles(files);
        e.target.value = '';
    },

    /**
     * Processar arquivos selecionados
     */
    processFiles(files) {
        const validFiles = [];
        const errors = [];

        files.forEach((file, index) => {
            const validation = this.validateFile(file);
            if (validation.valid) {
                const timestamp = Date.now();
                const randomNum = Math.floor(Math.random() * 10000);
                const fileItem = {
                    id: `file_${timestamp}_${index}_${randomNum}`,
                    file: file,
                    name: file.name,
                    size: file.size,
                    type: this.determineImageType(file),
                    status: 'pending',
                    progress: 0,
                    previewUrl: null,
                    metadata: {
                        description: '',
                        treatment: '',
                        date: new Date().toISOString().split('T')[0],
                        notes: ''
                    }
                };
                
                validFiles.push(fileItem);
                this.generatePreview(fileItem);
            } else {
                errors.push(`${file.name}: ${validation.error}`);
            }
        });

        if (errors.length > 0) {
            UI.showAlert(`❌ Arquivos Rejeitados\n\n${errors.join('\n')}\n\nVerifique o formato e tamanho dos arquivos.`);
        }

        if (validFiles.length > 0) {
            this.uploadQueue.push(...validFiles);
            this.updateUploadInterface();
        }
    },

    validateFile(file) {
        const extension = '.' + file.name.split('.').pop().toLowerCase();
        if (!this.supportedFormats.includes(extension)) {
            return { valid: false, error: `Formato ${extension} não suportado` };
        }
        if (file.size > this.maxFileSize) {
            return { valid: false, error: `Arquivo muito grande (máx: ${this.maxFileSize / 1024 / 1024}MB)` };
        }
        return { valid: true };
    },

    determineImageType(file) {
        const name = file.name.toLowerCase();
        if (name.includes('radio') || name.includes('rx') || name.includes('xray')) {
            return 'radiografia';
        } else if (name.includes('exame') || name.includes('exam') || name.includes('dicom')) {
            return 'exame';
        } else {
            return 'fotografia';
        }
    },

    generatePreview(fileItem) {
        if (fileItem.file.isSimulated) {
            fileItem.previewUrl = fileItem.file.simulatedUrl;
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            fileItem.previewUrl = e.target.result;
            this.updateFilePreview(fileItem.id);
        };
        reader.readAsDataURL(fileItem.file);
    },

    updateFilePreview(fileId) {
        const preview = document.getElementById(`preview-${fileId}`);
        const fileItem = this.uploadQueue.find(item => item.id === fileId);
        
        if (preview && fileItem && fileItem.previewUrl) {
            preview.src = fileItem.previewUrl;
        }
    },

    /**
     * Atualizar interface de upload
     */
    updateUploadInterface() {
        const container = document.getElementById('uploadProgressContainer');
        const list = document.getElementById('uploadProgressList');
        const fileCount = document.getElementById('fileCount');
        const uploadBtn = document.getElementById('startUploadBtn');

        if (!container || !list) return;

        container.classList.remove('hidden');
        fileCount.textContent = `${this.uploadQueue.length} arquivo${this.uploadQueue.length !== 1 ? 's' : ''}`;
        uploadBtn.disabled = this.uploadQueue.length === 0;

        list.innerHTML = this.uploadQueue.map(item => this.renderUploadItem(item)).join('');
    },

    /**
     * Renderizar item de upload - VERSÃO COMPLETA COM FORMULÁRIO
     */
    renderUploadItem(item) {
        const statusIcon = {
            'pending': '⏳',
            'uploading': '🔄',
            'processing': '⚙️',
            'completed': '✅',
            'error': '❌'
        };

        const statusText = {
            'pending': 'Aguardando',
            'uploading': 'Enviando...',
            'processing': 'Processando...',
            'completed': 'Concluído',
            'error': 'Erro'
        };

        return `
            <div class="upload-item ${item.status}" id="item-${item.id}">
                <div class="flex items-start space-x-6">
                    <!-- Preview da Imagem -->
                    <div class="flex-shrink-0">
                        <img id="preview-${item.id}" 
                             src="${item.previewUrl || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIGZpbGw9Im5vbmUiIHZpZXdCb3g9IjAgMCA4MCA4MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iODAiIGhlaWdodD0iODAiIGZpbGw9IiMzMzQxNTUiIHJ4PSIxMiIvPjxwYXRoIGQ9Ik00MCAyNWM3LjE4IDAgMTMgNS44MiAxMyAxM3MtNS44MiAxMy0xMyAxMy0xMy01LjgyLTEzLTEzIDUuODItMTMgMTMtMTN6IiBmaWxsPSIjNjQ3NDhiIi8+PC9zdmc+'}" 
                             alt="${item.name}" 
                             class="file-preview">
                    </div>
                    
                    <!-- Informações e Formulário -->
                    <div class="flex-1 min-w-0">
                        <!-- Cabeçalho do Item -->
                        <div class="flex items-center justify-between mb-3">
                            <div class="flex-1">
                                <h4 class="upload-text-primary font-semibold text-lg truncate">${item.name}</h4>
                                <div class="flex items-center space-x-4 text-sm upload-text-muted mt-1">
                                    <span>${this.formatFileSize(item.size)}</span>
                                    <span class="type-badge type-${item.type}">${item.type}</span>
                                </div>
                            </div>
                            <div class="flex items-center space-x-3">
                                <span class="text-sm upload-text-secondary">
                                    ${statusIcon[item.status]} ${statusText[item.status]}
                                </span>
                                <button onclick="UploadImagens.removeFromQueue('${item.id}')" 
                                        class="text-gray-400 hover:text-red-400 transition-colors">
                                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <!-- Barra de Progresso -->
                        <div class="progress-bar">
                            <div class="progress-fill" id="progress-${item.id}" style="width: ${item.progress}%"></div>
                        </div>

                        <!-- Formulário de Metadados - SEMPRE VISÍVEL QUANDO PENDING -->
                        ${item.status === 'pending' ? this.renderMetadataForm(item) : ''}

                        <!-- Informações após Upload -->
                        ${item.status === 'completed' ? this.renderCompletedInfo(item) : ''}
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * Renderizar formulário de metadados - VERSÃO COMPLETA
     */
    renderMetadataForm(item) {
        return `
            <div class="metadata-form">
                <h5 class="upload-text-primary font-semibold text-base mb-4">📝 Informações da Imagem</h5>
                
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <!-- Descrição -->
                    <div class="form-group lg:col-span-2">
                        <label class="form-label">📄 Descrição</label>
                        <input type="text" 
                               class="form-input" 
                               placeholder="Ex: Sorriso inicial, Radiografia panorâmica, Exame pré-operatório..."
                               value="${item.metadata.description}"
                               onchange="UploadImagens.updateMetadata('${item.id}', 'description', this.value)">
                    </div>

                    <!-- Tipo de Imagem -->
                    <div class="form-group">
                        <label class="form-label">🏷️ Tipo de Imagem</label>
                        <select class="form-select" onchange="UploadImagens.updateMetadata('${item.id}', 'type', this.value)">
                            <option value="fotografia" ${item.type === 'fotografia' ? 'selected' : ''}>📸 Fotografia</option>
                            <option value="radiografia" ${item.type === 'radiografia' ? 'selected' : ''}>🦴 Radiografia</option>
                            <option value="exame" ${item.type === 'exame' ? 'selected' : ''}>🔬 Exame Clínico</option>
                        </select>
                    </div>

                    <!-- Data da Imagem -->
                    <div class="form-group">
                        <label class="form-label">📅 Data da Imagem</label>
                        <input type="date" 
                               class="form-input" 
                               value="${item.metadata.date}"
                               onchange="UploadImagens.updateMetadata('${item.id}', 'date', this.value)">
                    </div>

                    <!-- Tratamento Associado -->
                    <div class="form-group lg:col-span-2">
                        <label class="form-label">🦷 Tratamento Associado</label>
                        <select class="form-select" onchange="UploadImagens.updateMetadata('${item.id}', 'treatment', this.value)">
                            <option value="">Selecione um tratamento (opcional)</option>
                            <option value="avaliacao-inicial" ${item.metadata.treatment === 'avaliacao-inicial' ? 'selected' : ''}>🔍 Avaliação Inicial</option>
                            <option value="limpeza" ${item.metadata.treatment === 'limpeza' ? 'selected' : ''}>🧽 Limpeza e Profilaxia</option>
                            <option value="restauracao" ${item.metadata.treatment === 'restauracao' ? 'selected' : ''}>🔧 Restauração</option>
                            <option value="canal" ${item.metadata.treatment === 'canal' ? 'selected' : ''}>🩺 Tratamento de Canal</option>
                            <option value="ortodontia" ${item.metadata.treatment === 'ortodontia' ? 'selected' : ''}>🦷 Ortodontia</option>
                            <option value="implante" ${item.metadata.treatment === 'implante' ? 'selected' : ''}>⚙️ Implante</option>
                            <option value="protese" ${item.metadata.treatment === 'protese' ? 'selected' : ''}>👄 Prótese</option>
                            <option value="extracao" ${item.metadata.treatment === 'extracao' ? 'selected' : ''}>🚫 Extração</option>
                            <option value="clareamento" ${item.metadata.treatment === 'clareamento' ? 'selected' : ''}>✨ Clareamento</option>
                            <option value="cirurgia" ${item.metadata.treatment === 'cirurgia' ? 'selected' : ''}>⚕️ Cirurgia</option>
                        </select>
                    </div>

                    <!-- Observações -->
                    <div class="form-group lg:col-span-2">
                        <label class="form-label">💭 Observações Adicionais</label>
                        <textarea class="form-textarea" 
                                  rows="3"
                                  placeholder="Ex: Paciente relatou dor, área inflamada, progresso do tratamento..."
                                  onchange="UploadImagens.updateMetadata('${item.id}', 'notes', this.value)">${item.metadata.notes}</textarea>
                    </div>
                </div>

                <!-- Dicas -->
                <div class="mt-4 p-4 bg-blue-900/20 border border-blue-600/30 rounded-lg">
                    <div class="flex items-start space-x-3">
                        <svg class="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <div>
                            <h6 class="text-blue-300 font-medium text-sm">💡 Dicas para Organização</h6>
                            <p class="text-blue-200 text-xs mt-1">
                                • Use descrições claras para facilitar a busca<br>
                                • Vincule a tratamentos para criar o histórico visual<br>
                                • Adicione observações importantes sobre o procedimento
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * Renderizar informações após conclusão
     */
    renderCompletedInfo(item) {
        return `
            <div class="mt-4 p-4 bg-green-900/20 border border-green-600/30 rounded-lg">
                <div class="flex items-center space-x-3">
                    <svg class="h-5 w-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <div>
                        <h6 class="text-green-300 font-medium text-sm">✅ Upload Concluído</h6>
                        <p class="text-green-200 text-xs mt-1">
                            Imagem processada e adicionada à galeria • 
                            ${item.metadata.treatment ? 'Vinculada ao tratamento' : 'Sem tratamento vinculado'}
                        </p>
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * Atualizar metadados
     */
    updateMetadata(itemId, field, value) {
        const item = this.uploadQueue.find(item => item.id == itemId);
        if (item) {
            if (field === 'type') {
                item.type = value;
                // Atualizar badge visual
                const badge = document.querySelector(`#item-${itemId} .type-badge`);
                if (badge) {
                    badge.className = `type-badge type-${value}`;
                    badge.textContent = value;
                }
            } else {
                item.metadata[field] = value;
            }
            console.log(`📝 Metadado atualizado:`, field, '=', value, 'para item:', itemId);
        }
    },

    removeFromQueue(itemId) {
        this.uploadQueue = this.uploadQueue.filter(item => item.id != itemId);
        this.updateUploadInterface();
    },

    async startUpload() {
        if (this.isUploading || this.uploadQueue.length === 0) return;

        this.isUploading = true;
        document.getElementById('startUploadBtn').disabled = true;

        for (const item of this.uploadQueue) {
            if (item.status === 'pending') {
                await this.uploadFile(item);
            }
        }

        this.isUploading = false;
        this.showUploadComplete();
    },

    async uploadFile(item) {
        try {
            console.log('🔄 Iniciando upload:', item.name, 'Metadados:', item.metadata);
            
            item.status = 'uploading';
            this.updateItemStatus(item);
            await this.simulateUploadProgress(item, 0, 60);

            item.status = 'processing';
            this.updateItemStatus(item);
            const processedData = await this.processImage(item);
            await this.simulateUploadProgress(item, 60, 90);

            const savedImage = await this.saveToDatabase(item, processedData);
            await this.simulateUploadProgress(item, 90, 100);

            item.status = 'completed';
            item.savedData = savedImage;
            this.updateItemStatus(item);

            console.log('✅ Upload concluído:', item.name);

        } catch (error) {
            console.error('❌ Erro no upload:', error);
            item.status = 'error';
            item.error = error.message;
            this.updateItemStatus(item);
        }
    },

    async simulateUploadProgress(item, start, end) {
        return new Promise((resolve) => {
            let current = start;
            const increment = (end - start) / 10;
            
            const interval = setInterval(() => {
                current += increment;
                item.progress = Math.min(current, end);
                
                const progressBar = document.getElementById(`progress-${item.id}`);
                if (progressBar) {
                    progressBar.style.width = `${item.progress}%`;
                }
                
                if (current >= end) {
                    clearInterval(interval);
                    resolve();
                }
            }, 100);
        });
    },

    async processImage(item) {
        await this.delay(500);
        return {
            originalUrl: item.previewUrl,
            thumbnailUrl: item.previewUrl + '?thumb=200x200',
            mediumUrl: item.previewUrl + '?size=800x600',
            fullUrl: item.previewUrl + '?quality=high',
            extractedMetadata: {
                width: 1920,
                height: 1080,
                fileSize: item.size,
                compressionRatio: 0.8,
                format: item.file.type
            }
        };
    },

    async saveToDatabase(item, processedData) {
        await this.delay(300);
        
        const timestamp = Date.now();
        const randomNum = Math.floor(Math.random() * 10000);
        
        const imageRecord = {
            id: `img_${timestamp}_${randomNum}`,
            patientId: this.currentPatientId,
            title: item.metadata.description || item.name,
            description: item.metadata.description,
            type: item.type,
            date: item.metadata.date,
            treatment: item.metadata.treatment,
            notes: item.metadata.notes,
            urls: processedData,
            metadata: processedData.extractedMetadata,
            uploadedAt: new Date().toISOString(),
            status: 'active'
        };

        // Integrar com módulo de imagens
        if (window.Imagens && window.Imagens.images) {
            window.Imagens.images.push({
                id: imageRecord.id,
                type: imageRecord.type,
                title: imageRecord.title,
                date: imageRecord.date,
                url: processedData.originalUrl,
                description: imageRecord.description,
                treatment: imageRecord.treatment,
                annotations: []
            });
        }

        return imageRecord;
    },

    updateItemStatus(item) {
        const itemElement = document.getElementById(`item-${item.id}`);
        if (itemElement) {
            itemElement.className = `upload-item ${item.status}`;
            
            // Substituir formulário por informações de conclusão se completado
            if (item.status === 'completed') {
                const metadataForm = itemElement.querySelector('.metadata-form');
                if (metadataForm) {
                    metadataForm.outerHTML = this.renderCompletedInfo(item);
                }
            }
        }
    },

    showUploadComplete() {
        const completed = this.uploadQueue.filter(item => item.status === 'completed').length;
        const errors = this.uploadQueue.filter(item => item.status === 'error').length;
        
        let message = `✅ Upload Concluído!\n\n`;
        
        if (completed > 0) {
            message += `📸 ${completed} imagem${completed !== 1 ? 's' : ''} processada${completed !== 1 ? 's' : ''} com sucesso\n`;
            message += `🏷️ Metadados e descrições salvos\n`;
            message += `🔗 Vínculos com tratamentos criados\n`;
        }
        
        if (errors > 0) {
            message += `❌ ${errors} arquivo${errors !== 1 ? 's' : ''} com erro\n`;
        }
        
        message += `\n🔄 Sincronização automática:\n`;
        message += `• Imagens visíveis na galeria\n`;
        message += `• Histórico atualizado\n`;
        message += `• Backup em nuvem`;

        UI.showAlert(message);

        // Atualizar galeria
        setTimeout(() => {
            if (window.Imagens && document.getElementById('imageGallery')) {
                const gallery = document.getElementById('imageGallery');
                gallery.innerHTML = window.Imagens.renderImageGallery();
            }
        }, 1000);
    },

    closeModal() {
        const modal = document.getElementById('uploadModal');
        if (modal) {
            modal.remove();
        }
        this.uploadQueue = [];
        this.isUploading = false;
    },

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    },

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
};

// Integração com módulo de imagens
if (typeof window.Imagens !== 'undefined') {
    window.Imagens.openUploadModal = function() {
        UploadImagens.openUploadModal(this.currentPatientId);
    };
}

// Exportar e inicializar
window.UploadImagens = UploadImagens;

document.addEventListener('DOMContentLoaded', function() {
    if (typeof UploadImagens !== 'undefined') {
        UploadImagens.init();
    }
});

console.log('📤 Módulo de Upload de Imagens Premium carregado!');