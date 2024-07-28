import React, { useState } from 'react';

const AddBlogForm = ({ handleSubmit, handleContentChange, addContentSection, error, content, setTitle, setCategory, setSummary, setImage, title, category, summary }) => {
    return (
        <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit}>
            {error && <p className="text-red-500 col-span-1 md:col-span-2">{error}</p>}
            <div className="col-span-1 md:col-span-2">
                <label className="block text-gray-700">Title</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                />
            </div>
            <div className="col-span-1 md:col-span-2">
                <label className="block text-gray-700">Category</label>
                <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                />
            </div>
            <div className="col-span-1 md:col-span-2">
                <label className="block text-gray-700">Summary</label>
                <textarea
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                ></textarea>
            </div>
            <div className="col-span-1 md:col-span-2">
                <label className="block text-gray-700">Image</label>
                <input
                    type="file"
                    onChange={(e) => setImage(e.target.files[0])}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                />
            </div>
            {content.map((section, index) => (
                <div key={index} className="col-span-1 md:col-span-2">
                    <label className="block text-gray-700">Section Title</label>
                    <input
                        type="text"
                        value={section.title}
                        onChange={(e) => handleContentChange(index, 'title', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                    <label className="block text-gray-700">Section Text</label>
                    <textarea
                        value={section.text}
                        onChange={(e) => handleContentChange(index, 'text', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        required
                    ></textarea>
                </div>
            ))}
            <div className="col-span-1 md:col-span-2">
                <button
                    type="button"
                    onClick={addContentSection}
                    className="w-full bg-[#1ECB15] text-white py-2 px-4 rounded-md hover:bg-[#16A314] transition-colors"
                >
                    Add Section
                </button>
            </div>
            <div className="col-span-1 md:col-span-2">
                <button
                    type="submit"
                    className="w-full bg-[#1ECB15] text-white py-2 px-4 rounded-md hover:bg-[#16A314] transition-colors"
                >
                    Add Blog
                </button>
            </div>
        </form>
    );
};

export default AddBlogForm;