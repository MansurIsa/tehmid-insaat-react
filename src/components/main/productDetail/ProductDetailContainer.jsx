import React, { useState } from 'react'
import "./css/productDetail.css"
import { Link, useNavigate } from 'react-router-dom'
import { addProductToCart } from '../../../actions/productsAction/productsAction'
import { useDispatch } from 'react-redux'

const ProductDetailContainer = ({ productObj, userObj }) => {
    const accessToken = localStorage.getItem("accessToken")
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [openIndex, setOpenIndex] = useState(null)
    const [quantity, setQuantity] = useState(0)

    const toggleContent = (index) => {
        setOpenIndex(openIndex === index ? null : index)
    }

    const handleIncrement = () => setQuantity(prev => prev + 1)
    const handleDecrement = () => setQuantity(prev => prev > 0 ? prev - 1 : 0)
    const handleInputChange = (e) => {
        let value = e.target.value;

        // Rəqəmdən başqa bir şey daxil olunarsa, icazə vermə
        if (!/^\d*$/.test(value)) return;

        // Əgər boşdursa (backspace ilə silinibsə), sıfır et
        if (value === "") {
            setQuantity(0);
            return;
        }

        // Əgər başda 0 varsa (məs: 01, 007) → avtomatik təmizlə
        value = value.replace(/^0+/, '') || '0';

        setQuantity(parseInt(value, 10));
    };

    const handleInputBlur = () => {
        if (quantity === "" || quantity < 1) setQuantity(1)
    }

    const addToCart = () => {
        if (accessToken) {
            dispatch(addProductToCart({
                quantity: quantity,
                user: userObj?.id,
                product: productObj?.id
            }, navigate))
        } else {
            navigate("/login")
        }
    }

    return (
        <div className='product_detail_page project_container'>
            <div className="product_detail_page_paths">
                <Link to={'/products'}>Məhsullar</Link>
                / <p>{productObj?.name} {productObj?.degree}</p>
            </div>

            <div className="product_detail_container">
                <div className='product_detail_container_img'>
                    <img src={productObj?.image} alt="" />
                </div>

                <div className="product_detail_container_right">
                    <div className="product_detail_container_right_color">
                        <h1>{productObj?.name} {productObj?.degree}</h1>
                        {
                            accessToken && (
                                <span
                                    className={
                                        +productObj?.amount > 20
                                            ? 'filter_product_card_content_stock_green'
                                            : +productObj?.amount > 0 && +productObj?.amount < 21
                                                ? 'filter_product_card_content_stock_orange'
                                                : 'filter_product_card_content_stock_red'
                                    }
                                >
                                    {+productObj?.amount > 20
                                        ? 'Stokda var'
                                        : +productObj?.amount > 0 && +productObj?.amount < 21
                                            ? 'Stokda tükənir'
                                            : 'Stokda bitib'}
                                </span>
                            )
                        }
                    </div>

                    <div className='product_detail_container_right_cat'>
                        <div>
                            <h2>Kateqoriya</h2>
                            <p>{productObj?.category?.name}</p>
                        </div>
                        <div>
                            <h2>Marka</h2>
                            <p>{productObj?.brand?.name}</p>
                        </div>
                        <div>
                            <h2>Brend</h2>
                            <p>{productObj?.store?.name}</p>
                        </div>
                    </div>
                    <div className="article_pr_name">
                        Məhsul kodu:
                        <div className="article_grid">
                            {productObj?.articles?.map((x, i) => (
                                <span key={i}>{x?.name}</span>
                            ))}
                        </div>
                    </div>

                    <div className="product_detail_about_wrapper">
                        {productObj?.product_abouts?.map((item, index) => (
                            <div key={item.id} className="product_about_item">
                                <div className="product_about_title" onClick={() => toggleContent(index)}>
                                    <h3>{item.title}</h3>
                                </div>
                                {openIndex === index && (
                                    <div className="product_about_content about_html_content" dangerouslySetInnerHTML={{ __html: item.content }} />
                                )}
                            </div>
                        ))}
                    </div>
                    <div className='price_inc_dec_pr'>
                        {accessToken && (
                            <p className="product_detail_container_right_price">
                                {userObj?.status === "E" ? (
                                    <>
                                        <span
                                            style={{
                                                textDecoration: "line-through",
                                                color: "red",
                                                marginRight: "8px",
                                                fontSize: "14px"
                                            }}
                                        >
                                            {productObj?.price ?? 0} AZN
                                        </span>

                                        <span
                                            style={{
                                                color: "#000",
                                                fontWeight: "600",
                                                fontSize: "18px"
                                            }}
                                        >
                                            {productObj?.discount_price ?? 0} AZN
                                        </span>
                                    </>
                                ) : userObj?.status === "S" ? (
                                    <span>
                                        {productObj?.price ?? 0} AZN
                                    </span>
                                ) : null}
                            </p>

                        )}
                        <div className="inc_dec_pr">
                            <button type="button" onClick={handleDecrement}>-</button>
                            <input
                                type="text"
                                inputMode="numeric"
                                value={quantity}
                                onChange={handleInputChange}
                                onBlur={handleInputBlur}
                            />
                            <button type="button" onClick={handleIncrement}>+</button>
                            <button
                                type="button"
                                onClick={addToCart}
                                className='add_to_cart_pr'
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <circle cx="9" cy="21" r="1" />
                                    <circle cx="20" cy="21" r="1" />
                                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                                </svg>

                            </button>
                        </div>
                    </div>


                    {/* ➕➖ Say və səbətə əlavə hissəsi */}

                </div>
            </div>
        </div>
    )
}

export default ProductDetailContainer
