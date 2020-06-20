
    const express = require('express');
    const router = express.Router();
    
    const users = require('../controllers/user.controller.js');

    

   // Retrieve all Users
   router.get('/user/all', users.all);

    // Retrieve a single User with user_id
    router.get('/user/:user_id', users.getById);

   // Update User Info with user_id
   router.update('/user/update/:user_id', users.update);

    // Delete a User with user_id
    router.delete('/user/delete/:user_id', users.delete);

    