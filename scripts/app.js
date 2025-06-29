document.addEventListener('DOMContentLoaded', function() {
    // Animation au chargement
    animateCards();
    
    // Gestion des tooltips pour les badges
    initBadgeTooltips();
});

function animateCards() {
    const cards = document.querySelectorAll('.tool-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.animation = `fadeInUp 0.5s ${index * 0.1}s forwards`;
    });
}
