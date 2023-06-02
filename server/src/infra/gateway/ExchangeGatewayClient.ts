import { ExchangeGateway } from "@/contract/gateway/ExchangeGateway";

export class ExchangeGatewayClient implements ExchangeGateway {
  static async usdToBrl() {
    const response = (await fetch("https://economia.awesomeapi.com.br/json/last/USD-BRL")) as any;
    const data = await response.json();
    return Number(data.USDBRL.ask);
  }
}
