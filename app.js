// Elementos del DOM
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const galleryContainer = document.getElementById('gallery-container');
const spinner = document.getElementById('spinner');
const modal = document.getElementById('image-modal');
const modalImage = document.getElementById('modal-image');
const closeModal = document.getElementById('close-modal');

// Variable para almacenar los datos de imágenes
let imageData = {};

// Cargar datos desde el archivo JSON
fetch('data.json')
  .then(response => {
    if (!response.ok) {
      throw new Error('No se pudo cargar el archivo de datos');
    }
    return response.json();
  })
  .then(data => {
    imageData = data;
    console.log('Datos cargados correctamente:', imageData);
  })
  .catch(error => {
    console.error('Error al cargar los datos:', error);
    galleryContainer.innerHTML = '<div class="message">Error al cargar los datos. Por favor, intenta más tarde.</div>';
  });

// Event listeners
searchForm.addEventListener('submit', handleSearch);
closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

// Función de búsqueda
function handleSearch(e) {
    e.preventDefault();
    
    const bibNumber = searchInput.value.trim();
    
    // Validar que sea un número de 4 dígitos
    if (!/^\d{4}$/.test(bibNumber)) {
        alert('Por favor, ingresa un número BIB válido de 4 dígitos');
        return;
    }
    
    // Mostrar spinner
    galleryContainer.innerHTML = '';
    spinner.style.display = 'block';
    
    // Simular tiempo de carga (en una aplicación real, esto sería el tiempo de búsqueda real)
    setTimeout(() => {
        // Ocultar spinner
        spinner.style.display = 'none';
        
        // Verificar si los datos se han cargado
        if (Object.keys(imageData).length === 0) {
            galleryContainer.innerHTML = '<div class="message">Espera un momento mientras cargamos los datos...</div>';
            return;
        }
        
        // Buscar imágenes
        const images = imageData[bibNumber] || [];
        
        if (images.length === 0) {
            galleryContainer.innerHTML = '<div class="message">No se encontraron imágenes para el BIB ' + bibNumber + '</div>';
            return;
        }
        
        // Crear galería
        createGallery(bibNumber, images);
    }, 800);
}

// Crear galería de imágenes
function createGallery(bibNumber, images) {
    const galleryHTML = `
        <div class="gallery-header">
            <div class="gallery-info">
                <strong>BIB ${bibNumber}</strong> - ${images.length} imagen(es) encontrada(s)
            </div>
            ${images.length > 1 ? 
                `<button class="download-all-btn" onclick="downloadAllImages('${bibNumber}')">
                    <i class="fas fa-download"></i> Descargar todas
                </button>` : ''}
        </div>
        <div class="gallery-grid">
            ${images.map((image, index) => `
                <div class="gallery-item" onclick="openModal('photos/${image}', '${image}')">
                    <img src="photos/${image}" alt="${image}" class="gallery-image">
                    <div class="gallery-overlay">
                        <div class="image-name">${image}</div>
                        <button class="download-btn" onclick="downloadImage('${image}', event)">
                            <i class="fas fa-download"></i>
                        </button>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
    
    galleryContainer.innerHTML = galleryHTML;
}

// Descargar una imagen individual
function downloadImage(imageName, event) {
    event.stopPropagation(); // Evitar que se abra el modal
    
    // En una implementación real, esta función debería iniciar la descarga de la imagen
    console.log('Descargando imagen:', imageName);
    simulateDownload(imageName);
}

// Descargar todas las imágenes
function downloadAllImages(bibNumber) {
    const images = imageData[bibNumber] || [];
    
    if (images.length === 0) return;
    
    // En una implementación real, esta función debería iniciar la descarga de todas las imágenes
    console.log('Descargando todas las imágenes del BIB:', bibNumber);
    alert(`Iniciando descarga de ${images.length} imagen(es) del BIB ${bibNumber}`);
}

// Simular la descarga
function simulateDownload(imageName) {
    alert(`Descargando: ${imageName}`);
    // En una implementación real, aquí se crearía un enlace temporal para la descarga
}

// Abrir el modal con la imagen ampliada
function openModal(src, alt) {
    modalImage.src = src;
    modalImage.alt = alt;
    modal.style.display = 'flex';
}