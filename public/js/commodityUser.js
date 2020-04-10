const getUserCommodity = async () => {

    const response = await fetch('/api/commodityUser', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
        }
    });
    const commodity = await response.json();

    if (response.status === 401) {
        document.location.href="/userUnauthorized";
    } else if (response.status === 200) {
        console.log(commodity);
        // Templates
        const commodityTemplate = document.querySelector('#commodity-template').innerHTML;

        // Elements
        const $commodityElements = document.querySelector('#commodity');

        // 透過Mustache傳遞資料
        for (let i = 0; i < commodity.length; i++) {
            if (commodity[i].photo) {
                commodity[i].photoAPI = `/api/commodity/${commodity[i]._id}/photo`;
            }
            const html = Mustache.render(commodityTemplate, commodity[i]);

            $commodityElements.insertAdjacentHTML("beforeend", html); //before:訊息會往下疊 after:訊息往上疊
        }
    } else {
        console.log(commodity.error);
    }

    
};

getUserCommodity();