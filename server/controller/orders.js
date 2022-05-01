import pkg from '@prisma/client';
import dotenv from 'dotenv';
import { createHmac } from 'crypto';
import {
	newOrderEmail,
	orderUpdateEmail,
	orderRefundedEmail,
} from './sendMail.js';
import axios from 'axios';
const { PrismaClient } = pkg;
const prisma = new PrismaClient();
dotenv.config();
const rpaxios = axios.create({
	baseURL: 'https://api.razorpay.com/v1',
	auth: {
		username: process.env.RAZORPAY_CLIENT_ID,
		password: process.env.RAZORPAY_CLIENT_SECRET,
	},
});
const createNewOrder = async (req, res, next) => {
	if (req.user.role !== 'admin') {
		let err = new Error('Unauthorized access');
		err.status = 403;
		next(err);
	}
	let {
		body: {
			username,
			discount,
			orderDescription,
			serviceId,
			invoiceNumber,
			invoiceDate,
			orderValue,
			orderNotes,
		},
	} = req;
	invoiceDate = new Date(invoiceDate);
	try {
		//create an order at razorpay
		let order = await rpaxios.post('/orders', {
			amount: orderValue * 100,
			currency: 'INR',
			receipt: invoiceNumber,
			notes: {
				orderNotes,
			},
			payment_capture: 1,
		});
		console.log(order.data);

		//add order details to database
		let neworder = await prisma.orders.create({
			data: {
				value: orderValue,
				discount,
				orderDescription,
				orderStatus: 'created',
				razorpayId: order.data.id,
				paymentStatus: false,
				invoiceNumber,
				invoiceDate: invoiceDate.toISOString(),
				user: {
					connect: {
						username,
					},
				},
				service: {
					connect: { id: serviceId },
				},
			},
			include: {
				service: {
					select: {
						title: true,
					},
				},
				user: {
					select: { email: true },
				},
			},
		});
		let userupdate = await prisma.users.update({
			where: {
				username,
			},
			data: {
				role: 'customer',
			},
		});
		let {
			id: orderId,
			user: { email },
			service: { title },
			value,
		} = neworder;
		await newOrderEmail(orderId, value, title, username, email);
		console.log('email sent');
		res.status(200).send('Order created successfully');
	} catch (e) {
		console.log(e);
		next(e);
	}
};

const updateOrder = async ({ user: { role }, body, params: { id } }, res) => {
	if (role !== 'admin') res.status(403).send('Unauthorized request');
	let data;
	let update = { orderStatus: body.orderStatus };
	update = body.orderNotes
		? { ...update, orderNotes: body.orderNotes }
		: update;

	try {
		data = await prisma.orders.update({
			where: {
				id,
			},
			data: update,
		});
	} catch (error) {
		console.log(error);
		res.status(500).send('An unknown error occurred');
	}
	if (body.sendMail) {
		try {
			let user = await prisma.orders.findUnique({
				where: { id },
				include: {
					user: {
						select: {
							username: true,
							email: true,
						},
					},
				},
			});
			let { username, email } = user.user;
			await orderUpdateEmail(
				body.orderNotes,
				body.id,
				email,
				username,
				body.orderStatus
			);
			res.status(200).send('Updated Order successfully. Email sent to user');
		} catch (e) {
			res.status(500).send('Could not send order update email');
		}
	} else {
		res.status(200).send('Updated order in the database');
	}
};

const refundOrder = async (req, res) => {
	let { refundAmt, speed, receiptNumber } = req.body;
	let { orderId } = req.params;
	//update Database
	try {
		let order = await prisma.orders.update({
			where: {
				id: orderId,
			},
			data: {
				orderStatus: 'refunded',
			},
			include: {
				razorpayPaymentId: true,
				value: true,
				user: {
					select: {
						username: true,
						email: true,
					},
				},
				service: {
					title: true,
				},
				discount: true,
				orderDescription: true,
			},
		});
		let {
			razorpayPaymentId,
			value,
			user: { username, email },
			service: { title },
			discount,
		} = order;
		discount = discount + '%' || 'NA';
		let payload = { amount: Number(refundAmt) * 100, speed };
		//make refund request to razorpay
		payload = receiptNumber ? { ...payload, receipt: receiptNumber } : payload;
		let res = await rpaxios.post(
			`/payments/${razorpayPaymentId}/refund`,
			payload
		);
		//send refund email to user
		await orderRefundedEmail(
			title,
			orderDescription,
			value,
			'18%',
			discount,
			value,
			id,
			refundAmt,
			username,
			email
		);
		res.status(200).send('Refund Processed successfully');
	} catch (e) {
		res.status(500).send('Could not process your refund request');
	}
};

