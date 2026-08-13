// Processo principal do Electron.
// Cria a janela do aplicativo e disponibiliza as operações de banco de dados
// para a interface através dos handlers de IPC (usados pelo preload.js).

const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const db = require('../database/db');

function criarJanela() {
  const janela = new BrowserWindow({
    width: 1100,
    height: 720,
    minWidth: 900,
    minHeight: 600,
    webPreferences: {
      preload: path.join(__dirname, '..', 'preload', 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  janela.setMenuBarVisibility(false);
  janela.loadFile(path.join(__dirname, '..', 'renderer', 'pages', 'index.html'));
}

// ---- Produtos ----
ipcMain.handle('produtos:listar', () => db.listarProdutos());
ipcMain.handle('produtos:criar', (evento, produto) => db.criarProduto(produto));
ipcMain.handle('produtos:editar', (evento, id, dados) => db.editarProduto(id, dados));
ipcMain.handle('produtos:excluir', (evento, id) => db.excluirProduto(id));

// ---- Movimentações ----
ipcMain.handle('movimentacoes:listar', () => db.listarMovimentacoes());
ipcMain.handle('movimentacoes:criar', (evento, movimentacao) => db.criarMovimentacao(movimentacao));

app.whenReady().then(() => {
  criarJanela();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      criarJanela();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
