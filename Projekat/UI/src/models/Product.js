export class Product {
    constructor(product) {
        this.id = product.id
        this.name = product.name;
        this.description = product.description;
        this.amount = product.amount;
        this.price = product.price;
        this.picture = product.picture
        this.sellerId = product.sellerId
    }
}
export default Product;