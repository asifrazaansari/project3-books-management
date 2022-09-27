const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const { stringChecking, ConversionToProperName, validateMobile, validateName, isvalidEmail, checkPassword } = require("../validators/validator");


const createUser = async function (req, res) {
    try {
        const user = req.body;

        if (Object.keys(user).length === 0) return res.status(400).send({ status: false, message: "enter a field to create user" });

        const { title, name, phone, email, password, address } = user

        if (!stringChecking(title)) return res.status(400).send({ status: false, message: "title must be present in non empty string" });

        if (title !== "Mr" && title !== "Mrs" && title !== "Miss") return res.status(400).send({ status: false, message: "title should be Mr, Mrs and Miss only" });

        if (!stringChecking(name)) return res.status(400).send({ status: false, message: "name must be present in non empty string" });
        if (!validateName(name)) return res.status(400).send({ status: false, message: "name must be present and a valid" });
        user.name = ConversionToProperName(user.name);

        if (!validateMobile(phone)) return res.status(400).send({ status: false, message: "phone number must be present and valid Indian number" });

        if (!isvalidEmail.test(email)) return res.status(400).send({ status: false, message: "email must be present and valid" });

        const uniquePhoneEmail = await userModel.findOne({ $or: [{ email: email }, { phone: phone }] });
        if (uniquePhoneEmail) {
            if (uniquePhoneEmail.phone === phone) return res.status(400).send({ status: false, message: "Phone Already Exists, Please Input Another Phone Number" });
            else { return res.status(400).send({ status: false, message: "Email Already Exists, Please Input Another EmailId" }) }
        };

        if (!checkPassword(password)) return res.status(400).send({ status: false, message: "password must be present and its length be min 8 and max 15 with mixed type" });
        if (address) {
            if (typeof address !== "object") return res.status(400).send({ status: false, message: "address should be an object" });
            if (address.street) {
                if (!stringChecking(address.street)) return res.status(400).send({ status: false, message: "street must be present in non empty string" });
            }
            if (address.city) {
                if (!stringChecking(address.city)) return res.status(400).send({ status: false, message: "city must be present in non empty string" });
            }
            if (address.pincode) {
                if (typeof address.pincode !== "string" || !/^[1-9][0-9]{5}$/.test(address.pincode)) {
                    return res.status(400).send({ status: false, message: "pincode must be present in non empty string of numbers and should have 6 digits" })
                }
            }
        }
        const savedUser = await userModel.create(user);
        return res.status(201).send({ status: true, message: "User Created Successfully", data: savedUser })
    }

    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}



const userLogin = async function (req, res) {
    try {
        const user = req.body;
        if (Object.keys(user).length === 0) return res.status(400).send({ status: false, message: "enter a field to login" });

        const { email, password } = user

        if (!isvalidEmail.test(email)) return res.status(400).send({ status: false, message: "email must be present and valid" });
        if (!password) return res.status(400).send({ status: false, message: "Please Enter Your Password" });

        const loggedInUser = await userModel.findOne({ email: email, password: password });
        if (!loggedInUser) return res.status(404).send({ status: false, message: "No user Found With The Input Credentials,Please Confirm The Credentials" });

        const token = jwt.sign({ userId: loggedInUser._id }, "veryverysecuresecretkey", { expiresIn: '1h' });
        return res.status(200).send({ status: true, message: "Success", data: token })
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }

}



module.exports = { createUser, userLogin }