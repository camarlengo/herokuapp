
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const mongoUrl = 'mongodb+srv://MisterDomi:pio09pio09@enrique09-1gyst.mongodb.net/test?retryWrites=true&w=majority'
const { User } = require('./Models/user');
// 
mongoose.connect(mongoUrl, { useNewUrlParser: true }, (err) => {
    if (!err) {
        console.log('Todo Chido en mongo..!!')
    }
});

const app = express();
const PORT = process.env.PORT || 3000;
app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('<h1>Heroku App </h1>');
});

app.post('/new/user', (req, res) => {
    const params = req.body;
    if (params.email && params.userName && params.password) {
        User.findOne({ email: params.email }).exec((err, user) => {
            if (err) {
                return res.status(500).json({ err: 'Ocurrio un error' });
            } else if (user) {
                return res.status(200).json({ message: 'El email esta en uso' });
            } else {
                let newUser = User({
                    userName: params.userName,
                    email: params.email,
                    password: params.password
                });
                //bcrypt
                newUser.save((err, user) => {
                    if (err) {
                        return res.status(500).json({ message: 'Ocurrio un error'});
                    }
                    else if (user) {
                        return res.status(201).json({ data: params });
                    }
                });
            }
        })
    } else {
        return res.status(400).json({ message: 'Petición no Permitida' });
    }
});
app.post('/login', (req, res) => {
    let params = req.body
    if (params.email && params.password) {
        User.findOne({ email: params.email }).exec((err, user) => {
            if (err) {
                console.log(err)
                res.send(err);
            }
            if (user) {
                if (user.password === params.password) {
                    console.log('Encontro usuario ', user);
                    res.send(user);
                } else {
                    res.status(404).send({ message: 'Usuario ó Contraseña Incorrectos' });
                }
            } else {
                res.status(404).json({ message: `No se encontro email ${params.email}` });
            }
        })
    } else {
        res.status(400).json({ message: 'No enviaste Datos' })
    }
});

app.get('/users', (req, res) => {
    User.find().exec((err, users) => {
        if (err) {
            return res.status(404).json({ message: 'Usuarios no encontrados' });
        } else {
            return res.status(200).json({ users })
        }
    })
});

app.listen(PORT, () => {
    console.log(`Servidor en puerto: ${PORT}`)
})
