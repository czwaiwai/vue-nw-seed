/**
 * Created by Administrator on 2018/3/20 0020.
 */
import os from 'os'
export default function (vue) {
  let rel = os.release()
  if (parseFloat(rel.substr(0, 3)) > 6) {
    vue.prototype.$isXP = false
  } else {
    vue.prototype.$isXP = true
  }
}
