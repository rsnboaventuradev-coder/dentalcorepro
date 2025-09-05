// ============================================================================
// DENTALCORE PRO - DASHBOARD PREMIUM PROFISSIONAL CORRIGIDO
// Interface sofisticada com layout mais simétrico e sem sobreposições
// ============================================================================

const DashboardPremium = {
    
    /**
     * Inicializar dashboard premium
     */
    init() {
        console.log('📊 Dashboard Premium carregado');
    },

    /**
     * Renderizar dashboard completo
     */
    renderDashboard() {
        return `
            <div class="dashboard-premium">
                <!-- Agenda do Dia - Seção Superior -->
                ${this.renderAgendaDia()}

                <!-- Grade Principal de Cartões -->
                <div class="dashboard-main-grid">
                    <!-- Gráfico de Conversão - Cartão Central Grande -->
                    ${this.renderGraficoConversao()}

                    <!-- Grade de Cartões Laterais -->
                    <div class="dashboard-side-cards">
                        ${this.renderProximosRetornos()}
                        ${this.renderAniversariantes()}
                        ${this.renderTrabalhosLaboratorio()}
                    </div>

                    <!-- Alertas e Pendências - Painel Vertical -->
                    ${this.renderAlertasPendencias()}
                </div>
            </div>

            <!-- Estilos CSS Profissionais CORRIGIDOS -->
            <style>
                .dashboard-premium {
                    padding: 24px;
                    max-width: 1600px;
                    margin: 0 auto;
                    background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
                    min-height: 100vh;
                    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
                }

                .agenda-dia-header {
                    background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
                    border: 1px solid rgba(71, 85, 105, 0.3);
                    border-radius: 20px;
                    padding: 24px;
                    margin-bottom: 24px;
                    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.4);
                    position: relative;
                    overflow: hidden;
                }

                .agenda-dia-header::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 2px;
                    background: linear-gradient(90deg, transparent, rgba(14, 116, 144, 0.6), transparent);
                }

                .timeline-container {
                    display: flex;
                    gap: 20px;
                    margin-top: 20px;
                    overflow-x: auto;
                    padding: 12px 0;
                    scrollbar-width: thin;
                    scrollbar-color: rgba(14, 116, 144, 0.3) transparent;
                }

                .timeline-container::-webkit-scrollbar {
                    height: 6px;
                }

                .timeline-container::-webkit-scrollbar-track {
                    background: rgba(71, 85, 105, 0.2);
                    border-radius: 3px;
                }

                .timeline-container::-webkit-scrollbar-thumb {
                    background: rgba(14, 116, 144, 0.5);
                    border-radius: 3px;
                }

                .timeline-item {
                    background: rgba(14, 116, 144, 0.1);
                    border: 1px solid rgba(14, 116, 144, 0.3);
                    border-radius: 12px;
                    padding: 16px 20px;
                    min-width: 200px;
                    position: relative;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    cursor: pointer;
                }

                .timeline-item:hover {
                    background: rgba(14, 116, 144, 0.2);
                    transform: translateY(-2px);
                    box-shadow: 0 8px 25px rgba(14, 116, 144, 0.2);
                }

                .timeline-item::before {
                    content: '';
                    position: absolute;
                    left: 0;
                    top: 0;
                    bottom: 0;
                    width: 4px;
                    background: linear-gradient(135deg, #0e7490 0%, #0d9488 100%);
                    border-radius: 2px;
                }

                /* LAYOUT MAIS SIMÉTRICO */
                .dashboard-main-grid {
                    display: grid;
                    grid-template-columns: 1.8fr 1fr 1fr;
                    gap: 20px;
                    align-items: start;
                    max-width: 100%;
                }

                @media (max-width: 1400px) {
                    .dashboard-main-grid {
                        grid-template-columns: 1.5fr 1fr;
                        gap: 18px;
                    }
                }

                @media (max-width: 1200px) {
                    .dashboard-main-grid {
                        grid-template-columns: 1fr 1fr;
                        gap: 16px;
                    }
                }

                @media (max-width: 1024px) {
                    .dashboard-main-grid {
                        grid-template-columns: 1fr;
                        gap: 20px;
                    }
                    
                    .dashboard-premium {
                        padding: 16px;
                    }
                }

                .dashboard-card {
                    background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
                    border: 1px solid rgba(71, 85, 105, 0.3);
                    border-radius: 16px;
                    padding: 24px;
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
                    position: relative;
                    overflow: hidden;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    height: fit-content;
                }

                .dashboard-card:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
                }

                .dashboard-card::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 1px;
                    background: linear-gradient(90deg, transparent, rgba(14, 116, 144, 0.4), transparent);
                }

                /* FUNIL DE CONVERSÃO CORRIGIDO */
                .conversion-chart {
                    background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
                    border: 2px solid rgba(14, 116, 144, 0.2);
                    border-radius: 20px;
                    padding: 24px;
                    position: relative;
                    overflow: hidden;
                    min-height: 580px;
                }

                .conversion-chart::after {
                    content: '';
                    position: absolute;
                    top: 0;
                    right: 0;
                    bottom: 0;
                    width: 2px;
                    background: linear-gradient(180deg, transparent, rgba(14, 116, 144, 0.4), transparent);
                }

                .funnel-stage {
                    background: linear-gradient(135deg, rgba(14, 116, 144, 0.1) 0%, rgba(13, 148, 136, 0.1) 100%);
                    border: 1px solid rgba(14, 116, 144, 0.3);
                    border-radius: 12px;
                    padding: 18px;
                    margin: 14px 0;
                    position: relative;
                    transition: all 0.3s ease;
                    cursor: pointer;
                    min-height: 70px;
                    display: flex;
                    align-items: center;
                }

                .funnel-stage:hover {
                    background: linear-gradient(135deg, rgba(14, 116, 144, 0.2) 0%, rgba(13, 148, 136, 0.2) 100%);
                    transform: translateX(6px);
                    box-shadow: 0 6px 20px rgba(14, 116, 144, 0.1);
                }

                /* CARTÕES LATERAIS MAIS EQUILIBRADOS */
                .dashboard-side-cards {
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                    height: fit-content;
                }

                .side-card {
                    background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
                    border: 1px solid rgba(71, 85, 105, 0.3);
                    border-radius: 16px;
                    padding: 20px;
                    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
                    transition: all 0.3s ease;
                    position: relative;
                    overflow: hidden;
                    min-height: 140px;
                }

                .side-card::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 1px;
                    background: linear-gradient(90deg, transparent, rgba(14, 116, 144, 0.3), transparent);
                }

                .side-card:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 18px 40px rgba(0, 0, 0, 0.4);
                }

                /* PAINEL DE ALERTAS MAIS EQUILIBRADO */
                .alerts-panel {
                    background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
                    border: 1px solid rgba(71, 85, 105, 0.3);
                    border-radius: 16px;
                    padding: 20px;
                    height: fit-content;
                    max-height: 580px;
                    overflow-y: auto;
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
                    position: relative;
                }

                .alerts-panel::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 2px;
                    background: linear-gradient(90deg, transparent, rgba(239, 68, 68, 0.4), transparent);
                }

                .alert-item {
                    background: rgba(239, 68, 68, 0.1);
                    border: 1px solid rgba(239, 68, 68, 0.3);
                    border-radius: 8px;
                    padding: 12px;
                    margin-bottom: 10px;
                    position: relative;
                    transition: all 0.3s ease;
                    cursor: pointer;
                }

                .alert-item::before {
                    content: '';
                    position: absolute;
                    left: 0;
                    top: 0;
                    bottom: 0;
                    width: 3px;
                    background: #ef4444;
                    border-radius: 2px;
                }

                .alert-item:hover {
                    background: rgba(239, 68, 68, 0.15);
                    transform: translateX(3px);
                }

                .alert-item.warning {
                    background: rgba(245, 158, 11, 0.1);
                    border-color: rgba(245, 158, 11, 0.3);
                }

                .alert-item.warning::before {
                    background: #f59e0b;
                }

                .alert-item.info {
                    background: rgba(59, 130, 246, 0.1);
                    border-color: rgba(59, 130, 246, 0.3);
                }

                .alert-item.info::before {
                    background: #3b82f6;
                }

                .alert-item.success {
                    background: rgba(16, 185, 129, 0.1);
                    border-color: rgba(16, 185, 129, 0.3);
                }

                .alert-item.success::before {
                    background: #10b981;
                }

                .patient-item {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 12px;
                    background: rgba(30, 41, 59, 0.6);
                    border: 1px solid rgba(148, 163, 184, 0.2);
                    border-radius: 10px;
                    margin-bottom: 8px;
                    transition: all 0.3s ease;
                    cursor: pointer;
                    position: relative;
                    overflow: hidden;
                }

                .patient-item::before {
                    content: '';
                    position: absolute;
                    left: 0;
                    top: 0;
                    bottom: 0;
                    width: 0;
                    background: linear-gradient(135deg, #0e7490 0%, #0d9488 100%);
                    transition: width 0.3s ease;
                }

                .patient-item:hover {
                    background: rgba(30, 41, 59, 0.8);
                    border-color: rgba(14, 116, 144, 0.4);
                    transform: translateX(3px);
                }

                .patient-item:hover::before {
                    width: 3px;
                }

                .lab-work-item {
                    background: rgba(30, 41, 59, 0.6);
                    border: 1px solid rgba(148, 163, 184, 0.2);
                    border-radius: 10px;
                    padding: 12px;
                    margin-bottom: 8px;
                    position: relative;
                    transition: all 0.3s ease;
                    cursor: pointer;
                }

                .lab-work-item::before {
                    content: '';
                    position: absolute;
                    left: 0;
                    top: 0;
                    bottom: 0;
                    width: 3px;
                    background: #64748b;
                    border-radius: 2px;
                }

                .lab-work-item.overdue {
                    border-color: rgba(239, 68, 68, 0.5);
                    background: rgba(239, 68, 68, 0.1);
                }

                .lab-work-item.overdue::before {
                    background: #ef4444;
                }

                .lab-work-item.due-soon {
                    border-color: rgba(245, 158, 11, 0.5);
                    background: rgba(245, 158, 11, 0.1);
                }

                .lab-work-item.due-soon::before {
                    background: #f59e0b;
                }

                .lab-work-item:hover {
                    background: rgba(30, 41, 59, 0.8);
                    transform: translateX(3px);
                }

                .dashboard-text-primary {
                    color: #f1f5f9;
                    font-weight: 600;
                }

                .dashboard-text-secondary {
                    color: #94a3b8;
                    font-weight: 400;
                }

                .dashboard-text-muted {
                    color: #64748b;
                    font-weight: 400;
                }

                .dashboard-metric {
                    font-size: 2.2rem;
                    font-weight: 300;
                    color: #0d9488;
                    margin-bottom: 6px;
                    line-height: 1;
                }

                .percentage-bar {
                    background: rgba(71, 85, 105, 0.3);
                    border-radius: 6px;
                    height: 6px;
                    overflow: hidden;
                    margin: 12px 0 0 0;
                }

                .percentage-fill {
                    height: 100%;
                    background: linear-gradient(90deg, #0e7490, #0d9488);
                    border-radius: 6px;
                    transition: width 1s ease-in-out;
                    position: relative;
                }

                .percentage-fill::after {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
                    animation: shimmer 2s infinite;
                }

                @keyframes shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }

                .card-icon {
                    width: 40px;
                    height: 40px;
                    background: linear-gradient(135deg, rgba(14, 116, 144, 0.2) 0%, rgba(13, 148, 136, 0.2) 100%);
                    border: 1px solid rgba(14, 116, 144, 0.3);
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 18px;
                    margin-bottom: 12px;
                }

                .status-badge {
                    display: inline-block;
                    padding: 3px 10px;
                    border-radius: 16px;
                    font-size: 10px;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.4px;
                }

                .status-badge.urgent {
                    background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
                    color: #fee2e2;
                }

                .status-badge.warning {
                    background: linear-gradient(135deg, #d97706 0%, #b45309 100%);
                    color: #fed7aa;
                }

                .status-badge.normal {
                    background: linear-gradient(135deg, #059669 0%, #047857 100%);
                    color: #d1fae5;
                }

                .status-badge.info {
                    background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
                    color: #dbeafe;
                }
            </style>
        `;
    },

    /**
     * Renderizar Agenda do Dia
     */
    renderAgendaDia() {
        const hoje = new Date();
        const diasSemana = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
        const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
        
        return `
            <div class="agenda-dia-header">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px;">
                    <div>
                        <h1 style="font-size: 28px; font-weight: 300; color: #f1f5f9; margin: 0 0 6px 0;">
                            📅 Agenda do Dia
                        </h1>
                        <p style="color: #94a3b8; font-size: 15px; margin: 0;">
                            ${diasSemana[hoje.getDay()]}, ${hoje.getDate()} de ${meses[hoje.getMonth()]} de ${hoje.getFullYear()}
                        </p>
                    </div>
                    <div style="text-align: right;">
                        <div style="font-size: 24px; font-weight: 300; color: #0d9488; margin-bottom: 3px;">
                            ${hoje.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        <div style="color: #64748b; font-size: 13px;">Horário atual</div>
                    </div>
                </div>

                <div class="timeline-container">
                    ${this.renderTimelineItems()}
                </div>
            </div>
        `;
    },

    /**
     * Renderizar itens da timeline
     */
    renderTimelineItems() {
        const compromissos = [
            { hora: '09:00', paciente: 'Maria Silva Santos', tipo: 'Consulta', status: 'confirmado' },
            { hora: '10:30', paciente: 'João Pedro Oliveira', tipo: 'Limpeza', status: 'confirmado' },
            { hora: '14:00', paciente: 'Ana Costa Lima', tipo: 'Avaliação', status: 'pendente' },
            { hora: '15:30', paciente: 'Carlos Eduardo', tipo: 'Retorno', status: 'confirmado' },
            { hora: '16:45', paciente: 'Fernanda Souza', tipo: 'Ortodontia', status: 'confirmado' }
        ];

        return compromissos.map(item => `
            <div class="timeline-item" onclick="DashboardPremium.viewAppointment('${item.paciente}')">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
                    <div style="font-weight: 600; color: #0d9488; font-size: 15px;">${item.hora}</div>
                    <span class="status-badge ${item.status === 'confirmado' ? 'normal' : 'warning'}">
                        ${item.status === 'confirmado' ? 'Confirmado' : 'Pendente'}
                    </span>
                </div>
                <div style="font-weight: 600; color: #f1f5f9; margin-bottom: 3px; font-size: 14px;">
                    ${item.paciente}
                </div>
                <div style="color: #94a3b8; font-size: 13px;">
                    ${item.tipo}
                </div>
            </div>
        `).join('');
    },

    /**
     * Renderizar Gráfico de Conversão CORRIGIDO
     */
    renderGraficoConversao() {
        return `
            <div class="conversion-chart">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px;">
                    <div>
                        <h2 style="font-size: 22px; font-weight: 600; color: #f1f5f9; margin: 0 0 6px 0;">
                            📊 Funil de Conversão
                        </h2>
                        <p style="color: #94a3b8; margin: 0; font-size: 14px;">
                            Taxa de conversão de avaliações para tratamentos ativos
                        </p>
                    </div>
                    <div style="text-align: right;">
                        <div style="font-size: 28px; font-weight: 300; color: #0d9488;">78%</div>
                        <div style="color: #64748b; font-size: 13px;">Taxa geral</div>
                    </div>
                </div>

                <!-- CONTAINER DO FUNIL COM ESPAÇAMENTO ADEQUADO -->
                <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 24px;">
                    ${this.renderFunnelStages()}
                </div>

                <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid rgba(71, 85, 105, 0.3);">
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; text-align: center;">
                        <div>
                            <div style="font-size: 18px; font-weight: 600; color: #0d9488;">156</div>
                            <div style="color: #94a3b8; font-size: 13px;">Avaliações este mês</div>
                        </div>
                        <div>
                            <div style="font-size: 18px; font-weight: 600; color: #0d9488;">122</div>
                            <div style="color: #94a3b8; font-size: 13px;">Tratamentos iniciados</div>
                        </div>
                        <div>
                            <div style="font-size: 18px; font-weight: 600; color: #0d9488;">34</div>
                            <div style="color: #94a3b8; font-size: 13px;">Em andamento</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * Renderizar estágios do funil CORRIGIDO
     */
    renderFunnelStages() {
        const stages = [
            { label: 'Primeiras Consultas', value: 156, percentage: 100, icon: '👥' },
            { label: 'Avaliações Completas', value: 142, percentage: 91, icon: '📋' },
            { label: 'Orçamentos Apresentados', value: 135, percentage: 87, icon: '💰' },
            { label: 'Propostas Aceitas', value: 122, percentage: 78, icon: '✅' },
            { label: 'Tratamentos Iniciados', value: 118, percentage: 76, icon: '🦷' }
        ];

        return stages.map((stage, index) => `
            <div class="funnel-stage" onclick="DashboardPremium.viewStageDetails('${stage.label}')" style="margin-left: ${index * 15}px; margin-right: ${index * 15}px;">
                <div style="width: 100%;">
                    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
                        <div style="display: flex; align-items: center;">
                            <div style="font-size: 20px; margin-right: 12px;">${stage.icon}</div>
                            <div>
                                <div style="font-weight: 600; color: #f1f5f9; margin-bottom: 3px; font-size: 14px;">
                                    ${stage.label}
                                </div>
                                <div style="color: #94a3b8; font-size: 13px;">
                                    ${stage.value} pacientes
                                </div>
                            </div>
                        </div>
                        <div style="text-align: right;">
                            <div style="font-size: 20px; font-weight: 600; color: #0d9488;">
                                ${stage.percentage}%
                            </div>
                        </div>
                    </div>
                    <div class="percentage-bar">
                        <div class="percentage-fill" style="width: ${stage.percentage}%;"></div>
                    </div>
                </div>
            </div>
        `).join('');
    },

    /**
     * Renderizar Próximos Retornos
     */
    renderProximosRetornos() {
        return `
            <div class="side-card">
                <div style="display: flex; align-items: center; margin-bottom: 16px;">
                    <div class="card-icon">🔄</div>
                    <div style="margin-left: 12px;">
                        <h3 style="font-size: 16px; font-weight: 600; color: #f1f5f9; margin: 0;">
                            Próximos Retornos
                        </h3>
                        <p style="color: #94a3b8; font-size: 13px; margin: 2px 0 0 0;">
                            Pacientes para reengajamento
                        </p>
                    </div>
                </div>

                <div style="max-height: 200px; overflow-y: auto;">
                    ${this.renderRetornos()}
                </div>

                <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid rgba(71, 85, 105, 0.3); text-align: center;">
                    <button onclick="DashboardPremium.viewAllReturns()" style="
                        background: linear-gradient(135deg, #0e7490 0%, #0d9488 100%);
                        border: none;
                        border-radius: 6px;
                        color: white;
                        padding: 6px 14px;
                        font-size: 13px;
                        font-weight: 600;
                        cursor: pointer;
                        transition: all 0.3s ease;
                    ">
                        Ver Todos (12)
                    </button>
                </div>
            </div>
        `;
    },

    /**
     * Renderizar lista de retornos
     */
    renderRetornos() {
        const retornos = [
            { nome: 'Patricia Alves', dias: 3, tipo: 'Limpeza semestral' },
            { nome: 'Roberto Santos', dias: 5, tipo: 'Controle ortodôntico' },
            { nome: 'Claudia Ferreira', dias: 7, tipo: 'Avaliação pós-cirurgia' }
        ];

        return retornos.map(item => `
            <div class="patient-item" onclick="DashboardPremium.contactPatient('${item.nome}')">
                <div>
                    <div style="font-weight: 600; color: #f1f5f9; margin-bottom: 2px; font-size: 13px;">
                        ${item.nome}
                    </div>
                    <div style="color: #94a3b8; font-size: 12px;">
                        ${item.tipo}
                    </div>
                </div>
                <div style="text-align: right;">
                    <span class="status-badge ${item.dias <= 5 ? 'urgent' : 'warning'}">
                        ${item.dias} dias
                    </span>
                </div>
            </div>
        `).join('');
    },

    /**
     * Renderizar Aniversariantes da Semana
     */
    renderAniversariantes() {
        return `
            <div class="side-card">
                <div style="display: flex; align-items: center; margin-bottom: 16px;">
                    <div class="card-icon">🎂</div>
                    <div style="margin-left: 12px;">
                        <h3 style="font-size: 16px; font-weight: 600; color: #f1f5f9; margin: 0;">
                            Aniversariantes
                        </h3>
                        <p style="color: #94a3b8; font-size: 13px; margin: 2px 0 0 0;">
                            Esta semana
                        </p>
                    </div>
                </div>

                <div>
                    ${this.renderAniversariantesLista()}
                </div>

                <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid rgba(71, 85, 105, 0.3); text-align: center;">
                    <button onclick="DashboardPremium.sendBirthdayMessages()" style="
                        background: linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%);
                        border: none;
                        border-radius: 6px;
                        color: white;
                        padding: 6px 14px;
                        font-size: 13px;
                        font-weight: 600;
                        cursor: pointer;
                        transition: all 0.3s ease;
                    ">
                        Enviar Parabéns
                    </button>
                </div>
            </div>
        `;
    },

    /**
     * Renderizar lista de aniversariantes
     */
    renderAniversariantesLista() {
        const aniversariantes = [
            { nome: 'Isabella Costa', data: 'Hoje', idade: 28 },
            { nome: 'Gabriel Rocha', data: 'Amanhã', idade: 35 },
            { nome: 'Luciana Martins', data: 'Quinta', idade: 42 }
        ];

        return aniversariantes.map(item => `
            <div class="patient-item" onclick="DashboardPremium.sendBirthdayMessage('${item.nome}')">
                <div>
                    <div style="font-weight: 600; color: #f1f5f9; margin-bottom: 2px; font-size: 13px;">
                        ${item.nome}
                    </div>
                    <div style="color: #94a3b8; font-size: 12px;">
                        ${item.idade} anos
                    </div>
                </div>
                <div style="text-align: right;">
                    <span class="status-badge ${item.data === 'Hoje' ? 'urgent' : 'info'}">
                        ${item.data}
                    </span>
                </div>
            </div>
        `).join('');
    },

    /**
     * Renderizar Trabalhos de Laboratório
     */
    renderTrabalhosLaboratorio() {
    return `
        <div class="side-card">
            <div style="display: flex; align-items: center; margin-bottom: 16px;">
                <div class="card-icon">🔬</div>
                <div style="margin-left: 12px;">
                    <h3 style="font-size: 16px; font-weight: 600; color: #f1f5f9; margin: 0;">
                        Trabalhos Lab
                    </h3>
                    <p style="color: #94a3b8; font-size: 13px; margin: 2px 0 0 0;">
                        Pendências e vencimentos
                    </p>
                </div>
            </div>

            <div style="max-height: 180px; overflow-y: auto;">
                ${this.renderTrabalhosLab()}
            </div>

            <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid rgba(71, 85, 105, 0.3); text-align: center;">
                <button onclick="DashboardPremium.contactLab()" style="
                    background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
                    border: none;
                    border-radius: 6px;
                    color: white;
                    padding: 6px 14px;
                    font-size: 13px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                ">
                    Contatar Lab
                </button>
            </div>
        </div>
    `;
},

    /**
     * Renderizar trabalhos de laboratório
     */
    renderTrabalhosLab() {
        const trabalhos = [
            { paciente: 'Ana Beatriz', tipo: 'Prótese Total', prazo: 'Atrasado 2 dias', status: 'overdue' },
            { paciente: 'Marcos Vinícius', tipo: 'Coroa Cerâmica', prazo: 'Vence hoje', status: 'due-soon' },
            { paciente: 'Beatriz Campos', tipo: 'Aparelho Ortodôntico', prazo: 'Vence amanhã', status: 'due-soon' }
        ];

        return trabalhos.map(item => `
            <div class="lab-work-item ${item.status}" onclick="DashboardPremium.viewLabWork('${item.paciente}')">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 6px;">
                    <div style="font-weight: 600; color: #f1f5f9; font-size: 13px;">
                        ${item.paciente}
                    </div>
                    <span class="status-badge ${item.status === 'overdue' ? 'urgent' : item.status === 'due-soon' ? 'warning' : 'normal'}">
                        ${item.status === 'overdue' ? 'Atrasado' : item.status === 'due-soon' ? 'Urgente' : 'Normal'}
                    </span>
                </div>
                <div style="color: #94a3b8; font-size: 12px; margin-bottom: 3px;">
                    ${item.tipo}
                </div>
                <div style="color: ${item.status === 'overdue' ? '#fca5a5' : item.status === 'due-soon' ? '#fed7aa' : '#94a3b8'}; font-size: 11px;">
                    ${item.prazo}
                </div>
            </div>
        `).join('');
    },

    /**
     * Renderizar Alertas e Pendências
     */
    renderAlertasPendencias() {
        return `
            <div class="alerts-panel">
                <div style="margin-bottom: 20px;">
                    <h2 style="font-size: 18px; font-weight: 600; color: #f1f5f9; margin: 0 0 6px 0;">
                        🚨 Alertas & Pendências
                    </h2>
                    <p style="color: #94a3b8; margin: 0; font-size: 13px;">
                        Tarefas importantes e comunicação interna
                    </p>
                </div>

                <!-- Tarefas Pendentes -->
                <div style="margin-bottom: 20px;">
                    <h3 style="font-size: 15px; font-weight: 600; color: #f1f5f9; margin: 0 0 12px 0;">
                        📋 Tarefas Pendentes
                    </h3>
                    ${this.renderTarefasPendentes()}
                </div>

                <!-- Mensagens Internas -->
                <div>
                    <h3 style="font-size: 15px; font-weight: 600; color: #f1f5f9; margin: 0 0 12px 0;">
                        💬 Mensagens da Equipe
                    </h3>
                    ${this.renderMensagensInternas()}
                    
                    <div style="margin-top: 12px;">
                        <textarea placeholder="Nova mensagem para a equipe..." style="
                            width: 100%;
                            background: rgba(30, 41, 59, 0.6);
                            border: 1px solid rgba(148, 163, 184, 0.2);
                            border-radius: 6px;
                            color: #f1f5f9;
                            padding: 10px;
                            font-size: 13px;
                            resize: vertical;
                            min-height: 50px;
                        "></textarea>
                        <button onclick="DashboardPremium.sendMessage()" style="
                            background: linear-gradient(135deg, #0e7490 0%, #0d9488 100%);
                            border: none;
                            border-radius: 6px;
                            color: white;
                            padding: 6px 12px;
                            font-size: 13px;
                            font-weight: 600;
                            cursor: pointer;
                            margin-top: 6px;
                            transition: all 0.3s ease;
                        ">
                            Enviar
                        </button>
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * Renderizar tarefas pendentes
     */
    renderTarefasPendentes() {
        const tarefas = [
            { texto: 'Agendar retorno da paciente Maria Silva', tipo: 'urgent', prioridade: 'Alta' },
            { texto: 'Confirmar consulta de João Pedro para amanhã', tipo: 'warning', prioridade: 'Média' },
            { texto: 'Enviar orçamento para Ana Costa', tipo: 'info', prioridade: 'Normal' },
            { texto: 'Verificar pagamento pendente - Carlos Eduardo', tipo: 'warning', prioridade: 'Média' }
        ];

        return tarefas.map(item => `
            <div class="alert-item ${item.tipo}" onclick="DashboardPremium.completeTask('${item.texto}')">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                    <span style="font-weight: 600; color: #f1f5f9; font-size: 13px;">Tarefa Pendente</span>
                    <span class="status-badge ${item.tipo}">
                        ${item.prioridade}
                    </span>
                </div>
                <div style="color: #e2e8f0; font-size: 12px; line-height: 1.4;">
                    ${item.texto}
                </div>
            </div>
        `).join('');
    },

    /**
     * Renderizar mensagens internas
     */
    renderMensagensInternas() {
        const mensagens = [
            { autor: 'Dra. Carolina', tempo: '10 min', texto: 'Lembrar de verificar alergia do paciente das 14h', tipo: 'warning' },
            { autor: 'Auxiliar Maria', tempo: '25 min', texto: 'Material para ortodontia chegou hoje', tipo: 'success' },
            { autor: 'Recepção', tempo: '1h', texto: 'Paciente cancelou consulta das 16h', tipo: 'info' }
        ];

        return mensagens.map(item => `
            <div class="alert-item ${item.tipo}">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                    <span style="font-weight: 600; color: #f1f5f9; font-size: 13px;">${item.autor}</span>
                    <span style="color: #94a3b8; font-size: 11px;">${item.tempo}</span>
                </div>
                <div style="color: #e2e8f0; font-size: 12px; line-height: 1.4;">
                    ${item.texto}
                </div>
            </div>
        `).join('');
    },

    // ========================================================================
    // FUNÇÕES INTERATIVAS (permanecem iguais)
    // ========================================================================

    viewAppointment(paciente) {
        if (typeof UI !== 'undefined') {
            UI.showAlert('📅 Compromisso', `Paciente: ${paciente}\n\nOpções:\n• Ver prontuário\n• Confirmar presença\n• Reagendar\n• Adicionar observações`);
        } else {
            alert(`📅 Compromisso: ${paciente}`);
        }
    },

    viewStageDetails(stage) {
        if (typeof UI !== 'undefined') {
            UI.showAlert('📊 Detalhes do Funil', `${stage}\n\nDetalhes:\n• Lista de pacientes neste estágio\n• Estatísticas detalhadas\n• Ações recomendadas\n• Histórico de conversão`);
        } else {
            alert(`📊 Detalhes: ${stage}`);
        }
    },

    viewAllReturns() {
        if (typeof UI !== 'undefined') {
            UI.showAlert('🔄 Próximos Retornos', 'Total: 12 pacientes\n\nAções disponíveis:\n• Contatar via WhatsApp\n• Agendar automaticamente\n• Enviar lembrete por email\n• Exportar lista');
        } else {
            alert('🔄 Ver todos os retornos');
        }
    },

    contactPatient(nome) {
        if (typeof UI !== 'undefined') {
            UI.showAlert('📞 Contatar Paciente', `${nome}\n\nOpções:\n• Ligar agora\n• Enviar WhatsApp\n• Email automático\n• Agendar ligação`);
        } else {
            alert(`📞 Contatar: ${nome}`);
        }
    },

    sendBirthdayMessage(nome) {
        if (typeof UI !== 'undefined') {
            UI.showAlert('🎂 Parabéns!', `Enviando mensagem de aniversário para ${nome}\n\n✅ WhatsApp enviado\n✅ Email programado\n📱 Lembrete criado`);
        } else {
            alert(`🎂 Parabéns enviado para: ${nome}`);
        }
    },

    sendBirthdayMessages() {
        if (typeof UI !== 'undefined') {
            UI.showAlert('🎂 Mensagens de Aniversário', '✅ 4 mensagens enviadas\n📱 Contatos notificados\n📊 Relatório gerado');
        } else {
            alert('🎂 Mensagens de aniversário enviadas!');
        }
    },

    contactLab() {
        if (typeof UI !== 'undefined') {
            UI.showAlert('🔬 Contatar Laboratório', 'Opções:\n• Ligar para laboratório\n• Email com pendências\n• WhatsApp Business\n• Agendar visita');
        } else {
            alert('🔬 Contatar laboratório');
        }
    },

    viewLabWork(paciente) {
        if (typeof UI !== 'undefined') {
            UI.showAlert('🔬 Trabalho de Laboratório', `Paciente: ${paciente}\n\nDetalhes:\n• Status atual\n• Prazo de entrega\n• Contato do lab\n• Histórico`);
        } else {
            alert(`🔬 Trabalho de lab: ${paciente}`);
        }
    },

    completeTask(tarefa) {
        if (typeof UI !== 'undefined') {
            UI.showAlert('✅ Tarefa Completada', `"${tarefa}"\n\n• Marcada como concluída\n• Notificação enviada\n• Relatório atualizado`);
        } else {
            alert(`✅ Tarefa: ${tarefa}`);
        }
    },

    sendMessage() {
        const textarea = document.querySelector('textarea');
        if (textarea && textarea.value.trim()) {
            if (typeof UI !== 'undefined') {
                UI.showAlert('💬 Mensagem Enviada', `"${textarea.value}"\n\n✅ Equipe notificada\n📱 Push notification enviado`);
            } else {
                alert('💬 Mensagem enviada para a equipe!');
            }
            textarea.value = '';
        }
    }
};

// Integração com sistema principal
if (typeof window.DentalCore !== 'undefined') {
    const originalRenderDashboard = window.DentalCore.renderDashboard;
    window.DentalCore.renderDashboard = function() {
        return DashboardPremium.renderDashboard();
    };
    
    console.log('✅ Dashboard Premium integrado ao DentalCore');
}

// Exportar para uso global
window.DashboardPremium = DashboardPremium;

// Inicializar
document.addEventListener('DOMContentLoaded', function() {
    if (typeof DashboardPremium !== 'undefined') {
        DashboardPremium.init();
    }
});

console.log('📊 Dashboard Premium carregado com layout simétrico e sem sobreposições!');