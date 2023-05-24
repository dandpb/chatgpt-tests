const { Configuration, OpenAIApi } = require("openai");
require("dotenv").config();


const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

async function descreverCodigo(blocoCodigo) {
  // Formatar a entrada como uma pergunta
 const pergunta = `O que está acontecendo neste bloco de código?\n\n${blocoCodigo}\n\nResposta:`;

  // Gerar uma resposta usando o modelo ChatGPT
  const resposta = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: pergunta,
    temperature: 0.6,
    max_tokens: 500,
    stop: null,
  });

  // Retornar a resposta gerada
  return resposta.data.choices[0].text.trim();
}

  try {
        // Ler o arquivo de código JavaScript
        const fs = require('fs');
        const arquivoJS = 'arquivo.js';
        const codigoJS = fs.readFileSync(arquivoJS, 'utf8');

        // Dividir o código em blocos
        const blocos = codigoJS.split('\n\n');

        // Processar cada bloco de código
        (async () => {
          for (let i = 0; i < blocos.length; i++) {
            const bloco = blocos[i];
            const descricao = await descreverCodigo(bloco);
            console.log(`Bloco ${i + 1}: ${descricao}\n`);
          }
        })();

  } catch (error) {
    console.log(error);
  }


