// 未登入 不得新增商品
if (!localStorage.getItem('jwtToken')) {
    document.location.href="/userUnauthorized";
}

// 抓取Form裡面傳送的資料來使用
const newCommodityForm = document.querySelector('#newCommodity');
const name = document.querySelector('#name');
const description = document.querySelector('#description');
const material = document.querySelector('#material');
const price = document.querySelector('#price');
const stock = document.querySelector('#stock');
const photo = document.querySelector('#photo');
const imgPhoto = document.querySelector('#imgPhoto');

// 預覽上傳的圖片
function readURL(input) {
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      
      reader.onload = function(e) {
        $('#imgPhoto').attr('src', e.target.result);
      }
      reader.readAsDataURL(input.files[0]);
    }
  }
  $("#photo").change(function() {
    readURL(this);
  });


// 提交表單
newCommodityForm.addEventListener('submit', async (e) => {
    // 讓瀏覽器不重新刷新
    e.preventDefault();

    // 抓取表單資料
    const formData = new FormData();
    formData.append('name', name.value);
    // 若未填寫描述 顯示'無'
    if (description.value) {
        formData.append('description', description.value);
    } else {
        formData.append('description', '無');
    }
    // 若未填寫材質 顯示'無'    
    if (material.value) {
        formData.append('material', material.value);
    } else {
        formData.append('material', '無');
    }

    formData.append('price', price.value);
    formData.append('stock', stock.value);
    if (photo.files[0]) {
        formData.append('photo', photo.files[0]);
    }

    // 呼叫API-建立使用者
    const response = await fetch('/api/commodity', {
        method: 'POST',
        body: formData,
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
        }
    });

    // API回傳結果
    if (response.status === 401) {
        document.location.href="/userUnauthorized";
    } else if (response.status === 201) {
        alert('新增商品成功');
        document.location.href="/commodityNew";
    } else {
        const responseJson = await response.json();
        alert(responseJson.error);
    }
});