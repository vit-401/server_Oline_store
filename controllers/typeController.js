import model from "../models/models.js"

class TypeController {
    async create(req, res) {
        const {name} = req.body
        const type = await model.Type.create({name})
        return res.json(type)
    }

    async getAll(req, res) {
        const types = await model.Type.findAll()
        return res.json(types)

    }

    async getOne(req, res) {
        console.log()
        const type = await model.Type.findAll({where:{id:req.params.id}})
        return res.json(type)
    }
}

export default new TypeController()