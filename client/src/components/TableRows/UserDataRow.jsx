/* eslint-disable react/prop-types */
import { useState } from "react";
import UpdateUserModal from "../Modal/UpdateUserModal";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import useAuth from "../../hooks/useAuth";

// eslint-disable-next-line react/prop-types
const UserDataRow = ({ user, refetch }) => {
    const {user: loggedInUser} = useAuth();
    const [isOpen, setIsOpen] = useState(false)
    const axiosSecure = useAxiosSecure();
    // console.log(user.email,loggedInUser?.email);
    
    const isDisabled =  user?.email === loggedInUser?.email

    const { mutateAsync } = useMutation({
        mutationFn: async (UpdatedUser) => {
            const { data } = await axiosSecure.patch(`/user/update/${user?.email}`, UpdatedUser)
            return data
        },
        onSuccess: () => {  
            refetch();
            toast.success('User Role Updated')
        }
    })


    const modalHandler = async (selected) => {
        const user = {
            role: selected,
            status: 'Verified'
        }

        try {
            const res = await mutateAsync(user)
            console.log(res);
        } catch (error) {
            console.log(error);
            toast.error(error.message)
        }
        setIsOpen(false)
    }
    // console.log(user);
    return (
        <tr>
            <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
                <p className='text-gray-900 whitespace-no-wrap'>{user?.email}</p>
            </td>
            <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
                <p className='text-gray-900 whitespace-no-wrap'>{user?.role}</p>
            </td>
            <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
                {user?.status ? (
                    <p
                        className={`${user.status === 'Verified' ? 'text-green-500' : 'text-yellow-500'
                            } whitespace-no-wrap`}
                    >
                        {user.status}
                    </p>
                ) : (
                    <p className='text-red-500 whitespace-no-wrap'>Unavailable</p>
                )}
            </td>

            <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
                <button onClick={() => {
                    setIsOpen(!isOpen)
                }} 
                disabled={isDisabled}
                className='relative cursor-pointer inline-block px-3 py-1 font-semibold text-green-900 leading-tight
                disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-300'>
                    <span
                        aria-hidden='true'
                        className='absolute inset-0 bg-green-200 opacity-50 rounded-full'
                    ></span>
                    <span className='relative'>Update Role</span>
                </button>
                {/* Modal */}
                <UpdateUserModal setIsEditModalOpen={setIsOpen} isOpen={isOpen} user={user} modalHandler={modalHandler}></UpdateUserModal>
            </td>
        </tr>
    )
}

export default UserDataRow