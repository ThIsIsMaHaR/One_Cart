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
    
    // Quick validation: Ensure at least one size and one image
    if (sizes.length === 0) return toast.error("Please select at least one size");
    if (!image1 && !image2 && !image3 && !image4) return toast.error("Please upload at least one image");

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

      // Image Data - Must match the keys in productRoutes.js
      if (image1) formData.append("image1", image1);
      if (image2) formData.append("image2", image2);
      if (image3) formData.append("image3", image3);
      if (image4) formData.append("image4", image4);

      // URL FIX: Match the backend route '/api/product/add'
      const response = await axios.post(`${serverUrl}/api/product/add`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" }
      });

      if (response.data.success) {
        toast.success(response.data.message || "Product Added!");
        
        // Resetting form for next entry
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
      console.error("Upload Error:", error);
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
      <div className='w-[100%] md:w-[82%] min-h-[100%] flex items-center justify-start overflow-x-hidden absolute right-0 top-[70px]'>
        <form onSubmit={handleAddProduct} className='w-[100%] md:w-[90%] flex flex-col gap-[25px] py-[40px] px-[30px] md:px-[60px]'>
          
          <h2 className='text-[25px] md:text-[40px] text-white font-bold'>Add Product</h2>

          {/* Image Upload Section */}
          <div>
            <p className='text-[18px] font-semibold mb-3'>Upload Images</p>
            <div className='flex gap-4 flex-wrap'>
              {[image1, image2, image3, image4].map((img, index) => (
                <label key={index} htmlFor={`image${index + 1}`} className='cursor-pointer'>
                  <div className='w-[80px] h-[80px] md:w-[100px] md:h-[100px] rounded-lg border-2 border-dashed border-gray-500 hover:border-[#46d1f7] overflow-hidden flex items-center justify-center bg-[#1a1a1a]'>
                    <img 
                      src={img ? URL.createObjectURL(img) : upload} 
                      alt="upload preview" 
                      className={img ? 'w-full h-full object-cover' : 'w-[40%] opacity-50'} 
                    />
                  </div>
                  <input 
                    type="file" 
                    id={`image${index + 1}`} 
                    hidden 
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (index === 0) setImage1(file);
                      if (index === 1) setImage2(file);
                      if (index === 2) setImage3(file);
                      if (index === 3) setImage4(file);
                    }} 
                  />
                </label>
              ))}
            </div>
          </div>

          {/* Product Basic Info */}
          <div className='flex flex-col gap-2'>
            <p className='text-[18px] font-semibold'>Product Name</p>
            <input 
              type="text" 
              placeholder='Ex: Slim Fit Cotton Shirt'
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              className='w-full max-w-[600px] bg-[#1a1a1a] border border-gray-700 p-3 rounded-lg focus:outline-[#46d1f7]' 
              required 
            />
          </div>

          <div className='flex flex-col gap-2'>
            <p className='text-[18px] font-semibold'>Product Description</p>
            <textarea 
              placeholder='Write product details here...'
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              className='w-full max-w-[600px] bg-[#1a1a1a] border border-gray-700 p-3 rounded-lg h-24 focus:outline-[#46d1f7]' 
              required 
            />
          </div>

          {/* Category Selection */}
          <div className='flex gap-10 flex-wrap'>
            <div>
              <p className='font-semibold mb-2'>Category</p>
              <select 
                value={category} 
                onChange={(e) => setCategory(e.target.value)} 
                className='bg-[#1a1a1a] border border-gray-700 p-2 rounded-lg'
              >
                <option value="Men">Men</option>
                <option value="Women">Women</option>
                <option value="Kids">Kids</option>
              </select>
            </div>
            <div>
              <p className='font-semibold mb-2'>Sub-Category</p>
              <select 
                value={subCategory} 
                onChange={(e) => setSubCategory(e.target.value)} 
                className='bg-[#1a1a1a] border border-gray-700 p-2 rounded-lg'
              >
                <option value="TopWear">Topwear</option>
                <option value="BottomWear">Bottomwear</option>
                <option value="WinterWear">Winterwear</option>
              </select>
            </div>
            <div>
              <p className='font-semibold mb-2'>Product Price</p>
              <input 
                type="number" 
                placeholder='25'
                value={price} 
                onChange={(e) => setPrice(e.target.value)} 
                className='bg-[#1a1a1a] border border-gray-700 p-2 rounded-lg w-[120px]' 
                required 
              />
            </div>
          </div>

          {/* Sizes Selection */}
          <div>
            <p className='font-semibold mb-3'>Product Sizes</p>
            <div className='flex gap-3 mt-2'>
              {sizeOptions.map(size => (
                <div 
                  key={size}
                  onClick={() => setSizes(prev => prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size])}
                  className={`w-12 h-10 flex items-center justify-center rounded-lg cursor-pointer border transition-all ${
                    sizes.includes(size) 
                    ? 'bg-[#46d1f7] text-black border-[#46d1f7] font-bold' 
                    : 'bg-[#1a1a1a] border-gray-700 hover:border-gray-400'
                  }`}
                >
                  {size}
                </div>
              ))}
            </div>
          </div>

          {/* Bestseller Checkbox */}
          <div className='flex items-center gap-3 bg-[#1a1a1a] p-3 rounded-lg w-fit border border-gray-800 cursor-pointer' onClick={() => setBestSeller(!bestseller)}>
            <input 
              type="checkbox" 
              id="bestseller" 
              checked={bestseller} 
              onChange={() => {}} // Handled by div click
              className='w-5 h-5 cursor-pointer' 
            />
            <label htmlFor="bestseller" className='cursor-pointer select-none'>Add to Bestseller</label>
          </div>

          {/* Submit Button */}
          <button 
            type="submit"
            disabled={loading}
            className='w-full max-w-[200px] py-4 rounded-xl bg-[#46d1f7] text-black font-bold text-lg hover:bg-[#3bb8db] transition-colors disabled:opacity-50'
          >
            {loading ? <Loading /> : "ADD PRODUCT"}
          </button>

        </form>
      </div>
    </div>
  );
}

export default Add;