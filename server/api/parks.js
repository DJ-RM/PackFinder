const router = require('express').Router()
const {User, Address, Park, Visit} = require('../db/models')
module.exports = router

router.get('/', (req, res, next) => {
  Park.findAll({
      include:[
          {model: User, required:false},
        //   {model: Visit, required:false},
          {model: Address, required:false},
      ]
  })
    .then(parks => res.json(parks))
    .catch(next)
})
