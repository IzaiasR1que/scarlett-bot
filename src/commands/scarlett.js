const { SlashCommandBuilder } = require('discord.js')
const openai = require('../../openai')

let persist = {prev: [], count: 0}

const execute = async interaction => {
    try{
        const botName = 'Scarlett'
        const contextText = `Você se chama ${botName}, `
        + 'uma bot assistente virtual do Discord. Sobre o seu gênero musical, você gosta de Rock e Hip-hop. Sua série animada preferida é Rick and Morty. Seu criador é Izaias Henrique, também conhecido como Darkrique. Seus pronomes são ela/dela. Você está participando de uma conversa que pode conter uma ou mais pessoas.' 
        + 'Então responda. '

        const isValidQuestion = /(?<=^)(?<mentionID>\<\@\d+\> )(?<question>.+)/.exec(interaction.content)

        if(!isValidQuestion) return interaction
            .reply('👩🏽‍💻  Scarlett \n \nOlá, eu sou a Scarlett. No que posso ajudar?')

        const { groups: { question } } = isValidQuestion

        const newTalk = `\n${interaction.author.username ?? 'Pessoa'}: ${question} \n ${botName}:` 

        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: persist.count > 0 
                ? contextText + persist.prev.join('\n') + newTalk 
                : contextText + newTalk,
            max_tokens: 2048,
            temperature: 0.9,
            top_p: 1,
            n: 1,
            stream: false,
            logprobs: null,
        });

        const message = response.data.choices[0].text.replace(/\,$/, '.')
        console.log(response.data)

        if(!message) {
            const err = new Error('Desculpe-me, mas não consigo te responder!')
            err.type = 'NullError'
            throw err
        }

        const resTalk = `
        ${interaction.author.username ?? 'Pessoa'}: ${question.trim()} 
        ${botName}: ${message.trim()}`

        if(persist.count === 50) {
            persist = {prev: [], count: 0}
        } else {
            persist.prev.push(resTalk)
            persist.count++
        }

        return interaction.reply(message.trim())
    } catch(e) {
        console.error(e)
        return interaction.reply(e.type === 'NullError' 
        ? e.message 
        : 'Parece que a minha memória está cheia, preciso reiniciar para te responder.')
    }
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('scarlett')
        .setDescription('Should init scarllet bot"')
        .addStringOption(option => option
            .setName('question')
            .setDescription('O que gostaria de dizer a Scarlett?')),
    execute
}