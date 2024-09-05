// import modules, set up port, listen to server connection

const express = require('express')
const dotenv = require('dotenv').config()
const cookieParser = require('cookie-parser')
const db = require ('./index')
const cors = require('cors');
const bodyParser = require('body-parser');
const { sequelize } = require('.');
const userRoutes = require('./Routes/userRoutes')
const collectionRoutes = require('./Routes/collectionRoutes');
const itemRoutes = require('./Routes/itemRoutes');
const likeRoutes = require('./Routes/likeRoutes');
const commentRoutes = require('./Routes/commentRoutes');
const tagRoutes = require('./Routes/tagRoutes');
const itemTagsRoutes = require('./Routes/itemTagsRoutes');



//setting up port
const PORT = process.env.PORT || 10000;

//assigning the variable to express
const app = express()

//middleware
app.use(cors({
  origin: 'https://collection-app-with-jira.vercel.app', // Use environment variable for client URL
  credentials: true
}));
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(bodyParser.json())

db.sequelize.sync().then(() => {
  console.log("db synced")
});

app.use('/api/users', userRoutes);
app.use('/api/collections', collectionRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/likes', likeRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/tags', tagRoutes);
app.use('/api/item-tags', itemTagsRoutes); 






//listening to server connection

app.listen(PORT,  '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});