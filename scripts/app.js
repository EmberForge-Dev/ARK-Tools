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

function initBadgeTooltips() {
    const badges = document.querySelectorAll('.card-badge');
    
    badges.forEach(badge => {
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        
        if (badge.textContent === 'Populaire') {
            tooltip.textContent = 'L\'outil le plus utilisé par la communauté';
        } else if (badge.textContent === 'Bientôt') {
            tooltip.textContent = 'En cours de développement - Disponible prochainement';
        } else if (badge.textContent === '+ Efficace') {
            tooltip.textContent = 'Optimisez votre gameplay avec cet outil avancé';
        }
        
        badge.appendChild(tooltip);
        
        badge.addEventListener('mouseenter', () => {
            tooltip.style.visibility = 'visible';
            tooltip.style.opacity = '1';
        });
        
        badge.addEventListener('mouseleave', () => {
            tooltip.style.visibility = 'hidden';
            tooltip.style.opacity = '0';
        });
    });
}

// Ajout des keyframes pour l'animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .tooltip {
        position: absolute;
        bottom: 100%;
        left: 50%;
        transform: translateX(-50%);
        background-color: #333;
        color: white;
        padding: 5px 10px;
        border-radius: 4px;
        font-size: 0.8rem;
        white-space: nowrap;
        visibility: hidden;
        opacity: 0;
        transition: opacity 0.3s;
        z-index: 10;
        margin-bottom: 8px;
    }
    
    .tooltip::after {
        content: '';
        position: absolute;
        top: 100%;
        left: 50%;
        margin-left: -5px;
        border-width: 5px;
        border-style: solid;
        border-color: #333 transparent transparent transparent;
    }
`;
document.head.appendChild(style);
