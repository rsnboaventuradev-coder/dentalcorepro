// ============================================================================
// DENTALCORE PRO - APLICAÇÃO PRINCIPAL COM PRONTUÁRIO COMPLETO
// Sistema Odontológico Inteligente com Prontuário Premium Integrado
// ============================================================================

let currentTab = 'dashboard';
let currentPatient = null;
let currentPatientTab = 'sobre';

// Configuração para produção
const IS_PRODUCTION = window.location.protocol === 'https:';
const BASE_URL = IS_PRODUCTION ? window.location.origin : '';

console.log(`🚀 DentalCore Pro rodando em modo: ${IS_PRODUCTION ? 'PRODUÇÃO' : 'DESENVOLVIMENTO'}`);

// ============================================================================
// FUNÇÕES PRINCIPAIS DE NAVEGAÇÃO
// ============================================================================

/**
 * Função de login chamada pelo formulário
 */
async function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    
    const success = await SimpleAuth.login(username, password);
    
    if (success) {
        document.getElementById('loginScreen').classList.add('hidden');
        document.getElementById('mainApp').classList.remove('hidden');
        
        SimpleAuth.updateUserInterface();
        showTab('dashboard');
        
        UI.showAlert('🎉 Login realizado com sucesso!', `👤 Bem-vindo(a), ${SimpleAuth.getCurrentUser().name}!\n\n✅ DentalCore Pro v2.0.0\n🤖 Todos os módulos carregados\n📋 Sistema integrado pronto\n📝 Anamnese premium ativa\n💰 Orçamentos integrados\n🦷 Prontuário completo`);
    }
}

/**
 * Função de logout chamada pelo botão
 */
function handleLogout() {
    SimpleAuth.logout();
}

/**
 * Função principal de navegação entre abas
 */
function showTab(tabName) {
    console.log('📍 Mudando para aba:', tabName);
    
    // Atualizar navegação sidebar
    document.querySelectorAll('.sidebar-btn').forEach(btn => {
        btn.classList.remove('active', 'bg-blue-600', 'text-white');
        btn.classList.add('text-gray-300');
    });

    const activeTab = document.querySelector(`[data-tab="${tabName}"]`);
    if (activeTab) {
        activeTab.classList.add('active', 'bg-blue-600', 'text-white');
        activeTab.classList.remove('text-gray-300');
    }

    // Atualizar título da página
    updatePageHeader(tabName);

    // Carregar conteúdo da aba
    currentTab = tabName;
    loadTabContent(tabName);
}

/**
 * Atualizar header da página
 */
