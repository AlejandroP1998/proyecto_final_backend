import fs from 'fs/promises'

//Con esta variable valido que el archivo no se cargue con cada llamada al metodo que lo carga
let loadSuccess = true

export class Cart {
  constructor({ id, products }) {
    const map = new Map([[id], [products]])
    if (map.has("") || map.has(0)) {
      throw ("No llenaste un campo obligatorio, creación de producto fallida");
    } else {
      this.id = id
      this.products = products
    }
  }
}

export class CartManager {
  #path
  #carts
  constructor(path) {
    this.#path = path
    this.#carts = []
  }

  async #cargar() {
    let file, cart = null
    try {
      if (loadSuccess) {
        file = await fs.readFile(this.#path, 'utf-8')
        cart = await JSON.parse(file)
        cart.forEach(element => {
          this.#carts.push(element)
        })
        loadSuccess = false
        return
      } else return
    } catch (error) {
      throw ('No se pudo cargar el archivo' + error)
    }
  }

  async addCart(cart) {
    await this.#cargar()
    let json = null;
    if (Object.entries(cart).length === 0) {
      throw ('No se añadio el carrito, verificar propiedades\n\n');
    } else {
      this.#carts.push(cart)
      json = JSON.stringify(this.#carts, null, 4)
      await fs.writeFile(this.#path, json)
    }
  }

  async getProductsInCart(id) {
    await this.#cargar()
    const cart = this.#carts.find((cart) => cart.id = id)
    return cart.products
  }

  async pushProduct(id, product) {
    await this.#cargar()
    let json = null
    const i = this.#carts.findIndex((cart) => cart.id === id)
    let isInCart = this.#carts[i].products.some((prod) => prod.id === product.id)
    if (isInCart) {
      const j = this.#carts[i].products.findIndex((prod) => prod.id === product.id)
      this.#carts[i].products[j].quantity += parseInt(1)
      json = JSON.stringify(this.#carts, null, 4)
      await fs.writeFile(this.#path, json)
      return this.#carts[i].products[j]
    } else {
      product.quantity = 1
      this.#carts[i].products.push(product)
      json = JSON.stringify(this.#carts, null, 4)
      await fs.writeFile(this.#path, json)
      return this.#carts[i].products
    }
    
    
  }

}