import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addProductToCart } from "../../../actions/productsAction/productsAction";
import { getBasketItemList } from "../../../actions/basketAction/basketAction";

const FilterProductCard = ({ data, newPr }) => {
  const accessToken = localStorage.getItem("accessToken");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [quantity, setQuantity] = useState("0");
  const [error, setError] = useState("");

  const { userObj } = useSelector((state) => state.login);

  const isPiece = data?.unit === "piece";

  const addToCart = () => {
    if (!accessToken) {
      navigate("/login");
      return;
    }

    const qty = Number(quantity);

    if (!qty || qty <= 0) {
      setError("Miqdar 0-dan böyük olmalıdır!");
      return;
    }

    setError("");
    dispatch(
      addProductToCart(
        {
          quantity: qty,
          user: userObj?.id,
          product: data?.id,
        },
        navigate
      )
    );

    dispatch(getBasketItemList());
  };

  const handleIncrement = () => {
    const current = Number(quantity) || 0;
    setError("");

    if (isPiece) {
      setQuantity(String(current + 1));
    } else {
      setQuantity(String((current + 1).toFixed(2).replace(/\.00$/, "")));
    }
  };

  const handleDecrement = () => {
    const current = Number(quantity) || 0;
    setError("");

    if (current <= 0) {
      setQuantity("0");
      return;
    }

    if (isPiece) {
      setQuantity(String(Math.max(current - 1, 0)));
    } else {
      const value = Math.max(current - 1, 0);
      setQuantity(String(value.toFixed(2).replace(/\.00$/, "")));
    }
  };

  const handleInputChange = (e) => {
    let value = e.target.value.replace(",", ".");
    setError("");

    if (value === "") {
      setQuantity("");
      return;
    }

    if (isPiece) {
      if (!/^\d*$/.test(value)) {
        setError("Ədəd ilə satılan məhsullar üçün yalnız tam ədəd daxil edə bilərsiniz.");
        return;
      }

      value = value.replace(/^0+(?=\d)/, "");
      setQuantity(value);
    } else {
      if (!/^\d*\.?\d*$/.test(value)) return;

      value = value.replace(/^0+(?=\d)/, "");
      setQuantity(value);
    }
  };

  const goToDetail = () => {
    navigate(`/products/${data?.id}`);
  };

  return (
    <div className="filter_product_card">
      <div
        className="filter_product_card_top"
        onClick={goToDetail}
        style={{ cursor: "pointer" }}
      >
        {newPr && <div className="new_pr">Yeni</div>}

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

          <h3>{data?.name}</h3>

          <span className="article_pr_name">
            Məhsul kodu: {data?.article_names?.[0] || "—"}
          </span>

          <div>
            {accessToken && userObj?.status === "S" && (
              <span>{data?.price} AZN</span>
            )}

            {accessToken && userObj?.status === "E" && (
              <>
                <span
                  style={{
                    textDecoration: "line-through",
                    color: "red",
                  }}
                >
                  {data?.price} AZN
                </span>

                <span>{data?.discount_price} AZN</span>
              </>
            )}
          </div>
        </div>
      </div>

      <p className="filter_product_card_content">
        Ölçü vahidi:
        <span
          style={{
            fontWeight: "bold",
            color: "var(--red)",
          }}
        >
          {" "}
          {data?.unit === "piece"
            ? "ədəd"
            : data?.unit === "kg"
            ? "kiloqram"
            : data?.unit === "metre"
            ? "metr"
            : ""}
        </span>
      </p>

      <div className="inc_dec_pr">
        <button type="button" onClick={handleDecrement}>
          -
        </button>

        <input
          type="text"
          inputMode="decimal"
          value={quantity}
          onChange={handleInputChange}
          style={{
            borderColor: error ? "red" : undefined,
          }}
        />

        <button type="button" onClick={handleIncrement}>
          +
        </button>

        <button
          type="button"
          onClick={addToCart}
          className="add_to_cart_pr"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            stroke="black"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
        </button>
      </div>

      {/* Xəta mesajı */}
      {error && (
        <div
          style={{
            color: "red",
            fontSize: "12px",
            marginTop: "6px",
            textAlign: "center",
            backgroundColor: "#fff0f0",
            padding: "6px 10px",
            borderRadius: "4px",
            border: "1px solid #ffcccc",
          }}
        >
          ⚠️ {error}
        </div>
      )}
    </div>
  );
};

export default React.memo(FilterProductCard);