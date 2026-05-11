document.addEventListener('DOMContentLoaded', () => {

  // =========================
  // NAVBAR + MENU MOBILE
  // =========================

  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');
  const navbar = document.getElementById('mainNavbar');

  if (menuToggle && navLinks) {

    menuToggle.addEventListener('click', () => {

      navLinks.classList.toggle('active');

      const icon = menuToggle.querySelector('i');

      if (navLinks.classList.contains('active')) {

        icon.classList.remove('fa-bars');
        icon.classList.add('fa-xmark');

        document.body.style.overflow = 'hidden';

      } else {

        icon.classList.remove('fa-xmark');
        icon.classList.add('fa-bars');

        document.body.style.overflow = '';

      }

    });

    document.querySelectorAll('.nav-links a').forEach(link => {

      link.addEventListener('click', () => {

        navLinks.classList.remove('active');

        const icon = menuToggle.querySelector('i');

        icon.classList.remove('fa-xmark');
        icon.classList.add('fa-bars');

        document.body.style.overflow = '';

      });

    });

  }

  // =========================
  // NAVBAR SCROLL EFFECT
  // =========================

  window.addEventListener('scroll', () => {

    if (!navbar) return;

    if (window.scrollY > 80) {
      navbar.classList.add('navbar-scrolled');
    } else {
      navbar.classList.remove('navbar-scrolled');
    }

  });

  // =========================
  // SISTEMA DA GALERIA
  // =========================

  const STORAGE_KEY = 'tocaSalitre_fotos';

  let fotosArray = [];

  // Imagens padrão
  const defaultImages = [

    {
      url: 'https://placehold.co/600x450/D9B48B/5C3A24?text=Pinturas+Rupestres+1',
      legenda: 'Painel com pinturas rupestres'
    },

    {
      url: 'https://placehold.co/600x450/BF8F67/FFFFFF?text=Serra+Nova',
      legenda: 'Vista da Serra Nova'
    },

    {
      url: 'https://placehold.co/600x450/A67C54/FAF0DF?text=Comunidade',
      legenda: 'Comunidade local'
    },

    {
      url: 'https://placehold.co/600x450/917555/F5E7D3?text=Trilhas',
      legenda: 'Trilhas naturais'
    },

    {
      url: 'https://placehold.co/600x450/C6A27A/2F221B?text=Paineis',
      legenda: 'Pinturas ancestrais'
    },

    {
      url: 'https://placehold.co/600x450/B58B60/FFF1E0?text=Natureza',
      legenda: 'Natureza do sertão'
    }

  ];

  // =========================
  // CARREGAR FOTOS
  // =========================

  function loadFotos() {

    const stored = localStorage.getItem(STORAGE_KEY);

    if (stored) {

      try {

        fotosArray = JSON.parse(stored);

      } catch (error) {

        console.error('Erro ao carregar fotos:', error);

        fotosArray = [];

      }

    }

    // Se não existir nada
    if (!fotosArray.length) {

      fotosArray = defaultImages.map((img, index) => ({

        id: Date.now() + index,

        url: img.url,

        legenda: img.legenda,

        criadoEm: new Date().toISOString()

      }));

      saveFotos();

    }

    renderGaleria(fotosArray.slice(0, 6));

  }

  // =========================
  // SALVAR LOCALSTORAGE
  // =========================

  function saveFotos() {

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(fotosArray)
    );

  }

  // =========================
  // RENDERIZAR GALERIA
  // =========================

  function renderGaleria(fotos) {

    const gallery = document.getElementById('dynamicGallery');

    if (!gallery) return;

    if (!fotos.length) {

      gallery.innerHTML = `
        <p class="text-center">
          Nenhuma foto encontrada.
        </p>
      `;

      return;

    }

    gallery.innerHTML = fotos.map(foto => `

      <div class="gallery-item">

        <img
          loading="lazy"
          src="${foto.url}"
          alt="${foto.legenda}"
        >

        <div class="gallery-caption">
          ${foto.legenda}
        </div>

      </div>

    `).join('');

    // Eventos das imagens
    const galleryItems = gallery.querySelectorAll('.gallery-item');

    galleryItems.forEach((item, index) => {

      item.addEventListener('click', () => {

        abrirModalImagem(
          fotos[index].url,
          fotos[index].legenda
        );

      });

    });

  }

  // =========================
  // MODAL IMAGEM
  // =========================

  function abrirModalImagem(url, legenda = '') {

    const modal = document.createElement('div');

    modal.className = 'modal-full';

    modal.innerHTML = `

      <span class="close-modal">&times;</span>

      <div class="modal-content">

        <img src="${url}" alt="${legenda}">

        <p style="
          color:white;
          margin-top:1rem;
          font-size:1rem;
        ">
          ${legenda}
        </p>

      </div>

    `;

    document.body.appendChild(modal);

    document.body.style.overflow = 'hidden';

    // Fechar modal
    function fecharModal() {

      modal.remove();

      document.body.style.overflow = '';

    }

    modal.querySelector('.close-modal')
      .addEventListener('click', fecharModal);

    modal.addEventListener('click', (e) => {

      if (e.target === modal) {
        fecharModal();
      }

    });

  }

  // =========================
  // VER TODAS AS FOTOS
  // =========================

  function verTodasFotos() {

    const modal = document.createElement('div');

    modal.className = 'modal-full';

    let fotosHTML = `

      <span class="close-modal">&times;</span>

      <div class="modal-gallery">

    `;

    fotosArray.forEach(foto => {

      fotosHTML += `

        <div class="modal-item">

          <img
            loading="lazy"
            src="${foto.url}"
            alt="${foto.legenda}"
          >

          <p>
            ${foto.legenda}
          </p>

        </div>

      `;

    });

    fotosHTML += `</div>`;

    modal.innerHTML = fotosHTML;

    document.body.appendChild(modal);

    document.body.style.overflow = 'hidden';

    // Fechar modal
    function fecharModal() {

      modal.remove();

      document.body.style.overflow = '';

    }

    modal.querySelector('.close-modal')
      .addEventListener('click', fecharModal);

    modal.addEventListener('click', (e) => {

      if (e.target === modal) {
        fecharModal();
      }

    });

    // Clique nas imagens
    modal.querySelectorAll('.modal-item img')
      .forEach(img => {

        img.addEventListener('click', (e) => {

          e.stopPropagation();

          abrirModalImagem(
            img.src,
            img.alt
          );

        });

      });

  }

  // =========================
  // UPLOAD FOTO
  // =========================

  async function adicionarFoto(file, legenda) {

    return new Promise((resolve, reject) => {

      if (!file) {

        reject('Selecione uma imagem.');

        return;

      }

      if (!file.type.startsWith('image/')) {

        reject('Arquivo inválido.');

        return;

      }

      if (file.size > 2 * 1024 * 1024) {

        reject('Máximo permitido: 2MB.');

        return;

      }

      const reader = new FileReader();

      reader.onload = (e) => {

        const novaFoto = {

          id: Date.now(),

          url: e.target.result,

          legenda:
            legenda.trim() ||
            'Compartilhado por visitante',

          criadoEm: new Date().toISOString()

        };

        fotosArray.unshift(novaFoto);

        saveFotos();

        renderGaleria(fotosArray.slice(0, 6));

        resolve();

      };

      reader.onerror = () => {

        reject('Erro ao ler imagem.');

      };

      reader.readAsDataURL(file);

    });

  }

  // =========================
  // EVENTOS UPLOAD
  // =========================

  const submitBtn =
    document.getElementById('submitPhotoBtn');

  const fileInput =
    document.getElementById('photoUpload');

  const captionInput =
    document.getElementById('photoCaption');

  const statusSpan =
    document.getElementById('uploadStatus');

  if (
    submitBtn &&
    fileInput &&
    captionInput &&
    statusSpan
  ) {

    submitBtn.addEventListener('click', async () => {

      const file = fileInput.files?.[0];

      const legenda = captionInput.value;

      if (!file) {

        statusSpan.innerText =
          'Selecione uma imagem primeiro.';

        return;

      }

      statusSpan.innerText = 'Enviando imagem...';

      try {

        await adicionarFoto(file, legenda);

        statusSpan.innerText =
          '✅ Foto adicionada com sucesso!';

        fileInput.value = '';

        captionInput.value = '';

        setTimeout(() => {

          statusSpan.innerText = '';

        }, 3000);

      } catch (error) {

        statusSpan.innerText =
          '❌ ' + error;

      }

    });

  }

  // =========================
  // BOTÃO VER TODAS
  // =========================

  const viewAllBtn =
    document.getElementById('viewAllBtn');

  if (viewAllBtn) {

    viewAllBtn.addEventListener(
      'click',
      verTodasFotos
    );

  }

  // =========================
  // INICIAR GALERIA
  // =========================

  loadFotos();

});