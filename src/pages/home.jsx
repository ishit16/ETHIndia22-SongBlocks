import { WalletContainer } from "../components/containers/connectWallet";
import { PageContainer } from "../components/shared/pageContainer";
import Sparkles from "../components/sparkle/generateSparkle";

export const Home = () => {
  return (
    <PageContainer disable={[]}>
      {/* <Sparkles> */}
      <WalletContainer />
      {/* </Sparkles> */}
    </PageContainer>
  );
};
