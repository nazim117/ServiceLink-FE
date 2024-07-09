import { ChangeEvent, FormEvent, useState, useEffect, Fragment } from "react";
import offerAPI from "../API/offerAPI";
import { IOfferType } from "../interfaces/IOfferType";
import { Dialog, Transition } from '@headlessui/react';
import { useParams } from "react-router-dom";

// Assuming serviceProviderId is obtained from the application's state or context

function ServiceProfile() {
    const [offers, setOffers] = useState<IOfferType[]>([]);
    const {serviceId: serviceIdString} = useParams();
    const serviceId = Number(serviceIdString);
    const [newOffer, setNewOffer] = useState<IOfferType>({
        name: "",
        description: "",
        duration: "",
        imagePath: "",
        price: 0,
    });
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    useEffect(() => {
        offerAPI.get(serviceId)
            .then(response => {
                setOffers(response);
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
        // Ensure serviceProviderId is added to the offer
        const offerToCreate = {
            ...newOffer,
            serviceId,
        };

        // Log the new offer data before making the API call
        console.log("Adding new offer:", offerToCreate);

        // Add the new offer to the backend
        offerAPI.create(offerToCreate)
            .then(response => {
                setOffers([...offers, response]);
                setNewOffer({
                    name: "",
                    description: "",
                    duration: "",
                    imagePath: "",
                    price: 0,
                });
                setIsModalOpen(false);
            })
            .catch(error => {
                console.error("Error adding offer:", error);
            });
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center py-6">
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
                <div className="flex items-center justify-center mt-4">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="w-10 h-10 text-2xl text-white bg-blue-500 rounded-full flex items-center justify-center"
                    >
                        +
                    </button>
                </div>
            </div>

            <Transition appear show={isModalOpen} as={Fragment}>
                <Dialog as="div" className="fixed inset-0 z-10 overflow-y-auto" onClose={() => setIsModalOpen(false)}>
                    <div className="min-h-screen px-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <div className="fixed inset-0 bg-black opacity-30" />
                        </Transition.Child>

                        <span className="inline-block h-screen align-middle" aria-hidden="true">
                            &#8203;
                        </span>
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                                    Add New Offer
                                </Dialog.Title>
                                <form onSubmit={handleAddOffer} className="mt-4 space-y-4">
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
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition>
        </div>
    );
}

export default ServiceProfile;
