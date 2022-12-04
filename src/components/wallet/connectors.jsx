import { InjectedConnector } from "@web3-react/injected-connector";

export const Injected = new InjectedConnector({
  supportedChainIds: [1, 42, 1337],
});
