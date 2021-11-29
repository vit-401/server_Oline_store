import model from "../models/models.js"

class BrandController {
    async create(req, res) {
        const {name} = req.body
        const brand = await model.Brand.create({name})
        res.json(brand)
    }

    async getAll(req, res) {
        const brands = await model.Brand.findAll()
        return res.json(brands)
    }

    async getOne(req, res) {
        const {id} = req.params
        const brands = await model.Brand.findOne({where: {id}})
        return res.json(brands)
    }
}

export default new BrandController()