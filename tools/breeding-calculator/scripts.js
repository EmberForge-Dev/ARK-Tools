import { dinosBaseStats } from './data/dinos-base-stats.js';
import { dinosMaturation } from './data/dinos-maturation.js';

class BreedingCalculator {
    constructor() {
        this.initElements();
        this.initEvents();
        this.populateDinoList();
    }

    initElements() {
        this.dinoSelect = document.getElementById('dino-select');
        this.calculateBtn = document.getElementById('calculate-btn');
        this.resultsSection = document.getElementById('results-section');
        // Ajouter d'autres éléments DOM nécessaires...
    }

    initEvents() {
        this.dinoSelect.addEventListener('change', () => this.updateBaseStats());
        this.calculateBtn.addEventListener('click', () => this.calculate());
    }

    populateDinoList() {
        this.dinoSelect.innerHTML = '<option value="">Sélectionnez une créature</option>';
        
        Object.keys(dinosBaseStats)
            .sort()
            .forEach(dino => {
                const option = new Option(dino, dino);
                this.dinoSelect.add(option);
            });
    }

    updateBaseStats() {
        const dino = this.dinoSelect.value;
        if (dino && dinosBaseStats[dino]) {
            document.getElementById('melee-male').placeholder = dinosBaseStats[dino].melee;
            document.getElementById('melee-female').placeholder = dinosBaseStats[dino].melee;
            document.getElementById('health-male').placeholder = dinosBaseStats[dino].health;
            document.getElementById('health-female').placeholder = dinosBaseStats[dino].health;
        }
    }

    calculate() {
        try {
            const inputs = this.getInputValues();
            this.validateInputs(inputs);
            
            const results = this.calculateResults(inputs);
            this.displayResults(results);
            
        } catch (error) {
            alert(error.message);
        }
    }

    getInputValues() {
        return {
            dino: this.dinoSelect.value,
            meleeMale: parseInt(document.getElementById('melee-male').value) || 0,
            meleeFemale: parseInt(document.getElementById('melee-female').value) || 0,
            healthMale: parseInt(document.getElementById('health-male').value) || 0,
            healthFemale: parseInt(document.getElementById('health-female').value) || 0,
            currentMutations: parseInt(document.getElementById('mutation-count').value) || 0,
            targetStat: document.getElementById('target-stat').value,
            targetValue: parseInt(document.getElementById('target-value').value) || 0
        };
    }

    validateInputs(inputs) {
        if (!inputs.dino) throw new Error("Sélectionnez une créature");
        if (!inputs.targetValue) throw new Error("Entrez une valeur cible valide");
        if (inputs.meleeMale <= 0 && inputs.meleeFemale <= 0 && 
            inputs.healthMale <= 0 && inputs.healthFemale <= 0) {
            throw new Error("Entrez des stats valides pour au moins un parent");
        }
    }

    calculateResults(inputs) {
        const baseStats = dinosBaseStats[inputs.dino];
        const maturationTime = dinosMaturation[inputs.dino] || 4;
        
        // Calcul des meilleures stats
        const bestMelee = Math.max(inputs.meleeMale, inputs.meleeFemale, baseStats.melee);
        const bestHealth = Math.max(inputs.healthMale, inputs.healthFemale, baseStats.health);
        
        let generations = 0;
        let finalMelee = bestMelee;
        let finalHealth = bestHealth;

        if (inputs.targetStat === 'melee' && inputs.targetValue > bestMelee) {
            generations = Math.ceil((inputs.targetValue - bestMelee) / 2);
            finalMelee = bestMelee + (generations * 2);
        } 
        else if (inputs.targetStat === 'health' && inputs.targetValue > bestHealth) {
            const healthPerMutation = baseStats.health * 0.05;
            generations = Math.ceil((inputs.targetValue - bestHealth) / healthPerMutation);
            finalHealth = bestHealth + (generations * healthPerMutation);
        }

        const totalHours = generations * maturationTime;
        const meleeDiff = (finalMelee - baseStats.melee) / 2;
        const healthDiff = (finalHealth - baseStats.health) / (baseStats.health * 0.05);
        
        return {
            generations,
            mutations: inputs.currentMutations + generations,
            totalTime: `${totalHours} heures (${(totalHours/24).toFixed(1)} jours)`,
            finalMelee: Math.floor(finalMelee),
            finalHealth: Math.floor(finalHealth),
            estimatedLevel: Math.floor(1 + meleeDiff + healthDiff),
            dino: inputs.dino
        };
    }

    displayResults(results) {
        document.getElementById('generations-needed').textContent = results.generations;
        document.getElementById('estimated-mutations').textContent = results.mutations;
        document.getElementById('total-time').textContent = results.totalTime;
        document.getElementById('final-melee').textContent = results.finalMelee;
        document.getElementById('final-health').textContent = results.finalHealth;
        document.getElementById('estimated-level').textContent = results.estimatedLevel;
        
        this.generateTips(results);
        this.resultsSection.classList.remove('hidden');
    }

    generateTips(results) {
        const tipsList = document.getElementById('tips-list');
        tipsList.innerHTML = '';
        
        const tips = [
            `Priorisez les ${results.dino} avec les stats les plus élevées`,
            "Utilisez des incubateurs pour gérer plusieurs générations",
            "Marquez les mutations avec des couleurs différentes"
        ];
        
        if (results.generations > 15) {
            tips.unshift("Cherchez des partenaires avec de meilleures stats de base");
        }
        
        if (results.mutations > 15) {
            tips.push("Gérez attentivement le cap des 20/20 mutations");
        }

        tips.forEach(tip => {
            const li = document.createElement('li');
            li.textContent = tip;
            tipsList.appendChild(li);
        });
    }
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    new BreedingCalculator();
});
