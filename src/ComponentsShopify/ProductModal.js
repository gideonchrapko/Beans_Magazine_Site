import React, { useState, useEffect } from 'react';
import { Container, Col, Row } from 'react-bootstrap'
import { useShopify } from "../hooks";
import ReactGA from 'react-ga';

import "../Styles/productModal.css"

export default (props) => {

    const {
        products,
		fetchProduct,
		openCart,
		checkoutState,
		addVariant,
	} = useShopify()

	useEffect(() => {
		ReactGA.initialize('UA-211860604-30');
	},[])

    const id = products[props.index] !== undefined ? products[props.index].id : "...Loading"
    const defaultSize = products[props.index] !== undefined ? products[props.index].variants[0].id.toString() : "...Loading"
    const [size, setSize] = useState("")
	const [quantity, setQuantity] = useState(1)
	const [imageIndex, setImageIndex ] = useState(0)
    const description = products[props.index] !== undefined ? products[props.index].description.split(".") : "...Loading"

    function changeSize(sizeId, quantity) {
		openCart()
		if (sizeId === "") {
			sizeId = defaultSize
			const lineItemsToAdd = [
				{ variantId: sizeId, quantity: parseInt(quantity, 10) },
			]
			const checkoutId = checkoutState.id
			addVariant(checkoutId, lineItemsToAdd)
		} else {
			const lineItemsToAdd = [
				{ variantId: sizeId, quantity: parseInt(quantity, 10) },
			]
			const checkoutId = checkoutState.id
			addVariant(checkoutId, lineItemsToAdd)
		}
	}

	useEffect(() => {
		if (id !== "...Loading"){
			fetchProduct(id)
		}
	}, [id])

	function GAEvent() {
		ReactGA.event({
			category: 'User',
			action: 'Add to Cart',
			label: `${products[props.index].title} added to cart`
		  });
	}

    return (
        <Container className="product-modal-background" >
			<Row style={{ height: "100%" }} >
				<Col lg={6} style={{ borderBottom: `${document.documentElement.clientWidth < 600 ? "solid 1px black" : ""}`}}>
					<div style={{ display: 'table', content: "", position: "relative" }} >
						<img 
							src={products[props.index].images[0] !== undefined ? products[props.index].images[imageIndex].src : ""}
							alt={`${products[props.index] !== undefined ? products[props.index].images[imageIndex].src : "...Loading"}`}
							className="prod-modal-product-image"
						/> 
					{ products[props.index].images.length > 1 ?
						<div>
							<img 
									src={products[props.index].images[0] !== undefined ? products[props.index].images[0].src : ""}
									alt={`${products[props.index].images[0] !== undefined ? products[props.index].images[0].src : ""}`}
									className="prod-modal-product-image-below"
									onClick={() => setImageIndex(0)}
								/> 
							<img 
									src={products[props.index].images[1] !== undefined ? products[props.index].images[1].src : ""}
									alt={`${products[props.index].images[1] !== undefined ? products[props.index].images[1].src : ""}`}
									className="prod-modal-product-image-below"
									onClick={() => setImageIndex(1)}
								/> 
							<img 
									src={products[props.index].images[2] !== undefined ? products[props.index].images[2].src : ""}
									alt={`${products[props.index].images[2] !== undefined ? products[props.index].images[2].src : ""}`}
									className="prod-modal-product-image-below"
									onClick={() => setImageIndex(2)}
								/> 
						</div>
						:
						<span></span>
					}
					</div>
				</Col>
				<Col lg={6} style={{ borderLeft: `${document.documentElement.clientWidth > 600 ? "solid 1px black" : ""}`, height: `${document.documentElement.clientWidth > 600 ? "100%" : "60%"}` }} >
					<div style={{ height: "70%" }}>
						<h1 className="prod-modal-title" >{products[props.index] !== undefined ? products[props.index].title : "...Loading"}</h1>
						<h1 className="prod-modal-price" >{`$${products[props.index] !== undefined ? products[props.index].variants[0].price : "...Loading"}`}</h1>
						<h5 className="prod-modal-description" >{description}</h5>
					</div>
					<div className="Product__info" style={{ padding: "10px" }}>
						<div style={{ marginBottom: "0px" }}>
							<select
								id="prodOptions"
								name={size}
								onChange={(e) => {
									setSize(e.target.value)
								}}
							>	
								{products[props.index] === undefined ?
									"...Loading"
									:
									products[props.index].variants.map((item, i) => {
										return (
											<option
											value={item.id.toString()}
											key={item.title + i}
										>{`${item.title}`}</option>
										)
									})
								}
							</select>
						</div>
						<div>
							<input
								className="quantity"
								type="number"
								min={1}
								value={quantity}
								onChange={(e) => {
									setQuantity(e.target.value)
								}}
							></input>
						</div>
						<div style={{ width: "100%", textAlign: "center"}}>
							<button
								className="prodBuy button"
								onClick={e => {
									changeSize(size, quantity)
									GAEvent()
								}}
							>
								ADD TO CART
							</button>
						</div>
					</div>
				</Col>      
			</Row> 
        </Container>
    )
}