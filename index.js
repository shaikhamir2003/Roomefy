// Firebase Configuration
const firebaseConfig = {
     apiKey: "AIzaSyBRTGz_G8DBvQbvF8YwGCN9rre-F8GGTD8",
  authDomain: "room-finder-v1.firebaseapp.com",
  databaseURL: "https://room-finder-v1-default-rtdb.firebaseio.com",
  projectId: "room-finder-v1",
  storageBucket: "room-finder-v1.appspot.com",
  messagingSenderId: "156456101448",
  appId: "1:156456101448:web:2639d6d24d58862043da7d",
  measurementId: "G-3QCM5F74WQ"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const auth = firebase.auth();

// DOM Elements
const header = document.querySelector('header');
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const mobileMenu = document.querySelector('.mobile-menu');
const searchOptions = document.querySelectorAll('.search-option');
const audienceFilters = document.querySelectorAll('.audience-filter');
const featuredRooms = document.getElementById('featuredRooms');

// Mobile Menu Toggle
mobileMenuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    mobileMenu.classList.toggle('active');
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.mobile-menu') && !e.target.closest('.mobile-menu-btn')) {
        mobileMenu.classList.remove('active');
    }
});

// Search Options Toggle
searchOptions.forEach(option => {
    option.addEventListener('click', () => {
        searchOptions.forEach(opt => opt.classList.remove('active'));
        option.classList.add('active');
        
        const placeholder = 
            option.dataset.type === 'city' ? 'Search by city...' :
            option.dataset.type === 'campus' ? 'Search near university...' :
            'Search in business district...';
        
        document.querySelector('.search-input').placeholder = placeholder;
    });
});

// Audience Filter
audienceFilters.forEach(filter => {
    filter.addEventListener('click', () => {
        audienceFilters.forEach(f => f.classList.remove('active'));
        filter.classList.add('active');
        filterRooms(filter.dataset.filter);
    });
});

function filterRooms(audience) {
    const rooms = document.querySelectorAll('.room-card');
    rooms.forEach(room => {
        if (audience === 'all' || room.dataset.audience.includes(audience)) {
            room.style.display = 'block';
        } else {
            room.style.display = 'none';
        }
    });
}

// Header Scroll Effect
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
        header.classList.remove('hidden');
        return;
    }
    
    if (currentScroll > lastScroll && !header.classList.contains('hidden')) {
        header.classList.add('hidden');
    } else if (currentScroll < lastScroll && header.classList.contains('hidden')) {
        header.classList.remove('hidden');
    }
    
    lastScroll = currentScroll;
});

// Load Featured Rooms from Firebase
function loadFeaturedRooms() {
    const roomsRef = database.ref('rooms').limitToFirst(6);
    
    roomsRef.on('value', (snapshot) => {
        const rooms = snapshot.val();
        featuredRooms.innerHTML = '';
        
        if (rooms) {
            Object.keys(rooms).forEach((roomId, index) => {
                const room = rooms[roomId];
                createRoomCard(room, index);
            });
        } else {
            // Default rooms if Firebase isn't configured
            const defaultRooms = [
                {
                    id: '1',
                    title: "Campus View Apartment",
                    audience: "student",
                    imageUrl: "https://images.unsplash.com/photo-1529408632839-a54952c491e5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
                    rating: 4.7,
                    reviewCount: 68,
                    price: 550,
                    beds: 2,
                    area: 750,
                    amenities: ['wifi', 'study', 'laundry'],
                    features: ['10 min to campus', 'Study lounge', 'Bike storage']
                },
                {
                    id: '2',
                    title: "Executive Business Suite",
                    audience: "professional",
                    imageUrl: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80",
                    rating: 4.9,
                    reviewCount: 124,
                    price: 1200,
                    beds: 1,
                    area: 650,
                    amenities: ['wifi', 'workspace', 'concierge'],
                    features: ['Downtown location', '24/7 business center', 'Meeting rooms']
                },
                {
                    id: '3',
                    title: "Traveler's Hub Private Room",
                    audience: "traveler",
                    imageUrl: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1980&q=80",
                    rating: 4.5,
                    reviewCount: 89,
                    price: 85,
                    beds: 1,
                    area: 300,
                    amenities: ['wifi', 'kitchen', 'luggage'],
                    features: ['Central location', 'Flexible check-in', 'Tour desk']
                }
            ];
            
            defaultRooms.forEach((room, index) => {
                createRoomCard(room, index);
            });
        }
    });
}

