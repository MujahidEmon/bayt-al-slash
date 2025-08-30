import axios from "axios";

export const imageUpload = async image => {
    const form = new FormData()
    form.append( 'image', image);

    const { data } = await axios.post(`https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`, form)
    return data.data.display_url
}