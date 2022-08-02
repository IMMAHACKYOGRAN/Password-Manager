const shrinkBtn = document.querySelector('#shrink-btn');
const searchBtn = document.querySelector('.search');
const sidebarLinks = document.querySelectorAll('.sidebar-links a');
const activeBox = document.querySelector('.active-tab');

function changeBg() {
    sidebarLinks.forEach(link => link.classList.remove('active'));
    this.classList.add('active');
    activeBox.style.top = `${this.dataset.active * 58 + 2.5}px`
}

shrinkBtn.addEventListener('click', () => { document.body.classList.toggle('shrink') }); 

searchBtn.addEventListener('click', () => { 
    document.body.classList.remove('shrink');
    searchBtn.lastElementChild.focus();
}); 

sidebarLinks.forEach(link => link.addEventListener('click', changeBg));