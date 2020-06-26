const Customer = require("../models/customer");
const { body, validationResult } = require('express-validator/check');

exports.validate = (method) => {
    switch (method) {
        case 'body': {
            return [
                body('name').isLength({ min: 3 }),
                body('phone').isInt()
            ]
        }
    }
}

exports.create = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ status: "fail", errors: errors.array() });
        }
        // Validate request
        if (!req.body) {
            return res.status(400).send({
                status: "fail",
                message: "Transaction content can not be empty",
            });
        }

        const { name, phone_number } = req.body;
        const customer = new Customer({
            name,
            phone_number,
        });

        await customer.save();

        res.status(200).json({
            status: "success",
            data: {
                id: customer._id,
                name: customer.name,
                phone: customer.phone_number,
            },
        });
    } catch (e) {
        res.status(401).send(e);
    }
};

exports.getById = async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.customerId);
        if (!customer) return res.status(404).send({ status: 'fail' })
        res.status(200).json({
            status: "success",
            data: {
                id: customer._id,
                name: customer.name,
                phone: customer.phone_number,
            },
        });
    } catch (e) {
        res.status(500).json({
            status: "fail",
            message: error.message,
        });
    }
};

exports.updateById = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ status: "fail", errors: errors.array() });
        }
        const { name, phone_number } = req.body;
        const customer = await Customer.updateOne({ _id: req.params.customerId }, {
            $set: {
                name,
                phone_number
            }
        }).exec();
        if (!customer) return res.status(400).json({ mesage: 'Not Found' });
        res.status(200).json({
            status: "success",
            data: {
                id: req.params.customerId,
                name: req.body.name,
                phone: req.body.phone,
            },
        });
    } catch (e) {
        res.status(500).json({
            error: err,
        });
    }
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //     return res.status(422).json({ status: "fail", errors: errors.array() });
    // }

    //  Customer.updateOne({ _id: req.params.customerId }, {
    //     $set: {
    //         name: req.body.name,
    //         phone_number: req.body.phone,
    //     }
    // })
    //     .exec()
    //     .then((result) => {
    //         res.status(200).json({
    //             status: "success",
    //             data: {
    //                 id: req.params.customerId,
    //                 name: req.body.name,
    //                 phone: req.body.phone,
    //             },
    //         });
    //     })
    //     .catch((err) => {
    //         res.status(500).json({
    //             error: err,
    //         });
    //     });
};

exports.deleteById = async (req, res) => {
    try {
        const customer = await Customer.findByIdAndDelete(req.params.customerId);
        if (!customer) return res.status(404).json({
            status: "fail",
            message: "Not found"
        })
        res.status(200).json({
            status: "success",
            data: {
                id: customer._id,
                name: customer.name,
                phone: customer.phone_number,
            },
        });
    } catch (e) {
        res.status(500).json({
            status: "fail",
            message: e.message,
        });
    }
    //   try {
    //     Customer.findByIdAndDelete(req.params.customerId, (error, customer) => {
    //       if (error) {
    //         res.status(404).json({
    //           status: "fail",
    //           //message: error.message,
    //         });
    //       } else if (!customer) {
    //         res.status(404).json({
    //           status: "fail",
    //           message: "Not found",
    //         });
    //       } else {
    //         res.status(200).json({
    //           status: "success",
    //           data: {
    //             id: customer._id,
    //             name: customer.name,
    //             phone: customer.phone_number,
    //           },
    //         });
    //       }
    //     });
    //   } catch (error) {
    //     res.status(500).json({
    //       status: "fail",
    //       message: error.message,
    //     });
    //   }
};

exports.getAll = async (req, res) => {
    try {
        let customers = await Customer.find().select("-__v").sort({
            createdAt: -1,
        });
        if (!customers) {
            return next(new Error("Something went wrong"));
        }

        res.status(200).json({
            status: "success",
            result: customers.length,
            data: customers,
        });
    } catch (e) {
        res.status(500).json({
            status: "fail",
            message: e.message,
        });
    }
};
