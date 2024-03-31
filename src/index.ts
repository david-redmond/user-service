import * as express from "express";
import * as dotenv from "dotenv";
import * as bodyParser from "body-parser";
import { mongoConnection } from "./database/connection";
import { User } from "./models/User";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// MongoDB connection
mongoConnection();

app.post("/check", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      console.error("Error POST /check : user not found", req.body.email);
      return res.status(404).send("Not Found");
    }
    res.json(user);
  } catch (error) {
    console.error(
      "Error POST /check : server error",
      error.code,
      error.message,
      error.config,
    );
    return res.status(500).send("Server Error");
  }
});

app.post("/", async (req: any, res) => {
  try {
    const { firstname, surname, email, hashedPassword } = req.body;
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      console.log("Error POST /: User already exists");
      return res.status(403).send("User exists");
    }
    // Create new user
    const newUser = new User({
      firstname: firstname,
      surname: surname,
      email: email,
      password: hashedPassword,
    });
    await newUser.save();
    res.status(202).json({ message: "User created successfully" });
  } catch (error) {
    console.error(
      "Error POST /: Server Error",
      error.code,
      error.message,
      error.config,
    );
    res.status(500).send("Server Error");
  }
});

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
    const { firstname, surname, email, attributes } = req.body;
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
    if (attributes !== undefined) {
      updatedFields.attributes = attributes;
    }

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
