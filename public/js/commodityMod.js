// 對應form的欄位
const commodityForm = document.querySelector('#commodityForm');
const deleteButton = document.querySelector('#delete');
const id = document.querySelector('#id');
const name = document.querySelector('#name');
const description = document.querySelector('#description');
const material = document.querySelector('#material');
const price = document.querySelector('#price');
const stock = document.querySelector('#stock');
const imgPhoto = document.querySelector('#imgPhoto');
const photo = document.querySelector('#photo');

// 更新商品資料
commodityForm.addEventListener('submit', async (e) => {
    // 讓瀏覽器不重新刷新
    e.preventDefault();

    // 抓取表單資料
    const formData = new FormData();
    formData.append('name', name.value);
    formData.append('description', description.value);
    formData.append('material', material.value);
    formData.append('price', price.value);
    formData.append('stock', stock.value);
    if (photo.files[0]) {
        formData.append('photo', photo.files[0]);
    }

    // 呼叫API-更新商品
    const response = await fetch(`/api/commodity/${id.value}`, {
        method: 'PATCH',
        body: formData,
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
        }
    });

    // API結果回傳
    if (response.status === 401) {
        document.location.href="/userUnauthorized";
    } else if (response.status === 200) {
        alert('更新資料成功');
        document.location.href=`/commodityMod/${id.value}`;
    } else {
        const responseJson = await response.json();
        alert(responseJson.error);
    }
});

// 刪除商品
deleteButton.addEventListener('click', async (e) => {
    // 讓瀏覽器不重新刷新
    e.preventDefault();

    // 呼叫API-刪除商品
    const response = await fetch(`/api/commodity/${id.value}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
        }
    });

    // API結果回傳
    if (response.status === 401) {
        document.location.href="/userUnauthorized";
    } else if (response.status === 200) {
        alert('刪除商品成功');
        document.location.href=`/commodityUser`;
    } else {
        const responseJson = await response.json();
        alert(responseJson.error);
    }
});



