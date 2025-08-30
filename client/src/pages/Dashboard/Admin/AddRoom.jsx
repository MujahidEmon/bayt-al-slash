import { useState } from 'react';
import { categories } from '../../../components/Categories/CategoriesData'
import { DateRange } from 'react-date-range';
import { imageUpload } from '../../../api/utils/image_upload';
import useAuth from '../../../hooks/useAuth';
import { Helmet } from 'react-helmet-async';
import { useMutation } from '@tanstack/react-query';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import toast from 'react-hot-toast';
const AddRoom = () => {

    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const [state, setState] = useState([
        {
            startDate: new Date(),
            endDate: null,
            key: 'selection'
        }
    ]);
    console.log(state);


    const {mutateAsync} = useMutation({
        mutationFn : async (roomData) => {
            const {data} = await axiosSecure.post('/rooms', roomData);
            return data;
        },
        onSuccess: () => {
            toast.success('Room Info saved to Database')
        }
    })

    const handleSubmit = async e => {
        e.preventDefault();
        const form = new FormData(e.currentTarget)
        const location = form.get('location')
        const category = form.get('category')
        const title = form.get('title')
        const price = form.get('price')
        const total_guest = form.get('total_guest')
        const bedrooms = form.get('bedrooms')
        const bathrooms = form.get('bathrooms')
        const description = form.get('description')
        const image = form.get('image')
        const from = state[0].startDate;
        const to = state[0].endDate;
        console.log(from, to);
        const host = {
            name: user.displayName,
            email: user.email,
            photo: user.photoURL
        }

        try {
            const image_url = await imageUpload(image)
            const roomData = {
                location,
                category,
                title,
                price,
                total_guest,
                bedrooms,
                bathrooms,
                description,
                host,
                from,
                to,
                image: image_url
            }


            console.table(roomData);


            // Post req to server
            await mutateAsync(roomData)
            

        } catch (error) {
            console.log(error);
        }
    }





    return (
        <>
            <Helmet>
                <title>Add Room | Dashboard</title>
            </Helmet>
            <div className='w-full min-h-[calc(100vh-40px)] flex flex-col justify-center items-center text-gray-800 rounded-xl bg-gray-50'>
                <form onSubmit={handleSubmit}>
                    <div className='grid grid-cols-1 lg:grid-cols-2 gap-10'>
                        <div className='space-y-6'>
                            <div className='space-y-1 text-sm'>
                                <label htmlFor='location' className='block text-gray-600'>
                                    Location
                                </label>
                                <input
                                    className='w-full px-4 py-3 text-gray-800 border border-rose-300 focus:outline-rose-500 rounded-md '
                                    name='location'
                                    id='location'
                                    type='text'
                                    placeholder='Location'
                                    required
                                />
                            </div>

                            <div className='space-y-1 text-sm'>
                                <label htmlFor='category' className='block text-gray-600'>
                                    Category
                                </label>
                                <select
                                    required
                                    className='w-full px-4 py-3 border-rose-300 focus:outline-rose-500 rounded-md'
                                    name='category'
                                >
                                    {categories.map(category => (
                                        <option value={category.label} key={category.label}>
                                            {category.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className='space-y-1'>
                                <label htmlFor='location' className='block text-gray-600'>
                                    Select Availability Range
                                </label>
                                <DateRange
                                    editableDateInputs={true}
                                    onChange={item => setState([item.selection])}
                                    moveRangeOnFirstSelection={false}
                                    ranges={state}
                                />
                            </div>
                        </div>
                        <div className='space-y-6'>
                            <div className='space-y-1 text-sm'>
                                <label htmlFor='title' className='block text-gray-600'>
                                    Title
                                </label>
                                <input
                                    className='w-full px-4 py-3 text-gray-800 border border-rose-300 focus:outline-rose-500 rounded-md '
                                    name='title'
                                    id='title'
                                    type='text'
                                    placeholder='Title'
                                    required
                                />
                            </div>

                            <div className=' p-4 bg-white w-full  m-auto rounded-lg'>
                                <div className='file_upload px-5 py-3 relative border-4 border-dotted border-gray-300 rounded-lg'>
                                    <div className='flex flex-col w-max mx-auto text-center'>
                                        <label>
                                            <input
                                                className='text-sm cursor-pointer w-36 hidden'
                                                type='file'
                                                name='image'
                                                id='image'
                                                accept='image/*'
                                                hidden
                                            />
                                            <div className='bg-rose-500 text-white border border-gray-300 rounded font-semibold cursor-pointer p-1 px-3 hover:bg-rose-500'>
                                                Upload Image
                                            </div>
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className='flex justify-between gap-2'>
                                <div className='space-y-1 text-sm'>
                                    <label htmlFor='price' className='block text-gray-600'>
                                        Price
                                    </label>
                                    <input
                                        className='w-full px-4 py-3 text-gray-800 border border-rose-300 focus:outline-rose-500 rounded-md '
                                        name='price'
                                        id='price'
                                        type='number'
                                        placeholder='Price'
                                        required
                                    />
                                </div>

                                <div className='space-y-1 text-sm'>
                                    <label htmlFor='guest' className='block text-gray-600'>
                                        Total guest
                                    </label>
                                    <input
                                        className='w-full px-4 py-3 text-gray-800 border border-rose-300 focus:outline-rose-500 rounded-md '
                                        name='total_guest'
                                        id='guest'
                                        type='number'
                                        placeholder='Total guest'
                                        required
                                    />
                                </div>
                            </div>

                            <div className='flex justify-between gap-2'>
                                <div className='space-y-1 text-sm'>
                                    <label htmlFor='bedrooms' className='block text-gray-600'>
                                        Bedrooms
                                    </label>
                                    <input
                                        className='w-full px-4 py-3 text-gray-800 border border-rose-300 focus:outline-rose-500 rounded-md '
                                        name='bedrooms'
                                        id='bedrooms'
                                        type='number'
                                        placeholder='Bedrooms'
                                        required
                                    />
                                </div>

                                <div className='space-y-1 text-sm'>
                                    <label htmlFor='bathrooms' className='block text-gray-600'>
                                        Bathrooms
                                    </label>
                                    <input
                                        className='w-full px-4 py-3 text-gray-800 border border-rose-300 focus:outline-rose-500 rounded-md '
                                        name='bathrooms'
                                        id='bathrooms'
                                        type='number'
                                        placeholder='Bathrooms'
                                        required
                                    />
                                </div>
                            </div>

                            <div className='space-y-1 text-sm'>
                                <label htmlFor='description' className='block text-gray-600'>
                                    Description
                                </label>

                                <textarea
                                    id='description'
                                    className='block rounded-md focus:rose-300 w-full h-32 px-4 py-3 text-gray-800  border border-rose-300 focus:outline-rose-500 '
                                    name='description'
                                ></textarea>
                            </div>
                        </div>
                    </div>

                    <button
                        type='submit'
                        className='w-full p-3 mt-5 text-center font-medium text-white transition duration-200 rounded shadow-md bg-rose-500'
                    >
                        Save & Continue
                    </button>
                </form>
            </div>
        </>
    )
}

export default AddRoom
