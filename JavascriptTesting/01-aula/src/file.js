const { readFile } = require("fs/promises");
const { join } = require("path");
const { error } = require("./constants");

const DEFAULT_OPTION = {
  maxLines: 3,
  fields: ["id", "name", "profession", "age"],
};

class File {
  static async cvsToJson(filepPath) {
    const content = await File.getFileContent(filepPath);
    const validation = File.isValid(content);
    if (!validation.valid) throw new Error(validation.error);

    return content;
  }
}

module.export = File;
