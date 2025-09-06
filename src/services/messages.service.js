const { supabase } = require("../config/supabase");

async function listMessages() {
	const { data, error } = await supabase.from("messages").select("*");
	if (error) {
		const err = new Error("Error fetching messages");
		err.cause = error;
		throw err;
	}
	return data || [];
}

async function createMessage(payload) {
	const { name, email, phone, subject, message } = payload;
	const { data, error } = await supabase
		.from("messages")
		.insert([
			{
				name,
				email,
				phone,
				subject,
				message,
			},
		])
		.select()
		.single();
	if (error) {
		const err = new Error("Error creating message");
		err.cause = error;
		throw err;
	}
	return data;
}

async function getMessageById(id) {
	const { data, error } = await supabase
		.from("messages")
		.select("*")
		.eq("id", id)
		.single();
	if (error) {
		const err = new Error("Error fetching message");
		err.cause = error;
		throw err;
	}
	return data;
}

async function updateMessage(id, payload) {
	const { data, error } = await supabase
		.from("messages")
		.update(payload)
		.eq("id", id)
		.select()
		.single();
	if (error) {
		const err = new Error("Error updating message");
		err.cause = error;
		throw err;
	}
	return data;
}

async function deleteMessage(id) {
	const { error } = await supabase.from("messages").delete().eq("id", id);
	if (error) {
		const err = new Error("Error deleting message");
		err.cause = error;
		throw err;
	}
	return { success: true };
}

module.exports = {
	listMessages,
	createMessage,
	getMessageById,
	updateMessage,
	deleteMessage,
};



