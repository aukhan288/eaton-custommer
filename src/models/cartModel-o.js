class CartModel {
  constructor(
    quantity,
    productPrice,
    productVariation,
    sum,
    product_name,
    product_img,
    discount,
    popular,
    productTypePriceId,
  ) {
    this.quantity = quantity;
    this.productPrice = productPrice;
    this.productVariation = productVariation;
    this.sum = sum;
    this.product_name = product_name;
    this.product_img = product_img;
    this.discount = discount;
    this.popular = popular;
    this.productTypePriceId = productTypePriceId;
  }
}

export default CartModel;
