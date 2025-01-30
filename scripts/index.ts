import { removeFields, renameToSnakeCase } from "./utils";

const path = "./data/original.json";
const file = Bun.file(path);

const contents = await file.json();
const c1 = removeFields(contents, ["spine", "cutscene"]);
const data = renameToSnakeCase(c1);

await Bun.write("./data/char-id.json", JSON.stringify(data));