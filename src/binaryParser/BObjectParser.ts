import { BParser, BParserOptions } from "./types";

export default class BObjectParser implements BParser {

  public size: number;
  private fields: Array<[string, BParser]> = [];

  constructor(fields: { [key: string]: BParser }, protected options: BParserOptions) {
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
