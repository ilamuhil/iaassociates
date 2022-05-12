import dotenv from 'dotenv';
import helmet from 'helmet';
dotenv.config();
import cors from 'cors';
import express from 'express';
import updates from './routes/updates.js';
import userAuth from './routes/authenticate.js';
import users from './routes/users.js';
import orders from './routes/orders.js';
import contact from './routes/contact.js';
import errorhandler from './routes/error.js';
import services from './routes/services.js';
import cookieParser from 'cookie-parser';
import { authenticateUser } from './controller/authenticate.js';
import addresses from './routes/addresses.js';
import payments from './routes/payments.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
app.use(cors({ origin: process.env.WEBSITE_URL, credentials: true }));
app.use(
	helmet({
		contentSecurityPolicy: {
			useDefaults: true,
			directives: {
				scriptSrc: [
					"'self'",
					'razorpay.com',
					'*.razorpay.com',
					'fontawesome.com',
					'*.fontawesome.com',
					'https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js',
				],
				imgSrc: ["'self'", 'data:'],
				connectSrc: ["'self'", '*.fontawesome.com'],
				manifestSrc: process.env.SERVER_URL,
			},
		},
	})
);
app.use(express.json());
app.use(
	express.urlencoded({
		extended: false,
	})
);

app.use(cookieParser());
const port = process.env.PORT || 8000;


app.use('/backend/addresses', authenticateUser, addresses);
app.use('/backend/updates', updates);
app.use('/backend/user', authenticateUser, users);
app.use('/backend/authenticate', userAuth);
app.use('/backend/orders', authenticateUser, orders);
app.use('/backend/contact', contact);
app.use('/backend/payments', payments);
app.use('/backend/services', services);

app.get('/test', async (req, res) => {
	res.sendFile('abc.txt', { root: path.join(__dirname) }, err => {
		if (err) {
			console.log(err);
		} else {
			console.log('abc.txt');
		}
	});
});

app.use(errorhandler);

app.listen(port, () => console.log('Server is running on port ' + port));