const flattenOrders = orders => {
	return (orders = orders.map(order => {
		let { user, service, ...rest } = order;
		order = { ...rest, ...user, ...service };
		return order;
	}));
};

const getAllOrders = async (role, idType = '', id = '') => {
	if (role === 'user') {
		let err = new Error('No orders found');
		err.status = 400;
		return Promise.reject(err);
	}
	if (idType) {
		try {
			let orders = await prisma.orders.findMany({
				where: {
					user: {
						[idType]: id,
					},
				},
				include: {
					user: {
						select: { username: true, email: true },
					},
					service: {
						select: {
							title: true,
						},
					},
				},
			});
			return flattenOrders(orders);
		} catch (e) {
			let err = new Error('Could not get orders data');
			err.status = 500;
			return Promise.reject(err);
		}
	} else {
		if (role === 'admin') {
			try {
				let orders = await prisma.orders.findMany({
					include: {
						user: {
							select: {
								username: true,
								email: true,
							},
						},
						service: {
							select: {
								title: true,
							},
						},
					},
				});
				return flattenOrders(orders);
			} catch (e) {
				let err = new Error('Could not get orders data');
				err.status = 500;
				return Promise.reject(err);
			}
		} else {
			let err = new Error('Unauthorized Request');
			err.status = 401;
			return Promise.reject(err);
		}
	}
};

const getfilteredOrders = async (role, filter, idType = '', id = '') => {
	if (role === 'user') {
		let err = new Error('No orders found');
		err.status = 400;
		return Promise.reject(err);
	}
	if (idType) {
		try {
			let orders = await prisma.orders.findMany({
				where: {
					user: {
						[idType]: id,
					},
					...filter,
				},
				include: {
					service: {
						select: { title: true },
					},
					user: {
						select: {
							username: true,
							email: true,
						},
					},
				},
			});
			return flattenOrders(orders);
		} catch (e) {
			console.error(e);
			let err = new Error('Could not find orders');
			err.status = 401;
			Promise.reject(err);
		}
	} else {
		if (role !== 'admin') {
			let err = new Error('Unauthorized Request');
			err.status = 401;
			return Promise.reject(err);
		} else {
			try {
				let orders = await prisma.orders.findMany({
					where: filter,
					include: {
						user: {
							select: { username: true, email: true },
						},
						service: {
							select: { title: true },
						},
					},
				});
				if (orders.length === 0) throw Error('');
				return flattenOrders(orders);
			} catch (e) {
				console.error(e);
				let err = new Error('Could not get orders');
				err.status = 500;
				return Promise.reject(err);
			}
		}
	}
};

const getOrders = async (
	{ params: { idType, id }, query, user },
	res,
	next
) => {
	//TODO if nothing is provided return all orders (if admin return all orders and if user return all orders of that user)
	if (Object.keys(query).length === 0) {
		if (idType) {
			try {
				if (user.role !== 'admin') {
					res.status(403).send('Unauthorized request');
				} else {
					let data = await getAllOrders(user.role, idType, id);
					res.status(200).send(data);
				}
			} catch (e) {
				next(e);
			}
		} else {
			try {
				if (user.role === 'admin') {
					let data = await getAllOrders('admin');
					res.status(200).send(data);
				} else {
					let data = await getAllOrders(user.role, 'id', user.id);
					res.status(200).send(data);
				}
			} catch (e) {
				next(e);
			}
		}
	} else {
		if (query?.paymentStatus && query?.orderStatus) {
			if (
				query.paymentStatus &&
				['created', 'refunded', 'failed'].includes(query.orderStatus)
			) {
				let err = new Error('No orders exist with this filter');
				err.status = 400;
				next(err);
			}
		}
		try {
			if (query?.paymentStatus) {
				query.paymentStatus = query.paymentStatus === 'true' ? true : false;
			}
			if (idType) {
				let data = await getfilteredOrders(user.role, query, idType, id);
				res.status(200).send(data);
			} else {
				if (user.role === 'admin') {
					let data = await getfilteredOrders(user.role, query);
					res.status(200).send(data);
				} else {
					let data = await getfilteredOrders(user.role, query, 'id', user.id);
					res.status(200).send(data);
				}
			}
		} catch (e) {
			next(e);
		}
	}
};
const getOrderCount = async (req, res, next) => {
	let count;
	if (req.params.orderType === 'total') {
		count = await prisma.orders.count();
	} else {
		count = await prisma.orders.count({
			where: {
				orderStatus: [req.params.orderType],
			},
		});
	}
};

