exports.run = (client, message, args) => {
	  allowed = false;
  if(message.guild != null) {
	 if(message.guild.id == 274980577545945090) {
      message.react("387659429568577548");
      allowed = false;
    }
  }
	if(allowed) {
	role = message.guild.roles.find(r => r.name == '')

	if (!role) return message.channel.send(`**${message.author.username}**, role not found`)

	message.guild.members.filter(m => !m.user.bot).forEach(member => member.removeRole(role))
	message.channel.send(`**${message.author.username}**, role **${role.name}** assigned to all`)
	}
};