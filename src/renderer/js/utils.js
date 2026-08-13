function formatarMoeda(valor) {
  return 'R$ ' + Number(valor).toFixed(2).replace('.', ',');
}

function formatarData(data) {
  if (!data) return '-';
  const [ano, mes, dia] = data.split('-');
  return `${dia}/${mes}/${ano}`;
}

function obterStatusProduto(produto) {
  if (produto.quantidade === 0) {
    return { texto: 'Sem estoque', classe: 'sem-estoque' };
  }
  if (produto.quantidade <= produto.estoqueMinimo) {
    return { texto: 'Estoque baixo', classe: 'baixo' };
  }
  return { texto: 'Normal', classe: 'normal' };
}

function mostrarMensagem(elemento, texto, tipo) {
  elemento.textContent = texto;
  elemento.className = 'mensagem ' + tipo;
  elemento.classList.remove('escondido');
}

function esconderMensagem(elemento) {
  elemento.classList.add('escondido');
}

function dataDeHoje() {
  return new Date().toISOString().slice(0, 10);
}
