const URL = "http://localhost:80"
const request = require("supertest")(URL)
const expect = require("chai").expect

const id = "631fc1462d652a77a42ab688" // ID del producto Jack Daniels
const url = "/products" // URL correcta
const incorrectURL = "/productsasdasdasdasd" // URL incorrecta
const urlId = `/products/${id}` // URL correcta de producto Jack Daniels
const urlIdnonExistence = `/products/100` // URL de producto inexistente

const product = {
    _id: "631fc1462d652a77a42ab688",
    title: "Jack Daniels",
    price: 5000,
    stock: 30,
    image: "https://bngbebidas.com/wp-content/uploads/2019/12/JACK-DANIELS-700-ML-020100001.png"
}

const editedProduct = {
    title: "Jack Daniels 2",
    price: 10000,
    stock: 10,
    image: "https://bngbebidas.com/wp-content/uploads/2019/12/JACK-DANIELS-700-ML-020100001.png"
}

const newProduct = {
    title: "Cerveza Patagonia Amber Lager",
    price: 2000,
    stock: 10,
    image: "https://http2.mlstatic.com/D_NQ_NP_875823-MLA44839770142_022021-O.webp"
}

describe("Test API REST", () => {
    describe(`[TEST 1] URL /products incorrecta ${URL}${incorrectURL} (GET)`, () => {
        it("Should return status 404.", async () => {
            const response = await request.get(incorrectURL)
            console.log("Response: ", response.body)
            console.log("Response Status: ", response.status)
            expect(response.status).to.eql(404)
        })
    })

    describe(`[TEST 2] URL /products correcta ${url} (GET)`, () => {
        it(`Should return status 200`, async () => {
            const response = await request.get(url)
            console.log("Response: ", response.body)
            console.log("Response Status: ", response.status)
            expect(response.status).to.eql(200)
        })
    })

    describe(`[TEST 3] URL correcta /products/:id ${urlId} (GET)`, () => {
        it("Should return status 200", async () => {
            const response = await request.get(urlId)
            console.log("Response: ", response.body)
            console.log("Response Status: ", response.status)
            expect(response.status).to.eql(200)
            const producto = response.body
            console.log(producto)
        })
    })

    describe(`[TEST 4] URL incorrecta /products/:id ${URL}${urlIdnonExistence} (GET)`, () => {
        it("Should return 404", async () => {
            const response = await request.get(`${URL}${urlIdnonExistence}`)
            console.log("Response: ", response.body)
            console.log("Response Status: ", response.status)
            expect(response.status).to.eql(404)
        })
    })

    describe(`[TEST 5] URL correcta /products agregar producto ${url} (POST)`, () => {
        it("Should add a product", async () => {
            const response = await request
                .post(url)
                .set("admin", "true")
                .send(newProduct)
            console.log("Response: ", response.body)
            console.log("Response Status: ", response.status)
            expect(response.status).to.eql(200)
        })
    })

    describe(`[TEST 6] URL correcta /products agregar producto vacio ${URL}${url} (POST)`, () => {
        it("Should not add an empty product.", async () => {
            const response = await request.post(`${URL}${url}`).set("admin", "true").send({})
            console.log("Response: ", response.body)
            console.log("Response Status: ", response.status)
            expect(response.status).to.eql(404)
        })
    })

    describe(`[TEST 7] URL correcta /products/:id ${url}/${product._id} (PUT)`, () => {
        it("Modify product by id", async () => {
            const response = await request
                .put(url + `/${product._id}`)
                .set("admin", "true")
                .send(editedProduct)
            console.log("Response: ", response.body)
            console.log("Response Status: ", response.status)
            expect(response.status).to.eql(200)
        })
    })

    describe(`[TEST 8] URL correcta /products/:id ${urlId} (DELETE)`, () => {
        it("Should delete product by id)", async () => {
            const response = await request.delete(urlId).set("admin", "true").send()
            console.log("Response: ", response.body)
            console.log("Response Status: ", response.status)
            expect(response.status).to.eql(200)
        })
    })

    describe(`[TEST 9] URL incorrecta /products/:id producto inexistente ${URL}${urlIdnonExistence} (PUT)`, () => {
        it("Should not update anything, and return status 404", async () => {
            const response = await request.put(`${URL}${urlIdnonExistence}`).send(product)
            console.log("Response: ", response.body)
            console.log("Response Status: ", response.status)
            expect(response.status).to.eql(404)
        })
    })

    describe(`[TEST 10] URL incorrecta /products/:id producto inexistente ${URL}${urlIdnonExistence} (DELETE)`, () => {
        it("Should not delete anything, and return status 404", async () => {
            const response = await request.delete(`${URL}${urlIdnonExistence}`).send()
            console.log("Response: ", response.body)
            console.log("Response Status: ", response.status)
            expect(response.status).to.eql(404)
        })
    })
})