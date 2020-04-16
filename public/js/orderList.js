// IIFE 取得order清單
(async () => {
    // Templates
    const dateTemplate = document.querySelector('#date-template').innerHTML;
    const itemTemplate = document.querySelector('#item-template').innerHTML;
    const amountTemplate = document.querySelector('#amount-template').innerHTML;

    // Elements
    const orderList = document.querySelector('#orderList');

    const response = await fetch('/api/order/me?sortBy=createdAt:desc', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
        }
    });

    // 若未登入
    if (response.status === 401) { 
        return document.location.href="/userUnauthorized";
    }

    const order = await response.json();
    
    // 成功拿到order資料
    if (response.status === 200) {

        //每一個order
        for (let i = 0, orderLen = order.length; i < orderLen; i++) {
            //計算每個order的總金額
            let amount = 0;

            //顯示order日期
            const dateHtml = Mustache.render(dateTemplate, {
                orderId: order[i]._id,
                orderDate: moment(order[i].createdAt).format('MMMM Do YYYY, h:mm:ss a')
            });
            orderList.insertAdjacentHTML("beforeend", dateHtml); //before:訊息會往下疊 after:訊息往上疊

            //order的每個購買商品
            for (let j = 0, itemLen = order[i].orderItem.length; j < itemLen; j++) {
                //顯示item資料
                const itemHtml = Mustache.render(itemTemplate, {
                    commodityId: order[i].orderItem[j].commodityId,
                    name: order[i].orderItem[j].name,
                    price: order[i].orderItem[j].price,
                    quantity: order[i].orderItem[j].quantity
                });
                orderList.insertAdjacentHTML("beforeend", itemHtml);
                amount += order[i].orderItem[j].price * order[i].orderItem[j].quantity;
            }

            //在每一個order結尾顯示總金額
            const amountHtml = Mustache.render(amountTemplate, {
                orderAmount: amount
            });
            orderList.insertAdjacentHTML("beforeend", amountHtml);
        }
    } else { 
        // 處理status(500 400 404) error
        if (order.name === 'MongoError') {
            alert(order.errmsg);
        } else if (order.name === 'ValidationError') {
            alert(order.message)
        } else {
            alert(order.error);
        }
    }
})();