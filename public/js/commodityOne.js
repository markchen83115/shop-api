// Button
const purchaseButton = document.querySelector('#purchase');
const cartButton = document.querySelector('#addCart');

// Element
const qty = document.querySelector('#qty');
const stock = document.querySelector('#stock');
const commodityId = document.querySelector('#commodityId');

// input-購買數量
qty.addEventListener('change', (e) => {
    // 讓瀏覽器不重新刷新
    e.preventDefault();

    // 控制input-購買數量
    if(Number(qty.value) > Number(stock.value)) {
        qty.value = Number(stock.value);
        alert('此商品庫存不足');
    } else if (Number(qty.value) <= 0) {
        qty.value = 1;
        alert('購買數量至少1件');
    } else {
        qty.value = Number(qty.value);
    }
});

// 加入購物車
cartButton.addEventListener('click', async (e) => {
    // 讓瀏覽器不重新刷新
    e.preventDefault();

    // 抓取表單資料
    const formData = {
        commodityId: commodityId.value,
        quantity: qty.value
    };

    // 呼叫API-加入購物車
    const response = await fetch(`/api/cart`, {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`,
            'Content-Type': 'application/json'
        }
    });

    // API結果回傳
    if (response.status === 401) {
        document.location.href="/userUnauthorized";
    } else if (response.status === 201) {
        alert('已新增到購物車');
    } else {
        const responseJson = await response.json();
        console.log(responseJson);
        // alert(responseJson.error);
    }
});