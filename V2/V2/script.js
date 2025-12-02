/**
 * State and Constants
 */
const PROJECT_CATEGORIES = [
  "General", "Design", "Writing", "Marketing", "Productivity", "Development", "Data Analysis"
];
let currentCategory = "General";
let analysisData = null;

/**
 * DOM Elements
 */
const elements = {
  html: document.documentElement,
  themeToggle: document.getElementById('theme-toggle'),
  iconMoon: document.getElementById('icon-moon'),
  iconSun: document.getElementById('icon-sun'),
  logoBtn: document.getElementById('logo-btn'),
  
  // Input Section
  heroSection: document.getElementById('hero-section'),
  heroTitle: document.getElementById('hero-title'),
  heroSubtitle: document.getElementById('hero-subtitle'),
  projectForm: document.getElementById('project-form'),
  projectInput: document.getElementById('project-input'),
  submitBtn: document.getElementById('submit-btn'),
  btnText: document.getElementById('btn-text'),
  btnIcon: document.getElementById('btn-icon'),
  categoryList: document.getElementById('category-list'),
  categoryContainer: document.getElementById('category-container'),
  suggestionsContainer: document.getElementById('suggestions-container'),
  suggestionBtns: document.querySelectorAll('.suggestion-btn'),

  // Content Area
  contentArea: document.getElementById('content-area'),
  loadingScreen: document.getElementById('loading-screen'),
  resultsView: document.getElementById('results-view'),
  toolGroupsContainer: document.getElementById('tool-groups-container'),

  // Modal
  modalBackdrop: document.getElementById('modal-backdrop'),
  modalOverlay: document.getElementById('modal-overlay'),
  modalTitle: document.getElementById('modal-title'),
  modalBody: document.getElementById('modal-body'),
  modalCloseBtn: document.getElementById('modal-close-btn'),
  modalMobileClose: document.getElementById('modal-mobile-close'),
};

/**
 * Initialization
 */
function init() {
  // Theme Setup
  const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (isDark) elements.html.classList.add('dark');
  updateThemeIcons();

  // Render Categories
  renderCategories();

  // Event Listeners
  elements.themeToggle.addEventListener('click', toggleTheme);
  elements.logoBtn.addEventListener('click', resetApp);
  
  elements.projectInput.addEventListener('input', handleInput);
  elements.projectInput.addEventListener('keydown', handleKeydown);
  
  elements.projectForm.addEventListener('submit', handleSubmit);
  
  elements.suggestionBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const text = e.target.textContent.replace(/"/g, ''); // remove quotes
      const cat = e.target.getAttribute('data-cat');
      fillSearch(text, cat);
    });
  });

  // Modal Listeners
  elements.modalOverlay.addEventListener('click', closeModal);
  elements.modalCloseBtn.addEventListener('click', closeModal);
  elements.modalMobileClose.addEventListener('click', closeModal);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !elements.modalBackdrop.classList.contains('hidden')) {
      closeModal();
    }
  });
}

/**
 * Theme Logic
 */
function toggleTheme() {
  elements.html.classList.toggle('dark');
  updateThemeIcons();
}

function updateThemeIcons() {
  const isDark = elements.html.classList.contains('dark');
  if (isDark) {
    elements.iconMoon.classList.add('hidden');
    elements.iconSun.classList.remove('hidden');
  } else {
    elements.iconMoon.classList.remove('hidden');
    elements.iconSun.classList.add('hidden');
  }
}

/**
 * Input Logic
 */
function handleInput(e) {
  const input = e.target;
  // Auto-resize
  input.style.height = 'auto';
  input.style.height = Math.min(input.scrollHeight, 200) + 'px';
  
  // Enable/Disable Button
  const isValid = input.value.trim().length > 0;
  elements.submitBtn.disabled = !isValid;
}

function handleKeydown(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    handleSubmit(e);
  }
}

