const { supabase } = require("../config/supabase");

async function getPackages() {
	const { data: packageData, error } = await supabase.from("packages").select(`
		id,
		title,
		location,
		price,
		duration,
		rating,
		description,
		type,
		style,
		excludes,
		packageImages (*)
	`);
	if (error) {
		const err = new Error("Error fetching packages");
		err.cause = error;
		throw err;
	}

	return (packageData || []).map((pkg) => ({
		id: pkg.id,
		title: pkg.title,
		location: pkg.location,
		price: pkg.price,
		duration: pkg.duration,
		rating: pkg.rating,
		description: pkg.description,
		type: pkg.type,
		style: pkg.style,
		excludes: pkg.excludes || [],
		image: pkg.packageImages?.[0]?.img || null,
	}));
}

async function getPackageById(id) {
	console.log("Fetching package with ID:", id);
	
	const { data: packageData, error } = await supabase
		.from("packages")
		.select("*")
		.eq("id", id)
		.single();
		
	if (error) {
		console.error("Error fetching package:", error);
		const err = new Error("Error fetching package");
		err.cause = error;
		throw err;
	}

	console.log("Package data fetched:", packageData);

	// Fetch related images and itinerary
	const [{ data: images }, { data: itinerary }] = await Promise.all([
		supabase.from("packageImages").select("*").eq("packageId", id).order("created_at", { ascending: true }),
		supabase.from("itinerary").select("*").eq("packageId", id).order("day", { ascending: true }),
	]);

	console.log("Images fetched:", images);
	console.log("Itinerary fetched:", itinerary);

	const result = { 
		...packageData, 
		images: images || [], 
		itinerary: itinerary || [] 
	};
	
	console.log("Final package result:", result);
	return result;
}

async function createPackage(payload) {
	const { images, excludes, itinerary, ...packageData } = payload;
	
	// Clean up the package data to match database schema exactly
	const cleanPackageData = {
		title: packageData.title,
		location: packageData.location,
		price: packageData.price,
		originalPrice: packageData.originalPrice,
		duration: parseInt(packageData.duration) || 1, // Ensure duration is a number
		rating: packageData.rating,
		reviews: packageData.reviews,
		description: packageData.description,
		destinationId: packageData.destinationId,
		maxGuests: packageData.maxGuests,
		minGuests: packageData.minGuests,
		highlights: packageData.highlights || [],
		includes: packageData.includes || [],
		excludes: excludes || [],
		amenities: packageData.amenities || [],
		type: packageData.type,
		style: packageData.style,
	};
	

	const { data, error } = await supabase
		.from("packages")
		.insert([cleanPackageData])
		.select()
		.single();
		
	if (error) {
		console.error("Supabase error:", error);
		const err = new Error(`Error creating package: ${error.message}`);
		err.cause = error;
		throw err;
	}

	console.log("Package created successfully with ID:", data.id);

	// Insert images if provided
	if (images && images.length > 0) {
		const imageData = images.map((img) => ({
			packageId: data.id,
			img: img,
		}));

		console.log("Inserting images:", imageData);
		const { error: imageError } = await supabase
			.from("packageImages")
			.insert(imageData);
		
		if (imageError) {
			console.error("Error inserting images:", imageError);
		} else {
			console.log("Images inserted successfully");
		}
	}

	// Insert itinerary if provided
	if (itinerary && itinerary.length > 0) {
		const itineraryData = itinerary.map((item, index) => ({
			packageId: data.id,
			day: index + 1,
			title: item.title || `Day ${index + 1}`,
			description: item.description || '', // Description is now a string
		}));

		console.log("Inserting itinerary:", itineraryData);
		const { error: itineraryError } = await supabase
			.from("itinerary")
			.insert(itineraryData);
		
		if (itineraryError) {
			console.error("Error inserting itinerary:", itineraryError);
		} else {
			console.log("Itinerary inserted successfully");
		}
	}

	return data;
}

