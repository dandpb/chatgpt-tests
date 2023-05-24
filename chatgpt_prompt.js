const { Configuration, OpenAIApi } = require("openai");
require("dotenv").config();

async function  main() {
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  const prompt = "como funciona o parametro de max_tokens e temperature?";

  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt,
    temperature: 0,
    max_tokens: 1500,
    top_p: 1.0,
    frequency_penalty: 0.0,
    presence_penalty: 0.0,
    stop: ["\"\"\""],
  });

  console.log(response.data.choices[0].text);
}
main();

