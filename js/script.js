const sidebarLinks = document.querySelectorAll('.sidebar-link');
const sidebarToggle = document.querySelector('#sidebar-toggle');
const starterSection = document.querySelector('#inicio');
const navbar = document.querySelector('.navbar');
const sections = document.querySelectorAll('section.container');
const percentages = document.querySelector('.percentages');

const navbarObserver = new IntersectionObserver(changeNavbarTheme, {
  root: null,
  rootMargin: '-200px',
});

const sectionsObserver = new IntersectionObserver(animateSections, {
  root: null,
  threshold: 0.01,
});

const percentagesObserver = new IntersectionObserver(animatePercentages, {
  root: null,
  threshold: 0.1,
});

navbarObserver.observe(starterSection);
sections.forEach((section) => {
  sectionsObserver.observe(section);
});
percentagesObserver.observe(percentages);

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

function animatePercentages(entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  [
    { abilitie: 'algorithms', percent: 55 },
    { abilitie: 'html', percent: 90 },
    { abilitie: 'css', percent: 85 },
    { abilitie: 'js', percent: 80 },
    { abilitie: 'react', percent: 65 },
    { abilitie: 'node', percent: 60 },
  ].forEach((values, i) => {
    entry.target.querySelectorAll('.abilitie-percentage')[
      i
    ].style.width = `${values.percent}%`;
  });

  observer.unobserve(entry.target);
}

sidebarLinks.forEach((link) => {
  link.addEventListener('click', closeSidebar);
});

function closeSidebar() {
  sidebarToggle.checked = false;
}
