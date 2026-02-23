import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-6776d9ad/health", (c) => {
  return c.json({ status: "ok" });
});

// Check if email is authorized
app.post("/make-server-6776d9ad/check-email", async (c) => {
  try {
    const { email } = await c.req.json();
    
    if (!email) {
      return c.json({ error: "Email is required" }, 400);
    }

    // Get authorized emails from KV store
    const authorizedEmails = await kv.get("authorized_emails");
    const emailList = authorizedEmails ? JSON.parse(authorizedEmails as string) : [];
    
    const isAuthorized = emailList.includes(email.toLowerCase());
    
    if (isAuthorized) {
      // Check if user is approved
      const approvalStatus = await kv.get(`approval_${email.toLowerCase()}`);
      return c.json({ 
        authorized: true, 
        approved: approvalStatus === "approved" 
      });
    }
    
    return c.json({ authorized: false, approved: false });
  } catch (error) {
    console.log("Error checking email authorization:", error);
    return c.json({ error: "Failed to check email authorization" }, 500);
  }
});

// Get approval status for a specific email
app.post("/make-server-6776d9ad/approval-status", async (c) => {
  try {
    const { email } = await c.req.json();
    
    if (!email) {
      return c.json({ error: "Email is required" }, 400);
    }

    const approvalStatus = await kv.get(`approval_${email.toLowerCase()}`);
    return c.json({ approved: approvalStatus === "approved" });
  } catch (error) {
    console.log("Error getting approval status:", error);
    return c.json({ error: "Failed to get approval status" }, 500);
  }
});

// Admin: Add authorized email
app.post("/make-server-6776d9ad/admin/add-email", async (c) => {
  try {
    const { email, adminPassword } = await c.req.json();
    
    // Simple admin password check
    if (adminPassword !== "opencrd1") {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const authorizedEmails = await kv.get("authorized_emails");
    const emailList = authorizedEmails ? JSON.parse(authorizedEmails as string) : [];
    
    if (!emailList.includes(email.toLowerCase())) {
      emailList.push(email.toLowerCase());
      await kv.set("authorized_emails", JSON.stringify(emailList));
    }
    
    return c.json({ success: true });
  } catch (error) {
    console.log("Error adding authorized email:", error);
    return c.json({ error: "Failed to add email" }, 500);
  }
});

// Admin: Approve a guest
app.post("/make-server-6776d9ad/admin/approve", async (c) => {
  try {
    const { email, adminPassword } = await c.req.json();
    
    // Simple admin password check
    if (adminPassword !== "opencrd1") {
      return c.json({ error: "Unauthorized" }, 401);
    }

    await kv.set(`approval_${email.toLowerCase()}`, "approved");
    return c.json({ success: true });
  } catch (error) {
    console.log("Error approving guest:", error);
    return c.json({ error: "Failed to approve guest" }, 500);
  }
});

// Admin: Get all authorized emails with approval status
app.post("/make-server-6776d9ad/admin/get-guests", async (c) => {
  try {
    const { adminPassword } = await c.req.json();
    
    if (adminPassword !== "opencrd1") {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const authorizedEmails = await kv.get("authorized_emails");
    const emailList = authorizedEmails ? JSON.parse(authorizedEmails as string) : [];
    
    const guests = await Promise.all(
      emailList.map(async (email: string) => {
        const approvalStatus = await kv.get(`approval_${email}`);
        return {
          email,
          approved: approvalStatus === "approved"
        };
      })
    );
    
    return c.json({ guests });
  } catch (error) {
    console.log("Error getting guests:", error);
    return c.json({ error: "Failed to get guests" }, 500);
  }
});

Deno.serve(app.fetch);