import React, { useState, useRef } from "react";
import axios from "axios";
import default_image from "../Assets/default_image.jpg"

function ImageGenerator() {
  const [imgUrl, setImgUrl] = useState(default_image);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  const handleSearchImages = async (query) => {
    if (!query) {
      setImgUrl(default_image); 
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`https://lexica.art/api/v1/search?q=${encodeURIComponent(query)}`);
      
      // Set the first image URL if available
      if (response.data.images && response.data.images.length > 0) {
        setImgUrl(response.data.images[0].src); 
      } else {
        setImgUrl(default_image); 
      }
      
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Error fetching image: " + (err.response?.data?.error?.message || "Unknown error"));
      setImgUrl(default_image);
      setLoading(false);
    }
  };

  const handleGenerateImage = () => {
    const prompt = inputRef.current.value;
    handleSearchImages(prompt); 
  };

  return (
    <div className="bg-slate-800 min-h-screen min-w-fit">
      <div className="p-7">
        <h1 className="text-gray-300 text-4xl text-center font-bold">
          AI Image <span className="text-pink-700">Generator</span>
        </h1>
      </div>
      <div className="flex justify-center mt-5">
        <div className="w-80 border-2 border-sky-500">
          {loading ? (
            <p className="text-white text-center">Loading...</p>
          ) : (
            <img src={imgUrl} alt="Generated" className="object-cover" />
          )}
        </div>
      </div>
      <div className="flex justify-center p-10">
        <input
          className="rounded-full bg-transparent border border-gray-200 text-white w-5/12 text-center"
          type="text"
          ref={inputRef}
          placeholder="Image Description"
        />
        <button
          className="bg-pink-700 text-white mx-2 p-2 rounded-full hover:border border-white"
          onClick={handleGenerateImage}
          disabled={loading}
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>
      {error && <p className="text-red-500 text-center mt-4">{error}</p>}
    </div>
  );
}

export default ImageGenerator;
