const { Configuration, OpenAIApi } = require("openai");
const fs = require('fs');
const esprima = require('esprima');

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

// Função para encontrar e extrair nomes de métodos em um arquivo de código JavaScript
function extrairMetodosArquivoJS(caminhoArquivo) {
  const codigo = fs.readFileSync(caminhoArquivo, 'utf8');

  // Analisar o código em uma estrutura de árvore sintática
  const arvore = esprima.parseScript(codigo, { range: true });

  // Objeto de hash para armazenar nome do método e seu conteúdo
  const metodos = {};

  // Percorrer a árvore sintática
  percorrerArvore(arvore, (no) => {
    if (no.type === 'FunctionDeclaration' || no.type === 'FunctionExpression' || no.type === 'ArrowFunctionExpression') {
      const nomeMetodo = no.id.name || '[Anônimo]';
      const conteudoMetodo = codigo.substring(no.range[0], no.range[1]);
      metodos[nomeMetodo] = conteudoMetodo;
    }
  });

  return metodos;
}

// Função auxiliar para percorrer a árvore sintática
function percorrerArvore(no, callback) {
  callback(no);
  for (const chave in no) {
    if (no.hasOwnProperty(chave)) {
      const valor = no[chave];
      if (typeof valor === 'object' && valor !== null) {
        if (Array.isArray(valor)) {
          valor.forEach((item) => percorrerArvore(item, callback));
        } else {
          percorrerArvore(valor, callback);
        }
      }
    }
  }
}


  try {
        // Ler o arquivo de código JavaScript
        const arquivoJS = 'arquivo.js';

        // Dividir o código em metodos
        const metodos = extrairMetodosArquivoJS(arquivoJS);

        // Processar cada bloco de código
        (async () => {

          for (const chave in metodos) {
            if (metodos.hasOwnProperty(chave)) {
              const valor = metodos[chave];
              const descricao = await descreverCodigo(valor);
              console.log(`Chave: ${chave}, descriçao: ${descricao}`);
            }
          }

        })();

  } catch (error) {
    console.log(error);
  }


