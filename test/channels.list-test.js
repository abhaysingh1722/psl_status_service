import test from 'tape'
import list from '../src/channels.list'
import env from './_env'
import info from '../src/channels.info'
// load SLACK_BOT_TOKEN for testing
env()
var fs = require('fs');
test('can get info', t=> {
  let token = process.env.SLACK_BOT_TOKEN
  let exclude_archived = 1
  let channel = process.env.CHANNEL_ID

  let params = {token, channel}
  info(params, (err, json)=> {
    if (err) {
      t.fail(err, 'channels.list fails')
      console.error(err)
    }
    else {
      t.ok(json, 'listed channels')
      console.log(json)
      // let channel = json.channels.filter(c=> c.name === 'daily_status')[0].id
      // let params = {token, channel}
      // list(params, (err, data)=> {
      //   if (err) {
      //     t.fail(err, 'channels.list fails')
      //     console.error(err)
      //   }
      //   else {
      //     t.ok(data, 'listed channels')
      //     console.log(data)
         var jsonData=JSON.stringify(json,null,'\t')    
          fs.writeFile("channel_info.json",jsonData, function(err) {
            if(err) {
              return console.log(err);
            }
          });
        //}
        t.end()
      //})
    }
  })
})
