// ============================================================================
// DENTALCORE PRO - SISTEMA DE ANOTAÇÕES EM IMAGENS - VERSÃO ULTRA CORRIGIDA
// Canvas funcional para desenhar, destacar e adicionar texto
// ============================================================================

const ImageAnnotations = {
    canvas: null,
    ctx: null,
    isDrawing: false,
    currentPath: null,
    annotations: [],
    selectedImage: null,
    annotationMode: null,
    lastX: 0,
    lastY: 0,

    /**
     * Inicializar sistema de anotações
     */
    init() {
        console.log('🎨 Sistema de Anotações carregado');
    },

    /**
     * Configurar canvas para uma imagem - VERSÃO ULTRA SEGURA
     */
    setupCanvas(imageId, canvasElement, imageElement) {
        try {
            console.log('🎨 Configurando canvas...', { imageId, canvasElement, imageElement });
            
            // Verificações ultra seguras
            if (!imageId) {
                console.error('❌ ID da imagem não fornecido');
                return false;
            }
            
            if (!canvasElement) {
                console.error('❌ Elemento canvas não fornecido');
                return false;
            }
            
            if (!imageElement) {
                console.error('❌ Elemento de imagem não fornecido');
                return false;
            }

            this.selectedImage = { id: imageId };
            this.canvas = canvasElement;
            
            // Verificar se conseguimos obter o contexto
            try {
                this.ctx = canvasElement.getContext('2d');
                if (!this.ctx) {
                    console.error('❌ Não foi possível obter contexto 2D do canvas');
                    return false;
                }
            } catch (error) {
                console.error('❌ Erro ao obter contexto do canvas:', error);
                return false;
            }
            
            // Aguardar carregamento da imagem com segurança
            if (imageElement.complete && imageElement.naturalWidth > 0) {
                this.configureCanvas(imageElement);
            } else {
                imageElement.onload = () => this.configureCanvas(imageElement);
                // Timeout de segurança
                setTimeout(() => {
                    if (imageElement.complete && imageElement.naturalWidth > 0) {
                        this.configureCanvas(imageElement);
                    }
                }, 1000);
            }
            
            return true;
        } catch (error) {
            console.error('❌ Erro geral ao configurar canvas:', error);
            return false;
        }
    },

    /**
     * Configurar dimensões e eventos do canvas - VERSÃO ULTRA SEGURA
     */
    configureCanvas(imageElement) {
        try {
            if (!this.canvas || !this.ctx || !imageElement) {
                console.error('❌ Elementos necessários não disponíveis para configuração');
                return;
            }

            const rect = imageElement.getBoundingClientRect();
            
            // Verificar se as dimensões são válidas
            if (imageElement.naturalWidth <= 0 || imageElement.naturalHeight <= 0) {
                console.error('❌ Dimensões da imagem inválidas');
                return;
            }
            
            this.canvas.width = imageElement.naturalWidth;
            this.canvas.height = imageElement.naturalHeight;
            this.canvas.style.width = rect.width + 'px';
            this.canvas.style.height = rect.height + 'px';
            this.canvas.style.display = 'block';
            
            // Configurações do contexto
            this.ctx.lineCap = 'round';
            this.ctx.lineJoin = 'round';
            
            // Carregar anotações existentes
            this.annotations = DataPersistence?.getAnnotations?.(this.selectedImage.id) || [];
            this.redrawAnnotations();
            
            // Configurar eventos
            this.setupEvents();
            
            console.log('✅ Canvas configurado com sucesso', { 
                width: this.canvas.width, 
                height: this.canvas.height,
                annotations: this.annotations.length 
            });
        } catch (error) {
            console.error('❌ Erro ao configurar canvas:', error);
        }
    },

    /**
     * Configurar eventos do canvas - VERSÃO ULTRA SEGURA
     */
    setupEvents() {
        try {
            if (!this.canvas) {
                console.error('❌ Canvas não disponível para configurar eventos');
                return;
            }

            // Remover eventos anteriores se existirem
            this.removeEvents();
            
            // Mouse events
            this.canvas.addEventListener('mousedown', this.startDrawing.bind(this));
            this.canvas.addEventListener('mousemove', this.draw.bind(this));
            this.canvas.addEventListener('mouseup', this.stopDrawing.bind(this));
            this.canvas.addEventListener('mouseout', this.stopDrawing.bind(this));
            
            // Touch events
            this.canvas.addEventListener('touchstart', this.handleTouch.bind(this));
            this.canvas.addEventListener('touchmove', this.handleTouch.bind(this));
            this.canvas.addEventListener('touchend', this.stopDrawing.bind(this));
            
            console.log('✅ Eventos de canvas configurados');
        } catch (error) {
            console.error('❌ Erro ao configurar eventos:', error);
        }
    },

    /**
     * Remover eventos do canvas
     */
    removeEvents() {
        try {
            if (!this.canvas) return;
            
            this.canvas.removeEventListener('mousedown', this.startDrawing);
            this.canvas.removeEventListener('mousemove', this.draw);
            this.canvas.removeEventListener('mouseup', this.stopDrawing);
            this.canvas.removeEventListener('mouseout', this.stopDrawing);
            this.canvas.removeEventListener('touchstart', this.handleTouch);
            this.canvas.removeEventListener('touchmove', this.handleTouch);
            this.canvas.removeEventListener('touchend', this.stopDrawing);
        } catch (error) {
            console.error('Erro ao remover eventos:', error);
        }
    },

    /**
     * Definir modo de anotação - VERSÃO ULTRA SEGURA
     */
    setMode(mode) {
        try {
            this.annotationMode = mode;
            
            if (this.canvas && this.canvas.style) {
                this.canvas.style.cursor = mode ? 'crosshair' : 'default';
            }
            
            console.log('🎨 Modo de anotação definido:', mode);
        } catch (error) {
            console.error('❌ Erro ao definir modo:', error);
        }
    },

    /**
     * Iniciar desenho - VERSÃO ULTRA SEGURA
     */
    startDrawing(e) {
        try {
            if (!this.annotationMode || !this.ctx) return;
            
            this.isDrawing = true;
            const coords = this.getCoordinates(e);
            this.lastX = coords.x;
            this.lastY = coords.y;
            
            if (this.annotationMode === 'text') {
                this.addTextAnnotation(coords.x, coords.y);
            } else {
                this.currentPath = {
                    id: Date.now(),
                    type: this.annotationMode,
                    points: [{ x: coords.x, y: coords.y }],
                    color: this.getAnnotationColor(),
                    width: this.getAnnotationWidth(),
                    timestamp: new Date().toISOString()
                };
            }
        } catch (error) {
            console.error('❌ Erro ao iniciar desenho:', error);
        }
    },

    /**
     * Desenhar - VERSÃO ULTRA SEGURA
     */
    draw(e) {
        try {
            if (!this.isDrawing || !this.annotationMode || this.annotationMode === 'text' || !this.ctx) return;
            
            const coords = this.getCoordinates(e);
            
            // Configurar estilo
            this.ctx.globalCompositeOperation = this.annotationMode === 'highlight' ? 'multiply' : 'source-over';
            this.ctx.strokeStyle = this.getAnnotationColor();
            this.ctx.lineWidth = this.getAnnotationWidth();
            this.ctx.globalAlpha = this.annotationMode === 'highlight' ? 0.5 : 1;
            
            // Desenhar linha
            this.ctx.beginPath();
            this.ctx.moveTo(this.lastX, this.lastY);
            this.ctx.lineTo(coords.x, coords.y);
            this.ctx.stroke();
            
            // Adicionar ponto
            if (this.currentPath && this.currentPath.points) {
                this.currentPath.points.push({ x: coords.x, y: coords.y });
            }
            
            this.lastX = coords.x;
            this.lastY = coords.y;
        } catch (error) {
            console.error('❌ Erro ao desenhar:', error);
        }
    },

    /**
     * Parar desenho - VERSÃO ULTRA SEGURA
     */
    stopDrawing() {
        try {
            if (!this.isDrawing) return;
            
            this.isDrawing = false;
            
            if (this.currentPath && this.currentPath.points && this.currentPath.points.length > 1) {
                this.annotations.push(this.currentPath);
                this.saveAnnotations();
            }
            
            this.currentPath = null;
        } catch (error) {
            console.error('❌ Erro ao parar desenho:', error);
        }
    },

    /**
     * Obter coordenadas do evento - VERSÃO ULTRA SEGURA
     */
    getCoordinates(e) {
        try {
            if (!this.canvas) return { x: 0, y: 0 };
            
            const rect = this.canvas.getBoundingClientRect();
            const scaleX = this.canvas.width / rect.width;
            const scaleY = this.canvas.height / rect.height;
            
            let clientX, clientY;
            
            if (e.type && e.type.includes('touch')) {
                const touch = e.touches[0] || e.changedTouches[0];
                clientX = touch.clientX;
                clientY = touch.clientY;
            } else {
                clientX = e.clientX;
                clientY = e.clientY;
            }
            
            return {
                x: (clientX - rect.left) * scaleX,
                y: (clientY - rect.top) * scaleY
            };
        } catch (error) {
            console.error('❌ Erro ao obter coordenadas:', error);
            return { x: 0, y: 0 };
        }
    },

    /**
     * Handle touch events - VERSÃO ULTRA SEGURA
     */
    handleTouch(e) {
        try {
            e.preventDefault();
            
            if (e.type === 'touchstart') {
                this.startDrawing(e);
            } else if (e.type === 'touchmove') {
                this.draw(e);
            } else if (e.type === 'touchend') {
                this.stopDrawing();
            }
        } catch (error) {
            console.error('❌ Erro no touch event:', error);
        }
    },

    /**
     * Adicionar anotação de texto - VERSÃO ULTRA SEGURA
     */
    addTextAnnotation(x, y) {
        try {
            // Criar modal para entrada de texto
            this.showTextModal((text) => {
                if (!text) return;
                
                const annotation = {
                    id: Date.now(),
                    type: 'text',
                    x: x,
                    y: y,
                    text: text,
                    color: this.getAnnotationColor(),
                    fontSize: 24,
                    timestamp: new Date().toISOString()
                };
                
                this.annotations.push(annotation);
                this.drawTextAnnotation(annotation);
                this.saveAnnotations();
            });
        } catch (error) {
            console.error('❌ Erro ao adicionar texto:', error);
        }
    },

    /**
     * Modal para entrada de texto - VERSÃO ULTRA SEGURA
     */
    showTextModal(callback) {
        try {
            const modal = document.createElement('div');
            modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
            modal.innerHTML = `
                <div class="bg-gray-800 p-6 rounded-xl shadow-2xl max-w-md w-full mx-4 border border-gray-600">
                    <h3 class="text-lg font-semibold text-white mb-4">📝 Adicionar Texto</h3>
                    <textarea id="annotationText" 
                              class="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white resize-none" 
                              rows="3" 
                              placeholder="Digite sua anotação..."></textarea>
                    <div class="flex justify-end space-x-3 mt-4">
                        <button onclick="this.closest('.fixed').remove()" 
                                class="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors">
                            Cancelar
                        </button>
                        <button onclick="ImageAnnotations.submitText(); this.closest('.fixed').remove()" 
                                class="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors">
                            Adicionar
                        </button>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
            const textArea = document.getElementById('annotationText');
            if (textArea) {
                textArea.focus();
            }
            
            // Armazenar callback temporariamente
            this.textCallback = callback;
        } catch (error) {
            console.error('❌ Erro ao mostrar modal de texto:', error);
        }
    },

    submitText() {
        try {
            const textElement = document.getElementById('annotationText');
            const text = textElement ? textElement.value.trim() : '';
            
            if (this.textCallback) {
                this.textCallback(text);
                this.textCallback = null;
            }
        } catch (error) {
            console.error('❌ Erro ao submeter texto:', error);
        }
    },

    /**
     * Desenhar anotação de texto - VERSÃO ULTRA SEGURA
     */
    drawTextAnnotation(annotation) {
        try {
            if (!this.ctx || !annotation) return;
            
            this.ctx.font = `${annotation.fontSize}px Arial`;
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
            
            // Medir texto para fundo
            const metrics = this.ctx.measureText(annotation.text);
            const padding = 8;
            
            // Desenhar fundo
            this.ctx.fillRect(
                annotation.x - padding, 
                annotation.y - annotation.fontSize - padding, 
                metrics.width + padding * 2, 
                annotation.fontSize + padding * 2
            );
            
            // Desenhar texto
            this.ctx.fillStyle = annotation.color;
            this.ctx.fillText(annotation.text, annotation.x, annotation.y);
        } catch (error) {
            console.error('❌ Erro ao desenhar texto:', error);
        }
    },

    /**
     * Redesenhar todas as anotações - VERSÃO ULTRA SEGURA
     */
    redrawAnnotations() {
        try {
            if (!this.ctx || !this.canvas) return;
            
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            
            if (!Array.isArray(this.annotations)) {
                this.annotations = [];
                return;
            }
            
            this.annotations.forEach(annotation => {
                try {
                    if (annotation.type === 'text') {
                        this.drawTextAnnotation(annotation);
                    } else {
                        this.drawPathAnnotation(annotation);
                    }
                } catch (error) {
                    console.error('❌ Erro ao redesenhar anotação:', error);
                }
            });
        } catch (error) {
            console.error('❌ Erro ao redesenhar anotações:', error);
        }
    },

    /**
     * Desenhar anotação de caminho - VERSÃO ULTRA SEGURA
     */
    drawPathAnnotation(annotation) {
        try {
            if (!annotation.points || !Array.isArray(annotation.points) || annotation.points.length < 2) return;
            if (!this.ctx) return;
            
            this.ctx.globalCompositeOperation = annotation.type === 'highlight' ? 'multiply' : 'source-over';
            this.ctx.strokeStyle = annotation.color;
            this.ctx.lineWidth = annotation.width;
            this.ctx.globalAlpha = annotation.type === 'highlight' ? 0.5 : 1;
            
            this.ctx.beginPath();
            this.ctx.moveTo(annotation.points[0].x, annotation.points[0].y);
            
            for (let i = 1; i < annotation.points.length; i++) {
                this.ctx.lineTo(annotation.points[i].x, annotation.points[i].y);
            }
            
            this.ctx.stroke();
            this.ctx.globalAlpha = 1;
        } catch (error) {
            console.error('❌ Erro ao desenhar caminho:', error);
        }
    },

    /**
     * Obter cor da anotação
     */
    getAnnotationColor() {
        const colors = {
            'draw': '#ff4444',
            'highlight': '#ffff00',
            'text': '#ffffff'
        };
        return colors[this.annotationMode] || '#ff4444';
    },

    /**
     * Obter largura da anotação
     */
    getAnnotationWidth() {
        const widths = {
            'draw': 3,
            'highlight': 20
        };
        return widths[this.annotationMode] || 3;
    },

    /**
     * Salvar anotações - VERSÃO ULTRA SEGURA
     */
    saveAnnotations() {
        try {
            if (this.selectedImage && typeof DataPersistence !== 'undefined' && DataPersistence.saveAnnotations) {
                DataPersistence.saveAnnotations(this.selectedImage.id, this.annotations);
                console.log('💾 Anotações salvas:', this.annotations.length);
            }
        } catch (error) {
            console.error('❌ Erro ao salvar anotações:', error);
        }
    },

    /**
     * Limpar todas as anotações
     */
    clearAll() {
        this.showConfirmModal(
            '🗑️ Limpar Anotações',
            'Tem certeza que deseja remover todas as anotações desta imagem?',
            () => {
                this.annotations = [];
                this.redrawAnnotations();
                this.saveAnnotations();
            }
        );
    },

    /**
     * Desfazer última anotação
     */
    undo() {
        if (this.annotations.length > 0) {
            this.annotations.pop();
            this.redrawAnnotations();
            this.saveAnnotations();
        }
    },

    /**
     * Exportar anotações como imagem
     */
    exportAnnotations() {
        try {
            if (!this.canvas) return;
            
            const link = document.createElement('a');
            link.download = `anotacoes_${this.selectedImage.id}_${Date.now()}.png`;
            link.href = this.canvas.toDataURL();
            link.click();
        } catch (error) {
            console.error('❌ Erro ao exportar:', error);
        }
    },

    /**
     * Modal de confirmação
     */
    showConfirmModal(title, message, onConfirm) {
        try {
            const modal = document.createElement('div');
            modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
            modal.innerHTML = `
                <div class="bg-gray-800 p-6 rounded-xl shadow-2xl max-w-md w-full mx-4 border border-gray-600">
                    <h3 class="text-lg font-semibold text-white mb-4">${title}</h3>
                    <p class="text-gray-300 mb-6">${message}</p>
                    <div class="flex justify-end space-x-3">
                        <button onclick="this.closest('.fixed').remove()" 
                                class="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors">
                            Cancelar
                        </button>
                        <button onclick="this.closest('.fixed').remove(); (${onConfirm.toString()})()" 
                                class="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors">
                            Confirmar
                        </button>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
        } catch (error) {
            console.error('❌ Erro ao mostrar modal de confirmação:', error);
        }
    }
};

