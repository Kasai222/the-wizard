exports.run = (client, message, args) => {
echo = '';
  for(x=0; x<args.length; x++) {
    echo = echo+' '+args[x];
  }

    message.channel.send(echo);

} 