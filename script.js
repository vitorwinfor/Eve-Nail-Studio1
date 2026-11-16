const screenIds = ['inicio','servicos','studio','localizacao','feedback','faq']; //cria uma lista com os nomes das telas do site
const screens = [...document.querySelectorAll('.screen')]; //procura elementos html que possuem a classe screen e guarda uma lista
const navItems = [...document.querySelectorAll('.nav-item')]; //procura todos os elemeentos que possuem a classe nav item

function openScreen(id, updateAddress = true) { // serve para abrir uma tela especifica
  if (!screenIds.includes(id)) id = 'inicio'; //verifica se o nome da tela existe na lista da linha 1
  screens.forEach(screen => screen.classList.toggle('is-active', screen.id === id));//passa por todas as telas do site se a tela tiver o mesmo id solicitado recebe a classe active e as outras perdem 
  navItems.forEach(link => link.classList.toggle('active', link.dataset.screen === id)); //faz a mesma coisa que o de cima so que com o menu
  if (updateAddress) history.replaceState(null, '', `#${id}`); //atualiza o endereco do navegador com o nome da tela
  window.scrollTo({top: 0, behavior: 'smooth'}); //faz a pagina voltar ao topo suavemente
}

document.addEventListener('click', event => { // faz o javascript analisar os clicks realizados no do umento
  const link = event.target.closest('a[href^="#"]'); //identifica se o usuario clicou em algum link q tem #
  if (!link) return; //se n encontrou um link valido interrompe essa parte do codigo
  const id = link.getAttribute('href').slice(1); //pega o endereco do link e remove o primeiro caracter tipo: de #servicos para servicos
  if (screenIds.includes(id)) { // verifica se o destino do link existe na lista de telas
    event.preventDefault(); //impede o comportamento padrao do navegador ao clicar no link
    openScreen(id);//chama a funcao criada anteriormente para abrir a tela escolhida
  }
});

const initialScreen = location.hash.slice(1); //verifica um identififcador de tela no endereco do navegador tipo: se o endereco termina em #feedback, guarda feedback
openScreen(screenIds.includes(initialScreen) ? initialScreen : 'inicio', false); // decide qual tela sera aberta inicialmente

// Carrossel da página inicial
const track = document.getElementById('carouselTrack'); //procura o elemnto que possui o id em destaque
const slides = [...document.querySelectorAll('.carousel-slide')];//mesma coisa que o de cima, procura o elemnto que possui o id carousel-slide
const dotsContainer = document.getElementById('carouselDots');
let currentSlide = 0; 
slides.forEach((_, index) => { //percorre todos os slides don carrossel
  const dot = document.createElement('button'); //cria um novo botao html
  dot.type = 'button';
  dot.setAttribute('aria-label', `Mostrar imagem ${index + 1}`); // adiciona uma descricao acessivel ao botao
  dot.addEventListener('click', () => goToSlide(index));//quando alguem clicar no ponto abre a imagem correspondente
  dotsContainer.appendChild(dot);//coloca o botao dentro do espaco reservado
});
const dots = [...dotsContainer.children]; //guarda todos pontos em uma lista chamada dots
function goToSlide(index) { //cria uma funcao para mudar a imagem do carrossel
  currentSlide = (index + slides.length) % slides.length; //define qual sera i imagem atual
  track.style.transform = `translateX(-${currentSlide * 100}%)`;//move o carrossel horizontalmente para mostrar a imagem selecionada
  dots.forEach((dot, i) => dot.classList.toggle('active', i === currentSlide)); //percorre todosa os pontinhos e detsaca a imagem atual
}
document.getElementById('prevSlide').addEventListener('click', () => goToSlide(currentSlide - 1)); //configura o botao de voltar
document.getElementById('nextSlide').addEventListener('click', () => goToSlide(currentSlide + 1));//configura o de avançar
goToSlide(0);

// Avaliação por estrelas
let selectedRating = 0; //cria uma variavel para guardar a quantia de estrelas
const ratingButtons = [...document.querySelectorAll('.rating-stars button')]; //procura os botoes de etsrelas dentro do elemento com a classe rating stars
ratingButtons.forEach(button => button.addEventListener('click', () => {// percorre todos botoes e configura uma acao para quando alguem clicar em uma estrela
  selectedRating = Number(button.dataset.value);
  ratingButtons.forEach((star, index) => {
    const active = index < selectedRating;//verifica quais estrelas devem ficar ativadas
    star.textContent = active ? '★' : '☆'; //define p simbolo
    star.classList.toggle('chosen', active);
  });
  document.getElementById('ratingHint').textContent = `${selectedRating} de 5 estrelas`;
}));

// Envia os dados do feedback para o WhatsApp do studio.
const WHATSAPP_NUMBER = '5511988322625';

document.getElementById('feedbackForm').addEventListener('submit', event => {
  event.preventDefault();

  const status = document.getElementById('feedbackStatus');

  if (!selectedRating) {
    status.textContent = 'Por favor, selecione uma avaliação por estrelas.';
    return;
  }

  const formData = new FormData(event.currentTarget);
  const nome = String(formData.get('nome') || '').trim();
  const experiencia = String(formData.get('experiencia') || '').trim();
  const comentario = String(formData.get('comentario') || '').trim();

  const mensagem = [
    'Olá! Recebemos um novo feedback pelo site EVE NAIL STUDIO.',
    '',
    `Nome: ${nome}`,
    `Experiência: ${experiencia}`,
    `Comentário: ${comentario}`,
    `Avaliação: ${'★'.repeat(selectedRating)} (${selectedRating}/5 estrelas)`
  ].join('\\n');

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensagem)}`;
  status.textContent = 'Abrindo o WhatsApp com seu feedback...';

  // O WhatsApp abre com a mensagem preenchida; a pessoa confirma o envio no aplicativo.
  window.location.href = whatsappUrl;
});
