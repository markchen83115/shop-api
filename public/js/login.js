// 抓取Form裡面傳送的資料來使用
const loginForm = document.querySelector('#login');
const account = document.querySelector('#account');
const password = document.querySelector('#password');

loginForm.addEventListener('submit', async (e) => {
    // 讓瀏覽器不重新刷新
    e.preventDefault();

    // 抓取表單資料
    const loginData = {
        account: account.value,
        password: password.value
    };

    // 呼叫API-建立使用者
    const response = await fetch('/users/login', {
        method: 'POST',
        body: JSON.stringify(loginData),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const responseUser = await response.json();
    localStorage.setItem('token', responseUser.token);
    console.log(localStorage.getItem('token'));
});