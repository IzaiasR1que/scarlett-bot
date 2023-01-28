const {SlashCommandBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle} = require("discord.js")

const execute = async interaction => {
    const modal = new ModalBuilder()
            .setCustomId('createModal')
            .setTitle('Adicione uma nova tarefa')
        
        const titleInput = new TextInputBuilder()
            .setCustomId('titleInput')
            .setLabel('Título da tarefa:')
            .setStyle(TextInputStyle.Short)
            .setRequired(true)

        const descriptionInput = new TextInputBuilder()
            .setCustomId('descriptionInput')
            .setLabel('Descrição da tarefa:')
            .setStyle(TextInputStyle.Paragraph)

        const dateExpirationInput = new TextInputBuilder()
            .setCustomId('dateExpInput')
            .setLabel('Data de expiração:')
            .setStyle(TextInputStyle.Short)
            .setRequired(true)

            const titleRow = new ActionRowBuilder().addComponents(titleInput);
            const descRow = new ActionRowBuilder().addComponents(descriptionInput);
            const dateExpRow = new ActionRowBuilder().addComponents(dateExpirationInput);

            modal.addComponents(titleRow, descRow, dateExpRow)

            await interaction.showModal(modal)
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('modal')
        .setDescription('Show modal example for create new task!'),
    execute
}