'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// FAQ data
const faqs = [
  {
    question: "O que é o Rua Segura?",
    answer: "O Rua Segura é uma plataforma comunitária que permite aos cidadãos do Porto reportar e consultar incidentes de segurança na cidade. Nosso objetivo é promover uma comunidade mais segura e informada através da partilha de informações."
  },
  {
    question: "Como posso reportar um incidente?",
    answer: "Para reportar um incidente, clique no botão 'Reportar' na página inicial ou no menu de navegação. Preencha o formulário com os detalhes do incidente, incluindo data, hora, local e descrição. Após submeter, nossa equipe irá revisar e aprovar o relato antes de publicá-lo."
  },
  {
    question: "Os incidentes reportados são verificados?",
    answer: "Sim, todos os incidentes reportados passam por um processo de revisão pela nossa equipe antes de serem publicados. Fazemos isso para garantir a qualidade e veracidade das informações compartilhadas na plataforma."
  },
  {
    question: "Posso reportar um incidente anonimamente?",
    answer: "Embora solicitemos seu nome ao reportar um incidente, esta informação não é exibida publicamente. O email é opcional e só será usado para enviar atualizações sobre o incidente, caso você opte por recebê-las."
  },
  {
    question: "O que acontece com os dados reportados?",
    answer: "Os dados reportados são utilizados para informar a comunidade sobre incidentes de segurança na cidade. Semanalmente, compilamos relatórios com estes dados e os enviamos às autoridades competentes (PSP, Câmara Municipal do Porto e Juntas de Freguesia), contribuindo para políticas públicas de segurança mais eficazes."
  },
  {
    question: "Esta plataforma substitui o contato com as autoridades?",
    answer: "Não. O Rua Segura é uma ferramenta complementar e não substitui os canais oficiais de denúncia. Em caso de emergência, sempre contate o 112. Para denúncias formais, procure a esquadra da PSP mais próxima."
  },
  {
    question: "Como posso saber se há incidentes na minha área?",
    answer: "Na página inicial, você pode visualizar todos os incidentes reportados e aprovados. Utilize os filtros disponíveis para selecionar uma freguesia específica ou um tipo de incidente que lhe interesse."
  },
  {
    question: "Quem está por trás do Rua Segura?",
    answer: "Somos um grupo de cidadãos preocupados com a segurança pública no Porto, incluindo profissionais de tecnologia, segurança, comunicação e serviço social. Trabalhamos voluntariamente para manter esta plataforma ativa e útil para a comunidade."
  },
  {
    question: "Como posso contribuir para o projeto?",
    answer: "Você pode contribuir reportando incidentes, divulgando a plataforma, ou oferecendo suas habilidades como voluntário. Se tiver interesse em colaborar, entre em contato conosco através da página de Contacto."
  },
  {
    question: "Vocês têm alguma ligação com as autoridades oficiais?",
    answer: "Não temos vínculo oficial com as autoridades, mas trabalhamos em colaboração, fornecendo dados que podem ajudar a melhorar a segurança pública. Mantemos um diálogo aberto com a PSP, Câmara Municipal e Juntas de Freguesia."
  }
];

export default function FAQPage() {
  return (
    <div className="container mx-auto max-w-4xl py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Perguntas Frequentes</h1>
      
      <p className="text-muted-foreground mb-8">
        Encontre respostas para as perguntas mais comuns sobre o Rua Segura e como utilizá-lo.
        Se não encontrar o que procura, não hesite em contactar-nos.
      </p>
      
      <Accordion type="single" collapsible className="w-full">
        {faqs.map((faq, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger className="text-left font-medium">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent>
              <p className="text-muted-foreground">{faq.answer}</p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      
      <div className="mt-12 text-center">
        <p className="mb-4">Ainda tem dúvidas?</p>
        <a 
          href="/contacto" 
          className="text-primary hover:underline font-medium"
        >
          Entre em contacto connosco
        </a>
      </div>
    </div>
  );
} 