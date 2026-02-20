import React, { useContext, useState } from 'react'
import Title from '../component/Title'
import CartTotal from '../component/CartTotal'
import razorpay from '../assets/Razorpay.jpg'
import { shopDataContext } from '../context/ShopContext'
import { authDataContext } from '../context/AuthContext'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import Loading from '../component/Loading'

function PlaceOrder() {
    let [method, setMethod] = useState('cod')
    let navigate = useNavigate()
    const { cartItem, setCartItem, getCartAmount, delivery_fee, products } = useContext(shopDataContext)
    let { serverUrl } = useContext(authDataContext)
    let [loading, setLoading] = useState(false)

    let [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        street: '',
        city: '',
        state: '',
        pinCode: '',
        country: '',
        phone: ''
    })

    const onChangeHandler = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setFormData(data => ({ ...data, [name]: value }))
    }

    // --- MOCK PAYMENT HANDLER ---
    const initPayDemo = async (orderId) => {
        toast.info("Connecting to Demo Payment Gateway...");
        
        // Simulate a 2-second processing delay
        setTimeout(async () => {
            try {
                // We simulate the success response usually sent by Razorpay
                const mockResponse = {
                    razorpay_order_id: orderId,
                    razorpay_payment_id: "pay_DEMO_" + Math.random().toString(36).substr(2, 9),
                    razorpay_signature: "demo_signature_bypass"
                };

                // OPTIONAL: Call your backend to log the demo order
                // If your backend is strict, you might need to adjust it to accept 'demo_signature_bypass'
                const { data } = await axios.post(serverUrl + '/api/order/verifyrazorpay', mockResponse, { withCredentials: true });

                if (data) {
                    toast.success("Demo Payment Successful!");
                    setCartItem({});
                    navigate("/order");
                }
            } catch (error) {
                console.log("Payment Simulation Error:", error);
                // Even if backend fails, for a "pure demo" we can force navigation:
                toast.success("Order Placed (Demo Mode)");
                setCartItem({});
                navigate("/order");
            } finally {
                setLoading(false);
            }
        }, 2000);
    }

    const onSubmitHandler = async (e) => {
        e.preventDefault()
        setLoading(true)
        
        try {
            let orderItems = []
            for (const items in cartItem) {
                for (const item in cartItem[items]) {
                    if (cartItem[items][item] > 0) {
                        const itemInfo = structuredClone(products.find(product => product._id === items))
                        if (itemInfo) {
                            itemInfo.size = item
                            itemInfo.quantity = cartItem[items][item]
                            orderItems.push(itemInfo)
                        }
                    }
                }
            }

            let orderData = {
                address: formData,
                items: orderItems,
                amount: getCartAmount() + delivery_fee
            }

            switch (method) {
                case 'cod':
                    const result = await axios.post(serverUrl + "/api/order/placeorder", orderData, { withCredentials: true })
                    if (result.data) {
                        setCartItem({})
                        toast.success("Order Placed")
                        navigate("/order")
                    } else {
                        toast.error("Order Placed Error")
                    }
                    setLoading(false)
                    break;

                case 'razorpay':
                    // We still hit your backend to create the record, but use our Demo Handler instead of RZP
                    const resultRazorpay = await axios.post(serverUrl + "/api/order/razorpay", orderData, { withCredentials: true })
                    if (resultRazorpay.data) {
                        // Pass the order ID from your backend to our simulation
                        initPayDemo(resultRazorpay.data.id)
                    } else {
                        toast.error("Gateway Error")
                        setLoading(false)
                    }
                    break;

                default:
                    setLoading(false)
                    break;
            }

        } catch (error) {
            console.log(error)
            toast.error("An error occurred")
            setLoading(false)
        }
    }

    return (
        <div className='w-[100vw] min-h-[100vh] bg-gradient-to-l from-[#141414] to-[#0c2025] flex items-center justify-center flex-col md:flex-row gap-[50px] relative'>
            <div className='lg:w-[50%] w-[100%] h-[100%] flex items-center justify-center lg:mt-[0px] mt-[90px] '>
                <form action="" onSubmit={onSubmitHandler} className='lg:w-[70%] w-[95%] lg:h-[70%] h-[100%]'>
                    <div className='py-[10px]'>
                        <Title text1={'DELIVERY'} text2={'INFORMATION'} />
                    </div>
                    <div className='w-[100%] h-[70px] flex items-center justify-between px-[10px]'>
                        <input type="text" placeholder='First name' className='w-[48%] h-[50px] rounded-md bg-slate-700 placeholder:text-[white] text-[18px] px-[20px] shadow-sm shadow-[#343434]' required onChange={onChangeHandler} name='firstName' value={formData.firstName} />
                        <input type="text" placeholder='Last name' className='w-[48%] h-[50px] rounded-md shadow-sm shadow-[#343434] bg-slate-700 placeholder:text-[white] text-[18px] px-[20px]' required onChange={onChangeHandler} name='lastName' value={formData.lastName} />
                    </div>

                    <div className='w-[100%] h-[70px] flex items-center justify-between px-[10px]'>
                        <input type="email" placeholder='Email address' className='w-[100%] h-[50px] rounded-md shadow-sm shadow-[#343434] bg-slate-700 placeholder:text-[white] text-[18px] px-[20px]' required onChange={onChangeHandler} name='email' value={formData.email} />
                    </div>
                    <div className='w-[100%] h-[70px] flex items-center justify-between px-[10px]'>
                        <input type="text" placeholder='Street' className='w-[100%] h-[50px] rounded-md bg-slate-700 shadow-sm shadow-[#343434] placeholder:text-[white] text-[18px] px-[20px]' required onChange={onChangeHandler} name='street' value={formData.street} />
                    </div>
                    <div className='w-[100%] h-[70px] flex items-center justify-between px-[10px]'>
                        <input type="text" placeholder='City' className='w-[48%] h-[50px] rounded-md bg-slate-700 shadow-sm shadow-[#343434] placeholder:text-[white] text-[18px] px-[20px]' required onChange={onChangeHandler} name='city' value={formData.city} />
                        <input type="text" placeholder='State' className='w-[48%] h-[50px] rounded-md bg-slate-700 shadow-sm shadow-[#343434] placeholder:text-[white] text-[18px] px-[20px]' required onChange={onChangeHandler} name='state' value={formData.state} />
                    </div>
                    <div className='w-[100%] h-[70px] flex items-center justify-between px-[10px]'>
                        <input type="text" placeholder='Pincode' className='w-[48%] h-[50px] rounded-md bg-slate-700 shadow-sm shadow-[#343434] placeholder:text-[white] text-[18px] px-[20px]' required onChange={onChangeHandler} name='pinCode' value={formData.pinCode} />
                        <input type="text" placeholder='Country' className='w-[48%] h-[50px] rounded-md bg-slate-700 shadow-sm shadow-[#343434] placeholder:text-[white] text-[18px] px-[20px]' required onChange={onChangeHandler} name='country' value={formData.country} />
                    </div>
                    <div className='w-[100%] h-[70px] flex items-center justify-between px-[10px]'>
                        <input type="text" placeholder='Phone' className='w-[100%] h-[50px] rounded-md bg-slate-700 shadow-sm shadow-[#343434] placeholder:text-[white] text-[18px] px-[20px]' required onChange={onChangeHandler} name='phone' value={formData.phone} />
                    </div>
                    <div>
                        <button type='submit' className='text-[18px] active:bg-slate-500 cursor-pointer bg-[#3bcee848] py-[10px] px-[50px] rounded-2xl text-white flex items-center justify-center gap-[20px] absolute lg:right-[20%] bottom-[10%] right-[35%] border-[1px] border-[#80808049] ml-[30px] mt-[20px]' >
                            {loading ? <Loading /> : "PLACE ORDER"}
                        </button>
                    </div>
                </form>
            </div>
            
            <div className='lg:w-[50%] w-[100%] min-h-[100%] flex items-center justify-center gap-[30px] '>
                <div className='lg:w-[70%] w-[90%] lg:h-[70%] h-[100%] flex items-center justify-center gap-[10px] flex-col'>
                    <CartTotal />
                    <div className='py-[10px]'>
                        <Title text1={'PAYMENT'} text2={'METHOD'} />
                    </div>
                    <div className='w-[100%] h-[30vh] lg:h-[100px] flex items-start mt-[20px] lg:mt-[0px] justify-center gap-[50px]'>
                        <button type="button" onClick={() => setMethod('razorpay')} className={`w-[150px] h-[50px] rounded-sm transition-all ${method === 'razorpay' ? 'border-[5px] border-blue-900' : 'border border-gray-600'}`}>
                            <img src={razorpay} className='w-[100%] h-[100%] object-fill rounded-sm ' alt="Razorpay Demo" />
                        </button>
                        <button type="button" onClick={() => setMethod('cod')} className={`w-[200px] h-[50px] bg-gradient-to-t from-[#95b3f8] to-[white] text-[14px] px-[20px] rounded-sm text-[#332f6f] font-bold transition-all ${method === 'cod' ? 'border-[5px] border-blue-900' : 'border border-gray-600'}`}>
                            CASH ON DELIVERY
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PlaceOrder