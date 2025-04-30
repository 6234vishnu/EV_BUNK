import React, { useState, useEffect } from 'react';
import '../../../assets/css/user/NewCarsShowcase.css';
import { ArrowLeft, ArrowRight, ChevronDown, Star } from 'lucide-react';

// Car data interface
interface CarSpec {
  id: number;
  name: string;
  brand: string;
  price: string;
  engine: string;
  power: string;
  torque: string;
  acceleration: string;
  topSpeed: string;
  fuelEfficiency: string;
  image: string;
  rating: number;
  featured: boolean;
}

const NewCarsShowcase: React.FC = () => {
  const [selectedCar, setSelectedCar] = useState<CarSpec | null>(null);
  const [activeTab, setActiveTab] = useState<string>('specs');
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const [carouselIndex, setCarouselIndex] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterBrand, setFilterBrand] = useState<string>('all');

  // Sample car data
  const cars: CarSpec[] = [
    {
      id: 1,
      name: "Model S Plaid",
      brand: "Tesla",
      price: "$129,990",
      engine: "Electric (Tri-Motor)",
      power: "1,020 hp",
      torque: "1,050 lb-ft",
      acceleration: "0-60 mph in 1.99s",
      topSpeed: "200 mph",
      fuelEfficiency: "396 miles range",
      image: "/images/car1.png",
      rating: 4.9,
      featured: true
    },
    {
      id: 2,
      name: "Mustang Mach-E GT",
      brand: "Ford",
      price: "$69,900",
      engine: "Electric (Dual-Motor)",
      power: "480 hp",
      torque: "634 lb-ft",
      acceleration: "0-60 mph in 3.5s",
      topSpeed: "124 mph",
      fuelEfficiency: "270 miles range",
      image: "/images/car6.jpg",
      rating: 4.6,
      featured: false
    },
    {
      id: 3,
      name: "BMW i5 M60",
      brand: "BMW",
      price: "$111,100",
      engine: "4.4L Twin-Turbo V8",
      power: "617 hp",
      torque: "553 lb-ft",
      acceleration: "0-60 mph in 3.1s",
      topSpeed: "190 mph",
      fuelEfficiency: "17 mpg combined",
      image: "/images/car5.jpg",
      rating: 4.8,
      featured: true
    },
    {
      id: 4,
      name: "Ioniq 5 N",
      brand: "Hyundai",
      price: "$66,100",
      engine: "Electric (Dual-Motor)",
      power: "641 hp",
      torque: "568 lb-ft",
      acceleration: "0-60 mph in 3.3s",
      topSpeed: "162 mph",
      fuelEfficiency: "220 miles range",
      image: "/images/car2.jpg",
      rating: 4.7,
      featured: false
    },
    {
      id: 5,
      name: "911 GT3 RS",
      brand: "Porsche",
      price: "$223,800",
      engine: "4.0L Flat-6",
      power: "518 hp",
      torque: "346 lb-ft",
      acceleration: "0-60 mph in 3.0s",
      topSpeed: "184 mph",
      fuelEfficiency: "15 mpg combined",
      image: "/images/car3.jpg",
      rating: 4.9,
      featured: true
    },
    {
      id: 6,
      name: "Rivian R1S",
      brand: "Rivian",
      price: "$78,000",
      engine: "Electric (Quad-Motor)",
      power: "835 hp",
      torque: "908 lb-ft",
      acceleration: "0-60 mph in 3.0s",
      topSpeed: "125 mph",
      fuelEfficiency: "316 miles range",
      image: "/images/car4.jpg",
      rating: 4.5,
      featured: false
    }
  ];

  useEffect(() => {
    // Set the first car as selected by default
    setSelectedCar(cars[0]);
  }, []);

  // Filter cars by brand
  const filteredCars = filterBrand === 'all' 
    ? cars 
    : cars.filter(car => car.brand.toLowerCase() === filterBrand.toLowerCase());

  // Get featured cars for the carousel
  const featuredCars = cars.filter(car => car.featured);

  // Handle next slide in carousel
  const handleNextSlide = () => {
    setCarouselIndex((prevIndex) => 
      prevIndex === featuredCars.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Handle previous slide in carousel
  const handlePrevSlide = () => {
    setCarouselIndex((prevIndex) => 
      prevIndex === 0 ? featuredCars.length - 1 : prevIndex - 1
    );
  };

  // Render stars for rating
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} className="newCarsUserStar newCarsUserStarFilled" size={16} />);
    }

    if (hasHalfStar) {
      stars.push(<Star key="half" className="newCarsUserStar newCarsUserStarHalf" size={16} />);
    }

    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="newCarsUserStar" size={16} />);
    }

    return stars;
  };

  return (
    <div className="newCarsUserContainer">
      {/* Header Section */}
      <header className="newCarsUserHeader">
      <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <img
                style={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "120px",
                }}
                src="/images/png-transparent-bmw-car-logo.png"
                alt="logo"
              />
            </div>
        <h1 className="newCarsUserTitle">Discover New Cars</h1>
        <p className="newCarsUserSubtitle">Explore the latest models with detailed specifications</p>
        
       
      </header>

      {/* Featured Cars Carousel */}
      <section className="newCarsUserCarousel">
        <h2 className="newCarsUserSectionTitle">Featured Models</h2>
        <div className="newCarsUserCarouselContainer">
          <button 
          style={{color:"white",backgroundColor:"#515151"}}
            className="newCarsUserCarouselBtn newCarsUserCarouselBtnLeft"
            onClick={handlePrevSlide}
          >
             ←
          </button>
          
          <div className="newCarsUserCarouselSlide">
            <div className="newCarsUserCarouselImage">
              <img 
                src={featuredCars[carouselIndex]?.image || "/images/car5.jpg"} 
                alt={featuredCars[carouselIndex]?.name || "Featured car"} 
              />
            </div>
            <div className="newCarsUserCarouselContent">
              <h3 className="newCarsUserCarouselTitle">
                {featuredCars[carouselIndex]?.brand} {featuredCars[carouselIndex]?.name}
              </h3>
              <div className="newCarsUserCarouselRating">
                {featuredCars[carouselIndex] ? renderStars(featuredCars[carouselIndex].rating) : null}
                <span className="newCarsUserRatingText">
                  {featuredCars[carouselIndex]?.rating.toFixed(1)}
                </span>
              </div>
              <p className="newCarsUserCarouselPrice">
                Starting at {featuredCars[carouselIndex]?.price}
              </p>
              <div className="newCarsUserCarouselSpecs">
                <div className="newCarsUserCarouselSpec">
                  <span className="newCarsUserSpecLabel">Engine</span>
                  <span className="newCarsUserSpecValue">{featuredCars[carouselIndex]?.engine}</span>
                </div>
                <div className="newCarsUserCarouselSpec">
                  <span className="newCarsUserSpecLabel">Power</span>
                  <span className="newCarsUserSpecValue">{featuredCars[carouselIndex]?.power}</span>
                </div>
                <div className="newCarsUserCarouselSpec">
                  <span className="newCarsUserSpecLabel">0-60 mph</span>
                  <span className="newCarsUserSpecValue">{featuredCars[carouselIndex]?.acceleration.split(' in ')[1]}</span>
                </div>
              </div>
              <button className="newCarsUserCarouselBtn newCarsUserCarouselBtnDetails">
                View Details
              </button>
            </div>
          </div>
          
          <button 
           style={{color:"white",backgroundColor:"#515151"}}
            className="newCarsUserCarouselBtn newCarsUserCarouselBtnRight"
            onClick={handleNextSlide}
          >
             →
          </button>
        </div>
        
        <div className="newCarsUserCarouselIndicators">
          {featuredCars.map((_, index) => (
            <span 
              key={index} 
              className={`newCarsUserCarouselIndicator ${index === carouselIndex ? 'newCarsUserCarouselIndicatorActive' : ''}`}
              onClick={() => setCarouselIndex(index)}
            />
          ))}
        </div>
      </section>

      {/* Filter Section */}
      <section className="newCarsUserFilterSection">
        <div 
          className="newCarsUserFilterHeader" 
          onClick={() => setIsFilterOpen(!isFilterOpen)}
        >
          <h2 className="newCarsUserFilterTitle">Filter Cars</h2>
          <ChevronDown 
            className={`newCarsUserFilterIcon ${isFilterOpen ? 'newCarsUserFilterIconRotated' : ''}`}
            size={20}
          />
        </div>
        
        {isFilterOpen && (
          <div className="newCarsUserFilterContent">
            <div className="newCarsUserFilterGroup">
              <h3 className="newCarsUserFilterGroupTitle">Brand</h3>
              <div className="newCarsUserFilterOptions">
                <button 
                  className={`newCarsUserFilterBtn ${filterBrand === 'all' ? 'newCarsUserFilterBtnActive' : ''}`}
                  onClick={() => setFilterBrand('all')}
                >
                  All Brands
                </button>
                {Array.from(new Set(cars.map(car => car.brand))).map(brand => (
                  <button 
                    key={brand} 
                    className={`newCarsUserFilterBtn ${filterBrand === brand ? 'newCarsUserFilterBtnActive' : ''}`}
                    onClick={() => setFilterBrand(brand)}
                  >
                    {brand}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Cars Grid/List Section */}
      <section className="newCarsUserCarsSection">
        <h2 className="newCarsUserSectionTitle">Latest Models</h2>
        
        <div className={`newCarsUserCarsContainer ${viewMode === 'list' ? 'newCarsUserListView' : 'newCarsUserGridView'}`}>
          {filteredCars.map(car => (
            <div 
              key={car.id} 
              className="newCarsUserCarCard"
              onClick={() => setSelectedCar(car)}
            >
              <div className="newCarsUserCarImageContainer">
                <img 
                  src={car.image} 
                  alt={`${car.brand} ${car.name}`} 
                  className="newCarsUserCarImage" 
                />
                <div className="newCarsUserCarBadge">{car.brand}</div>
              </div>
              
              <div className="newCarsUserCarInfo">
                <h3 className="newCarsUserCarName">{car.brand} {car.name}</h3>
                <div className="newCarsUserCarRating">
                  {renderStars(car.rating)}
                  <span className="newCarsUserRatingText">{car.rating.toFixed(1)}</span>
                </div>
                <p className="newCarsUserCarPrice">{car.price}</p>
                
                <div className="newCarsUserCarQuickSpecs">
                  <div className="newCarsUserQuickSpec">
                    <span className="newCarsUserQuickSpecLabel">Engine</span>
                    <span className="newCarsUserQuickSpecValue">{car.engine}</span>
                  </div>
                  <div className="newCarsUserQuickSpec">
                    <span className="newCarsUserQuickSpecLabel">Power</span>
                    <span className="newCarsUserQuickSpecValue">{car.power}</span>
                  </div>
                  <div className="newCarsUserQuickSpec">
                    <span className="newCarsUserQuickSpecLabel">0-60</span>
                    <span className="newCarsUserQuickSpecValue">{car.acceleration.split(' in ')[1]}</span>
                  </div>
                </div>
                
                <button className="newCarsUserViewDetailsBtn">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Car Details Modal */}
      {selectedCar && (
        <div className="newCarsUserModal">
          <div className="newCarsUserModalContent">
            <button 
              className="newCarsUserModalCloseBtn"
              onClick={() => setSelectedCar(null)}
            >
              ×
            </button>
            
            <div className="newCarsUserModalHeader">
              <img 
                src={selectedCar.image} 
                alt={`${selectedCar.brand} ${selectedCar.name}`} 
                className="newCarsUserModalImage" 
              />
              <div className="newCarsUserModalHeaderContent">
                <h2 className="newCarsUserModalTitle">{selectedCar.brand} {selectedCar.name}</h2>
                <div className="newCarsUserModalRating">
                  {renderStars(selectedCar.rating)}
                  <span className="newCarsUserRatingText">{selectedCar.rating.toFixed(1)}</span>
                </div>
                <p className="newCarsUserModalPrice">{selectedCar.price}</p>
              </div>
            </div>
            
            <div className="newCarsUserModalTabs">
              <button 
                className={`newCarsUserModalTab ${activeTab === 'specs' ? 'newCarsUserModalTabActive' : ''}`}
                onClick={() => setActiveTab('specs')}
              >
                Specifications
              </button>
              <button 
                className={`newCarsUserModalTab ${activeTab === 'features' ? 'newCarsUserModalTabActive' : ''}`}
                onClick={() => setActiveTab('features')}
              >
                Features
              </button>
              <button 
                className={`newCarsUserModalTab ${activeTab === 'gallery' ? 'newCarsUserModalTabActive' : ''}`}
                onClick={() => setActiveTab('gallery')}
              >
                Gallery
              </button>
            </div>
            
            <div className="newCarsUserModalTabContent">
              {activeTab === 'specs' && (
                <div className="newCarsUserModalSpecs">
                  <div className="newCarsUserModalSpec">
                    <span className="newCarsUserModalSpecLabel">Engine</span>
                    <span className="newCarsUserModalSpecValue">{selectedCar.engine}</span>
                  </div>
                  <div className="newCarsUserModalSpec">
                    <span className="newCarsUserModalSpecLabel">Power</span>
                    <span className="newCarsUserModalSpecValue">{selectedCar.power}</span>
                  </div>
                  <div className="newCarsUserModalSpec">
                    <span className="newCarsUserModalSpecLabel">Torque</span>
                    <span className="newCarsUserModalSpecValue">{selectedCar.torque}</span>
                  </div>
                  <div className="newCarsUserModalSpec">
                    <span className="newCarsUserModalSpecLabel">Acceleration</span>
                    <span className="newCarsUserModalSpecValue">{selectedCar.acceleration}</span>
                  </div>
                  <div className="newCarsUserModalSpec">
                    <span className="newCarsUserModalSpecLabel">Top Speed</span>
                    <span className="newCarsUserModalSpecValue">{selectedCar.topSpeed}</span>
                  </div>
                  <div className="newCarsUserModalSpec">
                    <span className="newCarsUserModalSpecLabel">Fuel Efficiency</span>
                    <span className="newCarsUserModalSpecValue">{selectedCar.fuelEfficiency}</span>
                  </div>
                </div>
              )}
              
              {activeTab === 'features' && (
                <div className="newCarsUserModalFeatures">
                  <p>Features information would be displayed here.</p>
                </div>
              )}
              
              {activeTab === 'gallery' && (
                <div className="newCarsUserModalGallery">
                  <p>Gallery images would be displayed here.</p>
                </div>
              )}
            </div>
            
            <div className="newCarsUserModalActions">
              <button className="newCarsUserModalActionBtn newCarsUserModalTestDriveBtn">
                Book a Test Drive
              </button>
              <button className="newCarsUserModalActionBtn newCarsUserModalCompareBtn">
                Add to Compare
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewCarsShowcase;