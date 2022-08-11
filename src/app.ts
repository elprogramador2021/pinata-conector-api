import express from "express";
import path from "path";

import { loadApiEndpoints } from "./controllers/api";

const cors = require('cors');
// Create Express server
const app = express();

// Express configuration
app.set("port", process.env.PORT || 3001);
//app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  express.static(path.join(__dirname, "../public"), { maxAge: 31557600000 })
);

app.use(express.json({limit: '25mb'}));
app.use(express.urlencoded({limit: '25mb'}));

app.use(cors({
  origin: '*'
}));

loadApiEndpoints(app);

export default app;