function createRoomCard(room, index) {
    const roomCard = document.createElement('div');
    roomCard.className = 'room-card';
    roomCard.dataset.audience = room.audience;
    roomCard.style.animationDelay = `${0.2 + (index * 0.2)}s`;
    
    const badgeClass = 
        room.audience === 'student' ? 'student' :
        room.audience === 'professional' ? 'professional' : 'traveler';
    
    roomCard.innerHTML = `
        <div class="audience-badge ${badgeClass}">
            ${room.audience === 'student' ? 'Student' : 
              room.audience === 'professional' ? 'Professional' : 'Traveler'}
        </div>
        <img src="${room.imageUrl}" alt="${room.title}" class="room-img">
        <div class="room-info">
            <h3>${room.title}</h3>
            <div class="room-rating">
                ${renderStars(room.rating)}
                <span>${room.rating} (${room.reviewCount} reviews)</span>
            </div>
            <div class="room-price">$${room.price}/month</div>
            <div class="room-features">
                ${room.features.slice(0, 3).map(feature => 
                    `<span class="feature-badge">
                        <i class="fas fa-check"></i> ${feature}
                    </span>`
                ).join('')}
            </div>
            <div class="room-meta">
                <span><i class="fas fa-bed"></i> ${room.beds} bed${room.beds > 1 ? 's' : ''}</span>
                <span><i class="fas fa-ruler-combined"></i> ${room.area} sqft</span>
                ${renderAmenities(room.amenities)}
            </div>
        </div>
    `;
    
    featuredRooms.appendChild(roomCard);
}

function renderStars(rating) {
    let stars = '';
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    
    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    
    return stars;
}

function renderAmenities(amenities) {
    const amenityIcons = {
        'wifi': 'fa-wifi',
        'study': 'fa-book',
        'laundry': 'fa-tshirt',
        'workspace': 'fa-laptop',
        'concierge': 'fa-bell-concierge',
        'kitchen': 'fa-utensils',
        'luggage': 'fa-suitcase'
    };
    
    return amenities.slice(0, 2).map(amenity => 
        `<span><i class="fas ${amenityIcons[amenity]}"></i> ${amenity.charAt(0).toUpperCase() + amenity.slice(1)}</span>`
    ).join('');
}

// Initialize Scroll Animations
function initScrollAnimations() {
    const animateElements = document.querySelectorAll('.feature-card, .room-card, .section-title');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    animateElements.forEach(element => {
        observer.observe(element);
    });
}

// Touch Device Detection
function detectTouchDevice() {
    return 'ontouchstart' in window || navigator.maxTouchPoints;
}

if (detectTouchDevice()) {
    document.body.classList.add('touch-device');
    
    // Optimize hover effects for touch
    const hoverElements = document.querySelectorAll('.room-card, .feature-card, .btn');
    hoverElements.forEach(el => {
        el.addEventListener('touchstart', () => {
            el.classList.add('hover-effect');
        });
        
        el.addEventListener('touchend', () => {
            setTimeout(() => {
                el.classList.remove('hover-effect');
            }, 150);
        });
    });
}

// Initialize on DOM Load
document.addEventListener('DOMContentLoaded', () => {
    loadFeaturedRooms();
    initScrollAnimations();
    
    // Set hero height for mobile
    if (window.innerWidth <= 768) {
        document.querySelector('.hero').style.height = `calc(${window.innerHeight}px - 70px)`;
    }
});

// Handle window resize
window.addEventListener('resize', () => {
    if (window.innerWidth <= 768) {
        document.querySelector('.hero').style.height = `calc(${window.innerHeight}px - 70px)`;
    } else {
        document.querySelector('.hero').style.height = '90vh';
    }
});