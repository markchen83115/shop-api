const showUserAccount = async () => {
    // Templates
    const userTemplate = document.querySelector('#userAccount-template').innerHTML;

    // Elements
    const userElements = document.querySelector('#userList');

    // 若有token才從server取得使用者資料
    if (localStorage.getItem('jwtToken')) {
        // 取得使用者資料
        const response = await fetch('/api/users/me', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
            }
        });

        // 透過Mustache傳遞資料
        if (response.status === 200) {
            const user = await response.json();
            const html = Mustache.render(userTemplate, user);
            userElements.insertAdjacentHTML("beforeend", html); //before:訊息會往下疊 after:訊息往上疊
        } else {
            const html = Mustache.render(userTemplate, {
                account: '帳號'
            });
            userElements.insertAdjacentHTML("beforeend", html); //before:訊息會往下疊 after:訊息往上疊
        }
    } else {
        //若無token則直接顯示'帳號'
        const html = Mustache.render(userTemplate, {
            account: '帳號'
        });
        userElements.insertAdjacentHTML("beforeend", html); //before:訊息會往下疊 after:訊息往上疊
    }
};

showUserAccount();
