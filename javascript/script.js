const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

menuToggle?.addEventListener('click', () => {
  navLinks.classList.toggle('active');

  const icon = menuToggle.querySelector('i');

  if(navLinks.classList.contains('active')){
    icon.classList.remove('fa-bars');
    icon.classList.add('fa-xmark');
    document.body.style.overflow = 'hidden';
  } else {
    icon.classList.remove('fa-xmark');
    icon.classList.add('fa-bars');
    document.body.style.overflow = 'auto';
  }
});

document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('active');

    const icon = menuToggle.querySelector('i');
    icon.classList.remove('fa-xmark');
    icon.classList.add('fa-bars');

    document.body.style.overflow = 'auto';
  });
});