// Configuração do AOS (Animate On Scroll)
AOS.init({
    // Configurações globais
    duration: 1000,           // Duração da animação em ms
    once: true,                // Animação acontece apenas uma vez
    mirror: false,             // Não animar ao rolar para cima
    offset: 100,                // Offset em px do trigger
    delay: 0,                   // Delay padrão
    easing: 'ease-in-out',      // Easing function
    
    // Configurações avançadas
    anchorPlacement: 'top-bottom', // Quando a animação deve acontecer
    disable: false,              // Desabilitar em dispositivos específicos
    startEvent: 'DOMContentLoaded', // Evento que inicia o AOS
    initClassName: 'aos-init',   // Classe após inicialização
    animatedClassName: 'aos-animate', // Classe durante animação
    useClassNames: false,        // Usar classes para animações
    disableMutationObserver: false, // Desabilitar observer de mutação
    debounceDelay: 50,           // Delay do debounce
    throttleDelay: 99,           // Delay do throttle
});

// Configurações específicas para elementos
document.querySelectorAll('[data-aos]').forEach(element => {
    // Adicionar classes de atraso baseadas no data-aos-delay
    const delay = element.getAttribute('data-aos-delay');
    if (delay) {
        element.style.transitionDelay = `${delay}ms`;
    }
    
    // Adicionar classes de duração
    const duration = element.getAttribute('data-aos-duration');
    if (duration) {
        element.style.transitionDuration = `${duration}ms`;
    }
    
    // Adicionar easing personalizado
    const easing = element.getAttribute('data-aos-easing');
    if (easing) {
        element.style.transitionTimingFunction = easing;
    }
});

// Atualizar AOS após carregar conteúdo dinâmico
function refreshAOS() {
    AOS.refresh();
}

// Atualizar AOS quando novos elementos são adicionados
const observer = new MutationObserver(() => {
    AOS.refresh();
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});