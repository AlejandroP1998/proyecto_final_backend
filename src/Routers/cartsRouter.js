import { Router } from "express"
import { Cart, CartManager } from '../CartManager.js'
import { randomUUID } from 'crypto'
import { ProductManager } from "../ProductManager.js"

export const cartsRouter = Router()

const cartsManager = new CartManager('./database/carrito.json')
const productsManager = new ProductManager('./database/productos.json')

/* ---------------------------------------------------- CARRITO ------------------------------------------------------------------- */
/* Metodo para crear carritos */
cartsRouter.post('/', async (req, res) => {
  const cart = new Cart({ id: randomUUID(), ...req.body })
  Object.keys(cart).length > 0 ?
    (
      await cartsManager.addCart(cart),
      res.json(cart)
    )
    : res.json({ "message": "No se creo el carrito" })
})

/* Metodo para ver los productos dentro de un carrito en especifico */
cartsRouter.get('/:cid', async (req, res) => {
  const products = await cartsManager.getProductsInCart(req.params.cid)
  res.json(products)
})

/* Metodo para agregar productos a un carrito especifico */
cartsRouter.post('/:cid/products/:pid', async (req, res) => {
  const product = await productsManager.getProductById(req.params.pid)
  const cart = await cartsManager.pushProduct(req.params.cid, product.id)
  res.json(cart)
})