const getEditableOrders = async (req, res) => {
	if (req.user.role !== 'admin') res.status(403).send('Unauthorized request');
	let data = await prisma.orders.findMany({
		where: {
			orderStatus: {
				in: ['pending', 'onhold'],
			},
		},
		select: { id: true },
	});
	res.status(200).send(data);
};

//this is a monthly report for admin to download json data
const getOrdersByMonth = async (
	{ params: { month }, user: { role } },
	res,
	next
) => {
	if (role !== 'admin') res.status(403).send('Unauthorized');
	try {
		console.log(month);
		let d = new Date();
		let year = d.getFullYear();
		let data = await prisma.orders.findMany({
			where: {
				AND: [
					{
						createdAt: {
							gte: new Date(year, Number(month), 1),
						},
					},
					{ createdAt: { lt: new Date(year, Number(month) + 1, 1) } },
				],
			},
			include: {
				user: {
					select: {
						address: true,
						email: true,
					},
				},
				service: {
					select: {
						title: true,
					},
				},
			},
		});

		//make modifications to the orders data based on invoice type and flatten the results
		let orders = data
			.map(order => {
				if (order.user.address.invoiceType === 'company') {
					order.user.address.GSTIN = order.user.address.lName;
					order.user.address.companyName = order.user.address.fName;
					delete order.user.address.fName;
					delete order.user.address.lName;
					delete order.user.address.id;
					delete order.userId;
				}
				let {
					user: { address, email },
					service,
					...rest
				} = order;
				order = { ...rest, ...service, ...address, email };
				return order;
			})
			.sort((a, b) => {
				if (a.createdAt >= b.createdAt) return 1;
				return -1;
			});
		if (orders.length === 0)
			res.status(400).send('No orders found for the selected month');
		res.status(200).send(orders);
	} catch (e) {
		console.log(e, 'Error');
		let err = new Error('Could not fetch Data');
		err.status = 500;
		next(err);
	}
};

const paymentVerification = async (req, res) => {
	try {
		// getting the details back from our font-end
		const {
			orderCreationId,
			razorpayPaymentId,
			razorpayOrderId,
			razorpaySignature,
		} = req.body;
		console.log(
			'🚀 ~ file: orders.js ~ line 519 ~ paymentVerification ~ razorpaySignature',
			razorpaySignature
		);
		const { id } = req.params;
		const digest = createHmac('sha256', process.env.RAZORPAY_CLIENT_SECRET)
			.update(`${orderCreationId}|${razorpayPaymentId}`)
			.digest('hex');
		console.log(
			'🚀 ~ file: orders.js ~ line 524 ~ paymentVerification ~ digest',
			digest
		);
		if (digest !== razorpaySignature) {
			console.log('failed');
			res.status(400).json("Oops we couldn't verify your payment!");
		}

		await prisma.orders.update({
			where: {
				id: parseInt(id),
			},
			data: {
				razorpayId: razorpayOrderId,
				razorpayPaymentId,
				paymentStatus: true,
				orderStatus: 'pending',
			},
		});
		console.log('success');
		res.status(200).send('Success');
	} catch (error) {
		res.status(500).send(error);
	}
};
export {
	getOrderCount,
	createNewOrder,
	getOrders,
	getAllOrders,
	getfilteredOrders,
	getOrdersByMonth,
	getEditableOrders,
	refundOrder,
	updateOrder,
	paymentVerification,
};
//!Test cases to check working of orders
// getfilteredOrders(
// 	'admin',
// 	{ paymentStatus: true },
// 	'id',
// 	'051d5921-2ae6-4d69-abe2-48a408e93270'
// ).then(data => {
// 	console.log(data);
// });
// getfilteredOrders('admin', {
// 	paymentStatus: false,
// 	orderStatus: 'refunded',
// }).then(data => {
// 	console.log(data);
// });
// getfilteredOrders(
// 	'customer',
// 	{ orderStatus: 'pending' },
// 	'id',
// 	'051d5921-2ae6-4d69-abe2-48a408e93270'
// ).then(data => console.log(data));
// getfilteredOrders('admin', { paymentStatus: true }).then(data => {
// 	console.log(data);
// });
