import express from 'express'
import { ProductManager } from './ProductManager.js'
import { Product } from './ProductManager.js'
import { randomUUID } from 'crypto'
import { Cart, CartManager } from './CartManager.js'

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
const productsManager = new ProductManager('./database/productos.json')
const cartsManager = new CartManager('./database/carrito.json')

/* ---------------------------------------------------- PRODUCTOS ------------------------------------------------------------------- */
/* Metodo para adquirir todos o un limite definido de productos */
app.get('/api/products', async (req, res) => {
  const limite = parseInt(req.query.limit)
  let products = null
  if (Number.isNaN(limite)) {
    products = await productsManager.getProducts()
    res.json(products)
  } else {
    products = await productsManager.getProductsLimited(limite)
    res.json(products)
  }
})

/* Metodo para adquirir un producto especifico */
app.get('/api/products/:pid', async (req, res) => {
  const id = req.params.pid
  const product = await productsManager.getProductById(id)
  res.json(product)
})

/* Metodo para ingresar un nuevo producto a la database */
app.post('/api/products/', async (req, res) => {

  const product = new Product({ id: randomUUID(), ...req.body })
  await productsManager.addProduct(product)
  res.json(product)
})

/* Metodo para modificar las propiedades de un producto exeptuando su id */
app.put('/api/products/:pid', async (req, res) => {
  const product = await productsManager.updateProduct(req.params.pid, req.body)
  res.json(product)
})

/* Metodo para eliminar un producto de la base de datos */
app.delete('/api/products/:pid', async (req, res) => {
  const eliminar = await productsManager.deleteProduct(req.params.pid)
  res.json(eliminar)
})

/* ---------------------------------------------------- CARRITO ------------------------------------------------------------------- */
/* Metodo para crear carritos */
app.post('/api/carts/', async (req, res) => {
  const cart = new Cart({ id: randomUUID(), ...req.body })
  await cartsManager.addCart(cart)
  res.json(cart)
})

/* Metodo para ver los productos dentro de un carrito en especifico */
app.get('/api/carts/:cid', async (req, res) => {
  const products = await cartsManager.getProductsInCart(req.params.cid)
  res.json(products)
})

/* Metodo para agregar productos a un carrito especifico */
app.post('/api/carts/:cid/products/:pid', async (req, res) => {
  const product = await productsManager.getProductById(req.params.pid)
  const cart = await cartsManager.pushProduct(req.params.cid,product)
  res.json(cart)
})

const server = app.listen(8080)

