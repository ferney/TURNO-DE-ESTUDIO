// Función para cargar contenido desde archivos HTML
async function loadContent(section) {
    const contentArea = document.getElementById('section-content');
    const mainContent = document.querySelector('.content-area');
    
    try {
        const response = await fetch(`content/${section}.html`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        contentArea.innerHTML = await response.text();
        
        // Agregar o remover la clase welcome-page según la sección
        if (section === 'welcome') {
            mainContent.classList.add('welcome-page');
        } else {
            mainContent.classList.remove('welcome-page');
        }
    } catch (error) {
        console.error('Error loading content:', error);
        contentArea.innerHTML = `<p>Error al cargar el contenido: ${error.message}</p>`;
    }
}

// Función para manejar la navegación
function setupNavigation() {
    document.querySelectorAll('.course-section').forEach(section => {
        section.addEventListener('click', () => {
            const sectionId = section.getAttribute('data-section');
            loadContent(sectionId);
            document.querySelectorAll('.course-section').forEach(s => 
                s.classList.remove('active-section')
            );
            section.classList.add('active-section');
        });
    });
}

// Función para el botón "volver arriba"
function setupBackToTop() {
    const backToTop = document.getElementById('backToTop');
    window.addEventListener('scroll', () => {
        backToTop.classList.toggle('visible', window.scrollY > 300);
    });
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// Función para actualizar el progreso
function updateProgress() {
    const progressFill = document.getElementById('progressFill');
    const courseScore = document.getElementById('courseScore');
    // Aquí puedes implementar la lógica real de progreso
    progressFill.style.width = '75%';
    courseScore.textContent = '75';
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    setupNavigation();
    setupBackToTop();
    loadContent('welcome'); // Cargar página de bienvenida por defecto
});