async function updatePackage(id, payload) {
	const { images, excludes, itinerary, ...packageData } = payload;
	
	// Include excludes field in the update data
	if (excludes !== undefined) {
		packageData.excludes = excludes;
	}
	
	const { data, error } = await supabase
		.from("packages")
		.update(packageData)
		.eq("id", id)
		.select()
		.single();
	if (error) {
		console.error("Supabase error:", error);
		const err = new Error(`Error updating package: ${error.message}`);
		err.cause = error;
		throw err;
	}

	// Update images if provided
	if (images !== undefined) {
		// Delete existing images
		await supabase.from("packageImages").delete().eq("packageId", id);
		
		// Insert new images if any
		if (images && images.length > 0) {
			const imageData = images.map((img) => ({
				packageId: id,
				img: img,
			}));

			const { error: imageError } = await supabase
				.from("packageImages")
				.insert(imageData);
			
			if (imageError) {
				console.error("Error inserting images:", imageError);
			}
		}
	}

	// Update itinerary if provided
	if (itinerary !== undefined) {
		// Delete existing itinerary
		await supabase.from("itinerary").delete().eq("packageId", id);
		
		// Insert new itinerary if any
		if (itinerary && itinerary.length > 0) {
			const itineraryData = itinerary.map((item, index) => ({
				packageId: id,
				day: index + 1,
				title: item.title || `Day ${index + 1}`,
				description: item.description || '', // Description is now a string
			}));

			const { error: itineraryError } = await supabase
				.from("itinerary")
				.insert(itineraryData);
			
			if (itineraryError) {
				console.error("Error inserting itinerary:", itineraryError);
			}
		}
	}

	return data;
}

async function deletePackage(id) {
	try {
		console.log(`Starting deletion process for package ID: ${id}`);
		
		// Check if package exists first
		const { data: packageExists, error: checkError } = await supabase
			.from("packages")
			.select("id")
			.eq("id", id)
			.single();
			
		if (checkError || !packageExists) {
			throw new Error(`Package with ID ${id} not found`);
		}

		// Delete related records in packageImages table
		console.log("Deleting package images...");
		const { error: imagesError } = await supabase
			.from("packageImages")
			.delete()
			.eq("packageId", id);
		
		if (imagesError) {
			console.error("Error deleting package images:", imagesError);
		} else {
			console.log("Package images deleted successfully");
		}

		// Delete related records in packageItinerary table
		console.log("Deleting package itinerary...");
		const { error: itineraryError } = await supabase
			.from("packageItinerary")
			.delete()
			.eq("packageId", id);
		
		if (itineraryError) {
			console.error("Error deleting package itinerary:", itineraryError);
		} else {
			console.log("Package itinerary deleted successfully");
		}

		// Finally, delete the package itself
		console.log("Deleting main package record...");
		const { error: packageError } = await supabase
			.from("packages")
			.delete()
			.eq("id", id);
			
		if (packageError) {
			console.error("Error deleting package:", packageError);
			throw new Error(`Failed to delete package: ${packageError.message}`);
		}
		
		console.log("Package deleted successfully");
		return { success: true };
	} catch (error) {
		console.error("Delete package error:", error);
		throw error;
	}
}

