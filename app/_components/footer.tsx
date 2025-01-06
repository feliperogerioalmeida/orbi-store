import ORBI_CONSTANTS from "../constants";

const Footer = () => {
  return (
    <footer className="flex flex-col bg-primary text-white justify-center items-center p-2">
      <p className="text-xs text-center">
        {" "}
        {ORBI_CONSTANTS.BUSINESS.NAME} {ORBI_CONSTANTS.BUSINESS.CNPJ}
      </p>
      <p className="text-xs text-center ">
        © 2025 todos os direitos reservados
      </p>
    </footer>
  );
};

export default Footer;
