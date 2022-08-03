const shrinkBtn = document.querySelector('#shrink-btn');
const searchBtn = document.querySelector('.search');
const sidebarLinks = document.querySelectorAll('.sidebar-links a');
const activeBox = document.querySelector('.active-tab');
const logOutBtn = document.querySelector('.log-out');

function changeBg() {
    sidebarLinks.forEach(link => link.classList.remove('active'));
    this.classList.add('active');
    activeBox.style.top = `${this.dataset.active * 58 + 2.5}px`
    setPages(this.dataset.active);
}

shrinkBtn.addEventListener('click', () => { document.body.classList.toggle('shrink') }); 

searchBtn.addEventListener('click', () => { 
    document.body.classList.remove('shrink');
    searchBtn.lastElementChild.focus();
}); 

sidebarLinks.forEach(link => link.addEventListener('click', changeBg));

logOutBtn.addEventListener('click', () => {
    fetch('/logout-user', { method: 'post' }).then(location.assign('/login'));
});

// ---------{ Pages }--------- \\
const pages = document.querySelectorAll("main");

function setPages(tabN) {
    pages.forEach(page => page.classList.remove('show'));
    pages[tabN].classList.add('show');
}

// ---------{ Password Pages }--------- \\
const newpwdbtn = document.querySelector('.newpswd-btn');

newpwdbtn.addEventListener('click', () => {
    console.log('add pwd');
});
