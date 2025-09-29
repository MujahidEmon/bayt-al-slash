import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import './CheckoutForm.css'
import { useEffect, useState } from 'react';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import useAuth from '../../hooks/useAuth';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FaSpinner } from 'react-icons/fa';

const CheckoutForm = ({ closeModal, bookingInfo, refetch }) => {
    const [clientSecret, setClientSecret] = useState();
    const [error, setError] = useState("");
    const [processing, setProcessing] = useState(false);
    const [transactionId, setTransactionId] = useState("");
    const axiosSecure = useAxiosSecure();
    const stripe = useStripe();
    const elements = useElements();
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (bookingInfo?.price) {
            getClientSecret(bookingInfo?.price);
        }
    }, [])

    const getClientSecret = async (price) => {
        const { data } = await axiosSecure.post('/create-payment-intent', { price });
        console.log('client secret', data);
        setClientSecret(data?.clientSecret);
    }

    const handleSubmit = async (event) => {
        setProcessing(true);
        // Block native form submission.
        event.preventDefault();

        if (!stripe || !elements) {
            // Stripe.js has not loaded yet. Make sure to disable
            // form submission until Stripe.js has loaded.
            return;
        }

        // Get a reference to a mounted CardElement. Elements knows how
        // to find your CardElement because there can only ever be one of
        // each type of element.
        const card = elements.getElement(CardElement);

        if (card == null) {
            return;
        }

        // Use your card Element with other Stripe.js APIs
        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card,
        });

        if (error) {
            console.log('[error]', error);
        } else {
            console.log('[PaymentMethod]', paymentMethod);
        }

        // confirm card payment
        const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: card,
                billing_details: {
                    name: user?.displayName || 'unknown',
                    email: user?.email || 'anonymous',
                }
            }
        })

        if (confirmError) {
            setError(confirmError.message);
            setProcessing(false);
            return;
        }

        if (paymentIntent.status === 'succeeded') {
            setError("");
            setTransactionId(paymentIntent?.id);
            // save payment information to the server
            const paymentData = {
                ...bookingInfo,
                guest: {
                    email: user?.email,
                    name: user?.displayName || 'unknown',
                    image: user?.photoURL || 'https://i.ibb.co/4pDNDk1/avatar.png'
                },
                transactionId: paymentIntent.id,
                price: bookingInfo.price,
                roomId: bookingInfo._id,
                date: new Date(),
            }

            delete paymentData._id;

            const { data } = await axiosSecure.post('/bookings', paymentData);
            console.log(data);

            await axiosSecure.patch(`/room/status/${bookingInfo._id}`, { status: true });
            closeModal();
            refetch();
            toast.success('Payment successful and booking confirmed');
            navigate('/dashboard/my-bookings');
            setProcessing(false)
        }
        console.log(transactionId);

    };

    return (
        <form onSubmit={handleSubmit}>
            <CardElement
                options={{
                    style: {
                        base: {
                            fontSize: '16px',
                            color: '#424770',
                            '::placeholder': {
                                color: '#aab7c4',
                            },
                        },
                        invalid: {
                            color: '#9e2146',
                        },
                    },
                }}
            />
            <div className='flex mt-2 justify-around'>
                <button
                    disabled={!stripe || !clientSecret || processing}
                    type='submit'
                    className={'inline-flex justify-center rounded-md border border-transparent bg-green-100 px-4 py-2 text-sm font-medium text-green-900 hover:bg-green-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2'}
                >
                    {processing ? <FaSpinner className=' animate-spin' size={20}></FaSpinner> : ` Pay $${bookingInfo.price}`}
                </button>
                <button
                    type='button'
                    className='inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2'
                    onClick={closeModal}
                >
                    Cancel
                </button>
            </div>
        </form>
    );

};

CheckoutForm.propTypes = {
    bookingInfo: PropTypes.object,
    closeModal: PropTypes.func,
    refetch: PropTypes.func,
};

export default CheckoutForm