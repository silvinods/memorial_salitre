  // ---------- SISTEMA DE GALERIA + UPLOAD (SIMULA BANCO DE DADOS) ----------
  const STORAGE_KEY = 'tocaSalitre_fotos';
  let fotosArray = [];

  // Imagens padrão (placeholders que podem ser substituídos)
  const defaultImages = [
    { url: 'https://placehold.co/600x450/D9B48B/5C3A24?text=Pinturas+Rupestres+1&font=playfair', legenda: 'Painel com pinturas rupestres' },
    { url: 'https://placehold.co/600x450/BF8F67/FFFFFF?text=Serra+Nova&font=playfair', legenda: 'Vista da serra ao entardecer' },
    { url: 'https://placehold.co/600x450/A67C54/FAF0DF?text=Comunidade&font=playfair', legenda: 'Moradores e acolhimento' },
    { url: 'https://placehold.co/600x450/917555/F5E7D3?text=Trilhas&font=playfair', legenda: 'Trilha na caatinga' },
    { url: 'https://placehold.co/600x450/C6A27A/2F221B?text=Paineis+Rupestres&font=playfair', legenda: 'Detalhe das pinturas' },
    { url: 'https://placehold.co/600x450/B58B60/FFF1E0?text=Cerrado+Piauiense&font=playfair', legenda: 'Natureza exuberante' }
  ];

  // Carregar dados do localStorage
  function loadFotos() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if(stored) {
      fotosArray = JSON.parse(stored);
    } else {
      // Inicializa com as imagens padrão
      fotosArray = defaultImages.map((img, idx) => ({
        id: Date.now() + idx,
        url: img.url,
        legenda: img.legenda,
        criadoEm: new Date().toISOString()
      }));
      saveToLocal();
    }
    renderGaleria(fotosArray.slice(0, 6)); // mostra só 6 inicialmente
  }

  function saveToLocal() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fotosArray));
  }

  // Renderiza a galeria principal (limitada)
  function renderGaleria(fotosParaMostrar) {
    const galleryDiv = document.getElementById('dynamicGallery');
    if(!galleryDiv) return;
    if(fotosParaMostrar.length === 0) {
      galleryDiv.innerHTML = '<p class="text-center">Nenhuma foto ainda. Seja o primeiro a adicionar!</p>';
      return;
    }
    let html = '';
    fotosParaMostrar.forEach(foto => {
      html += `
        <div class="gallery-item" data-url="${foto.url}" data-legenda="${foto.legenda || ''}">
          <img src="${foto.url}" alt="${foto.legenda || 'Foto da Toca'}">
          <div class="gallery-caption">${foto.legenda || 'Registro especial'}</div>
        </div>
      `;
    });
    galleryDiv.innerHTML = html;
    // Adicionar evento de clique para abrir modal de cada foto (ampliar)
    document.querySelectorAll('#dynamicGallery .gallery-item').forEach(item => {
      item.addEventListener('click', () => {
        const imgUrl = item.getAttribute('data-url');
        const leg = item.getAttribute('data-legenda');
        abrirModalImagem(imgUrl, leg);
      });
    });
  }

  function abrirModalImagem(url, legenda) {
    const modal = document.createElement('div');
    modal.className = 'modal-full';
    modal.innerHTML = `
      <span class="close-modal">&times;</span>
      <div style="max-width:90%; text-align:center;">
        <img src="${url}" style="max-width:95%; max-height:80vh; border-radius:20px; box-shadow:0 20px 30px black;">
        <p style="color:white; margin-top:1rem;">${legenda || 'Memória da Toca do Salitre'}</p>
      </div>
    `;
    document.body.appendChild(modal);
    modal.querySelector('.close-modal').onclick = () => modal.remove();
    modal.onclick = (e) => { if(e.target === modal) modal.remove(); };
  }

  // Exibir todas as fotos em modal
  function verTodasFotos() {
    const modal = document.createElement('div');
    modal.className = 'modal-full';
    let fotosHtml = '<div class="modal-gallery">';
    fotosArray.forEach(foto => {
      fotosHtml += `
        <div style="cursor:pointer;" onclick="window.open('${foto.url}','_blank')">
          <img src="${foto.url}" alt="${foto.legenda}">
          <p style="color:#ddd; font-size:0.8rem; text-align:center;">${foto.legenda || ''}</p>
        </div>
      `;
    });
    fotosHtml += '</div><p style="color:white; margin-top:1rem;">Clique na imagem para abrir em tela cheia</p>';
    modal.innerHTML = `<span class="close-modal">&times;</span>${fotosHtml}`;
    document.body.appendChild(modal);
    modal.querySelector('.close-modal').onclick = () => modal.remove();
    modal.onclick = (e) => { if(e.target === modal) modal.remove(); };
    // Adicionar evento para cada imagem do modal abrir em nova guia (ou ampliar)
    const modalImgs = modal.querySelectorAll('.modal-gallery img');
    modalImgs.forEach(img => {
      img.addEventListener('click', (e) => {
        e.stopPropagation();
        const src = img.src;
        abrirModalImagem(src, img.alt);
      });
    });
  }

  // Adicionar nova foto via upload (simula banco de dados)
  function adicionarFoto(file, legenda) {
    return new Promise((resolve, reject) => {
      if(!file || !file.type.startsWith('image/')) {
        reject('Arquivo inválido. Envie uma imagem.');
        return;
      }
      if(file.size > 2 * 1024 * 1024) {
        reject('Imagem muito grande. Máximo 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = function(e) {
        const novaFoto = {
          id: Date.now(),
          url: e.target.result,
          legenda: legenda.trim() || 'Compartilhado por visitante',
          criadoEm: new Date().toISOString()
        };
        fotosArray.unshift(novaFoto); // adiciona no início
        saveToLocal();
        // Re-renderiza a galeria principal (primeiras 6)
        renderGaleria(fotosArray.slice(0, 6));
        resolve('Foto adicionada com sucesso!');
      };
      reader.onerror = () => reject('Erro ao ler a imagem.');
      reader.readAsDataURL(file);
    });
  }

  // Eventos
  document.addEventListener('DOMContentLoaded', () => {
    loadFotos();
    document.getElementById('viewAllBtn')?.addEventListener('click', verTodasFotos);
    const submitBtn = document.getElementById('submitPhotoBtn');
    const fileInput = document.getElementById('photoUpload');
    const captionInput = document.getElementById('photoCaption');
    const statusSpan = document.getElementById('uploadStatus');

    submitBtn?.addEventListener('click', async () => {
      const file = fileInput.files[0];
      const legenda = captionInput.value;
      if(!file) {
        statusSpan.innerText = 'Selecione uma imagem primeiro.';
        return;
      }
      statusSpan.innerText = 'Enviando...';
      try {
        await adicionarFoto(file, legenda);
        statusSpan.innerText = '✅ Foto adicionada! Recarregue a galeria.';
        fileInput.value = '';
        captionInput.value = '';
        setTimeout(() => statusSpan.innerText = '', 3000);
      } catch(err) {
        statusSpan.innerText = 'Erro: ' + err;
      }
    });
  });

  // ---------- MENU HAMBÚRGUER ----------
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');
  menuToggle?.addEventListener('click', () => {
    navLinks.classList.toggle('active');
  });
  // Fechar menu ao clicar em um link
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
    });
  });

  // Navbar scroll effect
  window.addEventListener('scroll', () => {
    const navbar = document.getElementById('mainNavbar');
    if(window.scrollY > 50) navbar.classList.add('navbar-scrolled');
    else navbar.classList.remove('navbar-scrolled');
  });