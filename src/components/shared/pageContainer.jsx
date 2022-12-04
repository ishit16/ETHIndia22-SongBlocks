import { Footer } from "./footer";
import { Header } from "./header";
import "./shared.css";
export const PageContainer = ({ disable = [], children }) => {
  return (
    <>
      {!disable.includes("header") && <Header />}
      <div
        className="flex flex-col py-0 px-3 page-container-height"
        disable={disable}
      >
        {children}
        {!disable.includes("footer") && <Footer />}
      </div>
    </>
  );
};
