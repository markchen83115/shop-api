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
    const response = await fetch('/api/users/login', {
        method: 'POST',
        body: JSON.stringify(loginData),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    
    if (response.status === 200) {
        const responseJson = await response.json();
        localStorage.removeItem('jwtToken');
        localStorage.setItem('jwtToken', responseJson.token);
        console.log(localStorage.getItem('jwtToken'));
        alert('登入成功');
        document.location.href="/userProfile"
    } else {
        alert('登入失敗, 請重新嘗試')
    }

    
});