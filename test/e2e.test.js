import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
import connectDB from "../backend/src/config/database.js";
import app from "../backend/src/app.js";

async function runE2ETest() {
    console.log("=== Starting End-to-End Live API Tests with MongoDB Atlas ===");
    
    // Connect to MongoDB Atlas
    await connectDB();
    
    // Start local Express server on port 4001 for test
    const port = 4001;
    const server = app.listen(port, () => {
        console.log(`Test server running on http://localhost:${port}`);
    });

    const baseUrl = `http://localhost:${port}`;

    try {
        const testUserEmail = `test_${Date.now()}@example.com`;
        const testUsername = `user_${Date.now()}`;
        const testPassword = "securePassword123";

        // 1. Test User Registration
        console.log("\n1. Testing POST /api/v1/users/register...");
        const regRes = await fetch(`${baseUrl}/api/v1/users/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                username: testUsername,
                email: testUserEmail,
                password: testPassword
            })
        });
        const regData = await regRes.json();
        console.log("Register Response:", regRes.status, regData);
        if (regRes.status !== 201) throw new Error("Registration failed");

        // 2. Test User Login
        console.log("\n2. Testing POST /api/v1/users/login...");
        const loginRes = await fetch(`${baseUrl}/api/v1/users/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: testUserEmail,
                password: testPassword
            })
        });
        const loginData = await loginRes.json();
        console.log("Login Response:", loginRes.status, loginData);
        if (loginRes.status !== 200) throw new Error("Login failed");

        // 3. Test User Logout
        console.log("\n3. Testing POST /api/v1/users/logout...");
        const logoutRes = await fetch(`${baseUrl}/api/v1/users/logout`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: testUserEmail })
        });
        const logoutData = await logoutRes.json();
        console.log("Logout Response:", logoutRes.status, logoutData);
        if (logoutRes.status !== 200) throw new Error("Logout failed");

        // 4. Test Create Post
        console.log("\n4. Testing POST /api/v1/posts/create...");
        const createPostRes = await fetch(`${baseUrl}/api/v1/posts/create`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: "Tamish Mehlawat",
                description: "Live MongoDB Atlas test post",
                age: 21
            })
        });
        const createPostData = await createPostRes.json();
        console.log("Create Post Response:", createPostRes.status, createPostData);
        if (createPostRes.status !== 201) throw new Error("Create post failed");
        const createdPostId = createPostData.post._id;

        // 5. Test Get All Posts
        console.log("\n5. Testing GET /api/v1/posts/getPosts...");
        const getPostsRes = await fetch(`${baseUrl}/api/v1/posts/getPosts`);
        const getPostsData = await getPostsRes.json();
        console.log("Get Posts Response:", getPostsRes.status, `Found ${getPostsData.length} post(s)`);
        if (getPostsRes.status !== 200) throw new Error("Get posts failed");

        // 6. Test Update Post
        console.log(`\n6. Testing PATCH /api/v1/posts/update/${createdPostId}...`);
        const updateRes = await fetch(`${baseUrl}/api/v1/posts/update/${createdPostId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                description: "Updated description in MongoDB Atlas",
                age: 22
            })
        });
        const updateData = await updateRes.json();
        console.log("Update Post Response:", updateRes.status, updateData);
        if (updateRes.status !== 200) throw new Error("Update post failed");

        // 7. Test Delete Post
        console.log(`\n7. Testing DELETE /api/v1/posts/delete/${createdPostId}...`);
        const deleteRes = await fetch(`${baseUrl}/api/v1/posts/delete/${createdPostId}`, {
            method: "DELETE"
        });
        const deleteData = await deleteRes.json();
        console.log("Delete Post Response:", deleteRes.status, deleteData);
        if (deleteRes.status !== 200) throw new Error("Delete post failed");

        console.log("\n=======================================================");
        console.log("🎉 ALL 7 API ENDPOINTS PASSED WITH LIVE MONGODB ATLAS!");
        console.log("=======================================================");
    } catch (err) {
        console.error("Test error:", err);
    } finally {
        server.close();
        process.exit(0);
    }
}

runE2ETest();