function updatePageHeader(tabName, patientName = null) {
    const pageTitle = document.getElementById('pageTitle');
    const pageSubtitle = document.getElementById('pageSubtitle');
    const currentDate = document.getElementById('currentDate');
    
    if (currentDate) {
        currentDate.textContent = new Date().toLocaleDateString('pt-BR', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    }
    
const headers = {
    'dashboard': { title: 'Dashboard', subtitle: 'Visão geral do sistema' },
    'schedule': { title: 'Agenda', subtitle: 'Gerenciamento de consultas' },
    'patients': { title: 'Pacientes', subtitle: 'Cadastro e prontuários' },
    'laboratorios': { title: 'Laboratórios', subtitle: 'Controle de próteses e casos laboratoriais' },
    'reports': { title: 'Relatórios', subtitle: 'Análises e estatísticas' },
    'settings': { title: 'Configurações', subtitle: 'Preferências do sistema' },
    'prontuario': { 
        title: patientName ? `Prontuário - ${patientName}` : 'Prontuário', 
        subtitle: 'Ficha completa do paciente' 
    },
    };

const header = headers[tabName] || { title: 'DentalCore Pro', subtitle: 'Sistema Odontológico' };

if (pageTitle) pageTitle.textContent = header.title;
if (pageSubtitle) pageSubtitle.textContent = header.subtitle;
}

/**
 * Carregar conteúdo da aba
 */
function loadTabContent(tabName) {
    const mainContent = document.getElementById('main-content');
    if (!mainContent) return;
    
    switch (tabName) {
        case 'dashboard':
            mainContent.innerHTML = renderDashboard();
            break;

case 'schedule':
    // SEMPRE carregar agenda real funcional
    if (typeof AgendaProfissional !== 'undefined') {
        try {
            mainContent.innerHTML = AgendaProfissional.renderProfessionalInterface();
        } catch (error) {
            console.error('❌ Erro ao renderizar Agenda:', error);
            mainContent.innerHTML = renderPlaceholder('❌ Erro na Agenda', 'Erro ao carregar agenda profissional');
        }
    } else {
        mainContent.innerHTML = renderPlaceholder('📅 Agenda', 'Carregando módulo de agenda...');
    }
    break;
        case 'patients':
            mainContent.innerHTML = renderPatients();
            break;
        case 'reports':
            if (typeof RelatoriosPremium !== 'undefined') {
                try {
                    mainContent.innerHTML = RelatoriosPremium.renderReportsInterface();
                    // Recriar gráficos após renderizar
                    setTimeout(() => {
                        if (RelatoriosPremium.createCharts) {
                            RelatoriosPremium.createCharts();
                        }
                    }, 500);
                } catch (error) {
                    console.error('❌ Erro ao renderizar RelatoriosPremium:', error);
                    mainContent.innerHTML = renderPlaceholder('❌ Erro nos Relatórios', 'Erro ao carregar o módulo de relatórios');
                }
            } else {
                mainContent.innerHTML = renderPlaceholder('📊 Relatórios', 'Módulo de relatórios em desenvolvimento');
            }
            break;
case 'settings':
    if (typeof ConfiguracoesSystem !== 'undefined') {
        try {
            mainContent.innerHTML = ConfiguracoesSystem.renderConfigurationsInterface();
        } catch (error) {
            console.error('❌ Erro ao renderizar Configurações:', error);
            mainContent.innerHTML = renderPlaceholder('❌ Erro nas Configurações', 'Erro ao carregar o módulo de configurações');
        }
    } else {
        mainContent.innerHTML = renderPlaceholder('⚙️ Configurações', 'Módulo de configurações em desenvolvimento');
    }
    break;
    case 'laboratorios':
    if (typeof LaboratoriosProfissional !== 'undefined') {
        try {
            mainContent.innerHTML = LaboratoriosProfissional.renderProfessionalInterface();
        } catch (error) {
            console.error('❌ Erro ao renderizar Laboratórios:', error);
            mainContent.innerHTML = renderPlaceholder('❌ Erro nos Laboratórios', 'Erro ao carregar o módulo de laboratórios');
        }
    } else {
        mainContent.innerHTML = renderPlaceholder('🏥 Laboratórios', 'Módulo de laboratórios em desenvolvimento');
    }
    break;}
    
/**
 * Renderizar agenda fallback
 */
function renderAgendaFallback() {
    return `
        <div class="p-8 bg-gray-900 min-h-screen">
            <div class="max-w-4xl mx-auto">
                <div class="bg-gray-800 rounded-lg p-8 text-center">
                    <h2 class="text-2xl font-bold text-white mb-4">📅 Sistema de Agenda</h2>
                    <p class="text-gray-300 mb-6">Configure Firebase ou Google Calendar para ativar a sincronização</p>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="bg-orange-500/10 border border-orange-500/20 rounded-lg p-6">
                            <h3 class="text-lg font-bold text-orange-400 mb-3">🔥 Firebase (Recomendado)</h3>
                            <p class="text-gray-400 text-sm mb-4">Colaboração em tempo real para sua equipe</p>
                            <button onclick="location.reload()" class="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600">
                                Configurar Firebase
                            </button>
                        </div>
                        
                        <div class="bg-blue-500/10 border border-blue-500/20 rounded-lg p-6">
                            <h3 class="text-lg font-bold text-blue-400 mb-3">📅 Google Calendar</h3>
                            <p class="text-gray-400 text-sm mb-4">Sincronização com Google Calendar</p>
                            <button onclick="alert('Configure Firebase primeiro para melhor experiência')" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                                Google Calendar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}
}

// ============================================================================
// SISTEMA DE PRONTUÁRIO COMPLETO COM ABAS
// ============================================================================

/**
 * Renderizar prontuário completo do paciente
 */
function renderPatientRecord(patient) {
    return `
        <div class="patient-record-workspace bg-gray-900 min-h-screen">
            <!-- Header do Prontuário -->
            <div class="patient-header bg-gradient-to-r from-blue-600 to-purple-600 p-6 shadow-lg">
                <div class="max-w-7xl mx-auto">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-6">
                            <div class="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                                <span class="text-2xl font-bold text-white">${patient.name.split(' ').map(n => n[0]).join('').substring(0, 2)}</span>
                            </div>
                            <div>
                                <h1 class="text-3xl font-bold text-white">${patient.name}</h1>
                                <p class="text-blue-200">Prontuário Completo • ID: ${patient.id}</p>
                                <p class="text-blue-200 text-sm">${patient.email || 'Email não informado'} • ${patient.phone || 'Telefone não informado'}</p>
                            </div>
                        </div>
                        <div class="flex items-center space-x-4">
                            <button onclick="showTab('patients')" class="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-6 py-2 rounded-lg transition duration-300">
                                ← Voltar para Pacientes
                            </button>
                            <button onclick="printPatientRecord()" class="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-6 py-2 rounded-lg transition duration-300">
                                🖨️ Imprimir
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Navegação de Abas -->
            <div class="patient-tabs-nav bg-gray-800 border-b border-gray-700">
                <div class="max-w-7xl mx-auto">
                    <nav class="flex space-x-1 overflow-x-auto">
                        <button onclick="showPatientTab('sobre')" class="patient-tab-btn ${currentPatientTab === 'sobre' ? 'active' : ''}" data-tab="sobre">
                            👤 Sobre
                        </button>
                        <button onclick="showPatientTab('anamnese')" class="patient-tab-btn ${currentPatientTab === 'anamnese' ? 'active' : ''}" data-tab="anamnese">
                            📝 Anamnese
                        </button>
                        <button onclick="showPatientTab('orcamentos')" class="patient-tab-btn ${currentPatientTab === 'orcamentos' ? 'active' : ''}" data-tab="orcamentos">
                            💰 Orçamentos
                        </button>
                        <button onclick="showPatientTab('tratamentos')" class="patient-tab-btn ${currentPatientTab === 'tratamentos' ? 'active' : ''}" data-tab="tratamentos">
                            🦷 Tratamentos
                        </button>
                        <button onclick="showPatientTab('imagens')" class="patient-tab-btn ${currentPatientTab === 'imagens' ? 'active' : ''}" data-tab="imagens">
                            📷 Imagens
                        </button>
                        <button onclick="showPatientTab('documentos')" class="patient-tab-btn ${currentPatientTab === 'documentos' ? 'active' : ''}" data-tab="documentos">
                            📄 Documentos
                        </button>
                        <button onclick="showPatientTab('debitos')" class="patient-tab-btn ${currentPatientTab === 'debitos' ? 'active' : ''}" data-tab="debitos">
                            💳 Débitos
                        </button>
                    </nav>
                </div>
            </div>

            <!-- Conteúdo da Aba Ativa -->
            <div id="patientTabContent" class="patient-tab-content">
                ${renderPatientTabContent('sobre', patient)}
            </div>
        </div>

        <style>
            .patient-record-workspace {
                font-family: 'Inter', sans-serif;
            }
            
            .patient-tabs-nav {
                position: sticky;
                top: 0;
                z-index: 40;
                backdrop-filter: blur(10px);
            }
            
            .patient-tab-btn {
                padding: 14px 20px;
                color: #9ca3af;
                font-weight: 500;
                border-bottom: 3px solid transparent;
                transition: all 0.3s ease;
                white-space: nowrap;
                background: none;
                border: none;
                cursor: pointer;
                font-size: 14px;
            }
            
            .patient-tab-btn:hover {
                color: #e5e7eb;
                background-color: rgba(55, 65, 81, 0.5);
            }
            
            .patient-tab-btn.active {
                color: #3b82f6;
                border-bottom-color: #3b82f6;
                background-color: rgba(59, 130, 246, 0.1);
            }
            
            .patient-tab-content {
                min-height: calc(100vh - 200px);
            }
            
            @media (max-width: 768px) {
                .patient-header .flex {
                    flex-direction: column;
                    gap: 1rem;
                }
                
                .patient-tabs-nav nav {
                    padding: 0 16px;
                }
                
                .patient-tab-btn {
                    padding: 12px 16px;
                    font-size: 13px;
                }
            }
        </style>
    `;
}

/**
 * Mostrar aba do paciente
 */
function showPatientTab(tabName) {
    currentPatientTab = tabName;
    
    // Atualizar botões das abas
    document.querySelectorAll('.patient-tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    const activeBtn = document.querySelector(`[data-tab="${tabName}"]`);
    if (activeBtn) {
        activeBtn.classList.add('active');
    }
    
    // Atualizar conteúdo
    const contentContainer = document.getElementById('patientTabContent');
    if (contentContainer && currentPatient) {
        contentContainer.innerHTML = renderPatientTabContent(tabName, currentPatient);
    }
}

/**
 * Renderizar conteúdo da aba
 */
function renderPatientTabContent(tabName, patient) {
    switch (tabName) {
        case 'sobre':
            return renderPatientAbout(patient);
        case 'anamnese':
            return renderPatientAnamnese(patient);
        case 'orcamentos':
            return renderPatientOrcamentos(patient);
        case 'tratamentos':
            return renderPatientTratamentos(patient);
        case 'imagens':
            return renderPatientImagens(patient);
        case 'documentos':
            return renderPatientDocumentos(patient);
        case 'debitos':
            return renderPatientDebitos(patient);
        default:
            return renderPatientAbout(patient);
    }
}

/**
 * Aba Sobre - Informações do paciente
 */
function renderPatientAbout(patient) {
    const age = calculateAge(patient.birthDate);
    const lastVisit = patient.lastVisit ? new Date(patient.lastVisit).toLocaleDateString('pt-BR') : 'Nunca';
    
    return `
        <div class="p-8 bg-gray-900">
            <div class="max-w-4xl mx-auto">
                <h2 class="text-2xl font-bold text-white mb-8">Informações do Paciente</h2>
                
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <!-- Dados Pessoais -->
                    <div class="bg-gray-800 rounded-xl border border-gray-700 p-6">
                        <h3 class="text-xl font-semibold text-white mb-6 flex items-center">
                            <svg class="w-6 h-6 mr-3 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                            </svg>
                            Dados Pessoais
                        </h3>
                        
                        <div class="space-y-4">
                            <div>
                                <label class="text-sm text-gray-400">Nome Completo</label>
                                <p class="text-white font-medium">${patient.name}</p>
                            </div>
                            <div>
                                <label class="text-sm text-gray-400">Data de Nascimento</label>
                                <p class="text-white font-medium">${patient.birthDate ? new Date(patient.birthDate).toLocaleDateString('pt-BR') : 'Não informado'} ${age ? `(${age} anos)` : ''}</p>
                            </div>
                            <div>
                                <label class="text-sm text-gray-400">Email</label>
                                <p class="text-white font-medium">${patient.email || 'Não informado'}</p>
                            </div>
                            <div>
                                <label class="text-sm text-gray-400">Telefone</label>
                                <p class="text-white font-medium">${patient.phone || 'Não informado'}</p>
                            </div>
                            <div>
                                <label class="text-sm text-gray-400">Endereço</label>
                                <p class="text-white font-medium">${patient.address || 'Não informado'}</p>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Informações Clínicas -->
                    <div class="bg-gray-800 rounded-xl border border-gray-700 p-6">
                        <h3 class="text-xl font-semibold text-white mb-6 flex items-center">
                            <svg class="w-6 h-6 mr-3 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                            </svg>
                            Informações Clínicas
                        </h3>
                        
                        <div class="space-y-4">
                            <div>
                                <label class="text-sm text-gray-400">Última Consulta</label>
                                <p class="text-white font-medium">${lastVisit}</p>
                            </div>
                            <div>
                                <label class="text-sm text-gray-400">Status da Anamnese</label>
                                <p class="text-white font-medium">
                                    <span class="inline-flex items-center px-3 py-1 rounded-full text-sm bg-yellow-900 text-yellow-300">
                                        ⏳ Pendente
                                    </span>
                                </p>
                            </div>
                            <div>
                                <label class="text-sm text-gray-400">Próxima Consulta</label>
                                <p class="text-white font-medium">Não agendada</p>
                            </div>
                        </div>
                        
                        <div class="mt-6 pt-6 border-t border-gray-700">
                            <button onclick="showPatientTab('anamnese')" class="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg transition duration-300">
                                📝 Preencher Anamnese
                            </button>
                        </div>
                    </div>
                </div>
                
                <!-- Resumo Rápido -->
                <div class="mt-8 bg-gray-800 rounded-xl border border-gray-700 p-6">
                    <h3 class="text-xl font-semibold text-white mb-6">Resumo Rápido</h3>
                    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div class="text-center">
                            <div class="text-3xl font-bold text-blue-400">0</div>
                            <div class="text-sm text-gray-400">Consultas</div>
                        </div>
                        <div class="text-center">
                            <div class="text-3xl font-bold text-green-400">R$ 0</div>
                            <div class="text-sm text-gray-400">Faturado</div>
                        </div>
                        <div class="text-center">
                            <div class="text-3xl font-bold text-yellow-400">0</div>
                            <div class="text-sm text-gray-400">Orçamentos</div>
                        </div>
                        <div class="text-center">
                            <div class="text-3xl font-bold text-red-400">R$ 0</div>
                            <div class="text-sm text-gray-400">Pendências</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

/**
 * Aba Anamnese
 */
function renderPatientAnamnese(patient) {
    if (typeof Anamnese !== 'undefined') {
        return Anamnese.renderTabAnamnese(patient);
    }
    return `<div class="p-8 text-center text-gray-400">Módulo de Anamnese não carregado</div>`;
}

/**
 * Aba Orçamentos
 */
function renderPatientOrcamentos(patient) {
    if (typeof OrcamentosOdontograma !== 'undefined') {
        return OrcamentosOdontograma.renderTabOrcamentos(patient);
    } else if (typeof Orcamentos !== 'undefined') {
        return Orcamentos.renderTabOrcamentos(patient);
    }
    return `<div class="p-8 text-center text-gray-400">Módulo de Orçamentos não carregado</div>`;
}

/**
 * Abas em desenvolvimento
 */
function renderPatientTratamentos(patient) {
    console.log('🦷 Renderizando aba tratamentos para:', patient?.name);
    
    if (typeof Tratamentos !== 'undefined') {
        return Tratamentos.renderTabTratamentos(patient);
    }
    
    console.error('❌ Módulo Tratamentos não carregado!');
    return `
        <div class="p-8 text-center text-gray-400">
            <h3 class="text-xl font-bold mb-4">⚠️ Módulo Tratamentos</h3>
            <p class="mb-4">O módulo de tratamentos não foi carregado corretamente.</p>
            <p class="text-sm mb-4">Verifique se o arquivo js/modules/tratamentos.js está carregado.</p>
            <button onclick="location.reload()" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                🔄 Recarregar Página
            </button>
        </div>
    `;
}

function renderPatientImagens(patient) {
    console.log('📸 Renderizando aba imagens para:', patient?.name);
    
    if (typeof Imagens !== 'undefined') {
        return Imagens.renderTabImagens(patient);
    }
    
    console.error('❌ Módulo Imagens não carregado!');
    return `
        <div class="p-8 text-center text-gray-400">
            <h3 class="text-xl font-bold mb-4">📸 Sistema de Imagens</h3>
            <p class="mb-4">O módulo de imagens não foi carregado corretamente.</p>
            <button onclick="location.reload()" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                🔄 Recarregar Página
            </button>
        </div>
    `;
}

function renderPatientDocumentos(patient) {
    console.log('📄 Renderizando aba documentos para:', patient?.name);
    
    if (typeof DocumentosProfissional !== 'undefined') {
        return DocumentosProfissional.renderProfessionalInterface(patient);
    }
    
    console.error('❌ Módulo DocumentosProfissional não carregado!');
    return `
        <div class="p-8 text-center text-gray-400">
            <h3 class="text-xl font-bold mb-4">📄 Sistema de Documentos</h3>
            <p class="mb-4">O módulo de documentos não foi carregado corretamente.</p>
            <button onclick="location.reload()" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                🔄 Recarregar Página
            </button>
        </div>
    `;
}

function renderPatientDebitos(patient) {
    console.log('💰 Renderizando aba débitos para:', patient?.name);
    
    if (typeof DebitosProfissional !== 'undefined') {
        return DebitosProfissional.renderProfessionalInterface(patient);
    }
    
    console.error('❌ Módulo DebitosProfissional não carregado!');
    return `
        <div class="p-8 text-center text-gray-400">
            <h3 class="text-xl font-bold mb-4">💰 Sistema Financeiro</h3>
            <p class="mb-4">O módulo de débitos não foi carregado corretamente.</p>
            <button onclick="location.reload()" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                🔄 Recarregar Página
            </button>
        </div>
    `;
}

function renderModulePlaceholder(title, description) {
    return `
        <div class="flex items-center justify-center min-h-[60vh] bg-gray-900">
            <div class="text-center">
                <div class="text-6xl mb-4">🚧</div>
                <h2 class="text-3xl font-bold text-white mb-2">${title}</h2>
                <p class="text-gray-400 text-lg mb-6">${description}</p>
                <p class="text-gray-500">Em desenvolvimento</p>
            </div>
        </div>
    `;
}

/**
 * Abrir prontuário completo do paciente com abas
 */
function openPatientDetails(patientId) {
    const patient = DataPersistence.getPatients().find(p => p.id === patientId);
    if (!patient) {
        UI.showAlert('❌ Erro', 'Paciente não encontrado!');
        return;
    }
    
    currentPatient = patient;
    currentPatientTab = 'sobre'; // Reset para aba inicial
    
    // Renderizar prontuário completo
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
        mainContent.innerHTML = renderPatientRecord(patient);
    }
    
    // Atualizar título da página
    updatePageHeader('prontuario', patient.name);

    
}

/**
 * Abrir anamnese diretamente (manter compatibilidade)
 */
function openPatientAnamnesis(patientId) {
    openPatientDetails(patientId);
    // Depois que carregar, ativar aba anamnese
    setTimeout(() => showPatientTab('anamnese'), 100);
}

/**
 * Funções auxiliares
 */
function calculateAge(birthDate) {
    if (!birthDate) return null;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
    }
    return age;
}

function printPatientRecord() {
    UI.showAlert('🖨️ Imprimir Prontuário', 'Funcionalidade de impressão será implementada.');
}

// Manter função antiga para compatibilidade
function openPatientTabs(patientId) {
    openPatientDetails(patientId);
}

// ============================================================================
// FUNÇÕES DE RENDERIZAÇÃO DE CONTEÚDO
// ============================================================================

/**
 * Renderizar interface de módulo externo
 */
function renderModuleInterface(title, moduleName, methodName) {
    if (window[moduleName] && typeof window[moduleName][methodName] === 'function') {
        try {
            return window[moduleName][methodName](currentPatient);
        } catch (error) {
            console.error(`Erro ao renderizar ${moduleName}:`, error);
            return renderPlaceholder(`❌ Erro no ${title}`, `Erro ao carregar o módulo ${moduleName}`);
        }
    } else {
        return renderPlaceholder(`⏳ ${title}`, `Carregando módulo ${moduleName}...`);
    }
}

/**
 * Renderizar Dashboard
 */
function renderDashboard() {
    if (window.DashboardPremium && typeof window.DashboardPremium.renderDashboard === 'function') {
        try {
            return window.DashboardPremium.renderDashboard();
        } catch (error) {
            console.error('Erro no Dashboard Premium:', error);
        }
    }
    
    return `
        <div class="p-8 bg-gray-900 min-h-screen">
            <div class="max-w-7xl mx-auto">
                <!-- Cards Principais -->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div class="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-xl shadow-lg">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-blue-200 text-sm">Pacientes Ativos</p>
                                <p class="text-3xl font-bold text-white">${DataPersistence.getPatients().length}</p>
                            </div>
                            <div class="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div class="bg-gradient-to-r from-green-600 to-teal-600 p-6 rounded-xl shadow-lg">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-green-200 text-sm">Consultas Hoje</p>
                                <p class="text-3xl font-bold text-white">12</p>
                            </div>
                            <div class="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div class="bg-gradient-to-r from-yellow-600 to-orange-600 p-6 rounded-xl shadow-lg">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-yellow-200 text-sm">Faturamento Mensal</p>
                                <p class="text-3xl font-bold text-white">R$ 45.2k</p>
                            </div>
                            <div class="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div class="bg-gradient-to-r from-purple-600 to-pink-600 p-6 rounded-xl shadow-lg">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-purple-200 text-sm">Tratamentos Ativos</p>
                                <p class="text-3xl font-bold text-white">89</p>
                            </div>
                            <div class="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Status dos Módulos -->
                <div class="bg-gray-800 rounded-xl border border-gray-700 p-6">
                    <h3 class="text-xl font-semibold text-white mb-4">Status dos Módulos</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        ${renderModuleStatus()}
                    </div>
                </div>
            </div>
        </div>
    `;
}

/**
 * Renderizar status dos módulos
 */
function renderModuleStatus() {
    const modules = [
        'DashboardPremium',
        'Anamnese',
        'Orcamentos',
        'OrcamentosOdontograma',
        'Tratamentos',
        'Imagens',
        'AgendaProfissional', 
        'DebitosProfissional',
        'DocumentosProfissional',
        'RelatoriosPremium',
        'Budgets',
        'DentalCoreBackup',
        'DentalCoreIntegrations'
    ];

    return modules.map(moduleName => {
        const isLoaded = window[moduleName] !== undefined;
        const status = isLoaded ? '✅ Carregado' : '⏳ Aguardando';
        const color = isLoaded ? 'text-green-400' : 'text-yellow-400';
        
        return `
            <div class="bg-gray-700 p-3 rounded-lg">
                <div class="flex justify-between items-center">
                    <span class="text-gray-300">${moduleName}</span>
                    <span class="${color} text-sm">${status}</span>
                </div>
            </div>
        `;
    }).join('');
}

/**
 * Renderizar interface de pacientes
 */
function renderPatients() {
    return `
        <div class="p-8 bg-gray-900 min-h-screen">
            <div class="max-w-7xl mx-auto">
                <div class="flex justify-between items-center mb-8">
                    <h2 class="text-3xl font-bold text-white">👥 Gestão de Pacientes</h2>
                    <button onclick="openPatientModal()" class="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg text-white font-semibold transition duration-300">
                        ➕ Novo Paciente
                    </button>
                </div>

                <div class="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                    <div class="p-6">
                        <h3 class="text-xl font-semibold text-white mb-4">Lista de Pacientes</h3>
                        <div id="patientsList">
                            ${renderPatientsList()}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal de Paciente -->
        <div id="patientModal" class="hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div class="bg-gray-800 p-8 rounded-xl w-full max-w-2xl border border-gray-700">
                <h3 class="text-2xl font-bold text-white mb-6">Novo Paciente</h3>
                
                <form onsubmit="savePatient(event)" class="space-y-4">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-300 mb-2">Nome Completo</label>
                            <input type="text" id="patientName" class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white text-base" required>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-300 mb-2">Data de Nascimento</label>
                            <input type="date" id="patientBirthDate" class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white text-base" required>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-300 mb-2">Telefone</label>
                            <input type="tel" id="patientPhone" class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white text-base" required>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-300 mb-2">Email</label>
                            <input type="email" id="patientEmail" class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white text-base">
                        </div>
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-300 mb-2">Endereço</label>
                        <textarea id="patientAddress" rows="3" class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white text-base"></textarea>
                    </div>

                    <div class="flex justify-end space-x-4 pt-6">
                        <button type="button" onclick="closePatientModal()" class="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition duration-300">
                            Cancelar
                        </button>
                        <button type="submit" class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition duration-300">
                            Salvar Paciente
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;
}

/**
 * Renderizar lista de pacientes
 */
function renderPatientsList() {
    const patients = DataPersistence.getPatients() || [];

    if (patients.length === 0) {
        return `
            <div class="text-center py-8">
                <div class="text-4xl mb-4">👥</div>
                <p class="text-gray-400">Nenhum paciente cadastrado</p>
                <button onclick="openPatientModal()" class="mt-4 bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg text-white font-semibold transition duration-300">
                    Cadastrar Primeiro Paciente
                </button>
            </div>
        `;
    }

    return patients.map(patient => `
        <div class="flex items-center justify-between p-4 bg-gray-700 rounded-lg mb-3 hover:bg-gray-600 transition duration-300">
            <div class="flex items-center space-x-4">
                <div class="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                    <span class="text-white font-semibold">${patient.name.split(' ').map(n => n[0]).join('').substring(0, 2)}</span>
                </div>
                <div>
                    <h4 class="text-white font-semibold">${patient.name}</h4>
                    <p class="text-gray-400 text-sm">${patient.email || 'Email não informado'} • ${patient.phone || 'Telefone não informado'}</p>
                    <p class="text-gray-500 text-xs">Última consulta: ${new Date(patient.lastVisit).toLocaleDateString('pt-BR')}</p>
                </div>
            </div>
            <div class="flex space-x-2">
                <button onclick="openPatientDetails(${patient.id})" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition duration-300">
                    Ver Detalhes
                </button>
            </div>
        </div>
    `).join('');
}

/**
 * Renderizar outras páginas
 */
function renderReports() {
    return renderPlaceholder('📊 Relatórios', 'Módulo de relatórios em desenvolvimento');
}

function renderSettings() {
    return renderPlaceholder('⚙️ Configurações', 'Módulo de configurações em desenvolvimento');
}

function renderPlaceholder(title, description) {
    return `
        <div class="flex items-center justify-center min-h-screen bg-gray-900">
            <div class="text-center">
                <div class="text-6xl mb-4">🚧</div>
                <h2 class="text-3xl font-bold text-white mb-2">${title}</h2>
                <p class="text-gray-400 text-lg">${description}</p>
            </div>
        </div>
    `;
}

// ============================================================================
// FUNÇÕES DE GERENCIAMENTO DE PACIENTES
// ============================================================================

function openPatientModal() {
    const modal = document.getElementById('patientModal');
    if (modal) modal.classList.remove('hidden');
}

function closePatientModal() {
    const modal = document.getElementById('patientModal');
    if (modal) modal.classList.add('hidden');
    clearPatientForm();
}

function savePatient(event) {
    event.preventDefault();
    
    const patientData = {
        id: Date.now(),
        name: document.getElementById('patientName').value,
        birthDate: document.getElementById('patientBirthDate').value,
        phone: document.getElementById('patientPhone').value,
        email: document.getElementById('patientEmail').value,
        address: document.getElementById('patientAddress').value,
        createdAt: new Date().toISOString(),
        lastVisit: new Date().toISOString().split('T')[0]
    };

    DataPersistence.savePatient(patientData);
    closePatientModal();
    
    if (currentTab === 'patients') {
        loadTabContent('patients');
    }

    UI.showAlert('✅ Paciente Salvo', `Paciente ${patientData.name} cadastrado com sucesso!`);
}

function clearPatientForm() {
    ['patientName', 'patientBirthDate', 'patientPhone', 'patientEmail', 'patientAddress'].forEach(id => {
        const element = document.getElementById(id);
        if (element) element.value = '';
    });
}

// ============================================================================
// INICIALIZAÇÃO
// ============================================================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Inicializando DentalCore Pro v2.0.0...');
    
    // Inicializar módulos
document.addEventListener('DOMContentLoaded', function() {
    // Usar AuthComplete em vez de SimpleAuth
    if (typeof AuthComplete !== 'undefined') {
        AuthComplete.init();
        
        // Verificar se usuário já está logado
        if (AuthComplete.checkLoggedUser()) {
            document.getElementById('loginScreen').style.display = 'none';
            document.getElementById('mainApp').style.display = 'block';
            AuthComplete.updateUserInterface();
            showTab('dashboard');
        } else {
            // Renderizar interface de login/cadastro
            document.getElementById('loginScreen').innerHTML = AuthComplete.renderAuthInterface();
        }
    }
    
    // Outros módulos...
    if (typeof DataPersistence !== 'undefined') DataPersistence.init();
    if (typeof UI !== 'undefined') UI.init();
    if (typeof FirebaseSync !== 'undefined') FirebaseSync.init();
});
    
    // Inicializar módulos premium
    if (typeof Anamnese !== 'undefined') Anamnese.init();
    if (typeof Tratamentos !== 'undefined') Tratamentos.init();
    if (typeof Imagens !== 'undefined') Imagens.init();
    if (typeof DebitosProfissional !== 'undefined') DebitosProfissional.init();
    if (typeof DocumentosProfissional !== 'undefined') DocumentosProfissional.init();
    if (typeof RelatoriosPremium !== 'undefined') RelatoriosPremium.init();
    if (typeof ConfiguracoesSystem !== 'undefined') ConfiguracoesSystem.init();
    if (typeof FirebaseSync !== 'undefined') FirebaseSync.init();  
    if (typeof GoogleCalendarSync !== 'undefined') GoogleCalendarSync.init();

    // Verificar se já está logado
    if (SimpleAuth && SimpleAuth.isLoggedIn()) {
        document.getElementById('loginScreen').classList.add('hidden');
        document.getElementById('mainApp').classList.remove('hidden');
        SimpleAuth.updateUserInterface();
        showTab('dashboard');
    }

    // Exportar para uso global
    window.currentTab = currentTab;
    window.currentPatient = currentPatient;
    window.currentPatientTab = currentPatientTab;
});

// Exportar funções globais para compatibilidade
window.showTab = showTab;
window.openPatientDetails = openPatientDetails;
window.showPatientTab = showPatientTab;

console.log('✅ App principal carregado com Prontuário Completo integrado!');
