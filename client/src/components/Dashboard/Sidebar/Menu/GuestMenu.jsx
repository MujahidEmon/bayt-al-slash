
import { BsFingerprint } from 'react-icons/bs'
import { GrUserAdmin } from 'react-icons/gr'
import MenuItem from '../MenuItem'
import useRole from '../../../../hooks/useRole'
import useAxiosSecure from '../../../../hooks/useAxiosSecure'
import toast from 'react-hot-toast'
import useAuth from '../../../../hooks/useAuth'
import { useState } from 'react'
import HostModal from '../../../Modal/HostModal'
const GuestMenu = () => {
  const { user } = useAuth()
  const axiosSecure = useAxiosSecure()
  const [isOpen, setIsOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const closeModal = () => {
    setIsModalOpen(false)
  }
  const modalHandler = async () => {
    try {
      const userInfo = {
        email: user?.email,
        role: 'guest',
        status: 'Requested'
      }

      const res = await axiosSecure.put('/user', userInfo)
      console.log(res.data);
      if (res.data.modifiedCount > 0) {
        toast.success('Request Sent Successfully, Please wait for admin approval')
      }
      else {
        toast.success('Please wait for admin approval')
      }

    } catch (error) {
      console.log(error);
    }
    closeModal()
  }
  const [role] = useRole()
  return (
    <>
      <MenuItem
        icon={BsFingerprint}
        label='My Bookings'
        address='my-bookings'
      />

      {role === 'guest' && (
        <button onClick={() => setIsModalOpen(true)} className='flex items-center px-4 py-2 mt-5  transition-colors duration-300 transform text-gray-600  hover:bg-gray-300   hover:text-gray-700 cursor-pointer'>
          <GrUserAdmin className='w-5 h-5' />
          <span className='mx-4 font-medium'>Become A Host</span>
        </button>
      )}
      <HostModal isOpen={isModalOpen}
        closeModal={closeModal}
        modalHandler={modalHandler}
      ></HostModal>
    </>
  )
}

export default GuestMenu