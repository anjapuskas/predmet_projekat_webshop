export class Order {
    constructor(order) {
        this.id = order.id;
        this.address = order.address;
        this.created = order.created;
        this.deliveryTime = order.deliveryTime;
        this.orderStatus = order.orderStatus;
        this.price = order.price;
        this.approved = order.approved;
    }
}
export default Order;