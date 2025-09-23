import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import ProductCarousel from '../components/ProductCarousel';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  features?: string[];
  author?: string;
  fileType?: string;
  fileSize?: string;
  pages?: number;
  compatibility?: string[];
  downloads?: number;
  rating?: number;
  reviews?: Array<{ user: string; rating: number; comment: string; }>;
  seller?: {
    name: string;
    avatar?: string;
    rating?: number;
    sales?: number;
    shopLink?: string;
  };
  [key: string]: any;
}

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(() => {
    // Use product from navigation state if available
    // @ts-ignore
    return location.state && location.state.product ? location.state.product : null;
  });
  const [loading, setLoading] = useState(product ? false : true);
  const [error, setError] = useState<string | null>(null);
  const [mainImgIdx, setMainImgIdx] = useState(0);
  const [added, setAdded] = useState(false);
  const [descExpanded, setDescExpanded] = useState(false);

  useEffect(() => {
    if (product) return;
    setLoading(true);
  const apiUrl = process.env.REACT_APP_API_URL;
  fetch(`${apiUrl}/api/products/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Product not found');
        return res.json();
      })
      .then((data) => {
        console.log('Fetched product detail:', data);
        let productObj = data;
        if (data && typeof data === 'object') {
          if ('data' in data && typeof data.data === 'object') {
            productObj = data.data;
          }
        }
        if (productObj && !productObj._id && productObj.id) {
          productObj._id = productObj.id;
        }
        if (!productObj || (!productObj._id && !productObj.id)) {
          setError('Product not found or invalid data');
          setProduct(null);
        } else {
          setProduct(productObj);
          setMainImgIdx(0);
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id, product]);

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center text-red-500 py-10">{error}</div>;

  if (!product) return null;

  // Combine images and videos for carousel (no duplicates)
  const carouselItems = [
    ...(product.images || []).map((url: string) => ({ url, type: 'image' as const })),
    ...(product.videos || []).map((url: string) => ({ url, type: 'video' as const })),
  ];
  // Remove duplicates by URL
  const uniqueCarouselItems = Array.from(new Map(carouselItems.map(item => [item.url, item])).values());

  // Determine if there is a main product file (ppt, doc, excel, pdf, etc.)
  const mainFile = product.files && product.files.length > 0 ? product.files[0] : null;
  // Helper: check if file is image or video (should not show as main file if already in carousel)
  const isImageOrVideo = (fileUrl: any) => {
    if (typeof fileUrl !== 'string') return false;
    const ext = fileUrl.split('.').pop()?.toLowerCase();
    return [
      'jpg','jpeg','png','gif','bmp','webp','svg','mp4','mov','avi','webm','mkv','ogg','ogv','m4v'
    ].includes(ext || '');
  };

  // Helper for file type badge
  const fileTypeBadge = (type?: string) => {
    if (!type) return null;
    let color = 'bg-blue-500';
    if (type.toLowerCase().includes('ppt')) color = 'bg-orange-500';
    if (type.toLowerCase().includes('doc')) color = 'bg-blue-700';
    if (type.toLowerCase().includes('pdf')) color = 'bg-red-500';
    return <span className={`inline-block px-3 py-1 text-xs font-semibold text-white rounded-full ${color}`}>{type.toUpperCase()}</span>;
  };

  // Helper for star rating
  const renderStars = (rating: number = 5) => {
    return (
      <span className="text-yellow-500">
        {'★'.repeat(Math.round(rating))}
        {'☆'.repeat(5 - Math.round(rating))}
      </span>
    );
  };

  if (!product) {
    return <div className="min-h-screen flex items-center justify-center text-xl">Loading product...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 pb-16">
      <div className="container mx-auto px-4 pt-8">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 md:p-8 flex flex-col md:flex-row gap-8 max-w-5xl mx-auto">
          {/* Left: Media Carousel */}
          <div className="md:w-1/2 w-full flex flex-col items-center">
            <div className="border rounded-xl overflow-hidden relative bg-white shadow-md w-full">
              <div className="absolute top-3 left-3 z-10">{fileTypeBadge(product?.fileType)}</div>
              {uniqueCarouselItems.length > 0 ? (
                <ProductCarousel items={uniqueCarouselItems} />
              ) : (
                <div className="w-full h-64 md:h-96 flex flex-col items-center justify-center bg-gray-100 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 11a4 4 0 01-8 0" />
                  </svg>
                  <span className="text-lg">No preview available</span>
                </div>
              )}
            </div>
            {/* Download Product File section removed as per request */}
          </div>
          {/* Right: Product Info & Actions */}
          <div className="md:w-1/2 w-full flex flex-col gap-6 justify-start">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 mb-2">{product?.name}</h1>
              <p className="text-lg text-gray-600 mb-4">{product?.description}</p>
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                {product?.seller && product.seller.avatar && <img src={product.seller.avatar} alt={product.seller.name} className="w-6 h-6 rounded-full" />}
                <span>by {product?.seller?.name || product?.author || 'Seller'}</span>
                {product?.seller && product.seller.shopLink && <a href={product.seller.shopLink} className="text-indigo-600 hover:underline ml-1">Shop</a>}
                <span className="ml-2 flex items-center gap-1">{renderStars(product?.seller?.rating || product?.rating || 4.8)}<span>({product?.seller?.sales || 120} sales)</span></span>
              </div>
              <div className="flex items-center gap-3 mb-1">
                <span className="text-2xl text-pink-600 font-semibold">₹{product?.price}</span>
                {product?.originalPrice && product.originalPrice > product.price && (
                  <span className="text-gray-400 line-through text-lg">₹{product?.originalPrice}</span>
                )}
                {product?.originalPrice && product.originalPrice > product.price && (
                  <span className="text-green-600 text-sm font-bold">{Math.round(100 * (product.originalPrice - product.price) / product.originalPrice)}% OFF</span>
                )}
                <span className="ml-2 inline-block bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded">Digital Download</span>
              </div>
            </div>
            {/* ...existing code for actions, reviews, etc... */}
            <div className="flex gap-4 mb-2 justify-center md:justify-start">
              <button className={`bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 rounded-lg transition-all text-lg shadow-md w-40 ${added ? 'opacity-60 cursor-not-allowed' : ''}`} onClick={() => {
                if (!isAuthenticated) {
                  navigate('/login', { state: { from: `/product/${product?._id || id}` } });
                  return;
                }
                if (!product) return;
                if (!product._id && !(product as any).id) { alert('This product cannot be added to cart (missing product ID).'); return; }
                const productId = product._id || (product as any).id;
                if (!productId) { alert('This product cannot be added to cart (missing product ID).'); return; }
                addToCart({ productId, name: product.name, price: product.price, quantity: 1, image: product.images?.[0] || '', });
                setAdded(true); setTimeout(() => setAdded(false), 1200);
              }} disabled={added}>{added ? 'Added!' : 'Add to cart'}</button>
              <button className="bg-indigo-700 hover:bg-indigo-800 text-white font-bold py-3 rounded-lg transition-all text-lg shadow-md w-40" onClick={() => {
                if (!isAuthenticated) {
                  navigate('/login', { state: { from: '/cart' } });
                  return;
                }
                navigate('/cart');
              }}>Buy now</button>
              <button className="ml-2 p-3 rounded-full border border-gray-200 hover:bg-gray-100" title="Add to wishlist"><svg className="w-5 h-5 text-pink-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 21.364l-7.682-7.682a4.5 4.5 0 010-6.364z" /></svg></button>
            </div>
            <div className="flex flex-wrap gap-3 text-xs text-gray-600 justify-center md:justify-start">
              <span className="inline-flex items-center gap-1"><svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg> Instant download</span>
              <span className="inline-flex items-center gap-1"><svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path strokeLinecap="round" strokeLinejoin="round" d="M8 12l2 2 4-4" /></svg> Secure payment</span>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 flex flex-col gap-2 text-sm mt-4">
              <div className="flex gap-4 flex-wrap">
                {product.fileType && <span><b>File type:</b> {product.fileType}</span>}
                {product.fileSize && <span><b>File size:</b> {product.fileSize}</span>}
                {product.pages && <span><b>Pages/slides:</b> {product.pages}</span>}
                {product.compatibility && product.compatibility.length > 0 && <span><b>Compatible with:</b> {product.compatibility.join(', ')}</span>}
                {product.downloads && <span><b>Downloads:</b> {product.downloads}</span>}
              </div>
              <div><b>License:</b> Personal & commercial use</div>
              <div><b>Delivery:</b> Instant digital download</div>
            </div>
            <div className="text-gray-700 mb-2 whitespace-pre-line mt-4">
              {descExpanded || (product.description && product.description.length < 300) ? product.description : product.description?.slice(0, 300) + '...'}
              {product.description && product.description.length > 300 && (<button className="ml-2 text-indigo-600 hover:underline text-xs" onClick={() => setDescExpanded(e => !e)}>{descExpanded ? 'Show less' : 'Read more'}</button>)}
            </div>
            {product.features && product.features.length > 0 && (<ul className="list-disc pl-5 mb-2">{product.features.map((feature, idx) => (<li key={idx} className="text-gray-600">{feature}</li>))}</ul>)}
            {/* Downloadable Files removed for digital product privacy */}
            {/* Seller Info */}
            <div className="flex items-center gap-3 bg-white border rounded-lg p-3 mt-2 justify-center md:justify-start">
              {product.seller?.avatar && <img src={product.seller.avatar} alt={product.seller.name} className="w-10 h-10 rounded-full" />}
              <div>
                <div className="font-semibold">{product.seller?.name || product.author || 'Seller'}</div>
                <div className="text-xs text-gray-500">{renderStars(product.seller?.rating || 4.8)} {product.seller?.sales || 120} sales</div>
                {product.seller?.shopLink && <a href={product.seller.shopLink} className="text-indigo-600 hover:underline text-xs">Visit shop</a>}
              </div>
            </div>
            {/* Reviews */}
            <div className="mt-2">
              <div className="flex items-center gap-2 mb-1 justify-center md:justify-start">
                <span className="text-yellow-500 text-lg">★</span>
                <span className="font-semibold">{product.rating || 4.8}</span>
                <span className="text-gray-500 text-sm">({product.reviews ? product.reviews.length : 120} reviews)</span>
              </div>
              <div className="max-h-32 overflow-y-auto space-y-2">
                {product.reviews && product.reviews.length > 0 ? (product.reviews.slice(0, 3).map((r, idx) => (<div key={idx} className="bg-white rounded p-2 border"><div className="flex items-center gap-2 mb-1"><span className="font-bold text-gray-700">{r.user}</span><span className="text-yellow-500">{'★'.repeat(r.rating)}</span></div><div className="text-gray-600 text-sm">{r.comment}</div></div>))) : (<div className="text-gray-400 text-sm">No reviews yet.</div>)}
              </div>
            </div>
            {/* Related Products (placeholder) */}
            <div className="mt-4">
              <div className="font-semibold mb-2">You may also like</div>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {/* Placeholder for related products */}
                <div className="w-32 h-32 bg-gray-100 rounded flex items-center justify-center text-gray-400 text-xs">Related 1</div>
                <div className="w-32 h-32 bg-gray-100 rounded flex items-center justify-center text-gray-400 text-xs">Related 2</div>
                <div className="w-32 h-32 bg-gray-100 rounded flex items-center justify-center text-gray-400 text-xs">Related 3</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
