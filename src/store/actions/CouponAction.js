import {REMOVE_APPLY_COUPON, REMOVE_COUPON, EMPTY_COUPON} from '../actions/type'

export const removeApplyCoupon = coupon => {
  return { type: REMOVE_APPLY_COUPON, coupon: coupon };
}; 

export const removeCoupon = coupon_id => {
  return { type: REMOVE_COUPON, coupon_id: coupon_id };
}; 

export const emptyCoupon = () => {
  return { type: EMPTY_COUPON, coupon_id: '' };
}; 