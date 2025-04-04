require("dotenv").config();

async function getAlaiToken() {
    const email = process.env.ALAI_EMAIL;
    const password = process.env.ALAI_PASSWORD;

    try {
        const response = await fetch("https://api.getalai.com/auth/v1/token?grant_type=password", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Apikey":process.env.ALAI_API_KEY
            },
            body: JSON.stringify({
                email,
                password,
                gotrue_meta_security: {}
            })
        });
        const data = await response.json();
        return data?.access_token || null;
    } catch (error) {
        console.error("Authentication failed:", error);
        return null;
    }
}

module.exports = getAlaiToken;
