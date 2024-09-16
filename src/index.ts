import * as express from "express";
import * as dotenv from "dotenv";
import * as bodyParser from "body-parser";
import { mongoConnection } from "./database/connection";
import { User } from "./models/User";
import * as cors from "cors";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors())
// MongoDB connection
mongoConnection();

app.get("/:userId", async (req: any, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      console.error("Error GET / : user not found", req.params.userId);
      return res.status(404).send("Not Found");
    }
    user.password = undefined;
    res.json(user);
  } catch (error) {
    console.error(
      "Error GET / : Server Error",
      error.code,
      error.message,
      error.config,
    );
    res.status(500).send("Server Error");
  }
});

app.delete("/:userId", async (req: any, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      console.error("Error DELETE / : user not found", req.params.userId);
      return res.status(404).send("Not Found");
    }
    await User.findOneAndDelete({ _id: req.params.userId });
    res.json({ message: "User successfully deleted" });
  } catch (error) {
    console.error(
      "Error DELETE / : Server Error",
      error.code,
      error.message,
      error.config,
    );
    res.status(500).send("Server Error");
  }
});

app.put("/:userId", async (req: any, res) => {
  try {
    const { firstname, surname, email, attributes = {} } = req.body;
    const user = await User.findById(req.params.userId);
    if (!user) {
      console.error("Error PUT / : user not found", req.params.userId);
      return res.status(404).send("Not Found");
    }
    const updatedFields: any = {};
    if (firstname !== undefined) {
      updatedFields.firstname = firstname;
    }
    if (surname !== undefined) {
      updatedFields.surname = surname;
    }
    if (email !== undefined) {
      updatedFields.email = email;
    }

    updatedFields.attributes = {
      ...attributes,
    };

    await User.findOneAndUpdate({ _id: req.params.userId }, updatedFields);
    res.json({ message: "User successfully updated" });
  } catch (error) {
    console.error(
      "Error PUT / : Server Error",
      error.code,
      error.message,
      error.config,
    );
    res.status(500).send("Server Error");
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on PORT: ${port}`);
});
