const userModel = require("../models/userModel");
const validator = require("validator");
const jwt = require("jsonwebtoken");


function validateName($name) {
    var nameReg = /^[A-Za-z ]*$/;
    if (!nameReg.test($name)) {
        return false;
    } else {
        return true;
    }
};



function ConversionToProperName(name) {

    let name2 = name.toLowerCase().split(" ");
    return name2.map((x) => { return x[0].toUpperCase() + x.substring(1) }).join(" ");

}


function validateMobile($mobile) {
    var mobileReg = /^([0|\+[0-9]{1,5})?([7-9][0-9]{9})$/;
    if (!mobileReg.test($mobile)) {
        return false;
    } else {
        return true;
    }
}


function checkPassword(str) {
    var re = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,15}$/;
    return re.test(str);
}


const createUser = async function (req, res) {
    try {
        if (Object.keys(req.body).length == 0) return res.status(400).send({ status: false, msg: "Request Body Cant Be Empty" });
        let user = req.body;
        if (!user.title) return res.status(400).send({ status: false, msg: "Please Enter Title,Title Is A Mandatory Field" });
        if (typeof user.title !== "string") return res.status(400).send({ status: false, msg: "Please Enter A Valid Title Field" });
        if (user.title !== "Mr" && user.title !== "Mrs" && user.title !== "Miss") return res.status(400).send({ status: false, msg: "Please Enter A Valid Title Field" });
        if (!user.name) return res.status(400).send({ status: false, msg: "Please Enter Name,Name Is A Mandatory Field" });
        if (!validateName(user.name)) return res.status(400).send({ status: false, msg: "Please Enter A Valid Name" });
        user.name = user.name.toLowerCase()
        user.name = ConversionToProperName(user.name);
        if (!user.phone) return res.status(400).send({ status: false, msg: "Please Enter Phone,Phone Is A Mandatory Field" });
        if (user.phone.length > 10) return res.status(400).send({ status: false, msg: "Please Enter A Valid Phone Number" });
        if (!validateMobile(user.phone)) return res.status(400).send({ status: false, msg: "Please Enter A Valid Phone Number" });
        if (!user.email) return res.status(400).send({ status: false, msg: "Please Enter Email,Email Is A Mandatory Field" });
        if (!validator.isEmail(user.email)) return res.status(400).send({ status: false, msg: "Please Enter A Valid Email" });

        let uniquePhoneEmail = await userModel.findOne({ $or: [{ email: user.email }, { phone: user.phone }] });
        if (uniquePhoneEmail) {
            if (uniquePhoneEmail.email === user.email) return res.status(400).send({ status: false, msg: "EmailId Already Exists,Please Input Another EmailId" });
            else { return res.status(400).send({ status: false, msg: "Mobile Number Already Exists,Please Input Another Mobile Number" }) }
        };

        if (!user.password) return res.status(400).send({ status: false, msg: "Please Enter Password,Password Is A Mandatory Field" });
        if (!checkPassword(user.password)) return res.status(400).send({ status: false, msg: "Please Enter A Valid Password,Password Length Should Be Minimum 8 And Maximum 15" });

        if (user.address) {
            if ((typeof user.address.street !== "string" && typeof user.address.street !== "undefined") || (typeof user.address.city !== "string" && typeof user.address.city !== "undefined") || (typeof user.address.pincode !== "string" && typeof user.address.pincode !== "undefined")) return res.status(400).send({ status: false, msg: "Invalid Address" });

            let savedUser = await userModel.create(user);
            return res.status(201).send({ status: true, message: "User Created Successfully", data: savedUser })
        }
        else {
            let savedUser = await userModel.create(user);
            return res.status(201).send({ status: true, message: "User Created Successfully", data: savedUser })
        }
    }
    catch (error) {
        return res.status(500).send({ status: false, msg: error.message })
    }
}



const userLogin = async function (req, res) {
    try {
        if (Object.keys(req.body).length == 0) return res.status(400).send({ status: false, msg: "Request Body Cant Be Empty" });
        let user = req.body;
        if (!user.email) return res.status(400).send({ status: false, msg: "Please Enter Your Email" });
        if (!user.password) return res.status(400).send({ status: false, msg: "Please Enter Your Password" });

        let loggedInUser = await userModel.findOne({ email: user.email, password: user.password });
        if (!loggedInUser) return res.status(404).send({ status: false, msg: "No user Found With The Input Credentials,Please Confirm The Credentials" });

        let token = jwt.sign({ userId: loggedInUser._id }, "veryverysecuresecretkey", { expiresIn: '1h' });
        return res.status(200).send({ status: true, message: "Success", data: token })
    }
    catch (error) {
        return res.status(500).send({ status: false, msg: error.message })
    }

}









module.exports.createUser = createUser;
module.exports.userLogin = userLogin;