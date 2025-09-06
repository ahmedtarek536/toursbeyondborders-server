const { supabase } = require("../config/supabase");

async function listReservations() {
  const { data, error } = await supabase.from("reservations").select(`
		id,
		packageId,
		firstName,
		lastName,
		email,
		phone,
		price,
		guests,
		checkIn,
		details,
		status,
		paymentStatus,
		created_at,
		packages(
			id,
			title,
			location,
			price,
			duration,
			rating,
			description,
			images:packageImages(*)
		)
	`);
  if (error) {
    const err = new Error("Error fetching reservations");
    err.cause = error;
    throw err;
  }
  return data || [];
}

async function createReservation(payload) {
  const {
    packageId,
    firstName,
    lastName,
    email,
    phone,
    price,
    guests,
    checkIn,
    details,
  } = payload;

  const { data, error } = await supabase
    .from("reservations")
    .insert([
      {
        packageId,
        firstName,
        lastName,
        email,
        phone,
        price,
        guests,
        checkIn,
        details,
      },
    ])
    .select();

  if (error) {
    const err = new Error("Error creating reservation");
    err.cause = error;
    throw err;
  }

  return (data || [])[0] || null;
}

async function getReservationById(id) {
  const { data, error } = await supabase
    .from("reservations")
    .select(`
      *,
      packages(
        id,
        title,
        location,
        price,
        duration,
        rating,
        description,
        images:packageImages(*)
      )
    `)
    .eq("id", id)
    .single();
  if (error) {
    const err = new Error("Error fetching reservation");
    err.cause = error;
    throw err;
  }
  return data;
}

async function updateReservation(id, payload) {
  const { data, error } = await supabase
    .from("reservations")
    .update(payload)
    .eq("id", id)
    .select()
    .single();
  if (error) {
    const err = new Error("Error updating reservation");
    err.cause = error;
    throw err;
  }
  return data;
}

async function deleteReservation(id) {
  const { error } = await supabase.from("reservations").delete().eq("id", id);
  if (error) {
    const err = new Error("Error deleting reservation");
    err.cause = error;
    throw err;
  }
  return { success: true };
}

module.exports = {
  listReservations,
  createReservation,
  getReservationById,
  updateReservation,
  deleteReservation,
};
