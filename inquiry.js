import { supabase } from "./supabase-client.js";

const form = document.querySelector("#inquiry-form");
const status = document.querySelector("#inquiry-status");
const thanksDialog = document.querySelector("#thanks-dialog");
const submitButton = form.querySelector('button[type="submit"]');

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  status.textContent = "";
  submitButton.disabled = true;

  const formData = new FormData(form);
  const inquiry = {
    full_name: formData.get("full_name").toString().trim(),
    email: formData.get("email").toString().trim(),
    phone: formData.get("phone").toString().trim(),
    company: formData.get("company").toString().trim(),
    service: formData.get("service").toString(),
    message: formData.get("message").toString().trim(),
  };

  try {
    const { error } = await supabase.from("inquiries").insert(inquiry);
    if (error) {
      throw error;
    }

    form.reset();
    status.textContent = "";
    thanksDialog.showModal();
  } catch (error) {
    console.error("Unable to save project inquiry.", error);
    status.textContent = ["PGRST205", "42501"].includes(error.code)
      ? "Supabase isn't set up for inquiries yet. Run supabase/inquiries.sql in your Supabase SQL Editor, then try again."
      : "We couldn't send your inquiry. Please try again or email Sales@karexasolutions.com.";
    status.classList.remove("success");
  } finally {
    submitButton.disabled = false;
  }
});
