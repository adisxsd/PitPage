const app = require("./app.js");
require("dotenv").config();

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
});

