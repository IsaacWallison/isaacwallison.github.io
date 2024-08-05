const sidebarLinks = document.querySelectorAll('.sidebar-link');
const sidebarToggle = document.querySelector('#sidebar-toggle');
const starterSection = document.querySelector('#inicio');
const navbar = document.querySelector('.navbar');

const options = {
  rootMargin: '-200px',
};

const observer = new IntersectionObserver(changeNavbarTheme, options);

observer.observe(starterSection);

function changeNavbarTheme(entries, observer) {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) {
      navbar.classList.add('visible');
    } else {
      navbar.classList.remove('visible');
    }
  });
}

sidebarLinks.forEach((link) => {
  link.addEventListener('click', closeSidebar);
});

function closeSidebar() {
  sidebarToggle.checked = false;
}
