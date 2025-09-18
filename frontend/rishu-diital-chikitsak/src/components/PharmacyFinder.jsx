import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Clock, CheckCircle, XCircle, Search } from 'lucide-react';

// Mock pharmacy data - in real app, this would come from your backend
const mockPharmacies = [
  {
    id: 1,
    name: 'ਸਿਹਤ ਮੈਡੀਕਲ ਸਟੋਰ (Sehat Medical Store)',
    address: 'ਮੁੱਖ ਬਾਜ਼ਾਰ, ਪਿੰਡ ਰਾਮਪੁਰ (Main Bazaar, Village Rampur)',
    phone: '+91 98765 43210',
    distance: '0.5 km',
    isOpen: true,
    openHours: '8:00 AM - 10:00 PM',
    stock: {
      'Paracetamol': { available: true, price: '₹15', quantity: '50+ tablets' },
      'Cough syrup': { available: true, price: '₹85', quantity: '10+ bottles' },
      'ORS': { available: true, price: '₹12', quantity: '20+ packets' },
      'Antacid': { available: false, price: '₹25', quantity: '0' },
      'Ibuprofen': { available: true, price: '₹22', quantity: '30+ tablets' }
    },
    rating: 4.5,
    reviews: 127
  },
  {
    id: 2,
    name: 'ਜੀਵਨ ਫਾਰਮੇਸੀ (Jeevan Pharmacy)',
    address: 'ਸਕੂਲ ਰੋਡ, ਪਿੰਡ ਸੁਖਪੁਰ (School Road, Village Sukhpur)',
    phone: '+91 98765 43211',
    distance: '1.2 km',
    isOpen: true,
    openHours: '7:00 AM - 9:00 PM',
    stock: {
      'Paracetamol': { available: true, price: '₹18', quantity: '30+ tablets' },
      'Cough syrup': { available: false, price: '₹85', quantity: '0' },
      'ORS': { available: true, price: '₹10', quantity: '15+ packets' },
      'Antacid': { available: true, price: '₹28', quantity: '25+ tablets' },
      'Ibuprofen': { available: true, price: '₹20', quantity: '40+ tablets' }
    },
    rating: 4.2,
    reviews: 89
  },
  {
    id: 3,
    name: 'ਸਰਬੱਤ ਮੈਡੀਕਲ (Sarbat Medical)',
    address: 'ਗੁਰਦੁਆਰਾ ਰੋਡ, ਪਿੰਡ ਅਮਨਪੁਰ (Gurudwara Road, Village Amanpur)',
    phone: '+91 98765 43212',
    distance: '2.1 km',
    isOpen: false,
    openHours: '9:00 AM - 8:00 PM',
    stock: {
      'Paracetamol': { available: true, price: '₹16', quantity: '60+ tablets' },
      'Cough syrup': { available: true, price: '₹90', quantity: '8+ bottles' },
      'ORS': { available: true, price: '₹14', quantity: '25+ packets' },
      'Antacid': { available: true, price: '₹24', quantity: '35+ tablets' },
      'Ibuprofen': { available: true, price: '₹25', quantity: '20+ tablets' }
    },
    rating: 4.7,
    reviews: 156
  }
];

