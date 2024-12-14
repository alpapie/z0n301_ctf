const { where } = require('sequelize')

const User = require('../models').User

let get_users=async (req,res)=>{
    let blue_teams= await User.findAll(
        {
            order:[['point','DESC']],
            where:{team:"BLUE_TEAM"},
        }
    ).then(users => { return users})
    let red_teams= await User.findAll(
        {
            order:[['point','DESC']],
            where:{team:"RED_TEAM"}
        },
        
    ).then(users => { return users})
    return res.status(200).json({
        blue_teams,red_teams
    })
}

module.exports = { get_users }