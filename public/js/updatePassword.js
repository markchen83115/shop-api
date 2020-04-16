// form資料
const updatePasswordForm = document.querySelector('#updatePassword');
const newPassword = document.querySelector('#newPassword');
const confirmPassword = document.querySelector('#confirmPassword');

// 更新密碼
updatePasswordForm.addEventListener('submit', async (e) => {
    // 讓瀏覽器不重新刷新
    e.preventDefault();

    // 確認密碼相符
    if (newPassword.value !== confirmPassword.value) {
        return alert('輸入的密碼不相同');
    }

    const formData = {
        password: newPassword.value
    }

    // fetch API
    const response = await fetch('/api/users/me', {
        method: 'PATCH',
        body: JSON.stringify(formData), 
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
        }
    });

    // API 回傳結果
    if (response.status === 401) {
        document.location.href="/userUnauthorized";
    } else if (response.status === 200) {
        alert('密碼更新成功');
        document.location.href="/userProfile";
    } else {
        const error = await response.json();
        alert(error);
    }
})