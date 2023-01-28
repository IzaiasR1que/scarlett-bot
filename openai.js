require('dotenv').config()
const {Configuration, OpenAIApi} = require('openai')

const configuration = new Configuration({
    organization: "org-YBXI1r6HNlOOF6oML1431UXN",
    apiKey: process.env.OPENAI_API_KEY,
});

module.exports = new OpenAIApi(configuration);
