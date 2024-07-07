import { ChangeEvent, FormEvent, useState, useEffect } from "react";
import offerAPI from "../API/offerAPI";
import { IOfferType } from "../interfaces/IOfferType";

function ServiceProfile() {
    const [offers, setOffers] = useState<IOfferType[]>([]);
    const [newOffer, setNewOffer] = useState<IOfferType>({
        name: "",
        description: "",
        duration: "",
        imagePath: "",
        price: 0,
    });

    useEffect(() => {
        // Fetch existing offers from the backend
        offerAPI.get()
            .then(response => {
                setOffers(response.data);
            })
            .catch(error => {
                console.error("Error fetching offers:", error);
            });
    }, []);

    const handleOfferChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewOffer({ ...newOffer, [name]: name === "duration" || name === "price" ? Number(value) : value });
    };

    const handleAddOffer = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Add the new offer to the backend
        offerAPI.create(newOffer)
            .then(response => {
                setOffers([...offers, response.data]);
                setNewOffer({
                    name: "",
                    description: "",
                    duration: "",
                    imagePath: "",
                    price: 0,
                });
            })
            .catch(error => {
                console.error("Error adding offer:", error);
            });
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center py-6">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full border-2 border-gray-400">
                <form onSubmit={handleAddOffer} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Offer Name</label>
                        <input type="text" id="name" name="name" value={newOffer.name} onChange={handleOfferChange} required className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea id="description" name="description" value={newOffer.description} onChange={handleOfferChange} required className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"></textarea>
                    </div>
                    <div>
                        <label htmlFor="duration" className="block text-sm font-medium text-gray-700">Duration (minutes)</label>
                        <input type="number" id="duration" name="duration" value={newOffer.duration} onChange={handleOfferChange} required className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
                    </div>
                    <div>
                        <label htmlFor="imagePath" className="block text-sm font-medium text-gray-700">Image Path</label>
                        <input type="text" id="imagePath" name="imagePath" value={newOffer.imagePath} onChange={handleOfferChange} required className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
                    </div>
                    <div>
                        <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
                        <input type="number" id="price" name="price" value={newOffer.price} onChange={handleOfferChange} required className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
                    </div>
                    <button type="submit" className="w-full px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition duration-150 ease-in-out">Add Offer</button>
                </form>
            </div>
            <div className="mt-8 w-full max-w-md">
                <h2 className="text-xl font-semibold mb-4 text-center">Your Offers</h2>
                {offers.length > 0 ? (
                    offers.map((offer, index) => (
                        <div key={index} className="bg-white p-4 rounded-lg shadow-md mb-4 border border-gray-300">
                            <h3 className="text-lg font-medium">{offer.name}</h3>
                            <p className="text-sm text-gray-600">{offer.description}</p>
                            <p className="text-sm">Duration: {offer.duration} minutes</p>
                            <p className="text-sm">Price: ${offer.price}</p>
                            <img src={offer.imagePath} alt={offer.name} className="w-full h-32 object-cover mt-2 rounded-md"/>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-500">No offers available</p>
                )}
            </div>
        </div>
    );
}

export default ServiceProfile;
