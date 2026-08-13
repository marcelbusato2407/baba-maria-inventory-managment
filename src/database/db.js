const path = require('path');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const caminhoArquivo = path.join(__dirname, '..', '..', 'data', 'db.json');
const adapter = new FileSync(caminhoArquivo);
const db = low(adapter);

db.defaults({ produtos: [], movimentacoes: [] }).write();

function proximoId(lista) {
  if (lista.length === 0) return 1;
  return Math.max(...lista.map((item) => item.id)) + 1;
}

function validarProduto(dados, exigirQuantidadeInicial) {
  if (!dados.nome || !dados.nome.toString().trim()) {
    throw new Error('O nome do produto é obrigatório.');
  }
  if (!dados.categoria || !dados.categoria.toString().trim()) {
    throw new Error('A categoria é obrigatória.');
  }
  if (dados.preco === undefined || dados.preco === null || Number(dados.preco) < 0) {
    throw new Error('O preço não pode ser negativo.');
  }
  if (dados.estoqueMinimo === undefined || dados.estoqueMinimo === null || Number(dados.estoqueMinimo) < 0) {
    throw new Error('O estoque mínimo não pode ser negativo.');
  }
  if (exigirQuantidadeInicial) {
    if (dados.quantidadeInicial === undefined || dados.quantidadeInicial === null || Number(dados.quantidadeInicial) < 0) {
      throw new Error('A quantidade inicial não pode ser negativa.');
    }
  }
}

function listarProdutos() {
  return db.get('produtos').value();
}

function criarProduto(dados) {
  validarProduto(dados, true);

  const novoProduto = {
    id: proximoId(db.get('produtos').value()),
    nome: dados.nome.trim(),
    categoria: dados.categoria.trim(),
    preco: Number(dados.preco),
    quantidade: Number(dados.quantidadeInicial),
    estoqueMinimo: Number(dados.estoqueMinimo)
  };

  db.get('produtos').push(novoProduto).write();
  return novoProduto;
}

function editarProduto(id, dados) {
  const produto = db.get('produtos').find({ id: Number(id) }).value();
  if (!produto) {
    throw new Error('Produto não encontrado.');
  }

  validarProduto(dados, false);

  db.get('produtos')
    .find({ id: Number(id) })
    .assign({
      nome: dados.nome.trim(),
      categoria: dados.categoria.trim(),
      preco: Number(dados.preco),
      estoqueMinimo: Number(dados.estoqueMinimo)
    })
    .write();

  return db.get('produtos').find({ id: Number(id) }).value();
}

function excluirProduto(id) {
  const produto = db.get('produtos').find({ id: Number(id) }).value();
  if (!produto) {
    throw new Error('Produto não encontrado.');
  }
  db.get('produtos').remove({ id: Number(id) }).write();
}

function listarMovimentacoes() {
  return db.get('movimentacoes').orderBy(['data', 'id'], ['desc', 'desc']).value();
}

function criarMovimentacao(dados) {
  const produto = db.get('produtos').find({ id: Number(dados.produtoId) }).value();
  if (!produto) {
    throw new Error('Produto não encontrado.');
  }

  if (dados.tipo !== 'entrada' && dados.tipo !== 'saida') {
    throw new Error('Tipo de movimentação inválido.');
  }

  const quantidade = Number(dados.quantidade);
  if (!quantidade || quantidade <= 0) {
    throw new Error('A quantidade deve ser maior que zero.');
  }

  if (dados.tipo === 'saida' && quantidade > produto.quantidade) {
    throw new Error('Não há estoque suficiente para essa saída.');
  }

  const novaQuantidade = dados.tipo === 'entrada'
    ? produto.quantidade + quantidade
    : produto.quantidade - quantidade;

  db.get('produtos').find({ id: produto.id }).assign({ quantidade: novaQuantidade }).write();

  const novaMovimentacao = {
    id: proximoId(db.get('movimentacoes').value()),
    produtoId: produto.id,
    tipo: dados.tipo,
    quantidade,
    data: dados.data || new Date().toISOString().slice(0, 10),
    observacao: dados.observacao ? dados.observacao.trim() : ''
  };

  db.get('movimentacoes').push(novaMovimentacao).write();
  return novaMovimentacao;
}

module.exports = {
  listarProdutos,
  criarProduto,
  editarProduto,
  excluirProduto,
  listarMovimentacoes,
  criarMovimentacao
};
