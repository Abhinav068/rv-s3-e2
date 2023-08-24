const { Router } = require('express');
const { UserModel } = require('../models/user.model');
require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { BlogModel } = require('../models/blog.model');
const { authenticate } = require('../middlewares/authentication');


const apiRouter = Router();

apiRouter.get('/', async (req, res) => {
    try {
        res.send('api route')
    } catch (error) {
        console.log(error);
    }
})

apiRouter.post('/register', async (req, res) => {
    try {
        const { username, avatar, email, password } = req.body;
        let isuser = await UserModel.findOne({ email });
        if (isuser) {
            res.status(404).send('userAlready present');
            return;
        }
        const hash = bcrypt.hashSync(password, +process.env.saltRounds);

        const user = new UserModel({ username, avatar, email, password: hash });
        await user.save();
        res.status(200).send('user registered')
    } catch (error) {
        console.log(error);
    }
})

apiRouter.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        let isuser = await UserModel.findOne({ email });
        if (!isuser) {
            res.status(404).send('user doesn\'t exist');
            return;
        }

        const iscorrect = bcrypt.compareSync(password, isuser.password);
        if (iscorrect) {
            const token = jwt.sign({
                id: isuser._id,
                email: isuser.email,
                username: isuser.username
            }, process.env.jwtsecret, { expiresIn: '1h' });
            res.status(200).send({ token })
        }
        else {
            res.status(404).send('invalid credentials')

        }
    } catch (error) {
        console.log(error);
    }
})


apiRouter.get('/blogs', async (req, res) => {
    try {
        const { title, category, sort, order } = req.query;

        let agrr = [
            {
                '$match': {
                    'title': {
                        '$regex': title ? title : ''
                    }
                }
            }
        ];

        if (category) {
            agrr.push({
                '$match': {
                    category
                }
            })
        }
        if (sort == 'date') {
            agrr.push({
                '$sort': {
                    'date': order == 'asc' ? 1 : -1
                }
            })
        }

        const blogs = await BlogModel.aggregate(agrr);

        res.status(200).send({ blogs })
    } catch (error) {
        console.log(error);
    }
})

apiRouter.put('/blogs/:id/like', async (req, res) => {
    try {
        const id = req.params.id;
        const blog = await BlogModel.findById(id);
        console.log(blog);
        if (!blog) {
            res.status(404).send('blog doesn\'t exist');
            return;
        }
        const likes = blog.likes + 1;
        await BlogModel.findByIdAndUpdate(id, { likes })
        res.status(200).send('like added');
        

    } catch (error) {
        console.log(error);
    }
})

apiRouter.put('/blogs/:id/comment', async (req, res) => {
    try {
        const id = req.params.id;
        const {username,content}=req.body;
        const blog = await BlogModel.findById(id);
        console.log(blog);
        if (!blog) {
            res.status(404).send('blog doesn\'t exist');
            return;
        }
        const comments=blog.comments;
        comments.push({username,content})
        await BlogModel.findByIdAndUpdate(id, { comments });
        res.status(200).send('comment added');        

    } catch (error) {
        console.log(error);
    }
})

apiRouter.use(authenticate);
apiRouter.post('/blogs', async (req, res) => {
    try {
        const { username, title, content, category, date } = req.body
        const blog = new BlogModel({ username, title, content, category, date });
        await blog.save();
        res.status(200).send('blog is saved')
    } catch (error) {
        console.log(error);
    }
})
apiRouter.delete('/blogs/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const blog= await BlogModel.findById(id);
        if(blog.username==req.body.username){
            await BlogModel.findByIdAndDelete(id);
            res.status(200).send('blog deleted');                    
        }
        else{
            res.status(404).send('Not authorized');
        }


    } catch (error) {
        console.log(error);
    }
})

apiRouter.put('/blogs/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const { username, title, content, category, date } = req.body
        const blog= await BlogModel.findById(id);
        if(blog.username==req.body.username){
            await BlogModel.findByIdAndUpdate(id,{ username, title, content, category, date });
            res.status(200).send('blog updated');      
                             
        }
        else{
            res.status(404).send('Not authorized');
        }

    } catch (error) {
        console.log(error);
    }
})

module.exports = { apiRouter };