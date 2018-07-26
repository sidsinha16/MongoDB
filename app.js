
const MongoClient = require('mongodb').MongoClient;
const client = require('socket.io').listen(4000).sockets;

MongoClient.connect("mongodb://spyder:sid123@ds153841.mlab.com:53841/momgochat", { useNewUrlParser: true },(err,client)=>{
    if(err) throw err;
    console.log("Connected with MongoDB");

    //socket.io connection
    client.on('connection',function(socket){
        let chat = db.collection('chats');

    //Create function to send Status
    sendStatus = function(data){
        socket.emit('status',data);
    }   

    //get chats from mongo collection
    chat.find().limit(100).sort({_id:1}).toArray(function(err,res){
        if(err) throw err;

        //Emits message
        socket.emit('output',res);
    });

    //Handle input from client
    socket.on('input',function(data){
        let name = data.name;
        let message = data.message;

        //check for name
        if(name == "" || message == ""){
            sendStatus('Please enter name and message');
            }else{
                //Insert Mesaage
                chat.insert({name:name,message:message},function(){
                    client.emit('output',[data]);

                //send status object
                sendStatus({
                    message:'Message sent',
                    clear:true
                    })  
                })
            }
        });
    //Handle clear
    socket.on('clear',function(data){
        //Remove all chat From collections
        chat.remove({},()=>{
            socket.emit('cleared');
            });
        });
    })
});
    