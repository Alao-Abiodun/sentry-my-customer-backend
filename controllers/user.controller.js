const User = require('../models/user.js');

///#region Get all Users.
exports.all = async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).send(users);
    } catch (e) {
        res.status(400).json({
            mesage: e.message || 'Some error occured while retrieving the users.'
        })
    }
};
//#endregion

//Add new user

exports.new = (req, res) => {
    try {
        const { first_name, last_name, email, password, phone_number } = req.body;
        const newUser = new User({
            phone_number,
            first_name,
            last_name,
            email,
            password
        });
        const user = await newUser.save();
        if (err) return res.status(501).json({
            status: "fail",
            message: "Could not add user due to an internal error"
        });
        res.status(200).json({
            status: "success",
            data: user
        });
    } catch (e) {
        res.status(400).send(e)
    }
}

//#region Fnd a single user with a user_id
exports.getById = async (req, res) => {
    try {
        const user = await User.findById(req.params.user_id);
        if (!user) return res.status(404).json({
            messsage: 'User not found with id' + req.params.user_id
        });
        res.status(200).json({
            status: 'success',
            data: {
                user
            }
        })
    } catch (e) {
        res.status(400).send(e);
    }
};
//#endregion

//#region Update a user the user_id 
exports.update = async (req, res) => {
    // Validate Request
    try {
        if (!req.body) return res.status(400).send({
            message: 'Did not recieve any update values'
        })
        const user = await User.findByIdAndUpdate(req.params.user_id, req.body, { new: true, runValidators: ture });
        if (!user) return res.status(404).send({
            message: 'User not found with id' + req.params.user_id
        });
        res.status(200).json({
            status: 'success',
            data: {
                user
            }
        })
    } catch (e) {
        res.status(401).send(e);
    }
}
//#endregion

//#region Delete a user the user_id
exports.delete = async (req, res) => {
    try {
        const user = await User.findByIdAndRemove(req.params.user_id);
        if (!user) return res.status(404).json({ message: 'User not found with id' + req.params.user_id });
        res.status(200).json({
            message: 'User deleted successfully'
        })
    } catch (e) {
        (e.kind === 'ObjectId' || e.name === 'NotFound') ?
            res.status(404).send({
                message: "User not found with id " + req.params.user_id
            }) :
            res.status(500).send({
                message: "Could not delete user with id " + req.params.user_id
            });
    }
};
//#endregion
