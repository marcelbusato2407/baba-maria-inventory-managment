const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  produtos: {
    listar: () => ipcRenderer.invoke('produtos:listar'),
    criar: (produto) => ipcRenderer.invoke('produtos:criar', produto),
    editar: (id, dados) => ipcRenderer.invoke('produtos:editar', id, dados),
    excluir: (id) => ipcRenderer.invoke('produtos:excluir', id)
  },
  movimentacoes: {
    listar: () => ipcRenderer.invoke('movimentacoes:listar'),
    criar: (movimentacao) => ipcRenderer.invoke('movimentacoes:criar', movimentacao)
  }
});
