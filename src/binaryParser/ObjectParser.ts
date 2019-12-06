import { Parser } from "./types";

export default class ObjectParser extends Parser {

  public size: number;
  private fields: Array<[string, Parser]> = [];

  constructor(fields: { [key: string]: Parser }) {
    super();
    this.fields = Object.entries(fields);
    this.size = this.fields.reduce((prev, parser) => prev + parser[1].size, 0);
  }

  parse(buf: Buffer, offset = 0) {
    const result = {} as { [key: string]: any };
    for (const [key, parser] of this.fields) {
      result[key] = parser.parse(buf, offset);
      offset += parser.size;
    }
    return result;
  }

}
