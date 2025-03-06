const User = require('../modules/user');
const bcrypt = require('bcrypt');


const users = async(req, res) =>{ 
    try {
        const data = await User.find({}, { '__v': false });
        if (data && data.length > 0) {
            return res.status(200).json(data); 
        } else {
            return res.status(404).send({ msg: 'No users found'});
        }
    } catch (err) {
        return res.status(500).json({
            msg: 'server falid',
            err: err.message
        });
    }
}

const register = async (req, res) => {
    const { userName, email, password } = req.body; 
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: 'Email is already registered. Please use a different email.',
            });
        }
        
        const HashPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ userName, email, password: HashPassword});
        await newUser.save();

        return res.status(201).json(newUser);
    } catch (err) {
        return res.status(500).json({
            msg: 'server falid',
            err: error.message
        });
    }
};




const login = async(req, res) =>{
    try{
        const {email, password} = req.body;
        if(!email) return res.status(400).json( {msg: "User did not enter the email"} );
        if(!password) return res.status(400).json( {msg: "User did not enter the password"} );
        
        const found = await User.findOne({ email });
        if(!found) return res.status(400).json( {msg: "User enter a not existing email"} );
    
        const right = await bcrypt.compare(password, found.password);
        if(!right) return res.status(400).json( {msg: "User enter a wrong password"} );
    
        return res.status(200).json( {msg: "login success"} );
    }catch(err){
        return res.status(500).json({
            msg: 'server falid',
            err: err.message
        });
    }
}


module.exports = {
    users,
    register,
    login
}