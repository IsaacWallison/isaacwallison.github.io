const sidebarLinks = document.querySelectorAll('.sidebar-link');
const sidebarToggle = document.querySelector('#sidebar-toggle');
const starterSection = document.querySelector('#inicio');
const navbar = document.querySelector('.navbar');
const sections = document.querySelectorAll('section.container');
const percentages = document.querySelector('.percentages');

const abilitites = [
  ['Algoritmos', 55],
  ['HTML', 85],
  ['CSS', 75],
  ['JS', 76],
  ['React', 60],
  ['Node', 60],
  ['SQL', 50],
  ['Java', 50],
  ['Python', 62],
];

onload = () => {
  abilitites.forEach((abilitie) => {
    percentages.insertAdjacentHTML(
      'beforeend',
      `<div class="abilitie">
          <span>${abilitie[0]}</span>
          <div id="${abilitie[0]}" class="abilitie-percentage" data-percentage="${abilitie[1]}"></div>
       </div>
      `
    );
  });
};

onbeforeunload = () => {
  window.scrollTo({ top: 0 });
};

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

  abilitites.forEach((abilitie) => {
    const component = document.querySelector(`#${abilitie[0]}`);
    component && (component.style.width = `${abilitie[1]}%`);
  });

  observer.unobserve(entry.target);
}

sidebarLinks.forEach((link) => {
  link.addEventListener('click', closeSidebar);
});

function closeSidebar() {
  sidebarToggle.checked = false;
}
