import { Router } from "express";
import { ProductManager, Product } from '../ProductManager.js'
import { randomUUID } from 'crypto'

export const productsRouter = Router()

const productsManager = new ProductManager('./database/productos.json')
/* ---------------------------------------------------- PRODUCTOS ------------------------------------------------------------------- */
/* Metodo para adquirir todos o un limite definido de productos */
productsRouter.get('/', async (req, res) => {
  const limite = parseInt(req.query.limit)
  let products = null
  if (Number.isNaN(limite)) {
    products = await productsManager.getProducts()
    res.json({ status: "success - Mostrando todos los productos", payload: products })
  } else {
    products = await productsManager.getProductsLimited(limite)
    res.json({ status: "success - Mostrando " + limite + " productos", payload: products })
  }
})

/* Metodo para adquirir un producto especifico */
productsRouter.get('/:pid', async (req, res) => {
  const product = await productsManager.getProductById(req.params.pid)
  product ?
    res.json(product)
    : res.status(400).json({ "message": "No se encontro el producto con el id " + req.params.pid })
})

/* Metodo para ingresar un nuevo producto a la database */
productsRouter.post('/', async (req, res) => {
  const product = new Product({ id: randomUUID(), ...req.body })
  let prod
  Object.keys(product).length > 0 ?
    (
      prod = await productsManager.addProduct(product),
      res.json(product)
    )
    : res.status(400).json({ "message": "No logro crear el producto, revisar que cumpla con todos los campos " })
})

/* Metodo para modificar las propiedades de un producto exeptuando su id */
productsRouter.put('/:pid', async (req, res) => {
  const product = await productsManager.updateProduct(req.params.pid, req.body)
  res.json(product)
})

/* Metodo para eliminar un producto de la base de datos */
productsRouter.delete('/:pid', async (req, res) => {
  const product = await productsManager.deleteProduct(req.params.pid)
  product ?
    (
      res.json({ "message": "Producto con el id " + req.params.pid + " eliminado con exito" })
    )
    : res.status(400).json({ "message": "No se encontro el producto con el id " + req.params.pid })
})