# Shoping-Website
---
前端使用HTML, CSS, JavaScript 展示由API得到的資料 

後端使用Node.js, Express, MongoDB, Redis, JsonWebToken, OAuth 2.0 建構API與Database

<h2 id='directory'>目錄</h2>

+ [前端](#frontend)
+ [後端](#backend)
+ [Database-MongoDB](#DB)
+ [API](#API)
    + [User](#user)
        + [1. Create User](#1.1)
        + [2. User Login](#1.2)
        + [3. User Logout](#1.3)
        + [4. User Logout All Device](#1.4)
        + [5. Google OAuth 2.0 Login](#1.5)
        + [6. Get User Profile](#1.6)
        + [7. Update User](#1.7)
        + [8. Delete User](#1.8)
        + [9. Upload User's Avatar](#1.9)
        + [10. Delete User's Avatar](#1.10)
        + [11. Render User's Avatar](#1.11)
    + [Commodity](#commodity)
        + [1. Create Commodity](#2.1)
        + [2. Get Commodity](#2.2)
        + [3. Update Commodity](#2.3)
        + [4. Delete Commodity](#2.4)
        + [5. Get All Commodity (using Cache - Redis)](#2.5)
        + [6. Get User Commodity](#2.6)
        + [7. Render Commodity's Photo](#2.7)
    + [Cart](#cart)
        + [1. Create Cart](#3.1)
        + [2. Update Cart](#3.2)
        + [3. Get Cart](#3.3)
        + [4. Delete Cart](#3.4)
        + [5. Delete Single Item in Cart](#3.5)
    + [Order](#order)
        + [1. Create Order](#4.1)
        + [2. Get Order](#4.2)
        + [3. Update Order](#4.3)
        + [4. Delete Order](#4.4)

<h2 id='frontend'> 前端 </h2>

1. 呈現所有商品/單一商品
    + 權限: 不需登入
    + 功能: 顯示商品資料
2. 新增商品 / 個人商品
    + 權限: 需登入
    + 功能: 新增 / 修改 / 刪除商品
3. 註冊 / 登入 / 登出 / Google登入 / Google登出
    + 功能: 帳號密碼驗證, 登入會發JWT給使用者
4. 購物車
    + 權限: 需登入
    + 功能: 新增商品 / 修改 / 刪除 / 送出訂單
5. 購買清單 (訂單)
    + 權限: 需登入
    + 功能: 顯示購買清單明細 / 購買時間 / 訂單金額

<h2 id='backend'> 後端 </h2>
<h3 id='DB'> Database-MongoDB: </h3>

1. **User**
    + **Document:** account, email, phone, password, name, gender, birthday, avatar, tokens, timestamps
    + **Validate:** 驗證email格式, 驗證phone為台灣手機號碼
2. **Commodity**
    + **Document:** name, description, material, price, stock, photo, owner, timestamps
    + **Validate:** name及description限制字數, 驗證price為正整數, 驗證stock為整數, owner對應User._id
3. **Cart**
    + **Document:** userId, cartItem[commodityId, quantity], timestamps
    + **Validate:** userId參照User._id, commodityId參照Commodity._id
4. **Order**
    + **Document:** userId, orderItem[commodityId, name, price, quantity], completed, timestamps
    + **Validate:** userId參照User._id, commodityId參照Commodity._id

<h3 id='API'> API: </h3>
<h4 id='user'> User </h4>

1. <strong id='1.1'>Create User:</strong> 新增使用者, 回傳使用者資料及token

    **URL:** 
    
    ```POST /api/users```

    + **Data Params**

        **Required:**
        ```js
        {
            account: 'abc123', 
            email: 'abc@example.com',
            password: 'abc12345'
        }
        ```
        **Optional:**
        ```js
        {
            phone: '0912345678',
            name: 'Mark', 
            gender: 'male', 
            birthday: '2020-01-01'
        }
        ```
    + **Success Response:**

        + **Code:** 201 CREATED

            **Content:** 
            ```js
            {
                user: {
                    account: 'abc123',
                    email: 'abc@example.com'
                },
                token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
            }
            ```
    + **Error Response:**

        + **Code:** 400 BAD REQUEST

            **Content:** ```{ error: ... }```

2. <strong id='1.2'>User Login:</strong>  使用者登入, 回傳使用者資料及token

    **URL:** 
    
    ```POST /api/users/login```

    + **Data Params**

        **Required:**
        ```js
        {
            account: 'abc123',
            password: 'abc12345'
        }
        ```

    + **Success Response:**

        + **Code:** 200

            **Content:** 
            ```js
            {
                user: {
                    account: 'abc123',
                    email: 'abc@example.com'
                },
                token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
            }
            ```
    + **Error Response:**

        + **Code:** 400 BAD REQUEST

            **Content:** ```{ error: 'Unable to login' }```

3. <strong id='1.3'>User Logout:</strong>  使用者登出

    **URL:** 
    
    ```POST /api/users/logout```

    + **Header**

        **Required:**
        ```js
        {
            token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
        }
        ```
    
    + **Success Response:**

        + **Code:** 200

            **Content:** None

    + **Error Response:**

        + **Code:** 401 UNAUTHORIZED

            **Content:** ```{ error: 'Please authenticate' }```

        + **Code:** 500 INTERNAL SERVER ERROR

            **Content:** None

4. <strong id='1.4'>User Logout All Device:</strong>  登出所有裝置

    **URL:** 
    
    ```POST /api/users/logoutAll```

    + **Header**

        **Required:**
        ```js
        {
            token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
        }
        ```
    
    + **Success Response:**

        + **Code:** 200

            **Content:** None 
        
    + **Error Response:**

        + **Code:** 401 UNAUTHORIZED

            **Content:** ```{ error: 'Please authenticate' }```

        + **Code:** 500 INTERNAL SERVER ERROR

            **Content:** None

5. <strong id='1.5'>Google OAuth 2.0 Login:</strong>  Google OAuth 2.0登入 

    **URL:** 
    
    ```POST /api/users/googleOAuth```
    
    + **Success Response:**

        + **Code:** 200

            **Content:** 
            ```js
            {
                user: {
                    account: 'abc123',
                    email: 'abc@example.com'
                },
                token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
            }
            ```
        
    + **Error Response:**

        + **Code:** 500 INTERNAL SERVER ERROR

            **Content:** ```{ error: ... }```

6. <strong id='1.6'>Get User Profile:</strong>  取得使用者個人資料

    **URL:** 
    
    ```GET /api/users/me```

    + **Header**

        **Required:**
        ```js
        {
            token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
        }
        ```

    + **Success Response:**

        + **Code:** 200

            **Content:**
            ```js
            {
                account: 'abc123', 
                email: 'abc@example.com'
            }
            ```

    + **Error Response:**

        + **Code:** 401 UNAUTHORIZED

            **Content:** ```{ error: 'Please authenticate' }```

7. <strong id='1.7'>Update User:</strong>  更新使用者

    > 僅能更新email, password, phone, name, gender, birthday, avatar屬性

    **URL:** 
    
    ```PATCH /api/users/me```

    + **Header**

        **Required:**
        ```js
        {
            token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
        }
        ```
    
    + **Data Params**

        **Optional:**
        ```js
        {
            account: 'abc123', 
            email: 'abc@example.com',
            password: 'abc12345'
            phone: '0912345678',
            name: 'Mark', 
            gender: 'male', 
            birthday: '2020-01-01'
            avatar: 'only accept jpg, jpeg, png file'
        }
        ```
    
    + **Success Response:**

        + **Code:** 200

            **Content:** 
            ```js
            {
                account: 'abc123', 
                email: 'abc@example.com',
                password: 'abc12345'
                phone: '0912345678',
                name: 'Mark', 
                gender: 'male', 
                birthday: '2020-01-01'
                avatar: 'Buffer'
            }
            ```
        
    + **Error Response:**

        + **Code:** 401 UNAUTHORIZED

            **Content:** ```{ error: 'Please authenticate' }```

        + **Code:** 400 BAD REQUEST

            **Content:** 
            ```js
            { error: 'invalid updates' }
            { error: 'Please upload a jpg, jpeg, png file' }
            { error: '...' }
            ```

8. <strong id='1.8'>Delete User:</strong>  刪除使用者, 並同時刪除使用者的商品, 購物車, 購物清單

    **URL:** 
    
    ```DELET /api/users/me```

    + **Header**

        **Required:**
        ```js
        {
            token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
        }
        ```
    
    + **Success Response:**

        + **Code:** 200

            **Content:**
            ```js
            {
                account: 'abc123', 
                email: 'abc@example.com'
            }
            ```
        
    + **Error Response:**

        + **Code:** 401 UNAUTHORIZED

            **Content:** ```{ error: 'Please authenticate' }```

        + **Code:** 500 INTERNAL SERVER ERROR

            **Content:** None

9. <strong id='1.9'>Upload User's Avatar:</strong>  上傳使用者頭像

    **URL:** 
    
    ```POST /api/users/me/avatar```

    + **Header**

        **Required:**
        ```js
        {
            token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
        }
        ```

    + **Data Params**

        **Required:**
        ```js
        {
            avatar: 'only accept jpg, jpeg, png file'
        }
        ```

    + **Success Response:**

        + **Code:** 200

            **Content:** None
        
    + **Error Response:**

        + **Code:** 401 UNAUTHORIZED

            **Content:** ```{ error: 'Please authenticate' }```

        + **Code:** 400 BAD REQUEST

            **Content:**
            ```js
            { error: '...' }
            ```
            
10. <strong id='1.10'>Delete User's Avatar:</strong>  刪除使用者頭像

    **URL:** 
    
    ```DELETE /api/users/me/avatar```

    + **Header**

        **Required:**
        ```js
        {
            token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
        }
        ```

    + **Success Response:**

        + **Code:** 200

            **Content:** None
        
    + **Error Response:**

        + **Code:** 401 UNAUTHORIZED

            **Content:** ```{ error: 'Please authenticate' }```

        + **Code:** 500 INTERNAL SERVER ERROR

            **Content:**
            ```js
            { error: ... }
            ```

11. <strong id='1.11'>Render User's Avatar:</strong>  顯示使用者頭像

    **URL:** 
    
    ```GET /api/users/:id/avatar```

    + **URL Params**

        **Required:**
        ```id = user._id```

    + **Success Response:**

        + **Code:** 200

            **Content:** None
        
    + **Error Response:**

        + **Code:** 404 NOT FOUND

            **Content:**  None

<h4 id='commodity'>Commodity</h4>

1. <strong id='2.1'>Create Commodity:</strong> 新增商品, 回傳商品資料

    **URL:** 
    
    ```POST /api/commodity```

    + **Header**

        **Required:**
        ```js
        {
            token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
        }
        ```

    + **Data Params**

        **Required:**
        ```js
        {
            name: 'milk', 
            price: 100,
            stock: 10
        }
        ```
        **Optional:**
        ```js
        {
            description: 'good milk',
            material: 'food', 
            photo: 'only accept jpg, jpeg, png'
        }
        ```

    + **Success Response:**

        + **Code:** 201 CREATED

            **Content:** 
            ```js
            {
                name: 'milk', 
                price: 100,
                stock: 10
            }
            ```
    + **Error Response:**

        + **Code:** 401 UNAUTHORIZED

            **Content:** ```{ error: 'Please authenticate' }```

        + **Code:** 400 BAD REQUEST

            **Content:** ```{ error: '...' }```

2. <strong id='2.2'>Get Commodity:</strong> 取得商品資料

    **URL:** 
    
    ```GET /api/commodity/:commodityId```

    + **URL Params**

        **Required:**
        ```commodityId = commodity._id```

    + **Success Response:**

        + **Code:** 200

            **Content:** 
            ```js
            {
                name: 'milk', 
                price: 100,
                stock: 10
            }
            ```
    + **Error Response:**

        + **Code:** 404 NOT FOUND

            **Content:** None

        + **Code:** 500 INTERNAL SERVER ERROR

            **Content:** ```{ error: '...' }```

3. <strong id='2.3'>Update Commodity:</strong> 更新商品

    > 僅能更新name, description, material, price, stock, photo屬性

    **URL:** 
    
    ```PATCH /api/commodity/:commodityId```

    + **Header**

        **Required:**
        ```js
        {
            token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
        }
        ```

    + **URL Params**

        **Required:**
        ```commodityId = commodity._id```

    + **Data Params**

        **Optional:**
        ```js
        {
            name: 'milk',
            description: 'good milk',
            material: 'food', 
            price: 100,
            stock: 20,
            photo: 'only accept jpg, jpeg, png'
        }
        ```

    + **Success Response:**

        + **Code:** 200

            **Content:** 
            ```js
            {
                name: 'milk',
                description: 'good milk',
                material: 'food', 
                price: 100,
                stock: 20,
                photo: 'Buffer'
            }
            ```
    + **Error Response:**

        + **Code:** 401 UNAUTHORIZED

            **Content:** ```{ error: 'Please authenticate' }```

        + **Code:** 404 NOT FOUND

            **Content:** None

        + **Code:** 400 BAD REQUEST

            **Content:** 
            
            ```js
            { error: '...' }
            { error: 'Invalid update' }
            ```

4. <strong id='2.4'>Delete Commodity:</strong> 刪除商品

    **URL:** 
    
    ```DELETE /api/commodity/:commodityId```

    + **Header**

        **Required:**
        ```js
        {
            token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
        }
        ```

    + **URL Params**

        **Required:**
        ```commodityId = commodity._id```

    + **Success Response:**

        + **Code:** 200

            **Content:** 
            ```js
            {
                name: 'milk',
                price: 100,
                stock: 20
            }
            ```
    + **Error Response:**

        + **Code:** 401 UNAUTHORIZED

            **Content:** ```{ error: 'Please authenticate' }```

        + **Code:** 404 NOT FOUND

            **Content:** None

        + **Code:** 500 INTERNAL SERVER ERROR

            **Content:** ```{ error: '...' }```

5. <strong id='2.5'>Get All Commodity (using Cache - Redis):</strong> 取得所有商品 (包含快取功能)
    
    > Cache expired time: 5 mins

    **URL:** 
    
    ```GET /api/commodityAll```

    + **URL Params**

        **Optional:**

        > limit: 限制顯示個數

        > skip: 從第n項開始顯示

        > sortBy: 根據建立時間(createdAt), 順序顯示(asc) / 倒序顯示(desc)

        ```
        limit = [integer]
        skip = [integer]
        sortBy = createdAt:[asc / desc]
        ```

    + **Success Response:**

        + **Code:** 200

            **Content:** 
            ```js
            [{
                name: 'milk',
                price: 100,
                stock: 20
            }, {
                name: 'bread',
                price: 10,
                stock: 5
            }]
            ```
    + **Error Response:**

        + **Code:** 500 INTERNAL SERVER ERROR

            **Content:** ```{ error: '...' }```

6. <strong id='2.6'>Get User Commodity:</strong> 取得使用者的所有商品

    **URL:** 
    
    ```GET /api/commodityUser```

    + **Header**

        **Required:**
        ```js
        {
            token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
        }
        ```

    + **URL Params**

        **Optional:**

        > limit: 限制顯示個數

        > skip: 從第n項開始顯示

        > sortBy: 根據建立時間(createdAt), 順序顯示(asc) / 倒序顯示(desc)

        ```
        limit = [integer]
        skip = [integer]
        sortBy = createdAt:[asc / desc]
        ```

    + **Success Response:**

        + **Code:** 200

            **Content:** 
            ```js
            [{
                name: 'milk',
                price: 100,
                stock: 20
            }, {
                name: 'bread',
                price: 10,
                stock: 5
            }]
            ```
    + **Error Response:**

        + **Code:** 401 UNAUTHORIZED

            **Content:** ```{ error: 'Please authenticate' }```

        + **Code:** 500 INTERNAL SERVER ERROR

            **Content:** ```{ error: '...' }```

7. <strong id='2.7'>Render Commodity's Photo:</strong> 顯示商品圖片

    **URL:** 
    
    ```GET /api/commodity/:id/photo```

    + **URL Params**

        **Required:** ```id = commodity._id```

    + **Success Response:**

        + **Code:** 200

            **Content:** None

    + **Error Response:**

        + **Code:** 404 NOT FOUND

            **Content:** None

<h4 id='cart'>Cart</h4>

1. <strong id='3.1'>Create Cart:</strong> 新增購物車, 回傳購物車資料

    **URL:** 
    
    ```POST /api/cart```

    + **Header**

        **Required:**
        ```js
        {
            token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
        }
        ```

    + **Data Params**

        **Required:**
        ```js
        {
            cartItem: {
                commodityId: commodity._id,
                quantity: 20
            }
        }
        ```

    + **Success Response:**

        + **Code:** 201 CREATED

            **Content:** 
            ```js
            {
                userId: user._id,
                cartItem: {
                    commodityId: commodity._id,
                    quantity: 20
                }
            }
            ```
    + **Error Response:**

        + **Code:** 401 UNAUTHORIZED

            **Content:** ```{ error: 'Please authenticate' }```

        + **Code:** 400 BAD REQUEST

            **Content:** ```{ error: '...' }```

2. <strong id='3.2'>Update Cart:</strong> 更新購物車

    > 僅能更新quantity屬性

    **URL:** 
    
    ```PATCH /api/cart/:commodityId```

    + **Header**

        **Required:**
        ```js
        {
            token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
        }
        ```

    + **URL Params**

        **Required:**
        ```commodityId = commodity._id```

    + **Data Params**

        **Required:**
        ```js
        {
            quantity: 10
        }
        ```

    + **Success Response:**

        + **Code:** 200

            **Content:** 
            ```js
            {
                userId: user._id,
                cartItem: {
                    commodityId: commodity._id,
                    quantity: 10
                }
            }
            ```
    + **Error Response:**

        + **Code:** 401 UNAUTHORIZED

            **Content:** ```{ error: 'Please authenticate' }```

        + **Code:** 404 NOT FOUND

            **Content:** None

        + **Code:** 400 BAD REQUEST

            **Content:** 
            ```js
            { error: '...' }
            { error: 'Invalid update' }
            ```

3. <strong id='3.3'>Get Cart:</strong> 取得購物車資料

    **URL:** 
    
    ```GET /api/cart/me```

    + **Header**

        **Required:**
        ```js
        {
            token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
        }
        ```

    + **Success Response:**

        + **Code:** 200

            **Content:** 
            ```js
            {
                userId: user._id,
                cartItem: {
                    commodityId: commodity._id,
                    quantity: 10
                }
            }
            ```

    + **Error Response:**

        + **Code:** 401 UNAUTHORIZED

            **Content:** ```{ error: 'Please authenticate' }```

        + **Code:** 404 NOT FOUND

            **Content:** None

        + **Code:** 500 INTERNAL SERVER ERROR

            **Content:**  ```{ error: '...' }```

4. <strong id='3.4'>Delete Cart:</strong> 刪除購物車

    **URL:** 
    
    ```DELETE /api/cart```

    + **Header**

        **Required:**
        ```js
        {
            token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
        }
        ```

    + **Success Response:**

        + **Code:** 200

            **Content:**
            ```js
            {
                userId: user._id,
                cartItem: {
                    commodityId: commodity._id,
                    quantity: 10
                }
            }
            ```

    + **Error Response:**

        + **Code:** 401 UNAUTHORIZED

            **Content:** ```{ error: 'Please authenticate' }```

        + **Code:** 404 NOT FOUND

            **Content:** None

        + **Code:** 500 INTERNAL SERVER ERROR

            **Content:**  ```{ error: '...' }```

5. <strong id='3.5'>Delete Single Item in Cart:</strong> 刪除購物車的單一商品

    **URL:** 
    
    ```DELETE /api/cart/:commodityId```

    + **Header**

        **Required:**
        ```js
        {
            token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
        }
        ```

    + **URL Params**

        **Required:**
        ```commodityId = commodity._id```

    + **Success Response:**

        + **Code:** 200

            **Content:**
            ```js
            {
                userId: user._id,
                cartItem: {
                    commodityId: commodity._id,
                    quantity: 10
                }
            }
            ```

    + **Error Response:**

        + **Code:** 401 UNAUTHORIZED

            **Content:** ```{ error: 'Please authenticate' }```

        + **Code:** 404 NOT FOUND

            **Content:** None

        + **Code:** 400 BAD REQUEST

            **Content:**  ```{ error: '...' }```

<h4 id='order'>Order</h4>

1. <strong id='4.1'>Create Order:</strong> 新增購買清單, 回傳購買清單資料

    > 新增購買清單後, 將更新商品庫存、刪除使用者的購物車

    **URL:** 
    
    ```POST /api/order```

    + **Header**

        **Required:**
        ```js
        {
            token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
        }
        ```

    + **Data Params**

        **Required:**
        ```js
        {
            orderItem: [{
                commodityId: commodity._id,
                name: 'milk',
                price: 100,
                quantity: 20
            }, {
                commodityId: commodity._id,
                name: 'bread',
                price: 10,
                quantity: 10
            }]
        }
        ```

    + **Success Response:**

        + **Code:** 201 CREATED

            **Content:** 
            ```js
            {
                userId: user._id,
                orderItem: [{
                    commodityId: commodity._id,
                    name: 'milk',
                    price: 100,
                    quantity: 20
                }, {
                    ommodityId: commodity._id,
                    name: 'bread',
                    price: 10,
                    quantity: 10
                }],
                completed: false
            }
            ```
    + **Error Response:**

        + **Code:** 401 UNAUTHORIZED

            **Content:** ```{ error: 'Please authenticate' }```

        + **Code:** 400 BAD REQUEST

            **Content:** 
            ```js
            { error: '...' }
            { error: `庫存不足`, commodityId: commodity._id, name: commodity.name }
            ```

        + **Code:** 404 NOT FOUND

            **Content:** None
        

2. <strong id='4.2'>Get Order:</strong> 取得購買清單

    **URL:** 
    
    ```GET /api/order/me```

    + **Header**

        **Required:**
        ```js
        {
            token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
        }
        ```

    + **URL Params**

        **Optional:**

        > limit: 限制顯示個數

        > skip: 從第n項開始顯示

        > sortBy: 根據建立時間(createdAt), 順序顯示(asc) / 倒序顯示(desc)

        > compeleted: 僅顯示已完成的購買清單(true) / 未完成的購買清單(false)

        ```
        limit = [integer]
        skip = [integer]
        sortBy = createdAt:[asc / desc]
        compeleted = [true / false]
        ```

    + **Success Response:**

        + **Code:** 200

            **Content:** 
            ```js
            {
                userId: user._id,
                orderItem: [{
                    commodityId: commodity._id,
                    name: 'milk',
                    price: 100,
                    quantity: 20
                }, {
                    commodityId: commodity._id,
                    name: 'bread',
                    price: 10,
                    quantity: 10
                }],
                completed: false
            }
            ```
    + **Error Response:**

        + **Code:** 401 UNAUTHORIZED

            **Content:** ```{ error: 'Please authenticate' }```

        + **Code:** 404 NOT FOUND

            **Content:** None

        + **Code:** 500 INTERNAL SERVER ERROR

            **Content:** ```{ error: '...' }```

3. <strong id='4.3'>Update Order:</strong> 更新購買清單

    > 僅能更新completed屬性

    **URL:** 
    
    ```PATCH /api/order/:orderId```

    + **Header**

        **Required:**
        ```js
        {
            token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
        }
        ```

    + **URL Params**

        **Required:**
        ```orderId = order._id```

    + **Data Params**

        **Required:**
        ```js
        {
            completed: true
        }
        ```

    + **Success Response:**

        + **Code:** 200

            **Content:** 
            ```js
            {
                userId: user._id,
                orderItem: [{
                    commodityId: commodity._id,
                    name: 'milk',
                    price: 100,
                    quantity: 20
                }, {
                    ommodityId: commodity._id,
                    name: 'bread',
                    price: 10,
                    quantity: 10
                }],
                completed: true
            }
            ```
    + **Error Response:**

        + **Code:** 401 UNAUTHORIZED

            **Content:** ```{ error: 'Please authenticate' }```

        + **Code:** 400 BAD REQUEST

            **Content:** 
            ```js
            { error: '...' }
            { error: 'Invalid update' }
            ```

        + **Code:** 404 NOT FOUND

            **Content:** None

4. <strong id='4.4'>Delete Order:</strong> 刪除購買清單

    **URL:** 
    
    ```DELETE /api/order/:orderId```

    + **Header**

        **Required:**
        ```js
        {
            token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
        }
        ```

    + **URL Params**

        **Required:**
        ```orderId = order._id```

    + **Success Response:**

        + **Code:** 200

            **Content:** 
            ```js
            {
                userId: user._id,
                orderItem: [{
                    commodityId: commodity._id,
                    name: 'milk',
                    price: 100,
                    quantity: 20
                }, {
                    ommodityId: commodity._id,
                    name: 'bread',
                    price: 10,
                    quantity: 10
                }],
                completed: false
            }
            ```
    + **Error Response:**

        + **Code:** 401 UNAUTHORIZED

            **Content:** ```{ error: 'Please authenticate' }```

        + **Code:** 404 NOT FOUND

            **Content:** None

        + **Code:** 500 BAD REQUEST

            **Content:** ```{ error: '...' }```

**[回到目錄](#directory)**