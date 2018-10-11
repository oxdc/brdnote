import commands from '@/uitls/commands'

export default function cmdhandler () {
  window.vueRoot.$electron.ipcRenderer.on('command', (event, cmd, arg) => {
    switch (cmd) {
      case 'save':
        commands.save(window.vueRoot)
        break

      case 'open':
        commands.open(window.vueRoot)
        break

      case 'close':
        commands.close(window.vueRoot)
        break

      case 'printpdf':
        commands.printpdf(window.vueRoot)
        break

      case 'cmdopen':
        commands.cmdopen(window.vueRoot, arg)
        break

      case 'print':
        commands.print(window.vueRoot)
        break

      default:
        break
    }
  })
}
