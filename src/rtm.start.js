
// this file was generated by ./scripts/generate-web-api
import exec from './_exec'
import validate from './_validate'

export default function rtmstart(params, callback) {
  let ns = 'rtm.start'
  let err = validate(ns, params)
  if (err) {
    callback(err)
  }
  else {
    exec(ns, params, callback)
  }
}