function renderCategories() {
  elements.categoryList.innerHTML = PROJECT_CATEGORIES.map(cat => `
    <button
      type="button"
      data-value="${cat}"
      class="cat-chip px-4 py-1.5 text-sm rounded-full border transition-all ${
        currentCategory === cat 
        ? 'bg-primary-50 dark:bg-primary-900/30 border-primary-500 text-primary-700 dark:text-primary-300 font-medium' 
        : 'bg-white/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-500'
      }"
    >${cat}</button>
  `).join('');

  // Add listeners to new buttons
  document.querySelectorAll('.cat-chip').forEach(btn => {
    btn.addEventListener('click', () => {
      currentCategory = btn.getAttribute('data-value');
      renderCategories(); // Re-render to update active state styles
    });
  });
}

function fillSearch(text, cat) {
  elements.projectInput.value = text;
  // Trigger input event to resize and enable button
  elements.projectInput.dispatchEvent(new Event('input'));
  
  if (cat && PROJECT_CATEGORIES.includes(cat)) {
    currentCategory = cat;
    renderCategories();
  }
}

/**
 * Core Workflow
 */
async function handleSubmit(e) {
  e.preventDefault();
  const description = elements.projectInput.value.trim();
  if (!description) return;

  setLoadingState(true);

  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ description, category: currentCategory })
    });

    if (!response.ok) throw new Error("API Request Failed");

    const data = await response.json();
    analysisData = data;
    renderResults(data);
    setResultsState();

  } catch (error) {
    console.error(error);
    alert("Something went wrong. Please try again.");
    resetApp();
  }
}

/**
 * UI State Transitions
 */
function setLoadingState(isLoading) {
  if (isLoading) {
    // Modify Hero
    elements.heroSection.classList.remove('py-16', 'md:py-24');
    elements.heroSection.classList.add('pt-6', 'pb-10');
    elements.heroTitle.classList.remove('text-4xl', 'md:text-6xl');
    elements.heroTitle.classList.add('text-3xl', 'md:text-4xl');
    
    // Hide Extras
    elements.heroSubtitle.classList.add('hidden');
    elements.categoryContainer.classList.add('opacity-50', 'pointer-events-none');
    elements.suggestionsContainer.classList.add('hidden');

    // Button State
    elements.submitBtn.disabled = true;
    elements.btnText.textContent = "...";
    elements.btnIcon.classList.add('hidden');

    // Show Loading
    elements.resultsView.classList.add('hidden');
    elements.loadingScreen.classList.remove('hidden');
    elements.loadingScreen.classList.add('flex');
  }
}

function setResultsState() {
  elements.loadingScreen.classList.add('hidden');
  elements.loadingScreen.classList.remove('flex');
  
  elements.resultsView.classList.remove('hidden');
  
  // Reset Button
  elements.submitBtn.disabled = false;
  elements.btnText.textContent = "Start";
  elements.btnIcon.classList.remove('hidden');
}

