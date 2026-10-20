import { supabase } from "./supabase-client.js";

const adminEmail = "kamaldevtalla1911@gmail.com";
const loginPanel = document.querySelector("#login-panel");
const inquiriesPanel = document.querySelector("#inquiries-panel");
const loginForm = document.querySelector("#login-form");
const loginStatus = document.querySelector("#login-status");
const adminStatus = document.querySelector("#admin-status");
const inquiriesList = document.querySelector("#inquiries-list");

function showLogin(message = "") {
  loginPanel.hidden = false;
  inquiriesPanel.hidden = true;
  loginStatus.textContent = message;
}

function showInquiries() {
  loginPanel.hidden = true;
  inquiriesPanel.hidden = false;
}

function addCell(row, text) {
  const cell = document.createElement("td");
  cell.textContent = text || "—";
  row.append(cell);
  return cell;
}

function renderInquiries(inquiries) {
  inquiriesList.replaceChildren();

  if (inquiries.length === 0) {
    const row = document.createElement("tr");
    const cell = addCell(row, "No inquiries have been submitted yet.");
    cell.colSpan = 7;
    inquiriesList.append(row);
    return;
  }

  for (const inquiry of inquiries) {
    const row = document.createElement("tr");
    addCell(row, new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(inquiry.created_at)));
    addCell(row, inquiry.full_name);

    const contactCell = addCell(row, inquiry.email);
    const emailLink = document.createElement("a");
    emailLink.href = `mailto:${inquiry.email}`;
    emailLink.textContent = inquiry.email;
    contactCell.replaceChildren(emailLink);
    if (inquiry.phone) {
      const phoneLink = document.createElement("a");
      phoneLink.href = `tel:${inquiry.phone}`;
      phoneLink.textContent = inquiry.phone;
      contactCell.append(document.createElement("br"), phoneLink);
    }

    addCell(row, inquiry.company);
    addCell(row, inquiry.service);
    addCell(row, inquiry.message);
    addCell(row, inquiry.status);
    inquiriesList.append(row);
  }
}

async function loadInquiries(user) {
  if (user.email?.toLowerCase() !== adminEmail) {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
    } catch (error) {
      console.error("Unable to end unauthorized admin session.", error);
    }
    showLogin("This account is not authorized to view inquiries.");
    return;
  }

  showInquiries();
  adminStatus.textContent = "Loading inquiries…";

  try {
    const { data, error } = await supabase
      .from("inquiries")
      .select("id, created_at, full_name, email, phone, company, service, message, status")
      .order("created_at", { ascending: false });
    if (error) {
      throw error;
    }

    renderInquiries(data);
    adminStatus.textContent = `${data.length} ${data.length === 1 ? "inquiry" : "inquiries"}`;
  } catch (error) {
    console.error("Unable to load project inquiries.", error);
    adminStatus.textContent = "Inquiries could not be loaded. Check the Supabase table and access policies.";
  }
}

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const submitButton = loginForm.querySelector('button[type="submit"]');
  submitButton.disabled = true;
  loginStatus.textContent = "";

  const formData = new FormData(loginForm);
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: formData.get("email").toString().trim(),
      password: formData.get("password").toString(),
    });

    if (error) {
      throw error;
    }

    await loadInquiries(data.user);
  } catch (error) {
    console.error("Admin sign-in failed.", error);
    showLogin("Sign-in failed. Check your email and password, then try again.");
  } finally {
    submitButton.disabled = false;
  }
});

document.querySelector("#logout-button").addEventListener("click", async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw error;
    }

    loginForm.reset();
    showLogin();
  } catch (error) {
    console.error("Admin sign-out failed.", error);
    adminStatus.textContent = "Could not sign out. Please try again.";
  }
});

try {
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    throw error;
  }

  if (data.session) {
    await loadInquiries(data.session.user);
  }
} catch (error) {
  console.error("Unable to check the admin session.", error);
  showLogin("Unable to check your session. Please sign in again.");
}
