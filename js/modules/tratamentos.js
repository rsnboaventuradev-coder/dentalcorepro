// ============================================================================
// DENTALCORE PRO - MÓDULO DE TRATAMENTOS COM ORÇAMENTO PROFISSIONAL V2
// Sistema completo de gestão e orçamentos de tratamentos
// Integrado com DentalCore Pro v2.0.0
// ============================================================================

const Tratamentos = {
    currentPatientId: null,
    searchQuery: '',
    filterStatus: 'all',
    filterType: 'all',
    filterDateRange: 'all',
    sortBy: 'date',
    sortDirection: 'desc',
    treatments: [],

    /**
     * Inicializar módulo de tratamentos
     */
    init() {
        console.log('🦷 Módulo de Tratamentos com Orçamento carregado');
        this.addCustomStyles();
        this.setupEventListeners();
    },

    /**
     * Configurar event listeners
     */
    setupEventListeners() {
        // Auto-save listener
        window.addEventListener('autosave', () => {
            if (this.currentPatientId) {
                this.saveTreatments();
            }
        });
    },

    /**
     * Função principal para renderizar aba (compatibilidade)
     */
    renderTabTratamentos(patient) {
        console.log('🦷 Renderizando aba de tratamentos para:', patient.name);
        this.currentPatientId = patient.id;
        this.loadTreatments();
        
        return `
            <div class="treatments-workspace p-8">
                <div class="max-w-8xl mx-auto">
                    
                    <!-- Cabeçalho com Busca Avançada -->
                    <div class="treatments-header-panel mb-8">
                        <div class="flex items-center justify-between mb-6">
                            <div>
                                <h1 class="text-4xl font-light text-white mb-3 tracking-tight">
                                    Histórico de Tratamentos
                                </h1>
                                <p class="text-gray-300 text-lg">
                                    Gestão completa para ${patient.name} • ${this.getFilteredTreatments().length} tratamentos
                                </p>
                            </div>
                            <div class="flex items-center space-x-4">
                                <button onclick="Tratamentos.showBudgetModal()" class="treatment-action-btn">
                                    <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 012-2H7a2 2 0 002 2z"></path>
                                    </svg>
                                    Novo Orçamento
                                </button>
                                <button onclick="Tratamentos.exportTreatments()" class="treatment-action-btn">
                                    <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                    </svg>
                                    Exportar
                                </button>
                            </div>
                        </div>

                        <!-- Busca e Filtros Avançados -->
                        <div class="search-filters-panel">
                            <!-- Barra de Busca Principal -->
                            <div class="relative mb-6">
                                <input type="text" 
                                       id="treatmentSearch" 
                                       class="search-input-premium pl-14 pr-12" 
                                       placeholder="Buscar tratamentos por procedimento, observações, dentista..."
                                       value="${this.searchQuery}"
                                       oninput="Tratamentos.handleSearch(this.value)">
                                <svg class="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                </svg>
                                ${this.searchQuery ? `
                                    <button onclick="Tratamentos.clearSearch()" class="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white">
                                        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                                        </svg>
                                    </button>
                                ` : ''}
                            </div>

                            <!-- Filtros em Grid -->
                            <div class="filters-grid">
                                <!-- Status -->
                                <div class="filter-group">
                                    <label class="filter-label">Status</label>
                                    <div class="filter-buttons">
                                        <button onclick="Tratamentos.setFilter('status', 'all')" 
                                                class="filter-btn ${this.filterStatus === 'all' ? 'active' : ''}">
                                            Todos
                                        </button>
                                        <button onclick="Tratamentos.setFilter('status', 'em-andamento')" 
                                                class="filter-btn ${this.filterStatus === 'em-andamento' ? 'active' : ''}">
                                            Em Andamento
                                        </button>
                                        <button onclick="Tratamentos.setFilter('status', 'concluido')" 
                                                class="filter-btn ${this.filterStatus === 'concluido' ? 'active' : ''}">
                                            Concluído
                                        </button>
                                        <button onclick="Tratamentos.setFilter('status', 'agendado')" 
                                                class="filter-btn ${this.filterStatus === 'agendado' ? 'active' : ''}">
                                            Agendado
                                        </button>
                                    </div>
                                </div>

                                <!-- Tipo de Tratamento -->
                                <div class="filter-group">
                                    <label class="filter-label">Tipo</label>
                                    <select onchange="Tratamentos.setFilter('type', this.value)" class="filter-select">
                                        <option value="all" ${this.filterType === 'all' ? 'selected' : ''}>Todos os tipos</option>
                                        <option value="limpeza" ${this.filterType === 'limpeza' ? 'selected' : ''}>🧽 Limpeza</option>
                                        <option value="restauracao" ${this.filterType === 'restauracao' ? 'selected' : ''}>🔧 Restauração</option>
                                        <option value="canal" ${this.filterType === 'canal' ? 'selected' : ''}>🩺 Canal</option>
                                        <option value="ortodontia" ${this.filterType === 'ortodontia' ? 'selected' : ''}>🦷 Ortodontia</option>
                                        <option value="implante" ${this.filterType === 'implante' ? 'selected' : ''}>⚙️ Implante</option>
                                        <option value="cirurgia" ${this.filterType === 'cirurgia' ? 'selected' : ''}>⚕️ Cirurgia</option>
                                        <option value="protese" ${this.filterType === 'protese' ? 'selected' : ''}>👄 Prótese</option>
                                        <option value="clareamento" ${this.filterType === 'clareamento' ? 'selected' : ''}>✨ Clareamento</option>
                                    </select>
                                </div>

                                <!-- Período -->
                                <div class="filter-group">
                                    <label class="filter-label">Período</label>
                                    <select onchange="Tratamentos.setFilter('dateRange', this.value)" class="filter-select">
                                        <option value="all" ${this.filterDateRange === 'all' ? 'selected' : ''}>Todo o período</option>
                                        <option value="today" ${this.filterDateRange === 'today' ? 'selected' : ''}>Hoje</option>
                                        <option value="week" ${this.filterDateRange === 'week' ? 'selected' : ''}>Esta semana</option>
                                        <option value="month" ${this.filterDateRange === 'month' ? 'selected' : ''}>Este mês</option>
                                        <option value="quarter" ${this.filterDateRange === 'quarter' ? 'selected' : ''}>Este trimestre</option>
                                        <option value="year" ${this.filterDateRange === 'year' ? 'selected' : ''}>Este ano</option>
                                    </select>
                                </div>

                                <!-- Ordenação -->
                                <div class="filter-group">
                                    <label class="filter-label">Ordenar por</label>
                                    <div class="sort-controls">
                                        <select onchange="Tratamentos.setSortBy(this.value)" class="filter-select">
                                            <option value="date" ${this.sortBy === 'date' ? 'selected' : ''}>Data</option>
                                            <option value="type" ${this.sortBy === 'type' ? 'selected' : ''}>Tipo</option>
                                            <option value="status" ${this.sortBy === 'status' ? 'selected' : ''}>Status</option>
                                            <option value="dentist" ${this.sortBy === 'dentist' ? 'selected' : ''}>Dentista</option>
                                        </select>
                                        <button onclick="Tratamentos.toggleSortDirection()" class="sort-direction-btn">
                                            ${this.sortDirection === 'desc' ? '↓' : '↑'}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <!-- Estatísticas Rápidas -->
                            <div class="stats-quick">
                                ${this.renderQuickStats()}
                            </div>
                        </div>
                    </div>

                    <!-- Timeline de Tratamentos -->
                    <div class="treatments-timeline-container">
                        ${this.renderTreatmentsTimeline()}
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * Renderizar estatísticas rápidas
     */
    renderQuickStats() {
        const filtered = this.getFilteredTreatments();
        const stats = this.calculateStats(filtered);
        
        return `
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div class="stat-card-mini">
                    <div class="stat-number">${filtered.length}</div>
                    <div class="stat-label">Encontrados</div>
                </div>
                <div class="stat-card-mini">
                    <div class="stat-number">${stats.emAndamento}</div>
                    <div class="stat-label">Em Andamento</div>
                </div>
                <div class="stat-card-mini">
                    <div class="stat-number">${stats.concluidos}</div>
                    <div class="stat-label">Concluídos</div>
                </div>
                <div class="stat-card-mini">
                    <div class="stat-number">R$ ${stats.valorTotal.toLocaleString('pt-BR')}</div>
                    <div class="stat-label">Valor Total</div>
                </div>
            </div>
        `;
    },

    /**
     * Renderizar timeline com resultados da busca
     */
    renderTreatmentsTimeline() {
        const treatments = this.getFilteredTreatments();
        
        if (treatments.length === 0) {
            return this.renderEmptyState();
        }

        return `
            <div class="treatments-timeline">
                <div class="timeline-header">
                    <h3 class="text-xl font-semibold text-white mb-2">
                        ${this.searchQuery ? `Resultados para "${this.searchQuery}"` : 'Timeline de Tratamentos'}
                    </h3>
                    <p class="text-gray-400 text-sm mb-6">
                        ${treatments.length} tratamento${treatments.length !== 1 ? 's' : ''} 
                        ${this.getActiveFiltersText()}
                    </p>
                </div>

                <div class="timeline-content">
                    ${treatments.map((treatment, index) => this.renderTreatmentCard(treatment, index)).join('')}
                </div>
            </div>
        `;
    },

    /**
     * Renderizar card de tratamento
     */
    renderTreatmentCard(treatment, index) {
        const isHighlighted = this.searchQuery && this.isMatchHighlighted(treatment);
        
        return `
            <div class="timeline-item ${isHighlighted ? 'highlighted' : ''}" data-treatment-id="${treatment.id}">
                <div class="timeline-connector">
                    <div class="timeline-dot status-${treatment.status}"></div>
                    ${index < this.getFilteredTreatments().length - 1 ? '<div class="timeline-line"></div>' : ''}
                </div>
                
                <div class="timeline-card" onclick="Tratamentos.openTreatmentDetails('${treatment.id}')">
                    <div class="card-header">
                        <div class="flex items-start justify-between">
                            <div class="flex-1">
                                <h4 class="treatment-title">
                                    ${this.highlightSearchTerm(treatment.procedure)}
                                </h4>
                                <p class="treatment-date">
                                    ${new Date(treatment.date).toLocaleDateString('pt-BR', { 
                                        weekday: 'long', 
                                        year: 'numeric', 
                                        month: 'long', 
                                        day: 'numeric' 
                                    })}
                                </p>
                            </div>
                            <div class="flex items-center space-x-3">
                                <span class="status-badge status-${treatment.status}">
                                    ${this.getStatusText(treatment.status)}
                                </span>
                                <div class="treatment-type-icon type-${treatment.type}">
                                    ${this.getTypeIcon(treatment.type)}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="card-content">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div class="info-item">
                                <span class="info-label">👨‍⚕️ Dentista:</span>
                                <span class="info-value">${this.highlightSearchTerm(treatment.dentist)}</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">💰 Valor:</span>
                                <span class="info-value">R$ ${treatment.value?.toLocaleString('pt-BR') || 'N/A'}</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">🦷 Dente(s):</span>
                                <span class="info-value">${treatment.teeth?.join(', ') || 'N/A'}</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">⏱️ Duração:</span>
                                <span class="info-value">${treatment.duration || 'N/A'}</span>
                            </div>
                        </div>

                        ${treatment.observations ? `
                            <div class="observations">
                                <span class="info-label">📝 Observações:</span>
                                <p class="observations-text">${this.highlightSearchTerm(treatment.observations)}</p>
                            </div>
                        ` : ''}

                        ${treatment.attachments?.length ? `
                            <div class="attachments">
                                <span class="info-label">📎 Anexos:</span>
                                <div class="attachments-list">
                                    ${treatment.attachments.map(att => `
                                        <span class="attachment-item">${this.highlightSearchTerm(att.name)}</span>
                                    `).join('')}
                                </div>
                            </div>
                        ` : ''}
                    </div>

                    <div class="card-actions">
                        <button onclick="event.stopPropagation(); Tratamentos.editTreatment('${treatment.id}')" 
                                class="action-btn-small">
                            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                            </svg>
                            Editar
                        </button>
                        <button onclick="event.stopPropagation(); Tratamentos.duplicateTreatment('${treatment.id}')" 
                                class="action-btn-small">
                            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                            </svg>
                            Duplicar
                        </button>
                        <button onclick="event.stopPropagation(); Tratamentos.linkToImages('${treatment.id}')" 
                                class="action-btn-small">
                            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                            </svg>
                            Imagens
                        </button>
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * FUNÇÕES DE BUSCA E FILTRO
     */

    /**
     * Handle da busca em tempo real
     */
    handleSearch(query) {
        this.searchQuery = query.toLowerCase();
        this.refreshTimeline();
        
        // Debounce para performance
        clearTimeout(this.searchTimeout);
        this.searchTimeout = setTimeout(() => {
            console.log('🔍 Busca realizada:', query, 'Resultados:', this.getFilteredTreatments().length);
        }, 300);
    },

    /**
     * Definir filtro
     */
    setFilter(type, value) {
        switch (type) {
            case 'status':
                this.filterStatus = value;
                break;
            case 'type':
                this.filterType = value;
                break;
            case 'dateRange':
                this.filterDateRange = value;
                break;
        }
        
        this.refreshTimeline();
        this.updateFilterButtons();
    },

    /**
     * Definir ordenação
     */
    setSortBy(field) {
        this.sortBy = field;
        this.refreshTimeline();
    },

    /**
     * Toggle direção da ordenação
     */
    toggleSortDirection() {
        this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        this.refreshTimeline();
    },

    /**
     * Obter tratamentos filtrados e ordenados
     */
    getFilteredTreatments() {
        let filtered = [...this.treatments];
        
        // Busca textual
        if (this.searchQuery) {
            filtered = filtered.filter(treatment => 
                treatment.procedure.toLowerCase().includes(this.searchQuery) ||
                treatment.dentist.toLowerCase().includes(this.searchQuery) ||
                (treatment.observations && treatment.observations.toLowerCase().includes(this.searchQuery)) ||
                (treatment.teeth && treatment.teeth.some(tooth => tooth.toString().includes(this.searchQuery))) ||
                treatment.type.toLowerCase().includes(this.searchQuery)
            );
        }
        
        // Filtro por status
        if (this.filterStatus !== 'all') {
            filtered = filtered.filter(t => t.status === this.filterStatus);
        }
        
        // Filtro por tipo
        if (this.filterType !== 'all') {
            filtered = filtered.filter(t => t.type === this.filterType);
        }
        
        // Filtro por data
        if (this.filterDateRange !== 'all') {
            filtered = this.filterByDateRange(filtered);
        }
        
        // Ordenação
        filtered.sort((a, b) => {
            let comparison = 0;
            
            switch (this.sortBy) {
                case 'date':
                    comparison = new Date(a.date) - new Date(b.date);
                    break;
                case 'type':
                    comparison = a.type.localeCompare(b.type);
                    break;
                case 'status':
                    comparison = a.status.localeCompare(b.status);
                    break;
                case 'dentist':
                    comparison = a.dentist.localeCompare(b.dentist);
                    break;
            }
            
            return this.sortDirection === 'asc' ? comparison : -comparison;
        });
        
        return filtered;
    },

    /**
     * Filtrar por período
     */
    filterByDateRange(treatments) {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        
        switch (this.filterDateRange) {
            case 'today':
                return treatments.filter(t => {
                    const treatmentDate = new Date(t.date);
                    return treatmentDate >= today;
                });
            case 'week':
                const weekAgo = new Date(today);
                weekAgo.setDate(weekAgo.getDate() - 7);
                return treatments.filter(t => new Date(t.date) >= weekAgo);
            case 'month':
                const monthAgo = new Date(today);
                monthAgo.setMonth(monthAgo.getMonth() - 1);
                return treatments.filter(t => new Date(t.date) >= monthAgo);
            case 'quarter':
                const quarterAgo = new Date(today);
                quarterAgo.setMonth(quarterAgo.getMonth() - 3);
                return treatments.filter(t => new Date(t.date) >= quarterAgo);
            case 'year':
                const yearAgo = new Date(today);
                yearAgo.setFullYear(yearAgo.getFullYear() - 1);
                return treatments.filter(t => new Date(t.date) >= yearAgo);
            default:
                return treatments;
        }
    },

    /**
     * Destacar termo de busca
     */
    highlightSearchTerm(text) {
        if (!this.searchQuery || !text) return text;
        
        const regex = new RegExp(`(${this.searchQuery})`, 'gi');
        return text.replace(regex, '<mark class="search-highlight">$1</mark>');
    },

    /**
     * Verificar se deve destacar card
     */
    isMatchHighlighted(treatment) {
        if (!this.searchQuery) return false;
        
        return treatment.procedure.toLowerCase().includes(this.searchQuery) ||
               treatment.dentist.toLowerCase().includes(this.searchQuery) ||
               (treatment.observations && treatment.observations.toLowerCase().includes(this.searchQuery));
    },

    /**
     * Obter texto dos filtros ativos
     */
    getActiveFiltersText() {
        const filters = [];
        
        if (this.filterStatus !== 'all') {
            filters.push(`Status: ${this.getStatusText(this.filterStatus)}`);
        }
        
        if (this.filterType !== 'all') {
            filters.push(`Tipo: ${this.filterType}`);
        }
        
        if (this.filterDateRange !== 'all') {
            filters.push(`Período: ${this.filterDateRange}`);
        }
        
        return filters.length ? `• Filtros: ${filters.join(', ')}` : '';
    },

    /**
     * FUNÇÕES DE DADOS
     */

    /**
     * Carregar tratamentos
     */
    loadTreatments() {
        try {
            if (typeof DataPersistence !== 'undefined' && DataPersistence.getTreatments) {
                this.treatments = DataPersistence.getTreatments(this.currentPatientId) || [];
            } else {
                // Fallback para localStorage
                const saved = localStorage.getItem(`dentalcore_treatments_${this.currentPatientId}`);
                this.treatments = saved ? JSON.parse(saved) : [];
            }
        } catch (error) {
            console.error('Erro ao carregar tratamentos:', error);
            this.treatments = [];
        }
        
        // Dados demo se não existir
        if (this.treatments.length === 0) {
            this.treatments = this.getDemoTreatments();
            this.saveTreatments();
        }
        
        console.log('📖 Tratamentos carregados:', this.treatments.length);
    },

    /**
     * Salvar tratamentos
     */
    saveTreatments() {
        try {
            if (this.currentPatientId) {
                if (typeof DataPersistence !== 'undefined' && DataPersistence.saveTreatments) {
                    DataPersistence.saveTreatments(this.currentPatientId, this.treatments);
                } else {
                    // Fallback para localStorage
                    localStorage.setItem(`dentalcore_treatments_${this.currentPatientId}`, JSON.stringify(this.treatments));
                }
                console.log('💾 Tratamentos salvos');
            }
        } catch (error) {
            console.error('Erro ao salvar tratamentos:', error);
        }
    },

    /**
     * Dados demo
     */
    getDemoTreatments() {
        return [
            {
                id: 1,
                procedure: 'Limpeza e Profilaxia',
                type: 'limpeza',
                status: 'concluido',
                date: '2024-11-01',
                dentist: 'Dr. João Silva',
                value: 150,
                teeth: ['11', '12', '21', '22'],
                duration: '45min',
                observations: 'Limpeza completa realizada. Orientações de escovação fornecidas.'
            },
            {
                id: 2,
                procedure: 'Restauração com Resina',
                type: 'restauracao',
                status: 'em-andamento',
                date: '2024-11-15',
                dentist: 'Dra. Maria Santos',
                value: 280,
                teeth: ['16'],
                duration: '60min',
                observations: 'Restauração iniciada. Retorno agendado para polimento.'
            },
            {
                id: 3,
                procedure: 'Consulta Ortodôntica',
                type: 'ortodontia',
                status: 'agendado',
                date: '2024-12-01',
                dentist: 'Dr. Pedro Costa',
                value: 200,
                teeth: [],
                duration: '30min',
                observations: 'Avaliação para possível tratamento ortodôntico.'
            }
        ];
    },

    /**
     * FUNÇÕES AUXILIARES
     */

    getStatusText(status) {
        const statusMap = {
            'em-andamento': 'Em Andamento',
            'concluido': 'Concluído',
            'agendado': 'Agendado',
            'cancelado': 'Cancelado'
        };
        return statusMap[status] || status;
    },

    getTypeIcon(type) {
        const iconMap = {
            'limpeza': '🧽',
            'restauracao': '🔧',
            'canal': '🩺',
            'ortodontia': '🦷',
            'implante': '⚙️',
            'cirurgia': '⚕️',
            'protese': '👄',
            'clareamento': '✨'
        };
        return iconMap[type] || '🦷';
    },

    calculateStats(treatments) {
        return {
            emAndamento: treatments.filter(t => t.status === 'em-andamento').length,
            concluidos: treatments.filter(t => t.status === 'concluido').length,
            valorTotal: treatments.reduce((sum, t) => sum + (t.value || 0), 0)
        };
    },

    clearSearch() {
        this.searchQuery = '';
        document.getElementById('treatmentSearch').value = '';
        this.refreshTimeline();
    },

    refreshTimeline() {
        const container = document.querySelector('.treatments-timeline-container');
        if (container) {
            container.innerHTML = this.renderTreatmentsTimeline();
        }
        
        // Atualizar stats
        const statsContainer = document.querySelector('.stats-quick');
        if (statsContainer) {
            statsContainer.innerHTML = this.renderQuickStats();
        }
    },

    updateFilterButtons() {
        // Atualizar visual dos botões de filtro
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
    },

    renderEmptyState() {
        return `
            <div class="empty-state-treatments">
                <svg class="h-20 w-20 text-gray-400 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                </svg>
                <h3 class="text-2xl font-semibold text-white mb-4">
                    ${this.searchQuery ? 'Nenhum resultado encontrado' : 'Nenhum tratamento encontrado'}
                </h3>
                <p class="text-gray-400 mb-8">
                    ${this.searchQuery 
                        ? `Não encontramos tratamentos com "${this.searchQuery}". Tente ajustar sua busca.`
                        : 'Nenhum tratamento corresponde aos filtros selecionados.'
                    }
                </p>
                <div class="flex justify-center space-x-4">
                    ${this.searchQuery ? `
                        <button onclick="Tratamentos.clearSearch()" class="treatment-action-btn">
                            Limpar Busca
                        </button>
                    ` : ''}
                    <button onclick="Tratamentos.showBudgetModal()" class="treatment-action-btn">
                        Novo Orçamento
                    </button>
                </div>
            </div>
        `;
    },

    /**
     * MODAL PROFISSIONAL PARA ORÇAMENTOS (continuação das funcionalidades existentes)
     */

    /**
     * Modal sofisticado para novo orçamento
     */
    showBudgetModal(budget = null) {
        const isEdit = budget !== null;
        
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-slate-900 bg-opacity-95 backdrop-blur-sm flex items-center justify-center z-50 p-4';
        modal.innerHTML = `
            <div class="budget-modal bg-slate-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-hidden border border-slate-600">
                <!-- Header Profissional -->
                <div class="modal-header bg-gradient-to-r from-slate-700 to-slate-800 px-8 py-6 border-b border-slate-600">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-4">
                            <div class="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
                                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 002 2z"/>
                                </svg>
                            </div>
                            <div>
                                <h2 class="text-xl font-semibold text-slate-100 tracking-tight">
                                    ${isEdit ? 'Editar Orçamento' : 'Novo Orçamento'}
                                </h2>
                                <p class="text-sm text-slate-400 mt-0.5">Planejamento e estimativa de tratamentos</p>
                            </div>
                        </div>
                        <button onclick="this.closest('.fixed').remove()" 
                                class="text-slate-400 hover:text-slate-200 transition-colors p-2">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                            </svg>
                        </button>
                    </div>
                </div>

                <!-- Conteúdo Principal -->
                <div class="modal-content overflow-y-auto max-h-[80vh] p-8">
                    
                    <!-- Integração com OrcamentosOdontograma -->
                    <div class="integration-notice bg-gradient-to-r from-blue-900 to-indigo-900 rounded-xl p-6 mb-6 border border-blue-700">
                        <div class="flex items-center space-x-4">
                            <div class="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                            </div>
                            <div class="flex-1">
                                <h3 class="text-white font-semibold">Sistema de Orçamentos Integrado</h3>
                                <p class="text-blue-200 text-sm mt-1">Use o sistema completo de orçamentos na aba Orçamentos do prontuário do paciente.</p>
                            </div>
                            <button onclick="Tratamentos.redirectToOrcamentos()" class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                                Ir para Orçamentos
                            </button>
                        </div>
                    </div>

                    <!-- Formulário Simplificado -->
                    <div class="simplified-form">
                        <h3 class="text-lg font-semibold text-slate-100 mb-6">Registro Rápido de Tratamento</h3>
                        
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label class="block text-sm font-medium text-slate-300 mb-2">Procedimento</label>
                                <input type="text" id="quickProcedure" class="professional-input w-full bg-slate-600 border border-slate-500 rounded-lg px-4 py-3 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-base" placeholder="Ex: Limpeza e Profilaxia">
                            </div>
                            
                            <div>
                                <label class="block text-sm font-medium text-slate-300 mb-2">Tipo</label>
                                <select id="quickType" class="professional-input w-full bg-slate-600 border border-slate-500 rounded-lg px-4 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-base">
                                    <option value="">Selecione o tipo</option>
                                    <option value="limpeza">🧽 Limpeza</option>
                                    <option value="restauracao">🔧 Restauração</option>
                                    <option value="canal">🩺 Canal</option>
                                    <option value="ortodontia">🦷 Ortodontia</option>
                                    <option value="implante">⚙️ Implante</option>
                                    <option value="cirurgia">⚕️ Cirurgia</option>
                                    <option value="protese">👄 Prótese</option>
                                    <option value="clareamento">✨ Clareamento</option>
                                </select>
                            </div>
                            
                            <div>
                                <label class="block text-sm font-medium text-slate-300 mb-2">Dentista</label>
                                <input type="text" id="quickDentist" class="professional-input w-full bg-slate-600 border border-slate-500 rounded-lg px-4 py-3 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-base" placeholder="Nome do dentista" value="Dr. Admin">
                            </div>
                            
                            <div>
                                <label class="block text-sm font-medium text-slate-300 mb-2">Valor (R$)</label>
                                <input type="number" id="quickValue" class="professional-input w-full bg-slate-600 border border-slate-500 rounded-lg px-4 py-3 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-base" placeholder="0,00" step="0.01" min="0">
                            </div>
                            
                            <div>
                                <label class="block text-sm font-medium text-slate-300 mb-2">Status</label>
                                <select id="quickStatus" class="professional-input w-full bg-slate-600 border border-slate-500 rounded-lg px-4 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-base">
                                    <option value="agendado">Agendado</option>
                                    <option value="em-andamento">Em Andamento</option>
                                    <option value="concluido">Concluído</option>
                                </select>
                            </div>
                            
                            <div>
                                <label class="block text-sm font-medium text-slate-300 mb-2">Data</label>
                                <input type="date" id="quickDate" class="professional-input w-full bg-slate-600 border border-slate-500 rounded-lg px-4 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-base" value="${new Date().toISOString().split('T')[0]}">
                            </div>
                        </div>
                        
                        <div class="mt-6">
                            <label class="block text-sm font-medium text-slate-300 mb-2">Observações</label>
                            <textarea id="quickObservations" rows="3" class="professional-input w-full bg-slate-600 border border-slate-500 rounded-lg px-4 py-3 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-base resize-none" placeholder="Observações sobre o tratamento..."></textarea>
                        </div>
                    </div>
                </div>
                
                <!-- Footer com Ações -->
                <div class="modal-footer bg-slate-700 px-8 py-6 border-t border-slate-600">
                    <div class="flex justify-end space-x-4">
                        <button onclick="this.closest('.fixed').remove()" class="px-6 py-3 bg-slate-600 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg font-medium transition-all duration-300">
                            Cancelar
                        </button>
                        <button onclick="Tratamentos.saveQuickTreatment()" class="px-8 py-3 bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                            <svg class="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                            </svg>
                            Salvar Tratamento
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Carregar estilos CSS específicos
        this.loadBudgetModalStyles();
    },

    /**
     * Redirecionar para aba de orçamentos
     */
    redirectToOrcamentos() {
        // Fechar modal
        const modal = document.querySelector('.fixed');
        if (modal) modal.remove();
        
        // Navegar para aba de orçamentos
        if (typeof showPatientTab === 'function') {
            showPatientTab('orcamentos');
            UI.showAlert('💰 Redirecionado', 'Agora você está na aba Orçamentos com sistema completo de odontograma!');
        } else {
            UI.showAlert('ℹ️ Informação', 'Vá para a aba "Orçamentos" no prontuário do paciente para usar o sistema completo!');
        }
    },

    /**
     * Salvar tratamento rápido
     */
    saveQuickTreatment() {
        const procedure = document.getElementById('quickProcedure').value.trim();
        const type = document.getElementById('quickType').value;
        const dentist = document.getElementById('quickDentist').value.trim();
        const value = parseFloat(document.getElementById('quickValue').value) || 0;
        const status = document.getElementById('quickStatus').value;
        const date = document.getElementById('quickDate').value;
        const observations = document.getElementById('quickObservations').value.trim();
        
        // Validações
        if (!procedure) {
            UI.showAlert('❌ Procedimento obrigatório', 'Por favor, informe o nome do procedimento.');
            document.getElementById('quickProcedure').focus();
            return;
        }
        
        if (!type) {
            UI.showAlert('❌ Tipo obrigatório', 'Por favor, selecione o tipo do tratamento.');
            document.getElementById('quickType').focus();
            return;
        }
        
        if (!dentist) {
            UI.showAlert('❌ Dentista obrigatório', 'Por favor, informe o nome do dentista.');
            document.getElementById('quickDentist').focus();
            return;
        }
        
        // Criar tratamento
        const treatment = {
            id: Date.now(),
            procedure,
            type,
            dentist,
            value,
            status,
            date,
            observations,
            teeth: [],
            duration: '',
            attachments: [],
            createdAt: new Date().toISOString()
        };
        
        // Adicionar à lista
        this.treatments.unshift(treatment);
        this.saveTreatments();
        
        // Fechar modal
        document.querySelector('.fixed').remove();
        
        // Atualizar interface
        this.refreshTimeline();
        
        // Mostrar sucesso
        UI.showAlert('✅ Tratamento Salvo!', `Tratamento "${procedure}" registrado com sucesso!`);
        
        console.log('🦷 Novo tratamento criado:', treatment);
    },

    /**
     * Carregar estilos CSS específicos do modal
     */
    loadBudgetModalStyles() {
        if (!document.getElementById('budgetModalStyles')) {
            const styles = document.createElement('style');
            styles.id = 'budgetModalStyles';
            styles.textContent = `
                .budget-modal {
                    background: linear-gradient(145deg, #1e293b 0%, #0f172a 100%);
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.8);
                }
                
                .professional-input {
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    font-weight: 500;
                    letter-spacing: 0.025em;
                }
                
                .professional-input:focus {
                    box-shadow: 0 0 0 3px rgba(20, 184, 166, 0.1);
                    transform: translateY(-1px);
                }
                
                .integration-notice {
                    backdrop-filter: blur(10px);
                }
            `;
            document.head.appendChild(styles);
        }
    },

    /**
     * ESTILOS CUSTOMIZADOS
     */
    addCustomStyles() {
        if (!document.getElementById('treatmentsSearchStyles')) {
            const styles = document.createElement('style');
            styles.id = 'treatmentsSearchStyles';
            styles.textContent = `
                .treatments-workspace {
                    background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
                    min-height: 100vh;
                }
                
                .treatments-header-panel {
                    background: linear-gradient(135deg, #334155 0%, #1e293b 100%);
                    border: 1px solid rgba(71, 85, 105, 0.3);
                    border-radius: 24px;
                    padding: 32px;
                    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.4);
                }
                
                .search-input-premium {
                    background: rgba(30, 41, 59, 0.8);
                    border: 2px solid rgba(148, 163, 184, 0.2);
                    border-radius: 16px;
                    padding: 16px 24px;
                    color: #f1f5f9;
                    font-size: 16px;
                    width: 100%;
                    transition: all 0.3s ease;
                    backdrop-filter: blur(8px);
                }
                
                .search-input-premium:focus {
                    border-color: rgba(14, 116, 144, 0.6);
                    box-shadow: 0 0 0 4px rgba(14, 116, 144, 0.1);
                    outline: none;
                    background: rgba(30, 41, 59, 0.9);
                }
                
                .filters-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 24px;
                    margin-bottom: 24px;
                }
                
                .filter-group {
                    display: flex;
                    flex-direction: column;
                }
                
                .filter-label {
                    color: #94a3b8;
                    font-size: 14px;
                    font-weight: 600;
                    margin-bottom: 8px;
                }
                
                .filter-buttons {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 8px;
                }
                
                .filter-btn {
                    background: rgba(30, 41, 59, 0.6);
                    border: 1px solid rgba(148, 163, 184, 0.2);
                    border-radius: 10px;
                    color: #94a3b8;
                    padding: 8px 16px;
                    font-size: 13px;
                    font-weight: 500;
                    transition: all 0.3s ease;
                    cursor: pointer;
                    border: none;
                }
                
                .filter-btn.active {
                    background: linear-gradient(135deg, #0e7490 0%, #0d9488 100%);
                    border-color: rgba(20, 184, 166, 0.5);
                    color: white;
                    box-shadow: 0 4px 15px rgba(14, 116, 144, 0.3);
                }
                
                .filter-btn:hover:not(.active) {
                    background: rgba(30, 41, 59, 0.8);
                    color: #e2e8f0;
                }
                
                .filter-select {
                    background: rgba(30, 41, 59, 0.8);
                    border: 1px solid rgba(148, 163, 184, 0.2);
                    border-radius: 10px;
                    color: #f1f5f9;
                    padding: 10px 14px;
                    font-size: 14px;
                    width: 100%;
                }
                
                .sort-controls {
                    display: flex;
                    gap: 8px;
                }
                
                .sort-direction-btn {
                    background: rgba(30, 41, 59, 0.8);
                    border: 1px solid rgba(148, 163, 184, 0.2);
                    border-radius: 8px;
                    color: #f1f5f9;
                    padding: 8px 12px;
                    font-weight: bold;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                
                .sort-direction-btn:hover {
                    background: rgba(14, 116, 144, 0.2);
                    border-color: rgba(14, 116, 144, 0.4);
                }
                
                .stats-quick {
                    margin-top: 24px;
                }
                
                .stat-card-mini {
                    background: rgba(30, 41, 59, 0.4);
                    border: 1px solid rgba(148, 163, 184, 0.2);
                    border-radius: 12px;
                    padding: 16px;
                    text-align: center;
                }
                
                .stat-number {
                    font-size: 24px;
                    font-weight: 700;
                    color: #0d9488;
                    margin-bottom: 4px;
                }
                
                .stat-label {
                    font-size: 12px;
                    color: #94a3b8;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                
                .treatments-timeline-container {
                    background: linear-gradient(135deg, #334155 0%, #1e293b 100%);
                    border: 1px solid rgba(71, 85, 105, 0.3);
                    border-radius: 24px;
                    padding: 32px;
                    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.4);
                }
                
                .timeline-item {
                    display: flex;
                    margin-bottom: 32px;
                }
                
                .timeline-item.highlighted {
                    background: linear-gradient(135deg, rgba(14, 116, 144, 0.1) 0%, rgba(13, 148, 136, 0.1) 100%);
                    border-radius: 16px;
                    padding: 16px;
                    margin: -16px -16px 16px -16px;
                    border: 1px solid rgba(14, 116, 144, 0.3);
                }
                
                .timeline-connector {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    margin-right: 24px;
                }
                
                .timeline-dot {
                    width: 16px;
                    height: 16px;
                    border-radius: 50%;
                    border: 3px solid;
                    margin-bottom: 8px;
                }
                
                .timeline-dot.status-concluido {
                    background: #10b981;
                    border-color: #10b981;
                }
                
                .timeline-dot.status-em-andamento {
                    background: #f59e0b;
                    border-color: #f59e0b;
                }
                
                .timeline-dot.status-agendado {
                    background: #3b82f6;
                    border-color: #3b82f6;
                }
                
                .timeline-line {
                    width: 2px;
                    flex: 1;
                    background: rgba(148, 163, 184, 0.3);
                }
                
                .timeline-card {
                    flex: 1;
                    background: rgba(30, 41, 59, 0.6);
                    border: 1px solid rgba(148, 163, 184, 0.2);
                    border-radius: 16px;
                    padding: 24px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                
                .timeline-card:hover {
                    background: rgba(30, 41, 59, 0.8);
                    border-color: rgba(14, 116, 144, 0.4);
                    transform: translateY(-2px);
                }
                
                .treatment-title {
                    color: #f1f5f9;
                    font-size: 18px;
                    font-weight: 600;
                    margin-bottom: 8px;
                }
                
                .treatment-date {
                    color: #94a3b8;
                    font-size: 14px;
                    margin-bottom: 16px;
                }
                
                .status-badge {
                    padding: 4px 12px;
                    border-radius: 12px;
                    font-size: 11px;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                
                .status-badge.status-concluido {
                    background: rgba(16, 185, 129, 0.2);
                    color: #10b981;
                }
                
                .status-badge.status-em-andamento {
                    background: rgba(245, 158, 11, 0.2);
                    color: #f59e0b;
                }
                
                .status-badge.status-agendado {
                    background: rgba(59, 130, 246, 0.2);
                    color: #3b82f6;
                }
                
                .treatment-type-icon {
                    width: 32px;
                    height: 32px;
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 16px;
                    background: rgba(14, 116, 144, 0.2);
                }
                
                .info-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                
                .info-label {
                    color: #94a3b8;
                    font-size: 14px;
                    font-weight: 500;
                }
                
                .info-value {
                    color: #f1f5f9;
                    font-size: 14px;
                    font-weight: 600;
                }
                
                .observations {
                    margin-top: 16px;
                    padding-top: 16px;
                    border-top: 1px solid rgba(148, 163, 184, 0.2);
                }
                
                .observations-text {
                    color: #e2e8f0;
                    font-size: 14px;
                    line-height: 1.5;
                    margin-top: 8px;
                }
                
                .attachments {
                    margin-top: 12px;
                }
                
                .attachments-list {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 8px;
                    margin-top: 8px;
                }
                
                .attachment-item {
                    background: rgba(14, 116, 144, 0.2);
                    color: #0d9488;
                    padding: 4px 8px;
                    border-radius: 6px;
                    font-size: 12px;
                }
                
                .card-actions {
                    display: flex;
                    justify-content: flex-end;
                    gap: 8px;
                    margin-top: 16px;
                    padding-top: 16px;
                    border-top: 1px solid rgba(148, 163, 184, 0.2);
                }
                
                .action-btn-small {
                    background: rgba(14, 116, 144, 0.2);
                    border: 1px solid rgba(14, 116, 144, 0.3);
                    border-radius: 8px;
                    color: #0d9488;
                    padding: 8px 12px;
                    font-size: 12px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    gap: 4px;
                }
                
                .action-btn-small:hover {
                    background: rgba(14, 116, 144, 0.3);
                    transform: translateY(-1px);
                }
                
                .search-highlight {
                    background: rgba(255, 255, 0, 0.3);
                    color: #fbbf24;
                    padding: 2px 4px;
                    border-radius: 4px;
                    font-weight: 600;
                }
                
                .treatment-action-btn {
                    background: linear-gradient(135deg, #0e7490 0%, #0d9488 100%);
                    border: 1px solid rgba(20, 184, 166, 0.3);
                    border-radius: 12px;
                    color: white;
                    font-weight: 600;
                    padding: 12px 24px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 15px rgba(14, 116, 144, 0.3);
                    display: flex;
                    align-items: center;
                    border: none;
                }
                
                .treatment-action-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 30px rgba(14, 116, 144, 0.4);
                }
                
                .empty-state-treatments {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    min-height: 300px;
                    text-align: center;
                    padding: 40px;
                }

                @media (max-width: 768px) {
                    .treatments-workspace {
                        padding: 16px;
                    }
                    
                    .treatments-header-panel, .treatments-timeline-container {
                        padding: 16px;
                    }
                    
                    .filters-grid {
                        grid-template-columns: 1fr;
                        gap: 16px;
                    }
                    
                    .timeline-item {
                        flex-direction: column;
                    }
                    
                    .timeline-connector {
                        flex-direction: row;
                        width: 100%;
                        margin-bottom: 16px;
                        margin-right: 0;
                    }
                    
                    .timeline-line {
                        height: 2px;
                        width: 100%;
                        margin-left: 8px;
                    }
                }
            `;
            document.head.appendChild(styles);
        }
    },

    /**
     * PLACEHOLDERS PARA AÇÕES
     */
    exportTreatments() {
        UI.showAlert('📤 Exportar Tratamentos', '🚧 Funcionalidade será implementada!\n\nFormatos:\n• PDF com timeline\n• Excel com dados\n• Relatório clínico');
    },

    openTreatmentDetails(id) {
        console.log('📋 Abrir detalhes do tratamento:', id);
        UI.showAlert('📋 Detalhes do Tratamento', '🚧 Interface detalhada será implementada!\n\nRecursos:\n• Histórico completo\n• Imagens vinculadas\n• Anotações clínicas\n• Evolução do caso');
    },

    editTreatment(id) {
        UI.showAlert('✏️ Editar Tratamento', '🚧 Interface de edição será implementada!');
    },

    duplicateTreatment(id) {
        UI.showAlert('📋 Duplicar Tratamento', '🚧 Funcionalidade será implementada!');
    },

    linkToImages(id) {
        UI.showAlert('🖼️ Vincular Imagens', '🚧 Interface será implementada!\n\nPermitirá vincular imagens específicas ao tratamento.');
    }
};

// Auto-inicializar
document.addEventListener('DOMContentLoaded', function() {
    if (typeof Tratamentos !== 'undefined') {
        Tratamentos.init();
    }
});

// Exportar para uso global
window.Tratamentos = Tratamentos;

console.log('💰 Módulo de Tratamentos Premium integrado carregado!');