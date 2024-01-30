import { CalculatePrice } from "@/domain/service/CalculatePrice";
import { CalculateTokens } from "@/domain/service/CalculateTokens";

export type Model =
  | "gpt-3.5-turbo"
  | "gpt-3.5-turbo-1106"
  | "gpt-3.5-turbo-0301"
  | "gpt-4"
  | "gpt-4-0314"
  | "gpt-4-32k"
  | "gpt-4-32k-0314";

export interface Message {
  name?: string;
  role: "system" | "user" | "assistant";
  content: string;
}

export class Prompt {
  constructor(
    private _value: string | Message[],
    readonly model: Model = "gpt-3.5-turbo"
  ) {}

  set value(value: string | Message[]) {
    if (typeof value === "string") {
      this._value = [
        {
          role: "user",
          content: value,
        },
      ];
    }

    this._value = value;
  }

  get value(): Message[] {
    if (typeof this._value === "string") {
      return [
        {
          role: "user",
          content: this._value,
        },
      ];
    }

    return this._value;
  }

  get tokens(): number {
    return CalculateTokens.calculate(this);
  }

  get price(): number {
    return CalculatePrice.calculate(this);
  }

  replaceKeys(keys: { [key: string]: string }): void {
    if (typeof this._value === "string") {
      let value = this._value;
      Object.keys(keys).forEach((key) => {
        value = value.replaceAll(key, keys[key]);
      });
      this._value = value;
    } else {
      this._value.forEach((message) => {
        let value = message.content;
        Object.keys(keys).forEach((key) => {
          value = value.replaceAll(key, keys[key]);
        });
        message.content = value;
      });
    }
  }
}