async function searchPackages(searchTerm, filters = {}) {
	const { destinationId, minPrice, maxPrice, minRating, maxGuests, minGuests, type, style, duration, groupSize } = filters;
	
	let query = supabase
		.from("packages")
		.select(`
			id,
			title,
			location,
			price,
			originalPrice,
			duration,
			rating,
			reviews,
			description,
			maxGuests,
			minGuests,
			highlights,
			includes,
			amenities,
			destinationId,
			type,
			style,
			destinations (
				id,
				name,
				title,
				description,
				img
			),
			packageImages (
				id,
				img
			)
		`);
	
	// Apply search term
	if (searchTerm && searchTerm.trim()) {
		query = query.or(`title.ilike.%${searchTerm}%,location.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
	}
	
	// Apply filters
	if (destinationId) {
		query = query.eq('destinationId', destinationId);
	}
	
	if (minPrice !== undefined) {
		query = query.gte('price', minPrice);
	}
	
	if (maxPrice !== undefined) {
		query = query.lte('price', maxPrice);
	}
	
	if (minRating !== undefined) {
		query = query.gte('rating', minRating);
	}
	
	if (maxGuests !== undefined) {
		query = query.lte('maxGuests', maxGuests);
	}
	
	if (minGuests !== undefined) {
		query = query.gte('minGuests', minGuests);
	}
	
	if (type) {
		// Handle multiple types (comma-separated from frontend)
		if (type.includes(',')) {
			const typeArray = type.split(',').map(t => t.trim());
			query = query.in('type', typeArray);
		} else {
			query = query.eq('type', type);
		}
	}
	
	if (style) {
		// Handle multiple styles (comma-separated from frontend)
		if (style.includes(',')) {
			const styleArray = style.split(',').map(s => s.trim());
			query = query.in('style', styleArray);
		} else {
			query = query.eq('style', style);
		}
	}
	
	if (duration && duration !== 'any') {
		// Handle duration filtering based on number of days
		switch (duration) {
			case '1':
				query = query.eq('duration', 1);
				break;
			case '2-3':
				query = query.gte('duration', 2).lte('duration', 3);
				break;
			case '4-7':
				query = query.gte('duration', 4).lte('duration', 7);
				break;
			case '8-14':
				query = query.gte('duration', 8).lte('duration', 14);
				break;
			case '15+':
				query = query.gte('duration', 15);
				break;
		}
	}
	
	if (groupSize && groupSize !== 'any') {
		// Handle group size filtering based on maxGuests
		switch (groupSize) {
			case '1-2':
				query = query.gte('maxGuests', 2);
				break;
			case '3-5':
				query = query.gte('maxGuests', 5);
				break;
			case '6-10':
				query = query.gte('maxGuests', 10);
				break;
			case '11+':
				query = query.gte('maxGuests', 11);
				break;
		}
	}
	
	// Order by rating and price
	query = query.order('rating', { ascending: false }).order('price', { ascending: true });
	
	const { data, error } = await query;
	
	if (error) {
		console.error('Error searching packages:', error);
		const err = new Error("Error searching packages");
		err.cause = error;
		throw err;
	}
	
	// Transform the data to match the expected format
	return (data || []).map((pkg) => ({
		id: pkg.id,
		title: pkg.title,
		location: pkg.location,
		price: pkg.price,
		originalPrice: pkg.originalPrice,
		duration: pkg.duration,
		rating: pkg.rating,
		reviews: pkg.reviews,
		description: pkg.description,
		maxGuests: pkg.maxGuests,
		minGuests: pkg.minGuests,
		highlights: pkg.highlights || [],
		includes: pkg.includes || [],
		excludes: pkg.excludes || [],
		amenities: pkg.amenities || [],
		destinationId: pkg.destinationId,
		type: pkg.type,
		style: pkg.style,
		destination: pkg.destinations,
		image: pkg.packageImages?.[0]?.img || null,
		images: pkg.packageImages || []
	}));
}

async function getPackagesByDestination(destinationId) {
	const { data, error } = await supabase
		.from("packages")
		.select(`
			id,
			title,
			location,
			price,
			originalPrice,
			duration,
			rating,
			reviews,
			description,
			maxGuests,
			minGuests,
			highlights,
			includes,
			amenities,
			destinationId,
			type,
			style,
			packageImages (
				id,
				img
			)
		`)
		.eq('destinationId', destinationId)
		.order('rating', { ascending: false })
		.order('price', { ascending: true });
	
	if (error) {
		console.error('Error fetching packages by destination:', error);
		const err = new Error("Error fetching packages by destination");
		err.cause = error;
		throw err;
	}
	
	return (data || []).map((pkg) => ({
		id: pkg.id,
		title: pkg.title,
		location: pkg.location,
		price: pkg.price,
		originalPrice: pkg.originalPrice,
		duration: pkg.duration,
		rating: pkg.rating,
		reviews: pkg.reviews,
		description: pkg.description,
		maxGuests: pkg.maxGuests,
		minGuests: pkg.minGuests,
		highlights: pkg.highlights || [],
		includes: pkg.includes || [],
		excludes: pkg.excludes || [],
		amenities: pkg.amenities || [],
		destinationId: pkg.destinationId,
		type: pkg.type,
		style: pkg.style,
		image: pkg.packageImages?.[0]?.img || null,
		images: pkg.packageImages || []
	}));
}

async function getRecommendedPackages(packageId) {
	try {
		// First get the current package to understand its characteristics
		const currentPackage = await getPackageById(packageId);
		if (!currentPackage) {
			throw new Error("Package not found");
		}

		// Build recommendation query based on package characteristics
		let query = supabase
			.from("packages")
			.select(`
				*,
				packageImages (img)
			`)
			.neq('id', packageId) // Exclude current package
			.limit(6);

		// Priority 1: Same type and similar price range
		const priceRange = currentPackage.price * 0.3; // 30% price tolerance
		query = query
			.eq('type', currentPackage.type)
			.gte('price', currentPackage.price - priceRange)
			.lte('price', currentPackage.price + priceRange);

		let { data: recommendations, error } = await query;

		// If we don't have enough recommendations, try broader criteria
		if (!recommendations || recommendations.length < 6) {
			// Priority 2: Same type, any price
			query = supabase
				.from("packages")
				.select(`
					*,
					packageImages (img)
				`)
				.neq('id', packageId)
				.eq('type', currentPackage.type)
				.limit(6);

			const { data: typeRecommendations, error: typeError } = await query;
			if (typeError) throw typeError;

			recommendations = typeRecommendations || [];
		}

		// If still not enough, try same style
		if (!recommendations || recommendations.length < 6) {
			// Priority 3: Same style, any type
			query = supabase
				.from("packages")
				.select(`
					*,
					packageImages (img)
				`)
				.neq('id', packageId)
				.eq('style', currentPackage.style)
				.limit(6);

			const { data: styleRecommendations, error: styleError } = await query;
			if (styleError) throw styleError;

			recommendations = styleRecommendations || [];
		}

		// If still not enough, get popular packages (highest rated)
		if (!recommendations || recommendations.length < 6) {
			// Priority 4: Popular packages (high rating)
			query = supabase
				.from("packages")
				.select(`
					*,
					packageImages (img)
				`)
				.neq('id', packageId)
				.gte('rating', 4.5)
				.order('rating', { ascending: false })
				.limit(6);

			const { data: popularRecommendations, error: popularError } = await query;
			if (popularError) throw popularError;

			recommendations = popularRecommendations || [];
		}

		// Final fallback: just get any 6 packages
		if (!recommendations || recommendations.length < 6) {
			query = supabase
				.from("packages")
				.select(`
					*,
					packageImages (img)
				`)
				.neq('id', packageId)
				.order('created_at', { ascending: false })
				.limit(6);

			const { data: fallbackRecommendations, error: fallbackError } = await query;
			if (fallbackError) throw fallbackError;

			recommendations = fallbackRecommendations || [];
		}

		if (error) throw error;

		// Format the results similar to other package endpoints
		const result = recommendations.map(pkg => ({
			...pkg,
			image: pkg.packageImages?.[0]?.img || null, // First image for PackageCard
			images: pkg.packageImages?.map(img => img.img) || [], // All images array
			itinerary: [] // Don't need full itinerary for recommendations
		}));

		return result;

	} catch (error) {
		console.error("Error getting recommended packages:", error);
		throw error;
	}
}

async function getTopDeals() {
	try {
		// Get packages with the best deals (highest discount percentage)
		const { data: packages, error } = await supabase
			.from("packages")
			.select(`
				*,
				packageImages (img)
			`)
			.not('originalPrice', 'is', null)
			.order('originalPrice', { ascending: false }) // Start with higher original prices
			.limit(20); // Get more to calculate discounts

		if (error) throw error;

		// Calculate discount percentage and sort by best deals
		const packagesWithDiscounts = packages
			.map(pkg => {
				const discount = pkg.originalPrice && pkg.price 
					? ((pkg.originalPrice - pkg.price) / pkg.originalPrice) * 100 
					: 0;
				return {
					...pkg,
					discountPercentage: Math.round(discount),
					savings: pkg.originalPrice - pkg.price
				};
			})
			.filter(pkg => pkg.discountPercentage > 0) // Only packages with actual discounts
			.sort((a, b) => b.discountPercentage - a.discountPercentage) // Sort by highest discount
			.slice(0, 6); // Get top 6 deals

		// Format the results similar to other package endpoints
		const result = packagesWithDiscounts.map(pkg => ({
			...pkg,
			image: pkg.packageImages?.[0]?.img || null,
			images: pkg.packageImages?.map(img => img.img) || [],
			itinerary: [] // Don't need full itinerary for deals
		}));

		return result;

	} catch (error) {
		console.error("Error getting top deals:", error);
		throw error;
	}
}

module.exports = { 
	getPackages, 
	getPackageById, 
	createPackage, 
	updatePackage, 
	deletePackage,
	searchPackages,
	getPackagesByDestination,
	getRecommendedPackages,
	getTopDeals
}; 