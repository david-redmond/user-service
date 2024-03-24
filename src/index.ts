import * as express from "express";
import * as dotenv from "dotenv";
import * as bodyParser from 'body-parser';
import {mongoConnection} from "./database/connection";
import { User } from "./models/User";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// MongoDB connection
mongoConnection();


app.post('/check', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(404).send('Not Found');
        res.json(user);
    } catch (e) {
        console.error("Error POST /check: ", e)
    }
});

app.post('/create', async (req: any, res) => {
    try {
        const { firstname, surname, email, hashedPassword } = req.body;
        const user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(403).send('User exists');
        // Create new user
        const newUser = new User({
            firstname: firstname,
            surname: surname,
            email: email,
            password: hashedPassword
        });
        await newUser.save();
        res.status(202).json({ message: 'User created successfully' });
    } catch (e) {
        console.error("Error POST /create: ", e)
    }
});

app.get('/', async (req: any, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).send('Not Found');
        // @ts-ignore
        res.json({message: 'Protected route accessed successfully', user: req.user._id, dbUser: user});
    } catch (e) {
        console.error("Error GET /: ", e)
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on PORT: ${port}`);
});
