const express = require('express');
const session = require('express-session')
const MongoStore = require('connect-mongo')
require('./config');
require('dotenv').config();
const bcrypt = require('bcrypt')
const mongoStore = require('connect-mongo')
const mongoose = require('mongoose')
const FactoryDAO = require('./daos/index')
const advancedOptions = {useNewUrlParser: true, useUnifiedTopology: true}
const argv = require('minimist')(process.argv.slice(2))
const { fork } = require('child_process')
const cluster = require("cluster")
const cors = require("cors")
const nodemailer = require("nodemailer")
//const logger = require("./logger")
const app = express();

const email_notification = 'agusdellaquila12@gmail.com'

const { normalize, schema } = require('normalizr')
//---------------------------------------------------
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cors())
//---------------------------------------------------
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
    rolling: true,
    cookie: {
        expires: 600000 
    },
    store: new MongoStore({
        mongoUrl: `mongodb+srv:${process.env.MONGO_URI}`,
        mongoOptions: advancedOptions
    })
}))
//---------------------------------------------------
//logger 
// app.use((req,res, next) => {
// 	logger.info(`Ruta: ${req.path}, Método: ${req.method}`)
// 	next()
// })
//RENDERS
app.set('views', './views')
app.set('view engine', 'ejs')
app.use(express.static(__dirname + '/public'))
const DAO = FactoryDAO()

const userSchema = {
    username: String,
    password: String,
    email: String,
    name: String,
    surname: String,
    phone: Number,
    adress: String,
    age: Number,
    photo: String,
    role: String
}
const userModel = mongoose.model('User', userSchema, 'users')

//REGISTER
app.get('/register', async (req, res) => {
    res.render('register.ejs', {})
})

app.post('/register', (req, res) => {
    const { username, email, password, name, surname, phone, adress, age, photo } = req.body
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        auth: {
            user: email_notification,
            pass: 'ogtgxxiaifyycdpm'
        }
    })
    const rounds = 10
    bcrypt.hash(password, rounds, (error, hash) => {
        const newUser = new userModel({
            username: username,
            password: hash,
            email: email,
            name: name,
            surname: surname,
            phone: phone,
            adress: adress,
            age: age,
            photo: photo,
            role: 'admin'
        })
        userModel.findOne({email: email}, (error, foundItem) => {
            if (error) {
                console.log(error)
                res.render('error-login.ejs', {error})
            } else {
                if (foundItem) {
                    res.render('error-login.ejs', {error: 'This email is already in use'})
                } else {
                    newUser.save()
                    .then(() => {
                        console.log('New user registered')
                        res.render('registered.ejs', {username})
                        transporter.sendMail({
                            from: email_notification,
                            to: [email_notification],
                            subject: 'Nuevo usuario registrado',
                            html: `<h1>${username}</h1>
                                    <p>email: ${email}</p>
                                    <p>nombre: ${name} ${surname}</p>
                                    <p>edad: ${age}</p>
                                    <p>direccion: ${adress}</p>`,
                        })
                        .then(r => console.log(r))
                        .catch(e => console.log(e))
                    })
                    .catch(error => {
                        console.log(error)
                    })
                }
            }
        })
    })
})
//LOGIN
app.get('/login', async (req, res) => {
    if (req.session.username) {
        const sessionUsername = req.session.username
        res.render('home.ejs', {sessionUsername})
    } else {
        res.render('login.ejs', {})
    }
})
app.post('/login', async (req, res) => {
    const { email, password } = req.body
    let sessionUsername
    userModel.findOne({email: email}, async (error, foundItem) => {
        if (error) {
            res.send(error)
        } else {
            if (foundItem) {
                const compare = await bcrypt.compare(password, foundItem.password)
                req.session.userObject = foundItem
                req.session.username = foundItem.username
                sessionUsername = foundItem.username
                if (compare) {
                    const products = await DAO.product.getAll()
                    const { id } = await DAO.cart.cartSave()
                    req.session.cartId = id
                    console.log('CART_ID: ' + req.session.cartID)
                    res.render('home.ejs', {products, sessionUsername})
                } else {
                    res.render('error-login.ejs', {error: 'Incorrect password'})
                }
            } else {
                res.render('error-login.ejs', {error: 'Account not found'})
            }
        }
    })
})
//LOG OUT
app.get('/logout', async (req, res) => {
    if (!req.session.username) {
        res.render('login.ejs', {})
    } else {
        const username = req.session.username
        await DAO.cart.deleteCartById(req.session.cartId)
        req.session.destroy(err => {
            if (!err) {
                res.render('logout.ejs', {username})
            } else res.send({error: 'logout', body: err})
        })
    }
})
//PRODUCTS
app.get('/products', async (req, res) => {
    if (!req.session.username) {
        res.render('login.ejs', {})
    } else {
        const products = await DAO.product.getAll()
        // require('./normalize-messages')
        res.render('products.ejs', {products})
    }
})
app.post('/products', async (req, res) => res.send(await DAO.product.save(req.body)))
//DETAILS
app.get('/products/:id', async (req, res) => {
    if (!req.session.username) {
        res.render('login.ejs', {})
    } else {
        const id = req.params.id
        const data = await DAO.product.getByID(id)
        const product = data[0]
        res.render('details.ejs', {product})
    }
})
//POST FORM
app.get('/form', (req, res) => {
    if (!req.session.username) {
        res.render('login.ejs', {})
    } else {
        res.render('form.ejs')
    }
})
// Delete product by ID
app.delete('/products/:id', async (req, res) => {
    const id = Number(req.params.id)
    await DAO.product.deleteByID(id)
    res.send(`Product with ID #${id} deleted.`)
})
// Edit product form
// app.get('/products/edit/:id', async (req, res) => {
//     const id = Number(req.params.id)
//     const prod = await DAO.product.getByID(id)
//     res.render('edit.ejs', {prod})
// })
// Edit product by ID
// app.put('/products/:id', async (req, res) => {
//     const id = Number(req.params.id)
//     await DAO.product.editById(req.body, id)
//     const products = await DAO.product.getAll()
//     res.render('products.ejs', {products})
// })
// Get all carts
app.get('/carts', async (req, res) => {
    if (!req.session.username) {
        res.render('login.ejs', {})
    } else {
        const cart = await DAO.cart.getAll()
        const userCart = cart[0].products
        res.render('carts.ejs', {userCart})
    }
})
// Add to cart
app.post('/carts', async (req, res) => {
    const { addID } = req.body
    const productToAdd = await DAO.product.getByID(addID)
    if (productToAdd.length > 0) {
        res.send(await DAO.cart.addToCart(productToAdd))
    } else {
        res.send({error: 'The product does not belong to our inventory.'})
    }
})
// Delete a product in cart
app.delete('/carts/:id', async (req, res) => {
    const id = req.params.id
    await DAO.cart.deleteByID(id)
    res.send(`Product with ID #${id} deleted from cart.`)
})
// Delete cart
app.delete('/carts', async (req, res) => {
    await DAO.cart.deleteAll()
    res.send('All cart products deleted.')
})

