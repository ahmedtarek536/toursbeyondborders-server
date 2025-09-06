const { supabase } = require("../config/supabase");

async function getDestinations() {
	const { data, error } = await supabase.from("destinations").select("*");
	if (error) {
		const err = new Error("Error fetching destinations");
		err.cause = error;
		throw err;
	}
	return data || [];
}

async function getDestinationById(id) {
	const { data: destination, error } = await supabase
		.from("destinations")
		.select("*")
		.eq("id", id)
		.single();
	if (error) {
		const err = new Error("Error fetching destination");
		err.cause = error;
		throw err;
	}

	const { data: packageData, error: packagesError } = await supabase
		.from("packages")
		.select(`
			id,
			title,
			location,
			price,
			duration,
			rating,
			description,
			packageImages (*)
		`)
		.eq("destinationId", id);
	if (packagesError) {
		const err = new Error("Error fetching destination packages");
		err.cause = packagesError;
		throw err;
	}

	const formattedPackages = (packageData || []).map((pkg) => ({
		id: pkg.id,
		title: pkg.title,
		location: pkg.location,
		price: pkg.price,
		duration: pkg.duration,
		rating: pkg.rating,
		description: pkg.description,
		image: pkg.packageImages?.[0]?.img || null,
	}));

	return { ...destination, packages: formattedPackages };
}

async function createDestination(payload) {
	const { data, error } = await supabase
		.from("destinations")
		.insert([payload])
		.select()
		.single();
	if (error) {
		const err = new Error("Error creating destination");
		err.cause = error;
		throw err;
	}
	return data;
}

async function updateDestination(id, payload) {
	const { data, error } = await supabase
		.from("destinations")
		.update(payload)
		.eq("id", id)
		.select()
		.single();
	if (error) {
		const err = new Error("Error updating destination");
		err.cause = error;
		throw err;
	}
	return data;
}

async function deleteDestination(id) {
	const { error } = await supabase.from("destinations").delete().eq("id", id);
	if (error) {
		const err = new Error("Error deleting destination");
		err.cause = error;
		throw err;
	}
	return { success: true };
}

module.exports = { getDestinations, getDestinationById, createDestination, updateDestination, deleteDestination }; 