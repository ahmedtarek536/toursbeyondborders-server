const { supabase } = require("../config/supabase");

class ServicesService {
  async getAllServices() {
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch services: ${error.message}`);
    }

    return data;
  }

  async getServiceById(id) {
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      throw new Error(`Failed to fetch service: ${error.message}`);
    }

    return data;
  }

  async createService(serviceData) {
    const { data, error } = await supabase
      .from("services")
      .insert([serviceData])
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create service: ${error.message}`);
    }

    return data;
  }

  async updateService(id, serviceData) {
    const { data, error } = await supabase
      .from("services")
      .update(serviceData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update service: ${error.message}`);
    }

    return data;
  }

  async deleteService(id) {
    const { error } = await supabase
      .from("services")
      .delete()
      .eq("id", id);

    if (error) {
      throw new Error(`Failed to delete service: ${error.message}`);
    }

    return { success: true };
  }
}

module.exports = new ServicesService();
