import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addProductToCart } from "../../../actions/productsAction/productsAction";
import { getBasketItemList } from "../../../actions/basketAction/basketAction";

const FilterProductCard = ({ data, newPr }) => {
  const accessToken = localStorage.getItem("accessToken");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(0);

  const { userObj } = useSelector((state) => state.login);

  const addToCart = () => {
    if (accessToken) {
      if (quantity <= 0) return; // boş səbətə əlavə etmə
      dispatch(
        addProductToCart(
          {
            quantity,
            user: userObj?.id,
            product: data?.id,
          },
          navigate
        )
      );
      dispatch(getBasketItemList());
    } else {
      navigate("/login");
    }
  };

  const handleIncrement = () => setQuantity((prev) => prev + 1);
  const handleDecrement = () => setQuantity((prev) => (prev > 0 ? prev - 1 : 0));
  const handleInputChange = (e) => {
    let value = e.target.value;

    // Rəqəmdən başqa şey olmaz
    if (!/^\d*$/.test(value)) return;

    if (value === "") {
      setQuantity(0);
      return;
    }

    value = value.replace(/^0+/, "") || "0";

    setQuantity(parseInt(value, 10));
  };

  const goToDetail = () => {
    navigate(`/products/${data?.id}`);
  };

  console.log(data);
  
  return (
    <div className="filter_product_card">
      {/* Click ilə açılan hissə */}
      <div
        className="filter_product_card_top"
        onClick={goToDetail}
        style={{ cursor: "pointer" }}
      >
        {
          newPr ?
            <div className="new_pr">
              Yeni
            </div> : null
        }

        <img src={data?.image} alt={data?.name} loading="lazy" />
        <div className="filter_product_card_content">
          {accessToken && (
            <span
              className={
                +data?.amount > 20
                  ? "filter_product_card_content_stock_green"
                  : +data?.amount > 0 && +data?.amount < 21
                    ? "filter_product_card_content_stock_orange"
                    : "filter_product_card_content_stock_red"
              }
            >
              {+data?.amount > 20
                ? "Stokda var"
                : +data?.amount > 0 && +data?.amount < 21
                  ? "Stokda tükənir"
                  : "Stokda bitib"}
            </span>
          )}

          <h3>{data?.name} {data?.degree}</h3>
          <p>{data?.brand_name}</p>
          <span className="article_pr_name">
            Məhsul kodu: {data?.article_names[0]}
          </span>

          <div>
            {accessToken && userObj?.status === "S" && <span>{data?.price} AZN</span>}

            {accessToken && userObj?.status === "E" && (
              <>
                <span style={{textDecoration: "line-through", color: "red"}}>{data?.price} AZN</span>
                <span>{data?.discount_price} AZN</span>
              </>

            )}
          </div>
        </div>
      </div>

      {/* Say və səbətə əlavə hissəsi */}
      <div className="inc_dec_pr">
        <button type="button" onClick={handleDecrement}>
          -
        </button>
        <input
          type="text"
          inputMode="numeric"
          value={quantity}
          onChange={handleInputChange}
        />

        <button type="button" onClick={handleIncrement}>
          +
        </button>
        <button type="button" onClick={addToCart} className="add_to_cart_pr">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
        </button>

      </div>
    </div>
  );
};

export default React.memo(FilterProductCard);
