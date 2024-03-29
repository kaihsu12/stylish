//react
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
//components
import CartItem from '../../components/cartItem/CartItem';
import ShippingAndPayment from '../../components/shippingAndPayment/ShippingAndPayment';
import HeaderDestop from '../../components/headerDestop/HeaderDestop';
//api
import { getCart } from '../../api/cart';
import { getShipping } from '../../api/checkout';
//type
import { CartItemType } from '../../types/type';
import { ShippingType } from '../../types/type';
import { Category } from '../../types/type';
//img
import './CartCheckoutPage.scss';

const CartCheckoutPage: React.FC = () => {
  //header - start
  const [categoryId, setCategoryId] = useState('');
  const [category, setCategory] = useState<Category>([]);

  const categoryIdHandler = (id: string) => {
    setCategoryId(id);
  };

  //header - end

  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState<CartItemType[]>([
    {
      Sku: {
        Product: {
          image: '',
          name: '',
        },
        color: '',
        inventoryQuantity: 1,
        price: 1,
        size: '',
      },
      id: 1,
      quantity: 1,
      skuId: 1,
    },
  ]);

  const [shippingData, setShippingData] = useState<ShippingType[]>([
    {
      country: '',
      fee: '',
      id: 0,
      paymentMethod: '',
      shippingMethod: '',
    },
  ]);

  const [subTotal, setSubTotal] = useState(0);

  // number of ordered Items and items Skus
  const [orderItemsNum, setOrderItemNum] = useState<[]>([]);
  const [skuIds, SetSkuIds] = useState();

  //fee info
  const [shippingFee, setShippingFee] = useState('0');

  // shipping and payment method dropdown
  const [shipping, setShipping] = useState('送貨方式');
  const [payment, setPayment] = useState('付款方式');
  const [location, setLocation] = useState('送貨地點');

  //handle error
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const getCartItemsAsync = async () => {
      try {
        const items = await getCart();
        console.log(items);
        setCartItems(items);
        setOrderItemNum(items?.map((item: CartItemType) => item?.quantity));
        SetSkuIds(items?.map((item: CartItemType) => item?.skuId));
        const total = items?.reduce((acc: number, cur: CartItemType) => {
          return acc + cur.quantity * cur.Sku.price;
        }, 0);

        setSubTotal(total);
      } catch (error) {
        console.log(error);
      }
    };

    const getShippingAsync = async () => {
      try {
        const shipping = await getShipping();
        setShippingData(shipping);
        console.log(shipping);
      } catch (error) {
        console.error('[Get Shipping Data failed]: ', error);
      }
    };

    const fee = shippingData
      ?.filter(
        (option) =>
          option.paymentMethod === payment && option.shippingMethod === shipping
      )
      ?.map((option) => option.fee);

    fee.length !== 0 && setShippingFee(fee[0]);

    getShippingAsync();
    getCartItemsAsync();
  }, [shipping, payment]);

  return (
    <div className='cart-checkout-page-container'>
      <HeaderDestop setMenuId={categoryIdHandler} categoryAll={category} />
      <div className='checkout-main'>
        <div className='item-in-cart'>
          <div className='cart-title'>購物車</div>
          <div className='list-titles'>
            <div className='title-sec1'>
              <div>商品資料</div>
              <div>商品名稱</div>
              <div>尺寸</div>
              <div>價格</div>
            </div>
            <div className='title-sec2'>數量</div>
            <div className='title-sec3'>小計</div>
          </div>
          <div className='cart-list'>
            {cartItems.map((item, i) => (
              <CartItem
                key={item.skuId}
                item={item}
                setSubTotal={setSubTotal}
                index={i}
                setOrderItemNum={setOrderItemNum}
              />
            ))}
          </div>
        </div>
        <div className='checkout-lower-sec'>
          <ShippingAndPayment
            shippingData={shippingData}
            shipping={shipping}
            setShipping={(method) => setShipping(method)}
            payment={payment}
            setPayment={(method) => setPayment(method)}
            location={location}
            setLocation={setLocation}
          />
          <div className='order-sum'>
            <div className='sum-title'>訂單資訊</div>
            <div className='sum-detail'>
              <div className='sub-total'>
                <span>小計</span>
                <span>NT${subTotal}</span>
              </div>
              <div className='shipping-fee'>
                <span>運費</span>
                <span>NT${shippingFee}</span>
              </div>
              <div className='checkout-forward'>
                <div className='sum-total'>
                  <span>合計</span>
                  <span>NT{subTotal + Number(shippingFee)}</span>
                </div>
                <button
                  onClick={() => {
                    if (
                      shipping !== '送貨方式' &&
                      payment !== '付款方式' &&
                      location !== '送貨地點'
                    ) {
                      setHasError(false);
                      navigate('/info-checkout', {
                        state: {
                          total: subTotal + Number(shippingFee),
                          shippingFee: shippingFee,
                          shippingMethod: shipping,
                          paymentMethod: payment,
                          orderNumbers: orderItemsNum,
                          skuIds: skuIds,
                          shippingId: shippingData?.filter(
                            (item) =>
                              item.paymentMethod === payment &&
                              item.shippingMethod === shipping
                          ),
                        },
                      });
                    } else {
                      setHasError(true);
                    }
                  }}
                >
                  前往結賬
                </button>
              </div>
            </div>
          </div>
        </div>
        {hasError && (
          <div className='forward-error'>請先選擇送貨地點及運送、付款方式</div>
        )}
      </div>
    </div>
  );
};

export default CartCheckoutPage;
