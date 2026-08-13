const painelFormulario = document.getElementById('painel-formulario');
const tituloFormulario = document.getElementById('titulo-formulario');
const formProduto = document.getElementById('form-produto');
const campoQuantidadeInicial = document.getElementById('campo-quantidade-inicial');
const elementoMensagem = document.getElementById('mensagem');
const tabelaProdutos = document.getElementById('tabela-produtos');
const textoListaVazia = document.getElementById('texto-lista-vazia');

document.getElementById('botao-novo-produto').addEventListener('click', () => {
  abrirFormularioNovoProduto();
});

document.getElementById('botao-cancelar').addEventListener('click', () => {
  fecharFormulario();
});

formProduto.addEventListener('submit', async (evento) => {
  evento.preventDefault();
  await salvarProduto();
});

function abrirFormularioNovoProduto() {
  formProduto.reset();
  document.getElementById('produto-id').value = '';
  tituloFormulario.textContent = 'Novo produto';
  campoQuantidadeInicial.classList.remove('escondido');
  document.getElementById('produto-quantidade').required = true;
  painelFormulario.classList.remove('escondido');
}

function abrirFormularioEdicao(produto) {
  formProduto.reset();
  document.getElementById('produto-id').value = produto.id;
  document.getElementById('produto-nome').value = produto.nome;
  document.getElementById('produto-categoria').value = produto.categoria;
  document.getElementById('produto-preco').value = produto.preco;
  document.getElementById('produto-estoque-minimo').value = produto.estoqueMinimo;
  tituloFormulario.textContent = 'Editar produto';

  // A quantidade em estoque só é alterada por movimentações, não na edição do produto.
  campoQuantidadeInicial.classList.add('escondido');
  document.getElementById('produto-quantidade').required = false;

  painelFormulario.classList.remove('escondido');
}

function fecharFormulario() {
  painelFormulario.classList.add('escondido');
  formProduto.reset();
}

async function salvarProduto() {
  const id = document.getElementById('produto-id').value;
  const dados = {
    nome: document.getElementById('produto-nome').value,
    categoria: document.getElementById('produto-categoria').value,
    preco: document.getElementById('produto-preco').value,
    estoqueMinimo: document.getElementById('produto-estoque-minimo').value
  };

  try {
    if (id) {
      await window.api.produtos.editar(Number(id), dados);
      mostrarMensagem(elementoMensagem, 'Produto atualizado com sucesso.', 'sucesso');
    } else {
      dados.quantidadeInicial = document.getElementById('produto-quantidade').value;
      await window.api.produtos.criar(dados);
      mostrarMensagem(elementoMensagem, 'Produto cadastrado com sucesso.', 'sucesso');
    }
    fecharFormulario();
    await carregarProdutos();
  } catch (erro) {
    mostrarMensagem(elementoMensagem, erro.message, 'erro');
  }
}

async function excluirProduto(id, nome) {
  const confirmou = confirm(`Tem certeza que deseja excluir o produto "${nome}"?`);
  if (!confirmou) return;

  try {
    await window.api.produtos.excluir(id);
    mostrarMensagem(elementoMensagem, 'Produto excluído com sucesso.', 'sucesso');
    await carregarProdutos();
  } catch (erro) {
    mostrarMensagem(elementoMensagem, erro.message, 'erro');
  }
}

async function carregarProdutos() {
  const produtos = await window.api.produtos.listar();
  tabelaProdutos.innerHTML = '';

  if (produtos.length === 0) {
    textoListaVazia.classList.remove('escondido');
    return;
  }
  textoListaVazia.classList.add('escondido');

  produtos.forEach((produto) => {
    const status = obterStatusProduto(produto);
    const linha = document.createElement('tr');

    linha.innerHTML = `
      <td>${produto.nome}</td>
      <td>${produto.categoria}</td>
      <td>${formatarMoeda(produto.preco)}</td>
      <td>${produto.quantidade}</td>
      <td>${produto.estoqueMinimo}</td>
      <td><span class="status ${status.classe}">${status.texto}</span></td>
      <td class="acoes-tabela">
        <button class="botao secundario pequeno" data-acao="editar">Editar</button>
        <button class="botao perigo" data-acao="excluir">Excluir</button>
      </td>
    `;

    linha.querySelector('[data-acao="editar"]').addEventListener('click', () => {
      abrirFormularioEdicao(produto);
    });
    linha.querySelector('[data-acao="excluir"]').addEventListener('click', () => {
      excluirProduto(produto.id, produto.nome);
    });

    tabelaProdutos.appendChild(linha);
  });
}

carregarProdutos();
