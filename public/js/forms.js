const submitBtn = document.querySelector('.submit-btn');
const password = document.querySelector('.password');
const username = document.querySelector('.username');
const loginpagedetector = document.querySelector('.forgotpass') || null; // Can check if the forgot password div exists to determine what page we are on

if (loginpagedetector) { // Login page
    submitBtn.addEventListener('click', () => {
        fetch('/login-user', {
            method: 'post',
            headers: new Headers({
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify({
                username: username.value,
                password: password.value
            })
        }).then(res => res.json()).then(data => { validateData(data); })
    })
} else { // Signup page
    submitBtn.addEventListener('click', () => {
        fetch('/signup-user', {
            method: 'post',
            headers: new Headers({
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify({
                username: username.value,
                password: password.value
            })
        }).then(res => res.json()).then(data => { validateData(data); })
    })
}

function validateData(data) {
    if(!data.name) {
        throwError(data);
    } else {
        // Should be cookies
        sessionStorage.name = data.name;
        location.href = '/';
    }
}

function throwError(data) {
    const error = document.getElementById('error');
    error.innerHTML = data;
    error.style.display = 'block';
}
