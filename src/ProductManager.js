import fs from 'fs/promises'

//Con esta variable valido que el archivo no se cargue con cada llamada al metodo que lo carga
let loadSuccess = true

//Objeto Product
export class Product {
    constructor({ id, title, description, code, price, status, stock, category, thumbnails }) {
        const map = new Map([[id], [title], [description], [code], [price], [status], [stock], [category]])
        if (map.has("") || map.has(0) || map.has(undefined)) {
        } else {
            this.id = id
            this.title = title
            this.description = description
            this.code = code
            this.price = price
            this.status = status
            this.stock = stock
            this.category = category
            if (thumbnails) {
                this.thumbnails = thumbnails
            }
        }
    }
}

//Clase principal
export class ProductManager {

    #path
    #products

    constructor(path) {
        this.#path = path
        this.#products = []
    }

    async #cargar() {
        let file, prod = null
        try {
            if (loadSuccess) {
                file = await fs.readFile(this.#path, 'utf-8')
                prod = await JSON.parse(file)
                prod.forEach(element => {
                    this.#products.push(element)
                })
                loadSuccess = false
                return
            } else return
        } catch (error) {
            throw new Error("No se logro cargar el archivo")
        }
    }

    async getProducts() {
        await this.#cargar()
        return this.#products
    }

    async getProductsLimited(limit) {
        await this.#cargar()
        const prodsLimited = []

        for (let i = 0; i < limit; i++) {
            if (i < this.#products.length) prodsLimited.push(this.#products[i])
        }
        return prodsLimited
    }

    async addProduct(product) {
        await this.#cargar()
        let json = null;
        if (Object.entries(product).length === 0) {
            return null
        } else {
            const codeRepeated = this.#products.some((prod) => prod.code === product.code)
            if (codeRepeated) {
                throw new Error("No se puede crear un producto con el mismo codigo que otro")
            } else {
                this.#products.push(product)
                json = JSON.stringify(this.#products, null, 4)
                await fs.writeFile(this.#path, json)
                return product
            }
        }
    }

    async getProductById(id) {
        await this.#cargar()
        const idFinded = this.#products.find((prod) => prod.id === id)
        if(idFinded) {
            const product = this.#products.find((prod) => prod.id === id)
            return product
        } else {
            return null
        }

    }

    async updateProduct(id, newProduct) {
        await this.#cargar()
        const idFinded = this.#products.some((prod) => prod.id === id)
        if (idFinded) {
            const i = this.#products.findIndex((prod) => prod.id === id)
            const product = this.#products.find((prod) => prod.id === id)
            for (const property in product) {
                for (const prop in newProduct) {
                    if (property === prop && property != 'id') {
                        this.#products[i][property] = newProduct[prop]
                    }
                }
            }
            const json = JSON.stringify(this.#products, null, 4)
            await fs.writeFile(this.#path, json)
            return this.#products[i]
        } else return null

    }


    async deleteProduct(id) {
        await this.#cargar()
        const idFinded = this.#products.some((prod) => prod.id === id)
        if (idFinded) {
            const i = this.#products.findIndex((prod) => prod.id === id)
            this.#products.splice(i, 1)
            const json = JSON.stringify(this.#products, null, 4)
            await fs.writeFile(this.#path, json)
            return this.#products
        } else return null
    }

}