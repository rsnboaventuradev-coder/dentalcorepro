// ============================================================================
// DENTALCORE PRO - MÓDULO DE IMAGENS PREMIUM
// Interface Profissional para Desktop - Azul-Marinho e Carvão
// ============================================================================

const Imagens = {
    currentPatientId: null,
    selectedImage: null,
    annotationMode: null,
    images: [],
    filterType: 'all',
    filterDate: 'all',

    /**
     * Inicializar módulo de imagens
     */
    init() {
        console.log('📸 Módulo de Imagens Premium carregado com sucesso!');
        this.addCustomStyles();
        this.loadDemoImages();
    },

    /**
     * Adicionar estilos customizados para interface desktop profissional
     */
    addCustomStyles() {
        if (!document.getElementById('imagesPremiumStyles')) {
            const styles = document.createElement('style');
            styles.id = 'imagesPremiumStyles';
            styles.textContent = `
                /* Paleta Azul-Marinho e Carvão Premium */
                .images-workspace {
                    background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
                    min-height: 100vh;
                }
                
                .images-panel {
                    background: linear-gradient(135deg, #334155 0%, #1e293b 100%);
                    border: 1px solid rgba(71, 85, 105, 0.3);
                    border-radius: 20px;
                    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.4), 0 5px 15px rgba(0, 0, 0, 0.3);
                    backdrop-filter: blur(20px);
                    position: relative;
                    overflow: hidden;
                }
                
                .images-panel::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 1px;
                    background: linear-gradient(90deg, transparent, rgba(14, 116, 144, 0.4), transparent);
                }
                
                .images-header {
                    background: linear-gradient(135deg, #0e7490 0%, #0d9488 100%);
                    border: 1px solid rgba(20, 184, 166, 0.3);
                    color: white;
                    font-weight: 600;
                    padding: 16px 24px;
                    border-radius: 16px;
                    position: relative;
                    overflow: hidden;
                    box-shadow: 0 8px 25px rgba(14, 116, 144, 0.3);
                }
                
                .images-button {
                    background: linear-gradient(135deg, #0e7490 0%, #0d9488 100%);
                    border: 1px solid rgba(20, 184, 166, 0.3);
                    border-radius: 12px;
                    color: white;
                    font-weight: 500;
                    padding: 12px 24px;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    box-shadow: 0 4px 15px rgba(14, 116, 144, 0.3);
                    position: relative;
                    overflow: hidden;
                }
                
                .images-button::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
                    transition: left 0.6s;
                }
                
                .images-button:hover::before {
                    left: 100%;
                }
                
                .images-button:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 30px rgba(14, 116, 144, 0.4);
                }
                
                .filter-button {
                    background: rgba(30, 41, 59, 0.6);
                    border: 1px solid rgba(148, 163, 184, 0.2);
                    border-radius: 10px;
                    color: #94a3b8;
                    padding: 8px 16px;
                    font-size: 14px;
                    font-weight: 500;
                    transition: all 0.3s ease;
                    cursor: pointer;
                }
                
                .filter-button.active {
                    background: linear-gradient(135deg, #0e7490 0%, #0d9488 100%);
                    border-color: rgba(20, 184, 166, 0.5);
                    color: white;
                    box-shadow: 0 4px 15px rgba(14, 116, 144, 0.3);
                }
                
                .filter-button:hover:not(.active) {
                    background: rgba(30, 41, 59, 0.8);
                    color: #e2e8f0;
                    border-color: rgba(148, 163, 184, 0.4);
                }
                
                .image-gallery {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                    gap: 20px;
                    padding: 24px;
                }
                
                .image-thumbnail {
                    background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
                    border: 2px solid rgba(71, 85, 105, 0.3);
                    border-radius: 16px;
                    overflow: hidden;
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    cursor: pointer;
                    position: relative;
                    aspect-ratio: 1;
                    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
                }
                
                .image-thumbnail::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: radial-gradient(circle at center, rgba(14, 116, 144, 0.1) 0%, transparent 70%);
                    opacity: 0;
                    transition: opacity 0.3s ease;
                    z-index: 1;
                }
                
                .image-thumbnail:hover {
                    transform: translateY(-8px) scale(1.02);
                    border-color: rgba(14, 116, 144, 0.6);
                    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.4), 0 8px 25px rgba(14, 116, 144, 0.2);
                }
                
                .image-thumbnail:hover::before {
                    opacity: 1;
                }
                
                .thumbnail-image {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: transform 0.3s ease;
                }
                
                .image-thumbnail:hover .thumbnail-image {
                    transform: scale(1.1);
                }
                
                .thumbnail-overlay {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
                    color: white;
                    padding: 16px;
                    transform: translateY(100%);
                    transition: transform 0.3s ease;
                    z-index: 2;
                }
                
                .image-thumbnail:hover .thumbnail-overlay {
                    transform: translateY(0);
                }
                
                .image-type-badge {
                    position: absolute;
                    top: 12px;
                    right: 12px;
                    padding: 4px 8px;
                    border-radius: 6px;
                    font-size: 10px;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    z-index: 2;
                }
                
                .type-radiografia {
                    background: linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%);
                    color: #ede9fe;
                }
                
                .type-fotografia {
                    background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
                    color: #dbeafe;
                }
                
                .type-exame {
                    background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
                    color: #fee2e2;
                }
                
                .before-after-group {
                    grid-column: span 2;
                    background: linear-gradient(135deg, #581c87 0%, #3730a3 100%);
                    border: 2px solid rgba(139, 92, 246, 0.3);
                    border-radius: 20px;
                    padding: 20px;
                    position: relative;
                    overflow: hidden;
                }
                
                .before-after-group::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 2px;
                    background: linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.6), transparent);
                }
                
                .before-after-header {
                    color: white;
                    font-weight: 600;
                    margin-bottom: 16px;
                    display: flex;
                    items-center;
                    justify-content: space-between;
                }
                
                .before-after-images {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 16px;
                }
                
                .before-after-item {
                    text-align: center;
                    cursor: pointer;
                    transition: transform 0.3s ease;
                }
                
                .before-after-item:hover {
                    transform: scale(1.05);
                }
                
                .before-after-item img {
                    width: 100%;
                    height: 150px;
                    object-fit: cover;
                    border-radius: 12px;
                    border: 1px solid rgba(255, 255, 255, 0.2);
                }
                
                .before-after-label {
                    color: #e0e7ff;
                    font-size: 12px;
                    font-weight: 600;
                    margin-top: 8px;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }
                
                .upload-zone {
                    border: 2px dashed rgba(14, 116, 144, 0.4);
                    border-radius: 16px;
                    background: linear-gradient(135deg, rgba(14, 116, 144, 0.05) 0%, rgba(13, 148, 136, 0.05) 100%);
                    padding: 40px;
                    text-align: center;
                    transition: all 0.3s ease;
                    cursor: pointer;
                    position: relative;
                    overflow: hidden;
                }
                
                .upload-zone::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(135deg, rgba(14, 116, 144, 0.1) 0%, rgba(13, 148, 136, 0.1) 100%);
                    opacity: 0;
                    transition: opacity 0.3s ease;
                }
                
                .upload-zone:hover {
                    border-color: rgba(14, 116, 144, 0.8);
                    background: linear-gradient(135deg, rgba(14, 116, 144, 0.1) 0%, rgba(13, 148, 136, 0.1) 100%);
                }
                
                .upload-zone:hover::before {
                    opacity: 1;
                }
                
                .upload-zone.drag-over {
                    border-color: rgba(14, 116, 144, 1);
                    background: linear-gradient(135deg, rgba(14, 116, 144, 0.15) 0%, rgba(13, 148, 136, 0.15) 100%);
                    transform: scale(1.02);
                }
                
                .side-panel {
                    position: fixed;
                    top: 0;
                    right: -600px;
                    width: 600px;
                    height: 100vh;
                    background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
                    border-left: 1px solid rgba(71, 85, 105, 0.3);
                    box-shadow: -25px 0 50px rgba(0, 0, 0, 0.4);
                    transition: right 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    z-index: 50;
                    overflow-y: auto;
                }
                
                .side-panel.open {
                    right: 0;
                }
                
                .annotation-tool {
                    background: rgba(30, 41, 59, 0.8);
                    border: 1px solid rgba(148, 163, 184, 0.2);
                    border-radius: 8px;
                    color: #f1f5f9;
                    padding: 8px 12px;
                    font-size: 14px;
                    font-weight: 500;
                    transition: all 0.3s ease;
                    cursor: pointer;
                }
                
                .annotation-tool.active {
                    background: linear-gradient(135deg, #0e7490 0%, #0d9488 100%);
                    border-color: rgba(20, 184, 166, 0.5);
                    color: white;
                    box-shadow: 0 4px 15px rgba(14, 116, 144, 0.3);
                }
                
                .annotation-tool:hover:not(.active) {
                    background: rgba(30, 41, 59, 1);
                    border-color: rgba(148, 163, 184, 0.4);
                }
                
                .image-viewer {
                    position: relative;
                    background: #000;
                    border-radius: 12px;
                    overflow: hidden;
                    margin-bottom: 20px;
                }
                
                .image-viewer img {
                    width: 100%;
                    height: auto;
                    display: block;
                }
                
                .annotation-canvas {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    cursor: crosshair;
                }
                
                .metadata-item {
                    background: rgba(30, 41, 59, 0.6);
                    border: 1px solid rgba(148, 163, 184, 0.2);
                    border-radius: 12px;
                    padding: 16px;
                    margin-bottom: 12px;
                }
                
                .images-text-primary {
                    color: #f1f5f9;
                    font-weight: 600;
                }
                
                .images-text-secondary {
                    color: #94a3b8;
                    font-weight: 400;
                }
                
                .images-text-muted {
                    color: #64748b;
                    font-weight: 400;
                }
            `;
            document.head.appendChild(styles);
        }
    },

    /**
     * Carregar imagens demo
     */
    loadDemoImages() {
        this.images = [
            {
                id: 1,
                type: 'fotografia',
                title: 'Sorriso Inicial',
                date: '2024-11-01',
                url: 'https://picsum.photos/400/400?random=1',
                description: 'Fotografia inicial do sorriso do paciente',
                treatment: 'Avaliação Inicial',
                annotations: []
            },
            {
                id: 2,
                type: 'radiografia',
                title: 'Radiografia Panorâmica',
                date: '2024-11-02',
                url: 'https://picsum.photos/400/400?random=2',
                description: 'Radiografia panorâmica para diagnóstico',
                treatment: 'Diagnóstico',
                annotations: []
            },
            {
                id: 3,
                type: 'fotografia',
                title: 'Sorriso Final',
                date: '2024-11-15',
                url: 'https://picsum.photos/400/400?random=3',
                description: 'Fotografia final após tratamento',
                treatment: 'Finalização',
                annotations: [],
                beforeAfterId: 1
            },
            {
                id: 4,
                type: 'exame',
                title: 'Exame Clínico',
                date: '2024-11-10',
                url: 'https://picsum.photos/400/400?random=4',
                description: 'Exame clínico detalhado',
                treatment: 'Acompanhamento',
                annotations: []
            }
        ];
    },

    /**
     * Renderizar interface de imagens premium
     */
    renderTabImagens(patient) {
        this.currentPatientId = patient.id;
        
        return `
            <div class="images-workspace p-8">
                <div class="max-w-8xl mx-auto">
                    
                    <!-- Cabeçalho Premium -->
                    <div class="mb-8">
                        <div class="flex items-center justify-between mb-6">
                            <div>
                                <h1 class="text-4xl font-light images-text-primary mb-3 tracking-tight">
                                    Arquivo Visual
                                </h1>
                                <p class="images-text-secondary text-lg">
                                    Galeria completa de imagens para ${patient.name}
                                </p>
                            </div>
                            <div class="flex items-center space-x-4">
                                <button onclick="Imagens.openUploadModal()" class="images-button flex items-center space-x-3">
                                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                                    </svg>
                                    <span>Upload & Captura</span>
                                </button>
                                <button onclick="Imagens.exportGallery()" class="images-button flex items-center space-x-3">
                                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                    </svg>
                                    <span>Exportar</span>
                                </button>
                            </div>
                        </div>

                        <!-- Filtros Inteligentes -->
                        <div class="images-panel p-6 mb-8">
                            <div class="flex items-center justify-between">
                                <div>
                                    <h3 class="images-text-primary font-semibold text-lg mb-4">Filtros & Organização</h3>
                                    <div class="flex items-center space-x-3">
                                        <span class="images-text-secondary text-sm">Tipo:</span>
                                        <button onclick="Imagens.setFilter('type', 'all')" 
                                                class="filter-button ${this.filterType === 'all' ? 'active' : ''}">
                                            Todos
                                        </button>
                                        <button onclick="Imagens.setFilter('type', 'fotografia')" 
                                                class="filter-button ${this.filterType === 'fotografia' ? 'active' : ''}">
                                            Fotografias
                                        </button>
                                        <button onclick="Imagens.setFilter('type', 'radiografia')" 
                                                class="filter-button ${this.filterType === 'radiografia' ? 'active' : ''}">
                                            Radiografias
                                        </button>
                                        <button onclick="Imagens.setFilter('type', 'exame')" 
                                                class="filter-button ${this.filterType === 'exame' ? 'active' : ''}">
                                            Exames
                                        </button>
                                    </div>
                                </div>
                                <div class="flex items-center space-x-4">
                                    <span class="images-text-secondary text-sm">Data:</span>
                                    <select onchange="Imagens.setFilter('date', this.value)" 
                                            class="filter-button bg-transparent">
                                        <option value="all">Todas as datas</option>
                                        <option value="2024-11">Novembro 2024</option>
                                        <option value="2024-10">Outubro 2024</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Galeria Principal -->
                    <div class="images-panel">
                        <div class="p-6">
                            <div class="flex items-center justify-between mb-6">
                                <h3 class="images-text-primary font-semibold text-lg">
                                    Galeria Visual (${this.getFilteredImages().length} imagens)
                                </h3>
                                <div class="flex items-center space-x-2">
                                    <button onclick="Imagens.toggleView('grid')" class="annotation-tool">
                                        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
                                        </svg>
                                    </button>
                                    <button onclick="Imagens.toggleView('list')" class="annotation-tool">
                                        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path>
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            <!-- Zona de Upload -->
                            <div class="upload-zone mb-8" 
                                 ondrop="Imagens.handleDrop(event)" 
                                 ondragover="Imagens.handleDragOver(event)"
                                 ondragenter="Imagens.handleDragEnter(event)"
                                 ondragleave="Imagens.handleDragLeave(event)"
                                 onclick="Imagens.openUploadModal()">
                                <div class="relative z-10">
                                    <svg class="h-16 w-16 text-teal-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                                    </svg>
                                    <h3 class="text-xl font-semibold images-text-primary mb-2">Upload & Captura</h3>
                                    <p class="images-text-secondary text-sm mb-4">Arraste arquivos aqui ou clique para selecionar</p>
                                    <div class="flex items-center justify-center space-x-4 text-xs images-text-muted">
                                        <span>📸 Câmera</span>
                                        <span>🖼️ Imagens</span>
                                        <span>📑 Documentos</span>
                                        <span>🦷 DICOM</span>
                                    </div>
                                </div>
                            </div>

                            <!-- Grade de Imagens -->
                            <div class="image-gallery" id="imageGallery">
                                ${this.renderImageGallery()}
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Painel Lateral para Visualização -->
                <div id="sidePanel" class="side-panel">
                    <!-- Conteúdo será carregado dinamicamente -->
                </div>
            </div>
        `;
    },

    /**
     * Renderizar galeria de imagens - VERSÃO CORRIGIDA
     */
    renderImageGallery() {
        const filteredImages = this.getFilteredImages();
        const beforeAfterGroups = this.groupBeforeAfter(filteredImages);
        
        let html = '';

        // Renderizar grupos antes/depois primeiro
        beforeAfterGroups.forEach(group => {
            if (group.length === 2) {
                html += `
                    <div class="before-after-group">
                        <div class="before-after-header">
                            <div>
                                <h4 class="text-lg font-semibold">Evolução do Tratamento</h4>
                                <p class="text-purple-200 text-sm">Comparação Antes & Depois</p>
                            </div>
                            <div class="text-xs text-purple-300">
                                ${group[0].treatment}
                            </div>
                        </div>
                        <div class="before-after-images">
                            <div class="before-after-item" onclick="Imagens.openImageViewer('${group[0].id}')">
                                <img src="${group[0].url}" alt="${group[0].title}">
                                <div class="before-after-label">Antes</div>
                            </div>
                            <div class="before-after-item" onclick="Imagens.openImageViewer('${group[1].id}')">
                                <img src="${group[1].url}" alt="${group[1].title}">
                                <div class="before-after-label">Depois</div>
                            </div>
                        </div>
                    </div>
                `;
            }
        });

        // Renderizar imagens individuais
        const individualImages = filteredImages.filter(img => !img.beforeAfterId && !filteredImages.find(i => i.beforeAfterId === img.id));
        
        individualImages.forEach(image => {
            html += `
                <div class="image-thumbnail" onclick="Imagens.openImageViewer('${image.id}')">
                    <div class="image-type-badge type-${image.type}">
                        ${image.type}
                    </div>
                    <img src="${image.url}" alt="${image.title}" class="thumbnail-image">
                    <div class="thumbnail-overlay">
                        <h4 class="font-semibold text-sm mb-1">${image.title}</h4>
                        <p class="text-xs opacity-80">${new Date(image.date).toLocaleDateString('pt-BR')}</p>
                        <p class="text-xs opacity-60 mt-1">${image.treatment}</p>
                    </div>
                </div>
            `;
        });

        return html || '<div class="col-span-full text-center py-16 images-text-secondary">Nenhuma imagem encontrada</div>';
    },

    /**
     * Abrir visualizador de imagem - VERSÃO CORRIGIDA
     */
    openImageViewer(imageId) {
        console.log('🖼️ Abrindo visualizador para imagem:', imageId);
        
        const image = this.images.find(img => img.id == imageId);
        if (!image) {
            console.error('❌ Imagem não encontrada:', imageId);
            UI.showAlert('❌ Erro\n\nImagem não encontrada no sistema.');
            return;
        }

        console.log('✅ Imagem encontrada:', image);
        
        this.selectedImage = image;
        const sidePanel = document.getElementById('sidePanel');
        
        if (!sidePanel) {
            console.error('❌ Painel lateral não encontrado');
            return;
        }
        
        sidePanel.innerHTML = `
            <div class="p-6">
                <!-- Cabeçalho do Painel -->
                <div class="flex items-center justify-between mb-6">
                    <h3 class="text-xl font-semibold images-text-primary">${image.title}</h3>
                    <button onclick="Imagens.closeSidePanel()" class="text-gray-400 hover:text-white transition-colors">
                        <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>

                <!-- Visualizador de Imagem -->
                <div class="image-viewer mb-6">
                    <img src="${image.url}" alt="${image.title}" id="viewerImage" style="width: 100%; height: auto; border-radius: 12px;">
                    <canvas id="annotationCanvas" class="annotation-canvas" style="display: none;"></canvas>
                </div>

                <!-- Ferramentas de Anotação -->
                <div class="mb-6">
                    <h4 class="images-text-primary font-semibold mb-3">🎨 Ferramentas de Anotação</h4>
                    <div class="grid grid-cols-3 gap-2">
                        <button onclick="Imagens.setAnnotationMode('draw')" 
                                class="annotation-tool flex items-center justify-center py-2 px-3 text-xs">
                            <svg class="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                            </svg>
                            Desenhar
                        </button>
                        <button onclick="Imagens.setAnnotationMode('highlight')" 
                                class="annotation-tool flex items-center justify-center py-2 px-3 text-xs">
                            <svg class="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h4a2 2 0 002-2V9a2 2 0 00-2-2H7a2 2 0 00-2 2v6a2 2 0 002 2z"></path>
                            </svg>
                            Destacar
                        </button>
                        <button onclick="Imagens.setAnnotationMode('text')" 
                                class="annotation-tool flex items-center justify-center py-2 px-3 text-xs">
                            <svg class="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                            </svg>
                            Texto
                        </button>
                    </div>
                </div>

                <!-- Metadados -->
                <div class="space-y-4">
                    <h4 class="images-text-primary font-semibold">📋 Informações da Imagem</h4>
                    
                    <div class="metadata-item">
                        <div class="flex items-center justify-between mb-2">
                            <span class="images-text-secondary text-sm">📝 Descrição</span>
                            <button onclick="Imagens.editDescription('${image.id}')" class="text-xs text-blue-400 hover:text-blue-300">
                                Editar
                            </button>
                        </div>
                        <p class="images-text-primary">${image.description || 'Sem descrição'}</p>
                    </div>

                    <div class="metadata-item">
                        <div class="images-text-secondary text-sm mb-1">📅 Data de Captura</div>
                        <p class="images-text-primary">${new Date(image.date).toLocaleDateString('pt-BR', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                        })}</p>
                    </div>

                    <div class="metadata-item">
                        <div class="images-text-secondary text-sm mb-1">🏷️ Tipo de Imagem</div>
                        <div class="flex items-center space-x-2">
                            <span class="image-type-badge type-${image.type}">${image.type}</span>
                        </div>
                    </div>

                    <div class="metadata-item">
                        <div class="flex items-center justify-between mb-2">
                            <span class="images-text-secondary text-sm">🦷 Tratamento Associado</span>
                            <button onclick="Imagens.linkToTreatment('${image.id}')" class="text-xs text-blue-400 hover:text-blue-300">
                                <svg class="h-3 w-3 mr-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
                                </svg>
                                Ver Prontuário
                            </button>
                        </div>
                        <p class="images-text-primary font-medium">${image.treatment || 'Nenhum tratamento vinculado'}</p>
                    </div>

                    <div class="metadata-item">
                        <div class="images-text-secondary text-sm mb-2">⚡ Ações Rápidas</div>
                        <div class="grid grid-cols-2 gap-2">
                            <button onclick="Imagens.downloadImage('${image.id}')" class="annotation-tool text-xs py-2 flex items-center justify-center">
                                <svg class="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                </svg>
                                Download
                            </button>
                            <button onclick="Imagens.shareImage('${image.id}')" class="annotation-tool text-xs py-2 flex items-center justify-center">
                                <svg class="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path>
                                </svg>
                                Compartilhar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        sidePanel.classList.add('open');
        console.log('✅ Painel lateral aberto com sucesso');
    },

    /**
     * Funções auxiliares
     */
    getFilteredImages() {
        return this.images.filter(image => {
            const typeMatch = this.filterType === 'all' || image.type === this.filterType;
            const dateMatch = this.filterDate === 'all' || image.date.startsWith(this.filterDate);
            return typeMatch && dateMatch;
        });
    },

    groupBeforeAfter(images) {
        const groups = [];
        const processed = new Set();
        
        images.forEach(image => {
            if (processed.has(image.id)) return;
            
            if (image.beforeAfterId) {
                const beforeImage = images.find(img => img.id === image.beforeAfterId);
                if (beforeImage) {
                    groups.push([beforeImage, image]);
                    processed.add(beforeImage.id);
                    processed.add(image.id);
                }
            }
        });
        
        return groups;
    },

    setFilter(type, value) {
        if (type === 'type') {
            this.filterType = value;
        } else if (type === 'date') {
            this.filterDate = value;
        }
        
        const gallery = document.getElementById('imageGallery');
        if (gallery) {
            gallery.innerHTML = this.renderImageGallery();
        }
        
        // Atualizar botões ativos
        document.querySelectorAll('.filter-button').forEach(btn => btn.classList.remove('active'));
        if (event && event.target) {
            event.target.classList.add('active');
        }
    },

    closeSidePanel() {
        document.getElementById('sidePanel').classList.remove('open');
        this.selectedImage = null;
        this.annotationMode = null;
    },

    setAnnotationMode(mode) {
        this.annotationMode = mode;
        document.querySelectorAll('.annotation-tool').forEach(btn => btn.classList.remove('active'));
        if (event && event.target) {
            event.target.classList.add('active');
        }
    },

    initializeAnnotationCanvas() {
        console.log('Canvas de anotação inicializado');
    },

    /**
     * Handlers de drag & drop
     */
    handleDragOver(e) {
        e.preventDefault();
    },

    handleDragEnter(e) {
        e.preventDefault();
        e.target.closest('.upload-zone').classList.add('drag-over');
    },

    handleDragLeave(e) {
        e.preventDefault();
        e.target.closest('.upload-zone').classList.remove('drag-over');
    },

    handleDrop(e) {
        e.preventDefault();
        e.target.closest('.upload-zone').classList.remove('drag-over');
        const files = Array.from(e.dataTransfer.files);
        this.processFiles(files);
    },

    processFiles(files) {
        console.log('Processando arquivos:', files);
        UI.showAlert(`📁 Arquivos Recebidos\n\n${files.length} arquivo(s) serão processados:\n\n${files.map(f => `• ${f.name}`).join('\n')}\n\n🚧 Sistema de upload será implementado em breve!`);
    },

    /**
     * Ações placeholders
     */
    openUploadModal() {
        if (typeof window.UploadImagens !== 'undefined') {
            window.UploadImagens.openUploadModal(this.currentPatientId);
        } else {
            UI.showAlert('📸 Upload & Captura\n\n🚧 Em desenvolvimento!\n\nFuncionalidades:\n• Captura direta da câmera\n• Upload múltiplo de arquivos\n• Suporte DICOM\n• Categorização automática\n• Compressão inteligente');
        }
    },

    exportGallery() {
        UI.showAlert('📤 Exportar Galeria\n\n🚧 Em desenvolvimento!\n\nOpções de exportação:\n• PDF com layout profissional\n• ZIP com imagens originais\n• Relatório com anotações\n• Compartilhamento seguro');
    },

    toggleView(viewType) {
        console.log('Alternando visualização:', viewType);
        UI.showAlert(`🔄 Visualização ${viewType === 'grid' ? 'Grade' : 'Lista'}\n\nFuncionalidade será implementada em breve!`);
    },

    editDescription(imageId) {
        UI.showAlert('✏️ Editar Descrição\n\n🚧 Em desenvolvimento!\n\nInterface de edição inline será implementada.');
    },

    linkToTreatment(imageId) {
        UI.showAlert('🔗 Link para Tratamento\n\n🚧 Em desenvolvimento!\n\nRedirecionamento automático para o prontuário associado.');
    },

    downloadImage(imageId) {
        UI.showAlert('💾 Download da Imagem\n\n🚧 Em desenvolvimento!\n\nDownload direto com metadados preservados.');
    },

    shareImage(imageId) {
        UI.showAlert('📤 Compartilhar Imagem\n\n🚧 Em desenvolvimento!\n\nCompartilhamento seguro com pacientes e colegas.');
    }
};

// Inicializar quando carregado
document.addEventListener('DOMContentLoaded', function() {
    if (typeof Imagens !== 'undefined') {
        Imagens.init();
    }
});

// Exportar para uso global
window.Imagens = Imagens;

console.log('📸 Módulo imagens.js Premium carregado!');