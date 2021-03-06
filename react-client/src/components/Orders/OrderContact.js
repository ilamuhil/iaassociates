import { useState, useContext } from 'react';
import {
	Card,
	IconButton,
	Input,
	Stack,
	TextField,
	Box,
	Button,
} from '@mui/material';

import AuthContext from '../../context/AuthProvider';
import UploadIcon from '@mui/icons-material/Upload';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
const OrderContact = () => {
	const [loading, setLoading] = useState(0);
	const location = useLocation();
	const [files, setFiles] = useState([]);
	const [message, setMessage] = useState('');
	const ctx = useContext(AuthContext);
	const allowedfileTypes = [
		'application/msword',
		'application/pdf',
		'application/zip',
		'application/x-rar-compressed',
		'image/jpeg',
		'image/png',
	];
	const submitUpdate = () => {
		const axiosPvt = ctx.useAxiosPrivate();
		const formdata = new FormData();
		files.forEach((file, index) => {
			if (!allowedfileTypes.includes(file.type)) {
				toast.error('this file type is not supported');
				return;
			}
			formdata.append(`file-${index}`, file);
		});
		formdata.append('message', message);
		formdata.append('orderId', location.state.id);
		console.log(formdata);
		console.log('firstfile', files[0]);

		axiosPvt
			.post('/orders/order-update', formdata, {
				headers: { 'Content-Type': 'multipart/form-data' },
				onUploadProgress: progressEvent => {
					setLoading(
						Math.floor((progressEvent.loaded * 100) / progressEvent.total)
					);
				},
			})
			.then(res => {
				toast.success('Message sent successfully');
				setTimeout(() => {
					setLoading(0);
				}, 1500);
				setMessage('');
				setFiles([]);
			})
			.catch(e => {
				toast.error('Your message could not be sent');
			});
	};

	return (
		<Card sx={{ maxWidth: 500 }}>
			<Stack
				direction='column'
				justifyContent='center'
				spacing={2}
				mx='auto'
				p={4}>
				<h4>Send us any queries or updates regarding your order</h4>
				<TextField
					variant='standard'
					size='small'
					disabled
					value={location.state.id}
					label='Order Id'
				/>
				<TextField
					id='outlined-multiline-static'
					label='Your Message'
					multiline
					onChange={e => {
						setMessage(e.target.value);
					}}
					rows={4}
					placeholder='Here are your requested documents for the ongoing engagement...'
				/>
				<Box
					sx={{ display: 'flex', flexDirection: 'column', maxWidth: '250px' }}>
					<label htmlFor='icon-button-file'>
						<Input
							id='icon-button-file'
							type='file'
							multiple
							sx={{ display: 'none' }}
							onChange={e => {
								setFiles(p => [...p, ...e.target.files]);
							}}
						/>
						<IconButton
							color='primary'
							aria-label='upload picture'
							component='span'
							sx={{
								boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
								borderRadius: 4,
								mb: 2,
							}}>
							<UploadIcon />
						</IconButton>
						<br />
					</label>
					<small>
						Upload Any requested Documents{' '}
						<span className='text-danger'>(Upto 10MB)</span>
					</small>
					<small>
						Supported Types :{' '}
						<span className='text-danger ml-1 d-inline'>
							pdf, ms-word, jpeg, png, zip, tar, x-rar-compressed
						</span>
					</small>

					<div class='progress'>
						<div
							class='progress-bar progress-bar-striped progress-bar-animated bg-success'
							role='progressbar'
							aria-valuenow='75'
							aria-valuemin='0'
							aria-valuemax='100'
							style={{ width: `${loading}%` }}></div>
					</div>
					<Button
						variant='contained'
						size='small'
						onClick={submitUpdate}
						sx={{ maxWidth: 100, my: 2 }}>
						Submit
					</Button>
				</Box>
			</Stack>
		</Card>
	);
};

export default OrderContact;
