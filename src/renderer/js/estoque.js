// Lógica da página de Estoque: listagem com destaque para estoque baixo e busca simples.

const tabelaEstoque = document.getElementById('tabela-estoque');
const textoListaVazia = document.getElementById('texto-lista-vazia');
const campoBusca = document.getElementById('busca-produto');

let produtos = [];

campoBusca.addEventListener('input', () => {
  renderizarTabela(filtrarProdutos(campoBusca.value));
});

function filtrarProdutos(termo) {
  const termoBusca = termo.trim().toLowerCase();
  if (!termoBusca) return produtos;
  return produtos.filter((produto) => produto.nome.toLowerCase().includes(termoBusca));
}

function renderizarTabela(lista) {
  tabelaEstoque.innerHTML = '';

  if (lista.length === 0) {
    textoListaVazia.classList.remove('escondido');
    return;
  }
  textoListaVazia.classList.add('escondido');

  lista.forEach((produto) => {
    const status = obterStatusProduto(produto);
    const linha = document.createElement('tr');

    if (produto.quantidade === 0) {
      linha.classList.add('sem-estoque');
    } else if (produto.quantidade <= produto.estoqueMinimo) {
      linha.classList.add('estoque-baixo');
    }

    linha.innerHTML = `
      <td>${produto.nome}</td>
      <td>${produto.categoria}</td>
      <td>${produto.quantidade}</td>
      <td>${produto.estoqueMinimo}</td>
      <td><span class="status ${status.classe}">${status.texto}</span></td>
    `;

    tabelaEstoque.appendChild(linha);
  });
}

async function carregarEstoque() {
  produtos = await window.api.produtos.listar();
  renderizarTabela(filtrarProdutos(campoBusca.value));
}

carregarEstoque();
