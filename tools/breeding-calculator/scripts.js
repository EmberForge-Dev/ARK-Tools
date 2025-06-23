// Données des créatures avec leurs taux de base
const dinosData = {
    "Rex": { baseHealth: 1100, baseMelee: 100 },
    "Spino": { baseHealth: 850, baseMelee: 32 },
    "Therizinosaurus": { baseHealth: 850, baseMelee: 30 },
    "Giganotosaurus": { baseHealth: 80000, baseMelee: 60 },
    "Argentavis": { baseHealth: 800, baseMelee: 20 },
    // Ajoutez d'autres créatures ici...
};

// Temps de maturation par créature (en heures)
const maturationTimes = {
    "Rex": 4.5,
    "Spino": 4,
    "Therizinosaurus": 3.5,
    "Giganotosaurus": 9,
    "Argentavis": 2,
    // Ajoutez d'autres créatures ici...
};

document.addEventListener('DOMContentLoaded', function() {
    const dinoSelect = document.getElementById('dino-select');
    const calculateBtn = document.getElementById('calculate-btn');
    
    // Remplir la liste des créatures
    for (const dino in dinosData) {
        const option = document.createElement('option');
        option.value = dino;
        option.textContent = dino;
        dinoSelect.appendChild(option);
    }
    
    // Gestion du calcul
    calculateBtn.addEventListener('click', function() {
        const selectedDino = dinoSelect.value;
        if (!selectedDino) {
            alert("Veuillez sélectionner une créature");
            return;
        }
        
        // Récupérer les valeurs des inputs
        const meleeMale = parseInt(document.getElementById('melee-male').value) || 0;
        const meleeFemale = parseInt(document.getElementById('melee-female').value) || 0;
        const healthMale = parseInt(document.getElementById('health-male').value) || 0;
        const healthFemale = parseInt(document.getElementById('health-female').value) || 0;
        const currentMutations = parseInt(document.getElementById('mutation-count').value) || 0;
        const targetStat = document.getElementById('target-stat').value;
        const targetValue = parseInt(document.getElementById('target-value').value) || 0;
        
        // Calculs de base
        const baseStats = dinosData[selectedDino];
        const bestMelee = Math.max(meleeMale, meleeFemale);
        const bestHealth = Math.max(healthMale, healthFemale);
        
        // Calcul des générations nécessaires
        let generations = 0;
        let estimatedMutations = currentMutations;
        let finalMelee = bestMelee;
        let finalHealth = bestHealth;
        
        if (targetStat === 'melee' && targetValue > bestMelee) {
            const needed = Math.ceil((targetValue - bestMelee) / 2);
            generations = needed;
            estimatedMutations += needed;
            finalMelee = bestMelee + (needed * 2);
        } 
        else if (targetStat === 'health' && targetValue > bestHealth) {
            const needed = Math.ceil((targetValue - bestHealth) / (baseStats.baseHealth * 0.05));
            generations = needed;
            estimatedMutations += needed;
            finalHealth = bestHealth + (needed * baseStats.baseHealth * 0.05);
        }
        
        // Estimation du temps
        const maturationTime = maturationTimes[selectedDino] || 4;
        const totalHours = generations * maturationTime;
        const totalDays = (totalHours / 24).toFixed(1);
        
        // Estimation du niveau
        const levelDiff = (finalMelee - baseStats.baseMelee) / 2 + 
                         (finalHealth - baseStats.baseHealth) / (baseStats.baseHealth * 0.05);
        const estimatedLevel = Math.floor(1 + levelDiff);
        
        // Affichage des résultats
        document.getElementById('generations-needed').textContent = generations;
        document.getElementById('estimated-mutations').textContent = estimatedMutations;
        document.getElementById('total-time').textContent = `${totalHours} heures (${totalDays} jours)`;
        document.getElementById('final-melee').textContent = finalMelee;
        document.getElementById('final-health').textContent = Math.floor(finalHealth);
        document.getElementById('estimated-level').textContent = estimatedLevel;
        
        // Conseils
        const tipsList = document.getElementById('tips-list');
        tipsList.innerHTML = '';
        
        const tips = [
            "Élevez séparément les stats de mêlée et santé pour plus d'efficacité",
            "Utilisez des jumeaux pour conserver les bonnes stats pendant les mutations",
            "Marquez vos lignées avec des couleurs différentes pour les suivre facilement"
        ];
        
        if (generations > 20) {
            tips.unshift("Considérez trouver un partenaire avec de meilleures stats de base");
        }
        
        if (estimatedMutations > 20) {
            tips.push("Attention au cap des 20/20 mutations d'un côté qui ralentit les nouvelles mutations");
        }
        
        tips.forEach(tip => {
            const li = document.createElement('li');
            li.textContent = tip;
            tipsList.appendChild(li);
        });
        
        // Afficher la section résultats
        document.getElementById('results-section').classList.remove('hidden');
    });
    
    // Mettre à jour les placeholders avec les stats de base
    dinoSelect.addEventListener('change', function() {
        const selectedDino = this.value;
        if (selectedDino && dinosData[selectedDino]) {
            const base = dinosData[selectedDino];
            document.getElementById('melee-male').placeholder = base.baseMelee;
            document.getElementById('melee-female').placeholder = base.baseMelee;
            document.getElementById('health-male').placeholder = base.baseHealth;
            document.getElementById('health-female').placeholder = base.baseHealth;
        }
    });
});
