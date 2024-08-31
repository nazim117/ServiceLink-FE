import { ChangeEvent, FormEvent, useState, useEffect, Fragment } from "react";
import offerAPI from "../API/offerAPI";
import { IOfferType } from "../interfaces/IOfferType";
import { Dialog, Transition } from '@headlessui/react';
import OfferList from "../components/OfferList";
import { IServiceType } from "../interfaces/IServiceType";
import serviceAPI from "../API/serviceAPI";
import TokenManager from "../API/TokenManager";
import { useNavigate, useLocation } from 'react-router-dom';

function ServiceProfile() {
    const location = useLocation();
    const navigate = useNavigate();
    const userId = TokenManager.getClaimsFromLocalStorage()?.userId;
    const [serviceId, setServiceId] = useState(Number);
    const [offers, setOffers] = useState<IOfferType[]>([]);
    const [newOffer, setNewOffer] = useState<IOfferType>({
        id: 0,
        name: "",
        description: "",
        duration: 0,
        price: 0,
        serviceId: 0,
    });
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [newService, setNewService] = useState<IServiceType>({
        id: 0,
        name: "",
        description: "",
        offers: [],
        address: {
            id: 0,
            street: "",
            city: "",
            postalCode: "",
            country: ""
        },
        userId: userId,
    });

    useEffect(() => {
        const fetchServiceAndOffers = async () => {
            try {
                // First, fetch the service by userId
                const res = await serviceAPI.getServiceByUserId(userId);
                const serviceId = res.id;
                setServiceId(serviceId);
    
                // Then, use the retrieved serviceId to fetch the offers
                const response = await offerAPI.get(serviceId);
                setOffers(response);
            } catch (error: unknown) {
                // Type guard to ensure error is an instance of Error
                if (error instanceof Error) {
                  if (error.message === 'Service not found') {
                    console.error("Service not found:", error);
                    setOffers([]); // Optionally clear offers
                  } else {
                    console.error("An unexpected error occurred:", error);
                  }
                } else {
                  console.error("An unexpected error occurred:", error);
                }
              }
        };
    
        fetchServiceAndOffers();
    }, [userId]);

    const handleOfferChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, files } = e.target as HTMLInputElement;
        if (name === "imageFile" && files && files.length > 0) {
            // Handle the file input
            setNewOffer(prevOffer => ({
                ...prevOffer,
                imageFile: files[0] // Store the selected file
            }));
        } else {
            // Handle other input types
            setNewOffer(prevOffer => ({
                ...prevOffer,
                [name]: name === "duration" || name === "price" ? Number(value) : value
            }));
        }
    };
    
    const handleServiceChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
    
        if (name.startsWith("address.")) {    
            const addressField = name.split(".")[1];
            setNewService(prevService => ({
                ...prevService,
                address: {
                    ...prevService.address,
                    [addressField]: value
                }
            }));
        } else if (name === "imageFile" && e.target instanceof HTMLInputElement && e.target.files) {
            const imageFile = e.target.files[0];
            setNewService(prevService => ({
                ...prevService,
                imageFile: imageFile  // This requires adjustments in the `IServiceType` interface.
            }));
        } else {
            setNewService({ ...newService, [name]: value });
        }
    };

    const handleAddOffer = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    
        const formData = new FormData();
        formData.append('name', newOffer.name);
        formData.append('description', newOffer.description);
        formData.append('duration', `PT${newOffer.duration}M`); // Assuming ISO-8601 duration format
        formData.append('price', newOffer.price.toString());
        formData.append('serviceId', serviceId.toString());
    
        if (newOffer.imageFile) {
            formData.append('imageFile', newOffer.imageFile);
        }
    
        offerAPI.create(formData)
            .then(response => {
                setOffers([...offers, response]);
                setNewOffer({
                    id: 0,
                    name: "",
                    description: "",
                    duration: 0,
                    price: 0,
                    serviceId: 0,
                });
                setIsModalOpen(false);
            })
            .catch(error => {
                console.error("Error adding offer:", error);
            });
    };

    const convertServiceToFormData = (service: IServiceType): FormData => {
        const formData = new FormData();
    
        formData.append('name', service.name);
        formData.append('description', service.description);
        formData.append('userId', service.userId.toString());
    
        if (service.imageFile) {
            formData.append('imageFile', service.imageFile);
        }
    
        formData.append('street', service.address.street);
        formData.append('city', service.address.city);
        formData.append('postalCode', service.address.postalCode);
        formData.append('country', service.address.country);
    
        formData.forEach((value, key) => {
            console.log(`${key}:`, value);
        });

        return formData;
    };
    
    const handleAddService = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = convertServiceToFormData(newService);
    
        try {
            serviceAPI.post(formData)
            .then(() => {
                console.log("redirecting...")
                alert("Service created! refresh to start adding offers");
                navigate(`/service-profile`, { state: { refetch: true } });
            })
        } catch (error) {
            console.error("Error adding service:", error);
        }
    };
    
    if (!serviceId) {
        return (
            <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center py-6">
                <div className="mt-8 w-full max-w-md">
                    <h2 className="text-xl font-semibold mb-4 text-center">Create a New Service</h2>
                    <form onSubmit={handleAddService} className="mt-4 space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Service Name</label>
                            <input type="text" id="name" name="name" value={newService.name} onChange={handleServiceChange} required className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
                        </div>
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                            <textarea id="description" name="description" value={newService.description} onChange={handleServiceChange} required className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"></textarea>
                        </div>
                        <div>
                            <label htmlFor="imageFile" className="block text-sm font-medium text-gray-700">Upload Image</label>
                            <input type="file" id="imageFile" name="imageFile" accept="image/*" onChange={handleServiceChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
                        </div>
                        <div>
                            <label htmlFor="street" className="block text-sm font-medium text-gray-700">Street</label>
                            <input type="text" id="street" name="address.street" value={newService.address.street} onChange={handleServiceChange} required className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
                        </div>
                        <div>
                            <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
                            <input type="text" id="city" name="address.city" value={newService.address.city} onChange={handleServiceChange} required className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
                        </div>
                        <div>
                            <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">Postal Code</label>
                            <input type="text" id="postalCode" name="address.postalCode" value={newService.address.postalCode} onChange={handleServiceChange} required className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
                        </div>
                        <div>
                            <label htmlFor="country" className="block text-sm font-medium text-gray-700">Country</label>
                            <input type="text" id="country" name="address.country" value={newService.address.country} onChange={handleServiceChange} required className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
                        </div>
                        <button type="submit" className="w-full px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition duration-150 ease-in-out">Create Service</button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center py-6">
            <div className="mt-8 w-full max-w-md">
                <h2 className="text-xl font-semibold mb-4 text-center">Your Offers</h2>
                {offers.length > 0 ? (
                    <OfferList offers={offers} serviceId={serviceId}/>
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
                                        <label htmlFor="imageFile" className="block text-sm font-medium text-gray-700">Image Path</label>
                                        <input type="file" accept="image/*" id="imageFile" name="imageFile" onChange={handleOfferChange} required className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
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
