const mongoose = require('mongoose');

//connect MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/yochen-website', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
});