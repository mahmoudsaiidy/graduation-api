const express = require('express');
const { model } = require('mongoose');
const router = express.Router();

const control = require('../controllers/user_controllers');


router.route('/').get(control.users); // all users

router.route('/register').post(control.register); 

router.route('/login').post(control.login); 

module.exports = router; 