function resetApp() {
  elements.projectInput.value = '';
  // Trigger input event to resize and disable button
  elements.projectInput.dispatchEvent(new Event('input'));

  // Reset Hero
  elements.heroSection.classList.add('py-16', 'md:py-24');
  elements.heroSection.classList.remove('pt-6', 'pb-10');
  elements.heroTitle.classList.add('text-4xl', 'md:text-6xl');
  elements.heroTitle.classList.remove('text-3xl', 'md:text-4xl');

  // Show Extras
  elements.heroSubtitle.classList.remove('hidden');
  elements.categoryContainer.classList.remove('opacity-50', 'pointer-events-none');
  elements.suggestionsContainer.classList.remove('hidden');

  // Hide Content
  elements.loadingScreen.classList.add('hidden');
  elements.loadingScreen.classList.remove('flex');
  elements.resultsView.classList.add('hidden');

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Rendering Results
 */
function renderResults(data) {
  if (!data || !data.toolGroups) return;

  elements.toolGroupsContainer.innerHTML = data.toolGroups.map((group, idx) => `
    <div class="animate-fade-in-up" style="animation-delay: ${idx * 100}ms">
        <div class="mb-6 border-b border-slate-200 dark:border-slate-800 pb-2">
            <h3 class="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                <span class="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-sm font-bold border border-slate-200 dark:border-slate-700">
                    ${idx + 1}
                </span>
                ${group.groupName}
            </h3>
            <p class="text-slate-500 dark:text-slate-400 mt-1 ml-11 text-sm md:text-base">
                ${group.purpose}
            </p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            ${group.tools.map((tool) => {
               // Store tool data in data attribute stringified for easy retrieval
               const toolDataStr = encodeURIComponent(JSON.stringify(tool));
               return `
               <div class="group relative flex flex-col p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-primary-500 dark:hover:border-primary-500 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full">
                  <div class="flex justify-between items-start mb-3 w-full">
                    <h4 class="font-bold text-lg text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      ${tool.name}
                    </h4>
                    <a href="${tool.url}" target="_blank" rel="noopener noreferrer" class="text-slate-300 hover:text-primary-500 transition-colors" title="Visit Website">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                    </a>
                  </div>
                  <p class="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed line-clamp-3 flex-grow">
                    ${tool.role}
                  </p>
                  <button
                    onclick="openToolModal('${toolDataStr}')"
                    class="mt-auto w-full py-2.5 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-semibold hover:bg-primary-500 hover:text-white dark:hover:bg-primary-500 dark:hover:text-white transition-all flex items-center justify-center gap-2 group-hover:bg-primary-50 dark:group-hover:bg-primary-900/30 dark:group-hover:text-primary-300"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
                    View Instructions
                  </button>
               </div>
               `
            }).join('')}
        </div>
    </div>
  `).join('');
}

/**
 * Modal Logic
 * Attached to window to be accessible from inline onclick handlers
 */
window.openToolModal = function(toolDataEncoded) {
    const tool = JSON.parse(decodeURIComponent(toolDataEncoded));
    
    // Set Title
    elements.modalTitle.textContent = tool.name;

    // Set Body
    elements.modalBody.innerHTML = `
        <!-- Header Context -->
        <div class="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div class="text-slate-600 dark:text-slate-300 text-sm font-medium italic">
                ${tool.role}
            </div>
            <a href="${tool.url}" target="_blank" rel="noopener noreferrer" class="flex items-center gap-2 text-sm font-bold text-primary-600 dark:text-primary-400 hover:underline">
                Visit Website 
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            </a>
        </div>

        <!-- Setup Steps -->
        <div class="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-5 border border-slate-100 dark:border-slate-800">
            <h4 class="flex items-center gap-2 font-bold text-slate-900 dark:text-white mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5 text-amber-500"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                Setup Steps
            </h4>
            <ul class="space-y-3">
                ${tool.instructions.setupSteps.map((step, idx) => `
                    <li class="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-300">
                        <span class="flex-shrink-0 w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 text-xs flex items-center justify-center font-bold text-slate-600 dark:text-slate-400 mt-0.5">${idx + 1}</span>
                        <span>${step}</span>
                    </li>
                `).join('')}
            </ul>
        </div>

        <!-- Usage Steps -->
        <div class="bg-primary-50/50 dark:bg-primary-900/10 rounded-xl p-5 border border-primary-100 dark:border-primary-900/30">
            <h4 class="flex items-center gap-2 font-bold text-slate-900 dark:text-white mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5 text-primary-500"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                How to use for this project
            </h4>
            <ul class="space-y-3">
                ${tool.instructions.usageSteps.map((step) => `
                    <li class="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-300">
                        <span class="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary-500 mt-2"></span>
                        <span>${step}</span>
                    </li>
                `).join('')}
            </ul>
        </div>
    `;

    // Show Modal
    elements.modalBackdrop.classList.remove('hidden');
    elements.modalBackdrop.classList.add('flex');
    document.body.classList.add('modal-open');
}

function closeModal() {
    elements.modalBackdrop.classList.add('hidden');
    elements.modalBackdrop.classList.remove('flex');
    document.body.classList.remove('modal-open');
}

// Start
init();