// INTEGRAÇÃO ULTRA SEGURA COM MÓDULO DE IMAGENS
if (typeof window.Imagens !== 'undefined') {
    // Sobrescrever função de anotações com verificações ultra seguras
    window.Imagens.setAnnotationMode = function(mode) {
        console.log('🎨 Definindo modo de anotação:', mode);
        
        // Aguardar um momento para garantir que os elementos existam
        setTimeout(() => {
            const canvas = document.getElementById('annotationCanvas');
            const image = document.getElementById('viewerImage');
            
            if (!canvas || !image) {
                console.warn('⚠️ Canvas ou imagem não encontrados. Tentando novamente...');
                // Tentar encontrar usando seletores alternativos
                const altCanvas = document.querySelector('canvas');
                const altImage = document.querySelector('#viewerImage, .viewer-image, img[id*="viewer"]');
                
                if (altCanvas && altImage) {
                    console.log('✅ Elementos encontrados com seletores alternativos');
                    ImageAnnotations.setupCanvas(this.selectedImage?.id || 'temp', altCanvas, altImage);
                    ImageAnnotations.setMode(mode);
                } else {
                    console.error('❌ Elementos de anotação não encontrados');
                    return;
                }
            } else {
                console.log('✅ Elementos de anotação encontrados');
                ImageAnnotations.setMode(mode);
            }
            
            // Atualizar visual dos botões de forma segura
            try {
                document.querySelectorAll('.annotation-tool').forEach(btn => {
                    btn.classList.remove('active');
                });
                
                // Encontrar botão ativo por texto ou evento
                const buttons = document.querySelectorAll('.annotation-tool');
                buttons.forEach(btn => {
                    if (btn.textContent.toLowerCase().includes(mode.toLowerCase())) {
                        btn.classList.add('active');
                    }
                });
            } catch (error) {
                console.warn('Erro ao atualizar botões:', error);
            }
        }, 200);
    };
    
    // Sobrescrever função openImageViewer para configurar canvas automaticamente
    const originalOpenImageViewer = window.Imagens.openImageViewer;
    window.Imagens.openImageViewer = function(imageId) {
        // Chamar função original
        const result = originalOpenImageViewer.call(this, imageId);
        
        // Configurar canvas após um delay
        setTimeout(() => {
            const canvas = document.getElementById('annotationCanvas');
            const image = document.getElementById('viewerImage');
            
            if (canvas && image && this.selectedImage) {
                console.log('🎨 Configurando canvas automaticamente...');
                ImageAnnotations.setupCanvas(this.selectedImage.id, canvas, image);
            }
        }, 1000);
        
        return result;
    };
}

// Exportar para uso global
window.ImageAnnotations = ImageAnnotations;

console.log('🎨 Sistema de Anotações em Imagens ULTRA CORRIGIDO carregado!');