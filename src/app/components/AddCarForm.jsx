const AddCarForm = ({
    handleAddCar,
    setMarque,
    setModele,
    setAnneeFabrication,
    setTypeCarburant,
    setTypeTransmission,
    setVehicleType,
    setCategorie,
    setDisponibilite,
    setKilometrage,
    setNbPlaces,
    setNbPortes,
    setClimatisation,
    setCaracteristiques,
    setAccessoiresOptionSupp,
    setPrixParJ,
    setImage,
    setImage2,
    setImage3,
    setImage4,
    error,
    marque,
    modele,
    anneeFabrication,
    typeCarburant,
    typeTransmission,
    vehicleType,
    categorie,
    disponibilite,
    kilometrage,
    NbPlaces,
    NbPortes,
    climatisation,
    caracteristiques,
    accessoiresOptionSupp,
    prixParJ
}) => {
    return (
        <form className="grid grid-cols-2 gap-6">
            <div className="flex flex-col">
                <label className="text-gray-700 font-medium mb-2" htmlFor="brand">Brand</label>
                <input
                    id="brand"
                    type="text"
                    placeholder="Brand"
                    value={marque}
                    onChange={(e) => setMarque(e.target.value)}
                    className="w-full h-12 px-4 rounded-lg border border-gray-300 bg-gray-50 text-gray-800 placeholder-gray-400 focus:ring focus:ring-indigo-200 focus:border-indigo-500"
                />
            </div>
            <div className="flex flex-col">
                <label className="text-gray-700 font-medium mb-2" htmlFor="model">Model</label>
                <input
                    id="model"
                    type="text"
                    placeholder="Model"
                    value={modele}
                    onChange={(e) => setModele(e.target.value)}
                    className="w-full h-12 px-4 rounded-lg border border-gray-300 bg-gray-50 text-gray-800 placeholder-gray-400 focus:ring focus:ring-indigo-200 focus:border-indigo-500"
                />
            </div>
            <div className="flex flex-col">
                <label className="text-gray-700 font-medium mb-2" htmlFor="year">Year of Manufacture</label>
                <input
                    id="year"
                    type="number"
                    placeholder="Year of Manufacture"
                    value={anneeFabrication}
                    onChange={(e) => setAnneeFabrication(parseInt(e.target.value))}
                    className="w-full h-12 px-4 rounded-lg border border-gray-300 bg-gray-50 text-gray-800 placeholder-gray-400 focus:ring focus:ring-indigo-200 focus:border-indigo-500"
                />
            </div>
            <div className="flex flex-col">
                <label className="text-gray-700 font-medium mb-2" htmlFor="fuel">Fuel Type</label>
                <select
                    id="fuel"
                    value={typeCarburant}
                    onChange={(e) => setTypeCarburant(e.target.value)}
                    className="w-full h-12 px-4 rounded-lg border border-gray-300 bg-gray-50 text-gray-800 focus:ring focus:ring-indigo-200 focus:border-indigo-500"
                >
                    <option value="essence">Gasoline</option>
                    <option value="diesel">Diesel</option>
                    <option value="hybride">Hybrid</option>
                    <option value="electrique">Electric</option>
                </select>
            </div>
            <div className="flex flex-col">
                <label className="text-gray-700 font-medium mb-2" htmlFor="transmission">Transmission Type</label>
                <select
                    id="transmission"
                    value={typeTransmission}
                    onChange={(e) => setTypeTransmission(e.target.value)}
                    className="w-full h-12 px-4 rounded-lg border border-gray-300 bg-gray-50 text-gray-800 focus:ring focus:ring-indigo-200 focus:border-indigo-500"
                >
                    <option value="manuelle">Manual</option>
                    <option value="automatique">Automatic</option>
                </select>
            </div>
            <div className="flex flex-col">
                <label className="text-gray-700 font-medium mb-2" htmlFor="vehicleType">Vehicle Type</label>
                <select
                    id="vehicleType"
                    value={vehicleType}
                    onChange={(e) => setVehicleType(e.target.value)}
                    className="w-full h-12 px-4 rounded-lg border border-gray-300 bg-gray-50 text-gray-800 focus:ring focus:ring-indigo-200 focus:border-indigo-500"
                >
                    <option value="Car">Car</option>
                    <option value="Van">Van</option>
                    <option value="Minibus">Minibus</option>
                    <option value="Prestige">Prestige</option>
                </select>
            </div>

            <div className="flex flex-col">
                <label className="text-gray-700 font-medium mb-2" htmlFor="category">Category</label>
                <select
                    id="category"
                    value={categorie}
                    onChange={(e) => setCategorie(e.target.value)}
                    className="w-full h-12 px-4 rounded-lg border border-gray-300 bg-gray-50 text-gray-800 focus:ring focus:ring-indigo-200 focus:border-indigo-500"
                >
                    <option value="Compact">Compact</option>
                    <option value="Sedan">Sedan</option>
                    <option value="SUV">SUV</option>
                    <option value="Minivan">Minivan</option>
                    <option value="Convertible">Convertible</option>
                    <option value="Coupe">Coupe</option>
                    <option value="Exotic Cars">Exotic Cars</option>
                    <option value="Hatchback">Hatchback</option>
                    <option value="Truck">Truck</option>
                    <option value="Sports Car">Sports Car</option>
                    <option value="Station Wagon">Station Wagon</option>

                </select>
            </div>
            <div className="flex flex-col">
                <label className="text-gray-700 font-medium mb-2" htmlFor="availability">Availability</label>
                <select
                    id="availability"
                    value={disponibilite}
                    onChange={(e) => setDisponibilite(e.target.value)}
                    className="w-full h-12 px-4 rounded-lg border border-gray-300 bg-gray-50 text-gray-800 focus:ring focus:ring-indigo-200 focus:border-indigo-500"
                >
                    <option value="disponible">Available</option>
                    <option value="reserver">Reserved</option>
                    <option value="en entretien">In Maintenance</option>
                </select>
            </div>
            <div className="flex flex-col">
                <label className="text-gray-700 font-medium mb-2" htmlFor="mileage">Mileage</label>
                <input
                    id="mileage"
                    type="number"
                    placeholder="Mileage"
                    value={kilometrage}
                    onChange={(e) => setKilometrage(parseInt(e.target.value))}
                    className="w-full h-12 px-4 rounded-lg border border-gray-300 bg-gray-50 text-gray-800 placeholder-gray-400 focus:ring focus:ring-indigo-200 focus:border-indigo-500"
                />
            </div>
            <div className="flex flex-col">
                <label className="text-gray-700 font-medium mb-2" htmlFor="seats">Number of Seats</label>
                <input
                    id="seats"
                    type="number"
                    placeholder="Number of Seats"
                    value={NbPlaces}
                    onChange={(e) => setNbPlaces(parseInt(e.target.value))}
                    className="w-full h-12 px-4 rounded-lg border border-gray-300 bg-gray-50 text-gray-800 placeholder-gray-400 focus:ring focus:ring-indigo-200 focus:border-indigo-500"
                />
            </div>
            <div className="flex flex-col">
                <label className="text-gray-700 font-medium mb-2" htmlFor="doors">Number of Doors</label>
                <input
                    id="doors"
                    type="number"
                    placeholder="Number of Doors"
                    value={NbPortes}
                    onChange={(e) => setNbPortes(parseInt(e.target.value))}
                    className="w-full h-12 px-4 rounded-lg border border-gray-300 bg-gray-50 text-gray-800 placeholder-gray-400 focus:ring focus:ring-indigo-200 focus:border-indigo-500"
                />
            </div>
            <div className="flex items-center">
                <label className="text-gray-700 font-medium mb-2 mr-2" htmlFor="air-conditioning">Air Conditioning</label>
                <input
                    id="air-conditioning"
                    type="checkbox"
                    checked={climatisation}
                    onChange={(e) => setClimatisation(e.target.checked)}
                    className="h-6 w-6 rounded bg-gray-50 border border-gray-300 focus:ring focus:ring-indigo-200 focus:border-indigo-500"
                />
            </div>
            <div className="flex flex-col col-span-2">
                <label className="text-gray-700 font-medium mb-2" htmlFor="features">Features</label>
                <textarea
                    id="features"
                    placeholder="Features"
                    value={caracteristiques}
                    onChange={(e) => setCaracteristiques(e.target.value)}
                    className="w-full h-24 px-4 rounded-lg border border-gray-300 bg-gray-50 text-gray-800 placeholder-gray-400 focus:ring focus:ring-indigo-200 focus:border-indigo-500"
                ></textarea>
            </div>
            <div className="flex flex-col col-span-2">
                <label className="text-gray-700 font-medium mb-2" htmlFor="optional-accessories">Optional Accessories</label>
                <textarea
                    id="optional-accessories"
                    placeholder="Optional Accessories"
                    value={accessoiresOptionSupp}
                    onChange={(e) => setAccessoiresOptionSupp(e.target.value)}
                    className="w-full h-24 px-4 rounded-lg border border-gray-300 bg-gray-50 text-gray-800 placeholder-gray-400 focus:ring focus:ring-indigo-200 focus:border-indigo-500"
                ></textarea>
            </div>
            <div className="flex flex-col">
                <label className="text-gray-700 font-medium mb-2" htmlFor="price">Price per Day</label>
                <input
                    id="price"
                    type="number"
                    placeholder="Price per Day"
                    value={prixParJ}
                    onChange={(e) => setPrixParJ(parseFloat(e.target.value))}
                    className="w-full h-12 px-4 rounded-lg border border-gray-300 bg-gray-50 text-gray-800 placeholder-gray-400 focus:ring focus:ring-indigo-200 focus:border-indigo-500"
                />
            </div>
            <div className="flex flex-col col-span-2">
                <label className="text-gray-700 font-medium mb-2" htmlFor="image">Upload Image</label>
                <input
                    id="image"
                    type="file"
                    onChange={(e) => setImage(e.target.files?.[0] || null)}
                    className="w-full h-12 px-4 rounded-lg border border-gray-300 bg-gray-50 text-gray-800 placeholder-gray-400 focus:ring focus:ring-indigo-200 focus:border-indigo-500"
                />
            </div>
            <div className="flex flex-col col-span-2">
                <label className="text-gray-700 font-medium mb-2" htmlFor="image2">Upload Additional Image</label>
                <input
                    id="image2"
                    type="file"
                    onChange={(e) => setImage2(e.target.files?.[0] || null)}
                    className="w-full h-12 px-4 rounded-lg border border-gray-300 bg-gray-50 text-gray-800 placeholder-gray-400 focus:ring focus:ring-indigo-200 focus:border-indigo-500"
                />
            </div>
            <div className="flex flex-col col-span-2">
                <label className="text-gray-700 font-medium mb-2" htmlFor="image3">Upload Additional Image</label>
                <input
                    id="image3"
                    type="file"
                    onChange={(e) => setImage3(e.target.files?.[0] || null)}
                    className="w-full h-12 px-4 rounded-lg border border-gray-300 bg-gray-50 text-gray-800 placeholder-gray-400 focus:ring focus:ring-indigo-200 focus:border-indigo-500"
                />
            </div>
            <div className="flex flex-col col-span-2">
                <label className="text-gray-700 font-medium mb-2" htmlFor="image4">Upload Additional Image</label>
                <input
                    id="image4"
                    type="file"
                    onChange={(e) => setImage4(e.target.files?.[0] || null)}
                    className="w-full h-12 px-4 rounded-lg border border-gray-300 bg-gray-50 text-gray-800 placeholder-gray-400 focus:ring focus:ring-indigo-200 focus:border-indigo-500"
                />
            </div>
            {error && <p className="text-red-500 col-span-2">{error}</p>}
            <button
                onClick={handleAddCar}
                className="w-full col-span-2 h-12 mt-6 rounded-lg bg-[#1ECB15]  hover:bg-green-600 text-white font-bold text-lg focus:outline-none focus:ring focus:ring-indigo-200"
            >
                Add Car
            </button>
        </form>
    );
};

export default AddCarForm;