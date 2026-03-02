import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { shopDataContext } from '../context/ShopContext';
import { FaStar, FaStarHalfAlt } from "react-icons/fa";
import RelatedProduct from '../component/RelatedProduct';
import Loading from '../component/Loading';

function ProductDetail() {
  const { productId } = useParams();
  const { products, currency, addtoCart, loading } = useContext(shopDataContext);

  const [productData, setProductData] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [selectedSize, setSelectedSize] = useState('');

  useEffect(() => {
    if (products && products.length > 0) {
      const product = products.find(item => item._id === productId);
      if (product) {
        setProductData(product);

        // Use images exactly as stored in DB
        const imgs = [product.image1, product.image2, product.image3, product.image4].filter(Boolean);
        setSelectedImage(imgs[0]); // set first image
      }
    }
  }, [productId, products]);

  if (!productData) return <Loading />;

  const images = [productData.image1, productData.image2, productData.image3, productData.image4].filter(Boolean);

  return (
    <div className="w-full overflow-x-hidden bg-gradient-to-l from-[#141414] to-[#0c2025] pt-20">
      
      {/* Product Images and Info */}
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 px-4 md:px-6">
        
        {/* Left: Images */}
        <div className="lg:w-1/2 flex flex-col md:flex-row gap-4">
          {/* Thumbnails */}
          <div className="flex flex-row md:flex-col gap-2">
            {images.map((img, idx) => (
              <div 
                key={idx} 
                className="w-16 md:w-20 h-16 md:h-20 border border-gray-600 rounded-md cursor-pointer overflow-hidden"
              >
                <img 
                  src={img} 
                  alt={`${productData.name} ${idx+1}`} 
                  className="w-full h-full object-cover" 
                  onClick={() => setSelectedImage(img)} 
                />
              </div>
            ))}
          </div>
          {/* Main Image */}
          <div className="flex-1 border border-gray-600 rounded-md overflow-hidden">
            <img 
              src={selectedImage} 
              alt={productData.name} 
              className="w-full h-full object-contain" 
            />
          </div>
        </div>

        {/* Right: Product Info */}
        <div className="lg:w-1/2 flex flex-col gap-4 text-white">
          <h1 className="text-3xl md:text-4xl font-bold">{productData.name.toUpperCase()}</h1>
          
          {/* Ratings */}
          <div className="flex items-center gap-2">
            {[1,2,3,4].map(i => <FaStar key={i} className="text-yellow-400" />)}
            <FaStarHalfAlt className="text-yellow-400" />
            <span className="text-white/80">(124)</span>
          </div>

          {/* Price */}
          <p className="text-2xl font-semibold">{currency} {productData.price}</p>

          {/* Description */}
          <p className="text-white/80">{productData.description}</p>

          {/* Size Selection */}
          {productData.sizes && productData.sizes.length > 0 && (
            <div className="mt-4">
              <p className="text-white font-semibold mb-2">Select Size</p>
              <div className="flex gap-2 flex-wrap">
                {productData.sizes.map((s, idx) => (
                  <button
                    key={idx}
                    className={`px-4 py-2 border rounded-md ${selectedSize === s ? 'bg-white text-black' : 'bg-gray-700 text-white'}`}
                    onClick={() => setSelectedSize(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Add to Cart */}
          <button
            className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition"
            onClick={() => addtoCart(productData._id, selectedSize)}
          >
            {loading ? <Loading /> : "Add to Cart"}
          </button>

          {/* Additional Info */}
          <div className="mt-4 border-t border-gray-600 pt-4 text-white/80 text-sm space-y-1">
            <p>100% Original Product.</p>
            <p>Cash on delivery available.</p>
            <p>Easy return & exchange within 7 days.</p>
          </div>
        </div>
      </div>

      {/* Description + Related Products */}
      <div className="max-w-7xl mx-auto mt-16 px-4 md:px-6">
        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4">Description</h2>
        <p className="bg-gray-800 p-6 rounded-md text-white">{productData.description}</p>

        <RelatedProduct 
          category={productData.category} 
          subCategory={productData.subCategory} 
          currentProductId={productData._id} 
        />
      </div>
    </div>
  )
}

export default ProductDetail;