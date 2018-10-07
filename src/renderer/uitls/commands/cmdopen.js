import open from './open'

export function cmdopen (vueRoot, path, callback) {
  if (!vueRoot) {
    return
  }

  if (!path) {
    return
  }

  open(vueRoot, callback, path)
}

export default cmdopen
