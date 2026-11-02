import { registerUser } from "../backend/src/controllers/user.controller.js";
import { createPost, updatePost } from "../backend/src/controllers/post.controller.js";
import bcrypt from "bcrypt";

// Helper to create mock response object
function createMockRes() {
    const res = {
        statusCode: 0,
        jsonData: null,
        status(code) {
            this.statusCode = code;
            return this;
        },
        json(data) {
            this.jsonData = data;
            return this;
        }
    };
    return res;
}

async function runTests() {
    console.log("=== Running Backend Verification Tests ===");

    // Test 1: Password hashing with bcrypt
    const password = "mySecretPassword123";
    const hashed = await bcrypt.hash(password, 10);
    const matches = await bcrypt.compare(password, hashed);
    const fails = await bcrypt.compare("wrongPassword", hashed);
    if (matches && !fails) {
        console.log("✔ Test 1: Bcrypt password hashing & verification PASSED");
    } else {
        throw new Error("Bcrypt test failed");
    }

    // Test 2: User registration validation (missing fields)
    const req1 = { body: { username: "tamish" } }; // missing email and password
    const res1 = createMockRes();
    await registerUser(req1, res1);
    if (res1.statusCode === 400 && res1.jsonData?.message === "All fields are important!") {
        console.log("✔ Test 2: User registration missing fields validation PASSED (HTTP 400)");
    } else {
        throw new Error(`User validation test failed: ${res1.statusCode}`);
    }

    // Test 3: Post creation validation (missing fields)
    const req2 = { body: { name: "Test Post" } }; // missing description and age
    const res2 = createMockRes();
    await createPost(req2, res2);
    if (res2.statusCode === 400 && res2.jsonData?.message === "All field are required") {
        console.log("✔ Test 3: Post creation missing fields validation PASSED (HTTP 400)");
    } else {
        throw new Error(`Post creation test failed: ${res2.statusCode}`);
    }

    // Test 4: Post update validation (empty body)
    const req3 = { body: {}, params: { id: "123" } };
    const res3 = createMockRes();
    await updatePost(req3, res3);
    if (res3.statusCode === 400 && res3.jsonData?.message === "No data provided for update") {
        console.log("✔ Test 4: Post update empty body validation PASSED (HTTP 400)");
    } else {
        throw new Error(`Post update test failed: ${res3.statusCode}`);
    }

    console.log("=== All 4 Validation Tests Passed Successfully! ===");
}

runTests().catch(err => {
    console.error("Test failed:", err);
    process.exit(1);
});
