// ============================================================================
// DENTALCORE PRO - MÓDULO DE PERSISTÊNCIA CENTRALIZADO
// Ponto de acesso unificado para todas as operações de banco de dados e dados de demonstração
// ============================================================================

const DataPersistence = {
    // Flag para usar a memória temporária se o localStorage não estiver disponível
    useMemoryStorage: false,
    memoryStorage: {},

    /**
     * Inicializar o módulo
     */
    init() {
        console.log('💾 Módulo de persistência inicializado');
        this.checkStorage();
        this.createDefaultData();
    },

    /**
     * Verificar se o localStorage está disponível e acessível
     */
    checkStorage() {
        try {
            var test = 'dentalcore_test';
            localStorage.setItem(test, 'test');
            localStorage.removeItem(test);
            this.useMemoryStorage = false;
        } catch (e) {
            console.warn('LocalStorage não disponível, usando memoria temporária.');
            this.useMemoryStorage = true;
            this.memoryStorage = {};
        }
    },

    /**
     * Obter dados do storage, com prefixo 'dentalcore_'
     */
    getData(key) {
        if (this.useMemoryStorage) {
            return this.memoryStorage[key] || null;
        }
        try {
            var prefixedKey = 'dentalcore_' + key;
            var data = localStorage.getItem(prefixedKey);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('DataPersistence: Erro ao carregar dados:', error);
            return null;
        }
    },

    /**
     * Salvar dados no storage, com prefixo 'dentalcore_'
     */
    saveData(key, data) {
        if (this.useMemoryStorage) {
            this.memoryStorage[key] = data;
            return true;
        }
        try {
            var prefixedKey = 'dentalcore_' + key;
            localStorage.setItem(prefixedKey, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('DataPersistence: Erro ao salvar dados:', error);
            return false;
        }
    },

    /**
     * Método genérico save
     */
    save(key, data) {
        return this.saveData(key, data);
    },

    /**
     * Carregar lista de pacientes
     */
    getPatients() {
        var patients = this.getData('patients');
        return Array.isArray(patients) ? patients : [];
    },

    /**
     * Salvar lista de pacientes
     */
    savePatients(patients) {
        this.saveData('patients', patients);
        console.log('Pacientes salvos:', patients.length);
    },

    /**
     * Salvar paciente individual
     */
    savePatient(patient) {
        const patients = this.getPatients();
        patient.id = patient.id || Date.now();
        patients.push(patient);
        this.savePatients(patients);
    },

    /**
     * Obter anamnese de um paciente
     */
    getAnamnesis(patientId) {
        try {
            const key = `anamnesis_${patientId}`;
            return this.getData(key);
        } catch (e) {
            return null;
        }
    },

    /**
     * Salvar anamnese de um paciente
     */
    saveAnamnesis(patientId, anamnesis) {
        try {
            const key = `anamnesis_${patientId}`;
            this.saveData(key, anamnesis);
        } catch (e) {
            console.warn('Erro ao salvar anamnese:', e);
        }
    },

    /**
     * Obter lista de orçamentos
     */
    getBudgets() {
        var budgets = this.getData('budgets');
        return Array.isArray(budgets) ? budgets : [];
    },

    /**
     * Salvar lista de orçamentos
     */
    saveBudgets(budgets) {
        this.saveData('budgets', budgets);
        console.log('Orçamentos salvos:', budgets.length);
    },

    /**
     * Obter lista de tratamentos
     */
    getTreatments() {
        var treatments = this.getData('treatments');
        return Array.isArray(treatments) ? treatments : [];
    },

    /**
     * Salvar lista de tratamentos
     */
    saveTreatments(treatments) {
        this.saveData('treatments', treatments);
        console.log('Tratamentos salvos:', treatments.length);
    },

    /**
     * Criar dados de demonstração se não existirem
     */
    createDefaultData() {
        if (!this.getPatients().length) {
            const defaultPatients = [
                {
                    id: 1,
                    name: 'Maria Silva Santos',
                    birthDate: '1985-05-15',
                    phone: '(11) 99999-1234',
                    email: 'maria@email.com',
                    address: 'Rua das Flores, 123, São Paulo - SP',
                    createdAt: '2024-01-01T10:00:00.000Z',
                    lastVisit: '2024-01-15'
                },
                {
                    id: 2,
                    name: 'João Pedro Costa',
                    birthDate: '1990-08-22',
                    phone: '(11) 99999-5678',
                    email: 'joao@email.com',
                    address: 'Av. Paulista, 456, São Paulo - SP',
                    createdAt: '2024-01-02T11:00:00.000Z',
                    lastVisit: '2024-01-10'
                },
                {
                    id: 3,
                    name: 'Ana Carolina Lima',
                    birthDate: '1988-12-03',
                    phone: '(11) 99999-9012',
                    email: 'ana@email.com',
                    address: 'Rua da Liberdade, 789, São Paulo - SP',
                    createdAt: '2024-01-03T09:00:00.000Z',
                    lastVisit: '2024-01-08'
                }
            ];

            this.savePatients(defaultPatients);
        }
    },
    
    // Dados de demonstração
    getDemoPatients() {
        return [
            {
                id: 1,
                name: 'Maria Silva Santos',
                phone: '(11) 99999-1234',
                email: 'maria.santos@email.com',
                birthDate: '1990-05-15',
                lastVisit: '2023-11-20',
                status: 'ativo',
                notes: 'Paciente com histórico de sensibilidade nos dentes 24 e 25.',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: 2,
                name: 'João Pedro Costa',
                phone: '(21) 98888-5678',
                email: 'joao.costa@email.com',
                birthDate: '1985-02-20',
                lastVisit: '2024-01-10',
                status: 'ativo',
                notes: 'Necessário agendar retorno para avaliação de prótese.',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: 3,
                name: 'Ana Carolina Lima',
                phone: '(31) 97777-9012',
                email: 'ana.lima@email.com',
                birthDate: '1998-02-28',
                lastVisit: '2024-01-25',
                status: 'inativo',
                notes: 'Aguardando aprovação de orçamento para clareamento.',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }
        ];
    },
    
    getDemoBudgets() {
        return [
            {
                id: 1,
                patientId: 1,
                patientName: 'Maria Silva Santos',
                date: new Date().toISOString().split('T')[0],
                description: 'Limpeza e Profilaxia Dental',
                responsible: 'Dr. Pedro Silva',
                procedures: [
                    {
                        id: 1,
                        name: 'Limpeza e Profilaxia Dental',
                        category: 'Prevenção',
                        price: 150.00
                    }
                ],
                total: 150.00,
                status: 'rascunho',
                notes: 'Limpeza completa com orientações de higiene bucal.',
                createdAt: new Date().toISOString()
            }
        ];
    },

    getDemoTreatments() {
        return [
            { 
                id: 1, 
                patientId: 1, 
                patientName: 'Maria Silva Santos',
                description: 'Limpeza e Profilaxia', 
                status: 'concluido', 
                procedures: [{ name: 'Profilaxia' }], 
                treatmentPlan: [{ id: 1, name: 'Profilaxia' }],
                sessions: [],
                attachments: [],
                evolutionDiary: [],
                date: '2024-01-10',
                updatedAt: '2024-01-10',
                createdAt: '2024-01-10T10:00:00Z' 
            },
            { 
                id: 2, 
                patientId: 2, 
                patientName: 'João Pedro Costa',
                description: 'Restauração de Resina', 
                status: 'em-andamento', 
                procedures: [{ name: 'Restauração' }], 
                treatmentPlan: [{ id: 2, name: 'Restauração' }],
                sessions: [],
                attachments: [],
                evolutionDiary: [],
                date: '2024-02-15',
                updatedAt: '2024-02-15',
                createdAt: '2024-02-15T14:30:00Z' 
            }
        ];
    }
};

// Exportar para uso global
window.DataPersistence = DataPersistence;

console.log('Módulo DataPersistence carregado!');