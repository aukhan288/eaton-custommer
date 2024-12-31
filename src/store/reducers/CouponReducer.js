import {REMOVE_APPLY_COUPON, REMOVE_COUPON, EMPTY_COUPON} from '../actions/type';
const initialState = {
  appliedCoupon: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case REMOVE_APPLY_COUPON:
      if (state.appliedCoupon.length) {
        state.appliedCoupon = [];
      }
      return {
        ...state,
        appliedCoupon: state.appliedCoupon.concat({
          coupon_id: action.coupon.coupon_id,
          coupon_img: action.coupon.coupon_img,
          coupon_code: action.coupon.coupon_code,
          coupon_title: action.coupon.coupon_title,
          min_amt: action.coupon.min_amt,
          coupon_value: action.coupon.coupon_value,
        }),
      };
    case REMOVE_COUPON:
      return {
        ...state,
        appliedCoupon: [],
      };
    case EMPTY_COUPON:
      return {
        ...state,
        appliedCoupon: [],
      };
    default:
      return state;
  }
};
