const {buildSchema} = require("graphql")

//Types
const ProductoType = require("./types/Products.types.js")
const CarritoType = require("./types/Cart.type.js")

//Inputs
const ProductoNewInput = require("./inputs/NewProduct.input.js")
const ProductoUpdateInput = require("./inputs/UpdateProduct.input.js")

//Queries
const GetAllCarritosQuery = require("./queries/GetAllCarts.query.js")
const GetAllProductosQuery = require("./queries/GetAllProducts.query.js")
const GetAllProductsFromCartByIdQuery = require("./queries/GetAllProductsFromCart.query.js")
const GetProductByIdQuery = require("./queries/GetProductById.query.js")

//mutations
const CreateCarritoMutation = require("./mutations/CreateCart.mutation.js")
const DeleteCarritoByIdMutation = require("./mutations/DeleteCart.mutation.js")
const SaveProductToCartMutation = require("./mutations/SaveProductToCart.mutation.js")
const DeleteProductFromCartMutation = require("./mutations/DeleteProductFromCart.mutation.js")
const CreateProductoMutation = require("./mutations/CreateProduct.mutation.js")
const UpdateProductByIdMutation = require("./mutations/UpdateProduct.mutation.js")
const DeleteProductByIdMutation = require("./mutations/DeleteProduct.mutation.js")

const schema = buildSchema(`
  ${ProductoType}
  ${ProductoNewInput}
  ${CarritoType}
  ${ProductoUpdateInput}
  
  type Query {
    ${GetAllCarritosQuery}
    ${GetProductByIdQuery}
    ${GetAllProductosQuery}
    ${GetAllProductsFromCartByIdQuery}  
  }
  
  type Mutation {
    ${DeleteCarritoByIdMutation}
    ${CreateCarritoMutation}
    ${SaveProductToCartMutation}
    ${DeleteProductFromCartMutation}
    ${CreateProductoMutation}
    ${UpdateProductByIdMutation}
    ${DeleteProductByIdMutation}
  }
`)

module.exports = schema