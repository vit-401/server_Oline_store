import model from "../models/models.js"

class TestController {
    async create(req, res) {
        const {name} = req.body
        const type = await model.Test.create({name})
        return res.json(type)
    }

    async getAll(req, res) {
        const types = await model.Test.findAll()
        return res.json(types)

    }

}

export default new TestController()