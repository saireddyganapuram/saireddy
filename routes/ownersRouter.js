const express = require("express")
const ownerModel = require("../models/owner-model")
const isLoggedIn = require("../middlewares/isLoggedIn")
const bcrypt = require("bcrypt")
const router = express.Router()


if(process.env.NODE_ENV === "development") {
    router.post("/create", async function(req,res) {
        let owners = await ownerModel.find()
        if(owners.length > 0) {
            return res
                .status(504)
                .send("you dont have permission to create owner")
        }

        let{fullname,password,email} = req.body


        bcrypt.genSalt(10,function(err,salt) {
            bcrypt.hash(password,salt,async function(err,hash) {
                if(err) res.send(err.message)
                else {
                    let createdOwner = await ownerModel.create({
                       email,
                       fullname,
                        password: hash
                    })
                    res.send(createdOwner)
                }
            })
        })
    }) 
}

router.get("/createproducts", function(req,res) {
    let success = req.flash("success")
    res.render("createproducts" ,{success})
})

router.get("/admin", function(req,res) {
    res.render("admin")
})

router.get("/login", function(req,res) {
    res.render("owner-login",{loggedin: false})
})

router.post("/login", async function(req,res) {
    let {email,password} = req.body
    let owner = await ownerModel.findOne({email})
    if(!owner) return res.redirect("/owners/login")
        bcrypt.compare(password, owner.password, async function(err, result) {
            if (err) {
                console.error("Error comparing password:", err)
                return res.redirect("/owners/login")
            }
            if (result) {
                return res.redirect("/owners/admin")
            } else {
                return res.redirect("/owners/login")
            } 
        })
})

module.exports = router;