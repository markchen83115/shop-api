// 對應form的欄位
const userProfile = document.querySelector('#userProfile');
const account = document.querySelector('#account');
const email = document.querySelector('#email');
const phone = document.querySelector('#phone');
const name = document.querySelector('#name');
const birthdayYear = document.querySelector('#birthdayYear');
const birthdayMonth = document.querySelector('#birthdayMonth');
const birthdayDay = document.querySelector('#birthdayDay');
const gender = document.getElementsByName('gender');
const imgAvatar = document.querySelector('#imgAvatar');
const avatar = document.querySelector('#avatar');


// 獲取radio buttom 性別資料 - getRVBN()
const getRVBN = (rName) => {
    var radioButtons = document.getElementsByName(rName);
    for (var i = 0; i < radioButtons.length; i++) {
        if (radioButtons[i].checked) return radioButtons[i].value;
    }
    return '';
};

// 從server取得使用者資料
const getUserProfile = async () => {
    const response = await fetch('/users/me', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
        }
    });

    // 未取得授權 請使用者重新登入
    if (response.status === 401) {
        return document.location.href="/unauthorized";
    };

    const responseUser = await response.json();
    console.log(responseUser);

    // 將生日切割為年.月.日
    const userBirthday = responseUser.birthday.split('-');

    // 傳遞資料並顯示在form
    account.value = responseUser.account;
    email.value = responseUser.email;
    phone.value = responseUser.phone;
    email.value = responseUser.email;
    name.value = responseUser.name;
    birthdayYear.value = userBirthday[0];
    birthdayMonth.value = userBirthday[1];
    birthdayDay.value = userBirthday[2];
    // 顯示性別
    for (var i = 0; i < gender.length; i++) {
        if (gender[i].value === responseUser.gender) {
            gender[i].checked = true;
        }
    }
    // 顯示個人照片
    imgAvatar.src = `/users/${responseUser._id}/avatar`;
};

// 更新使用者資料
userProfile.addEventListener('submit', async (e) => {
    // 讓瀏覽器不重新刷新
    e.preventDefault();

    // 抓取表單資料
    const formData = new FormData();
    formData.append('email', email.value);
    formData.append('phone', phone.value);
    formData.append('name', name.value);
    formData.append('gender', getRVBN('gender'));
    formData.append('birthday', `${birthdayYear.value}-${birthdayMonth.value}-${birthdayDay.value}`);
    if (avatar.files[0]) {
        formData.append('avatar', avatar.files[0]);
    }

    // 呼叫API-建立使用者
    const response = await fetch('/users/me', {
        method: 'PATCH',
        body: formData,
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
        }
    });

    // API結果回傳
    if (response.status === 401) {
        document.location.href="/unauthorized";
    } else if (response.status === 200) {
        alert('更新資料成功');
        document.location.href="/userProfile";
    } else {
        const responseJson = await response.json();
        alert(responseJson.error);
    }
});

getUserProfile();



