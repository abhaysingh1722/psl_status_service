import test from 'tape'
import list from '../src/channels.list'
import history from '../src/channels.history'
import env from './_env'
// load SLACK_TOKEN for testing
env()
var fs = require('fs');
var async = require('async');
var flag = true;

//var json_data = require('./channel_data.json')
test('can list channels and get history', t=> {
  let token = process.env.SLACK_BOT_TOKEN
  let exclude_archived = 1
  let limit = 200
  let cursor = ""
  
  async.whilst(function () {
    return flag;
  },
  function (next) {
    let params = {token, exclude_archived,limit,cursor}
    list(params, (err, json)=> {
      if (err) {
        t.fail(err, 'channels.list fails')
        console.error(err)
      }
      else {
        t.ok(json, 'listed channels')
        console.log(json)

      // get the history for the first one
      let channel = json.channels.filter(c=> c.name === process.env.CHANNEL_NAME)
      //console.log(channel)
      if(typeof channel !== 'undefined' && channel.length > 0){
        flag = false;
        let channel = json.channels.filter(c=> c.name === process.env.CHANNEL_NAME)[0].id
        let count = 1000 
        let params = {token, channel, count}
        history(params, (err, data)=> {
          if (err) {
            t.fail(err, err)
          }
          else {
            t.ok(data, 'got history')
            console.log(data)
            var datax=[]
            var now = new Date();
            console.log("Todays Date="+ now)
            var json_data = JSON.parse(JSON.stringify(data))
            for(var i=0; i < json_data.messages.length; i++) {
              if(json_data.messages[i].attachments 
               && new Date(json_data.messages[i].ts * 1000).toISOString().substr(0,10) == new Date().toISOString().substr(0,10)){

               datax.push(json_data.messages[i])
           }
         }
         json_data.messages = datax	
         var jsonData=JSON.stringify(json_data,null,'\t')		
         fs.writeFile("channel_data.json",jsonData, function(err) {
          if(err) {
            return console.log(err);
          }
        });
       }	
       t.end()
     })
        flag=false;
      }
      else{

        cursor = json.response_metadata.next_cursor
        next();
          //console.log("M here")
        } 
      }
    })
  },
  function (err) {
        // All things are done!
      }); 
})
