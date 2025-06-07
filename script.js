
        // Initialize EmailJS (you'll need to set up your own EmailJS account)
        // emailjs.init("YOUR_USER_ID");

        // Set minimum date to today
        document.getElementById('pickup-date').min = new Date().toISOString().split('T')[0];

        // Map initialization
        let map;
        let pickupMarker, deliveryMarker;
        let mapInitialized = false;

        function initMap() {
            try {
                // Wait for Leaflet to be fully loaded
                if (typeof L === 'undefined') {
                    setTimeout(initMap, 100);
                    return;
                }

                // Initialize map centered on New York (you can change this)
                map = L.map('map', {
                    center: [40.7128, -74.0060],
                    zoom: 12,
                    zoomControl: true,
                    scrollWheelZoom: true
                });
                
                // Add OpenStreetMap tiles
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '© OpenStreetMap contributors',
                    maxZoom: 19
                }).addTo(map);

                // Add a default marker to show the map is working
                L.marker([40.7128, -74.0060])
                    .addTo(map)
                    .bindPopup('Service Area Center<br>Click anywhere to set pickup/delivery points')
                    .openPopup();

                mapInitialized = true;

                // Add click event to map
                map.on('click', function(e) {
                    const lat = e.latlng.lat.toFixed(6);
                    const lng = e.latlng.lng.toFixed(6);
                    
                    // Alternate between pickup and delivery points
                    if (!pickupMarker) {
                        pickupMarker = L.marker([e.latlng.lat, e.latlng.lng], {
                            icon: L.icon({
                                iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
                                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                                iconSize: [25, 41],
                                iconAnchor: [12, 41],
                                popupAnchor: [1, -34],
                                shadowSize: [41, 41]
                            })
                        }).addTo(map)
                            .bindPopup('📍 Pickup Location<br>' + lat + ', ' + lng)
                            .openPopup();
                        
                        document.getElementById('pickup-location').value = `${lat}, ${lng}`;
                        updateMapInfo('Click again to set delivery location');
                        
                    } else if (!deliveryMarker) {
                        deliveryMarker = L.marker([e.latlng.lat, e.latlng.lng], {
                            icon: L.icon({
                                iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
                                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                                iconSize: [25, 41],
                                iconAnchor: [12, 41],
                                popupAnchor: [1, -34],
                                shadowSize: [41, 41]
                            })
                        }).addTo(map)
                            .bindPopup('🎯 Delivery Location<br>' + lat + ', ' + lng)
                            .openPopup();
                        
                        document.getElementById('delivery-location').value = `${lat}, ${lng}`;
                        updateMapInfo('Both locations set! You can click to reset.');
                        
                    } else {
                        // Reset both markers
                        map.removeLayer(pickupMarker);
                        map.removeLayer(deliveryMarker);
                        pickupMarker = null;
                        deliveryMarker = null;
                        document.getElementById('pickup-location').value = '';
                        document.getElementById('delivery-location').value = '';
                        updateMapInfo('Click to set pickup location');
                    }
                });

                // Force map to resize after initialization
                setTimeout(() => {
                    map.invalidateSize();
                }, 100);

                console.log('Map initialized successfully');
                
            } catch (error) {
                console.error('Error initializing map:', error);
                // Fallback: show static map info
                document.getElementById('map').innerHTML = 
                    '<div style="height: 400px; display: flex; align-items: center; justify-content: center; background: #f8f9fa; color: #666; text-align: center; flex-direction: column;">' +
                    '<h3>Interactive Map</h3>' +
                    '<p>Map loading... Please refresh if it doesn\'t appear.</p>' +
                    '<p>You can manually enter addresses in the form fields.</p>' +
                    '</div>';
            }
        }

        function updateMapInfo(message) {
            const mapInfo = document.querySelector('.map-info p:last-child');
            if (mapInfo) {
                mapInfo.textContent = message;
            }
        }

        // Initialize map when page loads - multiple attempts
        function tryInitMap() {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', initMap);
            } else {
                setTimeout(initMap, 500);
            }
        }

        // Try to initialize map
        tryInitMap();

        // Also try when window loads
        window.addEventListener('load', () => {
            if (!mapInitialized) {
                setTimeout(initMap, 1000);
            }
        });

        // Form handling
        document.getElementById('bookingForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simulate form submission
            const successMsg = document.getElementById('bookingSuccess');
            const errorMsg = document.getElementById('bookingError');
            
            // Hide any existing messages
            successMsg.style.display = 'none';
            errorMsg.style.display = 'none';
            
            // Simulate processing
            setTimeout(() => {
                // In a real application, you would send this data to your backend
                successMsg.style.display = 'block';
                this.reset();
                
                // Reset map markers
                if (pickupMarker) {
                    map.removeLayer(pickupMarker);
                    pickupMarker = null;
                }
                if (deliveryMarker) {
                    map.removeLayer(deliveryMarker);
                    deliveryMarker = null;
                }
            }, 1000);
        });

        document.getElementById('contactForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const successMsg = document.getElementById('contactSuccess');
            const errorMsg = document.getElementById('contactError');
            
            successMsg.style.display = 'none';
            errorMsg.style.display = 'none';
            
            setTimeout(() => {
                successMsg.style.display = 'block';
                this.reset();
            }, 1000);
        });

        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Add animation on scroll
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe service cards
        document.querySelectorAll('.service-card').forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(card);
        });
    