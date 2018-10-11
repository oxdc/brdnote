import jobs from './jobs'
import { loadTheme } from '@/uitls/miscellaneous'

export default function initApp () {
  loadTheme('default')
  jobs.autosaving(10 * 1000, 30)
  jobs.cmdhandler()
  jobs.initui()
  jobs.reminder(1000, 1000 * 60 * 1)
}
