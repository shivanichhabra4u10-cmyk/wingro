import React, { useState } from 'react';
import { supabase } from '../utils/supabaseClient';



interface ProductUploadProps {
  onProductCreated?: () => void;
}

const ProductUpload: React.FC<ProductUploadProps> = ({ onProductCreated }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [productType, setProductType] = useState<'individual' | 'enterprise'>('individual');
  const [badge, setBadge] = useState('');
  const [features, setFeatures] = useState<string[]>([]);
  const [featureInput, setFeatureInput] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  // Handle file selection (ppt, doc, etc)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  // Add feature
  const handleAddFeature = () => {
    if (featureInput.trim()) {
      setFeatures([...features, featureInput.trim()]);
      setFeatureInput('');
    }
  };

  // Upload files to Supabase Storage and return public URLs
  const uploadFiles = async (files: File[], folder: string) => {
    const urls: string[] = [];
    for (const file of files) {
      const filePath = `${folder}/${Date.now()}_${file.name}`;
      const { data, error } = await supabase.storage.from('product-images').upload(filePath, file);
      if (error) throw new Error('Image upload failed: ' + error.message);
      // Get public URL
      const { data: publicUrlData } = supabase.storage.from('product-images').getPublicUrl(filePath);
      if (!publicUrlData || !publicUrlData.publicUrl) throw new Error('Failed to get public URL');
      urls.push(publicUrlData.publicUrl);
    }
    return urls;
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    console.log('DEBUG: handleSubmit called');
    e.preventDefault();
    setUploading(true);
    setError(null);
    setSuccess(false);
    try {
      if (!images || images.length === 0) {
        setError('Please select at least one product image.');
        setUploading(false);
        return;
      }
      // Upload images to Supabase and get URLs
      const imageUrls = await uploadFiles(images, 'product-images');
      console.log('DEBUG: imageUrls after upload', imageUrls);
      if (!imageUrls || imageUrls.length === 0) {
        setError('Image upload failed. Please try again.');
        setUploading(false);
        return;
      }
      // Upload files (optional)
      const fileUrls = files.length > 0 ? await uploadFiles(files, 'product-files') : [];
      // Compose product object
      const product = {
        name,
        description,
        price: Number(price),
        category,
        productType,
        badge,
        features,
        images: imageUrls,
        fileUrls,
      };
      // Send to backend API
      const resp = await fetch('http://localhost:3001/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
      });
      if (!resp.ok) {
        const errData = await resp.json();
        throw new Error(errData.error || 'Failed to create product');
      }
      setSuccess(true);
      setName('');
      setDescription('');
      setPrice('');
      setCategory('');
      setProductType('individual');
      setBadge('');
      setFeatures([]);
      setFeatureInput('');
      setImages([]);
      setFiles([]);
      if (onProductCreated) onProductCreated();
    } catch (err: any) {
      setError(err.message || 'Failed to upload product');
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 600, margin: '40px auto', background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px 0 rgba(80,80,120,0.08)', padding: 32 }}>
      <h2 style={{ textAlign: 'center', marginBottom: 24, color: '#3730a3' }}>Add New Product</h2>
      {error && <div style={{ color: 'red', marginBottom: 16 }}>{error}</div>}
      {success && <div style={{ color: 'green', marginBottom: 16 }}>Product uploaded successfully!</div>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <input required placeholder="Product Name" value={name} onChange={e => setName(e.target.value)} style={{ padding: 10, borderRadius: 8, border: '1px solid #e5e7eb' }} />
        <textarea required placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} style={{ padding: 10, borderRadius: 8, border: '1px solid #e5e7eb', minHeight: 60 }} />
        <input required type="number" min={0} placeholder="Price" value={price} onChange={e => setPrice(e.target.value)} style={{ padding: 10, borderRadius: 8, border: '1px solid #e5e7eb' }} />
        <input required placeholder="Category" value={category} onChange={e => setCategory(e.target.value)} style={{ padding: 10, borderRadius: 8, border: '1px solid #e5e7eb' }} />
        <select value={productType} onChange={e => setProductType(e.target.value as any)} style={{ padding: 10, borderRadius: 8, border: '1px solid #e5e7eb' }}>
          <option value="individual">Individual</option>
          <option value="enterprise">Enterprise</option>
        </select>
        <label style={{ fontWeight: 600, color: '#555' }}>Badge (optional):</label>
        <select value={badge} onChange={e => setBadge(e.target.value)} style={{ padding: 10, borderRadius: 8, border: '1px solid #e5e7eb' }}>
          <option value="">None</option>
          <option value="New">New</option>
          <option value="Best Seller">Best Seller</option>
          <option value="AI-Powered">AI-Powered</option>
          <option value="Premium">Premium</option>
        </select>
        {/* Features */}
        <div style={{ display: 'flex', gap: 8 }}>
          <input placeholder="Add feature" value={featureInput} onChange={e => setFeatureInput(e.target.value)} style={{ flex: 1, padding: 10, borderRadius: 8, border: '1px solid #e5e7eb' }} />
          <button type="button" onClick={handleAddFeature} style={{ padding: '10px 18px', borderRadius: 8, background: '#6366f1', color: '#fff', border: 'none', fontWeight: 700 }}>Add</button>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {features.map((f, idx) => (
            <span key={idx} style={{ background: '#f3f4f6', borderRadius: 8, padding: '4px 10px', color: '#3730a3', fontWeight: 600 }}>{f}</span>
          ))}
        </div>
        {/* Images */}
        <label style={{ fontWeight: 600, color: '#555' }}>Product Images (at least one required):</label>
        <input type="file" accept="image/*" multiple onChange={handleImageChange} style={{ marginBottom: 16 }} required />
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {images.map((img, idx) => (
            <img key={idx} src={URL.createObjectURL(img)} alt="preview" style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 8, border: '1px solid #eee' }} />
          ))}
        </div>
        {/* Files */}
        <label style={{ fontWeight: 600, color: '#555' }}>Product Files (PPT, DOC, etc, multiple):</label>
        <input type="file" accept=".ppt,.pptx,.doc,.docx,.pdf,.xls,.xlsx,.csv,.txt,.zip,.rar,.7z,.tar,.gz" multiple onChange={handleFileChange} />
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', fontSize: 13, color: '#555' }}>
          {files.map((file, idx) => (
            <span key={idx}>{file.name}</span>
          ))}
        </div>
        <button type="submit" disabled={uploading} style={{ marginTop: 18, padding: '14px 0', background: 'linear-gradient(90deg, #6366f1 0%, #a21caf 100%)', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 17, cursor: uploading ? 'not-allowed' : 'pointer', boxShadow: '0 2px 8px 0 rgba(80,80,120,0.10)' }}>{uploading ? 'Uploading...' : 'Add Product'}</button>
      </div>
    </form>
  );
};

export default ProductUpload;
