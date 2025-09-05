// ============================================================================
// DENTALCORE PRO - MÓDULO DE AGENDA PROFISSIONAL ATUALIZADO
// Painel de agendamento dinâmico e inteligente com visualizações completas
// Integrado com sistema DentalCore Pro v2.0.0
// ============================================================================

const AgendaProfissional = {
    // Estado atual do sistema de agenda
    currentSchedule: {
        currentDate: new Date(),
        viewMode: 'daily', // daily, weekly, monthly
        workingHours: { start: 8, end: 18 },
        appointments: [],
        blockedSlots: [],
        googleSyncEnabled: true,
        remindersEnabled: true
    },

    // Base de dados de consultas
    appointments: [
        {
            id: 1,
            patientId: 1,
            patientName: 'Maria Silva Santos',
            patientPhone: '(11) 99999-1234',
            procedure: 'Limpeza e Profilaxia',
            date: '2024-01-22',
            startTime: '09:00',
            endTime: '09:30',
            duration: 30,
            status: 'agendado',
            notes: 'Paciente relata sensibilidade',
            reminderSent: false
        },
        {
            id: 2,
            patientId: 2,
            patientName: 'João Pedro Costa',
            patientPhone: '(11) 99999-5678',
            procedure: 'Tratamento Endodôntico',
            date: '2024-01-22',
            startTime: '10:00',
            endTime: '11:30',
            duration: 90,
            status: 'confirmado',
            notes: 'Segunda sessão do canal',
            reminderSent: true
        },
        {
            id: 3,
            patientId: 3,
            patientName: 'Ana Carolina Lima',
            patientPhone: '(11) 99999-9012',
            procedure: 'Clareamento Dental',
            date: '2024-01-22',
            startTime: '14:00',
            endTime: '15:30',
            duration: 90,
            status: 'agendado',
            notes: 'Primeira sessão de clareamento',
            reminderSent: false
        },
        {
            id: 4,
            patientId: 4,
            patientName: 'Carlos Eduardo Silva',
            patientPhone: '(11) 99999-3456',
            procedure: 'Consulta de Avaliação',
            date: '2024-01-23',
            startTime: '09:30',
            endTime: '10:00',
            duration: 30,
            status: 'agendado',
            notes: 'Primeira consulta',
            reminderSent: false
        },
        {
            id: 5,
            patientId: 5,
            patientName: 'Fernanda Oliveira',
            patientPhone: '(11) 99999-7890',
            procedure: 'Restauração em Resina',
            date: '2024-01-24',
            startTime: '15:00',
            endTime: '16:00',
            duration: 60,
            status: 'confirmado',
            notes: 'Restauração molar superior',
            reminderSent: true
        }
    ],

    // Procedimentos com durações padrão
    procedures: [
        { id: 1, name: 'Limpeza e Profilaxia', duration: 30, color: '#10b981' },
        { id: 2, name: 'Restauração em Resina', duration: 60, color: '#3b82f6' },
        { id: 3, name: 'Tratamento Endodôntico', duration: 90, color: '#ef4444' },
        { id: 4, name: 'Clareamento Dental', duration: 90, color: '#8b5cf6' },
        { id: 5, name: 'Extração Dentária', duration: 45, color: '#f59e0b' },
        { id: 6, name: 'Consulta de Avaliação', duration: 30, color: '#06b6d4' },
        { id: 7, name: 'Implante Dentário', duration: 120, color: '#ec4899' },
        { id: 8, name: 'Manutenção Ortodôntica', duration: 30, color: '#84cc16' }
    ],

    // Pacientes para seleção rápida
    patients: [
        { id: 1, name: 'Maria Silva Santos', phone: '(11) 99999-1234', email: 'maria@email.com' },
        { id: 2, name: 'João Pedro Costa', phone: '(11) 99999-5678', email: 'joao@email.com' },
        { id: 3, name: 'Ana Carolina Lima', phone: '(11) 99999-9012', email: 'ana@email.com' },
        { id: 4, name: 'Carlos Eduardo Silva', phone: '(11) 99999-3456', email: 'carlos@email.com' },
        { id: 5, name: 'Fernanda Oliveira', phone: '(11) 99999-7890', email: 'fernanda@email.com' }
    ],

    // Status de consultas
    statusConfig: {
        'agendado': { label: 'Agendado', color: '#3b82f6', bgColor: 'rgba(59, 130, 246, 0.1)', icon: '📅' },
        'confirmado': { label: 'Confirmado', color: '#10b981', bgColor: 'rgba(16, 185, 129, 0.1)', icon: '✅' },
        'em-andamento': { label: 'Em Andamento', color: '#f59e0b', bgColor: 'rgba(245, 158, 11, 0.1)', icon: '⏳' },
        'concluido': { label: 'Concluído', color: '#10b981', bgColor: 'rgba(16, 185, 129, 0.1)', icon: '✅' },
        'cancelado': { label: 'Cancelado', color: '#ef4444', bgColor: 'rgba(239, 68, 68, 0.1)', icon: '❌' },
        'ausente': { label: 'Paciente Ausente', color: '#dc2626', bgColor: 'rgba(220, 38, 38, 0.1)', icon: '⚠️' }
    },

    selectedAppointment: null,

    /**
     * Inicialização do módulo
     */
    init() {
        console.log('📅 Módulo Agenda Profissional inicializado');
        this.loadAppointments();
        this.setupGoogleSync();
        this.loadPatientsFromSystem();
    },

    /**
     * Carregar consultas
     */
    loadAppointments() {
        this.currentSchedule.appointments = [...this.appointments];
        console.log('📋 Consultas carregadas');
    },

    /**
     * Carregar pacientes do sistema principal
     */
    loadPatientsFromSystem() {
        if (typeof DataPersistence !== 'undefined') {
            const systemPatients = DataPersistence.getPatients() || [];
            if (systemPatients.length > 0) {
                this.patients = systemPatients.map(p => ({
                    id: p.id,
                    name: p.name,
                    phone: p.phone || 'Não informado',
                    email: p.email || 'Não informado'
                }));
                console.log('👥 Pacientes sincronizados com o sistema:', this.patients.length);
            }
        }
    },

    /**
     * Configurar sincronização Google
     */
    setupGoogleSync() {
        console.log('🔄 Sincronização Google Agenda configurada');
    },

    /**
     * Interface principal da aba Agenda
     */
    renderProfessionalInterface() {
        // Carregar pacientes do sistema ao renderizar
        this.loadPatientsFromSystem();
        
        return `
            <style>
                /* [TODO O CSS EXISTENTE PERMANECE IGUAL] */
                .agenda-workspace {
                    background: linear-gradient(135deg, #1e3a8a 0%, #374151 100%);
                    min-height: 100vh;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', sans-serif;
                    color: #f8fafc;
                    padding: 0;
                    margin: 0;
                }

                .agenda-header {
                    background: rgba(255, 255, 255, 0.05);
                    backdrop-filter: blur(20px);
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                    padding: 24px 40px;
                    position: sticky;
                    top: 0;
                    z-index: 100;
                }

                .header-content {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .header-title-section {
                    text-align: left;
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

                .header-actions {
                    display: flex;
                    gap: 12px;
                }

                .new-appointment-btn {
                    background: linear-gradient(135deg, #0d9488 0%, #14b8a6 100%);
                    border: none;
                    border-radius: 8px;
                    color: white;
                    padding: 12px 24px;
                    font-weight: 600;
                    font-size: 14px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    box-shadow: 0 4px 12px rgba(13, 148, 136, 0.3);
                }

                .new-appointment-btn:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 6px 20px rgba(13, 148, 136, 0.4);
                }

                .sync-status {
                    background: rgba(16, 185, 129, 0.1);
                    border: 1px solid rgba(16, 185, 129, 0.3);
                    border-radius: 6px;
                    padding: 8px 12px;
                    font-size: 12px;
                    color: #10b981;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }

                .agenda-main-container {
                    padding: 40px;
                    max-width: 1400px;
                    margin: 0 auto;
                    display: flex;
                    flex-direction: column;
                    gap: 24px;
                }

                /* CONTROLES DE VISUALIZAÇÃO */
                .view-controls {
                    background: rgba(255, 255, 255, 0.02);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    border-radius: 12px;
                    padding: 20px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .view-mode-buttons {
                    display: flex;
                    gap: 4px;
                    background: rgba(0, 0, 0, 0.2);
                    border-radius: 8px;
                    padding: 4px;
                }

                .view-mode-btn {
                    padding: 8px 16px;
                    border: none;
                    border-radius: 6px;
                    background: transparent;
                    color: #94a3b8;
                    font-size: 14px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }

                .view-mode-btn.active {
                    background: linear-gradient(135deg, #0d9488 0%, #14b8a6 100%);
                    color: white;
                    box-shadow: 0 2px 8px rgba(13, 148, 136, 0.3);
                }

                .view-mode-btn:hover:not(.active) {
                    background: rgba(255, 255, 255, 0.1);
                    color: #e2e8f0;
                }

                .date-navigation {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                }

                .nav-btn {
                    background: rgba(255, 255, 255, 0.1);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    border-radius: 6px;
                    color: #e2e8f0;
                    width: 32px;
                    height: 32px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s ease;
                }

                .nav-btn:hover {
                    background: rgba(13, 148, 136, 0.2);
                    border-color: rgba(13, 148, 136, 0.3);
                    color: #14b8a6;
                }

                .current-date {
                    font-size: 18px;
                    font-weight: 600;
                    color: #f8fafc;
                    min-width: 200px;
                    text-align: center;
                }

                .today-btn {
                    background: rgba(255, 255, 255, 0.1);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    border-radius: 6px;
                    color: #e2e8f0;
                    padding: 6px 12px;
                    font-size: 12px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }

                .today-btn:hover {
                    background: rgba(13, 148, 136, 0.2);
                    border-color: rgba(13, 148, 136, 0.3);
                    color: #14b8a6;
                }

                /* CALENDÁRIO PRINCIPAL */
                .calendar-container {
                    background: rgba(255, 255, 255, 0.02);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    border-radius: 16px;
                    overflow: hidden;
                    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
                }

                /* VISUALIZAÇÃO DIÁRIA */
                .daily-view {
                    display: flex;
                    height: 600px;
                }

                .time-column {
                    width: 80px;
                    background: rgba(0, 0, 0, 0.2);
                    border-right: 1px solid rgba(255, 255, 255, 0.1);
                    display: flex;
                    flex-direction: column;
                }

                .time-slot {
                    height: 60px;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 12px;
                    color: #94a3b8;
                    font-weight: 600;
                }

                .appointments-column {
                    flex: 1;
                    position: relative;
                    overflow-y: auto;
                }

                .appointment-slot {
                    position: absolute;
                    left: 8px;
                    right: 8px;
                    border-radius: 6px;
                    padding: 8px 12px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    border-left: 4px solid;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                }

                .appointment-slot:hover {
                    transform: translateX(4px);
                    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
                }

                .appointment-time {
                    font-size: 11px;
                    font-weight: 600;
                    color: rgba(255, 255, 255, 0.8);
                    margin-bottom: 2px;
                }

                .appointment-title {
                    font-size: 13px;
                    font-weight: 600;
                    color: white;
                    margin-bottom: 2px;
                    line-height: 1.2;
                }

                .appointment-patient {
                    font-size: 11px;
                    color: rgba(255, 255, 255, 0.7);
                    line-height: 1.2;
                }

                /* GRID DE HORAS */
                .hour-grid {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    pointer-events: none;
                }

                .hour-line {
                    position: absolute;
                    left: 0;
                    right: 0;
                    height: 1px;
                    background: rgba(255, 255, 255, 0.05);
                }

                /* VISUALIZAÇÃO SEMANAL */
                .weekly-view {
                    display: flex;
                    flex-direction: column;
                    height: 600px;
                }

                .weekly-header {
                    display: grid;
                    grid-template-columns: 80px repeat(7, 1fr);
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                    padding-bottom: 16px;
                    margin-bottom: 0;
                }

                .time-column-header {
                    background: rgba(0, 0, 0, 0.2);
                }

                .day-header {
                    text-align: center;
                    padding: 12px 8px;
                    border-radius: 8px;
                    transition: all 0.2s ease;
                }

                .day-header.today {
                    background: rgba(13, 148, 136, 0.2);
                    border: 1px solid rgba(13, 148, 136, 0.3);
                }

                .day-name {
                    font-size: 12px;
                    font-weight: 600;
                    color: #94a3b8;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    margin-bottom: 4px;
                }

                .day-number {
                    font-size: 20px;
                    font-weight: 700;
                    color: #f8fafc;
                    margin-bottom: 2px;
                }

                .day-month {
                    font-size: 11px;
                    color: #6b7280;
                    text-transform: uppercase;
                }

                .weekly-grid {
                    display: grid;
                    grid-template-columns: 80px repeat(7, 1fr);
                    flex: 1;
                    overflow-y: auto;
                }

                .weekly-time-column {
                    background: rgba(0, 0, 0, 0.2);
                    border-right: 1px solid rgba(255, 255, 255, 0.1);
                    display: flex;
                    flex-direction: column;
                }

                .weekly-time-slot {
                    height: 60px;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 11px;
                    color: #94a3b8;
                    font-weight: 600;
                }

                .weekly-day-column {
                    position: relative;
                    border-right: 1px solid rgba(255, 255, 255, 0.05);
                    cursor: pointer;
                    transition: background-color 0.2s ease;
                }

                .weekly-day-column:hover {
                    background: rgba(255, 255, 255, 0.02);
                }

                .weekly-day-column.today {
                    background: rgba(13, 148, 136, 0.05);
                }

                .weekly-hour-grid {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    pointer-events: none;
                }

                .weekly-hour-line {
                    position: absolute;
                    left: 0;
                    right: 0;
                    height: 1px;
                    background: rgba(255, 255, 255, 0.05);
                }

                .weekly-appointment {
                    position: absolute;
                    left: 4px;
                    right: 4px;
                    border-radius: 4px;
                    padding: 6px 8px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    border-left: 3px solid;
                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
                    font-size: 11px;
                }

                .weekly-appointment:hover {
                    transform: translateX(2px);
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
                }

                .weekly-appointment-time {
                    font-size: 10px;
                    font-weight: 600;
                    color: rgba(255, 255, 255, 0.8);
                    margin-bottom: 2px;
                }

                .weekly-appointment-title {
                    font-size: 11px;
                    font-weight: 600;
                    color: white;
                    margin-bottom: 1px;
                    line-height: 1.2;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }

                .weekly-appointment-patient {
                    font-size: 10px;
                    color: rgba(255, 255, 255, 0.7);
                    line-height: 1.2;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }

                /* VISUALIZAÇÃO MENSAL */
                .monthly-view {
                    display: flex;
                    flex-direction: column;
                    height: 600px;
                    padding: 20px;
                }

                .monthly-header {
                    text-align: center;
                    margin-bottom: 24px;
                }

                .month-title {
                    font-size: 24px;
                    font-weight: 600;
                    color: #f8fafc;
                    margin: 0;
                    letter-spacing: -0.025em;
                }

                .monthly-weekdays {
                    display: grid;
                    grid-template-columns: repeat(7, 1fr);
                    gap: 1px;
                    margin-bottom: 8px;
                }

                .weekday-header {
                    text-align: center;
                    padding: 12px 8px;
                    font-size: 12px;
                    font-weight: 600;
                    color: #94a3b8;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    background: rgba(0, 0, 0, 0.2);
                    border-radius: 6px;
                }

                .monthly-grid {
                    display: grid;
                    grid-template-columns: repeat(7, 1fr);
                    grid-template-rows: repeat(6, 1fr);
                    gap: 1px;
                    flex: 1;
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 12px;
                    overflow: hidden;
                }

                .monthly-day {
                    background: rgba(0, 0, 0, 0.2);
                    padding: 8px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    display: flex;
                    flex-direction: column;
                    min-height: 80px;
                    position: relative;
                }

                .monthly-day:hover {
                    background: rgba(0, 0, 0, 0.3);
                    transform: scale(1.02);
                    z-index: 1;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
                }

                .monthly-day.current-month {
                    background: rgba(255, 255, 255, 0.02);
                }

                .monthly-day.other-month {
                    background: rgba(0, 0, 0, 0.4);
                    opacity: 0.5;
                }

                .monthly-day.today {
                    background: rgba(13, 148, 136, 0.2);
                    border: 2px solid rgba(13, 148, 136, 0.5);
                }

                .monthly-day.today .day-number {
                    color: #14b8a6;
                    font-weight: 700;
                }

                .monthly-day .day-number {
                    font-size: 14px;
                    font-weight: 600;
                    color: #f8fafc;
                    margin-bottom: 4px;
                    text-align: center;
                }

                .monthly-day.other-month .day-number {
                    color: #6b7280;
                }

                .day-appointments {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    gap: 2px;
                    overflow: hidden;
                }

                .monthly-appointment {
                    padding: 2px 6px;
                    border-radius: 3px;
                    font-size: 10px;
                    color: white;
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    min-height: 16px;
                }

                .monthly-appointment:hover {
                    transform: scale(1.05);
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                }

                .monthly-appointment .appointment-time {
                    font-weight: 600;
                    opacity: 0.9;
                    font-size: 9px;
                }

                .monthly-appointment .appointment-title {
                    flex: 1;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    font-weight: 500;
                }

                .appointment-more {
                    font-size: 9px;
                    color: #94a3b8;
                    text-align: center;
                    font-style: italic;
                    margin-top: 2px;
                }

                /* MODAL DE CONSULTA RÁPIDA */
                .appointment-modal {
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

                .appointment-modal.active {
                    opacity: 1;
                    visibility: visible;
                }

                .modal-container {
                    background: linear-gradient(135deg, #1e3a8a 0%, #374151 100%);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 16px;
                    width: 90%;
                    max-width: 500px;
                    max-height: 90vh;
                    overflow: hidden;
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
                    transform: scale(0.9);
                    transition: transform 0.3s ease;
                }

                .appointment-modal.active .modal-container {
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

                /* FORMULÁRIO DE NOVA CONSULTA */
                .appointment-form {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }

                .form-row {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 16px;
                }

                .form-group {
                    display: flex;
                    flex-direction: column;
                    gap: 6px;
                }

                .form-group.full-width {
                    grid-column: 1 / -1;
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

                .duration-suggestion {
                    background: rgba(13, 148, 136, 0.1);
                    border: 1px solid rgba(13, 148, 136, 0.3);
                    border-radius: 6px;
                    padding: 8px 12px;
                    font-size: 12px;
                    color: #14b8a6;
                    margin-top: 4px;
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

                .modal-action-btn:hover {
                    transform: translateY(-1px);
                }

                /* RESUMO DO PACIENTE */
                .patient-summary {
                    background: rgba(13, 148, 136, 0.05);
                    border: 1px solid rgba(13, 148, 136, 0.2);
                    border-radius: 12px;
                    padding: 20px;
                    margin-bottom: 20px;
                }

                .patient-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 12px;
                }

                .patient-name {
                    font-size: 18px;
                    font-weight: 600;
                    color: #14b8a6;
                    margin: 0;
                }

                .patient-status {
                    padding: 4px 8px;
                    border-radius: 4px;
                    font-size: 11px;
                    font-weight: 600;
                    text-transform: uppercase;
                }

                .patient-details {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                    gap: 12px;
                    margin-bottom: 16px;
                }

                .patient-detail {
                    display: flex;
                    flex-direction: column;
                    gap: 2px;
                }

                .detail-label {
                    font-size: 11px;
                    color: #94a3b8;
                    font-weight: 600;
                    text-transform: uppercase;
                }

                .detail-value {
                    color: #e2e8f0;
                    font-weight: 500;
                }

                .patient-actions {
                    display: flex;
                    gap: 8px;
                }

                .patient-action-btn {
                    padding: 6px 12px;
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    border-radius: 6px;
                    background: rgba(0, 0, 0, 0.2);
                    color: #e2e8f0;
                    font-size: 11px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }

                .patient-action-btn:hover {
                    background: rgba(13, 148, 136, 0.2);
                    border-color: rgba(13, 148, 136, 0.3);
                    color: #14b8a6;
                }

                /* CONTROLES DE AUTOMAÇÃO */
                .automation-controls {
                    background: rgba(255, 255, 255, 0.02);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    border-radius: 12px;
                    padding: 20px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .automation-group {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .automation-label {
                    font-size: 14px;
                    font-weight: 600;
                    color: #e2e8f0;
                }

                .toggle-switch {
                    position: relative;
                    width: 50px;
                    height: 24px;
                    background: rgba(107, 114, 128, 0.3);
                    border-radius: 12px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .toggle-switch.active {
                    background: linear-gradient(135deg, #0d9488 0%, #14b8a6 100%);
                }

                .toggle-slider {
                    position: absolute;
                    top: 2px;
                    left: 2px;
                    width: 20px;
                    height: 20px;
                    background: white;
                    border-radius: 50%;
                    transition: all 0.3s ease;
                }

                .toggle-switch.active .toggle-slider {
                    transform: translateX(26px);
                }

                /* Responsividade */
                @media (max-width: 1024px) {
                    .agenda-main-container {
                        padding: 24px;
                    }
                    
                    .agenda-header {
                        padding: 20px 24px;
                    }
                    
                    .header-content {
                        flex-direction: column;
                        gap: 16px;
                    }
                    
                    .view-controls {
                        flex-direction: column;
                        gap: 16px;
                    }
                    
                    .form-row {
                        grid-template-columns: 1fr;
                    }
                    
                    .time-column {
                        width: 60px;
                    }
                    
                    .daily-view,
                    .weekly-view {
                        height: 500px;
                    }

                    .weekly-header {
                        grid-template-columns: 60px repeat(7, 1fr);
                    }
                    
                    .weekly-grid {
                        grid-template-columns: 60px repeat(7, 1fr);
                    }
                    
                    .day-number {
                        font-size: 16px;
                    }
                    
                    .weekly-appointment {
                        left: 2px;
                        right: 2px;
                        padding: 4px 6px;
                    }

                    .monthly-view {
                        padding: 16px;
                    }
                    
                    .month-title {
                        font-size: 20px;
                    }
                    
                    .monthly-day {
                        min-height: 60px;
                        padding: 6px;
                    }
                    
                    .monthly-day .day-number {
                        font-size: 12px;
                    }
                    
                    .monthly-appointment {
                        padding: 1px 4px;
                        font-size: 9px;
                        min-height: 14px;
                    }
                    
                    .monthly-appointment .appointment-time {
                        font-size: 8px;
                    }
                }

                @media (max-width: 768px) {
                    .workspace-title {
                        font-size: 24px;
                    }
                    
                    .view-mode-buttons {
                        flex-direction: column;
                        width: 100%;
                    }
                    
                    .date-navigation {
                        flex-direction: column;
                        gap: 8px;
                    }
                    
                    .automation-controls {
                        flex-direction: column;
                        gap: 16px;
                    }
                    
                    .patient-details {
                        grid-template-columns: 1fr;
                    }
                    
                    .modal-container {
                        width: 95%;
                    }
                    
                    .modal-content {
                        padding: 20px;
                    }
                    
                    .modal-actions {
                        flex-direction: column;
                    }

                    .monthly-day {
                        min-height: 50px;
                        padding: 4px;
                    }
                    
                    .monthly-appointment {
                        font-size: 8px;
                        min-height: 12px;
                        gap: 2px;
                    }
                    
                    .monthly-appointment .appointment-time {
                        display: none;
                    }
                }
            </style>

            <div class="agenda-workspace">
                <!-- Header -->
                <div class="agenda-header">
                    <div class="header-content">
                        <div class="header-title-section">
                            <h1 class="workspace-title">📅 Agenda Inteligente</h1>
                            <p class="workspace-subtitle">Painel de agendamento dinâmico e sincronizado</p>
                        </div>
                        <div class="header-actions">
                            <div class="sync-status">
                                <span>🔄</span>
                                <span>Google Agenda Sync</span>
                            </div>
                            <button onclick="AgendaProfissional.openNewAppointment()" class="new-appointment-btn">
                                ➕ Nova Consulta
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Container Principal -->
                <div class="agenda-main-container">
                    <!-- Controles de Visualização -->
                    <div class="view-controls">
                        <div class="view-mode-buttons">
                            <button onclick="AgendaProfissional.setViewMode('daily')" class="view-mode-btn ${this.currentSchedule.viewMode === 'daily' ? 'active' : ''}">
                                📋 Diária
                            </button>
                            <button onclick="AgendaProfissional.setViewMode('weekly')" class="view-mode-btn ${this.currentSchedule.viewMode === 'weekly' ? 'active' : ''}">
                                📊 Semanal
                            </button>
                            <button onclick="AgendaProfissional.setViewMode('monthly')" class="view-mode-btn ${this.currentSchedule.viewMode === 'monthly' ? 'active' : ''}">
                                📆 Mensal
                            </button>
                        </div>
                        
                        <div class="date-navigation">
                            <button onclick="AgendaProfissional.navigateDate(-1)" class="nav-btn">‹</button>
                            <div class="current-date">${this.formatCurrentDate()}</div>
                            <button onclick="AgendaProfissional.navigateDate(1)" class="nav-btn">›</button>
                            <button onclick="AgendaProfissional.goToToday()" class="today-btn">Hoje</button>
                        </div>
                    </div>

                    <!-- Calendário Principal -->
                    <div class="calendar-container">
                        ${this.renderCalendarView()}
                    </div>

                    <!-- Controles de Automação -->
                    <div class="automation-controls">
                        <div class="automation-group">
                            <div class="automation-label">Lembretes Automáticos (SMS/WhatsApp)</div>
                            <div onclick="AgendaProfissional.toggleReminders()" class="toggle-switch ${this.currentSchedule.remindersEnabled ? 'active' : ''}">
                                <div class="toggle-slider"></div>
                            </div>
                        </div>
                        
                        <div class="automation-group">
                            <div class="automation-label">Alerta de Ausência</div>
                            <div onclick="AgendaProfissional.toggleAbsenceAlert()" class="toggle-switch active">
                                <div class="toggle-slider"></div>
                            </div>
                        </div>
                        
                        <div class="automation-group">
                            <div class="automation-label">Sincronização Google</div>
                            <div onclick="AgendaProfissional.toggleGoogleSync()" class="toggle-switch ${this.currentSchedule.googleSyncEnabled ? 'active' : ''}">
                                <div class="toggle-slider"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Modal de Nova Consulta -->
                <div id="appointmentModal" class="appointment-modal">
                    <div class="modal-container">
                        <div class="modal-header">
                            <h3 id="modalTitle" class="modal-title">Nova Consulta</h3>
                            <button onclick="AgendaProfissional.closeModal()" class="modal-close">×</button>
                        </div>
                        <div class="modal-content">
                            <form class="appointment-form" id="appointmentForm">
                                <div class="form-row">
                                    <div class="form-group">
                                        <label class="form-label">Paciente</label>
                                        <select id="appointmentPatient" class="form-select" onchange="AgendaProfissional.updatePatientInfo()">
                                            <option value="">Selecione o paciente</option>
                                            ${this.renderPatientOptions()}
                                        </select>
                                    </div>
                                    
                                    <div class="form-group">
                                        <label class="form-label">Procedimento</label>
                                        <select id="appointmentProcedure" class="form-select" onchange="AgendaProfissional.updateDurationSuggestion()">
                                            <option value="">Selecione o procedimento</option>
                                            ${this.renderProcedureOptions()}
                                        </select>
                                        <div id="durationSuggestion" class="duration-suggestion" style="display: none;"></div>
                                    </div>
                                </div>
                                
                                <div class="form-row">
                                    <div class="form-group">
                                        <label class="form-label">Data</label>
                                        <input type="date" id="appointmentDate" class="form-input" value="${this.currentSchedule.currentDate.toISOString().split('T')[0]}">
                                    </div>
                                    
                                    <div class="form-group">
                                        <label class="form-label">Horário de Início</label>
                                        <input type="time" id="appointmentTime" class="form-input">
                                    </div>
                                </div>
                                
                                <div class="form-row">
                                    <div class="form-group">
                                        <label class="form-label">Duração (minutos)</label>
                                        <input type="number" id="appointmentDuration" class="form-input" placeholder="30" min="15" max="240" step="15">
                                    </div>
                                    
                                    <div class="form-group">
                                        <label class="form-label">Status</label>
                                        <select id="appointmentStatus" class="form-select">
                                            <option value="agendado">📅 Agendado</option>
                                            <option value="confirmado">✅ Confirmado</option>
                                        </select>
                                    </div>
                                </div>
                                
                                <div class="form-group full-width">
                                    <label class="form-label">Observações</label>
                                    <textarea id="appointmentNotes" class="form-textarea" placeholder="Observações sobre a consulta..."></textarea>
                                </div>
                            </form>
                        </div>
                        <div class="modal-actions">
                            <button onclick="AgendaProfissional.closeModal()" class="modal-action-btn secondary">
                                ❌ Cancelar
                            </button>
                            <button onclick="AgendaProfissional.saveAppointment()" class="modal-action-btn primary">
                                💾 Salvar Consulta
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Modal de Resumo do Paciente -->
                <div id="patientSummaryModal" class="appointment-modal">
                    <div class="modal-container">
                        <div class="modal-header">
                            <h3 class="modal-title">Resumo do Paciente</h3>
                            <button onclick="AgendaProfissional.closePatientModal()" class="modal-close">×</button>
                        </div>
                        <div class="modal-content" id="patientSummaryContent">
                            <!-- Conteúdo será inserido dinamicamente -->
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * Renderizar visualização do calendário baseada no modo atual
     */
    renderCalendarView() {
        switch (this.currentSchedule.viewMode) {
            case 'daily':
                return this.renderDailyView();
            case 'weekly':
                return this.renderWeeklyView();
            case 'monthly':
                return this.renderMonthlyView();
            default:
                return this.renderDailyView();
        }
    },

    /**
     * Renderizar visualização diária
     */
    renderDailyView() {
        const currentDate = this.currentSchedule.currentDate.toISOString().split('T')[0];
        const todayAppointments = this.currentSchedule.appointments.filter(apt => apt.date === currentDate);

        // Gerar horários das 8h às 18h
        const timeSlots = [];
        for (let hour = this.currentSchedule.workingHours.start; hour <= this.currentSchedule.workingHours.end; hour++) {
            timeSlots.push(`${hour.toString().padStart(2, '0')}:00`);
        }

        return `
            <div class="daily-view">
                <div class="time-column">
                    ${timeSlots.map(time => `<div class="time-slot">${time}</div>`).join('')}
                </div>
                <div class="appointments-column">
                    <div class="hour-grid">
                        ${timeSlots.map((_, index) => `
                            <div class="hour-line" style="top: ${index * 60}px;"></div>
                        `).join('')}
                    </div>
                    ${this.renderAppointmentSlots(todayAppointments)}
                </div>
            </div>
        `;
    },

    /**
     * Renderizar visualização semanal
     */
    renderWeeklyView() {
        const currentDate = new Date(this.currentSchedule.currentDate);
        const startOfWeek = new Date(currentDate);
        startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
        
        const weekDays = [];
        for (let i = 0; i < 7; i++) {
            const day = new Date(startOfWeek);
            day.setDate(startOfWeek.getDate() + i);
            weekDays.push(day);
        }

        return `
            <div class="weekly-view">
                <!-- Cabeçalho da semana -->
                <div class="weekly-header">
                    <div class="time-column-header"></div>
                    ${weekDays.map(day => `
                        <div class="day-header ${this.isToday(day) ? 'today' : ''}">
                            <div class="day-name">${this.getDayName(day)}</div>
                            <div class="day-number">${day.getDate()}</div>
                            <div class="day-month">${this.getShortMonthName(day)}</div>
                        </div>
                    `).join('')}
                </div>

                <!-- Grid de horários -->
                <div class="weekly-grid">
                    <div class="weekly-time-column">
                        ${this.renderWeeklyTimeSlots()}
                    </div>
                    ${weekDays.map(day => `
                        <div class="weekly-day-column ${this.isToday(day) ? 'today' : ''}" data-date="${day.toISOString().split('T')[0]}" onclick="AgendaProfissional.selectWeekDay('${day.toISOString().split('T')[0]}')">
                            <div class="weekly-hour-grid">
                                ${this.renderWeeklyHourLines()}
                            </div>
                            ${this.renderWeeklyAppointments(day)}
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    },

    /**
     * Renderizar visualização mensal
     */
    renderMonthlyView() {
        const currentDate = new Date(this.currentSchedule.currentDate);
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        
        // Primeiro dia do mês
        const firstDay = new Date(year, month, 1);
        // Último dia do mês
        const lastDay = new Date(year, month + 1, 0);
        
        // Início da grade (pode incluir dias do mês anterior)
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());
        
        // Gerar 42 dias (6 semanas)
        const calendarDays = [];
        const currentCalendarDate = new Date(startDate);
        
        for (let i = 0; i < 42; i++) {
            calendarDays.push(new Date(currentCalendarDate));
            currentCalendarDate.setDate(currentCalendarDate.getDate() + 1);
        }

        return `
            <div class="monthly-view">
                <!-- Cabeçalho do mês -->
                <div class="monthly-header">
                    <h3 class="month-title">${this.getMonthName(currentDate)} ${year}</h3>
                </div>

                <!-- Cabeçalho dos dias da semana -->
                <div class="monthly-weekdays">
                    ${['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => `
                        <div class="weekday-header">${day}</div>
                    `).join('')}
                </div>

                <!-- Grid do calendário -->
                <div class="monthly-grid">
                    ${calendarDays.map(day => {
                        const isCurrentMonth = day.getMonth() === month;
                        const isToday = this.isToday(day);
                        const dayAppointments = this.getAppointmentsForDate(day);
                        
                        return `
                            <div class="monthly-day ${isCurrentMonth ? 'current-month' : 'other-month'} ${isToday ? 'today' : ''}" 
                                 data-date="${day.toISOString().split('T')[0]}"
                                 onclick="AgendaProfissional.selectMonthDay('${day.toISOString().split('T')[0]}')">
                                <div class="day-number">${day.getDate()}</div>
                                <div class="day-appointments">
                                    ${dayAppointments.slice(0, 3).map(apt => `
                                        <div class="monthly-appointment" 
                                             style="background: ${this.getProcedureColor(apt.procedure)};"
                                             onclick="event.stopPropagation(); AgendaProfissional.showPatientSummary(${apt.id})">
                                            <span class="appointment-time">${apt.startTime}</span>
                                            <span class="appointment-title">${this.truncateText(apt.patientName, 12)}</span>
                                        </div>
                                    `).join('')}
                                    ${dayAppointments.length > 3 ? `
                                        <div class="appointment-more">+${dayAppointments.length - 3} mais</div>
                                    ` : ''}
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    },

    /**
     * Renderizar slots de consultas na timeline diária
     */
    renderAppointmentSlots(appointments) {
        return appointments.map(appointment => {
            const procedure = this.procedures.find(p => p.name === appointment.procedure);
            const startMinutes = this.timeToMinutes(appointment.startTime);
            const duration = appointment.duration;
            const top = ((startMinutes - (this.currentSchedule.workingHours.start * 60)) / 60) * 60;
            const height = (duration / 60) * 60;

            return `
                <div class="appointment-slot" 
                     style="top: ${top}px; height: ${height}px; background: ${procedure?.color || '#3b82f6'}; border-left-color: ${procedure?.color || '#3b82f6'};"
                     onclick="AgendaProfissional.showPatientSummary(${appointment.id})">
                    <div class="appointment-time">${appointment.startTime} - ${appointment.endTime}</div>
                    <div class="appointment-title">${appointment.procedure}</div>
                    <div class="appointment-patient">${appointment.patientName}</div>
                </div>
            `;
        }).join('');
    },

    /**
     * Renderizar slots de tempo para visualização semanal
     */
    renderWeeklyTimeSlots() {
        const timeSlots = [];
        for (let hour = this.currentSchedule.workingHours.start; hour <= this.currentSchedule.workingHours.end; hour++) {
            timeSlots.push(`${hour.toString().padStart(2, '0')}:00`);
        }
        return timeSlots.map(time => `<div class="weekly-time-slot">${time}</div>`).join('');
    },

    /**
     * Renderizar linhas de hora para visualização semanal
     */
    renderWeeklyHourLines() {
        const lines = [];
        for (let hour = this.currentSchedule.workingHours.start; hour <= this.currentSchedule.workingHours.end; hour++) {
            const top = (hour - this.currentSchedule.workingHours.start) * 60;
            lines.push(`<div class="weekly-hour-line" style="top: ${top}px;"></div>`);
        }
        return lines.join('');
    },

    /**
     * Renderizar consultas para um dia específico na visualização semanal
     */
    renderWeeklyAppointments(day) {
        const dayString = day.toISOString().split('T')[0];
        const dayAppointments = this.currentSchedule.appointments.filter(apt => apt.date === dayString);

        return dayAppointments.map(appointment => {
            const procedure = this.procedures.find(p => p.name === appointment.procedure);
            const startMinutes = this.timeToMinutes(appointment.startTime);
            const duration = appointment.duration;
            const top = ((startMinutes - (this.currentSchedule.workingHours.start * 60)) / 60) * 60;
            const height = Math.max((duration / 60) * 60, 30); // Altura mínima de 30px

            return `
                <div class="weekly-appointment" 
                     style="top: ${top}px; height: ${height}px; background: ${procedure?.color || '#3b82f6'}; border-left-color: ${procedure?.color || '#3b82f6'};"
                     onclick="AgendaProfissional.showPatientSummary(${appointment.id})">
                    <div class="weekly-appointment-time">${appointment.startTime}</div>
                    <div class="weekly-appointment-title">${appointment.procedure}</div>
                    <div class="weekly-appointment-patient">${appointment.patientName}</div>
                </div>
            `;
        }).join('');
    },

    /**
     * Renderizar opções de pacientes
     */
    renderPatientOptions() {
        return this.patients.map(patient => `
            <option value="${patient.id}">${patient.name}</option>
        `).join('');
    },

    /**
     * Renderizar opções de procedimentos
     */
    renderProcedureOptions() {
        return this.procedures.map(procedure => `
            <option value="${procedure.id}" data-duration="${procedure.duration}">${procedure.name}</option>
        `).join('');
    },

    /**
     * FUNÇÕES AUXILIARES
     */

    formatCurrentDate() {
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };

        if (this.currentSchedule.viewMode === 'weekly') {
            const startOfWeek = new Date(this.currentSchedule.currentDate);
            startOfWeek.setDate(this.currentSchedule.currentDate.getDate() - this.currentSchedule.currentDate.getDay());
            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(startOfWeek.getDate() + 6);
            
            return `${startOfWeek.getDate()} - ${endOfWeek.getDate()} de ${this.getMonthName(startOfWeek)} ${startOfWeek.getFullYear()}`;
        } else if (this.currentSchedule.viewMode === 'monthly') {
            return `${this.getMonthName(this.currentSchedule.currentDate)} ${this.currentSchedule.currentDate.getFullYear()}`;
        }
        
        return this.currentSchedule.currentDate.toLocaleDateString('pt-BR', options);
    },

    timeToMinutes(timeString) {
        const [hours, minutes] = timeString.split(':').map(Number);
        return hours * 60 + minutes;
    },

    minutesToTime(minutes) {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
    },

    isToday(date) {
        const today = new Date();
        return date.toDateString() === today.toDateString();
    },

    getDayName(date) {
        const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
        return days[date.getDay()];
    },

    getShortMonthName(date) {
        const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
        return months[date.getMonth()];
    },

    getMonthName(date) {
        const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
        return months[date.getMonth()];
    },

    getAppointmentsForDate(date) {
        const dateString = date.toISOString().split('T')[0];
        return this.currentSchedule.appointments.filter(apt => apt.date === dateString);
    },

    getProcedureColor(procedureName) {
        const procedure = this.procedures.find(p => p.name === procedureName);
        return procedure?.color || '#3b82f6';
    },

    truncateText(text, maxLength) {
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    },

    /**
     * FUNÇÕES DE INTERAÇÃO
     */

    setViewMode(mode) {
        this.currentSchedule.viewMode = mode;
        this.updateInterface();
    },

    navigateDate(direction) {
        const currentDate = new Date(this.currentSchedule.currentDate);
        
        switch (this.currentSchedule.viewMode) {
            case 'daily':
                currentDate.setDate(currentDate.getDate() + direction);
                break;
            case 'weekly':
                currentDate.setDate(currentDate.getDate() + (direction * 7));
                break;
            case 'monthly':
                currentDate.setMonth(currentDate.getMonth() + direction);
                break;
        }
        
        this.currentSchedule.currentDate = currentDate;
        this.updateInterface();
    },

    goToToday() {
        this.currentSchedule.currentDate = new Date();
        this.updateInterface();
    },

    selectWeekDay(dateString) {
        this.currentSchedule.currentDate = new Date(dateString);
        this.setViewMode('daily');
    },

    selectMonthDay(dateString) {
        this.currentSchedule.currentDate = new Date(dateString);
        this.setViewMode('daily');
    },

    openNewAppointment() {
        document.getElementById('appointmentModal').classList.add('active');
    },

    closeModal() {
        document.getElementById('appointmentModal').classList.remove('active');
        this.clearAppointmentForm();
    },

    closePatientModal() {
        document.getElementById('patientSummaryModal').classList.remove('active');
    },

    updatePatientInfo() {
        const patientId = document.getElementById('appointmentPatient')?.value;
        if (patientId) {
            const patient = this.patients.find(p => p.id === parseInt(patientId));
            console.log('Paciente selecionado:', patient?.name);
        }
    },

    updateDurationSuggestion() {
        const procedureId = document.getElementById('appointmentProcedure')?.value;
        const suggestionDiv = document.getElementById('durationSuggestion');
        const durationInput = document.getElementById('appointmentDuration');
        
        if (procedureId) {
            const procedure = this.procedures.find(p => p.id === parseInt(procedureId));
            if (procedure) {
                suggestionDiv.style.display = 'block';
                suggestionDiv.textContent = `💡 Duração sugerida: ${procedure.duration} minutos para ${procedure.name}`;
                durationInput.value = procedure.duration;
            }
        } else {
            suggestionDiv.style.display = 'none';
            durationInput.value = '';
        }
    },

    saveAppointment() {
        const patientId = document.getElementById('appointmentPatient')?.value;
        const procedureId = document.getElementById('appointmentProcedure')?.value;
        const date = document.getElementById('appointmentDate')?.value;
        const time = document.getElementById('appointmentTime')?.value;
        const duration = parseInt(document.getElementById('appointmentDuration')?.value);
        const status = document.getElementById('appointmentStatus')?.value;
        const notes = document.getElementById('appointmentNotes')?.value;

        if (!patientId || !procedureId || !date || !time || !duration) {
            this.showAlert('⚠️ Campos Obrigatórios', 'Preencha todos os campos obrigatórios.');
            return;
        }

        // Verificar conflitos de horário
        if (this.hasTimeConflict(date, time, duration)) {
            this.showAlert('⚠️ Conflito de Horário', 'Já existe uma consulta agendada neste horário.');
            return;
        }

        const patient = this.patients.find(p => p.id === parseInt(patientId));
        const procedure = this.procedures.find(p => p.id === parseInt(procedureId));
        
        // Calcular horário de término
        const startMinutes = this.timeToMinutes(time);
        const endMinutes = startMinutes + duration;
        const endTime = this.minutesToTime(endMinutes);

        const newAppointment = {
            id: Date.now(),
            patientId: parseInt(patientId),
            patientName: patient.name,
            patientPhone: patient.phone,
            procedure: procedure.name,
            date: date,
            startTime: time,
            endTime: endTime,
            duration: duration,
            status: status,
            notes: notes,
            reminderSent: false
        };

        this.currentSchedule.appointments.push(newAppointment);
        this.closeModal();
        this.updateInterface();

        this.showAlert('✅ Consulta Agendada', 
            `Consulta agendada com sucesso!\n\n` +
            `Paciente: ${patient.name}\n` +
            `Procedimento: ${procedure.name}\n` +
            `Data: ${new Date(date).toLocaleDateString('pt-BR')}\n` +
            `Horário: ${time} - ${endTime}`
        );
    },

    hasTimeConflict(date, time, duration) {
        const startMinutes = this.timeToMinutes(time);
        const endMinutes = startMinutes + duration;

        return this.currentSchedule.appointments.some(apt => {
            if (apt.date !== date) return false;
            
            const aptStartMinutes = this.timeToMinutes(apt.startTime);
            const aptEndMinutes = this.timeToMinutes(apt.endTime);
            
            return (startMinutes < aptEndMinutes && endMinutes > aptStartMinutes);
        });
    },

    showPatientSummary(appointmentId) {
        const appointment = this.currentSchedule.appointments.find(apt => apt.id === appointmentId);
        if (!appointment) return;

        const patient = this.patients.find(p => p.id === appointment.patientId);
        const statusConfig = this.statusConfig[appointment.status];

        const summaryHTML = `
            <div class="patient-summary">
                <div class="patient-header">
                    <h3 class="patient-name">${appointment.patientName}</h3>
                    <div class="patient-status" style="background: ${statusConfig.bgColor}; color: ${statusConfig.color};">
                        ${statusConfig.icon} ${statusConfig.label}
                    </div>
                </div>
                
                <div class="patient-details">
                    <div class="patient-detail">
                        <div class="detail-label">Telefone</div>
                        <div class="detail-value">${appointment.patientPhone}</div>
                    </div>
                    <div class="patient-detail">
                        <div class="detail-label">Procedimento</div>
                        <div class="detail-value">${appointment.procedure}</div>
                    </div>
                    <div class="patient-detail">
                        <div class="detail-label">Horário</div>
                        <div class="detail-value">${appointment.startTime} - ${appointment.endTime}</div>
                    </div>
                    <div class="patient-detail">
                        <div class="detail-label">Duração</div>
                        <div class="detail-value">${appointment.duration} minutos</div>
                    </div>
                </div>
                
                ${appointment.notes ? `
                    <div style="margin-top: 12px;">
                        <div class="detail-label">Observações</div>
                        <div class="detail-value">${appointment.notes}</div>
                    </div>
                ` : ''}
                
                <div class="patient-actions">
                    <button onclick="AgendaProfissional.editAppointment(${appointment.id})" class="patient-action-btn">
                        ✏️ Editar
                    </button>
                    <button onclick="AgendaProfissional.confirmAppointment(${appointment.id})" class="patient-action-btn">
                        ✅ Confirmar
                    </button>
                    <button onclick="AgendaProfissional.cancelAppointment(${appointment.id})" class="patient-action-btn">
                        ❌ Cancelar
                    </button>
                    <button onclick="AgendaProfissional.viewFullRecord(${appointment.patientId})" class="patient-action-btn">
                        📋 Prontuário Completo
                    </button>
                </div>
            </div>
        `;

        document.getElementById('patientSummaryContent').innerHTML = summaryHTML;
        document.getElementById('patientSummaryModal').classList.add('active');
    },

    editAppointment(appointmentId) {
        this.showAlert('✏️ Editar Consulta', 'Funcionalidade de edição será implementada.');
    },

    confirmAppointment(appointmentId) {
        const appointment = this.currentSchedule.appointments.find(apt => apt.id === appointmentId);
        if (appointment) {
            appointment.status = 'confirmado';
            this.updateInterface();
            this.closePatientModal();
            this.showAlert('✅ Consulta Confirmada', `Consulta de ${appointment.patientName} confirmada!`);
        }
    },

    cancelAppointment(appointmentId) {
        const appointment = this.currentSchedule.appointments.find(apt => apt.id === appointmentId);
        if (appointment) {
            appointment.status = 'cancelado';
            this.updateInterface();
            this.closePatientModal();
            this.showAlert('❌ Consulta Cancelada', `Consulta de ${appointment.patientName} cancelada.`);
        }
    },

    viewFullRecord(patientId) {
        // Integrar com sistema de anamnese
        if (typeof openPatientAnamnesis === 'function') {
            this.closePatientModal();
            openPatientAnamnesis(patientId);
        } else {
            this.showAlert('📋 Prontuário', `Abrindo prontuário completo do paciente ID: ${patientId}`);
        }
    },

    toggleReminders() {
        this.currentSchedule.remindersEnabled = !this.currentSchedule.remindersEnabled;
        this.updateInterface();
        
        const status = this.currentSchedule.remindersEnabled ? 'ativados' : 'desativados';
        this.showAlert('📱 Lembretes Automáticos', `Lembretes automáticos ${status}!`);
    },

    toggleAbsenceAlert() {
        this.showAlert('⚠️ Alerta de Ausência', 'Sistema de alerta de ausência sempre ativo.');
    },

    toggleGoogleSync() {
        this.currentSchedule.googleSyncEnabled = !this.currentSchedule.googleSyncEnabled;
        this.updateInterface();
        
        const status = this.currentSchedule.googleSyncEnabled ? 'ativada' : 'desativada';
        this.showAlert('🔄 Google Agenda', `Sincronização ${status}!`);
    },

    clearAppointmentForm() {
        const fields = ['appointmentPatient', 'appointmentProcedure', 'appointmentTime', 'appointmentDuration', 'appointmentNotes'];
        fields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) field.value = '';
        });
        
        const suggestion = document.getElementById('durationSuggestion');
        if (suggestion) suggestion.style.display = 'none';
    },

    updateInterface() {
        // Recarregar interface completa
        const currentInterface = this.renderProfessionalInterface();
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
            mainContent.innerHTML = currentInterface;
        }
    },

    showAlert(title, message) {
        // Usar sistema UI integrado se disponível
        if (typeof UI !== 'undefined' && UI.showAlert) {
            UI.showAlert(title, message);
            return;
        }
        
        // Fallback para modal próprio
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
window.AgendaProfissional = AgendaProfissional;

// Auto-inicializar
document.addEventListener('DOMContentLoaded', function() {
    if (typeof AgendaProfissional !== 'undefined') {
        AgendaProfissional.init();
    }
});

console.log('📅 Módulo Agenda Profissional carregado e integrado!');