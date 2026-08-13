const elementoMensagem = document.getElementById('mensagem');
const seletorProduto = document.getElementById('mov-produto');
const tabelaMovimentacoes = document.getElementById('tabela-movimentacoes');
const textoListaVazia = document.getElementById('texto-lista-vazia');
const formMovimentacao = document.getElementById('form-movimentacao');

let produtosCadastrados = [];

document.getElementById('mov-data').value = dataDeHoje();

formMovimentacao.addEventListener('submit', async (evento) => {
  evento.preventDefault();
  await registrarMovimentacao();
});

async function carregarProdutosNoSeletor() {
  produtosCadastrados = await window.api.produtos.listar();
  seletorProduto.innerHTML = '';

  produtosCadastrados.forEach((produto) => {
    const opcao = document.createElement('option');
    opcao.value = produto.id;
    opcao.textContent = `${produto.nome} (estoque atual: ${produto.quantidade})`;
    seletorProduto.appendChild(opcao);
  });
}

async function registrarMovimentacao() {
  const dados = {
    produtoId: seletorProduto.value,
    tipo: document.getElementById('mov-tipo').value,
    quantidade: document.getElementById('mov-quantidade').value,
    data: document.getElementById('mov-data').value,
    observacao: document.getElementById('mov-observacao').value
  };

  try {
    await window.api.movimentacoes.criar(dados);
    mostrarMensagem(elementoMensagem, 'Movimentação registrada com sucesso.', 'sucesso');
    formMovimentacao.reset();
    document.getElementById('mov-data').value = dataDeHoje();
    await carregarProdutosNoSeletor();
    await carregarMovimentacoes();
  } catch (erro) {
    mostrarMensagem(elementoMensagem, erro.message, 'erro');
  }
}

function nomeDoProduto(produtoId) {
  const produto = produtosCadastrados.find((p) => p.id === produtoId);
  return produto ? produto.nome : 'Produto removido';
}

async function carregarMovimentacoes() {
  const movimentacoes = await window.api.movimentacoes.listar();
  tabelaMovimentacoes.innerHTML = '';

  if (movimentacoes.length === 0) {
    textoListaVazia.classList.remove('escondido');
    return;
  }
  textoListaVazia.classList.add('escondido');

  movimentacoes.forEach((movimentacao) => {
    const linha = document.createElement('tr');
    const tipoTexto = movimentacao.tipo === 'entrada' ? 'Entrada' : 'Saída';

    linha.innerHTML = `
      <td>${formatarData(movimentacao.data)}</td>
      <td>${nomeDoProduto(movimentacao.produtoId)}</td>
      <td>${tipoTexto}</td>
      <td>${movimentacao.quantidade}</td>
      <td>${movimentacao.observacao || '-'}</td>
    `;

    tabelaMovimentacoes.appendChild(linha);
  });
}

async function iniciar() {
  await carregarProdutosNoSeletor();
  await carregarMovimentacoes();
}

iniciar();
