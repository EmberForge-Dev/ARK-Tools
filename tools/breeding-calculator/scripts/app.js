// scripts/app.js

/**
 * @fileoverview Main JavaScript logic for the ARK Breeding Calculator.
 * Handles UI interactions, data loading, stat inheritance calculations, and result display.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Get references to DOM elements
    const categorySelect = document.getElementById('category');
    const dinoSelect = document.getElementById('dino');
    const calculateBtn = document.getElementById('calculate-btn');
    const resetBtn = document.getElementById('reset-btn');
    const resultsSection = document.getElementById('results');

    // Message box elements for custom alerts
    const messageBox = document.getElementById('message-box');
    const messageContent = document.getElementById('message-content');
    const messageCloseBtn = document.getElementById('message-close-btn');

    // Stat input fields for Male Parent
    const maleHealthInput = document.getElementById('male-health');
    const maleStaminaInput = document.getElementById('male-stamina');
    const maleOxygenInput = document.getElementById('male-oxygen');
    const maleFoodInput = document.getElementById('male-food');
    const maleWeightInput = document.getElementById('male-weight');
    const maleMeleeInput = document.getElementById('male-melee');
    const maleSpeedInput = document.getElementById('male-speed');
    const maleMutationsInput = document.getElementById('male-mutations');

    // Stat input fields for Female Parent
    const femaleHealthInput = document.getElementById('female-health');
    const femaleStaminaInput = document.getElementById('female-stamina');
    const femaleOxygenInput = document.getElementById('female-oxygen');
    const femaleFoodInput = document.getElementById('female-food');
    const femaleWeightInput = document.getElementById('female-weight');
    const femaleMeleeInput = document.getElementById('female-melee');
    const femaleSpeedInput = document.getElementById('female-speed');
    const femaleMutationsInput = document.getElementById('female-mutations');

    // Result display elements
    const resultDino = document.getElementById('result-dino');
    const resultHealth = document.getElementById('result-health');
    const resultStamina = document.getElementById('result-stamina');
    const resultOxygen = document.getElementById('result-oxygen');
    const resultFood = document.getElementById('result-food');
    const resultWeight = document.getElementById('result-weight');
    const resultMelee = document.getElementById('result-melee');
    const resultSpeed = document.getElementById('result-speed');
    const resultTotalMutations = document.getElementById('result-total-mutations');
    const resultPotentialLevel = document.getElementById('result-potential-level');

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
                dinoSelect.appendChild(option);
            });
            dinoSelect.disabled = false; // Enable the dropdown
        } else {
            // If no category selected, show appropriate placeholder
            dinoSelect.innerHTML = '<option value="">-- Choisissez d\'abord une catégorie --</option>';
        }
    }

    /**
     * Gets the stats from the input fields for a given parent type (male/female).
     * @param {string} prefix - 'male' or 'female'
     * @returns {object} An object containing the parent's stats and mutations.
     */
    function getParentStats(prefix) {
        return {
            health: parseInt(document.getElementById(`${prefix}-health`).value) || 0,
            stamina: parseInt(document.getElementById(`${prefix}-stamina`).value) || 0,
            oxygen: parseInt(document.getElementById(`${prefix}-oxygen`).value) || 0,
            food: parseInt(document.getElementById(`${prefix}-food`).value) || 0,
            weight: parseInt(document.getElementById(`${prefix}-weight`).value) || 0,
            melee: parseInt(document.getElementById(`${prefix}-melee`).value) || 0,
            speed: parseInt(document.getElementById(`${prefix}-speed`).value) || 0,
            mutations: parseInt(document.getElementById(`${prefix}-mutations`).value) || 0
        };
    }

    /**
     * Performs the breeding calculation based on parent stats and displays the results.
     * This simulates ARK's stat inheritance (55% higher, 45% lower) and mutation effects.
     */
    function calculateBreedingStats() {
        const selectedDinoOption = dinoSelect.options[dinoSelect.selectedIndex];
        const dinoName = selectedDinoOption ? selectedDinoOption.value : '';

        if (!dinoName) {
            showMessage('Veuillez sélectionner une créature.');
            return;
        }

        const maleStats = getParentStats('male');
        const femaleStats = getParentStats('female');

        // Validate all stat inputs are non-negative
        const allStats = [
            maleStats.health, maleStats.stamina, maleStats.oxygen, maleStats.food, maleStats.weight, maleStats.melee, maleStats.speed, maleStats.mutations,
            femaleStats.health, femaleStats.stamina, femaleStats.oxygen, femaleStats.food, femaleStats.weight, femaleStats.melee, femaleStats.speed, femaleStats.mutations
        ];

        for (const stat of allStats) {
            if (isNaN(stat) || stat < 0) {
                showMessage('Veuillez entrer des nombres valides et non négatifs pour toutes les statistiques et mutations.');
                return;
            }
        }

        // --- Stat Inheritance Logic ---
        // In ARK, a baby inherits the higher stat from either parent 55% of the time,
        // and the lower stat 45% of the time. For a calculator, we often assume
        // the best-case scenario (inheriting the higher stat) or show the range.
        // For simplicity, we'll show the *potential* highest inherited stats.
        const potentialBabyStats = {
            health: Math.max(maleStats.health, femaleStats.health),
            stamina: Math.max(maleStats.stamina, femaleStats.stamina),
            oxygen: Math.max(maleStats.oxygen, femaleStats.oxygen),
            food: Math.max(maleStats.food, femaleStats.food),
            weight: Math.max(maleStats.weight, femaleStats.weight),
            melee: Math.max(maleStats.melee, femaleStats.melee),
            speed: Math.max(maleStats.speed, femaleStats.speed)
        };

        // --- Mutation Logic ---
        // Mutations add +2 points to a random stat. They also increase the mutation counter.
        // Here, we'll just sum the mutations from both parents.
        // Note: ARK's mutation system is complex (e.g., mutation counter caps at 20/20 per side).
        // For this calculator, we'll simply sum them.
        const totalMutations = maleStats.mutations + femaleStats.mutations;

        // Calculate potential level (sum of all inherited stats + mutations)
        // Each stat point contributes to the total level.
        const potentialLevel = Object.values(potentialBabyStats).reduce((sum, stat) => sum + stat, 0) + (totalMutations * 2); // Each mutation adds 2 points to a stat, thus 2 levels.

        // --- Display Results ---
        resultDino.textContent = dinoName;
        resultHealth.textContent = potentialBabyStats.health;
        resultStamina.textContent = potentialBabyStats.stamina;
        resultOxygen.textContent = potentialBabyStats.oxygen;
        resultFood.textContent = potentialBabyStats.food;
        resultWeight.textContent = potentialBabyStats.weight;
        resultMelee.textContent = potentialBabyStats.melee;
        resultSpeed.textContent = potentialBabyStats.speed;
        resultTotalMutations.textContent = totalMutations;
        resultPotentialLevel.textContent = potentialLevel;

        // Show the results section
        resultsSection.classList.remove('hidden');
    }

    /**
     * Resets all form inputs and hides the results section.
     */
    function resetCalculator() {
        categorySelect.value = ''; // Reset category dropdown
        populateDinos(); // Reset dino dropdown to initial state
        
        // Reset all parent stat inputs to 0
        maleHealthInput.value = '0';
        maleStaminaInput.value = '0';
        maleOxygenInput.value = '0';
        maleFoodInput.value = '0';
        maleWeightInput.value = '0';
        maleMeleeInput.value = '0';
        maleSpeedInput.value = '0';
        maleMutationsInput.value = '0';

        femaleHealthInput.value = '0';
        femaleStaminaInput.value = '0';
        femaleOxygenInput.value = '0';
        femaleFoodInput.value = '0';
        femaleWeightInput.value = '0';
        femaleMeleeInput.value = '0';
        femaleSpeedInput.value = '0';
        femaleMutationsInput.value = '0';

        resultsSection.classList.add('hidden'); // Hide results section
        hideMessage(); // Ensure message box is hidden
    }

    // --- Event Listeners ---
    // Listen for changes on the category dropdown to update the dino dropdown
    categorySelect.addEventListener('change', populateDinos);
    // Listen for clicks on the calculate button to perform calculations
    calculateBtn.addEventListener('click', calculateBreedingStats);
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
