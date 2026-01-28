import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { shopDataContext } from "../context/ShopContext";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";
import RelatedProduct from "../component/RelatedProduct";
import Loading from "../component/Loading";

function ProductDetail() {
  const { productId } = useParams();
  const { products, currency, addtoCart, loading } = useContext(shopDataContext);

  const [productData, setProductData] = useState(null);

  const [image, setImage] = useState("");
  const [image1, setImage1] = useState("");
  const [image2, setImage2] = useState("");
  const [image3, setImage3] = useState("");
  const [image4, setImage4] = useState("");
  const [size, setSize] = useState("");

  const fetchProductData = () => {
    const found = products.find((item) => item._id === productId);
    if (found) {
      setProductData(found);

      setImage1(found.image1);
      setImage2(found.image2);
      setImage3(found.image3);
      setImage4(found.image4);
      setImage(found.image1);
    }
  };

  useEffect(() => {
    fetchProductData();
  }, [productId, products]);

  if (!productData) return <div className="opacity-0">Loading...</div>;

  return (
    <div className="w-full min-h-screen bg-gradient-to-l from-[#141414] to-[#0c2025] overflow-x-hidden">

      {/* ✅ TOP PRODUCT SECTION */}
      <div className="w-full max-w-[1400px] mx-auto px-4 pt-24 pb-10">
        <div className="w-full flex flex-col lg:flex-row gap-10 items-start">

          {/* LEFT: Images */}
          <div className="w-full lg:w-1/2 flex flex-col-reverse lg:flex-row gap-6 items-center">

            {/* thumbnails */}
            <div className="w-full lg:w-[120px] flex lg:flex-col flex-row gap-3 justify-center flex-wrap">
              {[image1, image2, image3, image4].map((img, idx) => (
                <div
                  key={idx}
                  className="w-[60px] h-[60px] md:w-[90px] md:h-[90px] rounded-md overflow-hidden border border-[#80808049] bg-slate-300 cursor-pointer"
                  onClick={() => setImage(img)}
                >
                  <img
                    src={img}
                    alt="thumb"
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>

            {/* big image */}
            <div className="w-full lg:flex-1 border border-[#80808049] rounded-md overflow-hidden">
              <img
                src={image}
                alt="product"
                className="w-full h-[300px] md:h-[450px] lg:h-[520px] object-cover"
              />
            </div>
          </div>

          {/* RIGHT: Details */}
          <div className="w-full lg:w-1/2 flex flex-col gap-4">
            <h1 className="text-[28px] md:text-[40px] font-semibold text-[aliceblue]">
              {productData.name?.toUpperCase()}
            </h1>

            {/* rating */}
            <div className="flex items-center gap-1">
              <FaStar className="text-[18px] fill-[#FFD700]" />
              <FaStar className="text-[18px] fill-[#FFD700]" />
              <FaStar className="text-[18px] fill-[#FFD700]" />
              <FaStar className="text-[18px] fill-[#FFD700]" />
              <FaStarHalfAlt className="text-[18px] fill-[#FFD700]" />
              <p className="text-[16px] font-semibold pl-2 text-white">(124)</p>
            </div>

            {/* price */}
            <p className="text-[24px] md:text-[30px] font-semibold text-white">
              {currency} {productData.price}
            </p>

            {/* short desc */}
            <p className="text-[16px] md:text-[18px] font-medium text-white/90 max-w-[550px]">
              {productData.description} and Stylish, breathable cotton shirt with
              a modern slim fit. Easy to wash, super comfortable, and designed
              for effortless style.
            </p>

            {/* sizes */}
            <div className="flex flex-col gap-2 mt-2">
              <p className="text-[20px] md:text-[25px] font-semibold text-white">
                Select Size
              </p>

              <div className="flex gap-3 flex-wrap">
                {productData.sizes.map((item, index) => (
                  <button
                    key={index}
                    type="button"
                    className={`border py-2 px-4 rounded-md font-semibold transition
                      ${item === size
                        ? "bg-black text-[#2f97f1] border-white"
                        : "bg-slate-300 text-black"
                      }`}
                    onClick={() => setSize(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>

              {/* Add to cart */}
              <button
                type="button"
                className="w-fit min-w-[220px] text-[16px] bg-[#495b61c9] py-[12px] px-[20px] rounded-2xl mt-3 border border-[#80808049] text-white shadow-md shadow-black active:scale-95 transition"
                onClick={() => addtoCart(productData._id, size)}
              >
                {loading ? <Loading /> : "Add to Cart"}
              </button>
            </div>

            <div className="w-full h-[1px] bg-slate-700 my-4"></div>

            {/* policies */}
            <div className="text-[15px] text-white/90 flex flex-col gap-1">
              <p>✅ 100% Original Product.</p>
              <p>✅ Cash on delivery is available on this product</p>
              <p>✅ Easy return and exchange policy within 7 days</p>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ DESCRIPTION / REVIEWS SECTION */}
      <div className="w-full max-w-[1400px] mx-auto px-4 pb-16">
        {/* tabs */}
        <div className="flex gap-2 border-b border-white/20">
          <button className="px-5 py-3 text-sm text-white border border-white/20 border-b-0">
            Description
          </button>
          <button className="px-5 py-3 text-sm text-white/80 border border-white/20 border-b-0">
            Reviews (124)
          </button>
        </div>

        {/* box */}
        <div className="w-full mt-4 bg-[#3336397c] border border-white/20 text-white rounded-md p-4 md:p-6">
          <p className="text-[14px] md:text-[16px] lg:text-[18px] leading-relaxed">
            Upgrade your wardrobe with this stylish slim-fit cotton shirt,
            available now on OneCart. Crafted from breathable, high-quality
            fabric, it offers all-day comfort and effortless style. Easy to
            maintain and perfect for any setting, this shirt is a must-have
            essential for those who value both fashion and function.
          </p>
        </div>

        {/* related products */}
        <div className="mt-12">
          <RelatedProduct
            category={productData.category}
            subCategory={productData.subCategory}
            currentProductId={productData._id}
          />
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
