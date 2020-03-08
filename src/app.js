const express = require('express');
require('./db/mongoose'); //connect MongoDB
const User = require('./models/user');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());//auto parse Json from client side

//create user
app.post('/users', async(req, res) => {
    const user = new User(req.body);

    try {
        await user.save();
        res.status(201).send(user);
    } catch (e) {
        res.status(400).send(e);
    }
});

//get user profile
app.get('/user/:id', async (req, res) => {
    const _id = req.params.id;

    try {
        const user = await User.findById(_id);

        if (!user) {
            return res.status(404).send();
        }

        res.send(user);
    } catch (e) {
        res.status(500).send();
    }
});






app.listen(port, () => {
    console.log('Server is running', port);
});