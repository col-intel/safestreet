export default function SobrePage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Sobre o Projeto Rua Segura</h1>
      
      <div className="prose dark:prose-invert max-w-none">
        <p className="lead">
          O projeto Rua Segura nasceu da necessidade de criar um espaço onde os cidadãos do Porto possam reportar e consultar incidentes de segurança na cidade, promovendo uma comunidade mais segura e informada.
        </p>
        
        <h2>Nossa Missão</h2>
        <p>
          Capacitar os cidadãos do Porto com informações sobre segurança pública, permitindo que tomem decisões mais informadas sobre suas rotinas diárias e contribuam ativamente para a segurança da comunidade.
        </p>
        
        <h2>Como Funcionamos</h2>
        <p>
          O Rua Segura permite que qualquer pessoa reporte incidentes de segurança que tenha presenciado ou sido vítima. Estes relatos são revisados pela nossa equipe antes de serem publicados, garantindo a qualidade e veracidade das informações.
        </p>
        <p>
          Semanalmente, compilamos relatórios com os dados coletados e os enviamos às autoridades competentes (PSP, Câmara Municipal do Porto e Juntas de Freguesia), contribuindo para políticas públicas de segurança mais eficazes.
        </p>
        
        <h2>Nossa Equipe</h2>
        <p>
          Somos um grupo de cidadãos preocupados com a segurança pública no Porto, incluindo profissionais de tecnologia, segurança, comunicação e serviço social. Trabalhamos voluntariamente para manter esta plataforma ativa e útil para a comunidade.
        </p>
        
        <h2>Transparência e Privacidade</h2>
        <p>
          Valorizamos a transparência em nossos processos e o respeito à privacidade dos usuários. Não compartilhamos informações pessoais com terceiros sem consentimento explícito e utilizamos os dados coletados apenas para os fins declarados em nossa política de privacidade.
        </p>
        
        <h2>Colaboração com Autoridades</h2>
        <p>
          Embora não sejamos uma entidade oficial, trabalhamos em colaboração com as autoridades locais, fornecendo dados que podem ajudar a melhorar a segurança pública. No entanto, enfatizamos que esta plataforma não substitui os canais oficiais de denúncia - em caso de emergência, sempre contate o 112.
        </p>
        
        <h2>Contato</h2>
        <p>
          Para dúvidas, sugestões ou parcerias, entre em contato conosco através da página de <a href="/contacto" className="text-primary hover:underline">Contacto</a>.
        </p>
      </div>
    </div>
  );
} 