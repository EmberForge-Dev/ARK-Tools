document.addEventListener('DOMContentLoaded', function() {
    // Initialisation
    const categorySelect = document.getElementById('category');
    const dinoSelect = document.getElementById('dino');
    const calculateBtn = document.getElementById('calculate-btn');
    const resetBtn = document.getElementById('reset-btn');
    const resultsSection = document.getElementById('results');

    // Charger les catégories
    function loadCategories() {
        categorySelect.innerHTML = '<option value="">-- Sélectionnez --</option>';
        
        for (const category in dinosData) {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categorySelect.appendChild(option);
        }
    }

    // Charger les dinosaures d'une catégorie
    function loadDinos() {
        const selectedCategory = categorySelect.value;
        dinoSelect.innerHTML = '<option value="">-- Sélectionnez --</option>';
        dinoSelect.disabled = !selectedCategory;
        
        if (selectedCategory) {
            const dinos = dinosData[selectedCategory];
            
            for (const dino in dinos) {
                const option = document.createElement('option');
                option.value = dino;
                option.textContent = dino;
                option.dataset.price = dinos[dino];
                dinoSelect.appendChild(option);
            }
        }
    }

    // Calculer le prix
    function calculatePrice() {
        // Validation
        if (!dinoSelect.value) {
            alert('Veuillez sélectionner une créature');
            return;
        }
        
        const level = parseInt(document.getElementById('level').value);
        if (isNaN(level) || level <= 0) {
            alert('Veuillez entrer un niveau valide');
            return;
        }
        
        const mutations = parseInt(document.getElementById('mutations').value) || 0;
        if (mutations < 0) {
            alert('Le nombre de mutations ne peut pas être négatif');
            return;
        }
        
        // Récupération des valeurs
        const basePrice = parseFloat(dinoSelect.options[dinoSelect.selectedIndex].dataset.price);
        const isFemale = document.querySelector('input[name="sex"]:checked').value === 'female';
        
        // Calculs
        const A = level * 0.15;  // level + 15%
        const B = isFemale ? 10 : 0;
        const C = mutations * 2;
        
        const percentageIncrease = A + B + C;
        const finalPrice = basePrice * (1 + percentageIncrease / 100);
        
        // Affichage des résultats
        document.getElementById('result-dino').textContent = dinoSelect.value;
        document.getElementById('result-base-price').textContent = basePrice;
        document.getElementById('result-level').textContent = level;
        document.getElementById('result-sex').textContent = isFemale ? 'Femelle' : 'Mâle';
        document.getElementById('result-mutations').textContent = mutations;
        
        document.getElementById('result-a').textContent = A.toFixed(2) + '%';
        document.getElementById('result-b').textContent = B + '%';
        document.getElementById('result-c').textContent = C + '%';
        document.getElementById('result-total-increase').textContent = percentageIncrease.toFixed(2) + '%';
        document.getElementById('result-final-price').textContent = finalPrice.toFixed(2);
        
        // Afficher la section des résultats
        resultsSection.classList.remove('hidden');
    }

    // Réinitialiser le formulaire
    function resetForm() {
        document.getElementById('level').value = '';
        document.getElementById('mutations').value = '0';
        document.querySelector('input[name="sex"][value="male"]').checked = true;
        resultsSection.classList.add('hidden');
    }

    // Événements
    categorySelect.addEventListener('change', loadDinos);
    calculateBtn.addEventListener('click', calculatePrice);
    resetBtn.addEventListener('click', resetForm);

    // Initialisation
    loadCategories();
});
