async function onSignIn(googleUser) {
    let id_token = googleUser.getAuthResponse().id_token;
    const response = await fetch('/api/users/googleOAuth', {
        method: 'POST',
        body: JSON.stringify({ idtoken: id_token }),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const user = await response.json();
    if (response.status === 200) {
        localStorage.removeItem('jwtToken');
        localStorage.setItem('jwtToken', user.token);
        console.log(localStorage.getItem('jwtToken'));
        alert('登入成功');
        document.location.href="/userProfile";
    } else {
        console.log(user);
        alert('登入失敗');
    }
};
