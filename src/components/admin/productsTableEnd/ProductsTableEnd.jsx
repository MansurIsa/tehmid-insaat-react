import React from 'react';
import { AiTwotoneDelete } from 'react-icons/ai';
import { FaPenToSquare } from 'react-icons/fa6';
import { useDispatch } from 'react-redux';
import { productsDeleteModalFunc, setUpdateProductsObjFunc } from '../../../redux/slices/admin/productTableSlice';
import { useNavigate } from 'react-router-dom';

const ProductsTableEnd = ({ productsList }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const currencyMap = { D: "$", M: "₼", R: "₽" };

    const deleteProducts = (id) => dispatch(productsDeleteModalFunc(id));

    const updateProducts = (item) => {
        dispatch(setUpdateProductsObjFunc(item));
        navigate("/update-new-products");
    };

    console.log(productsList);


    return (
        <div className="admin_container">
            <div className=' table_wrapper'>
                <table className='custom_table'>
                    <thead>
                        <tr>
                            <th>Məhsul Adı</th>
                            <th>Artikl</th>
                            <th>Brend</th>
                            <th>Miqdar</th>
                            <th>Maya Dəyəri</th>
                            <th>Alış Qiyməti</th>
                            <th>Satış Qiyməti</th>
                            <th>Endirimli Qiymət</th>
                            <th>Düzəliş/Sil</th>
                        </tr>
                    </thead>

                    <tbody>
                        {productsList?.map((item, index) => (
                            <tr key={index}>
                                <td>{item?.name || "-"} {item?.degree || ""}</td>
                                <td className='table_article_scroll'>
                                    {item?.articles?.map(a => a.name).join(', ') || "-"}
                                </td>
                                <td>{item?.store?.name || "-"}</td>
                                <td>{item?.amount || "-"}</td>
                                <td>{item?.cost_price ? item.cost_price + " ₼" : "-"}</td>
                                <td>{item?.purchase_price} {currencyMap[item?.currency] || ""}</td>
                                <td>{item?.price ? item.price + " ₼" : "-"}</td>
                                <td>{item?.discount_price ? item.discount_price + " ₼" : "-"}</td>
                                <td className='table_update'>
                                    <FaPenToSquare onClick={() => updateProducts(item)} />
                                    <AiTwotoneDelete onClick={() => deleteProducts(item?.id)} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

    );
};

export default ProductsTableEnd;
