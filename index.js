require("dotenv").config()
const { Events } = require('discord.js')

const client = require('./client')
const commandCollection = require('./src/commandHandler')

client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.username}`);
});

client.on(Events.MessageCreate, async message => {
	try {
		const { mentions: { roles, users } } = message
		const isScarlett = !!roles.get(process.env.SCARLETT_ROLE_ID) || !!users.get(process.env.SCARLETT_USER_ID)
		if(!isScarlett || roles.size > 1 || users.size > 1) return
		const command = commandCollection.get('scarlett');

		if(!command)
			return await message.reply({
				content: 'Ops! Houve algum erro ao executar o meu comando.',
				options: { ephemeral: true }})

		await command.execute(message);
	} catch (error) {
		console.error(error);
		await message.reply({
			content: 'Ops! Houve algum erro ao executar o meu comando.',
			options: { ephemeral: true }});
	}
})

client.on(Events.InteractionCreate, async interaction => {
    if(!interaction.isChatInputCommand) return

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
})

client.login(process.env.DISCORD_BOT_TOKEN)