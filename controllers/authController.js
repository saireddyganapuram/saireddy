const userModel = require('../models/user-model')
const { generateToken } = require("../utils/generateToken")
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken")
const productModel = require("../models/product-model")


module.exports.registerUser  = async function(req,res) {
    try {
        let {fullname,email,password} = req.body

        let user = await userModel.findOne({email})
        if(user) return res.status(401).send("You already have an account, please login")

        bcrypt.genSalt(10,function(err,salt) {
            bcrypt.hash(password,salt,async function(err,hash) {
                if(err) res.send(err.message)
                else {
                    let user = await userModel.create({
                        email,
                        fullname,
                        password: hash
                    })
                    let token = generateToken(user)
                    res.cookie("token", token)
                    res.render("shop",{"products":0})
                }
            })
        })
    } catch(err) {
        res.send(err.message)
    }

}

module.exports.loginUser = async function(req, res) {
    try {
        const { email, password } = req.body
        const user = await userModel.findOne({ email })
        if (!user) {
            req.flash("error", "Email or Password incorrect")
            return res.redirect("/")
        }
        bcrypt.compare(password, user.password, async function(err, result) {
            if (err) {
                console.error("Error comparing password:", err)
                req.flash("error", "Something went wrong")
                return res.redirect("/login")
            }
            if (result) {
                const token = generateToken(user)
                res.cookie("token", token)
                const products = await productModel.find()
                return res.render("shop", { products })
            } else {
                req.flash("error", "Email or Password incorrect")
                return res.redirect("/")
            } 
        })
        
    } catch (err) {
        console.error("Error:", err.message)
        req.flash("error", err.message)
        return res.redirect("/login")
    }
}


module.exports.logout = function(req,res) {
    res.cookie("token", "")
    res.redirect("/")
}