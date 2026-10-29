import { useState } from 'react';
import './App.css';

const formClienteInicial = {
  cpf: '',
  nome: '',
  email: '',
  telefone: '',
  dataNasc: '',
  sexo: 'Masculino',
  mktEmail: false,
  mktWhats: false,
  mktLigacao: false,
  preferencia: 'Produtos'
};

export default function App() {
  // Navegação Principal entre Módulos
  const [telaAtiva, setTelaAtiva] = useState('cadastros');

  // Sub-navegação para a aba "Entrada & Formulários"
  // Opções: 'cliente' | 'venda' | 'manifestacao'
  const [subAbaCadastros, setSubAbaCadastros] = useState('cliente');

  // =========================================================================
  // BANCO DE DADOS EM MEMÓRIA (TABELAS RELACIONAIS)
  // =========================================================================

  const [clientes, setClientes] = useState([
    {
      id: 1,
      cpf: '12345678900',
      nome: 'Ana Silva',
      email: 'ana@email.com',
      telefone: '11999998888',
      dataNasc: '1995-10-23',
      sexo: 'Feminino',
      mktEmail: true,
      mktWhats: true,
      mktLigacao: false,
      preferencia: 'Produtos'
    },
    {
      id: 2,
      cpf: '98765432100',
      nome: 'Carlos Eduardo',
      email: 'carlos@email.com',
      telefone: '11988887777',
      dataNasc: '1988-10-25',
      sexo: 'Masculino',
      mktEmail: true,
      mktWhats: true,
      mktLigacao: true,
      preferencia: 'Serviços'
    }
  ]);

  const [vendas, setVendas] = useState([
    {
      id: 101,
      idCliente: 1,
      data: '2026-10-20',
      produto: 'Notebook Pro',
      valor: '5200.00',
      formaPagamento: 'Pix',
      funcionario: 'Carlos Vendedor'
    }
  ]);

  const [manifestacoes, setManifestacoes] = useState([
    {
      id: 501,
      idCliente: 1,
      dataRegistro: '2026-10-21',
      dataFinalizacao: '2026-10-25',
      prazo: '2026-10-28',
      tipo: 'Reclamação',
      meio: 'WhatsApp',
      texto: 'O carregador esquenta muito durante o uso prolongado.',
      classificacao: 'Produto',
      idPedido: 101,
      funcionarioEnvolvido: 'Carlos Vendedor',
      responsavel: 'Gerente Marcos',
      parecerGerente: 'Substituição da fonte de alimentação realizada em garantia diretamente na assistência técnica autorizada.',
      status: 'Finalizado',
      autorizadoRetorno: true
    },
    {
      id: 502,
      idCliente: 2,
      dataRegistro: '2026-10-26',
      dataFinalizacao: '-',
      prazo: '2026-11-02',
      tipo: 'Reclamação',
      meio: 'Telefone',
      texto: 'Demora no retorno sobre o orçamento do conserto da placa.',
      classificacao: 'Comportamental',
      idPedido: null,
      funcionarioEnvolvido: 'Felipe Atendente',
      responsavel: 'Gerente Marcos',
      parecerGerente: '',
      status: 'Em Tratamento',
      autorizadoRetorno: true
    }
  ]);

  // =========================================================================
  // ESTADOS DOS FORMULÁRIOS
  // =========================================================================

  const [formCliente, setFormCliente] = useState(formClienteInicial);
  const [editandoClienteId, setEditandoClienteId] = useState(null);
  const [buscaCliente, setBuscaCliente] = useState('');

  const [formVenda, setFormVenda] = useState({
    idCliente: '',
    produto: '',
    valor: '',
    formaPagamento: 'Pix',
    funcionario: '',
    data: ''
  });

  const [formManifestacao, setFormManifestacao] = useState({
    idCliente: '',
    tipo: 'Reclamação',
    meio: 'Telefone',
    texto: '',
    classificacao: 'Comportamental',
    idPedido: '',
    funcionarioEnvolvido: '',
    responsavel: '',
    autorizadoRetorno: false,
    termoLgpd: false
  });

  // Estado para o Modal de Parecer do Gerente (Finalização)
  const [modalParecer, setModalParecer] = useState({
    aberto: false,
    manifestacaoId: null,
    gerenteNome: '',
    textoParecer: ''
  });

  // =========================================================================
  // CRUD DE CLIENTES
  // =========================================================================

  const salvarCliente = (e) => {
    e.preventDefault();

    const cpfLimpo = formCliente.cpf.replace(/\D/g, '');
    const cpfDuplicado = clientes.some(
      c => c.cpf.replace(/\D/g, '') === cpfLimpo && c.id !== editandoClienteId
    );

    if (cpfDuplicado) {
      alert('Atenção: Já existe outro cliente cadastrado com este CPF!');
      return;
    }

    if (editandoClienteId) {
      setClientes(clientes.map(c =>
        c.id === editandoClienteId ? { ...formCliente, id: editandoClienteId } : c
      ));
      alert('Cadastro do cliente atualizado com sucesso!');
      setEditandoClienteId(null);
    } else {
      const novo = {
        ...formCliente,
        id: clientes.length > 0 ? Math.max(...clientes.map(c => c.id)) + 1 : 1
      };
      setClientes([...clientes, novo]);
      alert('Cliente cadastrado com sucesso!');
    }

    setFormCliente(formClienteInicial);
  };

  const iniciarEdicao = (cli) => {
    setEditandoClienteId(cli.id);
    setFormCliente({
      cpf: cli.cpf,
      nome: cli.nome,
      email: cli.email,
      telefone: cli.telefone,
      dataNasc: cli.dataNasc,
      sexo: cli.sexo,
      mktEmail: cli.mktEmail,
      mktWhats: cli.mktWhats,
      mktLigacao: cli.mktLigacao,
      preferencia: cli.preferencia
    });
    window.scrollTo({ top: 180, behavior: 'smooth' });
  };

  const cancelarEdicao = () => {
    setEditandoClienteId(null);
    setFormCliente(formClienteInicial);
  };

  const excluirCliente = (id) => {
    const comprasDoCliente = vendas.filter(v => v.idCliente === id);
    const manifestacoesDoCliente = manifestacoes.filter(m => m.idCliente === id);

    if (comprasDoCliente.length > 0 || manifestacoesDoCliente.length > 0) {
      alert(
        `Não é possível excluir este cliente!\n` +
        `Motivo: Existem ${comprasDoCliente.length} venda(s) e ${manifestacoesDoCliente.length} ocorrência(s) de Ouvidoria associadas a ele.`
      );
      return;
    }

    if (window.confirm('Tem certeza de que deseja remover este cliente permanentemente?')) {
      setClientes(clientes.filter(c => c.id !== id));
      if (editandoClienteId === id) {
        cancelarEdicao();
      }
      alert('Cliente excluído com sucesso!');
    }
  };

  const clientesFiltrados = clientes.filter(c =>
    c.nome.toLowerCase().includes(buscaCliente.toLowerCase()) ||
    c.cpf.includes(buscaCliente)
  );

  // =========================================================================
  // VENDAS / SERVIÇOS EFETIVADOS
  // =========================================================================

  const salvarVenda = (e) => {
    e.preventDefault();
    if (!formVenda.idCliente) {
      alert('Selecione um cliente para vincular à venda!');
      return;
    }
    const nova = {
      ...formVenda,
      id: vendas.length > 0 ? Math.max(...vendas.map(v => v.id)) + 1 : 101,
      idCliente: Number(formVenda.idCliente)
    };
    setVendas([...vendas, nova]);
    alert('Venda/Serviço registrado com sucesso!');
    setFormVenda({
      idCliente: '',
      produto: '',
      valor: '',
      formaPagamento: 'Pix',
      funcionario: '',
      data: ''
    });
  };

  // =========================================================================
  // MANIFESTAÇÕES (SAC / OUVIDORIA)
  // =========================================================================

  // Preenchimento inteligente ao vincular ID do pedido
  const handleVincularPedido = (idPedidoVal) => {
    let funcEnvolvido = formManifestacao.funcionarioEnvolvido;
    if (idPedidoVal) {
      const vendaSel = vendas.find(v => v.id === Number(idPedidoVal));
      if (vendaSel && vendaSel.funcionario) {
        funcEnvolvido = vendaSel.funcionario;
      }
    }
    setFormManifestacao({
      ...formManifestacao,
      idPedido: idPedidoVal,
      funcionarioEnvolvido: funcEnvolvido
    });
  };

  const salvarManifestacao = (e) => {
    e.preventDefault();
    if (!formManifestacao.idCliente) {
      alert('Selecione um cliente para vincular à manifestação!');
      return;
    }
    if (!formManifestacao.funcionarioEnvolvido.trim()) {
      alert('Por favor, informe o nome do funcionário envolvido no caso!');
      return;
    }
    if (!formManifestacao.responsavel.trim()) {
      alert('Por favor, informe o gerente responsável pelo tratamento!');
      return;
    }
    if (!formManifestacao.termoLgpd) {
      alert('É obrigatório obter o consentimento LGPD para registrar a manifestação!');
      return;
    }

    const hoje = new Date().toISOString().split('T')[0];
    const dataPrazo = new Date();
    dataPrazo.setDate(dataPrazo.getDate() + 7);
    const prazoFormatado = dataPrazo.toISOString().split('T')[0];

    const nova = {
      ...formManifestacao,
      id: manifestacoes.length > 0 ? Math.max(...manifestacoes.map(m => m.id)) + 1 : 501,
      idCliente: Number(formManifestacao.idCliente),
      idPedido: formManifestacao.idPedido ? Number(formManifestacao.idPedido) : null,
      funcionarioEnvolvido: formManifestacao.funcionarioEnvolvido.trim(),
      responsavel: formManifestacao.responsavel.trim(),
      parecerGerente: '',
      dataRegistro: hoje,
      dataFinalizacao: '-',
      status: 'Em Tratamento',
      prazo: prazoFormatado
    };

    setManifestacoes([...manifestacoes, nova]);
    alert(`Manifestação registrada sob o Protocolo #${nova.id} com status 'Em Tratamento'!`);
    setFormManifestacao({
      idCliente: '',
      tipo: 'Reclamação',
      meio: 'Telefone',
      texto: '',
      classificacao: 'Comportamental',
      idPedido: '',
      funcionarioEnvolvido: '',
      responsavel: '',
      autorizadoRetorno: false,
      termoLgpd: false
    });
  };

  // Abrir o modal para o Gerente registrar o parecer de finalização
  const abrirModalFinalizar = (m) => {
    setModalParecer({
      aberto: true,
      manifestacaoId: m.id,
      gerenteNome: m.responsavel || '',
      textoParecer: m.parecerGerente || ''
    });
  };

  // Salvar Parecer do Gerente e mudar status para 'Finalizado'
  const confirmarFinalizacaoComParecer = (e) => {
    e.preventDefault();
    if (!modalParecer.textoParecer.trim()) {
      alert('O parecer técnico do gerente é obrigatório para finalizar a manifestação!');
      return;
    }
    if (modalParecer.textoParecer.length > 250) {
      alert('O parecer não pode exceder 250 caracteres!');
      return;
    }

    const hoje = new Date().toISOString().split('T')[0];

    setManifestacoes(manifestacoes.map(m =>
      m.id === modalParecer.manifestacaoId
        ? {
            ...m,
            status: 'Finalizado',
            dataFinalizacao: hoje,
            responsavel: modalParecer.gerenteNome.trim() || m.responsavel,
            parecerGerente: modalParecer.textoParecer.trim()
          }
        : m
    ));

    alert(`Manifestação #${modalParecer.manifestacaoId} finalizada com sucesso! Parecer registrado no relatório.`);
    setModalParecer({ aberto: false, manifestacaoId: null, gerenteNome: '', textoParecer: '' });
  };

  // =========================================================================
  // MÓDULO MARKETING
  // =========================================================================

  const aniversariantesDoMes = clientes.filter(c => {
    if (!c.dataNasc) return false;
    const mesNasc = Number(c.dataNasc.split('-')[1]);
    const mesAtual = new Date().getMonth() + 1;
    return mesNasc === mesAtual && (c.mktEmail || c.mktWhats);
  });

  const clientesPorPreferencia = (tipo) =>
    clientes.filter(c => c.preferencia === tipo && (c.mktEmail || c.mktWhats || c.mktLigacao));

  return (
    <div className="app-container">
      <header>
        <h1>CLI-action</h1>
        <p>Controle Integrado de Atendimento, Ouvidoria e Marketing de Retenção</p>
      </header>

      {/* Navegação de Abas Principais */}
      <nav>
        <button
          className={telaAtiva === 'cadastros' ? 'active' : ''}
          onClick={() => setTelaAtiva('cadastros')}
        >
          📝 Entrada & Formulários
        </button>
        <button
          className={telaAtiva === 'marketing' ? 'active' : ''}
          onClick={() => setTelaAtiva('marketing')}
        >
          🎯 Automação Marketing
        </button>
        <button
          className={telaAtiva === 'relatorios' ? 'active' : ''}
          onClick={() => setTelaAtiva('relatorios')}
        >
          📊 Relatório de Auditoria & Ouvidoria
        </button>
      </nav>

      {/* ========================================================
          TELA 1: ENTRADA & FORMULÁRIOS (COM SUB-ABAS)
         ======================================================== */}
      {telaAtiva === 'cadastros' && (
        <div className="modulo-cadastros-container">
          {/* Sub-navegação interna das 3 sub-pastas de formulários */}
          <div className="sub-nav-container">
            <button
              type="button"
              className={`sub-nav-btn ${subAbaCadastros === 'cliente' ? 'active' : ''}`}
              onClick={() => setSubAbaCadastros('cliente')}
            >
              👤 Cadastro & Gestão de Clientes
            </button>
            <button
              type="button"
              className={`sub-nav-btn ${subAbaCadastros === 'venda' ? 'active' : ''}`}
              onClick={() => setSubAbaCadastros('venda')}
            >
              🛒 Formulário Serviço / Venda Efetivada
            </button>
            <button
              type="button"
              className={`sub-nav-btn ${subAbaCadastros === 'manifestacao' ? 'active' : ''}`}
              onClick={() => setSubAbaCadastros('manifestacao')}
            >
              📢 Formulário Único de Manifestação (SAC / Ouvidoria)
            </button>
          </div>

          {/* SUB-ABA 1: CADASTRO E GERENCIAMENTO DE CLIENTES */}
          {subAbaCadastros === 'cliente' && (
            <div className="sub-aba-content">
              {/* Formulário de Cadastro / Edição do Cliente */}
              <div className="view-card full-width">
                <div className="card-header-flex">
                  <h2>{editandoClienteId ? `✏️ Editar Cliente (#${editandoClienteId})` : 'Cadastro do Cliente'}</h2>
                  {editandoClienteId && (
                    <button type="button" className="btn-cancel" onClick={cancelarEdicao}>
                      Cancelar Edição
                    </button>
                  )}
                </div>

                <form onSubmit={salvarCliente} className="form-grid">
                  <div className="form-group">
                    <label>CPF (Chave Única)</label>
                    <input
                      type="text"
                      required
                      placeholder="000.000.000-00"
                      value={formCliente.cpf}
                      onChange={e => setFormCliente({ ...formCliente, cpf: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Nome Completo</label>
                    <input
                      type="text"
                      required
                      placeholder="Nome do cliente"
                      value={formCliente.nome}
                      onChange={e => setFormCliente({ ...formCliente, nome: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>E-mail</label>
                    <input
                      type="email"
                      required
                      placeholder="cliente@email.com"
                      value={formCliente.email}
                      onChange={e => setFormCliente({ ...formCliente, email: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Telefone / WhatsApp</label>
                    <input
                      type="tel"
                      required
                      placeholder="(00) 00000-0000"
                      value={formCliente.telefone}
                      onChange={e => setFormCliente({ ...formCliente, telefone: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Data de Nascimento</label>
                    <input
                      type="date"
                      required
                      value={formCliente.dataNasc}
                      onChange={e => setFormCliente({ ...formCliente, dataNasc: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Sexo</label>
                    <select
                      value={formCliente.sexo}
                      onChange={e => setFormCliente({ ...formCliente, sexo: e.target.value })}
                    >
                      <option value="Masculino">Masculino</option>
                      <option value="Feminino">Feminino</option>
                      <option value="Não Informar">Não Informar</option>
                    </select>
                  </div>

                  <div className="form-group full-width">
                    <label>Preferência de Compra (Foco Marketing)</label>
                    <select
                      value={formCliente.preferencia}
                      onChange={e => setFormCliente({ ...formCliente, preferencia: e.target.value })}
                    >
                      <option value="Produtos">Produtos</option>
                      <option value="Serviços">Serviços</option>
                    </select>
                  </div>

                  <div className="marketing-section full-width">
                    <label className="section-title">Autorizações de Comunicação (LGPD / MKT):</label>
                    <div className="checkbox-row">
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={formCliente.mktEmail}
                          onChange={e => setFormCliente({ ...formCliente, mktEmail: e.target.checked })}
                        />
                        E-mail
                      </label>
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={formCliente.mktWhats}
                          onChange={e => setFormCliente({ ...formCliente, mktWhats: e.target.checked })}
                        />
                        WhatsApp
                      </label>
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={formCliente.mktLigacao}
                          onChange={e => setFormCliente({ ...formCliente, mktLigacao: e.target.checked })}
                        />
                        Ligações
                      </label>
                    </div>
                  </div>

                  <div className="full-width action-buttons-form">
                    <button type="submit" className={`btn-submit ${editandoClienteId ? 'btn-update' : ''}`}>
                      {editandoClienteId ? 'Salvar Alterações do Cliente' : 'Salvar Cadastro Cliente'}
                    </button>
                    {editandoClienteId && (
                      <button type="button" className="btn-cancel-large" onClick={cancelarEdicao}>
                        Cancelar
                      </button>
                    )}
                  </div>
                </form>
              </div>

              {/* Gerenciamento de Clientes Cadastrados (CRUD Read / Update / Delete) */}
              <div className="view-card full-width">
                <div className="report-header">
                  <div>
                    <h2>👥 Gerenciamento de Clientes Cadastrados ({clientes.length})</h2>
                    <p className="subtitle">Visualize, edite ou exclua clientes respeitando as regras de integridade</p>
                  </div>
                  <div className="search-box">
                    <input
                      type="text"
                      placeholder="🔎 Buscar por Nome ou CPF..."
                      value={buscaCliente}
                      onChange={e => setBuscaCliente(e.target.value)}
                      className="input-search"
                    />
                  </div>
                </div>

                <div className="table-responsive">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Nome / CPF</th>
                        <th>Contatos</th>
                        <th>Nasc. / Sexo</th>
                        <th>Foco MKT</th>
                        <th>Canais Autorizados</th>
                        <th>Histórico Vinculado</th>
                        <th>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {clientesFiltrados.length > 0 ? (
                        clientesFiltrados.map(cli => {
                          const totalCompras = vendas.filter(v => v.idCliente === cli.id).length;
                          const totalManifestacoes = manifestacoes.filter(m => m.idCliente === cli.id).length;

                          return (
                            <tr key={cli.id} className={editandoClienteId === cli.id ? 'row-editing' : ''}>
                              <td><strong>#{cli.id}</strong></td>
                              <td>
                                <strong>{cli.nome}</strong>
                                <div className="sub-text">CPF: {cli.cpf}</div>
                              </td>
                              <td>
                                <div>{cli.email}</div>
                                <div className="sub-text">{cli.telefone}</div>
                              </td>
                              <td>
                                <div>{cli.dataNasc}</div>
                                <div className="sub-text">{cli.sexo}</div>
                              </td>
                              <td>
                                <span className="badge-class">{cli.preferencia}</span>
                              </td>
                              <td>
                                <div className="badges-canais">
                                  {cli.mktEmail && <span className="mini-badge ok">E-mail</span>}
                                  {cli.mktWhats && <span className="mini-badge ok">Whats</span>}
                                  {cli.mktLigacao && <span className="mini-badge ok">Ligação</span>}
                                  {!cli.mktEmail && !cli.mktWhats && !cli.mktLigacao && (
                                    <span className="mini-badge none">Nenhum</span>
                                  )}
                                </div>
                              </td>
                              <td>
                                <div className="sub-text">🛒 {totalCompras} venda(s)</div>
                                <div className="sub-text">📢 {totalManifestacoes} manifestação(ões)</div>
                              </td>
                              <td>
                                <div className="action-buttons">
                                  <button
                                    type="button"
                                    className="btn-table btn-warn"
                                    title="Editar Cliente"
                                    onClick={() => iniciarEdicao(cli)}
                                  >
                                    ✏️ Editar
                                  </button>
                                  <button
                                    type="button"
                                    className="btn-table btn-danger"
                                    title="Excluir Cliente"
                                    onClick={() => excluirCliente(cli.id)}
                                  >
                                    🗑️ Excluir
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan="8" style={{ textAlign: 'center', padding: '24px' }} className="text-muted">
                            Nenhum cliente encontrado com os critérios de busca.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* SUB-ABA 2: FORMULÁRIO SERVIÇO / VENDA EFETIVADA */}
          {subAbaCadastros === 'venda' && (
            <div className="sub-aba-content">
              <div className="view-card full-width">
                <h2>🛒 Formulário de Serviço / Venda Efetivada</h2>
                <p className="subtitle">Registre uma transação comercial para gerar histórico e vincular garantias</p>

                <form onSubmit={salvarVenda} className="form-grid">
                  <div className="form-group full-width">
                    <label>Vincular Cliente</label>
                    <select
                      required
                      value={formVenda.idCliente}
                      onChange={e => setFormVenda({ ...formVenda, idCliente: e.target.value })}
                    >
                      <option value="">-- Escolha o Cliente Cadastrado --</option>
                      {clientes.map(c => (
                        <option key={c.id} value={c.id}>
                          {c.nome} (CPF: {c.cpf})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group full-width">
                    <label>Descrição do Produto / Serviço</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Consultoria em TI, Notebook Pro, Manutenção Preventiva..."
                      value={formVenda.produto}
                      onChange={e => setFormVenda({ ...formVenda, produto: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Valor Transacionado (R$)</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      placeholder="0.00"
                      value={formVenda.valor}
                      onChange={e => setFormVenda({ ...formVenda, valor: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Forma de Pagamento</label>
                    <select
                      value={formVenda.formaPagamento}
                      onChange={e => setFormVenda({ ...formVenda, formaPagamento: e.target.value })}
                    >
                      <option value="Pix">Pix</option>
                      <option value="Cartão">Cartão</option>
                      <option value="Boleto">Boleto</option>
                      <option value="Dinheiro">Dinheiro</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Funcionário Vendedor / Técnico Executor</label>
                    <input
                      type="text"
                      required
                      placeholder="Nome do funcionário que realizou a venda"
                      value={formVenda.funcionario}
                      onChange={e => setFormVenda({ ...formVenda, funcionario: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Data da Transação</label>
                    <input
                      type="date"
                      required
                      value={formVenda.data}
                      onChange={e => setFormVenda({ ...formVenda, data: e.target.value })}
                    />
                  </div>

                  <button type="submit" className="btn-submit full-width">
                    Registrar Serviço / Venda Efetivada
                  </button>
                </form>
              </div>

              {/* Tabela de Vendas Registradas */}
              <div className="view-card full-width">
                <h2>📑 Histórico de Transações Comerciais Registradas ({vendas.length})</h2>
                <div className="table-responsive">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>ID Venda</th>
                        <th>Cliente</th>
                        <th>Item / Serviço</th>
                        <th>Valor</th>
                        <th>Pagamento</th>
                        <th>Funcionário</th>
                        <th>Data</th>
                      </tr>
                    </thead>
                    <tbody>
                      {vendas.map(v => {
                        const cli = clientes.find(c => c.id === v.idCliente);
                        return (
                          <tr key={v.id}>
                            <td><strong>#{v.id}</strong></td>
                            <td>{cli ? cli.nome : `Cliente #${v.idCliente}`}</td>
                            <td>{v.produto}</td>
                            <td><strong>R$ {parseFloat(v.valor).toFixed(2)}</strong></td>
                            <td>{v.formaPagamento}</td>
                            <td>{v.funcionario}</td>
                            <td>{v.data}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* SUB-ABA 3: FORMULÁRIO ÚNICO DE MANIFESTAÇÃO (SAC / OUVIDORIA) */}
          {subAbaCadastros === 'manifestacao' && (
            <div className="sub-aba-content">
              <div className="view-card full-width">
                <h2>📢 Formulário Único de Manifestação (SAC / Ouvidoria)</h2>
                <p className="subtitle">
                  Abertura de ocorrência com identificação explícita do <strong>Funcionário Envolvido</strong> e do <strong>Gerente Responsável</strong> pelo caso
                </p>

                <form onSubmit={salvarManifestacao} className="form-grid">
                  <div className="form-group">
                    <label>Cliente Solicitante</label>
                    <select
                      required
                      value={formManifestacao.idCliente}
                      onChange={e => setFormManifestacao({ ...formManifestacao, idCliente: e.target.value, idPedido: '' })}
                    >
                      <option value="">-- Selecione o Cliente --</option>
                      {clientes.map(c => (
                        <option key={c.id} value={c.id}>
                          ID #{c.id} - {c.nome} (CPF: {c.cpf})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Vincular Venda / Pedido (Opcional)</label>
                    <select
                      value={formManifestacao.idPedido}
                      onChange={e => handleVincularPedido(e.target.value)}
                    >
                      <option value="">-- Nenhum pedido associado --</option>
                      {vendas
                        .filter(v => v.idCliente === Number(formManifestacao.idCliente))
                        .map(v => (
                          <option key={v.id} value={v.id}>
                            Venda #{v.id} - {v.produto} (Vendedor: {v.funcionario})
                          </option>
                        ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Tipo de Manifestação</label>
                    <select
                      value={formManifestacao.tipo}
                      onChange={e => setFormManifestacao({ ...formManifestacao, tipo: e.target.value })}
                    >
                      <option value="Reclamação">Reclamação</option>
                      <option value="Elogio">Elogio</option>
                      <option value="Sugestão">Sugestão</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Meio / Canal de Entrada</label>
                    <select
                      value={formManifestacao.meio}
                      onChange={e => setFormManifestacao({ ...formManifestacao, meio: e.target.value })}
                    >
                      <option value="Telefone">Telefone</option>
                      <option value="E-mail">E-mail</option>
                      <option value="Redes Sociais">Redes Sociais</option>
                      <option value="WhatsApp">WhatsApp</option>
                    </select>
                  </div>

                  <div className="form-group full-width">
                    <label>Classificação do Incidente</label>
                    <select
                      value={formManifestacao.classificacao}
                      onChange={e => setFormManifestacao({ ...formManifestacao, classificacao: e.target.value })}
                    >
                      <option value="Comportamental">Comportamental (Conduta de Atendimento/Venda)</option>
                      <option value="Sistêmico">Sistêmico (Erros em Sistemas, Plataforma ou Pagamento)</option>
                      <option value="Estrutural">Estrutural (Instalações, Prazos de Entrega e Logística)</option>
                      <option value="Produto">Produto (Defeitos, Qualidade e Garantia)</option>
                    </select>
                  </div>

                  {/* CAMPOS REQUISITADOS: FUNCIONÁRIO ENVOLVIDO E GERENTE TRATADOR */}
                  <div className="form-group">
                    <label>👤 Funcionário Envolvido no Caso</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Carlos Vendedor, Felipe Atendente..."
                      value={formManifestacao.funcionarioEnvolvido}
                      onChange={e => setFormManifestacao({ ...formManifestacao, funcionarioEnvolvido: e.target.value })}
                    />
                    <small className="field-hint">Preenchido automaticamente ao vincular uma venda ou editável manualmente.</small>
                  </div>

                  <div className="form-group">
                    <label>👔 Gerente Responsável pelo Tratamento</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Gerente Marcos, Gerente Patrícia..."
                      value={formManifestacao.responsavel}
                      onChange={e => setFormManifestacao({ ...formManifestacao, responsavel: e.target.value })}
                    />
                    <small className="field-hint">Gestor encarregado de acompanhar e dar o parecer final.</small>
                  </div>

                  <div className="form-group full-width">
                    <label>Texto da Manifestação / Relato do Cliente</label>
                    <textarea
                      rows="3"
                      required
                      placeholder="Descreva com detalhes o motivo da manifestação..."
                      value={formManifestacao.texto}
                      onChange={e => setFormManifestacao({ ...formManifestacao, texto: e.target.value })}
                    />
                  </div>

                  <div className="lgpd-section full-width">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={formManifestacao.autorizadoRetorno}
                        onChange={e => setFormManifestacao({ ...formManifestacao, autorizadoRetorno: e.target.checked })}
                      />
                      Autorizar retorno direto ao cliente (E-mail, Telefone ou WhatsApp)
                    </label>
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={formManifestacao.termoLgpd}
                        onChange={e => setFormManifestacao({ ...formManifestacao, termoLgpd: e.target.checked })}
                      />
                      <strong>LGPD:</strong> Consentimento do cliente para uso exclusivo dos dados para tratar e auditar esta manifestação.
                    </label>
                  </div>

                  <button type="submit" className="btn-submit full-width">
                    Registrar Ocorrência (Status: Em Tratamento - Prazo Padrão: 5 Dias Úteis)
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================
          TELA 2: AUTOMAÇÃO DE MARKETING
         ======================================================== */}
      {telaAtiva === 'marketing' && (
        <div className="view-card">
          <h2>🎯 Módulo CLI-action Marketing (Retenção)</h2>
          <p className="subtitle">Simulador de gatilhos automáticos com base no perfil e consentimento LGPD dos clientes:</p>

          <div className="marketing-cards-grid">
            <div className="marketing-box green">
              <div className="marketing-box-header">
                <h3>🎂 Aniversários do Mês</h3>
                <span className="badge">{aniversariantesDoMes.length} elegíveis</span>
              </div>
              <p>Dispara saudações personalizadas e cupons para clientes aniversariantes que autorizaram contato.</p>

              <div className="audience-list">
                <strong>Público-alvo identificado:</strong>
                {aniversariantesDoMes.length > 0 ? (
                  <ul>
                    {aniversariantesDoMes.map(c => (
                      <li key={c.id}>
                        {c.nome} ({c.dataNasc}) — Canais: {[c.mktEmail && 'E-mail', c.mktWhats && 'WhatsApp'].filter(Boolean).join(', ')}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted">Nenhum aniversariante elegível com autorização neste mês.</p>
                )}
              </div>

              <button
                className="btn-action btn-green"
                onClick={() => alert(`🎉 Campanha de Aniversário disparada com sucesso para ${aniversariantesDoMes.length} clientes!`)}
              >
                Disparar Parabenização
              </button>
            </div>

            <div className="marketing-box blue">
              <div className="marketing-box-header">
                <h3>🚀 Ofertas Direcionadas por Segmento</h3>
                <span className="badge">
                  {clientesPorPreferencia('Produtos').length} Produtos | {clientesPorPreferencia('Serviços').length} Serviços
                </span>
              </div>
              <p>Filtra a base de dados por interesse de compra e dispara campanhas sob medida para canais autorizados.</p>

              <div className="audience-list">
                <strong>Segmentação atual:</strong>
                <p>📦 <strong>Foco em Produtos:</strong> {clientesPorPreferencia('Produtos').map(c => c.nome).join(', ') || 'Nenhum'}</p>
                <p>🛠️ <strong>Foco em Serviços:</strong> {clientesPorPreferencia('Serviços').map(c => c.nome).join(', ') || 'Nenhum'}</p>
              </div>

              <div className="button-group">
                <button
                  className="btn-action btn-blue"
                  onClick={() => alert(`Campanha de PRODUTOS enviada para ${clientesPorPreferencia('Produtos').length} clientes!`)}
                >
                  Disparar Campanha de Produtos
                </button>
                <button
                  className="btn-action btn-indigo"
                  onClick={() => alert(`Campanha de SERVIÇOS enviada para ${clientesPorPreferencia('Serviços').length} clientes!`)}
                >
                  Disparar Campanha de Serviços
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          TELA 3: RELATÓRIO DE AUDITORIA E OUVIDORIA
         ======================================================== */}
      {telaAtiva === 'relatorios' && (
        <div className="view-card">
          <div className="report-header">
            <div>
              <h2>📊 Relatório de Auditoria e Ouvidoria</h2>
              <p className="subtitle">
                Acompanhamento de casos, funcionários envolvidos e <strong>Parecer Conclusivo do Gerente (Máx. 250 caracteres)</strong>
              </p>
            </div>
            <div className="metrics-summary">
              <span className="metric-pill">Total: {manifestacoes.length}</span>
              <span className="metric-pill warn">Em Tratamento: {manifestacoes.filter(m => m.status === 'Em Tratamento').length}</span>
              <span className="metric-pill ok">Finalizadas: {manifestacoes.filter(m => m.status === 'Finalizado').length}</span>
            </div>
          </div>

          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Cliente</th>
                  <th>Tipo / Canal</th>
                  <th>Classificação</th>
                  <th>Relato da Manifestação</th>
                  <th>Equipe Envolvida</th>
                  <th>Datas & Prazo</th>
                  <th>Status</th>
                  <th>Parecer do Gerente / Ação</th>
                </tr>
              </thead>
              <tbody>
                {manifestacoes.map(m => {
                  const cli = clientes.find(c => c.id === m.idCliente) || {};

                  return (
                    <tr key={m.id} className={m.status === 'Finalizado' ? 'row-finalizado' : ''}>
                      <td><strong>#{m.id}</strong></td>
                      <td>
                        <strong>{cli.nome || 'Cliente Desconhecido'}</strong>
                        <div className="sub-text">{cli.email}</div>
                        <div className="sub-text">{cli.telefone}</div>
                      </td>
                      <td>
                        <span className={`badge-type ${m.tipo.toLowerCase()}`}>{m.tipo}</span>
                        <div className="sub-text">Via {m.meio}</div>
                      </td>
                      <td>
                        <span className="badge-class">{m.classificacao}</span>
                        {m.idPedido && <div className="sub-text">Pedido #{m.idPedido}</div>}
                      </td>
                      <td className="texto-manifestacao">"{m.texto}"</td>
                      <td>
                        <div><strong>👤 Funcionário:</strong> {m.funcionarioEnvolvido || 'Não informado'}</div>
                        <div className="sub-text"><strong>👔 Gerente:</strong> {m.responsavel || 'Não definido'}</div>
                      </td>
                      <td>
                        <div className="sub-text"><strong>Criado:</strong> {m.dataRegistro}</div>
                        <div className="sub-text"><strong>Prazo:</strong> {m.prazo}</div>
                        <div className="sub-text"><strong>Conclusão:</strong> {m.dataFinalizacao}</div>
                      </td>
                      <td>
                        <span className={`status-pill ${m.status.toLowerCase().replace(' ', '-')}`}>
                          {m.status}
                        </span>
                      </td>
                      <td>
                        {m.status === 'Finalizado' ? (
                          <div className="parecer-conclusivo-box">
                            <span className="parecer-header">✅ Parecer Registrado ({m.responsavel}):</span>
                            <p className="parecer-texto">"{m.parecerGerente}"</p>
                          </div>
                        ) : (
                          <div className="action-buttons">
                            <button
                              type="button"
                              className="btn-table btn-success"
                              title="Emitir Parecer e Finalizar Caso"
                              onClick={() => abrirModalFinalizar(m)}
                            >
                              ✍️ Dar Parecer & Finalizar
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL DE EMISSÃO DE PARECER DO GERENTE (MÁX. 250 CHARS)
         ======================================================== */}
      {modalParecer.aberto && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <h3>✍️ Parecer Conclusivo do Gerente (Protocolo #{modalParecer.manifestacaoId})</h3>
              <button
                type="button"
                className="btn-close-modal"
                onClick={() => setModalParecer({ aberto: false, manifestacaoId: null, gerenteNome: '', textoParecer: '' })}
              >
                ✕
              </button>
            </div>

            <form onSubmit={confirmarFinalizacaoComParecer}>
              <div className="modal-body">
                <p className="modal-instruction">
                  Ao registrar o parecer final, a ocorrência sairá do estado <strong>"Em Tratamento"</strong> para <strong>"Finalizado"</strong>, ficando visível no relatório de auditoria.
                </p>

                <div className="form-group" style={{ marginBottom: '16px' }}>
                  <label>Gerente Conclusor do Caso:</label>
                  <input
                    type="text"
                    required
                    value={modalParecer.gerenteNome}
                    onChange={e => setModalParecer({ ...modalParecer, gerenteNome: e.target.value })}
                    placeholder="Nome do gerente que assina o parecer"
                  />
                </div>

                <div className="form-group">
                  <div className="label-with-counter">
                    <label>Parecer Técnico / Solução Adotada:</label>
                    <span className={`char-counter ${modalParecer.textoParecer.length >= 240 ? 'warn' : ''}`}>
                      {modalParecer.textoParecer.length} / 250 caracteres
                    </span>
                  </div>
                  <textarea
                    rows="4"
                    required
                    maxLength={250}
                    placeholder="Descreva sucintamente as providências tomadas para regularizar a ocorrência (máximo de 250 caracteres)..."
                    value={modalParecer.textoParecer}
                    onChange={e => setModalParecer({ ...modalParecer, textoParecer: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-cancel-large"
                  onClick={() => setModalParecer({ aberto: false, manifestacaoId: null, gerenteNome: '', textoParecer: '' })}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn-submit btn-finalize">
                  Salvar Parecer e Finalizar Caso
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
