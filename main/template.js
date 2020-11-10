const { app, Menu, BrowserWindow, ipcMain } = require('electron')

const isMac = process.platform === 'darwin'
const initMeuns = (window) => {
  const template = [
    // { role: 'appMenu' }
    ...(isMac ? [{
      label: app.name,
      submenu: [
        { role: 'services' },
        
        { type: 'separator' },
        { role: 'quit' }
      ]
    }] : []),
    // { role: 'fileMenu' }
    {
      label: '文件',
      submenu: [
        {label: "新建Bucket", click: () => {
          
          window.send("showAddBucketBox");
        }},
        {label: "修改Bucket", click: () => {
          
          window.send("showModifyBucketBox");
        }},
        {label: "截图", click: () => {
          // let child = new BrowserWindow({ parent: window, modal: true, show: false })
          // child.loadURL('https://www.baidu.com')
          // child.once('ready-to-show', () => {
          //   child.show()
          // })
          window.send("sendPuppeteer");
        }}
      ]
    },
    {
      label: '编辑',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        ...(isMac ? [
          { role: 'pasteAndMatchStyle' },
          { role: 'delete' },
          { role: 'selectAll' },
          { type: 'separator' },
          {
            label: 'Speech',
            submenu: [
              { role: 'startspeaking' },
              { role: 'stopspeaking' }
            ]
          }
        ] : [
          { role: 'delete' },
          { type: 'separator' },
          { role: 'selectAll' }
        ])
      ]
    },
    {
      label: '工具',
      submenu: [
        {label: "重载", role:"reload"},
        {label: "开发者工具", role:"toggleDevTools"},
        
      ]
    },
    
    {
      label: "帮助",
      role: "help",
      submenu: [
        {
          label: '设计坞主页',
          click: async () => {
            const { shell } = require('electron')
            await shell.openExternal('https://isheji5.com')
          }
        }
      ]
    }
  ]
  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}

module.exports = {
  initMeuns
}