const { readFile } = require("fs/promises");
const { join } = require("path");
const { error } = require("./constants");

const DEFAULT_OPTION = {
  maxLines: 3,
  fields: ["id", "name", "profession", "age"],
};

class File {
  static async cvsToJson(filePath) {
    // Método estático assíncrono que converte um arquivo CSV em JSON.
    // Lê o conteúdo do arquivo usando getFileContent.
    // Valida o conteúdo através de isValid.
    // Se não for válido, lança um erro; caso contrário, retorna o conteúdo.

    const content = await File.getFileContent(filePath);
    const validation = File.isValid(content);
    if (!validation.valid) throw new Error(validation.error);
    return content;
  }

  static async getFileContent(filePath) {
    // Método estático assíncrono que lê o conteúdo de um arquivo.
    // Usa readFile para ler o arquivo de forma assíncrona e converte o resultado para uma string UTF-8.
    return (await readFile(filePath)).toString("utf-8");
  }

  static isValid(csvString, options = DEFAULT_OPTION) {
    //   Valida se o conteúdo do arquivo CSV atende às exigências especificadas em DEFAULT_OPTION.
    //   Divide a string CSV por linhas e separa o cabeçalho do restante.
    //   Verifica se o cabeçalho é válido comparando com os campos esperados.
    //   Verifica se o número de linhas (excluindo o cabeçalho) está dentro do limite permitido.
    //   Retorna um objeto indicando se o arquivo é válido e, se não for, inclui a mensagem de erro correspondente.
    const [header, ...fileWithoutHeader] = csvString.split("\n");
    const isHeaderValid = header === options.fields.join(",");
    if (!isHeaderValid) {
      return {
        error: error.FILE_FIELDS_ERROR_MESSAGE,
        valid: false,
      };
    }

    const isContentLengthAccepted =
      fileWithoutHeader.length > 0 &&
      fileWithoutHeader.length <= options.maxLines;

    if (!isContentLengthAccepted) {
      return {
        error: error.FILE_LENGTH_ERROR_MESSAGE,
        valid: false,
      };
    }

    return { valid: true };
  }
}

(async () => {
  const result = await File.cvsToJson("../mocks/threeItems-valid.csv");
  //const result = await File.cvsToJson("./../mocks/invalid-header.csv");
  console.log("result", result);
})();

module.exports = File;
