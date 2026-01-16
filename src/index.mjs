import "dotenv/config";
import connectToDB from "./db/connectToDB.mjs";
import server from "./socket/socket.io.mjs";


connectToDB()
.then(() => {
    try {
        const PORT = process.env.PORT || 3000;
        console.log("Starting server...");
        server.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Error starting the server:", error);
    }
})
.catch((error) => {
    console.error("Failed to start the server due to database connection error:", error);
});