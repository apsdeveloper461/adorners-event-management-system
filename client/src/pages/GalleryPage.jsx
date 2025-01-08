import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Gallery } from 'react-grid-gallery';
import 'lightgallery/css/lightgallery.css';

// Import images from assets folder
import natureImage from '../assets/sample.jpg';
import animalsImage from '../assets/sample.jpg';
import mountainImage from '../assets/sample.jpg';
import lionImage from '../assets/sample.jpg';
import riverImage from '../assets/sample.jpg';

const categories = [
  { id: 1, name: 'Nature', image: natureImage },
  { id: 2, name: 'Animals', image: animalsImage },
  // ...other categories
];

const GalleryPage = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([
    { id: 1, category: 'Nature', name: 'Mountain', image: mountainImage },
    { id: 2, category: 'Animals', name: 'Lion', image: lionImage },
    // ...other items
  ]);

  const handleCategoryClick = (category) => {
    navigate(`/category/${category}`);
  };

  const handleAddItem = (newItem) => {
    setItems([...items, newItem]);
  };

  const handleRemoveItem = (itemId) => {
    setItems(items.filter(item => item.id !== itemId));
  };

  const categoryImages = categories.map(category => ({
    src: category.image,
    thumbnail: category.image,
    thumbnailWidth: 320,
    thumbnailHeight: 174,
    caption: category.name,
    customOverlay: (
      <div className="absolute top-2 left-2 text-white bg-black bg-opacity-50 p-2 rounded">
        {category.name}
      </div>
    ),
    onClick: () => handleCategoryClick(category.name)
  }));

  const itemImages = items.map(item => ({
    src: item.image,
    thumbnail: item.image,
    thumbnailWidth: 320,
    thumbnailHeight: 174,
    caption: item.name,
  }));

  return (
    <div className="p-4 relative w-full h-full">
      <h1 className="text-2xl font-bold mb-4">Gallery</h1>
      <Gallery images={categoryImages} enableImageSelection={false} />
      <div className="items mt-4">
        <Gallery images={itemImages} enableImageSelection={false} />
      </div>
      <button onClick={() => handleAddItem({ id: items.length + 1, category: 'Nature', name: 'River', image: riverImage })} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
        Add Item
      </button>
    </div>
  );
};

export default GalleryPage;