// scripts/app.js

/**
 * @fileoverview Main JavaScript logic for the ARK Breeding Calculator.
 * Handles UI interactions, data loading, calculations, and result display.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Get references to DOM elements
    const categorySelect = document.getElementById('category');
    const dinoSelect = document.getElementById('dino');
    const levelInput = document.getElementById('level');
    const mutationsInput = document.getElementById('mutations');
    const sexRadios = document.querySelectorAll('input[name="sex"]');
    const calculateBtn = document.getElementById('calculate-btn');
    const resetBtn = document.getElementById('reset-btn');
    const resultsSection = document.getElementById('results');

    // Message box elements for custom alerts
    const messageBox = document.getElementById('message-box');
    const messageContent = document.getElementById('message-content');
    const messageCloseBtn = document.getElementById('message-close-btn');

    // Result display elements
    const resultDino = document.getElementById('result-dino');
    const resultBasePrice = document.getElementById('result-base-price');
    const resultLevel = document.getElementById('result-level');
    const resultSex = document.getElementById('result-sex');
    const resultMutations = document.getElementById('result-mutations');
    const resultA = document.getElementById('result-a');
    const resultB = document.getElementById('result-b');
    const resultC = document.getElementById('result-c');
    const resultTotalIncrease = document.getElementById('result-total-increase');
    const resultFinalPrice = document.getElementById('result-final-price');

    /**
     * Displays a custom message box with the given message.
     * @param {string} message - The message to display.
     */
    function showMessage(message) {
        messageContent.textContent = message;
        messageBox.classList.remove('hidden');
    }

    /**
     * Hides the custom message box.
     */
    function hideMessage() {
        messageBox.classList.add('hidden');
    }

    /**
     * Populates the category dropdown menu using data from dinoData.
     */
    function populateCategories() {
        // Clear existing options, keeping the first placeholder option
        while (categorySelect.options.length > 1) {
            categorySelect.remove(1);
        }
        // Iterate over dinoData categories and add them as options
        for (const category in dinoData) {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categorySelect.appendChild(option);
        }
    }

    /**
     * Populates the creature dropdown menu based on the selected category.
     * Disables the dropdown if no category is selected.
     */
    function populateDinos() {
        const selectedCategory = categorySelect.value;
        // Clear existing options, keeping the first placeholder option
        while (dinoSelect.options.length > 1) {
            dinoSelect.remove(1);
        }
        dinoSelect.disabled = true; // Disable by default
        dinoSelect.innerHTML = '<option value="">-- Choisissez une créature --</option>'; // Reset placeholder text

        // If a category is selected and exists in dinoData, populate the dino dropdown
        if (selectedCategory && dinoData[selectedCategory]) {
            dinoData[selectedCategory].forEach(dino => {
                const option = document.createElement('option');
                option.value = dino.name;
                option.textContent = dino.name;
                // Store base price in a data attribute for easy retrieval during calculation
                option.dataset.basePrice = dino.basePrice;
                dinoSelect.appendChild(option);
            });
            dinoSelect.disabled = false; // Enable the dropdown
        } else {
            // If no category selected, show appropriate placeholder
            dinoSelect.innerHTML = '<option value="">-- Choisissez d\'abord une catégorie --</option>';
        }
    }

    /**
     * Performs the breeding calculation based on user inputs and displays the results.
     * Includes input validation using the custom message box.
     */
    function calculateBreeding() {
        // Get selected dino details
        const selectedDinoOption = dinoSelect.options[dinoSelect.selectedIndex];
        const dinoName = selectedDinoOption ? selectedDinoOption.value : '';
        const basePrice = selectedDinoOption ? parseFloat(selectedDinoOption.dataset.basePrice) : 0;
        
        // Get input values, converting to numbers
        const level = parseInt(levelInput.value);
        const mutations = parseInt(mutationsInput.value);
        const sex = document.querySelector('input[name="sex"]:checked').value;

        // Input validation
        if (!dinoName || isNaN(level) || level <= 0 || isNaN(mutations) || mutations < 0) {
            showMessage('Veuillez sélectionner une créature et entrer des valeurs valides (niveau > 0, mutations >= 0).');
            return; // Stop function execution if validation fails
        }

        // --- Calculation Logic ---
        // A: Level contribution to total increase. Each level point contributes 0.15% to the total increase.
        const levelIncrease = level * 0.15;
        
        // B: Sex bonus. Females provide an additional 10% increase.
        const sexBonus = (sex === 'female') ? 10 : 0;
        
        // C: Mutations contribution. Each mutation contributes 2% to the total increase.
        const mutationIncrease = mutations * 2;

        // Sum of all percentage increases
        const totalIncreasePercentage = levelIncrease + sexBonus + mutationIncrease;
        
        // Calculate the final price: Base Price * (1 + Total Increase / 100)
        const finalPrice = basePrice * (1 + totalIncreasePercentage / 100);

        // --- Display Results ---
        resultDino.textContent = dinoName;
        // Format base price with French locale for currency display
        resultBasePrice.textContent = `${basePrice.toLocaleString('fr-FR')} $`;
        resultLevel.textContent = level;
        resultSex.textContent = (sex === 'male') ? 'Mâle' : 'Femelle';
        resultMutations.textContent = mutations;

        // Display individual calculation components, formatted to two decimal places
        resultA.textContent = `${levelIncrease.toFixed(2)}%`;
        resultB.textContent = `${sexBonus.toFixed(2)}%`;
        resultC.textContent = `${mutationIncrease.toFixed(2)}%`;
        resultTotalIncrease.textContent = `${totalIncreasePercentage.toFixed(2)}%`;
        // Format final price with French locale for currency display
        resultFinalPrice.textContent = `${finalPrice.toFixed(2).toLocaleString('fr-FR')} $`;

        // Show the results section
        resultsSection.classList.remove('hidden');
    }

    /**
     * Resets all form inputs and hides the results section.
     */
    function resetCalculator() {
        categorySelect.value = ''; // Reset category dropdown
        populateDinos(); // Reset dino dropdown to initial state
        levelInput.value = ''; // Clear level input
        mutationsInput.value = '0'; // Reset mutations to 0
        // Set sex radio button back to 'Mâle'
        document.querySelector('input[name="sex"][value="male"]').checked = true;
        resultsSection.classList.add('hidden'); // Hide results section
        hideMessage(); // Ensure message box is hidden
    }

    // --- Event Listeners ---
    // Listen for changes on the category dropdown to update the dino dropdown
    categorySelect.addEventListener('change', populateDinos);
    // Listen for clicks on the calculate button to perform calculations
    calculateBtn.addEventListener('click', calculateBreeding);
    // Listen for clicks on the reset button to clear the form
    resetBtn.addEventListener('click', resetCalculator);
    // Listen for clicks on the message box close button to hide it
    messageCloseBtn.addEventListener('click', hideMessage);

    // --- Initial Setup ---
    // Populate the category dropdown when the page loads
    populateCategories();
    // Populate the dino dropdown initially to set its disabled state and placeholder text
    populateDinos(); 
});
