var express = require('express');
var app = express();
app.set('view engine', 'ejs');

app.get('/', function(req, res) {
    var obj  = require('./channel_data.json')
    var userList  = require('./users_list.json')
    var channelList  = require('./channel_list.json')
    var data = []
    var members = []

    channelList.channels.forEach(function(entity){
        if(entity.name == "daily_status"){
            members = entity.members;
        }
    });

    members.forEach(function(obj1){
        temp = {}
        userList.members.forEach(function(obj2){
            if(obj2.id == obj1 && (obj1 != "U6GUQR20Z")){
                temp['user'] = obj2.real_name;

                obj.messages.forEach(function(obj3){
                    if(obj2.id == obj3.text.substring(2,11) && obj3.attachments){
                        temp['answer1'] = obj3.attachments[0].fallback;
                        temp['answer2'] = obj3.attachments[1].fallback;
                        temp['answer3'] = obj3.attachments[2].fallback;
                    }
                });

                var flag=true;
                for(i=0;i<data.length;i+=1)
                {
                    if(data[i].user > temp.user){
                        data.splice(i, 0, temp);
                        flag = false;
                        break;
                    }  
                }
                if (flag)
                    data.push(temp)
                
            }
        });
    });
    
    res.render('index', {'data': data});
});

app.listen(3000, function() {
    console.log('Listening to port:  ' + 3000);
}); 