// ============================================================================
// DENTALCORE PRO - ATIVAÇÃO DO SISTEMA DE IMAGENS
// Integração completa: Upload + Anotações + Galeria
// ============================================================================

const ImageSystemActivator = {
    
    /**
     * Inicializar sistema completo de imagens
     */
    init() {
        console.log('🎨 Ativando sistema completo de imagens...');
        
        // Aguardar carregamento de todos os módulos
        if (this.checkDependencies()) {
            this.activateImageSystem();
        } else {
            console.warn('⚠️ Dependências não carregadas, tentando novamente...');
            setTimeout(() => this.init(), 1000);
        }
    },

    /**
     * Verificar se todas as dependências estão carregadas
     */
    checkDependencies() {
        return window.Imagens && 
               window.UploadImagens && 
               window.ImageAnnotations && 
               window.Patients;
    },

    /**
     * Ativar sistema de imagens
     */
    activateImageSystem() {
        console.log('✅ Todas as dependências carregadas, ativando sistema...');
        
        // 1. Integrar upload com galeria
        this.integrateUploadSystem();
        
        // 2. Integrar anotações
        this.integrateAnnotationSystem();
        
        // 3. Adicionar aba de imagens aos pacientes
        this.addImageTabToPatients();
        
        // 4. Configurar persistência de dados
        this.setupDataPersistence();
        
        console.log('🎯 Sistema de imagens ativado com sucesso!');
    },

    /**
     * Integrar sistema de upload
     */
    integrateUploadSystem() {
        // Sobrescrever função de upload no módulo de imagens
        window.Imagens.openUploadModal = function() {
            if (window.UploadImagens) {
                console.log('📤 Abrindo modal de upload para paciente:', this.currentPatientId);
                window.UploadImagens.openUploadModal(this.currentPatientId);
            } else {
                console.error('❌ Módulo UploadImagens não encontrado');
            }
        };

        // Integrar callback de upload concluído
        const originalShowUploadComplete = window.UploadImagens.showUploadComplete;
        window.UploadImagens.showUploadComplete = function() {
            // Chamar função original
            originalShowUploadComplete.call(this);
            
            // Atualizar galeria de imagens
            setTimeout(() => {
                if (window.Imagens && document.getElementById('imageGallery')) {
                    const gallery = document.getElementById('imageGallery');
                    gallery.innerHTML = window.Imagens.renderImageGallery();
                    console.log('🔄 Galeria de imagens atualizada após upload');
                }
            }, 1000);
        };

        console.log('📤 Sistema de upload integrado');
    },

    /**
     * Integrar sistema de anotações
     */
    integrateAnnotationSystem() {
        // Sobrescrever função de anotações no módulo de imagens
        window.Imagens.setAnnotationMode = function(mode) {
            console.log('🎨 Definindo modo de anotação:', mode);
            
            // Aguardar um momento para garantir que os elementos existam
            setTimeout(() => {
                const canvas = document.getElementById('annotationCanvas');
                const image = document.getElementById('viewerImage');
                
                if (canvas && image && this.selectedImage) {
                    console.log('✅ Configurando canvas de anotação...');
                    window.ImageAnnotations.setupCanvas(this.selectedImage.id, canvas, image);
                    window.ImageAnnotations.setMode(mode);
                } else {
                    console.warn('⚠️ Elementos não encontrados:', { canvas: !!canvas, image: !!image, selectedImage: !!this.selectedImage });
                }
                
                // Atualizar visual dos botões
                this.updateAnnotationButtons(mode);
            }, 200);
        };

        // Função para atualizar botões de anotação
        window.Imagens.updateAnnotationButtons = function(activeMode) {
            document.querySelectorAll('.annotation-tool').forEach(btn => {
                btn.classList.remove('active');
                if (btn.textContent.toLowerCase().includes(activeMode)) {
                    btn.classList.add('active');
                }
            });
        };

        // Sobrescrever abertura do visualizador para configurar canvas
        const originalOpenImageViewer = window.Imagens.openImageViewer;
        window.Imagens.openImageViewer = function(imageId) {
            // Chamar função original
            const result = originalOpenImageViewer.call(this, imageId);
            
            // Configurar canvas após um delay
            setTimeout(() => {
                const canvas = document.getElementById('annotationCanvas');
                const image = document.getElementById('viewerImage');
                
                if (canvas && image && this.selectedImage) {
                    console.log('🎨 Configurando canvas automaticamente para imagem:', imageId);
                    window.ImageAnnotations.setupCanvas(this.selectedImage.id, canvas, image);
                }
            }, 500);
            
            return result;
        };

        console.log('🎨 Sistema de anotações integrado');
    },

    /**
     * Adicionar aba de imagens aos pacientes
     */
    addImageTabToPatients() {
        // Sobrescrever função de renderizar abas
        const originalRenderPatientTabs = window.Patients.renderPatientTabs;
        window.Patients.renderPatientTabs = function(patient) {
            // Obter HTML original
            let tabsHTML = originalRenderPatientTabs.call(this, patient);
            
            // Adicionar aba de imagens após tratamentos
            tabsHTML = tabsHTML.replace(
                /(<button onclick="Patients\.switchTab\('treatments'\)" class="tab-btn" data-tab="treatments">[\s\S]*?<\/button>)/,
                '$1\n                    \n                    <button onclick="Patients.switchTab(\'images\')" class="tab-btn" data-tab="images">\n                        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">\n                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>\n                        </svg>\n                        Imagens\n                    </button>'
            );
            
            // Adicionar painel de imagens após tratamentos
            tabsHTML = tabsHTML.replace(
                /(<div id="tab-treatments" class="tab-panel">[\s\S]*?<\/div>)/,
                '$1\n                    \n                    <div id="tab-images" class="tab-panel">\n                        ${typeof window.Imagens !== \'undefined\' ? \n                            Imagens.renderTabImagens(patient) : \n                            this.renderPlaceholder(\'Imagens\', \'📸\', \'Galeria de fotos, radiografias e documentos visuais\')}\n                    </div>'
            );
            
            // Processar template literals
            tabsHTML = tabsHTML.replace(
                /\$\{typeof window\.Imagens !== 'undefined' \? \s*Imagens\.renderTabImagens\(patient\) : \s*this\.renderPlaceholder\('Imagens', '📸', 'Galeria de fotos, radiografias e documentos visuais'\)\}/,
                typeof window.Imagens !== 'undefined' ? 
                    window.Imagens.renderTabImagens(patient) : 
                    this.renderPlaceholder('Imagens', '📸', 'Galeria de fotos, radiografias e documentos visuais')
            );
            
            return tabsHTML;
        };

        console.log('👥 Aba de imagens adicionada aos pacientes');
    },

    /**
     * Configurar persistência de dados
     */
    setupDataPersistence() {
        // Adicionar funções de persistência se não existirem
        if (typeof window.DataPersistence !== 'undefined') {
            // Função para salvar anotações
            if (!window.DataPersistence.saveAnnotations) {
                window.DataPersistence.saveAnnotations = function(imageId, annotations) {
                    try {
                        const key = `annotations_${imageId}`;
                        localStorage.setItem(key, JSON.stringify(annotations));
                        console.log('💾 Anotações salvas para imagem:', imageId);
                    } catch (error) {
                        console.error('❌ Erro ao salvar anotações:', error);
                    }
                };
            }

            // Função para carregar anotações
            if (!window.DataPersistence.getAnnotations) {
                window.DataPersistence.getAnnotations = function(imageId) {
                    try {
                        const key = `annotations_${imageId}`;
                        const data = localStorage.getItem(key);
                        return data ? JSON.parse(data) : [];
                    } catch (error) {
                        console.error('❌ Erro ao carregar anotações:', error);
                        return [];
                    }
                };
            }

            // Função para salvar imagens
            if (!window.DataPersistence.saveImage) {
                window.DataPersistence.saveImage = function(imageData) {
                    try {
                        const images = this.getImages() || [];
                        images.push(imageData);
                        localStorage.setItem('patient_images', JSON.stringify(images));
                        console.log('💾 Imagem salva:', imageData.id);
                    } catch (error) {
                        console.error('❌ Erro ao salvar imagem:', error);
                    }
                };
            }

            // Função para carregar imagens
            if (!window.DataPersistence.getImages) {
                window.DataPersistence.getImages = function() {
                    try {
                        const data = localStorage.getItem('patient_images');
                        return data ? JSON.parse(data) : [];
                    } catch (error) {
                        console.error('❌ Erro ao carregar imagens:', error);
                        return [];
                    }
                };
            }
        }

        console.log('💾 Persistência de dados configurada');
    },

    /**
     * Adicionar recursos de captura da câmera
     */
    addCameraCapture() {
        // Função para capturar da câmera
        window.Imagens.captureFromCamera = async function() {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ 
                    video: { facingMode: 'environment' } // Câmera traseira preferencial
                });
                
                this.showCameraModal(stream);
            } catch (error) {
                console.error('❌ Erro ao acessar câmera:', error);
                UI.showAlert('❌ Erro de Câmera\n\nNão foi possível acessar a câmera.\nVerifique as permissões do navegador.');
            }
        };

        // Modal de captura
        window.Imagens.showCameraModal = function(stream) {
            const modal = document.createElement('div');
            modal.className = 'fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50';
            modal.innerHTML = `
                <div class="max-w-4xl w-full p-6">
                    <div class="text-center mb-4">
                        <h3 class="text-white text-xl font-semibold">📸 Captura de Imagem</h3>
                        <p class="text-gray-300">Posicione a câmera e clique para capturar</p>
                    </div>
                    <div class="relative bg-black rounded-lg overflow-hidden">
                        <video id="cameraVideo" autoplay playsinline class="w-full h-auto"></video>
                        <canvas id="captureCanvas" class="hidden"></canvas>
                    </div>
                    <div class="flex justify-center space-x-4 mt-6">
                        <button onclick="Imagens.cancelCapture()" class="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg">
                            ❌ Cancelar
                        </button>
                        <button onclick="Imagens.capturePhoto()" class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
                            📸 Capturar
                        </button>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
            
            const video = document.getElementById('cameraVideo');
            video.srcObject = stream;
            
            this.currentCameraStream = stream;
            this.cameraModal = modal;
        };

        // Capturar foto
        window.Imagens.capturePhoto = function() {
            const video = document.getElementById('cameraVideo');
            const canvas = document.getElementById('captureCanvas');
            const ctx = canvas.getContext('2d');
            
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            ctx.drawImage(video, 0, 0);
            
            canvas.toBlob((blob) => {
                const file = new File([blob], `captura_${Date.now()}.jpg`, { type: 'image/jpeg' });
                this.cancelCapture();
                
                // Processar arquivo capturado
                if (window.UploadImagens) {
                    file.isSimulated = true;
                    file.simulatedUrl = URL.createObjectURL(blob);
                    window.UploadImagens.processFiles([file]);
                }
            }, 'image/jpeg', 0.9);
        };

        // Cancelar captura
        window.Imagens.cancelCapture = function() {
            if (this.currentCameraStream) {
                this.currentCameraStream.getTracks().forEach(track => track.stop());
            }
            if (this.cameraModal) {
                this.cameraModal.remove();
            }
        };

        console.log('📸 Recursos de câmera adicionados');
    }
};

// Auto-inicializar quando DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    // Aguardar um pouco para garantir que todos os módulos foram carregados
    setTimeout(() => {
        ImageSystemActivator.init();
        ImageSystemActivator.addCameraCapture();
    }, 1000);
});

// Exportar para uso global
window.ImageSystemActivator = ImageSystemActivator;

console.log('🎯 Ativador do Sistema de Imagens carregado!');