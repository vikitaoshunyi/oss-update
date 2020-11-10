// 引入electron并创建一个Browserwindow
const { app, BrowserWindow, ipcMain, BrowserView } = require('electron')
const path = require('path')
const url = require('url')
const { initMeuns } = require("./main/template");
var isDev = process.env.NODE_ENV !== 'production'

console.log(isDev);
// 保持window对象的全局引用,避免JavaScript对象被垃圾回收时,窗口被自动关闭.
let mainWindow
function createWindow () {
//创建浏览器窗口,宽高自定义具体大小你开心就好
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    // backgroundColor: '#2e2c29',
    titleBarStyle:"hiddenInset",
    webPreferences: {
      devTools: true,
      nodeIntegration: true,
      nodeIntegrationInWorker: true,
      nodeIntegrationInSubFrames: true,
      webSecurity: false
    },
    icon: path.join(__dirname, '/static/icon.png')
  })
  if (process.platform === 'darwin') {
    // app.dock.setIcon(path.join(__dirname, '/static/icon.png'));
  }
  /* 
  * 加载应用----- electron-quick-start中默认的加载入口 */
 if (isDev) {
  mainWindow.loadURL('http://localhost:8888');
  // mainWindow.loadURL(url.format({
  //     pathname: path.join(__dirname, './build/index.html'),
  //     protocol: 'file:',
  //     slashes: true,
  //     // hash: "login"
  //   }));
  mainWindow.webContents.openDevTools()
 }else {
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, '/index.html'),
    protocol: 'file:',
    slashes: true,
    // hash: "login"
  }))
 }

//  let win = new BrowserWindow({
//     width: 600,
//     height: 300,
//     // backgroundColor: '#2e2c29',
//     titleBarStyle:"hiddenInset",
//     webPreferences: {
//       devTools: true,
//       nodeIntegration: true,
//       webSecurity: false
//     },
//     // frame: false,
//     modal: true,
//     parent: mainWindow
//   })
//   win.loadURL(url.format({
//     pathname: path.join(__dirname, '/build/index.html'),
//     protocol: 'file:',
//     slashes: true,
//     // hash: "login"
//   }))
//  let view = new BrowserView({
//   webPreferences: {
//     devTools: true,
//     nodeIntegration: true,
//     webSecurity: false
//   }
//  })//创建子窗口
//  mainWindow.addBrowserView(view)//将子窗口view嵌入到父窗口win中
// view.setBounds({ x: 0, y: 0, width: 300, height: 300 })//窗口的大小
// // view.webContents.loadFile('build/index.html')
// view.webContents.loadURL('http://localhost:8888');
// view.webContents.openDevTools()

// let view2 = new BrowserView()//创建子窗口
// mainWindow.addBrowserView(view2)//将子窗口view嵌入到父窗口win中
// view2.setBounds({ x: 0, y: 0, width: 600, height: 300 })//窗口的大小
// view2.webContents.loadURL(url.format({
//   pathname: path.join(__dirname, './build/index.html'),
//   protocol: 'file:',
//   slashes: true,
//   // hash: "login"
// }))

  
  
 
  // 加载应用----适用于 react 项目
  
  // 打开开发者工具，默认不打开
  // mainWindow.webContents.openDevTools()
  // 关闭window时触发下列事件.
  mainWindow.on('closed', function () {
    mainWindow = null
  })
  initMeuns(mainWindow);
}
// 当 Electron 完成初始化并准备创建浏览器窗口时调用此方法
app.on('ready', createWindow)
// 所有窗口关闭时退出应用.
app.on('window-all-closed', function () {
 // macOS中除非用户按下 `Cmd + Q` 显式退出,否则应用与菜单栏始终处于活动状态.
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
app.on('activate', function () {
 // macOS中点击Dock图标时没有已打开的其余应用窗口时,则通常在应用中重建一个窗口
  if (mainWindow === null) {
    createWindow()
  }
})
// 你可以在这个脚本中续写或者使用require引入独立的js文件. 
let newwin;
ipcMain.on('add',(event, arg)=>
{
    // newwin = new BrowserWindow({
    //     width: 600, 
    //     height: 400,
    //     frame:false,
    //     parent: mainWindow, //win是主窗口
    // })
    // newwin.loadURL("https://www.baidu.com"); //new.html是新开窗口的渲染进程
    // newwin.on('closed',()=>{newwin = null})
    console.log(arg);

})

