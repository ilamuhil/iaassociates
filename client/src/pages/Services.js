// import data from './data/db.json';
import { Layout } from '../components/UtilitiesAndWrappers/Layout';
import { Link } from 'react-router-dom';
import './../styles/css/service.css';
import { useState, Fragment, useEffect } from 'react';
import BreadCrumbs from '../components/UtilitiesAndWrappers/Breadcrumbs';
import axios from '../api/axios';
import { v4 as uuid } from 'uuid';
import { Skeleton, Fade } from '@mui/material';

const Services = props => {
	const [services, setServices] = useState([]);
	useEffect(() => {
		const controller = new AbortController();
		axios
			.get('/services/get-services/', { signal: controller.signal })
			.then(res => {
				setServices(prev => {
					return [...res.data];
				});
			});
		return () => {
			controller.abort();
		};
	}, []);
	// const services = [
	// 	{
	// 		servicetitle: 'Gst Services',
	// 		serviceId: 1,
	// 		serviceFeature: [
	// 			'GST Migrations and Registrations',
	// 			'Filing of GST Returns',
	// 			'GST Consultancy/Advisory on various issues of GST',
	// 			'Impact Analysis on Business Segments',
	// 		],
	// 		serviceIconLink: 'gst.png',
	// 	},
	// 	{
	// 		servicetitle: 'Accounting Services',
	// 		serviceId: 2,
	// 		serviceFeature: [
	// 			'Financial Reporting',
	// 			'Budgeting',
	// 			'Asset Accounting Management',
	// 			'MIS Reports',
	// 		],
	// 		serviceIconLink: 'accounting.png',
	// 	},
	// 	{
	// 		servicetitle: 'Payroll Services',
	// 		serviceId: 3,
	// 		serviceFeature: [
	// 			'Preparation of Monthly Salary Sheet',
	// 			'Deductions as per applicable laws like Income Tax and Provident Fund',
	// 			'Disbursement/ Online Payment of Salary',
	// 			'Pay slip by password protected e-mail',
	// 			'Reimbursement of telephone, medical bills etc',
	// 		],
	// 		serviceIconLink: 'government.png',
	// 	},
	// 	{
	// 		servicetitle: 'Incorporation Services',
	// 		serviceId: 4,
	// 		serviceFeature: [
	// 			'GST Migrations and Registrations',
	// 			'Filing of GST Returns',
	// 			'GST Consultancy/Advisory on various issues of GST',
	// 			'Impact Analysis on Business Segments',
	// 			'Impact Analysis on Business Segments',
	// 		],
	// 		serviceIconLink: 'company.png',
	// 	},
	// 	{
	// 		servicetitle: 'Incorporation Services',
	// 		serviceId: 4,
	// 		serviceFeature: [
	// 			'GST Migrations and Registrations',
	// 			'Filing of GST Returns',
	// 			'GST Consultancy/Advisory on various issues of GST',
	// 			'Impact Analysis on Business Segments',
	// 			'Impact Analysis on Business Segments',
	// 		],
	// 		serviceIconLink: 'company.png',
	// 	},
	// 	{
	// 		servicetitle: 'ITR Services',
	// 		serviceId: 4,
	// 		serviceFeature: [
	// 			'GST Migrations and Registrations',
	// 			'Filing of GST Returns',
	// 			'GST Consultancy/Advisory on various issues of GST',
	// 			'Impact Analysis on Business Segments',
	// 			'Impact Analysis on Business Segments',
	// 		],
	// 		serviceIconLink: 'itr-for-professionals.png',
	// 	},
	// ];

	return (
		<Layout>
			<BreadCrumbs pageName='Services' />
			<div className='container'>
				<div className='header'>
					<h1 className='text-center my-4'>Our Services</h1>
				</div>
				{services.length !== 0 ? (
					<ServiceCardLayout type='blog' services={services} />
				) : (
					<div className='row justify-content-center' key={uuid()}>
						<div className='col-lg-4 col-xxl-3 col-md-6 col-sm-9'>
							<Skeleton
								variant='rectangular'
								height={300}
								width={300}
								sx={{ borderRadius: 3, m: 3 }}
							/>
						</div>
						<div className='col-lg-4 col-xxl-3 col-md-6 col-sm-9'>
							<Skeleton
								variant='rectangular'
								height={300}
								width={300}
								sx={{ borderRadius: 3, m: 3 }}
							/>
						</div>
						<div className='col-lg-4 col-xxl-3 col-md-6 col-sm-9'>
							<Skeleton
								variant='rectangular'
								height={300}
								width={300}
								sx={{ borderRadius: 3, m: 3 }}
							/>
						</div>
						<div className='col-lg-4 col-xxl-3 col-md-6 col-sm-9'>
							<Skeleton
								variant='rectangular'
								height={300}
								width={300}
								sx={{ borderRadius: 3, m: 3 }}
							/>
						</div>
					</div>
				)}
			</div>

			{/* <div>{servicedata && servicedata.content}</div> */}
		</Layout>
	);
};
export const ServiceCard = props => {
	return (
		<div className='servicecard mx-auto rounded-2'>
			<div className='d-flex flex-column'>
				<h4 className='my-3'>{props.serviceTitle}</h4>
			</div>
			<ul className='d-flex flex-column'>
				{props.servicefeatureOverview.map((servicefeature, index) =>
					index <= 3 ? (
						<li key={index} className='d-flex justify-content-between'>
							<Link to={props.link}>{servicefeature}</Link>
						</li>
					) : (
						<Fragment key={index}></Fragment>
					)
				)}
				<li>
					<Link to={props.link}>{props.linkText}</Link>
					<span>
						<img src={require('./../img/arrow.png')} width={'15px'} alt='' />
					</span>
				</li>
			</ul>
		</div>
	);
};

export const ServiceCardLayout = ({ services, type }) => {
	return (
		<div className='row mb-4 justify-content-center'>
			{services &&
				
				services.map((service, index) => {
					return (
						<div className='col-lg-4 col-xxl-3 col-md-6 col-sm-9' key={uuid()}>
							<Fade in={true} timeout={Math.log(index + 2) * 1000}>
								<div>
									<ServiceCard
										servicefeatureOverview={JSON.parse(service.highlights)}
										serviceTitle={service.title}
										serviceId={service.id}
										link={
											type === 'blog'
												? `/service/${service.id}`
												: `/dashboard/services/${service.id}`
										}
										linkText={
											type === 'blog' ? 'Read more' : `Edit this service`
										}
									/>
								</div>
							</Fade>
						</div>
					);
				})}
		</div>
	);
};

export default Services;
