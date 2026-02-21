import React, { useContext, useState } from 'react';
import Nav from '../component/Nav';
import Sidebar from '../component/Sidebar';
import upload from '../assets/upload image.jpg';
import { authDataContext } from '../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import Loading from '../component/Loading';

function Add() {
  const [image1, setImage1] = useState(false);
  const [image2, setImage2] = useState(false);
  const [image3, setImage3] = useState(false);
  const [image4, setImage4] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Men");
  const [price, setPrice] = useState("");
  const [subCategory, setSubCategory] = useState("TopWear");
  const [bestseller, setBestSeller] = useState(false);
  const [sizes, setSizes] = useState([]);
  const [loading, setLoading] = useState(false);
  const { serverUrl } = useContext(authDataContext);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();

      // Basic Text Data
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("subCategory", subCategory);
      formData.append("bestseller", bestseller);
      formData.append("sizes", JSON.stringify(sizes));

      // Image Data - Only append if a file exists
      if (image1) formData.append("image1", image1);
      if (image2) formData.append("image2", image2);
      if (image3) formData.append("image3", image3);
      if (image4) formData.append("image4", image4);

      const response = await axios.post(`${serverUrl}/api/product/addproduct`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" }
      });

      if (response.data.success) {
        toast.success(response.data.message || "Product Added!");
        // Resetting form
        setName("");
        setDescription("");
        setPrice("");
        setImage1(false);
        setImage2(false);
        setImage3(false);
        setImage4(false);
        setSizes([]);
        setBestSeller(false);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Error uploading product");
    } finally {
      setLoading(false);
    }
  };

  const sizeOptions = ["S", "M", "L", "XL", "XXL"];

  return (
    <div className='w-[100vw] min-h-[100vh] bg-gradient-to-l from-[#141414] to-[#0c2025] text-[white] overflow-x-hidden relative'>
      <Nav />
      <Sidebar />
      <div className='w-[82%] h-[100%] flex items-center justify-start overflow-x-hidden absolute right-0 bottom-[5%]'>
        <form onSubmit={handleAddProduct} className='w-[100%] md:w-[90%] h-[100%] mt-[70px] flex flex-col gap-[30px] py-[90px] px-[30px] md:px-[60px]'>
          <div className='w-[400px] h-[50px] text-[25px] md:text-[40px] text-white'>Add Product Page</div>

          <div>
            <p className='text-[20px] md:text-[25px] font-semibold mb-3'>Upload Images</p>
            <div className='flex gap-4'>
              {[image1, image2, image3, image4].map((img, index) => (
                <label key={index} htmlFor={`image${index + 1}`} className='cursor-pointer'>
                  <img 
                    src={!img ? upload : URL.createObjectURL(img)} 
                    alt="" 
                    className='w-[80px] h-[80px] md:w-[100px] md:h-[100px] rounded-lg border-2 border-transparent hover:border-[#46d1f7] object-cover' 
                  />
                  <input 
                    type="file" 
                    id={`image${index + 1}`} 
                    hidden 
                    onChange={(e) => {
                      const setFuncs = [setImage1, setImage2, setImage3, setImage4];
                      setFuncs[index](e.target.files[0]);
                    }} 
                  />
                </label>
              ))}
            </div>
          </div>

          <div className='flex flex-col gap-2'>
            <p className='text-[20px] font-semibold'>Product Name</p>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className='w-full max-w-[600px] bg-slate-600 p-2 rounded' required />
          </div>

          <div className='flex flex-col gap-2'>
            <p className='text-[20px] font-semibold'>Product Description</p>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className='w-full max-w-[600px] bg-slate-600 p-2 rounded h-24' required />
          </div>

          <div className='flex gap-10 flex-wrap'>
            <div>
              <p className='font-semibold'>Category</p>
              <select onChange={(e) => setCategory(e.target.value)} className='bg-slate-600 p-2 rounded mt-2'>
                <option value="Men">Men</option>
                <option value="Women">Women</option>
                <option value="Kids">Kids</option>
              </select>
            </div>
            <div>
              <p className='font-semibold'>Sub-Category</p>
              <select onChange={(e) => setSubCategory(e.target.value)} className='bg-slate-600 p-2 rounded mt-2'>
                <option value="TopWear">TopWear</option>
                <option value="BottomWear">BottomWear</option>
                <option value="WinterWear">WinterWear</option>
              </select>
            </div>
          </div>

          <div>
            <p className='font-semibold'>Price</p>
            <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className='bg-slate-600 p-2 rounded mt-2' required />
          </div>

          <div>
            <p className='font-semibold'>Sizes</p>
            <div className='flex gap-3 mt-2'>
              {sizeOptions.map(size => (
                <div 
                  key={size}
                  onClick={() => setSizes(prev => prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size])}
                  className={`px-4 py-2 rounded cursor-pointer border ${sizes.includes(size) ? 'bg-green-400 text-black' : 'bg-slate-600'}`}
                >
                  {size}
                </div>
              ))}
            </div>
          </div>

          <div className='flex items-center gap-2'>
            <input type="checkbox" id="bestseller" checked={bestseller} onChange={() => setBestSeller(!bestseller)} className='w-5 h-5' />
            <label htmlFor="bestseller">Add to Bestseller</label>
          </div>

          <button className='w-[160px] py-3 rounded-xl bg-[#65d8f7] text-black font-bold'>
            {loading ? <Loading /> : "Add Product"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Add;