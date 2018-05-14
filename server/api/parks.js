const router = require('express').Router()
const {User, Address, Park, Visit} = require('../db/models')
const geolib = require('geolib');
module.exports = router

router.get('/', (req, res, next) => {
  Park.findAll({
      include:[
          {model: Visit, required:false,
            include:[{model:User}]},
            // {model:User, required:false},
        //   {model: Visit, required:false},
          {model: Address, required:false},
      ]
  })
    .then(parks => res.json(parks))
    .catch(next)
})

router.get('/:latitude/:longitude/:distance', (req, res, next) => {
  Park.findAll({
      include: [
          {model: Visit, required:false,
            include:[{model: User}]},
            // {model:User, required:false},
        //   {model: Visit, required:false},
          {model: Address, required:false},
      ]
  })
    .then(parks => {

      const filteredParks = parks.filter(park =>
        geolib.isPointInCircle(
          {latitude: park.address.location.lat, longitude: park.address.location.lng},
          {latitude: req.params.latitude, longitude: req.params.longitude},
          req.params.distance)
      );

      filteredParks.forEach(park => {
        park.address.location.distance = geolib.convertUnit('mi', geolib.getDistanceSimple({
          latitude: park.address.location.lat,
          longitude: park.address.location.lng
        }, {
          latitude: req.params.latitude,
          longitude: req.params.longitude
        }), 2)
      })

      let sortedParks = filteredParks.sort((a, b) => {
        var a = (a.address.location.distance)
        var b = (b.address.location.distance)

        return a - b;
      })

      res.json(sortedParks.slice(0, 20))})
    .catch(next)
})

router.get('/:id', (req, res, next) => {
    Park.findOne({
        where: {
            id:req.params.id,
        },
        include:[
            {model: Visit, required:false},
            {model: Address, required:false},
        ]
    }).then((park) => {res.json(park)});
 })

router.get('/:id/visits', (req, res, next) => {
    Park.findOne({
        where: {
            id:req.params.id,
        },
        include:[
            {model: Visit, required:false,
                include:[{model:User}]
            },
        ]
        }).then((park) => {res.json(park.visits)});
 })
