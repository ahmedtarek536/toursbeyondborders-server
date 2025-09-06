const { supabase } = require("../config/supabase");

async function getBlogs() {
  const { data: blogData, error } = await supabase
    .from("blogs")
    .select(
      `
			id,
			title,
			excerpt,
			content,
			category,
			author,
			date,
			readTime,
			featured,
			tags,
			image,
			created_at,
			updated_at
		`
    )
    .order("created_at", { ascending: false });

  if (error) {
    const err = new Error("Error fetching blogs");
    err.cause = error;
    throw err;
  }

  return blogData || [];
}

async function getBlogById(id) {
  const { data: blogData, error } = await supabase
    .from("blogs")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    const err = new Error("Error fetching blog");
    err.cause = error;
    throw err;
  }

  return blogData;
}

async function getBlogsByCategory(category) {
  const { data: blogData, error } = await supabase
    .from("blogs")
    .select("*")
    .eq("category", category)
    .order("created_at", { ascending: false });

  if (error) {
    const err = new Error("Error fetching blogs by category");
    err.cause = error;
    throw err;
  }

  return blogData || [];
}

async function getFeaturedBlogs() {
  const { data: blogData, error } = await supabase
    .from("blogs")
    .select("*")
    .eq("featured", true)
    .order("created_at", { ascending: false });

  if (error) {
    const err = new Error("Error fetching featured blogs");
    err.cause = error;
    throw err;
  }

  return blogData || [];
}

async function searchBlogs(searchTerm) {
  const { data: blogData, error } = await supabase
    .from("blogs")
    .select("*")
    .or(
      `title.ilike.%${searchTerm}%,excerpt.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%`
    )
    .order("created_at", { ascending: false });

  if (error) {
    const err = new Error("Error searching blogs");
    err.cause = error;
    throw err;
  }

  return blogData || [];
}

async function createBlog(payload) {
  const { data, error } = await supabase
    .from("blogs")
    .insert([payload])
    .select()
    .single();

  if (error) {
    const err = new Error("Error creating blog");
    err.cause = error;
    throw err;
  }

  return data;
}

async function updateBlog(id, payload) {
  const { data, error } = await supabase
    .from("blogs")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    const err = new Error("Error updating blog");
    err.cause = error;
    throw err;
  }

  return data;
}

async function getRandomBlogs(limit = 4) {
  const { data: blogData, error } = await supabase
    .from("blogs")
    .select(
      `
			id,
			title,
			excerpt,
			content,
			category,
			author,
			date,
			readTime,
			featured,
			tags,
			image,
			created_at,
			updated_at
		`
    )
    .order("created_at", { ascending: false });

  if (error) {
    const err = new Error("Error fetching random blogs");
    err.cause = error;
    throw err;
  }

  // Shuffle the blogs array and return the specified limit
  const shuffled = (blogData || []).sort(() => 0.5 - Math.random());
  return shuffled.slice(0, limit);
}

async function deleteBlog(id) {
  const { error } = await supabase.from("blogs").delete().eq("id", id);

  if (error) {
    const err = new Error("Error deleting blog");
    err.cause = error;
    throw err;
  }

  return { success: true };
}

module.exports = {
  getBlogs,
  getBlogById,
  getBlogsByCategory,
  getFeaturedBlogs,
  searchBlogs,
  getRandomBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
};
