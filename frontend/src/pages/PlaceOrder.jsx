import React, { useContext, useState } from "react";
import Title from "../component/Title";
import CartTotal from "../component/CartTotal";
import razorpay from "../assets/Razorpay.jpg";
import { shopDataContext } from "../context/ShopContext";
import { authDataContext } from "../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Loading from "../component/Loading";

function PlaceOrder() {
  const [method, setMethod] = useState("cod");
  const navigate = useNavigate();

  const { cartItem, setCartItem, getCartAmount, delivery_fee, products } =
    useContext(shopDataContext);

  const { serverUrl } = useContext(authDataContext);

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    pinCode: "",
    country: "",
    phone: "",
  });

  const onChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setFormData((data) => ({ ...data, [name]: value }));
  };

  const initPay = (order) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "OneCart",
      description: "Order Payment",
      order_id: order.id,

      handler: async function (response) {
        try {
          const verifyData = {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          };

          const { data } = await axios.post(
            serverUrl + "/api/order/verifyrazorpay",
            verifyData,
            { withCredentials: true }
          );

          if (data) {
            toast.success("Payment Successful");
            setCartItem({});
            navigate("/order");
          }
        } catch (error) {
          console.log(error);
          toast.error("Payment Verification Failed");
        }
      },

      theme: {
        color: "#3399cc",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let orderItems = [];

      for (const items in cartItem) {
        for (const item in cartItem[items]) {
          if (cartItem[items][item] > 0) {
            const itemInfo = structuredClone(
              products.find((product) => product._id === items)
            );

            if (itemInfo) {
              itemInfo.size = item;
              itemInfo.quantity = cartItem[items][item];
              orderItems.push(itemInfo);
            }
          }
        }
      }

      let orderData = {
        address: formData,
        items: orderItems,
        amount: getCartAmount() + delivery_fee,
      };

      switch (method) {
        case "cod": {
          const result = await axios.post(
            serverUrl + "/api/order/placeorder",
            orderData,
            { withCredentials: true }
          );

          if (result.data) {
            setCartItem({});
            toast.success("Order Placed");
            navigate("/order");
          } else {
            toast.error(result.data.message || "Order Placed Error");
          }

          break;
        }

        case "razorpay": {
          const resultRazorpay = await axios.post(
            serverUrl + "/api/order/razorpay",
            orderData,
            { withCredentials: true }
          );

          if (resultRazorpay.data) {
            initPay(resultRazorpay.data);
            toast.success("Order Created");
          }

          break;
        }

        default:
          break;
      }
    } catch (error) {
      console.log(error);
      toast.error("Order Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-[100vw] min-h-[100vh] bg-gradient-to-l from-[#141414] to-[#0c2025] flex items-start justify-center flex-col lg:flex-row gap-[50px] px-4 py-24 overflow-x-hidden">

      {/* ✅ LEFT SIDE FORM */}
      <div className="lg:w-[50%] w-[100%] flex items-center justify-center">
        <form
          id="orderForm"
          onSubmit={onSubmitHandler}
          className="lg:w-[70%] w-[100%]"
        >
          <div className="py-[10px]">
            <Title text1={"DELIVERY"} text2={"INFORMATION"} />
          </div>

          <div className="w-[100%] flex items-center justify-between px-[10px] gap-3">
            <input
              type="text"
              placeholder="First name"
              className="w-[48%] h-[50px] rounded-md bg-slate-700 placeholder:text-[white] text-[18px] px-[20px] shadow-sm shadow-[#343434]"
              required
              onChange={onChangeHandler}
              name="firstName"
              value={formData.firstName}
            />
            <input
              type="text"
              placeholder="Last name"
              className="w-[48%] h-[50px] rounded-md shadow-sm shadow-[#343434] bg-slate-700 placeholder:text-[white] text-[18px] px-[20px]"
              required
              onChange={onChangeHandler}
              name="lastName"
              value={formData.lastName}
            />
          </div>

          <div className="w-[100%] px-[10px] mt-4">
            <input
              type="email"
              placeholder="Email address"
              className="w-[100%] h-[50px] rounded-md shadow-sm shadow-[#343434] bg-slate-700 placeholder:text-[white] text-[18px] px-[20px]"
              required
              onChange={onChangeHandler}
              name="email"
              value={formData.email}
            />
          </div>

          <div className="w-[100%] px-[10px] mt-4">
            <input
              type="text"
              placeholder="Street"
              className="w-[100%] h-[50px] rounded-md bg-slate-700 shadow-sm shadow-[#343434] placeholder:text-[white] text-[18px] px-[20px]"
              required
              onChange={onChangeHandler}
              name="street"
              value={formData.street}
            />
          </div>

          <div className="w-[100%] flex items-center justify-between px-[10px] gap-3 mt-4">
            <input
              type="text"
              placeholder="City"
              className="w-[48%] h-[50px] rounded-md bg-slate-700 shadow-sm shadow-[#343434] placeholder:text-[white] text-[18px] px-[20px]"
              required
              onChange={onChangeHandler}
              name="city"
              value={formData.city}
            />
            <input
              type="text"
              placeholder="State"
              className="w-[48%] h-[50px] rounded-md bg-slate-700 shadow-sm shadow-[#343434] placeholder:text-[white] text-[18px] px-[20px]"
              required
              onChange={onChangeHandler}
              name="state"
              value={formData.state}
            />
          </div>

          <div className="w-[100%] flex items-center justify-between px-[10px] gap-3 mt-4">
            <input
              type="text"
              placeholder="Pincode"
              className="w-[48%] h-[50px] rounded-md bg-slate-700 shadow-sm shadow-[#343434] placeholder:text-[white] text-[18px] px-[20px]"
              required
              onChange={onChangeHandler}
              name="pinCode"
              value={formData.pinCode}
            />
            <input
              type="text"
              placeholder="Country"
              className="w-[48%] h-[50px] rounded-md bg-slate-700 shadow-sm shadow-[#343434] placeholder:text-[white] text-[18px] px-[20px]"
              required
              onChange={onChangeHandler}
              name="country"
              value={formData.country}
            />
          </div>

          <div className="w-[100%] px-[10px] mt-4">
            <input
              type="text"
              placeholder="Phone"
              className="w-[100%] h-[50px] rounded-md bg-slate-700 shadow-sm shadow-[#343434] placeholder:text-[white] text-[18px] px-[20px]"
              required
              onChange={onChangeHandler}
              name="phone"
              value={formData.phone}
            />
          </div>
        </form>
      </div>

      {/* ✅ RIGHT SIDE PAYMENT */}
      <div className="lg:w-[50%] w-[100%] flex items-center justify-center">
        <div className="lg:w-[70%] w-[100%] flex items-center justify-center gap-[15px] flex-col">

          <CartTotal />

          <div className="py-[10px]">
            <Title text1={"PAYMENT"} text2={"METHOD"} />
          </div>

          <div className="w-[100%] flex flex-wrap items-center justify-center gap-[20px] mt-[10px]">
            <button
              type="button"
              onClick={() => setMethod("razorpay")}
              className={`w-[150px] h-[50px] rounded-sm overflow-hidden 
              ${method === "razorpay" ? "border-[5px] border-blue-900" : "border border-transparent"}`}
            >
              <img
                src={razorpay}
                className="w-[100%] h-[100%] object-fill"
                alt=""
              />
            </button>

            <button
              type="button"
              onClick={() => setMethod("cod")}
              className={`w-[200px] h-[50px] bg-gradient-to-t from-[#95b3f8] to-[white] text-[14px] px-[20px] rounded-sm text-[#332f6f] font-bold 
              ${method === "cod" ? "border-[5px] border-blue-900" : "border border-transparent"}`}
            >
              CASH ON DELIVERY
            </button>
          </div>

          {/* ✅ PLACE ORDER button payment method ke niche */}
          <div className="w-full flex justify-center lg:justify-end mt-6">
            <button
              type="submit"
              form="orderForm"
              className="text-[18px] active:bg-slate-500 cursor-pointer bg-[#3bcee848] py-[10px] px-[50px]
              rounded-2xl text-white flex items-center justify-center gap-[20px]
              border-[1px] border-[#80808049] shadow-md shadow-black"
            >
              {loading ? <Loading /> : "PLACE ORDER"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default PlaceOrder;
