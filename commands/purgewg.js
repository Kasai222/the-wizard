exports.run = (client, message, args) => {
	  allowed = false;
  if(message.guild != null) {
	 if(message.guild.id == 274980577545945090) {
      message.react("387659429568577548");
      allowed = false;
    }
  }
	if(allowed) {
const targetChannel = client.channels.get("414345440692273155");
batchFetch(targetChannel).then(clearMessages);
async function batchFetch(channel, limit = 500) {
    const allMessages = [];
    let last_id;

    while (true) {
        const options = { limit: 100 };
        if (last_id) {
            options.before = last_id;
        }

        const messages = await channel.fetchMessages(options);
        allMessages.push(...messages.array());
        last_id = messages.last().id;

        if (messages.size != 100 || allMessages >= limit) {
            break;
        }
    }

    return allMessages;
}

async function clearMessages(allMessages) {
		console.log(allMessages);
	}
}
};