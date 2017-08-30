import test from 'tape'
import list from '../src/channels.list'
import env from './_env'
var async = require('async');
// load SLACK_BOT_TOKEN for testing
env()
var fs = require('fs');
var flag = true;
test('can list channels', t=> {
	let token = process.env.SLACK_BOT_TOKEN
	let exclude_archived = 1
	let limit = 200
	let cursor = ""
	
	//console.log("Before while")
	async.whilst(function () {
            return flag;
        },
        function (next) {
		let params = {token, exclude_archived,limit,cursor}
		list(params, (err, json)=> {
			cursor = json.response_metadata.next_cursor
			if (err) {
				t.fail(err, 'channels.list fails')
				console.error(err)
			}
			else {
				t.ok(json, 'listed channels')
				console.log(json)
				//let channel = json.channels.filter(c=> c.name === process.env.CHANNEL_NAME)[0].id
				//console.log("before channel")
				let channel = json.channels.filter(c=> c.name === process.env.CHANNEL_NAME)
				//console.log(channel)
				if(typeof channel !== 'undefined' && channel.length > 0){
					flag = false;
					let channel = json.channels.filter(c=> c.name === process.env.CHANNEL_NAME)[0].id
					let params = {token, channel}
					list(params, (err, data)=> {
						if (err) {
							t.fail(err, 'channels.list fails')
							console.error(err)
						}
						else {				
							t.ok(data, 'listed channels')
							console.log(data)
							var jsonData=JSON.stringify(data,null,'\t')    
							fs.writeFile("channel_list.json",jsonData, function(err) {
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

