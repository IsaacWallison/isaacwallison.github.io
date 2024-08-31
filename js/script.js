const sidebarLinks = document.querySelectorAll('.sidebar-link');
const sidebarToggle = document.querySelector('#sidebar-toggle');
const starterSection = document.querySelector('#inicio');
const navbar = document.querySelector('.navbar');
const sections = document.querySelectorAll('section.container');

const navbarObserver = new IntersectionObserver(changeNavbarTheme, {
  root: null,
  rootMargin: '-200px',
});

const sectionsObserver = new IntersectionObserver(animateSections, {
  root: null,
  threshold: 0.01,
});

navbarObserver.observe(starterSection);
sections.forEach((section) => {
  sectionsObserver.observe(section);
});

function changeNavbarTheme(entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) {
    navbar.classList.add('visible');
    return;
  }

  navbar.classList.remove('visible');
}

function animateSections(entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  entry.target.classList.add('animate');

  observer.unobserve(entry.target);
}

sidebarLinks.forEach((link) => {
  link.addEventListener('click', closeSidebar);
});

function closeSidebar() {
  sidebarToggle.checked = false;
}
