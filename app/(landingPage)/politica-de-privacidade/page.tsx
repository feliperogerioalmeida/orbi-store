const Page = () => {
  return (
    <div className="max-w-3xl mx-auto py-12 px-6">
      <h1 className="text-3xl font-bold mb-6">Política de Privacidade</h1>
      <p className="text-gray-700 mb-4">
        Última atualização: <strong>{new Date().toLocaleDateString()}</strong>
      </p>

      <p className="mb-4">
        Bem-vindo à <strong>Orbi Store</strong>. Nós valorizamos a sua
        privacidade e estamos comprometidos em proteger seus dados pessoais.
        Esta Política de Privacidade explica como coletamos, usamos e
        armazenamos suas informações.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">
        1. Informações que Coletamos
      </h2>

      <h3 className="text-lg font-medium mt-4">
        1.1. Informações fornecidas por você
      </h3>
      <ul className="list-disc ml-6 mb-4">
        <li>Nome completo</li>
        <li>Endereço de e-mail</li>
        <li>Número de telefone</li>
        <li>CPF (quando necessário para emissão de nota fiscal)</li>
        <li>Endereço de entrega</li>
        <li>
          Informações de pagamento (NÃO armazenamos dados de cartões de crédito)
        </li>
      </ul>

      <h3 className="text-lg font-medium mt-4">
        1.2. Informações coletadas automaticamente
      </h3>
      <ul className="list-disc ml-6 mb-4">
        <li>Endereço de IP</li>
        <li>Tipo de navegador e dispositivo</li>
        <li>Páginas visitadas e tempo de navegação</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-4">
        2. Como Utilizamos Suas Informações
      </h2>
      <ul className="list-disc ml-6 mb-4">
        <li>Para processar suas compras e entregas</li>
        <li>Para enviar comunicações relacionadas ao seu pedido</li>
        <li>Para melhorar a experiência do usuário em nosso site</li>
        <li>Para oferecer suporte ao cliente</li>
        <li>Para cumprir obrigações legais e regulatórias</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-4">
        3. Compartilhamento de Dados
      </h2>
      <p className="mb-4">
        Não vendemos ou compartilhamos seus dados com terceiros, exceto:
      </p>
      <ul className="list-disc ml-6 mb-4">
        <li>Com parceiros logísticos para entrega dos pedidos</li>
        <li>Com instituições financeiras para processamento de pagamentos</li>
        <li>Quando exigido por lei</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-4">4. Seus Direitos</h2>
      <p className="mb-4">
        Você tem o direito de acessar, corrigir ou excluir seus dados pessoais.
        Para isso, entre em contato conosco pelo e-mail{" "}
        <strong>suporte@orbi-store.com</strong>.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">
        5. Segurança dos Dados
      </h2>
      <p className="mb-4">
        Adotamos medidas de segurança para proteger seus dados contra acessos
        não autorizados e vazamentos.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">
        6. Alterações nesta Política
      </h2>
      <p className="mb-4">
        Podemos atualizar esta Política de Privacidade periodicamente.
        Recomendamos que você revise esta página regularmente.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">7. Contato</h2>
      <p>
        Para dúvidas sobre esta Política de Privacidade, entre em contato pelo
        e-mail <strong>suporte@orbi-store.com</strong>.
      </p>
    </div>
  );
};

export default Page;