// INFO
app.get('/info', async (req, res) => {
    const numCPUs = require('os').cpus().length
    //console.log(process.argv)
    //console.log(process.memoryUsage())

    res.send({
        inputArgs: argv,
        platform: process.platform,
        nodeVersion: process.versions.node,
        Rss: process.memoryUsage.rss(),
        exePath: process.execPath,
        processId: process.pid,
        projectFolder: process.cwd(),
        numCPUs: numCPUs
    })
})
// Profile
app.get('/profile', async (req, res) => {
    if (!req.session.username) {
        res.render('login.ejs', {})
    } else {
        let userObject = req.session.userObject
        res.render('profile.ejs', {userObject})
    }
})
// RANDOMS
app.get('/api/randoms', async (req, res) => {
    let cant = (req.query.cant) ? req.query.cant : 100000000
    const random = fork('random.js')
    random.send(cant)
    random.on('message', numbers => {
        res.send({
            active: 'randoms',
            randoms: numbers
        })
    })
})

//--------------------Socket chat--------------------
// const ContenedorMensajes = require('./contenedores/contenedorMensajes')
// const messages = new ContenedorMensajes('DB_messages.json')
// const http = require('http')
// const { Server } = require('socket.io')
// const httpServer = http.createServer(app)
// const io = new Server(httpServer)

// const user = new schema.Entity('users')
// const message = new schema.Entity('messages', {
//     messenger: user
// })
// const messageSchema = new schema.Entity('message', {
// 	author: user,
//     messages: [message]
// })

// io.on('connection', function(socket) {
//     console.log('Un cliente se ha conectado: ' + socket.id)

//     messages.selectMessages()

//     const normalizedData = normalize(messages.data, [messageSchema])

//     socket.emit('messages', normalizedData)

//     socket.on('newMessage', async (newMessage) => {
//         await messages.writeMessage(newMessage)
//         messages.selectMessages()
//         const messageSchema = normalize(messages.data, [messageSchema])
//         io.sockets.emit('messages', normalizedData)
//     })
// })
//---------------------------------------------------
app.listen((process.env.PORT || 8080), () => {
	console.log(`Server listening on port: 8080 ...`)
})
app.on('error', error => console.log(`Error: ${error}`))


    //TWILIO WHATSAPP
    // const accountSid = 'AC8f36b58666fb36bbe53c79d15dbf8298'; 
    // const authToken = '[AuthToken]'; 
    // const client = require('twilio')(accountSid, authToken); 
    
    // client.messages 
    //     .create({ 
    //         body: 'Your Yummy Cupcakes Company order of 1 dozen frosted cupcakes has shipped and should be delivered on July 10, 2019. Details: http://www.yummycupcakes.com/', 
    //         from: 'whatsapp:+14155238886',       
    //         to: 'whatsapp:+5491122428587' 
    //     }) 
    //     .then(message => console.log(message.sid)) 
    //     .done();