const PharmacyFinder = ({ recommendedMedicines = [] }) => {
  const [pharmacies, setPharmacies] = useState(mockPharmacies);
  const [selectedPharmacy, setSelectedPharmacy] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState('distance');

  const filteredPharmacies = pharmacies
    .filter(pharmacy => 
      pharmacy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pharmacy.address.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'distance':
          return parseFloat(a.distance) - parseFloat(b.distance);
        case 'rating':
          return b.rating - a.rating;
        case 'open':
          return b.isOpen - a.isOpen;
        default:
          return 0;
      }
    });

  const checkMedicineAvailability = (pharmacy, medicine) => {
    return pharmacy.stock[medicine]?.available || false;
  };

  const getMedicinePrice = (pharmacy, medicine) => {
    return pharmacy.stock[medicine]?.price || 'N/A';
  };

  const callPharmacy = (phone) => {
    window.open(`tel:${phone}`, '_self');
  };

  const getDirections = (address) => {
    const encodedAddress = encodeURIComponent(address);
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank');
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          ਦਵਾਈ ਦੀਆਂ ਦੁਕਾਨਾਂ (Nearby Pharmacies)
        </h2>
        <p className="text-gray-600">
          ਆਪਣੇ ਨੇੜੇ ਦੀਆਂ ਦਵਾਈ ਦੀਆਂ ਦੁਕਾਨਾਂ ਅਤੇ ਉਨ੍ਹਾਂ ਦਾ ਸਟਾਕ ਦੇਖੋ
        </p>
      </div>

      {/* Search and Filter */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="ਦੁਕਾਨ ਦਾ ਨਾਮ ਜਾਂ ਪਤਾ ਖੋਜੋ (Search pharmacy name or address)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="distance">ਦੂਰੀ ਅਨੁਸਾਰ (By Distance)</option>
          <option value="rating">ਰੇਟਿੰਗ ਅਨੁਸਾਰ (By Rating)</option>
          <option value="open">ਖੁੱਲ੍ਹੀਆਂ ਪਹਿਲਾਂ (Open First)</option>
        </select>
      </div>

      {/* Recommended Medicines */}
      {recommendedMedicines.length > 0 && (
        <div className="mb-8 p-6 bg-blue-50 rounded-lg">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            💊 ਸਿਫਾਰਸ਼ ਕੀਤੀਆਂ ਦਵਾਈਆਂ (Recommended Medicines)
          </h3>
          <div className="flex flex-wrap gap-2">
            {recommendedMedicines.map((medicine, index) => (
              <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {medicine}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Pharmacy List */}
      <div className="grid lg:grid-cols-2 gap-6">
        {filteredPharmacies.map((pharmacy) => (
          <motion.div
            key={pharmacy.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg p-6 border hover:shadow-xl transition-shadow"
          >
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-1">{pharmacy.name}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                  <MapPin size={16} />
                  <span>{pharmacy.address}</span>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-blue-600 font-medium">{pharmacy.distance}</span>
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-500">★</span>
                    <span>{pharmacy.rating} ({pharmacy.reviews})</span>
                  </div>
                </div>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                pharmacy.isOpen 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {pharmacy.isOpen ? 'ਖੁੱਲ੍ਹੀ (Open)' : 'ਬੰਦ (Closed)'}
              </div>
            </div>

            {/* Opening Hours */}
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
              <Clock size={16} />
              <span>{pharmacy.openHours}</span>
            </div>

            {/* Medicine Stock */}
            {recommendedMedicines.length > 0 && (
              <div className="mb-4">
                <h4 className="font-semibold mb-2">ਸਿਫਾਰਸ਼ ਕੀਤੀਆਂ ਦਵਾਈਆਂ ਦੀ ਉਪਲਬਧਤਾ:</h4>
                <div className="space-y-2">
                  {recommendedMedicines.map((medicine) => {
                    const available = checkMedicineAvailability(pharmacy, medicine);
                    const price = getMedicinePrice(pharmacy, medicine);
                    const stock = pharmacy.stock[medicine];
                    
                    return (
                      <div key={medicine} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div className="flex items-center gap-2">
                          {available ? (
                            <CheckCircle className="text-green-500" size={16} />
                          ) : (
                            <XCircle className="text-red-500" size={16} />
                          )}
                          <span className="font-medium">{medicine}</span>
                        </div>
                        <div className="text-right text-sm">
                          <div className="font-semibold">{price}</div>
                          {stock && (
                            <div className="text-gray-600">{stock.quantity}</div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => callPharmacy(pharmacy.phone)}
                className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
              >
                <Phone size={16} />
                ਕਾਲ ਕਰੋ (Call)
              </button>
              <button
                onClick={() => getDirections(pharmacy.address)}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <MapPin size={16} />
                ਰਾਹ ਦਿਖਾਓ (Directions)
              </button>
            </div>

            {/* View Full Stock Button */}
            <button
              onClick={() => setSelectedPharmacy(selectedPharmacy === pharmacy.id ? null : pharmacy.id)}
              className="w-full mt-3 text-blue-600 hover:text-blue-800 font-medium text-sm"
            >
              {selectedPharmacy === pharmacy.id ? 'ਘੱਟ ਦਿਖਾਓ (Show Less)' : 'ਪੂਰਾ ਸਟਾਕ ਦੇਖੋ (View Full Stock)'}
            </button>

            {/* Full Stock Display */}
            {selectedPharmacy === pharmacy.id && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-4 p-4 bg-gray-50 rounded-lg"
              >
                <h4 className="font-semibold mb-3">ਪੂਰਾ ਸਟਾਕ (Full Stock):</h4>
                <div className="grid grid-cols-1 gap-2">
                  {Object.entries(pharmacy.stock).map(([medicine, details]) => (
                    <div key={medicine} className="flex items-center justify-between p-2 bg-white rounded">
                      <div className="flex items-center gap-2">
                        {details.available ? (
                          <CheckCircle className="text-green-500" size={16} />
                        ) : (
                          <XCircle className="text-red-500" size={16} />
                        )}
                        <span>{medicine}</span>
                      </div>
                      <div className="text-right text-sm">
                        <div className="font-semibold">{details.price}</div>
                        <div className="text-gray-600">{details.quantity}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {filteredPharmacies.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🏪</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            ਕੋਈ ਦੁਕਾਨ ਨਹੀਂ ਮਿਲੀ (No pharmacies found)
          </h3>
          <p className="text-gray-500">
            ਆਪਣੀ ਖੋਜ ਬਦਲ ਕੇ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ (Try changing your search terms)
          </p>
        </div>
      )}
    </div>
  );
};

export default PharmacyFinder;