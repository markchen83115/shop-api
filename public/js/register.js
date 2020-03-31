// 抓取Form裡面傳送的資料來使用
const registerForm = document.querySelector('#register');
const account = document.querySelector('#account');
const email = document.querySelector('#email');
const phone = document.querySelector('#phone');
const password = document.querySelector('#password');
const name = document.querySelector('#name');
const birthdayYear = document.querySelector('#birthdayYear');
const birthdayMonth = document.querySelector('#birthdayMonth');
const birthdayDay = document.querySelector('#birthdayDay');

// 獲取radio buttom 性別資料 - getRVBN()
const getRVBN = (rName) => {
    var radioButtons = document.getElementsByName(rName);
    for (var i = 0; i < radioButtons.length; i++) {
        if (radioButtons[i].checked) return radioButtons[i].value;
    }
    return '';
};

//messageOne.textContent = 'From JavaScript'; //更改index <p>的內容


registerForm.addEventListener('submit', async (e) => {
    // 讓瀏覽器不重新刷新
    e.preventDefault();

    // 抓取表單資料
    const formData = {
        account: account.value,
        email: email.value,
        phone: phone.value,
        password: password.value,
        name: name.value,
        gender: getRVBN('gender'),
        birthday: `${birthdayYear.value}-${birthdayMonth.value}-${birthdayDay.value}`
    };

    // 呼叫API-建立使用者
    const response = await fetch('/users', {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const responseUser = await response.json();
    localStorage.setItem('token', responseUser.token);
    console.log(localStorage.getItem('token'));
});