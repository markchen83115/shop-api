// 從api取得資料 再用Mustache傳遞資料
(async function () {
    // Templates
    const cartTemplate = document.querySelector('#cart-template').innerHTML;

    // Elements
    const cartList = document.querySelector('#cartList');

    // 取得購物車
    const response = await fetch('/api/cart/me', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
        }
    });

    if (response.status === 401) { // 若未登入
        document.location.href="/userUnauthorized";
    } else { // 取得資料
        const cart = await response.json();
        //
        console.log(cart);

        // 透過Mustache傳遞資料
        for (let i = 0; i < cart.cartItem.length; i++) {
            // 透過commodityId取得個別商品的資料 
            const response_cItem = await fetch(`/api/commodity/${cart.cartItem[i].commodityId}`, {
                method: 'GET'
            });
            
            if (response_cItem.status === 200) {
                const cItem = await response_cItem.json();
                console.log(cItem);
                const html = Mustache.render(cartTemplate, {
                    commodityId: cart.cartItem[i].commodityId,
                    commodityName: cItem.name,
                    commodityQuantity: cart.cartItem[i].quantity,
                    commodityStock: cItem.stock
                });
                cartList.insertAdjacentHTML("beforeend", html); //before:訊息會往下疊 after:訊息往上疊
            }
        }
    }

    // 控制所有input 當購買數量更改時 同時更改DB的購買數量
    let allInput = document.querySelectorAll('.purchaseNum');
    allInput.forEach((elem) => {
        elem.addEventListener("change", async () => {

            // 先disable input
            elem.disabled = true;

            // 取得commodityId
            const cId = elem.id.split('_')[0];

            // 強制input value不能大於庫存
            if (Number(elem.value) > Number(elem.max)) {
                elem.value = Number(elem.max);
                alert('此商品庫存不足');
            } else if (Number(elem.value) <= 0) {
                elem.value = 1;
                alert('購買數量至少1件');
            } else {
                elem.value = Number(elem.value);
            }

            const formData = {
                quantity: elem.value
            };

            // 呼叫API-更改單一購物車的商品數量
            const responseChangeQty = await fetch(`/api/cart/${cId}`, {
                method: 'PATCH',
                body: JSON.stringify(formData),
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`,
                    'Content-Type': 'application/json'
                }
            });
            elem.disabled = false;
        });  
    });

    // 控制所有deleteSingleItem按鈕 刪除單一商品
    let deleteSingleItem = document.querySelectorAll('.deleteSingleItem');
    deleteSingleItem.forEach((deleteButton) => {
        deleteButton.addEventListener("click", async () => {

            // 先disable button
            deleteButton.disabled = true;

            // 取得commodityId
            const cId = deleteButton.id.split('_')[0];

            // 呼叫API-刪除購物車單一商品
            const responseDeleteSingleItem = await fetch(`/api/cart/${cId}`, {
                method: 'Delete',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`,
                    'Content-Type': 'application/json'
                }
            });

            deleteButton.disabled = false;

            // API回傳
            if (responseDeleteSingleItem.status === 401) {
                document.location.href="/userUnauthorized";
            } else if (responseDeleteSingleItem.status === 200) {
                alert('刪除成功');
                document.location.href="/cart";
            } else {
                alert('刪除失敗');
                document.location.href="/cart";
            }
        });  
    });

})();


// Button
const purchaseButton = document.querySelector('#purchase');
const deleteCartButton = document.querySelector('#deleteCart');

// 刪除購物車
deleteCartButton.addEventListener('click', async (e) => {
    // 讓瀏覽器不重新刷新
    e.preventDefault();

    // 呼叫API-刪除購物車
    const response = await fetch(`/api/cart`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`,
            'Content-Type': 'application/json'
        }
    });

    // API結果回傳
    if (response.status === 401) {
        document.location.href="/userUnauthorized";
    } else if (response.status === 200) {
        alert('刪除購物車成功');
        document.location.href=`/cart`;
    } else {
        const responseJson = await response.json();
        alert(responseJson.error);
    }
});

// 刪除購物車的單一商品
deleteCartButton.addEventListener('click', async (e) => {
    // 呼叫API-刪除購物車單一商品
    const response = await fetch(`/api/cart/:commodityId`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`,
            'Content-Type': 'application/json'
        }
    });

    // API結果回傳
    if (response.status === 401) {
        document.location.href="/userUnauthorized";
    } else if (response.status === 200) {
        alert('刪除購物車成功');
        document.location.href=`/cart`;
    } else {
        const responseJson = await response.json();
        alert(responseJson.error);
    }
});


