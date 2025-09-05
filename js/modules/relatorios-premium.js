// ============================================================================
// DENTALCORE PRO - SISTEMA DE RELATÓRIOS EXECUTIVOS PREMIUM
// Dashboard inteligente com analytics avançados e exportação profissional
// Paleta: Azul-marinho, Carvão e Azul-petróleo
// ============================================================================

const RelatoriosPremium = {
    // Estado atual do sistema de relatórios
    currentReport: {
        type: 'dashboard',
        period: 'month',
        startDate: null,
        endDate: null,
        filters: {},
        data: {}
    },

    // Configurações de períodos
    periods: {
        'today': { label: 'Hoje', days: 1 },
        'week': { label: 'Esta Semana', days: 7 },
        'month': { label: 'Este Mês', days: 30 },
        'quarter': { label: 'Este Trimestre', days: 90 },
        'semester': { label: 'Este Semestre', days: 180 },
        'year': { label: 'Este Ano', days: 365 },
        'custom': { label: 'Período Personalizado', days: null }
    },

    // Tipos de relatórios disponíveis
    reportTypes: [
        {
            id: 'dashboard',
            title: 'Dashboard Executivo',
            icon: '📊',
            description: 'Visão geral com KPIs e métricas principais',
            category: 'Executivo'
        },
        {
            id: 'financial',
            title: 'Relatório Financeiro',
            icon: '💰',
            description: 'Receitas, despesas, fluxo de caixa e inadimplência',
            category: 'Financeiro'
        },
        {
            id: 'patients',
            title: 'Analytics de Pacientes',
            icon: '👥',
            description: 'Novos cadastros, perfil demográfico e histórico',
            category: 'Pacientes'
        },
        {
            id: 'treatments',
            title: 'Relatório de Tratamentos',
            icon: '🦷',
            description: 'Procedimentos realizados, rentabilidade e tempo médio',
            category: 'Clínico'
        },
        {
            id: 'appointments',
            title: 'Analytics de Agenda',
            icon: '📅',
            description: 'Ocupação, cancelamentos e horários de pico',
            category: 'Operacional'
        },
        {
            id: 'budgets',
            title: 'Análise de Orçamentos',
            icon: '💼',
            description: 'Taxa de conversão, ticket médio e aprovações',
            category: 'Comercial'
        }
    ],

    // Dados consolidados dos módulos
    consolidatedData: {
        patients: [],
        treatments: [],
        appointments: [],
        budgets: [],
        transactions: [],
        images: []
    },

    /**
     * Inicialização do módulo
     */
    init() {
        console.log('📊 Sistema de Relatórios Premium inicializado');
        this.loadConsolidatedData();
        this.setupChartJS();
    },

    /**
     * Carregar dados consolidados de todos os módulos
     */
    loadConsolidatedData() {
        try {
            // Dados de pacientes
            this.consolidatedData.patients = window.patients || this.generateDemoPatients();
            
            // Dados de tratamentos
            if (typeof Tratamentos !== 'undefined' && Tratamentos.treatments) {
                this.consolidatedData.treatments = Tratamentos.treatments;
            } else {
                this.consolidatedData.treatments = this.generateDemoTreatments();
            }
            
            // Dados financeiros
            if (typeof DebitosProfissional !== 'undefined') {
                this.consolidatedData.transactions = DebitosProfissional.transactionHistory || [];
            } else {
                this.consolidatedData.transactions = this.generateDemoTransactions();
            }
            
            // Dados de orçamentos
            this.consolidatedData.budgets = this.generateDemoBudgets();
            
            // Dados de consultas
            this.consolidatedData.appointments = this.generateDemoAppointments();
            
            console.log('📊 Dados consolidados carregados:', this.consolidatedData);
        } catch (error) {
            console.error('❌ Erro ao carregar dados:', error);
            this.loadDemoData();
        }
    },

    /**
     * Configurar Chart.js
     */
    setupChartJS() {
        // Verificar se Chart.js está disponível
        if (typeof Chart === 'undefined') {
            console.warn('⚠️ Chart.js não encontrado, carregando via CDN...');
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
            script.onload = () => console.log('✅ Chart.js carregado');
            document.head.appendChild(script);
        }
    },

    /**
     * Interface principal dos relatórios
     */
    renderReportsInterface() {
        return `
            <style>
                /* CSS INLINE PARA GARANTIR FUNCIONAMENTO */
                .reports-workspace {
                    background: linear-gradient(135deg, #1e3a8a 0%, #374151 100%);
                    min-height: 100vh;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', sans-serif;
                    color: #f8fafc;
                    padding: 0;
                    margin: 0;
                }

                .reports-header {
                    background: rgba(255, 255, 255, 0.05);
                    backdrop-filter: blur(20px);
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                    padding: 24px 40px;
                    position: sticky;
                    top: 0;
                    z-index: 100;
                }

                .reports-title {
                    font-size: 28px;
                    font-weight: 300;
                    color: #ffffff;
                    margin: 0 0 8px 0;
                    letter-spacing: -0.025em;
                    text-align: center;
                }

                .reports-subtitle {
                    font-size: 14px;
                    color: #94a3b8;
                    margin: 0;
                    text-align: center;
                    font-weight: 400;
                }

                .reports-main-container {
                    padding: 40px;
                    max-width: 1400px;
                    margin: 0 auto;
                }

                /* CONTROLES DE PERÍODO E FILTROS */
                .period-controls {
                    background: rgba(255, 255, 255, 0.02);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    border-radius: 16px;
                    padding: 24px;
                    margin-bottom: 32px;
                    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
                }

                .period-buttons {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 8px;
                    margin-bottom: 20px;
                }

                .period-btn {
                    padding: 8px 16px;
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    border-radius: 8px;
                    background: rgba(0, 0, 0, 0.2);
                    color: #e2e8f0;
                    font-size: 12px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }

                .period-btn.active {
                    background: linear-gradient(135deg, #0d9488 0%, #14b8a6 100%);
                    border-color: rgba(20, 184, 166, 0.5);
                    color: white;
                    box-shadow: 0 4px 15px rgba(14, 116, 144, 0.3);
                }

                .period-btn:hover:not(.active) {
                    background: rgba(13, 148, 136, 0.2);
                    border-color: rgba(13, 148, 136, 0.3);
                    color: #14b8a6;
                }

                .custom-period {
                    display: grid;
                    grid-template-columns: 1fr 1fr auto;
                    gap: 12px;
                    align-items: end;
                }

                .date-input {
                    background: rgba(0, 0, 0, 0.3);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 8px;
                    padding: 10px 12px;
                    color: #f8fafc;
                    font-size: 14px;
                }

                .apply-period-btn {
                    padding: 10px 20px;
                    background: linear-gradient(135deg, #0d9488 0%, #14b8a6 100%);
                    border: none;
                    border-radius: 8px;
                    color: white;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }

                .apply-period-btn:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 4px 15px rgba(14, 116, 144, 0.3);
                }

                /* TIPOS DE RELATÓRIOS */
                .report-types-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                    gap: 20px;
                    margin-bottom: 32px;
                }

                .report-type-card {
                    background: rgba(255, 255, 255, 0.02);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    border-radius: 16px;
                    padding: 20px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    position: relative;
                    overflow: hidden;
                }

                .report-type-card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.2);
                    border-color: rgba(13, 148, 136, 0.3);
                    background: rgba(255, 255, 255, 0.04);
                }

                .report-type-card.active {
                    border-color: rgba(13, 148, 136, 0.5);
                    background: rgba(13, 148, 136, 0.1);
                }

                .report-card-header {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin-bottom: 12px;
                }

                .report-card-icon {
                    width: 40px;
                    height: 40px;
                    background: rgba(13, 148, 136, 0.2);
                    border: 1px solid rgba(13, 148, 136, 0.3);
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 18px;
                }

                .report-card-title {
                    font-size: 16px;
                    font-weight: 600;
                    color: #f8fafc;
                    margin: 0;
                }

                .report-card-category {
                    font-size: 10px;
                    color: #14b8a6;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }

                .report-card-description {
                    font-size: 13px;
                    color: #94a3b8;
                    line-height: 1.4;
                    margin: 0;
                }

                /* ÁREA DE RELATÓRIO */
                .report-content {
                    background: rgba(255, 255, 255, 0.02);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    border-radius: 16px;
                    padding: 32px;
                    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
                    min-height: 600px;
                }

                .report-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 32px;
                    padding-bottom: 16px;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                }

                .report-title {
                    font-size: 24px;
                    font-weight: 600;
                    color: #ffffff;
                    margin: 0;
                }

                .report-actions {
                    display: flex;
                    gap: 12px;
                }

                .report-action-btn {
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

                .report-action-btn:hover {
                    background: rgba(13, 148, 136, 0.2);
                    border-color: rgba(13, 148, 136, 0.3);
                    color: #14b8a6;
                }

                .report-action-btn.primary {
                    background: linear-gradient(135deg, #0d9488 0%, #14b8a6 100%);
                    border-color: transparent;
                    color: white;
                }

                /* DASHBOARD EXECUTIVO */
                .kpi-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 20px;
                    margin-bottom: 32px;
                }

                .kpi-card {
                    background: rgba(0, 0, 0, 0.2);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 12px;
                    padding: 20px;
                    text-align: center;
                    transition: all 0.3s ease;
                }

                .kpi-card:hover {
                    background: rgba(0, 0, 0, 0.3);
                    border-color: rgba(13, 148, 136, 0.3);
                    transform: translateY(-2px);
                }

                .kpi-value {
                    font-size: 28px;
                    font-weight: 700;
                    margin: 0 0 8px 0;
                    letter-spacing: -0.02em;
                }

                .kpi-value.revenue { color: #10b981; }
                .kpi-value.patients { color: #3b82f6; }
                .kpi-value.treatments { color: #8b5cf6; }
                .kpi-value.conversion { color: #f59e0b; }

                .kpi-label {
                    font-size: 12px;
                    color: #94a3b8;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    margin: 0 0 8px 0;
                }

                .kpi-change {
                    font-size: 11px;
                    font-weight: 600;
                    padding: 2px 6px;
                    border-radius: 4px;
                }

                .kpi-change.positive {
                    background: rgba(16, 185, 129, 0.2);
                    color: #10b981;
                }

                .kpi-change.negative {
                    background: rgba(239, 68, 68, 0.2);
                    color: #ef4444;
                }

                /* GRÁFICOS */
                .charts-grid {
                    display: grid;
                    grid-template-columns: 2fr 1fr;
                    gap: 24px;
                    margin-bottom: 32px;
                }

                .chart-container {
                    background: rgba(0, 0, 0, 0.2);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 12px;
                    padding: 20px;
                    position: relative;
                }

                .chart-title {
                    font-size: 16px;
                    font-weight: 600;
                    color: #f8fafc;
                    margin: 0 0 16px 0;
                    text-align: center;
                }

                .chart-canvas {
                    width: 100% !important;
                    height: 300px !important;
                }

                /* TABELAS */
                .data-table {
                    background: rgba(0, 0, 0, 0.2);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 12px;
                    overflow: hidden;
                    margin-top: 24px;
                }

                .table-header {
                    background: rgba(13, 148, 136, 0.2);
                    padding: 16px 20px;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                }

                .table-title {
                    font-size: 16px;
                    font-weight: 600;
                    color: #14b8a6;
                    margin: 0;
                }

                .table-content {
                    padding: 0;
                }

                .table-row {
                    display: grid;
                    grid-template-columns: 2fr 1fr 1fr 1fr;
                    padding: 16px 20px;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
                    transition: all 0.2s ease;
                }

                .table-row:hover {
                    background: rgba(13, 148, 136, 0.1);
                }

                .table-cell {
                    font-size: 14px;
                    color: #e2e8f0;
                    display: flex;
                    align-items: center;
                }

                .table-cell.header {
                    font-weight: 600;
                    color: #94a3b8;
                    font-size: 12px;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }

                .table-cell.number {
                    font-weight: 600;
                    color: #14b8a6;
                }

                /* ALERTAS E INSIGHTS */
                .insights-section {
                    margin-top: 32px;
                }

                .insights-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 20px;
                }

                .insight-card {
                    background: rgba(0, 0, 0, 0.2);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 12px;
                    padding: 20px;
                    border-left: 4px solid;
                }

                .insight-card.opportunity {
                    border-left-color: #10b981;
                }

                .insight-card.warning {
                    border-left-color: #f59e0b;
                }

                .insight-card.alert {
                    border-left-color: #ef4444;
                }

                .insight-title {
                    font-size: 14px;
                    font-weight: 600;
                    color: #f8fafc;
                    margin: 0 0 8px 0;
                }

                .insight-description {
                    font-size: 13px;
                    color: #94a3b8;
                    line-height: 1.4;
                    margin: 0;
                }

                /* RESPONSIVIDADE */
                @media (max-width: 1024px) {
                    .reports-main-container {
                        padding: 24px;
                    }
                    
                    .charts-grid {
                        grid-template-columns: 1fr;
                    }
                    
                    .kpi-grid {
                        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                    }
                    
                    .custom-period {
                        grid-template-columns: 1fr;
                    }
                }

                @media (max-width: 768px) {
                    .report-types-grid {
                        grid-template-columns: 1fr;
                    }
                    
                    .period-buttons {
                        justify-content: center;
                    }
                    
                    .report-header {
                        flex-direction: column;
                        gap: 16px;
                    }
                    
                    .table-row {
                        grid-template-columns: 1fr;
                        gap: 8px;
                    }
                    
                    .insights-grid {
                        grid-template-columns: 1fr;
                    }
                }
            </style>

            <div class="reports-workspace">
                <!-- Header -->
                <div class="reports-header">
                    <h1 class="reports-title">📊 Relatórios Executivos</h1>
                    <p class="reports-subtitle">Analytics avançados e insights inteligentes para gestão estratégica</p>
                </div>

                <!-- Container Principal -->
                <div class="reports-main-container">
                    <!-- Controles de Período -->
                    <div class="period-controls">
                        <div class="period-buttons">
                            ${Object.entries(this.periods).map(([key, period]) => `
                                <button onclick="RelatoriosPremium.setPeriod('${key}')" 
                                        class="period-btn ${this.currentReport.period === key ? 'active' : ''}">
                                    ${period.label}
                                </button>
                            `).join('')}
                        </div>
                        
                        <div class="custom-period" style="display: ${this.currentReport.period === 'custom' ? 'grid' : 'none'};" id="customPeriodSection">
                            <input type="date" id="startDate" class="date-input" placeholder="Data inicial">
                            <input type="date" id="endDate" class="date-input" placeholder="Data final">
                            <button onclick="RelatoriosPremium.applyCustomPeriod()" class="apply-period-btn">
                                Aplicar
                            </button>
                        </div>
                    </div>

                    <!-- Tipos de Relatórios -->
                    <div class="report-types-grid">
                        ${this.reportTypes.map(report => `
                            <div onclick="RelatoriosPremium.selectReport('${report.id}')" 
                                 class="report-type-card ${this.currentReport.type === report.id ? 'active' : ''}">
                                <div class="report-card-header">
                                    <div class="report-card-icon">${report.icon}</div>
                                    <div>
                                        <h3 class="report-card-title">${report.title}</h3>
                                        <div class="report-card-category">${report.category}</div>
                                    </div>
                                </div>
                                <p class="report-card-description">${report.description}</p>
                            </div>
                        `).join('')}
                    </div>

                    <!-- Área de Relatório -->
                    <div class="report-content">
                        <div class="report-header">
                            <h2 class="report-title">${this.getCurrentReportTitle()}</h2>
                            <div class="report-actions">
                                <button onclick="RelatoriosPremium.refreshReport()" class="report-action-btn">
                                    🔄 Atualizar
                                </button>
                                <button onclick="RelatoriosPremium.exportPDF()" class="report-action-btn">
                                    📄 PDF
                                </button>
                                <button onclick="RelatoriosPremium.exportExcel()" class="report-action-btn primary">
                                    📊 Excel
                                </button>
                            </div>
                        </div>

                        <!-- Conteúdo do Relatório -->
                        <div id="reportContentArea">
                            ${this.renderCurrentReport()}
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * Renderizar relatório atual baseado no tipo selecionado
     */
    renderCurrentReport() {
        switch (this.currentReport.type) {
            case 'dashboard':
                return this.renderExecutiveDashboard();
            case 'financial':
                return this.renderFinancialReport();
            case 'patients':
                return this.renderPatientsReport();
            case 'treatments':
                return this.renderTreatmentsReport();
            case 'appointments':
                return this.renderAppointmentsReport();
            case 'budgets':
                return this.renderBudgetsReport();
            default:
                return this.renderExecutiveDashboard();
        }
    },

    /**
     * Renderizar Dashboard Executivo
     */
    renderExecutiveDashboard() {
        const metrics = this.calculateDashboardMetrics();
        
        return `
            <!-- KPIs Principais -->
            <div class="kpi-grid">
                <div class="kpi-card">
                    <div class="kpi-label">Faturamento Mensal</div>
                    <div class="kpi-value revenue">R$ ${metrics.monthlyRevenue.toLocaleString('pt-BR')}</div>
                    <div class="kpi-change ${metrics.revenueChange >= 0 ? 'positive' : 'negative'}">
                        ${metrics.revenueChange >= 0 ? '+' : ''}${metrics.revenueChange.toFixed(1)}% vs mês anterior
                    </div>
                </div>
                
                <div class="kpi-card">
                    <div class="kpi-label">Pacientes Ativos</div>
                    <div class="kpi-value patients">${metrics.activePatients}</div>
                    <div class="kpi-change ${metrics.patientsChange >= 0 ? 'positive' : 'negative'}">
                        ${metrics.patientsChange >= 0 ? '+' : ''}${metrics.patientsChange} novos
                    </div>
                </div>
                
                <div class="kpi-card">
                    <div class="kpi-label">Tratamentos Realizados</div>
                    <div class="kpi-value treatments">${metrics.treatmentsCompleted}</div>
                    <div class="kpi-change positive">
                        ${metrics.avgTreatmentValue.toFixed(0)}% da meta
                    </div>
                </div>
                
                <div class="kpi-card">
                    <div class="kpi-label">Taxa de Conversão</div>
                    <div class="kpi-value conversion">${metrics.conversionRate.toFixed(1)}%</div>
                    <div class="kpi-change ${metrics.conversionChange >= 0 ? 'positive' : 'negative'}">
                        ${metrics.conversionChange >= 0 ? '+' : ''}${metrics.conversionChange.toFixed(1)}% vs anterior
                    </div>
                </div>
            </div>

            <!-- Gráficos -->
            <div class="charts-grid">
                <div class="chart-container">
                    <h3 class="chart-title">📈 Receita Mensal</h3>
                    <canvas id="revenueChart" class="chart-canvas"></canvas>
                </div>
                
                <div class="chart-container">
                    <h3 class="chart-title">🦷 Top Tratamentos</h3>
                    <canvas id="treatmentsChart" class="chart-canvas"></canvas>
                </div>
            </div>

            <!-- Top Pacientes por Valor -->
            <div class="data-table">
                <div class="table-header">
                    <h3 class="table-title">🏆 Top 5 Pacientes por Faturamento</h3>
                </div>
                <div class="table-content">
                    <div class="table-row">
                        <div class="table-cell header">Paciente</div>
                        <div class="table-cell header">Tratamentos</div>
                        <div class="table-cell header">Valor Total</div>
                        <div class="table-cell header">Última Consulta</div>
                    </div>
                    ${this.getTopPatients().map(patient => `
                        <div class="table-row">
                            <div class="table-cell">${patient.name}</div>
                            <div class="table-cell">${patient.treatments}</div>
                            <div class="table-cell number">R$ ${patient.totalValue.toLocaleString('pt-BR')}</div>
                            <div class="table-cell">${patient.lastVisit}</div>
                        </div>
                    `).join('')}
                </div>
            </div>

            <!-- Insights e Alertas -->
            <div class="insights-section">
                <h3 style="color: #f8fafc; font-size: 18px; font-weight: 600; margin-bottom: 16px;">🔮 Insights Inteligentes</h3>
                <div class="insights-grid">
                    ${this.generateInsights().map(insight => `
                        <div class="insight-card ${insight.type}">
                            <h4 class="insight-title">${insight.icon} ${insight.title}</h4>
                            <p class="insight-description">${insight.description}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    },

    /**
     * Renderizar Relatório Financeiro
     */
    renderFinancialReport() {
        const financial = this.calculateFinancialMetrics();
        
        return `
            <div class="kpi-grid">
                <div class="kpi-card">
                    <div class="kpi-label">Receita Total</div>
                    <div class="kpi-value revenue">R$ ${financial.totalRevenue.toLocaleString('pt-BR')}</div>
                </div>
                <div class="kpi-card">
                    <div class="kpi-label">Recebido</div>
                    <div class="kpi-value patients">R$ ${financial.totalReceived.toLocaleString('pt-BR')}</div>
                </div>
                <div class="kpi-card">
                    <div class="kpi-label">Pendente</div>
                    <div class="kpi-value treatments">R$ ${financial.totalPending.toLocaleString('pt-BR')}</div>
                </div>
                <div class="kpi-card">
                    <div class="kpi-label">Taxa de Inadimplência</div>
                    <div class="kpi-value conversion">${financial.defaultRate.toFixed(1)}%</div>
                </div>
            </div>

            <div class="charts-grid">
                <div class="chart-container">
                    <h3 class="chart-title">💰 Fluxo de Caixa</h3>
                    <canvas id="cashFlowChart" class="chart-canvas"></canvas>
                </div>
                <div class="chart-container">
                    <h3 class="chart-title">💳 Métodos de Pagamento</h3>
                    <canvas id="paymentMethodsChart" class="chart-canvas"></canvas>
                </div>
            </div>

            <div class="data-table">
                <div class="table-header">
                    <h3 class="table-title">📋 Resumo Financeiro por Período</h3>
                </div>
                <div class="table-content">
                    <div class="table-row">
                        <div class="table-cell header">Período</div>
                        <div class="table-cell header">Receita</div>
                        <div class="table-cell header">Recebido</div>
                        <div class="table-cell header">Taxa</div>
                    </div>
                    ${financial.periodSummary.map(period => `
                        <div class="table-row">
                            <div class="table-cell">${period.period}</div>
                            <div class="table-cell number">R$ ${period.revenue.toLocaleString('pt-BR')}</div>
                            <div class="table-cell number">R$ ${period.received.toLocaleString('pt-BR')}</div>
                            <div class="table-cell number">${period.rate.toFixed(1)}%</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    },

    /**
     * Renderizar Relatório de Pacientes
     */
    renderPatientsReport() {
        const patients = this.calculatePatientsMetrics();
        
        return `
            <div class="kpi-grid">
                <div class="kpi-card">
                    <div class="kpi-label">Total de Pacientes</div>
                    <div class="kpi-value patients">${patients.total}</div>
                </div>
                <div class="kpi-card">
                    <div class="kpi-label">Novos este Mês</div>
                    <div class="kpi-value revenue">${patients.newThisMonth}</div>
                </div>
                <div class="kpi-card">
                    <div class="kpi-label">Pacientes Ativos</div>
                    <div class="kpi-value treatments">${patients.active}</div>
                </div>
                <div class="kpi-card">
                    <div class="kpi-label">Ticket Médio</div>
                    <div class="kpi-value conversion">R$ ${patients.avgTicket.toLocaleString('pt-BR')}</div>
                </div>
            </div>

            <div class="charts-grid">
                <div class="chart-container">
                    <h3 class="chart-title">👥 Novos Pacientes por Mês</h3>
                    <canvas id="newPatientsChart" class="chart-canvas"></canvas>
                </div>
                <div class="chart-container">
                    <h3 class="chart-title">📊 Faixa Etária</h3>
                    <canvas id="ageGroupChart" class="chart-canvas"></canvas>
                </div>
            </div>

            <div class="data-table">
                <div class="table-header">
                    <h3 class="table-title">📈 Análise Demográfica</h3>
                </div>
                <div class="table-content">
                    <div class="table-row">
                        <div class="table-cell header">Categoria</div>
                        <div class="table-cell header">Quantidade</div>
                        <div class="table-cell header">Percentual</div>
                        <div class="table-cell header">Valor Médio</div>
                    </div>
                    ${patients.demographics.map(demo => `
                        <div class="table-row">
                            <div class="table-cell">${demo.category}</div>
                            <div class="table-cell number">${demo.count}</div>
                            <div class="table-cell number">${demo.percentage.toFixed(1)}%</div>
                            <div class="table-cell number">R$ ${demo.avgValue.toLocaleString('pt-BR')}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    },

    /**
     * Renderizar Relatório de Tratamentos
     */
    renderTreatmentsReport() {
        const treatments = this.calculateTreatmentsMetrics();
        
        return `
            <div class="kpi-grid">
                <div class="kpi-card">
                    <div class="kpi-label">Tratamentos Realizados</div>
                    <div class="kpi-value treatments">${treatments.completed}</div>
                </div>
                <div class="kpi-card">
                    <div class="kpi-label">Em Andamento</div>
                    <div class="kpi-value revenue">${treatments.inProgress}</div>
                </div>
                <div class="kpi-card">
                    <div class="kpi-label">Valor Médio</div>
                    <div class="kpi-value patients">R$ ${treatments.avgValue.toLocaleString('pt-BR')}</div>
                </div>
                <div class="kpi-card">
                    <div class="kpi-label">Tempo Médio</div>
                    <div class="kpi-value conversion">${treatments.avgDuration} dias</div>
                </div>
            </div>

            <div class="charts-grid">
                <div class="chart-container">
                    <h3 class="chart-title">🦷 Tratamentos por Categoria</h3>
                    <canvas id="treatmentsCategoryChart" class="chart-canvas"></canvas>
                </div>
                <div class="chart-container">
                    <h3 class="chart-title">💰 Rentabilidade por Tipo</h3>
                    <canvas id="profitabilityChart" class="chart-canvas"></canvas>
                </div>
            </div>

            <div class="data-table">
                <div class="table-header">
                    <h3 class="table-title">🏆 Ranking de Tratamentos</h3>
                </div>
                <div class="table-content">
                    <div class="table-row">
                        <div class="table-cell header">Tratamento</div>
                        <div class="table-cell header">Quantidade</div>
                        <div class="table-cell header">Receita Total</div>
                        <div class="table-cell header">Valor Médio</div>
                    </div>
                    ${treatments.ranking.map(treatment => `
                        <div class="table-row">
                            <div class="table-cell">${treatment.name}</div>
                            <div class="table-cell number">${treatment.count}</div>
                            <div class="table-cell number">R$ ${treatment.totalRevenue.toLocaleString('pt-BR')}</div>
                            <div class="table-cell number">R$ ${treatment.avgValue.toLocaleString('pt-BR')}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    },

    /**
     * Renderizar Relatório de Agenda
     */
    renderAppointmentsReport() {
        const appointments = this.calculateAppointmentsMetrics();
        
        return `
            <div class="kpi-grid">
                <div class="kpi-card">
                    <div class="kpi-label">Taxa de Ocupação</div>
                    <div class="kpi-value treatments">${appointments.occupancyRate.toFixed(1)}%</div>
                </div>
                <div class="kpi-card">
                    <div class="kpi-label">Consultas Realizadas</div>
                    <div class="kpi-value patients">${appointments.completed}</div>
                </div>
                <div class="kpi-card">
                    <div class="kpi-label">Cancelamentos</div>
                    <div class="kpi-value revenue">${appointments.cancelled}</div>
                </div>
                <div class="kpi-card">
                    <div class="kpi-label">No-Show</div>
                    <div class="kpi-value conversion">${appointments.noShow}%</div>
                </div>
            </div>

            <div class="charts-grid">
                <div class="chart-container">
                    <h3 class="chart-title">📅 Ocupação por Dia da Semana</h3>
                    <canvas id="weeklyOccupancyChart" class="chart-canvas"></canvas>
                </div>
                <div class="chart-container">
                    <h3 class="chart-title">⏰ Horários de Pico</h3>
                    <canvas id="peakHoursChart" class="chart-canvas"></canvas>
                </div>
            </div>

            <div class="data-table">
                <div class="table-header">
                    <h3 class="table-title">📊 Análise de Produtividade</h3>
                </div>
                <div class="table-content">
                    <div class="table-row">
                        <div class="table-cell header">Período</div>
                        <div class="table-cell header">Agendadas</div>
                        <div class="table-cell header">Realizadas</div>
                        <div class="table-cell header">Taxa</div>
                    </div>
                    ${appointments.productivity.map(period => `
                        <div class="table-row">
                            <div class="table-cell">${period.period}</div>
                            <div class="table-cell number">${period.scheduled}</div>
                            <div class="table-cell number">${period.completed}</div>
                            <div class="table-cell number">${period.rate.toFixed(1)}%</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    },

    /**
     * Renderizar Relatório de Orçamentos
     */
    renderBudgetsReport() {
        const budgets = this.calculateBudgetsMetrics();
        
        return `
            <div class="kpi-grid">
                <div class="kpi-card">
                    <div class="kpi-label">Orçamentos Enviados</div>
                    <div class="kpi-value patients">${budgets.sent}</div>
                </div>
                <div class="kpi-card">
                    <div class="kpi-label">Taxa de Aprovação</div>
                    <div class="kpi-value treatments">${budgets.approvalRate.toFixed(1)}%</div>
                </div>
                <div class="kpi-card">
                    <div class="kpi-label">Ticket Médio</div>
                    <div class="kpi-value revenue">R$ ${budgets.avgTicket.toLocaleString('pt-BR')}</div>
                </div>
                <div class="kpi-card">
                    <div class="kpi-label">Valor Total Aprovado</div>
                    <div class="kpi-value conversion">R$ ${budgets.totalApproved.toLocaleString('pt-BR')}</div>
                </div>
            </div>

            <div class="charts-grid">
                <div class="chart-container">
                    <h3 class="chart-title">📊 Status dos Orçamentos</h3>
                    <canvas id="budgetStatusChart" class="chart-canvas"></canvas>
                </div>
                <div class="chart-container">
                    <h3 class="chart-title">💰 Valor por Faixa</h3>
                    <canvas id="budgetRangeChart" class="chart-canvas"></canvas>
                </div>
            </div>

            <div class="data-table">
                <div class="table-header">
                    <h3 class="table-title">🎯 Performance de Conversão</h3>
                </div>
                <div class="table-content">
                    <div class="table-row">
                        <div class="table-cell header">Faixa de Valor</div>
                        <div class="table-cell header">Enviados</div>
                        <div class="table-cell header">Aprovados</div>
                        <div class="table-cell header">Taxa</div>
                    </div>
                    ${budgets.conversionByRange.map(range => `
                        <div class="table-row">
                            <div class="table-cell">${range.range}</div>
                            <div class="table-cell number">${range.sent}</div>
                            <div class="table-cell number">${range.approved}</div>
                            <div class="table-cell number">${range.rate.toFixed(1)}%</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    },

    /**
     * FUNÇÕES DE CÁLCULO DE MÉTRICAS
     */
    calculateDashboardMetrics() {
        const transactions = this.consolidatedData.transactions;
        const patients = this.consolidatedData.patients;
        const treatments = this.consolidatedData.treatments;
        
        // Receita mensal
        const currentMonth = new Date().getMonth();
        const monthlyRevenue = transactions
            .filter(t => new Date(t.date).getMonth() === currentMonth)
            .reduce((sum, t) => sum + t.amount, 0);
        
        return {
            monthlyRevenue: monthlyRevenue,
            revenueChange: 15.3, // Simulado
            activePatients: patients.length,
            patientsChange: 8, // Simulado
            treatmentsCompleted: treatments.filter(t => t.status === 'concluido').length,
            avgTreatmentValue: 78.5, // Simulado
            conversionRate: 67.8, // Simulado
            conversionChange: 3.2 // Simulado
        };
    },

    calculateFinancialMetrics() {
        const transactions = this.consolidatedData.transactions;
        const totalRevenue = transactions.reduce((sum, t) => sum + t.amount, 0);
        const totalReceived = transactions
            .filter(t => t.type === 'pagamento')
            .reduce((sum, t) => sum + t.amount, 0);
        
        return {
            totalRevenue: totalRevenue,
            totalReceived: totalReceived,
            totalPending: totalRevenue - totalReceived,
            defaultRate: 5.2,
            periodSummary: [
                { period: 'Janeiro', revenue: 15000, received: 14200, rate: 94.7 },
                { period: 'Fevereiro', revenue: 18000, received: 16800, rate: 93.3 },
                { period: 'Março', revenue: 22000, received: 21500, rate: 97.7 }
            ]
        };
    },

    calculatePatientsMetrics() {
        const patients = this.consolidatedData.patients;
        
        return {
            total: patients.length,
            newThisMonth: 12, // Simulado
            active: Math.floor(patients.length * 0.8),
            avgTicket: 850,
            demographics: [
                { category: '18-30 anos', count: 45, percentage: 32.1, avgValue: 650 },
                { category: '31-45 anos', count: 62, percentage: 44.3, avgValue: 980 },
                { category: '46-60 anos', count: 28, percentage: 20.0, avgValue: 1200 },
                { category: '60+ anos', count: 5, percentage: 3.6, avgValue: 750 }
            ]
        };
    },

    calculateTreatmentsMetrics() {
        const treatments = this.consolidatedData.treatments;
        
        return {
            completed: treatments.filter(t => t.status === 'concluido').length,
            inProgress: treatments.filter(t => t.status === 'em-andamento').length,
            avgValue: 650,
            avgDuration: 21,
            ranking: [
                { name: 'Limpeza e Profilaxia', count: 45, totalRevenue: 6750, avgValue: 150 },
                { name: 'Restauração', count: 32, totalRevenue: 8960, avgValue: 280 },
                { name: 'Canal', count: 18, totalRevenue: 14400, avgValue: 800 },
                { name: 'Ortodontia', count: 12, totalRevenue: 24000, avgValue: 2000 },
                { name: 'Implante', count: 8, totalRevenue: 28000, avgValue: 3500 }
            ]
        };
    },

    calculateAppointmentsMetrics() {
        return {
            occupancyRate: 87.5,
            completed: 156,
            cancelled: 12,
            noShow: 5.3,
            productivity: [
                { period: 'Semana 1', scheduled: 45, completed: 42, rate: 93.3 },
                { period: 'Semana 2', scheduled: 48, completed: 45, rate: 93.8 },
                { period: 'Semana 3', scheduled: 50, completed: 48, rate: 96.0 },
                { period: 'Semana 4', scheduled: 47, completed: 43, rate: 91.5 }
            ]
        };
    },

    calculateBudgetsMetrics() {
        return {
            sent: 78,
            approvalRate: 67.9,
            avgTicket: 1250,
            totalApproved: 65750,
            conversionByRange: [
                { range: 'R$ 0 - R$ 500', sent: 25, approved: 22, rate: 88.0 },
                { range: 'R$ 501 - R$ 1.000', sent: 28, approved: 19, rate: 67.9 },
                { range: 'R$ 1.001 - R$ 2.000', sent: 18, approved: 11, rate: 61.1 },
                { range: 'R$ 2.001+', sent: 7, approved: 1, rate: 14.3 }
            ]
        };
    },

    /**
     * Obter top pacientes
     */
    getTopPatients() {
        return [
            { name: 'Maria Silva', treatments: 8, totalValue: 4200, lastVisit: '15/11/2024' },
            { name: 'João Santos', treatments: 6, totalValue: 3800, lastVisit: '12/11/2024' },
            { name: 'Ana Costa', treatments: 5, totalValue: 2950, lastVisit: '10/11/2024' },
            { name: 'Pedro Lima', treatments: 4, totalValue: 2100, lastVisit: '08/11/2024' },
            { name: 'Carla Oliveira', treatments: 7, totalValue: 1850, lastVisit: '05/11/2024' }
        ];
    },

    /**
     * Gerar insights inteligentes
     */
    generateInsights() {
        return [
            {
                type: 'opportunity',
                icon: '📈',
                title: 'Oportunidade de Crescimento',
                description: 'Taxa de conversão de orçamentos está 12% acima da média. Considere aumentar a capacidade de atendimento.'
            },
            {
                type: 'warning',
                icon: '⚠️',
                title: 'Atenção: Cancelamentos',
                description: 'Aumento de 8% em cancelamentos nas últimas duas semanas. Revisar política de confirmação.'
            },
            {
                type: 'opportunity',
                icon: '💰',
                title: 'Receita em Alta',
                description: 'Faturamento mensal superou a meta em 15%. Tratamentos de maior valor estão em crescimento.'
            },
            {
                type: 'alert',
                icon: '🔴',
                title: 'Inadimplência',
                description: '5 pacientes com pagamentos em atraso há mais de 30 dias. Total de R$ 3.450 pendentes.'
            }
        ];
    },

    /**
     * FUNÇÕES DE INTERAÇÃO
     */
    setPeriod(period) {
        this.currentReport.period = period;
        
        // Mostrar/ocultar seção de período personalizado
        const customSection = document.getElementById('customPeriodSection');
        if (customSection) {
            customSection.style.display = period === 'custom' ? 'grid' : 'none';
        }
        
        // Atualizar botões
        document.querySelectorAll('.period-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        event.target.classList.add('active');
        
        // Recarregar relatório
        this.refreshReport();
    },

    applyCustomPeriod() {
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;
        
        if (!startDate || !endDate) {
            this.showAlert('⚠️ Período Inválido', 'Por favor, selecione as datas de início e fim.');
            return;
        }
        
        this.currentReport.startDate = startDate;
        this.currentReport.endDate = endDate;
        this.refreshReport();
        
        this.showAlert('📅 Período Aplicado', `Relatório atualizado para o período de ${new Date(startDate).toLocaleDateString('pt-BR')} a ${new Date(endDate).toLocaleDateString('pt-BR')}.`);
    },

    selectReport(reportType) {
        this.currentReport.type = reportType;
        
        // Atualizar cards
        document.querySelectorAll('.report-type-card').forEach(card => {
            card.classList.remove('active');
        });
        event.target.closest('.report-type-card').classList.add('active');
        
        // Recarregar conteúdo
        this.refreshReport();
    },

    getCurrentReportTitle() {
        const report = this.reportTypes.find(r => r.id === this.currentReport.type);
        return report ? report.title : 'Dashboard Executivo';
    },

    refreshReport() {
        const contentArea = document.getElementById('reportContentArea');
        if (contentArea) {
            contentArea.innerHTML = this.renderCurrentReport();
            // Recriar gráficos após atualizar o conteúdo
            setTimeout(() => this.createCharts(), 500);
        }
    },

    /**
     * Criar gráficos Chart.js
     */
    createCharts() {
        // Verificar se Chart.js está disponível
        if (typeof Chart === 'undefined') {
            console.warn('Chart.js não disponível para criar gráficos');
            return;
        }

        // Gráfico de Receita Mensal
        const revenueCtx = document.getElementById('revenueChart');
        if (revenueCtx) {
            new Chart(revenueCtx, {
                type: 'line',
                data: {
                    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
                    datasets: [{
                        label: 'Receita',
                        data: [15000, 18000, 22000, 19500, 24000, 26500],
                        borderColor: '#10b981',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        tension: 0.4,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false }
                    },
                    scales: {
                        y: {
                            ticks: { color: '#94a3b8' },
                            grid: { color: 'rgba(148, 163, 184, 0.1)' }
                        },
                        x: {
                            ticks: { color: '#94a3b8' },
                            grid: { color: 'rgba(148, 163, 184, 0.1)' }
                        }
                    }
                }
            });
        }

        // Gráfico de Top Tratamentos
        const treatmentsCtx = document.getElementById('treatmentsChart');
        if (treatmentsCtx) {
            new Chart(treatmentsCtx, {
                type: 'doughnut',
                data: {
                    labels: ['Limpeza', 'Restauração', 'Canal', 'Ortodontia'],
                    datasets: [{
                        data: [45, 32, 18, 12],
                        backgroundColor: ['#3b82f6', '#8b5cf6', '#f59e0b', '#10b981']
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: { color: '#94a3b8', padding: 20 }
                        }
                    }
                }
            });
        }
    },

    /**
     * Funções de exportação
     */
    exportPDF() {
        this.showAlert('📄 Gerando PDF', 'Relatório em PDF será gerado em breve!');
    },

    exportExcel() {
        this.showAlert('📊 Gerando Excel', 'Planilha Excel será gerada em breve!');
    },

    /**
     * Funções auxiliares para dados demo
     */
    generateDemoPatients() {
        return [
            { id: 1, name: 'Maria Silva', email: 'maria@email.com', phone: '(11) 99999-1111' },
            { id: 2, name: 'João Santos', email: 'joao@email.com', phone: '(11) 99999-2222' },
            { id: 3, name: 'Ana Costa', email: 'ana@email.com', phone: '(11) 99999-3333' }
        ];
    },

    generateDemoTreatments() {
        return [
            { id: 1, procedure: 'Limpeza', status: 'concluido', value: 150, date: '2024-11-01' },
            { id: 2, procedure: 'Restauração', status: 'em-andamento', value: 280, date: '2024-11-15' },
            { id: 3, procedure: 'Canal', status: 'agendado', value: 800, date: '2024-12-01' }
        ];
    },

    generateDemoTransactions() {
        return [
            { id: 1, date: '2024-11-01', description: 'Pagamento Limpeza', amount: 150, type: 'pagamento' },
            { id: 2, date: '2024-11-15', description: 'Pagamento Restauração', amount: 140, type: 'pagamento' }
        ];
    },

    generateDemoBudgets() {
        return [
            { id: 1, patient: 'Maria Silva', value: 1200, status: 'aprovado', date: '2024-11-01' },
            { id: 2, patient: 'João Santos', value: 800, status: 'pendente', date: '2024-11-10' }
        ];
    },

    generateDemoAppointments() {
        return [
            { id: 1, patient: 'Maria Silva', date: '2024-11-20', status: 'agendado' },
            { id: 2, patient: 'João Santos', date: '2024-11-21', status: 'confirmado' }
        ];
    },

    loadDemoData() {
        this.consolidatedData = {
            patients: this.generateDemoPatients(),
            treatments: this.generateDemoTreatments(),
            transactions: this.generateDemoTransactions(),
            budgets: this.generateDemoBudgets(),
            appointments: this.generateDemoAppointments(),
            images: []
        };
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
window.RelatoriosPremium = RelatoriosPremium;

// Auto-inicializar quando DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    if (typeof RelatoriosPremium !== 'undefined') {
        RelatoriosPremium.init();
    }
});

console.log('📊 Sistema de Relatórios Executivos Premium carregado!');