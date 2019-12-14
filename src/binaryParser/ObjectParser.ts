import { Parser } from "./types";

interface ObjectParserArg {
  [key: string]: Parser;
};

type ObjectParserReturnType<T extends ObjectParserArg> = {
  [key in keyof T]: ReturnType<T[key]['parse']>;
}

export default class ObjectParser<T extends ObjectParserArg> extends Parser {

  public size: number;
  private fields: Array<[string, Parser]> = [];

  constructor(fields: T) {
    super();
    this.fields = Object.entries(fields);
    this.size = this.fields.reduce((prev, parser) => prev + parser[1].size, 0);
  }

  parse(buf: Buffer, offset = 0): ObjectParserReturnType<T> {
    const result = {} as any;
    for (const [key, parser] of this.fields) {
      result[key] = parser.parse(buf, offset);
      offset += parser.size;
    }
    return result as ObjectParserReturnType<T>;
  }

}
