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

exports.new = async (req, res) => {
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
// exports.update = (req, res) => {
//     // Validate Request
//     if(!req.body.content) {
//         return res.status(400).send({
//             message: "Did not receive any update values"
//         });
//     }
// else{
//     // Find transaction and update it with the request body
//     User.findByIdAndUpdate(req.params.user_id, req.body.content, {new: true})
//     .then(user => {
//         if(!user) {
//             return res.status(404).send({
//                 message: "User not found with id " + req.params.user_id
//             });
//         }
//         res.send(user);
//     }).catch(err => {
//         if(err.kind === 'ObjectId') {
//             return res.status(404).send({
//                 message: "User not found with id " + req.params.user_id
//             });                
//         }
//         return res.status(500).send({
//             message: "Error updating user with id " + req.params.user_id
//         });
//         });
// }};
//#endregion


// @route       PUT user/update/:user_id
// @desc        User Updates his user details
// @access      Public (no auth)
// @author      buka4rill
exports.update = async (req, res) => {
    // Pull out data from body
    const { first_name, last_name, phone_number } = req.body;

    // Build data based on fields to be submited
    const userFields = {};

    if (first_name) userFields.first_name = first_name;
    if (last_name) userFields.last_name = last_name;
    if (phone_number) userFields.phone_number = phone_number;

    try {
        let user = await User.findById(req.params.user_id);

        if (!user) return res.status(404).json({ message: 'User not found!' });

        // Update User
        user = await User.findByIdAndUpdate(req.params.user_id,
            { $set: userFields },
            { new: true });

        // Send updated user details   
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
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
