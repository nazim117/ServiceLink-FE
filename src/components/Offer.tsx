import React, { useEffect, useState, Fragment } from 'react';
import { IOfferType } from "../interfaces/IOfferType";
import { useNavigate } from 'react-router-dom';
import { Dialog, Transition } from '@headlessui/react'; // Import Dialog and Transition from Headless UI

interface OfferProps {
  offer: IOfferType;
  index: number;
  serviceId: number;
}

export function Offer({ offer, serviceId, index }: OfferProps) {
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // Track whether modal is open or closed
  const navigate = useNavigate();

  useEffect(() => {
    let url: string | undefined;

    if (offer.imageFile instanceof File) {
      url = URL.createObjectURL(offer.imageFile);
      setImageUrl(url);

      return () => {
        if (url) {
          URL.revokeObjectURL(url);
        }
      };
    } else {
      setImageUrl(offer.imageFile);
    }
  }, [offer.imageFile]);

  const appointmentPath = `/service/${serviceId}/offers/${offer.id}/appointment`;

  // Function to handle button click for appointment navigation
  const handleAppointmentClick = () => {
    navigate(appointmentPath, { state: { offer } });
  };

  // Function to open the modal for "Learn more"
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div key={index} className="offer-item">
        <div className="offer-item-content">
          {imageUrl && (
            <img
              src={imageUrl}
              alt={`${offer.name} image`}
              className="offer-image"
            />
          )}
          <div className="offer-details">
            <h3 className="offer-title">{offer.name}</h3>
            <p className="offer-price">Price: {offer.price}€</p>

            <button
              className="w-full px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition duration-150 ease-in-out"
              onClick={handleAppointmentClick}
            >
              Book
            </button>

            {/* Button to open the "Learn more" modal */}
            <button className="learn-more-button" onClick={openModal}>
              Learn more...
            </button>
          </div>
        </div>
      </div>

      {/* Modal Popup for "Learn more" */}
      <Transition appear show={isModalOpen} as={Fragment}>
        <Dialog as="div" className="fixed inset-0 z-10 overflow-y-auto" onClose={closeModal}>
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
                  {offer.name}
                </Dialog.Title>
                {imageUrl && (
                  <img
                    src={imageUrl}
                    alt={`${offer.name} image`}
                    className="modal-image mt-4 mb-4 rounded-md"
                  />
                )}
                <div className="mt-4">
                  <p className="text-sm text-gray-500">Description: {offer.description}</p>
                  <p className="text-sm text-gray-500">Duration: {offer.duration} minutes</p>
                  <p className="text-sm text-gray-500">Price: {offer.price}€</p>
                </div>

                <div className="mt-6">
                  <button
                    className="w-full px-4 py-2 mb-4 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition duration-150 ease-in-out"
                    onClick={handleAppointmentClick}
                  >
                    Book
                  </button>
                  <button
                    type="button"
                    className="w-full px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition duration-150 ease-in-out"
                    onClick={closeModal}
                  >
                    Close
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
