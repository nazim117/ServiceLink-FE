import { IOfferType } from "../interfaces/IOfferType";

interface OfferListProps{
    offers: IOfferType[];
}

function OfferList({offers}: OfferListProps){

    return(
        <div>
            {
                offers.map((offer: IOfferType, index: number) => (
                    <div key={index} className="bg-white p-4 rounded-lg shadow-md mb-4 border border-gray-300">
                        <h3 className="text-lg font-medium">{offer.name}</h3>
                        <p className="text-sm text-gray-600">{offer.description}</p>
                        <p className="text-sm">Duration: {offer.duration} minutes</p>
                        <p className="text-sm">Price: ${offer.price}</p>
                        <img src={offer.imagePath} alt={offer.name} className="w-full h-32 object-cover mt-2 rounded-md"/>
                    </div>
                ))
            }
        </div>
    )
}

export default OfferList;