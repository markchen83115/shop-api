// Button
const purchaseButton = document.querySelector('#purchase');
const cartButton = document.querySelector('#addCart');

// Element
const qty = document.querySelector('#qty');
const stock = document.querySelector('#stock');
const commodityId = document.querySelector('#commodityId');

//IIFE 庫存為0 則disable按鈕
(function () {
    if (Number(stock.value) === 0) {
        purchaseButton.disabled = true;
        cartButton.disabled = true;
    }
})();

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
        // error
        const responseJson = await response.json();
        console.log(responseJson);
        if (responseJson.name === 'MongoError') {
            alert(responseJson.errmsg);
        } else if (responseJson.name === 'ValidationError') {
            alert(responseJson.message)
        } else {
            alert(responseJson.error);
        }
    }
});

// 直接購買
purchaseButton.addEventListener('click', async (e) => {
    // 讓瀏覽器不重新刷新
    e.preventDefault();

    // 抓取表單資料
    const items = [{
        commodityId: commodityId.value,
        quantity: qty.value
    }];

    // 呼叫API-加入購物車
    const response = await fetch(`/api/order`, {
        method: 'POST',
        body: JSON.stringify({ items }),
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`,
            'Content-Type': 'application/json'
        }
    });

    // 未登入
    if (response.status === 401) {
        return document.location.href="/userUnauthorized";
    }

    const responseJson = await response.json();

    // api回傳結果
    if (response.status !== 201) {
        // error
        console.log(responseJson);
        if (responseJson.name === 'MongoError') {
            alert(responseJson.errmsg);
        } else if (responseJson.name === 'ValidationError') {
            alert(responseJson.message)
        } else {
            alert(responseJson.error);
        }
    } else {
        // 成功 status(201)
        alert('購買成功');
        document.location.href=`/commodity/${commodityId.value}`;
    }

});