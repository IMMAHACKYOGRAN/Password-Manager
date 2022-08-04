let userId;
fetch('/get-id', {method:'get'}).then(res => res.json()).then(data => {
    userId = data;
    updatePsws(data);
}).catch(() => {
    console.log('error');
});

const shrinkBtn = document.querySelector('#shrink-btn');
const searchBtn = document.querySelector('.search');
const sidebarLinks = document.querySelectorAll('.sidebar-links a');
const activeBox = document.querySelector('.active-tab');
const logOutBtn = document.querySelector('.log-out');
const passwordTable = document.querySelector('#password-table');

function changeBg() {
    sidebarLinks.forEach(link => link.classList.remove('active'));
    this.classList.add('active');
    activeBox.style.top = `${this.dataset.active * 58 + 2.5}px`
    setPages(this.dataset.active);
}

shrinkBtn.addEventListener('click',()=>{document.body.classList.toggle('shrink')}); 

searchBtn.addEventListener('click', () => { 
    document.body.classList.remove('shrink');
    searchBtn.lastElementChild.focus();
}); 

sidebarLinks.forEach(link => link.addEventListener('click', changeBg));

logOutBtn.addEventListener('click', () => {
    fetch('/logout-user', {method:'post'}).then(location.assign('/login'));
});

// ---------{ Pages }--------- \\
const pages = document.querySelectorAll("main");

function setPages(tabN) {
    pages.forEach(page => page.classList.remove('show'));
    pages[tabN].classList.add('show');
}

// ---------{ Password Pages }--------- \\
document.querySelector('.overlay').addEventListener('click', () => {
    document.querySelector('.popup').classList.add('noshow-popup');
});

document.querySelector('.newpswd-btn').addEventListener('click', () => {
    document.querySelector('.popup').classList.toggle('noshow-popup')
});

document.querySelector('.save-entry').addEventListener('click', () => {
    fetch('/add-password', {
        method: 'post',
        headers: new Headers({
            'Content-Type': 'application/json'
        }),
        body: JSON.stringify({
            id: userId,
            url: document.querySelector('.url-input').value,
            username: document.querySelector('.user-input').value,
            password: document.querySelector('.pass-input').value
        })
    }).then(res => res.json()).then(data => {      
        if(typeof data === 'string') {
            let error = document.querySelector('.error-div');
            error.innerHTML = data;
            error.style.display = 'block';
        } else {
            updatePsws(data);
            document.querySelector('.popup').classList.add('noshow-popup');
        }
    })
});

function updatePsws(d) {
    if(d === userId) {
        fetch('/get-pwds', {method:'get'}).then(res => res.json()).then(data => {
            for(i = 0; i < data.length; i++) {
                setRow(passwordTable.insertRow(), data[i]);
            }
        });
    } else {
        fetch('/get-pwds', {method:'get'}).then(res => res.json()).then(data => {
            setRow(passwordTable.insertRow(), data[data.length - 1]);
        });
    }
}

function setRow(row, data) {
    row.insertCell(0).innerHTML = data.website;
    row.insertCell(1).innerHTML = data.username;
    row.insertCell(2).innerHTML = data.password;
    row.insertCell(3).innerHTML = data.date;
}
