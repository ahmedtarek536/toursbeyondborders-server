const { supabase } = require("../config/supabase");

async function listCustomTrips() {
	const { data, error } = await supabase.from("custom_trips").select("*").order("created_at", { ascending: false });
	if (error) {
		const err = new Error("Error fetching custom trips");
		err.cause = error;
		throw err;
	}
	return data || [];
}

async function createCustomTrip(payload) {
	const { data, error } = await supabase.from("custom_trips").insert([payload]).select().single();
	if (error) {
		const err = new Error("Error creating custom trip");
		err.cause = error;
		throw err;
	}
	return data;
}

async function getCustomTripById(id) {
	const { data, error } = await supabase.from("custom_trips").select("*").eq("id", id).single();
	if (error) {
		const err = new Error("Error fetching custom trip");
		err.cause = error;
		throw err;
	}
	return data;
}

async function updateCustomTrip(id, payload) {
	const { data, error } = await supabase.from("custom_trips").update(payload).eq("id", id).select().single();
	if (error) {
		const err = new Error("Error updating custom trip");
		err.cause = error;
		throw err;
	}
	return data;
}

async function deleteCustomTrip(id) {
	const { error } = await supabase.from("custom_trips").delete().eq("id", id);
	if (error) {
		const err = new Error("Error deleting custom trip");
		err.cause = error;
		throw err;
	}
	return { success: true };
}

module.exports = {
	listCustomTrips,
	createCustomTrip,
	getCustomTripById,
	updateCustomTrip,
	deleteCustomTrip,
};


