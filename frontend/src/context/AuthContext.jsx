const testConnection = async () => {
    try {
        const response = await axios.get("https://e-comm-onecart-backend.onrender.com/api/test");
        console.log("Response from server:", response.data);
        alert(response.data.message);
    } catch (error) {
        console.error("Connection still failed:", error);
    }
};