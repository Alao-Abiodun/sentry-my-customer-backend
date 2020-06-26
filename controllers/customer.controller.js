const Customer = require("../models/customer");

exports.create = async (req, res) => {// Validate request
    if (!req.body) {
        return res.status(400).send({
            status: "fail",
            message: "Transaction content can not be empty"
        });
    }

    const { name, phone_number } = req.body;

    const customer = new Customer({
        name,
        phone_number
    });

    await customer.save();

    res.status(200).json({
        status: 'success',
        data: {
            id: customer_id,
            name: customer.name,
            phone: customer.phone
        }
    })
}

exports.getById = async (req, res) => {
    try {
        const id = req.params.customerId
        const customer = await Customer.findById(id);
        if (!customer) return res.status(404).json({ status: 'fail' })
        res.status(200).json({
            status: 'success',
            data: {
                id: customer_id,
                name: customer.name,
                phone: customer.phone_number
            }
        })
    } catch (e) {
        res.status(401).send(e);
    }
}

exports.updateById = async (req, res) => {
    try {
        const customer = await Customer.findByIdAndUpdate(req.params.customerId, req.body, { new: true, runValidators: true });
        if (!customer) return res.status(404).send({ status: 'fail' })
        res.status(200).json({
            status: 'success',
            data: {
                id: customer._id,
                name: customer.name,
                phone: customer.phone_number
            }
        })
    } catch (e) {
        res.status(401).send(e);
    }
}

exports.deleteById = async (req, res) => {
    try {
        const customer = await Customer.findByIdAndDelete(req.params.customerId);
        if (!customer) return res.status(404).json({ status: 'fail', message: 'Not found' });
        res.status(200).json({
            status: 'success',
            data: {
                id: customer._id,
                name: customer.name,
                phone: customer.phone_number
            }
        })
    } catch (e) {
        res.status(401).send(e);
    }
}

exports.getAll = async (req, res) => {
    try {
        const customers = await Customer.find({}).select('-__v').sort({ createdAt: -1 });
        if (!customers) return next(new Error('Something went wrong'));
        res.status(200).json({
            status: 'success',
            result: customers.length,
            data: customers
        })
    } catch (e) {
        res.status(500).json({
            status: 'fail',
            message: e.message
        })
    }
};

