// Données complètes des créatures avec leurs stats de base
const dinosData = {
    "Rex": { baseHealth: 1100, baseMelee: 100 },
    "Spino": { baseHealth: 850, baseMelee: 32 },
    "Therizinosaurus": { baseHealth: 850, baseMelee: 30 },
    "Giganotosaurus": { baseHealth: 80000, baseMelee: 60 },
    "Argentavis": { baseHealth: 800, baseMelee: 20 },
    "Raptor": { baseHealth: 325, baseMelee: 15 },
    "Thylacoleo": { baseHealth: 725, baseMelee: 35 },
    "Megalosaurus": { baseHealth: 800, baseMelee: 35 },
    "Yutyrannus": { baseHealth: 1300, baseMelee: 35 },
    "Shadowmane": { baseHealth: 1100, baseMelee: 40 }
};

// Temps de maturation par créature (en heures)
const maturationTimes = {
    "Rex": 4.5,
    "Spino": 4,
    "Therizinosaurus": 3.5,
    "Giganotosaurus": 9,
    "Argentavis": 2,
    "Raptor": 1.5,
    "Thylacoleo": 3,
    "Megalosaurus": 3,
    "Yutyrannus": 4,
    "Shadowmane": 4
};

document.addEventListener('DOMContentLoaded', function() {
    const dinoSelect = document.getElementById('dino-select');
    const calculateBtn = document.getElementById('calculate-btn');
    const resultsSection = document.getElementById('results-section');
    
    // Remplir la liste des créatures
    function populateDinoList() {
        dinoSelect.innerHTML = '<option value="">Sélectionnez une créature</option>';
        
        Object.keys(dinosData).sort().forEach(dino => {
            const option = document.createElement('option');
            option.value = dino;
            option.textContent = dino;
            dinoSelect.appendChild(option);
        });
    }
    
    // Calculer les projections de reproduction
    function calculateBreeding() {
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
        
        // Validations
        if ((meleeMale <= 0 && meleeFemale <= 0) || (healthMale <= 0 && healthFemale <= 0)) {
            alert("Veuillez entrer des stats valides pour au moins un parent");
            return;
        }
        
        if (targetValue <= 0) {
            alert("Veuillez entrer une valeur cible valide");
            return;
        }
        
        // Calculs de base
        const baseStats = dinosData[selectedDino];
        const bestMelee = Math.max(meleeMale, meleeFemale, baseStats.baseMelee);
        const bestHealth = Math.max(healthMale, healthFemale, baseStats.baseHealth);
        
        // Calcul des générations nécessaires
        let generations = 0;
        let estimatedMutations = currentMutations;
        let finalMelee = bestMelee;
        let finalHealth = bestHealth;
        
        if (targetStat === 'melee') {
            if (targetValue <= bestMelee) {
                generations = 0;
                finalMelee = bestMelee;
            } else {
                generations = Math.ceil((targetValue - bestMelee) / 2);
                estimatedMutations = currentMutations + generations;
                finalMelee = bestMelee + (generations * 2);
            }
        } 
        else if (targetStat === 'health') {
            if (targetValue <= bestHealth) {
                generations = 0;
                finalHealth = bestHealth;
            } else {
                const healthPerMutation = baseStats.baseHealth * 0.05;
                generations = Math.ceil((targetValue - bestHealth) / healthPerMutation);
                estimatedMutations = currentMutations + generations;
                finalHealth = bestHealth + (generations * healthPerMutation);
            }
        }
        
        // Estimation du temps
        const maturationTime = maturationTimes[selectedDino] || 4;
        const totalHours = generations * maturationTime;
        const totalDays = (totalHours / 24).toFixed(1);
        
        // Estimation du niveau
        const meleeDiff = (finalMelee - baseStats.baseMelee) / 2;
        const healthDiff = (finalHealth - baseStats.baseHealth) / (baseStats.baseHealth * 0.05);
        const estimatedLevel = Math.floor(1 + meleeDiff + healthDiff);
        
        // Affichage des résultats
        document.getElementById('generations-needed').textContent = generations;
        document.getElementById('estimated-mutations').textContent = estimatedMutations;
        document.getElementById('total-time').textContent = `${totalHours} heures (${totalDays} jours)`;
        document.getElementById('final-melee').textContent = Math.floor(finalMelee);
        document.getElementById('final-health').textContent = Math.floor(finalHealth);
        document.getElementById('estimated-level').textContent = estimatedLevel;
        
        // Génération des conseils
        generateTips(selectedDino, generations, estimatedMutations);
        
        // Afficher la section résultats
        resultsSection.classList.remove('hidden');
    }
    
    // Générer des conseils personnalisés
    function generateTips(dino, generations, mutations) {
        const tipsList = document.getElementById('tips-list');
        tipsList.innerHTML = '';
        
        const tips = [
            `Utilisez des ${dino} avec les stats les plus élevées comme base`,
            "Élevez séparément les stats de mêlée et santé pour plus d'efficacité",
            "Marquez vos lignées avec des couleurs différentes pour les suivre facilement"
        ];
        
        if (generations > 15) {
            tips.unshift("Cherchez des partenaires avec de meilleures stats de base pour réduire le nombre de générations");
        }
        
        if (mutations > 15) {
            tips.push("Attention au cap des 20/20 mutations qui réduit les chances de nouvelles mutations");
        }
        
        if (maturationTimes[dino] > 5) {
            tips.push(`Les ${dino} ont un temps de maturation long (${maturationTimes[dino]}h), prévoyez plusieurs incubateurs`);
        }
        
        tips.forEach(tip => {
            const li = document.createElement('li');
            li.textContent = tip;
            tipsList.appendChild(li);
        });
    }
    
    // Mettre à jour les placeholders avec les stats de base
    function updateBaseStats() {
        const selectedDino = dinoSelect.value;
        if (selectedDino && dinosData[selectedDino]) {
            const base = dinosData[selectedDino];
            document.getElementById('melee-male').placeholder = base.baseMelee;
            document.getElementById('melee-female').placeholder = base.baseMelee;
            document.getElementById('health-male').placeholder = base.baseHealth;
            document.getElementById('health-female').placeholder = base.baseHealth;
        }
    }
    
    // Initialisation
    populateDinoList();
    
    // Événements
    dinoSelect.addEventListener('change', updateBaseStats);
    calculateBtn.addEventListener('click', calculateBreeding);
});
