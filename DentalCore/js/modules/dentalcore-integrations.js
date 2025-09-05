// ============================================================================
// DENTALCORE PRO - SISTEMA DE INTEGRAÇÕES
// Conecta todos os módulos para funcionalidades avançadas
// ============================================================================

const DentalCoreIntegrations = {
    
    /**
     * Inicialização das integrações
     */
    init() {
        console.log('🔗 Inicializando integrações do sistema...');
        this.setupOrçamentosIntegration();
        this.setupAgendaIntegration();
        this.setupDocumentosIntegration();
        this.setupTratamentosIntegration();
        console.log('✅ Integrações configuradas com sucesso!');
    },

    /**
     * Configurar integrações do módulo de orçamentos
     */
    setupOrçamentosIntegration() {
        if (typeof window.OrcamentosProfissional === 'undefined') return;

        // Sobrescrever função de aprovação
        const originalApprove = OrcamentosProfissional.approveQuote;
        OrcamentosProfissional.approveQuote = function(quoteId) {
            const quote = this.quotes.find(q => q.id === quoteId);
            if (quote) {
                quote.status = 'aprovado';
                quote.approvedAt = new Date().toISOString();
                
                // Gerar débitos automaticamente
                DentalCoreIntegrations.generateDebitsFromQuote(quote);
                
                // Gerar plano de tratamento
                DentalCoreIntegrations.generateTreatmentPlanFromQuote(quote);
                
                this.updateInterface();
                this.closeQuoteModal();
                
                this.showAlert('✅ Orçamento Aprovado', 
                    `Orçamento #${quote.number} aprovado com sucesso!\n\n` +
                    `Cliente: ${quote.patientName}\n` +
                    `Valor Total: R$ ${quote.finalTotal.toFixed(2)}\n` +
                    `Forma de Pagamento: ${quote.paymentMethod}\n\n` +
                    `💰 Débitos gerados automaticamente\n` +
                    `🦷 Plano de tratamento criado\n` +
                    `📅 Pronto para agendar consultas`
                );
            }
        };

        console.log('🔗 Integração Orçamentos configurada');
    },

    /**
     * Gerar débitos automaticamente a partir do orçamento aprovado
     */
    generateDebitsFromQuote(quote) {
        if (typeof window.DebitosProfissional === 'undefined') {
            console.warn('⚠️ Módulo de Débitos não encontrado');
            return;
        }

        try {
            const debits = [];
            const baseDate = new Date();
            
            // Calcular parcelas baseado na forma de pagamento
            const installments = this.calculateInstallments(quote);
            
            installments.forEach((installment, index) => {
                const dueDate = new Date(baseDate);
                dueDate.setMonth(baseDate.getMonth() + index);
                
                const debit = {
                    id: Date.now() + index,
                    description: `${installment.description} - Orçamento #${quote.number}`,
                    originalValue: installment.value,
                    remainingBalance: installment.value,
                    dueDate: dueDate.toISOString().split('T')[0],
                    status: 'aberto',
                    installment: `${index + 1}/${installments.length}`,
                    category: installment.category || 'Tratamento',
                    quoteId: quote.id,
                    patientId: quote.patientId,
                    patientName: quote.patientName,
                    createdAt: new Date().toISOString()
                };
                
                debits.push(debit);
            });

            // Adicionar débitos ao módulo
            this.addDebitsToSystem(debits);
            
            console.log(`✅ ${debits.length} débito(s) gerado(s) automaticamente`);
            
        } catch (error) {
            console.error('❌ Erro ao gerar débitos:', error);
        }
    },

    /**
     * Calcular parcelas baseado na forma de pagamento
     */
    calculateInstallments(quote) {
        const installments = [];
        const total = quote.finalTotal;
        
        // Extrair número de parcelas do campo de observações ou usar padrão
        let numParcelas = 1;
        if (quote.paymentMethod === 'cartao-credito' && quote.notes) {
            const match = quote.notes.match(/(\d+)x/);
            if (match) numParcelas = parseInt(match[1]);
        }
        
        switch (quote.paymentMethod) {
            case 'pix':
            case 'dinheiro':
                installments.push({
                    description: `Pagamento à vista - ${quote.procedures.map(p => p.name).join(', ')}`,
                    value: total,
                    category: 'Pagamento à vista'
                });
                break;
                
            case 'cartao-credito':
                const valorParcela = total / numParcelas;
                for (let i = 0; i < numParcelas; i++) {
                    installments.push({
                        description: `Cartão ${i + 1}/${numParcelas} - ${quote.procedures.map(p => p.name).slice(0, 2).join(', ')}`,
                        value: valorParcela,
                        category: 'Cartão de Crédito'
                    });
                }
                break;
                
            case 'boleto':
                const parcelasBoleto = Math.min(numParcelas, 6); // Máximo 6 boletos
                const valorParcelaBoleto = total / parcelasBoleto;
                for (let i = 0; i < parcelasBoleto; i++) {
                    installments.push({
                        description: `Boleto ${i + 1}/${parcelasBoleto} - ${quote.procedures.map(p => p.name).slice(0, 2).join(', ')}`,
                        value: valorParcelaBoleto,
                        category: 'Boleto'
                    });
                }
                break;
                
            default:
                // Por procedimento
                quote.procedures.forEach((procedure, index) => {
                    installments.push({
                        description: procedure.name,
                        value: procedure.total,
                        category: procedure.category || 'Tratamento'
                    });
                });
        }
        
        return installments;
    },

    /**
     * Adicionar débitos ao sistema financeiro
     */
    addDebitsToSystem(debits) {
        // Adicionar ao array de débitos do módulo
        DebitosProfissional.currentFinancial.debits = 
            DebitosProfissional.currentFinancial.debits.concat(debits);
        
        // Recalcular resumo financeiro
        DebitosProfissional.calculateFinancialSummary();
        
        // Atualizar base de dados (se necessário)
        DebitosProfissional.patientDebits = 
            DebitosProfissional.patientDebits.concat(debits);
    },

    /**
     * Gerar plano de tratamento a partir do orçamento
     */
    generateTreatmentPlanFromQuote(quote) {
        if (typeof window.TratamentosProfissional === 'undefined') {
            console.warn('⚠️ Módulo de Tratamentos não encontrado');
            return;
        }

        try {
            const treatmentPlan = {
                id: Date.now(),
                patientId: quote.patientId,
                patientName: quote.patientName,
                quoteId: quote.id,
                status: 'planejado',
                createdAt: new Date().toISOString(),
                procedures: quote.procedures.map((proc, index) => ({
                    id: Date.now() + index,
                    name: proc.name,
                    description: proc.description || '',
                    tooth: proc.tooth || '',
                    status: 'pendente',
                    priority: proc.priority || 'normal',
                    estimatedDuration: proc.duration || 60,
                    cost: proc.total,
                    notes: `Criado automaticamente do orçamento #${quote.number}`,
                    createdAt: new Date().toISOString()
                })),
                totalCost: quote.finalTotal,
                estimatedDuration: quote.procedures.reduce((total, proc) => total + (proc.duration || 60), 0),
                notes: `Plano gerado automaticamente do orçamento #${quote.number} aprovado em ${new Date().toLocaleDateString('pt-BR')}`
            };

            // Adicionar ao sistema de tratamentos
            this.addTreatmentPlanToSystem(treatmentPlan);
            
            console.log('✅ Plano de tratamento gerado automaticamente');
            
        } catch (error) {
            console.error('❌ Erro ao gerar plano de tratamento:', error);
        }
    },

    /**
     * Adicionar plano de tratamento ao sistema
     */
    addTreatmentPlanToSystem(treatmentPlan) {
        // Adicionar aos dados do módulo de tratamentos
        if (!TratamentosProfissional.treatmentPlans) {
            TratamentosProfissional.treatmentPlans = [];
        }
        TratamentosProfissional.treatmentPlans.push(treatmentPlan);
        
        // Adicionar procedimentos individuais
        treatmentPlan.procedures.forEach(procedure => {
            if (!TratamentosProfissional.currentTreatments) {
                TratamentosProfissional.currentTreatments = [];
            }
            TratamentosProfissional.currentTreatments.push({
                id: procedure.id,
                patientId: treatmentPlan.patientId,
                patientName: treatmentPlan.patientName,
                procedure: procedure.name,
                tooth: procedure.tooth,
                date: null, // Será definido quando agendar
                status: 'planejado',
                notes: procedure.notes,
                cost: procedure.cost,
                treatmentPlanId: treatmentPlan.id,
                quoteId: treatmentPlan.quoteId
            });
        });
    },

    /**
     * Configurar integrações da agenda
     */
    setupAgendaIntegration() {
        if (typeof window.AgendaProfissional === 'undefined') return;

        // Adicionar função para marcar procedimento como realizado
        AgendaProfissional.completeProcedure = function(appointmentId) {
            const appointment = this.currentSchedule.appointments.find(apt => apt.id === appointmentId);
            if (appointment) {
                appointment.status = 'concluido';
                
                // Marcar procedimento como realizado no tratamento
                DentalCoreIntegrations.markProcedureAsCompleted(appointment);
                
                // Gerar documentos automáticos (receituário, atestado, etc.)
                DentalCoreIntegrations.generatePostAppointmentDocuments(appointment);
                
                this.updateInterface();
                this.showAlert('✅ Procedimento Concluído', 
                    `Procedimento "${appointment.procedure}" marcado como concluído!\n\n` +
                    `📄 Documentos pós-consulta gerados automaticamente\n` +
                    `🦷 Status atualizado no plano de tratamento`
                );
            }
        };

        console.log('🔗 Integração Agenda configurada');
    },

    /**
     * Marcar procedimento como concluído no tratamento
     */
    markProcedureAsCompleted(appointment) {
        if (typeof window.TratamentosProfissional === 'undefined') return;

        // Encontrar e atualizar o procedimento correspondente
        const treatment = TratamentosProfissional.currentTreatments?.find(t => 
            t.procedure === appointment.procedure && 
            t.patientId === appointment.patientId &&
            t.status === 'planejado'
        );

        if (treatment) {
            treatment.status = 'concluido';
            treatment.completedAt = new Date().toISOString();
            treatment.actualDuration = appointment.duration;
            console.log('✅ Procedimento atualizado no plano de tratamento');
        }
    },

    /**
     * Gerar documentos automáticos pós-consulta
     */
    generatePostAppointmentDocuments(appointment) {
        if (typeof window.DocumentosProfissional === 'undefined') return;

        try {
            const documents = [];
            
            // Receituário automático (se aplicável)
            if (this.needsPrescription(appointment.procedure)) {
                documents.push({
                    id: Date.now(),
                    type: 'receituario',
                    title: `Receituário - ${appointment.procedure}`,
                    patientId: appointment.patientId,
                    patientName: appointment.patientName,
                    status: 'rascunho',
                    createdAt: new Date().toISOString(),
                    autoGenerated: true,
                    appointmentId: appointment.id
                });
            }

            // Atestado (se solicitado)
            if (appointment.notes && appointment.notes.toLowerCase().includes('atestado')) {
                documents.push({
                    id: Date.now() + 1,
                    type: 'atestado',
                    title: `Atestado Médico - ${appointment.patientName}`,
                    patientId: appointment.patientId,
                    patientName: appointment.patientName,
                    status: 'rascunho',
                    createdAt: new Date().toISOString(),
                    autoGenerated: true,
                    appointmentId: appointment.id
                });
            }

            // Orientações pós-operatórias
            if (this.needsPostOpInstructions(appointment.procedure)) {
                documents.push({
                    id: Date.now() + 2,
                    type: 'orientacoes',
                    title: `Orientações Pós-${appointment.procedure}`,
                    patientId: appointment.patientId,
                    patientName: appointment.patientName,
                    status: 'rascunho',
                    createdAt: new Date().toISOString(),
                    autoGenerated: true,
                    appointmentId: appointment.id
                });
            }

            // Adicionar documentos ao sistema
            documents.forEach(doc => this.addDocumentToSystem(doc));
            
            if (documents.length > 0) {
                console.log(`✅ ${documents.length} documento(s) gerado(s) automaticamente`);
            }
            
        } catch (error) {
            console.error('❌ Erro ao gerar documentos automáticos:', error);
        }
    },

    /**
     * Verificar se procedimento precisa de receituário
     */
    needsPrescription(procedure) {
        const proceduresNeedingPrescription = [
            'tratamento endodôntico',
            'extração dentária',
            'implante dentário',
            'cirurgia'
        ];
        
        return proceduresNeedingPrescription.some(p => 
            procedure.toLowerCase().includes(p)
        );
    },

    /**
     * Verificar se procedimento precisa de orientações pós-operatórias
     */
    needsPostOpInstructions(procedure) {
        const proceduresNeedingInstructions = [
            'extração',
            'implante',
            'cirurgia',
            'endodôntico'
        ];
        
        return proceduresNeedingInstructions.some(p => 
            procedure.toLowerCase().includes(p)
        );
    },

    /**
     * Adicionar documento ao sistema
     */
    addDocumentToSystem(document) {
        if (!DocumentosProfissional.documents) {
            DocumentosProfissional.documents = [];
        }
        DocumentosProfissional.documents.push(document);
    },

    /**
     * Configurar integrações de documentos
     */
    setupDocumentosIntegration() {
        if (typeof window.DocumentosProfissional === 'undefined') return;

        // Melhorar função de download com PDF real
        const originalDownload = DocumentosProfissional.downloadDocument;
        DocumentosProfissional.downloadDocument = function(docId) {
            const document = this.documents.find(d => d.id === docId);
            if (document) {
                DentalCoreIntegrations.generateRealPDF(document);
            }
        };

        console.log('🔗 Integração Documentos configurada');
    },

    /**
     * Gerar PDF real usando jsPDF (simulado para agora)
     */
    generateRealPDF(document) {
        try {
            // Simular geração de PDF real
            const content = this.generateDocumentContent(document);
            
            // Por enquanto, criar um blob de texto
            const blob = new Blob([content], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `${document.title.replace(/[^a-zA-Z0-9]/g, '_')}.txt`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            console.log('✅ Documento baixado com sucesso');
            
        } catch (error) {
            console.error('❌ Erro ao gerar PDF:', error);
        }
    },

    /**
     * Gerar conteúdo real do documento
     */
    generateDocumentContent(document) {
        const currentDate = new Date().toLocaleDateString('pt-BR');
        
        let content = `DENTALCORE PRO - CLÍNICA ODONTOLÓGICA\n`;
        content += `=======================================\n\n`;
        content += `DOCUMENTO: ${document.title}\n`;
        content += `PACIENTE: ${document.patientName}\n`;
        content += `DATA: ${currentDate}\n\n`;
        
        switch (document.type) {
            case 'receituario':
                content += `RECEITUÁRIO ODONTOLÓGICO\n\n`;
                content += `Paciente: ${document.patientName}\n`;
                content += `Data: ${currentDate}\n\n`;
                content += `PRESCRIÇÃO:\n`;
                content += `- [Medicamento a ser prescrito]\n`;
                content += `- [Dosagem e posologia]\n`;
                content += `- [Orientações de uso]\n\n`;
                content += `Assinatura e CRO do Dentista\n`;
                break;
                
            case 'atestado':
                content += `ATESTADO ODONTOLÓGICO\n\n`;
                content += `Atesto para os devidos fins que o(a) paciente ${document.patientName} `;
                content += `esteve sob meus cuidados profissionais em ${currentDate}, `;
                content += `necessitando de afastamento de suas atividades por motivo de tratamento odontológico.\n\n`;
                content += `Período recomendado: [a definir]\n\n`;
                content += `Assinatura e CRO do Dentista\n`;
                break;
                
            case 'orientacoes':
                content += `ORIENTAÇÕES PÓS-OPERATÓRIAS\n\n`;
                content += `Caro(a) paciente ${document.patientName},\n\n`;
                content += `Para uma melhor recuperação, siga as orientações abaixo:\n\n`;
                content += `• Aplicar gelo na região por 15 minutos, com intervalos de 15 minutos\n`;
                content += `• Evitar alimentos quentes nas primeiras 24 horas\n`;
                content += `• Não fazer bochechos vigorosos\n`;
                content += `• Tomar a medicação conforme prescrito\n`;
                content += `• Retornar em caso de dúvidas ou complicações\n\n`;
                content += `Em caso de emergência, entre em contato: [telefone]\n`;
                break;
                
            default:
                content += `Conteúdo do documento ${document.type}\n\n`;
                content += `[Conteúdo a ser preenchido]\n`;
        }
        
        content += `\n\n---\n`;
        content += `Documento gerado automaticamente pelo DentalCore Pro\n`;
        content += `Data de geração: ${currentDate}\n`;
        
        return content;
    },

    /**
     * Configurar integrações de tratamentos
     */
    setupTratamentosIntegration() {
        if (typeof window.TratamentosProfissional === 'undefined') return;

        // Adicionar função para agendar próxima sessão
        TratamentosProfissional.scheduleNextSession = function(treatmentId) {
            const treatment = this.currentTreatments?.find(t => t.id === treatmentId);
            if (treatment && typeof window.AgendaProfissional !== 'undefined') {
                // Pré-preencher dados na agenda
                AgendaProfissional.openNewAppointment();
                
                // Esperar um pouco para o modal abrir
                setTimeout(() => {
                    const patientSelect = document.getElementById('appointmentPatient');
                    const procedureSelect = document.getElementById('appointmentProcedure');
                    
                    if (patientSelect) {
                        patientSelect.value = treatment.patientId;
                        AgendaProfissional.updatePatientInfo();
                    }
                    
                    if (procedureSelect) {
                        // Encontrar procedimento similar
                        const procedureOption = Array.from(procedureSelect.options).find(opt => 
                            opt.text.toLowerCase().includes(treatment.procedure.toLowerCase())
                        );
                        if (procedureOption) {
                            procedureSelect.value = procedureOption.value;
                            AgendaProfissional.updateDurationSuggestion();
                        }
                    }
                }, 300);
            }
        };

        console.log('🔗 Integração Tratamentos configurada');
    }
};

// Auto-inicializar quando todos os módulos estiverem carregados
document.addEventListener('DOMContentLoaded', function() {
    // Aguardar um pouco para garantir que todos os módulos foram carregados
    setTimeout(() => {
        DentalCoreIntegrations.init();
    }, 500);
});

// Exportar para uso global
window.DentalCoreIntegrations = DentalCoreIntegrations;

console.log('🔗 Sistema de Integrações DentalCore carregado!');