const getUserCommodity = async () => {

    const response = await fetch('/commodityUser', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
        }
    });

    const commodity = await response.json();

    if (response.status === 401) {
        document.location.href="/unauthorized";
    } else if (response.status === 200) {
        console.log(commodity);
    } else {
        console.log(commodity.error);
    }

    // Templates
    const commodityTemplate = document.querySelector('#commodity-template').innerHTML;

    // Elements
    const $commodityElements = document.querySelector('#commodity');

    for (let i = 0; i < commodity.length; i++) {

        if (commodity[i].photo) {
            commodity[i].photoAPI = `/commodity/${commodity[i]._id}/photo`;
        }

        const html = Mustache.render(commodityTemplate, commodity[i]);
        

        // const html = Mustache.render(commodityTemplate, { //傳遞資料給index.html
        //     commodityName: commodity[i].name,
        //     commodityDescription: commodity[i].description,
        //     commodityMaterial: commodity[i].material,
        //     commodityPrice: commodity[i].price,
        //     commodityStock: commodity[i].stock
        // });
        // if (commodity[i].photo) {
        //     html.commodityPhoto = `/commodity/${commodity[i]._id}/photo`;
        // }
        $commodityElements.insertAdjacentHTML("beforeend", html); //before:訊息會往下疊 after:訊息往上疊
    }
};

getUserCommodity();